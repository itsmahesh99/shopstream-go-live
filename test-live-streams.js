// Test script to check live streams in database
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mopimlymdahttwluewpp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1vcGltbHltZGFodHR3bHVld3BwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYzNjQwNjgsImV4cCI6MjA3MTk0MDA2OH0.C6zx7QsPUTfALCOqgth20qvw8M8Af9dgFGPeqIRLPv8';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testLiveStreams() {
  console.log('🔍 Testing live streams database connection...');
  
  try {
    // Test 1: Check if live_sessions_with_influencer view exists
    const { data: viewSessions, error: viewError } = await supabase
      .from('live_sessions_with_influencer')
      .select('*')
      .limit(5);
    
    if (viewError) {
      console.error('❌ Error fetching live_sessions_with_influencer:', viewError.message);
      console.log('💡 This view might not exist yet. Checking base tables...');
      
      // Fallback: Check base tables
      const { data: sessions, error: sessionsError } = await supabase
        .from('live_sessions')
        .select('*')
        .limit(5);
      
      if (sessionsError) {
        const { data: altSessions, error: altError } = await supabase
          .from('live_stream_sessions')
          .select('*')
          .limit(5);
          
        if (altError) {
          console.error('❌ Error fetching live_stream_sessions:', altError.message);
          console.log('💡 Suggestion: Run the database schema first');
          return;
        } else {
          console.log('✅ Found live_stream_sessions table');
          console.log('📊 Sessions found:', altSessions?.length || 0);
        }
      } else {
        console.log('✅ Found live_sessions table');
        console.log('📊 Sessions found:', sessions?.length || 0);
      }
    } else {
      console.log('✅ Found live_sessions_with_influencer view');
      console.log('📊 Sessions with influencer data found:', viewSessions?.length || 0);
      if (viewSessions?.length > 0) {
        console.log('📝 Sample session with influencer:', viewSessions[0]);
      }
    }
    
    // Test 2: Check influencers table
    const { data: influencers, error: influencersError } = await supabase
      .from('influencers')
      .select('id, display_name, email')
      .limit(3);
    
    if (influencersError) {
      console.error('❌ Error fetching influencers:', influencersError.message);
    } else {
      console.log('✅ Found influencers table');
      console.log('👥 Influencers found:', influencers?.length || 0);
      if (influencers?.length > 0) {
        console.log('📝 Sample influencer:', influencers[0]);
      }
    }
    
  } catch (error) {
    console.error('❌ Connection error:', error.message);
  }
}

// Run the test
testLiveStreams();