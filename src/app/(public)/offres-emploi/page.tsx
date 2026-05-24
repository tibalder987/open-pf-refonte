import type { Metadata } from 'next'
import Link from 'next/link'
import { CtaBand } from '@/components/public/cta-band'
import { ArrowIcon } from '@/components/public/arrow-icon'
import { JobCard } from '@/components/public/job-card'
import { getPublishedJobs } from '@/lib/db/queries/jobs'
import { buildBreadcrumbJsonLd } from '@/lib/seo'

export const dynamic = 'force-dynamic'

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

export default async function OffresEmploiPage() {
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: 'Accueil', href: '/' },
    { name: "Offres d'emploi", href: '/offres-emploi' },
  ])

  const jobs = await getPublishedJobs()

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
          <h2 id="offres-title" className="sr-only">
            Liste des offres d&apos;emploi
          </h2>

          {jobs.length > 0 ? (
            <div className="jobs-grid">
              {jobs.map((job) => (
                <JobCard
                  key={job.slug}
                  slug={job.slug}
                  title={job.title}
                  location={job.location}
                  contractType={job.contractType}
                  salary={job.salary}
                  memberName={job.memberName}
                />
              ))}
            </div>
          ) : (
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
              <p className="empty-state__title">Aucune offre disponible pour le moment</p>
              <p className="empty-state__text">
                Les offres d&apos;emploi des entreprises adhérentes seront publiées ici dès
                qu&apos;elles seront ouvertes. Votre entreprise recrute&nbsp;?
              </p>
              <Link href="/adhesion" className="btn" style={{ marginTop: '20px' }}>
                Devenir adhérent <ArrowIcon />
              </Link>
            </div>
          )}
        </div>
      </section>

      <CtaBand />
    </>
  )
}
