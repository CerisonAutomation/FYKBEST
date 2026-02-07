'use client'

/**
 * Sign Up Form Component
 * Modern sign-up form with validation and OAuth
 */

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { type OAuthProvider, useAuthContext } from '@/lib/auth'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Check, Eye, EyeOff, Loader2, Lock, Mail, User, X } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { AuthCard } from './AuthCard'
import { OAuthButtons, OAuthDivider } from './OAuthButtons'

interface SignUpFormProps {
  oauthProviders?: OAuthProvider[]
  defaultRole?: 'seeker' | 'provider'
}

// Password strength indicators
function getPasswordStrength(password: string): { score: number; label: string; color: string } {
  let score = 0
  if (password.length >= 8) score++
  if (/[A-Z]/.test(password)) score++
  if (/[a-z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++

  const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong']
  const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500']

  return {
    score,
    label: labels[score] || 'Very Weak',
    color: colors[score] || 'bg-red-500',
  }
}

export function SignUpForm({
  oauthProviders = ['google', 'apple'],
  defaultRole = 'seeker',
}: SignUpFormProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams?.get('redirectTo') || '/browse'

  const { signUp, status } = useAuthContext()

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    displayName: '',
    username: '',
    role: defaultRole,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)

  const isLoading = status === 'loading'
  const passwordStrength = getPasswordStrength(formData.password)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (passwordStrength.score < 3) {
      setError('Please choose a stronger password')
      return
    }

    if (!agreeToTerms) {
      setError('Please agree to the terms and conditions')
      return
    }

    const { error } = await signUp({
      email: formData.email,
      password: formData.password,
      metadata: {
        display_name: formData.displayName,
        username: formData.username,
        role: formData.role,
      },
      redirectTo: `${window.location.origin}/auth/callback?redirectTo=${redirectTo}`,
    })

    if (error) {
      setError(error.message)
    } else {
      setIsSuccess(true)
    }
  }

  if (isSuccess) {
    return (
      <AuthCard title="Check your email" subtitle="We've sent you a confirmation link">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-green-500/20 flex items-center justify-center">
            <Mail className="w-8 h-8 text-green-500" />
          </div>
          <p className="text-slate-400">
            We&apos;ve sent a confirmation email to{' '}
            <span className="text-white font-medium">{formData.email}</span>. Click the link in the
            email to verify your account.
          </p>
          <Button
            variant="outline"
            onClick={() => router.push('/login')}
            className="border-slate-700 text-slate-300 hover:bg-slate-800"
          >
            Go to Sign In
          </Button>
        </div>
      </AuthCard>
    )
  }

  return (
    <AuthCard
      title="Create account"
      subtitle="Join KING SOCIAL and start your journey"
      footer={
        <p className="text-center text-sm text-slate-400">
          Already have an account?{' '}
          <Link
            href={`/login?${searchParams?.toString() || ''}`}
            className="text-amber-500 hover:text-amber-400 font-medium"
          >
            Sign in
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

        {/* Display Name */}
        <div className="space-y-2">
          <Label htmlFor="displayName" className="text-slate-300">
            Display Name
          </Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <Input
              id="displayName"
              type="text"
              placeholder="Your name"
              value={formData.displayName}
              onChange={(e) => setFormData((d) => ({ ...d, displayName: e.target.value }))}
              required
              minLength={2}
              className="pl-10 bg-slate-950/50 border-slate-800 text-white placeholder:text-slate-600 focus:border-amber-500/50 focus:ring-amber-500/20"
            />
          </div>
        </div>

        {/* Email */}
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
              value={formData.email}
              onChange={(e) => setFormData((d) => ({ ...d, email: e.target.value }))}
              required
              className="pl-10 bg-slate-950/50 border-slate-800 text-white placeholder:text-slate-600 focus:border-amber-500/50 focus:ring-amber-500/20"
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-2">
          <Label htmlFor="password" className="text-slate-300">
            Password
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData((d) => ({ ...d, password: e.target.value }))}
              required
              minLength={8}
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

          {/* Password Strength */}
          {formData.password && (
            <div className="space-y-2">
              <div className="flex gap-1 h-1">
                {[1, 2, 3, 4, 5].map((level) => (
                  <div
                    key={level}
                    className={`flex-1 rounded-full transition-colors ${
                      level <= passwordStrength.score ? passwordStrength.color : 'bg-slate-800'
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs text-slate-500">
                Password strength:{' '}
                <span className={passwordStrength.color.replace('bg-', 'text-')}>
                  {passwordStrength.label}
                </span>
              </p>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                <span className={formData.password.length >= 8 ? 'text-green-500' : ''}>
                  {formData.password.length >= 8 ? (
                    <Check className="w-3 h-3 inline mr-1" />
                  ) : (
                    <X className="w-3 h-3 inline mr-1" />
                  )}
                  8+ characters
                </span>
                <span className={/[A-Z]/.test(formData.password) ? 'text-green-500' : ''}>
                  {/[A-Z]/.test(formData.password) ? (
                    <Check className="w-3 h-3 inline mr-1" />
                  ) : (
                    <X className="w-3 h-3 inline mr-1" />
                  )}
                  Uppercase
                </span>
                <span className={/[0-9]/.test(formData.password) ? 'text-green-500' : ''}>
                  {/[0-9]/.test(formData.password) ? (
                    <Check className="w-3 h-3 inline mr-1" />
                  ) : (
                    <X className="w-3 h-3 inline mr-1" />
                  )}
                  Number
                </span>
                <span className={/[^A-Za-z0-9]/.test(formData.password) ? 'text-green-500' : ''}>
                  {/[^A-Za-z0-9]/.test(formData.password) ? (
                    <Check className="w-3 h-3 inline mr-1" />
                  ) : (
                    <X className="w-3 h-3 inline mr-1" />
                  )}
                  Special char
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Role Selection */}
        <div className="space-y-2">
          <Label className="text-slate-300">I am a...</Label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setFormData((d) => ({ ...d, role: 'seeker' }))}
              className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                formData.role === 'seeker'
                  ? 'border-amber-500 bg-amber-500/10 text-amber-500'
                  : 'border-slate-800 bg-slate-950/50 text-slate-400 hover:border-slate-700'
              }`}
            >
              Seeker
            </button>
            <button
              type="button"
              onClick={() => setFormData((d) => ({ ...d, role: 'provider' }))}
              className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                formData.role === 'provider'
                  ? 'border-amber-500 bg-amber-500/10 text-amber-500'
                  : 'border-slate-800 bg-slate-950/50 text-slate-400 hover:border-slate-700'
              }`}
            >
              Provider
            </button>
          </div>
        </div>

        {/* Terms */}
        <div className="flex items-start space-x-2">
          <Checkbox
            id="terms"
            checked={agreeToTerms}
            onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
            className="mt-1"
          />
          <Label htmlFor="terms" className="text-sm text-slate-400 cursor-pointer leading-relaxed">
            I agree to the{' '}
            <Link href="/terms" className="text-amber-500 hover:text-amber-400">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-amber-500 hover:text-amber-400">
              Privacy Policy
            </Link>
          </Label>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-12 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              Create Account
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
