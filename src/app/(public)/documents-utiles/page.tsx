import type { Metadata } from 'next'
import Link from 'next/link'
import { CtaBand } from '@/components/public/cta-band'
import { buildBreadcrumbJsonLd } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Documents utiles',
  description:
    'Documents et ressources mis à disposition par OPEN PF pour les membres du réseau numérique de Polynésie française.',
  alternates: { canonical: '/documents-utiles' },
  openGraph: {
    title: 'Documents utiles – OPEN PF',
    description: 'Documents et ressources utiles pour les membres du réseau OPEN PF.',
    type: 'website',
    url: '/documents-utiles',
    images: [{ url: '/logo-open.png', width: 1169, height: 533, alt: 'OPEN PF' }],
  },
  twitter: { card: 'summary_large_image', images: ['/logo-open.png'] },
}

export default function DocumentsUtilesPage() {
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: 'Accueil', href: '/' },
    { name: 'Documents utiles', href: '/documents-utiles' },
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
              <Link href="/">Accueil</Link> › Documents utiles
            </nav>
            <h1>Documents utiles.</h1>
            <p className="lead" style={{ marginTop: '20px' }}>
              Ressources et documents mis à disposition par OPEN PF pour ses membres.
            </p>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="documents-title">
        <div className="container">
          <h2 id="documents-title" className="sr-only">
            Liste des documents
          </h2>
          <div className="empty-state">
            <svg className="empty-state__icon" viewBox="0 0 48 48" aria-hidden="true" fill="none">
              <rect x="10" y="8" width="28" height="32" rx="4" stroke="currentColor" strokeWidth="3" />
              <path
                d="M16 17h16M16 23h16M16 29h10"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
            <p className="empty-state__title">Section en cours de constitution</p>
            <p className="empty-state__text">
              Revenez bientôt pour accéder aux documents et ressources de la filière.
            </p>
            <Link href="/contact" className="btn btn-secondary" style={{ marginTop: '20px' }}>
              Nous contacter
            </Link>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  )
}
