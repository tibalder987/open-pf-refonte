'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { upsertEvent } from '@/lib/actions/admin/content'

const schema = z.object({
  title: z.string().min(1, 'Titre requis'),
  description: z.string().optional().or(z.literal('')),
  startsAt: z.string().min(1, 'Date de début requise'),
  endsAt: z.string().optional().or(z.literal('')),
  location: z.string().optional().or(z.literal('')),
  imageUrl: z.string().url('URL invalide').optional().or(z.literal('')),
  registrationUrl: z.string().url('URL invalide').optional().or(z.literal('')),
  isPublished: z.boolean(),
})

type FormData = z.infer<typeof schema>

interface EventFormProps {
  id?: string
  initialData?: Partial<FormData>
}

export function EventForm({ id, initialData }: EventFormProps) {
  const router = useRouter()
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: initialData?.title ?? '',
      description: initialData?.description ?? '',
      startsAt: initialData?.startsAt ?? '',
      endsAt: initialData?.endsAt ?? '',
      location: initialData?.location ?? '',
      imageUrl: initialData?.imageUrl ?? '',
      registrationUrl: initialData?.registrationUrl ?? '',
      isPublished: initialData?.isPublished ?? false,
    },
  })

  async function handleSubmit(data: FormData) {
    // Convert datetime-local to ISO string
    const payload = {
      ...data,
      startsAt: new Date(data.startsAt).toISOString(),
      endsAt: data.endsAt ? new Date(data.endsAt).toISOString() : '',
    }
    const result = await upsertEvent(payload, id)
    if (result.success) {
      router.push('/admin/evenements')
      router.refresh()
    }
  }

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} noValidate>
      <div className="card" style={{ display: 'grid', gap: '20px' }}>
        <div className="form-field">
          <label htmlFor="event-title">Titre *</label>
          <input id="event-title" type="text" {...form.register('title')} />
          {form.formState.errors.title && (
            <p className="field-error">{form.formState.errors.title.message}</p>
          )}
        </div>
        <div className="form-field">
          <label htmlFor="event-description">Description</label>
          <textarea id="event-description" rows={5} {...form.register('description')} />
        </div>
        <div className="form-grid">
          <div className="form-field">
            <label htmlFor="startsAt">Date de début *</label>
            <input id="startsAt" type="datetime-local" {...form.register('startsAt')} />
          </div>
          <div className="form-field">
            <label htmlFor="endsAt">Date de fin</label>
            <input id="endsAt" type="datetime-local" {...form.register('endsAt')} />
          </div>
          <div className="form-field">
            <label htmlFor="event-location">Lieu</label>
            <input id="event-location" type="text" {...form.register('location')} />
          </div>
          <div className="form-field">
            <label htmlFor="registrationUrl">URL d&apos;inscription</label>
            <input id="registrationUrl" type="url" {...form.register('registrationUrl')} />
          </div>
          <div className="form-field form-field--full">
            <label className="checkbox-label">
              <input type="checkbox" {...form.register('isPublished')} />
              <span>Publié</span>
            </label>
          </div>
        </div>
        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={() => router.back()}>
            Annuler
          </button>
          <button type="submit" className="btn" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? '…' : id ? 'Mettre à jour' : 'Créer'}
          </button>
        </div>
      </div>
    </form>
  )
}
