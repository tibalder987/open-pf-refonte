import type { Metadata } from 'next'
import Link from 'next/link'
import { getDb } from '@/lib/db'
import { members } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'

export const metadata: Metadata = { title: 'Fiches à valider — Admin OPEN PF' }

export default async function FichesPage() {
  const db = getDb()
  // "Fiches à valider" = membres actifs dont la fiche a été mise à jour récemment
  // In the current model, submitted members have their fiches pending admin review
  const list = await db
    .select({
      id: members.id,
      name: members.name,
      updatedAt: members.updatedAt,
      logoUrl: members.logoUrl,
    })
    .from(members)
    .where(eq(members.status, 'submitted'))
    .orderBy(desc(members.updatedAt))

  return (
    <>
      <div className="admin-top">
        <h1>Fiches à valider</h1>
        <span className="badge badge-large">{list.length}</span>
      </div>

      {list.length === 0 ? (
        <div
          className="card"
          style={{ textAlign: 'center', padding: '48px', color: 'var(--muted)' }}
        >
          Aucune fiche en attente de validation.
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Entreprise</th>
                <th>Mise à jour</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {list.map((m) => (
                <tr key={m.id}>
                  <td style={{ fontWeight: 600 }}>{m.name}</td>
                  <td style={{ color: 'var(--muted)', fontSize: '13px' }}>
                    {new Date(m.updatedAt).toLocaleDateString('fr-FR')}
                  </td>
                  <td>
                    <Link href={`/admin/demandes/${m.id}`} className="btn btn-secondary btn-small">
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
