'use client'

import { useVibrate } from '@/lib/hooks'
import { useAppStore } from '@/lib/store'
import { supabase } from '@/lib/supabase/client'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Ban,
  Bell,
  Camera,
  CheckCircle,
  Lock,
  Mail,
  Save,
  Shield,
  Trash2,
  User as UserIcon,
  Zap,
} from 'lucide-react'
import React, { useState } from 'react'

export function ProfileScreen() {
  const vibrate = useVibrate()
  const { user, isAiEnabled, setIsAiEnabled, setStage, setUser } = useAppStore()

  const [isSaving, setIsSaving] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    display_name: user?.display_name || '',
    bio: user?.bio || '',
  })

  const handleResetPassword = async () => {
    vibrate([20, 10])
    if (!user?.email) return
    const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
      redirectTo: `${window.location.origin}/auth/update-password`,
    })
    if (error) {
      alert(error.message)
    } else {
      setSuccessMessage('Password reset email sent!')
      setTimeout(() => setSuccessMessage(null), 3000)
    }
  }

  const handleDeleteAccount = async () => {
    vibrate([50, 50, 50])
    if (confirm('Are you sure you want to delete your account? This cannot be undone.')) {
      try {
        await (supabase.rpc as any)('delete_own_account')
        await supabase.auth.signOut()
        setUser(null)
        setStage('login')
      } catch (err) {
        console.error('Failed to delete account:', err)
        alert('Failed to delete account. Please contact support.')
      }
    }
  }

  const handleSaveChanges = async () => {
    if (!user) return
    vibrate([40, 20])
    setIsSaving(true)

    try {
      const { error } = await (supabase.from('profiles') as any)
        .update({
          display_name: formData.display_name,
          bio: formData.bio,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id)

      if (error) throw error

      setUser({ ...user, ...formData })
      setSuccessMessage('Changes saved successfully!')
      setTimeout(() => setSuccessMessage(null), 3000)
    } catch (err) {
      console.error('Save failed:', err)
      alert('Failed to save changes.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tighter">PROFILE</h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-2 sm:mt-3 font-light tracking-wide">
            MANAGE YOUR ACCOUNT SETTINGS
          </p>
        </div>
        <AnimatePresence>
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="bg-green-500/20 text-green-400 text-xs font-bold px-4 py-2 rounded-full border border-green-500/30 flex items-center gap-2 mb-2"
            >
              <CheckCircle className="w-4 h-4" />
              {successMessage}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Profile Photo Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-center"
      >
        <div className="relative">
          <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center font-black text-white text-4xl sm:text-5xl shadow-xl">
            {user?.display_name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <button
            onClick={() => setStage('settings-photos')}
            className="absolute bottom-0 right-0 w-10 h-10 bg-amber-600 hover:bg-amber-500 rounded-full flex items-center justify-center transition shadow-lg border-4 border-slate-900"
          >
            <Camera className="w-5 h-5 text-white" />
          </button>
        </div>
      </motion.div>

      {/* Main Settings Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-5 bg-gradient-to-b from-slate-900/50 to-slate-950/40 border border-slate-800 rounded-2xl p-5 sm:p-8"
      >
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-xs font-black text-amber-500 tracking-wider">
            <UserIcon className="w-4 h-4" />
            DISPLAY NAME
          </label>
          <input
            type="text"
            value={formData.display_name}
            onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600/30 transition text-sm"
          />
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-xs font-black text-amber-500 tracking-wider">
            <Mail className="w-4 h-4" />
            EMAIL
          </label>
          <input
            type="email"
            disabled
            defaultValue={user?.email || 'demo@kingsocial.com'}
            className="w-full px-4 py-3 bg-slate-800/30 border border-slate-800 rounded-xl text-slate-500 transition text-sm cursor-not-allowed"
          />
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-xs font-black text-amber-500 tracking-wider">
            <Shield className="w-4 h-4" />
            BIO
          </label>
          <textarea
            placeholder="Tell us about yourself..."
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-600 resize-none text-sm"
            rows={4}
          />
        </div>

        <div className="pt-4 border-t border-slate-800 space-y-2">
          <ToggleSetting
            icon={Shield}
            label="Show my profile to verified members only"
            defaultChecked
          />
          <ToggleSetting
            icon={Zap}
            label="Enable AI assistant for auto-replies"
            checked={isAiEnabled}
            onChange={setIsAiEnabled}
          />
          <ToggleSetting
            icon={Bell}
            label="Receive notifications for new messages"
            defaultChecked
          />
        </div>

        {/* Save Button */}
        <motion.button
          onClick={handleSaveChanges}
          disabled={isSaving}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-3 sm:py-4 bg-gradient-to-r from-amber-600 to-amber-700 text-white font-bold rounded-xl hover:from-amber-500 hover:to-amber-600 transition-all duration-300 shadow-lg shadow-amber-600/30 hover:shadow-amber-600/50 text-sm sm:text-base flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isSaving ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1 }}
            >
              <Zap className="w-4 h-4" />
            </motion.div>
          ) : (
            <Save className="w-4 h-4" />
          )}
          {isSaving ? 'SAVING...' : 'SAVE CHANGES'}
        </motion.button>
      </motion.div>

      {/* Account Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-4 bg-gradient-to-b from-slate-900/50 to-slate-950/40 border border-slate-800 rounded-2xl p-5 sm:p-8"
      >
        <h4 className="font-black text-lg text-white">ACCOUNT</h4>
        <div className="space-y-2 sm:space-y-3">
          <AccountButton icon={Lock} label="Change Password" onClick={handleResetPassword} />
          <AccountButton
            icon={Save}
            label="Download My Data (GDPR)"
            onClick={() => window.open('/api/compliance/dsar', '_blank')}
          />
          <AccountButton
            icon={Shield}
            label="Privacy Settings"
            onClick={() => setStage('settings-privacy')}
          />
          <AccountButton icon={Ban} label="Blocked Users" />
          <AccountButton
            icon={Trash2}
            label="Delete Account"
            variant="danger"
            onClick={handleDeleteAccount}
          />
        </div>
      </motion.div>

      {/* Account Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-center py-4 text-xs text-slate-600"
      >
        <p>Member since: January 2024</p>
        <p className="mt-1">Account ID: {user?.id?.substring(0, 8) || 'xxxxxxxx'}</p>
      </motion.div>
    </div>
  )
}

interface ToggleSettingProps {
  icon: React.ComponentType<{ className?: string }>
  label: string
  defaultChecked?: boolean
  checked?: boolean
  onChange?: (checked: boolean) => void
}

function ToggleSetting({
  icon: Icon,
  label,
  defaultChecked,
  checked,
  onChange,
}: ToggleSettingProps) {
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
    <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl hover:bg-slate-800/30 transition group">
      <Icon
        className={`w-4 h-4 flex-shrink-0 ${isChecked ? 'text-amber-500' : 'text-slate-500'}`}
      />
      <span className="flex-1 text-sm text-slate-300 font-light">{label}</span>
      <div
        className={`
        w-10 h-6 rounded-full relative transition-all duration-300 flex-shrink-0
        ${isChecked ? 'bg-amber-600' : 'bg-slate-700'}
      `}
      >
        <motion.div
          animate={{ x: isChecked ? 16 : 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-lg"
        />
      </div>
      <input type="checkbox" className="sr-only" checked={isChecked} onChange={handleChange} />
    </label>
  )
}

interface AccountButtonProps {
  icon: React.ComponentType<{ className?: string }>
  label: string
  variant?: 'default' | 'danger'
  onClick?: () => void
}

function AccountButton({ icon: Icon, label, variant = 'default', onClick }: AccountButtonProps) {
  const vibrate = useVibrate()

  return (
    <motion.button
      onClick={() => {
        vibrate([20, 10])
        onClick?.()
      }}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className={`
        w-full flex items-center gap-3 py-3 px-4 text-left rounded-xl transition text-sm font-semibold border
        ${
          variant === 'danger'
            ? 'bg-red-600/10 hover:bg-red-600/20 border-red-600/30 text-red-400 hover:border-red-600/50'
            : 'bg-slate-800/30 hover:bg-slate-800/50 border-slate-700/50 text-slate-300 hover:border-slate-600'
        }
      `}
    >
      <Icon className="w-4 h-4" />
      {label}
    </motion.button>
  )
}
