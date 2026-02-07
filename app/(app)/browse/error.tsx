'use client'

/**
 * Browse Page Error
 * Error boundary for profile loading failures
 */

import { ErrorBoundary } from '@/components/page'

export default function BrowseError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-[60vh]">
      <ErrorBoundary error={error} reset={reset} className="h-full" />
    </div>
  )
}
