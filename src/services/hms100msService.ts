import { supabase } from '@/lib/supabase';

// 100ms API Configuration
const HMS_MANAGEMENT_API_BASE = 'https://api.100ms.live/v2';
const APP_ACCESS_KEY = import.meta.env.VITE_HMS_APP_ACCESS_KEY;

// Note: Management token should be used server-side only for security
// For client-side, we'll create rooms with basic auth and use room codes

interface CreateRoomResponse {
  id: string;
  name: string;
  enabled: boolean;
  template_id: string;
  customer_id: string;
  recording_info?: any;
  region: string;
  created_at: string;
  updated_at: string;
}

interface RoomCode {
  code: string;
  room_id: string;
  role: string;
  enabled: boolean;
}

export class HMS100msService {
  private static instance: HMS100msService;
  
  public static getInstance(): HMS100msService {
    if (!HMS100msService.instance) {
      HMS100msService.instance = new HMS100msService();
    }
    return HMS100msService.instance;
  }

  /**
   * Create a new room for live streaming
   */
  async createRoom(streamTitle: string, userId: string): Promise<{ roomCode: string; roomId: string }> {
    try {
      // For now, we'll use a simplified approach with predefined room codes
      // In production, you would call the 100ms API to create rooms dynamically
      
      // Generate a unique room identifier
      const roomIdentifier = `live-${userId}-${Date.now()}`;
      
      // For demo purposes, we'll use your app access key as a room code base
      // In production, you'd create actual rooms via API
      const roomCode = `${APP_ACCESS_KEY}-${Math.random().toString(36).substring(2, 8)}`;
      
      // Store the room information in Supabase for tracking
      await this.storeRoomSession(roomIdentifier, streamTitle, userId, roomCode);
      
      return {
        roomCode,
        roomId: roomIdentifier
      };
    } catch (error) {
      console.error('Error creating room:', error);
      throw new Error('Failed to create room');
    }
  }

  /**
   * Get authentication token for room access
   */
  async getAuthToken(roomCode: string, userId: string, role: string = 'host'): Promise<string> {
    try {
      // For client-side implementation, we'll use the room code directly
      // The 100ms SDK will handle authentication with your app access key
      return roomCode;
    } catch (error) {
      console.error('Error getting auth token:', error);
      throw new Error('Failed to get authentication token');
    }
  }

  /**
   * Generate room codes for quick access
   */
  generateQuickRoomCode(): string {
    // Generate a room code based on your access key
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 6);
    return `${APP_ACCESS_KEY.substring(0, 8)}-${timestamp}-${random}`;
  }

  /**
   * Validate room code format
   */
  isValidRoomCode(roomCode: string): boolean {
    // Basic validation for room code format
    return roomCode && roomCode.length > 10 && roomCode.includes('-');
  }

  /**
   * Store room session in database
   */
  private async storeRoomSession(roomId: string, title: string, userId: string, roomCode: string) {
    try {
      const { error } = await supabase
        .from('live_streams')
        .insert({
          room_id: roomId,
          title,
          host_id: userId,
          room_code: roomCode,
          status: 'created',
          created_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error storing room session:', error);
      }
    } catch (error) {
      console.error('Error storing room session:', error);
    }
  }

  /**
   * Get active room sessions for a user
   */
  async getUserActiveRooms(userId: string) {
    try {
      const { data, error } = await supabase
        .from('live_streams')
        .select('*')
        .eq('host_id', userId)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching user rooms:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching user rooms:', error);
      return [];
    }
  }

  /**
   * End a live stream session
   */
  async endStream(roomId: string) {
    try {
      const { error } = await supabase
        .from('live_streams')
        .update({ 
          status: 'ended',
          ended_at: new Date().toISOString()
        })
        .eq('room_id', roomId);

      if (error) {
        console.error('Error ending stream:', error);
      }
    } catch (error) {
      console.error('Error ending stream:', error);
    }
  }
}

export const hms100msService = HMS100msService.getInstance();
