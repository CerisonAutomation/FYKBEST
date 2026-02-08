/**
 * Domain: Domain Types
 *
 * Application types aligned with Supabase Database schema.
 * These types represent the domain model of the Find Your King platform.
 */

import type { Database } from './supabase'

// ═══════════════════════════════════════════════════════════════════════════════════════
// USER DOMAIN
// ═══════════════════════════════════════════════════════════════════════════════════════

export type DbUser = Database['public']['Tables']['users']['Row']
export type DbProfile = Database['public']['Tables']['profiles']['Row']

export interface User {
  id: string
  email: string
  username?: string
  display_name: string
  avatar_url?: string
  bio?: string
  headline?: string
  role: 'seeker' | 'provider' | 'admin' | 'moderator'
  verification_status: 'unverified' | 'pending' | 'verified' | 'rejected'
  subscription_tier: 'free' | 'premium' | 'plus' | 'vip' | 'enterprise'
  subscription_status?: 'active' | 'canceled' | 'expired' | 'pending' | 'trial'
  presence: 'online' | 'away' | 'busy' | 'offline' | 'invisible'
  is_incognito: boolean
  available_now: boolean
  parties?: any[]
  city?: string
  country?: string
  age?: number
  interests?: string[]
  tribes?: string[]
  looking_for?: string[]
  photos?: string[]
  height_cm?: number
  body_type?: string
  hourly_rate?: number
  response_time?: string
  reviews_count: number
  average_rating: number
  popularity_score: number
  fame_rating: number
  profile_views: number
  onboarding_completed: boolean
  onboarding_step: number
  profile_completeness: number
  travel_mode_enabled: boolean
  settings?: Record<string, unknown>
  is_admin: boolean
  is_active?: boolean
  last_seen_at?: string
  created_at?: string
}

// ═══════════════════════════════════════════════════════════════════════════════════════
// MATCH DOMAIN
// ═══════════════════════════════════════════════════════════════════════════════════════

export type DbMatch = Database['public']['Tables']['matches']['Row']

export interface Match {
  id: string
  name: string
  username?: string
  age: number
  city: string
  bio: string
  rate: number
  verified: boolean
  verification_status: 'unverified' | 'pending' | 'verified' | 'rejected'
  online: boolean
  presence: 'online' | 'away' | 'busy' | 'offline' | 'invisible'
  lastSeen: Date
  distance: string
  compatibility: number
  reviews: number
  averageRating: number
  responseTime: string
  interests: string[]
  tribes: string[]
  photos: string[]
  isTyping: boolean
  hasUnread: boolean
  likedYou: boolean
  availableNow: boolean
  subscriptionTier: 'free' | 'premium' | 'plus' | 'vip' | 'enterprise'
  userId?: string
  matchType?: 'mutual' | 'ai_suggested' | 'proximity' | 'interest_based' | 'superlike'
  matchedAt?: string
}

// ═══════════════════════════════════════════════════════════════════════════════════════
// MESSAGING DOMAIN
// ═══════════════════════════════════════════════════════════════════════════════════════

export type DbMessage = Database['public']['Tables']['messages']['Row']
export type DbConversation = Database['public']['Tables']['conversations']['Row']

export interface Message {
  id: string
  text: string
  content?: string
  from: 'user' | 'match'
  senderId?: string
  timestamp: Date
  created_at?: string
  read: boolean
  read_at?: string | null
  status?: 'sending' | 'delivered' | 'read' | 'failed'
  messageType?: 'text' | 'image' | 'video' | 'audio' | 'location' | 'system' | 'game'
  attachmentUrl?: string | null
  conversationId?: string
  gameData?: {
    type: 'truth_or_dare' | 'would_you_rather' | 'never_have_i_ever' | 'rate_me'
    question: string
    options?: string[]
    result?: string
  }
}

export interface Conversation {
  id: string
  participantOneId: string
  participantTwoId: string
  lastMessageAt: string
  lastMessagePreview?: string
  unreadCount: number
  isMuted: boolean
  isArchived: boolean
  otherUser?: Match
}

// ═══════════════════════════════════════════════════════════════════════════════════════
// BOOKING DOMAIN
// ═══════════════════════════════════════════════════════════════════════════════════════

export type DbBooking = Database['public']['Tables']['bookings']['Row']

export interface Booking {
  id: string
  matchId?: string
  matchName: string
  matchPhoto?: string
  seekerId?: string
  providerId?: string
  date: string
  time: string
  hours: number
  price: number
  totalPrice?: number
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'disputed'
  reminder: boolean
  location?: string
  notes?: string
  bookingDate?: string
  startTime?: string
  durationHours?: number
  createdAt?: string
  updatedAt?: string
}

// ═══════════════════════════════════════════════════════════════════════════════════════
// NOTIFICATION DOMAIN
// ═══════════════════════════════════════════════════════════════════════════════════════

export type DbNotification = Database['public']['Tables']['notifications']['Row']

export interface Notification {
  id: string
  userId?: string
  from: string
  avatar: string
  text: string
  title?: string
  body?: string
  type: 'message' | 'match' | 'like' | 'booking' | 'system' | 'tap'
  notificationType?: 'match' | 'message' | 'tap' | 'like' | 'booking' | 'system' | 'alert'
  read: boolean
  isRead?: boolean
  createdAt: Date
  created_at?: string
  payload?: Record<string, unknown>
}

