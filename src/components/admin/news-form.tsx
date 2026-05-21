'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { upsertNews } from '@/lib/actions/admin/content'

const schema = z.object({
  title: z.string().min(1, 'Titre requis'),
  excerpt: z.string().optional().or(z.literal('')),
  content: z.string().optional().or(z.literal('')),
  authorName: z.string().optional().or(z.literal('')),
  imageUrl: z.string().url('URL invalide').optional().or(z.literal('')),
  metaDescription: z.string().max(160).optional().or(z.literal('')),
  status: z.enum(['draft', 'published']),
})

type FormData = z.infer<typeof schema>

interface NewsFormProps {
  id?: string
  initialData?: Partial<FormData>
}

export function NewsForm({ id, initialData }: NewsFormProps) {
  const router = useRouter()
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: initialData?.title ?? '',
      excerpt: initialData?.excerpt ?? '',
      content: initialData?.content ?? '',
      authorName: initialData?.authorName ?? '',
      imageUrl: initialData?.imageUrl ?? '',
      metaDescription: initialData?.metaDescription ?? '',
      status: initialData?.status ?? 'draft',
    },
  })

  async function handleSubmit(data: FormData) {
    const result = await upsertNews(data, id)
    if (result.success) {
      router.push('/admin/actualites')
      router.refresh()
    }
  }

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} noValidate>
      <div className="card" style={{ display: 'grid', gap: '20px' }}>
        <div className="form-field">
          <label htmlFor="title">Titre *</label>
          <input id="title" type="text" {...form.register('title')} />
          {form.formState.errors.title && (
            <p className="field-error">{form.formState.errors.title.message}</p>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="excerpt">Extrait</label>
          <textarea id="excerpt" rows={3} {...form.register('excerpt')} />
        </div>

        <div className="form-field">
          <label htmlFor="content">Contenu</label>
          <textarea id="content" rows={10} {...form.register('content')} />
        </div>

        <div className="form-grid">
          <div className="form-field">
            <label htmlFor="authorName">Auteur</label>
            <input id="authorName" type="text" {...form.register('authorName')} />
          </div>
          <div className="form-field">
            <label htmlFor="imageUrl">URL image</label>
            <input id="imageUrl" type="url" {...form.register('imageUrl')} />
            {form.formState.errors.imageUrl && (
              <p className="field-error">{form.formState.errors.imageUrl.message}</p>
            )}
          </div>
          <div className="form-field">
            <label htmlFor="metaDescription">Meta description (160 car.)</label>
            <input
              id="metaDescription"
              type="text"
              maxLength={160}
              {...form.register('metaDescription')}
            />
          </div>
          <div className="form-field">
            <label htmlFor="status">Statut</label>
            <select id="status" {...form.register('status')}>
              <option value="draft">Brouillon</option>
              <option value="published">Publié</option>
            </select>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={() => router.back()}>
            Annuler
          </button>
          <button type="submit" className="btn" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? 'Enregistrement…' : id ? 'Mettre à jour' : 'Créer'}
          </button>
        </div>
      </div>
    </form>
  )
}
