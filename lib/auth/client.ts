'use client'

/**
 * Auth Client - Browser-side Supabase Auth
 * Singleton pattern for performance
 */

import type { Database } from '@/types/supabase'
import { createBrowserClient } from '@supabase/ssr'

// Global client instance for singleton pattern
let browserClient: ReturnType<typeof createBrowserClient<Database>> | null = null

/**
 * Create or retrieve the Supabase browser client
 * Uses singleton pattern to prevent multiple instances
 */
export function createAuthClient() {
  if (browserClient) return browserClient

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    throw new Error('Missing Supabase environment variables')
  }

  browserClient = createBrowserClient<Database>(url, key, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      flowType: 'pkce',
      debug: process.env.NODE_ENV === 'development',
    },
    cookieOptions: {
      name: 'sb-auth',
      lifetime: 60 * 60 * 24 * 7, // 7 days
      domain: '',
      path: '/',
      sameSite: 'lax',
    },
  })

  return browserClient
}

/**
 * Get the singleton auth client instance
 */
export const authClient = createAuthClient()

/**
 * Subscribe to auth state changes
 */
export function onAuthStateChange(callback: (event: string, session: unknown) => void) {
  return authClient.auth.onAuthStateChange(callback)
}

/**
 * Get current session
 */
export async function getSession() {
  const {
    data: { session },
    error,
  } = await authClient.auth.getSession()
  return { session, error }
}

/**
 * Get current user
 */
export async function getUser() {
  const {
    data: { user },
    error,
  } = await authClient.auth.getUser()
  return { user, error }
}
