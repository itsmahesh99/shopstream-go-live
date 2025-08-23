# Supabase Authentication Setup - Complete Guide

This guide explains how to configure and use Supabase authentication in your Kein Shopstream application.

## 🚀 Quick Setup

### 1. Environment Configuration

1. Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```

2. Get your Supabase credentials:
   - Go to your Supabase project dashboard
   - Navigate to Settings > API
   - Copy your Project URL and anon/public key

3. Update `.env.local` with your actual values:
   ```env
   VITE_SUPABASE_URL=http://kein-supabase-3c6399-194-238-19-82.traefik.me
   VITE_SUPABASE_ANON_KEY=your_actual_supabase_anon_key_here
   ```

### 2. Database Setup

Make sure your Supabase database has the required tables. Run the SQL from `docs/supabase-setup.md`:

1. **Profiles table** - extends auth.users with app-specific data
2. **RLS policies** - secure access to user data
3. **Storage buckets** - for avatars and media

## 🔑 Authentication Features

### Implemented Features

✅ **Email/Password Authentication**
- User registration with email verification
- Secure login/logout
- Password reset functionality

✅ **Magic Link Authentication**
- Passwordless login via email
- One-click authentication
- Secure token-based access

✅ **User Management**
- Automatic profile creation on signup
- Profile management and updates
- User session management
- Get current user information
- Update user email/password/metadata

✅ **Protected Routes**
- Automatic redirects for authenticated/unauthenticated users
- Loading states during authentication checks
- Return URL handling after login

✅ **UI Integration**
- Updated login/signup pages with real authentication
- Magic link login option
- Account settings page for user management
- Navbar shows user info and logout option
- Profile page displays user data from Supabase
- Demo page showing all auth methods

### Security Features

🔒 **Row Level Security (RLS)**
- Users can only access their own data
- Secure API calls with automatic user context
- Database-level security policies

🔒 **JWT Token Management**
- Automatic token refresh
- Secure session handling
- Client-side authentication state

## 📱 How to Use

### For Users

1. **Sign Up**: Navigate to `/signup` and create an account
2. **Email Verification**: Check email for verification link
3. **Sign In**: Use `/login` to access your account
4. **Magic Link**: Try `/magic-link` for passwordless login
5. **Account Management**: Visit `/account-settings` to update your details
6. **Profile**: View and edit your profile at `/profile`
7. **Demo**: Test all auth features at `/auth-demo`
8. **Sign Out**: Use the logout button in the navbar

### For Developers

#### Using the Auth Context

```tsx
import { useAuth } from '@/contexts/AuthContext'

function MyComponent() {
  const { 
    user, 
    profile, 
    signIn, 
    signInWithMagicLink, 
    signOut, 
    updateUser, 
    getUser, 
    loading 
  } = useAuth()
  
  if (loading) return <div>Loading...</div>
  
  if (!user) {
    return (
      <div>
        <button onClick={() => signIn(email, password)}>Sign In</button>
        <button onClick={() => signInWithMagicLink(email)}>Magic Link</button>
      </div>
    )
  }
  
  return (
    <div>
      <p>Welcome, {profile?.name || user.email}!</p>
      <button onClick={() => updateUser({ data: { theme: 'dark' } })}>
        Update Preferences
      </button>
      <button onClick={signOut}>Sign Out</button>
    </div>
  )
}
```

#### Protected Routes

```tsx
import ProtectedRoute from '@/components/common/ProtectedRoute'

// Require authentication
<ProtectedRoute>
  <SecretComponent />
</ProtectedRoute>

// Redirect authenticated users away
<ProtectedRoute requireAuth={false}>
  <LoginPage />
</ProtectedRoute>
```

#### Making Authenticated API Calls

```tsx
import { supabase } from '@/lib/supabase'

// User data is automatically included in queries
const { data } = await supabase
  .from('user_orders')
  .select('*')
  // RLS policies ensure users only see their own orders
```

## 🔧 API Reference

### Auth Context Methods

| Method | Description | Parameters | Returns |
|--------|-------------|------------|---------|
| `signUp` | Register new user | `email, password, metadata?` | `{ error }` |
| `signIn` | Sign in user | `email, password` | `{ error }` |
| `signInWithMagicLink` | Send magic link | `email` | `{ error }` |
| `signOut` | Sign out user | none | `{ error }` |
| `resetPassword` | Send reset email | `email` | `{ error }` |
| `updateUser` | Update user account | `{ email?, password?, data? }` | `{ error }` |
| `updateProfile` | Update user profile | `updates: Partial<Profile>` | `{ error }` |
| `getUser` | Get current user | none | `{ user, error }` |

### Auth Context State

| Property | Type | Description |
|----------|------|-------------|
| `user` | `User \| null` | Current authenticated user |
| `profile` | `Profile \| null` | User profile data |
| `session` | `Session \| null` | Current session |
| `loading` | `boolean` | Authentication loading state |

## 🐛 Troubleshooting

### Common Issues

**1. "Missing Supabase environment variables"**
- Check that `.env.local` exists and has the correct keys
- Restart the dev server after adding environment variables

**2. "User not found" or login fails**
- Verify email is confirmed (check spam folder)
- Ensure Supabase Auth is enabled in your project
- Check if email confirmation is required in Supabase settings

**3. "Profile not found"**
- Profile should be created automatically on signup
- Check if the profiles table exists and has proper RLS policies
- Verify the profile creation trigger is working

**4. Pages not protecting properly**
- Ensure components are wrapped with `ProtectedRoute`
- Check that `AuthProvider` is at the root of your app
- Verify routes are configured correctly in `App.tsx`

### Debugging Tips

1. **Check browser dev tools** for network errors
2. **Monitor Supabase logs** in the dashboard
3. **Verify RLS policies** are not blocking queries
4. **Test authentication** in Supabase dashboard directly

## 🚀 Next Steps

### Immediate Improvements

1. **Social Login**: Add Google/Facebook OAuth
2. **Phone Authentication**: SMS-based signup
3. **Multi-factor Authentication**: Extra security layer
4. **Profile Pictures**: Upload and manage avatars

### Integration with Backend

1. **Cart Persistence**: Save cart data per user
2. **Order History**: Link orders to user accounts
3. **Seller Dashboard**: Role-based access control
4. **Live Chat**: User identification in streams

## 📚 Additional Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [React Query + Supabase](https://supabase.com/docs/guides/getting-started/tutorials/with-react)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)

---

**Note**: Remember to never commit your `.env.local` file to version control. The `.gitignore` file is already configured to exclude it.

For questions or issues, refer to the Supabase documentation or create an issue in the project repository.
