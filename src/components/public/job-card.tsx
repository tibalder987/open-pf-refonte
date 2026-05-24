import Link from 'next/link'
import { ArrowIcon } from '@/components/public/arrow-icon'

interface JobCardProps {
  slug: string
  title: string
  location: string | null
  contractType: string | null
  salary: string | null
  memberName: string | null
}

export function JobCard({ slug, title, location, contractType, salary, memberName }: JobCardProps) {
  const headingId = `job-${slug}`
  return (
    <article className="card job-card" aria-labelledby={headingId}>
      <div className="job-card__body">
        {contractType && <span className="tag">{contractType}</span>}
        <h3 id={headingId} style={{ marginTop: '8px' }}>
          {title}
        </h3>
        {memberName && <p className="job-card__org">{memberName}</p>}
        <ul className="job-card__meta">
          {location && <li>📍 {location}</li>}
          {salary && <li>💼 {salary}</li>}
        </ul>
        <Link
          href={`/offres-emploi/${slug}`}
          className="card-link"
          aria-label={`Voir l'offre : ${title}`}
        >
          Voir l&apos;offre <ArrowIcon />
        </Link>
      </div>
    </article>
  )
}
