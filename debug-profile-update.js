import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mopimlymdahttwluewpp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1vcGltbHltZGFodHR3bHVld3BwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYzNjQwNjgsImV4cCI6MjA3MTk0MDA2OH0.C6zx7QsPUTfALCOqgth20qvw8M8Af9dgFGPeqIRLPv8';
const supabase = createClient(supabaseUrl, supabaseKey);

async function debugInfluencerProfile() {
  console.log('🔍 Debugging influencer profile update issue...\n');
  
  try {
    // Check session
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !sessionData.session) {
      console.log('❌ No active session. Please log in first.');
      console.log('Visit your app and sign in, then run this script again.');
      return;
    }
    
    const userId = sessionData.session.user.id;
    const userEmail = sessionData.session.user.email;
    console.log('✅ Session found:');
    console.log('   User ID:', userId);
    console.log('   Email:', userEmail);
    console.log('');
    
    // Check if influencer profile exists
    console.log('🔍 Checking existing influencer profile...');
    const { data: existingProfile, error: selectError } = await supabase
      .from('influencers')
      .select('*')
      .eq('user_id', userId);
    
    if (selectError) {
      console.error('❌ Error selecting profile:', selectError);
      return;
    }
    
    if (!existingProfile || existingProfile.length === 0) {
      console.log('📝 No existing profile found. Creating initial profile...');
      
      // Create minimal profile first
      const { data: createData, error: createError } = await supabase
        .from('influencers')
        .insert({
          user_id: userId,
          email: userEmail,
          first_name: '',
          last_name: '',
          display_name: ''
        })
        .select()
        .single();
      
      if (createError) {
        console.error('❌ Error creating initial profile:', createError);
        console.log('This might be due to:');
        console.log('- RLS policies not allowing insert');
        console.log('- Missing required fields');
        console.log('- Constraint violations');
        return;
      }
      
      console.log('✅ Initial profile created:', createData.id);
    } else {
      console.log('✅ Found existing profile:', existingProfile[0].id);
      console.log('   Current data:', {
        first_name: existingProfile[0].first_name,
        last_name: existingProfile[0].last_name,
        display_name: existingProfile[0].display_name,
        bio: existingProfile[0].bio ? 'Has bio' : 'No bio'
      });
    }
    
    console.log('');
    
    // Test the exact update that's failing
    console.log('🧪 Testing profile update with sample data...');
    
    const testUpdateData = {
      first_name: 'Test',
      last_name: 'User',
      display_name: 'Test Influencer',
      phone: '+1234567890',
      bio: 'This is a test bio for debugging purposes.',
      category: 'Fashion & Style',
      instagram_handle: '@testuser',
      youtube_channel: null,
      tiktok_handle: null,
      experience_years: 2,
      followers_count: 1000,
      updated_at: new Date().toISOString()
    };
    
    console.log('Update data:', testUpdateData);
    console.log('');
    
    // Attempt the update using the same method as the app
    const { data: updateData, error: updateError } = await supabase
      .from('influencers')
      .update(testUpdateData)
      .eq('user_id', userId)
      .select('*')
      .single();
    
    if (updateError) {
      console.error('❌ Update failed with error:', updateError);
      console.log('');
      console.log('📋 Error analysis:');
      console.log('   Code:', updateError.code);
      console.log('   Message:', updateError.message);
      console.log('   Details:', updateError.details);
      console.log('   Hint:', updateError.hint);
      
      // Provide specific solutions based on error
      if (updateError.code === 'PGRST116') {
        console.log('');
        console.log('💡 Solution: No rows found to update.');
        console.log('   This means the profile doesn\'t exist. Run the script again to create it.');
      } else if (updateError.message.includes('violates row-level security')) {
        console.log('');
        console.log('💡 Solution: RLS policy issue.');
        console.log('   Check that the RLS policies allow the current user to update their profile.');
      } else if (updateError.message.includes('violates check constraint')) {
        console.log('');
        console.log('💡 Solution: Data validation issue.');
        console.log('   Check that all values meet the database constraints.');
      }
      
      return;
    }
    
    console.log('✅ Update successful!');
    console.log('Updated profile:', {
      id: updateData.id,
      first_name: updateData.first_name,
      last_name: updateData.last_name,
      display_name: updateData.display_name,
      category: updateData.category
    });
    
    console.log('');
    console.log('🎉 The profile update is working correctly!');
    console.log('   If you\'re still getting errors in the app, check:');
    console.log('   1. Network connectivity');
    console.log('   2. Form validation');
    console.log('   3. Data being sent from the form');
    
  } catch (err) {
    console.error('❌ Unexpected error:', err);
  }
}

debugInfluencerProfile();
