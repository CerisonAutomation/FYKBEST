/**
 * Favorites Page
 *
 * View your favorited profiles.
 * Dynamic page - requires authentication.
 */

import { FavoritesScreen } from '@/components/king-app/screens/FavoritesScreen'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Favorites',
  description: 'Your favorite profiles',
}

// Force dynamic rendering since this page requires auth
export const dynamic = 'force-dynamic'

export default function FavoritesPage() {
  return <FavoritesScreen />
}
