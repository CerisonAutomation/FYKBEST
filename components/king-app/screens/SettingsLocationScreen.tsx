'use client'

import { useAuth } from '@/lib/auth/hooks'
import { useVibrate } from '@/lib/hooks'
import { useAppStore } from '@/lib/store'
import { supabase } from '@/lib/supabase/client'
import { motion } from 'framer-motion'
import { ArrowLeft, Globe, Loader2, MapPin, Navigation, Shield } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

export function SettingsLocationScreen() {
  const vibrate = useVibrate()
  const { user, setUser, setStage } = useAppStore()
  const [loading, setLoading] = useState(false)
  const [location, setLocation] = useState({
    city: user?.city || '',
    country: user?.country || '',
    incognito: user?.is_incognito || false,
    travelMode: user?.travel_mode_enabled || false,
  })

  const handleSave = async () => {
    if (!user?.id) return
    setLoading(true)
    vibrate([40, 20])

    try {
      const { error } = await (supabase as any)
        .from('profiles')
        .update({
          city: location.city,
          is_incognito: location.incognito,
          travel_mode_enabled: location.travelMode,
        })
        .eq('user_id', user.id)

      if (error) throw error

      setUser({
        ...user!,
        city: location.city,
        is_incognito: location.incognito,
        travel_mode_enabled: location.travelMode,
      })
      setStage('settings')
    } catch (err) {
      console.error('[SettingsLocationScreen] Save failed:', err)
      alert('Failed to update location. Please try again.')
      console.error('[SettingsLocationScreen] Location update error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col h-full bg-black min-h-screen text-white"
    >
      <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-md border-b border-slate-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setStage('settings')}
            className="p-2 hover:bg-slate-900 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-black uppercase tracking-widest">LOCATION</h1>
        </div>
        <button
          onClick={handleSave}
          disabled={loading}
          className="px-4 py-1.5 bg-white text-black font-bold rounded-full text-xs hover:bg-slate-200 transition disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'SAVE'}
        </button>
      </header>

      <main className="flex-1 p-4 space-y-6">
        {/* City Input */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-amber-500 uppercase tracking-widest ml-1">
            Current City
          </label>
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="text"
              value={location.city}
              onChange={(e) => setLocation((prev) => ({ ...prev, city: e.target.value }))}
              placeholder="Enter your city..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-12 pr-4 py-4 text-sm focus:border-amber-600 focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* Feature Toggles */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden divide-y divide-slate-800">
          <LocationToggle
            icon={Navigation}
            title="Incognito Mode"
            description="Hide your exact location and stay invisible in 'Nearby' lists."
            checked={location.incognito}
            onChange={(v: boolean) => setLocation((prev) => ({ ...prev, incognito: v }))}
          />
          <LocationToggle
            icon={Globe}
            title="Travel Mode"
            description="Change your city manually to browse and chat in other locations."
            checked={location.travelMode}
            onChange={(v: boolean) => setLocation((prev) => ({ ...prev, travelMode: v }))}
          />
        </div>

        <div className="bg-amber-600/5 border border-amber-600/20 rounded-2xl p-5 flex gap-4">
          <div className="w-10 h-10 rounded-full bg-amber-600/10 flex items-center justify-center flex-shrink-0">
            <Shield className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <h4 className="text-xs font-black text-amber-500 uppercase tracking-wider">
              Privacy First
            </h4>
            <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
              We never share your precise coordinates. Your location is always approximated within a
              500m radius for your safety.
            </p>
          </div>
        </div>
      </main>
    </motion.div>
  )
}

function LocationToggle({ icon: Icon, title, description, checked, onChange }: any) {
  return (
    <div className="p-5 flex items-center justify-between gap-4">
      <div className="flex gap-4">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center ${checked ? 'bg-amber-600/20 text-amber-500' : 'bg-slate-900 text-slate-600'}`}
        >
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm font-bold">{title}</h4>
          <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed pr-4">{description}</p>
        </div>
      </div>
      <div
        onClick={() => onChange(!checked)}
        className={`w-12 h-6 rounded-full relative p-1 cursor-pointer transition-colors ${checked ? 'bg-amber-600' : 'bg-slate-800'}`}
      >
        <motion.div
          animate={{ x: checked ? 24 : 0 }}
          className="w-4 h-4 bg-white rounded-full shadow-lg"
        />
      </div>
    </div>
  )
}
