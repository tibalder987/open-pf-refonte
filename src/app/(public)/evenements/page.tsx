import type { Metadata } from 'next'
import Link from 'next/link'
import { CtaBand } from '@/components/public/cta-band'
import { buildBreadcrumbJsonLd } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Événements',
  description:
    'Retrouvez les rencontres, conférences et ateliers organisés par OPEN PF pour les professionnels du numérique en Polynésie française.',
  alternates: { canonical: '/evenements' },
  openGraph: {
    title: 'Événements – OPEN PF',
    description:
      "Rencontres professionnelles, conférences et ateliers pour l'écosystème numérique polynésien.",
    type: 'website',
    url: '/evenements',
    images: [{ url: '/logo-open.png', width: 512, height: 512, alt: 'OPEN PF' }],
  },
  twitter: { card: 'summary_large_image', images: ['/logo-open.png'] },
}

export default function EvenementsPage() {
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: 'Accueil', href: '/' },
    { name: 'Événements', href: '/evenements' },
  ])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <section className="hero hero-simple">
        <div className="hero-inner container">
          <div>
            <nav className="breadcrumb" aria-label="Fil d'Ariane">
              <Link href="/">Accueil</Link> › Événements
            </nav>
            <h1>Événements.</h1>
            <p className="lead" style={{ marginTop: '20px' }}>
              Rencontres, conférences et ateliers pour les professionnels du numérique en Polynésie
              française.
            </p>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="evenements-title">
        <div className="container">
          <div className="section-head">
            <h2 id="evenements-title">Agenda</h2>
          </div>
          <div className="empty-state">
            <svg className="empty-state__icon" viewBox="0 0 48 48" aria-hidden="true" fill="none">
              <rect x="8" y="10" width="32" height="30" rx="4" stroke="currentColor" strokeWidth="3" />
              <path d="M8 20h32" stroke="currentColor" strokeWidth="3" />
              <path d="M16 6v8M32 6v8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            </svg>
            <p className="empty-state__title">Aucun événement à venir</p>
            <p className="empty-state__text">
              Revenez bientôt ou suivez nos actualités pour être informé des prochains événements.
            </p>
            <Link href="/actualites" className="btn btn-secondary" style={{ marginTop: '20px' }}>
              Voir les actualités
            </Link>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  )
}
