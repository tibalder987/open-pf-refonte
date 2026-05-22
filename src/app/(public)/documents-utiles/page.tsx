import type { Metadata } from 'next'
import Link from 'next/link'
import { CtaBand } from '@/components/public/cta-band'

export const metadata: Metadata = {
  title: 'Documents utiles – OPEN PF',
  description: 'Documents et ressources utiles pour les membres du réseau OPEN PF.',
  alternates: { canonical: '/documents-utiles' },
}

export default function DocumentsUtilesPage() {
  return (
    <>
      <section className="hero hero-simple">
        <div className="hero-inner container">
          <div>
            <nav className="breadcrumb" aria-label="Fil d'Ariane">
              <Link href="/">Accueil</Link> › Documents utiles
            </nav>
            <h1 style={{ color: 'white', marginTop: '8px' }}>Documents utiles.</h1>
            <p className="lead" style={{ marginTop: '20px' }}>
              Ressources et documents mis à disposition par OPEN PF pour ses membres.
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
              Cette section est en cours de constitution.
              <br />
              Revenez bientôt pour accéder aux documents.
            </p>
            <div style={{ marginTop: '24px' }}>
              <Link href="/contact" className="btn btn-secondary">
                Nous contacter
              </Link>
            </div>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  )
}
