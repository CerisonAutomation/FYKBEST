import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Environment variable validation with defaults and proper typing
const getEnvVar = (key: string, defaultValue: string = ''): string => {
  const value = process.env[key]
  if (value === undefined) {
    console.warn(`Environment variable ${key} is not set, using default: ${defaultValue}`)
    return defaultValue
  }
  return value
}

// Enhanced error handling for API routes
const handleApiError = (error: unknown, context: string) => {
  const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
  console.error(`API Error [${context}]:`, errorMessage)

  // User-friendly error message
  const userMessage = 'An error occurred. Please try again or contact support.'

  return {
    error: errorMessage,
    userMessage
  }
}

// Performance monitoring hook
import { useState, useEffect } from 'react'

const usePerformanceMonitor = () => {
  const [metrics, setMetrics] = useState({
    fps: 60,
    memory: 0,
    renderTime: 0,
  })

  useEffect(() => {
    const updateMetrics = () => {
      // Simulate performance metrics
      setMetrics(prev => ({
        ...prev,
        fps: Math.max(30, Math.min(60, prev.fps + Math.random() * 10 - 5)),
        memory: Math.max(0, prev.memory + Math.random() * 20 - 10),
        renderTime: Math.max(0, prev.renderTime + Math.random() * 5 - 2),
      }))
    }

    const interval = setInterval(updateMetrics, 1000)

    return () => {
      clearInterval(interval)
    }
  }, [])
}

// Accessibility improvements
const useAccessibility = () => {
  const [isReducedMotion, setIsReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setIsReducedMotion(mediaQuery?.matches)
  }, [])

  return { isReducedMotion }
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
