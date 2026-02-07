'use client'

import { useFormatTime, useValidateEmail, useVibrate } from '@/lib/hooks'
import { useAppStore } from '@/lib/store'
import { supabase } from '@/lib/supabase/client'
import { motion } from 'framer-motion'
import { ArrowLeft, CheckCircle, Mail, RefreshCw, Sparkles } from 'lucide-react'
import { useEffect, useState } from 'react'

export function MagicLinkScreen() {
  const vibrate = useVibrate()
  const validateEmail = useValidateEmail()
  const formatTime = useFormatTime()
  const { setStage } = useAppStore()

  const [email, setEmail] = useState('')
  const [step, setStep] = useState<'email' | 'verify'>('email')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [timeLeft, setTimeLeft] = useState(0)

  const isValid = validateEmail(email)
  const isExpired = timeLeft <= 0 && step === 'verify'

  useEffect(() => {
    if (step !== 'verify' || timeLeft <= 0) return

    const interval = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1000))
    }, 1000)

    return () => clearInterval(interval)
  }, [step, timeLeft])

  const handleSendLink = async () => {
    if (!isValid) {
      setError('Please enter a valid email address')
      return
    }

    setError(null)
    setIsLoading(true)

    try {
      const { error: authError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/api/auth/callback`,
        },
      })

      if (authError) throw authError

      vibrate([40, 20, 40])
      setTimeLeft(15 * 60 * 1000) // 15 minutes
      setStep('verify')
    } catch (err: any) {
      setError(err.message || 'Failed to send magic link')
      vibrate([100, 50, 100])
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerify = async () => {
    // Usually user clicks link in email.
    // But if they are verifying a code manually (OTP), we need input for it.
    // Standard Magic Link just sends an email.
    // We will guide them to check email.
    // If this screen supported OTP entry, we'd use verifyOtp.
    // For now, we just tell them to check email.
  }

  const handleResend = () => {
    handleSendLink()
  }

  if (step === 'verify') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-black text-white flex items-center justify-center px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md space-y-8"
        >
          {/* Header */}
          <div className="text-center space-y-2">
            <motion.h2
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-black tracking-tight"
            >
              CHECK YOUR EMAIL
            </motion.h2>
          </div>

          {/* Verification Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className={`
              border rounded-2xl p-8 text-center space-y-6 backdrop-blur-sm
              ${
                isExpired
                  ? 'bg-red-900/10 border-red-700/50'
                  : 'bg-green-900/10 border-green-700/50'
              }
            `}
          >
            {/* Icon */}
            <div
              className={`
              w-20 h-20 mx-auto rounded-full flex items-center justify-center
              ${
                isExpired
                  ? 'bg-red-500/20 border border-red-500/30'
                  : 'bg-green-500/20 border border-green-500/30'
              }
            `}
            >
              {isExpired ? (
                <RefreshCw className="w-10 h-10 text-red-400" />
              ) : (
                <Mail className="w-10 h-10 text-green-400" />
              )}
            </div>

            {/* Status */}
            <div>
              <p
                className={`font-bold text-lg mb-2 ${isExpired ? 'text-red-400' : 'text-green-400'}`}
              >
                {isExpired ? 'LINK EXPIRED' : 'MAGIC LINK SENT'}
              </p>
              <p className="text-slate-300 text-sm break-all">{email}</p>
            </div>

            {/* Timer */}
            <div
              className={`
              text-4xl font-black tabular-nums
              ${isExpired ? 'text-red-500' : 'text-green-500'}
            `}
            >
              {formatTime(timeLeft)}
            </div>

            {/* Progress Bar */}
            {!isExpired && (
              <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: '100%' }}
                  animate={{ width: `${(timeLeft / (15 * 60 * 1000)) * 100}%` }}
                  transition={{ duration: 1 }}
                  className="h-full bg-gradient-to-r from-green-500 to-green-400"
                />
              </div>
            )}

            <p className="text-sm text-slate-500">
              {isExpired
                ? 'Your magic link has expired. Request a new one.'
                : 'Click the link in your email to sign in instantly.'}
            </p>
          </motion.div>

          {/* Actions */}
          <div className="space-y-4">
            <motion.button
              onClick={isExpired ? handleResend : handleVerify}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`
                w-full group relative py-4 rounded-xl overflow-hidden font-bold
                ${isExpired ? 'opacity-100' : ''}
              `}
            >
              <div
                className={`
                absolute inset-0 transition
                ${
                  isExpired
                    ? 'bg-gradient-to-r from-amber-600 to-amber-700 group-hover:from-amber-500 group-hover:to-amber-600'
                    : 'bg-gradient-to-r from-green-600 to-green-700 group-hover:from-green-500 group-hover:to-green-600'
                }
              `}
              />
              <span className="relative flex items-center justify-center gap-2">
                {isExpired ? (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    REQUEST NEW LINK
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    CONFIRM & SIGN IN
                  </>
                )}
              </span>
            </motion.button>

            <motion.button
              onClick={() => {
                vibrate([15, 8])
                setStep('email')
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 text-slate-500 hover:text-slate-400 transition text-sm"
            >
              Change email address
            </motion.button>

            <motion.button
              onClick={() => {
                vibrate([15, 8])
                setStage('onboarding')
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 text-slate-500 hover:text-slate-400 transition text-sm flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              BACK TO HOME
            </motion.button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-black text-white flex items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md space-y-8"
      >
        {/* Header */}
        <div className="text-center space-y-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-amber-500/20 to-amber-600/20 border border-amber-500/30 flex items-center justify-center"
          >
            <Sparkles className="w-10 h-10 text-amber-400" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl font-black tracking-tight"
          >
            MAGIC LINK
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 text-sm font-light"
          >
            Passwordless authentication • No password needed
          </motion.p>
        </div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 space-y-4 backdrop-blur-sm"
        >
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400 tracking-wider">
              EMAIL ADDRESS
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value.toLowerCase().trim())}
                className="w-full pl-12 pr-4 py-3.5 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600/50 transition text-sm"
              />
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm"
            >
              {error}
            </motion.div>
          )}

          <motion.button
            onClick={handleSendLink}
            disabled={!isValid || isLoading}
            whileHover={{ scale: isValid && !isLoading ? 1.02 : 1 }}
            whileTap={{ scale: isValid && !isLoading ? 0.98 : 1 }}
            className={`
              w-full group relative py-4 rounded-xl overflow-hidden font-bold transition-all
              ${!isValid || isLoading ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            <div
              className={`
              absolute inset-0 transition
              ${
                isValid && !isLoading
                  ? 'bg-gradient-to-r from-amber-600 to-amber-700 group-hover:from-amber-500 group-hover:to-amber-600'
                  : 'bg-slate-700'
              }
            `}
            />
            <span className="relative flex items-center justify-center gap-2">
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  SEND MAGIC LINK
                </>
              )}
            </span>
          </motion.button>
        </motion.div>

        {/* Back Button */}
        <motion.button
          onClick={() => {
            vibrate([15, 8])
            setStage('onboarding')
          }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-3 text-slate-500 hover:text-slate-400 transition text-sm flex items-center justify-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          BACK
        </motion.button>
      </motion.div>
    </div>
  )
}
