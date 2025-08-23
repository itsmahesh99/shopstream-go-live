-- Quick fix for local Supabase email confirmation
-- Run this in your local Supabase SQL Editor or psql

-- Method 1: Update auth configuration in the database
UPDATE auth.config 
SET value = 'false' 
WHERE parameter = 'ENABLE_CONFIRMATIONS';

-- Method 2: Insert if the config doesn't exist
INSERT INTO auth.config (parameter, value) 
VALUES ('ENABLE_CONFIRMATIONS', 'false')
ON CONFLICT (parameter) 
DO UPDATE SET value = 'false';

-- Method 3: Also disable secure email changes
INSERT INTO auth.config (parameter, value) 
VALUES ('SECURE_EMAIL_CHANGE_ENABLED', 'false')
ON CONFLICT (parameter) 
DO UPDATE SET value = 'false';

-- Method 4: Set autoconfirm to true
INSERT INTO auth.config (parameter, value) 
VALUES ('MAILER_AUTOCONFIRM', 'true')
ON CONFLICT (parameter) 
DO UPDATE SET value = 'true';

-- Verify the changes
SELECT parameter, value FROM auth.config 
WHERE parameter IN ('ENABLE_CONFIRMATIONS', 'SECURE_EMAIL_CHANGE_ENABLED', 'MAILER_AUTOCONFIRM');
