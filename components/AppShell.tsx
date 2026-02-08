/**
 * App Shell
 *
 * Main application shell with navigation.
 * Client Component that wraps authenticated pages.
 *
 * Syncs Zustand stage state with Next.js URL for backward compatibility.
 */

'use client'

import { ErrorBoundary } from '@/components/ErrorBoundary'
import { useAppStore } from '@/lib/store'
import { supabase } from '@/lib/supabase/client'
import { useBookings, useProfiles, useUserSync } from '@/lib/supabase/hooks'
import { useNotifications } from '@/lib/supabase/useNotifications'
import type { User } from '@/types/app'
import type { PostgrestSingleResponse } from '@supabase/supabase-js'
import { AnimatePresence, motion } from 'framer-motion'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { BottomNav } from './king-app/shell/BottomNav'
import { Header } from './king-app/shell/Header'
import { LeftSidebar } from './king-app/shell/LeftSidebar'
import { RightSidebar } from './king-app/shell/RightSidebar'

// Map URL paths to stage names for backward compatibility
const pathToStage: Record<string, string> = {
  '/browse': 'browse',
  '/explore': 'explore',
  '/messages': 'messages',
  '/bookings': 'bookings',
  '/favorites': 'favorites',
  '/subscription': 'subscription',
  '/me': 'profile',
  '/edit-profile': 'edit-profile',
  '/ai-settings': 'ai-settings',
  '/events': 'party',
  '/events/create': 'create-party',
  '/right-now': 'right-now',
  '/settings': 'settings',
  '/settings/photos': 'settings-photos',
  '/settings/location': 'settings-location',
  '/settings/notifications': 'settings-notifications',
  '/settings/privacy': 'settings-privacy',
}

const stageToPath: Record<string, string> = {
  browse: '/browse',
  explore: '/explore',
  messages: '/messages',
  bookings: '/bookings',
  favorites: '/favorites',
  subscription: '/subscription',
  profile: '/me',
  'edit-profile': '/edit-profile',
  'ai-settings': '/ai-settings',
  party: '/events',
  'create-party': '/events/create',
  'event-detail': '/events',
  'right-now': '/right-now',
  settings: '/settings',
  'settings-photos': '/settings/photos',
  'settings-location': '/settings/location',
  'settings-notifications': '/settings/notifications',
  'settings-privacy': '/settings/privacy',
  detail: '/browse',
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const {
    setUser,
    setAuthenticated,
    setLoading,
    setLeftMenuOpen,
    setRightMenuOpen,
    stage,
    setStage,
  } = useAppStore()

  // Use synchronized hooks
  useProfiles()
  useBookings()
  useNotifications()

  // Sync URL with stage state (backward compatibility)
  useEffect(() => {
    if (!pathname) return
    const currentStage = pathToStage[pathname]
    if (currentStage && currentStage !== stage) {
      setStage(currentStage)
    }
  }, [pathname, stage, setStage])

  // Sync stage state with URL
  useEffect(() => {
    if (!pathname) return
    const expectedPath = stageToPath[stage]
    if (expectedPath && expectedPath !== pathname && !pathname.startsWith('/profile/')) {
      router.push(expectedPath)
    }
  }, [stage, pathname, router])

  // Security: Auth State Synchronization
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        try {
          // Fetch comprehensive user profile
          const [profileResponse, userResponse] = (await Promise.all([
            supabase.from('profiles').select('*').eq('user_id', session.user.id).single(),
            supabase.from('users').select('*').eq('id', session.user.id).single(),
          ])) as [PostgrestSingleResponse<any>, PostgrestSingleResponse<any>]

          const profile = profileResponse.data
          const userRecord = userResponse.data

          if (profile && userRecord) {
            // Map Supabase data to App User type
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
              tribes: userRecord.tribes || [],
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
          }
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error'
          console.error(
            '[AppShell] Error syncing user profile:',
            error,
            '\n[AppShell] Error details:',
            { timestamp: new Date().toISOString(), error: errorMessage }
          )
        }
      } else {
        setUser(null)
        setAuthenticated(false)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [setUser, setAuthenticated, setLoading])

  // Close menus when clicking escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLeftMenuOpen(false)
        setRightMenuOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [setLeftMenuOpen, setRightMenuOpen])

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-black to-slate-950 text-white relative overflow-x-hidden">
      {/* Header */}
      <Header />

      {/* Sidebars */}
      <LeftSidebar />
      <RightSidebar />

      {/* Main Content */}
      <main className="pt-20 sm:pt-24 pb-24 lg:pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen">
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <ErrorBoundary>{children}</ErrorBoundary>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Navigation (Mobile) */}
      <BottomNav />

      {/* Notification Toast Area */}
      <NotificationToasts />
    </div>
  )
}

function NotificationToasts() {
  const { notifications, removeNotification } = useAppStore()

  return (
    <div className="fixed top-20 sm:top-24 right-4 sm:right-8 z-50 space-y-3 max-w-xs sm:max-w-sm">
      <AnimatePresence>
        {notifications.slice(0, 3).map((notif: any) => (
          <motion.div
            key={notif.id}
            initial={{ opacity: 0, x: 100, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.9 }}
            className="bg-gradient-to-r from-slate-900/95 to-slate-950/95 border border-amber-600/40 rounded-xl p-3 sm:p-4 shadow-2xl shadow-amber-600/20 backdrop-blur-md"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center font-black text-white flex-shrink-0 text-sm">
                {notif.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-black text-white truncate">{notif.from}</p>
                <p className="text-xs text-slate-400 truncate">{notif.text}</p>
              </div>
              <button
                onClick={() => removeNotification(notif.id)}
                className="text-slate-500 hover:text-slate-400 flex-shrink-0 p-1"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
