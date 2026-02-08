'use client'

import { useValidateEmail, useVibrate } from '@/lib/hooks'
import { useAppStore } from '@/lib/store'
import { supabase } from '@/lib/supabase/client'
import { motion } from 'framer-motion'
import { ArrowLeft, Camera, Eye, EyeOff, Lock, Mail, Sparkles, User } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export function SignupScreen() {
  const vibrate = useVibrate()
  const validateEmail = useValidateEmail()
  const router = useRouter()
  const { role } = useAppStore()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentStep, setCurrentStep] = useState(1)

  // Responsive form state
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  // Validate current step
  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return name.trim().length >= 2 && validateEmail(email)
      case 2:
        return password.length >= 6
      default:
        return false
    }
  }

  const handleNextStep = () => {
    const stepErrors: Record<string, string> = {}

    if (currentStep === 1 && !name.trim()) {
      stepErrors.name = 'Name is required'
    }

    if (currentStep === 1 && !validateEmail(email)) {
      stepErrors.email = 'Valid email required'
    }

    if (currentStep === 2 && password.length < 6) {
      stepErrors.password = 'Password must be at least 6 characters'
    }

    setFormErrors(stepErrors)

    if (Object.keys(stepErrors).length === 0 && validateStep(currentStep + 1)) {
      setCurrentStep(currentStep + 1)
      setFormErrors({})
    }
  }

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      setFormErrors({})
    }
  }

  const handleSignup = async () => {
    if (!validateStep(2)) {
      return
    }

    setError(null)
    setIsLoading(true)
    vibrate([40, 20, 40])

    try {
      const { error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role: role || 'seeker',
          },
        },
      })

      if (authError) throw authError

      // Success - redirect to verification
      router.push('/verification')
    } catch (err: any) {
      setError(err.message || 'Failed to create account')
      vibrate([100, 50, 100])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-black to-slate-950 text-white flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900/50 backdrop-blur-lg rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl"
        >
          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-white">Create Account</h2>
              <button
                onClick={() => router.push('/login')}
                className="text-slate-400 hover:text-slate-300 transition-colors text-sm font-medium"
              >
                <ArrowLeft className="w-4 h-4 inline mr-2" />
                Back to Login
              </button>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center justify-center space-x-2">
              {[1, 2, 3].map((step) => (
                <div
                  key={step}
                  className={`w-8 h-1 rounded-full transition-colors duration-300 ${
                    currentStep >= step ? 'bg-amber-500' : 'bg-slate-700'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Step 1: Basic Info */}
          {currentStep === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center mb-4">
                  <User className="w-8 h-8 text-black" />
                </div>
                <p className="text-slate-300 text-sm">Let's start with your basic information</p>
              </div>

              {/* Name Input */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value)
                      setFormErrors((prev) => ({ ...prev, name: '' }))
                    }}
                    className={`w-full pl-12 pr-4 py-4 bg-slate-800/50 border rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all text-base sm:text-lg ${
                      formErrors.name
                        ? 'border-red-500/50 focus:ring-red-500/50'
                        : 'border-slate-700 focus:ring-amber-500/50'
                    }`}
                    aria-label="Full name"
                  />
                  {formErrors.name && (
                    <p className="text-red-400 text-xs mt-1">{formErrors.name}</p>
                  )}
                </div>
              </div>

              {/* Email Input */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      setFormErrors((prev) => ({ ...prev, email: '' }))
                    }}
                    className={`w-full pl-12 pr-4 py-4 bg-slate-800/50 border rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all text-base sm:text-lg ${
                      formErrors.email
                        ? 'border-red-500/50 focus:ring-red-500/50'
                        : 'border-slate-700 focus:ring-amber-500/50'
                    }`}
                    aria-label="Email address"
                  />
                  {formErrors.email && (
                    <p className="text-red-400 text-xs mt-1">{formErrors.email}</p>
                  )}
                </div>
              </div>

              {/* Navigation */}
              <div className="flex justify-between items-center pt-4">
                <button
                  onClick={() => router.push('/login')}
                  className="text-slate-400 hover:text-slate-300 transition-colors text-sm"
                >
                  Already have an account?
                </button>

                <button
                  onClick={handleNextStep}
                  disabled={!name.trim() || !validateEmail(email)}
                  className="px-6 py-3 bg-amber-600 hover:bg-amber-700 disabled:bg-slate-700 disabled:opacity-50 text-black font-semibold rounded-xl transition-all duration-200 flex items-center gap-2"
                >
                  Continue
                  <ArrowLeft className="w-4 h-4 rotate-180" />
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Password */}
          {currentStep === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center mb-4">
                  <Lock className="w-8 h-8 text-black" />
                </div>
                <p className="text-slate-300 text-sm">Create a secure password for your account</p>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    type="password"
                    placeholder="Min 6 characters"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      setFormErrors((prev) => ({ ...prev, password: '' }))
                    }}
                    className={`w-full pl-12 pr-14 py-4 bg-slate-800/50 border rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all text-base sm:text-lg ${
                      formErrors.password
                        ? 'border-red-500/50 focus:ring-red-500/50'
                        : 'border-slate-700 focus:ring-amber-500/50'
                    }`}
                    aria-label="Password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                  {formErrors.password && (
                    <p className="text-red-400 text-xs mt-1">{formErrors.password}</p>
                  )}
                </div>
              </div>

              {/* Password Requirements */}
              <div className="bg-slate-800/30 rounded-xl p-4 space-y-2">
                <p className="text-slate-400 text-sm mb-3">Password requirements:</p>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-4 h-4 rounded-full ${password.length >= 6 ? 'bg-green-500' : 'bg-slate-700'}`}
                    />
                    <span className="text-slate-400 text-sm">At least 6 characters</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-4 h-4 rounded-full ${/[A-Z]/.test(password) ? 'bg-green-500' : 'bg-slate-700'}`}
                    />
                    <span className="text-slate-400 text-sm">One uppercase letter</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-4 h-4 rounded-full ${/[0-9]/.test(password) ? 'bg-green-500' : 'bg-slate-700'}`}
                    />
                    <span className="text-slate-400 text-sm">One number</span>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex justify-between items-center pt-4">
                <button
                  onClick={handlePreviousStep}
                  className="text-slate-400 hover:text-slate-300 transition-colors text-sm flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>

                <button
                  onClick={handleSignup}
                  disabled={isLoading || password.length < 6}
                  className="px-6 py-3 bg-amber-600 hover:bg-amber-700 disabled:bg-slate-700 disabled:opacity-50 text-black font-semibold rounded-xl transition-all duration-200 flex items-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Create Account
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Success */}
          {currentStep === 3 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-6"
            >
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mb-6">
                <User className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Account Created! 🎉</h3>
              <p className="text-slate-300 mb-6">Check your email to verify your account</p>

              <div className="space-y-3">
                <Link
                  href="/login"
                  className="block w-full px-6 py-3 bg-amber-600 hover:bg-amber-700 text-black font-semibold rounded-xl transition-all duration-200 text-center"
                >
                  Go to Login
                </Link>
                <Link
                  href="/magic-link"
                  className="block w-full px-6 py-3 border border-slate-700 text-slate-300 hover:border-slate-600 hover:text-white rounded-xl transition-all duration-200 text-center"
                >
                  Use Magic Link
                </Link>
              </div>
            </motion.div>
          )}

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl"
            >
              <p className="text-red-400 text-sm">{error}</p>
            </motion.div>
          )}

          {/* Terms and Privacy */}
          <div className="text-center pt-6 border-t border-slate-800">
            <p className="text-slate-500 text-xs mb-2">By creating an account, you agree to our</p>
            <div className="flex justify-center gap-4">
              <Link
                href="/terms"
                className="text-slate-400 hover:text-amber-500 text-xs transition-colors"
              >
                Terms of Service
              </Link>
              <span className="text-slate-600">and</span>
              <Link
                href="/privacy"
                className="text-slate-400 hover:text-amber-500 text-xs transition-colors"
              >
                Privacy Policy
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
