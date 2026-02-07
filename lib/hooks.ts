'use client'

import { useAppStore } from '@/lib/store'
import { supabase } from '@/lib/supabase/client'
import type { User } from '@/types/app'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Zenith Shared Hooks
 * Consolidated for extreme architectural performance.
 */

// --- UTILITY HOOKS ---

export const useVibrate = () => {
  return useCallback((pattern: number | number[] = [10, 10, 10]) => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(pattern)
    }
  }, [])
}

export const useValidateEmail = () => {
  return useCallback((email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }, [])
}

export const useGenerateToken = () => {
  return useCallback(() => {
    return Math.random().toString(36).substring(2, 15)
  }, [])
}

export const useFormatTime = () => {
  return useCallback((ms: number) => {
    const min = Math.floor(ms / 60000)
    const sec = Math.floor((ms % 60000) / 1000)
    return `${min}:${sec.toString().padStart(2, '0')}`
  }, [])
}

export const useScrollToBottom = (dependency: unknown) => {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight
    }
  }, [dependency])
  return ref
}

export const useClickOutside = (callback: () => void) => {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback()
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [callback])
  return ref
}

// --- AUTH HOOK ---

interface UseAuthReturn {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>
  signUp: (
    email: string,
    password: string,
    metadata: Record<string, unknown>
  ) => Promise<{ error: Error | null }>
  signOut: () => Promise<void>
  signInWithOAuth: (provider: 'google' | 'apple' | 'facebook') => Promise<void>
  sendMagicLink: (email: string) => Promise<{ error: Error | null }>
  resetPassword: (email: string) => Promise<{ error: Error | null }>
  updatePassword: (password: string) => Promise<{ error: Error | null }>
  refreshSession: () => Promise<void>
}

function mapDbUserToUser(dbUser: any, dbProfile: any): User {
  return {
    id: dbUser.id,
    email: dbUser.email || '',
    username: dbProfile?.username || undefined,
    display_name: dbProfile?.display_name || dbUser?.name || 'User',
    avatar_url: dbUser.avatar_url || undefined,
    bio: dbUser.bio || dbProfile?.bio || undefined,
    role: (dbUser.role as any) || 'seeker',
    verification_status: (dbProfile?.verification_status as any) || 'unverified',
    subscription_tier: (dbUser.subscription_tier as any) || 'free',
    subscription_status: 'active',
    presence: 'online',
    is_incognito: dbUser.is_incognito || false,
    available_now: dbUser.available_now || false,
    city: dbUser.city || undefined,
    country: dbUser.country || undefined,
    age: dbUser.age || undefined,
    interests: dbUser.interests || undefined,
    tribes: dbUser.interests || undefined,
    looking_for: dbProfile?.looking_for || undefined,
    photos: dbUser.photos || undefined,
    height_cm: dbUser.height_cm || undefined,
    body_type: dbUser.body_type || undefined,
    hourly_rate: dbUser.hourly_rate ? Number(dbUser.hourly_rate) : 0,
    response_time: dbUser.response_time || undefined,
    reviews_count: dbUser.reviews_count || 0,
    average_rating: Number(dbUser.average_rating) || 0,
    popularity_score: 0,
    fame_rating: 0,
    profile_views: 0,
    onboarding_completed: false,
    onboarding_step: 0,
    profile_completeness: 0,
    travel_mode_enabled: false,
    settings: (dbUser.settings as any) || undefined,
    is_admin: dbUser.role === 'admin',
    is_active: !!dbUser.online_status,
    last_seen_at: dbUser.last_seen,
    created_at: dbUser.created_at,
  }
}

export function useAuth(): UseAuthReturn {
  const router = useRouter()
  const { user, setUser, setLoading, isLoading } = useAppStore()
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const fetchFullUser = useCallback(
    async (userId: string) => {
      const [userRes, profileRes] = await Promise.all([
        supabase.from('users').select('*').eq('id', userId).single(),
        supabase.from('profiles').select('*').eq('user_id', userId).single(),
      ])

      if (userRes.data) {
        const mappedUser = mapDbUserToUser((userRes as any).data, (profileRes as any).data)
        setUser(mappedUser)
        setIsAuthenticated(true)
      } else {
        setUser(null)
        setIsAuthenticated(false)
      }
    },
    [setUser]
  )

  useEffect(() => {
    let mounted = true

    async function getInitialSession() {
      setLoading(true)
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()
        if (error) throw error
        if (session?.user && mounted) {
          await fetchFullUser(session.user.id)
        } else {
          setUser(null)
          setIsAuthenticated(false)
        }
      } catch (error) {
        console.error('Session error:', error)
        setUser(null)
        setIsAuthenticated(false)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    getInitialSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return
      if (event === 'SIGNED_IN' && session?.user) {
        await fetchFullUser(session.user.id)
      } else if (event === 'SIGNED_OUT') {
        setUser(null)
        setIsAuthenticated(false)
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [setUser, setLoading, fetchFullUser])

  const signIn = useCallback(
    async (email: string, password: string) => {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        if (data.user) await fetchFullUser(data.user.id)
        return { error: null }
      } catch (error) {
        return { error: error as Error }
      }
    },
    [fetchFullUser]
  )

  const signUp = useCallback(
    async (email: string, password: string, metadata: Record<string, unknown>) => {
      try {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: metadata, emailRedirectTo: `${window.location.origin}/auth/callback` },
        })
        if (error) throw error
        return { error: null }
      } catch (error) {
        return { error: error as Error }
      }
    },
    []
  )

  const signOut = useCallback(async () => {
    await supabase.auth.signOut()
    setUser(null)
    setIsAuthenticated(false)
    router.push('/login')
  }, [setUser, router])

  const signInWithOAuth = useCallback(async (provider: 'google' | 'apple' | 'facebook') => {
    await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
  }, [])

  const sendMagicLink = useCallback(async (email: string) => {
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
      })
      return { error }
    } catch (error) {
      return { error: error as Error }
    }
  }, [])

  const resetPassword = useCallback(async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })
      return { error }
    } catch (error) {
      return { error: error as Error }
    }
  }, [])

  const updatePassword = useCallback(async (password: string) => {
    try {
      const { error } = await supabase.auth.updateUser({ password })
      return { error }
    } catch (error) {
      return { error: error as Error }
    }
  }, [])

  const refreshSession = useCallback(async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (session?.user) await fetchFullUser(session.user.id)
  }, [fetchFullUser])

  return {
    user,
    isLoading,
    isAuthenticated,
    signIn,
    signUp,
    signOut,
    signInWithOAuth,
    sendMagicLink,
    resetPassword,
    updatePassword,
    refreshSession,
  }
}
