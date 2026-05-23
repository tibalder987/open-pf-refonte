/**
 * Step 3 — Compare extracted profiles against the Neon DB (READ-ONLY).
 *
 * Input:  data/import/openpf-members-clean.json
 * Output: data/import/openpf-members-merge-plan.json
 *
 * Run: pnpm import:openpf:compare
 *
 * IMPORTANT: This script never writes to the database.
 */

import { readFileSync, writeFileSync } from 'fs'
import path from 'path'
import { asc, eq } from 'drizzle-orm'
import { getDb } from '@/lib/db'
import { activityDomains, memberContacts, members } from '@/lib/db/schema'
import { mapDomain, normalizeText, normalizeDomainLabel } from './lib/utils'
import type {
  CleanMemberProfile,
  DbContactRow,
  DbDomainRow,
  DbMemberRow,
  FieldConflict,
  FieldToFill,
  MatchInfo,
  MergePlan,
  MergePlanEntry,
} from './lib/types'

const DATA_DIR = path.resolve(process.cwd(), 'data/import')
const CLEAN_FILE = path.join(DATA_DIR, 'openpf-members-clean.json')
const PLAN_FILE = path.join(DATA_DIR, 'openpf-members-merge-plan.json')

// ─── DB read helpers ──────────────────────────────────────────────────────────

async function loadDbMembers(): Promise<DbMemberRow[]> {
  const db = getDb()
  const rows = await db
    .select({
      id: members.id,
      slug: members.slug,
      name: members.name,
      logoUrl: members.logoUrl,
      description: members.description,
      websiteUrl: members.websiteUrl,
      address: members.address,
      linkedinUrl: members.linkedinUrl,
      tahitiNumber: members.tahitiNumber,
    })
    .from(members)
    .orderBy(asc(members.name))
  return rows
}

async function loadDbContacts(): Promise<DbContactRow[]> {
  const db = getDb()
  const rows = await db
    .select({
      memberId: memberContacts.memberId,
      email: memberContacts.email,
      phone: memberContacts.phone,
      name: memberContacts.name,
    })
    .from(memberContacts)
  return rows
}

async function loadDbDomains(): Promise<DbDomainRow[]> {
  const db = getDb()
  const rows = await db
    .select({ id: activityDomains.id, label: activityDomains.label })
    .from(activityDomains)
    .orderBy(asc(activityDomains.sortOrder))
  return rows
}

// ─── Matching logic ───────────────────────────────────────────────────────────

function normalizeWebsite(url: string | null | undefined): string | null {
  if (!url) return null
  return url
    .toLowerCase()
    .replace(/\/+$/, '')
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
}

function matchMember(
  profile: CleanMemberProfile,
  dbMembers: DbMemberRow[],
  dbContacts: DbContactRow[],
): { member: DbMemberRow | null; matchedBy: MatchInfo['matchedBy'] } {
  // 1. Slug match
  const bySlug = dbMembers.find((m) => m.slug === profile.slug)
  if (bySlug) return { member: bySlug, matchedBy: 'slug' }

  // 2. Normalized name match
  if (profile.nameNormalized) {
    const byName = dbMembers.find(
      (m) => m.name.toLowerCase().trim() === profile.nameNormalized,
    )
    if (byName) return { member: byName, matchedBy: 'name' }
  }

  // 3. Email match (via memberContacts)
  if (profile.emailNormalized) {
    const contactRow = dbContacts.find(
      (c) => c.email.toLowerCase().trim() === profile.emailNormalized,
    )
    if (contactRow) {
      const byEmail = dbMembers.find((m) => m.id === contactRow.memberId)
      if (byEmail) return { member: byEmail, matchedBy: 'email' }
    }
  }

  // 4. Website match (normalized)
  if (profile.websiteNormalized) {
    const byWebsite = dbMembers.find(
      (m) => normalizeWebsite(m.websiteUrl) === profile.websiteNormalized,
    )
    if (byWebsite) return { member: byWebsite, matchedBy: 'website' }
  }

  return { member: null, matchedBy: null }
}

// ─── Merge plan builder ───────────────────────────────────────────────────────

