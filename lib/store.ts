'use client'

import type { Booking, Match, Message, Notification, Party, User } from '@/types/app'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

/**
 * AppState: Global State Management
 *
 * Zustand store aligned with the backend schema.
 * Implements persistent storage for specific UI states.
 */

interface AppState {
  // ═══════════════════════════════════════════════════════════
  // AUTH STATE
  // ═══════════════════════════════════════════════════════════
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  setUser: (user: User | null) => void
  setAuthenticated: (value: boolean) => void
  setLoading: (value: boolean) => void

  // ═══════════════════════════════════════════════════════════
  // NAVIGATION STATE
  // ═══════════════════════════════════════════════════════════
  stage: string
  setStage: (stage: string) => void

  // Role selection (onboarding)
  role: 'seeker' | 'provider' | null
  setRole: (role: 'seeker' | 'provider' | null) => void

  // ═══════════════════════════════════════════════════════════
  // UI STATE
  // ═══════════════════════════════════════════════════════════
  leftMenuOpen: boolean
  setLeftMenuOpen: (open: boolean) => void
  rightMenuOpen: boolean
  setRightMenuOpen: (open: boolean) => void

  // ═══════════════════════════════════════════════════════════
  // MATCHES STATE
  // ═══════════════════════════════════════════════════════════
  matches: Match[]
  setMatches: (matches: Match[]) => void
  selectedMatch: Match | null
  setSelectedMatch: (match: Match | null) => void
  currentPhotoIndex: number
  setCurrentPhotoIndex: (index: number) => void

  // ═══════════════════════════════════════════════════════════
  // MESSAGING STATE
  // ═══════════════════════════════════════════════════════════
  chatMessages: Record<string, Message[]>
  addMessage: (chatKey: string, message: Message) => void
  setMessages: (chatKey: string, messages: Message[]) => void
  activeChat: string | null
  setActiveChat: (chatId: string | null) => void
  typingUsers: Record<string, boolean>
  setTypingUser: (userId: string, isTyping: boolean) => void
  unreadCounts: Record<string, number>
  setUnreadCount: (userId: string, count: number) => void

  // ═══════════════════════════════════════════════════════════
  // BOOKINGS STATE
  // ═══════════════════════════════════════════════════════════
  bookings: Booking[]
  setBookings: (bookings: Booking[]) => void
  addBooking: (booking: Booking) => void
  updateBooking: (id: string, updates: Partial<Booking>) => void

  // ═══════════════════════════════════════════════════════════
  // FAVORITES STATE
  // ═══════════════════════════════════════════════════════════
  favorites: string[]
  setFavorites: (favorites: string[]) => void
  toggleFavorite: (matchId: string) => void

  // ═══════════════════════════════════════════════════════════
  // SUBSCRIPTION STATE
  // ═══════════════════════════════════════════════════════════
  subscribed: boolean
  setSubscribed: (subscribed: boolean) => void

  // ═══════════════════════════════════════════════════════════
  // PARTIES STATE
  // ═══════════════════════════════════════════════════════════
  parties: Party[]
  setParties: (parties: Party[]) => void
  selectedParty: Party | null
  setSelectedParty: (party: Party | null) => void

  // ═══════════════════════════════════════════════════════════
  // SETTINGS
  // ═══════════════════════════════════════════════════════════
  isAiEnabled: boolean
  setIsAiEnabled: (active: boolean) => void

  // ═══════════════════════════════════════════════════════════
  // SEARCH & FILTERS
  // ═══════════════════════════════════════════════════════════
  searchQuery: string
  setSearchQuery: (query: string) => void
  meetNowFilter: boolean
  setMeetNowFilter: (filter: boolean) => void
  verifiedFilter: boolean
  setVerifiedFilter: (filter: boolean) => void

  // ═══════════════════════════════════════════════════════════
  // EXPLORE VIEW
  // ═══════════════════════════════════════════════════════════
  exploreView: 'grid' | 'list' | 'map'
  setExploreView: (view: 'grid' | 'list' | 'map') => void
  swipeMode: boolean
  setSwipeMode: (mode: boolean) => void
  currentSwipeIndex: number
  setCurrentSwipeIndex: (index: number) => void

  // ═══════════════════════════════════════════════════════════
  // NOTIFICATIONS
  // ═══════════════════════════════════════════════════════════
  notifications: Notification[]
  setNotifications: (notifications: Notification[]) => void
  addNotification: (notification: Notification) => void
  removeNotification: (id: string) => void
  clearNotifications: () => void
  markNotificationRead: (id: string) => void

  // ═══════════════════════════════════════════════════════════
  // PRESENCE
  // ═══════════════════════════════════════════════════════════
  onlineFriends: string[]
  setOnlineFriends: (friends: string[]) => void

  // ═══════════════════════════════════════════════════════════
  // BLOCK LIST
  // ═══════════════════════════════════════════════════════════
  blockList: string[]
  setBlockList: (list: string[]) => void
  blockUser: (userId: string) => void
  unblockUser: (userId: string) => void

