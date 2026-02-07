'use client'

import { useVibrate } from '@/lib/hooks'
import { useAppStore } from '@/lib/store'
import { supabase } from '@/lib/supabase/client'
import { motion } from 'framer-motion'
import { BarChart3, Bell, Check, Cookie, Shield } from 'lucide-react'
import React, { useState } from 'react'

export function ConsentScreen() {
  const vibrate = useVibrate()
  const { setStage, user } = useAppStore()
  const [consents, setConsents] = useState({
    analytics: true,
    marketing: false,
    push: true,
  })

  const handleFinish = async () => {
    vibrate([40, 20])
    if (user) {
      await (supabase as any)
        .from('profiles')
        .update({
          settings: {
            consents,
            consent_date: new Date().toISOString(),
          },
        })
        .eq('user_id', user.id)
    }
    setStage('browse')
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md space-y-8 bg-slate-900/40 p-8 rounded-3xl border border-slate-800 backdrop-blur-xl"
      >
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-amber-500" />
          </div>
          <h2 className="text-2xl font-black tracking-tight">YOUR PRIVACY</h2>
          <p className="text-slate-400 text-xs font-light">
            Customize how your data is used to provide the Zenith experience.
          </p>
        </div>

        <div className="space-y-4">
          <ConsentToggle
            icon={BarChart3}
            title="Analytics"
            desc="Help us improve with anonymous usage data."
            checked={consents.analytics}
            onChange={(v: boolean) => setConsents({ ...consents, analytics: v })}
          />
          <ConsentToggle
            icon={Bell}
            title="Push Notifications"
            desc="Get real-time alerts for messages and matches."
            checked={consents.push}
            onChange={(v: boolean) => setConsents({ ...consents, push: v })}
          />
          <ConsentToggle
            icon={Cookie}
            title="Personalization"
            desc="Tailor your discovery grid to your preferences."
            checked={consents.marketing}
            onChange={(v: boolean) => setConsents({ ...consents, marketing: v })}
          />
        </div>

        <button
          onClick={handleFinish}
          className="w-full py-4 bg-gradient-to-r from-amber-600 to-amber-700 text-white font-bold rounded-2xl flex items-center justify-center gap-2 hover:shadow-lg transition-all"
        >
          <Check className="w-5 h-5" />
          AGREE & ENTER
        </button>
      </motion.div>
    </div>
  )
}

function ConsentToggle({ icon: Icon, title, desc, checked, onChange }: any) {
  return (
    <div className="flex items-center justify-between p-4 bg-slate-950 border border-slate-800 rounded-2xl">
      <div className="flex gap-3">
        <div className="p-2 bg-slate-900 rounded-lg h-fit">
          <Icon className="w-4 h-4 text-slate-400" />
        </div>
        <div className="space-y-0.5">
          <p className="text-sm font-bold">{title}</p>
          <p className="text-[10px] text-slate-500 leading-tight pr-4">{desc}</p>
        </div>
      </div>
      <div
        onClick={() => onChange(!checked)}
        className={`w-10 h-5 rounded-full relative p-1 cursor-pointer transition-colors ${checked ? 'bg-amber-600' : 'bg-slate-800'}`}
      >
        <motion.div animate={{ x: checked ? 20 : 0 }} className="w-3 h-3 bg-white rounded-full" />
      </div>
    </div>
  )
}
