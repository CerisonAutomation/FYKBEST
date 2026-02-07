/**
 * Terms of Service Page
 *
 * Legal terms and conditions.
 * Dynamic page.
 */

import { TermsScreen } from '@/components/king-app/screens/TermsScreen'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'KING SOCIAL Terms of Service and conditions',
}

// Force dynamic rendering since this uses client components
export const dynamic = 'force-dynamic'

export default function TermsPage() {
  return <TermsScreen />
}
