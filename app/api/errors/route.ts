/**
 * Error Tracking API Route
 *
 * Receives error reports from the client and logs them.
 * In production, this should forward to Sentry, Datadog, or similar.
 */

import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

interface ErrorReport {
  id: string
  timestamp: string
  message: string
  stack?: string
  severity: string
  context: Record<string, unknown>
  url: string
  userAgent: string
  environment: string
}

/**
 * POST /api/errors
 *
 * Receive error reports from client-side error tracking.
 * Validates and stores/logs errors for monitoring.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { errors }: { errors: ErrorReport[] } = body

    if (!Array.isArray(errors) || errors.length === 0) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    // Validate and sanitize error reports
    const validatedErrors = errors.map((error) => ({
      id: String(error.id).substring(0, 64),
      timestamp: new Date(error.timestamp).toISOString(),
      message: String(error.message).substring(0, 1000),
      stack: error.stack ? String(error.stack).substring(0, 5000) : undefined,
      severity: ['fatal', 'error', 'warning', 'info', 'debug'].includes(error.severity)
        ? error.severity
        : 'error',
      context: sanitizeContext(error.context),
      url: String(error.url).substring(0, 2000),
      userAgent: String(error.userAgent).substring(0, 500),
      environment: String(error.environment).substring(0, 50),
    }))

    // Log to server console
    for (const error of validatedErrors) {
      const logMethod =
        error.severity === 'fatal'
          ? console.error
          : error.severity === 'warning'
            ? console.warn
            : console.log

      logMethod(`[Client Error] ${error.id}: ${error.message}`, {
        severity: error.severity,
        url: error.url,
        environment: error.environment,
      })
    }

    // In production, forward to external service
    if (process.env.NODE_ENV === 'production') {
      // TODO: Forward to Sentry, Datadog, or similar
      // await forwardToSentry(validatedErrors)
    }

    // Store in database for analysis (optional, consider rate limiting)
    if (process.env.ENABLE_ERROR_DB_LOGGING === 'true') {
      const supabase = await createClient()

      // Insert errors in batches
      // @ts-ignore - Table may not exist in types
      const { error: dbError } = await (supabase.from('error_logs') as any).insert(
        validatedErrors.map((e) => ({
          error_id: e.id,
          message: e.message,
          severity: e.severity,
          url: e.url,
          user_agent: e.userAgent,
          environment: e.environment,
          context: e.context,
          created_at: e.timestamp,
        }))
      )

      if (dbError) {
        console.error('Failed to log errors to database:', dbError)
      }
    }

    return NextResponse.json({
      success: true,
      received: validatedErrors.length,
    })
  } catch (error) {
    console.error('Error processing error reports:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * Sanitize error context to prevent XSS and data leakage
 */
function sanitizeContext(context: Record<string, unknown>): Record<string, unknown> {
  const sanitized: Record<string, unknown> = {}

  const sensitiveKeys = ['password', 'token', 'secret', 'cookie', 'authorization', 'key']

  for (const [key, value] of Object.entries(context)) {
    // Skip sensitive keys
    if (sensitiveKeys.some((sk) => key.toLowerCase().includes(sk))) {
      sanitized[key] = '[REDACTED]'
      continue
    }

    // Stringify and limit length
    const stringValue = typeof value === 'string' ? value : JSON.stringify(value)

    sanitized[key] = String(stringValue).substring(0, 1000)
  }

  return sanitized
}
