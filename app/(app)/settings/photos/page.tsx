/**
 * Photos Settings Page
 *
 * Manage your profile photos.
 * Dynamic page - requires authentication.
 */

import { SettingsPhotosScreen } from '@/components/king-app/screens/SettingsPhotosScreen'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Photos',
  description: 'Manage your profile photos',
}

// Force dynamic rendering since this page requires auth
export const dynamic = 'force-dynamic'

export default function PhotosSettingsPage() {
  return <SettingsPhotosScreen />
}
