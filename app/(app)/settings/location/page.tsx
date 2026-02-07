/**
 * Location Settings Page
 *
 * Manage your location preferences.
 * Dynamic page - requires authentication.
 */

import { SettingsLocationScreen } from '@/components/king-app/screens/SettingsLocationScreen'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Location',
  description: 'Manage your location settings',
}

// Force dynamic rendering since this page requires auth
export const dynamic = 'force-dynamic'

export default function LocationSettingsPage() {
  return <SettingsLocationScreen />
}
