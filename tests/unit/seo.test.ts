import { describe, it, expect } from 'vitest'
import { buildBreadcrumbJsonLd, buildMemberJsonLd } from '@/lib/seo'

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
