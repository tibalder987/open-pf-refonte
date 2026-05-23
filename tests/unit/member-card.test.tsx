import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemberCard } from '@/components/annuaire/member-card'

const BASE = {
  slug: 'bbs',
  name: 'BBS Tahiti',
  logoUrl: null,
  description: 'Ingénierie systèmes et réseaux.',
  primaryDomain: 'Infrastructure',
}

describe('MemberCard', () => {
  it('renders member name', () => {
    render(<MemberCard {...BASE} />)
    expect(screen.getByRole('heading', { name: 'BBS Tahiti' })).toBeInTheDocument()
  })

  it('renders primaryDomain tag when present', () => {
    render(<MemberCard {...BASE} />)
    expect(screen.getByText('Infrastructure')).toBeInTheDocument()
  })

  it('does not render domain tag when absent', () => {
    render(<MemberCard {...BASE} primaryDomain={null} />)
    expect(screen.queryByText('Infrastructure')).not.toBeInTheDocument()
  })

  it('renders description truncated at 110 chars', () => {
    const long = 'A'.repeat(120)
    render(<MemberCard {...BASE} description={long} />)
    expect(screen.getByText(`${'A'.repeat(110)}…`)).toBeInTheDocument()
  })

  it('renders description as-is when short enough', () => {
    render(<MemberCard {...BASE} />)
    expect(screen.getByText('Ingénierie systèmes et réseaux.')).toBeInTheDocument()
  })

  it('renders "Voir la fiche" link with correct href', () => {
    render(<MemberCard {...BASE} />)
    const link = screen.getByRole('link', { name: /voir la fiche de bbs tahiti/i })
    expect(link).toHaveAttribute('href', '/adherents/bbs')
  })

  it('article is labelled by the h3', () => {
    render(<MemberCard {...BASE} />)
    const article = screen.getByRole('article')
    const h3 = screen.getByRole('heading', { name: 'BBS Tahiti' })
    expect(article).toHaveAttribute('aria-labelledby', h3.id)
  })

  it('renders fallback MemberLogo when logoUrl is null', () => {
    render(<MemberCard {...BASE} />)
    const fallback = document.querySelector('.member-logo-fallback')
    expect(fallback).toBeInTheDocument()
  })
})
