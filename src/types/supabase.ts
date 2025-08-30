// Database types for Supabase integration
// Auto-generated types based on our database schema

export interface Database {
  public: {
    Tables: {
      influencers: {
        Row: {
          id: string
          user_id: string
          first_name: string | null
          last_name: string | null
          display_name: string | null
          email: string
          phone: string | null
          instagram_handle: string | null
          youtube_channel: string | null
          tiktok_handle: string | null
          followers_count: number
          bio: string | null
          category: string | null
          experience_years: number
          total_live_sessions: number
          total_viewers: number
          average_session_duration: number
          commission_rate: number
          total_earnings: number
          is_verified: boolean
          is_active: boolean
          verification_status: 'pending' | 'verified' | 'rejected'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          first_name?: string | null
          last_name?: string | null
          display_name?: string | null
          email: string
          phone?: string | null
          instagram_handle?: string | null
          youtube_channel?: string | null
          tiktok_handle?: string | null
          followers_count?: number
          bio?: string | null
          category?: string | null
          experience_years?: number
          total_live_sessions?: number
          total_viewers?: number
          average_session_duration?: number
          commission_rate?: number
          total_earnings?: number
          is_verified?: boolean
          is_active?: boolean
          verification_status?: 'pending' | 'verified' | 'rejected'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          first_name?: string | null
          last_name?: string | null
          display_name?: string | null
          email?: string
          phone?: string | null
          instagram_handle?: string | null
          youtube_channel?: string | null
          tiktok_handle?: string | null
          followers_count?: number
          bio?: string | null
          category?: string | null
          experience_years?: number
          total_live_sessions?: number
          total_viewers?: number
          average_session_duration?: number
          commission_rate?: number
          total_earnings?: number
          is_verified?: boolean
          is_active?: boolean
          verification_status?: 'pending' | 'verified' | 'rejected'
          created_at?: string
          updated_at?: string
        }
      }
      influencer_achievements: {
        Row: {
          id: string
          influencer_id: string
          achievement_type: string
          title: string
          description: string | null
          criteria: any | null
          is_completed: boolean
          completed_at: string | null
          progress_value: number
          target_value: number | null
          icon_name: string | null
          badge_color: string | null
          points_awarded: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          influencer_id: string
          achievement_type: string
          title: string
          description?: string | null
          criteria?: any | null
          is_completed?: boolean
          completed_at?: string | null
          progress_value?: number
          target_value?: number | null
          icon_name?: string | null
          badge_color?: string | null
          points_awarded?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          influencer_id?: string
          achievement_type?: string
          title?: string
          description?: string | null
          criteria?: any | null
          is_completed?: boolean
          completed_at?: string | null
          progress_value?: number
          target_value?: number | null
          icon_name?: string | null
          badge_color?: string | null
          points_awarded?: number
          created_at?: string
          updated_at?: string
        }
      }
      influencer_goals: {
        Row: {
          id: string
          influencer_id: string
          goal_type: string
          title: string
          description: string | null
          period_type: 'weekly' | 'monthly' | 'quarterly' | 'yearly'
          start_date: string
          end_date: string
          target_value: number
          current_value: number
          unit: string | null
          status: 'active' | 'completed' | 'failed' | 'paused'
          completion_percentage: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          influencer_id: string
          goal_type: string
          title: string
          description?: string | null
          period_type: 'weekly' | 'monthly' | 'quarterly' | 'yearly'
          start_date: string
          end_date: string
          target_value: number
          current_value?: number
          unit?: string | null
          status?: 'active' | 'completed' | 'failed' | 'paused'
          completion_percentage?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          influencer_id?: string
          goal_type?: string
          title?: string
          description?: string | null
          period_type?: 'weekly' | 'monthly' | 'quarterly' | 'yearly'
          start_date?: string
          end_date?: string
          target_value?: number
          current_value?: number
          unit?: string | null
          status?: 'active' | 'completed' | 'failed' | 'paused'
          completion_percentage?: number
          created_at?: string
          updated_at?: string
        }
      }
      influencer_earnings: {
        Row: {
          id: string
          influencer_id: string
          live_session_id: string | null
          earning_type: string
          amount: number
          commission_rate: number | null
          gross_sales: number | null
          order_id: string | null
          product_id: string | null
          status: 'pending' | 'processed' | 'paid' | 'disputed'
          payment_date: string | null
          description: string | null
          notes: string | null
          earned_at: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          influencer_id: string
          live_session_id?: string | null
          earning_type: string
          amount: number
          commission_rate?: number | null
          gross_sales?: number | null
          order_id?: string | null
          product_id?: string | null
          status?: 'pending' | 'processed' | 'paid' | 'disputed'
          payment_date?: string | null
          description?: string | null
          notes?: string | null
          earned_at?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          influencer_id?: string
          live_session_id?: string | null
          earning_type?: string
          amount?: number
          commission_rate?: number | null
          gross_sales?: number | null
          order_id?: string | null
          product_id?: string | null
          status?: 'pending' | 'processed' | 'paid' | 'disputed'
          payment_date?: string | null
          description?: string | null
          notes?: string | null
          earned_at?: string
          created_at?: string
          updated_at?: string
        }
      }
      influencer_notifications: {
        Row: {
          id: string
          influencer_id: string
          title: string
          message: string
          type: string
          priority: 'low' | 'normal' | 'high' | 'urgent'
          is_read: boolean
          is_deleted: boolean
          related_type: string | null
          related_id: string | null
          action_url: string | null
          action_text: string | null
          created_at: string
          read_at: string | null
          deleted_at: string | null
        }
        Insert: {
          id?: string
          influencer_id: string
          title: string
          message: string
          type: string
          priority?: 'low' | 'normal' | 'high' | 'urgent'
          is_read?: boolean
          is_deleted?: boolean
          related_type?: string | null
          related_id?: string | null
          action_url?: string | null
          action_text?: string | null
          created_at?: string
          read_at?: string | null
          deleted_at?: string | null
        }
        Update: {
          id?: string
          influencer_id?: string
          title?: string
          message?: string
          type?: string
          priority?: 'low' | 'normal' | 'high' | 'urgent'
          is_read?: boolean
          is_deleted?: boolean
          related_type?: string | null
          related_id?: string | null
          action_url?: string | null
          action_text?: string | null
          created_at?: string
          read_at?: string | null
          deleted_at?: string | null
        }
      }
      influencer_settings: {
        Row: {
          id: string
          influencer_id: string
          email_notifications: boolean
          push_notifications: boolean
          sms_notifications: boolean
          notification_frequency: 'instant' | 'daily' | 'weekly'
          auto_record_streams: boolean
          stream_quality: 'low' | 'medium' | 'high' | 'ultra'
          chat_moderation_level: 'none' | 'low' | 'medium' | 'high'
          profile_visibility: 'public' | 'private' | 'followers_only'
          show_earnings: boolean
          show_follower_count: boolean
          default_goal_period: 'weekly' | 'monthly' | 'quarterly'
          goal_reminder_frequency: 'daily' | 'weekly' | 'monthly'
          dashboard_theme: 'light' | 'dark' | 'auto'
          preferred_currency: string
          timezone: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          influencer_id: string
          email_notifications?: boolean
          push_notifications?: boolean
          sms_notifications?: boolean
          notification_frequency?: 'instant' | 'daily' | 'weekly'
          auto_record_streams?: boolean
          stream_quality?: 'low' | 'medium' | 'high' | 'ultra'
          chat_moderation_level?: 'none' | 'low' | 'medium' | 'high'
          profile_visibility?: 'public' | 'private' | 'followers_only'
          show_earnings?: boolean
          show_follower_count?: boolean
          default_goal_period?: 'weekly' | 'monthly' | 'quarterly'
          goal_reminder_frequency?: 'daily' | 'weekly' | 'monthly'
          dashboard_theme?: 'light' | 'dark' | 'auto'
          preferred_currency?: string
          timezone?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          influencer_id?: string
          email_notifications?: boolean
          push_notifications?: boolean
          sms_notifications?: boolean
          notification_frequency?: 'instant' | 'daily' | 'weekly'
          auto_record_streams?: boolean
          stream_quality?: 'low' | 'medium' | 'high' | 'ultra'
          chat_moderation_level?: 'none' | 'low' | 'medium' | 'high'
          profile_visibility?: 'public' | 'private' | 'followers_only'
          show_earnings?: boolean
          show_follower_count?: boolean
          default_goal_period?: 'weekly' | 'monthly' | 'quarterly'
          goal_reminder_frequency?: 'daily' | 'weekly' | 'monthly'
          dashboard_theme?: 'light' | 'dark' | 'auto'
          preferred_currency?: string
          timezone?: string
          created_at?: string
          updated_at?: string
        }
      }
      live_sessions: {
        Row: {
          id: string
          influencer_id: string
          title: string
          description: string | null
          scheduled_start_time: string | null
          actual_start_time: string | null
          end_time: string | null
          duration_minutes: number | null
          peak_viewers: number
          total_unique_viewers: number
          total_products_showcased: number
          total_sales_generated: number
          status: 'scheduled' | 'live' | 'ended' | 'cancelled'
          stream_url: string | null
          recording_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          influencer_id: string
          title: string
          description?: string | null
          scheduled_start_time?: string | null
          actual_start_time?: string | null
          end_time?: string | null
          duration_minutes?: number | null
          peak_viewers?: number
          total_unique_viewers?: number
          total_products_showcased?: number
          total_sales_generated?: number
          status?: 'scheduled' | 'live' | 'ended' | 'cancelled'
          stream_url?: string | null
          recording_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          influencer_id?: string
          title?: string
          description?: string | null
          scheduled_start_time?: string | null
          actual_start_time?: string | null
          end_time?: string | null
          duration_minutes?: number | null
          peak_viewers?: number
          total_unique_viewers?: number
          total_products_showcased?: number
          total_sales_generated?: number
          status?: 'scheduled' | 'live' | 'ended' | 'cancelled'
          stream_url?: string | null
          recording_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_default_influencer_achievements: {
        Args: {
          p_influencer_id: string
        }
        Returns: undefined
      }
      create_default_influencer_goals: {
        Args: {
          p_influencer_id: string
        }
        Returns: undefined
      }
      create_default_influencer_settings: {
        Args: {
          p_influencer_id: string
        }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Helper types for easier usage
export type Influencer = Database['public']['Tables']['influencers']['Row']
export type InfluencerAchievement = Database['public']['Tables']['influencer_achievements']['Row']
export type InfluencerGoal = Database['public']['Tables']['influencer_goals']['Row']
export type InfluencerEarning = Database['public']['Tables']['influencer_earnings']['Row']
export type InfluencerNotification = Database['public']['Tables']['influencer_notifications']['Row']
export type InfluencerSettings = Database['public']['Tables']['influencer_settings']['Row']
export type LiveSession = Database['public']['Tables']['live_sessions']['Row']

// Insert types
export type InsertInfluencer = Database['public']['Tables']['influencers']['Insert']
export type InsertInfluencerAchievement = Database['public']['Tables']['influencer_achievements']['Insert']
export type InsertInfluencerGoal = Database['public']['Tables']['influencer_goals']['Insert']
export type InsertInfluencerEarning = Database['public']['Tables']['influencer_earnings']['Insert']
export type InsertInfluencerNotification = Database['public']['Tables']['influencer_notifications']['Insert']
export type InsertInfluencerSettings = Database['public']['Tables']['influencer_settings']['Insert']
export type InsertLiveSession = Database['public']['Tables']['live_sessions']['Insert']

// Update types
export type UpdateInfluencer = Database['public']['Tables']['influencers']['Update']
export type UpdateInfluencerAchievement = Database['public']['Tables']['influencer_achievements']['Update']
export type UpdateInfluencerGoal = Database['public']['Tables']['influencer_goals']['Update']
export type UpdateInfluencerEarning = Database['public']['Tables']['influencer_earnings']['Update']
export type UpdateInfluencerNotification = Database['public']['Tables']['influencer_notifications']['Update']
export type UpdateInfluencerSettings = Database['public']['Tables']['influencer_settings']['Update']
export type UpdateLiveSession = Database['public']['Tables']['live_sessions']['Update']
