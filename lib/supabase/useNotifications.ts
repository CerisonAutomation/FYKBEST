'use client'

import { useAppStore } from '@/lib/store'
import { supabase } from '@/lib/supabase/client'
import type { RealtimeChannel } from '@supabase/supabase-js'
import { useEffect, useRef } from 'react'

export function useNotifications() {
  const { addNotification, user } = useAppStore()
  const channelRef = useRef<RealtimeChannel | null>(null)

  useEffect(() => {
    if (!user) return
    if (channelRef.current?.state === 'joined') return

    const channel = supabase.channel(`user:${user.id}:notifications`, {
      config: { private: true },
    })
    channelRef.current = channel

    channel
      .on('broadcast', { event: 'notifications_insert' }, (payload) => {
        const n = payload.payload as any
        addNotification({
          id: n.id,
          from: n.title || 'System',
          avatar: '🔔',
          text: n.body || '',
          type: n.type || 'system',
          read: false,
          createdAt: new Date(n.created_at),
        })
      })
      .subscribe()

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current)
        channelRef.current = null
      }
    }
  }, [user, addNotification])
}
