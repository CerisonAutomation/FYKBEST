/**
 * Performance Monitoring System
 *
 * Tracks Core Web Vitals and application performance metrics
 * Compatible with Next.js 15+ and React 19+
 */

// Types
interface PerformanceMetrics {
  fcp: number | null
  lcp: number | null
  fid: number | null
  cls: number | null
  ttfb: number | null
  inp: number | null
}

interface TimingData {
  [key: string]: number
}

interface SearchMetrics {
  queryCount: number
  totalQueryTime: number
  cacheHits: number
  cacheMisses: number
}

// State
let metrics: PerformanceMetrics = {
  fcp: null,
  lcp: null,
  fid: null,
  cls: null,
  ttfb: null,
  inp: null,
}

let timingData: TimingData = {}

let searchMetrics: SearchMetrics = {
  queryCount: 0,
  totalQueryTime: 0,
  cacheHits: 0,
  cacheMisses: 0,
}

/**
 * Initialize performance monitoring
 */
export function initPerformanceMonitoring() {
  if (typeof window === 'undefined') return

  // Check for PerformanceObserver support
  if ('PerformanceObserver' in window) {
    // Largest Contentful Paint
    const lcpObserver = new PerformanceObserver((entries) => {
      const lastEntry = entries.getEntries().pop()
      if (lastEntry) {
        metrics.lcp = lastEntry.startTime
        reportMetric('LCP', lastEntry.startTime)
      }
    })
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })

    // First Input Delay / Interaction to Next Paint
    const fidObserver = new PerformanceObserver((entries) => {
      const firstEntry = entries.getEntries()[0]
      if (firstEntry && 'processingStart' in firstEntry) {
        const fid = (firstEntry as PerformanceEventTiming).processingStart - firstEntry.startTime
        metrics.fid = fid
        reportMetric('FID', fid)
      }
    })
    fidObserver.observe({ entryTypes: ['first-input'] })

    // Cumulative Layout Shift
    const clsObserver = new PerformanceObserver((entries) => {
      let clsValue = 0
      entries.getEntries().forEach((entry) => {
        if (!(entry as any).hadRecentInput) {
          clsValue += (entry as any).value
        }
      })
      metrics.cls = clsValue
      reportMetric('CLS', clsValue)
    })
    clsObserver.observe({ entryTypes: ['layout-shift'] })

    // Long Tasks
    if ('PerformanceLongTaskTiming' in window) {
      const longTaskObserver = new PerformanceObserver((entries) => {
        entries.getEntries().forEach((entry) => {
          console.warn('[Performance] Long task detected:', entry.duration, 'ms')
        })
      })
      longTaskObserver.observe({ entryTypes: ['longtask'] })
    }
  }

  // First Contentful Paint
  if ('performance' in window) {
    const paintEntries = performance.getEntriesByType('paint')
    const fcpEntry = paintEntries.find((entry) => entry.name === 'first-contentful-paint')
    if (fcpEntry) {
      metrics.fcp = fcpEntry.startTime
      reportMetric('FCP', fcpEntry.startTime)
    }

    // Time to First Byte
    const navigationEntries = performance.getEntriesByType('navigation')
    if (navigationEntries.length > 0) {
      const navEntry = navigationEntries[0] as PerformanceNavigationTiming
      metrics.ttfb = navEntry.responseStart
      reportMetric('TTFB', navEntry.responseStart)
    }
  }

  // Report to analytics in production
  if (process.env.NODE_ENV === 'production') {
    window.addEventListener('load', () => {
      setTimeout(() => {
        sendMetricsToAnalytics()
      }, 1000)
    })
  }
}

/**
 * Report a metric to console (and optionally analytics)
 */
function reportMetric(name: string, value: number) {
  const status = getMetricStatus(name, value)
  const emoji = status === 'good' ? '✅' : status === 'needs-improvement' ? '⚠️' : '❌'

  console.log(`[Performance] ${emoji} ${name}: ${Math.round(value * 100) / 100}`)
}

