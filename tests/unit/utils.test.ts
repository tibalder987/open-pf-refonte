import { describe, it, expect } from 'vitest'
import { cn, formatDate, toSlug } from '@/lib/utils'

describe('cn', () => {
  it('merges class names', () => {
    expect(cn('a', 'b')).toBe('a b')
  })

  it('deduplicates conflicting tailwind classes', () => {
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500')
  })

  it('ignores falsy values', () => {
    expect(cn('a', false, undefined, null, 'b')).toBe('a b')
  })
})

describe('toSlug', () => {
  it('lowercases and replaces spaces with hyphens', () => {
    expect(toSlug('Hello World')).toBe('hello-world')
  })

  it('strips accents', () => {
    expect(toSlug('Économie Numérique')).toBe('economie-numerique')
  })

  it('collapses multiple non-alphanumeric chars', () => {
    expect(toSlug('OPEN PF — Cluster')).toBe('open-pf-cluster')
  })

  it('trims leading and trailing hyphens', () => {
    expect(toSlug('  hello  ')).toBe('hello')
  })

  it('handles empty string', () => {
    expect(toSlug('')).toBe('')
  })
})

describe('formatDate', () => {
  it('formats a Date object in French', () => {
    const result = formatDate(new Date('2025-07-04'))
    expect(result).toContain('2025')
    expect(result).toContain('juillet')
  })

  it('accepts an ISO string', () => {
    const result = formatDate('2024-01-15')
    expect(result).toContain('2024')
    expect(result).toContain('janvier')
  })
})
