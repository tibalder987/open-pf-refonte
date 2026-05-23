import Link from 'next/link'

export function DirectoryHero() {
  return (
    <section className="hero hero-directory">
      <div className="hero-inner container">
        <div>
          <nav className="breadcrumb" aria-label="Fil d'Ariane">
            <Link href="/">Accueil</Link> › Adhérents OPEN
          </nav>
          <p className="eyebrow">Annuaire OPEN</p>
          <h1>Les acteurs du numérique polynésien.</h1>
          <p className="lead" style={{ marginTop: '20px' }}>
            Identifiez les entreprises, experts et organisations membres d&apos;OPEN par domaine de
            compétence, activité ou nom d&apos;entreprise.
          </p>
        </div>
      </div>
    </section>
  )
}
