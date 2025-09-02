// TypeScript types for Live Streaming functionality

export interface LiveStreamSession {
  id: string;
  influencer_id: string;
  
  // Session Identification
  session_code: string;
  title: string;
  description?: string;
  thumbnail_url?: string;
  
  // Scheduling
  scheduled_start_time?: string;
  scheduled_end_time?: string;
  
  // Actual Session Times
  actual_start_time?: string;
  actual_end_time?: string;
  
  // Session Status
  status: 'scheduled' | 'live' | 'paused' | 'ended' | 'cancelled' | 'error';
  
  // Technical Details
  stream_key?: string;
  stream_url?: string;
  hls_url?: string;
  rtmp_url?: string;
  recording_url?: string;
  
  // 100ms Integration
  room_id?: string;
  room_code?: string;
  template_id?: string;
  
  // Session Configuration
  max_viewers: number;
  is_recording_enabled: boolean;
  is_chat_enabled: boolean;
  is_products_showcase: boolean;
  visibility: 'public' | 'private' | 'unlisted';
  
  // Performance Metrics
  current_viewers: number;
  peak_viewers: number;
  total_unique_viewers: number;
  total_watch_time_minutes: number;
  average_watch_time_minutes: number;
  
  // Engagement Metrics
  total_messages: number;
  total_reactions: number;
  total_shares: number;
  
  // Commercial Metrics
  total_products_showcased: number;
  total_clicks: number;
  total_orders: number;
  total_revenue: number;
  conversion_rate: number;
  
  // Quality Metrics
  stream_quality: 'auto' | '720p' | '1080p' | '4k';
  connection_issues_count: number;
  buffering_events: number;
  
  // Timestamps
  created_at: string;
  updated_at: string;
  
  // Relations
  influencer?: {
    display_name: string;
    followers_count: number;
  };
}

export interface LiveStreamViewer {
  id: string;
  session_id: string;
  user_id?: string;
  
  // Viewer Details
  viewer_type: 'customer' | 'influencer' | 'wholesaler' | 'anonymous';
  ip_address?: string;
  user_agent?: string;
  country?: string;
  city?: string;
  device_type?: string;
  browser?: string;
  
  // Session Tracking
  joined_at: string;
  left_at?: string;
  watch_duration_minutes: number;
  is_still_watching: boolean;
  
  // Engagement
  messages_sent: number;
  reactions_sent: number;
  products_clicked: number;
  orders_placed: number;
  
  // Quality Experience
  connection_quality: 'excellent' | 'good' | 'fair' | 'poor';
  buffering_time_seconds: number;
  disconnections_count: number;
  
  // Timestamps
  created_at: string;
  updated_at: string;
}

export interface LiveStreamSchedule {
  id: string;
  influencer_id: string;
  
  // Schedule Details
  title: string;
  description?: string;
  thumbnail_url?: string;
  
  // Timing
  scheduled_date: string;
  scheduled_start_time: string;
  scheduled_end_time: string;
  timezone: string;
  
  // Recurrence
  is_recurring: boolean;
  recurrence_pattern?: 'daily' | 'weekly' | 'monthly' | 'custom';
  recurrence_end_date?: string;
  days_of_week?: number[];
  
  // Pre-stream Configuration
  products_to_showcase?: string[];
  stream_category?: string;
  expected_duration_minutes?: number;
  target_audience?: string;
  
  // Promotion
  promotion_message?: string;
  is_promoted: boolean;
  notification_sent: boolean;
  reminder_sent: boolean;
  
  // Status
  status: 'scheduled' | 'confirmed' | 'cancelled' | 'completed';
  
  // Session Link
  created_session_id?: string;
  
  // Timestamps
  created_at: string;
  updated_at: string;
  
  // Computed fields (from view)
  full_start_datetime?: string;
  full_end_datetime?: string;
  
  // Relations
  influencer?: {
    display_name: string;
    followers_count: number;
  };
}

export interface LiveStreamAnalytics {
  id: string;
  session_id: string;
  
  // Time Period
  period_start: string;
  period_end: string;
  period_type: 'minute' | 'hour' | 'day';
  
  // Viewer Metrics
  viewers_joined: number;
  viewers_left: number;
  peak_concurrent_viewers: number;
  average_concurrent_viewers: number;
  
  // Engagement Metrics
  messages_sent: number;
  reactions_sent: number;
  shares_count: number;
  
  // Commercial Metrics
  products_clicked: number;
  orders_placed: number;
  revenue_generated: number;
  
  // Quality Metrics
  average_connection_quality: number;
  total_buffering_time_seconds: number;
  total_disconnections: number;
  
  // Geographic Data
  top_countries: Record<string, number>;
  top_cities: Record<string, number>;
  
  // Device Data
  device_breakdown: Record<string, number>;
  browser_breakdown: Record<string, number>;
  
  // Timestamps
  created_at: string;
}

export interface LiveStreamChat {
  id: string;
  session_id: string;
  viewer_id?: string;
  user_id?: string;
  
  // Message Details
  message: string;
  message_type: 'chat' | 'reaction' | 'system' | 'product_highlight';
  
  // Metadata
  username?: string;
  avatar_url?: string;
  is_influencer: boolean;
  is_moderator: boolean;
  
  // Moderation
  is_deleted: boolean;
  is_flagged: boolean;
  deleted_by?: string;
  deletion_reason?: string;
  
  // Engagement
  reactions: Record<string, number>;
  replies_count: number;
  parent_message_id?: string;
  
