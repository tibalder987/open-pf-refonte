import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Politique de confidentialité – OPEN PF',
  description: 'Politique de confidentialité et traitement des données personnelles – OPEN PF.',
  alternates: { canonical: '/confidentialite' },
  robots: { index: false },
}

export default function ConfidentialitePage() {
  return (
    <section className="section">
      <div className="container" style={{ maxWidth: '800px' }}>
        <nav className="breadcrumb" aria-label="Fil d'Ariane">
          <Link href="/">Accueil</Link> › Politique de confidentialité
        </nav>
        <h1 style={{ marginTop: '16px' }}>Politique de confidentialité</h1>
        <div className="card" style={{ marginTop: '32px' }}>
          <h2>Collecte des données</h2>
          <p style={{ marginTop: '12px' }}>
            OPEN PF collecte des données personnelles uniquement dans le cadre de la gestion des
            adhésions et de la communication avec ses membres.
          </p>
          <h2 style={{ marginTop: '24px' }}>Utilisation des données</h2>
          <p style={{ marginTop: '12px' }}>
            Les données collectées sont utilisées pour la gestion des adhésions, la communication
            institutionnelle et la publication de l&apos;annuaire des membres (avec consentement).
          </p>
          <h2 style={{ marginTop: '24px' }}>Vos droits</h2>
          <p style={{ marginTop: '12px' }}>
            Conformément au RGPD, vous disposez d&apos;un droit d&apos;accès, de rectification et de
            suppression de vos données. Contactez-nous à{' '}
            <a href="mailto:contact@open.pf">contact@open.pf</a>.
          </p>
        </div>
      </div>
    </section>
  )
}
