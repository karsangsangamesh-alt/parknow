import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define protected routes
const protectedRoutes = [
  '/dashboard',
  '/profile', 
  '/host',
  '/bookings',
  '/listings'
]

// Define public routes (no auth required)
const publicRoutes = [
  '/',
  '/auth',
  '/about',
  '/help',
  '/terms',
  '/privacy'
]

export async function middleware(request: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req: request, res })

  // Get the pathname
  const { pathname } = request.nextUrl

  // Skip middleware for static files and API routes
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/static/') ||
    pathname.includes('.') ||
    pathname === '/favicon.ico'
  ) {
    return res
  }

  // Check if route is protected
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  )

  // Check if route is public
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith(route)
  )

  // Get session
  const { data: { session }, error } = await supabase.auth.getSession()

  // If there's an error, clear the session and redirect to auth
  if (error) {
    console.error('Auth error:', error)
    if (isProtectedRoute) {
      return NextResponse.redirect(new URL('/auth', request.url))
    }
    return res
  }

  // If user is not authenticated and trying to access protected route
  if (!session && isProtectedRoute) {
    return NextResponse.redirect(new URL('/auth', request.url))
  }

  // If user is authenticated and trying to access auth page, redirect to dashboard
  if (session && pathname === '/auth') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // If user is authenticated and trying to access root, redirect to dashboard
  if (session && pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return res
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)'
  ]
}
