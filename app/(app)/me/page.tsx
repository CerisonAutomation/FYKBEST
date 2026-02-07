/**
 * My Profile Page
 *
 * View and manage your own profile.
 * Accessible at /me
 * Dynamic page - requires authentication.
 */

import { ProfileScreen } from '@/components/king-app/screens/ProfileScreen'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'My Profile',
  description: 'Your profile',
}

// Force dynamic rendering since this page requires auth
export const dynamic = 'force-dynamic'

export default function MyProfilePage() {
  return <ProfileScreen />
}
