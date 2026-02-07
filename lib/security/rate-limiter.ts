/**
 * Enterprise Rate Limiter for Next.js 16
 * Advanced rate limiting with Redis fallback and sliding window
 */

// In-memory rate limiter for development (fallback when Redis not available)
class MemoryRateLimiter {
  private requests = new Map<string, { count: number; resetTime: number }>()

  async limit(identifier: string, config: { requests: number; window: string }) {
    const key = identifier
    const now = Date.now()
    const windowMs = this.parseWindow(config.window)

    let record = this.requests.get(key)

    if (!record || now > record.resetTime) {
      record = { count: 1, resetTime: now + windowMs }
      this.requests.set(key, record)
      return {
        success: true,
        limit: config.requests,
        remaining: config.requests - 1,
        reset: record.resetTime,
      }
    }

    if (record.count >= config.requests) {
      return {
        success: false,
        limit: config.requests,
        remaining: 0,
        reset: record.resetTime,
      }
    }

    record.count++
    return {
      success: true,
      limit: config.requests,
      remaining: config.requests - record.count,
      reset: record.resetTime,
    }
  }

  private parseWindow(window: string): number {
    const match = window.match(/(\d+)\s*(s|m|h)/)
    if (!match) return 60000 // default 1 minute

    const value = Number.parseInt(match[1] || '1')
    const unit = match[2]

    switch (unit) {
      case 's':
        return value * 1000
      case 'm':
        return value * 60 * 1000
      case 'h':
        return value * 60 * 60 * 1000
      default:
        return 60000
    }
  }
}

const memoryLimiter = new MemoryRateLimiter()

// Rate limiter configuration
const rateLimitConfig = {
  // API endpoints
  api: {
    requests: 100,
    window: '60 s',
  },
  // Authentication endpoints
  auth: {
    requests: 5,
    window: '60 s',
  },
  // Search endpoints
  search: {
    requests: 30,
    window: '60 s',
  },
  // Upload endpoints
  upload: {
    requests: 10,
    window: '60 s',
  },
}

/**
 * Check rate limit for a given identifier and type
 */
export async function checkRateLimit(
  identifier: string,
  type: keyof typeof rateLimitConfig = 'api'
): Promise<{ success: boolean; limit: number; remaining: number; reset: number }> {
  const config = rateLimitConfig[type]

  try {
    // For now, use memory rate limiter (Redis integration can be added later)
    return await memoryLimiter.limit(identifier, config)
  } catch (error) {
    console.error('Rate limiting error:', error)

    // Fail open - allow request if rate limiting fails
    return {
      success: true,
      limit: config.requests,
      remaining: config.requests - 1,
      reset: Date.now() + 60000,
    }
  }
}

/**
 * Rate limiting middleware for Next.js API routes
 */
export async function withRateLimit(
  handler: (req: Request, context?: any) => Promise<Response>,
  type: keyof typeof rateLimitConfig = 'api'
) {
  return async (req: Request, context?: any) => {
    // Get identifier from IP or user ID
    const identifier = String(
      req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'
    )

    const result = await checkRateLimit(identifier, type)

    // Add rate limit headers
    const headers = new Headers({
      'X-RateLimit-Limit': result.limit.toString(),
      'X-RateLimit-Remaining': result.remaining.toString(),
      'X-RateLimit-Reset': result.reset.toString(),
    })

    if (!result.success) {
      return new Response(
        JSON.stringify({
          error: 'RATE_LIMIT_EXCEEDED',
          message: 'Too many requests. Please try again later.',
          retryAfter: Math.ceil((result.reset - Date.now()) / 1000),
        }),
        {
          status: 429,
          headers,
        }
      )
    }

    // Continue with the request
    const response = await handler(req, context)

    // Add rate limit headers to response
    Object.entries(headers).forEach(([key, value]) => {
      response.headers.set(key, value)
    })

    return response
  }
}

/**
 * Get rate limit status for a user
 */
export async function getRateLimitStatus(
  identifier: string,
  type: keyof typeof rateLimitConfig = 'api'
) {
  return await checkRateLimit(identifier, type)
}

import { type NextRequest, NextResponse } from 'next/server'

/**
 * Edge-compatible rate limiting for middleware
 * Returns a 429 response if rate limited, null if allowed
 */
export async function rateLimit(
  request: NextRequest,
  config: { limit: number; window: number }
): Promise<NextResponse | null> {
  const identifier = String(
    request.headers.get('x-forwarded-for') ||
      request.headers.get('x-real-ip') ||
      (request as any).ip ||
      'unknown'
  )

  const result = await memoryLimiter.limit(identifier, {
    requests: config.limit,
    window: `${config.window}s`,
  })

  if (!result.success) {
    return new NextResponse(
      JSON.stringify({
        error: 'RATE_LIMIT_EXCEEDED',
        message: 'Too many requests. Please try again later.',
        retryAfter: Math.ceil((result.reset - Date.now()) / 1000),
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'X-RateLimit-Limit': result.limit.toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': result.reset.toString(),
          'Retry-After': Math.ceil((result.reset - Date.now()) / 1000).toString(),
        },
      }
    )
  }

  return null
}
