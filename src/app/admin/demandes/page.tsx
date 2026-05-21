import type { Metadata } from 'next'
import Link from 'next/link'
import { getDb } from '@/lib/db'
import { members } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'

export const metadata: Metadata = { title: "Demandes d'adhésion — Admin OPEN PF" }

export default async function DemandesPage() {
  const db = getDb()
  const demandes = await db
    .select({
      id: members.id,
      name: members.name,
      submittedAt: members.submittedAt,
      tahitiNumber: members.tahitiNumber,
      isMedefMember: members.isMedefMember,
    })
    .from(members)
    .where(eq(members.status, 'submitted'))
    .orderBy(desc(members.submittedAt))

  return (
    <>
      <div className="admin-top">
        <h1>Demandes d&apos;adhésion</h1>
        <span className="badge badge-large">{demandes.length}</span>
      </div>

      {demandes.length === 0 ? (
        <div
          className="card"
          style={{ textAlign: 'center', padding: '48px', color: 'var(--muted)' }}
        >
          Aucune demande en attente.
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Entreprise</th>
                <th>N° TAHITI</th>
                <th>MEDEF</th>
                <th>Déposée le</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {demandes.map((d) => (
                <tr key={d.id}>
                  <td style={{ fontWeight: 600 }}>{d.name}</td>
                  <td style={{ color: 'var(--muted)' }}>{d.tahitiNumber ?? '—'}</td>
                  <td>{d.isMedefMember ? '✓' : '—'}</td>
                  <td style={{ color: 'var(--muted)', fontSize: '13px' }}>
                    {d.submittedAt ? new Date(d.submittedAt).toLocaleDateString('fr-FR') : '—'}
                  </td>
                  <td>
                    <Link href={`/admin/demandes/${d.id}`} className="btn btn-secondary btn-small">
                      Examiner
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}
