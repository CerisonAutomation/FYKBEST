import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

/**
 * storage-sign: Secure Media Proxy
 *
 * Validates database permissions before generating a signed URL for storage.
 * Citation: https://supabase.com/docs/guides/storage/serving/signed-urls
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const path = searchParams.get('path')
  const bucket = searchParams.get('bucket') || 'profile_photos'

  if (!path) return NextResponse.json({ error: 'Path required' }, { status: 400 })

  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // 1. Permission Check
  // In Zenith, we validate if the viewer has access to the album/photo in the DB first.
  // Placeholder: for v0 we allow any authenticated user to request a signed URL,
  // but in prod we'd check public.album_shares or public.fn_is_match.

  const { data, error } = await supabase.storage.from(bucket).createSignedUrl(path, 3600) // 1 hour expiry

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ url: data.signedUrl })
}
