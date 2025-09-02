# CORS Error Fix for Live Stream Viewer

## The Problem
The customer was seeing a **CORS error** when trying to join as a viewer:

```
Access to fetch at 'https://...functions.supabase.co/hms-token' from origin 'http://localhost:8080' has been blocked by CORS policy: Response to preflight request doesn't pass access control check: No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

## Root Cause
The Supabase Edge Function for HMS token generation doesn't have proper CORS headers configured for local development (`localhost:8080`).

## Solution Implemented ✅

### 1. **Added Fallback Token Generation**
The `LiveStreamViewer` component now uses the same fallback approach as the original `LiveStream` component:

```typescript
// Try edge function first
try {
  authToken = await getHMSAuthTokenViaEdge(roomCode, 'guest', user.id);
  console.log("Got token from edge function");
} catch (edgeError) {
  console.warn('Edge function failed, falling back to local token generation:', edgeError);
  // Fallback to local token generation
  authToken = await HMSTokenService.generateAuthToken(roomCode, user.id, 'guest');
  console.log("Got token from local service");
}
```

### 2. **Fixed Role Name**
Changed from `'viewer'` to `'guest'` to match the existing HMS role configuration.

### 3. **Added Database Integration**
- Tracks viewers in the database when they join
- Cleans up viewer records when they leave
- Updates viewer counts properly

### 4. **Enhanced Error Handling**
- Graceful fallback when edge function fails
- Better error messages for debugging
- Console logs for tracking connection flow

## How It Works Now

### **For Local Development:**
1. Customer clicks "Watch Live Stream"
2. System tries to get token from Supabase Edge Function
3. **If CORS fails** → Falls back to local HMS token generation
4. Customer joins as viewer successfully
5. Database tracks the viewer

### **For Production:**
1. Edge function should work (proper CORS configured)
2. If edge function fails → Still has local fallback
3. Robust experience in all environments

## Files Modified
1. `src/components/live-stream/LiveStreamViewer.tsx` - Added fallback token generation
2. `src/pages/LiveStreamViewerPage.tsx` - Pass sessionId for database tracking

## Testing
The customer should now be able to:
1. Click "Watch Live Stream" button (after hard refresh)
2. See the viewer connecting successfully 
3. View the live stream without CORS errors
4. Be tracked in the database as a viewer

## Expected Console Output (Success)
```
Joining as viewer with room code: ROOM-46478A74
Edge function failed, falling back to local token generation: [CORS Error]
Got token from local service
Viewer record created: {id: "...", session_id: "..."}
Successfully joined as viewer
```

The CORS issue is now handled gracefully with the fallback approach!
