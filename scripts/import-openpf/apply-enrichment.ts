/**
 * Step 5 — Apply enrichment from import to the Neon DB
 *
 * NON-DESTRUCTIVE: fills NULL fields only, never overwrites existing data.
 * Creates member contacts only if the member has none.
 * Creates member_activities only for domains not yet linked.
 * Facebook URLs are skipped (no column in schema — see gap report).
 *
 * Run: pnpm import:openpf:apply
 */

/* eslint-disable no-console */
import { readFileSync } from 'fs'
import path from 'path'
import { and, eq, isNull, or, inArray } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/neon-http'
import { neon } from '@neondatabase/serverless'
import * as schema from '../../src/lib/db/schema'
import type { CleanMemberProfile } from './lib/types'

const { members, memberContacts, memberActivities } = schema

// ─── Domain label → DB domain ID mapping ─────────────────────────────────────
// Based on ACTUAL activity_domains IDs in the live DB (verified 2026-05-22).
// The merge plan (openpf-members-merge-plan.json) already has these correct IDs.
const DOMAIN_LABEL_MAP: Record<string, string | null> = {
  'admin / réseaux / systéme': 'infrastructure',
  'amo /ami': 'transformation-digitale',
  'application': 'web-mobile',
  'association': 'autre',
  'audit': 'audit',
  'autre': 'autre',
  'banque - finance': 'services-finances',
  'commerce et services en ligne': 'web-mobile',
  'communication digitale': 'marketing-digital',
  'conseil / expertise': 'audit',
  'crm / epm / dms / pim': 'developpement',
  'developpement logiciels': 'developpement',
  'distribution et intégration': 'distribution',
  'droit spécialisé': 'rgpd',
  'edition de logiciels': 'developpement',
  'fai': 'telecom',
  'hébergement / stockage /cloud': 'cloud',
  'ia&data': 'ia',
  'iot': 'objets-connectes',
  'normes /cybersécurité': 'cybersecurite',
  'organisme de formation / formateur': 'formation',
  'plateforme de financement participatif': 'services-finances',
  'sav': 'distribution',
  'sites & applis web': 'web-mobile',
  'télécom et voix sur ip': 'telecom',
  'vente de matériels informatique et audiovisuel': 'distribution',
  'écrans multimédias': 'media-numerique',
}

function mapDomainLabel(raw: string): string | null {
  return DOMAIN_LABEL_MAP[raw.trim().toLowerCase()] ?? null
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const databaseUrl = process.env['DATABASE_URL']
  if (!databaseUrl) throw new Error('DATABASE_URL is required')

  const sql = neon(databaseUrl)
  const db = drizzle(sql, { schema })

  const DATA_DIR = path.resolve(process.cwd(), 'data/import')
  const profiles: CleanMemberProfile[] = JSON.parse(
    readFileSync(path.join(DATA_DIR, 'openpf-members-clean.json'), 'utf-8'),
  )

  console.log(`\n🚀  Applying enrichment for ${profiles.length} profiles…\n`)

  let membersUpdated = 0
  let contactsCreated = 0
  let activitiesCreated = 0
  let skippedUnmatched = 0
  const unmappedDomainLabels = new Set<string>()

  for (const profile of profiles) {
    if (!profile.extractionSuccess) {
      console.log(`  ⚠  ${profile.slug}: extraction failed, skipping`)
      skippedUnmatched++
      continue
    }

    // ── 1. Find member by slug ─────────────────────────────────────────────
    const [member] = await db
      .select({ id: members.id, slug: members.slug, description: members.description, websiteUrl: members.websiteUrl, address: members.address, linkedinUrl: members.linkedinUrl })
      .from(members)
      .where(eq(members.slug, profile.slug))
      .limit(1)

    if (!member) {
      console.log(`  ✗  ${profile.slug}: no DB record, skipping`)
      skippedUnmatched++
      continue
    }

    // ── 2. Update members — fill NULL fields only ──────────────────────────
    const patch: Partial<typeof schema.members.$inferInsert> = {}

    if (!member.description && profile.presentation) {
      patch.description = profile.presentation
    }
    if (!member.websiteUrl && profile.website) {
      patch.websiteUrl = profile.website
    }
    if (!member.address && profile.address) {
      patch.address = profile.address
    }
    if (!member.linkedinUrl && profile.socialLinks?.linkedin) {
      patch.linkedinUrl = profile.socialLinks.linkedin
    }

    if (Object.keys(patch).length > 0) {
      await db.update(members).set(patch).where(eq(members.id, member.id))
      membersUpdated++
      const fields = Object.keys(patch).join(', ')
      console.log(`  ✓  ${profile.slug}: updated ${fields}`)
    }

    // ── 3. Insert primary contact if none exists ───────────────────────────
    if (profile.contactName || profile.email) {
      const existingContacts = await db
        .select({ id: memberContacts.id })
        .from(memberContacts)
        .where(eq(memberContacts.memberId, member.id))
        .limit(1)

      if (existingContacts.length === 0 && profile.email) {
        await db.insert(memberContacts).values({
          memberId: member.id,
          name: profile.contactName ?? profile.email,
          role: null,
          email: profile.email,
          phone: profile.phone ?? null,
          isPrimary: true,
        })
        contactsCreated++
      }
    }

    // ── 4. Insert member activities (domains) ──────────────────────────────
    if (profile.domains.length > 0) {
      const existingActivities = await db
        .select({ domainId: memberActivities.domainId })
        .from(memberActivities)
        .where(eq(memberActivities.memberId, member.id))

      const alreadyLinked = new Set(existingActivities.map((a) => a.domainId))

      for (const rawLabel of profile.domains) {
        const domainId = mapDomainLabel(rawLabel)
        if (!domainId) {
          unmappedDomainLabels.add(rawLabel.trim())
          continue
        }
        if (alreadyLinked.has(domainId)) continue
        try {
          await db.insert(memberActivities).values({ memberId: member.id, domainId })
          alreadyLinked.add(domainId)
          activitiesCreated++
        } catch {
          // PK conflict if race condition — safe to ignore
        }
      }
    }
  }

  // ── Summary ──────────────────────────────────────────────────────────────
  console.log('\n─────────────────────────────────────────')
  console.log('✅  Enrichment complete')
  console.log(`   Members updated:    ${membersUpdated}`)
  console.log(`   Contacts created:   ${contactsCreated}`)
  console.log(`   Activities created: ${activitiesCreated}`)
  console.log(`   Unmatched skipped:  ${skippedUnmatched}`)

  if (unmappedDomainLabels.size > 0) {
    console.log(`\n⚠  Unmapped domain labels (${unmappedDomainLabels.size}) — see gap report:`)
    for (const l of unmappedDomainLabels) console.log(`     "${l}"`)
  }
  console.log('─────────────────────────────────────────\n')
}

main().catch((err) => {
  console.error('Apply enrichment failed:', err)
  process.exit(1)
})
