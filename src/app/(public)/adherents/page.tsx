import type { Metadata } from 'next'
import Link from 'next/link'
import { CtaBand } from '@/components/public/cta-band'
import { MemberCard } from '@/components/annuaire/member-card'
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
      images: [{ url: '/logo-open.png', width: 512, height: 512, alt: 'OPEN PF' }],
    },
    twitter: {
      card: 'summary_large_image',
      images: ['/logo-open.png'],
    },
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

  const count = list.length
  const activeLabel = domains.find((d) => d.id === domaine)?.label
  const allHref = q ? `/adherents?q=${encodeURIComponent(q)}` : '/adherents'
  const countLabel = `${count} entreprise${count !== 1 ? 's' : ''} adhérente${count !== 1 ? 's' : ''}`

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
            <form
              className="search-box"
              role="search"
              aria-label="Recherche dans l'annuaire"
              style={{ marginTop: '32px' }}
              action="/adherents"
              method="GET"
            >
              {domaine && <input type="hidden" name="domaine" value={domaine} />}
              <label className="sr-only" htmlFor="search-member">
                Rechercher une entreprise
              </label>
              <input
                id="search-member"
                name="q"
                type="search"
                placeholder="Rechercher une entreprise, un mot-clé…"
                defaultValue={q?.trim() ?? ''}
              />
              <button className="btn" type="submit">
                Rechercher{' '}
                <svg className="icon" aria-hidden="true" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="m21 19.6-5.2-5.2a7 7 0 1 0-1.4 1.4l5.2 5.2 1.4-1.4zM5 10.5a5.5 5.5 0 1 1 11 0 5.5 5.5 0 0 1-11 0z"
                  />
                </svg>
              </button>
            </form>
          </div>
        </div>
      </section>

      {domains.length > 0 && (
        <div className="container" style={{ paddingTop: '28px', paddingBottom: '4px' }}>
          <div className="filters" role="group" aria-label="Filtrer par domaine d'activité">
            <Link
              href={allHref}
              className={`filter-chip light${!domaine ? ' active' : ''}`}
              aria-pressed={!domaine}
            >
              Tous les domaines
            </Link>
            {domains.map((d) => {
              const params = new URLSearchParams()
              if (q) params.set('q', q)
              params.set('domaine', d.id)
              return (
                <Link
                  key={d.id}
                  href={`/adherents?${params.toString()}`}
                  className={`filter-chip light${domaine === d.id ? ' active' : ''}`}
                  aria-pressed={domaine === d.id}
                >
                  {d.label}
                </Link>
              )
            })}
          </div>
        </div>
      )}

      <section className="section">
        <div className="container">
          <div className="section-head">
            <h2>
              <span style={{ color: 'var(--open-magenta)' }}>{count}</span>{' '}
              {count !== 1 ? 'entreprises adhérentes' : 'entreprise adhérente'}
              {activeLabel && (
                <>
                  {' '}
                  ·{' '}
                  <span style={{ fontWeight: 400, fontSize: '0.7em' }}>{activeLabel}</span>
                </>
              )}
            </h2>
            <p aria-live="polite" aria-atomic="true" className="sr-only">
              {countLabel}
              {q && ` pour la recherche « ${q} »`}
              {activeLabel && ` dans le domaine ${activeLabel}`}
            </p>
          </div>

          {count === 0 ? (
            <div className="empty-state">
              <svg className="empty-state__icon" viewBox="0 0 48 48" aria-hidden="true" fill="none">
                <circle cx="22" cy="22" r="14" stroke="currentColor" strokeWidth="3" />
                <path d="m32 32 9 9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                <path
                  d="M17 22h10M22 17v10"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
              <p className="empty-state__title">Aucun résultat</p>
              <p className="empty-state__text">
                {q
                  ? `Aucune entreprise ne correspond à « ${q} »${activeLabel ? ` dans le domaine ${activeLabel}` : ''}.`
                  : `Aucune entreprise dans ce domaine pour le moment.`}
              </p>
              <Link href="/adherents" className="btn btn-secondary" style={{ marginTop: '20px' }}>
                Réinitialiser les filtres
              </Link>
            </div>
          ) : (
            <div className="members-grid">
              {list.map((member) => (
                <MemberCard
                  key={member.slug}
                  slug={member.slug}
                  name={member.name}
                  logoUrl={member.logoUrl}
                  description={member.description}
                  primaryDomain={member.primaryDomain}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <CtaBand />
    </>
  )
}
