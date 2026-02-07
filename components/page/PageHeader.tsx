'use client'

/**
 * PageHeader - Consistent page header component
 * Handles title, description, breadcrumbs, and actions
 */

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { ArrowLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'

interface Breadcrumb {
  label: string
  href?: string
}

interface PageHeaderProps {
  title: string
  description?: string
  breadcrumbs?: Breadcrumb[]
  backHref?: string
  actions?: React.ReactNode
  className?: string
  centered?: boolean
}

export function PageHeader({
  title,
  description,
  breadcrumbs,
  backHref,
  actions,
  className,
  centered = false,
}: PageHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('mb-8', centered && 'text-center', className)}
    >
      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex items-center gap-2 text-sm text-slate-400 mb-4">
          {breadcrumbs.map((crumb, index) => (
            <div key={index} className="flex items-center gap-2">
              {index > 0 && <ChevronRight className="w-4 h-4" />}
              {crumb.href ? (
                <Link href={crumb.href} className="hover:text-white transition-colors">
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-white">{crumb.label}</span>
              )}
            </div>
          ))}
        </nav>
      )}

      {/* Back Button */}
      {backHref && !breadcrumbs && (
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="mb-4 -ml-2 text-slate-400 hover:text-white"
        >
          <Link href={backHref}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Link>
        </Button>
      )}

      {/* Title Row */}
      <div
        className={cn(
          'flex items-start gap-4',
          centered && 'flex-col items-center',
          actions && 'justify-between'
        )}
      >
        <div className={cn(centered && 'text-center')}>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{title}</h1>
          {description && <p className="text-slate-400 text-lg max-w-2xl">{description}</p>}
        </div>

        {actions && <div className="flex items-center gap-3 flex-shrink-0">{actions}</div>}
      </div>
    </motion.div>
  )
}
