'use client'

import { motion } from 'framer-motion'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useEffect } from 'react'

// Separate component that uses search params
function CallbackHandler() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // The actual auth callback is handled by Supabase middleware
        // This page just shows a loading state and redirects
        const next = searchParams?.get('next') || '/browse'

        // Small delay to show loading state
        await new Promise((resolve) => setTimeout(resolve, 1000))

        router.push(next)
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        console.error('Auth callback error:', errorMessage)
        router.push('/login?error=callback_failed')
      }
    }

    handleCallback()
  }, [router, searchParams])

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
      <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
      <h1 className="text-xl font-bold text-white mb-2">Completing sign in...</h1>
      <p className="text-slate-400">Please wait while we redirect you</p>
    </motion.div>
  )
}

// Loading fallback
function CallbackLoading() {
  return (
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
      <h1 className="text-xl font-bold text-white mb-2">Loading...</h1>
      <p className="text-slate-400">Please wait</p>
    </div>
  )
}

export default function AuthCallbackPage() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <Suspense fallback={<CallbackLoading />}>
        <CallbackHandler />
      </Suspense>
    </div>
  )
}
