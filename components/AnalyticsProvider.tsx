'use client'

/**
 * AnalyticsProvider - Web Analytics and Performance Monitoring
 *
 * Integrates Vercel Analytics and Speed Insights for production monitoring.
 * These are automatically disabled in development.
 */

import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'

export function AnalyticsProvider() {
  return (
    <>
      <Analytics
        debug={process.env.NODE_ENV === 'development'}
        beforeSend={(event) => {
          // Filter out local development events
          if (process.env.NODE_ENV === 'development') {
            return null
          }
          // Filter out sensitive paths
          if (event.url.includes('/admin') || event.url.includes('/settings')) {
            return null
          }
          return event
        }}
      />
      <SpeedInsights
        debug={process.env.NODE_ENV === 'development'}
        sampleRate={process.env.NODE_ENV === 'production' ? 1 : 0}
      />
    </>
  )
}
