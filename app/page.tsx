/**
 * High-Converting Landing Page - 2025 Best Practices
 *
 * Optimized for Core Web Vitals, conversion rates, and modern UX patterns.
 * Implements server-side rendering with strategic client-side hydration.
 */

import { ArrowRight, Calendar, Crown, MessageCircle, Shield, Star, Users, Zap, Lock, Sparkles } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Suspense } from 'react'

// Optimized metadata for SEO and social sharing
export const metadata: Metadata = {
  title: 'KING SOCIAL | Premium Social Network - Join 50K+ Verified Members',
  description:
    'Elite social marketplace for discerning individuals. Connect with verified companions, discover exclusive events. Join 50K+ members worldwide.',
  keywords: ['premium social network', 'elite dating', 'verified companions', 'exclusive events', 'luxury social'],
  openGraph: {
    title: 'KING SOCIAL | Premium Social Network',
    description: 'Join 50K+ verified members in the world\'s most exclusive social network.',
    type: 'website',
    locale: 'en_US',
    siteName: 'KING SOCIAL',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KING SOCIAL | Premium Social Network',
    description: 'Join 50K+ verified members worldwide.',
  },
  alternates: {
    canonical: '/',
  },
}

// Force dynamic rendering since this checks auth
export const dynamic = 'force-dynamic'

