import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CtaBand } from '@/components/public/cta-band'
import { ArrowIcon } from '@/components/public/arrow-icon'
import { MEMBERS } from '@/lib/data/members'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return MEMBERS.map((m) => ({ slug: m.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const member = MEMBERS.find((m) => m.slug === slug)
  if (!member) return {}
  return {
    title: `${member.name} – Adhérent OPEN PF`,
    description:
      member.description ?? `${member.name} est membre du réseau OPEN Polynésie française.`,
    openGraph: {
      title: `${member.name} – Adhérent OPEN PF`,
      description:
        member.description ?? `${member.name} est membre du réseau OPEN Polynésie française.`,
      type: 'profile',
    },
  }
}

function getOtherMembers(currentSlug: string, count = 3) {
  const others = MEMBERS.filter((m) => m.slug !== currentSlug)
  const idx = MEMBERS.findIndex((m) => m.slug === currentSlug)
  const start = (idx + 1) % others.length
  return [...others.slice(start), ...others.slice(0, start)].slice(0, count)
}

export default async function MemberPage({ params }: Props) {
  const { slug } = await params
  const member = MEMBERS.find((m) => m.slug === slug)
  if (!member) notFound()

  const otherMembers = getOtherMembers(slug)
  const domains = member.activityDomains ?? []
  const websiteDisplay = member.websiteUrl?.replace(/^https?:\/\//, '')

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Accueil', item: 'https://open.pf' },
      { '@type': 'ListItem', position: 2, name: 'Adhérents', item: 'https://open.pf/adherents' },
      {
        '@type': 'ListItem',
        position: 3,
        name: member.name,
        item: `https://open.pf/adherents/${slug}`,
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Hero — profile card layout */}
      <section className="hero">
        <div className="hero-inner profile-hero-card container">
          <div className="logo-card" style={{ height: '170px' }}>
            {member.logoUrl ? (
              <Image
                src={member.logoUrl}
                alt={`Logo ${member.name}`}
                width={160}
                height={130}
                style={{ objectFit: 'contain', maxHeight: '130px' }}
                unoptimized
              />
            ) : (
              <>
                <span
                  style={{
                    fontSize: '15px',
                    fontWeight: 900,
                    color: 'var(--navy)',
                    textAlign: 'center',
                    lineHeight: 1.2,
                  }}
                >
                  {member.name}
                </span>
                <small>Polynésie française</small>
              </>
            )}
          </div>

          <div>
            <nav className="breadcrumb" aria-label="Fil d'Ariane">
              <Link href="/">Accueil</Link> › <Link href="/adherents">Adhérents OPEN</Link> ›{' '}
              {member.name}
            </nav>
            <h1 style={{ marginTop: '10px' }}>{member.name}</h1>
            {domains.length > 0 && (
              <div className="filters" style={{ margin: '18px 0' }}>
                {domains.slice(0, 4).map((d) => (
                  <span key={d} className="filter-chip">
                    {d}
                  </span>
                ))}
              </div>
            )}
            {member.description && (
              <p className="lead" style={{ marginTop: domains.length > 0 ? '0' : '18px' }}>
                {member.description}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Main content — about + contact */}
      <section className="section">
        <div className="grid-2 container">
          <article className="card">
            <span className="eyebrow">À propos de {member.name}</span>
            {member.description ? (
              <p style={{ marginTop: '20px' }}>{member.description}</p>
            ) : (
              <p style={{ marginTop: '20px', color: 'var(--muted)' }}>
                Membre actif du réseau OPEN Polynésie française.
              </p>
            )}
            {domains.length > 0 && (
              <div className="filters" style={{ marginTop: '24px' }}>
                {domains.map((d) => (
                  <span key={d} className="filter-chip light">
                    {d}
                  </span>
                ))}
              </div>
            )}
          </article>

          <aside className="card contact-card" aria-labelledby={`contact-${slug}`}>
            <h2 id={`contact-${slug}`}>Contact</h2>

            {member.websiteUrl && (
              <div className="contact-item">
                <span style={{ color: 'var(--open-magenta)' }}>
                  <svg
                    className="icon"
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    width="20"
                    height="20"
                  >
                    <path
                      fill="currentColor"
                      d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zm-1 17.93V18a1 1 0 0 0-1-1H8a3 3 0 0 1-3-3v-1l5 5v-.07zM17.9 15a3 3 0 0 0-1.7-.9l-1.2-.2a1 1 0 0 1-.8-.6l-.3-.7a1 1 0 0 1 .3-1.1l1.5-1.3a1 1 0 0 0 .3-.9l-.2-.7A8 8 0 0 0 12 4v1a1 1 0 0 0 1 1h1a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1h-1a3 3 0 0 0-3 3v1a1 1 0 0 0 1 1h2a1 1 0 0 1 1 1v2.59A8 8 0 0 0 17.9 15z"
                    />
                  </svg>
                </span>
                <p>
                  <strong>Site web</strong>
                  <br />
                  <a
                    href={member.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ wordBreak: 'break-all' }}
                  >
                    {websiteDisplay}
                  </a>
                </p>
              </div>
            )}

            <div className="contact-item">
              <span style={{ color: 'var(--open-magenta)' }}>
                <svg className="icon" aria-hidden="true" viewBox="0 0 24 24" width="20" height="20">
                  <path
                    fill="currentColor"
                    d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z"
                  />
                </svg>
              </span>
              <p>
                <strong>Localisation</strong>
                <br />
                Polynésie française
              </p>
            </div>

            {member.websiteUrl && (
              <a href={member.websiteUrl} className="btn" target="_blank" rel="noopener noreferrer">
                Visiter le site <ArrowIcon />
              </a>
            )}

            {!member.websiteUrl && (
              <Link href="/contact" className="btn btn-secondary">
                Nous contacter <ArrowIcon />
              </Link>
            )}
          </aside>
        </div>
      </section>

      {/* Autres adhérents */}
      <section className="section section-tight" style={{ background: 'var(--soft)' }}>
        <div className="container">
          <div className="section-head">
            <h2>Autres adhérents du réseau</h2>
            <Link href="/adherents" className="btn btn-secondary">
              Voir tous les adhérents <ArrowIcon />
            </Link>
          </div>
          <div className="grid-3">
            {otherMembers.map((m) => (
              <Link
                key={m.slug}
                href={`/adherents/${m.slug}`}
                style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
              >
                <article className="card member-card">
                  <div className="logo-card">
                    {m.logoUrl ? (
                      <Image
                        src={m.logoUrl}
                        alt={`Logo ${m.name}`}
                        width={100}
                        height={60}
                        style={{ objectFit: 'contain', maxHeight: '60px' }}
                        unoptimized
                      />
                    ) : (
                      <span
                        style={{
                          fontSize: '12px',
                          fontWeight: 900,
                          color: 'var(--navy)',
                          textAlign: 'center',
                        }}
                      >
                        {m.name}
                      </span>
                    )}
                  </div>
                  <div>
                    <h3>{m.name}</h3>
                    {m.description && (
                      <p style={{ marginTop: '8px', fontSize: '14px', color: 'var(--muted)' }}>
                        {m.description.length > 80
                          ? m.description.slice(0, 80) + '…'
                          : m.description}
                      </p>
                    )}
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  )
}
