'use client'

import { useEffect } from 'react'

/**
 * Service Worker Cleanup Component
 *
 * Removes stale service workers from previous Vite builds.
 * This prevents 404 errors for /@vite/* paths.
 */

export function ServiceWorkerCleanup() {
  useEffect(() => {
    if (typeof navigator !== 'undefined' && navigator.serviceWorker) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((registration) => {
          if (
            registration.scope.includes('dev-sw') ||
            registration.scope.includes('vite') ||
            registration.scope.includes('workbox')
          ) {
            console.log('[SW Cleanup] Unregistering stale service worker:', registration.scope)
            registration.unregister()
          }
        })
      })

      if (typeof caches !== 'undefined') {
        caches.keys().then((names) => {
          names.forEach((name) => {
            if (name.includes('vite') || name.includes('workbox')) {
              console.log('[SW Cleanup] Deleting cache:', name)
              caches.delete(name)
            }
          })
        })
      }
    }
  }, [])

  return null
}
