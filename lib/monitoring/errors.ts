/**
 * Error Tracking and Monitoring
 *
 * Provides centralized error tracking that can integrate with:
 * - Sentry (production)
 * - LogRocket
 * - Custom logging endpoints
 *
 * This is a foundational implementation - replace with Sentry for production.
 */

// Error severity levels
export type ErrorSeverity = 'fatal' | 'error' | 'warning' | 'info' | 'debug'

// Error context for additional metadata
export interface ErrorContext {
  [key: string]: unknown
  userId?: string
  username?: string
  path?: string
  component?: string
  action?: string
}

// Error report structure
interface ErrorReport {
  id: string
  timestamp: string
  message: string
  stack?: string
  severity: ErrorSeverity
  context: ErrorContext
  url: string
  userAgent: string
  environment: string
}

// In-memory error queue for batching
const errorQueue: ErrorReport[] = []
let flushTimer: ReturnType<typeof setTimeout> | null = null

/**
 * Generate unique error ID
 */
function generateErrorId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`
}

/**
 * Capture and report an error
 */
export function captureError(
  error: Error | string,
  severity: ErrorSeverity = 'error',
  context: ErrorContext = {}
): string {
  const errorId = generateErrorId()

  const report: ErrorReport = {
    id: errorId,
    timestamp: new Date().toISOString(),
    message: error instanceof Error ? error.message : error,
    stack: error instanceof Error ? error.stack : undefined,
    severity,
    context,
    url: typeof window !== 'undefined' ? window.location.href : '',
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
    environment: process.env.NODE_ENV ?? 'unknown',
  }

  // Add to queue
  errorQueue.push(report)

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.group(`[ErrorTracker] ${severity.toUpperCase()}: ${report.id}`)
    console.error(report.message)
    if (report.stack) console.error(report.stack)
    console.log('Context:', context)
    console.groupEnd()
  }

  // Schedule flush
  scheduleFlush()

  return errorId
}

/**
 * Capture exception with automatic severity
 */
export function captureException(error: Error, context?: ErrorContext): string {
  return captureError(error, 'error', context)
}

/**
 * Capture message for logging
 */
export function captureMessage(
  message: string,
  level: ErrorSeverity = 'info',
  context?: ErrorContext
): string {
  return captureError(message, level, context)
}

/**
 * Set user context for all subsequent errors
 */
let globalUserContext: ErrorContext = {}

export function setUser(user: { id: string; username?: string } | null): void {
  if (user) {
    globalUserContext = {
      ...globalUserContext,
      userId: user.id,
      username: user.username,
    }
  } else {
    const { userId: _, username: __, ...rest } = globalUserContext
    globalUserContext = rest
  }
}

/**
 * Schedule error queue flush
 */
function scheduleFlush(): void {
  if (flushTimer) return

  flushTimer = setTimeout(() => {
    flushErrors()
  }, 5000) // Flush every 5 seconds
}

/**
 * Flush error queue to backend
 */
async function flushErrors(): Promise<void> {
  if (errorQueue.length === 0) return

  const errors = [...errorQueue]
  errorQueue.length = 0
  flushTimer = null

  // Don't send in development
  if (process.env.NODE_ENV === 'development') {
    return
  }

  try {
    // Send to analytics endpoint
    if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
      navigator.sendBeacon('/api/errors', JSON.stringify({ errors }))
    } else {
      await fetch('/api/errors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ errors }),
        keepalive: true,
      })
    }
  } catch {
    // Fail silently - don't cause infinite error loops
  }
}

/**
 * Initialize global error handlers
 */
export function initErrorTracking(): void {
  if (typeof window === 'undefined') return

  // Capture unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    captureError(
      event.reason instanceof Error ? event.reason : new Error(String(event.reason)),
      'error',
      { type: 'unhandledrejection' }
    )
  })

  // Capture global errors
  window.addEventListener('error', (event) => {
    captureError(event.error || new Error(event.message), 'fatal', {
      type: 'globalerror',
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
    })
  })

  // Flush on page unload
  window.addEventListener('beforeunload', () => {
    flushErrors()
  })

  // Flush on visibility change (mobile)
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      flushErrors()
    }
  })
}

/**
 * React error boundary integration
 */
export function captureReactError(error: Error, errorInfo: { componentStack?: string }): string {
  return captureError(error, 'error', {
    type: 'react',
    componentStack: errorInfo.componentStack,
  })
}

/**
 * Performance monitoring
 */
export function captureWebVitals(metric: {
  name: string
  value: number
  id: string
}): void {
  captureMessage(`Web Vital: ${metric.name}`, 'debug', {
    type: 'webvitals',
    metricName: metric.name,
    metricValue: metric.value,
    metricId: metric.id,
  })
}
