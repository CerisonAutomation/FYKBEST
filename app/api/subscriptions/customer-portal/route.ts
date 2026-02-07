import { withRateLimit } from '@/lib/security/rate-limiter'
import { createClient } from '@/lib/supabase/server'
import { type NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-01-27' as any,
})

async function createCustomerPortalSession(req: Request) {
  try {
    const { userId } = await req.json()
    const supabase = await createClient()
    const { data: user }: any = await supabase
      .from('profiles')
      .select('stripe_customer_id')
      .eq('user_id', userId)
      .single()

    if (!user?.stripe_customer_id)
      return NextResponse.json({ error: 'NO_STRIPE_CUSTOMER' }, { status: 404 })

    const session = await stripe.billingPortal.sessions.create({
      customer: user.stripe_customer_id,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/subscription`,
    })

    return NextResponse.json({ url: session.url })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

async function getSubscriptionStatus(req: Request) {
  try {
    const { userId } = await req.json()
    const supabase = await createClient()
    const { data: subscription }: any = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (!subscription) return NextResponse.json({ error: 'NO_SUBSCRIPTION' }, { status: 404 })

    return NextResponse.json({
      isActive: true,
      tier: (subscription as any).tier,
      expiresAt: (subscription as any).expires_at,
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const url = new URL(request.url)
  const action = url.searchParams.get('action')

  switch (action) {
    case 'portal':
      return createCustomerPortalSession(request)
    case 'status':
      return getSubscriptionStatus(request)
    default:
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  }
}
