import Link from 'next/link'

export default function NotFound() {
  return (
    <div>
      <h2>Page introuvable</h2>
      <p>La page demandée n&apos;existe pas.</p>
      <Link href="/">Retour à l&apos;accueil</Link>
    </div>
  )
}
