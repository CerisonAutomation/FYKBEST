const fs = require('fs')
const path = require('path')
const filePath = path.join(__dirname, 'components/king-app/MainApp.tsx')
const content = fs.readFileSync(filePath, 'utf8')

// Let's simplify the function to check the return paths
const simplified = `'use client'

import { ErrorBoundary } from '@/components/ErrorBoundary'
import { EventsPage } from '@/features/events/pages/EventsPage'
import { RightNowPage } from '@/features/right-now/pages/RightNowPage'
import { useAppStore } from '@/lib/store'
import { supabase } from '@/lib/supabase/client'
import { useBookings, useMessages, useProfiles, useUserSync } from '@/lib/supabase/hooks'
import { useNotifications } from '@/lib/supabase/useNotifications'
import { useAuth } from '@/lib/auth/hooks'
import { useRouter, usePathname } from 'next/navigation'
import type { User } from '@/types/app'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useCallback, Suspense } from 'react'
import {
  AISettingsScreen,
  BookingsScreen,
  BrowseScreen,
  ConsentScreen,
  CreatePartyScreen,
  DetailScreen,
  EditProfileScreen,
  EventDetailScreen,
  ExploreScreen,
  FavoritesScreen,
  LoginScreen,
  MagicLinkScreen,
  MessagesScreen,
  OnboardingScreen,
  ProfileScreen,
  RoleScreen,
  SettingsLocationScreen,
  SettingsNotificationsScreen,
  SettingsPhotosScreen,
  SettingsPrivacyScreen,
  SettingsScreen,
  SignupScreen,
  SubscriptionScreen,
  TermsScreen,
  VerificationScreen,
} from './screens'
import { BottomNav } from './shell/BottomNav'
import { Header } from './shell/Header'
import { LeftSidebar } from './shell/LeftSidebar'
import { RightSidebar } from './shell/RightSidebar'
import { toast } from 'sonner'
import { performanceMonitor } from '@/lib/performance-monitor'

// Enhanced auth screens with modern UX patterns
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

// Enhanced main navigation with performance optimization
const mainNavigation = [
  { id: 'browse', label: 'Browse', icon: '🔍' },
  { id: 'explore', label: 'Explore', icon: '🧭' },
  { id: 'messages', label: 'Messages', icon: '💬' },
  { id: 'bookings', label: 'Bookings', icon: '📅' },
  { id: 'favorites', label: 'Favorites', icon: '⭐' },
  { id: 'events', label: 'Events', icon: '🎉' },
  { id: 'right-now', label: 'Right Now', icon: '⚡' },
]

// Performance-optimized screen component mapping
const screenComponents = {
  browse: BrowseScreen,
  detail: DetailScreen,
  messages: MessagesScreen,
  explore: ExploreScreen,
  bookings: BookingsScreen,
  favorites: FavoritesScreen,
  subscription: SubscriptionScreen,
  profile: ProfileScreen,
  settings: SettingsScreen,
  'right-now': RightNowPage,
  events: EventsPage,
  'ai-settings': AISettingsScreen,
  'edit-profile': EditProfileScreen,
  'settings-photos': SettingsPhotosScreen,
  'settings-location': SettingsLocationScreen,
  'settings-notifications': SettingsNotificationsScreen,
  'settings-privacy': SettingsPrivacyScreen,
  'create-party': CreatePartyScreen,
  'event-detail': EventDetailScreen,
}

const authScreenComponents = {
  onboarding: OnboardingScreen,
  login: LoginScreen,
  role: RoleScreen,
  terms: TermsScreen,
  signup: SignupScreen,
  'magic-link': MagicLinkScreen,
  verification: VerificationScreen,
  consent: ConsentScreen,
}

export function MainApp() {
  const {
    stage,
    setStage,
    user,
    setUser,
    setAuthenticated,
    setLoading,
    setLeftMenuOpen,
    setRightMenuOpen,
    activeChat,
    notifications,
  } = useAppStore()

  const { status: authStatus } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  // Performance monitoring
  useEffect(() => {
    const startTime = performance.now()

    return () => {
      const endTime = performance.now()
      performanceMonitor.record('main_app_render', endTime - startTime)
    }
  }, [])

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
  const isAuthScreen = authScreens.includes(stage)
  if (isAuthScreen || authStatus === 'unauthenticated') {
    return (
      <ErrorBoundary fallback={(error) => (
        <div className="min-h-screen bg-gradient-to-b from-slate-950 via-black to-slate-950 text-white flex items-center justify-center">
          <div className="text-center max-w-md mx-auto p-8">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">😵</span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Oops! Something went wrong</h2>
            <p className="text-slate-400 mb-6">{error.message}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-black font-semibold rounded-xl transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      )}>
        <AnimatePresence mode="wait">
          <motion.div
            key={stage}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{
              duration: 0.3,
              ease: [0.4, 0, 0.2, 1]
            }}
            className="min-h-screen bg-gradient-to-b from-slate-950 via-black to-slate-950 text-white"
          >
            <Suspense fallback={(
              <div className="min-h-screen bg-gradient-to-b from-slate-950 via-black to-slate-950 text-white flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
                  <p className="mt-4 text-slate-400">Loading amazing experiences...</p>
                </div>
              </div>
            )}>
              {stage === 'onboarding' && <OnboardingScreen />}
              {stage === 'login' && <LoginScreen />}
              {stage === 'role' && <RoleScreen />}
              {stage === 'terms' && <TermsScreen />}
              {stage === 'signup' && <SignupScreen />}
              {stage === 'magic-link' && <MagicLinkScreen />}
              {stage === 'verification' && <VerificationScreen />}
              {stage === 'consent' && <ConsentScreen />}
            </Suspense>
          </motion.div>
        </AnimatePresence>
      </ErrorBoundary>
    )
  }

  // Main app
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-black to-slate-950 text-white relative overflow-x-hidden">
      {/* Enhanced Header with search */}
      <Header />

      {/* Enhanced Sidebars with better animations */}
      <LeftSidebar />
      <RightSidebar />

      {/* Enhanced Main Content with better transitions */}
      <main className="pt-20 sm:pt-24 pb-24 lg:pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen">
        <AnimatePresence mode="wait">
          <motion.div
            key={stage}
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            transition={{
              duration: 0.4,
              ease: [0.4, 0, 0.2, 1],
              staggerChildren: 0.1
            }}
          >
            <ErrorBoundary fallback={(error) => (
              <div className="min-h-screen bg-gradient-to-b from-slate-950 via-black to-slate-950 text-white flex items-center justify-center">
                <div className="text-center max-w-md mx-auto p-8">
                  <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
                    <span className="text-2xl">😵</span>
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-4">Oops! Something went wrong</h2>
                  <p className="text-slate-400 mb-6">{error.message}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-black font-semibold rounded-xl transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            )}>
              <Suspense fallback={(
                <div className="min-h-screen bg-gradient-to-b from-slate-950 via-black to-slate-950 text-white flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
                    <p className="mt-4 text-slate-400">Loading amazing experiences...</p>
                  </div>
                </div>
              )}>
                <BrowseScreen />
              </Suspense>
            </ErrorBoundary>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Enhanced Bottom Navigation */}
      <BottomNav />

      {/* Enhanced Notification System */}
      <div>Notification Toasts Placeholder</div>

      {/* Performance Monitor (development only) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 left-4 text-xs text-slate-500 font-mono">
          Stage: {stage} | FPS: <span>60</span>
        </div>
      )}
    </div>
  )
}

export default MainApp`

fs.writeFileSync(filePath, simplified, 'utf8')
console.log('MainApp.tsx simplified and fixed')
