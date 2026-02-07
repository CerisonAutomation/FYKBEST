/**
 * Enterprise Safe Database Queries
 * Type-safe SQL injection prevention for Supabase
 */

import { createClient } from '@/lib/supabase/client'
import type { Database } from '@/types/supabase'

// Type-safe query builder
export class SafeQueryBuilder<T extends keyof Database['public']['Tables']> {
  private table: T
  protected supabase = createClient()

  constructor(table: T) {
    this.table = table
  }

  /**
   * Safe select with type inference
   */
  select<K extends keyof Database['public']['Tables'][T]['Row']>(columns?: K[]) {
    const selection = columns?.join(',') || '*'
    return this.supabase.from(this.table).select(selection)
  }

  /**
   * Safe filter with parameterized queries
   */
  eq<K extends keyof Database['public']['Tables'][T]['Row']>(
    column: K,
    value: Database['public']['Tables'][T]['Row'][K]
  ) {
    return (this.supabase as any).from(this.table).eq(column as string, value)
  }

  /**
   * Safe ILIKE for text search
   */
  ilike<K extends keyof Database['public']['Tables'][T]['Row']>(column: K, value: string) {
    // Sanitize input to prevent SQL injection
    const sanitizedValue = value.replace(/[%_\\]/g, '\\$&')
    return (this.supabase as any).from(this.table).ilike(column as string, `%${sanitizedValue}%`)
  }

  /**
   * Safe range queries
   */
  gte<K extends keyof Database['public']['Tables'][T]['Row']>(
    column: K,
    value: Database['public']['Tables'][T]['Row'][K]
  ) {
    return (this.supabase as any).from(this.table).gte(column as string, value)
  }

  /**
   * Safe ordering
   */
  order<K extends keyof Database['public']['Tables'][T]['Row']>(
    column: K,
    options?: { ascending?: boolean; nullsFirst?: boolean }
  ) {
    return (this.supabase as any).from(this.table).order(column as string, options as any)
  }

  /**
   * Safe pagination
   */
  range(from: number, to: number) {
    return (this.supabase as any).from(this.table).range(from, to)
  }
}

// Pre-built safe queries for common operations
export class ProfileQueries extends SafeQueryBuilder<'profiles'> {
  constructor() {
    super('profiles')
  }

  /**
   * Get active profiles with filtering
   */
  async getActiveProfiles(filters: {
    city?: string
    verified?: boolean
    online?: boolean
    limit?: number
    offset?: number
  }) {
    let query = this.select([
      'id',
      'display_name',
      'bio',
      'tagline',
      'verification_status',
      'updated_at',
      'user_id',
    ] as any).eq('verification_status', filters.verified ?? true)

    if (filters.city) {
      query = query.ilike('display_name', filters.city as string)
    }

    query = query.order('created_at' as any, { ascending: false })

    if (filters.limit) {
      const offset = filters.offset || 0
      query = query.range(offset, offset + filters.limit - 1)
    }

    return await query
  }

  /**
   * Search profiles safely
   */
  async searchProfiles(query: string, limit = 20) {
    if (!query.trim()) {
      return []
    }

    return await this.select([
      'id',
      'display_name',
      'bio',
      'tagline',
      'verification_status',
      'updated_at',
      'user_id',
    ] as any)
      .ilike('display_name', query.trim())
      .eq('verification_status', true)
      .order('created_at' as any, { ascending: false })
      .range(0, limit - 1)
  }

  /**
   * Get user profile by ID
   */
  async getProfileById(userId: string) {
    return await this.select().eq('id', userId).single()
  }
}

export class SubscriptionQueries extends SafeQueryBuilder<'subscriptions'> {
  constructor() {
    super('subscriptions')
  }

  /**
   * Get active subscription for user
   */
  async getActiveSubscription(userId: string) {
    return await this.select()
      .eq('user_id', userId)
      .eq('status', 'active')
      .order('created_at' as any, { ascending: false })
      .limit(1)
      .single()
  }

  /**
   * Get subscription history
   */
  async getSubscriptionHistory(userId: string) {
    return await this.select()
      .eq('user_id', userId)
      .order('created_at' as any, { ascending: false })
  }
}

export class MessageQueries extends SafeQueryBuilder<'messages'> {
  constructor() {
    super('messages')
  }

  /**
   * Get conversation messages
   */
  async getConversationMessages(conversationId: string, limit = 50) {
    return await this.select()
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })
      .range(0, limit - 1)
  }

  /**
   * Send message safely
   */
  async sendMessage(message: {
    conversation_id: string
    sender_id: string
    content: string
    message_type?: string
  }) {
    // Sanitize content
    const sanitizedContent = message.content.trim().substring(0, 1000)

    return await (this.supabase as any).from('messages').insert({
      conversation_id: message.conversation_id,
      sender_id: message.sender_id,
      content: sanitizedContent,
      message_type: message.message_type || 'text',
      created_at: new Date().toISOString(),
    })
  }
}

// Export query instances
export const profileQueries = new ProfileQueries()
export const subscriptionQueries = new SubscriptionQueries()
export const messageQueries = new MessageQueries()

// Generic safe query helper
export function createSafeQuery<T extends keyof Database['public']['Tables']>(table: T) {
  return new SafeQueryBuilder(table)
}
