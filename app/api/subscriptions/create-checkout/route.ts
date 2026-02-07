import { withRateLimit } from '@/lib/security/rate-limiter'
import { createClient } from '@/lib/supabase/server'
import { type NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-01-27' as any,
})

const subscriptionPlans = {
  premium: {
    name: 'Premium Membership',
    price: 2900,
    currency: 'usd',
    interval: 'month' as const,
    features: ['Unlimited messaging', 'Advanced filters', 'Verified badge'],
  },
  vip: {
    name: 'VIP Membership',
    price: 9900,
    currency: 'usd',
    interval: 'month' as const,
    features: ['Exclusive events', 'Matchmaking', 'Concierge'],
  },
}

async function createCheckoutSession(req: Request) {
  try {
    const { tier, userId } = await req.json()
    if (!tier || !userId || !subscriptionPlans[tier as keyof typeof subscriptionPlans]) {
      return NextResponse.json({ error: 'INVALID_REQUEST' }, { status: 400 })
    }

    const supabase = await createClient()
    const { data: user }: any = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single()
    if (!user) return NextResponse.json({ error: 'USER_NOT_FOUND' }, { status: 404 })

    const plan = subscriptionPlans[tier as keyof typeof subscriptionPlans]
    let customerId = user.stripe_customer_id

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { user_id: userId },
      })
      customerId = customer.id
      await (supabase.from('profiles') as any)
        .update({ stripe_customer_id: customerId })
        .eq('user_id', userId)
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      client_reference_id: userId,
      mode: 'subscription',
      line_items: [
        {
          price_data: {
            currency: plan.currency,
            product_data: { name: plan.name },
            unit_amount: plan.price,
            recurring: { interval: plan.interval },
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/subscription/cancel`,
    })

    return NextResponse.json({ sessionId: session.id, url: session.url })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const handler = await withRateLimit(createCheckoutSession, 'auth')
  return handler(req)
}

export async function GET() {
  return NextResponse.json({ plans: subscriptionPlans })
}
