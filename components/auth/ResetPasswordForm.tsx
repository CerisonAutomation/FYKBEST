'use client'

/**
 * Reset Password Form
 * Set new password after email confirmation
 */

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuthContext } from '@/lib/auth'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, Eye, EyeOff, Loader2, Lock, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { AuthCard } from './AuthCard'

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

export function ResetPasswordForm() {
  const router = useRouter()
  const { updatePassword, status } = useAuthContext()

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)

  const isLoading = status === 'loading'
  const passwordStrength = getPasswordStrength(password)
  const passwordsMatch = password === confirmPassword && password !== ''

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    if (passwordStrength.score < 3) {
      setError('Please choose a stronger password')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    const { error } = await updatePassword({ password })

    if (error) {
      setError(error.message)
    } else {
      setIsSuccess(true)
      // Redirect after 2 seconds
      setTimeout(() => router.push('/login'), 2000)
    }
  }

  if (isSuccess) {
    return (
      <AuthCard title="Password updated" subtitle="Your password has been reset successfully">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-green-500/20 flex items-center justify-center">
            <Check className="w-8 h-8 text-green-500" />
          </div>
          <p className="text-slate-400">
            Your password has been successfully reset. You will be redirected to the login page
            shortly.
          </p>
          <Button
            onClick={() => router.push('/login')}
            className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold"
          >
            Go to Sign In
          </Button>
        </div>
      </AuthCard>
    )
  }

  return (
    <AuthCard title="Set new password" subtitle="Create a strong password for your account">
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

        {/* New Password */}
        <div className="space-y-2">
          <Label htmlFor="password" className="text-slate-300">
            New Password
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
          {password && (
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
                Strength:{' '}
                <span className={passwordStrength.color.replace('bg-', 'text-')}>
                  {passwordStrength.label}
                </span>
              </p>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-slate-300">
            Confirm Password
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <Input
              id="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className={`pl-10 pr-10 bg-slate-950/50 border text-white placeholder:text-slate-600 focus:border-amber-500/50 focus:ring-amber-500/20 ${
                confirmPassword && !passwordsMatch ? 'border-red-500/50' : 'border-slate-800'
              }`}
            />
            {confirmPassword &&
              (passwordsMatch ? (
                <Check className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
              ) : (
                <X className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-red-500" />
              ))}
          </div>
          {confirmPassword && !passwordsMatch && (
            <p className="text-xs text-red-400">Passwords do not match</p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isLoading || !password || !passwordsMatch}
          className="w-full h-12 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold"
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Update Password'}
        </Button>
      </form>
    </AuthCard>
  )
}
