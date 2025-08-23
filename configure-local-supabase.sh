#!/bin/bash

# Local Supabase Configuration Script
# This script configures your local Supabase to disable email confirmation

echo "🔧 Configuring Local Supabase..."

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found. Installing..."
    npm install -g supabase
fi

# Stop Supabase if running
echo "⏹️ Stopping Supabase..."
supabase stop

# Initialize Supabase in current directory if not already done
if [ ! -f "supabase/config.toml" ]; then
    echo "📋 Initializing Supabase..."
    supabase init
fi

# Copy our configuration
echo "📝 Applying configuration..."
cp supabase/config.toml supabase/config.toml.backup 2>/dev/null || true

# Start Supabase with new configuration
echo "🚀 Starting Supabase..."
supabase start

# Run the database schema
echo "📊 Setting up database schema..."
supabase db reset

# Apply our custom schema
echo "🗃️ Applying custom schema..."
supabase db push

echo "✅ Local Supabase configured successfully!"
echo ""
echo "📋 Your local Supabase is now running with:"
echo "   • Email confirmation: DISABLED"
echo "   • Database URL: http://localhost:54321" 
echo "   • Studio URL: http://localhost:54323"
echo ""
echo "🔑 Update your .env.local with these values:"
echo "   VITE_SUPABASE_URL=http://localhost:54321"
echo "   VITE_SUPABASE_ANON_KEY=[get from supabase status command]"
