interface MemberResultsSummaryProps {
  count: number
  activeLabel?: string | undefined
  q?: string | undefined
}

export function MemberResultsSummary({ count, activeLabel, q }: MemberResultsSummaryProps) {
  const countLabel = `${count} entreprise${count !== 1 ? 's' : ''} adhérente${count !== 1 ? 's' : ''}`
  return (
    <div className="section-head">
      <h2 id="members-count-title">
        <span style={{ color: 'var(--open-magenta)' }}>{count}</span>{' '}
        {count !== 1 ? 'entreprises adhérentes' : 'entreprise adhérente'}
        {activeLabel && (
          <>
            {' '}
            ·{' '}
            <span style={{ fontWeight: 400, fontSize: '0.7em' }}>{activeLabel}</span>
          </>
        )}
      </h2>
      <p aria-live="polite" aria-atomic="true" className="sr-only">
        {countLabel}
        {q && ` pour la recherche « ${q} »`}
        {activeLabel && ` dans le domaine ${activeLabel}`}
      </p>
    </div>
  )
}
