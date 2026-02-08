'use client'

import { useVibrate } from '@/lib/hooks'
import { useAppStore } from '@/lib/store'
import { supabase } from '@/lib/supabase/client'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Calendar,
  Check,
  Crown,
  Eye,
  Loader2,
  MessageCircle,
  Shield,
  Star,
  Zap,
} from 'lucide-react'
import { useState } from 'react'

const features = [
  { icon: Eye, text: 'Full photo gallery access' },
  { icon: MessageCircle, text: 'Unlimited messaging' },
  { icon: Calendar, text: 'Book appointments' },
  { icon: Shield, text: 'Priority support' },
  { icon: Zap, text: 'Advanced filters' },
  { icon: Star, text: 'Access exclusive events' },
]

export function SubscriptionScreen() {
  const vibrate = useVibrate()
  const { setSubscribed, setStage, subscribed, user } = useAppStore()
  const [loading, setLoading] = useState(false)

  const handleSubscribe = async (tier: 'premium' | 'vip') => {
    if (!user) return

    vibrate([40, 20])
    setLoading(true)

    try {
      // Create Stripe checkout session
      const response = await fetch('/api/subscriptions/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tier,
          userId: user.id,
        }),
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error?.message || 'Failed to create checkout session')
      }

      // Redirect to Stripe Checkout
      if (data.data?.url) {
        window.location.href = data.data.url
      } else {
        // Fallback for demo/dev
        const { error: subError } = await (supabase as any).from('subscriptions').insert({
          user_id: user.id,
          tier: tier,
          status: 'active',
          amount: tier === 'premium' ? 2900 : 9900,
          currency: 'USD',
          starts_at: new Date().toISOString(),
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        })

        if (subError) throw subError

        await (supabase as any)
          .from('profiles')
          .update({ subscription_tier: tier })
          .eq('user_id', user.id)

        setSubscribed(true)
        setStage('browse')
      }
    } catch (error) {
      console.error('[SubscriptionScreen] Subscription failed:', error)
      alert('Subscription failed. Please check your Stripe keys in Edge Functions.')
      console.error('[SubscriptionScreen] Subscription error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 sm:space-y-12 pb-24">
      {/* Header */}
      <div className="text-center space-y-4 pt-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-amber-500/20 to-amber-600/20 border border-amber-500/30 flex items-center justify-center shadow-2xl shadow-amber-500/10"
        >
          <Crown className="w-10 h-10 text-amber-400" />
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tighter"
        >
          UNLOCK ELITE ACCESS
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-slate-400 font-light text-base sm:text-lg max-w-md mx-auto"
        >
          Premium membership for unlimited features and exclusive connections
        </motion.p>
      </div>

      {/* Already Subscribed */}
      {subscribed && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-600/10 border border-green-600/30 rounded-2xl p-6 text-center shadow-lg shadow-green-500/10"
        >
          <Check className="w-12 h-12 text-green-400 mx-auto mb-3" />
          <h3 className="text-xl font-black text-green-400 mb-2 uppercase tracking-widest">
            YOU'RE A PREMIUM MEMBER!
          </h3>
          <p className="text-slate-400 text-sm">Enjoy unlimited access to all features</p>
        </motion.div>
      )}

      {/* Pricing Cards */}
      <div className="grid sm:grid-cols-2 gap-6 sm:gap-8">
        {/* Monthly Plan */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="p-6 sm:p-8 rounded-2xl border border-slate-800 bg-slate-900/30 space-y-6 hover:border-slate-700 transition group hover:bg-slate-900/50"
        >
          <div>
            <h3 className="text-2xl sm:text-3xl font-black mb-2 group-hover:text-white transition">
              MONTHLY
            </h3>
            <p className="text-slate-500 text-sm italic">Flexible plan • Cancel anytime</p>
          </div>
          <div>
            <p className="text-4xl sm:text-5xl font-black text-amber-400">
              $29
              <span className="text-base sm:text-lg text-slate-400 font-normal">/mo</span>
            </p>
          </div>
          <ul className="space-y-3 text-sm font-light text-slate-300">
            {features.slice(0, 5).map((feature, i) => (
              <li key={i} className="flex items-center gap-3">
                <Check className="w-4 h-4 text-amber-500 flex-shrink-0" />
                {feature.text}
              </li>
            ))}
          </ul>
          <motion.button
            onClick={() => handleSubscribe('premium')}
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 sm:py-4 bg-gradient-to-r from-amber-600 to-amber-700 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-amber-600/50 transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'SUBSCRIBE NOW'}
          </motion.button>
        </motion.div>

        {/* Annual Plan */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="relative p-6 sm:p-8 rounded-2xl border-2 border-amber-600 bg-gradient-to-br from-amber-600/10 to-amber-700/5 space-y-6 ring-1 ring-amber-600/50 shadow-2xl shadow-amber-600/10"
        >
          {/* Badge */}
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
            <span className="bg-gradient-to-r from-amber-600 to-amber-700 text-white text-[10px] sm:text-xs font-black px-4 py-1.5 rounded-full shadow-lg border border-white/10">
              BEST VALUE - SAVE 43%
            </span>
          </div>

          <div>
            <h3 className="text-2xl sm:text-3xl font-black mb-2 uppercase">ANNUAL</h3>
            <p className="text-slate-500 text-sm italic">Premium experience • Only $16.58/month</p>
          </div>
          <div>
            <p className="text-4xl sm:text-5xl font-black text-amber-400">
              $199
              <span className="text-base sm:text-lg text-slate-400 font-normal">/yr</span>
            </p>
          </div>
          <ul className="space-y-3 text-sm font-light text-slate-300">
            {features.map((feature, i) => (
              <li key={i} className="flex items-center gap-3">
                <Check className="w-4 h-4 text-amber-500 flex-shrink-0" />
                {feature.text}
              </li>
            ))}
          </ul>
          <motion.button
            onClick={() => handleSubscribe('vip')}
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 sm:py-4 bg-gradient-to-r from-amber-600 to-amber-700 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-amber-600/50 transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'GET ANNUAL PLAN'}
          </motion.button>
        </motion.div>
      </div>

      {/* Features Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-slate-900/30 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4"
      >
        <h4 className="font-black text-amber-400 text-lg">Why Subscribe?</h4>
        <div className="grid sm:grid-cols-2 gap-3 sm:gap-4 text-sm font-light text-slate-300">
          <div className="flex gap-3 items-start">
            <Check className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <span>View complete profiles without blur</span>
          </div>
          <div className="flex gap-3 items-start">
            <Check className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <span>Send unlimited messages</span>
          </div>
          <div className="flex gap-3 items-start">
            <Check className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <span>Book dates instantly</span>
          </div>
          <div className="flex gap-3 items-start">
            <Check className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <span>Priority response times</span>
          </div>
          <div className="flex gap-3 items-start">
            <Check className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <span>Access exclusive events</span>
          </div>
          <div className="flex gap-3 items-start">
            <Check className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <span>Advanced AI matching</span>
          </div>
        </div>
        <div>
          <p className="text-4xl sm:text-5xl font-black text-amber-400">
            $29
            <span className="text-base sm:text-lg text-slate-400 font-normal">/mo</span>
          </p>
        </div>
        <ul className="space-y-3 text-sm font-light text-slate-300">
          {features.slice(0, 5).map((feature, i) => (
            <li key={i} className="flex items-center gap-3">
              <Check className="w-4 h-4 text-amber-500 flex-shrink-0" />
              {feature.text}
            </li>
          ))}
        </ul>
        <motion.button
          onClick={() => handleSubscribe('premium')}
          disabled={loading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-3 sm:py-4 bg-gradient-to-r from-amber-600 to-amber-700 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-amber-600/50 transition flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'SUBSCRIBE NOW'}
        </motion.button>
      </motion.div>

      {/* Annual Plan */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}
        className="relative p-6 sm:p-8 rounded-2xl border-2 border-amber-600 bg-gradient-to-br from-amber-600/10 to-amber-700/5 space-y-6 ring-1 ring-amber-600/50 shadow-2xl shadow-amber-600/10"
      >
        {/* Badge */}
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <span className="bg-gradient-to-r from-amber-600 to-amber-700 text-white text-[10px] sm:text-xs font-black px-4 py-1.5 rounded-full shadow-lg border border-white/10">
            BEST VALUE - SAVE 43%
          </span>
        </div>

        <div>
          <h3 className="text-2xl sm:text-3xl font-black mb-2 uppercase">ANNUAL</h3>
          <p className="text-slate-500 text-sm italic">Premium experience • Only $16.58/month</p>
        </div>
        <div>
          <p className="text-4xl sm:text-5xl font-black text-amber-400">
            $199
            <span className="text-base sm:text-lg text-slate-400 font-normal">/yr</span>
          </p>
        </div>
        <ul className="space-y-3 text-sm font-light text-slate-300">
          {features.map((feature, i) => (
            <li key={i} className="flex items-center gap-3">
              <Check className="w-4 h-4 text-amber-500 flex-shrink-0" />
              {feature.text}
            </li>
          ))}
        </ul>
        <motion.button
          onClick={() => handleSubscribe('vip')}
          disabled={loading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-3 sm:py-4 bg-gradient-to-r from-amber-600 to-amber-700 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-amber-600/50 transition flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'GET ANNUAL PLAN'}
        </motion.button>
      </motion.div>
    </div>
  )
}
