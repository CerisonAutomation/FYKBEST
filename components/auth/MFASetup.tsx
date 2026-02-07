'use client'

/**
 * MFA Setup Component
 * Enable 2FA with TOTP (Authenticator apps)
 */

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuthContext } from '@/lib/auth'
import { AnimatePresence, motion } from 'framer-motion'
import { AlertCircle, Check, Copy, Loader2, Shield, Smartphone } from 'lucide-react'
import { useEffect, useState } from 'react'
import { AuthCard } from './AuthCard'

interface MFASetupProps {
  onComplete?: () => void
  onCancel?: () => void
}

export function MFASetup({ onComplete, onCancel }: MFASetupProps) {
  const { enrollMFA, verifyMFA, listMFAFactors } = useAuthContext()

  const [step, setStep] = useState<'intro' | 'enroll' | 'verify'>('intro')
  const [factor, setFactor] = useState<{ id: string; secret: string; uri: string } | null>(null)
  const [verificationCode, setVerificationCode] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleEnroll = async () => {
    setIsLoading(true)
    setError(null)

    const { data, error } = await enrollMFA({
      factorType: 'totp',
      friendlyName: 'Authenticator App',
    })

    if (error) {
      setError(error.message)
    } else if (data) {
      setFactor({
        id: data.id,
        secret: data.totp.secret,
        uri: data.totp.uri,
      })
      setStep('verify')
    }

    setIsLoading(false)
  }

  const handleVerify = async () => {
    if (!factor || verificationCode.length !== 6) return

    setIsLoading(true)
    setError(null)

    const { error } = await verifyMFA({
      factorId: factor.id,
      code: verificationCode,
      challengeId: factor.id,
    })

    if (error) {
      setError(error.message)
    } else {
      onComplete?.()
    }

    setIsLoading(false)
  }

  const copySecret = () => {
    if (factor?.secret) {
      navigator.clipboard.writeText(factor.secret)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (step === 'intro') {
    return (
      <AuthCard title="Enable 2FA" subtitle="Add an extra layer of security to your account">
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-amber-500/10 flex items-center justify-center flex-shrink-0">
              <Shield className="w-6 h-6 text-amber-500" />
            </div>
            <div>
              <h3 className="font-semibold text-white mb-1">Why enable 2FA?</h3>
              <p className="text-sm text-slate-400">
                Two-factor authentication adds an extra layer of security by requiring a code from
                your authenticator app in addition to your password.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-amber-500/10 flex items-center justify-center flex-shrink-0">
              <Smartphone className="w-6 h-6 text-amber-500" />
            </div>
            <div>
              <h3 className="font-semibold text-white mb-1">What you&apos;ll need</h3>
              <p className="text-sm text-slate-400">
                An authenticator app like Google Authenticator, Authy, or 1Password installed on
                your phone.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onCancel}
              className="flex-1 border-slate-700 text-slate-300 hover:bg-slate-800"
            >
              Cancel
            </Button>
            <Button
              onClick={handleEnroll}
              disabled={isLoading}
              className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Continue'}
            </Button>
          </div>
        </div>
      </AuthCard>
    )
  }

  return (
    <AuthCard title="Set up authenticator" subtitle="Scan the QR code with your authenticator app">
      <div className="space-y-6">
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

        {/* QR Code */}
        <div className="flex justify-center">
          <div className="p-4 bg-white rounded-lg">
            {/* Generate QR code from the URI */}
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(factor?.uri || '')}`}
              alt="QR Code"
              className="w-48 h-48"
            />
          </div>
        </div>

        {/* Secret Key */}
        <div className="space-y-2">
          <Label className="text-slate-300">Can&apos;t scan? Enter this code:</Label>
          <div className="flex gap-2">
            <code className="flex-1 p-3 bg-slate-950 rounded-lg text-sm font-mono text-slate-400 break-all">
              {factor?.secret}
            </code>
            <Button
              variant="outline"
              size="icon"
              onClick={copySecret}
              className="border-slate-700 text-slate-400 hover:bg-slate-800"
            >
              {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Verification Code */}
        <div className="space-y-2">
          <Label htmlFor="code" className="text-slate-300">
            Enter 6-digit code
          </Label>
          <Input
            id="code"
            type="text"
            inputMode="numeric"
            maxLength={6}
            placeholder="000000"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
            className="text-center text-2xl tracking-[0.5em] bg-slate-950/50 border-slate-800 text-white placeholder:text-slate-600 focus:border-amber-500/50 focus:ring-amber-500/20"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onCancel}
            className="flex-1 border-slate-700 text-slate-300 hover:bg-slate-800"
          >
            Cancel
          </Button>
          <Button
            onClick={handleVerify}
            disabled={isLoading || verificationCode.length !== 6}
            className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Verify'}
          </Button>
        </div>
      </div>
    </AuthCard>
  )
}
