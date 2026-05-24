const BASE_URL = 'https://open.pf'

interface BreadcrumbItem {
  name: string
  href: string
}

export function buildBreadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${BASE_URL}${item.href}`,
    })),
  }
}

export function buildMemberJsonLd(member: {
  name: string
  slug: string
  description?: string | null
  websiteUrl?: string | null
  logoUrl?: string | null
  address?: string | null
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: member.name,
    url: member.websiteUrl ?? `${BASE_URL}/adherents/${member.slug}`,
    ...(member.description && { description: member.description }),
    ...(member.logoUrl && { logo: member.logoUrl }),
    ...(member.address && {
      address: { '@type': 'PostalAddress', streetAddress: member.address, addressCountry: 'PF' },
    }),
    memberOf: { '@type': 'Organization', name: 'OPEN PF', url: BASE_URL },
  }
}

export function buildArticleJsonLd(article: {
  title: string
  slug: string
  excerpt?: string | null
  publishedAt?: Date | string | null
  imageUrl?: string | null
  authorName?: string | null
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    url: `${BASE_URL}/actualites/${article.slug}`,
    ...(article.excerpt && { description: article.excerpt }),
    ...(article.publishedAt && { datePublished: new Date(article.publishedAt).toISOString() }),
    ...(article.imageUrl && { image: article.imageUrl }),
    author: {
      '@type': 'Organization',
      name: article.authorName ?? 'OPEN PF',
      url: BASE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: 'OPEN PF',
      url: BASE_URL,
      logo: { '@type': 'ImageObject', url: `${BASE_URL}/logo-open.png` },
    },
  }
}
