import { supabase } from '@/lib/supabase'

export interface TestResult {
  success: boolean
  message: string
  details?: any
  error?: any
}

export async function testSupabaseConnection(): Promise<TestResult> {
  try {
    console.log('🔗 Testing Supabase connection...')
    
    // Test basic connection with a simple query
    const { data, error } = await supabase
      .from('customers')
      .select('count', { count: 'exact', head: true })
    
    if (error) {
      console.error('❌ Connection failed:', error.message)
      
      if (error.message.includes('relation "customers" does not exist')) {
        return {
          success: false,
          message: 'Database schema not yet created',
          details: 'Please run the SQL schema script first (rebuild-database-part1.sql and part2.sql)',
          error: error.message
        }
      }
      
      return {
        success: false,
        message: 'Connection failed',
        error: error.message
      }
    }
    
    console.log('✅ Connection successful!')
    return {
      success: true,
      message: `Connection successful! Found ${data || 0} customers in database`,
      details: { customerCount: data || 0 }
    }
    
  } catch (err: any) {
    console.error('❌ Unexpected error:', err)
    return {
      success: false,
      message: 'Unexpected connection error',
      error: err.message
    }
  }
}

export async function testSupabaseAuth(): Promise<TestResult> {
  try {
    console.log('🔐 Testing Supabase auth...')
    
    // Test 1: Get current session
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
    if (sessionError) {
      console.error('❌ Auth session check failed:', sessionError.message)
      return {
        success: false,
        message: 'Auth session check failed',
        error: sessionError.message
      }
    }
    
    // Test 2: Get current user
    const { data: userData, error: userError } = await supabase.auth.getUser()
    if (userError) {
      console.error('❌ Auth user check failed:', userError.message)
      return {
        success: false,
        message: 'Auth user check failed',
        error: userError.message
      }
    }
    
    console.log('✅ Auth service connected successfully!')
    
    const hasActiveSession = !!sessionData.session
    const currentUser = userData.user
    
    return {
      success: true,
      message: hasActiveSession 
        ? `Auth working! Current user: ${currentUser?.email}` 
        : 'Auth service connected (no active session)',
      details: {
        hasActiveSession,
        userEmail: currentUser?.email,
        userId: currentUser?.id,
        sessionExpiry: sessionData.session?.expires_at
      }
    }
    
  } catch (err: any) {
    console.error('❌ Unexpected auth error:', err)
    return {
      success: false,
      message: 'Unexpected auth error',
      error: err.message
    }
  }
}

export async function testSupabaseStorage(): Promise<TestResult> {
  try {
    console.log('📁 Testing Supabase storage...')
    
    const { data: buckets, error: storageError } = await supabase.storage.listBuckets()
    
    if (storageError) {
      console.log('⚠️  Storage service check failed (this is normal for new projects)')
      return {
        success: false,
        message: 'Storage service not accessible (normal for new projects)',
        error: storageError.message
      }
    }
    
    console.log('✅ Storage service connected successfully!')
    return {
      success: true,
      message: `Storage service connected! Found ${buckets?.length || 0} buckets`,
      details: { buckets: buckets?.map(b => b.name) || [] }
    }
    
  } catch (err: any) {
    console.error('❌ Unexpected storage error:', err)
    return {
      success: false,
      message: 'Unexpected storage error',
      error: err.message
    }
  }
}

export async function testFullSupabaseSetup(): Promise<{
  connection: TestResult
  auth: TestResult
  storage: TestResult
  overall: boolean
}> {
  const connection = await testSupabaseConnection()
  const auth = await testSupabaseAuth()
  const storage = await testSupabaseStorage()
  
  const overall = connection.success && auth.success
  
  return {
    connection,
    auth,
    storage,
    overall
  }
}
