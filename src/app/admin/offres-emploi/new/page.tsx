import type { Metadata } from 'next'
import Link from 'next/link'
import { JobForm } from '@/components/admin/job-form'

export const metadata: Metadata = { title: 'Nouvelle offre — Admin OPEN PF' }

export default function NewJobPage() {
  return (
    <>
      <div className="admin-top">
        <div>
          <nav style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '8px' }}>
            <Link href="/admin/offres-emploi">Offres</Link> › Nouvelle
          </nav>
          <h1>Nouvelle offre d&apos;emploi</h1>
        </div>
      </div>
      <JobForm />
    </>
  )
}
