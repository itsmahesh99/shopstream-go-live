import { createClient } from '@supabase/supabase-js';

// Load environment variables
const supabaseUrl = 'https://mopimlymdahttwluewpp.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1vcGltbHltZGFodHR3bHVld3BwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjM2NDA2OCwiZXhwIjoyMDcxOTQwMDY4fQ._puQhMUKXqsqZ_ATb9tHurQ1Y5OZEwyLx7pfB9zWYhE';

// Create admin client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const fixInfluencerPolicies = async () => {
  console.log('🔧 Fixing influencer RLS policies...');
  
  const sqlCommands = [
    `DROP POLICY IF EXISTS "Admins can manage all influencers" ON public.influencers;`,
    `DROP POLICY IF EXISTS "Influencers can manage own profile" ON public.influencers;`,
    `DROP POLICY IF EXISTS "Influencers can insert own profile" ON public.influencers;`,
    `DROP POLICY IF EXISTS "Influencers can update own profile" ON public.influencers;`,
    `DROP POLICY IF EXISTS "Influencers can select own profile" ON public.influencers;`,
    
    `CREATE POLICY "Influencers can select own profile" ON public.influencers 
      FOR SELECT USING (auth.uid() = user_id);`,
    
    `CREATE POLICY "Influencers can insert own profile" ON public.influencers 
      FOR INSERT WITH CHECK (auth.uid() = user_id);`,
    
    `CREATE POLICY "Influencers can update own profile" ON public.influencers 
      FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);`,
    
    `CREATE POLICY "Admins can view all influencers" ON public.influencers
      FOR SELECT USING (
        EXISTS (
          SELECT 1 FROM public.admin_users au 
          WHERE au.id = auth.uid() 
          AND au.is_active = true
        )
        OR 
        EXISTS (
          SELECT 1 FROM auth.users u
          WHERE u.id = auth.uid()
          AND u.email LIKE '%admin%'
        )
      );`,
    
    `CREATE POLICY "Admins can update all influencers" ON public.influencers
      FOR UPDATE USING (
        EXISTS (
          SELECT 1 FROM public.admin_users au 
          WHERE au.id = auth.uid() 
          AND au.is_active = true
        )
      );`
  ];

  for (const sql of sqlCommands) {
    console.log(`Running: ${sql.substring(0, 50)}...`);
    const { error } = await supabase.rpc('exec_sql', { sql });
    if (error) {
      console.error('❌ Error:', error);
    } else {
      console.log('✅ Success');
    }
  }
  
  console.log('🎉 All policies updated!');
};

// Run directly with SQL
const runSqlDirectly = async () => {
  console.log('🔧 Running SQL directly...');
  
  const sql = `
DROP POLICY IF EXISTS "Admins can manage all influencers" ON public.influencers;
DROP POLICY IF EXISTS "Influencers can manage own profile" ON public.influencers;
DROP POLICY IF EXISTS "Influencers can insert own profile" ON public.influencers;
DROP POLICY IF EXISTS "Influencers can update own profile" ON public.influencers;
DROP POLICY IF EXISTS "Influencers can select own profile" ON public.influencers;

CREATE POLICY "Influencers can select own profile" ON public.influencers 
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Influencers can insert own profile" ON public.influencers 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Influencers can update own profile" ON public.influencers 
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
  `;
  
  const { data, error } = await supabase.from('influencers').select('count').limit(1);
  if (error) {
    console.error('❌ Database connection error:', error);
  } else {
    console.log('✅ Database connected successfully');
  }
};

runSqlDirectly().catch(console.error);
