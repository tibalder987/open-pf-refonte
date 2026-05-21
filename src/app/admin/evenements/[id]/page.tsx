import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getDb } from '@/lib/db'
import { events } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { EventForm } from '@/components/admin/event-form'

export const metadata: Metadata = { title: "Éditer l'événement — Admin OPEN PF" }

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditEventPage({ params }: Props) {
  const { id } = await params
  const db = getDb()
  const [event] = await db.select().from(events).where(eq(events.id, id)).limit(1)
  if (!event) notFound()

  return (
    <>
      <div className="admin-top">
        <div>
          <nav style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '8px' }}>
            <Link href="/admin/evenements">Événements</Link> › {event.title}
          </nav>
          <h1>{event.title}</h1>
        </div>
      </div>
      <EventForm
        id={id}
        initialData={{
          title: event.title,
          description: event.description ?? '',
          startsAt: event.startsAt.toISOString().slice(0, 16),
          endsAt: event.endsAt ? event.endsAt.toISOString().slice(0, 16) : '',
          location: event.location ?? '',
          imageUrl: event.imageUrl ?? '',
          registrationUrl: event.registrationUrl ?? '',
          isPublished: event.isPublished,
        }}
      />
    </>
  )
}
