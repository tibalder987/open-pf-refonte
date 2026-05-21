import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth/session'
import { AdminSidebar } from '@/components/admin/admin-sidebar'
import { getDb } from '@/lib/db'
import { members } from '@/lib/db/schema'
import { eq, count } from 'drizzle-orm'

async function getAdminCounts() {
  const db = getDb()
  const [pending] = await db
    .select({ count: count() })
    .from(members)
    .where(eq(members.status, 'submitted'))
  return { pendingCount: pending?.count ?? 0, pendingFichesCount: 0 }
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session?.user) redirect('/admin/login')

  const { pendingCount, pendingFichesCount } = await getAdminCounts()

  return (
    <div className="admin-layout">
      <AdminSidebar
        userName={session.user.name ?? session.user.email ?? 'Admin'}
        pendingCount={pendingCount}
        pendingFichesCount={pendingFichesCount}
      />
      <main className="admin-main" id="contenu">
        {children}
      </main>
    </div>
  )
}
