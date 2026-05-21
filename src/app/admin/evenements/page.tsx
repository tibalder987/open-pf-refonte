import type { Metadata } from 'next'
import Link from 'next/link'
import { getDb } from '@/lib/db'
import { events } from '@/lib/db/schema'
import { desc } from 'drizzle-orm'

export const metadata: Metadata = { title: 'Événements — Admin OPEN PF' }

export default async function EvenementsAdminPage() {
  const db = getDb()
  const list = await db
    .select({
      id: events.id,
      title: events.title,
      startsAt: events.startsAt,
      isPublished: events.isPublished,
      location: events.location,
    })
    .from(events)
    .orderBy(desc(events.startsAt))

  return (
    <>
      <div className="admin-top">
        <h1>Événements</h1>
        <Link href="/admin/evenements/new" className="btn">
          + Nouvel événement
        </Link>
      </div>
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {list.length === 0 ? (
          <p style={{ padding: '32px', color: 'var(--muted)', textAlign: 'center' }}>
            Aucun événement.
          </p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Titre</th>
                <th>Date</th>
                <th>Lieu</th>
                <th>Publié</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {list.map((e) => (
                <tr key={e.id}>
                  <td style={{ fontWeight: 600 }}>{e.title}</td>
                  <td style={{ color: 'var(--muted)', fontSize: '13px' }}>
                    {new Date(e.startsAt).toLocaleDateString('fr-FR')}
                  </td>
                  <td style={{ color: 'var(--muted)' }}>{e.location ?? '—'}</td>
                  <td>{e.isPublished ? '✓' : '—'}</td>
                  <td>
                    <Link
                      href={`/admin/evenements/${e.id}`}
                      className="btn btn-secondary btn-small"
                    >
                      Éditer
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  )
}
