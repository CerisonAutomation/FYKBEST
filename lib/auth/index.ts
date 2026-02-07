/**
 * Auth Module - Client-side exports only
 * Comprehensive Supabase Auth implementation for Next.js
 *
 * For server-side functions, import directly from './server'
 */

// Types
export type {
  AuthContextValue,
  AuthUser,
  AuthSession,
  AuthState,
  AuthStatus,
  AuthError,
  AuthErrorCode,
  AuthEvent,
  AuthEventType,
  AuthFactor,
  AuthIdentity,
  OAuthProvider,
  OAuthProviderConfig,
  SignUpOptions,
  SignInOptions,
  SignInWithOAuthOptions,
  SignInWithOtpOptions,
  ResetPasswordOptions,
  UpdatePasswordOptions,
  MFAEnrollOptions,
  MFAVerifyOptions,
  MFAChallengeOptions,
  MFAUnenrollOptions,
  TOTPData,
  RouteAccess,
  RouteConfig,
} from './types'

export { OAUTH_PROVIDERS, AUTH_ROUTES } from './types'

// Client
export { authClient, createAuthClient, onAuthStateChange, getSession, getUser } from './client'

// Hooks & Context
export {
  AuthProvider,
  useAuthContext,
  useAuth,
  useIsAuthenticated,
  useAuthLoading,
  useRequireAuth,
} from './context'
