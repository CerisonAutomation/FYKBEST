/**
 * Magic Link Page
 *
 * Passwordless authentication via email magic link.
 * Dynamic page - handles client-side auth.
 */

import { MagicLinkScreen } from '@/components/king-app/screens/MagicLinkScreen'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Magic Link Login',
  description: 'Sign in with a magic link sent to your email',
}

// Force dynamic rendering since this uses client auth
export const dynamic = 'force-dynamic'

export default function MagicLinkPage() {
  return <MagicLinkScreen />
}
