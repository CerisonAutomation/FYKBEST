'use client'

/**
 * Auth Hooks - Comprehensive React hooks for Supabase Auth
 * Includes MFA, OAuth, password reset, and session management
 */

import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import { authClient, getSession, onAuthStateChange } from './client'
import type {
  AuthError,
  AuthErrorCode,
  AuthFactor,
  AuthState,
  AuthUser,
  MFAChallengeOptions,
  MFAEnrollOptions,
  MFAUnenrollOptions,
  MFAVerifyOptions,
  ResetPasswordOptions,
  SignInOptions,
  SignInWithOAuthOptions,
  SignInWithOtpOptions,
  SignUpOptions,
  TOTPData,
  UpdatePasswordOptions,
} from './types'

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN AUTH HOOK
// ═══════════════════════════════════════════════════════════════════════════════

const initialState: AuthState = {
  status: 'idle',
  user: null,
  session: null,
  error: null,
}

function mapSupabaseUser(user: unknown): AuthUser | null {
  if (!user) return null
  const u = user as Record<string, unknown>

  return {
    id: String(u.id),
    email: String(u.email),
    emailConfirmed: u.email_confirmed_at != null,
    phone: u.phone ? String(u.phone) : undefined,
    phoneConfirmed: u.phone_confirmed_at != null,
    createdAt: String(u.created_at),
    lastSignInAt: String(u.last_sign_in_at),
    appMetadata: (u.app_metadata as Record<string, unknown>) || {},
    userMetadata: (u.user_metadata as Record<string, unknown>) || {},
    identities: (u.identities as AuthUser['identities']) || [],
    factors: (u.factors as AuthFactor[]) || [],
  }
}

function mapSupabaseSession(session: unknown) {
  if (!session) return null
  const s = session as Record<string, unknown>
  return {
    accessToken: s.access_token as string,
    refreshToken: s.refresh_token as string,
    expiresAt: s.expires_at as number,
    expiresIn: s.expires_in as number,
    tokenType: s.token_type as string,
  }
}

function mapAuthError(error: unknown): AuthError {
  const e = error as { code?: string; message: string; status?: number }

  const codeMap: Record<string, AuthErrorCode> = {
    invalid_credentials: 'invalid_credentials',
    user_not_found: 'user_not_found',
    email_not_confirmed: 'email_not_confirmed',
    email_taken: 'email_taken',
    weak_password: 'weak_password',
    otp_expired: 'otp_expired',
    mfa_verification_failed: 'mfa_required',
    mfa_challenge_expired: 'mfa_challenge_expired',
    unexpected_failure: 'unknown_error',
    over_email_send_rate_limit: 'rate_limit',
  }

  return {
    code: codeMap[e.code || ''] || 'unknown_error',
    message: e.message,
    status: e.status,
  }
}

