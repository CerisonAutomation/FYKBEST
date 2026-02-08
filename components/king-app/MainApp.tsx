'use client'

import { ErrorBoundary } from '@/components/ErrorBoundary'
import { useAuth } from '@/lib/auth/hooks'
import { useAppStore } from '@/lib/store'
import { BrowseScreen } from './screens'

export function MainApp() {
  const { status: authStatus } = useAuth()
  const { stage } = useAppStore()

  // Loading state
  if (authStatus === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-black to-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <p className="mt-4 text-slate-400">Loading amazing experiences...</p>
        </div>
      </div>
    )
  }

  // Auth state
  const authScreens = [
    'onboarding',
    'login',
    'role',
    'terms',
    'signup',
    'magic-link',
    'verification',
    'consent',
  ]
  const isAuthScreen = authScreens.includes(stage)
  if (isAuthScreen || authStatus === 'unauthenticated') {
    return (
      <ErrorBoundary fallback={<div className="text-center text-red-500">Auth screen error</div>}>
        <div className="min-h-screen bg-gradient-to-b from-slate-950 via-black to-slate-950 text-white">
          <div className="flex items-center justify-center min-h-screen">
            <p className="text-2xl">Auth Screen: {stage}</p>
          </div>
        </div>
      </ErrorBoundary>
    )
  }

  // Main app
  return (
    <ErrorBoundary fallback={<div className="text-center text-red-500">Main app error</div>}>
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-black to-slate-950 text-white">
        <BrowseScreen />
      </div>
    </ErrorBoundary>
  )
}

export default MainApp
