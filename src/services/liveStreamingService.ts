// Live Streaming Service for Supabase Integration
// Handles all live streaming database operations

import { supabase } from '@/lib/supabase';
import type { 
  LiveStreamSession, 
  LiveStreamViewer, 
  LiveStreamSchedule,
  LiveStreamChat,
  LiveStreamProduct,
  SessionAnalytics 
} from '@/types/live-streaming';

export class LiveStreamingService {
  // =============================================================================
  // SESSION MANAGEMENT
  // =============================================================================

  /**
   * Check if influencer has any active live streams
   */
  static async checkActiveLiveStreams(influencerId: string): Promise<{ hasActiveStream: boolean; activeStream?: LiveStreamSession; error?: any }> {
    try {
      const { data, error } = await supabase
        .from('live_stream_sessions')
        .select('*')
        .eq('influencer_id', influencerId)
        .eq('status', 'live')
        .limit(1);

      if (error) {
        return { hasActiveStream: false, error };
      }

      return {
        hasActiveStream: data && data.length > 0,
        activeStream: data && data.length > 0 ? data[0] : undefined
      };
    } catch (error) {
      console.error('Error checking active live streams:', error);
      return { hasActiveStream: false, error };
    }
  }

  /**
   * Create a new live stream session
   */
  static async createSession(sessionData: {
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
    forceCreate?: boolean; // Allow bypassing the check for admin/testing
  }): Promise<{ data: LiveStreamSession | null; error: any }> {
    try {
      // Check for existing live streams unless forced
      if (!sessionData.forceCreate) {
        const { hasActiveStream, activeStream } = await this.checkActiveLiveStreams(sessionData.influencerId);
        
        if (hasActiveStream && activeStream) {
          return {
            data: null,
            error: {
              message: `You already have an active live stream: "${activeStream.title}". Please end it before starting a new one.`,
              code: 'ACTIVE_STREAM_EXISTS',
              activeStream
            }
          };
        }
      }

      const { data, error } = await supabase
        .from('live_stream_sessions')
        .insert({
          influencer_id: sessionData.influencerId,
          title: sessionData.title,
          description: sessionData.description,
          scheduled_start_time: sessionData.scheduledStartTime,
          scheduled_end_time: sessionData.scheduledEndTime,
          thumbnail_url: sessionData.thumbnailUrl,
          max_viewers: sessionData.maxViewers || 1000,
          is_recording_enabled: sessionData.isRecordingEnabled ?? true,
          is_chat_enabled: sessionData.isChatEnabled ?? true,
          is_products_showcase: sessionData.isProductsShowcase ?? true,
          visibility: sessionData.visibility || 'public'
        })
        .select()
        .single();

      return { data, error };
    } catch (error) {
      console.error('Error creating live stream session:', error);
      return { data: null, error };
    }
  }