function buildMergeEntry(
  profile: CleanMemberProfile,
  dbMembers: DbMemberRow[],
  dbContacts: DbContactRow[],
  dbDomains: DbDomainRow[],
): MergePlanEntry {
  const domainLabels = dbDomains.map((d) => d.label)

  // Map domains
  const mappedDomains = profile.domains.map((sourceLabel) => {
    const result = mapDomain(sourceLabel, domainLabels)
    // Find the domain ID from the matched label
    let domainId: string | null = null
    if (result.mapped) {
      const found = dbDomains.find(
        (d) => normalizeDomainLabel(d.label).toLowerCase() === normalizeDomainLabel(result.mapped!).toLowerCase(),
      )
      domainId = found?.id ?? null
    }
    return { sourceLabel, domainId, exact: result.exact }
  })

  // Failed extraction
  if (!profile.extractionSuccess) {
    return {
      sourceUrl: profile.sourceUrl,
      slug: profile.slug,
      sourceName: null,
      action: 'failed',
      matchInfo: { matchedBy: null, dbId: null, dbSlug: null, dbName: null },
      fieldsToFill: [],
      conflicts: [],
      needsReview: false,
      mappedDomains,
      reason: `Extraction failed: ${profile.extractionError ?? 'unknown error'}`,
    }
  }

  const { member: dbMember, matchedBy } = matchMember(profile, dbMembers, dbContacts)

  const matchInfo: MatchInfo = {
    matchedBy,
    dbId: dbMember?.id ?? null,
    dbSlug: dbMember?.slug ?? null,
    dbName: dbMember?.name ?? null,
  }

  // No match → create
  if (!dbMember) {
    return {
      sourceUrl: profile.sourceUrl,
      slug: profile.slug,
      sourceName: profile.name,
      action: 'create',
      matchInfo,
      fieldsToFill: [],
      conflicts: [],
      needsReview: true,
      mappedDomains,
      reason: 'No matching member found in DB — needs admin review before import',
    }
  }

  // Match found → compute fields to fill + conflicts
  const fieldsToFill: FieldToFill[] = []
  const conflicts: FieldConflict[] = []

  const checkField = (
    field: string,
    dbValue: string | null | undefined,
    sourceValue: string | null | undefined,
  ): void => {
    const dbV = dbValue?.trim() ?? null
    const srcV = sourceValue?.trim() ?? null
    if (!srcV) return // nothing to fill
    if (!dbV) {
      fieldsToFill.push({ field, value: srcV })
    } else if (dbV !== srcV) {
      conflicts.push({ field, sourceValue: srcV, dbValue: dbV })
    }
  }

  checkField('logoUrl', dbMember.logoUrl, profile.logoUrl)
  checkField('description', dbMember.description, profile.presentation)
  checkField('websiteUrl', dbMember.websiteUrl, profile.website)
  checkField('address', dbMember.address, profile.address)
  checkField('linkedinUrl', dbMember.linkedinUrl, profile.socialLinks.linkedin)

  const needsReview = conflicts.length > 0 || mappedDomains.some((d) => !d.domainId)

  return {
    sourceUrl: profile.sourceUrl,
    slug: profile.slug,
    sourceName: profile.name,
    action: 'update',
    matchInfo,
    fieldsToFill,
    conflicts,
    needsReview,
    mappedDomains,
    reason:
      conflicts.length > 0
        ? `Matched by ${matchedBy} — ${conflicts.length} conflict(s) require review`
        : fieldsToFill.length > 0
          ? `Matched by ${matchedBy} — ${fieldsToFill.length} empty field(s) can be filled`
          : `Matched by ${matchedBy} — no changes needed`,
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  console.log('=== OPEN PF — Compare Members (DRY-RUN, READ-ONLY) ===\n')

  const cleanProfiles = JSON.parse(
    readFileSync(CLEAN_FILE, 'utf-8'),
  ) as CleanMemberProfile[]
  console.log(`Loaded ${cleanProfiles.length} profiles from ${CLEAN_FILE}`)

  console.log('Loading DB data...')
  const [dbMembers, dbContacts, dbDomains] = await Promise.all([
    loadDbMembers(),
    loadDbContacts(),
    loadDbDomains(),
  ])
  console.log(`  DB members:  ${dbMembers.length}`)
  console.log(`  DB contacts: ${dbContacts.length}`)
  console.log(`  DB domains:  ${dbDomains.length}`)
  console.log()

  const entries = cleanProfiles.map((profile) =>
    buildMergeEntry(profile, dbMembers, dbContacts, dbDomains),
  )

  const updates = entries.filter((e) => e.action === 'update')
  const creates = entries.filter((e) => e.action === 'create')
  const skipped = entries.filter((e) => e.action === 'skip')
  const failed = entries.filter((e) => e.action === 'failed')

  // Collect unmapped domains
  const unmappedSet = new Set<string>()
  for (const entry of entries) {
    for (const d of entry.mappedDomains) {
      if (!d.domainId) unmappedSet.add(d.sourceLabel)
    }
  }
  const unmappedDomains = [...unmappedSet].sort()

  const plan: MergePlan = {
    generatedAt: new Date().toISOString(),
    sourceFile: CLEAN_FILE,
    totalProfiles: cleanProfiles.length,
    updates,
    creates,
    skipped,
    failed,
    unmappedDomains,
  }

  writeFileSync(PLAN_FILE, JSON.stringify(plan, null, 2), 'utf-8')

  console.log('=== Merge Plan Summary ===')
  console.log(`Total:        ${cleanProfiles.length}`)
  console.log(`Updates:      ${updates.length}  (${updates.filter((e) => e.needsReview).length} need review)`)
  console.log(`Creates:      ${creates.length}  (all need review)`)
  console.log(`Skipped:      ${skipped.length}`)
  console.log(`Failed:       ${failed.length}`)
  console.log(`Unmapped domains: ${unmappedDomains.length}`)
  if (unmappedDomains.length > 0) {
    console.log('  ' + unmappedDomains.join('\n  '))
  }
  console.log(`\nWritten to: ${PLAN_FILE}`)
}

main().catch((err: unknown) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
