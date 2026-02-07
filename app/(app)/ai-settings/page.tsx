/**
 * AI Settings Page
 *
 * Configure AI assistant settings.
 * Dynamic page - requires authentication.
 */

import { AISettingsScreen } from '@/components/king-app/screens/AISettingsScreen'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Settings',
  description: 'Configure your AI assistant',
}

// Force dynamic rendering since this page requires auth
export const dynamic = 'force-dynamic'

export default function AISettingsPage() {
  return <AISettingsScreen />
}
