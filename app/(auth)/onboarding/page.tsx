/**
 * Onboarding Page
 *
 * New user onboarding flow.
 * Dynamic page - handles client-side auth.
 */

import { OnboardingScreen } from '@/components/king-app/screens/OnboardingScreen'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Welcome',
  description: 'Complete your profile setup',
}

// Force dynamic rendering since this uses client auth
export const dynamic = 'force-dynamic'

export default function OnboardingPage() {
  return <OnboardingScreen />
}
