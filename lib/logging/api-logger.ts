/**
 * API Logger - Comprehensive request/response logging for security and analytics
 *
 * Implements structured logging with:
 * - Request tracking and correlation IDs
 * - Performance monitoring
 * - Security event logging
 * - Error categorization
 * - Structured JSON output
 */

import { headers } from 'next/headers'

interface LogContext {
  requestId: string
  timestamp: string
  method: string
  url: string
  userAgent?: string
  ip?: string
  userId?: string
}

interface LogData {
  [key: string]: any
}

/**
 * Generate unique request ID for tracing
 */
function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Extract request context for logging
 */
function getLogContext(request: Request): LogContext {
  const headersList = headers()
  const requestId = generateRequestId()
  
  return {
    requestId,
    timestamp: new Date().toISOString(),
    method: request.method,
    url: request.url,
    userAgent: headersList.get('user-agent') || undefined,
    ip: headersList.get('x-forwarded-for') || 
         headersList.get('x-real-ip') || 
         'unknown',
  }
}

/**
 * Log successful API requests with performance metrics
 */
export async function logApiRequest(
  request: Request, 
  action: string, 
  data?: LogData
): Promise<void> {
  const context = getLogContext(request)
  
  const logEntry = {
    level: 'info',
    type: 'api_request',
    context,
    action,
    data: data || {},
    performance: {
      timestamp: Date.now(),
      duration: data?.queryTime || undefined,
    },
  }

  // In production, send to logging service (Datadog, Sentry, etc.)
  if (process.env.NODE_ENV === 'production') {
    // Example: await sendToLoggingService(logEntry)
    console.log(JSON.stringify(logEntry))
  } else {
    console.log('API Request:', JSON.stringify(logEntry, null, 2))
  }
}

/**
 * Log API errors with detailed context
 */
export async function logApiError(
  request: Request, 
  errorType: string, 
  error: any
): Promise<void> {
  const context = getLogContext(request)
  
  const logEntry = {
    level: 'error',
    type: 'api_error',
    context,
    errorType,
    error: {
      message: error?.message || 'Unknown error',
      code: error?.code,
      stack: process.env.NODE_ENV === 'development' ? error?.stack : undefined,
      details: error,
    },
    security: {
      isSuspicious: isSuspiciousError(errorType, error),
      requiresReview: requiresSecurityReview(errorType),
    },
  }

  // In production, send to error monitoring service
  if (process.env.NODE_ENV === 'production') {
    // Example: await sendToErrorService(logEntry)
    console.error(JSON.stringify(logEntry))
  } else {
    console.error('API Error:', JSON.stringify(logEntry, null, 2))
  }
}

/**
 * Determine if error might be security-related
 */
function isSuspiciousError(errorType: string, error: any): boolean {
  const suspiciousPatterns = [
    'sql injection',
    'xss',
    'csrf',
    'rate limit',
    'authentication_error',
    'authorization_error',
    'validation_error',
  ]
  
  return suspiciousPatterns.some(pattern => 
    errorType.toLowerCase().includes(pattern) ||
    (error?.message && typeof error.message === 'string' && 
     error.message.toLowerCase().includes(pattern))
  )
}

/**
 * Determine if error requires security team review
 */
function requiresSecurityReview(errorType: string): boolean {
  const reviewRequired = [
    'authentication_error',
    'authorization_error',
    'rate_limit_exceeded',
    'suspicious_activity',
    'data_breach_attempt',
  ]
  
  return reviewRequired.includes(errorType)
}

/**
 * Security event logging for audit trails
 */
export async function logSecurityEvent(
  request: Request,
  eventType: 'login' | 'logout' | 'permission_denied' | 'suspicious_activity',
  details: LogData = {}
): Promise<void> {
  const context = getLogContext(request)
  
  const logEntry = {
    level: 'warn',
    type: 'security_event',
    context,
    eventType,
    details,
    timestamp: Date.now(),
  }

  console.warn('Security Event:', JSON.stringify(logEntry))
  
  // In production, send to security monitoring
  if (process.env.NODE_ENV === 'production') {
    // Example: await sendToSecurityService(logEntry)
  }
}
