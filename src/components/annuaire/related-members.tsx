import Link from 'next/link'
import { MemberCard } from './member-card'
import { ArrowIcon } from '@/components/public/arrow-icon'

interface RelatedMembersProps {
  members: Array<{
    slug: string
    name: string
    logoUrl: string | null
    description: string | null
    primaryDomain: string | null
  }>
}

export function RelatedMembers({ members }: RelatedMembersProps) {
  return (
    <section
      className="section section-tight bg-soft"
      aria-labelledby="related-heading"
    >
      <div className="container">
        <div className="section-head">
          <h2 id="related-heading">Autres adhérents du réseau</h2>
          <Link href="/adherents" className="btn btn-secondary">
            Voir tous les adhérents <ArrowIcon />
          </Link>
        </div>
        <div className="grid-3">
          {members.map((m) => (
            <MemberCard
              key={m.slug}
              slug={m.slug}
              name={m.name}
              logoUrl={m.logoUrl}
              description={m.description}
              primaryDomain={m.primaryDomain}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
