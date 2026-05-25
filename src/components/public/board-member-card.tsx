import Image from 'next/image'
import type { BoardMember } from '@/lib/data/board-members'
import { getInitials, colorFor } from '@/components/public/member-logo'

interface BoardMemberCardProps {
  member: BoardMember
}

export function BoardMemberCard({ member }: BoardMemberCardProps) {
  const { name, openRole, professionalRole, photoUrl } = member

  return (
    <article className="board-card">
      {photoUrl ? (
        <div className="board-avatar">
          {/* alt descriptif uniquement quand une vraie photo validée est présente */}
          <Image
            src={photoUrl}
            alt={`Portrait de ${name}`}
            fill
            sizes="(max-width: 640px) 96px, 112px"
            style={{ objectFit: 'cover' }}
          />
        </div>
      ) : (
        <BoardAvatarFallback name={name} />
      )}

      <p className="board-card-role">{openRole}</p>
      <h3 className="board-card-name">{name}</h3>
      <p className="board-card-job">{professionalRole}</p>
    </article>
  )
}

function BoardAvatarFallback({ name }: { name: string }) {
  const { bg, fg } = colorFor(name)
  return (
    // Pas de vraie photo : on expose le nom via aria-label (placeholder à initiales).
    <div
      className="board-avatar board-avatar-fallback"
      style={{ background: bg, color: fg }}
      role="img"
      aria-label={name}
    >
      <span aria-hidden="true">{getInitials(name)}</span>
    </div>
  )
}
