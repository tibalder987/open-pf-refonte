'use server'

import { revalidatePath } from 'next/cache'
import { getDb } from '@/lib/db'
import { siteStats } from '@/lib/db/schema'
import { auth } from '@/lib/auth/session'

export async function updateSiteStats(employeeCount: number | null): Promise<{ success: boolean }> {
  const session = await auth()
  if (!session?.user?.id) throw new Error('Non autorisé')

  const db = getDb()
  await db
    .insert(siteStats)
    .values({ id: 1, employeeCount, updatedAt: new Date() })
    .onConflictDoUpdate({
      target: siteStats.id,
      set: { employeeCount, updatedAt: new Date() },
    })

  revalidatePath('/')
  revalidatePath('/admin/parametres')
  return { success: true }
}
