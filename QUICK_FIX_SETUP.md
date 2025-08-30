# 🚀 Quick Setup: Fix Live Stream Ending Issues

## ✅ Step-by-Step Fix

### **Step 1: Run Database Scripts (Required)**

#### **Option A: Simple Scripts (Recommended)**
```sql
-- 1. Copy and run: cleanup-orphaned-sessions-simple.sql
-- This ends any stuck live sessions

-- 2. Copy and run: prevent-multiple-streams-simple.sql  
-- This prevents multiple live streams per influencer
```

#### **Option B: Full Scripts (Advanced)**
```sql
-- 1. Copy and run: fix-orphaned-sessions.sql
-- 2. Copy and run: prevent-multiple-streams.sql
```

### **Step 2: Code is Already Fixed** ✅
The following files have been automatically updated:
- ✅ `src/components/live-stream/Footer.tsx`
- ✅ `src/components/live-stream/LiveStreamSimplified.tsx`  
- ✅ `src/services/liveStreamingService.ts`

### **Step 3: Test the Fixes**

1. **Start Live Stream**:
   - Login as influencer
   - Go to `/influencer/live`
   - Start a stream

2. **Test Leave Button**:
   - Click "Leave" button
   - Should see "Stream ended successfully!" message
   - Check database - status should be 'ended'

3. **Test Multiple Stream Prevention**:
   - Try starting another stream immediately
   - Should prevent if one is already live

## 🎯 What's Fixed

### **Before Fix:**
- ❌ Leave button didn't update database
- ❌ Multiple live streams allowed per influencer
- ❌ Sessions got stuck in 'live' status

### **After Fix:**
- ✅ Leave button properly ends stream and updates database
- ✅ Only one live stream per influencer allowed
- ✅ Automatic cleanup of orphaned sessions
- ✅ Success notifications for users

## 🔍 Verification

### **Check Active Streams:**
```sql
SELECT 
  influencer_id, 
  COUNT(*) as live_count,
  STRING_AGG(title, ', ') as titles
FROM live_stream_sessions 
WHERE status = 'live' 
GROUP BY influencer_id;
```
**Expected**: Max 1 live stream per influencer

### **Check Recent Endings:**
```sql
SELECT title, status, actual_end_time 
FROM live_stream_sessions 
WHERE actual_end_time > NOW() - INTERVAL '1 hour'
ORDER BY actual_end_time DESC;
```
**Expected**: Shows recently ended streams

## ⚠️ If You Get SQL Errors

### **Error: "syntax error at or near RAISE"**
- Use the **simple** versions of the scripts
- They don't have complex triggers or RAISE statements

### **Error: "relation does not exist"**
- Make sure your database schema is deployed
- Check table names match your setup

## 🎉 Success Indicators

After running the scripts, you should see:
1. ✅ No SQL errors
2. ✅ Leave button works properly  
3. ✅ Database status updates correctly
4. ✅ Multiple stream prevention works
5. ✅ Success notifications appear

**Your live streaming system is now fixed and reliable! 🚀**