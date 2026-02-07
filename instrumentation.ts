/**
 * Next.js Instrumentation
 *
 * Runs when the Next.js server starts up.
 * Used for:
 * - Performance monitoring setup
 * - Error tracking initialization
 * - Database connection pooling
 * - Cache warming
 *
 * @see https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation
 */

export async function register() {
  // Only run on Node.js runtime (not edge)
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Initialize performance monitoring
    const { initPerformanceMonitoring } = await import('./lib/performance-monitor')
    initPerformanceMonitoring()

    // Log startup
    console.log('[Instrument] Server instrumentation registered')
    console.log(`[Instrument] Environment: ${process.env.NODE_ENV}`)
    console.log(`[Instrument] Runtime: ${process.env.NEXT_RUNTIME}`)
  }
}

/**
 * Called when the server is shutting down
 * Use for cleanup: close connections, flush logs, etc.
 */
export async function onRequest({
  request,
  response,
}: {
  request: Request
  response: Response
}) {
  // Add custom headers to all responses
  response.headers.set('X-Response-Time', Date.now().toString())
}
