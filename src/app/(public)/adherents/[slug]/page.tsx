import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CtaBand } from '@/components/public/cta-band'
import { ArrowIcon } from '@/components/public/arrow-icon'
import { MemberLogo } from '@/components/public/member-logo'
import { MemberCard } from '@/components/annuaire/member-card'
import {
  getMemberBySlug,
  getMemberContacts,
  getMemberDomains,
  getOtherActiveMembers,
} from '@/lib/db/queries/members'
import { buildBreadcrumbJsonLd, buildMemberJsonLd } from '@/lib/seo'

export const revalidate = 3600

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const member = await getMemberBySlug(slug)
  if (!member) return {}
  const desc =
    member.description ??
    `${member.name} est membre actif du réseau OPEN en Polynésie française.`
  const ogImage = member.logoUrl ?? '/logo-open.png'
  return {
    title: { absolute: `${member.name} – Adhérent OPEN PF` },
    description: desc.slice(0, 160),
    alternates: { canonical: `/adherents/${slug}` },
    openGraph: {
      title: `${member.name} – Adhérent OPEN PF`,
      description: desc.slice(0, 155),
      type: 'profile',
      url: `/adherents/${slug}`,
      images: [{ url: ogImage, alt: member.name }],
    },
    twitter: { card: 'summary_large_image', images: [ogImage] },
  }
}

