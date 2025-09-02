// Utility to handle room ID format compatibility
export const getRoomIdForJoining = (roomCode: string): string => {
  // If it's already a full room ID format, use as-is
  if (roomCode.length > 15 && !roomCode.startsWith('ROOM-')) {
    return roomCode;
  }
  
  // If it's a shortened format like "ROOM-46478A74", we need the original
  // This is a fallback for existing database entries
  if (roomCode.startsWith('ROOM-')) {
    console.warn('Using shortened room code:', roomCode, 'This may not work with 100ms. Please restart the live stream to get the full room ID.');
    return roomCode;
  }
  
  return roomCode;
};

// Helper to display user-friendly room codes while keeping full IDs for 100ms
export const getDisplayRoomCode = (fullRoomId: string): string => {
  if (fullRoomId.length > 20) {
    // Generate a display version for UI
    const shortCode = fullRoomId.substring(fullRoomId.length - 8).toUpperCase();
    return `ROOM-${shortCode}`;
  }
  return fullRoomId;
};
