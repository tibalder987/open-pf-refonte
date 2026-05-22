import { and, asc, eq, isNotNull, ne } from 'drizzle-orm'
import { getDb } from '@/lib/db'
import { activityDomains, memberActivities, members } from '@/lib/db/schema'

export async function getActiveMembers() {
  const db = getDb()
  return db
    .select({
      id: members.id,
      slug: members.slug,
      name: members.name,
      logoUrl: members.logoUrl,
      description: members.description,
      websiteUrl: members.websiteUrl,
    })
    .from(members)
    .where(eq(members.status, 'active'))
    .orderBy(asc(members.name))
}

export async function getFeaturedMembers(limit = 12) {
  const db = getDb()
  return db
    .select({
      id: members.id,
      slug: members.slug,
      name: members.name,
      logoUrl: members.logoUrl,
    })
    .from(members)
    .where(and(eq(members.status, 'active'), isNotNull(members.logoUrl)))
    .orderBy(asc(members.name))
    .limit(limit)
}

export async function getMemberBySlug(slug: string) {
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
      yearFounded: members.yearFounded,
      employeeCount: members.employeeCount,
      linkedinUrl: members.linkedinUrl,
    })
    .from(members)
    .where(and(eq(members.slug, slug), eq(members.status, 'active')))
    .limit(1)
  return rows[0] ?? null
}

export async function getMemberDomains(memberId: string): Promise<string[]> {
  const db = getDb()
  const rows = await db
    .select({ label: activityDomains.label })
    .from(memberActivities)
    .innerJoin(activityDomains, eq(memberActivities.domainId, activityDomains.id))
    .where(eq(memberActivities.memberId, memberId))
  return rows.map((r) => r.label)
}

export async function getOtherActiveMembers(excludeSlug: string, limit = 3) {
  const db = getDb()
  return db
    .select({
      id: members.id,
      slug: members.slug,
      name: members.name,
      logoUrl: members.logoUrl,
      description: members.description,
    })
    .from(members)
    .where(and(eq(members.status, 'active'), ne(members.slug, excludeSlug)))
    .orderBy(asc(members.name))
    .limit(limit)
}
