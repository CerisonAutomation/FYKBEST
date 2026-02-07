/**
 * Signup Page
 *
 * Registration page for new users.
 * Dynamic page - handles client-side auth.
 */

import { SignupScreen } from '@/components/king-app/screens/SignupScreen'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign Up',
  description: 'Create your KING SOCIAL account',
}

// Force dynamic rendering since this uses client auth
export const dynamic = 'force-dynamic'

export default function SignupPage() {
  return <SignupScreen />
}
