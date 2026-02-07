/**
 * Login Page
 *
 * Authentication page for existing users.
 * Dynamic page - handles client-side auth.
 */

import { LoginScreen } from '@/components/king-app/screens/LoginScreen'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Login',
  description: 'Sign in to your KING SOCIAL account',
}

// Force dynamic rendering since this uses client auth
export const dynamic = 'force-dynamic'

export default function LoginPage() {
  return <LoginScreen />
}
