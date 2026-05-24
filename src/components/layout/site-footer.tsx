import Link from 'next/link'
import Image from 'next/image'

export function SiteFooter() {
  return (
    <footer className="site-footer" role="contentinfo">
      <div className="footer-grid container">
        {/* Brand + description */}
        <div>
          <Link href="/" className="footer-brand" aria-label="OPEN Polynésie française, accueil">
            <Image
              src="/logo-open.png"
              alt="OPEN – Organisation des Professionnels de l'Économie Numérique"
              width={149}
              height={68}
              style={{ height: '60px', width: 'auto' }}
            />
          </Link>
          <p style={{ marginTop: '18px' }}>
            OPEN fédère les entreprises du numérique en Polynésie française pour représenter,
            promouvoir et développer la filière.
          </p>
        </div>

        {/* Le réseau */}
        <nav aria-labelledby="footer-reseau">
          <h2 id="footer-reseau">Le réseau</h2>
          <ul className="footer-links">
            <li>
              <Link href="/reseau">Qui sommes-nous&nbsp;?</Link>
            </li>
            <li>
              <Link href="/reseau#missions">Nos missions</Link>
            </li>
            <li>
              <Link href="/reseau#gouvernance">Gouvernance</Link>
            </li>
            <li>
              <Link href="/adhesion">Nous rejoindre</Link>
            </li>
          </ul>
        </nav>

        {/* Adhérents */}
        <nav aria-labelledby="footer-adherents">
          <h2 id="footer-adherents">Adhérents</h2>
          <ul className="footer-links">
            <li>
              <Link href="/adherents">Annuaire des adhérents</Link>
            </li>
            <li>
              <Link href="/adhesion">Avantages membres</Link>
            </li>
            <li>
              <Link href="/adhesion">Devenir adhérent</Link>
            </li>
          </ul>
        </nav>

        {/* Ressources */}
        <nav aria-labelledby="footer-ressources">
          <h2 id="footer-ressources">Ressources</h2>
          <ul className="footer-links">
            <li>
              <Link href="/actualites">Actualités</Link>
            </li>
            <li>
              <Link href="/offres-emploi">Offres d&apos;emploi</Link>
            </li>
            <li>
              <Link href="/documents-utiles">Documents utiles</Link>
            </li>
          </ul>
        </nav>

        {/* Contact */}
        <div>
          <h2 id="footer-contact">Contact</h2>
          <ul className="footer-links" aria-labelledby="footer-contact">
            <li>
              Papeete, Tahiti
              <br />
              Polynésie française
            </li>
            <li>
              <a href="mailto:contact@open.pf">contact@open.pf</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom container">
        <span>© OPEN – Organisation des Professionnels de l&apos;Économie Numérique</span>
        <span>
          <Link href="/mentions-legales">Mentions légales</Link>
          {' · '}
          <Link href="/confidentialite">Politique de confidentialité</Link>
        </span>
      </div>
    </footer>
  )
}
