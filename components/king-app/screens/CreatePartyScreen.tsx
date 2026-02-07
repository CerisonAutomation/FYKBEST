'use client'

import { useVibrate } from '@/lib/hooks'
import { useAppStore } from '@/lib/store'
import { supabase } from '@/lib/supabase/client'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Calendar,
  Clock,
  Image as ImageIcon,
  Loader2,
  MapPin,
  Users,
} from 'lucide-react'
import { useState } from 'react'

export function CreatePartyScreen() {
  const vibrate = useVibrate()
  const { user, setStage } = useAppStore()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    date: '',
    time: '',
    type: 'drinks',
    maxAttendees: 10,
  })

  const handleCreate = async () => {
    if (!formData.title || !formData.location || !user) return

    setLoading(true)
    vibrate([40, 20, 40])

    try {
      const { error } = await (supabase.from('parties') as any).insert({
        host_id: user.id,
        title: formData.title,
        description: formData.description,
        location: formData.location,
        date: formData.date || new Date().toISOString().split('T')[0],
        time: formData.time || '20:00:00',
        type: formData.type,
        max_attendees: formData.maxAttendees,
        image_url: 'https://images.unsplash.com/photo-1519671482538-307996eed42f?w=800&q=80', // Default
      })

      if (error) throw error

      setStage('party')
    } catch (err) {
      console.error(err)
      alert('Failed to create party. Check your connection.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col h-full bg-black min-h-screen text-white pb-24"
    >
      <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-md border-b border-slate-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setStage('party')}
            className="p-2 hover:bg-slate-900 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-black uppercase tracking-widest italic">HOST EVENT</h1>
        </div>
        <button
          onClick={handleCreate}
          disabled={loading || !formData.title}
          className="px-6 py-2 bg-gradient-to-r from-amber-600 to-amber-700 text-white font-black rounded-xl text-xs shadow-lg shadow-amber-900/20 disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'PUBLISH'}
        </button>
      </header>

      <main className="flex-1 p-4 space-y-6 overflow-y-auto">
        {/* Banner Upload Placeholder */}
        <div className="aspect-video bg-slate-900 border-2 border-dashed border-slate-800 rounded-2xl flex flex-col items-center justify-center gap-3 group hover:border-amber-600/50 transition-colors cursor-pointer">
          <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-amber-600/20">
            <ImageIcon className="w-6 h-6 text-slate-500 group-hover:text-amber-500" />
          </div>
          <span className="text-xs font-bold text-slate-500 group-hover:text-amber-500">
            ADD EVENT BANNER
          </span>
        </div>

        {/* Basic Info */}
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-amber-500 uppercase tracking-widest ml-1">
              Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="e.g. Saturday Night Cocktails"
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-4 text-sm focus:border-amber-600 focus:outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-amber-500 uppercase tracking-widest ml-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Tell guests what to expect..."
              rows={4}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-4 text-sm focus:border-amber-600 focus:outline-none resize-none"
            />
          </div>
        </div>

        {/* Logistics Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-amber-500 uppercase tracking-widest ml-1">
              Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-11 pr-4 py-4 text-sm focus:border-amber-600 focus:outline-none"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-amber-500 uppercase tracking-widest ml-1">
              Time
            </label>
            <div className="relative">
              <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData((prev) => ({ ...prev, time: e.target.value }))}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-11 pr-4 py-4 text-sm focus:border-amber-600 focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-amber-500 uppercase tracking-widest ml-1">
            Location
          </label>
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
              placeholder="Bar, Lounge, or Secret Location..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-11 pr-4 py-4 text-sm focus:border-amber-600 focus:outline-none"
            />
          </div>
        </div>

        {/* Type Selector */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-amber-500 uppercase tracking-widest ml-1">
            Category
          </label>
          <div className="flex flex-wrap gap-2">
            {['gym', 'cinema', 'meetup', 'drinks', 'food', 'coffee'].map((t) => (
              <button
                key={t}
                onClick={() => setFormData((prev) => ({ ...prev, type: t as any }))}
                className={`px-4 py-2 rounded-lg text-xs font-bold border transition-all ${formData.type === t ? 'bg-amber-600 border-amber-600 text-white shadow-lg' : 'bg-slate-900 border-slate-800 text-slate-500'}`}
              >
                {t.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-amber-500 uppercase tracking-widest ml-1">
            Max Guests
          </label>
          <div className="relative">
            <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="number"
              value={formData.maxAttendees}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  maxAttendees: Number.parseInt(e.target.value, 10),
                }))
              }
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-11 pr-4 py-4 text-sm focus:border-amber-600 focus:outline-none"
            />
          </div>
        </div>
      </main>
    </motion.div>
  )
}
