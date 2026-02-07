/**
 * Auth Server - Server-side Supabase Auth
 * For Server Components, API Routes, and Server Actions
 */

import type { Database } from '@/types/supabase'
import { type CookieOptions, createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import type { NextRequest, NextResponse } from 'next/server'

/**
 * Create server client for Server Components
 */
export async function createServerAuthClient() {
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
          } catch {
            // Handle middleware context where cookies can't be set
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options, maxAge: 0 })
          } catch {
            // Handle middleware context
          }
        },
      },
    }
  )
}

/**
 * Create middleware client for Edge Runtime
 */
export function createMiddlewareAuthClient(request: NextRequest, response: NextResponse) {
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options })
          response.cookies.set({ name, value: '', ...options, maxAge: 0 })
        },
      },
    }
  )
}

/**
 * Create admin client for privileged operations
 * ⚠️ Only use in secure server contexts with service role key
 */
export async function createAdminAuthClient() {
  const { createClient } = await import('@supabase/supabase-js')

  return createClient<Database>(
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

/**
 * Get current authenticated user (Server Component only)
 * Throws error if not authenticated
 */
export async function requireAuth() {
  const supabase = await createServerAuthClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/login?redirectTo=' + encodeURIComponent('/'))
  }

  return user
}

/**
 * Get current authenticated user (Server Component only)
 * Returns null if not authenticated (no redirect)
 */
export async function getAuthUser() {
  const supabase = await createServerAuthClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}

/**
 * Check if user is admin
 */
export async function requireAdmin() {
  const user = await requireAuth()

  // Check admin role in app_metadata
  const isAdmin = user.app_metadata?.role === 'admin' || user.user_metadata?.role === 'admin'

  if (!isAdmin) {
    redirect('/')
  }

  return user
}

/**
 * Refresh session (for Server Actions)
 */
export async function refreshSession() {
  const supabase = await createServerAuthClient()
  const {
    data: { session },
    error,
  } = await supabase.auth.refreshSession()
  return { session, error }
}

/**
 * Sign out (Server Action)
 */
export async function signOut(scope: 'global' | 'local' | 'others' = 'global') {
  const supabase = await createServerAuthClient()
  const { error } = await supabase.auth.signOut({ scope })

  if (!error) {
    redirect('/login')
  }

  return { error }
}
