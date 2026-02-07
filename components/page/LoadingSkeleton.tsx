'use client'

/**
 * LoadingSkeleton - Production-grade loading states
 * Various skeleton patterns for different content types
 */

import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

// Base shimmer effect
export function Shimmer({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return <div className={cn('animate-pulse bg-slate-800 rounded', className)} style={style} />
}

// Card skeleton
export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden',
        className
      )}
    >
      <div className="h-48 w-full bg-slate-800 animate-pulse" />
      <div className="p-4 space-y-3">
        <div className="h-6 w-3/4 bg-slate-800 rounded animate-pulse" />
        <div className="h-4 w-full bg-slate-800 rounded animate-pulse" />
        <div className="h-4 w-2/3 bg-slate-800 rounded animate-pulse" />
        <div className="flex items-center gap-2 pt-2">
          <div className="h-8 w-8 bg-slate-800 rounded-full animate-pulse" />
          <div className="h-4 w-24 bg-slate-800 rounded animate-pulse" />
        </div>
      </div>
    </div>
  )
}

// Grid of cards skeleton
export function CardGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.05 }}
        >
          <CardSkeleton />
        </motion.div>
      ))}
    </div>
  )
}

// List item skeleton
export function ListItemSkeleton() {
  return (
    <div className="flex items-center gap-4 p-4 bg-slate-900/30 border border-slate-800 rounded-xl">
      <div className="h-12 w-12 bg-slate-800 rounded-full animate-pulse flex-shrink-0" />
      <div className="flex-1 space-y-2 min-w-0">
        <div className="h-5 w-1/3 bg-slate-800 rounded animate-pulse" />
        <div className="h-4 w-1/2 bg-slate-800 rounded animate-pulse" />
      </div>
      <div className="h-8 w-20 bg-slate-800 rounded-lg animate-pulse" />
    </div>
  )
}

// List skeleton
export function ListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.05 }}
        >
          <ListItemSkeleton />
        </motion.div>
      ))}
    </div>
  )
}

// Profile header skeleton
export function ProfileHeaderSkeleton() {
  return (
    <div className="relative">
      {/* Cover */}
      <div className="h-48 md:h-64 w-full bg-slate-800 animate-pulse" />

      {/* Avatar and info */}
      <div className="px-4 pb-6">
        <div className="relative -mt-16 mb-4">
          <div className="h-32 w-32 bg-slate-800 rounded-full border-4 border-slate-950 animate-pulse" />
        </div>

        <div className="space-y-3">
          <div className="h-8 w-64 bg-slate-800 rounded animate-pulse" />
          <div className="h-4 w-48 bg-slate-800 rounded animate-pulse" />
          <div className="flex gap-2 pt-2">
            <div className="h-6 w-20 bg-slate-800 rounded-full animate-pulse" />
            <div className="h-6 w-24 bg-slate-800 rounded-full animate-pulse" />
            <div className="h-6 w-16 bg-slate-800 rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  )
}

// Stats skeleton
export function StatsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="p-4 bg-slate-900/50 border border-slate-800 rounded-xl">
          <div className="h-8 w-16 bg-slate-800 rounded animate-pulse mb-2" />
          <div className="h-4 w-20 bg-slate-800 rounded animate-pulse" />
        </div>
      ))}
    </div>
  )
}

// Form skeleton
export function FormSkeleton({ fields = 4 }: { fields?: number }) {
  return (
    <div className="space-y-6 max-w-2xl">
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="h-5 w-24 bg-slate-800 rounded animate-pulse" />
          <div className="h-12 w-full bg-slate-800 rounded-lg animate-pulse" />
        </div>
      ))}
      <div className="h-12 w-32 bg-slate-800 rounded-lg animate-pulse" />
    </div>
  )
}

// Table skeleton
export function TableSkeleton({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className="border border-slate-800 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="bg-slate-900/50 p-4 border-b border-slate-800">
        <div className="flex gap-4">
          {Array.from({ length: columns }).map((_, i) => (
            <div key={i} className="h-6 bg-slate-800 rounded animate-pulse flex-1" />
          ))}
        </div>
      </div>

      {/* Rows */}
      <div className="divide-y divide-slate-800">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="p-4 flex gap-4">
            {Array.from({ length: columns }).map((_, colIndex) => (
              <div key={colIndex} className="h-5 bg-slate-800 rounded animate-pulse flex-1" />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

// Full page skeleton
export function PageSkeleton() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="h-10 w-64 bg-slate-800 rounded animate-pulse" />
        <div className="h-5 w-96 bg-slate-800 rounded animate-pulse" />
      </div>

      {/* Stats */}
      <StatsSkeleton />

      {/* Content */}
      <CardGridSkeleton count={6} />
    </div>
  )
}

// Message/thread skeleton
export function MessageSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={cn('flex gap-3', i % 2 === 1 && 'flex-row-reverse')}>
          <div className="h-10 w-10 bg-slate-800 rounded-full animate-pulse flex-shrink-0" />
          <div className={cn('space-y-2 max-w-[70%]', i % 2 === 1 && 'items-end')}>
            <div
              className={cn(
                'h-16 bg-slate-800 rounded-2xl animate-pulse',
                i % 2 === 1 ? 'rounded-tr-sm' : 'rounded-tl-sm'
              )}
              style={{ width: `${150 + Math.random() * 200}px` }}
            />
            <div className="h-3 w-12 bg-slate-800 rounded animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  )
}
