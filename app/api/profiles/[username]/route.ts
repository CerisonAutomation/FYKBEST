/**
 * Dynamic Profile API Route
 *
 * Demonstrates:
 * - Dynamic Route Segments with typed params
 * - generateStaticParams for static generation at build time
 * - Individual resource caching with tags
 * - Authentication and authorization
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/dynamic-routes
 */

import { createAdminClient, createClient } from '@/lib/supabase/server'
import { revalidateTag } from 'next/cache'
import { NextResponse } from 'next/server'

interface RouteParams {
  username: string
}

/**
 * Generate static params at build time
 *
 * This pre-renders the most popular profiles at build time.
 * Other profiles are rendered on-demand at request time.
 *
 * @see https://nextjs.org/docs/app/api-reference/functions/generate-static-params
 */
export async function generateStaticParams() {
  // Fetch top profiles to pre-render
  const supabase = await createAdminClient()

  // @ts-ignore - Table not in generated types yet
  const { data: profiles } = await (supabase.from('profiles') as any)
    .select('username')
    .eq('is_public', true)
    .order('view_count', { ascending: false })
    .limit(100)

  return (
    (profiles as unknown as Array<{ username: string }>)?.map((profile) => ({
      username: profile.username,
    })) || []
  )
}

/**
 * GET /api/profiles/[username]
 *
 * Fetches a single profile by username.
 * Supports both static (pre-rendered) and dynamic rendering.
 */
export async function GET(request: Request, { params }: { params: Promise<RouteParams> }) {
  const { username } = await params
  const supabase = await createClient()

  // @ts-ignore - Table not in generated types yet
  const { data: profile, error } = await (supabase.from('profiles') as any)
    .select('*')
    .eq('username', username)
    .eq('is_public', true)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }
    return NextResponse.json(
      { error: 'Failed to fetch profile', details: error.message },
      { status: 500 }
    )
  }

  return NextResponse.json(profile)
}

/**
 * POST /api/profiles/[username]
 *
 * Revalidate a specific profile cache.
 * Requires authentication and admin privileges.
 */
export async function POST(request: Request, { params }: { params: Promise<RouteParams> }) {
  // 1. Authentication check
  const supabase = await createClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json(
      { error: 'Unauthorized', message: 'Authentication required' },
      { status: 401 }
    )
  }

  // 2. Admin authorization check
  const isAdmin = user.app_metadata?.role === 'admin' || user.user_metadata?.role === 'admin'

  if (!isAdmin) {
    return NextResponse.json(
      { error: 'Forbidden', message: 'Admin access required' },
      { status: 403 }
    )
  }

  const { username } = await params
  const { searchParams } = new URL(request.url)
  const action = searchParams.get('action')

  if (action === 'revalidate') {
    revalidateTag(`profile-${username}`)
    return NextResponse.json({
      revalidated: true,
      username,
      timestamp: new Date().toISOString(),
    })
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
}
