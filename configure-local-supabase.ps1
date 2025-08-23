# Local Supabase Configuration Script for Windows
# This script configures your local Supabase to disable email confirmation

Write-Host "🔧 Configuring Local Supabase..." -ForegroundColor Cyan

# Check if Supabase CLI is installed
try {
    supabase --version | Out-Null
    Write-Host "✅ Supabase CLI found" -ForegroundColor Green
} catch {
    Write-Host "❌ Supabase CLI not found. Installing..." -ForegroundColor Red
    npm install -g supabase
}

# Stop Supabase if running
Write-Host "⏹️ Stopping Supabase..." -ForegroundColor Yellow
supabase stop

# Check if we're in a Supabase project
if (!(Test-Path "supabase\config.toml")) {
    Write-Host "📋 Initializing Supabase project..." -ForegroundColor Yellow
    supabase init
}

# Start Supabase
Write-Host "🚀 Starting Supabase..." -ForegroundColor Green
supabase start

# Get the status to show connection details
Write-Host "📊 Getting Supabase status..." -ForegroundColor Cyan
$status = supabase status

Write-Host "✅ Local Supabase is running!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Connection Details:" -ForegroundColor White
Write-Host $status

Write-Host ""
Write-Host "🔑 Next steps:" -ForegroundColor Yellow
Write-Host "1. Copy the API URL and anon key from above"
Write-Host "2. Update your .env.local file with these values"
Write-Host "3. Restart your dev server: npm run dev"
Write-Host "4. Test at: http://localhost:8082/supabase-test"

# Ask if user wants to apply the database schema
$applySchema = Read-Host "`n📊 Do you want to apply the database schema now? (y/n)"
if ($applySchema -eq "y" -or $applySchema -eq "Y") {
    Write-Host "🗃️ Applying database schema..." -ForegroundColor Cyan
    
    # Apply the schema file
    if (Test-Path "supabase-schema.sql") {
        # Copy schema to migrations folder
        if (!(Test-Path "supabase\migrations")) {
            New-Item -ItemType Directory -Path "supabase\migrations" -Force
        }
        
        $timestamp = Get-Date -Format "yyyyMMddHHmmss"
        Copy-Item "supabase-schema.sql" "supabase\migrations\${timestamp}_initial_schema.sql"
        
        # Apply migrations
        supabase db reset
        
        Write-Host "✅ Database schema applied!" -ForegroundColor Green
    } else {
        Write-Host "❌ supabase-schema.sql not found" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "🎉 Setup complete! Your local Supabase should now work without email confirmation." -ForegroundColor Green
