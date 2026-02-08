'use client'

/**
 * ErrorBoundary - Production-grade error handling
 * Catches and displays errors gracefully
 */

import React, { useState, useEffect } from 'react'
import { ErrorBoundary as BaseErrorBoundary } from '@/components/ErrorBoundary'
import { Button } from '@/components/ui/button'
import { captureException } from '@/lib/monitoring/errors'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { AlertTriangle, Bug, Home, RefreshCw } from 'lucide-react'

interface ErrorBoundaryProps {
  error: Error & { digest?: string }
  reset: () => void
  className?: string
  showDetails?: boolean
}

export function ErrorBoundary({
  error,
  reset,
  className,
  showDetails = process.env.NODE_ENV === 'development',
}: ErrorBoundaryProps) {
  // Only run client-side code on client
  const [isClient, setIsClient] = React.useState(false)

  React.useEffect(() => {
    setIsClient(true)
  }, [])

  React.useEffect(() => {
    // Log error to monitoring service
    console.error('[Page Error] Caught error:', error)
    console.error('[Page Error] URL:', typeof window !== 'undefined' ? window.location.href : 'SSR')
    console.error('[Page Error] Timestamp:', new Date().toISOString())

    // Send to error tracking
    captureException(error, {
      component: 'ErrorBoundary',
      digest: error.digest,
    })
  }, [error])

  // Don't render interactive elements during SSR
  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Loading...</h2>
          <p className="text-slate-400">Please wait</p>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'min-h-[400px] flex flex-col items-center justify-center p-8 text-center',
        className
      )}
    >
      {/* Error Icon */}
      <div className="w-24 h-24 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-6">
        <AlertTriangle className="w-12 h-12 text-red-500" />
      </div>

      {/* Title */}
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Something went wrong</h2>

      {/* Message */}
      <p className="text-slate-400 max-w-md mb-6">
        We apologize for the inconvenience. Our team has been notified and is working on a fix.
      </p>

      {/* Error Details (Dev Only) */}
      {showDetails && (
        <div className="w-full max-w-2xl mb-6 text-left">
          <div className="bg-slate-950 border border-slate-800 rounded-lg overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-900 border-b border-slate-800">
              <Bug className="w-4 h-4 text-slate-400" />
              <span className="text-sm font-medium text-slate-300">Error Details</span>
            </div>
            <div className="p-4 overflow-auto max-h-48">
              <p className="text-red-400 font-mono text-sm mb-2">{error.message}</p>
              {error.stack && (
                <pre className="text-slate-500 font-mono text-xs whitespace-pre-wrap">
                  {error.stack}
                </pre>
              )}
              {error.digest && (
                <p className="text-slate-600 font-mono text-xs mt-2">Digest: {error.digest}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          onClick={reset}
          className="bg-amber-500 hover:bg-amber-600 text-black font-semibold"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </Button>

        <Button
          variant="outline"
          onClick={() => (window.location.href = '/')}
          className="border-slate-700 text-slate-300 hover:bg-slate-800"
        >
          <Home className="w-4 h-4 mr-2" />
          Go Home
        </Button>
      </div>

      {/* Support Link */}
      <p className="mt-6 text-sm text-slate-500">
        Need help?{' '}
        <a href="mailto:support@kingsocial.com" className="text-amber-500 hover:text-amber-400">
          Contact Support
        </a>
      </p>
    </motion.div>
  )
}

// Global error page component
export function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div lang="en">
      <body className="bg-black text-white min-h-screen flex items-center justify-center p-4">
        <BaseErrorBoundary
          error={error}
          reset={reset}
          onError={(error, errorInfo) => {
            console.error('[GlobalError] Caught error:', error)
            console.error('[GlobalError] Error details:', {
              timestamp: new Date().toISOString(),
              screen: 'GlobalError',
              error: error.message,
              componentStack: errorInfo.componentStack,
            })
          }}
        />
      </body>
    </div>
  )
}
