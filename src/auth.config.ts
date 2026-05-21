import type { NextAuthConfig } from 'next-auth'

// Edge-safe config: no bcryptjs, no DB imports — only JWT/session callbacks.
// Used by middleware. The full config (with Credentials provider) is in src/auth.ts.
export const authConfig = {
  pages: { signIn: '/admin/login' },
  trustHost: true,
  session: { strategy: 'jwt' as const },
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
  providers: [],
} satisfies NextAuthConfig
