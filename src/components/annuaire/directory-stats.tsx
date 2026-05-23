interface DirectoryStatsProps {
  memberCount: number
  domainCount: number
  employeeCount: number | null
}

export function DirectoryStats({ memberCount, domainCount, employeeCount }: DirectoryStatsProps) {
  const twoOnly = employeeCount === null

  return (
    <div
      className={`directory-stats container${twoOnly ? ' directory-stats--two' : ''}`}
      aria-label="Chiffres clés de l'annuaire"
    >
      <article className="directory-stat-card">
        <b>{memberCount}</b>
        <span>adhérents référencés</span>
      </article>

      <article className="directory-stat-card">
        <b>{domainCount}</b>
        <span>domaines d&apos;activité</span>
      </article>

      {employeeCount !== null && (
        <article className="directory-stat-card">
          <b>{employeeCount}+</b>
          <span>collaborateurs</span>
        </article>
      )}
    </div>
  )
}