export function useAuth() {
  const router = useRouter()
  const [state, setState] = useState<AuthState>(initialState)
  const mountedRef = useRef(true)

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      setState((s) => ({ ...s, status: 'loading' }))

      try {
        const { session, error } = await getSession()

        if (error) throw error

        if (mountedRef.current) {
          setState({
            status: session ? 'authenticated' : 'unauthenticated',
            user: mapSupabaseUser(session?.user),
            session: mapSupabaseSession(session),
            error: null,
          })
        }
      } catch (error) {
        if (mountedRef.current) {
          setState({
            status: 'error',
            user: null,
            session: null,
            error: mapAuthError(error),
          })
        }
      }
    }

    initAuth()

    // Subscribe to auth changes
    const {
      data: { subscription },
    } = onAuthStateChange((event, session) => {
      if (!mountedRef.current) return

      const s = session as Record<string, unknown> | null

      switch (event) {
        case 'SIGNED_IN':
          setState({
            status: 'authenticated',
            user: mapSupabaseUser(s?.user),
            session: mapSupabaseSession(s),
            error: null,
          })
          break
        case 'SIGNED_OUT':
          setState({
            status: 'unauthenticated',
            user: null,
            session: null,
            error: null,
          })
          break
        case 'TOKEN_REFRESHED':
          setState((prev) => ({
            ...prev,
            session: mapSupabaseSession(s),
          }))
          break
        case 'USER_UPDATED':
          setState((prev) => ({
            ...prev,
            user: mapSupabaseUser(s?.user),
          }))
          break
      }
    })

    return () => {
      mountedRef.current = false
      subscription.unsubscribe()
    }
  }, [])

  // ═══════════════════════════════════════════════════════════════════════════
  // AUTH METHODS
  // ═══════════════════════════════════════════════════════════════════════════

  const signUp = useCallback(async (options: SignUpOptions) => {
    setState((s) => ({ ...s, status: 'loading', error: null }))

    try {
      const { error } = await authClient.auth.signUp({
        email: options.email,
        password: options.password,
        options: {
          data: options.metadata,
          emailRedirectTo: options.redirectTo || `${window.location.origin}/auth/callback`,
          captchaToken: options.captchaToken,
        },
      })

      if (error) throw error

      setState((s) => ({ ...s, status: 'unauthenticated', error: null }))
      return { error: null }
    } catch (error) {
      const authError = mapAuthError(error)
      setState((s) => ({ ...s, status: 'error', error: authError }))
      return { error: authError }
    }
  }, [])

  const signIn = useCallback(async (options: SignInOptions) => {
    setState((s) => ({ ...s, status: 'loading', error: null }))

    try {
      const { data, error } = await authClient.auth.signInWithPassword({
        email: options.email,
        password: options.password,
        options: {
          captchaToken: options.captchaToken,
        },
      })

      if (error) throw error

      // Check if MFA is required
      const factors = (data.session?.user?.factors || []) as AuthFactor[]
      if (factors.length > 0) {
        const verifiedFactor = factors.find((f) => f.status === 'verified')
        if (verifiedFactor) {
          return { error: null, mfaRequired: true }
        }
      }

      return { error: null }
    } catch (error) {
      const authError = mapAuthError(error)
      setState((s) => ({ ...s, status: 'error', error: authError }))
      return { error: authError }
    }
  }, [])

  const signInWithOAuth = useCallback(async (options: SignInWithOAuthOptions) => {
    setState((s) => ({ ...s, status: 'loading', error: null }))

    try {
      const { data, error } = await authClient.auth.signInWithOAuth({
        provider: options.provider,
        options: {
          redirectTo: options.redirectTo || `${window.location.origin}/auth/callback`,
          scopes: options.scopes,
          queryParams: options.queryParams,
          skipBrowserRedirect: true,
        },
      })

      if (error) throw error

      // Return URL for redirect
      return { error: null, url: data.url }
    } catch (error) {
      const authError = mapAuthError(error)
      setState((s) => ({ ...s, status: 'error', error: authError }))
      return { error: authError }
    }
  }, [])

  const signInWithOtp = useCallback(async (options: SignInWithOtpOptions) => {
    setState((s) => ({ ...s, status: 'loading', error: null }))

    try {
      const { error } = await authClient.auth.signInWithOtp({
        ...(options.email ? { email: options.email } : {}),
        ...(options.phone ? { phone: options.phone } : {}),
        options: {
          shouldCreateUser: options.shouldCreateUser ?? true,
          captchaToken: options.captchaToken,
        },
      } as Parameters<typeof authClient.auth.signInWithOtp>[0])

      if (error) throw error

      setState((s) => ({ ...s, status: 'unauthenticated', error: null }))
      return { error: null }
    } catch (error) {
      const authError = mapAuthError(error)
      setState((s) => ({ ...s, status: 'error', error: authError }))
      return { error: authError }
    }
  }, [])

  const signOut = useCallback(
    async (options?: { scope?: 'global' | 'local' | 'others' }) => {
      setState((s) => ({ ...s, status: 'loading' }))

      try {
        const { error } = await authClient.auth.signOut({ scope: options?.scope || 'global' })
        if (error) throw error

        setState({
          status: 'unauthenticated',
          user: null,
          session: null,
          error: null,
        })

        router.push('/login')
        return { error: null }
      } catch (error) {
        const authError = mapAuthError(error)
        setState((s) => ({ ...s, status: 'error', error: authError }))
        return { error: authError }
      }
    },
    [router]
  )

  const resetPassword = useCallback(async (options: ResetPasswordOptions) => {
    setState((s) => ({ ...s, status: 'loading', error: null }))

    try {
      const { error } = await authClient.auth.resetPasswordForEmail(options.email, {
        redirectTo: options.redirectTo || `${window.location.origin}/auth/reset-password`,
        captchaToken: options.captchaToken,
      })

      if (error) throw error

      setState((s) => ({ ...s, status: 'unauthenticated', error: null }))
      return { error: null }
    } catch (error) {
      const authError = mapAuthError(error)
      setState((s) => ({ ...s, status: 'error', error: authError }))
      return { error: authError }
    }
  }, [])

  const updatePassword = useCallback(async (options: UpdatePasswordOptions) => {
    setState((s) => ({ ...s, status: 'loading', error: null }))

    try {
      const { error } = await authClient.auth.updateUser({
        password: options.password,
        nonce: options.nonce,
      })

      if (error) throw error

      return { error: null }
    } catch (error) {
      const authError = mapAuthError(error)
      setState((s) => ({ ...s, status: 'error', error: authError }))
      return { error: authError }
    }
  }, [])

  const refreshSession = useCallback(async () => {
    try {
      const {
        data: { session },
        error,
      } = await authClient.auth.refreshSession()
      if (error) throw error

      setState({
        status: session ? 'authenticated' : 'unauthenticated',
        user: mapSupabaseUser(session?.user),
        session: mapSupabaseSession(session),
        error: null,
      })

      return { error: null }
    } catch (error) {
      const authError = mapAuthError(error)
      setState((s) => ({ ...s, error: authError }))
      return { error: authError }
    }
  }, [])

  const updateUser = useCallback(async (attributes: Record<string, unknown>) => {
    try {
      const {
        data: { user },
        error,
      } = await authClient.auth.updateUser({
        data: attributes,
      })

      if (error) throw error

      setState((s) => ({
        ...s,
        user: mapSupabaseUser(user),
      }))

      return { error: null }
    } catch (error) {
      return { error: mapAuthError(error) }
    }
  }, [])

  const resendConfirmation = useCallback(async (email: string) => {
    try {
      const { error } = await authClient.auth.resend({
        type: 'signup',
        email,
      })
      return { error: error ? mapAuthError(error) : null }
    } catch (error) {
      return { error: mapAuthError(error) }
    }
  }, [])

  const verifyOtp = useCallback(
    async (
      email: string,
      token: string,
      type: 'email' | 'recovery' | 'invite' | 'signup' = 'email'
    ) => {
      try {
        const { data, error } = await authClient.auth.verifyOtp({
          email,
          token,
          type,
        })

        if (error) throw error

        return { error: null }
      } catch (error) {
        return { error: mapAuthError(error) }
      }
    },
    []
  )

  // ═══════════════════════════════════════════════════════════════════════════
  // MFA METHODS
  // ═══════════════════════════════════════════════════════════════════════════

  const enrollMFA = useCallback(async (options: MFAEnrollOptions) => {
    try {
      const { data, error } = await authClient.auth.mfa.enroll({
        factorType: options.factorType,
        friendlyName: options.friendlyName,
      })

      if (error) throw error

      return {
        data: data as TOTPData,
        error: null,
      }
    } catch (error) {
      return { data: null, error: mapAuthError(error) }
    }
  }, [])

  const verifyMFA = useCallback(async (options: MFAVerifyOptions) => {
    try {
      const { error } = await authClient.auth.mfa.verify({
        factorId: options.factorId,
        code: options.code,
        challengeId: options.challengeId,
      })

      if (error) throw error

      return { error: null }
    } catch (error) {
      return { error: mapAuthError(error) }
    }
  }, [])

  const challengeMFA = useCallback(async (options: MFAChallengeOptions) => {
    try {
      const { data, error } = await authClient.auth.mfa.challenge({
        factorId: options.factorId,
      })

      if (error) throw error

      return { data: { id: data.id }, error: null }
    } catch (error) {
      return { data: null, error: mapAuthError(error) }
    }
  }, [])

  const unenrollMFA = useCallback(async (options: MFAUnenrollOptions) => {
    try {
      const { error } = await authClient.auth.mfa.unenroll({
        factorId: options.factorId,
      })

      if (error) throw error

      return { error: null }
    } catch (error) {
      return { error: mapAuthError(error) }
    }
  }, [])

  const listMFAFactors = useCallback(async () => {
    try {
      const { data, error } = await authClient.auth.mfa.listFactors()

      if (error) throw error

      return { data: data.totp as unknown as AuthFactor[], error: null }
    } catch (error) {
      return { data: null, error: mapAuthError(error) }
    }
  }, [])

  // ═══════════════════════════════════════════════════════════════════════════
  // UTILITY METHODS
  // ═══════════════════════════════════════════════════════════════════════════

  const sendMagicLink = useCallback(
    async (email: string) => {
      const { error } = await signInWithOtp({ email, shouldCreateUser: false })
      return { error }
    },
    [signInWithOtp]
  )

  return {
    ...state,
    signUp,
    signIn,
    signInWithOAuth,
    signInWithOtp,
    signOut,
    resetPassword,
    updatePassword,
    refreshSession,
    updateUser,
    resendConfirmation,
    sendMagicLink,
    verifyOtp,
    enrollMFA,
    verifyMFA,
    challengeMFA,
    unenrollMFA,
    listMFAFactors,
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// ADDITIONAL HOOKS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Hook to check if user is authenticated
 */
export function useIsAuthenticated() {
  const { status } = useAuth()
  return status === 'authenticated'
}

/**
 * Hook to get loading state
 */
export function useAuthLoading() {
  const { status } = useAuth()
  return status === 'loading' || status === 'idle'
}

/**
 * Hook to require authentication (redirects if not authenticated)
 */
export function useRequireAuth(redirectTo = '/login') {
  const { status, user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push(`${redirectTo}?redirectTo=${encodeURIComponent(window.location.pathname)}`)
    }
  }, [status, router, redirectTo])

  return { user, isLoading: status === 'loading' || status === 'idle' }
}
