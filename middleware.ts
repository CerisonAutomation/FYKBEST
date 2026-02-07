import { createMiddlewareAuthClient } from '@/lib/auth/server'
// Note: Server imports must be direct, not through index.ts
import { generateCsrfToken, validateCsrfToken } from '@/lib/security/csrf'
import { rateLimit } from '@/lib/security/rate-limiter'
import { type NextRequest, NextResponse } from 'next/server'

/**
 * Next.js Edge Middleware
 *
 * Handles:
 * - Authentication session refresh
 * - Route protection
 * - CSRF protection for API routes
 * - Rate limiting
 * - Security headers
 *
 * @edge This runs at the edge for minimal latency
 */

// Public routes that don't require authentication
const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/signup',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/auth/callback',
  '/auth/mfa',
  '/terms',
  '/privacy',
  '/about',
  '/contact',
  '/api/auth',
  '/api/webhooks',
]

// Routes that should redirect authenticated users away
const AUTH_ROUTES = ['/login', '/signup', '/auth/forgot-password']

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

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Create base response
  const response = NextResponse.next()

  // 1. Apply rate limiting for API routes
  if (pathname.startsWith('/api/')) {
    let limitConfig: RateLimitConfig = RATE_LIMITS.default

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
  const isApiRoute = pathname.startsWith('/api/')

  // Create Supabase middleware client
  const supabase = createMiddlewareAuthClient(request, response)

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
    '/settings',
  ]

  const isProtectedRoute = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  )

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

  // 4. Set CSRF token cookie if not present (for non-API routes)
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

  // 5. Add security headers
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
 * This controls which routes the middleware runs on.
 * Excludes static files, _next internal routes, and images.
 */
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|manifest.webmanifest).*)',
  ],
}
