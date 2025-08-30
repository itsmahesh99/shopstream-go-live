export interface LiveSession {
  id: string;
  influencer_id: string;
  title: string;
  description?: string;
  scheduled_start_time?: string;
  actual_start_time?: string;
  end_time?: string;
  duration_minutes?: number;
  current_viewers?: number;
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

export interface LiveSessionProduct {
  id: string;
  live_session_id: string;
  product_id: string;
  display_order: number;
  special_price?: number;
  is_featured: boolean;
  clicks: number;
  orders_generated: number;
  revenue_generated: number;
  created_at: string;
  // Related product data
  product?: {
    id: string;
    name: string;
    retail_price: number;
    images: string[];
    description?: string;
  };
}

export interface CreateLiveSessionData {
  title: string;
  description?: string;
  scheduled_start_time?: string;
  product_ids?: string[];
}

export interface UpdateLiveSessionData {
  title?: string;
  description?: string;
  scheduled_start_time?: string;
  status?: 'scheduled' | 'live' | 'ended' | 'cancelled';
  actual_start_time?: string;
  end_time?: string;
  duration_minutes?: number;
  current_viewers?: number;
  peak_viewers?: number;
  total_unique_viewers?: number;
  stream_url?: string;
  recording_url?: string;
}

export interface LiveStreamMetrics {
  session_id: string;
  current_viewers: number;
  peak_viewers: number;
  total_unique_viewers: number;
  duration_minutes: number;
  products_showcased: number;
  total_sales: number;
  total_likes: number;
  total_comments: number;
  engagement_rate: number;
}

export interface ScheduledStreamNotification {
  id: string;
  session_id: string;
  reminder_time: string;
  notification_type: 'email' | 'push' | 'sms';
  is_sent: boolean;
}
