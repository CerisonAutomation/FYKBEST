'use client'

import { useValidateEmail, useVibrate } from '@/lib/hooks'
import { supabase } from '@/lib/supabase/client'
import { motion } from 'framer-motion'
import { ArrowLeft, Eye, EyeOff, Lock, Mail, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function LoginScreen() {
  const vibrate = useVibrate()
  const validateEmail = useValidateEmail()
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async () => {
    setError(null)

    if (!validateEmail(email)) {
      setError('Please enter a valid email address')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setIsLoading(true)
    vibrate([40, 20, 40])

    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) throw authError

      // Note: Auth state change listener will handle store update
      router.push('/browse')
    } catch (err: any) {
      setError(err.message || 'Failed to sign in')
      vibrate([100, 50, 100])
    } finally {
      setIsLoading(false)
    }
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
          <motion.h2
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-black tracking-tight"
          >
            SIGN IN
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 text-sm font-light"
          >
            Secure access to your network
          </motion.p>
        </div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4 bg-slate-900/40 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm"
        >
          {/* Email Input */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400 tracking-wider">EMAIL</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600/50 transition text-sm"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400 tracking-wider">PASSWORD</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-12 py-3.5 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600/50 transition text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm"
            >
              {error}
            </motion.div>
          )}

          {/* Forgot Password */}
          <div className="flex justify-end">
            <button className="text-xs text-amber-400 hover:text-amber-300 transition font-medium">
              Forgot password?
            </button>
          </div>
        </motion.div>

        {/* Actions */}
        <div className="space-y-4">
          <motion.button
            onClick={handleLogin}
            disabled={isLoading}
            whileHover={{ scale: isLoading ? 1 : 1.02 }}
            whileTap={{ scale: isLoading ? 1 : 0.98 }}
            className="w-full group relative py-4 px-6 rounded-xl overflow-hidden font-bold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-amber-700 group-hover:from-amber-500 group-hover:to-amber-600 transition" />
            <span className="relative flex items-center justify-center gap-2">
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>AUTHENTICATE</span>
                  <Lock className="w-4 h-4" />
                </>
              )}
            </span>
          </motion.button>

          <Link
            href="/magic-link"
            onClick={() => vibrate([20, 10])}
            className="w-full py-3.5 text-amber-400 hover:text-amber-300 transition font-semibold text-sm flex items-center justify-center gap-2 border border-amber-600/30 rounded-xl hover:bg-amber-600/10"
          >
            <Sparkles className="w-4 h-4" />
            USE MAGIC LINK
          </Link>

          <Link
            href="/"
            onClick={() => vibrate([15, 8])}
            className="w-full py-3 text-slate-500 hover:text-slate-400 transition text-sm flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            BACK
          </Link>
        </div>

        {/* Demo Hint */}
        <div className="text-center pt-4 border-t border-slate-800/50">
          <p className="text-xs text-slate-600">Demo: Use any email and password to continue</p>
        </div>
      </motion.div>
    </div>
  )
}
