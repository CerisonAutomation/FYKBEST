/**
 * Right Now Page
 *
 * Find companions available right now.
 * Dynamic page - requires authentication.
 */

import { RightNowPage } from '@/features/right-now/pages/RightNowPage'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Right Now',
  description: 'Find companions available right now',
}

// Force dynamic rendering since this page requires auth
export const dynamic = 'force-dynamic'

export default function RightNowRoutePage() {
  return <RightNowPage />
}
