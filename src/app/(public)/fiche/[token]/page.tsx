import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getMemberByToken } from '@/lib/actions/member-profile'
import { ProfileForm } from '@/components/fiche/profile-form'

export const metadata: Metadata = {
  title: 'Compléter ma fiche — OPEN PF',
  description: "Complétez la fiche de votre entreprise dans l'annuaire OPEN PF.",
  robots: { index: false, follow: false },
}

interface Props {
  params: Promise<{ token: string }>
}

export default async function FichePage({ params }: Props) {
  const { token } = await params
  const memberData = await getMemberByToken(token).catch(() => null)

  if (!memberData) notFound()

  return (
    <>
      {/* Dark hero per PDF 09 (fiche adhérent sécurisée) */}
      <section className="hero">
        <div className="hero-inner container" style={{ gridTemplateColumns: '1fr', maxWidth: '960px' }}>
          <div>
            <nav className="breadcrumb" aria-label="Fil d'Ariane">
              <Link href="/">Accueil</Link> › <Link href="/adherents">Adhérents OPEN</Link> › Mon profil public
            </nav>
            <span className="eyebrow">Espace adhérent</span>
            <h1>Fiche adhérent</h1>
            <p className="lead" style={{ marginTop: '12px' }}>
              Complétez les informations de votre entreprise. Elles seront publiées dans l&apos;annuaire
              après validation par le bureau d&apos;OPEN.
            </p>
            <div className="fiche-session-badge">
              <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M12 1a5 5 0 0 1 5 5v2h1a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2h1V6a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v2h6V6a3 3 0 0 0-3-3z"
                />
              </svg>
              Session sécurisée
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--soft)', paddingTop: '40px' }}>
        <div className="container">
          <div className="fiche-page-grid">
            {/* Main form */}
            <div>
              <ProfileForm token={token} initialData={memberData} />
            </div>

            {/* Sidebar */}
            <aside className="fiche-page-sidebar" aria-label="État de la fiche">
              <div className="adhesion-progress-card">
                <p className="adhesion-progress-card-title">Complétude du profil</p>
                <ul className="fiche-completeness-list">
                  <li className="fiche-completeness-item fiche-completeness-item--done">
                    <span className="fiche-completeness-icon" aria-hidden="true">✓</span>
                    Raison sociale
                  </li>
                  <li className="fiche-completeness-item">
                    <span className="fiche-completeness-icon fiche-completeness-icon--empty" aria-hidden="true">○</span>
                    Logo
                  </li>
                  <li className="fiche-completeness-item">
                    <span className="fiche-completeness-icon fiche-completeness-icon--empty" aria-hidden="true">○</span>
                    Description
                  </li>
                  <li className="fiche-completeness-item">
                    <span className="fiche-completeness-icon fiche-completeness-icon--empty" aria-hidden="true">○</span>
                    Domaines d&apos;activité
                  </li>
                  <li className="fiche-completeness-item">
                    <span className="fiche-completeness-icon fiche-completeness-icon--empty" aria-hidden="true">○</span>
                    Coordonnées
                  </li>
                </ul>
              </div>

              <div className="adhesion-advisory-card">
                <h3>Publier votre fiche</h3>
                <p>
                  Une fois soumise, votre fiche sera vérifiée par l&apos;équipe OPEN et publiée dans
                  les 48 h ouvrées.
                </p>
                <Link href="/contact" className="btn btn-secondary btn-small">
                  Une question ?
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  )
}
