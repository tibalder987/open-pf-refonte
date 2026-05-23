import Link from 'next/link'

interface MemberProfileHeroProps {
  name: string
  slug: string
  domains: string[]
}

export function MemberProfileHero({ name, domains }: MemberProfileHeroProps) {
  return (
    <section className="hero">
      <div className="hero-inner container" style={{ gridTemplateColumns: '1fr', maxWidth: '880px' }}>
        <div>
          <nav className="breadcrumb" aria-label="Fil d'Ariane">
            <Link href="/">Accueil</Link> › <Link href="/adherents">Adhérents OPEN</Link> › {name}
          </nav>
          <p className="eyebrow">Adhérent OPEN</p>
          <h1>{name}</h1>
          {domains.length > 0 && (
            <div className="filters" style={{ margin: '18px 0 0' }}>
              {domains.slice(0, 4).map((d) => (
                <span key={d} className="filter-chip">
                  {d}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
