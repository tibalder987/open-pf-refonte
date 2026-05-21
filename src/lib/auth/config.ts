import type { NextAuthConfig } from 'next-auth'

// P6: configure credentials provider and session strategy
export const authConfig = {
  providers: [],
  pages: {
    signIn: '/admin/login',
  },
} satisfies NextAuthConfig
