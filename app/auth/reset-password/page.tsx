'use client'

import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

// Dynamically import the form to avoid SSR issues
const ResetPasswordForm = dynamic(
  () => import('@/components/auth').then((mod) => mod.ResetPasswordForm),
  { ssr: false }
)

// Dynamically import auth client
const getAuthClient = async () => {
  const { createAuthClient } = await import('@/lib/auth/client')
  return createAuthClient()
}

export default function ResetPasswordPage() {
  const router = useRouter()
  const [isValid, setIsValid] = useState<boolean | null>(null)

  useEffect(() => {
    // Check if we have a valid recovery token in the URL
    const checkSession = async () => {
      try {
        const authClient = await getAuthClient()
        const {
          data: { session },
        } = await authClient.auth.getSession()

        // If no session with recovery type, redirect to login
        if (session) {
          setIsValid(true)
        } else {
          setIsValid(false)
          // Wait a bit before redirecting so user sees the message
          setTimeout(() => router.push('/login'), 2000)
        }
      } catch (error) {
        console.error('Error checking session:', error)
        setIsValid(false)
        setTimeout(() => router.push('/login'), 2000)
      }
    }

    checkSession()
  }, [router])

  if (isValid === null) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Verifying reset link...</p>
        </div>
      </div>
    )
  }

  if (isValid === false) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
            <span className="text-2xl text-red-500">!</span>
          </div>
          <h1 className="text-xl font-bold text-white mb-2">Invalid or Expired Link</h1>
          <p className="text-slate-400 mb-4">
            This password reset link is invalid or has expired. Please request a new one.
          </p>
          <button
            onClick={() => router.push('/auth/forgot-password')}
            className="text-amber-500 hover:text-amber-400"
          >
            Request New Link
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <ResetPasswordForm />
    </div>
  )
}
