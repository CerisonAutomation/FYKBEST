'use client'

import { useVibrate } from '@/lib/hooks'
import { useAppStore } from '@/lib/store'
import { motion } from 'framer-motion'
import { ArrowLeft, Check, FileText, Lock, Shield, UserCheck } from 'lucide-react'
import { useState } from 'react'

const terms = [
  {
    icon: UserCheck,
    title: '18+ VERIFICATION',
    description:
      'All users must be verified 18+. Non-compliance results in immediate account termination.',
    color: 'text-amber-500',
  },
  {
    icon: Shield,
    title: 'LEGAL COMPLIANCE',
    description:
      'All arrangements must comply with local jurisdiction laws. Zero tolerance policy for violations.',
    color: 'text-blue-500',
  },
  {
    icon: Lock,
    title: 'PRIVACY PROTECTION',
    description:
      'End-to-end encryption • GDPR compliant • Zero data monetization • Your data is yours.',
    color: 'text-green-500',
  },
  {
    icon: FileText,
    title: 'VERIFIED PROFILES',
    description:
      'ID verification required for all profiles. Fraudulent accounts result in permanent ban.',
    color: 'text-purple-500',
  },
]

export function TermsScreen() {
  const vibrate = useVibrate()
  const { setStage, role } = useAppStore()
  const [accepted, setAccepted] = useState(false)

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl space-y-6"
      >
        {/* Header */}
        <div className="text-center space-y-2 sticky top-0 bg-black/95 backdrop-blur py-4 border-b border-slate-800 -mx-4 px-4 z-10">
          <motion.h2
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-4xl font-black"
          >
            TERMS & CONDITIONS
          </motion.h2>
          <p className="text-slate-500 text-sm">Please review and accept to continue</p>
        </div>

        {/* Terms List */}
        <div className="space-y-4 bg-slate-900/30 border border-slate-800 rounded-2xl p-4 sm:p-6 backdrop-blur-sm max-h-[50vh] overflow-y-auto">
          {terms.map((term, index) => (
            <motion.div
              key={term.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`space-y-2 ${index > 0 ? 'border-t border-slate-700/50 pt-4' : ''}`}
            >
              <h3
                className={`font-black ${term.color} flex items-center gap-2 text-sm sm:text-base`}
              >
                <term.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                {term.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 font-light leading-relaxed pl-6 sm:pl-7">
                {term.description}
              </p>
            </motion.div>
          ))}

          {/* Additional Terms */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="pt-4 border-t border-slate-700/50 text-xs text-slate-500 space-y-2"
          >
            <p>
              By creating an account, you acknowledge that you have read, understood, and agree to
              be bound by these terms.
            </p>
            <p>
              We reserve the right to modify these terms at any time. Continued use constitutes
              acceptance of modified terms.
            </p>
          </motion.div>
        </div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="space-y-4 sticky bottom-0 bg-black/95 backdrop-blur py-4 border-t border-slate-800 -mx-4 px-4"
        >
          {/* Checkbox */}
          <label className="flex items-start gap-3 cursor-pointer p-4 rounded-xl hover:bg-slate-900/50 border border-slate-800 transition group">
            <div className="relative mt-0.5">
              <input
                type="checkbox"
                checked={accepted}
                onChange={(e) => setAccepted(e.target.checked)}
                className="sr-only"
              />
              <div
                className={`
                w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-200
                ${
                  accepted
                    ? 'bg-amber-600 border-amber-600'
                    : 'border-slate-600 group-hover:border-amber-600/50'
                }
              `}
              >
                {accepted && <Check className="w-4 h-4 text-white" />}
              </div>
            </div>
            <span className="text-sm text-slate-300 font-light leading-relaxed">
              I confirm that I am <strong className="text-white">18 years or older</strong> and I
              have read and accept the{' '}
              <span className="text-amber-400 hover:underline cursor-pointer">
                Terms of Service
              </span>{' '}
              and{' '}
              <span className="text-amber-400 hover:underline cursor-pointer">Privacy Policy</span>.
            </span>
          </label>

          {/* Buttons */}
          <motion.button
            onClick={() => {
              if (accepted) {
                vibrate([40, 20, 40])
                setStage('signup')
              }
            }}
            disabled={!accepted}
            whileHover={{ scale: accepted ? 1.02 : 1 }}
            whileTap={{ scale: accepted ? 0.98 : 1 }}
            className={`
              w-full group relative py-4 rounded-xl overflow-hidden font-bold text-sm transition-all
              ${accepted ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}
            `}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-amber-700 group-hover:from-amber-500 group-hover:to-amber-600 transition" />
            <span className="relative flex items-center justify-center gap-2">
              <Check className="w-4 h-4" />
              ACCEPT & CONTINUE
            </span>
          </motion.button>

          <motion.button
            onClick={() => {
              vibrate([15, 8])
              setStage('role')
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 text-slate-500 hover:text-slate-400 transition text-sm flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            DECLINE
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  )
}
