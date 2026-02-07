'use client'

import { useAppStore } from '@/lib/store'
import { supabase } from '@/lib/supabase/client'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Bot,
  Brain,
  Languages,
  Lightbulb,
  MessageSquare,
  Sparkles,
  Zap,
} from 'lucide-react'
import type React from 'react'
import { useEffect, useState } from 'react'

interface AISettingProps {
  icon: React.ReactNode
  title: string
  description: string
  enabled: boolean
  onToggle: (enabled: boolean) => void
}

function AISetting({ icon, title, description, enabled, onToggle }: AISettingProps) {
  return (
    <div className="flex items-center justify-between p-4 hover:bg-slate-900/30 transition-colors rounded-xl">
      <div className="flex items-center gap-3">
        <div
          className={`
          w-10 h-10 rounded-xl flex items-center justify-center transition-all
          ${
            enabled
              ? 'bg-gradient-to-br from-amber-500/20 to-amber-600/20 text-amber-500'
              : 'bg-slate-900 text-slate-600'
          }
        `}
        >
          {icon}
        </div>
        <div>
          <h3 className="text-sm font-bold text-white">{title}</h3>
          <p className="text-xs text-slate-500">{description}</p>
        </div>
      </div>
      <div
        onClick={() => onToggle(!enabled)}
        className={`
          w-11 h-6 rounded-full p-1 cursor-pointer transition-colors
          ${enabled ? 'bg-amber-600' : 'bg-slate-700'}
        `}
      >
        <div
          className={`
          w-4 h-4 rounded-full bg-white shadow-sm transition-transform
          ${enabled ? 'translate-x-5' : 'translate-x-0'}
        `}
        />
      </div>
    </div>
  )
}

export function AISettingsScreen() {
  const { setStage, user, setIsAiEnabled, isAiEnabled } = useAppStore()
  const [isLoading, setIsLoading] = useState(true)
  const [settings, setSettings] = useState({
    autoReplyEnabled: isAiEnabled,
    autoReplyMessage: '',
    quickReplies: true,
    autoTranslate: true,
    smartSuggestions: true,
  })

  useEffect(() => {
    const fetchSettings = async () => {
      if (!user) return
      const { data, error } = await supabase
        .from('profiles')
        .select('settings, bio')
        .eq('user_id', user.id)
        .single()

      if (data && (data as any).settings) {
        const s = (data as any).settings
        setSettings((prev) => ({ ...prev, ...s }))
        setIsAiEnabled(!!s.autoReplyEnabled)
      }
      setIsLoading(false)
    }
    fetchSettings()
  }, [user, setIsAiEnabled])

  const updateSetting = async (key: string, value: boolean) => {
    const newSettings = { ...settings, [key]: value }
    setSettings(newSettings)

    if (key === 'autoReplyEnabled') {
      setIsAiEnabled(value)
    }

    if (user) {
      await (supabase as any)
        .from('profiles')
        .update({ settings: newSettings })
        .eq('user_id', user.id)
    }
  }

  const handleSaveMessage = async (msg: string) => {
    const updatedSettings = { ...settings, autoReplyMessage: msg }
    setSettings(updatedSettings)
    if (user) {
      await (supabase as any)
        .from('profiles')
        .update({ settings: updatedSettings })
        .eq('user_id', user.id)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[50vh]">
        <Bot className="animate-pulse text-amber-500 w-8 h-8" />
      </div>
    )
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
          <div>
            <p className="text-[10px] text-amber-500 font-bold uppercase tracking-widest">
              ENTERPRISE
            </p>
            <h1 className="text-lg font-black text-white">AI SETTINGS</h1>
          </div>
        </div>
      </header>

      <main className="flex-1 scrollbar-hide p-4">
        <div className="max-w-2xl mx-auto space-y-6">
          <section>
            <h2 className="px-1 py-2 text-xs font-bold text-slate-500 uppercase tracking-wide">
              Automation Core
            </h2>
            <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden">
              <AISetting
                icon={<Zap className="w-5 h-5" />}
                title="Auto-Reply"
                description="AI responds to messages when you're busy"
                enabled={settings.autoReplyEnabled}
                onToggle={(v) => updateSetting('autoReplyEnabled', v)}
              />

              {settings.autoReplyEnabled && (
                <div className="px-4 pb-4 animate-in fade-in slide-in-from-top duration-300">
                  <textarea
                    value={settings.autoReplyMessage}
                    onChange={(e) =>
                      setSettings((prev) => ({ ...prev, autoReplyMessage: e.target.value }))
                    }
                    onBlur={(e) => handleSaveMessage(e.target.value)}
                    placeholder="Enter your auto-reply message..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-sm text-white focus:border-amber-600 focus:outline-none transition-colors"
                    rows={3}
                  />
                  <p className="text-[10px] text-slate-600 mt-1 italic">
                    Settings auto-saved on focus lost.
                  </p>
                </div>
              )}

              <div className="border-t border-slate-900" />
              <AISetting
                icon={<MessageSquare className="w-5 h-5" />}
                title="Quick Replies"
                description="Get AI-suggested responses for any message"
                enabled={settings.quickReplies}
                onToggle={(v) => updateSetting('quickReplies', v)}
              />
              <div className="border-t border-slate-900" />
              <AISetting
                icon={<Languages className="w-5 h-5" />}
                title="Auto-Translate"
                description="Automatically translate foreign messages"
                enabled={settings.autoTranslate}
                onToggle={(v) => updateSetting('autoTranslate', v)}
              />
            </div>
          </section>

          <section>
            <h2 className="px-1 py-2 text-xs font-bold text-slate-500 uppercase tracking-wide">
              Intelligence
            </h2>
            <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden">
              <AISetting
                icon={<Lightbulb className="w-5 h-5" />}
                title="Smart Suggestions"
                description="Context-aware reply recommendations"
                enabled={settings.smartSuggestions}
                onToggle={(v) => updateSetting('smartSuggestions', v)}
              />
            </div>
          </section>

          <div className="bg-gradient-to-br from-amber-900/20 via-black to-slate-900 border border-amber-600/20 rounded-2xl p-5">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-900/20">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  AI Assistant
                </h3>
                <p className="text-sm text-slate-400 mt-1 leading-relaxed">
                  Our advanced AI assistant learns your communication style to provide personalized
                  replies, translations, and suggestions. All processing is secure and private.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </motion.div>
  )
}
