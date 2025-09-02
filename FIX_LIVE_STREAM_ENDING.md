# 🔧 Fix Live Stream Ending Issues

## 🎯 Problems Identified

### 1. **Leave Button Bug**
- Footer "Leave" button only calls `hmsActions.leave()`
- Doesn't update database status from 'live' to 'ended'
- Session remains 'live' in database even after influencer leaves

### 2. **Multiple Concurrent Streams**
- No prevention of multiple live streams from same influencer
- Database allows multiple 'live' sessions per influencer
- Can cause confusion and resource issues

### 3. **Missing Cleanup**
- No proper session cleanup on disconnect
- No recording URL capture
- No final metrics update

## ✅ Solutions to Implement

### 1. **Fix Leave Button**
Update Footer component to properly end stream:

```typescript
// In Footer.tsx - BEFORE (Wrong):
const handleLeave = async () => {
  try {
    await hmsActions.leave();
  } catch (error) {
    console.error('Error leaving room:', error);
  }
};

// AFTER (Fixed):
const handleLeave = async () => {
  try {
    // Call parent component's leave function that handles database cleanup
    if (onLeave) {
      await onLeave();
    } else {
      await hmsActions.leave();
    }
  } catch (error) {
    console.error('Error leaving room:', error);
  }
};
```

### 2. **Add Database Constraint**
Prevent multiple live streams per influencer:

```sql
-- Add unique constraint for live streams per influencer
ALTER TABLE public.live_stream_sessions 
ADD CONSTRAINT unique_live_stream_per_influencer 
EXCLUDE (influencer_id WITH =) 
WHERE (status = 'live');
```

### 3. **Enhanced Stream Ending Logic**
```typescript
const endStreamProperly = async (sessionId: string) => {
  try {
    // 1. Leave HMS room
    await hmsActions.leave();
    
    // 2. Update database status
    await LiveStreamingService.endSession(sessionId, recordingUrl);
    
    // 3. Clean up local state
    setCurrentSessionId(null);
    setStreamingStatus(null);
    
    // 4. Show success message
    toast.success("Stream ended successfully!");
    
  } catch (error) {
    console.error('Error ending stream:', error);
    toast.error("Error ending stream");
  }
};
```

### 4. **Prevent Multiple Streams**
```typescript
const startStream = async () => {
  // Check for existing live streams
  const { data: existingStreams } = await LiveStreamingService
    .getSessionsByInfluencer(influencerId, 'live');
  
  if (existingStreams && existingStreams.length > 0) {
    toast.error("You already have a live stream running. Please end it first.");
    return;
  }
  
  // Proceed with starting new stream
  // ...
};
```

## 🚀 Implementation Files

### Files to Update:
1. `src/components/live-stream/Footer.tsx` - Fix Leave button
2. `src/components/live-stream/LiveStreamSimplified.tsx` - Enhanced cleanup
3. `src/services/liveStreamingService.ts` - Add prevention logic
4. Database schema - Add constraint

### SQL Scripts:
1. `prevent-multiple-streams.sql` - Database constraint
2. `fix-orphaned-sessions.sql` - Clean up existing issues