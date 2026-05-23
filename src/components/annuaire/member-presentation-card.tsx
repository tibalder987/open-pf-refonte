interface MemberPresentationCardProps {
  name: string
  description: string | null
  yearFounded: number | null
  employeeCount: number | null
  isMedefMember: boolean
}

export function MemberPresentationCard({
  name: _name,
  description,
  yearFounded,
  employeeCount,
  isMedefMember,
}: MemberPresentationCardProps) {
  const hasFacts = yearFounded !== null || employeeCount !== null || isMedefMember

  return (
    <article className="member-presentation-card" aria-labelledby="presentation-heading">
      <h2 id="presentation-heading">Présentation</h2>

      {description ? (
        <p className="presentation-text">{description}</p>
      ) : (
        <p className="presentation-text" style={{ color: 'var(--muted)' }}>
          Membre actif du réseau OPEN Polynésie française.
        </p>
      )}

      {hasFacts && (
        <div className="member-facts">
          {yearFounded && (
            <div className="member-fact">
              <span className="member-fact-value">{yearFounded}</span>
              <span className="member-fact-label">Année de création</span>
            </div>
          )}
          {employeeCount !== null && (
            <div className="member-fact">
              <span className="member-fact-value">{employeeCount}+</span>
              <span className="member-fact-label">Collaborateurs</span>
            </div>
          )}
          {isMedefMember && (
            <div className="member-fact">
              <span className="member-fact-value">✓</span>
              <span className="member-fact-label">Membre MEDEF PF</span>
            </div>
          )}
        </div>
      )}
    </article>
  )
}

