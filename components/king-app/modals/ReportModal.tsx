'use client'

import { useVibrate } from '@/lib/hooks'
import { supabase } from '@/lib/supabase/client'
import { AnimatePresence, motion } from 'framer-motion'
import { AlertCircle, CheckCircle, ShieldAlert, X } from 'lucide-react'
import React, { useState } from 'react'

export function ReportModal({
  isOpen,
  onClose,
  targetUserId,
  contentId,
}: { isOpen: boolean; onClose: () => void; targetUserId: string; contentId?: string }) {
  const [reason, setReason] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle')
  const vibrate = useVibrate()

  const handleReport = async () => {
    if (!reason) return
    setStatus('loading')
    vibrate([40, 20])

    try {
      const { error } = await (supabase.from('reports') as any).insert({
        reporter_id: (await supabase.auth.getUser()).data.user?.id,
        reported_user_id: targetUserId,
        reason,
        description,
        content_reference_id: contentId,
      })

      if (error) throw error
      setStatus('success')
      setTimeout(() => {
        onClose()
        setStatus('idle')
      }, 2000)
    } catch (err) {
      console.error(err)
      setStatus('idle')
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden"
          >
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2 text-red-500 font-black uppercase tracking-widest text-sm">
                <ShieldAlert className="w-5 h-5" />
                Safety Report
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-800 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {status === 'success' ? (
              <div className="p-12 text-center space-y-4">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
                <h3 className="text-xl font-bold">REPORT SUBMITTED</h3>
                <p className="text-slate-400 text-sm">
                  Our trust and safety team will review this incident within 24 hours.
                </p>
              </div>
            ) : (
              <div className="p-6 space-y-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    Reason for report
                  </label>
                  <select
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full bg-black border border-slate-800 rounded-xl p-4 text-sm focus:border-red-500 outline-none transition-colors appearance-none"
                  >
                    <option value="">Select a reason...</option>
                    <option value="harassment">Harassment / Abusive behavior</option>
                    <option value="fake">Fake Profile / Scam</option>
                    <option value="underage">Underage (Under 18)</option>
                    <option value="spam">Spam / Unsolicited Ads</option>
                    <option value="explicit">Prohibited Content</option>
                  </select>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    Additional Details
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe the incident..."
                    rows={4}
                    className="w-full bg-black border border-slate-800 rounded-xl p-4 text-sm focus:border-red-500 outline-none transition-colors resize-none"
                  />
                </div>

                <button
                  onClick={handleReport}
                  disabled={!reason || status === 'loading'}
                  className="w-full py-4 bg-red-600 hover:bg-red-500 text-white font-black rounded-2xl transition-all shadow-lg shadow-red-600/20 disabled:opacity-50 uppercase tracking-widest text-sm"
                >
                  {status === 'loading' ? 'Processing...' : 'Submit Report'}
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
