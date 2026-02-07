/**
 * Forgot Password Page
 *
 * Request password reset link.
 * Dynamic page - handles client-side auth.
 */

import { ForgotPasswordForm } from '@/components/auth'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Forgot Password',
  description: 'Reset your KING SOCIAL password',
}

// Force dynamic rendering since this uses client auth
export const dynamic = 'force-dynamic'

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <ForgotPasswordForm />
    </div>
  )
}
