'use server'

import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { getDb } from '@/lib/db'
import { news, jobOffers } from '@/lib/db/schema'
import { auth } from '@/lib/auth/session'
import { toSlug } from '@/lib/utils'

async function requireAdmin() {
  const session = await auth()
  if (!session?.user?.id) throw new Error('Non autorisé')
  return session.user.id
}

// ─── News ──────────────────────────────────────────────────────────────────

const newsSchema = z.object({
  title: z.string().min(1, 'Titre requis'),
  excerpt: z.string().optional().or(z.literal('')),
  content: z.string().optional().or(z.literal('')),
  categoryId: z.string().uuid().optional().or(z.literal('')),
  authorName: z.string().optional().or(z.literal('')),
  imageUrl: z.string().url().optional().or(z.literal('')),
  metaDescription: z.string().max(160).optional().or(z.literal('')),
  status: z.enum(['draft', 'published']),
})

export async function upsertNews(
  raw: unknown,
  id?: string,
): Promise<{ success: boolean; id?: string; error?: string }> {
  await requireAdmin()
  const parsed = newsSchema.safeParse(raw)
  if (!parsed.success) return { success: false, error: 'Données invalides' }

  const data = parsed.data
  const db = getDb()

  if (id) {
    await db
      .update(news)
      .set({
        title: data.title,
        excerpt: data.excerpt ?? null,
        content: data.content ?? null,
        categoryId: data.categoryId || null,
        authorName: data.authorName ?? null,
        imageUrl: data.imageUrl ?? null,
        metaDescription: data.metaDescription ?? null,
        status: data.status,
        publishedAt: data.status === 'published' ? new Date() : null,
        updatedAt: new Date(),
      })
      .where(eq(news.id, id))
    revalidatePath('/admin/actualites')
    revalidatePath('/actualites')
    return { success: true, id }
  }

  const slug = toSlug(data.title)
  const [inserted] = await db
    .insert(news)
    .values({
      slug,
      title: data.title,
      excerpt: data.excerpt ?? null,
      content: data.content ?? null,
      categoryId: data.categoryId || null,
      authorName: data.authorName ?? null,
      imageUrl: data.imageUrl ?? null,
      metaDescription: data.metaDescription ?? null,
      status: data.status,
      publishedAt: data.status === 'published' ? new Date() : null,
    })
    .returning({ id: news.id })

  revalidatePath('/admin/actualites')
  revalidatePath('/actualites')
  return { success: true, ...(inserted?.id ? { id: inserted.id } : {}) }
}

export async function deleteNews(id: string): Promise<{ success: boolean }> {
  await requireAdmin()
  const db = getDb()
  await db.delete(news).where(eq(news.id, id))
  revalidatePath('/admin/actualites')
  revalidatePath('/actualites')
  return { success: true }
}

// ─── Job offers ────────────────────────────────────────────────────────────

const jobSchema = z.object({
  title: z.string().min(1, 'Titre requis'),
  description: z.string().optional().or(z.literal('')),
  location: z.string().optional().or(z.literal('')),
  contractType: z.string().optional().or(z.literal('')),
  salary: z.string().optional().or(z.literal('')),
  applicationUrl: z.string().url().optional().or(z.literal('')),
  applicationEmail: z.string().email().optional().or(z.literal('')),
  memberId: z.string().uuid().optional().or(z.literal('')),
  status: z.enum(['draft', 'published', 'closed']),
})

export async function upsertJob(
  raw: unknown,
  id?: string,
): Promise<{ success: boolean; id?: string; error?: string }> {
  await requireAdmin()
  const parsed = jobSchema.safeParse(raw)
  if (!parsed.success) return { success: false, error: 'Données invalides' }

  const data = parsed.data
  const db = getDb()

  const values = {
    title: data.title,
    description: data.description ?? null,
    location: data.location ?? null,
    contractType: data.contractType ?? null,
    salary: data.salary ?? null,
    applicationUrl: data.applicationUrl ?? null,
    applicationEmail: data.applicationEmail ?? null,
    memberId: data.memberId || null,
    status: data.status,
    publishedAt: data.status === 'published' ? new Date() : null,
    updatedAt: new Date(),
  }

  if (id) {
    await db.update(jobOffers).set(values).where(eq(jobOffers.id, id))
    revalidatePath('/admin/offres-emploi')
    return { success: true, id }
  }

  const slug = toSlug(data.title) + '-' + Date.now()
  const [inserted] = await db
    .insert(jobOffers)
    .values({ ...values, slug })
    .returning({ id: jobOffers.id })

  revalidatePath('/admin/offres-emploi')
  return { success: true, ...(inserted?.id ? { id: inserted.id } : {}) }
}

export async function deleteJob(id: string): Promise<{ success: boolean }> {
  await requireAdmin()
  const db = getDb()
  await db.delete(jobOffers).where(eq(jobOffers.id, id))
  revalidatePath('/admin/offres-emploi')
  return { success: true }
}

