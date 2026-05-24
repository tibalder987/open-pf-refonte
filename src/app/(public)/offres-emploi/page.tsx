import type { Metadata } from 'next'
import Link from 'next/link'
import { CtaBand } from '@/components/public/cta-band'
import { ArrowIcon } from '@/components/public/arrow-icon'
import { buildBreadcrumbJsonLd } from '@/lib/seo'

export const metadata: Metadata = {
  title: "Offres d'emploi",
  description:
    "Découvrez les opportunités de carrière au sein des entreprises du numérique en Polynésie française. Offres d'emploi, stages et alternances.",
  alternates: { canonical: '/offres-emploi' },
  openGraph: {
    title: "Offres d'emploi – OPEN PF",
    description:
      "Offres d'emploi des entreprises numériques adhérentes à OPEN PF en Polynésie française.",
    type: 'website',
    url: '/offres-emploi',
    images: [{ url: '/logo-open.png', width: 1169, height: 533, alt: 'OPEN PF' }],
  },
  twitter: { card: 'summary_large_image', images: ['/logo-open.png'] },
}

export default function OffresEmploiPage() {
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: 'Accueil', href: '/' },
    { name: "Offres d'emploi", href: '/offres-emploi' },
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
              <Link href="/">Accueil</Link> › Offres d&apos;emploi
            </nav>
            <h1>Offres d&apos;emploi.</h1>
            <p className="lead" style={{ marginTop: '20px' }}>
              Découvrez les opportunités de carrière au sein des entreprises du numérique en
              Polynésie française.
            </p>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="offres-title">
        <div className="container">
          <form
            className="form-shell"
            role="search"
            aria-label="Recherche d'offres"
            style={{ marginBottom: '36px' }}
          >
            <div className="form-grid-3">
              <div className="form-field">
                <label htmlFor="job-search">Recherche</label>
                <input id="job-search" type="search" placeholder="Poste, mot-clé…" />
              </div>
              <div className="form-field">
                <label htmlFor="job-domain">Domaine</label>
                <select id="job-domain">
                  <option>Tous les domaines</option>
                  <option>Développement logiciels</option>
                  <option>Conseil / Expertise</option>
                  <option>Cybersécurité</option>
                  <option>Cloud</option>
                  <option>Formation</option>
                </select>
              </div>
              <div className="form-field">
                <label htmlFor="job-contract">Contrat</label>
                <select id="job-contract">
                  <option>Tous types de contrat</option>
                  <option>CDI</option>
                  <option>CDD</option>
                  <option>Stage</option>
                  <option>Alternance</option>
                </select>
              </div>
            </div>
            <button className="btn" style={{ marginTop: '20px' }} type="submit">
              Rechercher{' '}
              <svg className="icon" aria-hidden="true" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="m21 19.6-5.2-5.2a7 7 0 1 0-1.4 1.4l5.2 5.2 1.4-1.4zM5 10.5a5.5 5.5 0 1 1 11 0 5.5 5.5 0 0 1-11 0z"
                />
              </svg>
            </button>
          </form>

          <h2 id="offres-title" className="sr-only">
            Liste des offres d&apos;emploi
          </h2>
          <div className="empty-state">
            <svg className="empty-state__icon" viewBox="0 0 48 48" aria-hidden="true" fill="none">
              <rect x="8" y="14" width="32" height="24" rx="4" stroke="currentColor" strokeWidth="3" />
              <path
                d="M18 14V10a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v4"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <path d="M8 26h32" stroke="currentColor" strokeWidth="3" />
            </svg>
            <p className="empty-state__title">Aucune offre disponible</p>
            <p className="empty-state__text">
              Les offres d&apos;emploi des entreprises adhérentes seront publiées ici.
            </p>
            <Link href="/adhesion" className="btn" style={{ marginTop: '20px' }}>
              Devenir adhérent <ArrowIcon />
            </Link>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  )
}
