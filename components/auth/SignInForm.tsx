'use client'

/**
 * Sign In Form Component
 * Modern sign-in form with email/password and OAuth
 */

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { type OAuthProvider, useAuthContext } from '@/lib/auth'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Eye, EyeOff, Loader2, Lock, Mail } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { AuthCard } from './AuthCard'
import { OAuthButtons, OAuthDivider } from './OAuthButtons'

interface SignInFormProps {
  oauthProviders?: OAuthProvider[]
  showMagicLink?: boolean
  redirectTo?: string
}

export function SignInForm({
  oauthProviders = ['google', 'apple'],
  showMagicLink = true,
  redirectTo: customRedirect,
}: SignInFormProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = customRedirect || searchParams?.get('redirectTo') || '/browse'

  const { signIn, signInWithOtp, status } = useAuthContext()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [useMagicLink, setUseMagicLink] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const isLoading = status === 'loading'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccessMessage(null)

    if (useMagicLink) {
      // Magic link sign in
      const { error } = await signInWithOtp({
        email,
        shouldCreateUser: false,
      })

      if (error) {
        setError(error.message)
      } else {
        setSuccessMessage('Check your email for the magic link!')
      }
    } else {
      // Password sign in
      const { error, mfaRequired } = await signIn({ email, password })

      if (error) {
        setError(error.message)
      } else if (mfaRequired) {
        router.push('/auth/mfa')
      } else {
        router.push(redirectTo)
      }
    }
  }

  return (
    <AuthCard
      title="Welcome back"
      subtitle="Sign in to your account to continue"
      footer={
        <p className="text-center text-sm text-slate-400">
          Don&apos;t have an account?{' '}
          <Link
            href={`/signup?${searchParams?.toString() || ''}`}
            className="text-amber-500 hover:text-amber-400 font-medium"
          >
            Sign up
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Success Message */}
        <AnimatePresence>
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm"
            >
              {successMessage}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Email Field */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-slate-300">
            Email
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="pl-10 bg-slate-950/50 border-slate-800 text-white placeholder:text-slate-600 focus:border-amber-500/50 focus:ring-amber-500/20"
            />
          </div>
        </div>

        {/* Password Field (hidden when using magic link) */}
        <AnimatePresence>
          {!useMagicLink && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-2"
            >
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-slate-300">
                  Password
                </Label>
                <Link
                  href="/auth/forgot-password"
                  className="text-xs text-amber-500 hover:text-amber-400"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required={!useMagicLink}
                  className="pl-10 pr-10 bg-slate-950/50 border-slate-800 text-white placeholder:text-slate-600 focus:border-amber-500/50 focus:ring-amber-500/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-400"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Remember Me & Magic Link Toggle */}
        <div className="flex items-center justify-between">
          {!useMagicLink && (
            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
              />
              <Label htmlFor="remember" className="text-sm text-slate-400 cursor-pointer">
                Remember me
              </Label>
            </div>
          )}

          {showMagicLink && (
            <button
              type="button"
              onClick={() => setUseMagicLink(!useMagicLink)}
              className="text-sm text-amber-500 hover:text-amber-400"
            >
              {useMagicLink ? 'Use password instead' : 'Use magic link'}
            </button>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isLoading || !email || (!useMagicLink && !password)}
          className="w-full h-12 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              {useMagicLink ? 'Send Magic Link' : 'Sign In'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      </form>

      {/* OAuth Section */}
      {oauthProviders.length > 0 && (
        <>
          <OAuthDivider />
          <OAuthButtons providers={oauthProviders} onError={(e) => setError(e.message)} />
        </>
      )}
    </AuthCard>
  )
}
