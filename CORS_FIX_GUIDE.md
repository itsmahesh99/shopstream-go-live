# CORS Fix for Supabase Configuration

## Issue
The CORS error occurs because the Supabase instance is not configured to accept requests from localhost domains during development.

## Solution 1: Update Supabase CORS Settings

### Step 1: Access Supabase Dashboard
1. Go to your Supabase project dashboard
2. Navigate to **Settings** → **API**
3. Look for **CORS Origins** or **Allowed Origins** section

### Step 2: Add Development Origins
Add these origins to your CORS configuration:
```
http://localhost:3000
http://localhost:8080
http://localhost:8081
http://127.0.0.1:3000
http://127.0.0.1:8080
http://127.0.0.1:8081
```

### Step 3: Update Configuration
If using Supabase CLI or config file, update your `supabase/config.toml`:

```toml
[api]
enabled = true
port = 54321
schemas = ["public", "graphql_public"]
extra_search_path = ["public", "extensions"]
max_rows = 1000

[auth]
enabled = true
port = 54324
site_url = "http://localhost:3000"
additional_redirect_urls = [
  "http://localhost:8080", 
  "http://localhost:8081",
  "http://127.0.0.1:8080",
  "http://127.0.0.1:8081"
]
jwt_expiry = 3600
refresh_token_rotation_enabled = true
security_update_password_require_reauthentication = true

[auth.external.apple]
enabled = false
client_id = ""
secret = ""

[auth.external.azure]
enabled = false
client_id = ""
secret = ""
url = ""

[auth.external.bitbucket]
enabled = false
client_id = ""
secret = ""

[auth.external.discord]
enabled = false
client_id = ""
secret = ""

[auth.external.facebook]
enabled = false
client_id = ""
secret = ""

[auth.external.github]
enabled = false
client_id = ""
secret = ""

[auth.external.gitlab]
enabled = false
client_id = ""
secret = ""

[auth.external.google]
enabled = false
client_id = ""
secret = ""

[auth.external.keycloak]
enabled = false
client_id = ""
secret = ""
url = ""

[auth.external.linkedin]
enabled = false
client_id = ""
secret = ""

[auth.external.notion]
enabled = false
client_id = ""
secret = ""

[auth.external.twitch]
enabled = false
client_id = ""
secret = ""

[auth.external.twitter]
enabled = false
client_id = ""
secret = ""

[auth.external.slack]
enabled = false
client_id = ""
secret = ""

[auth.external.spotify]
enabled = false
client_id = ""
secret = ""

[auth.external.workos]
enabled = false
client_id = ""
secret = ""
```

## Solution 2: Update Development Environment Variables

Create a `.env.local` file with the correct configuration:

```bash
# Supabase Configuration for Development
VITE_SUPABASE_URL=http://kein-supabase-3c6399-194-238-19-82.traefik.me
VITE_SUPABASE_ANON_KEY=your_actual_anon_key_here

# Make sure to replace 'your_actual_anon_key_here' with your real anon key
```

## Solution 3: Use Local Supabase (Alternative)

If you have issues with the remote instance, you can run Supabase locally:

```bash
# Install Supabase CLI
npm install -g supabase

# Initialize Supabase in your project
supabase init

# Start local Supabase
supabase start

# This will give you local URLs that won't have CORS issues
```

## Solution 4: Temporary Proxy Fix

If the above solutions don't work immediately, you can use a development proxy to bypass CORS during development.

Add this to your `vite.config.ts`:

```typescript
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/supabase': {
        target: 'http://kein-supabase-3c6399-194-238-19-82.traefik.me',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/supabase/, '')
      }
    }
  }
})
```

Then update your Supabase URL in environment:
```bash
VITE_SUPABASE_URL=http://localhost:8080/supabase
```
