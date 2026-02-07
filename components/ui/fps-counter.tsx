/**
 * FPS Counter - Real-time performance monitoring
 *
 * Provides real-time FPS monitoring for development and production
 * Uses requestAnimationFrame for accurate timing
 */

import { useEffect, useState, useRef } from 'react'

export function FPSCounter() {
  const [fps, setFps] = useState<number>(0)
  const frameCount = useRef<number>(0)
  const lastTime = useRef<number>(performance.now())

  useEffect(() => {
    let animationId: number

    const calculateFPS = () => {
      frameCount.current++
      const currentTime = performance.now()
      
      if (currentTime >= lastTime.current + 1000) {
        // Calculate FPS every second
        const currentFps = Math.round((frameCount.current * 1000) / (currentTime - lastTime.current))
        setFps(currentFps)
        
        // Reset counters
        frameCount.current = 0
        lastTime.current = currentTime
        
        // Log performance warnings
        if (currentFps < 30) {
          console.warn(`⚠️ Low FPS detected: ${currentFps}`)
        } else if (currentFps < 50) {
          console.info(`ℹ️ Moderate FPS: ${currentFps}`)
        }
      }
      
      animationId = requestAnimationFrame(calculateFPS)
    }

    animationId = requestAnimationFrame(calculateFPS)

    return () => {
      cancelAnimationFrame(animationId)
    }
  }, [])

  // Color coding based on FPS performance
  const getFPSColor = (currentFps: number) => {
    if (currentFps >= 55) return 'text-green-500'
    if (currentFps >= 40) return 'text-yellow-500'
    if (currentFps >= 25) return 'text-orange-500'
    return 'text-red-500'
  }

  return (
    <span className={`font-mono ${getFPSColor(fps)}`}>
      {fps}
    </span>
  )
}

// Hook for FPS monitoring in components
export function useFPSMonitor() {
  const [fps, setFps] = useState<number>(0)
  const frameCount = useRef<number>(0)
  const lastTime = useRef<number>(performance.now())
  const isMonitoring = useRef<boolean>(false)

  const startMonitoring = () => {
    if (isMonitoring.current) return
    
    isMonitoring.current = true
    frameCount.current = 0
    lastTime.current = performance.now()

    const calculateFPS = () => {
      frameCount.current++
      const currentTime = performance.now()
      
      if (currentTime >= lastTime.current + 1000) {
        const currentFps = Math.round((frameCount.current * 1000) / (currentTime - lastTime.current))
        setFps(currentFps)
        
        frameCount.current = 0
        lastTime.current = currentTime
      }
      
      if (isMonitoring.current) {
        requestAnimationFrame(calculateFPS)
      }
    }

    requestAnimationFrame(calculateFPS)
  }

  const stopMonitoring = () => {
    isMonitoring.current = false
  }

  return {
    fps,
    startMonitoring,
    stopMonitoring,
    isMonitoring: isMonitoring.current,
  }
}