  /**
   * Start a live stream session
   */
  static async startSession(sessionId: string, streamingData: {
    roomId: string;
    roomCode: string;
    streamKey: string;
    streamUrl: string;
    hlsUrl: string;
    rtmpUrl: string;
  }): Promise<{ data: LiveStreamSession | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('live_stream_sessions')
        .update({
          status: 'live',
          actual_start_time: new Date().toISOString(),
          room_id: streamingData.roomId,
          room_code: streamingData.roomCode,
          stream_key: streamingData.streamKey,
          stream_url: streamingData.streamUrl,
          hls_url: streamingData.hlsUrl,
          rtmp_url: streamingData.rtmpUrl
        })
        .eq('id', sessionId)
        .select()
        .single();

      return { data, error };
    } catch (error) {
      console.error('Error starting live stream session:', error);
      return { data: null, error };
    }
  }

  /**
   * End a live stream session
   */
  static async endSession(sessionId: string, recordingUrl?: string): Promise<{ data: LiveStreamSession | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('live_stream_sessions')
        .update({
          status: 'ended',
          actual_end_time: new Date().toISOString(),
          recording_url: recordingUrl
        })
        .eq('id', sessionId)
        .select()
        .single();

      return { data, error };
    } catch (error) {
      console.error('Error ending live stream session:', error);
      return { data: null, error };
    }
  }

  /**
   * Get live stream session by ID
   */
  static async getSession(sessionId: string): Promise<{ data: LiveStreamSession | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('live_stream_sessions')
        .select(`
          *,
          influencer:influencers(display_name, followers_count)
        `)
        .eq('id', sessionId)
        .single();

      return { data, error };
    } catch (error) {
      console.error('Error fetching live stream session:', error);
      return { data: null, error };
    }
  }

  /**
   * Get sessions by influencer
   */
  static async getSessionsByInfluencer(influencerId: string, status?: string): Promise<{ data: LiveStreamSession[] | null; error: any }> {
    try {
      let query = supabase
        .from('live_stream_sessions')
        .select(`
          *,
          influencer:influencers(display_name, followers_count)
        `)
        .eq('influencer_id', influencerId);

      if (status) {
        query = query.eq('status', status);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      return { data, error };
    } catch (error) {
      console.error('Error fetching influencer sessions:', error);
      return { data: null, error };
    }
  }

  /**
   * Get live sessions
   */
  static async getLiveSessions(): Promise<{ data: LiveStreamSession[] | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('live_sessions_with_details')
        .select('*')
        .eq('status', 'live')
        .order('actual_start_time', { ascending: false });

      return { data, error };
    } catch (error) {
      console.error('Error fetching live sessions:', error);
      return { data: null, error };
    }
  }

  // =============================================================================
  // VIEWER MANAGEMENT
  // =============================================================================

  /**
   * Add viewer to session
   */
  static async addViewer(viewerData: {
    sessionId: string;
    userId?: string;
    viewerType?: 'customer' | 'influencer' | 'wholesaler' | 'anonymous';
    ipAddress?: string;
    userAgent?: string;
    country?: string;
    city?: string;
    deviceType?: string;
    browser?: string;
  }): Promise<{ data: LiveStreamViewer | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('live_stream_viewers')
        .insert({
          session_id: viewerData.sessionId,
          user_id: viewerData.userId,
          viewer_type: viewerData.viewerType || 'anonymous',
          ip_address: viewerData.ipAddress,
          user_agent: viewerData.userAgent,
          country: viewerData.country,
          city: viewerData.city,
          device_type: viewerData.deviceType,
          browser: viewerData.browser
        })
        .select()
        .single();

      return { data, error };
    } catch (error) {
      console.error('Error adding viewer:', error);
      return { data: null, error };
    }
  }

  /**
   * Update viewer status (when leaving)
   */
  static async updateViewerStatus(viewerId: string, watchDuration: number): Promise<{ data: LiveStreamViewer | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('live_stream_viewers')
        .update({
          is_still_watching: false,
          left_at: new Date().toISOString(),
          watch_duration_minutes: watchDuration
        })
        .eq('id', viewerId)
        .select()
        .single();

      return { data, error };
    } catch (error) {
      console.error('Error updating viewer status:', error);
      return { data: null, error };
    }
  }

  /**
   * Get session viewers
   */
  static async getSessionViewers(sessionId: string): Promise<{ data: LiveStreamViewer[] | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('live_stream_viewers')
        .select('*')
        .eq('session_id', sessionId)
        .order('joined_at', { ascending: false });

      return { data, error };
    } catch (error) {
      console.error('Error fetching session viewers:', error);
      return { data: null, error };
    }
  }

  // =============================================================================
  // SCHEDULING
  // =============================================================================

  /**
   * Schedule a live stream
   */
  static async scheduleStream(scheduleData: {
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
  }): Promise<{ data: LiveStreamSchedule | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('live_stream_schedule')
        .insert({
          influencer_id: scheduleData.influencerId,
          title: scheduleData.title,
          description: scheduleData.description,
          scheduled_date: scheduleData.scheduledDate,
          scheduled_start_time: scheduleData.scheduledStartTime,
          scheduled_end_time: scheduleData.scheduledEndTime,
          timezone: scheduleData.timezone || 'UTC',
          products_to_showcase: scheduleData.productsToShowcase || [],
          stream_category: scheduleData.streamCategory,
          expected_duration_minutes: scheduleData.expectedDurationMinutes,
          target_audience: scheduleData.targetAudience,
          is_recurring: scheduleData.isRecurring || false,
          recurrence_pattern: scheduleData.recurrencePattern,
          days_of_week: scheduleData.daysOfWeek || []
        })
        .select()
        .single();

      return { data, error };
    } catch (error) {
      console.error('Error scheduling stream:', error);
      return { data: null, error };
    }
  }

  /**
   * Get upcoming scheduled streams
   */
  static async getUpcomingStreams(influencerId?: string): Promise<{ data: LiveStreamSchedule[] | null; error: any }> {
    try {
      let query = supabase
        .from('upcoming_streams')
        .select('*');

      if (influencerId) {
        query = query.eq('influencer_id', influencerId);
      }

      const { data, error } = await query.order('full_start_datetime', { ascending: true });

      return { data, error };
    } catch (error) {
      console.error('Error fetching upcoming streams:', error);
      return { data: null, error };
    }
  }

  // =============================================================================
  // CHAT MANAGEMENT
  // =============================================================================

  /**
   * Send chat message
   */
  static async sendChatMessage(messageData: {
    sessionId: string;
    viewerId?: string;
    userId?: string;
    message: string;
    messageType?: 'chat' | 'reaction' | 'system' | 'product_highlight';
    username?: string;
    avatarUrl?: string;
    isInfluencer?: boolean;
  }): Promise<{ data: LiveStreamChat | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('live_stream_chat')
        .insert({
          session_id: messageData.sessionId,
          viewer_id: messageData.viewerId,
          user_id: messageData.userId,
          message: messageData.message,
          message_type: messageData.messageType || 'chat',
          username: messageData.username,
          avatar_url: messageData.avatarUrl,
          is_influencer: messageData.isInfluencer || false
        })
        .select()
        .single();

      return { data, error };
    } catch (error) {
      console.error('Error sending chat message:', error);
      return { data: null, error };
    }
  }

  /**
   * Get chat messages for session
   */
  static async getChatMessages(sessionId: string, limit: number = 50): Promise<{ data: LiveStreamChat[] | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('live_stream_chat')
        .select('*')
        .eq('session_id', sessionId)
        .eq('is_deleted', false)
        .order('sent_at', { ascending: false })
        .limit(limit);

      return { data, error };
    } catch (error) {
      console.error('Error fetching chat messages:', error);
      return { data: null, error };
    }
  }

  // =============================================================================
  // PRODUCT SHOWCASE
  // =============================================================================

  /**
   * Add product to live stream
   */
  static async addProductToStream(productData: {
    sessionId: string;
    productId: string;
    displayOrder?: number;
    liveStreamPrice?: number;
    discountPercentage?: number;
    limitedQuantity?: number;
  }): Promise<{ data: LiveStreamProduct | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('live_stream_products')
        .insert({
          session_id: productData.sessionId,
          product_id: productData.productId,
          display_order: productData.displayOrder || 0,
          live_stream_price: productData.liveStreamPrice,
          discount_percentage: productData.discountPercentage,
          limited_quantity: productData.limitedQuantity
        })
        .select()
        .single();

      return { data, error };
    } catch (error) {
      console.error('Error adding product to stream:', error);
      return { data: null, error };
    }
  }

  /**
   * Update product metrics (clicks, orders, etc.)
   */
  static async updateProductMetrics(sessionId: string, productId: string, metrics: {
    clicks?: number;
    addToCart?: number;
    orders?: number;
    revenue?: number;
  }): Promise<{ data: LiveStreamProduct | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('live_stream_products')
        .update(metrics)
        .eq('session_id', sessionId)
        .eq('product_id', productId)
        .select()
        .single();

      return { data, error };
    } catch (error) {
      console.error('Error updating product metrics:', error);
      return { data: null, error };
    }
  }

  /**
   * Get products in live stream
   */
  static async getStreamProducts(sessionId: string): Promise<{ data: LiveStreamProduct[] | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('live_stream_products')
        .select(`
          *,
          product:products(*)
        `)
        .eq('session_id', sessionId)
        .order('display_order', { ascending: true });

      return { data, error };
    } catch (error) {
      console.error('Error fetching stream products:', error);
      return { data: null, error };
    }
  }

  // =============================================================================
  // ANALYTICS
  // =============================================================================

  /**
   * Get session analytics
   */
  static async getSessionAnalytics(sessionId: string): Promise<{ data: SessionAnalytics | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('session_analytics_summary')
        .select('*')
        .eq('session_id', sessionId)
        .single();

      return { data, error };
    } catch (error) {
      console.error('Error fetching session analytics:', error);
      return { data: null, error };
    }
  }

  /**
   * Real-time session updates subscription
   */
  static subscribeToSessionUpdates(sessionId: string, callback: (payload: any) => void) {
    return supabase
      .channel(`session-${sessionId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'live_stream_sessions',
          filter: `id=eq.${sessionId}`
        },
        callback
      )
      .subscribe();
  }

  /**
   * Real-time chat subscription
   */
  static subscribeToChatMessages(sessionId: string, callback: (payload: any) => void) {
    return supabase
      .channel(`chat-${sessionId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'live_stream_chat',
          filter: `session_id=eq.${sessionId}`
        },
        callback
      )
      .subscribe();
  }

  /**
   * Real-time viewer updates subscription
   */
  static subscribeToViewerUpdates(sessionId: string, callback: (payload: any) => void) {
    return supabase
      .channel(`viewers-${sessionId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'live_stream_viewers',
          filter: `session_id=eq.${sessionId}`
        },
        callback
      )
      .subscribe();
  }
}