/**
 * Get metric status based on thresholds
 */
function getMetricStatus(name: string, value: number): 'good' | 'needs-improvement' | 'poor' {
  const thresholds: Record<string, [number, number]> = {
    FCP: [1800, 3000],
    LCP: [2500, 4000],
    FID: [100, 300],
    CLS: [0.1, 0.25],
    TTFB: [600, 1000],
  }

  const [good, poor] = thresholds[name] || [0, 0]
  if (value <= good) return 'good'
  if (value <= poor) return 'needs-improvement'
  return 'poor'
}

/**
 * Send metrics to analytics (placeholder)
 */
function sendMetricsToAnalytics() {
  // Implement your analytics integration here
  // e.g., Vercel Analytics, Google Analytics, etc.
  console.log('[Performance] Sending metrics:', metrics)
}

/**
 * Track search performance
 */
export function trackSearchPerformance(queryTime: number, isCacheHit = false) {
  searchMetrics.queryCount++
  searchMetrics.totalQueryTime += queryTime

  if (isCacheHit) {
    searchMetrics.cacheHits++
  } else {
    searchMetrics.cacheMisses++
  }

  // Log slow searches
  if (queryTime > 300) {
    console.warn(`[Search] Slow query detected: ${Math.round(queryTime)}ms`)
  }
}

/**
 * Get performance score (0-100)
 */
export function getPerformanceScore(): number {
  let score = 100

  // Deduct points for poor metrics
  if (metrics.lcp && metrics.lcp > 2500) score -= 20
  if (metrics.fid && metrics.fid > 100) score -= 15
  if (metrics.cls && metrics.cls > 0.1) score -= 15
  if (metrics.fcp && metrics.fcp > 1800) score -= 10

  return Math.max(0, score)
}

/**
 * Generate performance report
 */
export function generateReport() {
  const avgSearchTime =
    searchMetrics.queryCount > 0 ? searchMetrics.totalQueryTime / searchMetrics.queryCount : 0

  const cacheHitRate =
    searchMetrics.queryCount > 0 ? (searchMetrics.cacheHits / searchMetrics.queryCount) * 100 : 0

  return {
    coreWebVitals: metrics,
    score: getPerformanceScore(),
    search: {
      totalQueries: searchMetrics.queryCount,
      averageTime: Math.round(avgSearchTime),
      cacheHitRate: Math.round(cacheHitRate),
    },
    timestamp: new Date().toISOString(),
  }
}

/**
 * React hook for performance monitoring
 *
 * Usage in a Client Component:
 * ```tsx
 * 'use client'
 * import { usePerformanceMonitoring } from '@/lib/performance-monitor'
 *
 * export default function MyComponent() {
 *   usePerformanceMonitoring()
 *   return <div>...</div>
 * }
 * ```
 */
export function usePerformanceMonitoring() {
  // This is a placeholder - the actual hook should be in a separate client file
  // or use dynamic import to avoid SSR issues
  if (typeof window !== 'undefined') {
    initPerformanceMonitoring()
  }
}

/**
 * Performance monitor object with record/start/end methods
 */
export const performanceMonitor = {
  record: (name: string, value: number) => {
    console.log('[Performance] ' + name + ': ' + Math.round(value) + 'ms')
  },
  start: (name: string) => {
    if (typeof window !== 'undefined') {
      timingData[name] = performance.now()
    }
  },
  end: (name: string) => {
    if (typeof window !== 'undefined' && timingData[name]) {
      const duration = performance.now() - timingData[name]
      console.log('[Performance] ' + name + ': ' + Math.round(duration) + 'ms')
      delete timingData[name]
    }
  },
}

/**
 * Clear all metrics (for testing)
 */
export function clearMetrics() {
  metrics = { fcp: null, lcp: null, fid: null, cls: null, ttfb: null, inp: null }
  searchMetrics = { queryCount: 0, totalQueryTime: 0, cacheHits: 0, cacheMisses: 0 }
  timingData = {}
}
