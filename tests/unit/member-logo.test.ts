import { describe, it, expect } from 'vitest'
import { colorFor, getInitials } from '@/components/public/member-logo'

describe('getInitials', () => {
  it('returns up to 3 chars for a single word', () => {
    expect(getInitials('BBS')).toBe('BBS')
    expect(getInitials('OPEN')).toBe('OPE')
  })

  it('returns initials from first two words for multi-word names', () => {
    expect(getInitials('Fenua Online')).toBe('FO')
    expect(getInitials('CLUSIR Tahiti')).toBe('CT')
  })

  it('handles extra whitespace', () => {
    expect(getInitials('  OPEN PF  ')).toBe('OP')
  })

  it('handles single character names', () => {
    expect(getInitials('X')).toBe('X')
  })

  it('uppercases the result', () => {
    expect(getInitials('delta consulting')).toBe('DC')
  })
})

describe('colorFor', () => {
  it('returns an object with bg and fg properties', () => {
    const result = colorFor('BBS')
    expect(result).toHaveProperty('bg')
    expect(result).toHaveProperty('fg')
  })

  it('always returns valid hex colors', () => {
    const hexPattern = /^#[0-9a-fA-F]{6}$/
    const r1 = colorFor('OPEN PF')
    const r2 = colorFor('Fenua Online')
    expect(r1.bg).toMatch(hexPattern)
    expect(r1.fg).toMatch(hexPattern)
    expect(r2.bg).toMatch(hexPattern)
    expect(r2.fg).toMatch(hexPattern)
  })

  it('is deterministic — same name always gives same color', () => {
    expect(colorFor('SOCREDO')).toEqual(colorFor('SOCREDO'))
    expect(colorFor('Galatea')).toEqual(colorFor('Galatea'))
  })

  it('different names can produce different colors', () => {
    const names = ['BBS', 'Fenua Online', 'GALATEA', 'SOCREDO', 'DinoVox', 'Advens']
    const colors = names.map((n) => colorFor(n).bg)
    const unique = new Set(colors)
    expect(unique.size).toBeGreaterThan(1)
  })
})