  // Timestamps
  sent_at: string;
  edited_at?: string;
  deleted_at?: string;
}

export interface LiveStreamProduct {
  id: string;
  session_id: string;
  product_id: string;
  
  // Showcase Timing
  featured_at: string;
  featured_duration_minutes: number;
  display_order: number;
  
  // Special Pricing
  original_price?: number;
  live_stream_price?: number;
  discount_percentage?: number;
  limited_quantity?: number;
  sold_quantity: number;
  
  // Performance Metrics
  views: number;
  clicks: number;
  add_to_cart: number;
  orders: number;
  revenue: number;
  
  // Engagement
  likes: number;
  comments: number;
  shares: number;
  
  // Timestamps
  created_at: string;
  updated_at: string;
  
  // Relations
  product?: {
    id: string;
    name: string;
    description?: string;
    price: number;
    image_url?: string;
    sku: string;
  };
}

export interface LiveStreamNotification {
  id: string;
  user_id: string;
  influencer_id?: string;
  session_id?: string;
  
  // Notification Details
  type: 'stream_starting' | 'stream_reminder' | 'stream_ended' | 
        'followed_influencer_live' | 'product_featured' | 'special_offer';
  title: string;
  message: string;
  action_url?: string;
  
  // Delivery
  is_read: boolean;
  is_sent: boolean;
  delivery_method: 'in_app' | 'email' | 'sms' | 'push';
  
  // Timestamps
  scheduled_for: string;
  sent_at?: string;
  read_at?: string;
  created_at: string;
}

// Analytics summary type (from view)
export interface SessionAnalytics {
  session_id: string;
  total_unique_viewers: number;
  total_watch_time: number;
  avg_watch_time: number;
  current_viewers: number;
  total_messages: number;
  total_reactions: number;
  total_product_clicks: number;
  total_orders: number;
}

// Input types for creating/updating records
export interface CreateLiveStreamSessionInput {
  influencerId: string;
  title: string;
  description?: string;
  scheduledStartTime?: string;
  scheduledEndTime?: string;
  thumbnailUrl?: string;
  maxViewers?: number;
  isRecordingEnabled?: boolean;
  isChatEnabled?: boolean;
  isProductsShowcase?: boolean;
  visibility?: 'public' | 'private' | 'unlisted';
}

export interface StartLiveStreamInput {
  roomId: string;
  roomCode: string;
  streamKey: string;
  streamUrl: string;
  hlsUrl: string;
  rtmpUrl: string;
}

export interface CreateScheduleInput {
  influencerId: string;
  title: string;
  description?: string;
  scheduledDate: string;
  scheduledStartTime: string;
  scheduledEndTime: string;
  timezone?: string;
  productsToShowcase?: string[];
  streamCategory?: string;
  expectedDurationMinutes?: number;
  targetAudience?: string;
  isRecurring?: boolean;
  recurrencePattern?: 'daily' | 'weekly' | 'monthly';
  daysOfWeek?: number[];
}

export interface CreateViewerInput {
  sessionId: string;
  userId?: string;
  viewerType?: 'customer' | 'influencer' | 'wholesaler' | 'anonymous';
  ipAddress?: string;
  userAgent?: string;
  country?: string;
  city?: string;
  deviceType?: string;
  browser?: string;
}

export interface SendChatMessageInput {
  sessionId: string;
  viewerId?: string;
  userId?: string;
  message: string;
  messageType?: 'chat' | 'reaction' | 'system' | 'product_highlight';
  username?: string;
  avatarUrl?: string;
  isInfluencer?: boolean;
}

export interface AddProductToStreamInput {
  sessionId: string;
  productId: string;
  displayOrder?: number;
  liveStreamPrice?: number;
  discountPercentage?: number;
  limitedQuantity?: number;
}

// 100ms specific types
export interface HMS100Config {
  templateId: string;
  roomCode: string;
  roomId: string;
  name: string;
  role: string;
  authToken: string;
}

// Streaming stats for real-time updates
export interface StreamingStats {
  viewers: number;
  peakViewers: number;
  duration: number;
  messages: number;
  engagement: number;
  revenue: number;
  quality: string;
}

// Chat message with user details for UI
export interface ChatMessageWithUser extends LiveStreamChat {
  user?: {
    name: string;
    avatar?: string;
    role: string;
  };
}

// Product showcase with full product details for UI
export interface ProductShowcaseWithDetails extends LiveStreamProduct {
  product: {
    id: string;
    name: string;
    description?: string;
    price: number;
    images: string[];
    sku: string;
    wholesaler?: {
      business_name: string;
    };
  };
}

// Viewer with user details for analytics
export interface ViewerWithDetails extends LiveStreamViewer {
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
}

// Error types
export interface LiveStreamError {
  code: string;
  message: string;
  details?: any;
}

// API Response types
export interface LiveStreamResponse<T> {
  data: T | null;
  error: LiveStreamError | null;
  success: boolean;
}

// WebSocket message types for real-time updates
export interface WebSocketMessage {
  type: 'viewer_joined' | 'viewer_left' | 'chat_message' | 'product_featured' | 
        'session_started' | 'session_ended' | 'stats_update';
  sessionId: string;
  data: any;
  timestamp: string;
}

// Stream state for component state management
export interface StreamState {
  isLoading: boolean;
  isStreaming: boolean;
  isPaused: boolean;
  error?: string;
  session?: LiveStreamSession;
  viewers: LiveStreamViewer[];
  messages: LiveStreamChat[];
  products: LiveStreamProduct[];
  stats: StreamingStats;
}

export default LiveStreamSession;
