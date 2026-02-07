/**
 * Privacy Settings Page
 *
 * Manage privacy and security settings.
 * Dynamic page - requires authentication.
 */

import { SettingsPrivacyScreen } from '@/components/king-app/screens/SettingsPrivacyScreen'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy & Security',
  description: 'Manage your privacy settings',
}

// Force dynamic rendering since this page requires auth
export const dynamic = 'force-dynamic'

export default function PrivacySettingsPage() {
  return <SettingsPrivacyScreen />
}
