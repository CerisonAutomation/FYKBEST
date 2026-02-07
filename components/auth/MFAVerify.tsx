'use client'

/**
 * MFA Verify Component
 * Enter TOTP code during sign in
 */

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuthContext } from '@/lib/auth'
import { AnimatePresence, motion } from 'framer-motion'
import { AlertCircle, Loader2, Shield } from 'lucide-react'
import { useState } from 'react'
import { AuthCard } from './AuthCard'

interface MFAVerifyProps {
  factorId: string
  onVerify: () => void
  onCancel?: () => void
}

export function MFAVerify({ factorId, onVerify, onCancel }: MFAVerifyProps) {
  const { challengeMFA, verifyMFA } = useAuthContext()

  const [code, setCode] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (code.length !== 6) return

    setIsLoading(true)
    setError(null)

    // First challenge the factor
    const { data: challengeData, error: challengeError } = await challengeMFA({ factorId })

    if (challengeError || !challengeData) {
      setError(challengeError?.message || 'Failed to challenge MFA')
      setIsLoading(false)
      return
    }

    // Then verify the code
    const { error: verifyError } = await verifyMFA({
      factorId,
      code,
      challengeId: challengeData.id,
    })

    if (verifyError) {
      setError(verifyError.message)
    } else {
      onVerify()
    }

    setIsLoading(false)
  }

  return (
    <AuthCard
      title="Two-Factor Authentication"
      subtitle="Enter the code from your authenticator app"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center">
            <Shield className="w-8 h-8 text-amber-500" />
          </div>
        </div>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2"
            >
              <AlertCircle className="w-4 h-4" />
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Code Input */}
        <div className="space-y-2">
          <Label htmlFor="code" className="text-slate-300 text-center block">
            6-digit authentication code
          </Label>
          <Input
            id="code"
            type="text"
            inputMode="numeric"
            maxLength={6}
            placeholder="000000"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
            autoFocus
            className="text-center text-3xl tracking-[0.5em] h-16 bg-slate-950/50 border-slate-800 text-white placeholder:text-slate-600 focus:border-amber-500/50 focus:ring-amber-500/20"
          />
        </div>

        {/* Help text */}
        <p className="text-center text-sm text-slate-500">
          Open your authenticator app to view your code.
        </p>

        {/* Actions */}
        <div className="flex gap-3">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1 border-slate-700 text-slate-300 hover:bg-slate-800"
            >
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            disabled={isLoading || code.length !== 6}
            className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Verify'}
          </Button>
        </div>
      </form>
    </AuthCard>
  )
}
