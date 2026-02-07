// CSRF token configuration
const CSRF_COOKIE_NAME = 'XSRF-TOKEN'
const CSRF_HEADER_NAME = 'X-XSRF-TOKEN'

// Generate a secure CSRF token using Web Crypto API (works in both Node.js and Edge)
export const generateCsrfToken = (): string => {
  const array = new Uint8Array(32)

  // Use crypto.getRandomValues if available (browser/edge), otherwise fall back
  if (typeof crypto !== 'undefined' && 'getRandomValues' in crypto) {
    crypto.getRandomValues(array)
  } else {
    // Fallback for older environments
    for (let i = 0; i < array.length; i++) {
      array[i] = Math.floor(Math.random() * 256)
    }
  }

  return Array.from(array)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

// Set CSRF token cookie
// Note: This should only be called in Server Components or API routes
export const setCsrfCookie = async (token: string) => {
  // Dynamic import to avoid issues with edge runtime
  const { cookies } = await import('next/headers')
  const cookieStore = await cookies()

  cookieStore.set(CSRF_COOKIE_NAME, token, {
    httpOnly: false, // Allow JavaScript access to read the cookie
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  })
}

// Validate CSRF token
export const validateCsrfToken = (request: Request): boolean => {
  // Skip CSRF check for GET requests and other safe methods
  if (['GET', 'HEAD', 'OPTIONS'].includes(request.method)) {
    return true
  }

  // Get token from cookie
  const cookieHeader = request.headers.get('cookie')
  const cookieToken = cookieHeader?.match(
    new RegExp(`(?:^|;)\\s*${CSRF_COOKIE_NAME}\\s*=\\s*([^;]+)`)
  )?.[1]

  // Get token from header
  const headerToken = request.headers.get(CSRF_HEADER_NAME)

  // Validate tokens
  if (!cookieToken || !headerToken) {
    return false
  }

  return cookieToken === headerToken
}

// CSRF middleware for API routes
export const csrfMiddleware = (
  request: Request,
  _response: Response,
  next: () => Promise<Response>
): Promise<Response> => {
  if (!validateCsrfToken(request)) {
    return Promise.resolve(
      new Response(
        JSON.stringify({
          error: 'CSRF token validation failed',
          message: 'Invalid or missing CSRF token',
        }),
        {
          status: 403,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    )
  }

  return next()
}
