'use client'

import { useVibrate } from '@/lib/hooks'
import { useAppStore } from '@/lib/store'
import { motion } from 'framer-motion'
import { ArrowLeft, Crown, Heart } from 'lucide-react'
import type React from 'react'

export function RoleScreen() {
  const vibrate = useVibrate()
  const { setStage, setRole } = useAppStore()

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-black text-white flex items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-3xl space-y-10 sm:space-y-12"
      >
        {/* Header */}
        <div className="text-center space-y-3">
          <motion.h2
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-black tracking-tight"
          >
            SELECT YOUR ROLE
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 text-sm tracking-[0.2em] font-light"
          >
            CHOOSE YOUR JOURNEY
          </motion.p>
        </div>

        {/* Role Cards */}
        <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
          <RoleCard
            icon={Heart}
            title="SEEKING"
            subtitle="Find your perfect match"
            description="Browse profiles, connect with verified companions, and discover meaningful connections."
            features={['Browse Verified Profiles', 'Send Messages', 'Book Dates', 'AI Matching']}
            onClick={() => {
              vibrate([30, 15, 30])
              setRole('seeker')
              setStage('terms')
            }}
            delay={0.3}
            gradient="from-pink-500 to-rose-500"
          />

          <RoleCard
            icon={Crown}
            title="BE A KING"
            subtitle="Join elite network"
            description="Showcase your profile, connect with seekers, and build your premium presence."
            features={[
              'Create Premium Profile',
              'Set Your Rates',
              'Manage Bookings',
              'Verification Badge',
            ]}
            onClick={() => {
              vibrate([30, 15, 30])
              setRole('provider')
              setStage('terms')
            }}
            delay={0.4}
            gradient="from-amber-500 to-orange-500"
            featured
          />
        </div>

        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
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

interface RoleCardProps {
  icon: React.ComponentType<{ className?: string }>
  title: string
  subtitle: string
  description: string
  features: string[]
  onClick: () => void
  delay: number
  gradient: string
  featured?: boolean
}

function RoleCard({
  icon: Icon,
  title,
  subtitle,
  description,
  features,
  onClick,
  delay,
  gradient,
  featured,
}: RoleCardProps) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      onClick={onClick}
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      className={`
        group relative p-6 sm:p-8 rounded-2xl border transition-all duration-500 overflow-hidden text-left
        ${
          featured
            ? 'border-amber-600/50 hover:border-amber-500 bg-gradient-to-br from-amber-600/10 to-amber-800/5'
            : 'border-slate-700 hover:border-amber-600/50 bg-gradient-to-br from-slate-800/40 to-slate-900/20'
        }
      `}
    >
      {/* Featured Badge */}
      {featured && (
        <div className="absolute -top-px -right-px">
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-black px-3 py-1 rounded-bl-lg rounded-tr-xl">
            POPULAR
          </div>
        </div>
      )}

      {/* Background Glow */}
      <div
        className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${gradient} blur-3xl scale-150`}
        style={{ opacity: 0.05 }}
      />

      <div className="relative space-y-6">
        {/* Icon */}
        <div
          className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${gradient} bg-opacity-20 border border-white/10 flex items-center justify-center shadow-lg`}
        >
          <Icon className="w-8 h-8 text-white" />
        </div>

        {/* Title & Subtitle */}
        <div>
          <h3 className="text-2xl sm:text-3xl font-black mb-1">{title}</h3>
          <p className="text-slate-400 font-light">{subtitle}</p>
        </div>

        {/* Description */}
        <p className="text-slate-500 text-sm leading-relaxed font-light">{description}</p>

        {/* Features */}
        <div className="space-y-2">
          {features.map((feature, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-slate-400">
              <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${gradient}`} />
              {feature}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div
          className={`pt-4 border-t border-slate-800/50 flex items-center justify-between text-sm font-semibold ${featured ? 'text-amber-400' : 'text-slate-400 group-hover:text-amber-400'} transition-colors`}
        >
          <span>Get Started</span>
          <motion.span className="group-hover:translate-x-1 transition-transform">→</motion.span>
        </div>
      </div>
    </motion.button>
  )
}
