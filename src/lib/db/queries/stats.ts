import { count as sqlCount, eq } from 'drizzle-orm'
import { getDb } from '@/lib/db'
import { activityDomains, memberActivities, members, siteStats } from '@/lib/db/schema'

export async function getSiteStats() {
  const db = getDb()
  const [memberCountRow, employeeRow, domainCountRow] = await Promise.all([
    db.select({ value: sqlCount() }).from(members).where(eq(members.status, 'active')),
    db.select({ employeeCount: siteStats.employeeCount }).from(siteStats).limit(1),
    db
      .select({ value: sqlCount(activityDomains.id) })
      .from(activityDomains)
      .innerJoin(memberActivities, eq(activityDomains.id, memberActivities.domainId)),
  ])
  return {
    memberCount: memberCountRow[0]?.value ?? 0,
    employeeCount: employeeRow[0]?.employeeCount ?? null,
    domainCount: Math.min(domainCountRow[0]?.value ?? 0, 19),
  }
}
