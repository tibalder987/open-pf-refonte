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

export function buildJobPostingJsonLd(job: {
  title: string
  slug: string
  description?: string | null
  location?: string | null
  contractType?: string | null
  publishedAt?: Date | string | null
  expiresAt?: Date | string | null
  memberName?: string | null
}) {
  // Map free-text contract types to schema.org employmentType values.
  const employmentType: Record<string, string> = {
    CDI: 'FULL_TIME',
    CDD: 'TEMPORARY',
    Stage: 'INTERN',
    Alternance: 'OTHER',
    Freelance: 'CONTRACTOR',
  }
  return {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.title,
    url: `${BASE_URL}/offres-emploi/${job.slug}`,
    ...(job.description && { description: job.description }),
    ...(job.publishedAt && { datePosted: new Date(job.publishedAt).toISOString() }),
    ...(job.expiresAt && { validThrough: new Date(job.expiresAt).toISOString() }),
    ...(job.contractType &&
      employmentType[job.contractType] && { employmentType: employmentType[job.contractType] }),
    hiringOrganization: {
      '@type': 'Organization',
      name: job.memberName ?? 'OPEN PF',
      ...(!job.memberName && { url: BASE_URL }),
    },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: job.location ?? 'Papeete',
        addressCountry: 'PF',
      },
    },
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
