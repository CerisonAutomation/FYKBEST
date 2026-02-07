import type { Database } from '@/types/supabase'
import { type CookieOptions, createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

/**
 * SENTINEL PATTERN: Server-Side Client
 *
 * Creates a type-safe Supabase client for Server Components and API routes.
 * Handles cookie management for SSR authentication.
 *
 * @security Cookie-based session management
 * @performance Request-scoped client creation
 */
export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (_error) {
            // Handle case where cookies can't be set (e.g., during SSR)
            console.warn('Failed to set cookie:', name)
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options, maxAge: 0 })
          } catch (_error) {
            console.warn('Failed to remove cookie:', name)
          }
        },
      },
    }
  )
}

/**
 * 🔐 Admin Client for privileged operations
 * Uses service role key - ONLY use in secure server contexts
 */
export async function createAdminClient() {
  const { createClient: createAdminClientRaw } = await import('@supabase/supabase-js')

  return createAdminClientRaw<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}
