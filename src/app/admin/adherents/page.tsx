import type { Metadata } from 'next'
import Link from 'next/link'
import { getDb } from '@/lib/db'
import { members } from '@/lib/db/schema'
import { desc } from 'drizzle-orm'

export const metadata: Metadata = { title: 'Adhérents — Admin OPEN PF' }

const STATUS_LABELS: Record<string, string> = {
  draft: 'Brouillon',
  submitted: 'En attente',
  active: 'Actif',
  inactive: 'Inactif',
}

export default async function AdherentsPage() {
  const db = getDb()
  const list = await db
    .select({
      id: members.id,
      name: members.name,
      status: members.status,
      submittedAt: members.submittedAt,
      reviewedAt: members.reviewedAt,
    })
    .from(members)
    .orderBy(desc(members.createdAt))

  return (
    <>
      <div className="admin-top">
        <h1>Adhérents</h1>
        <span style={{ color: 'var(--muted)', fontSize: '14px' }}>{list.length} entreprises</span>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="table">
          <thead>
            <tr>
              <th>Entreprise</th>
              <th>Statut</th>
              <th>Déposé</th>
              <th>Validé</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {list.map((m) => (
              <tr key={m.id}>
                <td style={{ fontWeight: 600 }}>{m.name}</td>
                <td>
                  <span className={`status-badge status-badge--${m.status}`}>
                    {STATUS_LABELS[m.status] ?? m.status}
                  </span>
                </td>
                <td style={{ color: 'var(--muted)', fontSize: '13px' }}>
                  {m.submittedAt ? new Date(m.submittedAt).toLocaleDateString('fr-FR') : '—'}
                </td>
                <td style={{ color: 'var(--muted)', fontSize: '13px' }}>
                  {m.reviewedAt ? new Date(m.reviewedAt).toLocaleDateString('fr-FR') : '—'}
                </td>
                <td>
                  <Link href={`/admin/adherents/${m.id}`} className="btn btn-secondary btn-small">
                    Voir
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
