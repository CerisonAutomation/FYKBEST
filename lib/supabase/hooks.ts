'use client'

import { useAppStore } from '@/lib/store'
import { supabase } from '@/lib/supabase/client'
import type { Match, Message } from '@/types/app'
import type { RealtimeChannel } from '@supabase/supabase-js'
import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Data Hooks: Real-time synchronization
 *
 * Manages data fetching and real-time updates from Supabase.
 * Synchronizes backend state with the local Zustand store.
 */

// Profile & Discovery Hooks
export function useProfiles() {
  const { setMatches, user } = useAppStore()
  const [isLoading, setIsLoading] = useState(false)

  const fetchProfiles = useCallback(async () => {
    if (!user) return
    setIsLoading(true)

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          user:users!inner(role, is_active, last_seen_at)
        `)
        .neq('user_id', user.id)
        .limit(50)

      if (error) throw error

      // Transform DB profiles to Match domain objects
      const profiles: Match[] = data.map((p: any) => ({
        id: p.user_id,
        name: p.name || 'Anonymous',
        username: p.username,
        age: p.age || 25,
        city: p.city || 'Unknown',
        bio: p.bio || '',
        rate: Number(p.hourly_rate) || 0,
        verified: p.verification_status === 'verified',
        verification_status: p.verification_status,
        online: !!p.user?.online_status,
        presence: 'online', // Placeholder presence
        lastSeen: p.user?.last_seen ? new Date(p.user.last_seen) : new Date(),
        distance: '5.0',
        compatibility: 85,
        reviews: p.reviews_count || 0,
        averageRating: Number(p.average_rating) || 0,
        responseTime: p.response_time || '< 1 hour',
        interests: p.interests || [],
        tribes: p.tribes || [],
        photos: p.photos || [],
        isTyping: false,
        hasUnread: false,
        likedYou: false,
        availableNow: !!p.available_now,
        subscriptionTier: p.subscription_tier || 'free',
        userId: p.user_id,
      }))

      setMatches(profiles)
    } catch (err) {
      console.error('Error fetching profiles:', err)
    } finally {
      setIsLoading(false)
    }
  }, [user, setMatches])

  useEffect(() => {
    fetchProfiles()
  }, [fetchProfiles])

  return { isLoading, refetch: fetchProfiles }
}

// Messaging Hooks
export function useMessages(activeChatId: string | null) {
  const { addMessage, setMessages, user } = useAppStore()
  const channelRef = useRef<RealtimeChannel | null>(null)

  useEffect(() => {
    if (!user) return

    const fetchHistory = async () => {
      if (!activeChatId) return
      const { data } = await supabase
        .from('messages')
        .select('*')
        .or(
          `and(sender_id.eq.${user.id},receiver_id.eq.${activeChatId}),and(sender_id.eq.${activeChatId},receiver_id.eq.${user.id})`
        )
        .order('created_at', { ascending: true })
        .limit(100)

      if (data) {
        const transformed: Message[] = data.map((m: any) => ({
          id: m.id,
          text: m.content,
          from: m.sender_id === user.id ? 'user' : 'match',
          timestamp: m.created_at ? new Date(m.created_at) : new Date(),
          read: !!m.read,
          senderId: m.sender_id,
        }))
        setMessages(`chat_${activeChatId}`, transformed)
      }
    }

    fetchHistory()

    if (channelRef.current?.state === 'joined') return

    const channel = supabase.channel(`user:${user.id}:messages`, {
      config: { private: true },
    })
    channelRef.current = channel

    channel
      .on('broadcast', { event: 'messages_insert' }, (payload) => {
        const newMsg = payload.payload as any
        if (newMsg.sender_id === activeChatId) {
          addMessage(`chat_${activeChatId}`, {
            id: newMsg.id,
            text: newMsg.content,
            from: 'match',
            timestamp: new Date(newMsg.created_at),
            read: false,
            senderId: newMsg.sender_id,
          })
        }
      })
      .subscribe()

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current)
        channelRef.current = null
      }
    }
  }, [user, activeChatId, addMessage, setMessages])
}

// Booking Hooks
export function useBookings() {
  const { addBooking, setBookings, user } = useAppStore()
  const channelRef = useRef<RealtimeChannel | null>(null)

  useEffect(() => {
    if (!user) return

    const fetchBookings = async () => {
      const { data } = await supabase
        .from('bookings')
        .select('*, provider:profiles!provider_id(name)')
        .or(`seeker_id.eq.${user.id},provider_id.eq.${user.id}`)
        .order('date', { ascending: false })

      if (data) {
        const transformed = data.map((b: any) => ({
          id: b.id,
          matchId: user.id === b.seeker_id ? b.provider_id : b.seeker_id,
          matchName: user.id === b.seeker_id ? b.provider?.name || 'Companion' : 'Client',
          date: b.date,
          time: b.time,
          hours: b.hours,
          price: b.total_price,
          status: b.status,
          reminder: true,
        }))
        setBookings(transformed)
      }
    }

    fetchBookings()

    if (channelRef.current?.state === 'joined') return

    const channel = supabase.channel(`user:${user.id}:bookings`, {
      config: { private: true },
    })
    channelRef.current = channel

    channel
      .on('broadcast', { event: 'booking_created' }, (payload) => {
        const b = payload.payload as any
        addBooking({
          id: b.id,
          matchName: 'New Booking',
          date: b.date,
          time: b.time,
          hours: b.hours,
          price: b.total_price,
          status: b.status,
          reminder: true,
        })
      })
      .subscribe()

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current)
        channelRef.current = null
      }
    }
  }, [user, addBooking])
}

// User Data Sync Hooks
export function useUserSync() {
  const { user, setFavorites, setSubscribed } = useAppStore()
  const channelRef = useRef<RealtimeChannel | null>(null)

  const syncFavorites = useCallback(async () => {
    if (!user) return
    const { data } = await supabase
      .from('favorites')
      .select('favorite_user_id')
      .eq('user_id', user.id)

    if (data) {
      setFavorites((data as any).map((f: any) => f.favorite_user_id))
    }
  }, [user, setFavorites])

  const syncSubscription = useCallback(async () => {
    if (!user) return
    const { data } = await supabase
      .from('subscriptions')
      .select('status, tier')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .gt('expires_at', new Date().toISOString())
      .single()

    const { data: profileData } = await supabase
      .from('profiles')
      .select('subscription_tier')
      .eq('user_id', user.id)
      .single()

    const profile = profileData as any
    const isActive = !!data || (profile?.subscription_tier && profile.subscription_tier !== 'free')
    setSubscribed(isActive)
  }, [user, setSubscribed])

  useEffect(() => {
    if (!user) return

    syncFavorites()
    syncSubscription()

    if (channelRef.current?.state === 'joined') return

    const channel = supabase.channel(`user:${user.id}:sync`, {
      config: { private: true },
    })
    channelRef.current = channel

    channel
      .on('broadcast', { event: 'favorites_insert' }, syncFavorites)
      .on('broadcast', { event: 'favorites_delete' }, syncFavorites)
      .on('broadcast', { event: 'subscriptions_insert' }, syncSubscription)
      .on('broadcast', { event: 'subscriptions_update' }, syncSubscription)
      .subscribe()

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current)
        channelRef.current = null
      }
    }
  }, [user, syncFavorites, syncSubscription])
}