export default async function MemberPage({ params }: Props) {
  const { slug } = await params
  const [member, otherMembers] = await Promise.all([
    getMemberBySlug(slug),
    getOtherActiveMembers(slug, 3),
  ])
  if (!member) notFound()

  const [domains, contacts] = await Promise.all([
    getMemberDomains(member.id),
    getMemberContacts(member.id),
  ])

  const primaryContact = contacts.find((c) => c.isPrimary) ?? contacts[0]
  const websiteDisplay = member.websiteUrl?.replace(/^https?:\/\//, '').replace(/\/$/, '')

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: 'Accueil', href: '/' },
    { name: 'Adhérents', href: '/adherents' },
    { name: member.name, href: `/adherents/${slug}` },
  ])
  const memberJsonLd = buildMemberJsonLd(member)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(memberJsonLd) }}
      />

      {/* ── Hero ────────────────────────────────────────────────── */}
      <section className="hero">
        <div className="hero-inner profile-hero-card container">
          <div className="logo-card" style={{ height: '170px', background: 'white' }}>
            <MemberLogo
              name={member.name}
              logoUrl={member.logoUrl}
              sizes="(max-width: 980px) 50vw, 200px"
              priority
            />
          </div>
          <div>
            <nav className="breadcrumb" aria-label="Fil d'Ariane">
              <Link href="/">Accueil</Link> › <Link href="/adherents">Adhérents OPEN</Link> ›{' '}
              {member.name}
            </nav>
            <h1>{member.name}</h1>
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

      {/* ── Main content ────────────────────────────────────────── */}
      <section className="section">
        <div className="grid-2 container">

          {/* About card */}
          <article className="card" aria-labelledby={`about-${slug}`}>
            <h2 id={`about-${slug}`} className="eyebrow" style={{ marginBottom: '16px' }}>
              À propos de {member.name}
            </h2>

            {member.description ? (
              <p style={{ lineHeight: 1.7 }}>{member.description}</p>
            ) : (
              <p style={{ color: 'var(--muted)', lineHeight: 1.7 }}>
                Membre actif du réseau OPEN Polynésie française.
              </p>
            )}

            {/* Domains grid */}
            {domains.length > 0 && (
              <div style={{ marginTop: '24px' }}>
                <p className="eyebrow" style={{ marginBottom: '12px' }}>
                  Domaines d&apos;activité
                </p>
                <div className="member-domains-grid">
                  {domains.map((d) => (
                    <span key={d} className="member-domain-row">
                      <span className="member-domain-dot" aria-hidden="true" />
                      {d}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Company facts */}
            {(member.yearFounded ?? member.employeeCount ?? member.isMedefMember) && (
              <div className="member-facts">
                {member.yearFounded && (
                  <div className="member-fact">
                    <span className="member-fact-value">{member.yearFounded}</span>
                    <span className="member-fact-label">Année de création</span>
                  </div>
                )}
                {member.employeeCount != null && (
                  <div className="member-fact">
                    <span className="member-fact-value">{member.employeeCount}+</span>
                    <span className="member-fact-label">Collaborateurs</span>
                  </div>
                )}
                {member.isMedefMember && (
                  <div className="member-fact">
                    <span className="member-fact-value">✓</span>
                    <span className="member-fact-label">Membre MEDEF PF</span>
                  </div>
                )}
              </div>
            )}
          </article>

          {/* Contact card */}
          <aside className="card contact-card" aria-labelledby={`contact-${slug}`}>
            <h2 id={`contact-${slug}`}>Contact</h2>

            {/* Primary contact person */}
            {primaryContact && (
              <div className="contact-person">
                <svg className="icon" aria-hidden="true" viewBox="0 0 24 24" width="20" height="20">
                  <path fill="currentColor" d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10zm0 2c-5.3 0-8 2.7-8 4v1h16v-1c0-1.3-2.7-4-8-4z" />
                </svg>
                <div>
                  <strong>{primaryContact.name}</strong>
                  {primaryContact.role && (
                    <span className="contact-role">{primaryContact.role}</span>
                  )}
                </div>
              </div>
            )}

            {/* Email */}
            {primaryContact?.email && (
              <div className="contact-item">
                <span style={{ color: 'var(--open-magenta)' }}>
                  <svg className="icon" aria-hidden="true" viewBox="0 0 24 24" width="20" height="20">
                    <path fill="currentColor" d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z" />
                  </svg>
                </span>
                <p>
                  <strong>Email</strong>
                  <br />
                  <a href={`mailto:${primaryContact.email}`}>{primaryContact.email}</a>
                </p>
              </div>
            )}

            {/* Phone */}
            {primaryContact?.phone && (
              <div className="contact-item">
                <span style={{ color: 'var(--open-magenta)' }}>
                  <svg className="icon" aria-hidden="true" viewBox="0 0 24 24" width="20" height="20">
                    <path fill="currentColor" d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z" />
                  </svg>
                </span>
                <p>
                  <strong>Téléphone</strong>
                  <br />
                  <a href={`tel:${primaryContact.phone}`}>{primaryContact.phone}</a>
                </p>
              </div>
            )}

            {/* Address */}
            {member.address && (
              <div className="contact-item">
                <span style={{ color: 'var(--open-magenta)' }}>
                  <svg className="icon" aria-hidden="true" viewBox="0 0 24 24" width="20" height="20">
                    <path fill="currentColor" d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z" />
                  </svg>
                </span>
                <p>
                  <strong>Localisation</strong>
                  <br />
                  {member.address}
                </p>
              </div>
            )}

            {/* Website */}
            {member.websiteUrl && (
              <div className="contact-item">
                <span style={{ color: 'var(--open-magenta)' }}>
                  <svg className="icon" aria-hidden="true" viewBox="0 0 24 24" width="20" height="20">
                    <path fill="currentColor" d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zm-1 17.93V18a1 1 0 0 0-1-1H8a3 3 0 0 1-3-3v-1l5 5v-.07zM17.9 15a3 3 0 0 0-1.7-.9l-1.2-.2a1 1 0 0 1-.8-.6l-.3-.7a1 1 0 0 1 .3-1.1l1.5-1.3a1 1 0 0 0 .3-.9l-.2-.7A8 8 0 0 0 12 4v1a1 1 0 0 0 1 1h1a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1h-1a3 3 0 0 0-3 3v1a1 1 0 0 0 1 1h2a1 1 0 0 1 1 1v2.59A8 8 0 0 0 17.9 15z" />
                  </svg>
                </span>
                <p>
                  <strong>Site web</strong>
                  <br />
                  <a href={member.websiteUrl} target="_blank" rel="noopener noreferrer">
                    {websiteDisplay}
                  </a>
                </p>
              </div>
            )}

            {/* Social links */}
            {member.linkedinUrl && (
              <div className="contact-socials">
                <a
                  href={member.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-social-btn"
                  aria-label={`${member.name} sur LinkedIn`}
                >
                  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                    <path fill="currentColor" d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14zM7.12 20.45H3.56V9h3.56v11.45z" />
                  </svg>
                  LinkedIn
                </a>
              </div>
            )}

            {/* CTA */}
            <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
              {member.websiteUrl ? (
                <a href={member.websiteUrl} className="btn" target="_blank" rel="noopener noreferrer">
                  Visiter le site <ArrowIcon />
                </a>
              ) : (
                <Link href="/contact" className="btn btn-secondary">
                  Nous contacter <ArrowIcon />
                </Link>
              )}
            </div>
          </aside>
        </div>
      </section>

      {/* ── Other members ───────────────────────────────────────── */}
      {otherMembers.length > 0 && (
        <section className="section section-tight bg-soft">
          <div className="container">
            <div className="section-head">
              <h2>Autres adhérents du réseau</h2>
              <Link href="/adherents" className="btn btn-secondary">
                Voir tous les adhérents <ArrowIcon />
              </Link>
            </div>
            <div className="grid-3">
              {otherMembers.map((m) => (
                <MemberCard
                  key={m.slug}
                  slug={m.slug}
                  name={m.name}
                  logoUrl={m.logoUrl}
                  description={m.description}
                  primaryDomain={m.primaryDomain}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      <CtaBand />
    </>
  )
}