  // ═══════════════════════════════════════════════════════════
  // RESET
  // ═══════════════════════════════════════════════════════════
  reset: () => void
}

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  stage: 'onboarding',
  role: null,
  leftMenuOpen: false,
  rightMenuOpen: false,
  matches: [],
  selectedMatch: null,
  currentPhotoIndex: 0,
  chatMessages: {},
  activeChat: null,
  typingUsers: {},
  unreadCounts: {},
  bookings: [],
  favorites: [],
  parties: [],
  selectedParty: null,
  subscribed: false,
  isAiEnabled: false,
  searchQuery: '',
  meetNowFilter: false,
  verifiedFilter: false,
  exploreView: 'grid' as const,
  swipeMode: false,
  currentSwipeIndex: 0,
  notifications: [],
  onlineFriends: [],
  blockList: [],
}

export const useAppStore = create<AppState>()(
  persist(
    (set, _get) => ({
      ...initialState,

      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setAuthenticated: (value) => set({ isAuthenticated: value }),
      setLoading: (value) => set({ isLoading: value }),
      setStage: (stage) => set({ stage }),
      setRole: (role) => set({ role }),
      setLeftMenuOpen: (leftMenuOpen) => set({ leftMenuOpen }),
      setRightMenuOpen: (rightMenuOpen) => set({ rightMenuOpen }),
      setMatches: (matches) => set({ matches }),
      setSelectedMatch: (selectedMatch) => set({ selectedMatch }),
      setCurrentPhotoIndex: (currentPhotoIndex) => set({ currentPhotoIndex }),
      addMessage: (chatKey, message) =>
        set((state) => ({
          chatMessages: {
            ...state.chatMessages,
            [chatKey]: [...(state.chatMessages[chatKey] || []), message],
          },
        })),
      setMessages: (chatKey, messages) =>
        set((state) => ({
          chatMessages: {
            ...state.chatMessages,
            [chatKey]: messages,
          },
        })),
      setActiveChat: (activeChat) => set({ activeChat }),
      setTypingUser: (userId, isTyping) =>
        set((state) => ({
          typingUsers: { ...state.typingUsers, [userId]: isTyping },
        })),
      setUnreadCount: (userId, count) =>
        set((state) => ({
          unreadCounts: { ...state.unreadCounts, [userId]: count },
        })),
      setBookings: (bookings) => set({ bookings }),
      addBooking: (booking) =>
        set((state) => ({
          bookings: [...state.bookings, booking],
        })),
      updateBooking: (id, updates) =>
        set((state) => ({
          bookings: state.bookings.map((b) => (b.id === id ? { ...b, ...updates } : b)),
        })),
      setFavorites: (favorites) => set({ favorites }),
      toggleFavorite: (matchId) =>
        set((state) => ({
          favorites: state.favorites.includes(matchId)
            ? state.favorites.filter((id) => id !== matchId)
            : [...state.favorites, matchId],
        })),
      // Subscription actions
      setSubscribed: (subscribed) => set({ subscribed }),

      // Parties actions
      setParties: (parties) => set({ parties }),
      setSelectedParty: (selectedParty) => set({ selectedParty }),
      setIsAiEnabled: (isAiEnabled) => set({ isAiEnabled }),
      setSearchQuery: (searchQuery) => set({ searchQuery }),
      setMeetNowFilter: (meetNowFilter) => set({ meetNowFilter }),
      setVerifiedFilter: (verifiedFilter) => set({ verifiedFilter }),
      setExploreView: (exploreView) => set({ exploreView }),
      setSwipeMode: (swipeMode) => set({ swipeMode }),
      setCurrentSwipeIndex: (currentSwipeIndex) => set({ currentSwipeIndex }),
      setNotifications: (notifications) => set({ notifications }),
      addNotification: (notification) =>
        set((state) => ({
          notifications: [notification, ...state.notifications].slice(0, 50),
        })),
      removeNotification: (id) =>
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        })),
      clearNotifications: () => set({ notifications: [] }),
      markNotificationRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
        })),
      setOnlineFriends: (onlineFriends) => set({ onlineFriends }),
      setBlockList: (blockList) => set({ blockList }),
      blockUser: (userId) =>
        set((state) => ({
          blockList: [...state.blockList, userId],
        })),
      unblockUser: (userId) =>
        set((state) => ({
          blockList: state.blockList.filter((id) => id !== userId),
        })),
      reset: () => set(initialState),
    }),
    {
      name: 'app-storage-v1',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        stage: state.stage,
        role: state.role,
        exploreView: state.exploreView,
        isAiEnabled: state.isAiEnabled,
        swipeMode: state.swipeMode,
      }),
    }
  )
)

/**
 * Selectors for optimized state access
 */
export const selectUser = (state: AppState) => state.user
export const selectIsAuthenticated = (state: AppState) => state.isAuthenticated
export const selectMatches = (state: AppState) => state.matches
export const selectActiveChat = (state: AppState) => state.activeChat
export const selectNotifications = (state: AppState) => state.notifications
export const selectUnreadCount = (state: AppState) =>
  state.notifications.filter((n) => !n.read).length
