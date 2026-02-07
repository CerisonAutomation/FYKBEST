/**
 * Monitoring Module
 *
 * Centralized monitoring utilities for the application.
 * Includes error tracking, performance monitoring, and analytics.
 */

export {
  captureError,
  captureException,
  captureMessage,
  captureReactError,
  captureWebVitals,
  initErrorTracking,
  setUser,
} from './errors'

// Re-export types
export type { ErrorSeverity, ErrorContext } from './errors'
