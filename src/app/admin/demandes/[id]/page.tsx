import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getDb } from '@/lib/db'
import { members, memberContacts, memberActivities } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { MemberActions } from '@/components/admin/member-actions'

export const metadata: Metadata = { title: "Demande d'adhésion — Admin OPEN PF" }

interface Props {
  params: Promise<{ id: string }>
}

export default async function DemandeDetailPage({ params }: Props) {
  const { id } = await params
  const db = getDb()

  const [member] = await db.select().from(members).where(eq(members.id, id)).limit(1)

  if (!member || member.status !== 'submitted') notFound()

  const contacts = await db.select().from(memberContacts).where(eq(memberContacts.memberId, id))

  const activities = await db
    .select({ domainId: memberActivities.domainId })
    .from(memberActivities)
    .where(eq(memberActivities.memberId, id))

  return (
    <>
      <div className="admin-top">
        <div>
          <nav style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '8px' }}>
            <Link href="/admin/demandes">Demandes</Link> › {member.name}
          </nav>
          <h1>{member.name}</h1>
        </div>
        <MemberActions memberId={id} status={member.status} />
      </div>

      <div className="grid-2">
        <section className="card">
          <h2>Informations entreprise</h2>
          <dl className="detail-list">
            <div>
              <dt>N° TAHITI</dt>
              <dd>{member.tahitiNumber ?? '—'}</dd>
            </div>
            <div>
              <dt>Site web</dt>
              <dd>
                {member.websiteUrl ? (
                  <a href={member.websiteUrl} target="_blank" rel="noopener noreferrer">
                    {member.websiteUrl}
                  </a>
                ) : (
                  '—'
                )}
              </dd>
            </div>
            <div>
              <dt>Description</dt>
              <dd>{member.description ?? '—'}</dd>
            </div>
            <div>
              <dt>Année création</dt>
              <dd>{member.yearFounded ?? '—'}</dd>
            </div>
            <div>
              <dt>Salariés</dt>
              <dd>{member.employeeCount ?? '—'}</dd>
            </div>
            <div>
              <dt>Membre MEDEF</dt>
              <dd>{member.isMedefMember ? 'Oui' : 'Non'}</dd>
            </div>
            <div>
              <dt>Déposée le</dt>
              <dd>
                {member.submittedAt
                  ? new Date(member.submittedAt).toLocaleDateString('fr-FR')
                  : '—'}
              </dd>
            </div>
          </dl>
        </section>

        <div style={{ display: 'grid', gap: '20px' }}>
          <section className="card">
            <h2>Contacts</h2>
            {contacts.length === 0 ? (
              <p style={{ color: 'var(--muted)', fontSize: '14px' }}>Aucun contact.</p>
            ) : (
              <ul
                style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '12px' }}
              >
                {contacts.map((c) => (
                  <li
                    key={c.id}
                    style={{ borderBottom: '1px solid var(--line)', paddingBottom: '12px' }}
                  >
                    <strong>{c.name}</strong>
                    {c.isPrimary && (
                      <span className="badge" style={{ marginLeft: '8px' }}>
                        Principal
                      </span>
                    )}
                    <br />
                    <a
                      href={`mailto:${c.email}`}
                      style={{ color: 'var(--blue)', fontSize: '14px' }}
                    >
                      {c.email}
                    </a>
                    {c.role && (
                      <span style={{ color: 'var(--muted)', fontSize: '13px', display: 'block' }}>
                        {c.role}
                      </span>
                    )}
                    {c.phone && (
                      <span style={{ color: 'var(--muted)', fontSize: '13px' }}>{c.phone}</span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="card">
            <h2>Domaines d&apos;activité</h2>
            {activities.length === 0 ? (
              <p style={{ color: 'var(--muted)', fontSize: '14px' }}>Non renseigné.</p>
            ) : (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {activities.map((a) => (
                  <span key={a.domainId} className="filter-chip filter-chip--active">
                    {a.domainId}
                  </span>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </>
  )
}
