'use client'

/**
 * OAuth Buttons Component
 * Social login buttons with modern styling
 */

import { Button } from '@/components/ui/button'
import { type OAuthProvider, useAuthContext } from '@/lib/auth'
import { motion } from 'framer-motion'
import { Apple, Chrome, Facebook, Github, MessageCircle, Twitter } from 'lucide-react'
import { useState } from 'react'

const providerIcons: Record<OAuthProvider, typeof Chrome> = {
  google: Chrome,
  apple: Apple,
  facebook: Facebook,
  twitter: Twitter,
  github: Github,
  discord: MessageCircle,
  linkedin: Chrome, // fallback
  spotify: Chrome, // fallback
}

const providerStyles: Record<OAuthProvider, string> = {
  google: 'bg-white hover:bg-gray-50 text-gray-900 border border-gray-200',
  apple: 'bg-black hover:bg-gray-900 text-white border border-gray-800',
  facebook: 'bg-[#1877F2] hover:bg-[#166fe5] text-white',
  twitter: 'bg-black hover:bg-gray-900 text-white border border-gray-800',
  github: 'bg-[#24292e] hover:bg-[#1b1f23] text-white',
  discord: 'bg-[#5865F2] hover:bg-[#4752C4] text-white',
  linkedin: 'bg-[#0A66C2] hover:bg-[#0958a8] text-white',
  spotify: 'bg-[#1DB954] hover:bg-[#1aa34a] text-white',
}

interface OAuthButtonsProps {
  providers?: OAuthProvider[]
  onError?: (error: Error) => void
}

export function OAuthButtons({
  providers = ['google', 'apple', 'facebook'],
  onError,
}: OAuthButtonsProps) {
  const { signInWithOAuth } = useAuthContext()
  const [loadingProvider, setLoadingProvider] = useState<OAuthProvider | null>(null)

  const handleOAuthSignIn = async (provider: OAuthProvider) => {
    setLoadingProvider(provider)

    try {
      const { error, url } = await signInWithOAuth({ provider })

      if (error) {
        throw new Error(error.message)
      }

      if (url) {
        window.location.href = url
      }
    } catch (error) {
      onError?.(error as Error)
    } finally {
      setLoadingProvider(null)
    }
  }

  return (
    <div className="space-y-3">
      {providers.map((provider, index) => {
        const Icon = providerIcons[provider]
        const isLoading = loadingProvider === provider

        return (
          <motion.div
            key={provider}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOAuthSignIn(provider)}
              disabled={isLoading || loadingProvider !== null}
              className={`w-full h-12 font-medium transition-all duration-200 ${providerStyles[provider]}`}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-current/30 border-t-current rounded-full animate-spin" />
              ) : (
                <Icon className="w-5 h-5 mr-3" />
              )}
              Continue with {provider.charAt(0).toUpperCase() + provider.slice(1)}
            </Button>
          </motion.div>
        )
      })}
    </div>
  )
}

export function OAuthDivider() {
  return (
    <div className="relative my-6">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-white/10" />
      </div>
      <div className="relative flex justify-center text-xs uppercase">
        <span className="bg-slate-900/80 px-2 text-slate-500">Or continue with</span>
      </div>
    </div>
  )
}