export default async function LandingPage() {
  // Note: Auth check is done in middleware, this is just the landing view
  // If user is authenticated, middleware will redirect to /browse

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-black to-slate-950 text-white overflow-x-hidden">
      {/* Optimized Hero Section with conversion focus */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-900/20 via-transparent to-transparent animate-pulse" />

        {/* Floating elements for visual interest */}
        <div className="absolute top-20 left-10 w-2 h-2 bg-amber-500 rounded-full animate-ping" />
        <div className="absolute top-40 right-20 w-3 h-3 bg-amber-400 rounded-full animate-pulse" />
        <div className="absolute bottom-10 left-1/4 w-2 h-2 bg-amber-600 rounded-full animate-bounce" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Trust badges above headline */}
          <div className="flex flex-wrap justify-center gap-4 mb-6 text-sm text-slate-400">
            <div className="flex items-center gap-1">
              <Shield className="w-4 h-4 text-green-500" />
              <span>100% Verified</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4 text-blue-500" />
              <span>50K+ Members</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-amber-500" />
              <span>4.9 Rating</span>
            </div>
          </div>

          {/* Main headline with gradient and animation */}
          <h1 className="text-5xl md:text-7xl font-black mb-6 animate-fade-in-up">
            <span className="bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 bg-clip-text text-transparent animate-gradient">
              KING SOCIAL
            </span>
            <div className="text-2xl md:text-3xl mt-2 text-slate-300">
              Where <span className="text-amber-500">Excellence</span> Meets Connection
            </div>
          </h1>

          {/* Enhanced value proposition */}
          <p className="text-xl md:text-2xl text-slate-400 mb-8 max-w-3xl mx-auto leading-relaxed">
            Join the world's most exclusive social network. Connect with <span className="text-amber-500 font-semibold">verified companions</span>,
            attend <span className="text-amber-500 font-semibold">elite events</span>, and experience <span className="text-amber-500 font-semibold">premium connections</span>.
          </p>

          {/* Social proof counter */}
          <div className="flex justify-center gap-8 mb-8 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">50K+</div>
              <div className="text-slate-500">Active Members</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">100+</div>
              <div className="text-slate-500">Cities</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">500+</div>
              <div className="text-slate-500">Events</div>
            </div>
          </div>

          {/* Primary and secondary CTAs with urgency */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-4">
            <Link
              href="/signup"
              className="group relative px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-bold rounded-xl text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-amber-500/25"
            >
              <span className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Get Started Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 rounded-xl bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
            </Link>
            <Link
              href="/about"
              className="px-8 py-4 border border-slate-700 hover:bg-slate-800 hover:border-amber-500/50 text-white font-medium rounded-xl text-lg transition-all duration-300"
            >
              Learn More
            </Link>
          </div>

          {/* Urgency message */}
          <p className="text-sm text-slate-500 animate-pulse">
            ⚡ Limited time: Get premium features free for first month
          </p>
        </div>
      </section>

      {/* Enhanced Features Section with benefits focus */}
      <section className="py-20 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why <span className="text-amber-500">Elite Members</span> Choose KING SOCIAL
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Experience the difference that premium verification and exclusive features make
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="group p-6 bg-slate-900/50 rounded-2xl border border-slate-800 hover:border-amber-500/30 transition-all duration-300 hover:transform hover:scale-105">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500/20 to-green-600/20 flex items-center justify-center mb-4 group-hover:from-green-500/30 group-hover:to-green-600/30 transition-colors">
                <Shield className="w-6 h-6 text-green-500" />
              </div>
              <h3 className="text-xl font-bold mb-2">100% Verified Profiles</h3>
              <p className="text-slate-400 mb-4">
                Every member undergoes rigorous ID verification and background checks
              </p>
              <ul className="space-y-2 text-sm text-slate-500">
                <li className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-green-500" />
                  Bank-level security
                </li>
                <li className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-green-500" />
                  Instant verification
                </li>
              </ul>
            </div>

            <div className="group p-6 bg-slate-900/50 rounded-2xl border border-slate-800 hover:border-amber-500/30 transition-all duration-300 hover:transform hover:scale-105">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center mb-4 group-hover:from-blue-500/30 group-hover:to-blue-600/30 transition-colors">
                <Users className="w-6 h-6 text-blue-500" />
              </div>
              <h3 className="text-xl font-bold mb-2">Elite Community</h3>
              <p className="text-slate-400 mb-4">
                Join curated network of successful, verified individuals
              </p>
              <ul className="space-y-2 text-sm text-slate-500">
                <li className="flex items-center gap-2">
                  <Crown className="w-4 h-4 text-amber-500" />
                  Premium members only
                </li>
                <li className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-blue-500" />
                  4.9/5 average rating
                </li>
              </ul>
            </div>

            <div className="group p-6 bg-slate-900/50 rounded-2xl border border-slate-800 hover:border-amber-500/30 transition-all duration-300 hover:transform hover:scale-105">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/20 flex items-center justify-center mb-4 group-hover:from-amber-500/30 group-hover:to-amber-600/30 transition-colors">
                <Star className="w-6 h-6 text-amber-500" />
              </div>
              <h3 className="text-xl font-bold mb-2">Premium Experiences</h3>
              <p className="text-slate-400 mb-4">
                Access exclusive events and luxury lifestyle opportunities
              </p>
              <ul className="space-y-2 text-sm text-slate-500">
                <li className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-amber-500" />
                  500+ exclusive events
                </li>
                <li className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-amber-500" />
                  Priority messaging
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* High-Conversion CTA Section with social proof */}
      <section className="py-20 border-t border-slate-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-transparent" />

        <div className="relative max-w-4xl mx-auto px-4 text-center">
          {/* Recent activity social proof */}
          <div className="mb-8">
            <p className="text-sm text-slate-500 mb-2">RECENT ACTIVITY</p>
            <div className="flex flex-wrap justify-center gap-2">
              <span className="px-3 py-1 bg-slate-800 rounded-full text-xs text-slate-400">
                ✨ Sarah joined 2 min ago
              </span>
              <span className="px-3 py-1 bg-slate-800 rounded-full text-xs text-slate-400">
                🎉 Event in NYC tonight
              </span>
              <span className="px-3 py-1 bg-slate-800 rounded-full text-xs text-slate-400">
                💬 127 new messages
              </span>
            </div>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Join the <span className="text-amber-500">Elite</span>?
          </h2>
          <p className="text-slate-400 mb-8 text-lg">
            Create your profile in 2 minutes and start connecting with verified members today.
          </p>

          {/* Risk reversal and guarantees */}
          <div className="flex flex-wrap justify-center gap-4 mb-8 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-green-500" />
              <span>100% Privacy Protected</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-blue-500" />
              <span>Instant Setup</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-500" />
              <span>Free Premium Trial</span>
            </div>
          </div>

          <Link
            href="/signup"
            className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-bold rounded-xl text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-amber-500/25"
          >
            <Sparkles className="w-5 h-5" />
            Create Free Account
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>

          <p className="text-sm text-slate-500 mt-4">
            ⚡ Limited offer: First month premium features free • No credit card required
          </p>
        </div>
      </section>

      {/* Footer trust section */}
      <footer className="py-8 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-slate-500">
          <p>
            © 2025 KING SOCIAL. Trusted by 50K+ elite members worldwide.
            <Link href="/privacy" className="hover:text-amber-500 ml-2">Privacy</Link> •
            <Link href="/terms" className="hover:text-amber-500 ml-2">Terms</Link>
          </p>
        </div>
      </footer>
    </div>
  )
}
