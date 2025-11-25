-- Add message tracking to monitor usage per credit
-- Add message_count column to users table to track messages used in current credit
ALTER TABLE users ADD COLUMN IF NOT EXISTS message_count INTEGER DEFAULT 0;

-- Add comment explaining the system
COMMENT ON COLUMN users.message_count IS 'Number of messages used in the current credit period (resets every 20 messages)';
