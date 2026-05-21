import type { Metadata } from 'next'
import { getDb } from '@/lib/db'
import { siteStats, teamMembers, timelineEvents } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { SiteStatsForm } from '@/components/admin/site-stats-form'

export const metadata: Metadata = { title: 'Paramètres — Admin OPEN PF' }

export default async function ParametresPage() {
  const db = getDb()
  const [stats] = await db.select().from(siteStats).where(eq(siteStats.id, 1)).limit(1)
  const bureau = await db.select().from(teamMembers).orderBy(teamMembers.sortOrder)
  const timeline = await db.select().from(timelineEvents).orderBy(timelineEvents.year)

  return (
    <>
      <div className="admin-top">
        <h1>Paramètres</h1>
      </div>

      <div style={{ display: 'grid', gap: '24px' }}>
        <section className="card">
          <h2>Chiffres clés du site</h2>
          <p style={{ color: 'var(--muted)', fontSize: '14px', marginBottom: '20px' }}>
            Ces chiffres apparaissent sur la page d&apos;accueil et sont saisis manuellement par le
            bureau.
          </p>
          <SiteStatsForm currentCount={stats?.employeeCount ?? null} />
        </section>

        <section className="card">
          <h2>Bureau OPEN ({bureau.length} membres)</h2>
          <table className="table">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Rôle</th>
                <th>Actif</th>
              </tr>
            </thead>
            <tbody>
              {bureau.map((m) => (
                <tr key={m.id}>
                  <td>{m.fullName}</td>
                  <td style={{ color: 'var(--muted)' }}>{m.role}</td>
                  <td>{m.isActive ? '✓' : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="card">
          <h2>Frise chronologique</h2>
          <table className="table">
            <thead>
              <tr>
                <th>Année</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {timeline.map((t) => (
                <tr key={t.id}>
                  <td style={{ fontWeight: 700, color: 'var(--open-magenta)' }}>{t.year}</td>
                  <td>{t.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </>
  )
}
