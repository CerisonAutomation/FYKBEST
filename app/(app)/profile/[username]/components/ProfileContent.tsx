/**
 * Profile Content Component
 *
 * Server Component that fetches additional profile data.
 * Demonstrates parallel data fetching and streaming.
 */

import { createClient } from '@/lib/supabase/server'

interface ProfileContentProps {
  userId: string
}

export async function ProfileContent({ userId }: ProfileContentProps) {
  const supabase = await createClient()

  // Parallel data fetching
  const [eventsResult, photosResult] = await Promise.all([
    // Upcoming events
    supabase
      .from('events')
      .select('*')
      .eq('host_id', userId)
      .gte('start_time', new Date().toISOString())
      .order('start_time', { ascending: true })
      .limit(3),

    // Recent photos
    supabase
      .from('photos')
      .select('*')
      .eq('user_id', userId)
      .eq('is_public', true)
      .order('created_at', { ascending: false })
      .limit(6),
  ])

  const events = eventsResult.data || []
  const photos = photosResult.data || []

  return (
    <div className="space-y-8">
      {/* Upcoming Events */}
      <section>
        <h2 className="text-xl font-bold text-white mb-4">Upcoming Events</h2>
        {events.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-4">
            {events.map((event: Record<string, unknown>) => (
              <a
                key={event.id as string}
                href={`/events/${event.id}`}
                className="block bg-slate-900/50 rounded-xl border border-slate-800 p-4 hover:border-amber-500/50 transition-colors"
              >
                <p className="text-amber-500 text-sm font-medium mb-2">
                  {new Date(event.start_time as string).toLocaleDateString()}
                </p>
                <h3 className="font-bold text-white mb-1">{event.title as string}</h3>
                <p className="text-slate-400 text-sm line-clamp-2">{event.description as string}</p>
              </a>
            ))}
          </div>
        ) : (
          <p className="text-slate-500">No upcoming events</p>
        )}
      </section>

      {/* Photos */}
      <section>
        <h2 className="text-xl font-bold text-white mb-4">Photos</h2>
        {photos.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {photos.map((photo: Record<string, unknown>) => (
              <div
                key={photo.id as string}
                className="aspect-square rounded-xl overflow-hidden bg-slate-800"
              >
                <img
                  src={photo.url as string}
                  alt=""
                  className="w-full h-full object-cover hover:scale-105 transition-transform"
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-500">No photos yet</p>
        )}
      </section>
    </div>
  )
}
