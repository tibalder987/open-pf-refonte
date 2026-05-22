'use server'

import { eq } from 'drizzle-orm'
import { getDb } from '@/lib/db'
import { members, memberContacts, memberActivities, memberCertifications } from '@/lib/db/schema'
import { adhesionSchema } from '@/lib/validations/adhesion'
import { toSlug } from '@/lib/utils'

async function generateUniqueSlug(db: ReturnType<typeof getDb>, base: string): Promise<string> {
  let slug = base
  let attempt = 0
  while (attempt < 20) {
    const existing = await db
      .select({ id: members.id })
      .from(members)
      .where(eq(members.slug, slug))
      .limit(1)
    if (existing.length === 0) return slug
    attempt++
    slug = `${base}-${attempt}`
  }
  return `${base}-${Date.now()}`
}

type SubmitResult =
  | { success: true; slug: string }
  | { success: false; errors: Record<string, string[]> }

export async function submitAdhesion(raw: unknown): Promise<SubmitResult> {
  const parsed = adhesionSchema.safeParse(raw)
  if (!parsed.success) {
    const errors: Record<string, string[]> = {}
    for (const [key, issues] of Object.entries(parsed.error.flatten().fieldErrors)) {
      errors[key] = issues ?? []
    }
    return { success: false, errors }
  }

  const data = parsed.data
  const db = getDb()
  const baseSlug = toSlug(data.name)
  const slug = await generateUniqueSlug(db, baseSlug)

  // neon-http driver does not support transactions — sequential inserts
  const [member] = await db
    .insert(members)
    .values({
      slug,
      name: data.name,
      legalStatusId: null,
      tahitiNumber: data.tahitiNumber ?? null,
      websiteUrl: data.websiteUrl ?? null,
      description: data.description ?? null,
      yearFounded: data.yearFounded ?? null,
      employeeCount: data.employeeCount ?? null,
      isMedefMember: data.isMedefMember,
      status: 'submitted',
      submittedAt: new Date(),
    })
    .returning({ id: members.id })

  if (!member) throw new Error('Member insert failed')

  if (data.contacts.length > 0) {
    await db.insert(memberContacts).values(
      data.contacts.map((c) => ({
        memberId: member.id,
        name: c.name,
        role: c.role ?? null,
        email: c.email,
        phone: c.phone ?? null,
        isPrimary: c.isPrimary,
      })),
    )
  }

  if (data.activityDomains.length > 0) {
    await db.insert(memberActivities).values(
      data.activityDomains.map((domainId) => ({
        memberId: member.id,
        domainId,
      })),
    )
  }

  if (data.certifications.length > 0) {
    await db.insert(memberCertifications).values(
      data.certifications.map((certificationId) => ({
        memberId: member.id,
        certificationId,
        otherLabel: null,
      })),
    )
  }

  return { success: true, slug }
}
