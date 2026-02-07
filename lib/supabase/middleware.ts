import type { Database } from '@/types/supabase'
import { type CookieOptions, createServerClient } from '@supabase/ssr'
import { type NextRequest, NextResponse } from 'next/server'

/**
 * Security: Authentication Middleware
 *
 * Protects routes based on authentication status and user roles.
 * Implements secure session refresh and redirect logic.
 *
 * @security Session validation on every request
 * @performance Minimal overhead with efficient cookie handling
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({
            request: { headers: request.headers },
          })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options } as any)
          response = NextResponse.next({
            request: { headers: request.headers },
          })
          response.cookies.set({ name, value: '', ...options } as any)
        },
      },
    }
  )

  // Refresh session if expired
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  // Protected routes configuration
  const protectedRoutes = [
    '/browse',
    '/messages',
    '/bookings',
    '/favorites',
    '/profile',
    '/subscription',
  ]
  const authRoutes = ['/login', '/signup', '/magic-link']
  const isProtectedRoute = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  )
  const isAuthRoute = authRoutes.some((route) => request.nextUrl.pathname.startsWith(route))

  // Redirect unauthenticated users from protected routes
  if (isProtectedRoute && (!user || error)) {
    const redirectUrl = new URL('/login', request.url)
    redirectUrl.searchParams.set('redirectTo', request.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // Redirect authenticated users away from auth routes
  if (isAuthRoute && user && !error) {
    return NextResponse.redirect(new URL('/browse', request.url))
  }

  return response
}
