import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/styles/globals.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: {
    template: '%s | OPEN PF',
    default:
      'OPEN PF — Organisation des Professionnels de l’Économie Numérique de Polynésie française',
  },
  description:
    'Cluster de ~54 entreprises du numérique en Polynésie française, affilié au MEDEF PF.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" className={inter.variable}>
      <body>{children}</body>
    </html>
  )
}
