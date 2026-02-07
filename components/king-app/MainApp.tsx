'use client'

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

  // Enhanced data synchronization with error handling
  const syncUserData = useCallback(async (session: any) => {
    if (!session?.user) return

    try {
      performanceMonitor.start('user_data_sync')

      // Parallel data fetching with timeout
      const [profileResponse, userResponse] = await Promise.all([
        supabase
          .from('profiles')
          .select('*')
          .eq('user_id', session.user.id)
          .single()
          .abortSignal(AbortSignal.timeout(5000)),
        supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single()
          .abortSignal(AbortSignal.timeout(5000)),
      ])

      const profile = profileResponse.data as any
      const userRecord = userResponse.data as any

      if (profile && userRecord) {
        // Enhanced user mapping with better typing
        const appUser: User = {
          id: session.user.id,
          email: session.user.email || '',
          display_name:
            profile.display_name ||
            userRecord.name ||
            session.user.email?.split('@')[0] ||
            'User',
          avatar_url: userRecord.avatar_url || undefined,
          bio: profile.bio || userRecord.bio || undefined,
          role: (userRecord.role as any) || 'seeker',
          verification_status:
            (profile.verification_status as any) ||
            (userRecord.verification_status as any) ||
            'unverified',
          subscription_tier: (userRecord.subscription_tier as any) || 'free',
          subscription_status: 'active',
          presence: 'online',
          is_incognito: !!userRecord.is_incognito,
          available_now: !!userRecord.available_now,
          city: userRecord.city || undefined,
          country: userRecord.country || undefined,
          age: userRecord.age || undefined,
          interests: userRecord.interests || [],
          tribes: userRecord.interests || [],
          photos: userRecord.photos || [],
          height_cm: userRecord.height_cm || undefined,
          body_type: userRecord.body_type || undefined,
          hourly_rate: Number(userRecord.hourly_rate) || 0,
          response_time: userRecord.response_time || undefined,
          reviews_count: userRecord.reviews_count || 0,
          average_rating: Number(userRecord.average_rating) || 0,
          popularity_score: 0,
          fame_rating: 0,
          profile_views: 0,
          onboarding_completed: false,
          onboarding_step: 0,
          profile_completeness: 0,
          travel_mode_enabled: !!userRecord.travel_mode_enabled,
          is_admin: userRecord.role === 'admin',
          is_active: !!userRecord.online_status,
          last_seen_at: userRecord.last_seen,
          created_at: userRecord.created_at,
        }

        setUser(appUser)
        setAuthenticated(true)

        // Show welcome toast for new users
        if (appUser.onboarding_step === 0) {
          toast.success('Welcome to KING SOCIAL! 🎉')
        }

        // Smart routing based on user state
        if (stage === 'signup' && appUser.verification_status === 'unverified') {
          setStage('verification')
        } else if (authScreens.includes(stage)) {
          setStage('browse')
        }
      }

      performanceMonitor.end('user_data_sync')
    } catch (error) {
      console.error('Error syncing user profile:', error)
      toast.error('Failed to load profile data')
      performanceMonitor.record('user_data_sync_error', error)
    } finally {
      setLoading(false)
    }
  }, [stage, setUser, setAuthenticated, setStage])

  // Enhanced auth state management with better error handling
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        await syncUserData(session)
      } else {
        setUser(null)
        setAuthenticated(false)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [syncUserData, setUser, setAuthenticated, setLoading])

  // Optimized hooks with conditional loading
  useEffect(() => {
    if (user && authStatus === 'authenticated') {
      // Only load data if user is authenticated
      useProfiles()
      useMessages(activeChat)
      useBookings()
      useUserSync()
      useNotifications()
    }
  }, [user, authStatus, activeChat])

  // Enhanced keyboard shortcuts and accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Global shortcuts
      if (e.metaKey || e.ctrlKey) {
        switch (e.key) {
          case 'k':
            e.preventDefault()
            // Focus search
            document.getElementById('global-search')?.focus()
            break
          case 'n':
            e.preventDefault()
            // New message
            if (user) setStage('messages')
            break
          case '/':
            e.preventDefault()
            // Command palette
            toast.info('Command palette coming soon! ⚡')
            break
        }
      }

      // Navigation shortcuts
      if (!e.metaKey && !e.ctrlKey) {
        switch (e.key) {
          case 'Escape':
            setLeftMenuOpen(false)
            setRightMenuOpen(false)
            break
          case '1':
          case '2':
          case '3':
          case '4':
          case '5':
            if (!authScreens.includes(stage)) {
              const navIndex = parseInt(e.key) - 1
              if (mainNavigation[navIndex]) {
                setStage(mainNavigation[navIndex].id as any)
              }
            }
            break
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [setLeftMenuOpen, setRightMenuOpen, user, stage])

  // Memoized screen component for performance
  const CurrentScreen = useMemo(() => {
    return screenComponents[stage as keyof typeof screenComponents] || BrowseScreen
  }, [stage])

  // Memoized auth screen component
  const CurrentAuthScreen = useMemo(() => {
    return authScreenComponents[stage as keyof typeof authScreenComponents] || LoginScreen
  }, [stage])

  // Enhanced loading states with skeleton screens
  const renderLoadingState = () => (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-black to-slate-950 text-white flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center"
      >
        <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
        <p className="mt-4 text-slate-400">Loading amazing experiences...</p>
      </motion.div>
    </div>
  )

  // Enhanced error boundary fallback
  const renderErrorState = (error: Error) => (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-black to-slate-950 text-white flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md mx-auto p-8"
      >
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
      </motion.div>
    </div>
  )

  // Loading state
  if (authStatus === 'loading') {
    return renderLoadingState()
  }

  // Auth state
  const isAuthScreen = authScreens.includes(stage)
  if (isAuthScreen || authStatus === 'unauthenticated') {
    return (
      <ErrorBoundary fallback={renderErrorState}>
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
            <Suspense fallback={renderLoadingState()}>
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
}

  // Enhanced main app with performance optimizations
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
            <ErrorBoundary fallback={renderErrorState}>
              <Suspense fallback={renderLoadingState()}>
                <CurrentScreen />
              </Suspense>
            </ErrorBoundary>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Enhanced Bottom Navigation */}
      <BottomNav />

      {/* Enhanced Notification System */}
      <NotificationToasts />

      {/* Performance Monitor (development only) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 left-4 text-xs text-slate-500 font-mono">
          Stage: {stage} | FPS: <FPSCounter />
        </div>
      )}
    </div>
  )

export default MainApp
