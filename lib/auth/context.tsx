'use client'

/**
 * Auth Context Provider
 * Provides auth state and methods to the entire app
 */

import { type ReactNode, createContext, useContext } from 'react'
import { useAuth } from './hooks'
import type { AuthContextValue } from './types'

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuth()

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
}

export function useAuthContext() {
  const context = useContext(AuthContext)

  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }

  return context
}

// Re-export for convenience
export { useAuth, useIsAuthenticated, useAuthLoading, useRequireAuth } from './hooks'
export type { AuthContextValue, AuthUser, AuthError, AuthState } from './types'
