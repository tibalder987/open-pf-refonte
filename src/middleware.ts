import { auth } from '@/auth'
import { NextResponse } from 'next/server'

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
