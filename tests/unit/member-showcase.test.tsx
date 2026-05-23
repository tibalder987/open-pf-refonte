import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemberShowcase } from '@/components/annuaire/member-showcase'

const MEMBERS = [
  { slug: 'bbs', name: 'BBS Tahiti', logoUrl: null, primaryDomain: 'Infrastructure' },
  { slug: 'clusir', name: 'CLUSIR Tahiti', logoUrl: null, primaryDomain: 'Cybersécurité' },
  { slug: 'delta', name: 'DELTA Consulting', logoUrl: null, primaryDomain: null },
]

describe('MemberShowcase', () => {
  it('renders nothing when members list is empty', () => {
    const { container } = render(<MemberShowcase members={[]} />)
    expect(container.firstChild).toBeNull()
  })

  it('renders a listitem for each member', () => {
    render(<MemberShowcase members={MEMBERS} />)
    expect(screen.getAllByRole('listitem')).toHaveLength(3)
  })

  it('each listitem navigates to the correct fiche', () => {
    render(<MemberShowcase members={MEMBERS} />)
    const items = screen.getAllByRole('listitem')
    expect(items[0]).toHaveAttribute('href', '/adherents/bbs')
    expect(items[1]).toHaveAttribute('href', '/adherents/clusir')
  })

  it('renders member names', () => {
    render(<MemberShowcase members={MEMBERS} />)
    expect(screen.getByText('BBS Tahiti')).toBeInTheDocument()
    expect(screen.getByText('CLUSIR Tahiti')).toBeInTheDocument()
  })

  it('renders domain when present', () => {
    render(<MemberShowcase members={MEMBERS} />)
    expect(screen.getByText('Infrastructure')).toBeInTheDocument()
    expect(screen.getByText('Cybersécurité')).toBeInTheDocument()
  })

  it('does not render domain span when domain is null', () => {
    render(<MemberShowcase members={MEMBERS} />)
    const domainSpans = document.querySelectorAll('.showcase-domain')
    expect(domainSpans).toHaveLength(2)
  })

  it('aria-label on listitem includes domain when present', () => {
    render(<MemberShowcase members={MEMBERS} />)
    const bbs = screen.getByRole('listitem', { name: /bbs tahiti — infrastructure/i })
    expect(bbs).toBeInTheDocument()
  })

  it('aria-label has no trailing em dash when domain is absent', () => {
    render(<MemberShowcase members={MEMBERS} />)
    const delta = screen.getByRole('listitem', { name: 'DELTA Consulting' })
    expect(delta.getAttribute('aria-label')).toBe('DELTA Consulting')
  })
})
