/**
 * Verification Page
 *
 * Email verification for new accounts.
 * Dynamic page - handles client-side auth.
 */

import { VerificationScreen } from '@/components/king-app/screens/VerificationScreen'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Verify Email',
  description: 'Verify your email address',
}

// Force dynamic rendering since this uses client auth
export const dynamic = 'force-dynamic'

export default function VerificationPage() {
  return <VerificationScreen />
}
