# Supabase Setup Instructions

## Problem Identified
Your current Supabase URL `http://kein-supabase-3c6399-194-238-19-82.traefik.me` appears to be a local development instance that's not responding properly, causing the 500 Internal Server Error.

## Solution: Set up a proper Supabase project

### Option 1: Use Supabase Cloud (Recommended)

1. **Create a Supabase Account**
   - Go to [https://supabase.com](https://supabase.com)
   - Sign up for a free account
   - Create a new project

2. **Get Your Project Credentials**
   - Once your project is created, go to Project Settings > API
   - Copy the following:
     - **Project URL** (something like: `https://your-project-ref.supabase.co`)
     - **Project API Key** (anon/public key)

3. **Update Your .env.local File**
   ```bash
   # Replace with your actual Supabase project credentials
   VITE_SUPABASE_URL=https://your-project-ref.supabase.co
   VITE_SUPABASE_ANON_KEY=your_actual_anon_key_here
   ```

### Option 2: Fix Local Supabase (Advanced)

If you want to continue using local Supabase:

1. **Install Supabase CLI**
   ```bash
   npm install -g supabase
   ```

2. **Start Local Supabase**
   ```bash
   supabase start
   ```

3. **Update .env.local with local credentials**
   ```bash
   VITE_SUPABASE_URL=http://localhost:54321
   VITE_SUPABASE_ANON_KEY=your_local_anon_key
   ```

### Required Database Schema

After setting up Supabase, you'll need to create the profiles table:

```sql
-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'seller', 'admin')),
  name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  PRIMARY KEY (id)
);

-- Set up Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
```

### Test Your Setup

1. Visit `http://localhost:8082/supabase-test` in your browser
2. Click "Test Database Connection" and "Test Auth Endpoint"
3. Try the signup test with a test email

### Next Steps

Once you have valid Supabase credentials:
1. Update your `.env.local` file
2. Restart your development server
3. Test the authentication flow

## Current Status
- ❌ Local Supabase instance not accessible
- ✅ Authentication code is properly implemented
- ✅ Test page created for debugging

## What to do right now:
1. Go to [supabase.com](https://supabase.com) and create a new project
2. Copy the URL and anon key to your `.env.local` file
3. Restart your dev server with `npm run dev`
4. Test at `http://localhost:8082/supabase-test`
