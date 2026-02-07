'use client'

/**
 * EmptyState - Consistent empty state component
 * For pages with no data to display
 */

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description?: string
  action?: {
    label: string
    onClick?: () => void
    href?: string
  }
  secondaryAction?: {
    label: string
    onClick?: () => void
    href?: string
  }
  className?: string
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  secondaryAction,
  className,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn('flex flex-col items-center justify-center py-16 px-4 text-center', className)}
    >
      <div className="w-20 h-20 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-6">
        <Icon className="w-10 h-10 text-slate-600" />
      </div>

      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>

      {description && <p className="text-slate-400 max-w-md mb-6">{description}</p>}

      <div className="flex flex-col sm:flex-row gap-3">
        {action && (
          <Button
            onClick={action.onClick}
            className="bg-amber-500 hover:bg-amber-600 text-black font-semibold"
          >
            {action.label}
          </Button>
        )}

        {secondaryAction && (
          <Button
            variant="outline"
            onClick={secondaryAction.onClick}
            className="border-slate-700 text-slate-300 hover:bg-slate-800"
          >
            {secondaryAction.label}
          </Button>
        )}
      </div>
    </motion.div>
  )
}
