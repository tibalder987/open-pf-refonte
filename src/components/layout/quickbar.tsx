'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function QuickBar() {
  const pathname = usePathname()

  return (
    <nav className="quickbar" aria-label="Actions rapides mobile">
      <Link
        href="/adherents"
        aria-current={pathname.startsWith('/adherents') ? 'page' : undefined}
      >
        Annuaire
      </Link>
      <Link href="/adhesion" className="quickbar__primary">
        Adhérer
      </Link>
      <Link href="/contact" aria-current={pathname === '/contact' ? 'page' : undefined}>
        Contact
      </Link>
    </nav>
  )
}
