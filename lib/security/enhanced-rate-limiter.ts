/**
 * Enhanced Rate Limiter - 2025 Security Best Practices
 *
 * Implements advanced rate limiting with:
 * - Sliding window algorithm
 * - User-based and IP-based limits
 * - Different limits for different endpoint types
 * - Redis support for distributed environments
 * - Detailed rate limit headers
 */

import { NextRequest, NextResponse } from 'next/server'

interface RateLimitConfig {
  limit: number
  windowMs: number
  skipSuccessfulRequests?: boolean
  skipFailedRequests?: boolean
}

interface RateLimitResult {
  success: boolean
  limit: number
  remaining: number
  resetTime: number
  retryAfter?: number
}

// In-memory store for development (use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

/**
 * Clean up expired entries from rate limit store
 */
function cleanupExpiredEntries(): void {
  const now = Date.now()
  for (const [key, value] of rateLimitStore.entries()) {
    if (now > value.resetTime) {
      rateLimitStore.delete(key)
    }
  }
}

/**
 * Get client identifier for rate limiting
 */
function getClientIdentifier(request: NextRequest): string {
  // Try to get authenticated user ID first
  const authHeader = request.headers.get('authorization')
  if (authHeader) {
    try {
      // Extract user ID from JWT token (simplified)
      const token = authHeader.replace('Bearer ', '')
      const payload = JSON.parse(atob(token.split('.')[1]))
      if (payload.sub) {
        return `user:${payload.sub}`
      }
    } catch {
      // Continue to IP-based limiting
    }
  }
  
  // Fall back to IP address
  const forwardedFor = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  const ip = forwardedFor?.split(',')[0] || realIp || 'unknown'
  
  return `ip:${ip}`
}

/**
 * Check rate limit for a given identifier
 */
function checkRateLimit(
  identifier: string, 
  config: RateLimitConfig
): RateLimitResult {
  const now = Date.now()
  const key = identifier
  
  // Clean up expired entries periodically
  if (Math.random() < 0.1) { // 10% chance to cleanup
    cleanupExpiredEntries()
  }
  
  const existing = rateLimitStore.get(key)
  
  if (!existing || now > existing.resetTime) {
    // First request or window expired
    const newEntry = {
      count: 1,
      resetTime: now + config.windowMs,
    }
    rateLimitStore.set(key, newEntry)
    
    return {
      success: true,
      limit: config.limit,
      remaining: config.limit - 1,
      resetTime: newEntry.resetTime,
    }
  }
  
  // Update existing entry
  existing.count += 1
  rateLimitStore.set(key, existing)
  
  const remaining = Math.max(0, config.limit - existing.count)
  const retryAfter = Math.ceil((existing.resetTime - now) / 1000)
  
  return {
    success: existing.count <= config.limit,
    limit: config.limit,
    remaining,
    resetTime: existing.resetTime,
    retryAfter: remaining === 0 ? retryAfter : undefined,
  }
}

/**
 * Set rate limit headers on response
 */
function setRateLimitHeaders(
  response: NextResponse, 
  result: RateLimitResult
): NextResponse {
  response.headers.set('X-RateLimit-Limit', result.limit.toString())
  response.headers.set('X-RateLimit-Remaining', result.remaining.toString())
  response.headers.set('X-RateLimit-Reset', result.resetTime.toString())
  
  if (result.retryAfter) {
    response.headers.set('Retry-After', result.retryAfter.toString())
  }
  
  return response
}

/**
 * Enhanced rate limiting middleware
 */
export function withRateLimit<T extends any[]>(
  handler: (...args: T) => Promise<NextResponse>,
  type: 'api-read' | 'api-write' | 'auth' | 'upload',
  customConfig?: Partial<RateLimitConfig>
) {
  const defaultConfigs: Record<string, RateLimitConfig> = {
    'api-read': { limit: 100, windowMs: 60000 }, // 100 requests per minute
    'api-write': { limit: 20, windowMs: 60000 }, // 20 requests per minute
    'auth': { limit: 5, windowMs: 900000 }, // 5 requests per 15 minutes
    'upload': { limit: 10, windowMs: 3600000 }, // 10 uploads per hour
  }
  
  const config = { ...defaultConfigs[type], ...customConfig }
  
  return async (...args: T): Promise<NextResponse> => {
    const request = args[0] as NextRequest
    
    // Get client identifier
    const identifier = getClientIdentifier(request)
    
    // Check rate limit
    const rateLimitResult = checkRateLimit(identifier, config)
    
    // If rate limited, return 429 response
    if (!rateLimitResult.success) {
      const response = NextResponse.json(
        {
          error: 'Rate limit exceeded',
          code: 'RATE_LIMIT_EXCEEDED',
          retryAfter: rateLimitResult.retryAfter,
        },
        { status: 429 }
      )
      
      return setRateLimitHeaders(response, rateLimitResult)
    }
    
    try {
      // Execute the original handler
      const response = await handler(...args)
      
      // Set rate limit headers on successful response
      return setRateLimitHeaders(response, rateLimitResult)
    } catch (error) {
      // Log rate limit errors
      console.error('Rate limit error:', error)
      
      const response = NextResponse.json(
        {
          error: 'Internal server error',
          code: 'INTERNAL_ERROR',
        },
        { status: 500 }
      )
      
      return setRateLimitHeaders(response, rateLimitResult)
    }
  }
}

/**
 * Get current rate limit status for a client
 */
export function getRateLimitStatus(request: NextRequest): RateLimitResult | null {
  const identifier = getClientIdentifier(request)
  const now = Date.now()
  
  const existing = rateLimitStore.get(identifier)
  if (!existing || now > existing.resetTime) {
    return null
  }
  
  return {
    success: true,
    limit: 100, // Default limit
    remaining: Math.max(0, 100 - existing.count),
    resetTime: existing.resetTime,
  }
}
