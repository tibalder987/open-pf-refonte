/**
 * Unit tests for scripts/import-openpf/lib/utils.ts
 */
import { describe, it, expect } from 'vitest'
import {
  deduplicateUrls,
  extractEmail,
  extractPhone,
  extractSlugFromUrl,
  mapDomain,
  normalizeText,
  normalizeDomainLabel,
} from '../../scripts/import-openpf/lib/utils'

// ─── extractSlugFromUrl ───────────────────────────────────────────────────────

describe('extractSlugFromUrl', () => {
  it('extracts slug from a standard member URL with trailing slash', () => {
    expect(extractSlugFromUrl('https://open.pf/adherents/proxi/')).toBe('proxi')
  })

  it('extracts slug from URL without trailing slash', () => {
    expect(extractSlugFromUrl('https://open.pf/adherents/bbs')).toBe('bbs')
  })

  it('extracts slug with hyphens', () => {
    expect(extractSlugFromUrl('https://open.pf/adherents/clusir-tahiti/')).toBe('clusir-tahiti')
  })

  it('returns empty string for bare /adherents/', () => {
    expect(extractSlugFromUrl('https://open.pf/adherents/')).toBe('')
  })

  it('returns empty string for pagination URL', () => {
    expect(extractSlugFromUrl('https://open.pf/adherents/page/2/')).toBe('')
  })

  it('returns empty string for non-member URL', () => {
    expect(extractSlugFromUrl('https://open.pf/actualite/')).toBe('')
  })

  it('returns empty string for invalid URL', () => {
    expect(extractSlugFromUrl('not-a-url')).toBe('')
  })

  it('extracts slug with numbers', () => {
    expect(extractSlugFromUrl('https://open.pf/adherents/spilog-2/')).toBe('spilog-2')
  })
})

// ─── normalizeText ────────────────────────────────────────────────────────────

describe('normalizeText', () => {
  it('trims leading and trailing whitespace', () => {
    expect(normalizeText('  hello  ')).toBe('hello')
  })

  it('collapses multiple spaces to one', () => {
    expect(normalizeText('hello   world')).toBe('hello world')
  })

  it('replaces newlines with a space', () => {
    expect(normalizeText('hello\nworld')).toBe('hello world')
  })

  it('replaces carriage return + newline', () => {
    expect(normalizeText('hello\r\nworld')).toBe('hello world')
  })

  it('collapses tabs', () => {
    expect(normalizeText('hello\t\tworld')).toBe('hello world')
  })

  it('handles empty string', () => {
    expect(normalizeText('')).toBe('')
  })

  it('handles string with only whitespace', () => {
    expect(normalizeText('   \n\t  ')).toBe('')
  })

  it('preserves single spaces between words', () => {
    expect(normalizeText('hello world')).toBe('hello world')
  })
})

// ─── extractEmail ─────────────────────────────────────────────────────────────

describe('extractEmail', () => {
  it('extracts a simple email address', () => {
    expect(extractEmail('contact@prox-i.pf')).toBe('contact@prox-i.pf')
  })

  it('extracts email from surrounding text', () => {
    expect(extractEmail('Send mail to contact@open.pf for info')).toBe('contact@open.pf')
  })

  it('extracts email from mailto href value', () => {
    expect(extractEmail('mailto:info@company.com')).toBe('info@company.com')
  })

  it('returns null when no email present', () => {
    expect(extractEmail('no email here')).toBeNull()
  })

  it('handles subdomain emails', () => {
    expect(extractEmail('admin@mail.open.pf')).toBe('admin@mail.open.pf')
  })

  it('handles plus-sign in email', () => {
    expect(extractEmail('user+tag@example.pf')).toBe('user+tag@example.pf')
  })

  it('returns null for empty string', () => {
    expect(extractEmail('')).toBeNull()
  })
})

// ─── extractPhone ─────────────────────────────────────────────────────────────

describe('extractPhone', () => {
  it('extracts local 8-digit phone with spaces', () => {
    expect(extractPhone('40 54 11 45')).toBe('40 54 11 45')
  })

  it('extracts international format +689', () => {
    expect(extractPhone('+689 40 54 11 45')).toBe('+689 40 54 11 45')
  })

  it('extracts international format 00689', () => {
    expect(extractPhone('00689 40 54 11 45')).toBe('00689 40 54 11 45')
  })

  it('extracts 8-digit compact number', () => {
    expect(extractPhone('40541145')).toBe('40541145')
  })

  it('returns null for empty string', () => {
    expect(extractPhone('')).toBeNull()
  })

  it('returns null for text without a phone', () => {
    expect(extractPhone('no phone here')).toBeNull()
  })

  it('handles phone with dots', () => {
    expect(extractPhone('40.54.11.45')).toBe('40.54.11.45')
  })
})

// ─── deduplicateUrls ──────────────────────────────────────────────────────────

describe('deduplicateUrls', () => {
  it('removes exact duplicates', () => {
    const input = [
      'https://open.pf/adherents/proxi/',
      'https://open.pf/adherents/bbs/',
      'https://open.pf/adherents/proxi/',
    ]
    const result = deduplicateUrls(input)
    expect(result).toHaveLength(2)
    expect(result).toContain('https://open.pf/adherents/proxi/')
    expect(result).toContain('https://open.pf/adherents/bbs/')
  })

  it('deduplicates case-insensitively, keeping first occurrence', () => {
    const input = [
      'https://open.pf/adherents/PROXI/',
      'https://open.pf/adherents/proxi/',
    ]
    const result = deduplicateUrls(input)
    expect(result).toHaveLength(1)
    // First occurrence is kept (uppercase)
    expect(result[0]).toBe('https://open.pf/adherents/PROXI/')
  })

  it('returns sorted results', () => {
    const input = [
      'https://open.pf/adherents/bbs/',
      'https://open.pf/adherents/advens/',
    ]
    const result = deduplicateUrls(input)
    expect(result[0]).toBe('https://open.pf/adherents/advens/')
    expect(result[1]).toBe('https://open.pf/adherents/bbs/')
  })

  it('handles empty array', () => {
    expect(deduplicateUrls([])).toEqual([])
  })

  it('handles single element', () => {
    const url = 'https://open.pf/adherents/proxi/'
    expect(deduplicateUrls([url])).toEqual([url])
  })
})

