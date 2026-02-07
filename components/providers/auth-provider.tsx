'use client'

import { useAuth } from '@/lib/hooks'
import type { User } from '@/types/app'
import { type ReactNode, createContext, useContext, useEffect, useState } from 'react'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>
  signUp: (
    email: string,
    password: string,
    metadata: Record<string, unknown>
  ) => Promise<{ error: Error | null }>
  signOut: () => Promise<void>
  signInWithOAuth: (provider: 'google' | 'apple' | 'facebook') => Promise<void>
  sendMagicLink: (email: string) => Promise<{ error: Error | null }>
  resetPassword: (email: string) => Promise<{ error: Error | null }>
  updatePassword: (password: string) => Promise<{ error: Error | null }>
  refreshSession: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuth()
  const [isClient, setIsClient] = useState(false)

  // Fix hydration mismatch by only rendering auth-dependent content on client
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Provide default values during SSR to prevent hydration mismatch
  const contextValue: AuthContextType = {
    user: isClient ? auth.user : null,
    isLoading: isClient ? auth.isLoading : true,
    isAuthenticated: isClient ? auth.isAuthenticated : false,
    signIn: auth.signIn,
    signUp: auth.signUp,
    signOut: auth.signOut,
    signInWithOAuth: auth.signInWithOAuth,
    sendMagicLink: auth.sendMagicLink,
    resetPassword: auth.resetPassword,
    updatePassword: auth.updatePassword,
    refreshSession: auth.refreshSession,
  }

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}

export function useAuthContext() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }
  return context
}
