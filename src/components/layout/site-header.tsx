'use client'

import Link from 'next/link'
import dynamic from 'next/dynamic'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

const AdhesionModal = dynamic(
  () => import('@/components/adhesion/adhesion-modal').then((m) => m.AdhesionModal),
  { ssr: false },
)

const NAV_LINKS = [
  { href: '/reseau', label: 'Le réseau' },
  { href: '/adherents', label: 'Adhérents' },
  { href: '/actualites', label: 'Actualités' },
  { href: '/offres-emploi', label: "Offres d'emploi" },
  { href: '/contact', label: 'Contact' },
]

export function SiteHeader() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const pathname = usePathname()
  const menuBtnRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  // Body scroll lock + focus management
  useEffect(() => {
    document.body.classList.toggle('nav-open', isDrawerOpen)
    if (isDrawerOpen) {
      const first = panelRef.current?.querySelector<HTMLElement>('a,button')
      first?.focus()
    } else {
      menuBtnRef.current?.focus()
    }
    return () => document.body.classList.remove('nav-open')
  }, [isDrawerOpen])

  // Keyboard navigation (Escape + focus trap)
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!isDrawerOpen) return
      if (e.key === 'Escape') {
        setIsDrawerOpen(false)
        return
      }
      if (e.key !== 'Tab') return
      const focusable = Array.from(
        panelRef.current?.querySelectorAll<HTMLElement>('a,button') ?? [],
      )
      if (!focusable.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last?.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isDrawerOpen])

  const closeDrawer = () => setIsDrawerOpen(false)
  const openModal = () => setIsModalOpen(true)
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`)

  return (
    <>
      <a className="skip-link" href="#contenu">
        Aller au contenu principal
      </a>

      <header className="site-header" role="banner">
        <div className="header-inner container">
          <Link href="/" className="brand" aria-label="OPEN Polynésie française, accueil">
            <span className="open-logo-mark" aria-hidden="true" />
            <span>
              <span className="brand-word">OPEN</span>
              <span className="brand-sub">
                Organisation des Professionnels
                <br />
                de l&apos;Économie Numérique
              </span>
            </span>
          </Link>

          <nav
            id="navigation-principale"
            className="primary-nav"
            aria-label="Navigation principale"
          >
            <ul>
              {NAV_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    aria-current={isActive(href) ? 'page' : undefined}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="header-actions">
            <button
              type="button"
              className="btn"
              onClick={openModal}
              aria-haspopup="dialog"
            >
              Adhérer{' '}
              <svg className="icon" aria-hidden="true" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M13.2 5.4 20 12l-6.8 6.6-1.4-1.5 4.1-4.1H4v-2h11.9l-4.1-4.1 1.4-1.5z"
                />
              </svg>
            </button>
          </div>

          <button
            ref={menuBtnRef}
            className="nav-toggle"
            type="button"
            aria-controls="mobile-nav-panel"
            aria-expanded={isDrawerOpen}
            aria-label={isDrawerOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            onClick={() => setIsDrawerOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      {isDrawerOpen && (
        <div className="mobile-nav" id="mobile-nav-panel" role="presentation">
          <button
            className="mobile-nav__backdrop"
            aria-label="Fermer le menu"
            onClick={closeDrawer}
          />
          <div
            className="mobile-nav__panel"
            role="dialog"
            aria-modal="true"
            aria-label="Menu principal"
            ref={panelRef}
          >
            <div className="mobile-nav__head">
              <Link
                href="/"
                className="brand"
                aria-label="OPEN PF - Accueil"
                onClick={closeDrawer}
                style={{ minWidth: 0 }}
              >
                <span
                  className="open-logo-mark"
                  aria-hidden="true"
                  style={{ width: '44px', height: '44px' }}
                />
                <span className="brand-word" style={{ fontSize: '32px' }}>
                  OPEN
                </span>
              </Link>
              <button
                className="mobile-nav__close"
                type="button"
                aria-label="Fermer le menu"
                onClick={closeDrawer}
              >
                ×
              </button>
            </div>

            <nav className="mobile-nav__links" aria-label="Navigation mobile">
              {NAV_LINKS.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  aria-current={isActive(href) ? 'page' : undefined}
                  onClick={closeDrawer}
                >
                  {label}
                </Link>
              ))}
            </nav>

            <div className="mobile-nav__actions">
              <button
                type="button"
                className="btn"
                style={{ width: '100%', justifyContent: 'center' }}
                aria-haspopup="dialog"
                onClick={() => {
                  closeDrawer()
                  openModal()
                }}
              >
                Adhérer à OPEN
              </button>
              <Link
                className="btn btn-secondary"
                href="/adherents"
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={closeDrawer}
              >
                Explorer l&apos;annuaire
              </Link>
            </div>
          </div>
        </div>
      )}

      <AdhesionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}
