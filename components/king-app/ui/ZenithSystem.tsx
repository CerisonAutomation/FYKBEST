'use client'

import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import type React from 'react'

/**
 * GlassCard: The fundamental UI building block
 * rgba(13,13,18,.85) with 20px blur and regal gold accents.
 */
export function GlassCard({
  children,
  className,
  hover = true,
}: { children: React.ReactNode; className?: string; hover?: boolean }) {
  return (
    <motion.div
      whileHover={hover ? { y: -2, backgroundColor: 'rgba(20,20,25,0.9)' } : {}}
      className={cn(
        'bg-[#0D0D12]/85 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden shadow-2xl transition-colors',
        className
      )}
    >
      {children}
    </motion.div>
  )
}

/**
 * FilterChip: Dense 44px touch targets for rapid scanning
 */
export function FilterChip({
  label,
  active,
  onClick,
  icon: Icon,
}: { label: string; active?: boolean; onClick: () => void; icon?: any }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'h-11 px-5 rounded-full flex items-center gap-2 text-xs font-black uppercase tracking-[0.1em] transition-all border',
        active
          ? 'bg-amber-600 border-amber-500 text-white shadow-lg shadow-amber-600/20'
          : 'bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-700'
      )}
    >
      {Icon && <Icon className="w-3.5 h-3.5" />}
      {label}
    </button>
  )
}

/**
 * AppShell: Global Layout Orchestrator
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white selection:bg-amber-500/30">
      <div className="fixed inset-0 bg-gradient-to-tr from-amber-600/5 via-transparent to-red-600/5 pointer-events-none" />
      {children}
    </div>
  )
}
