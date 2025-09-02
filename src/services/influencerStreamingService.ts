import { supabase } from '@/lib/supabase';

export interface InfluencerStreamingConfig {
  roomCode: string;
  authToken: string;
  roomId: string;
  isEnabled: boolean;
}

export class InfluencerStreamingService {
  /**
   * Get streaming configuration for the current influencer
   */
  static async getStreamingConfig(): Promise<InfluencerStreamingConfig | null> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        throw new Error('User not authenticated');
      }

      const { data: influencer, error } = await supabase
        .from('influencers')
        .select('hms_room_code, hms_auth_token, hms_room_id, is_streaming_enabled')
        .eq('user_id', user.user.id)
        .single();

      if (error) {
        console.error('Error fetching streaming config:', error);
        return null;
      }

      if (!influencer || !influencer.hms_room_code || !influencer.hms_auth_token) {
        console.log('No streaming configuration found for user');
        return null;
      }

      return {
        roomCode: influencer.hms_room_code,
        authToken: influencer.hms_auth_token,
        roomId: influencer.hms_room_id,
        isEnabled: influencer.is_streaming_enabled || false
      };
    } catch (error) {
      console.error('Error getting streaming config:', error);
      return null;
    }
  }

  /**
   * Check if influencer has streaming permissions
   */
  static async hasStreamingPermission(): Promise<boolean> {
    try {
      const config = await this.getStreamingConfig();
      return config?.isEnabled || false;
    } catch (error) {
      console.error('Error checking streaming permission:', error);
      return false;
    }
  }

  /**
   * Request streaming access (creates a ticket for admin review)
   */
  static async requestStreamingAccess(): Promise<void> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        throw new Error('User not authenticated');
      }

      // For now, we'll just log this - in production you might want to:
      // 1. Create a support ticket
      // 2. Send notification to admins
      // 3. Track the request status
      
      console.log('Streaming access requested for user:', user.user.id);
      
      // You could implement a requests table for this
      // const { error } = await supabase
      //   .from('streaming_requests')
      //   .insert({
      //     user_id: user.user.id,
      //     status: 'pending',
      //     requested_at: new Date().toISOString()
      //   });
      
    } catch (error) {
      console.error('Error requesting streaming access:', error);
      throw error;
    }
  }

  /**
   * Auto-generate streaming configuration when profile is completed
   * This would be called from the profile completion flow
   */
  static async autoGenerateStreamingConfig(userId: string): Promise<void> {
    try {
      console.log('Auto-generating streaming config for user:', userId);

      // Check if user already has streaming config
      const { data: existingInfluencer } = await supabase
        .from('influencers')
        .select('hms_room_code, hms_auth_token')
        .eq('user_id', userId)
        .single();

      if (existingInfluencer?.hms_room_code && existingInfluencer?.hms_auth_token) {
        console.log('User already has streaming config');
        return;
      }

      // Generate new streaming configuration
      const roomCode = this.generateRoomCode();
      const authToken = this.generateMockAuthToken(userId, roomCode);
      const roomId = `room_${roomCode.toLowerCase()}`;

      // Update influencer with streaming config
      const { error } = await supabase
        .from('influencers')
        .update({
          hms_room_code: roomCode,
          hms_auth_token: authToken,
          hms_room_id: roomId,
          token_created_at: new Date().toISOString(),
          is_streaming_enabled: true // Auto-enable for new users
        })
        .eq('user_id', userId);

      if (error) {
        console.error('Error auto-generating streaming config:', error);
        throw error;
      }

      console.log('Streaming config auto-generated successfully');
    } catch (error) {
      console.error('Error in auto-generating streaming config:', error);
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
  private static generateMockAuthToken(userId: string, roomCode: string): string {
    const payload = {
      user_id: userId,
      room_code: roomCode,
      role: 'broadcaster',
      type: 'management',
      version: 2,
      iat: Math.floor(Date.now() / 1000),
      nbf: Math.floor(Date.now() / 1000)
    };

    return `mock_token_${btoa(JSON.stringify(payload))}`;
  }

  /**
   * Validate auth token (check if it's still valid)
   */
  static async validateAuthToken(): Promise<boolean> {
    try {
      const config = await this.getStreamingConfig();
      if (!config || !config.authToken) {
        return false;
      }

      // In production, you would validate the token with HMS API
      // For now, we'll just check if the token exists and user is enabled
      return config.isEnabled;
    } catch (error) {
      console.error('Error validating auth token:', error);
      return false;
    }
  }

  /**
   * Get streaming status for UI display
   */
  static async getStreamingStatus(): Promise<{
    hasConfig: boolean;
    isEnabled: boolean;
    roomCode: string | null;
    needsSetup: boolean;
  }> {
    try {
      const config = await this.getStreamingConfig();
      
      return {
        hasConfig: !!config,
        isEnabled: config?.isEnabled || false,
        roomCode: config?.roomCode || null,
        needsSetup: !config || !config.roomCode || !config.authToken
      };
    } catch (error) {
      console.error('Error getting streaming status:', error);
      return {
        hasConfig: false,
        isEnabled: false,
        roomCode: null,
        needsSetup: true
      };
    }
  }
}
