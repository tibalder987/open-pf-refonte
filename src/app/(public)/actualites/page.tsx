import type { Metadata } from 'next'
import Link from 'next/link'
import { getDb } from '@/lib/db'
import { news, newsCategories } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'
import { CtaBand } from '@/components/public/cta-band'
import { ArrowIcon } from '@/components/public/arrow-icon'
import { formatDate } from '@/lib/utils'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Actualités OPEN PF',
  description: "Toute l'actualité du numérique en Polynésie française.",
  openGraph: {
    title: 'Actualités OPEN PF',
    description: "Toute l'actualité du numérique en Polynésie française.",
    type: 'website',
  },
}

export default async function ActualitesPage() {
  const db = getDb()
  const articles = await db
    .select({
      id: news.id,
      slug: news.slug,
      title: news.title,
      excerpt: news.excerpt,
      publishedAt: news.publishedAt,
      imageUrl: news.imageUrl,
      categoryLabel: newsCategories.label,
    })
    .from(news)
    .leftJoin(newsCategories, eq(news.categoryId, newsCategories.id))
    .where(eq(news.status, 'published'))
    .orderBy(desc(news.publishedAt))

  const [featured, ...rest] = articles

  return (
    <>
      <section className="hero hero-simple">
        <div className="hero-inner container">
          <div>
            <nav className="breadcrumb" aria-label="Fil d'Ariane">
              <Link href="/">Accueil</Link> › Actualités
            </nav>
            <h1 style={{ color: 'white', marginTop: '8px' }}>Actualités.</h1>
            <p className="lead" style={{ marginTop: '20px' }}>
              Toute l&apos;actualité du numérique en Polynésie française.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {featured && (
            <article
              className="card"
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1.2fr',
                gap: '28px',
                alignItems: 'center',
                marginBottom: '36px',
              }}
            >
              <div className="news-image event" style={{ height: '260px', borderRadius: '18px' }} />
              <div>
                {featured.categoryLabel && (
                  <span className="tag">{featured.categoryLabel}</span>
                )}
                {featured.publishedAt && (
                  <p className="meta" style={{ marginTop: '8px' }}>
                    {formatDate(featured.publishedAt)}
                  </p>
                )}
                <h2 style={{ marginTop: '8px' }}>{featured.title}</h2>
                {featured.excerpt && (
                  <p style={{ marginTop: '14px' }}>{featured.excerpt}</p>
                )}
                <Link
                  href={`/actualites/${featured.slug}`}
                  className="card-link"
                  style={{ marginTop: '16px' }}
                >
                  Lire l&apos;article <ArrowIcon />
                </Link>
              </div>
            </article>
          )}

          {rest.length > 0 && (
            <div className="grid-3">
              {rest.map((article) => (
                <article key={article.slug} className="card news-card">
                  <div className="news-image lagoon" />
                  <div className="news-body">
                    {article.categoryLabel && (
                      <span className="tag">{article.categoryLabel}</span>
                    )}
                    <h3 style={{ marginTop: '8px' }}>{article.title}</h3>
                    {article.publishedAt && (
                      <p className="meta" style={{ marginTop: '8px' }}>
                        {formatDate(article.publishedAt)}
                      </p>
                    )}
                    <Link href={`/actualites/${article.slug}`} className="card-link">
                      Lire l&apos;article <ArrowIcon />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}

          {articles.length === 0 && (
            <p style={{ color: 'var(--muted)', textAlign: 'center', padding: '48px 0' }}>
              Aucune actualité pour le moment.
            </p>
          )}
        </div>
      </section>

      <CtaBand />
    </>
  )
}
