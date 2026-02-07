/**
 * Events/Parties Page
 *
 * Browse and manage events.
 * Dynamic page - requires authentication.
 */

import { EventsPage } from '@/features/events/pages/EventsPage'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Events',
  description: 'Discover and join exclusive events',
}

// Force dynamic rendering since this page requires auth
export const dynamic = 'force-dynamic'

export default function EventsRoutePage() {
  return <EventsPage />
}
