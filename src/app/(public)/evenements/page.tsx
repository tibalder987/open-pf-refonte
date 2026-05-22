import type { Metadata } from 'next'
import Link from 'next/link'
import { CtaBand } from '@/components/public/cta-band'

export const metadata: Metadata = {
  title: 'Événements OPEN PF',
  description: 'Retrouvez tous les événements organisés par OPEN PF.',
  alternates: { canonical: '/evenements' },
}

export default function EvenementsPage() {
  return (
    <>
      <section className="hero hero-simple">
        <div className="hero-inner container">
          <div>
            <nav className="breadcrumb" aria-label="Fil d'Ariane">
              <Link href="/">Accueil</Link> › Événements
            </nav>
            <h1 style={{ color: 'white', marginTop: '8px' }}>Événements.</h1>
            <p className="lead" style={{ marginTop: '20px' }}>
              Rencontres, conférences et ateliers pour les professionnels du numérique en
              Polynésie française.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div
            style={{
              border: '1px dashed #b8c0d5',
              borderRadius: '22px',
              background: '#fbfcff',
              padding: '48px',
              textAlign: 'center',
            }}
          >
            <p style={{ color: 'var(--muted)', fontSize: '18px' }}>
              Aucun événement à venir pour le moment.
              <br />
              Revenez bientôt ou suivez notre actualité.
            </p>
            <div style={{ marginTop: '24px' }}>
              <Link href="/actualites" className="btn btn-secondary">
                Voir les actualités
              </Link>
            </div>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  )
}
