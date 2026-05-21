import type { Metadata } from 'next'
import { getDb } from '@/lib/db'
import { reminderLogs, members } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'

export const metadata: Metadata = { title: 'Relances — Admin OPEN PF' }

const TYPE_LABELS: Record<string, string> = {
  submission_reminder: 'Rappel soumission',
  validation_pending: 'En attente validation',
  renewal_reminder: 'Rappel renouvellement',
  profile_incomplete: 'Profil incomplet',
}

export default async function RelancesPage() {
  const db = getDb()
  const logs = await db
    .select({
      id: reminderLogs.id,
      type: reminderLogs.type,
      sentAt: reminderLogs.sentAt,
      emailTo: reminderLogs.emailTo,
      memberName: members.name,
    })
    .from(reminderLogs)
    .leftJoin(members, eq(reminderLogs.memberId, members.id))
    .orderBy(desc(reminderLogs.sentAt))
    .limit(200)

  return (
    <>
      <div className="admin-top">
        <h1>Journal des relances</h1>
        <span style={{ color: 'var(--muted)', fontSize: '14px' }}>{logs.length} envois</span>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {logs.length === 0 ? (
          <p style={{ padding: '32px', color: 'var(--muted)', textAlign: 'center' }}>
            Aucune relance envoyée.
          </p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Adhérent</th>
                <th>Type</th>
                <th>Destinataire</th>
                <th>Envoyé le</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id}>
                  <td style={{ fontWeight: 600 }}>{log.memberName ?? '—'}</td>
                  <td>{TYPE_LABELS[log.type] ?? log.type}</td>
                  <td style={{ color: 'var(--muted)', fontSize: '13px' }}>{log.emailTo}</td>
                  <td style={{ color: 'var(--muted)', fontSize: '13px' }}>
                    {new Date(log.sentAt).toLocaleString('fr-FR')}
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
