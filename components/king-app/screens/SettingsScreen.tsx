'use client'

import { useAppStore } from '@/lib/store'
import { supabase } from '@/lib/supabase/client'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Bell,
  ChevronRight,
  Image as ImageIcon,
  LogOut,
  MapPin,
  Shield,
  Smartphone,
  User,
} from 'lucide-react'
import type React from 'react'

interface SettingsItemProps {
  icon: React.ReactNode
  label: string
  value?: string
  hasArrow?: boolean
  onClick?: () => void
  toggle?: {
    checked: boolean
    onCheckedChange: (checked: boolean) => void
  }
}

function SettingsItem({ icon, label, value, hasArrow = true, onClick, toggle }: SettingsItemProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-between w-full p-4 hover:bg-slate-900/40 transition-colors"
    >
      <div className="flex items-center gap-3">
        <div className="text-slate-400">{icon}</div>
        <span className="text-sm font-medium text-white">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        {value && <span className="text-sm text-slate-500">{value}</span>}
        {hasArrow && <ChevronRight className="w-4 h-4 text-slate-600" />}
      </div>
    </button>
  )
}

function SettingsSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h3 className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wide">
        {title}
      </h3>
      <div className="bg-slate-950 border border-slate-800 rounded-xl divide-y divide-slate-800 overflow-hidden mx-4">
        {children}
      </div>
    </div>
  )
}

export function SettingsScreen() {
  const { setStage, setUser, setAuthenticated } = useAppStore()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setAuthenticated(false)
    setStage('login')
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col h-full bg-black min-h-screen"
    >
      <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-md border-b border-slate-800 px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setStage('profile')}
            className="p-2 hover:bg-slate-900 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="text-lg font-black text-white">SETTINGS</h1>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pb-24 px-0 py-4">
        <SettingsSection title="Account">
          <SettingsItem
            icon={<User className="w-5 h-5" />}
            label="Edit Profile"
            onClick={() => setStage('edit-profile')}
          />
          <SettingsItem
            icon={<ImageIcon className="w-5 h-5" />}
            label="Photos"
            onClick={() => setStage('settings-photos')}
          />
          <SettingsItem
            icon={<MapPin className="w-5 h-5" />}
            label="Location"
            onClick={() => setStage('settings-location')}
          />
        </SettingsSection>

        <SettingsSection title="Preferences">
          <SettingsItem
            icon={<Bell className="w-5 h-5" />}
            label="Notifications"
            onClick={() => setStage('settings-notifications')}
          />
          <SettingsItem
            icon={<Shield className="w-5 h-5" />}
            label="Privacy & Safety"
            onClick={() => setStage('settings-privacy')}
          />
        </SettingsSection>

        <SettingsSection title="About">
          <SettingsItem
            icon={<Smartphone className="w-5 h-5" />}
            label="App Version"
            value="1.0.0"
            hasArrow={false}
          />
        </SettingsSection>

        <div className="px-4 mt-6">
          <button
            onClick={handleLogout}
            className="w-full py-3.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 font-bold rounded-xl border border-red-500/30 flex items-center justify-center gap-2 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>

        <p className="text-center text-xs text-slate-600 mt-6 pb-8">
          FindYourKing Enterprise v1.0.0
        </p>
      </main>
    </motion.div>
  )
}
