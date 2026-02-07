'use client'

import { useVibrate } from '@/lib/hooks'
import { useAppStore } from '@/lib/store'
import { supabase } from '@/lib/supabase/client'
import { useInfiniteQuery } from '@tanstack/react-query'
import { AnimatePresence, motion } from 'framer-motion'
import { Camera, Filter, Plus, Search, Shield, SlidersHorizontal, Zap, Heart, MessageCircle } from 'lucide-react'
import Image from 'next/image'
import React, { useState, useMemo, useCallback } from 'react'
import { VirtuosoGrid } from 'react-virtuoso'
import { ProfileCard } from '../components/ProfileCard'
import { useAuth } from '@/lib/auth/hooks'
import { useRouter } from 'next/navigation'

export function BrowseScreen() {
  const { user, searchQuery, setSearchQuery } = useAppStore()
  const { status: authStatus } = useAuth()
  const router = useRouter()
  const vibrate = useVibrate()

  // Redirect if not authenticated
  React.useEffect(() => {
    if (authStatus === 'unauthenticated') {
      router.push('/login')
    }
  }, [authStatus, router])

  // Responsive states
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [filters, setFilters] = useState({
    minAge: 18,
    maxAge: 99,
    verifiedOnly: false,
    radiusKm: 50,
  })

  const [isMobile, setIsMobile] = useState(false)

  // Detect mobile screen size
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery({
    queryKey: ['profiles-grid', user?.id, filters, searchQuery],
    queryFn: async ({ pageParam }) => {
      if (!user) return { pages: [], hasNextPage: false }

      const { data, error } = await (supabase.rpc as any)('get_profiles_grid', {
        p_viewer_id: user.id,
        p_min_age: filters.minAge,
        p_max_age: filters.maxAge,
        p_verified_only: filters.verifiedOnly,
        p_radius_km: filters.radiusKm,
        p_limit: isMobile ? 20 : 40, // Fewer items on mobile
        p_cursor_id: pageParam,
      })
      if (error) throw error
      return data
    },
    initialPageParam: null as any,
    getNextPageParam: (lastPage) => (lastPage.length === (isMobile ? 20 : 40) ? lastPage[lastPage.length - 1].profile_id : undefined),
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // Cache data for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep data in cache for 10 minutes
  })

  const profiles = useMemo(() => data?.pages.flat() || [], [data])

  // Enhanced interaction handlers
  const handleProfileView = useCallback((profileId: string) => {
    vibrate([10])
    // Track profile view
    console.log(`Profile viewed: ${profileId}`)
  }, [vibrate])

  const handleLikeProfile = useCallback((profileId: string) => {
    vibrate([20, 10])
    // Implement like functionality
    console.log(`Profile liked: ${profileId}`)
  }, [vibrate])

  const handleSendMessage = useCallback((profileId: string) => {
    vibrate([15, 8, 15])
    router.push(`/messages?with=${profileId}`)
  }, [vibrate, router])

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-slate-950 via-black to-slate-950" role="main" aria-label="Browse profiles">
      {/* Responsive Header */}
      <div className="lg:hidden sticky top-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800 px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold text-white">Discover</h1>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
              aria-label={`Switch to ${viewMode === 'grid' ? 'list' : 'grid'} view`}
            >
              {viewMode === 'grid' ? (
                <Filter className="w-5 h-5 text-amber-500" />
              ) : (
                <Plus className="w-5 h-5 text-amber-500" />
              )}
            </button>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 rounded-lg transition-colors ${
                showFilters ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-300'
              }`}
              aria-label="Toggle filters"
            >
              <SlidersHorizontal className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Stories Bar - Simplified */}
      <div className="lg:hidden">
        <div className="flex gap-3 overflow-x-auto scrollbar-hide py-3 px-4" role="region" aria-label="User stories">
          <button
            className="flex flex-col items-center gap-2 flex-shrink-0 p-3 bg-slate-800/50 rounded-xl min-w-[100px]"
            onClick={() => router.push('/edit-profile')}
          >
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
              <Plus className="w-6 h-6 text-black" />
            </div>
            <span className="text-xs text-slate-400 uppercase tracking-tighter">Your Story</span>
          </button>
          {[1, 2, 3].map((i) => (
            <button
              key={i}
              className="flex flex-col items-center gap-2 flex-shrink-0 p-3 bg-slate-800/50 rounded-xl min-w-[80px]"
              aria-label={`View user ${i}'s story`}
            >
              <div className="w-12 h-12 rounded-full p-0.5 bg-gradient-to-tr from-amber-500 to-red-500">
                <div className="w-full h-full rounded-full border-2 border-black overflow-hidden bg-slate-800">
                  <Image
                    src={`https://i.pravatar.cc/150?u=${i}`}
                    className="w-full h-full object-cover"
                    alt={`User ${i}'s story`}
                    width={48}
                    height={48}
                    loading="lazy"
                  />
                </div>
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter truncate w-16 text-center">
                User {i}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Search & Action Bar - Responsive */}
      <div className={`px-4 py-4 ${isMobile ? '' : 'lg:px-6'}`}>
        <div className="flex flex-col ${isMobile ? 'gap-3' : 'items-center gap-4'}">
          <div className={`relative flex-1 ${isMobile ? '' : 'max-w-2xl'}`}>
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search profiles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900/50 border border-slate-800 rounded-xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/50 transition-all"
              aria-label="Search profiles"
            />
          </div>

          {/* Action Buttons - Hide on mobile, show on desktop */}
          {!isMobile && (
            <div className="flex gap-2">
              <button
                onClick={() => {
                  vibrate([10])
                  setShowFilters(!showFilters)
                }}
                className={`p-3 rounded-xl transition-all ${
                  showFilters ? 'bg-amber-600 border-amber-500 text-white' : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
                aria-label="Toggle filters"
              >
                <SlidersHorizontal className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Advanced Filter Panel - Responsive */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className={`fixed inset-0 z-50 overflow-y-auto bg-slate-950 border-l border-r border-slate-800 ${
              isMobile ? 'px-4 py-6' : 'p-6'
            }`}
            role="region"
            aria-label="Advanced filters"
          >
            {/* Filter Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white">Filters</h2>
              <button
                onClick={() => setShowFilters(false)}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
                aria-label="Close filters"
              >
                ×
              </button>
            </div>

            <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-2'} gap-6`}>
              <div className="space-y-4">
                <label className="text-sm font-medium text-slate-300 uppercase tracking-widest">
                  Age Range
                </label>
                <div className={`flex items-center gap-4 ${isMobile ? 'flex-col' : ''}`}>
                  <input
                    type="number"
                    value={filters.minAge}
                    onChange={(e) => setFilters({ ...filters, minAge: Number.parseInt(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-center text-sm"
                    aria-label="Minimum age"
                  />
                  <span className="text-slate-600">-</span>
                  <input
                    type="number"
                    value={filters.maxAge}
                    onChange={(e) => setFilters({ ...filters, maxAge: Number.parseInt(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-center text-sm"
                    aria-label="Maximum age"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-sm font-medium text-slate-300 uppercase tracking-widest">
                  Verification
                </label>
                <button
                  onClick={() => setFilters({ ...filters, verifiedOnly: !filters.verifiedOnly })}
                  className={`w-full py-3 rounded-lg font-bold text-xs transition-all ${
                    filters.verifiedOnly ? 'bg-amber-600/20 border-amber-500 text-amber-400' : 'bg-slate-900 border-slate-800 text-slate-500'
                  }`}
                >
                  VERIFIED ONLY
                </button>
              </div>

              <div className="space-y-4">
                <label className="text-sm font-medium text-slate-300 uppercase tracking-widest">
                  Distance
                </label>
                <select
                  value={filters.radiusKm}
                  onChange={(e) => setFilters({ ...filters, radiusKm: Number.parseInt(e.target.value) })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm"
                  aria-label="Search radius"
                >
                  <option value={10}>Within 10 km</option>
                  <option value={25}>Within 25 km</option>
                  <option value={50}>Within 50 km</option>
                  <option value={100}>Within 100 km</option>
                </select>
              </div>
            </div>

            {/* Apply Button */}
            <div className="mt-6">
              <button
                onClick={() => setShowFilters(false)}
                className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-black font-semibold rounded-xl transition-all"
              >
                Apply Filters
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Virtualized Grid - Responsive */}
      <div className={`flex-1 min-h-[400px] px-4 ${isMobile ? 'pb-20' : 'lg:pb-8'}`}>
        {isLoading ? (
          <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'} gap-4`}>
            {Array.from({ length: isMobile ? 6 : 12 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[3/4] bg-slate-900 animate-pulse rounded-xl border border-slate-800"
              />
            ))}
          </div>
        ) : (
          <VirtuosoGrid
            useWindowScroll
            data={profiles}
            totalCount={profiles.length}
            overscan={isMobile ? 100 : 200}
            endReached={() => hasNextPage && fetchNextPage()}
            components={{
              List: React.forwardRef(({ style, children, ...props }: any, ref: any) => (
                <div
                  ref={ref}
                  {...props}
                  style={style}
                  className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'} gap-4 sm:gap-6`}
                >
                  {children}
                </div>
              )),
            }}
            itemContent={(index, profile) => (
              <ProfileCard
                key={profile.profile_id}
                profile={{
                  id: profile.profile_id,
                  name: profile.display_name,
                  age: profile.age,
                  photos: profile.avatar_url ? [profile.avatar_url] : ['/placeholder.png'],
                  city: profile.city,
                  distance: (profile.distance_m / 1000).toFixed(1),
                  verified: profile.verification_status === 'verified',
                  online: profile.is_online,
                  rate: profile.hourly_rate || 0,
                  bio: profile.bio || '',
                  interests: profile.interests || [],
                  compatibility: 85,
                } as any}
                index={index}
                subscribed={true}
                isFavorite={false}
                onView={() => handleProfileView(profile.profile_id)}
                onToggleFavorite={() => handleLikeProfile(profile.profile_id)}
                onSubscribe={() => {}}
                onMessage={() => handleSendMessage(profile.profile_id)}
              />
            )}
          />
        )}
      </div>
    </div>
  )
}
