import Link from 'next/link'

interface Domain {
  id: string
  label: string
}

interface MemberFiltersProps {
  domains: Domain[]
  activeId?: string | undefined
  q?: string | undefined
}

export function MemberFilters({ domains, activeId, q }: MemberFiltersProps) {
  if (domains.length === 0) return null

  const allHref = q ? `/adherents?q=${encodeURIComponent(q)}` : '/adherents'

  return (
    <div className="container" style={{ paddingTop: '28px', paddingBottom: '4px' }}>
      <div className="filters" role="group" aria-label="Filtrer par domaine d'activité">
        <Link
          href={allHref}
          className={`filter-chip light${!activeId ? ' active' : ''}`}
          aria-current={!activeId ? 'true' : undefined}
        >
          Tous les domaines
        </Link>
        {domains.map((d) => {
          const params = new URLSearchParams()
          if (q) params.set('q', q)
          params.set('domaine', d.id)
          return (
            <Link
              key={d.id}
              href={`/adherents?${params.toString()}`}
              className={`filter-chip light${activeId === d.id ? ' active' : ''}`}
              aria-current={activeId === d.id ? 'true' : undefined}
            >
              {d.label}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
