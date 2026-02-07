'use client'

/**
 * Auth Card Component
 * Modern, animated authentication card wrapper
 */

import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

interface AuthCardProps {
  children: React.ReactNode
  title: string
  subtitle?: string
  className?: string
  footer?: React.ReactNode
}

export function AuthCard({ children, title, subtitle, className, footer }: AuthCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      className={cn('w-full max-w-md mx-auto', className)}
    >
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-slate-900/80 to-black/80 backdrop-blur-xl shadow-2xl">
        {/* Gradient border effect */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-amber-500/20 via-transparent to-transparent pointer-events-none" />

        {/* Content */}
        <div className="relative p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <span className="text-3xl font-black text-black">K</span>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">{title}</h1>
            {subtitle && <p className="text-slate-400 text-sm">{subtitle}</p>}
          </div>

          {/* Form content */}
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="relative px-8 py-6 border-t border-white/5 bg-black/20">{footer}</div>
        )}
      </div>
    </motion.div>
  )
}
