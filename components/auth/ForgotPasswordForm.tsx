'use client'

/**
 * Forgot Password Form
 * Request password reset email
 */

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuthContext } from '@/lib/auth'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, Check, Loader2, Mail } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { AuthCard } from './AuthCard'

export function ForgotPasswordForm() {
  const { resetPassword, status } = useAuthContext()
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)

  const isLoading = status === 'loading'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const { error } = await resetPassword({
      email,
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })

    if (error) {
      setError(error.message)
    } else {
      setIsSuccess(true)
    }
  }

  if (isSuccess) {
    return (
      <AuthCard
        title="Check your email"
        subtitle="Password reset instructions sent"
        footer={
          <Link
            href="/login"
            className="flex items-center justify-center gap-2 text-sm text-amber-500 hover:text-amber-400"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to sign in
          </Link>
        }
      >
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-green-500/20 flex items-center justify-center">
            <Check className="w-8 h-8 text-green-500" />
          </div>
          <p className="text-slate-400">
            We&apos;ve sent password reset instructions to{' '}
            <span className="text-white font-medium">{email}</span>. Check your inbox and follow the
            link to reset your password.
          </p>
          <p className="text-sm text-slate-500">
            Didn&apos;t receive the email? Check your spam folder or{' '}
            <button
              onClick={() => setIsSuccess(false)}
              className="text-amber-500 hover:text-amber-400"
            >
              try again
            </button>
          </p>
        </div>
      </AuthCard>
    )
  }

  return (
    <AuthCard
      title="Reset password"
      subtitle="Enter your email to receive reset instructions"
      footer={
        <Link
          href="/login"
          className="flex items-center justify-center gap-2 text-sm text-amber-500 hover:text-amber-400"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to sign in
        </Link>
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

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isLoading || !email}
          className="w-full h-12 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold"
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Send Reset Instructions'}
        </Button>
      </form>
    </AuthCard>
  )
}
