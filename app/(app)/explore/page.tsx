/**
 * Explore Page
 *
 * Discover new content and profiles.
 * Dynamic page - requires authentication.
 */

import { ExploreScreen } from '@/components/king-app/screens/ExploreScreen'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Explore',
  description: 'Discover new content',
}

// Force dynamic rendering since this page requires auth
export const dynamic = 'force-dynamic'

export default function ExplorePage() {
  return <ExploreScreen />
}
