'use client'

/**
 * Root Error Page
 * Catches errors in the root layout
 */

import { motion } from 'framer-motion'
import { AlertTriangle, Home, RefreshCw } from 'lucide-react'
import { useEffect } from 'react'

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Root error:', error)
  }, [error])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-8 text-center"
    >
      <div className="w-24 h-24 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-6">
        <AlertTriangle className="w-12 h-12 text-red-500" />
      </div>

      <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Something went wrong</h2>

      <p className="text-slate-400 max-w-md mb-6">
        We apologize for the inconvenience. Our team has been notified.
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
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
  )
}
