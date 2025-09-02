# Admin Authentication System

A separate authentication system for admin users with email, password, and secret key verification.

## 🚀 Setup Instructions

### 1. **Database Setup**

Run these SQL scripts in your Supabase SQL editor in order:

1. **First, run the main admin schema:**
   ```sql
   -- Copy and paste admin-auth-schema.sql
   ```

2. **Then run the influencer admin setup:**
   ```sql
   -- Copy and paste admin-setup-corrected.sql
   ```

### 2. **Create Your First Admin User**

```sql
-- Replace with your actual details
SELECT public.create_admin_user(
    'admin@yourcompany.com',        -- Your email
    'your-secure-password',         -- Strong password
    'your-secret-key-123',          -- Secret key (keep this secure!)
    'Admin User'                    -- Your full name (optional)
);
```

### 3. **Verify Setup**

```sql
-- Check if admin user was created
SELECT id, email, full_name, is_active, created_at FROM public.admin_users;

-- Test login credentials
SELECT * FROM public.verify_admin_credentials(
    'admin@yourcompany.com',
    'your-secure-password', 
    'your-secret-key-123'
);
```

## 🔐 Admin Access

### **Login URL:**
```
http://localhost:8080/admin/login
```

### **Admin Panel URL:**
```
http://localhost:8080/admin
```

## 📋 Features

### **Admin Authentication:**
- ✅ Separate login system from regular users
- ✅ Email + Password + Secret Key verification
- ✅ Secure password hashing with bcrypt
- ✅ Session management with localStorage
- ✅ Auto-logout on session expiry

### **Admin Panel Features:**
- ✅ View all influencers with analytics
- ✅ Generate HMS auth tokens automatically
- ✅ Enable/disable streaming access
- ✅ Monitor streaming statistics
- ✅ Search and filter influencers

### **Security Features:**
- ✅ Row Level Security (RLS) policies
- ✅ Secret key requirement for signup/login
- ✅ Password encryption
- ✅ Session validation
- ✅ Protected routes

## 🔧 Architecture

### **Database Tables:**

1. **`admin_users`** - Admin user credentials
   - `id`, `email`, `password_hash`, `secret_key`
   - `full_name`, `is_active`, `last_login`
   - `created_at`, `updated_at`

2. **`admin_permissions`** - Admin permissions
   - Links to `admin_users` table
   - JSONB permissions for granular control

3. **`influencers`** - Enhanced with HMS token fields
   - `hms_room_code`, `hms_auth_token`, `hms_room_id`
   - `is_streaming_enabled`, `token_created_at`

### **Key Functions:**

1. **`verify_admin_credentials()`** - Verify login
2. **`create_admin_user()`** - Create new admin
3. **`update_admin_last_login()`** - Track sessions

### **Services:**

1. **`AdminAuthService`** - Handle admin authentication
2. **`AdminService`** - Admin operations (updated for new auth)
3. **`AdminProtectedRoute`** - Route protection

## 🎯 Usage Flow

### **For Admins:**
1. **Login** at `/admin/login` with email, password, and secret key
2. **Access** admin panel at `/admin`
3. **Manage** influencers and generate tokens
4. **Logout** when done

### **For Influencers:**
1. **Admin generates** HMS tokens for them
2. **Visit** `/influencer/live` for simplified streaming
3. **One-click** streaming with auto-loaded tokens

## 🔒 Security Notes

- **Secret Key**: Keep this confidential and share only with trusted admins
- **Password**: Use strong passwords for admin accounts
- **Session**: Sessions expire after 24 hours
- **RLS**: Database access is controlled via Row Level Security

## 🛠 Troubleshooting

### **Cannot access admin panel:**
1. Verify admin user was created successfully
2. Check if secret key is correct
3. Ensure session hasn't expired

### **Database errors:**
1. Run migration scripts in correct order
2. Check Supabase permissions
3. Verify RLS policies are enabled

### **Token generation fails:**
1. Ensure admin is properly authenticated
2. Check influencer exists in database
3. Verify admin permissions

## 📞 Support

The admin system is now complete with:
- ✅ Separate authentication system
- ✅ Secure login with secret key
- ✅ Complete admin panel
- ✅ Auto-token generation for influencers
- ✅ Simplified streaming experience

**Next Steps:** Run the migration scripts and create your first admin user!
