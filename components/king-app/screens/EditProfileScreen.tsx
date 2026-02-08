'use client'

import { useAppStore } from '@/lib/store'
import { supabase } from '@/lib/supabase/client'
import { motion } from 'framer-motion'
import { ArrowLeft, Loader2, Ruler, Save, User } from 'lucide-react'
import { useState } from 'react'

export function EditProfileScreen() {
  const { user, setUser, setStage } = useAppStore()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    displayName: user?.display_name || '',
    bio: user?.bio || '',
    age: user?.age || 25,
    height: user?.height_cm || 175,
  })

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    if (!user?.id) return
    setLoading(true)
    try {
      const { error } = await (supabase as any)
        .from('profiles')
        .update({
          display_name: formData.displayName,
          bio: formData.bio,
          age: formData.age,
          height_cm: formData.height,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id)

      if (error) throw error

      // Update local store
      setUser({
        ...user!,
        display_name: formData.displayName,
        bio: formData.bio,
        age: formData.age,
        height_cm: formData.height,
      })

      setStage('profile')
    } catch (error) {
      console.error('[EditProfileScreen] Error saving profile:', error)
      alert('Failed to save profile changes.')
      console.error('[EditProfileScreen] Profile save error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col h-full bg-black min-h-screen"
    >
      <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-md border-b border-slate-800 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setStage('profile')}
              className="p-2 hover:bg-slate-900 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <h1 className="text-lg font-black text-white">EDIT PROFILE</h1>
          </div>
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-700 rounded-full text-sm font-bold text-white shadow-lg shadow-amber-900/20 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            SAVE
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pb-24 p-4 space-y-6">
        {/* Basic Info */}
        <section className="space-y-3">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-2">
            <User className="w-4 h-4" />
            Basic Info
          </h2>
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400">DISPLAY NAME</label>
              <input
                type="text"
                value={formData.displayName}
                onChange={(e) => handleChange('displayName', e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-3 text-white focus:border-amber-600 focus:outline-none transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400">ABOUT ME</label>
              <textarea
                value={formData.bio}
                onChange={(e) => handleChange('bio', e.target.value)}
                rows={4}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-3 text-white focus:border-amber-600 focus:outline-none transition-colors resize-none"
              />
            </div>
          </div>
        </section>

        {/* Physical Stats */}
        <section className="space-y-3">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-2">
            <Ruler className="w-4 h-4" />
            Stats
          </h2>
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400">AGE</label>
              <input
                type="number"
                value={formData.age}
                onChange={(e) => handleChange('age', Number.parseInt(e.target.value, 10))}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-3 text-white focus:border-amber-600 focus:outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400">HEIGHT (cm)</label>
              <input
                type="number"
                value={formData.height}
                onChange={(e) => handleChange('height', Number.parseInt(e.target.value, 10))}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-3 text-white focus:border-amber-600 focus:outline-none"
              />
            </div>
          </div>
        </section>
      </main>
    </motion.div>
  )
}
