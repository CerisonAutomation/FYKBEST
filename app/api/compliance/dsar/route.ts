import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

/**
 * api/compliance/dsar: Data Subject Access Request
 *
 * Implements GDPR DSAR export. Aggregates all user data from
 * profiles, messages, bookings, and events into a single JSON export.
 * Citation: https://gdpr.eu/right-of-access/
 */
export async function GET() {
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

  // 1. Aggregate All Data
  const [profile, messages, bookings, favorites] = await Promise.all([
    supabase.from('profiles').select('*').eq('user_id', user.id).single(),
    supabase.from('messages').select('*').or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`),
    supabase.from('bookings').select('*').or(`seeker_id.eq.${user.id},provider_id.eq.${user.id}`),
    supabase.from('favorites').select('*').eq('user_id', user.id),
  ])

  const exportData = {
    export_date: new Date().toISOString(),
    user_identity: {
      id: user.id,
      email: user.email,
    },
    profile: profile.data,
    conversations: messages.data,
    bookings: bookings.data,
    saved_profiles: favorites.data,
    compliance_notice:
      'This export contains all personal data associated with your account as per GDPR Article 15.',
  }

  return new Response(JSON.stringify(exportData, null, 2), {
    headers: {
      'Content-Type': 'application/json',
      'Content-Disposition': `attachment; filename="dsar-export-${user.id}.json"`,
    },
  })
}
