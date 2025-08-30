import { createClient } from '@supabase/supabase-js';

// Test connection to new Supabase instance
const supabaseUrl = 'https://mopimlymdahttwluewpp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1vcGltbHltZGFodHR3bHVld3BwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYzNjQwNjgsImV4cCI6MjA3MTk0MDA2OH0.C6zx7QsPUTfALCOqgth20qvw8M8Af9dgFGPeqIRLPv8';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  console.log('🔗 Testing Supabase connection...');
  
  try {
    // Test 1: Basic connection
    const { data, error } = await supabase.from('customers').select('count', { count: 'exact', head: true });
    
    if (error) {
      console.error('❌ Connection failed:', error.message);
      if (error.message.includes('relation "customers" does not exist')) {
        console.log('ℹ️  Database schema not yet created. Please run the SQL schema script first.');
      }
    } else {
      console.log('✅ Connection successful!');
      console.log(`📊 Found ${data} customers in database`);
    }
    
    // Test 2: Auth connection
    const { data: authData, error: authError } = await supabase.auth.getSession();
    if (authError) {
      console.error('❌ Auth connection failed:', authError.message);
    } else {
      console.log('✅ Auth service connected successfully!');
    }
    
    // Test 3: Storage connection
    const { data: buckets, error: storageError } = await supabase.storage.listBuckets();
    if (storageError) {
      console.log('⚠️  Storage service check failed (this is normal for new projects)');
    } else {
      console.log('✅ Storage service connected successfully!');
    }
    
  } catch (err) {
    console.error('❌ Unexpected error:', err);
  }
}

// Run the test if this file is executed directly
if (typeof window === 'undefined') {
  testConnection();
}

export { testConnection, supabase };
