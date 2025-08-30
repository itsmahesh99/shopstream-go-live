import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mopimlymdahttwluewpp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1vcGltbHltZGFodHR3bHVld3BwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYzNjQwNjgsImV4cCI6MjA3MTk0MDA2OH0.C6zx7QsPUTfALCOqgth20qvw8M8Af9dgFGPeqIRLPv8';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkInfluencerTable() {
  console.log('🔍 Checking influencers table structure...');
  
  try {
    // Check if influencers table exists by trying to select from it
    const { data, error } = await supabase
      .from('influencers')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('❌ Error accessing influencers table:', error.message);
      if (error.code === '42P01') {
        console.log('📝 Table "influencers" does not exist. Please run the database schema.');
      }
      return;
    }
    
    console.log('✅ Influencers table exists');
    console.log('📊 Number of influencers:', data ? data.length : 0);
    
    // Try to get table columns by attempting an insert with invalid data
    try {
      const { error: insertError } = await supabase
        .from('influencers')
        .insert({
          user_id: '00000000-0000-0000-0000-000000000000', // Invalid UUID
          email: 'test@example.com'
        });
      
      if (insertError) {
        console.log('📋 Table schema validation working. Sample error:', insertError.message);
      }
    } catch (e) {
      // Expected to fail, just checking if table accepts inserts
    }
    
  } catch (err) {
    console.error('❌ Unexpected error:', err);
  }
}

async function checkSpecificUser() {
  console.log('\n🔍 Checking for existing influencer profiles...');
  
  try {
    // Get current user session
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.log('ℹ️  No active session found');
      return;
    }
    
    if (!sessionData.session) {
      console.log('ℹ️  No user logged in');
      return;
    }
    
    const userId = sessionData.session.user.id;
    console.log('👤 Current user ID:', userId);
    
    // Check if influencer profile exists for current user
    const { data: influencerData, error: influencerError } = await supabase
      .from('influencers')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (influencerError) {
      if (influencerError.code === 'PGRST116') {
        console.log('📝 No influencer profile found for current user');
      } else {
        console.error('❌ Error checking influencer profile:', influencerError.message);
      }
      return;
    }
    
    console.log('✅ Found influencer profile:', {
      id: influencerData.id,
      email: influencerData.email,
      display_name: influencerData.display_name,
      first_name: influencerData.first_name,
      last_name: influencerData.last_name,
      created_at: influencerData.created_at
    });
    
  } catch (err) {
    console.error('❌ Unexpected error checking user:', err);
  }
}

async function main() {
  await checkInfluencerTable();
  await checkSpecificUser();
}

main();
