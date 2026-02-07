'use client'

import { supabase } from '@/lib/supabase/client'
import type { RightNowSession } from '@/types/app'
import { useInfiniteQuery } from '@tanstack/react-query'

export function useMeetNowFeed(coords: { lat: number; lng: number } | null, radiusKm = 25) {
  return useInfiniteQuery({
    queryKey: ['meet-now', coords, radiusKm],
    queryFn: async ({ pageParam }) => {
      if (!coords) return []

      const { data, error } = await (supabase as any).rpc('rn_feed', {
        p_center: `POINT(${coords.lng} ${coords.lat})`,
        p_radius_m: radiusKm * 1000,
        p_limit: 20,
        p_cursor_expires_at: pageParam?.expires_at,
        p_cursor_user: pageParam?.user_id,
      })

      if (error) throw error

      // In v0, we join with profiles client-side for simplicity,
      // but in Zenith proper we return them in the RPC.
      const userIds = data.map((s: any) => s.user_id)
      if (userIds.length === 0) return []

      const { data: profiles } = await supabase.from('profiles').select('*').in('user_id', userIds)

      return data.map((s: any) => ({
        ...s,
        expiresAt: s.expires_at,
        distanceM: s.distance_m,
        user: (profiles as any)?.find((p: any) => p.user_id === s.user_id),
      })) as RightNowSession[]
    },
    initialPageParam: null as any,
    getNextPageParam: (lastPage) => (lastPage.length === 20 ? lastPage[19] : undefined),
    enabled: !!coords,
  })
}
