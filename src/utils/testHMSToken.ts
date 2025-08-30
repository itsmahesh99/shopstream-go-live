// Test script for HMS token edge function
async function testHMSTokenFunction() {
  const supabaseUrl = 'https://mopimlymdahttwluewpp.supabase.co';
  const functionUrl = `${supabaseUrl}/functions/v1/hms-token`;
  
  // Test with a sample room ID (you'll need a real one from 100ms dashboard)
  const testRoomId = '64e1b2c7e4b0b2a1e4d2c3f1'; // Replace with real room ID
  
  try {
    const response = await fetch(functionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({
        room_id: testRoomId,
        role: 'host',
        user_id: 'test-user-123'
      }),
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Edge function working! Token generated:', data.token);
      return data.token;
    } else {
      console.error('❌ Edge function error:', data.error);
      return null;
    }
  } catch (error) {
    console.error('❌ Network error:', error);
    return null;
  }
}

// Export for use in components
export { testHMSTokenFunction };
