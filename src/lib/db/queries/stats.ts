import { and, count as sqlCount, countDistinct, eq } from 'drizzle-orm'
import { getDb } from '@/lib/db'
import { memberActivities, members, siteStats } from '@/lib/db/schema'

export async function getSiteStats() {
  const db = getDb()
  const [memberCountRow, employeeRow, domainCountRow] = await Promise.all([
    db.select({ value: sqlCount() }).from(members).where(eq(members.status, 'active')),
    // employeeCount is entered manually by admins in site_stats — null means not set
    db.select({ employeeCount: siteStats.employeeCount }).from(siteStats).limit(1),
    // count distinct domains used by at least one active member
    db
      .select({ value: countDistinct(memberActivities.domainId) })
      .from(memberActivities)
      .innerJoin(members, and(eq(memberActivities.memberId, members.id), eq(members.status, 'active'))),
  ])
  return {
    memberCount: memberCountRow[0]?.value ?? 0,
    employeeCount: employeeRow[0]?.employeeCount ?? null,
    domainCount: domainCountRow[0]?.value ?? 0,
  }
}
