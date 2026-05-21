'use client'

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="fr">
      <body>
        <h2>Une erreur critique est survenue.</h2>
        <button onClick={reset}>Réessayer</button>
      </body>
    </html>
  )
}
