import type { Metadata } from 'next'
import Link from 'next/link'
import { CtaBand } from '@/components/public/cta-band'
import { MemberSearch } from '@/components/annuaire/member-search'
import { MemberFilters } from '@/components/annuaire/member-filters'
import { MemberResultsSummary } from '@/components/annuaire/member-results-summary'
import { MemberGrid } from '@/components/annuaire/member-grid'
import { getActivityDomains, searchMembers } from '@/lib/db/queries/members'

export const revalidate = 3600

interface PageProps {
  searchParams: Promise<{ q?: string | string[]; domaine?: string | string[] }>
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

export default async function AdherentsPage({ searchParams }: PageProps) {
  const raw = await searchParams
  const q = typeof raw.q === 'string' ? raw.q : undefined
  const domaine = typeof raw.domaine === 'string' ? raw.domaine : undefined

  const [list, domains] = await Promise.all([
    searchMembers({ q, domainId: domaine }),
    getActivityDomains(),
  ])

  const activeLabel = domains.find((d) => d.id === domaine)?.label

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
            <MemberSearch q={q} domaine={domaine} />
          </div>
        </div>
      </section>

      <MemberFilters domains={domains} activeId={domaine} q={q} />

      <section className="section" aria-labelledby="members-count-title">
        <div className="container">
          <MemberResultsSummary count={list.length} activeLabel={activeLabel} q={q} />
          <MemberGrid list={list} q={q} activeLabel={activeLabel} />
        </div>
      </section>

      <CtaBand />
    </>
  )
}
