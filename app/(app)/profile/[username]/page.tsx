/**
 * Dynamic Profile Page
 *
 * Public profile view for any user.
 * Dynamic page - requires authentication.
 *
 * @see https://nextjs.org/docs/app/getting-started/layouts-and-pages#creating-a-dynamic-segment
 */

import { createAdminClient, createClient } from '@/lib/supabase/server'
import type { Metadata } from 'next'
import { cache } from 'react'
import { Suspense } from 'react'
import { ProfileContent } from './components/ProfileContent'
import { type Profile, ProfileHeader } from './components/ProfileHeader'
import { RelatedProfiles } from './components/RelatedProfiles'

interface ProfilePageProps {
  params: Promise<{ username: string }>
}

// Cache the profile fetch to deduplicate requests
const getProfile = cache(async (username: string): Promise<Profile | null> => {
  const supabase = await createClient()

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username)
    .eq('is_public', true)
    .single()

  if (error || !profile) {
    return null
  }

  return profile as Profile
})

export async function generateMetadata({ params }: ProfilePageProps): Promise<Metadata> {
  const { username } = await params
  const profile = await getProfile(username)

  if (!profile) {
    return { title: 'Profile Not Found' }
  }

  return {
    title: `${profile.display_name} (@${profile.username})`,
    description: profile.bio || `View ${profile.display_name}'s profile on KING SOCIAL`,
  }
}

// Force dynamic rendering since this page requires auth
export const dynamic = 'force-dynamic'

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { username } = await params
  const profile = await getProfile(username)

  if (!profile) {
    return (
      <div className="text-center py-16">
        <h1 className="text-xl font-bold text-white mb-2">Profile Not Found</h1>
        <p className="text-slate-400">This profile doesn&apos;t exist or is private.</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <ProfileHeader profile={profile} />
      <Suspense fallback={<div className="mt-8 h-32 bg-slate-800 rounded animate-pulse" />}>
        <ProfileContent userId={profile.user_id} />
      </Suspense>
      <Suspense fallback={null}>
        <RelatedProfiles location={profile.location} excludeUserId={profile.user_id} />
      </Suspense>
    </div>
  )
}
