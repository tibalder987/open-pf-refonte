import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/styles/globals.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const BASE_URL = 'https://open.pf'

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    template: '%s | OPEN PF',
    default: "OPEN PF — Organisation des Professionnels de l’Économie Numérique de Polynésie française",
  },
  description:
    "OPEN réunit les entreprises du numérique de Polynésie française pour valoriser la filière, représenter les professionnels et structurer un écosystème numérique durable.",
  openGraph: {
    siteName: 'OPEN PF',
    locale: 'fr_PF',
    type: 'website',
    images: [{ url: '/logo-open.png', width: 512, height: 512, alt: 'OPEN PF' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/logo-open.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
}

const orgJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'OPEN PF',
  alternateName: "Organisation des Professionnels de l’Économie Numérique de Polynésie française",
  url: BASE_URL,
  logo: `${BASE_URL}/open-logo.svg`,
  description:
    "Cluster des professionnels du numérique en Polynésie française, fédérant ~54 entreprises.",
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'PF',
    addressLocality: 'Papeete',
  },
  memberOf: {
    '@type': 'Organization',
    name: "MEDEF Polynésie française",
  },
}

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'OPEN PF',
  url: BASE_URL,
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${BASE_URL}/adherents?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" className={inter.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
