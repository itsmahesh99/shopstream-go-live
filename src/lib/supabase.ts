import { createClient } from '@supabase/supabase-js'
import { DatabaseTables } from '@/types/database'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// For development/demo purposes, allow the app to work without Supabase config
let supabase: any

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient<DatabaseTables>(supabaseUrl, supabaseAnonKey)
} else {
  console.warn('Supabase environment variables not found. Running in demo mode.')
  // Create a mock supabase client for demo purposes
  supabase = {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ 
        data: { subscription: { unsubscribe: () => {} } } 
      }),
      signUp: () => Promise.resolve({ data: null, error: { message: 'Demo mode' } }),
      signInWithPassword: () => Promise.resolve({ data: null, error: { message: 'Demo mode' } }),
      signOut: () => Promise.resolve({ error: null }),
      resetPasswordForEmail: () => Promise.resolve({ error: null }),
    },
    from: () => ({
      select: () => ({
        eq: () => ({
          single: () => Promise.resolve({ data: null, error: { message: 'Demo mode' } })
        })
      }),
      insert: () => Promise.resolve({ data: null, error: { message: 'Demo mode' } }),
      update: () => ({
        eq: () => Promise.resolve({ data: null, error: { message: 'Demo mode' } })
      })
    })
  }
}

export { supabase }

// Legacy types for backward compatibility (keep existing Profile type)
export interface Profile {
  id: string
  role: 'user' | 'seller' | 'admin'
  name?: string
  avatar_url?: string
  created_at: string
}

export interface User {
  id: string
  email: string
  created_at: string
}

// Re-export all database types for easy access
export * from '@/types/database'
