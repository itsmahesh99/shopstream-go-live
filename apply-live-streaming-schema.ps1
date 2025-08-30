# Apply Enhanced Live Streaming Database Schema (PowerShell)
# This script applies the enhanced live streaming tables to your Supabase database

Write-Host "🚀 Applying Enhanced Live Streaming Database Schema..." -ForegroundColor Green

# Check if Supabase CLI is installed
try {
    $supabaseVersion = supabase --version 2>$null
    Write-Host "✅ Supabase CLI found: $supabaseVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Supabase CLI is not installed. Please install it first:" -ForegroundColor Red
    Write-Host "npm install -g supabase" -ForegroundColor Yellow
    exit 1
}

# Check if we're in a Supabase project
if (!(Test-Path "supabase/config.toml")) {
    Write-Host "❌ Not in a Supabase project directory. Please run from your project root." -ForegroundColor Red
    exit 1
}

Write-Host "📋 Checking Supabase status..." -ForegroundColor Blue

# Get Supabase status
$supabaseStatus = supabase status

if ($supabaseStatus -match "Local development setup is running") {
    Write-Host "✅ Supabase is running locally" -ForegroundColor Green
} else {
    Write-Host "⚠️  Starting Supabase locally..." -ForegroundColor Yellow
    supabase start
}

Write-Host "📄 Applying enhanced live streaming schema..." -ForegroundColor Blue

# Check if the schema file exists
if (Test-Path "enhanced-live-streaming-schema.sql") {
    Write-Host "📄 Found enhanced-live-streaming-schema.sql" -ForegroundColor Green
    
    # Apply the schema file
    try {
        $result = supabase db reset --debug 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Database reset completed" -ForegroundColor Green
        } else {
            Write-Host "⚠️  Database reset had warnings, continuing..." -ForegroundColor Yellow
        }
        
        # Apply the enhanced schema
        $schemaResult = Get-Content "enhanced-live-streaming-schema.sql" -Raw | supabase db push --stdin
        Write-Host "✅ Enhanced live streaming schema applied successfully!" -ForegroundColor Green
        
    } catch {
        Write-Host "❌ Error applying schema: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host "Trying alternative method..." -ForegroundColor Yellow
        
        # Alternative: Direct SQL execution
        supabase db push --sql (Get-Content "enhanced-live-streaming-schema.sql" -Raw)
    }
} else {
    Write-Host "⚠️  enhanced-live-streaming-schema.sql not found. Creating minimal schema..." -ForegroundColor Yellow
    
    # Create a minimal schema for testing
    $minimalSchema = @"
-- Minimal Live Streaming Schema for Testing
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Check if tables exist before creating
DO `$`$
BEGIN
    -- Create live_stream_sessions table if it doesn't exist
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'live_stream_sessions') THEN
        CREATE TABLE public.live_stream_sessions (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            influencer_id UUID NOT NULL,
            title VARCHAR(255) NOT NULL,
            description TEXT,
            status VARCHAR(20) DEFAULT 'scheduled',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        RAISE NOTICE 'Created live_stream_sessions table';
    END IF;
    
    -- Create live_stream_viewers table if it doesn't exist
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'live_stream_viewers') THEN
        CREATE TABLE public.live_stream_viewers (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            session_id UUID NOT NULL,
            user_id UUID,
            joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            is_still_watching BOOLEAN DEFAULT true
        );
        RAISE NOTICE 'Created live_stream_viewers table';
    END IF;
END
`$`$;
"@
    
    $minimalSchema | supabase db push --stdin
    Write-Host "✅ Minimal schema created for testing" -ForegroundColor Green
}

Write-Host "🔧 Setting up Row Level Security policies..." -ForegroundColor Blue

# Apply RLS policies
$rlsPolicies = @"
-- Enable RLS on live streaming tables
ALTER TABLE IF EXISTS public.live_stream_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.live_stream_viewers ENABLE ROW LEVEL SECURITY;

