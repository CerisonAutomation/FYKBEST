import { createAdminClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-01-27' as any,
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

// Track processed events for idempotency (in-memory, use Redis in production)
const processedEvents = new Set<string>()
const MAX_CACHE_SIZE = 1000

/**
 * Check if an event has already been processed
 * Implements idempotency to prevent duplicate processing
 */
function isEventProcessed(eventId: string): boolean {
  return processedEvents.has(eventId)
}

/**
 * Mark an event as processed
 */
function markEventProcessed(eventId: string): void {
  // Prevent unbounded growth
  if (processedEvents.size >= MAX_CACHE_SIZE) {
    const firstKey = processedEvents.values().next().value
    if (firstKey) {
      processedEvents.delete(firstKey)
    }
  }
  processedEvents.add(eventId)
}

export async function POST(req: Request) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`)
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
  }

  // Idempotency check
  if (isEventProcessed(event.id)) {
    console.log(`Event ${event.id} already processed, skipping`)
    return NextResponse.json({ received: true, idempotent: true })
  }

  const supabase = await createAdminClient()

  try {
    // Atomic Subscription Handling
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.client_reference_id
        const customerId = session.customer as string
        const subscriptionId = session.subscription as string

        if (!userId) {
          console.error('No user ID in checkout session')
          break
        }

        // Check if already processed via metadata or database
        const { data: existingSub } = await supabase
          .from('subscriptions')
          .select('id')
          .eq('stripe_subscription_id', subscriptionId)
          .single()

        if (existingSub) {
          console.log(`Subscription ${subscriptionId} already exists, skipping`)
          break
        }

        const subscription = await stripe.subscriptions.retrieve(subscriptionId)
        const tier = session.metadata?.tier || 'premium'

        // 1. Create subscription record
        const { error: subError } = await supabase.from('subscriptions').insert({
          user_id: userId,
          tier: tier as any,
          status: 'active',
          amount: session.amount_total || 0,
          currency: session.currency,
          starts_at: new Date(subscription.current_period_start * 1000).toISOString(),
          expires_at: new Date(subscription.current_period_end * 1000).toISOString(),
          stripe_subscription_id: subscriptionId,
          stripe_customer_id: customerId,
          stripe_event_id: event.id, // Track event for idempotency
        })

        if (subError) {
          console.error('Failed to create subscription:', subError)
          throw subError
        }

        // 2. Update user profile
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ subscription_tier: tier } as any)
          .eq('user_id', userId)

        if (profileError) {
          console.error('Failed to update profile:', profileError)
        }

        break
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice
        const subscriptionId = invoice.subscription as string

        if (!subscriptionId) break

        // Check if this specific invoice was already processed
        // @ts-ignore - Table may not exist in types
        const { data: existingInvoice } = await (supabase as any)
          .from('subscription_invoices')
          .select('id')
          .eq('stripe_invoice_id', invoice.id)
          .single()

        if (existingInvoice) {
          console.log(`Invoice ${invoice.id} already processed`)
          break
        }

        const subscription = await stripe.subscriptions.retrieve(subscriptionId)

        const { error: updateError } = await supabase
          .from('subscriptions')
          .update({
            status: 'active',
            expires_at: new Date(subscription.current_period_end * 1000).toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_subscription_id', subscriptionId)

        if (updateError) {
          console.error('Failed to update subscription:', updateError)
        }

        // Record the invoice for idempotency
        // @ts-ignore - Table may not exist in types
        await (supabase.from('subscription_invoices') as any).insert({
          stripe_invoice_id: invoice.id,
          stripe_subscription_id: subscriptionId,
          amount: invoice.amount_paid,
          currency: invoice.currency,
          status: invoice.status,
          stripe_event_id: event.id,
        })

        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const subscriptionId = subscription.id

        const { data: subData } = await supabase
          .from('subscriptions')
          .select('user_id')
          .eq('stripe_subscription_id', subscriptionId)
          .single()

        if (subData) {
          // @ts-ignore - Status type mismatch
          const { error: subError } = await (supabase.from('subscriptions') as any)
            .update({
              status: 'expired',
              updated_at: new Date().toISOString(),
            })
            .eq('stripe_subscription_id', subscriptionId)

          if (subError) {
            console.error('Failed to update subscription status:', subError)
          }

          // @ts-ignore - Table not in generated types yet
          const { error: profileError } = await (supabase.from('profiles') as any)
            .update({ subscription_tier: 'free' })
            .eq('user_id', subData.user_id)

          if (profileError) {
            console.error('Failed to update profile tier:', profileError)
          }
        }

        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        const subscriptionId = invoice.subscription as string

        if (subscriptionId) {
          // @ts-ignore - Status type mismatch
          await (supabase.from('subscriptions') as any)
            .update({
              status: 'past_due',
              updated_at: new Date().toISOString(),
            })
            .eq('stripe_subscription_id', subscriptionId)
        }

        break
      }
    }

    // Mark event as processed
    markEventProcessed(event.id)

    return NextResponse.json({ received: true, eventId: event.id })
  } catch (error: any) {
    console.error('Webhook processing error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed', message: error.message },
      { status: 500 }
    )
  }
}
