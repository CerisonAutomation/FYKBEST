'use client'

import { useVibrate } from '@/lib/hooks'
import { useAppStore } from '@/lib/store'
import { supabase } from '@/lib/supabase/client'
import { motion } from 'framer-motion'
import { AlertCircle, ArrowRight, CheckCircle, FileText, Loader2, Shield } from 'lucide-react'
import { useState } from 'react'

export function VerificationScreen() {
  const vibrate = useVibrate()
  const { setStage, user } = useAppStore()
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [docNumber, setDocNumber] = useState('')

  const handleVerify = async () => {
    if (!docNumber.trim()) return

    setLoading(true)
    vibrate([40, 20])

    try {
      const { data, error } = await supabase.functions.invoke('verify-identity', {
        body: { documentType: 'passport', documentNumber: docNumber },
      })

      if (error) throw error

      if (data?.status === 'verified') {
        if (user) {
          await (supabase as any)
            .from('profiles')
            .update({ verification_status: 'verified' })
            .eq('user_id', user.id)
        }
        setStatus('success')
        vibrate([20, 50, 20])
      } else {
        setStatus('error')
        vibrate([100, 50, 100])
      }
    } catch (err) {
      console.error('Verification failed:', err)
      setStatus('error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md space-y-8 bg-slate-900/40 p-8 rounded-3xl border border-slate-800 backdrop-blur-xl"
      >
        <div className="text-center space-y-2">
          <div className="w-20 h-20 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-amber-500/20">
            <Shield className="w-10 h-10 text-amber-500" />
          </div>
          <h2 className="text-3xl font-black tracking-tight">VERIFY IDENTITY</h2>
          <p className="text-slate-400 text-sm font-light">
            To maintain the elite standards of our network, we require a quick identity check.
          </p>
        </div>

        {status === 'idle' && (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-amber-500 uppercase tracking-[0.2em] ml-1">
                  Document Number
                </label>
                <div className="relative">
                  <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    type="text"
                    value={docNumber}
                    onChange={(e) => setDocNumber(e.target.value)}
                    placeholder="Enter Passport/ID number"
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-2xl pl-12 pr-4 py-4 text-white focus:border-amber-600 focus:outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={handleVerify}
              disabled={loading || !docNumber.trim()}
              className="w-full py-4 bg-gradient-to-r from-amber-600 to-amber-700 text-white font-bold rounded-2xl flex items-center justify-center gap-2 hover:from-amber-500 hover:to-amber-600 transition shadow-lg shadow-amber-600/20 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'START VERIFICATION'}
            </button>
          </div>
        )}

        {status === 'success' && (
          <div className="text-center space-y-6 py-4 animate-in fade-in zoom-in duration-500">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
            <div className="space-y-2">
              <h3 className="text-xl font-bold">VERIFICATION COMPLETE</h3>
              <p className="text-slate-400 text-sm">
                Your identity has been confirmed. Welcome to the elite tier.
              </p>
            </div>
            <button
              onClick={() => setStage('browse')}
              className="w-full py-4 bg-white text-black font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-slate-200 transition"
            >
              <span>ENTER PLATFORM</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {status === 'error' && (
          <div className="text-center space-y-6 py-4 animate-in fade-in zoom-in duration-500">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
            <div className="space-y-2">
              <h3 className="text-xl font-bold">VERIFICATION FAILED</h3>
              <p className="text-slate-400 text-sm">
                We couldn't verify your document. Please try again with correct details.
              </p>
            </div>
            <button
              onClick={() => setStatus('idle')}
              className="w-full py-4 bg-slate-800 text-white font-bold rounded-2xl hover:bg-slate-700 transition"
            >
              RETRY
            </button>
          </div>
        )}

        <p className="text-[10px] text-center text-slate-600 uppercase tracking-widest pt-4">
          Encrypted • Secure • King Certified
        </p>
      </motion.div>
    </div>
  )
}
