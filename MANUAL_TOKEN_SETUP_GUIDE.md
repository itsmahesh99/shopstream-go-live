# Manual HMS Auth Token Setup Guide

## Overview
The admin panel now supports manual input of HMS auth tokens from the 100ms dashboard instead of generating random tokens. This provides real authentication and streaming capabilities.

## How to Set Auth Tokens

### Step 1: Access Admin Panel
1. Login to the admin panel at `http://localhost:8081/admin/login`
2. Use your admin credentials (email, password, and secret key)

### Step 2: Navigate to Influencer Management
1. Go to the "Influencers" tab in the admin panel
2. Find the influencer you want to set a token for
3. Click the "Set Token" or "Update Token" button

### Step 3: Get Token from 100ms Dashboard
1. Open [100ms Dashboard](https://dashboard.100ms.live) in a new tab
2. Navigate to "Roles & Permissions"
3. Create or select a broadcaster role for the influencer
4. Generate an auth token for this specific user
5. Copy the JWT token

### Step 4: Input Token in Admin Panel
1. Paste the JWT token in the "HMS Auth Token" field
2. Optionally set a custom room code (or leave empty for auto-generation)
3. Click "Save Auth Token"

## Token Format
- **Expected Format**: JWT (JSON Web Token) from 100ms
- **Example**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- **Validation**: The system checks if the token starts with "eyJ" (JWT format)

## Features
- **Manual Token Input**: Real HMS auth tokens instead of mock tokens
- **Room Code Management**: Auto-generate or manually set room codes
- **Token Validation**: Basic format validation for JWT tokens
- **Visual Feedback**: Token preview and format indicators
- **Error Handling**: Clear error messages for invalid inputs

## Admin Actions Available
1. **Set Token**: Add HMS auth token for new influencers
2. **Update Token**: Replace existing token with new one
3. **Enable/Disable Streaming**: Control streaming access
4. **View Token Status**: See which influencers have valid tokens

## Token Storage
- Tokens are stored in the `influencers.hms_auth_token` field
- Room codes are stored in `influencers.hms_room_code`
- Token creation timestamp is tracked in `token_created_at`

## Security Notes
- Only admin users can set/update auth tokens
- Tokens are stored securely in the database
- Session validation ensures only authorized admins can access this feature

## Next Steps for Influencers
Once an admin sets the auth token:
1. Influencer can start streaming without manual token input
2. The system automatically uses the stored token
3. Streaming is enabled by default when token is set
4. Influencer just needs to click "Go Live" in their dashboard

## Troubleshooting
- **Invalid Token**: Ensure you copied the complete JWT from 100ms
- **Access Denied**: Verify admin login credentials
- **Token Not Working**: Check if the token is still valid in 100ms dashboard
- **Room Code Issues**: Try leaving room code empty for auto-generation

---

This replaces the previous random token generation with real HMS authentication tokens for actual streaming functionality.
