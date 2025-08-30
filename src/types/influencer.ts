// TypeScript types for Influencer Dashboard - matching database schema

export interface Influencer {
  id: string;
  user_id: string;
  first_name?: string;
  last_name?: string;
  display_name?: string;
  email: string;
  phone?: string;
  instagram_handle?: string;
  youtube_channel?: string;
  tiktok_handle?: string;
  followers_count: number;
  bio?: string;
  category?: string;
  experience_years: number;
  total_live_sessions: number;
  total_viewers: number;
  average_session_duration: number;
  commission_rate: number;
  total_earnings: number;
  is_verified: boolean;
  is_active: boolean;
  verification_status: 'pending' | 'verified' | 'rejected';
  created_at: string;
  updated_at: string;
}

export interface InfluencerAchievement {
  id: string;
  influencer_id: string;
  achievement_type: string;
  title: string;
  description?: string;
  criteria?: any;
  is_completed: boolean;
  completed_at?: string;
  progress_value: number;
  target_value?: number;
  icon_name?: string;
  badge_color?: string;
  points_awarded: number;
  created_at: string;
  updated_at: string;
}

export interface InfluencerGoal {
  id: string;
  influencer_id: string;
  goal_type: string;
  title: string;
  description?: string;
  period_type: 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  start_date: string;
  end_date: string;
  target_value: number;
  current_value: number;
  unit?: string;
  status: 'active' | 'completed' | 'failed' | 'paused';
  completion_percentage: number;
  created_at: string;
  updated_at: string;
}

export interface InfluencerEarning {
  id: string;
  influencer_id: string;
  live_session_id?: string;
  earning_type: string;
  amount: number;
  commission_rate?: number;
  gross_sales?: number;
  order_id?: string;
  product_id?: string;
  status: 'pending' | 'processed' | 'paid' | 'disputed';
  payment_date?: string;
  description?: string;
  notes?: string;
  earned_at: string;
  created_at: string;
  updated_at: string;
}

export interface LiveSession {
  id: string;
  influencer_id: string;
  title: string;
  description?: string;
  scheduled_start_time?: string;
  actual_start_time?: string;
  end_time?: string;
  duration_minutes?: number;
  peak_viewers: number;
  total_unique_viewers: number;
  total_products_showcased: number;
  total_sales_generated: number;
  status: 'scheduled' | 'live' | 'ended' | 'cancelled';
  stream_url?: string;
  recording_url?: string;
  created_at: string;
  updated_at: string;
}

export interface InfluencerAnalytics {
  id: string;
  influencer_id: string;
  period_type: 'daily' | 'weekly' | 'monthly';
  period_start: string;
  period_end: string;
  total_streams: number;
  total_stream_hours: number;
  average_viewers: number;
  peak_concurrent_viewers: number;
  total_viewers: number;
  unique_viewers: number;
  returning_viewers: number;
  average_watch_time: number;
  total_sales: number;
  total_orders: number;
  conversion_rate: number;
  average_order_value: number;
  new_followers: number;
  total_followers_end: number;
  follower_growth_rate: number;
  total_earnings: number;
  created_at: string;
  updated_at: string;
}

export interface InfluencerSettings {
  id: string;
  influencer_id: string;
  email_notifications: boolean;
  push_notifications: boolean;
  sms_notifications: boolean;
  notification_frequency: 'instant' | 'daily' | 'weekly';
  auto_record_streams: boolean;
  stream_quality: 'low' | 'medium' | 'high' | 'ultra';
  chat_moderation_level: 'none' | 'low' | 'medium' | 'high';
  profile_visibility: 'public' | 'private' | 'followers_only';
  show_earnings: boolean;
  show_follower_count: boolean;
  default_goal_period: 'weekly' | 'monthly' | 'quarterly';
  goal_reminder_frequency: 'daily' | 'weekly' | 'monthly';
  dashboard_theme: 'light' | 'dark' | 'auto';
  preferred_currency: string;
  timezone: string;
  created_at: string;
  updated_at: string;
}

// API Response types
export interface InfluencerStats {
  totalEarnings: number;
  totalStreams: number;
  totalViewers: number;
  averageViewers: number;
  followersCount: number;
  conversionRate: number;
}

// Form types for creating/updating
export interface CreateInfluencerData {
  first_name: string;
  last_name: string;
  display_name: string;
  email: string;
  phone?: string;
  bio?: string;
  category?: string;
  instagram_handle?: string;
  youtube_channel?: string;
  tiktok_handle?: string;
}

export interface UpdateInfluencerData extends Partial<CreateInfluencerData> {
  followers_count?: number;
  experience_years?: number;
}
