'use client'

import { useAppStore } from '@/lib/store'
import { supabase } from '@/lib/supabase/client'
import type { RealtimeChannel } from '@supabase/supabase-js'
import { useCallback, useEffect, useRef } from 'react'

export function useParties() {
  const { setParties } = useAppStore()
  const channelRef = useRef<RealtimeChannel | null>(null)

  const fetchParties = useCallback(async () => {
    const { data, error } = await supabase
      .from('parties')
      .select(`
        *,
        host:users(id),
        attendees:party_attendees(count)
      `)
      .order('date', { ascending: true })

    if (error) {
      console.error('Error fetching parties:', error)
      return
    }

    const parties = data.map((p: any) => ({
      id: p.id,
      title: p.title,
      location: p.location,
      date: p.date,
      time: p.time || '20:00:00',
      image:
        p.image_url || 'https://images.unsplash.com/photo-1519671482538-307996eed42f?w=800&q=80',
      attendees: p.attendees[0]?.count || 0,
      type: p.type,
      hostId: p.host_id,
    }))

    setParties(parties)
  }, [setParties])

  useEffect(() => {
    fetchParties()

    if (channelRef.current?.state === 'joined') return

    const channel = supabase.channel('global:parties', {
      config: { private: true },
    })
    channelRef.current = channel

    channel
      .on('broadcast', { event: 'parties_insert' }, fetchParties)
      .on('broadcast', { event: 'parties_update' }, fetchParties)
      .subscribe()

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current)
        channelRef.current = null
      }
    }
  }, [fetchParties])
}
