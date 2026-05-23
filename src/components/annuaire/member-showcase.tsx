import Link from 'next/link'
import { MemberLogo } from '@/components/public/member-logo'

interface ShowcaseMember {
  slug: string
  name: string
  logoUrl: string | null
}

interface MemberShowcaseProps {
  members: ShowcaseMember[]
}

export function MemberShowcase({ members }: MemberShowcaseProps) {
  return (
    <div className="members-showcase" aria-label="Vitrine des adhérents">
      {members.map((member) => (
        <Link
          key={member.slug}
          href={`/adherents/${member.slug}`}
          className="showcase-link"
          aria-label={`Voir la fiche de ${member.name}`}
        >
          <MemberLogo
            name={member.name}
            logoUrl={member.logoUrl}
            sizes="(max-width: 640px) 75vw, (max-width: 980px) 45vw, 14vw"
          />
          <span className="showcase-name" aria-hidden="true">
            {member.name}
          </span>
        </Link>
      ))}
    </div>
  )
}
