import Credentials from 'next-auth/providers/credentials'
import { compare } from 'bcryptjs'
import type { NextAuthConfig } from 'next-auth'
import { adminLoginSchema } from '@/lib/validations/admin'
import { getDb } from '@/lib/db'
import { adminUsers } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export const authConfig = {
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Mot de passe', type: 'password' },
      },
      async authorize(credentials) {
        const parsed = adminLoginSchema.safeParse(credentials)
        if (!parsed.success) return null

        const db = getDb()
        const [user] = await db
          .select({
            id: adminUsers.id,
            email: adminUsers.email,
            name: adminUsers.name,
            passwordHash: adminUsers.passwordHash,
            isActive: adminUsers.isActive,
          })
          .from(adminUsers)
          .where(eq(adminUsers.email, parsed.data.email))
          .limit(1)

        if (!user?.isActive) return null

        const valid = await compare(parsed.data.password, user.passwordHash)
        if (!valid) return null

        await db
          .update(adminUsers)
          .set({ lastLoginAt: new Date() })
          .where(eq(adminUsers.id, user.id))

        return { id: user.id, email: user.email, name: user.name }
      },
    }),
  ],
  pages: {
    signIn: '/admin/login',
  },
  trustHost: true,
  session: { strategy: 'jwt' },
  callbacks: {
    jwt({ token, user }) {
      if (user) token['adminId'] = user.id
      return token
    },
    session({ session, token }) {
      if (token['adminId']) {
        session.user.id = token['adminId'] as string
      }
      return session
    },
  },
} satisfies NextAuthConfig
