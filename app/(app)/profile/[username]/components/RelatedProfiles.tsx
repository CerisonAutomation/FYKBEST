/**
 * Related Profiles Component
 *
 * Server Component that fetches profiles in the same location.
 * Streams in after the main content.
 */

import { createClient } from '@/lib/supabase/server'

interface RelatedProfilesProps {
  location?: string
  excludeUserId: string
}

export async function RelatedProfiles({ location, excludeUserId }: RelatedProfilesProps) {
  if (!location) return null

  const supabase = await createClient()

  const { data: profiles } = await supabase
    .from('profiles')
    .select('username, display_name, avatar_url, subscription_tier')
    .ilike('location', `%${location}%`)
    .neq('user_id', excludeUserId)
    .eq('is_public', true)
    .limit(4)

  if (!profiles || profiles.length === 0) return null

  return (
    <section className="mt-12 pt-8 border-t border-slate-800">
      <h2 className="text-xl font-bold text-white mb-4">More in {location}</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {(profiles as Record<string, unknown>[]).map((profile) => (
          <a
            key={profile.username as string}
            href={`/profile/${profile.username}`}
            className="group bg-slate-900/50 rounded-xl border border-slate-800 p-4 hover:border-amber-500/50 transition-colors"
          >
            <div className="w-16 h-16 mx-auto rounded-full bg-slate-800 mb-3 overflow-hidden">
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url as string}
                  alt={profile.display_name as string}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-xl font-bold text-slate-600">
                    {(profile.display_name as string).charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            <p className="text-center font-medium text-white group-hover:text-amber-500 transition-colors truncate">
              {profile.display_name as string}
            </p>
            <p className="text-center text-slate-500 text-sm truncate">
              @{profile.username as string}
            </p>
          </a>
        ))}
      </div>
    </section>
  )
}
