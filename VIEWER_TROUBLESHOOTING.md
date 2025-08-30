# How to Test the New Viewer Experience

## Issue: Customer still seeing "Join Live Stream" instead of "Watch Live Stream"

### The Problem
The customer is seeing the old interface that asks for a room code, instead of the new viewer-only experience.

### Solution Steps:

#### 1. **Hard Refresh the Browser**
The customer needs to do a **hard refresh** to clear the cached JavaScript:
- **Chrome/Edge**: Press `Ctrl + F5` or `Ctrl + Shift + R`
- **Firefox**: Press `Ctrl + F5` or `Ctrl + Shift + R`
- **Safari**: Press `Cmd + Shift + R`

#### 2. **Clear Browser Cache** (if hard refresh doesn't work)
- Open Developer Tools (F12)
- Right-click the refresh button
- Select "Empty Cache and Hard Reload"

#### 3. **Verify the Correct Route**
Make sure you're accessing: `http://localhost:8081/livestream/{stream-id}`

### What Should Happen (New Experience):

1. **Navigate to Live Streams**: Go to `/play` (Live tab)
2. **Click on a Live Stream**: Should go to `/livestream/{id}` 
3. **See Stream Details Page**: Shows stream info with **"Watch Live Stream"** button (not "Join")
4. **Click "Watch Live Stream"**: Should immediately open full-screen viewer (no room code needed)

### What Was Happening Before (Old Experience):
- Customer saw "Join Live Stream" button
- Had to enter room code manually
- Joined as video participant

### Technical Changes Made:
- ✅ Updated `/livestream/:id` route to use `LiveStreamViewerPage`
- ✅ Created new `LiveStreamViewer` component for viewer-only experience
- ✅ Changed button text from "Join Live Stream" to "Watch Live Stream"
- ✅ Automatic room joining using database `room_code`

### If Still Seeing Issues:
1. Check browser console for errors (F12 → Console tab)
2. Verify the correct URL is being used
3. Make sure you're signed in as a customer (not influencer)
4. Try incognito/private browsing mode

### Expected Final Flow:
```
Live Tab → Click Stream → "Watch Live Stream" → Full-Screen Viewer
(/play)  → (/livestream/id) →     (click)      →  (viewer mode)
```

The changes are in place - the customer just needs to refresh to see them!
