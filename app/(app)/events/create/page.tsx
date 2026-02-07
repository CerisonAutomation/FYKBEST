/**
 * Create Event Page
 *
 * Create a new party or event.
 * Dynamic page - requires authentication.
 */

import { CreatePartyScreen } from '@/components/king-app/screens/CreatePartyScreen'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Create Event',
  description: 'Host your own exclusive event',
}

// Force dynamic rendering since this page requires auth
export const dynamic = 'force-dynamic'

export default function CreateEventPage() {
  return <CreatePartyScreen />
}
