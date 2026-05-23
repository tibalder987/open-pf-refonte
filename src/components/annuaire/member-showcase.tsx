import Link from 'next/link'
import { MemberLogo } from '@/components/public/member-logo'

interface ShowcaseMember {
  slug: string
  name: string
  logoUrl: string | null
  primaryDomain: string | null
}

interface MemberShowcaseProps {
  members: ShowcaseMember[]
}

export function MemberShowcase({ members }: MemberShowcaseProps) {
  if (members.length === 0) return null
  return (
    <div className="members-showcase" role="list" aria-label="Vitrine des adhérents">
      {members.map((member) => (
        <Link
          key={member.slug}
          href={`/adherents/${member.slug}`}
          className="showcase-link"
          role="listitem"
          aria-label={`${member.name}${member.primaryDomain ? ` — ${member.primaryDomain}` : ''}`}
        >
          <div className="showcase-logo-wrap">
            <MemberLogo
              name={member.name}
              logoUrl={member.logoUrl}
              sizes="(max-width: 640px) 60vw, (max-width: 980px) 30vw, 160px"
            />
          </div>
          <div className="showcase-meta">
            <span className="showcase-name">{member.name}</span>
            {member.primaryDomain && (
              <span className="showcase-domain">{member.primaryDomain}</span>
            )}
          </div>
        </Link>
      ))}
    </div>
  )
}
