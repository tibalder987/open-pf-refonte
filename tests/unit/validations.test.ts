import { describe, it, expect } from 'vitest'
import {
  stepEntrepriseSchema,
  stepActivitesSchema,
  stepContactsSchema,
  adhesionSchema,
} from '@/lib/validations/adhesion'

describe('stepEntrepriseSchema', () => {
  it('accepts valid minimal data', () => {
    const result = stepEntrepriseSchema.safeParse({
      name: 'OPEN PF',
      legalStatus: 'SAS',
      isMedefMember: false,
    })
    expect(result.success).toBe(true)
  })

  it('rejects name shorter than 2 chars', () => {
    const result = stepEntrepriseSchema.safeParse({
      name: 'A',
      legalStatus: 'SAS',
      isMedefMember: false,
    })
    expect(result.success).toBe(false)
  })

  it('rejects invalid website URL', () => {
    const result = stepEntrepriseSchema.safeParse({
      name: 'OPEN PF',
      legalStatus: 'SAS',
      isMedefMember: false,
      websiteUrl: 'not-a-url',
    })
    expect(result.success).toBe(false)
  })

  it('accepts empty website URL', () => {
    const result = stepEntrepriseSchema.safeParse({
      name: 'OPEN PF',
      legalStatus: 'SAS',
      isMedefMember: false,
      websiteUrl: '',
    })
    expect(result.success).toBe(true)
  })

  it('rejects description over 500 chars', () => {
    const result = stepEntrepriseSchema.safeParse({
      name: 'OPEN PF',
      legalStatus: 'SAS',
      isMedefMember: false,
      description: 'a'.repeat(501),
    })
    expect(result.success).toBe(false)
  })

  it('accepts valid TAHITI number format', () => {
    const result = stepEntrepriseSchema.safeParse({
      name: 'OPEN PF',
      legalStatus: 'SAS',
      isMedefMember: false,
      tahitiNumber: '123456B',
    })
    expect(result.success).toBe(true)
  })

  it('rejects invalid TAHITI number format', () => {
    const result = stepEntrepriseSchema.safeParse({
      name: 'OPEN PF',
      legalStatus: 'SAS',
      isMedefMember: false,
      tahitiNumber: 'ABC',
    })
    expect(result.success).toBe(false)
  })
})

describe('stepActivitesSchema', () => {
  it('accepts a non-empty array of domains', () => {
    const result = stepActivitesSchema.safeParse({ activityDomains: ['cloud', 'audit'] })
    expect(result.success).toBe(true)
  })

  it('rejects empty activityDomains array', () => {
    const result = stepActivitesSchema.safeParse({ activityDomains: [] })
    expect(result.success).toBe(false)
  })
})

describe('stepContactsSchema', () => {
  it('accepts valid contacts with a primary', () => {
    const result = stepContactsSchema.safeParse({
      contacts: [{ name: 'Jean Martin', email: 'jean@example.com', isPrimary: true }],
      rgpdConsent: true,
    })
    expect(result.success).toBe(true)
  })

  it('rejects empty contacts array', () => {
    const result = stepContactsSchema.safeParse({ contacts: [], rgpdConsent: true })
    expect(result.success).toBe(false)
  })

  it('rejects contacts with no primary', () => {
    const result = stepContactsSchema.safeParse({
      contacts: [{ name: 'Jean Martin', email: 'jean@example.com', isPrimary: false }],
      rgpdConsent: true,
    })
    expect(result.success).toBe(false)
  })

  it('rejects invalid email', () => {
    const result = stepContactsSchema.safeParse({
      contacts: [{ name: 'Jean', email: 'not-an-email', isPrimary: false }],
      rgpdConsent: true,
    })
    expect(result.success).toBe(false)
  })

  it('rejects rgpdConsent false', () => {
    const result = stepContactsSchema.safeParse({
      contacts: [{ name: 'Jean Martin', email: 'jean@example.com', isPrimary: true }],
      rgpdConsent: false,
    })
    expect(result.success).toBe(false)
  })
})

describe('adhesionSchema (combined)', () => {
  it('validates a complete valid adhesion', () => {
    const result = adhesionSchema.safeParse({
      name: 'OPEN PF',
      legalStatus: 'Association',
      isMedefMember: false,
      activityDomains: ['audit', 'cloud'],
      contacts: [{ name: 'Marie Dupont', email: 'marie@open.pf', isPrimary: true }],
      rgpdConsent: true,
    })
    expect(result.success).toBe(true)
  })

  it('rejects when rgpdConsent is false', () => {
    const result = adhesionSchema.safeParse({
      name: 'OPEN PF',
      legalStatus: 'Association',
      isMedefMember: false,
      activityDomains: ['cloud'],
      contacts: [{ name: 'Marie Dupont', email: 'marie@open.pf', isPrimary: true }],
      rgpdConsent: false,
    })
    expect(result.success).toBe(false)
  })
})
