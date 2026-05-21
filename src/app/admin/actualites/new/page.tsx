import type { Metadata } from 'next'
import Link from 'next/link'
import { NewsForm } from '@/components/admin/news-form'

export const metadata: Metadata = { title: 'Nouvelle actualité — Admin OPEN PF' }

export default function NewActualitePage() {
  return (
    <>
      <div className="admin-top">
        <div>
          <nav style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '8px' }}>
            <Link href="/admin/actualites">Actualités</Link> › Nouvelle
          </nav>
          <h1>Nouvelle actualité</h1>
        </div>
      </div>
      <NewsForm />
    </>
  )
}
