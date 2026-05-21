import NextAuth from 'next-auth'
import { authConfig } from './auth.config'
import { NextResponse } from 'next/server'

// Use the edge-safe config (no bcryptjs, no DB) for middleware
const { auth } = NextAuth(authConfig)

export default auth((req) => {
  const { pathname } = req.nextUrl
  const isAdminPath = pathname.startsWith('/admin')
  const isLoginPath = pathname === '/admin/login'

  if (isAdminPath && !isLoginPath && !req.auth) {
    const loginUrl = new URL('/admin/login', req.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (isLoginPath && req.auth) {
    return NextResponse.redirect(new URL('/admin', req.url))
  }

  const response = NextResponse.next()
  response.headers.set('x-pathname', pathname)
  return response
})

export const config = {
  matcher: ['/admin/:path*'],
}
