// Viewer HMS Service - Handles fetching HMS credentials for viewers
import { supabase } from '@/lib/supabase';

export interface InfluencerHMSCredentials {
  id: string;
  display_name: string;
  hms_room_code?: string;
  hms_auth_token?: string;
  hms_viewer_room_code?: string;
  hms_viewer_auth_token?: string;
  hms_room_id?: string;
  is_streaming_enabled: boolean;
}

export interface LiveStreamWithHMSCredentials {
  id: string;
  title: string;
  description?: string;
  status: string;
  influencer_id: string;
  room_code?: string;
  current_viewers?: number;
  peak_viewers?: number;
  total_messages?: number;
  total_reactions?: number;
  actual_start_time?: string;
  scheduled_start_time?: string;
  visibility?: string;
  thumbnail_url?: string;
  is_products_showcase?: boolean;
  // HMS credentials from influencer
  hms_viewer_room_code?: string;
  hms_viewer_auth_token?: string;
  // Influencer info
  influencer?: {
    display_name: string;
    followers_count: number;
  };
}

export class ViewerHMSService {
  /**
   * Get influencer HMS credentials by influencer ID
   */
  static async getInfluencerHMSCredentials(influencerId: string): Promise<{
    data: InfluencerHMSCredentials | null;
    error: any;
  }> {
    try {
      const { data, error } = await supabase
        .from('influencers')
        .select(`
          id,
          display_name,
          hms_room_code,
          hms_auth_token,
          hms_room_id,
          is_streaming_enabled
        `)
        .eq('id', influencerId)
        .single();

      if (error) {
        console.error('Error fetching influencer HMS credentials:', error);
        return { data: null, error };
      }

      return { data, error: null };
    } catch (error) {
      console.error('Error in getInfluencerHMSCredentials:', error);
      return { data: null, error };
    }
  }

  /**
   * Get live stream session with HMS credentials (using influencer's main auth token)
   */
  static async getSessionWithHMSCredentials(sessionId: string): Promise<{
    data: LiveStreamWithHMSCredentials | null;
    error: any;
  }> {
    try {
      console.log('Fetching session with HMS credentials for sessionId:', sessionId);
      
      // Try to use the function that bypasses RLS first
      try {
        const { data: funcData, error: funcError } = await supabase.rpc('get_live_session_with_hms_credentials', {
          p_session_id: sessionId
        });

        if (!funcError && funcData && funcData.length > 0) {
          const sessionData = funcData[0];
          console.log('Using RLS bypass function - Raw session data:', {
            session_id: sessionData.id,
            session_status: sessionData.status,
            influencer_has_hms_auth_token: !!sessionData.hms_auth_token,
            influencer_has_hms_room_code: !!sessionData.hms_room_code,
            influencer_has_viewer_auth_token: !!sessionData.hms_viewer_auth_token
          });

          // Transform function result to match expected format
          const transformedData: LiveStreamWithHMSCredentials = {
            id: sessionData.id,
            influencer_id: sessionData.influencer_id,
            title: sessionData.title,
            description: sessionData.description,
            status: sessionData.status,
            room_code: sessionData.room_code || sessionData.hms_room_code,
            current_viewers: 0, // Default values
            peak_viewers: 0,
            total_messages: 0,
            total_reactions: 0,
            actual_start_time: sessionData.actual_start_time,
            scheduled_start_time: sessionData.scheduled_start_time,
            visibility: sessionData.visibility,
            thumbnail_url: sessionData.thumbnail_url,
            is_products_showcase: sessionData.is_products_showcase,
            // HMS credentials
            hms_viewer_room_code: sessionData.hms_viewer_room_code || sessionData.hms_room_code,
            hms_viewer_auth_token: sessionData.hms_viewer_auth_token || sessionData.hms_auth_token,
            influencer: {
              display_name: sessionData.influencer_display_name || 'Unknown Host',
              followers_count: sessionData.influencer_followers_count || 0
            }
          };

          console.log('Transformed session data from function:', {
            sessionId: transformedData.id,
            title: transformedData.title,
            status: transformedData.status,
            hasViewerAuthToken: !!transformedData.hms_viewer_auth_token,
            hasViewerRoomCode: !!transformedData.hms_viewer_room_code,
            viewerAuthTokenPreview: transformedData.hms_viewer_auth_token ? `${transformedData.hms_viewer_auth_token.substring(0, 20)}...` : 'none',
            viewerRoomCode: transformedData.hms_viewer_room_code,
            influencerName: transformedData.influencer?.display_name
          });

          return { data: transformedData, error: null };
        }
      } catch (funcError) {
        console.log('RLS bypass function failed, falling back to direct query:', funcError);
      }

      // Fallback to original query method
      const { data, error } = await supabase
        .from('live_stream_sessions')
        .select(`
          *,
          influencer:influencers(
            display_name,
            followers_count,
            hms_room_code,
            hms_auth_token,
            hms_viewer_room_code,
            hms_viewer_auth_token
          )
        `)
        .eq('id', sessionId)
        .single();

      if (error) {
        console.error('Error fetching session with HMS credentials:', error);
        return { data: null, error };
      }

      if (!data) {
        console.error('No session found with ID:', sessionId);
        return { data: null, error: 'Session not found' };
      }

      console.log('Raw session data from database:', {
        session_id: data.id,
        session_status: data.status,
        influencer_data: data.influencer,
        influencer_has_hms_auth_token: !!data.influencer?.hms_auth_token,
        influencer_has_hms_room_code: !!data.influencer?.hms_room_code
      });

      // Transform the data to include HMS credentials at the top level
      // Use the existing hms_viewer_auth_token that contains the auth token
      const transformedData: LiveStreamWithHMSCredentials = {
        ...data,
        // Use influencer's room code for viewers
        hms_viewer_room_code: data.influencer?.hms_room_code || data.room_code || null,
        // Use the existing hms_viewer_auth_token field that has the token
        hms_viewer_auth_token: data.influencer?.hms_viewer_auth_token || data.influencer?.hms_auth_token || null,
        influencer: {
          display_name: data.influencer?.display_name || 'Unknown Host',
          followers_count: data.influencer?.followers_count || 0
        }
      };

      console.log('Transformed session data:', {
        sessionId: transformedData.id,
        title: transformedData.title,
        status: transformedData.status,
        hasViewerAuthToken: !!transformedData.hms_viewer_auth_token,
        hasViewerRoomCode: !!transformedData.hms_viewer_room_code,
        viewerAuthTokenPreview: transformedData.hms_viewer_auth_token ? `${transformedData.hms_viewer_auth_token.substring(0, 20)}...` : 'none',
        viewerRoomCode: transformedData.hms_viewer_room_code,
        influencerName: transformedData.influencer?.display_name,
        rawInfluencerData: {
          hms_auth_token: data.influencer?.hms_auth_token ? 'present' : 'missing',
          hms_viewer_auth_token: data.influencer?.hms_viewer_auth_token ? 'present' : 'missing',
          hms_room_code: data.influencer?.hms_room_code || 'missing',
          hms_viewer_room_code: data.influencer?.hms_viewer_room_code || 'missing',
          full_influencer_object: data.influencer
        }
      });

      return { data: transformedData, error: null };
    } catch (error) {
      console.error('Error in getSessionWithHMSCredentials:', error);
      return { data: null, error };
    }
  }

