/**
 * Settings Page
 *
 * Main settings dashboard.
 * Dynamic page - requires authentication.
 */

import { SettingsScreen } from '@/components/king-app/screens/SettingsScreen'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Settings',
  description: 'Manage your account settings',
}

// Force dynamic rendering since this page requires auth
export const dynamic = 'force-dynamic'

export default function SettingsPage() {
  return <SettingsScreen />
}
