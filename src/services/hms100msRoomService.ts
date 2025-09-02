// 100ms Room Management Service
// This service handles automatic room creation and management

interface RoomConfig {
  name: string;
  description?: string;
  template_id?: string;
  region?: string;
}

interface RoomResponse {
  id: string;
  name: string;
  room_id: string;
  enabled: boolean;
  description: string;
  customer_id: string;
  recording_info?: any;
  created_at: string;
  updated_at: string;
}

interface AuthToken {
  access_token: string;
  type: string;
  room_id: string;
  user_id: string;
  role: string;
  iat: number;
  exp: number;
  aud: string;
  iss: string;
  sub: string;
  jti: string;
}

// Mock implementation - In production, this would call 100ms Management API
class HMS100msRoomService {
  private baseUrl = 'https://api.100ms.live/v2';
  private managementToken: string | null = null;

  // Initialize with your 100ms management token
  constructor(managementToken?: string) {
    this.managementToken = managementToken || process.env.HMS_MANAGEMENT_TOKEN || null;
  }

  // Create a new room automatically
  async createRoom(config: RoomConfig): Promise<{ success: boolean; roomId?: string; authToken?: string; error?: string }> {
    // For now, we'll generate a mock room ID and auth token
    // In production, you would call the 100ms Management API
    
    try {
      // Mock room creation - replace with actual API call
      const roomId = this.generateRoomId();
      const authToken = this.generateAuthToken(config.name);
      
      return {
        success: true,
        roomId,
        authToken
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to create room'
      };
    }
  }

  // Generate auth token for a user to join a room
  async getAuthToken(roomId: string, userId: string, role: string = 'host'): Promise<{ success: boolean; authToken?: string; error?: string }> {
    try {
      // Mock auth token generation - replace with actual API call
      const authToken = this.generateAuthToken(`${userId}-${roomId}`, role);
      
      return {
        success: true,
        authToken
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to generate auth token'
      };
    }
  }

  // Delete a room
  async deleteRoom(roomId: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Mock room deletion - replace with actual API call
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to delete room'
      };
    }
  }

  // Get room details
  async getRoomDetails(roomId: string): Promise<{ success: boolean; room?: any; error?: string }> {
    try {
      // Mock room details - replace with actual API call
      return {
        success: true,
        room: {
          id: roomId,
          name: `Room ${roomId}`,
          enabled: true,
          created_at: new Date().toISOString()
        }
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to get room details'
      };
    }
  }

  // Helper methods for mock implementation
  private generateRoomId(): string {
    return Math.random().toString(36).substring(2, 15);
  }

  private generateAuthToken(identifier: string, role: string = 'host'): string {
    // This is a mock token - in production, use the 100ms Management API
    // The Management API will return a proper JWT token
    const mockToken = btoa(JSON.stringify({
      access_token: Math.random().toString(36).substring(2, 15),
      type: 'app',
      room_id: this.generateRoomId(),
      user_id: identifier,
      role: role,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // 24 hours
      aud: '100ms',
      iss: '100ms',
      sub: identifier,
      jti: Math.random().toString(36).substring(2, 15)
    }));
    
    return mockToken;
  }
}

// Export singleton instance
export const roomService = new HMS100msRoomService();

// Production Implementation Guide:
/*
To implement this with real 100ms API calls:

1. Get your Management Token from 100ms Dashboard
2. Replace mock methods with actual API calls:

async createRoom(config: RoomConfig): Promise<RoomResponse> {
  const response = await fetch(`${this.baseUrl}/rooms`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${this.managementToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: config.name,
      description: config.description,
      template_id: config.template_id, // Your template ID from dashboard
      region: config.region || 'in' // or your preferred region
    })
  });
  
  if (!response.ok) {
    throw new Error(`Failed to create room: ${response.statusText}`);
  }
  
  return response.json();
}

async getAuthToken(roomId: string, userId: string, role: string): Promise<AuthToken> {
  const response = await fetch(`${this.baseUrl}/auth-tokens`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${this.managementToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      room_id: roomId,
      user_id: userId,
      role: role,
      type: 'app'
    })
  });
  
  if (!response.ok) {
    throw new Error(`Failed to get auth token: ${response.statusText}`);
  }
  
  return response.json();
}

Environment Variables needed:
- HMS_MANAGEMENT_TOKEN: Your 100ms management token
- HMS_TEMPLATE_ID: Your room template ID (optional)
*/