// TAPS DOMAIN
// ═══════════════════════════════════════════════════════════════════════════════════════

// export type DbTap = Database['public']['Tables']['taps']['Row'];

export interface Tap {
  id: string
  senderId: string
  receiverId: string
  tapType: 'flame' | 'wave' | 'heart' | 'wow' | 'wink' | 'look'
  isRead: boolean
  createdAt: string
  sender?: Match
}

// ═══════════════════════════════════════════════════════════════════════════════════════
// FAVORITES DOMAIN
// ═══════════════════════════════════════════════════════════════════════════════════════

export type DbFavorite = Database['public']['Tables']['favorites']['Row']

export interface Favorite {
  id: string
  userId: string
  favoriteUserId: string
  createdAt: string
  favoriteUser?: Match
}

// ═══════════════════════════════════════════════════════════════════════════════════════
// REVIEW DOMAIN
// ═══════════════════════════════════════════════════════════════════════════════════════

export type DbReview = Database['public']['Tables']['reviews']['Row']

export interface Review {
  id: string
  bookingId?: string
  reviewerId: string
  reviewedUserId: string
  rating: number
  title?: string
  content?: string
  isVerified: boolean
  createdAt: string
  reviewer?: Match
}

// ═══════════════════════════════════════════════════════════════════════════════════════
// SUBSCRIPTION DOMAIN
// ═══════════════════════════════════════════════════════════════════════════════════════

export type DbSubscription = Database['public']['Tables']['subscriptions']['Row']

export interface Subscription {
  id: string
  userId: string
  tier: 'free' | 'premium' | 'plus' | 'vip' | 'enterprise'
  amount: number
  currency: string
  status: 'active' | 'canceled' | 'expired' | 'pending'
  stripeSubscriptionId?: string
  startsAt: string
  expiresAt: string
  cancelledAt?: string
}

// ═══════════════════════════════════════════════════════════════════════════════════════
// PHOTO DOMAIN
// ═══════════════════════════════════════════════════════════════════════════════════════

export type DbPhoto = Database['public']['Tables']['photos']['Row']

export interface Photo {
  id: string
  userId: string
  url: string
  thumbnailUrl?: string
  isPrimary: boolean
  isPrivate: boolean
  moderationStatus: 'pending' | 'approved' | 'rejected'
  nsfwScore: number
  orderIndex: number
  createdAt: string
}

// ═══════════════════════════════════════════════════════════════════════════════════════
// PARTY DOMAIN
// ═══════════════════════════════════════════════════════════════════════════════════════

export type DbParty = Database['public']['Tables']['parties']['Row']

export interface Party {
  id: string
  title: string
  description?: string
  location: string
  date: string
  time: string
  image: string
  attendees: number
  type: 'gym' | 'cinema' | 'meetup' | 'drinks' | 'food' | 'coffee'
  hostId: string
}

export interface PartyWithHost extends Party {
  isHost?: boolean
  isAttending?: boolean
}

// ═══════════════════════════════════════════════════════════════════════════════════════
// MEET NOW DOMAIN
// ═══════════════════════════════════════════════════════════════════════════════════════

export interface RightNowSession {
  id: string
  userId: string
  statusText?: string
  expiresAt: string
  distanceM: number
  location?: { lat: number; lng: number }
  user?: Match
}

// ═══════════════════════════════════════════════════════════════════════════════════════
// API RESPONSE TYPES
// ═══════════════════════════════════════════════════════════════════════════════════════

export interface ApiResponse<T> {
  data?: T
  error?: ApiError
  status: number
}

export interface ApiError {
  code: string
  message: string
  details?: Record<string, unknown>
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  perPage: number
  hasMore: boolean
}

// ═══════════════════════════════════════════════════════════════════════════════════════
// AUTH TYPES
// ═══════════════════════════════════════════════════════════════════════════════════════

export interface SignUpCredentials {
  email: string
  password: string
  displayName: string
  role: 'seeker' | 'provider'
}

export interface SignInCredentials {
  email: string
  password: string
}

export interface AuthResponse {
  user: User | null
  error: ApiError | null
}

// ═══════════════════════════════════════════════════════════════════════════════════════
// REALTIME TYPES
// ═══════════════════════════════════════════════════════════════════════════════════════

export type RealtimeEventType = 'INSERT' | 'UPDATE' | 'DELETE'

export interface RealtimePayload<T> {
  eventType: RealtimeEventType
  new: T
  old: T
  schema: string
  table: string
  commit_timestamp: string
}

// ═══════════════════════════════════════════════════════════════════════════════════════
// UTILITY TYPES
// ═══════════════════════════════════════════════════════════════════════════════════════

export type LoadingState = 'idle' | 'loading' | 'success' | 'error'

export interface FilterOptions {
  query?: string
  verified?: boolean
  availableNow?: boolean
  minAge?: number
  maxAge?: number
  maxDistance?: number
  minRate?: number
  maxRate?: number
  interests?: string[]
}

export type SortOption =
  | 'compatibility'
  | 'distance'
  | 'rating'
  | 'newest'
  | 'price_asc'
  | 'price_desc'
