// JWT Token Utility for Live Streaming
// Extracts room_id from 100ms JWT tokens

export const extractRoomDetailsFromJWT = (jwtToken: string) => {
  try {
    // JWT tokens have 3 parts: header.payload.signature
    const parts = jwtToken.split('.');
    if (parts.length !== 3) {
      return { roomId: null, roomCode: null, error: 'Invalid JWT format' };
    }

    // Decode the payload (second part)
    const payload = parts[1];
    
    // Add padding if needed for base64 decoding
    const paddedPayload = payload + '='.repeat((4 - payload.length % 4) % 4);
    
    // Decode from base64
    const decodedPayload = atob(paddedPayload);
    const payloadObject = JSON.parse(decodedPayload);

    console.log('Decoded JWT payload:', payloadObject);

    // Extract room details
    const roomId = payloadObject.room_id || null;
    const roomCode = roomId ? roomId.substring(0, 99) : null; // Truncate to fit DB constraint
    
    return {
      roomId,
      roomCode,
      userId: payloadObject.user_id,
      role: payloadObject.role,
      error: null
    };
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return { 
      roomId: null, 
      roomCode: null, 
      error: `Failed to decode JWT: ${error}` 
    };
  }
};

export const generateShortRoomCode = (roomId: string): string => {
  // Generate a short, user-friendly room code from the full room ID
  // Take last 8 characters and add prefix
  const shortCode = roomId.substring(roomId.length - 8).toUpperCase();
  return `ROOM-${shortCode}`;
};
