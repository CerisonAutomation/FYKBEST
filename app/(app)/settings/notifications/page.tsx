/**
 * Notifications Settings Page
 *
 * Manage notification preferences.
 * Dynamic page - requires authentication.
 */

import { SettingsNotificationsScreen } from '@/components/king-app/screens/SettingsNotificationsScreen'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Notifications',
  description: 'Manage your notification preferences',
}

// Force dynamic rendering since this page requires auth
export const dynamic = 'force-dynamic'

export default function NotificationsSettingsPage() {
  return <SettingsNotificationsScreen />
}
