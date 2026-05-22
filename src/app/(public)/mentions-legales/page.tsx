import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Mentions légales – OPEN PF',
  description:
    "Mentions légales du site OPEN PF – Organisation des Professionnels de l'Économie Numérique de Polynésie française.",
  alternates: { canonical: '/mentions-legales' },
  robots: { index: false },
}

export default function MentionsLegalesPage() {
  return (
    <section className="section">
      <div className="container" style={{ maxWidth: '800px' }}>
        <nav className="breadcrumb" aria-label="Fil d'Ariane">
          <Link href="/">Accueil</Link> › Mentions légales
        </nav>
        <h1 style={{ marginTop: '16px' }}>Mentions légales</h1>
        <div className="card" style={{ marginTop: '32px' }}>
          <h2>Éditeur</h2>
          <p style={{ marginTop: '12px' }}>
            OPEN – Organisation des Professionnels de l&apos;Économie Numérique
            <br />
            Polynésie française
            <br />
            <a href="mailto:contact@open.pf">contact@open.pf</a>
          </p>
          <h2 style={{ marginTop: '24px' }}>Hébergement</h2>
          <p style={{ marginTop: '12px' }}>Ce site est hébergé par Vercel Inc.</p>
          <h2 style={{ marginTop: '24px' }}>Propriété intellectuelle</h2>
          <p style={{ marginTop: '12px' }}>
            Le contenu de ce site est la propriété d&apos;OPEN PF. Toute reproduction est interdite
            sans autorisation préalable.
          </p>
        </div>
      </div>
    </section>
  )
}
