# Setup Guide: Viewer HMS Fields

## Quick Setup Steps

### 1. Apply Database Migration

Choose one of these options:

**Option A: Safe Migration (Recommended)**
```sql
-- Run this in your Supabase SQL editor
\i add-viewer-hms-fields-safe.sql
```

**Option B: Direct Migration**
```sql
-- Run this in your Supabase SQL editor  
\i add-viewer-hms-fields.sql
```

### 2. Verify Installation

Run the test script to verify everything is working:
```sql
\i test-viewer-fields.sql
```

### 3. Test the Admin Panel

1. Navigate to your admin panel (`/admin`)
2. Login as admin
3. Click "Set/Update Token" for any influencer
4. You should now see:
   - **Broadcaster Section** (Purple badge)
   - **Viewer Section** (Green badge)
5. Fill in the tokens and save

## Troubleshooting

### If you get "function already exists" error:
The safe migration script handles this automatically. If using the direct migration, the error is expected and the function will be recreated properly.

### If columns already exist:
The safe migration script will detect existing columns and skip creation.

### If you need to rollback:
```sql
-- Remove the new columns (CAUTION: This will delete data!)
ALTER TABLE public.influencers DROP COLUMN IF EXISTS hms_viewer_room_code;
ALTER TABLE public.influencers DROP COLUMN IF EXISTS hms_viewer_auth_token;

-- Drop the updated functions
DROP FUNCTION IF EXISTS admin_get_all_influencers();
DROP FUNCTION IF EXISTS admin_update_influencer_token(UUID, TEXT, TEXT, TEXT, TEXT, TEXT);
```

## What's New

### Database
- ✅ `hms_viewer_room_code` column added
- ✅ `hms_viewer_auth_token` column added  
- ✅ Indexes created for performance
- ✅ Admin functions updated

### Admin Panel
- ✅ Enhanced token input modal with broadcaster/viewer sections
- ✅ Visual badges showing token status
- ✅ Separate room code display
- ✅ New statistics for viewer tokens

### Backend
- ✅ Updated service methods to handle viewer credentials
- ✅ Automatic viewer room code generation
- ✅ Enhanced data interfaces

## Next Steps

1. **Test the functionality** in your admin panel
2. **Update your customer frontend** to use viewer credentials when joining live streams
3. **Configure HMS dashboard** with appropriate viewer roles and permissions

The implementation is now complete and ready for production use!