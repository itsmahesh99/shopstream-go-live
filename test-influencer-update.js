import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mopimlymdahttwluewpp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1vcGltbHltZGFodHR3bHVld3BwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYzNjQwNjgsImV4cCI6MjA3MTk0MDA2OH0.C6zx7QsPUTfALCOqgth20qvw8M8Af9dgFGPeqIRLPv8';
const supabase = createClient(supabaseUrl, supabaseKey);

async function testInfluencerUpdate() {
  console.log('🧪 Testing influencer profile update...');
  
  try {
    // First, let's create a dummy user session to test with
    // (In production, this would come from actual authentication)
    
    // Check current session
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.log('⚠️  Session error:', sessionError.message);
      return;
    }
    
    if (!sessionData.session) {
      console.log('ℹ️  No user logged in. Please sign in to test profile update.');
      return;
    }
    
    const userId = sessionData.session.user.id;
    console.log('👤 Testing with user ID:', userId);
    
    // First, check if there's an existing influencer profile
    const { data: existingProfile, error: selectError } = await supabase
      .from('influencers')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (selectError && selectError.code !== 'PGRST116') {
      console.error('❌ Error selecting existing profile:', selectError);
      return;
    }
    
    if (!existingProfile) {
      console.log('📝 No existing profile found. Creating a new one first...');
      
      // Create initial profile
      const { data: createData, error: createError } = await supabase
        .from('influencers')
        .insert({
          user_id: userId,
          email: sessionData.session.user.email,
          first_name: 'Test',
          last_name: 'User',
          display_name: 'Test Influencer'
        })
        .select()
        .single();
      
      if (createError) {
        console.error('❌ Error creating profile:', createError);
        return;
      }
      
      console.log('✅ Created initial profile:', createData.id);
    } else {
      console.log('✅ Found existing profile:', existingProfile.id);
    }
    
    // Now test the update that's similar to what the form does
    const testUpdateData = {
      first_name: 'Updated',
      last_name: 'Name',
      display_name: 'Updated Influencer',
      bio: 'This is a test bio for the influencer.',
      category: 'Fashion & Style',
      phone: '+1234567890',
      instagram_handle: '@testuser',
      experience_years: 2,
      followers_count: 1000,
      updated_at: new Date().toISOString()
    };
    
    console.log('🔄 Attempting update with data:', testUpdateData);
    
    const { data: updateData, error: updateError } = await supabase
      .from('influencers')
      .update(testUpdateData)
      .eq('user_id', userId)
      .select();
    
    if (updateError) {
      console.error('❌ Update failed:', updateError);
      console.log('📋 Error details:', {
        code: updateError.code,
        message: updateError.message,
        details: updateError.details,
        hint: updateError.hint
      });
      return;
    }
    
    console.log('✅ Update successful!', updateData);
    
  } catch (err) {
    console.error('❌ Unexpected error:', err);
  }
}

testInfluencerUpdate();
