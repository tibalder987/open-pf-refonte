import { MemberCard } from './member-card'

interface Member {
  slug: string
  name: string
  logoUrl: string | null
  description: string | null
  primaryDomain: string | null
}

interface MemberGridProps {
  list: Member[]
  q?: string | undefined
  activeLabel?: string | undefined
}

export function MemberGrid({ list, q, activeLabel }: MemberGridProps) {
  if (list.length === 0) {
    return (
      <div className="empty-state">
        <svg className="empty-state__icon" viewBox="0 0 48 48" aria-hidden="true" fill="none">
          <circle cx="22" cy="22" r="14" stroke="currentColor" strokeWidth="3" />
          <path d="m32 32 9 9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          <path
            d="M17 22h10M22 17v10"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
        <p className="empty-state__title">Aucun résultat</p>
        <p className="empty-state__text">
          {q
            ? `Aucune entreprise ne correspond à « ${q} »${activeLabel ? ` dans le domaine ${activeLabel}` : ''}.`
            : `Aucune entreprise dans ce domaine pour le moment.`}
        </p>
        {/* Plain <a> (not next/link) on purpose: a real reset of the
            directory state benefits from a full page load — empties the search
            input, clears RSC cache, and reliably drops the search params even
            when current pathname === target pathname (which next/link can
            otherwise soft-navigate without updating the URL bar). */}
        <a href="/adherents" className="btn btn-secondary empty-state__action">
          Réinitialiser les filtres
        </a>
      </div>
    )
  }

  return (
    <div className="members-grid">
      {list.map((member) => (
        <MemberCard key={member.slug} {...member} />
      ))}
    </div>
  )
}
