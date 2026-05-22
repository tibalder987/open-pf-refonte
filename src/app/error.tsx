'use client'

import { ArrowIcon } from '@/components/public/arrow-icon'

export default function Error({
  error: _error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="not-found-page">
      <div className="not-found-inner">
        <span className="eyebrow">Une erreur est survenue</span>
        <h1 style={{ marginTop: '16px' }}>Quelque chose s&apos;est mal passé.</h1>
        <p style={{ marginTop: '20px', maxWidth: '480px' }}>
          Une erreur inattendue s&apos;est produite. Essayez de recharger la page.
        </p>
        <div style={{ display: 'flex', gap: '14px', marginTop: '32px', flexWrap: 'wrap' }}>
          <button type="button" className="btn" onClick={reset}>
            Réessayer <ArrowIcon />
          </button>
          <a href="/" className="btn btn-secondary">
            Retour à l&apos;accueil <ArrowIcon />
          </a>
        </div>
      </div>
    </div>
  )
}
