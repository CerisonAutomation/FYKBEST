export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '14.1'
  }
  public: {
    Tables: {
      activity_interactions: {
        Row: {
          created_at: string | null
          id: string
          interaction_type: string
          metadata: Json | null
          score: number | null
          target_user_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          interaction_type: string
          metadata?: Json | null
          score?: number | null
          target_user_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          interaction_type?: string
          metadata?: Json | null
          score?: number | null
          target_user_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'activity_interactions_target_user_id_fkey'
            columns: ['target_user_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'activity_interactions_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      admin_actions: {
        Row: {
          action: string
          admin_id: string
          created_at: string | null
          id: string
          reason: string | null
          target_id: string
        }
        Insert: {
          action: string
          admin_id: string
          created_at?: string | null
          id?: string
          reason?: string | null
          target_id: string
        }
        Update: {
          action?: string
          admin_id?: string
          created_at?: string | null
          id?: string
          reason?: string | null
          target_id?: string
        }
        Relationships: []
      }
      ai_trust_scores: {
        Row: {
          authenticity_score: number | null
          behavior_score: number | null
          catfish_likelihood: number | null
          last_audit_at: string | null
          metadata: Json | null
          scam_likelihood: number | null
          user_id: string
        }
        Insert: {
          authenticity_score?: number | null
          behavior_score?: number | null
          catfish_likelihood?: number | null
          last_audit_at?: string | null
          metadata?: Json | null
          scam_likelihood?: number | null
          user_id: string
        }
        Update: {
          authenticity_score?: number | null
          behavior_score?: number | null
          catfish_likelihood?: number | null
          last_audit_at?: string | null
          metadata?: Json | null
          scam_likelihood?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'ai_trust_scores_user_id_fkey'
            columns: ['user_id']
            isOneToOne: true
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      album_access: {
        Row: {
          album_id: string
          created_at: string | null
          granted_at: string | null
          status: string | null
          user_id: string
        }
        Insert: {
          album_id: string
          created_at?: string | null
          granted_at?: string | null
          status?: string | null
          user_id: string
        }
        Update: {
          album_id?: string
          created_at?: string | null
          granted_at?: string | null
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'album_access_album_id_fkey'
            columns: ['album_id']
            isOneToOne: false
            referencedRelation: 'albums'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'album_access_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      album_photos: {
        Row: {
          album_id: string
          created_at: string | null
          id: string
          photo_id: string
          position: number | null
        }
        Insert: {
          album_id: string
          created_at?: string | null
          id?: string
          photo_id: string
          position?: number | null
        }
        Update: {
          album_id?: string
          created_at?: string | null
          id?: string
          photo_id?: string
          position?: number | null
        }
        Relationships: [
          {
            foreignKeyName: 'album_photos_album_id_fkey'
            columns: ['album_id']
            isOneToOne: false
            referencedRelation: 'albums'
            referencedColumns: ['id']
          },
        ]
      }
      albums: {
        Row: {
          cover_url: string | null
          created_at: string | null
          description: string | null
          id: string
          is_private: boolean | null
          is_public: boolean | null
          name: string | null
          owner_id: string
          title: string
        }
        Insert: {
          cover_url?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_private?: boolean | null
          is_public?: boolean | null
          name?: string | null
          owner_id: string
          title: string
        }
        Update: {
          cover_url?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_private?: boolean | null
          is_public?: boolean | null
          name?: string | null
          owner_id?: string
          title?: string
        }
        Relationships: []
      }
      audit_trail: {
        Row: {
          action: string
          created_at: string | null
          entity_id: string
          entity_type: string
          id: string
          new_data: Json | null
          old_data: Json | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          entity_id: string
          entity_type: string
          id?: string
          new_data?: Json | null
          old_data?: Json | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          entity_id?: string
          entity_type?: string
          id?: string
          new_data?: Json | null
          old_data?: Json | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'audit_trail_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      auto_reply: {
        Row: {
          enabled: boolean | null
          message: string | null
          user_id: string
        }
        Insert: {
          enabled?: boolean | null
          message?: string | null
          user_id: string
        }
        Update: {
          enabled?: boolean | null
          message?: string | null
          user_id?: string
        }
        Relationships: []
      }
      badges: {
        Row: {
          created_at: string | null
          description: string | null
          icon_url: string | null
          id: string
          name: string
          points_bonus: number | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          icon_url?: string | null
          id?: string
          name: string
          points_bonus?: number | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          icon_url?: string | null
          id?: string
          name?: string
          points_bonus?: number | null
        }
        Relationships: []
      }
      blocks: {
        Row: {
          blocked_id: string
          blocker_id: string
          created_at: string | null
          id: string
          reason: string | null
        }
        Insert: {
          blocked_id: string
          blocker_id: string
          created_at?: string | null
          id?: string
          reason?: string | null
        }
        Update: {
          blocked_id?: string
          blocker_id?: string
          created_at?: string | null
          id?: string
          reason?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'blocks_blocked_id_fkey'
            columns: ['blocked_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'blocks_blocker_id_fkey'
            columns: ['blocker_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      bookings: {
        Row: {
          booking_date: string
          cancelled_at: string | null
          cancelled_reason: string | null
          created_at: string | null
          duration_hours: number
          id: string
          location: string | null
          notes: string | null
          provider_id: string
          seeker_id: string
          start_time: string
          status: Database['public']['Enums']['booking_status'] | null
          total_price: number
          updated_at: string | null
        }
        Insert: {
          booking_date: string
          cancelled_at?: string | null
          cancelled_reason?: string | null
          created_at?: string | null
          duration_hours: number
          id?: string
          location?: string | null
          notes?: string | null
          provider_id: string
          seeker_id: string
          start_time: string
          status?: Database['public']['Enums']['booking_status'] | null
          total_price: number
          updated_at?: string | null
        }
        Update: {
          booking_date?: string
          cancelled_at?: string | null
          cancelled_reason?: string | null
          created_at?: string | null
          duration_hours?: number
          id?: string
          location?: string | null
          notes?: string | null
          provider_id?: string
          seeker_id?: string
          start_time?: string
          status?: Database['public']['Enums']['booking_status'] | null
          total_price?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'bookings_provider_id_fkey'
            columns: ['provider_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'bookings_seeker_id_fkey'
            columns: ['seeker_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      compatibility_scores: {
        Row: {
          activity_score: number | null
          calculated_at: string | null
          compatible_user_id: string
          connection_score: number | null
          engagement_score: number | null
          event_score: number | null
          id: string
          interest_score: number | null
          location_score: number | null
          overall_score: number
          reasons: string[] | null
          user_id: string
        }
        Insert: {
          activity_score?: number | null
          calculated_at?: string | null
          compatible_user_id: string
          connection_score?: number | null
          engagement_score?: number | null
          event_score?: number | null
          id?: string
          interest_score?: number | null
          location_score?: number | null
          overall_score: number
          reasons?: string[] | null
          user_id: string
        }
        Update: {
          activity_score?: number | null
          calculated_at?: string | null
          compatible_user_id?: string
          connection_score?: number | null
          engagement_score?: number | null
          event_score?: number | null
          id?: string
          interest_score?: number | null
          location_score?: number | null
          overall_score?: number
          reasons?: string[] | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'compatibility_scores_compatible_user_id_fkey'
            columns: ['compatible_user_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'compatibility_scores_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      compliance_logs: {
        Row: {
          action_type: string
          created_at: string | null
          description: string | null
          id: string
          ip_address: unknown
          metadata: Json | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action_type: string
          created_at?: string | null
          description?: string | null
          id?: string
          ip_address?: unknown
          metadata?: Json | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action_type?: string
          created_at?: string | null
          description?: string | null
          id?: string
          ip_address?: unknown
          metadata?: Json | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'compliance_logs_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      conversation_participants: {
        Row: {
          conversation_id: string
          is_archived: boolean | null
          is_muted: boolean | null
          joined_at: string | null
          last_read_at: string | null
          role: string | null
          user_id: string
        }
        Insert: {
          conversation_id: string
          is_archived?: boolean | null
          is_muted?: boolean | null
          joined_at?: string | null
          last_read_at?: string | null
          role?: string | null
          user_id: string
        }
        Update: {
          conversation_id?: string
          is_archived?: boolean | null
          is_muted?: boolean | null
          joined_at?: string | null
          last_read_at?: string | null
          role?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'conversation_participants_conversation_id_fkey'
            columns: ['conversation_id']
            isOneToOne: false
            referencedRelation: 'conversations'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'conversation_participants_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      conversation_reads: {
        Row: {
          conversation_id: string
          id: string
          last_read_at: string | null
          user_id: string
        }
        Insert: {
          conversation_id: string
          id?: string
          last_read_at?: string | null
          user_id: string
        }
        Update: {
          conversation_id?: string
          id?: string
          last_read_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      conversations: {
        Row: {
          created_at: string | null
          id: string
          is_archived: boolean | null
          is_archived_one: boolean | null
          is_archived_two: boolean | null
          is_muted_one: boolean | null
          is_muted_two: boolean | null
          last_message_at: string | null
          last_message_preview: string | null
          match_id: string
          message_count: number | null
          metadata: Json | null
          participant_one_id: string | null
          participant_two_id: string | null
          unread_count_one: number | null
          unread_count_two: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_archived?: boolean | null
          is_archived_one?: boolean | null
          is_archived_two?: boolean | null
          is_muted_one?: boolean | null
          is_muted_two?: boolean | null
          last_message_at?: string | null
          last_message_preview?: string | null
          match_id: string
          message_count?: number | null
          metadata?: Json | null
          participant_one_id?: string | null
          participant_two_id?: string | null
          unread_count_one?: number | null
          unread_count_two?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_archived?: boolean | null
          is_archived_one?: boolean | null
          is_archived_two?: boolean | null
          is_muted_one?: boolean | null
          is_muted_two?: boolean | null
          last_message_at?: string | null
          last_message_preview?: string | null
          match_id?: string
          message_count?: number | null
          metadata?: Json | null
          participant_one_id?: string | null
          participant_two_id?: string | null
          unread_count_one?: number | null
          unread_count_two?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'conversations_match_id_fkey'
            columns: ['match_id']
            isOneToOne: false
            referencedRelation: 'matches'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'conversations_participant_one_id_fkey'
            columns: ['participant_one_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'conversations_participant_two_id_fkey'
            columns: ['participant_two_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      dm_messages: {
        Row: {
          body: string
          created_at: string | null
          id: string
          quick_reply_key: string | null
          sender_id: string
          thread_id: string
        }
        Insert: {
          body: string
          created_at?: string | null
          id?: string
          quick_reply_key?: string | null
          sender_id: string
          thread_id: string
        }
        Update: {
          body?: string
          created_at?: string | null
          id?: string
          quick_reply_key?: string | null
          sender_id?: string
          thread_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'dm_messages_thread_id_fkey'
            columns: ['thread_id']
            isOneToOne: false
            referencedRelation: 'dm_threads'
            referencedColumns: ['id']
          },
        ]
      }
      dm_participants: {
        Row: {
          joined_at: string | null
          role: string | null
          thread_id: string
          user_id: string
        }
        Insert: {
          joined_at?: string | null
          role?: string | null
          thread_id: string
          user_id: string
        }
        Update: {
          joined_at?: string | null
          role?: string | null
          thread_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'dm_participants_thread_id_fkey'
            columns: ['thread_id']
            isOneToOne: false
            referencedRelation: 'dm_threads'
            referencedColumns: ['id']
          },
        ]
      }
      dm_threads: {
        Row: {
          created_at: string | null
          created_by: string
          id: string
        }
        Insert: {
          created_at?: string | null
          created_by: string
          id?: string
        }
        Update: {
          created_at?: string | null
          created_by?: string
          id?: string
        }
        Relationships: []
      }
      event_attendees: {
        Row: {
          created_at: string | null
          event_id: string
          id: string
          notes: string | null
          plus_ones: number | null
          status: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          event_id: string
          id?: string
          notes?: string | null
          plus_ones?: number | null
          status?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          event_id?: string
          id?: string
          notes?: string | null
          plus_ones?: number | null
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'event_attendees_event_id_fkey'
            columns: ['event_id']
            isOneToOne: false
            referencedRelation: 'events'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'event_attendees_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      event_invites: {
        Row: {
          created_at: string | null
          event_id: string
          expires_at: string
          id: string
          token: string
        }
        Insert: {
          created_at?: string | null
          event_id: string
          expires_at: string
          id?: string
          token: string
        }
        Update: {
          created_at?: string | null
          event_id?: string
          expires_at?: string
          id?: string
          token?: string
        }
        Relationships: []
      }
      event_members: {
        Row: {
          event_id: string
          joined_at: string | null
          role: string | null
          user_id: string
        }
        Insert: {
          event_id: string
          joined_at?: string | null
          role?: string | null
          user_id: string
        }
        Update: {
          event_id?: string
          joined_at?: string | null
          role?: string | null
          user_id?: string
        }
        Relationships: []
      }
      event_messages: {
        Row: {
          body: string
          created_at: string | null
          event_id: string
          id: string
          sender_id: string
        }
        Insert: {
          body: string
          created_at?: string | null
          event_id: string
          id?: string
          sender_id: string
        }
        Update: {
          body?: string
          created_at?: string | null
          event_id?: string
          id?: string
          sender_id?: string
        }
        Relationships: []
      }
      event_participants: {
        Row: {
          created_at: string | null
          event_id: string
          id: string
          joined_at: string | null
          notes: string | null
          role: string | null
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          event_id: string
          id?: string
          joined_at?: string | null
          notes?: string | null
          role?: string | null
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          event_id?: string
          id?: string
          joined_at?: string | null
          notes?: string | null
          role?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      events: {
        Row: {
          age_restriction: number | null
          approval_required: boolean | null
          created_at: string | null
          current_attendees: number | null
          description: string | null
          end_date: string | null
          end_time: string
          id: string
          image_url: string | null
          is_public: boolean | null
          location: unknown
          location_point: unknown
          max_attendees: number | null
          organizer_id: string
          price_range: string | null
          start_date: string | null
          start_time: string
          status: string | null
          tags: string[] | null
          title: string
          type: Database['public']['Enums']['event_type']
          updated_at: string | null
          venue_address: string | null
          venue_name: string | null
        }
        Insert: {
          age_restriction?: number | null
          approval_required?: boolean | null
          created_at?: string | null
          current_attendees?: number | null
          description?: string | null
          end_date?: string | null
          end_time: string
          id?: string
          image_url?: string | null
          is_public?: boolean | null
          location: unknown
          location_point?: unknown
          max_attendees?: number | null
          organizer_id: string
          price_range?: string | null
          start_date?: string | null
          start_time: string
          status?: string | null
          tags?: string[] | null
          title: string
          type: Database['public']['Enums']['event_type']
          updated_at?: string | null
          venue_address?: string | null
          venue_name?: string | null
        }
        Update: {
          age_restriction?: number | null
          approval_required?: boolean | null
          created_at?: string | null
          current_attendees?: number | null
          description?: string | null
          end_date?: string | null
          end_time?: string
          id?: string
          image_url?: string | null
          is_public?: boolean | null
          location?: unknown
          location_point?: unknown
          max_attendees?: number | null
          organizer_id?: string
          price_range?: string | null
          start_date?: string | null
          start_time?: string
          status?: string | null
          tags?: string[] | null
          title?: string
          type?: Database['public']['Enums']['event_type']
          updated_at?: string | null
          venue_address?: string | null
          venue_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'events_organizer_id_fkey'
            columns: ['organizer_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      favorites: {
        Row: {
          category: string | null
          created_at: string | null
          favorite_id: string
          favorite_user_id: string | null
          id: string
          notes: string | null
          type: string | null
          user_id: string
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          favorite_id: string
          favorite_user_id?: string | null
          id: string
          notes?: string | null
          type?: string | null
          user_id: string
        }
        Update: {
          category?: string | null
          created_at?: string | null
          favorite_id?: string
          favorite_user_id?: string | null
          id?: string
          notes?: string | null
          type?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'favorites_favorite_user_id_fkey'
            columns: ['favorite_user_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      fitness_logs: {
        Row: {
          calories_consumed: number | null
          carbs_grams: number | null
          created_at: string | null
          fats_grams: number | null
          id: string
          log_date: string | null
          notes: string | null
          plan_id: string | null
          protein_grams: number | null
          user_id: string
          weight_kg: number | null
          workout_completed: boolean | null
          workout_details: Json | null
        }
        Insert: {
          calories_consumed?: number | null
          carbs_grams?: number | null
          created_at?: string | null
          fats_grams?: number | null
          id?: string
          log_date?: string | null
          notes?: string | null
          plan_id?: string | null
          protein_grams?: number | null
          user_id: string
          weight_kg?: number | null
          workout_completed?: boolean | null
          workout_details?: Json | null
        }
        Update: {
          calories_consumed?: number | null
          carbs_grams?: number | null
          created_at?: string | null
          fats_grams?: number | null
          id?: string
          log_date?: string | null
          notes?: string | null
          plan_id?: string | null
          protein_grams?: number | null
          user_id?: string
          weight_kg?: number | null
          workout_completed?: boolean | null
          workout_details?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: 'fitness_logs_plan_id_fkey'
            columns: ['plan_id']
            isOneToOne: false
            referencedRelation: 'fitness_plans'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'fitness_logs_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      fitness_plans: {
        Row: {
          created_at: string | null
          diet_plan: Json | null
          goal: string
          id: string
          name: string
          progress: Json | null
          target_calories: number | null
          target_carbs_grams: number | null
          target_fats_grams: number | null
          target_protein_grams: number | null
          updated_at: string | null
          user_id: string
          workout_plan: Json | null
          workouts_per_week: number | null
        }
        Insert: {
          created_at?: string | null
          diet_plan?: Json | null
          goal: string
          id?: string
          name: string
          progress?: Json | null
          target_calories?: number | null
          target_carbs_grams?: number | null
          target_fats_grams?: number | null
          target_protein_grams?: number | null
          updated_at?: string | null
          user_id: string
          workout_plan?: Json | null
          workouts_per_week?: number | null
        }
        Update: {
          created_at?: string | null
          diet_plan?: Json | null
          goal?: string
          id?: string
          name?: string
          progress?: Json | null
          target_calories?: number | null
          target_carbs_grams?: number | null
          target_fats_grams?: number | null
          target_protein_grams?: number | null
          updated_at?: string | null
          user_id?: string
          workout_plan?: Json | null
          workouts_per_week?: number | null
        }
        Relationships: [
          {
            foreignKeyName: 'fitness_plans_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      houseparty: {
        Row: {
          created_at: string | null
          ends_at: string
          geom: unknown
          host_id: string
          id: string
          note: string | null
          starts_at: string
          title: string
          visibility: string | null
        }
        Insert: {
          created_at?: string | null
          ends_at: string
          geom: unknown
          host_id: string
          id?: string
          note?: string | null
          starts_at: string
          title: string
          visibility?: string | null
        }
        Update: {
          created_at?: string | null
          ends_at?: string
          geom?: unknown
          host_id?: string
          id?: string
          note?: string | null
          starts_at?: string
          title?: string
          visibility?: string | null
        }
        Relationships: []
      }
      houseparty_members: {
        Row: {
          joined_at: string | null
          party_id: string
          role: string | null
          user_id: string
        }
        Insert: {
          joined_at?: string | null
          party_id: string
          role?: string | null
          user_id: string
        }
        Update: {
          joined_at?: string | null
          party_id?: string
          role?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'houseparty_members_party_id_fkey'
            columns: ['party_id']
            isOneToOne: false
            referencedRelation: 'houseparty'
            referencedColumns: ['id']
          },
        ]
      }
      interactions: {
        Row: {
          created_at: string | null
          from_user_id: string
          id: string
          metadata: Json | null
          to_user_id: string
          type: Database['public']['Enums']['interaction_type']
        }
        Insert: {
          created_at?: string | null
          from_user_id: string
          id?: string
          metadata?: Json | null
          to_user_id: string
          type: Database['public']['Enums']['interaction_type']
        }
        Update: {
          created_at?: string | null
          from_user_id?: string
          id?: string
          metadata?: Json | null
          to_user_id?: string
          type?: Database['public']['Enums']['interaction_type']
        }
        Relationships: [
          {
            foreignKeyName: 'interactions_from_user_id_fkey'
            columns: ['from_user_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'interactions_to_user_id_fkey'
            columns: ['to_user_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      leaderboard_entries: {
        Row: {
          last_updated_at: string | null
          leaderboard_id: string
          rank: number | null
          score: number | null
          user_id: string
        }
        Insert: {
          last_updated_at?: string | null
          leaderboard_id: string
          rank?: number | null
          score?: number | null
          user_id: string
        }
        Update: {
          last_updated_at?: string | null
          leaderboard_id?: string
          rank?: number | null
          score?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'leaderboard_entries_leaderboard_id_fkey'
            columns: ['leaderboard_id']
            isOneToOne: false
            referencedRelation: 'leaderboards'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'leaderboard_entries_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      leaderboards: {
        Row: {
          end_at: string
          id: string
          metadata: Json | null
          name: string
          scope: string | null
          start_at: string
        }
        Insert: {
          end_at: string
          id?: string
          metadata?: Json | null
          name: string
          scope?: string | null
          start_at: string
        }
        Update: {
          end_at?: string
          id?: string
          metadata?: Json | null
          name?: string
          scope?: string | null
          start_at?: string
        }
        Relationships: []
      }
      levels: {
        Row: {
          badge_url: string | null
          created_at: string | null
          id: number
          level_name: string
          required_points: number
          reward_multiplier: number | null
        }
        Insert: {
          badge_url?: string | null
          created_at?: string | null
          id?: number
          level_name: string
          required_points: number
          reward_multiplier?: number | null
        }
        Update: {
          badge_url?: string | null
          created_at?: string | null
          id?: number
          level_name?: string
          required_points?: number
          reward_multiplier?: number | null
        }
        Relationships: []
      }
      likes: {
        Row: {
          created_at: string | null
          id: string
          liked_id: string
          liker_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          liked_id: string
          liker_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          liked_id?: string
          liker_id?: string
        }
        Relationships: []
      }
      likes_enhanced: {
        Row: {
          created_at: string | null
          expires_at: string | null
          id: string
          is_super_like: boolean | null
          liked_id: string
          liker_id: string
        }
        Insert: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_super_like?: boolean | null
          liked_id: string
          liker_id: string
        }
        Update: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_super_like?: boolean | null
          liked_id?: string
          liker_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'likes_enhanced_liked_id_fkey'
            columns: ['liked_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'likes_enhanced_liker_id_fkey'
            columns: ['liker_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      matches: {
        Row: {
          compatibility_score: number | null
          expires_at: string | null
          id: string
          is_active: boolean | null
          is_mutual: boolean | null
          last_interaction_at: string | null
          match_score: number | null
          matched_at: string | null
          target_user_id: string | null
          user_id: string | null
          user1_id: string
          user2_id: string
        }
        Insert: {
          compatibility_score?: number | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          is_mutual?: boolean | null
          last_interaction_at?: string | null
          match_score?: number | null
          matched_at?: string | null
          target_user_id?: string | null
          user_id?: string | null
          user1_id: string
          user2_id: string
        }
        Update: {
          compatibility_score?: number | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          is_mutual?: boolean | null
          last_interaction_at?: string | null
          match_score?: number | null
          matched_at?: string | null
          target_user_id?: string | null
          user_id?: string | null
          user1_id?: string
          user2_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'matches_target_user_id_fkey'
            columns: ['target_user_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'matches_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'matches_user1_id_fkey'
            columns: ['user1_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'matches_user2_id_fkey'
            columns: ['user2_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      meet_now: {
        Row: {
          can_host: boolean | null
          can_travel: boolean | null
          id: string
          is_active: boolean | null
          lat: string
          lng: string
          radius_km: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          can_host?: boolean | null
          can_travel?: boolean | null
          id: string
          is_active?: boolean | null
          lat: string
          lng: string
          radius_km?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          can_host?: boolean | null
          can_travel?: boolean | null
          id?: string
          is_active?: boolean | null
          lat?: string
          lng?: string
          radius_km?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      message_reactions: {
        Row: {
          created_at: string | null
          emoji: string
          id: string
          message_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          emoji: string
          id: string
          message_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          emoji?: string
          id?: string
          message_id?: string
          user_id?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          attachment_url: string | null
          content: string
          conversation_id: string
          created_at: string | null
          delivered_at: string | null
          expires_at: string | null
          id: string
          is_deleted: boolean | null
          is_ephemeral: boolean | null
          is_read: boolean | null
          message_type: string | null
          metadata: Json | null
          parent_id: string | null
          read_at: string | null
          sender_id: string
          updated_at: string | null
        }
        Insert: {
          attachment_url?: string | null
          content: string
          conversation_id: string
          created_at?: string | null
          delivered_at?: string | null
          expires_at?: string | null
          id?: string
          is_deleted?: boolean | null
          is_ephemeral?: boolean | null
          is_read?: boolean | null
          message_type?: string | null
          metadata?: Json | null
          parent_id?: string | null
          read_at?: string | null
          sender_id: string
          updated_at?: string | null
        }
        Update: {
          attachment_url?: string | null
          content?: string
          conversation_id?: string
          created_at?: string | null
          delivered_at?: string | null
          expires_at?: string | null
          id?: string
          is_deleted?: boolean | null
          is_ephemeral?: boolean | null
          is_read?: boolean | null
          message_type?: string | null
          metadata?: Json | null
          parent_id?: string | null
          read_at?: string | null
          sender_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'messages_conversation_id_fkey'
            columns: ['conversation_id']
            isOneToOne: false
            referencedRelation: 'conversations'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'messages_parent_id_fkey'
            columns: ['parent_id']
            isOneToOne: false
            referencedRelation: 'messages'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'messages_sender_id_fkey'
            columns: ['sender_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      notifications: {
        Row: {
          action_url: string | null
          body: string | null
          created_at: string | null
          data: Json | null
          expires_at: string | null
          id: string
          is_read: boolean | null
          is_sent: boolean | null
          payload: Json | null
          priority: number | null
          pushed_at: string | null
          read: boolean | null
          read_at: string | null
          sent_at: string | null
          title: string
          type: Database['public']['Enums']['notification_type']
          updated_at: string | null
          user_id: string
        }
        Insert: {
          action_url?: string | null
          body?: string | null
          created_at?: string | null
          data?: Json | null
          expires_at?: string | null
          id?: string
          is_read?: boolean | null
          is_sent?: boolean | null
          payload?: Json | null
          priority?: number | null
          pushed_at?: string | null
          read?: boolean | null
          read_at?: string | null
          sent_at?: string | null
          title: string
          type: Database['public']['Enums']['notification_type']
          updated_at?: string | null
          user_id: string
        }
        Update: {
          action_url?: string | null
          body?: string | null
          created_at?: string | null
          data?: Json | null
          expires_at?: string | null
          id?: string
          is_read?: boolean | null
          is_sent?: boolean | null
          payload?: Json | null
          priority?: number | null
          pushed_at?: string | null
          read?: boolean | null
          read_at?: string | null
          sent_at?: string | null
          title?: string
          type?: Database['public']['Enums']['notification_type']
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'notifications_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      panic_logs: {
        Row: {
          actions: string[] | null
          created_at: string | null
          id: string
          ip_address: string | null
          quantum_signature: string | null
          timestamp: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          actions?: string[] | null
          created_at?: string | null
          id?: string
          ip_address?: string | null
          quantum_signature?: string | null
          timestamp?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          actions?: string[] | null
          created_at?: string | null
          id?: string
          ip_address?: string | null
          quantum_signature?: string | null
          timestamp?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      parties: {
        Row: {
          capacity: number | null
          created_at: string | null
          description: string | null
          ends_at: string | null
          host_id: string
          id: string
          is_active: boolean | null
          lat: string | null
          lng: string | null
          location_text: string | null
          starts_at: string
          title: string
          vibe_tags: string[] | null
          visibility: string | null
        }
        Insert: {
          capacity?: number | null
          created_at?: string | null
          description?: string | null
          ends_at?: string | null
          host_id: string
          id?: string
          is_active?: boolean | null
          lat?: string | null
          lng?: string | null
          location_text?: string | null
          starts_at: string
          title: string
          vibe_tags?: string[] | null
          visibility?: string | null
        }
        Update: {
          capacity?: number | null
          created_at?: string | null
          description?: string | null
          ends_at?: string | null
          host_id?: string
          id?: string
          is_active?: boolean | null
          lat?: string | null
          lng?: string | null
          location_text?: string | null
          starts_at?: string
          title?: string
          vibe_tags?: string[] | null
          visibility?: string | null
        }
        Relationships: []
      }
      party_invites: {
        Row: {
          created_at: string | null
          id: string
          invitee_id: string
          inviter_id: string
          message: string | null
          party_id: string
          responded_at: string | null
          status: string | null
        }
        Insert: {
          created_at?: string | null
          id: string
          invitee_id: string
          inviter_id: string
          message?: string | null
          party_id: string
          responded_at?: string | null
          status?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          invitee_id?: string
          inviter_id?: string
          message?: string | null
          party_id?: string
          responded_at?: string | null
          status?: string | null
        }
        Relationships: []
      }
      party_rsvps: {
        Row: {
          created_at: string | null
          id: string
          party_id: string
          status: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id: string
          party_id: string
          status?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          party_id?: string
          status?: string | null
          user_id?: string
        }
        Relationships: []
      }
      photos: {
        Row: {
          blurhash: string | null
          caption: string | null
          created_at: string | null
          file_size: number | null
          height: number | null
          id: string
          is_nsfw: boolean | null
          is_primary: boolean | null
          is_private: boolean | null
          is_verified: boolean | null
          metadata: Json | null
          moderation_status: string | null
          nsfw_score: number | null
          order_index: number | null
          storage_path: string | null
          thumbnail_url: string | null
          updated_at: string | null
          url: string
          user_id: string
          verification_status: Database['public']['Enums']['verification_status'] | null
          width: number | null
        }
        Insert: {
          blurhash?: string | null
          caption?: string | null
          created_at?: string | null
          file_size?: number | null
          height?: number | null
          id?: string
          is_nsfw?: boolean | null
          is_primary?: boolean | null
          is_private?: boolean | null
          is_verified?: boolean | null
          metadata?: Json | null
          moderation_status?: string | null
          nsfw_score?: number | null
          order_index?: number | null
          storage_path?: string | null
          thumbnail_url?: string | null
          updated_at?: string | null
          url: string
          user_id: string
          verification_status?: Database['public']['Enums']['verification_status'] | null
          width?: number | null
        }
        Update: {
          blurhash?: string | null
          caption?: string | null
          created_at?: string | null
          file_size?: number | null
          height?: number | null
          id?: string
          is_nsfw?: boolean | null
          is_primary?: boolean | null
          is_private?: boolean | null
          is_verified?: boolean | null
          metadata?: Json | null
          moderation_status?: string | null
          nsfw_score?: number | null
          order_index?: number | null
          storage_path?: string | null
          thumbnail_url?: string | null
          updated_at?: string | null
          url?: string
          user_id?: string
          verification_status?: Database['public']['Enums']['verification_status'] | null
          width?: number | null
        }
        Relationships: [
          {
            foreignKeyName: 'photos_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      profile_boosts: {
        Row: {
          boost_type: string | null
          ends_at: string
          id: string
          starts_at: string | null
          user_id: string
          views_gained: number | null
        }
        Insert: {
          boost_type?: string | null
          ends_at: string
          id: string
          starts_at?: string | null
          user_id: string
          views_gained?: number | null
        }
        Update: {
          boost_type?: string | null
          ends_at?: string
          id?: string
          starts_at?: string | null
          user_id?: string
          views_gained?: number | null
        }
        Relationships: []
      }
      profile_details: {
        Row: {
          age: number | null
          birth_date: string
          body_hair: string | null
          body_type: string[] | null
          ethnicity: string[] | null
          eye_color: string | null
          gender_identity: string | null
          hair_color: string | null
          height_cm: number | null
          id: string
          piercings: boolean | null
          pronouns: string[] | null
          sexual_orientation: string[] | null
          tattoos: boolean | null
          weight_kg: number | null
        }
        Insert: {
          age?: number | null
          birth_date: string
          body_hair?: string | null
          body_type?: string[] | null
          ethnicity?: string[] | null
          eye_color?: string | null
          gender_identity?: string | null
          hair_color?: string | null
          height_cm?: number | null
          id: string
          piercings?: boolean | null
          pronouns?: string[] | null
          sexual_orientation?: string[] | null
          tattoos?: boolean | null
          weight_kg?: number | null
        }
        Update: {
          age?: number | null
          birth_date?: string
          body_hair?: string | null
          body_type?: string[] | null
          ethnicity?: string[] | null
          eye_color?: string | null
          gender_identity?: string | null
          hair_color?: string | null
          height_cm?: number | null
          id?: string
          piercings?: boolean | null
          pronouns?: string[] | null
          sexual_orientation?: string[] | null
          tattoos?: boolean | null
          weight_kg?: number | null
        }
        Relationships: [
          {
            foreignKeyName: 'profile_details_id_fkey'
            columns: ['id']
            isOneToOne: true
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      profile_embeddings: {
        Row: {
          embedding: string | null
          profile_id: string
          updated_at: string | null
        }
        Insert: {
          embedding?: string | null
          profile_id: string
          updated_at?: string | null
        }
        Update: {
          embedding?: string | null
          profile_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'profile_embeddings_profile_id_fkey'
            columns: ['profile_id']
            isOneToOne: true
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      profile_health: {
        Row: {
          health_privacy_settings: Json | null
          hiv_status: string | null
          id: string
          last_tested_date: string | null
          prep_usage: string | null
          vaccination_status: Json | null
        }
        Insert: {
          health_privacy_settings?: Json | null
          hiv_status?: string | null
          id: string
          last_tested_date?: string | null
          prep_usage?: string | null
          vaccination_status?: Json | null
        }
        Update: {
          health_privacy_settings?: Json | null
          hiv_status?: string | null
          id?: string
          last_tested_date?: string | null
          prep_usage?: string | null
          vaccination_status?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: 'profile_health_id_fkey'
            columns: ['id']
            isOneToOne: true
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      profile_lifestyle: {
        Row: {
          education_level: string | null
          hobbies: string[] | null
          id: string
          interests: string[] | null
          languages: string[] | null
          looking_for: string[] | null
          meet_at: string | null
          occupation: string | null
          relationship_status: string | null
          tribes: string[] | null
        }
        Insert: {
          education_level?: string | null
          hobbies?: string[] | null
          id: string
          interests?: string[] | null
          languages?: string[] | null
          looking_for?: string[] | null
          meet_at?: string | null
          occupation?: string | null
          relationship_status?: string | null
          tribes?: string[] | null
        }
        Update: {
          education_level?: string | null
          hobbies?: string[] | null
          id?: string
          interests?: string[] | null
          languages?: string[] | null
          looking_for?: string[] | null
          meet_at?: string | null
          occupation?: string | null
          relationship_status?: string | null
          tribes?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: 'profile_lifestyle_id_fkey'
            columns: ['id']
            isOneToOne: true
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      profile_location: {
        Row: {
          address: string | null
          city: string | null
          coordinates: unknown
          country: string | null
          id: string
          location_visibility: string | null
          postal_code: string | null
          state: string | null
          timezone: string | null
          travel_radius_km: number | null
          willing_to_relocate: boolean | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          coordinates?: unknown
          country?: string | null
          id: string
          location_visibility?: string | null
          postal_code?: string | null
          state?: string | null
          timezone?: string | null
          travel_radius_km?: number | null
          willing_to_relocate?: boolean | null
        }
        Update: {
          address?: string | null
          city?: string | null
          coordinates?: unknown
          country?: string | null
          id?: string
          location_visibility?: string | null
          postal_code?: string | null
          state?: string | null
          timezone?: string | null
          travel_radius_km?: number | null
          willing_to_relocate?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: 'profile_location_id_fkey'
            columns: ['id']
            isOneToOne: true
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      profile_media: {
        Row: {
          caption: string | null
          id: string
          is_approved: boolean | null
          is_primary: boolean | null
          media_type: string
          metadata: Json | null
          position: number | null
          thumbnail_url: string | null
          uploaded_at: string | null
          url: string
          user_id: string
        }
        Insert: {
          caption?: string | null
          id?: string
          is_approved?: boolean | null
          is_primary?: boolean | null
          media_type: string
          metadata?: Json | null
          position?: number | null
          thumbnail_url?: string | null
          uploaded_at?: string | null
          url: string
          user_id: string
        }
        Update: {
          caption?: string | null
          id?: string
          is_approved?: boolean | null
          is_primary?: boolean | null
          media_type?: string
          metadata?: Json | null
          position?: number | null
          thumbnail_url?: string | null
          uploaded_at?: string | null
          url?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'profile_media_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      profile_preferences: {
        Row: {
          age_max: number | null
          age_min: number | null
          dealbreakers: Json | null
          id: string
          max_distance_km: number | null
          preferences_json: Json | null
          preferred_genders: string[] | null
          preferred_relationship_types: string[] | null
        }
        Insert: {
          age_max?: number | null
          age_min?: number | null
          dealbreakers?: Json | null
          id: string
          max_distance_km?: number | null
          preferences_json?: Json | null
          preferred_genders?: string[] | null
          preferred_relationship_types?: string[] | null
        }
        Update: {
          age_max?: number | null
          age_min?: number | null
          dealbreakers?: Json | null
          id?: string
          max_distance_km?: number | null
          preferences_json?: Json | null
          preferred_genders?: string[] | null
          preferred_relationship_types?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: 'profile_preferences_id_fkey'
            columns: ['id']
            isOneToOne: true
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      profile_private: {
        Row: {
          created_at: string | null
          email: string
          phone: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          email: string
          phone?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          email?: string
          phone?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profile_settings: {
        Row: {
          auto_translate: boolean | null
          blocked_keywords: string[] | null
          id: string
          incognito_mode: boolean | null
          notification_settings: Json | null
          privacy_settings: Json | null
          profile_visibility: string | null
          show_age: boolean | null
          show_distance: boolean | null
        }
        Insert: {
          auto_translate?: boolean | null
          blocked_keywords?: string[] | null
          id: string
          incognito_mode?: boolean | null
          notification_settings?: Json | null
          privacy_settings?: Json | null
          profile_visibility?: string | null
          show_age?: boolean | null
          show_distance?: boolean | null
        }
        Update: {
          auto_translate?: boolean | null
          blocked_keywords?: string[] | null
          id?: string
          incognito_mode?: boolean | null
          notification_settings?: Json | null
          privacy_settings?: Json | null
          profile_visibility?: string | null
          show_age?: boolean | null
          show_distance?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: 'profile_settings_id_fkey'
            columns: ['id']
            isOneToOne: true
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      profile_stats: {
        Row: {
          created_at: string | null
          id: string
          last_active: string | null
          likes_count: number | null
          matches_count: number | null
          messages_received: number | null
          messages_sent: number | null
          popularity_score: number | null
          profile_completion_percentage: number | null
          response_rate: number | null
          updated_at: string | null
          views_count: number | null
        }
        Insert: {
          created_at?: string | null
          id: string
          last_active?: string | null
          likes_count?: number | null
          matches_count?: number | null
          messages_received?: number | null
          messages_sent?: number | null
          popularity_score?: number | null
          profile_completion_percentage?: number | null
          response_rate?: number | null
          updated_at?: string | null
          views_count?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          last_active?: string | null
          likes_count?: number | null
          matches_count?: number | null
          messages_received?: number | null
          messages_sent?: number | null
          popularity_score?: number | null
          profile_completion_percentage?: number | null
          response_rate?: number | null
          updated_at?: string | null
          views_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: 'profile_stats_id_fkey'
            columns: ['id']
            isOneToOne: true
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      profile_translations: {
        Row: {
          created_at: string | null
          language_code: string
          profile_id: string
          translated_bio: string | null
          translated_status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          language_code: string
          profile_id: string
          translated_bio?: string | null
          translated_status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          language_code?: string
          profile_id?: string
          translated_bio?: string | null
          translated_status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'profile_translations_profile_id_fkey'
            columns: ['profile_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      profile_verification: {
        Row: {
          email_verified: boolean | null
          face_match_score: number | null
          id: string
          id_document_url: string | null
          is_verified: boolean | null
          phone_verified: boolean | null
          social_links: Json | null
          verification_date: string | null
          verification_method: string | null
          verification_status: string | null
        }
        Insert: {
          email_verified?: boolean | null
          face_match_score?: number | null
          id: string
          id_document_url?: string | null
          is_verified?: boolean | null
          phone_verified?: boolean | null
          social_links?: Json | null
          verification_date?: string | null
          verification_method?: string | null
          verification_status?: string | null
        }
        Update: {
          email_verified?: boolean | null
          face_match_score?: number | null
          id?: string
          id_document_url?: string | null
          is_verified?: boolean | null
          phone_verified?: boolean | null
          social_links?: Json | null
          verification_date?: string | null
          verification_method?: string | null
          verification_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'profile_verification_id_fkey'
            columns: ['id']
            isOneToOne: true
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      profile_views: {
        Row: {
          came_from: string | null
          device_type: string | null
          duration_seconds: number | null
          id: string
          viewed_at: string | null
          viewed_id: string
          viewer_id: string
        }
        Insert: {
          came_from?: string | null
          device_type?: string | null
          duration_seconds?: number | null
          id?: string
          viewed_at?: string | null
          viewed_id: string
          viewer_id: string
        }
        Update: {
          came_from?: string | null
          device_type?: string | null
          duration_seconds?: number | null
          id?: string
          viewed_at?: string | null
          viewed_id?: string
          viewer_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'profile_views_viewed_id_fkey'
            columns: ['viewed_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'profile_views_viewer_id_fkey'
            columns: ['viewer_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      profiles: {
        Row: {
          about_me: string | null
          abuse_history: boolean | null
          account_status: Database['public']['Enums']['account_status'] | null
          age: number
          ai_compatibility_factors: Json | null
          ai_enhanced_bio: string | null
          ai_optimization_score: number | null
          ai_preferences: Json | null
          ai_profile_score: number | null
          allow_messages_from: string | null
          appear_offline: boolean | null
          auto_translate: boolean | null
          availability_message: string | null
          available_now: boolean | null
          avatar_url: string | null
          average_rating: number | null
          average_response_time: unknown
          banned_reason: string | null
          banned_until: string | null
          bareback_negotiable: boolean | null
          bareback_notes_private: string | null
          bareback_preference: string | null
          beard: string | null
          bio: string | null
          birth_date: string
          block_count: number | null
          body_type: string[] | null
          city: string | null
          condom_use: string | null
          consent_flags: Json | null
          content_preferences: Json | null
          country: string | null
          country_code: string | null
          created_at: string | null
          custom_status: string | null
          deleted_at: string | null
          disability_tags: string[] | null
          discovery_preferences: Json | null
          display_name: string
          education_level: string | null
          email: string | null
          engagement_score: number | null
          escort_status: boolean | null
          ethnicity: string[] | null
          external_links: Json | null
          eye_color: string | null
          fame_rating: number | null
          favorites_received: number | null
          fitness_level: string | null
          gdpr_settings: Json | null
          gender: string | null
          gps_fuzzing_radius_km: number | null
          hair_color: string | null
          has_face_photo: boolean | null
          has_nsfw_photos: boolean | null
          headline: string | null
          health_education_optin: boolean | null
          health_privacy_settings: Json | null
          health_visibility: Json | null
          height_cm: number | null
          hide_distance: boolean | null
          hide_profile_visits: boolean | null
          hiv_since_date: string | null
          hiv_status: string | null
          hourly_rate: number | null
          i18n_locale: string | null
          id: string
          ideal_match: string | null
          incognito_mode: boolean | null
          interests: string[] | null
          is_active: boolean | null
          is_admin: boolean | null
          is_available_now: boolean | null
          is_banned: boolean | null
          is_ghost_mode: boolean | null
          is_incognito: boolean | null
          is_premium: boolean | null
          is_verified: boolean | null
          kink_intensity: number | null
          kink_notes: string | null
          kink_tags: Database['public']['Enums']['kink_fetish_type'][] | null
          kink_tags_custom: string[] | null
          languages: string[] | null
          last_active_at: string | null
          last_location_update: string | null
          last_profile_update: string | null
          last_seen_at: string | null
          last_tested_date: string | null
          like_count: number | null
          location: unknown
          location_fuzzed: unknown
          location_point: unknown
          looking_for: string[] | null
          looking_for_description: string | null
          machobb_tribes: string[] | null
          match_count: number | null
          meet_at: string | null
          mental_health_tags: string[] | null
          message_count: number | null
          messages_received: number | null
          messages_sent: number | null
          metadata: Json | null
          moderation_notes: string | null
          nsfw_consent: boolean | null
          occupation: string | null
          onboarding_completed: boolean | null
          onboarding_step: number | null
          online_status: string | null
          online_status_visible: boolean | null
          open_relationship_only: boolean | null
          photo_count: number | null
          photos: Json | null
          piercings: string[] | null
          popularity_score: number | null
          position: string | null
          preferences: Json | null
          premium_expires_at: string | null
          prep_usage: string | null
          presence: Database['public']['Enums']['presence_status'] | null
          privacy_level: Database['public']['Enums']['privacy_level'] | null
          profile_clicks: number | null
          profile_completeness: number | null
          profile_completion_score: number | null
          profile_data: Json | null
          profile_views: number | null
          profile_visibility: Database['public']['Enums']['profile_visibility'] | null
          pronouns: string[] | null
          quickshare_photos: Json | null
          read_receipts_enabled: boolean | null
          relational_tags: string[] | null
          relationship_status: string | null
          report_count: number | null
          response_rate: number | null
          response_time: string | null
          reviews_count: number | null
          role: Database['public']['Enums']['user_role'] | null
          safety_flags: string[] | null
          safety_trust_score: number | null
          search_vector: unknown
          seeking_gender: string | null
          settings: Json | null
          sexual_orientation: string[] | null
          show_age: boolean | null
          show_distance: boolean | null
          sobriety_status: string | null
          social_links: Json | null
          status_emoji: string | null
          status_text: string | null
          sti_test_frequency: string | null
          story_updates: Json | null
          stripe_customer_id: string | null
          style_tags: string[] | null
          subscription_expires_at: string | null
          subscription_id: string | null
          subscription_status: Database['public']['Enums']['subscription_status'] | null
          subscription_tier: Database['public']['Enums']['subscription_tier'] | null
          tattoos: string[] | null
          travel_arrival_date: string | null
          travel_city: string | null
          travel_country: string | null
          travel_departure_date: string | null
          travel_destination: string | null
          travel_mode_enabled: boolean | null
          travel_notes: string | null
          travel_visibility: string | null
          tribes: string[] | null
          updated_at: string | null
          user_id: string
          user_tier: Database['public']['Enums']['user_tier'] | null
          username: string
          username_slug: string | null
          vaccination_status: Json | null
          verification_status: Database['public']['Enums']['verification_status'] | null
          verified_email: boolean | null
          verified_id: boolean | null
          verified_phone: boolean | null
          verified_photo: boolean | null
          video_clips: Json | null
          view_count: number | null
          visitor_count_30d: number | null
          visitor_count_7d: number | null
          voice_notes: Json | null
          voice_pref: string | null
          weight_kg: number | null
          xxx_visibility: string | null
        }
        Insert: {
          about_me?: string | null
          abuse_history?: boolean | null
          account_status?: Database['public']['Enums']['account_status'] | null
          age: number
          ai_compatibility_factors?: Json | null
          ai_enhanced_bio?: string | null
          ai_optimization_score?: number | null
          ai_preferences?: Json | null
          ai_profile_score?: number | null
          allow_messages_from?: string | null
          appear_offline?: boolean | null
          auto_translate?: boolean | null
          availability_message?: string | null
          available_now?: boolean | null
          avatar_url?: string | null
          average_rating?: number | null
          average_response_time?: unknown
          banned_reason?: string | null
          banned_until?: string | null
          bareback_negotiable?: boolean | null
          bareback_notes_private?: string | null
          bareback_preference?: string | null
          beard?: string | null
          bio?: string | null
          birth_date: string
          block_count?: number | null
          body_type?: string[] | null
          city?: string | null
          condom_use?: string | null
          consent_flags?: Json | null
          content_preferences?: Json | null
          country?: string | null
          country_code?: string | null
          created_at?: string | null
          custom_status?: string | null
          deleted_at?: string | null
          disability_tags?: string[] | null
          discovery_preferences?: Json | null
          display_name: string
          education_level?: string | null
          email?: string | null
          engagement_score?: number | null
          escort_status?: boolean | null
          ethnicity?: string[] | null
          external_links?: Json | null
          eye_color?: string | null
          fame_rating?: number | null
          favorites_received?: number | null
          fitness_level?: string | null
          gdpr_settings?: Json | null
          gender?: string | null
          gps_fuzzing_radius_km?: number | null
          hair_color?: string | null
          has_face_photo?: boolean | null
          has_nsfw_photos?: boolean | null
          headline?: string | null
          health_education_optin?: boolean | null
          health_privacy_settings?: Json | null
          health_visibility?: Json | null
          height_cm?: number | null
          hide_distance?: boolean | null
          hide_profile_visits?: boolean | null
          hiv_since_date?: string | null
          hiv_status?: string | null
          hourly_rate?: number | null
          i18n_locale?: string | null
          id?: string
          ideal_match?: string | null
          incognito_mode?: boolean | null
          interests?: string[] | null
          is_active?: boolean | null
          is_admin?: boolean | null
          is_available_now?: boolean | null
          is_banned?: boolean | null
          is_ghost_mode?: boolean | null
          is_incognito?: boolean | null
          is_premium?: boolean | null
          is_verified?: boolean | null
          kink_intensity?: number | null
          kink_notes?: string | null
          kink_tags?: Database['public']['Enums']['kink_fetish_type'][] | null
          kink_tags_custom?: string[] | null
          languages?: string[] | null
          last_active_at?: string | null
          last_location_update?: string | null
          last_profile_update?: string | null
          last_seen_at?: string | null
          last_tested_date?: string | null
          like_count?: number | null
          location: unknown
          location_fuzzed?: unknown
          location_point?: unknown
          looking_for?: string[] | null
          looking_for_description?: string | null
          machobb_tribes?: string[] | null
          match_count?: number | null
          meet_at?: string | null
          mental_health_tags?: string[] | null
          message_count?: number | null
          messages_received?: number | null
          messages_sent?: number | null
          metadata?: Json | null
          moderation_notes?: string | null
          nsfw_consent?: boolean | null
          occupation?: string | null
          onboarding_completed?: boolean | null
          onboarding_step?: number | null
          online_status?: string | null
          online_status_visible?: boolean | null
          open_relationship_only?: boolean | null
          photo_count?: number | null
          photos?: Json | null
          piercings?: string[] | null
          popularity_score?: number | null
          position?: string | null
          preferences?: Json | null
          premium_expires_at?: string | null
          prep_usage?: string | null
          presence?: Database['public']['Enums']['presence_status'] | null
          privacy_level?: Database['public']['Enums']['privacy_level'] | null
          profile_clicks?: number | null
          profile_completeness?: number | null
          profile_completion_score?: number | null
          profile_data?: Json | null
          profile_views?: number | null
          profile_visibility?: Database['public']['Enums']['profile_visibility'] | null
          pronouns?: string[] | null
          quickshare_photos?: Json | null
          read_receipts_enabled?: boolean | null
          relational_tags?: string[] | null
          relationship_status?: string | null
          report_count?: number | null
          response_rate?: number | null
          response_time?: string | null
          reviews_count?: number | null
          role?: Database['public']['Enums']['user_role'] | null
          safety_flags?: string[] | null
          safety_trust_score?: number | null
          search_vector?: unknown
          seeking_gender?: string | null
          settings?: Json | null
          sexual_orientation?: string[] | null
          show_age?: boolean | null
          show_distance?: boolean | null
          sobriety_status?: string | null
          social_links?: Json | null
          status_emoji?: string | null
          status_text?: string | null
          sti_test_frequency?: string | null
          story_updates?: Json | null
          stripe_customer_id?: string | null
          style_tags?: string[] | null
          subscription_expires_at?: string | null
          subscription_id?: string | null
          subscription_status?: Database['public']['Enums']['subscription_status'] | null
          subscription_tier?: Database['public']['Enums']['subscription_tier'] | null
          tattoos?: string[] | null
          travel_arrival_date?: string | null
          travel_city?: string | null
          travel_country?: string | null
          travel_departure_date?: string | null
          travel_destination?: string | null
          travel_mode_enabled?: boolean | null
          travel_notes?: string | null
          travel_visibility?: string | null
          tribes?: string[] | null
          updated_at?: string | null
          user_id: string
          user_tier?: Database['public']['Enums']['user_tier'] | null
          username: string
          username_slug?: string | null
          vaccination_status?: Json | null
          verification_status?: Database['public']['Enums']['verification_status'] | null
          verified_email?: boolean | null
          verified_id?: boolean | null
          verified_phone?: boolean | null
          verified_photo?: boolean | null
          video_clips?: Json | null
          view_count?: number | null
          visitor_count_30d?: number | null
          visitor_count_7d?: number | null
          voice_notes?: Json | null
          voice_pref?: string | null
          weight_kg?: number | null
          xxx_visibility?: string | null
        }
        Update: {
          about_me?: string | null
          abuse_history?: boolean | null
          account_status?: Database['public']['Enums']['account_status'] | null
          age?: number
          ai_compatibility_factors?: Json | null
          ai_enhanced_bio?: string | null
          ai_optimization_score?: number | null
          ai_preferences?: Json | null
          ai_profile_score?: number | null
          allow_messages_from?: string | null
          appear_offline?: boolean | null
          auto_translate?: boolean | null
          availability_message?: string | null
          available_now?: boolean | null
          avatar_url?: string | null
          average_rating?: number | null
          average_response_time?: unknown
          banned_reason?: string | null
          banned_until?: string | null
          bareback_negotiable?: boolean | null
          bareback_notes_private?: string | null
          bareback_preference?: string | null
          beard?: string | null
          bio?: string | null
          birth_date?: string
          block_count?: number | null
          body_type?: string[] | null
          city?: string | null
          condom_use?: string | null
          consent_flags?: Json | null
          content_preferences?: Json | null
          country?: string | null
          country_code?: string | null
          created_at?: string | null
          custom_status?: string | null
          deleted_at?: string | null
          disability_tags?: string[] | null
          discovery_preferences?: Json | null
          display_name?: string
          education_level?: string | null
          email?: string | null
          engagement_score?: number | null
          escort_status?: boolean | null
          ethnicity?: string[] | null
          external_links?: Json | null
          eye_color?: string | null
          fame_rating?: number | null
          favorites_received?: number | null
          fitness_level?: string | null
          gdpr_settings?: Json | null
          gender?: string | null
          gps_fuzzing_radius_km?: number | null
          hair_color?: string | null
          has_face_photo?: boolean | null
          has_nsfw_photos?: boolean | null
          headline?: string | null
          health_education_optin?: boolean | null
          health_privacy_settings?: Json | null
          health_visibility?: Json | null
          height_cm?: number | null
          hide_distance?: boolean | null
          hide_profile_visits?: boolean | null
          hiv_since_date?: string | null
          hiv_status?: string | null
          hourly_rate?: number | null
          i18n_locale?: string | null
          id?: string
          ideal_match?: string | null
          incognito_mode?: boolean | null
          interests?: string[] | null
          is_active?: boolean | null
          is_admin?: boolean | null
          is_available_now?: boolean | null
          is_banned?: boolean | null
          is_ghost_mode?: boolean | null
          is_incognito?: boolean | null
          is_premium?: boolean | null
          is_verified?: boolean | null
          kink_intensity?: number | null
          kink_notes?: string | null
          kink_tags?: Database['public']['Enums']['kink_fetish_type'][] | null
          kink_tags_custom?: string[] | null
          languages?: string[] | null
          last_active_at?: string | null
          last_location_update?: string | null
          last_profile_update?: string | null
          last_seen_at?: string | null
          last_tested_date?: string | null
          like_count?: number | null
          location?: unknown
          location_fuzzed?: unknown
          location_point?: unknown
          looking_for?: string[] | null
          looking_for_description?: string | null
          machobb_tribes?: string[] | null
          match_count?: number | null
          meet_at?: string | null
          mental_health_tags?: string[] | null
          message_count?: number | null
          messages_received?: number | null
          messages_sent?: number | null
          metadata?: Json | null
          moderation_notes?: string | null
          nsfw_consent?: boolean | null
          occupation?: string | null
          onboarding_completed?: boolean | null
          onboarding_step?: number | null
          online_status?: string | null
          online_status_visible?: boolean | null
          open_relationship_only?: boolean | null
          photo_count?: number | null
          photos?: Json | null
          piercings?: string[] | null
          popularity_score?: number | null
          position?: string | null
          preferences?: Json | null
          premium_expires_at?: string | null
          prep_usage?: string | null
          presence?: Database['public']['Enums']['presence_status'] | null
          privacy_level?: Database['public']['Enums']['privacy_level'] | null
          profile_clicks?: number | null
          profile_completeness?: number | null
          profile_completion_score?: number | null
          profile_data?: Json | null
          profile_views?: number | null
          profile_visibility?: Database['public']['Enums']['profile_visibility'] | null
          pronouns?: string[] | null
          quickshare_photos?: Json | null
          read_receipts_enabled?: boolean | null
          relational_tags?: string[] | null
          relationship_status?: string | null
          report_count?: number | null
          response_rate?: number | null
          response_time?: string | null
          reviews_count?: number | null
          role?: Database['public']['Enums']['user_role'] | null
          safety_flags?: string[] | null
          safety_trust_score?: number | null
          search_vector?: unknown
          seeking_gender?: string | null
          settings?: Json | null
          sexual_orientation?: string[] | null
          show_age?: boolean | null
          show_distance?: boolean | null
          sobriety_status?: string | null
          social_links?: Json | null
          status_emoji?: string | null
          status_text?: string | null
          sti_test_frequency?: string | null
          story_updates?: Json | null
          stripe_customer_id?: string | null
          style_tags?: string[] | null
          subscription_expires_at?: string | null
          subscription_id?: string | null
          subscription_status?: Database['public']['Enums']['subscription_status'] | null
          subscription_tier?: Database['public']['Enums']['subscription_tier'] | null
          tattoos?: string[] | null
          travel_arrival_date?: string | null
          travel_city?: string | null
          travel_country?: string | null
          travel_departure_date?: string | null
          travel_destination?: string | null
          travel_mode_enabled?: boolean | null
          travel_notes?: string | null
          travel_visibility?: string | null
          tribes?: string[] | null
          updated_at?: string | null
          user_id?: string
          user_tier?: Database['public']['Enums']['user_tier'] | null
          username?: string
          username_slug?: string | null
          vaccination_status?: Json | null
          verification_status?: Database['public']['Enums']['verification_status'] | null
          verified_email?: boolean | null
          verified_id?: boolean | null
          verified_phone?: boolean | null
          verified_photo?: boolean | null
          video_clips?: Json | null
          view_count?: number | null
          visitor_count_30d?: number | null
          visitor_count_7d?: number | null
          voice_notes?: Json | null
          voice_pref?: string | null
          weight_kg?: number | null
          xxx_visibility?: string | null
        }
        Relationships: []
      }
      push_tokens: {
        Row: {
          created_at: string | null
          device_info: Json | null
          id: string
          last_used_at: string | null
          platform: string
          token: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          device_info?: Json | null
          id?: string
          last_used_at?: string | null
          platform: string
          token: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          device_info?: Json | null
          id?: string
          last_used_at?: string | null
          platform?: string
          token?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'push_tokens_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      quick_replies: {
        Row: {
          entries: Json | null
          user_id: string
        }
        Insert: {
          entries?: Json | null
          user_id: string
        }
        Update: {
          entries?: Json | null
          user_id?: string
        }
        Relationships: []
      }
      rate_limits: {
        Row: {
          action_count: number | null
          action_type: string
          created_at: string | null
          id: string
          is_blocked: boolean | null
          user_id: string
          window_end: string | null
          window_start: string | null
        }
        Insert: {
          action_count?: number | null
          action_type: string
          created_at?: string | null
          id?: string
          is_blocked?: boolean | null
          user_id: string
          window_end?: string | null
          window_start?: string | null
        }
        Update: {
          action_count?: number | null
          action_type?: string
          created_at?: string | null
          id?: string
          is_blocked?: boolean | null
          user_id?: string
          window_end?: string | null
          window_start?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'rate_limits_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      reports: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          reason: string
          reported_id: string
          reported_user_id: string | null
          reporter_id: string
          review_notes: string | null
          reviewed_by: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          reason: string
          reported_id: string
          reported_user_id?: string | null
          reporter_id: string
          review_notes?: string | null
          reviewed_by?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          reason?: string
          reported_id?: string
          reported_user_id?: string | null
          reporter_id?: string
          review_notes?: string | null
          reviewed_by?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'reports_reported_id_fkey'
            columns: ['reported_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'reports_reported_user_id_fkey'
            columns: ['reported_user_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'reports_reporter_id_fkey'
            columns: ['reporter_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'reports_reviewed_by_fkey'
            columns: ['reviewed_by']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      reviews: {
        Row: {
          booking_id: string | null
          content: string | null
          created_at: string | null
          id: string
          is_verified: boolean | null
          rating: number
          reviewed_user_id: string
          reviewer_id: string
          title: string | null
        }
        Insert: {
          booking_id?: string | null
          content?: string | null
          created_at?: string | null
          id?: string
          is_verified?: boolean | null
          rating: number
          reviewed_user_id: string
          reviewer_id: string
          title?: string | null
        }
        Update: {
          booking_id?: string | null
          content?: string | null
          created_at?: string | null
          id?: string
          is_verified?: boolean | null
          rating?: number
          reviewed_user_id?: string
          reviewer_id?: string
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'reviews_booking_id_fkey'
            columns: ['booking_id']
            isOneToOne: false
            referencedRelation: 'bookings'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'reviews_reviewed_user_id_fkey'
            columns: ['reviewed_user_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'reviews_reviewer_id_fkey'
            columns: ['reviewer_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      right_now_posts: {
        Row: {
          created_at: string | null
          expires_at: string
          id: string
          intent: string
          is_active: boolean | null
          message: string | null
          photo_url: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          expires_at: string
          id: string
          intent: string
          is_active?: boolean | null
          message?: string | null
          photo_url?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          expires_at?: string
          id?: string
          intent?: string
          is_active?: boolean | null
          message?: string | null
          photo_url?: string | null
          user_id?: string
        }
        Relationships: []
      }
      safety_checkins: {
        Row: {
          contact_info: string | null
          contact_name: string | null
          created_at: string | null
          id: string
          scheduled_at: string
          status: string | null
          triggered_at: string | null
          user_id: string
        }
        Insert: {
          contact_info?: string | null
          contact_name?: string | null
          created_at?: string | null
          id?: string
          scheduled_at: string
          status?: string | null
          triggered_at?: string | null
          user_id: string
        }
        Update: {
          contact_info?: string | null
          contact_name?: string | null
          created_at?: string | null
          id?: string
          scheduled_at?: string
          status?: string | null
          triggered_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'safety_checkins_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      safety_reports: {
        Row: {
          created_at: string | null
          description: string
          evidence_urls: string[] | null
          id: string
          reason: string
          reported_user_id: string
          reporter_id: string
          resolved_at: string | null
          status: string | null
        }
        Insert: {
          created_at?: string | null
          description: string
          evidence_urls?: string[] | null
          id?: string
          reason: string
          reported_user_id: string
          reporter_id: string
          resolved_at?: string | null
          status?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          evidence_urls?: string[] | null
          id?: string
          reason?: string
          reported_user_id?: string
          reporter_id?: string
          resolved_at?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'safety_reports_reported_user_id_fkey'
            columns: ['reported_user_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'safety_reports_reporter_id_fkey'
            columns: ['reporter_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      safety_warnings: {
        Row: {
          acknowledged: boolean | null
          id: string
          issued_at: string | null
          reason: string
          user_id: string
        }
        Insert: {
          acknowledged?: boolean | null
          id?: string
          issued_at?: string | null
          reason: string
          user_id: string
        }
        Update: {
          acknowledged?: boolean | null
          id?: string
          issued_at?: string | null
          reason?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'safety_warnings_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      schema_migrations: {
        Row: {
          applied_at: string | null
          version: string
        }
        Insert: {
          applied_at?: string | null
          version: string
        }
        Update: {
          applied_at?: string | null
          version?: string
        }
        Relationships: []
      }
      sessions: {
        Row: {
          expire: string
          sess: Json
          sid: string
        }
        Insert: {
          expire: string
          sess: Json
          sid: string
        }
        Update: {
          expire?: string
          sess?: Json
          sid?: string
        }
        Relationships: []
      }
      smart_assistant_configs: {
        Row: {
          auto_approve_photos: boolean | null
          auto_reply_enabled: boolean | null
          auto_reply_text: string | null
          excluded_tribes: string[] | null
          id: string
          is_enabled: boolean | null
          max_age: number | null
          max_distance_km: number | null
          min_age: number | null
          required_tribes: string[] | null
          trigger_keywords: string[] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          auto_approve_photos?: boolean | null
          auto_reply_enabled?: boolean | null
          auto_reply_text?: string | null
          excluded_tribes?: string[] | null
          id?: string
          is_enabled?: boolean | null
          max_age?: number | null
          max_distance_km?: number | null
          min_age?: number | null
          required_tribes?: string[] | null
          trigger_keywords?: string[] | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          auto_approve_photos?: boolean | null
          auto_reply_enabled?: boolean | null
          auto_reply_text?: string | null
          excluded_tribes?: string[] | null
          id?: string
          is_enabled?: boolean | null
          max_age?: number | null
          max_distance_km?: number | null
          min_age?: number | null
          required_tribes?: string[] | null
          trigger_keywords?: string[] | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      spatial_ref_sys: {
        Row: {
          auth_name: string | null
          auth_srid: number | null
          proj4text: string | null
          srid: number
          srtext: string | null
        }
        Insert: {
          auth_name?: string | null
          auth_srid?: number | null
          proj4text?: string | null
          srid: number
          srtext?: string | null
        }
        Update: {
          auth_name?: string | null
          auth_srid?: number | null
          proj4text?: string | null
          srid?: number
          srtext?: string | null
        }
        Relationships: []
      }
      stories: {
        Row: {
          created_at: string | null
          expires_at: string
          id: string
          media_type: string | null
          media_url: string
          user_id: string
          view_count: number | null
        }
        Insert: {
          created_at?: string | null
          expires_at?: string
          id?: string
          media_type?: string | null
          media_url: string
          user_id: string
          view_count?: number | null
        }
        Update: {
          created_at?: string | null
          expires_at?: string
          id?: string
          media_type?: string | null
          media_url?: string
          user_id?: string
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: 'stories_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      stripe_customers: {
        Row: {
          created_at: string | null
          customer_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          customer_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          customer_id?: string
          user_id?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          cancel_at_period_end: boolean | null
          created_at: string | null
          current_period_end: string | null
          current_period_start: string | null
          id: string
          metadata: Json | null
          status: Database['public']['Enums']['subscription_status']
          stripe_subscription_id: string | null
          tier: Database['public']['Enums']['user_tier']
          updated_at: string | null
          user_id: string
        }
        Insert: {
          cancel_at_period_end?: boolean | null
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          metadata?: Json | null
          status: Database['public']['Enums']['subscription_status']
          stripe_subscription_id?: string | null
          tier: Database['public']['Enums']['user_tier']
          updated_at?: string | null
          user_id: string
        }
        Update: {
          cancel_at_period_end?: boolean | null
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          metadata?: Json | null
          status?: Database['public']['Enums']['subscription_status']
          stripe_subscription_id?: string | null
          tier?: Database['public']['Enums']['user_tier']
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'subscriptions_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      taps: {
        Row: {
          created_at: string | null
          id: string
          is_read: boolean | null
          receiver_id: string
          seen: boolean | null
          sender_id: string
          type: string | null
        }
        Insert: {
          created_at?: string | null
          id: string
          is_read?: boolean | null
          receiver_id: string
          seen?: boolean | null
          sender_id: string
          type?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          receiver_id?: string
          seen?: boolean | null
          sender_id?: string
          type?: string | null
        }
        Relationships: []
      }
      travel_plans: {
        Row: {
          activities: string[] | null
          arrival_date: string
          created_at: string | null
          departure_date: string
          destination: string
          destination_location: unknown
          id: string
          interests: string[] | null
          user_id: string
          visibility: string | null
        }
        Insert: {
          activities?: string[] | null
          arrival_date: string
          created_at?: string | null
          departure_date: string
          destination: string
          destination_location?: unknown
          id?: string
          interests?: string[] | null
          user_id: string
          visibility?: string | null
        }
        Update: {
          activities?: string[] | null
          arrival_date?: string
          created_at?: string | null
          departure_date?: string
          destination?: string
          destination_location?: unknown
          id?: string
          interests?: string[] | null
          user_id?: string
          visibility?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'travel_plans_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      typing_indicators: {
        Row: {
          conversation_id: string
          id: string
          is_typing: boolean | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          conversation_id: string
          id: string
          is_typing?: boolean | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          conversation_id?: string
          id?: string
          is_typing?: boolean | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_badges: {
        Row: {
          badge_type: string
          earned_at: string | null
          expires_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          badge_type: string
          earned_at?: string | null
          expires_at?: string | null
          id: string
          user_id: string
        }
        Update: {
          badge_type?: string
          earned_at?: string | null
          expires_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          age_max: number | null
          age_min: number | null
          body_types: string[] | null
          created_at: string | null
          distance_max: number | null
          ethnicities: string[] | null
          hide_offline: boolean | null
          id: string
          metadata: Json | null
          photos_only: boolean | null
          positions: string[] | null
          saved_searches: Json | null
          show_me: string | null
          tribes: string[] | null
          updated_at: string | null
          user_id: string
          verified_only: boolean | null
        }
        Insert: {
          age_max?: number | null
          age_min?: number | null
          body_types?: string[] | null
          created_at?: string | null
          distance_max?: number | null
          ethnicities?: string[] | null
          hide_offline?: boolean | null
          id?: string
          metadata?: Json | null
          photos_only?: boolean | null
          positions?: string[] | null
          saved_searches?: Json | null
          show_me?: string | null
          tribes?: string[] | null
          updated_at?: string | null
          user_id: string
          verified_only?: boolean | null
        }
        Update: {
          age_max?: number | null
          age_min?: number | null
          body_types?: string[] | null
          created_at?: string | null
          distance_max?: number | null
          ethnicities?: string[] | null
          hide_offline?: boolean | null
          id?: string
          metadata?: Json | null
          photos_only?: boolean | null
          positions?: string[] | null
          saved_searches?: Json | null
          show_me?: string | null
          tribes?: string[] | null
          updated_at?: string | null
          user_id?: string
          verified_only?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: 'user_preferences_user_id_fkey'
            columns: ['user_id']
            isOneToOne: true
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      user_stats: {
        Row: {
          current_level_id: number | null
          last_action_at: string | null
          matches_count: number | null
          messages_sent: number | null
          profile_views_count: number | null
          streak_days: number | null
          total_points: number | null
          user_id: string
        }
        Insert: {
          current_level_id?: number | null
          last_action_at?: string | null
          matches_count?: number | null
          messages_sent?: number | null
          profile_views_count?: number | null
          streak_days?: number | null
          total_points?: number | null
          user_id: string
        }
        Update: {
          current_level_id?: number | null
          last_action_at?: string | null
          matches_count?: number | null
          messages_sent?: number | null
          profile_views_count?: number | null
          streak_days?: number | null
          total_points?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'user_stats_current_level_id_fkey'
            columns: ['current_level_id']
            isOneToOne: false
            referencedRelation: 'levels'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'user_stats_user_id_fkey'
            columns: ['user_id']
            isOneToOne: true
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      users: {
        Row: {
          created_at: string | null
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          profile_image_url: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          profile_image_url?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          profile_image_url?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      venues: {
        Row: {
          address: string | null
          category: string | null
          city: string | null
          country_code: string | null
          created_at: string | null
          description: string | null
          id: string
          location: unknown
          location_point: unknown
          name: string
          rating: number | null
          reviews: Json | null
          tags: string[] | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          category?: string | null
          city?: string | null
          country_code?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          location?: unknown
          location_point?: unknown
          name: string
          rating?: number | null
          reviews?: Json | null
          tags?: string[] | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          category?: string | null
          city?: string | null
          country_code?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          location?: unknown
          location_point?: unknown
          name?: string
          rating?: number | null
          reviews?: Json | null
          tags?: string[] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      verification_documents: {
        Row: {
          created_at: string | null
          document_type: string
          id: string
          reviewed_at: string | null
          reviewed_by: string | null
          status: string | null
          storage_path: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          document_type: string
          id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          storage_path: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          document_type?: string
          id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          storage_path?: string
          user_id?: string | null
        }
        Relationships: []
      }
      web_push_subs: {
        Row: {
          created_at: string | null
          endpoint: string
          id: string
          keys: Json
          user_id: string
        }
        Insert: {
          created_at?: string | null
          endpoint: string
          id?: string
          keys: Json
          user_id: string
        }
        Update: {
          created_at?: string | null
          endpoint?: string
          id?: string
          keys?: Json
          user_id?: string
        }
        Relationships: []
      }
      webhook_logs: {
        Row: {
          created_at: string | null
          error: string | null
          event_type: string
          id: string
          payload: Json
          processed: boolean | null
          processed_at: string | null
          source: string
        }
        Insert: {
          created_at?: string | null
          error?: string | null
          event_type: string
          id?: string
          payload: Json
          processed?: boolean | null
          processed_at?: string | null
          source: string
        }
        Update: {
          created_at?: string | null
          error?: string | null
          event_type?: string
          id?: string
          payload?: Json
          processed?: boolean | null
          processed_at?: string | null
          source?: string
        }
        Relationships: []
      }
    }
    Views: {
      geography_columns: {
        Row: {
          coord_dimension: number | null
          f_geography_column: unknown
          f_table_catalog: unknown
          f_table_name: unknown
          f_table_schema: unknown
          srid: number | null
          type: string | null
        }
        Relationships: []
      }
      geometry_columns: {
        Row: {
          coord_dimension: number | null
          f_geometry_column: unknown
          f_table_catalog: string | null
          f_table_name: unknown
          f_table_schema: unknown
          srid: number | null
          type: string | null
        }
        Insert: {
          coord_dimension?: number | null
          f_geometry_column?: unknown
          f_table_catalog?: string | null
          f_table_name?: unknown
          f_table_schema?: unknown
          srid?: number | null
          type?: string | null
        }
        Update: {
          coord_dimension?: number | null
          f_geometry_column?: unknown
          f_table_catalog?: string | null
          f_table_name?: unknown
          f_table_schema?: unknown
          srid?: number | null
          type?: string | null
        }
        Relationships: []
      }
      hypopg_hidden_indexes: {
        Row: {
          am_name: unknown
          index_name: unknown
          indexrelid: unknown
          is_hypo: boolean | null
          schema_name: unknown
          table_name: unknown
        }
        Relationships: []
      }
      hypopg_list_indexes: {
        Row: {
          am_name: unknown
          index_name: string | null
          indexrelid: unknown
          schema_name: unknown
          table_name: unknown
        }
        Relationships: []
      }
      pg_stat_monitor: {
        Row: {
          application_name: string | null
          bucket: number | null
          bucket_done: boolean | null
          bucket_start_time: string | null
          calls: number | null
          client_ip: unknown
          cmd_type: number | null
          cmd_type_text: string | null
          comments: string | null
          cpu_sys_time: number | null
          cpu_user_time: number | null
          datname: string | null
          dbid: unknown
          elevel: number | null
          jit_deform_count: number | null
          jit_deform_time: number | null
          jit_emission_count: number | null
          jit_emission_time: number | null
          jit_functions: number | null
          jit_generation_time: number | null
          jit_inlining_count: number | null
          jit_inlining_time: number | null
          jit_optimization_count: number | null
          jit_optimization_time: number | null
          local_blk_read_time: number | null
          local_blk_write_time: number | null
          local_blks_dirtied: number | null
          local_blks_hit: number | null
          local_blks_read: number | null
          local_blks_written: number | null
          max_exec_time: number | null
          max_plan_time: number | null
          mean_exec_time: number | null
          mean_plan_time: number | null
          message: string | null
          min_exec_time: number | null
          min_plan_time: number | null
          minmax_stats_since: string | null
          pgsm_query_id: number | null
          planid: number | null
          plans: number | null
          query: string | null
          query_plan: string | null
          queryid: number | null
          relations: string[] | null
          resp_calls: string[] | null
          rows: number | null
          shared_blk_read_time: number | null
          shared_blk_write_time: number | null
          shared_blks_dirtied: number | null
          shared_blks_hit: number | null
          shared_blks_read: number | null
          shared_blks_written: number | null
          sqlcode: string | null
          stats_since: string | null
          stddev_exec_time: number | null
          stddev_plan_time: number | null
          temp_blk_read_time: number | null
          temp_blk_write_time: number | null
          temp_blks_read: number | null
          temp_blks_written: number | null
          top_query: string | null
          top_queryid: number | null
          toplevel: boolean | null
          total_exec_time: number | null
          total_plan_time: number | null
          userid: unknown
          username: string | null
          wal_bytes: number | null
          wal_fpi: number | null
          wal_records: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      _pgr_articulationpoints: {
        Args: { edges_sql: string }
        Returns: Record<string, unknown>[]
      }
      _pgr_astar:
        | {
            Args: {
              combinations_sql: string
              directed?: boolean
              edges_sql: string
              epsilon?: number
              factor?: number
              heuristic?: number
              only_cost?: boolean
            }
            Returns: Record<string, unknown>[]
          }
        | {
            Args: {
              directed?: boolean
              edges_sql: string
              end_vids: unknown
              epsilon?: number
              factor?: number
              heuristic?: number
              normal?: boolean
              only_cost?: boolean
              start_vids: unknown
            }
            Returns: Record<string, unknown>[]
          }
      _pgr_bellmanford:
        | {
            Args: {
              combinations_sql: string
              directed: boolean
              edges_sql: string
              only_cost: boolean
            }
            Returns: Record<string, unknown>[]
          }
        | {
            Args: {
              directed: boolean
              edges_sql: string
              from_vids: unknown
              only_cost: boolean
              to_vids: unknown
            }
            Returns: Record<string, unknown>[]
          }
      _pgr_biconnectedcomponents: {
        Args: { edges_sql: string }
        Returns: Record<string, unknown>[]
      }
      _pgr_binarybreadthfirstsearch:
        | {
            Args: {
              combinations_sql: string
              directed?: boolean
              edges_sql: string
            }
            Returns: Record<string, unknown>[]
          }
        | {
            Args: {
              directed?: boolean
              edges_sql: string
              from_vids: unknown
              to_vids: unknown
            }
            Returns: Record<string, unknown>[]
          }
      _pgr_bipartite: {
        Args: { edges_sql: string }
        Returns: Record<string, unknown>[]
      }
      _pgr_boost_version: { Args: never; Returns: string }
      _pgr_breadthfirstsearch: {
        Args: {
          directed: boolean
          edges_sql: string
          from_vids: unknown
          max_depth: number
        }
        Returns: Record<string, unknown>[]
      }
      _pgr_bridges: {
        Args: { edges_sql: string }
        Returns: Record<string, unknown>[]
      }
      _pgr_build_type: { Args: never; Returns: string }
      _pgr_checkquery: { Args: { '': string }; Returns: string }
      _pgr_checkverttab: {
        Args: {
          columnsarr: string[]
          fnname?: string
          reporterrs?: number
          vertname: string
        }
        Returns: Record<string, unknown>
      }
      _pgr_chinesepostman: {
        Args: { edges_sql: string; only_cost: boolean }
        Returns: Record<string, unknown>[]
      }
      _pgr_compilation_date: { Args: never; Returns: string }
      _pgr_compiler_version: { Args: never; Returns: string }
      _pgr_connectedcomponents: {
        Args: { edges_sql: string }
        Returns: Record<string, unknown>[]
      }
      _pgr_contraction: {
        Args: {
          contraction_order: number[]
          directed?: boolean
          edges_sql: string
          forbidden_vertices?: number[]
          max_cycles?: number
        }
        Returns: Record<string, unknown>[]
      }
      _pgr_createindex:
        | {
            Args: {
              colname: string
              fnname?: string
              indext: string
              reporterrs?: number
              sname: string
              tname: string
            }
            Returns: undefined
          }
        | {
            Args: {
              colname: string
              fnname?: string
              indext: string
              reporterrs?: number
              tabname: string
            }
            Returns: undefined
          }
      _pgr_cuthillmckeeordering: {
        Args: { '': string }
        Returns: Record<string, unknown>[]
      }
      _pgr_depthfirstsearch: {
        Args: {
          directed: boolean
          edges_sql: string
          max_depth: number
          root_vids: unknown
        }
        Returns: Record<string, unknown>[]
      }
      _pgr_dijkstra:
        | {
            Args: {
              combinations_sql: string
              directed?: boolean
              edges_sql: string
              normal?: boolean
              only_cost?: boolean
            }
            Returns: Record<string, unknown>[]
          }
        | {
            Args: {
              combinations_sql: string
              directed: boolean
              edges_sql: string
              global: boolean
              n_goals: number
              only_cost: boolean
            }
            Returns: Record<string, unknown>[]
          }
        | {
            Args: {
              directed?: boolean
              edges_sql: string
              end_vids: unknown
              n_goals?: number
              normal?: boolean
              only_cost?: boolean
              start_vids: unknown
            }
            Returns: Record<string, unknown>[]
          }
        | {
            Args: {
              directed: boolean
              edges_sql: string
              end_vids: unknown
              global: boolean
              n_goals: number
              normal: boolean
              only_cost: boolean
              start_vids: unknown
            }
            Returns: Record<string, unknown>[]
          }
      _pgr_dijkstravia: {
        Args: {
          directed: boolean
          edges_sql: string
          strict: boolean
          u_turn_on_edge: boolean
          via_vids: unknown
        }
        Returns: Record<string, unknown>[]
      }
      _pgr_drivingdistance: {
        Args: {
          directed?: boolean
          distance: number
          edges_sql: string
          equicost?: boolean
          start_vids: unknown
        }
        Returns: Record<string, unknown>[]
      }
      _pgr_edgecoloring: {
        Args: { edges_sql: string }
        Returns: Record<string, unknown>[]
      }
      _pgr_edwardmoore:
        | {
            Args: {
              combinations_sql: string
              directed?: boolean
              edges_sql: string
            }
            Returns: Record<string, unknown>[]
          }
        | {
            Args: {
              directed?: boolean
              edges_sql: string
              from_vids: unknown
              to_vids: unknown
            }
            Returns: Record<string, unknown>[]
          }
      _pgr_endpoint: { Args: { g: unknown }; Returns: unknown }
      _pgr_floydwarshall: {
        Args: { directed: boolean; edges_sql: string }
        Returns: Record<string, unknown>[]
      }
      _pgr_get_statement: { Args: { o_sql: string }; Returns: string }
      _pgr_getcolumnname:
        | {
            Args: {
              col: string
              fnname?: string
              reporterrs?: number
              sname: string
              tname: string
            }
            Returns: string
          }
        | {
            Args: {
              col: string
              fnname?: string
              reporterrs?: number
              tab: string
            }
            Returns: string
          }
      _pgr_getcolumntype:
        | {
            Args: {
              cname: string
              fnname?: string
              reporterrs?: number
              sname: string
              tname: string
            }
            Returns: string
          }
        | {
            Args: {
              col: string
              fnname?: string
              reporterrs?: number
              tab: string
            }
            Returns: string
          }
      _pgr_gettablename: {
        Args: { fnname?: string; reporterrs?: number; tab: string }
        Returns: Record<string, unknown>
      }
      _pgr_git_hash: { Args: never; Returns: string }
      _pgr_hawickcircuits: {
        Args: { '': string }
        Returns: Record<string, unknown>[]
      }
      _pgr_iscolumnindexed:
        | {
            Args: {
              cname: string
              fnname?: string
              reporterrs?: number
              sname: string
              tname: string
            }
            Returns: boolean
          }
        | {
            Args: {
              col: string
              fnname?: string
              reporterrs?: number
              tab: string
            }
            Returns: boolean
          }
      _pgr_iscolumnintable: {
        Args: { col: string; tab: string }
        Returns: boolean
      }
      _pgr_isplanar: { Args: { '': string }; Returns: boolean }
      _pgr_johnson: {
        Args: { directed: boolean; edges_sql: string }
        Returns: Record<string, unknown>[]
      }
      _pgr_ksp: {
        Args: {
          directed: boolean
          edges_sql: string
          end_vid: number
          heap_paths: boolean
          k: number
          start_vid: number
        }
        Returns: Record<string, unknown>[]
      }
      _pgr_lengauertarjandominatortree: {
        Args: { edges_sql: string; root_vid: number }
        Returns: Record<string, unknown>[]
      }
      _pgr_lib_version: { Args: never; Returns: string }
      _pgr_linegraphfull: {
        Args: { '': string }
        Returns: Record<string, unknown>[]
      }
      _pgr_makeconnected: {
        Args: { '': string }
        Returns: Record<string, unknown>[]
      }
      _pgr_maxcardinalitymatch: {
        Args: { directed: boolean; edges_sql: string }
        Returns: Record<string, unknown>[]
      }
      _pgr_maxflow:
        | {
            Args: {
              algorithm?: number
              combinations_sql: string
              edges_sql: string
              only_flow?: boolean
            }
            Returns: Record<string, unknown>[]
          }
        | {
            Args: {
              algorithm?: number
              edges_sql: string
              only_flow?: boolean
              sources: unknown
              targets: unknown
            }
            Returns: Record<string, unknown>[]
          }
      _pgr_maxflowmincost:
        | {
            Args: {
              combinations_sql: string
              edges_sql: string
              only_cost?: boolean
            }
            Returns: Record<string, unknown>[]
          }
        | {
            Args: {
              edges_sql: string
              only_cost?: boolean
              sources: unknown
              targets: unknown
            }
            Returns: Record<string, unknown>[]
          }
      _pgr_msg: {
        Args: { fnname: string; msg?: string; msgkind: number }
        Returns: undefined
      }
      _pgr_onerror: {
        Args: {
          errcond: boolean
          fnname: string
          hinto?: string
          msgerr: string
          msgok?: string
          reporterrs: number
        }
        Returns: undefined
      }
      _pgr_operating_system: { Args: never; Returns: string }
      _pgr_parameter_check: {
        Args: { big?: boolean; fn: string; sql: string }
        Returns: boolean
      }
      _pgr_pgsql_version: { Args: never; Returns: string }
      _pgr_pointtoid: {
        Args: {
          point: unknown
          srid: number
          tolerance: number
          vertname: string
        }
        Returns: number
      }
      _pgr_quote_ident: { Args: { idname: string }; Returns: string }
      _pgr_sequentialvertexcoloring: {
        Args: { edges_sql: string }
        Returns: Record<string, unknown>[]
      }
      _pgr_startpoint: { Args: { g: unknown }; Returns: unknown }
      _pgr_stoerwagner: {
        Args: { edges_sql: string }
        Returns: Record<string, unknown>[]
      }
      _pgr_strongcomponents: {
        Args: { edges_sql: string }
        Returns: Record<string, unknown>[]
      }
      _pgr_topologicalsort: {
        Args: { edges_sql: string }
        Returns: Record<string, unknown>[]
      }
      _pgr_transitiveclosure: {
        Args: { edges_sql: string }
        Returns: Record<string, unknown>[]
      }
      _pgr_trsp: {
        Args: {
          directed: boolean
          has_reverse_cost: boolean
          source_eid: number
          source_pos: number
          sql: string
          target_eid: number
          target_pos: number
          turn_restrict_sql?: string
        }
        Returns: Record<string, unknown>[]
      }
      _pgr_trspviavertices: {
        Args: {
          directed: boolean
          has_rcost: boolean
          sql: string
          turn_restrict_sql?: string
          vids: number[]
        }
        Returns: Record<string, unknown>[]
      }
      _pgr_tsp: {
        Args: {
          cooling_factor?: number
          end_id?: number
          final_temperature?: number
          initial_temperature?: number
          matrix_row_sql: string
          max_changes_per_temperature?: number
          max_consecutive_non_changes?: number
          max_processing_time?: number
          randomize?: boolean
          start_id?: number
          tries_per_temperature?: number
        }
        Returns: Record<string, unknown>[]
      }
      _pgr_tspeuclidean: {
        Args: {
          cooling_factor?: number
          coordinates_sql: string
          end_id?: number
          final_temperature?: number
          initial_temperature?: number
          max_changes_per_temperature?: number
          max_consecutive_non_changes?: number
          max_processing_time?: number
          randomize?: boolean
          start_id?: number
          tries_per_temperature?: number
        }
        Returns: Record<string, unknown>[]
      }
      _pgr_versionless: { Args: { v1: string; v2: string }; Returns: boolean }
      _pgr_withpoints:
        | {
            Args: {
              combinations_sql: string
              details: boolean
              directed: boolean
              driving_side: string
              edges_sql: string
              only_cost?: boolean
              points_sql: string
            }
            Returns: Record<string, unknown>[]
          }
        | {
            Args: {
              details: boolean
              directed: boolean
              driving_side: string
              edges_sql: string
              end_pids: unknown
              normal?: boolean
              only_cost?: boolean
              points_sql: string
              start_pids: unknown
            }
            Returns: Record<string, unknown>[]
          }
      _pgr_withpointsdd: {
        Args: {
          details?: boolean
          directed?: boolean
          distance: number
          driving_side?: string
          edges_sql: string
          equicost?: boolean
          points_sql: string
          start_pid: unknown
        }
        Returns: Record<string, unknown>[]
      }
      _pgr_withpointsksp: {
        Args: {
          details: boolean
          directed: boolean
          driving_side: string
          edges_sql: string
          end_pid: number
          heap_paths: boolean
          k: number
          points_sql: string
          start_pid: number
        }
        Returns: Record<string, unknown>[]
      }
      _pgr_withpointsvia: {
        Args: {
          directed?: boolean
          fraction: number[]
          sql: string
          via_edges: number[]
        }
        Returns: Record<string, unknown>[]
      }
      _postgis_deprecate: {
        Args: { newname: string; oldname: string; version: string }
        Returns: undefined
      }
      _postgis_index_extent: {
        Args: { col: string; tbl: unknown }
        Returns: unknown
      }
      _postgis_pgsql_version: { Args: never; Returns: string }
      _postgis_scripts_pgsql_version: { Args: never; Returns: string }
      _postgis_selectivity: {
        Args: { att_name: string; geom: unknown; mode?: string; tbl: unknown }
        Returns: number
      }
      _postgis_stats: {
        Args: { ''?: string; att_name: string; tbl: unknown }
        Returns: string
      }
      _st_3dintersects: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_contains: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_containsproperly: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_coveredby:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      _st_covers:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      _st_crosses: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_dwithin: {
        Args: {
          geog1: unknown
          geog2: unknown
          tolerance: number
          use_spheroid?: boolean
        }
        Returns: boolean
      }
      _st_equals: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      _st_intersects: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_linecrossingdirection: {
        Args: { line1: unknown; line2: unknown }
        Returns: number
      }
      _st_longestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      _st_maxdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      _st_orderingequals: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_overlaps: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_sortablehash: { Args: { geom: unknown }; Returns: number }
      _st_touches: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_voronoi: {
        Args: {
          clip?: unknown
          g1: unknown
          return_polygons?: boolean
          tolerance?: number
        }
        Returns: unknown
      }
      _st_within: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      activate_panic_mode: { Args: { user_uuid: string }; Returns: boolean }
      addauth: { Args: { '': string }; Returns: boolean }
      addgeometrycolumn:
        | {
            Args: {
              catalog_name: string
              column_name: string
              new_dim: number
              new_srid_in: number
              new_type: string
              schema_name: string
              table_name: string
              use_typmod?: boolean
            }
            Returns: string
          }
        | {
            Args: {
              column_name: string
              new_dim: number
              new_srid: number
              new_type: string
              schema_name: string
              table_name: string
              use_typmod?: boolean
            }
            Returns: string
          }
        | {
            Args: {
              column_name: string
              new_dim: number
              new_srid: number
              new_type: string
              table_name: string
              use_typmod?: boolean
            }
            Returns: string
          }
      are_users_matched: {
        Args: { user_a: string; user_b: string }
        Returns: boolean
      }
      bytea_to_text: { Args: { data: string }; Returns: string }
      calculate_compatibility: {
        Args: { user1_id: string; user2_id: string }
        Returns: number
      }
      calculate_distance_km: {
        Args: { lat1: number; lat2: number; lng1: number; lng2: number }
        Returns: number
      }
      cleanup_expired_magic_links: { Args: never; Returns: undefined }
      cleanup_old_notifications: {
        Args: { p_days_old?: number }
        Returns: number
      }
      create_match_from_interaction: {
        Args: {
          from_user_id: string
          interaction_type: Database['public']['Enums']['interaction_type']
          to_user_id: string
        }
        Returns: string
      }
      daitch_mokotoff: { Args: { '': string }; Returns: string[] }
      decode_error_level: { Args: { elevel: number }; Returns: string }
      disablelongtransactions: { Args: never; Returns: string }
      discover_nearby: {
        Args: {
          filter_tags?: Json
          max_age?: number
          max_km?: number
          min_age?: number
          page_limit?: number
        }
        Returns: {
          age: number
          approx_city: string
          bio: string
          display_name: string
          distance_band: string
          handle: string
          id: string
          is_verified: boolean
          last_online: string
          photo_urls: string[]
          tags: Json
        }[]
      }
      distance_band: { Args: { distance_km: number }; Returns: string }
      dmetaphone: { Args: { '': string }; Returns: string }
      dmetaphone_alt: { Args: { '': string }; Returns: string }
      dropgeometrycolumn:
        | {
            Args: {
              catalog_name: string
              column_name: string
              schema_name: string
              table_name: string
            }
            Returns: string
          }
        | {
            Args: {
              column_name: string
              schema_name: string
              table_name: string
            }
            Returns: string
          }
        | { Args: { column_name: string; table_name: string }; Returns: string }
      dropgeometrytable:
        | {
            Args: {
              catalog_name: string
              schema_name: string
              table_name: string
            }
            Returns: string
          }
        | { Args: { schema_name: string; table_name: string }; Returns: string }
        | { Args: { table_name: string }; Returns: string }
      enablelongtransactions: { Args: never; Returns: string }
      equals: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      events_recommend: {
        Args: { for_user_id: string; max_km?: number; result_limit?: number }
        Returns: {
          city: string
          creator_id: string
          description: string
          ends_at: string
          id: string
          member_count: number
          score: number
          starts_at: string
          tags: Json
          title: string
          venue: string
        }[]
      }
      fn_is_blocked: {
        Args: { user_a: string; user_b: string }
        Returns: boolean
      }
      fuzz_location: { Args: { point: unknown }; Returns: unknown }
      geometry: { Args: { '': string }; Returns: unknown }
      geometry_above: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_below: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_cmp: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      geometry_contained_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_contains: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_contains_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_distance_box: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      geometry_distance_centroid: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      geometry_eq: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_ge: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_gt: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_le: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_left: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_lt: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overabove: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overbelow: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overlaps: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overlaps_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overleft: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overright: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_right: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_same: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_same_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_within: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geomfromewkt: { Args: { '': string }; Returns: unknown }
      get_cmd_type: { Args: { cmd_type: number }; Returns: string }
      get_distance_band: {
        Args: {
          target_lat: number
          target_lng: number
          user_lat: number
          user_lng: number
        }
        Returns: string
      }
      get_histogram_timings: { Args: never; Returns: string }
      get_nearby_profiles:
        | {
            Args: {
              include_filters?: Json
              limit_count?: number
              max_dist_meters?: number
              target_lat: number
              target_lng: number
            }
            Returns: {
              age: number
              ai_profile_score: number
              bio: string
              city: string
              country: string
              created_at: string
              display_name: string
              distance_meters: number
              id: string
              is_premium: boolean
              is_verified: boolean
              location: unknown
              profile_completion_score: number
              tribes: string[]
              user_id: string
              username: string
              verification_status: Database['public']['Enums']['verification_status']
            }[]
          }
        | {
            Args: {
              limit_count?: number
              max_age?: number
              max_distance_km?: number
              min_age?: number
              user_lat: number
              user_lng: number
            }
            Returns: {
              age: number
              avatar_url: string
              bio: string
              city: string
              display_name: string
              distance_km: number
              handle: string
              is_premium: boolean
              is_verified: boolean
              looking_for: string[]
              online_status: string
              profile_id: string
              tribes: string[]
            }[]
          }
      get_nearby_profiles_optimized: {
        Args: {
          p_interests?: string[]
          p_limit?: number
          p_max_age?: number
          p_max_distance_km?: number
          p_min_age?: number
          p_tribes?: string[]
          p_user_lat: number
          p_user_lng: number
        }
        Returns: {
          age: number
          approx_city: string
          avatar_url: string
          display_name: string
          distance_km: number
          handle: string
          interests: string[]
          is_premium: boolean
          is_verified: boolean
          last_active_at: string
          match_score: number
          online_status: string
          profile_id: string
          tribes: string[]
        }[]
      }
      get_platform_stats: { Args: never; Returns: Json }
      get_system_health_metrics: {
        Args: never
        Returns: {
          metric_name: string
          metric_unit: string
          metric_value: number
          status: string
        }[]
      }
      get_user_conversations:
        | {
            Args: never
            Returns: {
              id: string
              last_message: string
              last_message_at: string
              participant_id: string
              participant_name: string
              unread_count: number
            }[]
          }
        | {
            Args: { p_user_id: string }
            Returns: {
              created_at: string
              display_name: string
              id: string
              last_message: string
              participant_id: string
            }[]
          }
      get_user_conversations_filtered: {
        Args: { p_user_id: string }
        Returns: {
          conversation_id: string
          distance_km: number
          filter_reason: string
          is_filtered: boolean
          last_message_at: string
          last_message_content: string
          match_score: number
          other_age: number
          other_avatar_url: string
          other_display_name: string
          other_handle: string
          other_user_id: string
          unread_count: number
        }[]
      }
      get_user_matches: {
        Args: { p_limit?: number; p_user_id?: string }
        Returns: {
          is_mutual: boolean
          match_created_at: string
          match_id: string
          match_type: string
          partner_id: string
          partner_name: string
          partner_username: string
        }[]
      }
      get_user_online_status: { Args: { p_user_id?: string }; Returns: string }
      gettransactionid: { Args: never; Returns: unknown }
      histogram: {
        Args: { _bucket: number; _quryid: number }
        Returns: Record<string, unknown>[]
      }
      http: {
        Args: { request: Database['public']['CompositeTypes']['http_request'] }
        Returns: Database['public']['CompositeTypes']['http_response']
        SetofOptions: {
          from: 'http_request'
          to: 'http_response'
          isOneToOne: true
          isSetofReturn: false
        }
      }
      http_delete:
        | {
            Args: { uri: string }
            Returns: Database['public']['CompositeTypes']['http_response']
            SetofOptions: {
              from: '*'
              to: 'http_response'
              isOneToOne: true
              isSetofReturn: false
            }
          }
        | {
            Args: { content: string; content_type: string; uri: string }
            Returns: Database['public']['CompositeTypes']['http_response']
            SetofOptions: {
              from: '*'
              to: 'http_response'
              isOneToOne: true
              isSetofReturn: false
            }
          }
      http_get:
        | {
            Args: { uri: string }
            Returns: Database['public']['CompositeTypes']['http_response']
            SetofOptions: {
              from: '*'
              to: 'http_response'
              isOneToOne: true
              isSetofReturn: false
            }
          }
        | {
            Args: { data: Json; uri: string }
            Returns: Database['public']['CompositeTypes']['http_response']
            SetofOptions: {
              from: '*'
              to: 'http_response'
              isOneToOne: true
              isSetofReturn: false
            }
          }
      http_head: {
        Args: { uri: string }
        Returns: Database['public']['CompositeTypes']['http_response']
        SetofOptions: {
          from: '*'
          to: 'http_response'
          isOneToOne: true
          isSetofReturn: false
        }
      }
      http_header: {
        Args: { field: string; value: string }
        Returns: Database['public']['CompositeTypes']['http_header']
        SetofOptions: {
          from: '*'
          to: 'http_header'
          isOneToOne: true
          isSetofReturn: false
        }
      }
      http_list_curlopt: {
        Args: never
        Returns: {
          curlopt: string
          value: string
        }[]
      }
      http_patch: {
        Args: { content: string; content_type: string; uri: string }
        Returns: Database['public']['CompositeTypes']['http_response']
        SetofOptions: {
          from: '*'
          to: 'http_response'
          isOneToOne: true
          isSetofReturn: false
        }
      }
      http_post:
        | {
            Args: { content: string; content_type: string; uri: string }
            Returns: Database['public']['CompositeTypes']['http_response']
            SetofOptions: {
              from: '*'
              to: 'http_response'
              isOneToOne: true
              isSetofReturn: false
            }
          }
        | {
            Args: { data: Json; uri: string }
            Returns: Database['public']['CompositeTypes']['http_response']
            SetofOptions: {
              from: '*'
              to: 'http_response'
              isOneToOne: true
              isSetofReturn: false
            }
          }
      http_put: {
        Args: { content: string; content_type: string; uri: string }
        Returns: Database['public']['CompositeTypes']['http_response']
        SetofOptions: {
          from: '*'
          to: 'http_response'
          isOneToOne: true
          isSetofReturn: false
        }
      }
      http_reset_curlopt: { Args: never; Returns: boolean }
      http_set_curlopt: {
        Args: { curlopt: string; value: string }
        Returns: boolean
      }
      hypopg: { Args: never; Returns: Record<string, unknown>[] }
      hypopg_create_index: {
        Args: { sql_order: string }
        Returns: Record<string, unknown>[]
      }
      hypopg_drop_index: { Args: { indexid: unknown }; Returns: boolean }
      hypopg_get_indexdef: { Args: { indexid: unknown }; Returns: string }
      hypopg_hidden_indexes: {
        Args: never
        Returns: {
          indexid: unknown
        }[]
      }
      hypopg_hide_index: { Args: { indexid: unknown }; Returns: boolean }
      hypopg_relation_size: { Args: { indexid: unknown }; Returns: number }
      hypopg_reset: { Args: never; Returns: undefined }
      hypopg_reset_index: { Args: never; Returns: undefined }
      hypopg_unhide_all_indexes: { Args: never; Returns: undefined }
      hypopg_unhide_index: { Args: { indexid: unknown }; Returns: boolean }
      index_advisor: {
        Args: { query: string }
        Returns: {
          errors: string[]
          index_statements: string[]
          startup_cost_after: Json
          startup_cost_before: Json
          total_cost_after: Json
          total_cost_before: Json
        }[]
      }
      longtransactionsenabled: { Args: never; Returns: boolean }
      magic_link_maintenance: { Args: never; Returns: undefined }
      pg_stat_monitor_internal: {
        Args: { showtext: boolean }
        Returns: Record<string, unknown>[]
      }
      pg_stat_monitor_reset: { Args: never; Returns: undefined }
      pg_stat_monitor_version: { Args: never; Returns: string }
      pgr_articulationpoints: { Args: { '': string }; Returns: number[] }
      pgr_biconnectedcomponents: {
        Args: { '': string }
        Returns: Record<string, unknown>[]
      }
      pgr_bipartite: {
        Args: { '': string }
        Returns: Record<string, unknown>[]
      }
      pgr_bridges: { Args: { '': string }; Returns: number[] }
      pgr_chinesepostman: {
        Args: { '': string }
        Returns: Record<string, unknown>[]
      }
      pgr_chinesepostmancost: { Args: { '': string }; Returns: number }
      pgr_connectedcomponents: {
        Args: { '': string }
        Returns: Record<string, unknown>[]
      }
      pgr_cuthillmckeeordering: {
        Args: { '': string }
        Returns: Record<string, unknown>[]
      }
      pgr_edgecoloring: {
        Args: { '': string }
        Returns: Record<string, unknown>[]
      }
      pgr_full_version: { Args: never; Returns: Record<string, unknown> }
      pgr_hawickcircuits: {
        Args: { '': string }
        Returns: Record<string, unknown>[]
      }
      pgr_isplanar: { Args: { '': string }; Returns: boolean }
      pgr_kruskal: { Args: { '': string }; Returns: Record<string, unknown>[] }
      pgr_linegraphfull: {
        Args: { '': string }
        Returns: Record<string, unknown>[]
      }
      pgr_makeconnected: {
        Args: { '': string }
        Returns: Record<string, unknown>[]
      }
      pgr_maxcardinalitymatch: { Args: { '': string }; Returns: number[] }
      pgr_prim: { Args: { '': string }; Returns: Record<string, unknown>[] }
      pgr_sequentialvertexcoloring: {
        Args: { '': string }
        Returns: Record<string, unknown>[]
      }
      pgr_stoerwagner: {
        Args: { '': string }
        Returns: Record<string, unknown>[]
      }
      pgr_strongcomponents: {
        Args: { '': string }
        Returns: Record<string, unknown>[]
      }
      pgr_topologicalsort: {
        Args: { '': string }
        Returns: Record<string, unknown>[]
      }
      pgr_transitiveclosure: {
        Args: { '': string }
        Returns: Record<string, unknown>[]
      }
      pgr_version: { Args: never; Returns: string }
      pgroonga_command:
        | { Args: { groongacommand: string }; Returns: string }
        | {
            Args: { arguments: string[]; groongacommand: string }
            Returns: string
          }
      pgroonga_command_escape_value: {
        Args: { value: string }
        Returns: string
      }
      pgroonga_condition: {
        Args: {
          column_name?: string
          fuzzy_max_distance_ratio?: number
          index_name?: string
          query?: string
          schema_name?: string
          scorers?: string[]
          weights?: number[]
        }
        Returns: Database['public']['CompositeTypes']['pgroonga_condition']
        SetofOptions: {
          from: '*'
          to: 'pgroonga_condition'
          isOneToOne: true
          isSetofReturn: false
        }
      }
      pgroonga_equal_query_text_array: {
        Args: { query: string; targets: string[] }
        Returns: boolean
      }
      pgroonga_equal_query_text_array_condition:
        | {
            Args: {
              condition: Database['public']['CompositeTypes']['pgroonga_condition']
              targets: string[]
            }
            Returns: boolean
          }
        | {
            Args: {
              condition: Database['public']['CompositeTypes']['pgroonga_full_text_search_condition']
              targets: string[]
            }
            Returns: boolean
          }
      pgroonga_equal_query_varchar_array: {
        Args: { query: string; targets: string[] }
        Returns: boolean
      }
      pgroonga_equal_query_varchar_array_condition:
        | {
            Args: {
              condition: Database['public']['CompositeTypes']['pgroonga_condition']
              targets: string[]
            }
            Returns: boolean
          }
        | {
            Args: {
              condition: Database['public']['CompositeTypes']['pgroonga_full_text_search_condition']
              targets: string[]
            }
            Returns: boolean
          }
      pgroonga_equal_text: {
        Args: { other: string; target: string }
        Returns: boolean
      }
      pgroonga_equal_text_condition:
        | {
            Args: {
              condition: Database['public']['CompositeTypes']['pgroonga_condition']
              target: string
            }
            Returns: boolean
          }
        | {
            Args: {
              condition: Database['public']['CompositeTypes']['pgroonga_full_text_search_condition']
              target: string
            }
            Returns: boolean
          }
      pgroonga_equal_varchar: {
        Args: { other: string; target: string }
        Returns: boolean
      }
      pgroonga_equal_varchar_condition:
        | {
            Args: {
              condition: Database['public']['CompositeTypes']['pgroonga_condition']
              target: string
            }
            Returns: boolean
          }
        | {
            Args: {
              condition: Database['public']['CompositeTypes']['pgroonga_full_text_search_condition']
              target: string
            }
            Returns: boolean
          }
      pgroonga_escape:
        | {
            Args: { value: number }
            Returns: {
              error: true
            } & 'Could not choose the best candidate function between: public.pgroonga_escape(value => bool), public.pgroonga_escape(value => int8), public.pgroonga_escape(value => int2), public.pgroonga_escape(value => int4), public.pgroonga_escape(value => text), public.pgroonga_escape(value => float4), public.pgroonga_escape(value => float8), public.pgroonga_escape(value => timestamp), public.pgroonga_escape(value => timestamptz). Try renaming the parameters or the function itself in the database so function overloading can be resolved'
          }
        | {
            Args: { value: boolean }
            Returns: {
              error: true
            } & 'Could not choose the best candidate function between: public.pgroonga_escape(value => bool), public.pgroonga_escape(value => int8), public.pgroonga_escape(value => int2), public.pgroonga_escape(value => int4), public.pgroonga_escape(value => text), public.pgroonga_escape(value => float4), public.pgroonga_escape(value => float8), public.pgroonga_escape(value => timestamp), public.pgroonga_escape(value => timestamptz). Try renaming the parameters or the function itself in the database so function overloading can be resolved'
          }
        | {
            Args: { value: number }
            Returns: {
              error: true
            } & 'Could not choose the best candidate function between: public.pgroonga_escape(value => bool), public.pgroonga_escape(value => int8), public.pgroonga_escape(value => int2), public.pgroonga_escape(value => int4), public.pgroonga_escape(value => text), public.pgroonga_escape(value => float4), public.pgroonga_escape(value => float8), public.pgroonga_escape(value => timestamp), public.pgroonga_escape(value => timestamptz). Try renaming the parameters or the function itself in the database so function overloading can be resolved'
          }
        | {
            Args: { value: number }
            Returns: {
              error: true
            } & 'Could not choose the best candidate function between: public.pgroonga_escape(value => bool), public.pgroonga_escape(value => int8), public.pgroonga_escape(value => int2), public.pgroonga_escape(value => int4), public.pgroonga_escape(value => text), public.pgroonga_escape(value => float4), public.pgroonga_escape(value => float8), public.pgroonga_escape(value => timestamp), public.pgroonga_escape(value => timestamptz). Try renaming the parameters or the function itself in the database so function overloading can be resolved'
          }
        | {
            Args: { value: number }
            Returns: {
              error: true
            } & 'Could not choose the best candidate function between: public.pgroonga_escape(value => bool), public.pgroonga_escape(value => int8), public.pgroonga_escape(value => int2), public.pgroonga_escape(value => int4), public.pgroonga_escape(value => text), public.pgroonga_escape(value => float4), public.pgroonga_escape(value => float8), public.pgroonga_escape(value => timestamp), public.pgroonga_escape(value => timestamptz). Try renaming the parameters or the function itself in the database so function overloading can be resolved'
          }
        | {
            Args: { value: number }
            Returns: {
              error: true
            } & 'Could not choose the best candidate function between: public.pgroonga_escape(value => bool), public.pgroonga_escape(value => int8), public.pgroonga_escape(value => int2), public.pgroonga_escape(value => int4), public.pgroonga_escape(value => text), public.pgroonga_escape(value => float4), public.pgroonga_escape(value => float8), public.pgroonga_escape(value => timestamp), public.pgroonga_escape(value => timestamptz). Try renaming the parameters or the function itself in the database so function overloading can be resolved'
          }
        | {
            Args: { value: string }
            Returns: {
              error: true
            } & 'Could not choose the best candidate function between: public.pgroonga_escape(value => bool), public.pgroonga_escape(value => int8), public.pgroonga_escape(value => int2), public.pgroonga_escape(value => int4), public.pgroonga_escape(value => text), public.pgroonga_escape(value => float4), public.pgroonga_escape(value => float8), public.pgroonga_escape(value => timestamp), public.pgroonga_escape(value => timestamptz). Try renaming the parameters or the function itself in the database so function overloading can be resolved'
          }
        | {
            Args: { special_characters: string; value: string }
            Returns: string
          }
        | {
            Args: { value: string }
            Returns: {
              error: true
            } & 'Could not choose the best candidate function between: public.pgroonga_escape(value => bool), public.pgroonga_escape(value => int8), public.pgroonga_escape(value => int2), public.pgroonga_escape(value => int4), public.pgroonga_escape(value => text), public.pgroonga_escape(value => float4), public.pgroonga_escape(value => float8), public.pgroonga_escape(value => timestamp), public.pgroonga_escape(value => timestamptz). Try renaming the parameters or the function itself in the database so function overloading can be resolved'
          }
        | {
            Args: { value: string }
            Returns: {
              error: true
            } & 'Could not choose the best candidate function between: public.pgroonga_escape(value => bool), public.pgroonga_escape(value => int8), public.pgroonga_escape(value => int2), public.pgroonga_escape(value => int4), public.pgroonga_escape(value => text), public.pgroonga_escape(value => float4), public.pgroonga_escape(value => float8), public.pgroonga_escape(value => timestamp), public.pgroonga_escape(value => timestamptz). Try renaming the parameters or the function itself in the database so function overloading can be resolved'
          }
      pgroonga_flush: { Args: { indexname: unknown }; Returns: boolean }
      pgroonga_highlight_html:
        | { Args: { keywords: string[]; target: string }; Returns: string }
        | {
            Args: { indexname: unknown; keywords: string[]; target: string }
            Returns: string
          }
        | { Args: { keywords: string[]; targets: string[] }; Returns: string[] }
        | {
            Args: { indexname: unknown; keywords: string[]; targets: string[] }
            Returns: string[]
          }
      pgroonga_index_column_name:
        | { Args: { columnindex: number; indexname: unknown }; Returns: string }
        | { Args: { columnname: string; indexname: unknown }; Returns: string }
      pgroonga_is_writable: { Args: never; Returns: boolean }
      pgroonga_list_broken_indexes: { Args: never; Returns: string[] }
      pgroonga_list_lagged_indexes: { Args: never; Returns: string[] }
      pgroonga_match_positions_byte:
        | { Args: { keywords: string[]; target: string }; Returns: number[] }
        | {
            Args: { indexname: unknown; keywords: string[]; target: string }
            Returns: number[]
          }
      pgroonga_match_positions_character:
        | { Args: { keywords: string[]; target: string }; Returns: number[] }
        | {
            Args: { indexname: unknown; keywords: string[]; target: string }
            Returns: number[]
          }
      pgroonga_match_term:
        | { Args: { target: string; term: string }; Returns: boolean }
        | { Args: { target: string[]; term: string }; Returns: boolean }
        | { Args: { target: string; term: string }; Returns: boolean }
        | { Args: { target: string[]; term: string }; Returns: boolean }
      pgroonga_match_text_array_condition:
        | {
            Args: {
              condition: Database['public']['CompositeTypes']['pgroonga_condition']
              target: string[]
            }
            Returns: boolean
          }
        | {
            Args: {
              condition: Database['public']['CompositeTypes']['pgroonga_full_text_search_condition']
              target: string[]
            }
            Returns: boolean
          }
      pgroonga_match_text_array_condition_with_scorers: {
        Args: {
          condition: Database['public']['CompositeTypes']['pgroonga_full_text_search_condition_with_scorers']
          target: string[]
        }
        Returns: boolean
      }
      pgroonga_match_text_condition:
        | {
            Args: {
              condition: Database['public']['CompositeTypes']['pgroonga_condition']
              target: string
            }
            Returns: boolean
          }
        | {
            Args: {
              condition: Database['public']['CompositeTypes']['pgroonga_full_text_search_condition']
              target: string
            }
            Returns: boolean
          }
      pgroonga_match_text_condition_with_scorers: {
        Args: {
          condition: Database['public']['CompositeTypes']['pgroonga_full_text_search_condition_with_scorers']
          target: string
        }
        Returns: boolean
      }
      pgroonga_match_varchar_condition:
        | {
            Args: {
              condition: Database['public']['CompositeTypes']['pgroonga_condition']
              target: string
            }
            Returns: boolean
          }
        | {
            Args: {
              condition: Database['public']['CompositeTypes']['pgroonga_full_text_search_condition']
              target: string
            }
            Returns: boolean
          }
      pgroonga_match_varchar_condition_with_scorers: {
        Args: {
          condition: Database['public']['CompositeTypes']['pgroonga_full_text_search_condition_with_scorers']
          target: string
        }
        Returns: boolean
      }
      pgroonga_normalize:
        | { Args: { target: string }; Returns: string }
        | { Args: { normalizername: string; target: string }; Returns: string }
      pgroonga_prefix_varchar_condition:
        | {
            Args: {
              conditoin: Database['public']['CompositeTypes']['pgroonga_condition']
              target: string
            }
            Returns: boolean
          }
        | {
            Args: {
              conditoin: Database['public']['CompositeTypes']['pgroonga_full_text_search_condition']
              target: string
            }
            Returns: boolean
          }
      pgroonga_query_escape: { Args: { query: string }; Returns: string }
      pgroonga_query_expand: {
        Args: {
          query: string
          synonymscolumnname: string
          tablename: unknown
          termcolumnname: string
        }
        Returns: string
      }
      pgroonga_query_extract_keywords: {
        Args: { index_name?: string; query: string }
        Returns: string[]
      }
      pgroonga_query_text_array_condition:
        | {
            Args: {
              condition: Database['public']['CompositeTypes']['pgroonga_condition']
              targets: string[]
            }
            Returns: boolean
          }
        | {
            Args: {
              condition: Database['public']['CompositeTypes']['pgroonga_full_text_search_condition']
              targets: string[]
            }
            Returns: boolean
          }
      pgroonga_query_text_array_condition_with_scorers: {
        Args: {
          condition: Database['public']['CompositeTypes']['pgroonga_full_text_search_condition_with_scorers']
          targets: string[]
        }
        Returns: boolean
      }
      pgroonga_query_text_condition:
        | {
            Args: {
              condition: Database['public']['CompositeTypes']['pgroonga_condition']
              target: string
            }
            Returns: boolean
          }
        | {
            Args: {
              condition: Database['public']['CompositeTypes']['pgroonga_full_text_search_condition']
              target: string
            }
            Returns: boolean
          }
      pgroonga_query_text_condition_with_scorers: {
        Args: {
          condition: Database['public']['CompositeTypes']['pgroonga_full_text_search_condition_with_scorers']
          target: string
        }
        Returns: boolean
      }
      pgroonga_query_varchar_condition:
        | {
            Args: {
              condition: Database['public']['CompositeTypes']['pgroonga_condition']
              target: string
            }
            Returns: boolean
          }
        | {
            Args: {
              condition: Database['public']['CompositeTypes']['pgroonga_full_text_search_condition']
              target: string
            }
            Returns: boolean
          }
      pgroonga_query_varchar_condition_with_scorers: {
        Args: {
          condition: Database['public']['CompositeTypes']['pgroonga_full_text_search_condition_with_scorers']
          target: string
        }
        Returns: boolean
      }
      pgroonga_regexp_text_array: {
        Args: { pattern: string; targets: string[] }
        Returns: boolean
      }
      pgroonga_regexp_text_array_condition: {
        Args: {
          pattern: Database['public']['CompositeTypes']['pgroonga_condition']
          targets: string[]
        }
        Returns: boolean
      }
      pgroonga_result_to_jsonb_objects: {
        Args: { result: Json }
        Returns: Json
      }
      pgroonga_result_to_recordset: {
        Args: { result: Json }
        Returns: Record<string, unknown>[]
      }
      pgroonga_score:
        | { Args: { row: Record<string, unknown> }; Returns: number }
        | { Args: { ctid: unknown; tableoid: unknown }; Returns: number }
      pgroonga_set_writable: {
        Args: { newwritable: boolean }
        Returns: boolean
      }
      pgroonga_snippet_html: {
        Args: { keywords: string[]; target: string; width?: number }
        Returns: string[]
      }
      pgroonga_table_name: { Args: { indexname: unknown }; Returns: string }
      pgroonga_tokenize: {
        Args: { options: string[]; target: string }
        Returns: Json[]
      }
      pgroonga_vacuum: { Args: never; Returns: boolean }
      pgroonga_wal_apply:
        | { Args: never; Returns: number }
        | { Args: { indexname: unknown }; Returns: number }
      pgroonga_wal_set_applied_position:
        | { Args: never; Returns: boolean }
        | { Args: { block: number; offset: number }; Returns: boolean }
        | { Args: { indexname: unknown }; Returns: boolean }
        | {
            Args: { block: number; indexname: unknown; offset: number }
            Returns: boolean
          }
      pgroonga_wal_status: {
        Args: never
        Returns: {
          current_block: number
          current_offset: number
          current_size: number
          last_block: number
          last_offset: number
          last_size: number
          name: string
          oid: unknown
        }[]
      }
      pgroonga_wal_truncate:
        | { Args: never; Returns: number }
        | { Args: { indexname: unknown }; Returns: number }
      pgsm_create_11_view: { Args: never; Returns: number }
      pgsm_create_13_view: { Args: never; Returns: number }
      pgsm_create_14_view: { Args: never; Returns: number }
      pgsm_create_15_view: { Args: never; Returns: number }
      pgsm_create_17_view: { Args: never; Returns: number }
      pgsm_create_view: { Args: never; Returns: number }
      populate_geometry_columns:
        | { Args: { tbl_oid: unknown; use_typmod?: boolean }; Returns: number }
        | { Args: { use_typmod?: boolean }; Returns: string }
      postgis_constraint_dims: {
        Args: { geomcolumn: string; geomschema: string; geomtable: string }
        Returns: number
      }
      postgis_constraint_srid: {
        Args: { geomcolumn: string; geomschema: string; geomtable: string }
        Returns: number
      }
      postgis_constraint_type: {
        Args: { geomcolumn: string; geomschema: string; geomtable: string }
        Returns: string
      }
      postgis_extensions_upgrade: { Args: never; Returns: string }
      postgis_full_version: { Args: never; Returns: string }
      postgis_geos_version: { Args: never; Returns: string }
      postgis_lib_build_date: { Args: never; Returns: string }
      postgis_lib_revision: { Args: never; Returns: string }
      postgis_lib_version: { Args: never; Returns: string }
      postgis_libjson_version: { Args: never; Returns: string }
      postgis_liblwgeom_version: { Args: never; Returns: string }
      postgis_libprotobuf_version: { Args: never; Returns: string }
      postgis_libxml_version: { Args: never; Returns: string }
      postgis_proj_version: { Args: never; Returns: string }
      postgis_scripts_build_date: { Args: never; Returns: string }
      postgis_scripts_installed: { Args: never; Returns: string }
      postgis_scripts_released: { Args: never; Returns: string }
      postgis_svn_version: { Args: never; Returns: string }
      postgis_type_name: {
        Args: {
          coord_dimension: number
          geomname: string
          use_new_name?: boolean
        }
        Returns: string
      }
      postgis_version: { Args: never; Returns: string }
      postgis_wagyu_version: { Args: never; Returns: string }
      process_interaction: {
        Args: {
          p_interaction_type: Database['public']['Enums']['interaction_type']
          p_metadata?: Json
          p_target_user_id: string
        }
        Returns: {
          interaction_id: string
          is_new_match: boolean
          match_id: string
        }[]
      }
      range: { Args: never; Returns: string[] }
      refresh_leaderboard: {
        Args: { leaderboard_id_val: string }
        Returns: undefined
      }
      refresh_trending_profiles: { Args: never; Returns: undefined }
      search_profiles: {
        Args: { limit_count?: number; search_query: string; user_id: string }
        Returns: {
          display_name: string
          handle: string
          id: string
          rank: number
        }[]
      }
      set_precise_location: {
        Args: { lat: number; lon: number }
        Returns: undefined
      }
      show_limit: { Args: never; Returns: number }
      show_trgm: { Args: { '': string }; Returns: string[] }
      smart_match_suggestions: {
        Args: { limit_count?: number; user_uuid?: string }
        Returns: {
          compatibility_score: number
          display_name: string
          distance_km: number
          last_active: string
          match_reasons: string[]
          profile_id: string
        }[]
      }
      soundex: { Args: { '': string }; Returns: string }
      st_3dclosestpoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_3ddistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_3dintersects: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_3dlongestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_3dmakebox: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_3dmaxdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_3dshortestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_addpoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_angle:
        | { Args: { line1: unknown; line2: unknown }; Returns: number }
        | {
            Args: { pt1: unknown; pt2: unknown; pt3: unknown; pt4?: unknown }
            Returns: number
          }
      st_area:
        | { Args: { geog: unknown; use_spheroid?: boolean }; Returns: number }
        | { Args: { '': string }; Returns: number }
      st_asencodedpolyline: {
        Args: { geom: unknown; nprecision?: number }
        Returns: string
      }
      st_asewkt: { Args: { '': string }; Returns: string }
      st_asgeojson:
        | {
            Args: { geog: unknown; maxdecimaldigits?: number; options?: number }
            Returns: string
          }
        | {
            Args: { geom: unknown; maxdecimaldigits?: number; options?: number }
            Returns: string
          }
        | {
            Args: {
              geom_column?: string
              maxdecimaldigits?: number
              pretty_bool?: boolean
              r: Record<string, unknown>
            }
            Returns: string
          }
        | { Args: { '': string }; Returns: string }
      st_asgml:
        | {
            Args: {
              geog: unknown
              id?: string
              maxdecimaldigits?: number
              nprefix?: string
              options?: number
            }
            Returns: string
          }
        | {
            Args: { geom: unknown; maxdecimaldigits?: number; options?: number }
            Returns: string
          }
        | { Args: { '': string }; Returns: string }
        | {
            Args: {
              geog: unknown
              id?: string
              maxdecimaldigits?: number
              nprefix?: string
              options?: number
              version: number
            }
            Returns: string
          }
        | {
            Args: {
              geom: unknown
              id?: string
              maxdecimaldigits?: number
              nprefix?: string
              options?: number
              version: number
            }
            Returns: string
          }
      st_askml:
        | {
            Args: { geog: unknown; maxdecimaldigits?: number; nprefix?: string }
            Returns: string
          }
        | {
            Args: { geom: unknown; maxdecimaldigits?: number; nprefix?: string }
            Returns: string
          }
        | { Args: { '': string }; Returns: string }
      st_aslatlontext: {
        Args: { geom: unknown; tmpl?: string }
        Returns: string
      }
      st_asmarc21: { Args: { format?: string; geom: unknown }; Returns: string }
      st_asmvtgeom: {
        Args: {
          bounds: unknown
          buffer?: number
          clip_geom?: boolean
          extent?: number
          geom: unknown
        }
        Returns: unknown
      }
      st_assvg:
        | {
            Args: { geog: unknown; maxdecimaldigits?: number; rel?: number }
            Returns: string
          }
        | {
            Args: { geom: unknown; maxdecimaldigits?: number; rel?: number }
            Returns: string
          }
        | { Args: { '': string }; Returns: string }
      st_astext: { Args: { '': string }; Returns: string }
      st_astwkb:
        | {
            Args: {
              geom: unknown
              prec?: number
              prec_m?: number
              prec_z?: number
              with_boxes?: boolean
              with_sizes?: boolean
            }
            Returns: string
          }
        | {
            Args: {
              geom: unknown[]
              ids: number[]
              prec?: number
              prec_m?: number
              prec_z?: number
              with_boxes?: boolean
              with_sizes?: boolean
            }
            Returns: string
          }
      st_asx3d: {
        Args: { geom: unknown; maxdecimaldigits?: number; options?: number }
        Returns: string
      }
      st_azimuth:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: number }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: number }
      st_boundingdiagonal: {
        Args: { fits?: boolean; geom: unknown }
        Returns: unknown
      }
      st_buffer:
        | {
            Args: { geom: unknown; options?: string; radius: number }
            Returns: unknown
          }
        | {
            Args: { geom: unknown; quadsegs: number; radius: number }
            Returns: unknown
          }
      st_centroid: { Args: { '': string }; Returns: unknown }
      st_clipbybox2d: {
        Args: { box: unknown; geom: unknown }
        Returns: unknown
      }
      st_closestpoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_collect: { Args: { geom1: unknown; geom2: unknown }; Returns: unknown }
      st_concavehull: {
        Args: {
          param_allow_holes?: boolean
          param_geom: unknown
          param_pctconvex: number
        }
        Returns: unknown
      }
      st_contains: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_containsproperly: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_coorddim: { Args: { geometry: unknown }; Returns: number }
      st_coveredby:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_covers:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_crosses: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_curvetoline: {
        Args: { flags?: number; geom: unknown; tol?: number; toltype?: number }
        Returns: unknown
      }
      st_delaunaytriangles: {
        Args: { flags?: number; g1: unknown; tolerance?: number }
        Returns: unknown
      }
      st_difference: {
        Args: { geom1: unknown; geom2: unknown; gridsize?: number }
        Returns: unknown
      }
      st_disjoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_distance:
        | {
            Args: { geog1: unknown; geog2: unknown; use_spheroid?: boolean }
            Returns: number
          }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: number }
      st_distancesphere:
        | { Args: { geom1: unknown; geom2: unknown }; Returns: number }
        | {
            Args: { geom1: unknown; geom2: unknown; radius: number }
            Returns: number
          }
      st_distancespheroid: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_dwithin: {
        Args: {
          geog1: unknown
          geog2: unknown
          tolerance: number
          use_spheroid?: boolean
        }
        Returns: boolean
      }
      st_equals: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_expand:
        | { Args: { box: unknown; dx: number; dy: number }; Returns: unknown }
        | {
            Args: { box: unknown; dx: number; dy: number; dz?: number }
            Returns: unknown
          }
        | {
            Args: {
              dm?: number
              dx: number
              dy: number
              dz?: number
              geom: unknown
            }
            Returns: unknown
          }
      st_force3d: { Args: { geom: unknown; zvalue?: number }; Returns: unknown }
      st_force3dm: {
        Args: { geom: unknown; mvalue?: number }
        Returns: unknown
      }
      st_force3dz: {
        Args: { geom: unknown; zvalue?: number }
        Returns: unknown
      }
      st_force4d: {
        Args: { geom: unknown; mvalue?: number; zvalue?: number }
        Returns: unknown
      }
      st_generatepoints:
        | { Args: { area: unknown; npoints: number }; Returns: unknown }
        | {
            Args: { area: unknown; npoints: number; seed: number }
            Returns: unknown
          }
      st_geogfromtext: { Args: { '': string }; Returns: unknown }
      st_geographyfromtext: { Args: { '': string }; Returns: unknown }
      st_geohash:
        | { Args: { geog: unknown; maxchars?: number }; Returns: string }
        | { Args: { geom: unknown; maxchars?: number }; Returns: string }
      st_geomcollfromtext: { Args: { '': string }; Returns: unknown }
      st_geometricmedian: {
        Args: {
          fail_if_not_converged?: boolean
          g: unknown
          max_iter?: number
          tolerance?: number
        }
        Returns: unknown
      }
      st_geometryfromtext: { Args: { '': string }; Returns: unknown }
      st_geomfromewkt: { Args: { '': string }; Returns: unknown }
      st_geomfromgeojson:
        | { Args: { '': Json }; Returns: unknown }
        | { Args: { '': Json }; Returns: unknown }
        | { Args: { '': string }; Returns: unknown }
      st_geomfromgml: { Args: { '': string }; Returns: unknown }
      st_geomfromkml: { Args: { '': string }; Returns: unknown }
      st_geomfrommarc21: { Args: { marc21xml: string }; Returns: unknown }
      st_geomfromtext: { Args: { '': string }; Returns: unknown }
      st_gmltosql: { Args: { '': string }; Returns: unknown }
      st_hasarc: { Args: { geometry: unknown }; Returns: boolean }
      st_hausdorffdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_hexagon: {
        Args: { cell_i: number; cell_j: number; origin?: unknown; size: number }
        Returns: unknown
      }
      st_hexagongrid: {
        Args: { bounds: unknown; size: number }
        Returns: Record<string, unknown>[]
      }
      st_interpolatepoint: {
        Args: { line: unknown; point: unknown }
        Returns: number
      }
      st_intersection: {
        Args: { geom1: unknown; geom2: unknown; gridsize?: number }
        Returns: unknown
      }
      st_intersects:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_isvaliddetail: {
        Args: { flags?: number; geom: unknown }
        Returns: Database['public']['CompositeTypes']['valid_detail']
        SetofOptions: {
          from: '*'
          to: 'valid_detail'
          isOneToOne: true
          isSetofReturn: false
        }
      }
      st_length:
        | { Args: { geog: unknown; use_spheroid?: boolean }; Returns: number }
        | { Args: { '': string }; Returns: number }
      st_letters: { Args: { font?: Json; letters: string }; Returns: unknown }
      st_linecrossingdirection: {
        Args: { line1: unknown; line2: unknown }
        Returns: number
      }
      st_linefromencodedpolyline: {
        Args: { nprecision?: number; txtin: string }
        Returns: unknown
      }
      st_linefromtext: { Args: { '': string }; Returns: unknown }
      st_linelocatepoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_linetocurve: { Args: { geometry: unknown }; Returns: unknown }
      st_locatealong: {
        Args: { geometry: unknown; leftrightoffset?: number; measure: number }
        Returns: unknown
      }
      st_locatebetween: {
        Args: {
          frommeasure: number
          geometry: unknown
          leftrightoffset?: number
          tomeasure: number
        }
        Returns: unknown
      }
      st_locatebetweenelevations: {
        Args: { fromelevation: number; geometry: unknown; toelevation: number }
        Returns: unknown
      }
      st_longestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_makebox2d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_makeline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_makevalid: {
        Args: { geom: unknown; params: string }
        Returns: unknown
      }
      st_maxdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_minimumboundingcircle: {
        Args: { inputgeom: unknown; segs_per_quarter?: number }
        Returns: unknown
      }
      st_mlinefromtext: { Args: { '': string }; Returns: unknown }
      st_mpointfromtext: { Args: { '': string }; Returns: unknown }
      st_mpolyfromtext: { Args: { '': string }; Returns: unknown }
      st_multilinestringfromtext: { Args: { '': string }; Returns: unknown }
      st_multipointfromtext: { Args: { '': string }; Returns: unknown }
      st_multipolygonfromtext: { Args: { '': string }; Returns: unknown }
      st_node: { Args: { g: unknown }; Returns: unknown }
      st_normalize: { Args: { geom: unknown }; Returns: unknown }
      st_offsetcurve: {
        Args: { distance: number; line: unknown; params?: string }
        Returns: unknown
      }
      st_orderingequals: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_overlaps: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_perimeter: {
        Args: { geog: unknown; use_spheroid?: boolean }
        Returns: number
      }
      st_pointfromtext: { Args: { '': string }; Returns: unknown }
      st_pointm: {
        Args: {
          mcoordinate: number
          srid?: number
          xcoordinate: number
          ycoordinate: number
        }
        Returns: unknown
      }
      st_pointz: {
        Args: {
          srid?: number
          xcoordinate: number
          ycoordinate: number
          zcoordinate: number
        }
        Returns: unknown
      }
      st_pointzm: {
        Args: {
          mcoordinate: number
          srid?: number
          xcoordinate: number
          ycoordinate: number
          zcoordinate: number
        }
        Returns: unknown
      }
      st_polyfromtext: { Args: { '': string }; Returns: unknown }
      st_polygonfromtext: { Args: { '': string }; Returns: unknown }
      st_project: {
        Args: { azimuth: number; distance: number; geog: unknown }
        Returns: unknown
      }
      st_quantizecoordinates: {
        Args: {
          g: unknown
          prec_m?: number
          prec_x: number
          prec_y?: number
          prec_z?: number
        }
        Returns: unknown
      }
      st_reduceprecision: {
        Args: { geom: unknown; gridsize: number }
        Returns: unknown
      }
      st_relate: { Args: { geom1: unknown; geom2: unknown }; Returns: string }
      st_removerepeatedpoints: {
        Args: { geom: unknown; tolerance?: number }
        Returns: unknown
      }
      st_segmentize: {
        Args: { geog: unknown; max_segment_length: number }
        Returns: unknown
      }
      st_setsrid:
        | { Args: { geog: unknown; srid: number }; Returns: unknown }
        | { Args: { geom: unknown; srid: number }; Returns: unknown }
      st_sharedpaths: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_shortestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_simplifypolygonhull: {
        Args: { geom: unknown; is_outer?: boolean; vertex_fraction: number }
        Returns: unknown
      }
      st_split: { Args: { geom1: unknown; geom2: unknown }; Returns: unknown }
      st_square: {
        Args: { cell_i: number; cell_j: number; origin?: unknown; size: number }
        Returns: unknown
      }
      st_squaregrid: {
        Args: { bounds: unknown; size: number }
        Returns: Record<string, unknown>[]
      }
      st_srid:
        | { Args: { geog: unknown }; Returns: number }
        | { Args: { geom: unknown }; Returns: number }
      st_subdivide: {
        Args: { geom: unknown; gridsize?: number; maxvertices?: number }
        Returns: unknown[]
      }
      st_swapordinates: {
        Args: { geom: unknown; ords: unknown }
        Returns: unknown
      }
      st_symdifference: {
        Args: { geom1: unknown; geom2: unknown; gridsize?: number }
        Returns: unknown
      }
      st_symmetricdifference: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_tileenvelope: {
        Args: {
          bounds?: unknown
          margin?: number
          x: number
          y: number
          zoom: number
        }
        Returns: unknown
      }
      st_touches: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_transform:
        | {
            Args: { from_proj: string; geom: unknown; to_proj: string }
            Returns: unknown
          }
        | {
            Args: { from_proj: string; geom: unknown; to_srid: number }
            Returns: unknown
          }
        | { Args: { geom: unknown; to_proj: string }; Returns: unknown }
      st_triangulatepolygon: { Args: { g1: unknown }; Returns: unknown }
      st_union:
        | { Args: { geom1: unknown; geom2: unknown }; Returns: unknown }
        | {
            Args: { geom1: unknown; geom2: unknown; gridsize: number }
            Returns: unknown
          }
      st_voronoilines: {
        Args: { extend_to?: unknown; g1: unknown; tolerance?: number }
        Returns: unknown
      }
      st_voronoipolygons: {
        Args: { extend_to?: unknown; g1: unknown; tolerance?: number }
        Returns: unknown
      }
      st_within: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_wkbtosql: { Args: { wkb: string }; Returns: unknown }
      st_wkttosql: { Args: { '': string }; Returns: unknown }
      st_wrapx: {
        Args: { geom: unknown; move: number; wrap: number }
        Returns: unknown
      }
      text_soundex: { Args: { '': string }; Returns: string }
      text_to_bytea: { Args: { data: string }; Returns: string }
      track_magic_link_usage: {
        Args: {
          p_email: string
          p_ip_address?: unknown
          p_redirect_to?: string
          p_user_agent?: string
          p_user_id?: string
        }
        Returns: string
      }
      ultimate_discover: {
        Args: {
          distance_weight?: number
          keyword_weight?: number
          match_count?: number
          match_threshold?: number
          max_age?: number
          max_distance_km?: number
          min_age?: number
          query_embedding: string
          query_text?: string
          semantic_weight?: number
          target_position?: string
          user_location?: unknown
        }
        Returns: {
          completion_boost: number
          display_name: string
          distance_km: number
          final_score: number
          keyword_score: number
          match_explanation: Json
          popularity_boost: number
          profile_id: string
          semantic_score: number
        }[]
      }
      unlockrows: { Args: { '': string }; Returns: number }
      update_compatibility_scores: {
        Args: { p_user_id: string }
        Returns: undefined
      }
      update_online_statuses: { Args: never; Returns: number }
      updategeometrysrid: {
        Args: {
          catalogn_name: string
          column_name: string
          new_srid_in: number
          schema_name: string
          table_name: string
        }
        Returns: string
      }
      urlencode:
        | { Args: { data: Json }; Returns: string }
        | {
            Args: { string: string }
            Returns: {
              error: true
            } & 'Could not choose the best candidate function between: public.urlencode(string => bytea), public.urlencode(string => varchar). Try renaming the parameters or the function itself in the database so function overloading can be resolved'
          }
        | {
            Args: { string: string }
            Returns: {
              error: true
            } & 'Could not choose the best candidate function between: public.urlencode(string => bytea), public.urlencode(string => varchar). Try renaming the parameters or the function itself in the database so function overloading can be resolved'
          }
      verify_magic_link: {
        Args: { p_ip_address?: unknown; p_token_hash: string }
        Returns: Json
      }
      zenith_discover: {
        Args: {
          match_count?: number
          match_threshold?: number
          max_age?: number
          min_age?: number
          query_embedding: string
          target_gender?: string
        }
        Returns: {
          display_name: string
          final_score: number
          popularity_boost: number
          profile_id: string
          similarity: number
        }[]
      }
      zenith_discover_v2: {
        Args: {
          distance_weight?: number
          keyword_weight?: number
          match_count?: number
          match_threshold?: number
          max_age?: number
          min_age?: number
          query_embedding: string
          query_text?: string
          semantic_weight?: number
          target_gender?: string
          user_location?: unknown
        }
        Returns: {
          display_name: string
          distance_km: number
          final_score: number
          keyword_score: number
          profile_id: string
          semantic_score: number
        }[]
      }
    }
    Enums: {
      account_status: 'active' | 'suspended' | 'banned' | 'under_review' | 'deleted'
      account_status_enum: 'pending' | 'active' | 'suspended' | 'deleted'
      attendee_status: 'interested' | 'going' | 'maybe' | 'not_going'
      booking_status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'disputed'
      event_category:
        | 'gym'
        | 'cinema'
        | 'meetup'
        | 'drinks'
        | 'food'
        | 'sports'
        | 'music'
        | 'art'
        | 'tech'
        | 'outdoors'
        | 'travel'
        | 'pride'
        | 'other'
      event_type:
        | 'chill'
        | 'house_party'
        | 'meetup'
        | 'pride_event'
        | 'festival'
        | 'sports'
        | 'arts'
        | 'nightlife'
      interaction_type: 'tap' | 'super_tap' | 'message' | 'view' | 'block' | 'report'
      kink_fetish_type:
        | 'bareback'
        | 'breeding'
        | 'fisting'
        | 'pup_play'
        | 'rubber'
        | 'bondage'
        | 'dom_sub'
        | 'oral'
        | 'anal'
        | 'group_sex'
        | 'public'
        | 'toys'
        | 'watersports'
        | 'ff'
        | 'other'
      match_type: 'mutual' | 'ai_suggested' | 'proximity' | 'interest_based' | 'superlike'
      media_type_enum: 'photo' | 'video' | 'audio'
      message_type: 'text' | 'image' | 'video' | 'audio' | 'location' | 'system' | 'quickshare'
      notification_type:
        | 'new_match'
        | 'new_message'
        | 'new_tap'
        | 'profile_view'
        | 'system_update'
        | 'safety_alert'
        | 'premium_expiring'
      notification_type_enum:
        | 'new_match'
        | 'new_message'
        | 'new_tap'
        | 'profile_view'
        | 'system_update'
        | 'safety_alert'
        | 'premium_expiring'
      presence_status: 'online' | 'away' | 'busy' | 'offline' | 'invisible'
      privacy_level: 'public' | 'friends' | 'private' | 'incognito'
      profile_visibility: 'public' | 'friends_only' | 'private'
      profile_visibility_enum: 'public' | 'friends' | 'private'
      relationship_status_enum:
        | 'single'
        | 'dating'
        | 'committed'
        | 'open_relationship'
        | 'polyamorous'
        | 'complicated'
      report_reason:
        | 'inappropriate'
        | 'harassment'
        | 'fake_profile'
        | 'spam'
        | 'underage'
        | 'scam'
        | 'other'
      report_status: 'pending' | 'reviewing' | 'resolved' | 'dismissed' | 'escalated'
      subscription_status: 'active' | 'canceled' | 'past_due' | 'unpaid' | 'incomplete'
      subscription_tier: 'free' | 'premium' | 'plus' | 'vip' | 'enterprise'
      tap_type: 'flame' | 'wave' | 'heart' | 'wow' | 'wink' | 'look'
      user_role: 'seeker' | 'provider' | 'admin' | 'moderator'
      user_tier: 'free' | 'premium' | 'premium_plus' | 'vip'
      user_tier_enum: 'free' | 'premium' | 'premium_plus' | 'vip'
      verification_status: 'unverified' | 'pending' | 'verified' | 'rejected'
      verification_status_enum: 'unverified' | 'pending' | 'verified' | 'rejected'
    }
    CompositeTypes: {
      geometry_dump: {
        path: number[] | null
        geom: unknown
      }
      http_header: {
        field: string | null
        value: string | null
      }
      http_request: {
        method: unknown
        uri: string | null
        headers: Database['public']['CompositeTypes']['http_header'][] | null
        content_type: string | null
        content: string | null
      }
      http_response: {
        status: number | null
        content_type: string | null
        headers: Database['public']['CompositeTypes']['http_header'][] | null
        content: string | null
      }
      pgroonga_condition: {
        query: string | null
        weigths: number[] | null
        scorers: string[] | null
        schema_name: string | null
        index_name: string | null
        column_name: string | null
        fuzzy_max_distance_ratio: number | null
      }
      pgroonga_full_text_search_condition: {
        query: string | null
        weigths: number[] | null
        indexname: string | null
      }
      pgroonga_full_text_search_condition_with_scorers: {
        query: string | null
        weigths: number[] | null
        scorers: string[] | null
        indexname: string | null
      }
      valid_detail: {
        valid: boolean | null
        reason: string | null
        location: unknown
      }
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      account_status: ['active', 'suspended', 'banned', 'under_review', 'deleted'],
      account_status_enum: ['pending', 'active', 'suspended', 'deleted'],
      attendee_status: ['interested', 'going', 'maybe', 'not_going'],
      booking_status: ['pending', 'confirmed', 'cancelled', 'completed', 'disputed'],
      event_category: [
        'gym',
        'cinema',
        'meetup',
        'drinks',
        'food',
        'sports',
        'music',
        'art',
        'tech',
        'outdoors',
        'travel',
        'pride',
        'other',
      ],
      event_type: [
        'chill',
        'house_party',
        'meetup',
        'pride_event',
        'festival',
        'sports',
        'arts',
        'nightlife',
      ],
      interaction_type: ['tap', 'super_tap', 'message', 'view', 'block', 'report'],
      kink_fetish_type: [
        'bareback',
        'breeding',
        'fisting',
        'pup_play',
        'rubber',
        'bondage',
        'dom_sub',
        'oral',
        'anal',
        'group_sex',
        'public',
        'toys',
        'watersports',
        'ff',
        'other',
      ],
      match_type: ['mutual', 'ai_suggested', 'proximity', 'interest_based', 'superlike'],
      media_type_enum: ['photo', 'video', 'audio'],
      message_type: ['text', 'image', 'video', 'audio', 'location', 'system', 'quickshare'],
      notification_type: [
        'new_match',
        'new_message',
        'new_tap',
        'profile_view',
        'system_update',
        'safety_alert',
        'premium_expiring',
      ],
      notification_type_enum: [
        'new_match',
        'new_message',
        'new_tap',
        'profile_view',
        'system_update',
        'safety_alert',
        'premium_expiring',
      ],
      presence_status: ['online', 'away', 'busy', 'offline', 'invisible'],
      privacy_level: ['public', 'friends', 'private', 'incognito'],
      profile_visibility: ['public', 'friends_only', 'private'],
      profile_visibility_enum: ['public', 'friends', 'private'],
      relationship_status_enum: [
        'single',
        'dating',
        'committed',
        'open_relationship',
        'polyamorous',
        'complicated',
      ],
      report_reason: [
        'inappropriate',
        'harassment',
        'fake_profile',
        'spam',
        'underage',
        'scam',
        'other',
      ],
      report_status: ['pending', 'reviewing', 'resolved', 'dismissed', 'escalated'],
      subscription_status: ['active', 'canceled', 'past_due', 'unpaid', 'incomplete'],
      subscription_tier: ['free', 'premium', 'plus', 'vip', 'enterprise'],
      tap_type: ['flame', 'wave', 'heart', 'wow', 'wink', 'look'],
      user_role: ['seeker', 'provider', 'admin', 'moderator'],
      user_tier: ['free', 'premium', 'premium_plus', 'vip'],
      user_tier_enum: ['free', 'premium', 'premium_plus', 'vip'],
      verification_status: ['unverified', 'pending', 'verified', 'rejected'],
      verification_status_enum: ['unverified', 'pending', 'verified', 'rejected'],
    },
  },
} as const
