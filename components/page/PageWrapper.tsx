'use client'

/**
 * PageWrapper - Production-grade page container
 * Handles animations, transitions, and layout consistency
 */

import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

interface PageWrapperProps {
  children: React.ReactNode
  className?: string
  animate?: boolean
  fullWidth?: boolean
}

const pageVariants = {
  initial: { opacity: 0, y: 10 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.23, 1, 0.32, 1],
      staggerChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: { duration: 0.2 },
  },
}

export function PageWrapper({
  children,
  className,
  animate = true,
  fullWidth = false,
}: PageWrapperProps) {
  const content = (
    <div
      className={cn(
        'min-h-[calc(100vh-4rem)]',
        !fullWidth && 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6',
        className
      )}
    >
      {children}
    </div>
  )

  if (!animate) return content

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      {content}
    </motion.div>
  )
}

// Section wrapper for staggered animations
export function PageSection({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: 1,
        y: 0,
        transition: {
          delay,
          duration: 0.5,
          ease: [0.23, 1, 0.32, 1],
        },
      }}
      className={className}
    >
      {children}
    </motion.section>
  )
}