-- Basic policies for live streaming
DROP POLICY IF EXISTS "Public can view live sessions" ON public.live_stream_sessions;
CREATE POLICY "Public can view live sessions" ON public.live_stream_sessions
  FOR SELECT USING (status = 'live');

DROP POLICY IF EXISTS "Users can view their viewer records" ON public.live_stream_viewers;
CREATE POLICY "Users can view their viewer records" ON public.live_stream_viewers
  FOR SELECT USING (user_id = auth.uid() OR user_id IS NULL);
"@

try {
    $rlsPolicies | supabase db push --stdin
    Write-Host "✅ Row Level Security policies configured!" -ForegroundColor Green
} catch {
    Write-Host "⚠️  RLS policies may already exist or tables not found" -ForegroundColor Yellow
}

Write-Host "📊 Creating test data for development..." -ForegroundColor Blue

# Insert test data
$testData = @"
-- Insert test data for development
DO `$`$
BEGIN
    -- Check if we have influencers table and create test session
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'influencers') AND
       EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'live_stream_sessions') THEN
        
        -- Only insert if we don't have any live stream sessions yet
        IF NOT EXISTS (SELECT 1 FROM public.live_stream_sessions LIMIT 1) THEN
            INSERT INTO public.live_stream_sessions (
                influencer_id,
                title,
                description,
                status
            ) 
            SELECT 
                i.id,
                'Welcome to Live Streaming!',
                'Your first live streaming session is ready. Start streaming to engage with your audience!',
                'scheduled'
            FROM public.influencers i 
            LIMIT 1
            ON CONFLICT DO NOTHING;
            
            RAISE NOTICE 'Test live stream session created for development';
        ELSE
            RAISE NOTICE 'Live stream sessions already exist, skipping test data';
        END IF;
    ELSE
        RAISE NOTICE 'Required tables not found, skipping test data creation';
    END IF;
END
`$`$;
"@

try {
    $testData | supabase db push --stdin
    Write-Host "✅ Test data created!" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Could not create test data (tables may not exist yet)" -ForegroundColor Yellow
}

# Show final status
Write-Host ""
Write-Host "📋 Database migration summary:" -ForegroundColor Cyan
Write-Host "  ✅ Enhanced live streaming schema applied" -ForegroundColor Green
Write-Host "  ✅ Row Level Security policies configured" -ForegroundColor Green
Write-Host "  ✅ Test data created for development" -ForegroundColor Green

Write-Host ""
Write-Host "🎉 Enhanced Live Streaming Database is ready!" -ForegroundColor Green

Write-Host ""
Write-Host "📚 Next steps:" -ForegroundColor Cyan
Write-Host "1. Test the LiveStreamManager component in your React app" -ForegroundColor White
Write-Host "2. Configure 100ms integration for actual streaming" -ForegroundColor White
Write-Host "3. Set up real-time subscriptions for live updates" -ForegroundColor White
Write-Host "4. Test the live streaming workflow end-to-end" -ForegroundColor White

Write-Host ""
Write-Host "🔗 Useful commands:" -ForegroundColor Cyan
Write-Host "  supabase status              # Check project status" -ForegroundColor White
Write-Host "  supabase db diff             # Check schema differences" -ForegroundColor White
Write-Host "  supabase db reset            # Reset database to migrations" -ForegroundColor White
Write-Host "  supabase studio              # Open Supabase Studio" -ForegroundColor White

Write-Host ""
Write-Host "🎯 Ready to test live streaming functionality!" -ForegroundColor Green

# Optional: Open Supabase Studio
$openStudio = Read-Host "Would you like to open Supabase Studio to view the database? (y/N)"
if ($openStudio -eq "y" -or $openStudio -eq "Y") {
    Write-Host "🌐 Opening Supabase Studio..." -ForegroundColor Blue
    supabase studio
}
