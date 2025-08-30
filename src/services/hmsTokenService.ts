import { Base64 } from 'js-base64';

// Browser-compatible 100ms JWT token service
interface TokenPayload {
  access_key: string;
  room_id: string;
  user_id: string;
  role: string;
  type: 'app';
  version: number;
  iat: number;
  exp: number;
  jti: string; // JWT ID - required by 100ms
}

interface JWTHeader {
  alg: string;
  typ: string;
}

export class HMSTokenService {
  private static APP_ACCESS_KEY = import.meta.env.VITE_HMS_APP_ACCESS_KEY;
  private static APP_SECRET = 'Uzaoxchxmm7jrXc403TbTcVltNLP3Y4lKcDdWUVTP9f1FLFzt1goS2A4ZM2iVgiYWvlH8-1U6O42foQh9Fb3VxMTamdofJGkgRn6hIF_aB0GTl6uQvq1d9R49HSop4FXlc-_L0afbC2Hsmmw0CryNsIRi-pIqTG1i01-4D__Q8Q=';

  /**
   * Generate HMAC-SHA256 signature (simplified for browser)
   * Note: This is a basic implementation. In production, use proper server-side JWT generation
   */
  private static async hmacSHA256(message: string, secret: string): Promise<string> {
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    
    const signature = await crypto.subtle.sign(
      'HMAC',
      key,
      encoder.encode(message)
    );
    
    return Base64.fromUint8Array(new Uint8Array(signature), true);
  }

  /**
   * Create a room using the 100ms API and return the room code
   */
  static async createRoom(roomName?: string): Promise<string> {
    const managementToken = this.getManagementToken();
    const roomNameForAPI = roomName || `live-stream-${Date.now()}`;
    
    try {
      const response = await fetch('https://api.100ms.live/v2/rooms', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${managementToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: roomNameForAPI,
          description: 'Live streaming room created via ShopStream',
          template_id: this.APP_ACCESS_KEY, // Use your template/access key
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Failed to create room:', errorData);
        throw new Error(`Failed to create room: ${response.status}`);
      }

      const roomData = await response.json();
      console.log('Created room:', roomData);
      
      return roomData.id || roomData.room_id || roomNameForAPI;
    } catch (error) {
      console.error('Error creating room:', error);
      // Fallback to generating a room code
      return this.createRoomCode(roomName);
    }
  }

  /**
   * Generate a proper JWT token for 100ms authentication
   * This is a browser-compatible implementation for development
   */
  static async generateToken(roomId: string, userId: string, role: string = 'host'): Promise<string> {
    const header: JWTHeader = {
      alg: 'HS256',
      typ: 'JWT'
    };

    const now = Math.floor(Date.now() / 1000);
    const payload: TokenPayload = {
      access_key: this.APP_ACCESS_KEY,
      room_id: roomId,
      user_id: userId,
      role: role,
      type: 'app',
      version: 2,
      iat: now,
      exp: now + (24 * 60 * 60), // 24 hours
      jti: `${userId}-${roomId}-${now}-${Math.random().toString(36).substring(2)}` // Unique JWT ID
    };

    try {
      const encodedHeader = Base64.encode(JSON.stringify(header), true);
      const encodedPayload = Base64.encode(JSON.stringify(payload), true);
      const unsignedToken = `${encodedHeader}.${encodedPayload}`;
      
      const signature = await this.hmacSHA256(unsignedToken, this.APP_SECRET);
      const token = `${unsignedToken}.${signature}`;
      
      console.log('Generated JWT token payload:', payload);
      console.log('Generated JWT token for room:', roomId);
      
      // Validate token structure
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error('Invalid JWT token structure');
      }
      
      return token;
    } catch (error) {
      console.error('Error generating JWT token:', error);
      throw new Error('Failed to generate authentication token');
    }
  }

  /**
   * Generate authentication token for room access (async wrapper)
   */
  static async generateAuthToken(roomId: string, userId: string, role: string = 'host'): Promise<string> {
    return this.generateToken(roomId, userId, role);
  }

  /**
   * Create a simple room code for development
   */
  static createRoomCode(customSuffix?: string): string {
    const suffix = customSuffix || Math.random().toString(36).substring(2, 8);
    const timestamp = Date.now().toString(36);
    return `${this.APP_ACCESS_KEY}-${timestamp}-${suffix}`;
  }

  /**
   * Validate if a room code follows the expected format
   */
  static isValidRoomCode(roomCode: string): boolean {
    if (!roomCode || typeof roomCode !== 'string') return false;
    
    // Check if it starts with your access key, is a JWT token, or is a valid HMS room code
    return roomCode.startsWith(this.APP_ACCESS_KEY) || 
           roomCode.includes('.') || // JWT format
           roomCode.length > 10; // Basic length check for other formats
  }

  /**
   * Extract room information from room code
   */
  static parseRoomCode(roomCode: string): { accessKey: string; roomSuffix: string } {
    if (roomCode.startsWith(this.APP_ACCESS_KEY)) {
      return {
        accessKey: this.APP_ACCESS_KEY,
        roomSuffix: roomCode.substring(this.APP_ACCESS_KEY.length + 1)
      };
    }
    
    return {
      accessKey: this.APP_ACCESS_KEY,
      roomSuffix: roomCode
    };
  }

  /**
   * Get the 100ms management token for API calls
   */
  static getManagementToken(): string {
    return 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3NTYzOTIyMjgsImV4cCI6MTc1Njk5NzAyOCwianRpIjoiYTVhNzA0ZDItZWU0NS00YTAwLWJjNTAtODRhMDgyZDYyNTBkIiwidHlwZSI6Im1hbmFnZW1lbnQiLCJ2ZXJzaW9uIjoyLCJuYmYiOjE3NTYzOTIyMjgsImFjY2Vzc19rZXkiOiI2OGIwNDU5OWJkMGRhYjVmOWEwMTM5NzkifQ.WsUh3DvpKe3921kDb-MJ2WCtruBTBuSsmF_lw4yTne0';
  }
}

export default HMSTokenService;