  /**
   * Get all live streams with HMS viewer credentials (for discovery)
   */
  static async getLiveStreamsWithHMSCredentials(status: string = 'live'): Promise<{
    data: LiveStreamWithHMSCredentials[] | null;
    error: any;
  }> {
    try {
      // Use influencer's main HMS credentials for viewers
      let { data, error } = await supabase
        .from('live_stream_sessions')
        .select(`
          *,
          influencer:influencers(
            display_name,
            followers_count,
            hms_room_code,
            hms_auth_token
          )
        `)
        .eq('status', status)
        .eq('visibility', 'public')
        .order('actual_start_time', { ascending: false });

      if (error) {
        console.error('Error fetching live streams with HMS credentials:', error);
        return { data: null, error };
      }

      // Transform the data to include HMS credentials at the top level
      // Use influencer's main credentials for viewers
      const transformedData: LiveStreamWithHMSCredentials[] = (data || []).map(session => ({
        ...session,
        hms_viewer_room_code: session.influencer?.hms_room_code || null,
        hms_viewer_auth_token: session.influencer?.hms_auth_token || null,
        influencer: {
          display_name: session.influencer?.display_name || 'Unknown Host',
          followers_count: session.influencer?.followers_count || 0
        }
      }));

      return { data: transformedData, error: null };
    } catch (error) {
      console.error('Error in getLiveStreamsWithHMSCredentials:', error);
      return { data: null, error };
    }
  }

  /**
   * Check if influencer has viewer HMS credentials configured
   */
  static async hasViewerCredentials(influencerId: string): Promise<{
    hasCredentials: boolean;
    error: any;
  }> {
    try {
      const { data, error } = await this.getInfluencerHMSCredentials(influencerId);
      
      if (error) {
        return { hasCredentials: false, error };
      }

      const hasCredentials = !!(data?.hms_room_code && data?.hms_auth_token);
      
      return { hasCredentials, error: null };
    } catch (error) {
      console.error('Error checking viewer credentials:', error);
      return { hasCredentials: false, error };
    }
  }

  /**
   * Validate viewer HMS token format
   */
  static validateViewerToken(token: string): boolean {
    if (!token || typeof token !== 'string') {
      return false;
    }

    // Basic JWT format check (starts with eyJ)
    if (token.startsWith('eyJ')) {
      return true;
    }

    // Custom HMS token format check
    if (token.startsWith('HMS_') && token.length > 20) {
      return true;
    }

    return false;
  }

  /**
   * Get viewer room code for joining (using influencer's main room code)
   */
  static getViewerRoomCode(session: LiveStreamWithHMSCredentials): string | null {
    // Use influencer's main room code for viewers
    const roomCode = session.hms_viewer_room_code || session.room_code || null;
    console.log('Getting viewer room code:', {
      hms_viewer_room_code: session.hms_viewer_room_code,
      room_code: session.room_code,
      selected: roomCode
    });
    return roomCode;
  }

  /**
   * Get viewer auth token (using influencer's main auth token)
   */
  static getViewerAuthToken(session: LiveStreamWithHMSCredentials): string | null {
    // Use influencer's main auth token for viewers to join the stream
    const token = session.hms_viewer_auth_token;
    
    console.log('Getting viewer auth token:', {
      hasToken: !!token,
      tokenLength: token?.length || 0,
      tokenPreview: token ? `${token.substring(0, 10)}...` : 'none'
    });
    
    if (!token) {
      console.log('No viewer auth token available');
      return null;
    }

    if (!this.validateViewerToken(token)) {
      console.warn('Invalid viewer token format detected, but proceeding anyway');
      // Don't return null, let HMS handle the validation
    }

    return token;
  }
}

export default ViewerHMSService;