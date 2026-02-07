'use client'

import maplibregl from 'maplibre-gl'
import React, { useState, useRef, useEffect } from 'react'
import 'maplibre-gl/dist/maplibre-gl.css'
// ... rest of imports

import { useVibrate } from '@/lib/hooks'
import { useAppStore } from '@/lib/store'
import type { RightNowSession } from '@/types/app'
import { AnimatePresence, motion } from 'framer-motion'
import { Clock, Grid, Map as MapIcon, MapPin, MessageCircle, Zap } from 'lucide-react'
import { useMeetNowFeed } from '../hooks/useMeetNowFeed'

export function RightNowPage() {
  const [view, setView] = useState<'grid' | 'map'>('grid')
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null)
  const { data, isLoading } = useMeetNowFeed(coords)
  const vibrate = useVibrate()

  // Request location on mount
  React.useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setCoords({ lat: 40.7128, lng: -74.006 }) // Fallback to NYC
    )
  }, [])

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6">
        <div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tighter">MEET NOW</h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-2 sm:mt-3 font-light tracking-wide uppercase">
            Available in your radius
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-900/50 p-1.5 rounded-2xl border border-slate-800">
          <button
            onClick={() => {
              vibrate([10])
              setView('grid')
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${view === 'grid' ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/20' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <Grid className="w-4 h-4" /> GRID
          </button>
          <button
            onClick={() => {
              vibrate([10])
              setView('map')
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${view === 'map' ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/20' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <MapIcon className="w-4 h-4" /> MAP
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {view === 'grid' ? (
          <motion.div
            key="grid"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
          >
            {isLoading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="aspect-[3/4] bg-slate-900 animate-pulse rounded-2xl border border-slate-800"
                  />
                ))
              : data?.pages
                  .flat()
                  .map((session) => <MeetNowCard key={session.id} session={session} />)}
          </motion.div>
        ) : (
          <motion.div
            key="map"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="h-[600px] w-full rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden relative"
          >
            <MeetNowMap sessions={data?.pages.flat() || []} center={coords} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function MeetNowMap({
  sessions,
  center,
}: { sessions: RightNowSession[]; center: { lat: number; lng: number } | null }) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<maplibregl.Map | null>(null)

  useEffect(() => {
    if (!mapContainer.current || !center) return

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: process.env.NEXT_PUBLIC_MAP_STYLE_URL || 'https://demotiles.maplibre.org/style.json',
      center: [center.lng, center.lat],
      zoom: 12,
    })

    map.current.on('load', () => {
      // Add source and clusters here in a real implementation
      // For v0 we add simple markers for each session
      sessions.forEach((s) => {
        if (s.location) {
          new maplibregl.Marker({ color: '#D4AF37' })
            .setLngLat([s.location.lng, s.location.lat])
            .setPopup(
              new maplibregl.Popup().setHTML(`<b>${s.user?.name}</b><p>${s.statusText}</p>`)
            )
            .addTo(map.current!)
        }
      })
    })

    return () => {
      map.current?.remove()
    }
  }, [center, sessions])

  return <div ref={mapContainer} className="w-full h-full" />
}

function MeetNowCard({ session }: { session: RightNowSession }) {
  const vibrate = useVibrate()
  const { setStage, setSelectedMatch } = useAppStore()

  return (
    <div
      onClick={() => {
        if (session.user) {
          vibrate([20, 10])
          setSelectedMatch(session.user)
          setStage('detail')
        }
      }}
      className="group relative aspect-[3/4] rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 cursor-pointer hover:border-amber-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-amber-600/10"
    >
      <img
        src={
          session.user?.photos?.[0] ||
          'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&q=80'
        }
        alt={session.user?.name || 'User'}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

      <div className="absolute top-3 left-3 flex flex-col gap-2">
        <div className="bg-amber-600/90 backdrop-blur-md text-white text-[10px] font-black px-2 py-1 rounded-full shadow-lg flex items-center gap-1">
          <Zap className="w-3 h-3 fill-white" /> RIGHT NOW
        </div>
        <div className="bg-black/50 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-full border border-white/10 flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {new Date(session.expiresAt).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
      </div>

      <div className="absolute bottom-4 left-4 right-4">
        <div className="flex items-baseline gap-1 mb-1">
          <h3 className="text-xl font-black text-white">{session.user?.name || 'Anonymous'}</h3>
          <span className="text-sm font-bold text-slate-300">{session.user?.age}</span>
        </div>
        <p className="text-[11px] text-slate-400 font-light line-clamp-1 mb-3">
          {session.statusText || 'Available for a chat or meetup.'}
        </p>

        <div className="flex gap-2">
          <button
            className="flex-1 bg-white text-black py-2 rounded-xl text-[10px] font-black hover:bg-slate-200 transition-colors"
            onClick={(e) => {
              e.stopPropagation()
              vibrate([15, 8]) /* Logic to send direct message request */
            }}
          >
            MEET
          </button>
          <button className="p-2 bg-slate-900/80 backdrop-blur-md border border-white/10 rounded-xl hover:bg-slate-800 transition-colors">
            <MessageCircle className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </div>
  )
}
