interface MemberDomainsCardProps {
  domains: string[]
}

export function MemberDomainsCard({ domains }: MemberDomainsCardProps) {
  return (
    <article className="member-domains-card" aria-labelledby="domains-heading">
      <h2 id="domains-heading">Domaines d&apos;activité</h2>
      <div className="member-domains-grid">
        {domains.map((d) => (
          <span key={d} className="member-domain-row">
            <span className="member-domain-dot" aria-hidden="true" />
            {d}
          </span>
        ))}
      </div>
    </article>
  )
}
