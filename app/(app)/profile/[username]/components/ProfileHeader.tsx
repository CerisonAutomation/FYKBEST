/**
 * Profile Header Component
 *
 * Displays the main profile information.
 * Can be rendered on server or client.
 */

'use client'

import Link from 'next/link'
import { useState } from 'react'

export interface Profile {
  id: string
  user_id: string
  username: string
  display_name: string
  avatar_url?: string
  bio?: string
  location?: string
  website?: string
  subscription_tier: string
  verified: boolean
}

interface ProfileHeaderProps {
  profile: Profile
}

export function ProfileHeader({ profile }: ProfileHeaderProps) {
  const [imageError, setImageError] = useState(false)

  const tierColors: Record<string, string> = {
    free: 'bg-slate-600',
    premium: 'bg-amber-500',
    vip: 'bg-purple-500',
  }

  return (
    <div className="bg-slate-900/50 rounded-2xl border border-slate-800 p-6 md:p-8">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Avatar */}
        <div className="relative">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden bg-gradient-to-br from-slate-700 to-slate-800">
            {profile.avatar_url && !imageError ? (
              <img
                src={profile.avatar_url}
                alt={profile.display_name}
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-4xl md:text-5xl font-bold text-slate-600">
                  {profile.display_name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>

          {/* Tier Badge */}
          <div
            className={`absolute -bottom-2 -right-2 px-3 py-1 rounded-full text-xs font-bold text-black ${tierColors[profile.subscription_tier] || tierColors.free}`}
          >
            {profile.subscription_tier.toUpperCase()}
          </div>
        </div>

        {/* Info */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl md:text-3xl font-bold text-white">{profile.display_name}</h1>
            {profile.verified && (
              <span className="text-amber-500" title="Verified">
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-label="Verified account"
                >
                  <title>Verified</title>
                  <path
                    fillRule="evenodd"
                    d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
            )}
          </div>

          <p className="text-slate-500 mb-4">@{profile.username}</p>

          {profile.bio && <p className="text-slate-300 mb-4 max-w-xl">{profile.bio}</p>}

          <div className="flex flex-wrap gap-4 text-sm text-slate-400">
            {profile.location && (
              <span className="flex items-center gap-1">
                <span>📍</span> {profile.location}
              </span>
            )}
            {profile.website && (
              <a
                href={profile.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-amber-500 hover:text-amber-400"
              >
                <span>🔗</span> Website
              </a>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex md:flex-col gap-3">
          <button
            type="button"
            className="px-6 py-2 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-lg transition-colors"
          >
            Follow
          </button>
          <Link
            href={`/messages?to=${profile.username}`}
            className="px-6 py-2 border border-slate-700 hover:bg-slate-800 text-white font-medium rounded-lg transition-colors text-center"
          >
            Message
          </Link>
        </div>
      </div>
    </div>
  )
}
