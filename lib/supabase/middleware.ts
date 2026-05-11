import { NextResponse, type NextRequest } from 'next/server'

const SESSION_COOKIE = 'unipath_session'

// Custom session middleware — Supabase Auth nahi, hamara apna DB session use hota hai
export async function updateSession(request: NextRequest) {
  const response = NextResponse.next({ request })

  const token = request.cookies.get(SESSION_COOKIE)?.value
  const isLoggedIn = !!token

  const { pathname } = request.nextUrl

  // Protected routes — login nahi to redirect
  const protectedPaths = ['/dashboard', '/profile', '/admin', '/settings']
  const isProtected = protectedPaths.some((p) => pathname.startsWith(p))

  if (isProtected && !isLoggedIn) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('redirect', pathname)
    return NextResponse.redirect(url)
  }

  // Auth pages — already logged in to dashboard par bhejo
  const authPaths = ['/login', '/signup']
  const isAuthPage = authPaths.some((p) => pathname === p)

  if (isAuthPage && isLoggedIn) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return response
}
