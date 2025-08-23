// Test script to check Supabase connectivity
import { supabase } from './lib/supabase'

export async function testSupabaseConnection() {
  console.log('🔍 Testing Supabase connection...')
  
  // Test 1: Check if client is initialized
  console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL)
  console.log('Supabase Anon Key exists:', !!import.meta.env.VITE_SUPABASE_ANON_KEY)
  
  try {
    // Test 2: Check if profiles table exists, if not suggest creating it
    const { data, error } = await supabase.from('profiles').select('count').limit(1)
    
    if (error) {
      if (error.message.includes('does not exist')) {
        console.warn('⚠️ Profiles table does not exist. You need to run the database schema.')
        return { 
          success: false, 
          error: 'Profiles table missing. Please run the SQL schema in Supabase.',
          needsSchema: true 
        }
      }
      console.error('❌ Supabase connection failed:', error.message)
      return { success: false, error: error.message }
    }
    
    console.log('✅ Supabase connection successful')
    return { success: true, data }
    
  } catch (err) {
    console.error('❌ Network error:', err)
    return { success: false, error: 'Network connection failed' }
  }
}

export async function testSupabaseAuth() {
  console.log('🔍 Testing Supabase Auth...')
  
  try {
    // Test auth endpoint directly
    const { data, error } = await supabase.auth.getSession()
    
    if (error) {
      console.error('❌ Auth test failed:', error.message)
      return { success: false, error: error.message }
    }
    
    console.log('✅ Auth endpoint accessible')
    return { success: true, session: data.session }
    
  } catch (err) {
    console.error('❌ Auth network error:', err)
    return { success: false, error: 'Auth endpoint unreachable' }
  }
}
