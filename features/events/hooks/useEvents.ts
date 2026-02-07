'use client'

import { supabase } from '@/lib/supabase/client'
import { Party } from '@/types/app'
import { useInfiniteQuery } from '@tanstack/react-query'

export function useEvents(type: 'plan' | 'party' | null = null) {
  return useInfiniteQuery({
    queryKey: ['events', type],
    queryFn: async ({ pageParam }) => {
      let query = supabase
        .from('events_secure_view')
        .select('*')
        .order('starts_at', { ascending: true })
        .limit(20)

      if (type) {
        query = query.eq('event_type', type)
      }

      if (pageParam) {
        query = query.gt('starts_at', pageParam.starts_at)
      }

      const { data, error } = await query
      if (error) throw error

      return data.map((e: any) => ({
        id: e.id,
        title: e.title,
        description: e.description,
        location: e.address_public || 'Nearby',
        date: new Date(e.starts_at).toLocaleDateString(),
        time: new Date(e.starts_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        image: 'https://images.unsplash.com/photo-1519671482538-307996eed42f?w=800&q=80',
        attendees: 0, // In real app, fetch count
        type: e.event_type,
        hostId: e.creator_id,
        addressPrecise: e.address_precise_visible,
      })) as any[]
    },
    initialPageParam: null as any,
    getNextPageParam: (lastPage) => (lastPage.length === 20 ? lastPage[19] : undefined),
  })
}
