'use client'

import { useVibrate } from '@/lib/hooks'
import { useAppStore } from '@/lib/store'
import { motion } from 'framer-motion'
import { Award, ChevronRight, Lock, Shield } from 'lucide-react'

export function OnboardingScreen() {
  const vibrate = useVibrate()
  const { setStage } = useAppStore()

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-black text-white flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-amber-600/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 sm:w-96 h-64 sm:h-96 bg-amber-600/3 rounded-full blur-3xl" />
      <div className="absolute top-1/2 right-1/3 w-48 sm:w-72 h-48 sm:h-72 bg-red-600/3 rounded-full blur-3xl" />

      <div className="relative max-w-2xl text-center space-y-10 sm:space-y-16 px-4">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="inline-block px-4 sm:px-6 py-2 bg-gradient-to-r from-amber-600/20 to-red-600/20 border border-amber-600/40 rounded-full"
        >
          <p className="text-xs sm:text-sm tracking-[0.2em] sm:tracking-[0.3em] font-light text-amber-400">
            PREMIUM DATING NETWORK
          </p>
        </motion.div>

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="space-y-2 sm:space-y-4"
        >
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tighter leading-none">
            <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600 bg-clip-text text-transparent">
              KING
            </span>
          </h1>
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tighter leading-none">
            <span className="bg-gradient-to-r from-red-400 via-red-500 to-red-600 bg-clip-text text-transparent">
              SOCIAL
            </span>
          </h1>
        </motion.div>

        {/* Divider */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: 128 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="h-1 bg-gradient-to-r from-amber-600/40 to-amber-400/60 mx-auto"
        />

        {/* Description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-base sm:text-lg font-light text-slate-300 tracking-wider max-w-xl mx-auto leading-relaxed"
        >
          Connect with verified companions. Premium dating platform for discerning individuals
          seeking genuine connections.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="space-y-4 max-w-sm mx-auto"
        >
          <motion.button
            onClick={() => {
              vibrate([20, 10, 20])
              setStage('login')
            }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="w-full group relative py-4 px-8 rounded-xl overflow-hidden font-bold text-base transition-all duration-500"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-amber-700 group-hover:from-amber-500 group-hover:to-amber-600 transition-all duration-500 shadow-lg shadow-amber-600/50 group-hover:shadow-amber-600/70" />
            <span className="relative flex items-center justify-center gap-2">
              <span>SIGN IN</span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </motion.button>

          <motion.button
            onClick={() => {
              vibrate([20, 10, 20])
              setStage('role')
            }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="w-full group relative py-4 px-8 rounded-xl overflow-hidden font-bold text-base border-2 border-amber-600/50 hover:border-amber-600 transition-all duration-500"
          >
            <div className="absolute inset-0 bg-amber-600/5 group-hover:bg-amber-600/15 transition-all duration-500" />
            <span className="relative flex items-center justify-center gap-2">
              <span>CREATE ACCOUNT</span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </motion.button>

          <p className="text-xs text-slate-500 font-light pt-4">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="pt-6 sm:pt-8 border-t border-slate-800/50 mt-8 sm:mt-12"
        >
          <p className="text-xs text-slate-600 mb-4 sm:mb-6 tracking-wider">
            VERIFIED SECURE PLATFORM
          </p>
          <div className="flex items-center justify-center gap-6 sm:gap-8 text-slate-400">
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center">
                <Lock className="w-5 h-5 text-green-500" />
              </div>
              <span className="text-xs">256-bit SSL</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center">
                <Shield className="w-5 h-5 text-green-500" />
              </div>
              <span className="text-xs">ID Verified</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center">
                <Award className="w-5 h-5 text-green-500" />
              </div>
              <span className="text-xs">GDPR Compliant</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
