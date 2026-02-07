'use client'

import { env } from '@/lib/validators/env'
import type { Database } from '@/types/supabase'
import { createBrowserClient } from '@supabase/ssr'

/**
 * VIRTUOSO PATTERN: Browser Client Singleton
 *
 * Creates a type-safe Supabase client for browser environments.
 * Uses singleton pattern to prevent multiple client instances.
 *
 * @performance Creates client only once per session
 * @security Uses secure cookie handling via @supabase/ssr
 */
let browserClient: ReturnType<typeof createBrowserClient<Database>> | null = null

export function createClient() {
  if (browserClient) return browserClient

  browserClient = createBrowserClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    }
  )

  return browserClient
}

// Export singleton instance
export const supabase = createClient()
