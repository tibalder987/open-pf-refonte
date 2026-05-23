import { Suspense } from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { CtaBand } from '@/components/public/cta-band'
import { MemberSearch } from '@/components/annuaire/member-search'
import { MemberFilters } from '@/components/annuaire/member-filters'
import { MemberResultsSummary } from '@/components/annuaire/member-results-summary'
import { MemberGrid } from '@/components/annuaire/member-grid'
import { getActivityDomains, searchMembers } from '@/lib/db/queries/members'

export const revalidate = 3600

type SearchParamsPromise = Promise<{ q?: string | string[]; domaine?: string | string[] }>

interface PageProps {
  searchParams: SearchParamsPromise
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const raw = await searchParams
  const isFiltered = Boolean(raw.q || raw.domaine)
  const base: Metadata = {
    title: 'Annuaire des adhérents OPEN',
    description:
      'Retrouvez les entreprises et organisations membres du réseau OPEN en Polynésie française.',
    alternates: { canonical: '/adherents' },
    openGraph: {
      title: 'Annuaire des adhérents OPEN – OPEN PF',
      description:
        'Retrouvez les entreprises et organisations membres du réseau OPEN en Polynésie française.',
      type: 'website',
      url: '/adherents',
    },
    twitter: { card: 'summary_large_image' },
  }
  if (isFiltered) {
    return { ...base, robots: { index: false, follow: false } }
  }
  return base
}

async function AdherentsContent({
  searchParamsPromise,
}: {
  searchParamsPromise: SearchParamsPromise
}) {
  const raw = await searchParamsPromise
  const q = typeof raw.q === 'string' ? raw.q : undefined
  const domaine = typeof raw.domaine === 'string' ? raw.domaine : undefined

  const [list, domains] = await Promise.all([
    searchMembers({ q, domainId: domaine }),
    getActivityDomains(),
  ])

  const activeLabel = domains.find((d) => d.id === domaine)?.label

  return (
    <>
      <div className="hero-inner container" style={{ paddingBottom: '32px' }}>
        <MemberSearch q={q} domaine={domaine} />
      </div>

      <MemberFilters domains={domains} activeId={domaine} q={q} />

      <section className="section" aria-labelledby="members-count-title">
        <div className="container">
          <MemberResultsSummary count={list.length} activeLabel={activeLabel} q={q} />
          <MemberGrid list={list} q={q} activeLabel={activeLabel} />
        </div>
      </section>
    </>
  )
}

function MembersLoadingSkeleton() {
  return (
    <section className="section" aria-hidden="true">
      <div className="container">
        <div className="members-grid">
          {Array.from({ length: 9 }).map((_, i) => (
            <div
              key={i}
              className="card"
              style={{ height: '280px', background: 'var(--line)', animation: 'pulse 1.5s infinite' }}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

/*
 * Page component is NOT async — the hero section (h1) renders synchronously into
 * the HTML shell, before the footer. Only the DB-dependent member list is deferred
 * via Suspense. This ensures reading order is always: h1 → member content → footer.
 */
export default function AdherentsPage({ searchParams }: PageProps) {
  return (
    <>
      <section className="hero hero-simple">
        <div className="hero-inner container">
          <div>
            <nav className="breadcrumb" aria-label="Fil d'Ariane">
              <Link href="/">Accueil</Link> › Adhérents OPEN
            </nav>
            <h1>Annuaire des adhérents.</h1>
            <p className="lead" style={{ marginTop: '20px' }}>
              Découvrez les entreprises et organisations qui composent le réseau OPEN en Polynésie
              française.
            </p>
          </div>
        </div>
      </section>

      <Suspense fallback={<MembersLoadingSkeleton />}>
        <AdherentsContent searchParamsPromise={searchParams} />
      </Suspense>

      <CtaBand />
    </>
  )
}
