'use client'

import { useVibrate } from '@/lib/hooks'
import { useAppStore } from '@/lib/store'
import { AnimatePresence, motion } from 'framer-motion'
import {
  AlertTriangle,
  Bell,
  FileText,
  Globe,
  LogOut,
  MessageSquare,
  Moon,
  Shield,
  Volume2,
  X,
  Zap,
} from 'lucide-react'
import React from 'react'

export function RightSidebar() {
  const vibrate = useVibrate()
  const { rightMenuOpen, setRightMenuOpen, user, setUser, setStage, isAiEnabled, setIsAiEnabled } =
    useAppStore()

  const handleLogout = () => {
    vibrate([50, 20])
    setUser(null)
    setStage('onboarding')
    setRightMenuOpen(false)
  }

  return (
    <AnimatePresence>
      {rightMenuOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-15 cursor-pointer"
            onClick={() => setRightMenuOpen(false)}
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 w-80 h-screen bg-black/95 backdrop-blur-2xl border-l border-slate-800 flex flex-col z-20 overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-slate-900/50 to-slate-950/50">
              <h3 className="text-lg font-black tracking-wide">SETTINGS</h3>
              <button
                onClick={() => setRightMenuOpen(false)}
                className="p-2 hover:bg-slate-800/50 rounded-lg transition-all duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* App Settings */}
              <div className="space-y-3">
                <h4 className="text-xs font-black text-amber-500 tracking-wider uppercase">
                  App Settings
                </h4>
                <SettingToggle icon={Moon} label="Dark Mode" defaultChecked disabled />
                <SettingToggle icon={Bell} label="Push Notifications" defaultChecked />
                <SettingToggle icon={Volume2} label="Sound Effects" defaultChecked />
              </div>

              {/* AI Features */}
              <div className="space-y-3">
                <h4 className="text-xs font-black text-amber-500 tracking-wider uppercase">
                  AI Features
                </h4>
                <SettingToggle
                  icon={Zap}
                  label="AI Assistant"
                  checked={isAiEnabled}
                  onChange={setIsAiEnabled}
                />
                <SettingsToggle icon={MessageSquare} label="Smart Replies" defaultChecked />
                <SettingsToggle icon={Globe} label="Auto-Translate" defaultChecked />
              </div>

              {/* Privacy & Security */}
              <div className="space-y-3">
                <h4 className="text-xs font-black text-amber-500 tracking-wider uppercase">
                  Privacy & Security
                </h4>
                <SettingButton icon={Shield} label="Privacy Policy" />
                <SettingButton icon={FileText} label="Terms of Service" />
                <SettingButton icon={AlertTriangle} label="Report Issue" variant="warning" />
              </div>

              {/* Account Actions */}
              <div className="space-y-3">
                <h4 className="text-xs font-black text-amber-500 tracking-wider uppercase">
                  Account
                </h4>
                <SettingButton icon={Shield} label="Change Password" />
                <SettingButton icon={Shield} label="Two-Factor Auth" />
                <SettingButton icon={X} label="Blocked Users" />
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-slate-800 space-y-4 bg-gradient-to-r from-slate-900/50 to-slate-950/50">
              <p className="text-xs text-slate-500 font-light text-center">
                Version 2.1.0 • Build 2024.01
              </p>

              {user && (
                <motion.button
                  onClick={handleLogout}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 text-red-500 hover:text-red-400 hover:bg-red-950/20 rounded-xl transition font-semibold text-sm border border-red-600/30 hover:border-red-600/50 flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  LOGOUT
                </motion.button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

interface SettingToggleProps {
  icon: React.ComponentType<{ className?: string }>
  label: string
  defaultChecked?: boolean
  checked?: boolean
  disabled?: boolean
  onChange?: (checked: boolean) => void
}

function SettingToggle({
  icon: Icon,
  label,
  defaultChecked,
  checked,
  disabled,
  onChange,
}: SettingToggleProps) {
  const [internalChecked, setInternalChecked] = React.useState(defaultChecked || false)
  const isChecked = checked !== undefined ? checked : internalChecked

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e.target.checked)
    } else {
      setInternalChecked(e.target.checked)
    }
  }

  return (
    <label
      className={`
      flex items-center justify-between gap-3 cursor-pointer p-3 rounded-xl 
      hover:bg-slate-800/30 transition border border-slate-800/50
      ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
    `}
    >
      <div className="flex items-center gap-3">
        <Icon className={`w-4 h-4 ${isChecked ? 'text-amber-500' : 'text-slate-500'}`} />
        <span className="text-sm text-slate-300">{label}</span>
      </div>
      <div
        className={`
        w-10 h-6 rounded-full relative transition-all duration-300 
        ${isChecked ? 'bg-amber-600' : 'bg-slate-700'}
      `}
      >
        <motion.div
          animate={{ x: isChecked ? 16 : 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-lg"
        />
      </div>
      <input
        type="checkbox"
        className="sr-only"
        checked={isChecked}
        onChange={handleChange}
        disabled={disabled}
      />
    </label>
  )
}

interface SettingsToggleProps {
  icon: React.ComponentType<{ className?: string }>
  label: string
  defaultChecked?: boolean
}

function SettingsToggle({ icon: Icon, label, defaultChecked }: SettingsToggleProps) {
  const [checked, setChecked] = React.useState(defaultChecked || false)
  return (
    <label className="flex items-center justify-between gap-3 cursor-pointer p-3 rounded-xl hover:bg-slate-800/30 transition border border-slate-800/50">
      <div className="flex items-center gap-3">
        <Icon className={`w-4 h-4 ${checked ? 'text-amber-500' : 'text-slate-500'}`} />
        <span className="text-sm text-slate-300">{label}</span>
      </div>
      <div
        className={`w-10 h-6 rounded-full relative transition-all duration-300 ${checked ? 'bg-amber-600' : 'bg-slate-700'}`}
      >
        <motion.div
          animate={{ x: checked ? 16 : 0 }}
          className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-lg"
        />
      </div>
      <input
        type="checkbox"
        className="sr-only"
        checked={checked}
        onChange={(e) => setChecked(e.target.checked)}
      />
    </label>
  )
}

interface SettingButtonProps {
  icon: React.ComponentType<{ className?: string }>
  label: string
  onClick?: () => void
  variant?: 'default' | 'warning'
}

function SettingButton({ icon: Icon, label, onClick, variant = 'default' }: SettingButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      className={`
        w-full flex items-center gap-3 py-3 px-4 text-left rounded-xl transition text-sm font-semibold border
        ${
          variant === 'warning'
            ? 'bg-orange-600/10 hover:bg-orange-600/20 border-orange-600/30 text-orange-400 hover:border-orange-600/50'
            : 'bg-slate-800/30 hover:bg-slate-800/50 border-slate-700/50 text-slate-300 hover:border-slate-600'
        }
      `}
    >
      <Icon className="w-4 h-4" />
      {label}
    </motion.button>
  )
}