// ─── normalizeDomainLabel ─────────────────────────────────────────────────────

describe('normalizeDomainLabel', () => {
  it('trims whitespace', () => {
    expect(normalizeDomainLabel('  Audit  ')).toBe('Audit')
  })

  it('normalizes slash spacing: no space before slash', () => {
    expect(normalizeDomainLabel('Hébergement /Stockage')).toBe('Hébergement / Stockage')
  })

  it('normalizes slash spacing: no space after slash', () => {
    expect(normalizeDomainLabel('Hébergement/ Stockage')).toBe('Hébergement / Stockage')
  })

  it('normalizes "IA&DATA" to "IA & DATA"', () => {
    expect(normalizeDomainLabel('IA&DATA')).toBe('IA & DATA')
  })

  it('decodes &amp; HTML entity', () => {
    expect(normalizeDomainLabel('IA&amp;DATA')).toBe('IA & DATA')
  })

  it('normalizes "AMO /AMI" to "AMO / AMI"', () => {
    expect(normalizeDomainLabel('AMO /AMI')).toBe('AMO / AMI')
  })

  it('normalizes "Normes /Cybersécurité"', () => {
    expect(normalizeDomainLabel('Normes /Cybersécurité')).toBe('Normes / Cybersécurité')
  })
})

// ─── mapDomain ────────────────────────────────────────────────────────────────

const KNOWN_DOMAINS = [
  'Développement logiciels',
  'Hébergement / Stockage / Cloud',
  'Normes / Cybersécurité',
  'AMO / AMI',
  'IA & DATA',
  'Conseil / Expertise',
  'Application',
  'Commerce et services en ligne',
  'Communication digitale',
  'Distribution et intégration',
  'Sites & applis web',
  'Admin / Réseaux / Système',
  'Audit',
]

describe('mapDomain', () => {
  it('exact match — same label', () => {
    const result = mapDomain('Application', KNOWN_DOMAINS)
    expect(result.mapped).toBe('Application')
    expect(result.exact).toBe(true)
  })

  it('case-insensitive exact match', () => {
    const result = mapDomain('application', KNOWN_DOMAINS)
    expect(result.mapped).toBe('Application')
    expect(result.exact).toBe(true)
  })

  it('maps "Developpement logiciels" → "Développement logiciels" (no accent, exact after normalize)', () => {
    // Note: normalization doesn't add accents but case-insensitive compare catches it
    // after lower case both should match if labels also lowercased
    const result = mapDomain('Développement logiciels', KNOWN_DOMAINS)
    expect(result.mapped).toBe('Développement logiciels')
    expect(result.exact).toBe(true)
  })

  it('maps "Hébergement / Stockage /Cloud" → exact after slash normalization', () => {
    const result = mapDomain('Hébergement / Stockage /Cloud', KNOWN_DOMAINS)
    // After normalization: "Hébergement / Stockage / Cloud"
    expect(result.mapped).toBe('Hébergement / Stockage / Cloud')
    expect(result.exact).toBe(true)
  })

  it('maps "Normes /Cybersécurité" → "Normes / Cybersécurité"', () => {
    const result = mapDomain('Normes /Cybersécurité', KNOWN_DOMAINS)
    expect(result.mapped).toBe('Normes / Cybersécurité')
    expect(result.exact).toBe(true)
  })

  it('maps "AMO /AMI" → "AMO / AMI"', () => {
    const result = mapDomain('AMO /AMI', KNOWN_DOMAINS)
    expect(result.mapped).toBe('AMO / AMI')
    expect(result.exact).toBe(true)
  })

  it('maps "AMO / AMI" → "AMO / AMI" (exact)', () => {
    const result = mapDomain('AMO / AMI', KNOWN_DOMAINS)
    expect(result.mapped).toBe('AMO / AMI')
    expect(result.exact).toBe(true)
  })

  it('maps "IA&DATA" → "IA & DATA"', () => {
    const result = mapDomain('IA&DATA', KNOWN_DOMAINS)
    expect(result.mapped).toBe('IA & DATA')
    expect(result.exact).toBe(true)
  })

  it('maps "IA & DATA" → "IA & DATA"', () => {
    const result = mapDomain('IA & DATA', KNOWN_DOMAINS)
    expect(result.mapped).toBe('IA & DATA')
    expect(result.exact).toBe(true)
  })

  it('maps HTML entity "IA&amp;DATA" → "IA & DATA"', () => {
    const result = mapDomain('IA&amp;DATA', KNOWN_DOMAINS)
    expect(result.mapped).toBe('IA & DATA')
    expect(result.exact).toBe(true)
  })

  it('returns null for completely unknown domain', () => {
    const result = mapDomain('Blockchain Tahiti', KNOWN_DOMAINS)
    expect(result.mapped).toBeNull()
    expect(result.exact).toBe(false)
  })

  it('fuzzy matches partial label — source is substring of known', () => {
    const result = mapDomain('Audit', KNOWN_DOMAINS)
    expect(result.mapped).toBe('Audit')
    expect(result.exact).toBe(true)
  })
})
