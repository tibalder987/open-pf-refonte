import { desc, eq } from 'drizzle-orm'
import { getDb } from '@/lib/db'
import { news, newsCategories } from '@/lib/db/schema'

export async function getRecentNews(limit = 3) {
  const db = getDb()
  return db
    .select({
      id: news.id,
      slug: news.slug,
      title: news.title,
      excerpt: news.excerpt,
      publishedAt: news.publishedAt,
      imageUrl: news.imageUrl,
      categoryLabel: newsCategories.label,
      categorySlug: newsCategories.slug,
    })
    .from(news)
    .leftJoin(newsCategories, eq(news.categoryId, newsCategories.id))
    .where(eq(news.status, 'published'))
    .orderBy(desc(news.publishedAt))
    .limit(limit)
}

export async function getNewsBySlug(slug: string) {
  const db = getDb()
  const rows = await db
    .select({
      id: news.id,
      slug: news.slug,
      title: news.title,
      excerpt: news.excerpt,
      content: news.content,
      publishedAt: news.publishedAt,
      imageUrl: news.imageUrl,
      authorName: news.authorName,
      metaDescription: news.metaDescription,
      categoryLabel: newsCategories.label,
      categorySlug: newsCategories.slug,
    })
    .from(news)
    .leftJoin(newsCategories, eq(news.categoryId, newsCategories.id))
    .where(eq(news.slug, slug))
    .limit(1)

  return rows[0] ?? null
}
