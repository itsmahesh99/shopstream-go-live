import { supabase } from '@/lib/supabase';
import { AdminAuthService } from './adminAuthService';

export interface InfluencerAnalytics {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  display_name?: string;
  role: string;
  hms_room_code?: string;
  hms_viewer_room_code?: string;
  has_auth_token: boolean;
  has_viewer_auth_token: boolean;
  is_streaming_enabled: boolean;
  token_created_at?: string;
  profile_created_at: string;
  profile_updated_at: string;
  total_streams: number;
  total_viewers: number;
  avg_viewers_per_stream: number;
  max_peak_viewers: number;
  last_stream_date?: string;
  streams_last_30_days: number;
  currently_live_streams: number;
  verification_status?: string;
  is_verified: boolean;
  is_active: boolean;
}

export class AdminServiceSimple {
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
   * Get all influencers with basic data (simplified) - Admin version that bypasses RLS
   */
  static async getAllInfluencers(): Promise<InfluencerAnalytics[]> {
    try {
      console.log('Fetching all influencers for admin...');
      
      // First check if current user is admin
      const isAdmin = await this.isUserAdmin();
      if (!isAdmin) {
        throw new Error('Unauthorized: Admin access required');
      }

      // Use admin-specific function that bypasses RLS and gets ALL influencers
      const { data: influencers, error } = await supabase.rpc('admin_get_all_influencers');

      if (error) {
        console.error('Error fetching influencers via admin function:', error);
        // Fallback to direct query if function doesn't exist
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('influencers')
          .select(`
            id,
            email,
            first_name,
            last_name,
            display_name,
            hms_room_code,
            hms_auth_token,
            hms_viewer_room_code,
            hms_viewer_auth_token,
            hms_room_id,
            is_streaming_enabled,
            token_created_at,
            created_at,
            updated_at,
            verification_status,
            is_verified,
            is_active
          `)
          .order('created_at', { ascending: false });
        
        if (fallbackError) {
          console.error('Fallback query also failed:', fallbackError);
          throw fallbackError;
        }
        
        console.log('Using fallback query results');
        return this.transformInfluencerData(fallbackData || []);
      }

      console.log('Admin query successful, fetched influencers:', influencers?.length || 0);
      return this.transformInfluencerData(influencers || []);
    } catch (error) {
      console.error('Error in getAllInfluencers:', error);
      throw error;
    }
  }

  /**
   * Transform raw influencer data to expected format
   */
  private static transformInfluencerData(influencers: any[]): InfluencerAnalytics[] {
    return (influencers || []).map(influencer => ({
      id: influencer.id,
      email: influencer.email || '',
      first_name: influencer.first_name || '',
      last_name: influencer.last_name || '',
      display_name: influencer.display_name || '',
      role: 'influencer',
      hms_room_code: influencer.hms_room_code || '',
      hms_viewer_room_code: influencer.hms_viewer_room_code || '',
      has_auth_token: !!influencer.hms_auth_token,
      has_viewer_auth_token: !!influencer.hms_viewer_auth_token,
      is_streaming_enabled: influencer.is_streaming_enabled || false,
      token_created_at: influencer.token_created_at || '',
      profile_created_at: influencer.created_at || '',
      profile_updated_at: influencer.updated_at || '',
      total_streams: 0, // Simplified - can add later
      total_viewers: 0,
      avg_viewers_per_stream: 0,
      max_peak_viewers: 0,
      last_stream_date: '',
      streams_last_30_days: 0,
      currently_live_streams: 0,
      verification_status: influencer.verification_status || '',
      is_verified: influencer.is_verified || false,
      is_active: influencer.is_active || false
    }));
  }

  /**
   * Manually set HMS auth token for an influencer
   */
  static async setManualAuthToken(
    influencerId: string, 
    authToken: string, 
    roomCode?: string, 
    viewerAuthToken?: string, 
    viewerRoomCode?: string
  ): Promise<void> {
    try {
      console.log('Setting manual auth token for influencer:', influencerId);
      
      // Check admin permissions
      const isAdmin = await this.isUserAdmin();
      if (!isAdmin) {
        throw new Error('Unauthorized: Admin access required');
      }

      // Validate token input
      if (!authToken || authToken.trim().length === 0) {
        throw new Error('Auth token cannot be empty');
      }

      // Generate room codes if not provided
      const finalRoomCode = roomCode || this.generateRoomCode();
      const finalViewerRoomCode = viewerRoomCode || (viewerAuthToken ? this.generateViewerRoomCode() : undefined);
      const roomId = `room_${finalRoomCode.toLowerCase()}`;

      // Try to use admin function first
      try {
        const { data, error } = await supabase.rpc('admin_update_influencer_token', {
          p_influencer_id: influencerId,
          p_auth_token: authToken.trim(),
          p_room_code: finalRoomCode,
          p_room_id: roomId,
          p_viewer_auth_token: viewerAuthToken?.trim() || null,
          p_viewer_room_code: finalViewerRoomCode || null
        });

        if (error) {
          throw error;
        }

        console.log('Manual auth token set successfully via admin function for influencer:', influencerId);
        return;
      } catch (adminFuncError) {
        console.log('Admin function not available, using direct update:', adminFuncError);
      }

      // Fallback to direct update
      const updateData: any = {
        hms_room_code: finalRoomCode,
        hms_auth_token: authToken.trim(),
        hms_room_id: roomId,
        token_created_at: new Date().toISOString(),
        is_streaming_enabled: true,
        updated_at: new Date().toISOString()
      };

      // Add viewer fields if provided
      if (viewerAuthToken) {
        updateData.hms_viewer_auth_token = viewerAuthToken.trim();
      }
      if (finalViewerRoomCode) {
        updateData.hms_viewer_room_code = finalViewerRoomCode;
      }

      const { error } = await supabase
        .from('influencers')
        .update(updateData)
        .eq('id', influencerId);

      if (error) {
        console.error('Error updating influencer with manual auth token:', error);
        throw error;
      }

      console.log('Manual auth token set successfully for influencer:', influencerId);
    } catch (error) {
      console.error('Error setting manual auth token:', error);
      throw error;
    }
  }

  /**
   * Generate HMS auth token for an influencer (simplified)
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
        console.error('Error updating influencer with auth token:', error);
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

      // Try to use admin function first
      try {
        const { data, error } = await supabase.rpc('admin_update_streaming_access', {
          p_influencer_id: influencerId,
          p_enabled: enabled
        });

        if (error) {
          throw error;
        }

        console.log('Streaming access updated successfully via admin function');
        return;
      } catch (adminFuncError) {
        console.log('Admin function not available, using direct update:', adminFuncError);
      }

      // Fallback to direct update
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
   * Generate a unique room code
   */
  private static generateRoomCode(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 8);
    return `ROOM_${timestamp}_${random}`.toUpperCase();
  }

  /**
   * Generate a unique viewer room code
   */
  private static generateViewerRoomCode(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 8);
    return `VIEWER_${timestamp}_${random}`.toUpperCase();
  }

  /**
   * Generate a mock auth token
   */
  private static generateMockAuthToken(influencerId: string, roomCode: string): string {
    const timestamp = Date.now();
    const hash = btoa(`${influencerId}:${roomCode}:${timestamp}`);
    return `HMS_TOKEN_${hash}`;
  }
}

// Export both for compatibility
export const AdminService = AdminServiceSimple;
