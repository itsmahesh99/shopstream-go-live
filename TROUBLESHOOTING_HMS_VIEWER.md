# Troubleshooting HMS Viewer Implementation

## Common Issues and Solutions

### 1. "Column does not exist" Error

**Error**: `column influencers_1.avatar_url does not exist` or similar column errors

**Cause**: The database schema is missing required columns for HMS viewer functionality.

**Solution**: Run the database migration to add missing columns:

```sql
-- Run this in your Supabase SQL editor
\i fix-missing-hms-fields.sql
```

Or manually add the columns:

```sql
-- Add HMS viewer fields
ALTER TABLE public.influencers ADD COLUMN IF NOT EXISTS hms_viewer_room_code VARCHAR(255);
ALTER TABLE public.influencers ADD COLUMN IF NOT EXISTS hms_viewer_auth_token TEXT;
ALTER TABLE public.influencers ADD COLUMN IF NOT EXISTS followers_count INTEGER DEFAULT 0;
ALTER TABLE public.influencers ADD COLUMN IF NOT EXISTS display_name TEXT;
```

### 2. "Failed to load live stream session" Error

**Cause**: Database query failing due to missing columns or incorrect table structure.

**Solution**: 
1. Check if the `live_stream_sessions` table exists
2. Verify the `influencers` table has the required columns
3. Run the schema check script:

```sql
\i check-influencers-schema.sql
```

### 3. "Viewer access not configured" Message

**Cause**: No HMS viewer credentials have been set up in the admin panel.

**Solution**:
1. Login to admin panel (`/admin`)
2. Select an influencer
3. Click "Set/Update Token"
4. Fill in both broadcaster and viewer HMS credentials
5. Save the configuration

### 4. Auto-start Not Working

**Cause**: User not authenticated or stream not in 'live' status.

**Expected Behavior**:
- ✅ Live stream + authenticated user → Auto-start
- ⚠️ Live stream + unauthenticated user → Show details page
- 📅 Non-live stream → Show details page

**Solution**: Ensure user is logged in and stream status is 'live'.

### 5. HMS Connection Timeout

**Cause**: Network issues or invalid HMS credentials.

**Solution**:
1. Check internet connection
2. Verify HMS credentials in admin panel
3. Check HMS dashboard for room/token validity
4. Try refreshing the page

## Fallback Behavior

The enhanced viewer component includes automatic fallback:

1. **Primary**: Use pre-configured viewer HMS credentials from database
2. **Fallback**: Generate viewer token using existing HMS services
3. **Error**: Show clear error message with troubleshooting steps

## Debugging Steps

### 1. Check Database Schema
```sql
-- Verify influencers table structure
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'influencers' 
ORDER BY column_name;
```

### 2. Check Live Stream Data
```sql
-- Check if there are live streams
SELECT id, title, status, influencer_id 
FROM live_stream_sessions 
WHERE status = 'live' 
LIMIT 5;
```

### 3. Check HMS Credentials
```sql
-- Check if HMS credentials are configured
SELECT 
    id, 
    display_name,
    hms_room_code IS NOT NULL as has_broadcaster_room,
    hms_auth_token IS NOT NULL as has_broadcaster_token,
    hms_viewer_room_code IS NOT NULL as has_viewer_room,
    hms_viewer_auth_token IS NOT NULL as has_viewer_token
FROM influencers 
WHERE is_streaming_enabled = true;
```

### 4. Browser Console Debugging

Open browser developer tools and check for:

- **Network errors**: Failed API requests to Supabase
- **Console logs**: HMS connection attempts and errors
- **Authentication**: User login status

## Component Behavior

### LiveStreamViewerEnhanced
- Automatically fetches session data and HMS credentials
- Falls back to token generation if no viewer credentials
- Shows clear error messages for different failure scenarios

### CustomerLivePageEnhanced  
- Shows credential status for each live stream
- Visual indicators: ✅ Ready, ⚠️ Limited, ❌ Not Configured
- Clickable cards for direct stream access

### ViewerHMSService
- Handles database queries with fallback for missing columns
- Validates HMS token formats
- Provides credential status checking

## Performance Tips

1. **Database Indexes**: Ensure indexes exist on HMS fields for faster queries
2. **Connection Pooling**: Use Supabase connection pooling for better performance
3. **Caching**: Consider caching HMS credentials for frequently accessed streams

## Security Considerations

1. **Token Validation**: HMS tokens are validated before use
2. **User Authentication**: Only authenticated users can join live streams
3. **Role-based Access**: Separate tokens for broadcasters and viewers
4. **Error Handling**: No sensitive information exposed in error messages

## Getting Help

If issues persist:

1. **Check Logs**: Browser console and network tab
2. **Verify Setup**: Admin panel configuration
3. **Test Database**: Run schema verification scripts
4. **HMS Dashboard**: Check HMS service status

The implementation includes comprehensive error handling and fallback mechanisms to ensure the best possible user experience even when some features are not fully configured.