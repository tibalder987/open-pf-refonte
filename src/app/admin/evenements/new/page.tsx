import type { Metadata } from 'next'
import Link from 'next/link'
import { EventForm } from '@/components/admin/event-form'

export const metadata: Metadata = { title: 'Nouvel événement — Admin OPEN PF' }

export default function NewEventPage() {
  return (
    <>
      <div className="admin-top">
        <div>
          <nav style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '8px' }}>
            <Link href="/admin/evenements">Événements</Link> › Nouveau
          </nav>
          <h1>Nouvel événement</h1>
        </div>
      </div>
      <EventForm />
    </>
  )
}
