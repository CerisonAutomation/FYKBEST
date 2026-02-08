'use client'

import { useAuth } from '@/lib/auth/hooks'
import { useVibrate } from '@/lib/hooks'
import { useAppStore } from '@/lib/store'
import { supabase } from '@/lib/supabase/client'
import { motion } from 'framer-motion'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

export function SettingsNotificationsScreen() {
  const vibrate = useVibrate()
  const { setStage, user } = useAppStore()
  const [loading, setLoading] = useState(true)
  const [settings, setSettings] = useState({
    pushEnabled: true,
    messageAlerts: true,
    matchAlerts: true,
    eventAlerts: true,
    promotions: false,
  })

  // Load Settings from DB
  useEffect(() => {
    const loadSettings = async () => {
      if (!user) return
      try {
        const { data } = await (supabase.from('profiles') as any)
          .select('settings')
          .eq('user_id', user.id)
          .single()

        const settingsData = data?.settings?.notifications
        if (settingsData) {
          setSettings(settingsData)
        }
      } catch (error) {
        console.error('[SettingsNotificationsScreen] Settings load error:', error)
        console.error('[SettingsNotificationsScreen] Additional error context:', {
          error,
          stack: (error as any).stack,
        })
        alert('Failed to load settings. Please try again.')
      }
    }
    loadSettings()
  }, [user])

  const handleToggle = async (key: keyof typeof settings, value: boolean) => {
    const updatedNotifications = { ...settings, [key]: value }
    setSettings(updatedNotifications)
    vibrate([10])

    if (user?.id) {
      // Update nested JSONB efficiently
      const { data: currentProfile } = await (supabase.from('profiles') as any)
        .select('settings')
        .eq('user_id', user.id)
        .single()

      const newSettings = {
        ...(currentProfile?.settings || {}),
        notifications: updatedNotifications,
      }

      await (supabase.from('profiles') as any)
        .update({ settings: newSettings })
        .eq('user_id', user.id)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-black min-h-screen">
        <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col h-full bg-black min-h-screen text-white"
    >
      <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-md border-b border-slate-800 px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => setStage('settings')}
          className="p-2 hover:bg-slate-900 rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-black uppercase tracking-widest">NOTIFICATIONS</h1>
      </header>
      <main className="flex-1 p-4 space-y-6">
        <div className="bg-slate-950 border border-slate-800 rounded-2xl divide-y divide-slate-800">
          <NotifyToggle
            title="Push Notifications"
            description="Receive alerts when the app is closed."
            checked={settings.pushEnabled}
            onChange={(v: boolean) => handleToggle('pushEnabled', v)}
          />
          <NotifyToggle
            title="New Messages"
            description="Instant alerts for direct messages."
            checked={settings.messageAlerts}
            onChange={(v: boolean) => handleToggle('messageAlerts', v)}
          />
          <NotifyToggle
            title="New Matches"
            description="Get notified when someone likes you back."
            checked={settings.matchAlerts}
            onChange={(v: boolean) => handleToggle('matchAlerts', v)}
          />
          <NotifyToggle
            title="Event Alerts"
            description="Reminders for booked dates and joined events."
            checked={settings.eventAlerts}
            onChange={(v: boolean) => handleToggle('eventAlerts', v)}
          />
          <NotifyToggle
            title="Promotions"
            description="Exclusive offers and premium network news."
            checked={settings.promotions}
            onChange={(v: boolean) => handleToggle('promotions', v)}
          />
        </div>
      </main>
    </motion.div>
  )
}

function NotifyToggle({ title, description, checked, onChange }: any) {
  return (
    <div className="p-5 flex items-center justify-between gap-4">
      <div>
        <h4 className="text-sm font-bold">{title}</h4>
        <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{description}</p>
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
