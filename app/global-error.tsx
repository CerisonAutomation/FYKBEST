'use client'

/**
 * Global Error Page
 *
 * This is the global error boundary that catches errors in the root layout.
 * It MUST include html and body tags since it replaces the root layout.
 *
 * @see https://nextjs.org/docs/app/building-your-application/routing/error-handling#handling-errors-in-root-layout
 */

import { motion } from 'framer-motion'
import { AlertTriangle, Home, RefreshCw } from 'lucide-react'
import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Global error:', error)
  }, [error])

  return (
    <html lang="en">
      <body className="bg-black text-white min-h-screen flex flex-col items-center justify-center p-8 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="w-24 h-24 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-6 mx-auto">
            <AlertTriangle className="w-12 h-12 text-red-500" />
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Something went wrong</h2>

          <p className="text-slate-400 max-w-md mb-6 mx-auto">
            We apologize for the inconvenience. Our team has been notified and is working on a fix.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={reset}
              className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-black font-semibold rounded-xl flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>

            <a
              href="/"
              className="px-6 py-3 border border-slate-700 text-slate-300 hover:bg-slate-800 rounded-xl flex items-center justify-center gap-2"
            >
              <Home className="w-4 h-4" />
              Go Home
            </a>
          </div>
        </motion.div>
      </body>
    </html>
  )
}
