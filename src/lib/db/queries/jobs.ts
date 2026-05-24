import { and, desc, eq } from 'drizzle-orm'
import { getDb } from '@/lib/db'
import { jobOffers, members } from '@/lib/db/schema'

export async function getPublishedJobs() {
  const db = getDb()
  return db
    .select({
      id: jobOffers.id,
      slug: jobOffers.slug,
      title: jobOffers.title,
      location: jobOffers.location,
      contractType: jobOffers.contractType,
      salary: jobOffers.salary,
      publishedAt: jobOffers.publishedAt,
      memberName: members.name,
      memberSlug: members.slug,
    })
    .from(jobOffers)
    .leftJoin(members, eq(jobOffers.memberId, members.id))
    .where(eq(jobOffers.status, 'published'))
    .orderBy(desc(jobOffers.publishedAt))
}

export async function getJobBySlug(slug: string) {
  const db = getDb()
  const rows = await db
    .select({
      id: jobOffers.id,
      slug: jobOffers.slug,
      title: jobOffers.title,
      description: jobOffers.description,
      location: jobOffers.location,
      contractType: jobOffers.contractType,
      salary: jobOffers.salary,
      applicationUrl: jobOffers.applicationUrl,
      applicationEmail: jobOffers.applicationEmail,
      publishedAt: jobOffers.publishedAt,
      expiresAt: jobOffers.expiresAt,
      metaDescription: jobOffers.metaDescription,
      memberName: members.name,
      memberSlug: members.slug,
    })
    .from(jobOffers)
    .leftJoin(members, eq(jobOffers.memberId, members.id))
    .where(and(eq(jobOffers.slug, slug), eq(jobOffers.status, 'published')))
    .limit(1)
  return rows[0] ?? null
}
