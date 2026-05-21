import type { Metadata } from 'next'
import Link from 'next/link'
import { auth } from '@/lib/auth/session'
import { getDb } from '@/lib/db'
import { members, news } from '@/lib/db/schema'
import { eq, count, desc } from 'drizzle-orm'
import { ArrowIcon } from '@/components/public/arrow-icon'

export const metadata: Metadata = { title: 'Dashboard — Admin OPEN PF' }

async function getDashboardData() {
  const db = getDb()
  const [total, pending, active, inactive] = await Promise.all([
    db.select({ count: count() }).from(members),
    db.select({ count: count() }).from(members).where(eq(members.status, 'submitted')),
    db.select({ count: count() }).from(members).where(eq(members.status, 'active')),
    db.select({ count: count() }).from(members).where(eq(members.status, 'inactive')),
  ])

  const recentDemandes = await db
    .select({ id: members.id, name: members.name, submittedAt: members.submittedAt })
    .from(members)
    .where(eq(members.status, 'submitted'))
    .orderBy(desc(members.submittedAt))
    .limit(5)

  const recentNews = await db
    .select({ id: news.id, title: news.title, status: news.status })
    .from(news)
    .orderBy(desc(news.updatedAt))
    .limit(5)

  return {
    total: total[0]?.count ?? 0,
    pending: pending[0]?.count ?? 0,
    active: active[0]?.count ?? 0,
    inactive: inactive[0]?.count ?? 0,
    recentDemandes,
    recentNews,
  }
}

export default async function AdminDashboard() {
  const session = await auth()
  const data = await getDashboardData()

  return (
    <>
      <div className="admin-top">
        <div>
          <h1>Bonjour, {session?.user?.name ?? 'Admin'}</h1>
          <p>Voici l&apos;activité du bureau OPEN.</p>
        </div>
        <Link href="/" className="btn btn-secondary">
          Retour au site <ArrowIcon />
        </Link>
      </div>

      <div className="kpi-grid">
        <article className="card kpi">
          <p>Adhérents actifs</p>
          <b>{data.active}</b>
        </article>
        <article className="card kpi">
          <p>Demandes en attente</p>
          <b>{data.pending}</b>
        </article>
        <article className="card kpi">
          <p>Total adhérents</p>
          <b>{data.total}</b>
        </article>
        <article className="card kpi">
          <p>Inactifs</p>
          <b>{data.inactive}</b>
        </article>
      </div>

      <div className="grid-2" style={{ marginTop: '24px' }}>
        <section className="card">
          <div className="card-table-header">
            <h2>Demandes récentes</h2>
            <Link href="/admin/demandes" className="btn btn-secondary btn-small">
              Voir tout
            </Link>
          </div>
          {data.recentDemandes.length === 0 ? (
            <p style={{ color: 'var(--muted)', fontSize: '14px' }}>Aucune demande en attente.</p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Entreprise</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {data.recentDemandes.map((m) => (
                  <tr key={m.id}>
                    <td>
                      <Link href={`/admin/demandes/${m.id}`}>{m.name}</Link>
                    </td>
                    <td style={{ color: 'var(--muted)', fontSize: '13px' }}>
                      {m.submittedAt ? new Date(m.submittedAt).toLocaleDateString('fr-FR') : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        <section className="card">
          <div className="card-table-header">
            <h2>Raccourcis éditoriaux</h2>
          </div>
          <div style={{ display: 'grid', gap: '10px' }}>
            <Link href="/admin/actualites/new" className="btn btn-secondary">
              + Nouvelle actualité
            </Link>
            <Link href="/admin/offres-emploi" className="btn btn-secondary">
              + Nouvelle offre d&apos;emploi
            </Link>
            <Link href="/admin/evenements" className="btn btn-secondary">
              + Nouvel événement
            </Link>
          </div>
        </section>
      </div>
    </>
  )
}
