/**
 * Bookings Page
 *
 * Manage your bookings and appointments.
 * Dynamic page - requires authentication.
 */

import { BookingsScreen } from '@/components/king-app/screens/BookingsScreen'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Bookings',
  description: 'Your bookings and appointments',
}

// Force dynamic rendering since this page requires auth
export const dynamic = 'force-dynamic'

export default function BookingsPage() {
  return <BookingsScreen />
}
