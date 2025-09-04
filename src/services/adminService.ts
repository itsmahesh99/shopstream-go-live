import { supabase } from '@/lib/supabase';
import { AdminAuthService } from './adminAuthService';

export interface InfluencerAnalytics {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  display_name: string;
  hms_room_code: string;
  has_auth_token: boolean;
  is_streaming_enabled: boolean;
  token_created_at: string;
  profile_created_at: string;
  total_streams: number;
  total_viewers: number;
  avg_viewers_per_stream: number;
  max_peak_viewers: number;
  last_stream_date: string;
  streams_last_30_days: number;
  currently_live_streams: number;
}

export class AdminService {
  /**
   * Check if current user is admin using new admin auth system
   */
  static async isUserAdmin(): Promise<boolean> {
    try {
      return AdminAuthService.isAdminLoggedIn();
    } catch (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
  }

  /**
   * Get all influencers with analytics data
   */
  static async getAllInfluencers(): Promise<InfluencerAnalytics[]> {
    try {
      console.log('Fetching all influencers with analytics...');
      
      // First check if current user is admin
      const isAdmin = await this.isUserAdmin();
      if (!isAdmin) {
        throw new Error('Unauthorized: Admin access required');
      }

      // Try to fetch from the view first
      let { data, error } = await supabase
        .from('influencer_analytics_admin')
        .select('*')
        .order('profile_created_at', { ascending: false });

      // If view fails, fallback to direct table query
      if (error && error.code === '42P01') {
        console.log('View not found, querying influencers table directly...');
        const { data: influencerData, error: influencerError } = await supabase
          .from('influencers')
          .select(`
            id,
            email,
            first_name,
            last_name,
            display_name,
            hms_room_code,
            hms_auth_token,
            is_streaming_enabled,
            token_created_at,
            created_at,
            updated_at,
            verification_status,
            is_verified,
            is_active
          `)
          .order('created_at', { ascending: false });

        if (influencerError) {
          console.error('Error fetching from influencers table:', influencerError);
          throw influencerError;
        }

        // Transform the data to match the expected format
        data = influencerData?.map(influencer => ({
          ...influencer,
          role: 'influencer' as const,
          has_auth_token: !!influencer.hms_auth_token,
          profile_created_at: influencer.created_at,
          profile_updated_at: influencer.updated_at,
          total_streams: 0,
          total_viewers: 0,
          avg_viewers_per_stream: 0,
          max_peak_viewers: 0,
          last_stream_date: null,
          streams_last_30_days: 0,
          currently_live_streams: 0
        })) || [];
      } else if (error) {
        console.error('Error fetching influencers:', error);
        throw error;
      }

      console.log('Fetched influencers:', data);
      return data || [];
    } catch (error) {
      console.error('Error in getAllInfluencers:', error);
      throw error;
    }
  }

  /**
   * Generate HMS auth token for an influencer
   */
  static async generateAuthToken(influencerId: string): Promise<void> {
    try {
      console.log('Generating auth token for influencer:', influencerId);
      
      // Check admin permissions
      const isAdmin = await this.isUserAdmin();
      if (!isAdmin) {
        throw new Error('Unauthorized: Admin access required');
      }

      // Generate a unique room code
      const roomCode = this.generateRoomCode();
      
      // In a real implementation, you would:
      // 1. Call HMS API to create a room
      // 2. Generate management token
      // 3. Store the token securely
      
      // For now, we'll generate a mock token and room ID
      const mockAuthToken = this.generateMockAuthToken(influencerId, roomCode);
      const roomId = `room_${roomCode.toLowerCase()}`;

      // Update the influencer's profile with the new token data
      const { error } = await supabase
        .from('influencers')
        .update({
          hms_room_code: roomCode,
          hms_auth_token: mockAuthToken,
          hms_room_id: roomId,
          token_created_at: new Date().toISOString(),
          is_streaming_enabled: true
        })
        .eq('id', influencerId);

      if (error) {
        console.error('Error updating profile with auth token:', error);
        throw error;
      }

      console.log('Auth token generated successfully for influencer:', influencerId);
    } catch (error) {
      console.error('Error generating auth token:', error);
      throw error;
    }
  }

  /**
   * Update streaming access for an influencer
   */
  static async updateStreamingAccess(influencerId: string, enabled: boolean): Promise<void> {
    try {
      console.log('Updating streaming access:', { influencerId, enabled });
      
      // Check admin permissions
      const isAdmin = await this.isUserAdmin();
      if (!isAdmin) {
        throw new Error('Unauthorized: Admin access required');
      }

      const { error } = await supabase
        .from('influencers')
        .update({
          is_streaming_enabled: enabled,
          updated_at: new Date().toISOString()
        })
        .eq('id', influencerId);

      if (error) {
        console.error('Error updating streaming access:', error);
        throw error;
      }

      console.log('Streaming access updated successfully');
    } catch (error) {
      console.error('Error updating streaming access:', error);
      throw error;
    }
  }

  /**
   * Get platform statistics
   */
  static async getPlatformStats() {
    try {
      const isAdmin = await this.isUserAdmin();
      if (!isAdmin) {
        throw new Error('Unauthorized: Admin access required');
      }

      // Get total influencers
      const { count: totalInfluencers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'influencer');

      // Get total streams
      const { count: totalStreams } = await supabase
        .from('live_sessions_with_influencer')
        .select('*', { count: 'exact', head: true });

      // Get active streams
      const { count: activeStreams } = await supabase
        .from('live_sessions_with_influencer')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'live');

      return {
        totalInfluencers: totalInfluencers || 0,
        totalStreams: totalStreams || 0,
        activeStreams: activeStreams || 0,
      };
    } catch (error) {
      console.error('Error getting platform stats:', error);
      throw error;
    }
  }

  /**
   * Generate a unique room code
   */
  private static generateRoomCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * Generate a mock HMS auth token
   * In production, this would call the actual HMS API
   */
  private static generateMockAuthToken(influencerId: string, roomCode: string): string {
    // This is a mock token - in production you would call HMS API
    const payload = {
      user_id: influencerId,
      room_code: roomCode,
      role: 'broadcaster',
      type: 'management',
      version: 2,
      iat: Math.floor(Date.now() / 1000),
      nbf: Math.floor(Date.now() / 1000)
    };

    // This is just a base64 encoded payload for development
    // In production, use proper JWT signing with HMS secret
    return `mock_token_${btoa(JSON.stringify(payload))}`;
  }

  /**
   * Revoke auth token for an influencer
   */
  static async revokeAuthToken(influencerId: string): Promise<void> {
    try {
      const isAdmin = await this.isUserAdmin();
      if (!isAdmin) {
        throw new Error('Unauthorized: Admin access required');
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          hms_auth_token: null,
          hms_room_code: null,
          hms_room_id: null,
          is_streaming_enabled: false,
          updated_at: new Date().toISOString()
        })
        .eq('id', influencerId);

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Error revoking auth token:', error);
      throw error;
    }
  }

  /**
   * Get influencer's current auth token (for admin purposes)
   */
  static async getInfluencerToken(influencerId: string): Promise<{ roomCode: string; authToken: string } | null> {
    try {
      const isAdmin = await this.isUserAdmin();
      if (!isAdmin) {
        throw new Error('Unauthorized: Admin access required');
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('hms_room_code, hms_auth_token')
        .eq('id', influencerId)
        .single();

      if (error || !data) {
        return null;
      }

      return {
        roomCode: data.hms_room_code,
        authToken: data.hms_auth_token
      };
    } catch (error) {
      console.error('Error getting influencer token:', error);
      return null;
    }
  }
}
