import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowIcon } from '@/components/public/arrow-icon'
import { AdhesionForm } from '@/components/adhesion/adhesion-form'
import { buildBreadcrumbJsonLd } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Adhésion',
  description:
    "Rejoignez le cluster numérique de Polynésie française. Intégrez le réseau OPEN PF, accédez aux ressources exclusives et représentez la filière numérique polynésienne.",
  alternates: { canonical: '/adhesion' },
  openGraph: {
    title: 'Adhérer à OPEN PF',
    description:
      'Rejoignez le réseau des professionnels du numérique de Polynésie française et développez votre activité au sein du cluster OPEN.',
    type: 'website',
    url: '/adhesion',
    images: [{ url: '/logo-open.png', width: 512, height: 512, alt: 'OPEN PF' }],
  },
  twitter: { card: 'summary_large_image', images: ['/logo-open.png'] },
}

const AVANTAGES = [
  {
    title: 'Visibilité',
    description:
      "Votre entreprise référencée dans l'annuaire des adhérents, visible par tous les acteurs de la filière.",
  },
  {
    title: 'Réseau',
    description:
      'Accès aux événements OPEN, aux groupes de travail et aux opportunités de mise en relation entre professionnels.',
  },
  {
    title: 'Représentation',
    description:
      'Votre voix portée auprès des institutions publiques et des partenaires institutionnels de la filière numérique.',
  },
  {
    title: 'Ressources',
    description:
      "Accès aux publications, études et ressources exclusives de l'écosystème numérique polynésien.",
  },
]

export default function AdhesionPage() {
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: 'Accueil', href: '/' },
    { name: 'Adhésion', href: '/adhesion' },
  ])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <section className="hero hero-simple">
        <div className="hero-inner container">
          <div>
            <nav className="breadcrumb" aria-label="Fil d'Ariane">
              <Link href="/">Accueil</Link> › Adhésion
            </nav>
            <h1>Rejoignez OPEN.</h1>
            <p className="lead" style={{ marginTop: '20px' }}>
              Intégrez le cluster numérique de Polynésie française et développez votre activité au
              sein d&apos;un réseau de professionnels engagés.
            </p>
            <div className="hero-actions">
              <a href="#formulaire" className="btn">
                Démarrer ma demande <ArrowIcon />
              </a>
              <Link href="/contact" className="btn btn-secondary">
                Nous contacter <ArrowIcon />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-soft" aria-labelledby="avantages-title">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow">Pourquoi rejoindre OPEN</span>
              <h2 id="avantages-title">Les avantages de l&apos;adhésion</h2>
            </div>
          </div>
          <div className="grid-4">
            {AVANTAGES.map((avantage) => (
              <article key={avantage.title} className="card">
                <h3>{avantage.title}</h3>
                <p style={{ marginTop: '12px' }}>{avantage.description}</p>
                <div className="card-line" />
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="formulaire" aria-labelledby="formulaire-title">
        <div className="container" style={{ maxWidth: '800px' }}>
          <div className="section-head">
            <div>
              <span className="eyebrow">Formulaire d&apos;adhésion</span>
              <h2 id="formulaire-title">Votre demande d&apos;adhésion</h2>
            </div>
          </div>
          <AdhesionForm />
        </div>
      </section>
    </>
  )
}
