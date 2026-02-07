/**
 * Navigation Utilities
 *
 * Helper functions for navigation that work with both
 * the Zustand stage state and Next.js router.
 */

import { useRouter } from 'next/navigation'
import { useCallback } from 'react'
import { useAppStore } from './store'

// Map stage names to URL paths
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
  events: '/events',
  'create-party': '/events/create',
  'event-detail': '/events',
  'right-now': '/right-now',
  settings: '/settings',
  'settings-photos': '/settings/photos',
  'settings-location': '/settings/location',
  'settings-notifications': '/settings/notifications',
  'settings-privacy': '/settings/privacy',
  login: '/login',
  signup: '/signup',
  'magic-link': '/magic-link',
  verification: '/verification',
  onboarding: '/onboarding',
  role: '/role',
  terms: '/terms',
  consent: '/consent',
}

/**
 * Hook for navigation that syncs Zustand state with URL
 */
export function useNavigation() {
  const router = useRouter()
  const { setStage } = useAppStore()

  const navigate = useCallback(
    (stageOrPath: string) => {
      // If it's a stage name, convert to path
      const path = stageToPath[stageOrPath] || stageOrPath

      // Update Zustand state for backward compatibility
      const stageName = Object.entries(stageToPath).find(([, p]) => p === path)?.[0] || stageOrPath
      setStage(stageName)

      // Navigate to URL
      router.push(path)
    },
    [router, setStage]
  )

  const navigateToProfile = useCallback(
    (username: string) => {
      router.push(`/profile/${username}`)
    },
    [router]
  )

  const goBack = useCallback(() => {
    router.back()
  }, [router])

  return {
    navigate,
    navigateToProfile,
    goBack,
  }
}

/**
 * Get URL path for a stage name
 */
export function getPathForStage(stage: string): string {
  return stageToPath[stage] || '/browse'
}

/**
 * Get stage name for a URL path
 */
export function getStageForPath(path: string): string {
  const entry = Object.entries(stageToPath).find(([, p]) => p === path)
  return entry?.[0] || 'browse'
}
