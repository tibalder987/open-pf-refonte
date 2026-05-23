import Link from 'next/link'
import { MemberLogo } from '@/components/public/member-logo'
import { ArrowIcon } from '@/components/public/arrow-icon'

interface MemberCardProps {
  slug: string
  name: string
  logoUrl: string | null
  description: string | null
  primaryDomain: string | null
}

export function MemberCard({ slug, name, logoUrl, description, primaryDomain }: MemberCardProps) {
  const headingId = `member-name-${slug}`
  return (
    <article className="card member-card-v" aria-labelledby={headingId}>
      <MemberLogo
        name={name}
        logoUrl={logoUrl}
        sizes="(max-width: 580px) 100vw, (max-width: 980px) 50vw, 33vw"
      />
      <div className="member-card-v-body">
        {primaryDomain && <span className="member-domain-tag">{primaryDomain}</span>}
        <h3 id={headingId}>{name}</h3>
        {description && (
          <p>
            {description.length > 110 ? `${description.slice(0, 110)}…` : description}
          </p>
        )}
        <Link href={`/adherents/${slug}`} className="card-link" aria-label={`Voir la fiche de ${name}`}>
          Voir la fiche <ArrowIcon />
        </Link>
      </div>
    </article>
  )
}
