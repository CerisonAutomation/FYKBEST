/**
 * Subscription Page
 *
 * Manage your subscription and billing.
 * Dynamic page - requires authentication.
 */

import { SubscriptionScreen } from '@/components/king-app/screens/SubscriptionScreen'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Subscription',
  description: 'Manage your subscription',
}

// Force dynamic rendering since this page requires auth
export const dynamic = 'force-dynamic'

export default function SubscriptionPage() {
  return <SubscriptionScreen />
}
