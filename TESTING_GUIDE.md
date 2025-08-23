# Testing Guide - Role-Based Access System

## 🧪 How to Test the New Role-Based System

### Prerequisites
1. Ensure your Supabase database is set up with the tables: `customers`, `influencers`, `wholesalers`
2. Start the development server: `npm run dev`

### Test Scenarios

## 1. **Customer Experience Test**

### Sign Up as Customer
1. Go to `/signup`
2. Select "Customer" role
3. Fill out customer signup form
4. After signup, you should be redirected to `/home`
5. You should see the **CustomerNavbar** with shopping navigation

### Customer Navigation Test
- ✅ Should access: `/home`, `/shop`, `/cart`, `/wishlist`, `/play`, `/profile`
- ❌ Should be redirected away from: `/influencer/*`, `/wholesaler/*`

### Expected Customer Experience
- Clean shopping interface with cart icon
- Search bar in navigation
- Access to all shopping features
- Can view live streams but not create them

---

## 2. **Influencer Experience Test**

### Sign Up as Influencer
1. Go to `/signup`
2. Select "Influencer" role
3. Fill out influencer signup form
4. After signup, you should be redirected to `/influencer/dashboard`
5. You should see the **InfluencerSidebar** with creator tools

### Influencer Navigation Test
- ✅ Should access: `/influencer/dashboard`, `/influencer/live`, `/influencer/analytics`
- ❌ Should be redirected away from: `/home`, `/shop`, `/cart`, `/wholesaler/*`

### Expected Influencer Experience
- Sidebar-based creator studio interface
- Live streaming management tools
- Analytics and earnings sections
- No shopping cart or customer features

### Test Live Streaming Feature
1. Go to `/influencer/live`
2. Enter a stream title and description
3. Click "Go Live" button
4. Should see live streaming interface with viewer count simulation

---

## 3. **Wholesaler Experience Test** (Limited - On Hold)

### Sign Up as Wholesaler
1. Go to `/signup`
2. Select "Wholesaler" role
3. Fill out business signup form
4. After signup, you should be redirected to `/wholesaler/dashboard`
5. You should see placeholder "under development" message

### Wholesaler Navigation Test
- ✅ Should access: `/wholesaler/dashboard`
- ❌ Should be redirected away from: `/home`, `/shop`, `/influencer/*`

---

## 4. **Cross-Role Access Testing**

### Test Role-Based Redirects
1. **Customer** trying to access `/influencer/dashboard` → Should redirect to `/home`
2. **Influencer** trying to access `/home` → Should redirect to `/influencer/dashboard`
3. **Wholesaler** trying to access `/shop` → Should redirect to `/wholesaler/dashboard`

### Test Authentication Redirects
1. **Logged-out user** accessing protected routes → Should redirect to `/login`
2. **Logged-in user** accessing `/login` → Should redirect to their role dashboard

---

## 5. **Login Flow Testing**

### Test Existing Users
1. Go to `/login`
2. Enter credentials for existing customer/influencer/wholesaler
3. Should be redirected to appropriate dashboard based on role

---

## 🐛 Common Issues to Check

### If Redirects Don't Work
- Check browser console for errors
- Verify Supabase connection
- Ensure user profiles are created in role-specific tables

### If Navigation Doesn't Appear
- Check if user role is properly detected
- Verify layout components are imported correctly
- Check for TypeScript compilation errors

### If Routes Are Inaccessible
- Verify `ProtectedRoute` wrapper is working
- Check user authentication state
- Ensure role permissions are correctly configured

---

## 📊 Expected Database Structure

After testing, your Supabase tables should have:

### `customers` table
```sql
user_id | email | first_name | last_name | phone | created_at
```

### `influencers` table
```sql
user_id | email | display_name | first_name | bio | instagram_handle | created_at
```

### `wholesalers` table
```sql
user_id | email | business_name | contact_person_name | phone | created_at
```

---

## 🚀 Success Criteria

### ✅ Customer Test Success
- Can sign up and access shopping features
- Cannot access influencer or wholesaler areas
- Sees appropriate shopping navigation

### ✅ Influencer Test Success
- Can sign up and access creator tools
- Cannot access customer shopping or wholesaler areas
- Sees creator studio sidebar navigation
- Can start live streaming simulation

### ✅ Wholesaler Test Success
- Can sign up and see placeholder dashboard
- Cannot access customer or influencer areas
- Sees "under development" message

### ✅ Security Test Success
- No unauthorized cross-role access
- Proper redirects for protected routes
- Authentication state properly managed

---

## 🔧 Troubleshooting Commands

```bash
# Check for TypeScript errors
npx tsc --noEmit

# Build project to verify no compilation issues
npm run build

# Start development server
npm run dev

# Check Supabase connection
# Go to /supabase-test page to verify database connectivity
```

---

## 📞 Support

If you encounter any issues during testing:
1. Check the browser console for error messages
2. Verify your Supabase configuration
3. Ensure all required tables exist in your database
4. Check that RLS policies allow the operations

The system is designed to be robust and handle edge cases gracefully, so most issues will be related to database setup or configuration.
