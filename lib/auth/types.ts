/**
 * Modern Auth Types
 * Comprehensive type definitions for Supabase Auth
 */

import type { Provider } from '@supabase/supabase-js'

// ═══════════════════════════════════════════════════════════════════════════════
// AUTH PROVIDERS
// ═══════════════════════════════════════════════════════════════════════════════

export type OAuthProvider =
  | 'google'
  | 'apple'
  | 'facebook'
  | 'twitter'
  | 'github'
  | 'discord'
  | 'linkedin'
  | 'spotify'

export interface OAuthProviderConfig {
  id: OAuthProvider
  name: string
  icon: string
  color: string
  bgColor: string
}

export const OAUTH_PROVIDERS: OAuthProviderConfig[] = [
  {
    id: 'google',
    name: 'Google',
    icon: 'chrome',
    color: 'text-white',
    bgColor: 'bg-red-500 hover:bg-red-600',
  },
  {
    id: 'apple',
    name: 'Apple',
    icon: 'apple',
    color: 'text-white',
    bgColor: 'bg-black hover:bg-gray-900',
  },
  {
    id: 'facebook',
    name: 'Facebook',
    icon: 'facebook',
    color: 'text-white',
    bgColor: 'bg-blue-600 hover:bg-blue-700',
  },
  {
    id: 'twitter',
    name: 'X (Twitter)',
    icon: 'twitter',
    color: 'text-white',
    bgColor: 'bg-black hover:bg-gray-900',
  },
  {
    id: 'github',
    name: 'GitHub',
    icon: 'github',
    color: 'text-white',
    bgColor: 'bg-gray-800 hover:bg-gray-900',
  },
  {
    id: 'discord',
    name: 'Discord',
    icon: 'message-circle',
    color: 'text-white',
    bgColor: 'bg-indigo-500 hover:bg-indigo-600',
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// AUTH STATE
// ═══════════════════════════════════════════════════════════════════════════════

export type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated' | 'error'

export interface AuthState {
  status: AuthStatus
  user: AuthUser | null
  session: AuthSession | null
  error: AuthError | null
}

export interface AuthUser {
  id: string
  email: string
  emailConfirmed: boolean
  phone?: string
  phoneConfirmed: boolean
  createdAt: string
  lastSignInAt: string
  appMetadata: {
    provider?: string
    providers?: string[]
    role?: 'seeker' | 'provider' | 'admin' | 'moderator'
  }
  userMetadata: {
    avatar_url?: string
    display_name?: string
    full_name?: string
    username?: string
  }
  identities?: AuthIdentity[]
  factors?: AuthFactor[]
}

export interface AuthSession {
  accessToken: string
  refreshToken: string
  expiresAt: number
  expiresIn: number
  tokenType: string
}

export interface AuthIdentity {
  id: string
  provider: string
  identityData?: Record<string, unknown>
  identityId: string
  createdAt: string
  lastSignInAt: string
  updatedAt: string
}

export interface AuthFactor {
  id: string
  friendly_name?: string
  factor_type: 'totp' | 'phone'
  status: 'verified' | 'unverified'
  created_at: string
  updated_at: string
}

// ═══════════════════════════════════════════════════════════════════════════════
// AUTH ERRORS
// ═══════════════════════════════════════════════════════════════════════════════

export interface AuthError {
  code: AuthErrorCode
  message: string
  status?: number
}

export type AuthErrorCode =
  | 'invalid_credentials'
  | 'user_not_found'
  | 'email_not_confirmed'
  | 'email_taken'
  | 'weak_password'
  | 'otp_expired'
  | 'otp_disabled'
  | 'mfa_required'
  | 'mfa_challenge_expired'
  | 'provider_error'
  | 'network_error'
  | 'unknown_error'
  | 'rate_limit'
  | 'session_expired'
  | 'unauthorized'

// ═══════════════════════════════════════════════════════════════════════════════
// AUTH OPTIONS
// ═══════════════════════════════════════════════════════════════════════════════

export interface SignUpOptions {
  email: string
  password: string
  metadata?: {
    display_name?: string
    username?: string
    role?: 'seeker' | 'provider'
    [key: string]: unknown
  }
  redirectTo?: string
  captchaToken?: string
}

export interface SignInOptions {
  email: string
  password: string
  captchaToken?: string
}

export interface SignInWithOAuthOptions {
  provider: OAuthProvider
  redirectTo?: string
  scopes?: string
  queryParams?: Record<string, string>
}

export interface SignInWithOtpOptions {
  email?: string
  phone?: string
  shouldCreateUser?: boolean
  captchaToken?: string
}

export interface ResetPasswordOptions {
  email: string
  redirectTo?: string
  captchaToken?: string
}

export interface UpdatePasswordOptions {
  password: string
  nonce?: string
}

// ═══════════════════════════════════════════════════════════════════════════════
// MFA / 2FA
// ═══════════════════════════════════════════════════════════════════════════════

export interface MFAEnrollOptions {
  factorType: 'totp'
  friendlyName: string
}

export interface MFAVerifyOptions {
  factorId: string
  code: string
  challengeId: string
}

export interface MFAChallengeOptions {
  factorId: string
}

export interface MFAUnenrollOptions {
  factorId: string
}

export interface TOTPData {
  id: string
  type: 'totp'
  totp: {
    secret: string
    uri: string
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// AUTH EVENTS
// ═══════════════════════════════════════════════════════════════════════════════

export type AuthEventType =
  | 'SIGNED_IN'
  | 'SIGNED_OUT'
  | 'USER_UPDATED'
  | 'USER_DELETED'
  | 'PASSWORD_RECOVERY'
  | 'TOKEN_REFRESHED'
  | 'MFA_CHALLENGE_VERIFIED'
  | 'MFA_CHALLENGE_UNVERIFIED'

export interface AuthEvent {
  type: AuthEventType
  session: AuthSession | null
  user: AuthUser | null
}

// ═══════════════════════════════════════════════════════════════════════════════
// AUTH CONTEXT
// ═══════════════════════════════════════════════════════════════════════════════

export interface AuthContextValue extends AuthState {
  // Core auth methods
  signUp: (options: SignUpOptions) => Promise<{ error: AuthError | null }>
  signIn: (options: SignInOptions) => Promise<{ error: AuthError | null; mfaRequired?: boolean }>
  signInWithOAuth: (
    options: SignInWithOAuthOptions
  ) => Promise<{ error: AuthError | null; url?: string }>
  signInWithOtp: (options: SignInWithOtpOptions) => Promise<{ error: AuthError | null }>
  signOut: (options?: { scope?: 'global' | 'local' | 'others' }) => Promise<{
    error: AuthError | null
  }>

  // Password management
  resetPassword: (options: ResetPasswordOptions) => Promise<{ error: AuthError | null }>
  updatePassword: (options: UpdatePasswordOptions) => Promise<{ error: AuthError | null }>

  // Session management
  refreshSession: () => Promise<{ error: AuthError | null }>

  // User management
  updateUser: (
    attributes: Partial<AuthUser['userMetadata']>
  ) => Promise<{ error: AuthError | null }>
  resendConfirmation: (email: string) => Promise<{ error: AuthError | null }>

  // MFA
  enrollMFA: (
    options: MFAEnrollOptions
  ) => Promise<{ data: TOTPData | null; error: AuthError | null }>
  verifyMFA: (options: MFAVerifyOptions) => Promise<{ error: AuthError | null }>
  challengeMFA: (
    options: MFAChallengeOptions
  ) => Promise<{ data: { id: string } | null; error: AuthError | null }>
  unenrollMFA: (options: MFAUnenrollOptions) => Promise<{ error: AuthError | null }>
  listMFAFactors: () => Promise<{ data: AuthFactor[] | null; error: AuthError | null }>

  // Utilities
  sendMagicLink: (email: string) => Promise<{ error: AuthError | null }>
  verifyOtp: (
    email: string,
    token: string,
    type: 'email' | 'recovery' | 'invite'
  ) => Promise<{ error: AuthError | null }>
}

// ═══════════════════════════════════════════════════════════════════════════════
// ROUTE PROTECTION
// ═══════════════════════════════════════════════════════════════════════════════

export type RouteAccess = 'public' | 'authenticated' | 'unauthenticated' | 'admin'

export interface RouteConfig {
  path: string
  access: RouteAccess
  redirectTo?: string
  roles?: string[]
}

export const AUTH_ROUTES: RouteConfig[] = [
  { path: '/login', access: 'unauthenticated', redirectTo: '/browse' },
  { path: '/signup', access: 'unauthenticated', redirectTo: '/browse' },
  { path: '/auth/reset-password', access: 'public' },
  { path: '/auth/callback', access: 'public' },
  { path: '/browse', access: 'authenticated', redirectTo: '/login' },
  { path: '/messages', access: 'authenticated', redirectTo: '/login' },
  { path: '/bookings', access: 'authenticated', redirectTo: '/login' },
  { path: '/favorites', access: 'authenticated', redirectTo: '/login' },
  { path: '/profile', access: 'authenticated', redirectTo: '/login' },
  { path: '/subscription', access: 'authenticated', redirectTo: '/login' },
  { path: '/admin', access: 'admin', redirectTo: '/' },
]
