'use client'

import { useVibrate } from '@/lib/hooks'
import { useAppStore } from '@/lib/store'
import { supabase } from '@/lib/supabase/client'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  Clock,
  Loader2,
  MapPin,
  Share2,
  ShieldCheck,
} from 'lucide-react'
import { useState } from 'react'

export function EventDetailScreen() {
  const vibrate = useVibrate()
  const { setStage, user, selectedParty } = useAppStore()
  const [loading, setLoading] = useState(false)
  const [joined, setJoined] = useState(false)

  if (!selectedParty) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <p className="text-slate-500">No event selected</p>
      </div>
    )
  }

  const event = selectedParty

  const handleJoin = async () => {
    if (!user) return
    setLoading(true)
    vibrate([40, 20])

    try {
      const { error } = await (supabase.rpc as any)('join_party', { party_id: event.id })
      if (error) throw error
      setJoined(true)
      vibrate([20, 50, 20])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col h-full bg-black min-h-screen text-white pb-24"
    >
      {/* Banner */}
      <div className="h-64 sm:h-80 relative overflow-hidden">
        <img src={event.image} alt="" className="w-full h-full object-cover scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

        <button
          onClick={() => setStage('party')}
          className="absolute top-4 left-4 p-2 bg-black/40 backdrop-blur-md rounded-full border border-white/10 hover:bg-black/60 transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="absolute bottom-6 left-6 right-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 bg-amber-600 text-[10px] font-black rounded uppercase tracking-widest">
              {event.type}
            </span>
            <div className="flex items-center gap-1 px-2 py-0.5 bg-green-500/20 border border-green-500/30 rounded text-[10px] font-bold text-green-400">
              <ShieldCheck className="w-3 h-3" />
              VERIFIED EVENT
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black italic tracking-tighter leading-tight">
            {event.title}
          </h1>
        </div>
      </div>

      <main className="flex-1 p-6 space-y-8 max-w-2xl mx-auto w-full">
        {/* Logistics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-slate-900/40 border border-slate-800 rounded-2xl space-y-1">
            <div className="flex items-center gap-2 text-amber-500">
              <Calendar className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">Date</span>
            </div>
            <p className="text-sm font-bold">{event.date}</p>
          </div>
          <div className="p-4 bg-slate-900/40 border border-slate-800 rounded-2xl space-y-1">
            <div className="flex items-center gap-2 text-amber-500">
              <Clock className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">Time</span>
            </div>
            <p className="text-sm font-bold">{event.time || '8:00 PM'}</p>
          </div>
        </div>

        <div className="p-4 bg-slate-900/40 border border-slate-800 rounded-2xl space-y-1">
          <div className="flex items-center gap-2 text-amber-500">
            <MapPin className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">Location</span>
          </div>
          <p className="text-sm font-bold">{event.location}</p>
        </div>

        {/* Description */}
        <div className="space-y-3">
          <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">
            About this event
          </h3>
          <p className="text-slate-300 text-sm leading-relaxed font-light">{event.description}</p>
        </div>

        {/* Attendees */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">
              Attendees ({event.attendees})
            </h3>
            <span className="text-[10px] font-bold text-amber-500">VIEW ALL</span>
          </div>
          <div className="flex -space-x-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="w-10 h-10 rounded-full bg-slate-800 border-2 border-black flex items-center justify-center font-black text-xs text-white"
              >
                {String.fromCharCode(64 + i)}
              </div>
            ))}
            <div className="w-10 h-10 rounded-full bg-slate-900 border-2 border-black flex items-center justify-center font-bold text-[10px] text-slate-500">
              +6
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-4 flex gap-3">
          {joined ? (
            <div className="flex-1 py-4 bg-green-600/10 border border-green-600/30 rounded-2xl flex items-center justify-center gap-2 text-green-400 font-bold">
              <CheckCircle className="w-5 h-5" />
              YOU'RE GOING
            </div>
          ) : (
            <motion.button
              onClick={handleJoin}
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 py-4 bg-gradient-to-r from-amber-600 to-amber-700 text-white font-black rounded-2xl shadow-lg shadow-amber-900/20 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'JOIN EVENT'}
            </motion.button>
          )}
          <button className="p-4 bg-slate-900 border border-slate-800 rounded-2xl hover:bg-slate-800 transition">
            <Share2 className="w-5 h-5 text-slate-400" />
          </button>
        </div>
      </main>
    </motion.div>
  )
}
