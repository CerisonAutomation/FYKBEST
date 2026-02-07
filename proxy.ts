/**
 * Next.js Proxy (formerly Middleware)
 *
 * Runs code before a request is completed. Based on the incoming request,
 * you can modify the response by rewriting, redirecting, modifying headers,
 * or responding directly.
 *
 * @see https://nextjs.org/docs/app/getting-started/proxy
 *
 * NOTE: Starting with Next.js 16, Middleware is now called Proxy to better
 * reflect its purpose. The functionality remains the same.
 */

import { generateCsrfToken, validateCsrfToken } from '@/lib/security/csrf'
import { rateLimit } from '@/lib/security/rate-limiter'
import { updateSession } from '@/lib/supabase/middleware'
import { type NextRequest, NextResponse } from 'next/server'

// Public routes that don't require authentication
const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/signup',
  '/magic-link',
  '/terms',
  '/privacy',
  '/about',
  '/contact',
  '/api/auth',
  '/api/webhooks',
]

// Routes that should redirect authenticated users away
const AUTH_ROUTES = ['/login', '/signup', '/magic-link']

// API routes that need CSRF protection
const CSRF_PROTECTED_API_ROUTES = [
  '/api/auth',
  '/api/bookings',
  '/api/messages',
  '/api/parties',
  '/api/profiles',
  '/api/payments',
]

// Rate limit configuration by route pattern
interface RateLimitConfig {
  limit: number
  window: number
}

const RATE_LIMITS: Record<string, RateLimitConfig> & { default: RateLimitConfig } = {
  '/api/auth': { limit: 10, window: 60 }, // 10 requests per minute
  '/api/webhooks': { limit: 100, window: 60 }, // 100 per minute for webhooks
  default: { limit: 60, window: 60 }, // 60 requests per minute default
}

/**
 * Proxy function - runs before requests are completed
 *
 * Use cases:
 * - Modifying headers for all pages or a subset of pages
 * - Rewriting to different pages based on A/B tests or experiments
 * - Programmatic redirects based on incoming request properties
 *
 * NOT intended for:
 * - Slow data fetching (use Server Components or Route Handlers instead)
 * - Full session management or authorization solution
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Create base response
  const response = NextResponse.next()

  // 1. Apply rate limiting for API routes
  if (pathname.startsWith('/api/')) {
    let limitConfig: { limit: number; window: number } = RATE_LIMITS.default

    for (const [key, config] of Object.entries(RATE_LIMITS)) {
      if (pathname.startsWith(key) && config) {
        limitConfig = config
        break
      }
    }

    const rateLimitResult = await rateLimit(request, limitConfig)
    if (rateLimitResult) {
      return rateLimitResult
    }
  }

  // 2. CSRF protection for state-changing API requests
  if (pathname.startsWith('/api/') && !['GET', 'HEAD', 'OPTIONS'].includes(request.method)) {
    const needsCsrf = CSRF_PROTECTED_API_ROUTES.some((route) => pathname.startsWith(route))

    if (needsCsrf) {
      const isValid = validateCsrfToken(request)
      if (!isValid) {
        return new NextResponse(
          JSON.stringify({
            error: 'CSRF token validation failed',
            message: 'Invalid or missing CSRF token',
          }),
          {
            status: 403,
            headers: { 'Content-Type': 'application/json' },
          }
        )
      }
    }
  }

  // 3. Session management and auth protection
  const isPublicRoute = PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  )
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route))

  // Update session for all routes
  const sessionResponse = await updateSession(request)

  // Copy session cookies to response
  sessionResponse.cookies.getAll().forEach((cookie) => {
    response.cookies.set(cookie.name, cookie.value, cookie)
  })

  // 4. Check if authenticated user is accessing auth routes
  if (isAuthRoute) {
    const userCookie = request.cookies.get('sb-user')
    if (userCookie) {
      return NextResponse.redirect(new URL('/browse', request.url))
    }
  }

  // 5. Set CSRF token cookie if not present (for non-API routes)
  if (!pathname.startsWith('/api/') && !request.cookies.get('XSRF-TOKEN')) {
    const csrfToken = generateCsrfToken()
    response.cookies.set('XSRF-TOKEN', csrfToken, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })
  }

  // 6. Add security headers
  response.headers.set('X-DNS-Prefetch-Control', 'on')
  response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload')
  response.headers.set('X-Frame-Options', 'SAMEORIGIN')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin')

  return response
}

/**
 * Matcher configuration
 *
 * This controls which routes the proxy runs on.
 * Excludes static files, _next internal routes, and images.
 */
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|manifest.webmanifest).*)',
  ],
}
