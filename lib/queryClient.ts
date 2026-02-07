/**
 * React Query Client Configuration
 * Enterprise query management for Next.js 16
 */

import { QueryClient } from '@tanstack/react-query'

// Create a client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Stale time: 5 minutes
      staleTime: 5 * 60 * 1000,
      // Cache time: 10 minutes (gcTime in v5)
      gcTime: 10 * 60 * 1000,
      // Retry failed requests 3 times
      retry: 3,
      // Retry delay with exponential backoff
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      // Don't refetch on window focus
      refetchOnWindowFocus: false,
      // Don't refetch on reconnect
      refetchOnReconnect: true,
    },
    mutations: {
      // Retry failed mutations once
      retry: 1,
      // Retry delay for mutations
      retryDelay: 1000,
    },
  },
})

// Query keys for consistent caching
export const queryKeys = {
  // User queries
  user: ['user'] as const,
  profile: (userId: string) => ['profile', userId] as const,
  subscriptions: (userId: string) => ['subscriptions', userId] as const,

  // Content queries
  profiles: ['profiles'] as const,
  events: ['events'] as const,
  bookings: ['bookings'] as const,
  messages: ['messages'] as const,

  // Search queries
  search: (query: string) => ['search', query] as const,

  // Settings queries
  settings: ['settings'] as const,
  notifications: ['notifications'] as const,

  // Admin queries
  admin: ['admin'] as const,
  analytics: ['analytics'] as const,
} as const

// Query invalidation helpers
export const invalidateQueries = {
  // Invalidate user-related queries
  user: () => queryClient.invalidateQueries({ queryKey: queryKeys.user }),
  profile: (userId: string) =>
    queryClient.invalidateQueries({ queryKey: queryKeys.profile(userId) }),
  subscriptions: (userId: string) =>
    queryClient.invalidateQueries({ queryKey: queryKeys.subscriptions(userId) }),

  // Invalidate content queries
  profiles: () => queryClient.invalidateQueries({ queryKey: queryKeys.profiles }),
  events: () => queryClient.invalidateQueries({ queryKey: queryKeys.events }),
  bookings: () => queryClient.invalidateQueries({ queryKey: queryKeys.bookings }),
  messages: () => queryClient.invalidateQueries({ queryKey: queryKeys.messages }),

  // Invalidate search queries
  search: (query?: string) =>
    queryClient.invalidateQueries({ queryKey: query ? ['search', query] : ['search'] }),

  // Invalidate settings
  settings: () => queryClient.invalidateQueries({ queryKey: queryKeys.settings }),
  notifications: () => queryClient.invalidateQueries({ queryKey: queryKeys.notifications }),
} as const

// Prefetch helpers
export const prefetchQueries = {
  // Prefetch user data
  user: async (userId: string) => {
    // Implementation would depend on your data fetching logic
    // await queryClient.prefetchQuery({
    //   queryKey: queryKeys.profile(userId),
    //   queryFn: () => fetchProfile(userId),
    // })
  },

  // Prefetch content
  profiles: async () => {
    // await queryClient.prefetchQuery({
    //   queryKey: queryKeys.profiles,
    //   queryFn: () => fetchProfiles(),
    // })
  },
} as const
