/**
 * Messages Page
 *
 * Chat and messaging interface.
 * Dynamic page - requires authentication.
 */

import { MessagesScreen } from '@/components/king-app/screens/MessagesScreen'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Messages',
  description: 'Your conversations',
}

// Force dynamic rendering since this page requires auth
export const dynamic = 'force-dynamic'

export default function MessagesPage() {
  return <MessagesScreen />
}
