/**
 * Edit Profile Page
 *
 * Edit your profile information.
 * Dynamic page - requires authentication.
 */

import { EditProfileScreen } from '@/components/king-app/screens/EditProfileScreen'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Edit Profile',
  description: 'Edit your profile information',
}

// Force dynamic rendering since this page requires auth
export const dynamic = 'force-dynamic'

export default function EditProfilePage() {
  return <EditProfileScreen />
}
