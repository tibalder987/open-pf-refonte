import { describe, it, expect } from 'vitest'
import { buildBreadcrumbJsonLd, buildMemberJsonLd, buildJobPostingJsonLd } from '@/lib/seo'

describe('buildBreadcrumbJsonLd', () => {
  it('produces correct @type and positions', () => {
    const result = buildBreadcrumbJsonLd([
      { name: 'Accueil', href: '/' },
      { name: 'Adhérents', href: '/adherents' },
      { name: 'Acme Corp', href: '/adherents/acme' },
    ])
    expect(result['@type']).toBe('BreadcrumbList')
    expect(result.itemListElement).toHaveLength(3)
    expect(result.itemListElement[0]).toMatchObject({ position: 1, name: 'Accueil' })
    expect(result.itemListElement[2]).toMatchObject({ position: 3, name: 'Acme Corp' })
  })

  it('prefixes BASE_URL to each href', () => {
    const result = buildBreadcrumbJsonLd([{ name: 'Adhérents', href: '/adherents' }])
    expect(result.itemListElement[0]?.item).toBe('https://open.pf/adherents')
  })
})

describe('buildJobPostingJsonLd', () => {
  const base = { title: 'Développeur', slug: 'dev', memberName: 'Acme' }

  it('produces a JobPosting with hiringOrganization and jobLocation', () => {
    const r = buildJobPostingJsonLd(base)
    expect(r['@type']).toBe('JobPosting')
    expect(r.hiringOrganization).toMatchObject({ name: 'Acme' })
    expect(r.jobLocation.address.addressCountry).toBe('PF')
  })

  it('maps known contract types to schema employmentType', () => {
    expect(buildJobPostingJsonLd({ ...base, contractType: 'CDI' }).employmentType).toBe('FULL_TIME')
    expect(buildJobPostingJsonLd({ ...base, contractType: 'Stage' }).employmentType).toBe('INTERN')
  })

  it('omits employmentType for unknown contract types', () => {
    expect(buildJobPostingJsonLd({ ...base, contractType: 'Bénévolat' }).employmentType).toBeUndefined()
  })

  it('falls back to OPEN PF when no member is set', () => {
    const r = buildJobPostingJsonLd({ title: 'Dev', slug: 'dev' })
    expect(r.hiringOrganization.name).toBe('OPEN PF')
  })

  it('serialises dates to ISO when provided', () => {
    const r = buildJobPostingJsonLd({ ...base, publishedAt: '2025-07-04' })
    expect(r.datePosted).toMatch(/^2025-07-04T/)
  })
})

describe('buildMemberJsonLd', () => {
  it('includes required fields', () => {
    const result = buildMemberJsonLd({ name: 'Acme', slug: 'acme' })
    expect(result['@type']).toBe('Organization')
    expect(result.name).toBe('Acme')
    expect(result.memberOf).toMatchObject({ name: 'OPEN PF' })
  })

  it('uses websiteUrl when provided', () => {
    const result = buildMemberJsonLd({ name: 'Acme', slug: 'acme', websiteUrl: 'https://acme.pf' })
    expect(result.url).toBe('https://acme.pf')
  })

  it('falls back to canonical member URL when no websiteUrl', () => {
    const result = buildMemberJsonLd({ name: 'Acme', slug: 'acme' })
    expect(result.url).toBe('https://open.pf/adherents/acme')
  })

  it('omits optional fields when absent', () => {
    const result = buildMemberJsonLd({ name: 'Acme', slug: 'acme' })
    expect(result).not.toHaveProperty('description')
    expect(result).not.toHaveProperty('logo')
    expect(result).not.toHaveProperty('address')
  })

  it('includes address object when address is provided', () => {
    const result = buildMemberJsonLd({ name: 'Acme', slug: 'acme', address: 'Papeete' })
    expect(result.address).toMatchObject({ '@type': 'PostalAddress', streetAddress: 'Papeete' })
  })
})
