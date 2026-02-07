/**
 * Browse Page
 *
 * Main browsing interface for profiles.
 * Dynamic page - requires authentication.
 */

import { BrowseScreen } from '@/components/king-app/screens/BrowseScreen'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Browse',
  description: 'Discover profiles on KING SOCIAL',
}

// Force dynamic rendering since this page requires auth
export const dynamic = 'force-dynamic'

export default function BrowsePage() {
  return <BrowseScreen />
}
