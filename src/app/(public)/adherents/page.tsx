import { Suspense } from 'react'
import type { Metadata } from 'next'
import { CtaBand } from '@/components/public/cta-band'
import { MemberSearch } from '@/components/annuaire/member-search'
import { MemberFilters } from '@/components/annuaire/member-filters'
import { MemberResultsSummary } from '@/components/annuaire/member-results-summary'
import { MemberGrid } from '@/components/annuaire/member-grid'
import { DirectoryHero } from '@/components/annuaire/directory-hero'
import { DirectoryStats } from '@/components/annuaire/directory-stats'
import { getActivityDomains, searchMembers } from '@/lib/db/queries/members'
import { getSiteStats } from '@/lib/db/queries/stats'

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
      images: [{ url: '/logo-open.png', width: 1169, height: 533, alt: 'OPEN PF – Annuaire des adhérents' }],
    },
    twitter: { card: 'summary_large_image', images: ['/logo-open.png'] },
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

  const [list, domains, stats] = await Promise.all([
    searchMembers({ q, domainId: domaine }),
    getActivityDomains(),
    getSiteStats(),
  ])

  const activeLabel = domains.find((d) => d.id === domaine)?.label

  return (
    <>
      <DirectoryStats
        memberCount={stats.memberCount}
        domainCount={stats.domainCount}
        employeeCount={stats.employeeCount}
      />

      <div className="container">
        <div className="directory-search-panel" aria-label="Recherche et filtres">
          <MemberSearch q={q} domaine={domaine} />
          <MemberFilters domains={domains} activeId={domaine} q={q} />
        </div>
      </div>

      <section className="section" aria-labelledby="members-count-title">
        <div className="container">
          <MemberResultsSummary count={list.length} activeLabel={activeLabel} q={q} />
          <MemberGrid list={list} q={q} activeLabel={activeLabel} />
        </div>
      </section>
    </>
  )
}

function DirectoryLoadingSkeleton() {
  return (
    <section className="section" aria-hidden="true">
      <div className="container">
        <div className="members-grid">
          {Array.from({ length: 9 }).map((_, i) => (
            <div
              key={i}
              className="card"
              style={{ height: '320px', background: 'var(--soft)', animation: 'pulse 1.5s infinite' }}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

/*
 * Page component is NOT async — the hero section (h1) renders synchronously into
 * the HTML shell, before the footer. Only the DB-dependent content is deferred
 * via Suspense. This ensures reading order is always: h1 → member content → footer.
 */
export default function AdherentsPage({ searchParams }: PageProps) {
  return (
    <>
      <DirectoryHero />
      <Suspense fallback={<DirectoryLoadingSkeleton />}>
        <AdherentsContent searchParamsPromise={searchParams} />
      </Suspense>
      <CtaBand />
    </>
  )
}
