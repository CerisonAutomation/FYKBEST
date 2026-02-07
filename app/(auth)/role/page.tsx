/**
 * Role Selection Page
 *
 * Choose between seeker and provider roles.
 * Dynamic page - handles client-side auth.
 */

import { RoleScreen } from '@/components/king-app/screens/RoleScreen'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Select Role',
  description: 'Choose how you want to use KING SOCIAL',
}

// Force dynamic rendering since this uses client auth
export const dynamic = 'force-dynamic'

export default function RolePage() {
  return <RoleScreen />
}
