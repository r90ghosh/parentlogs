-- Phase 1: Notification Frequency Caps
-- Expand delivery log status CHECK to support throttled/bounced push states
-- Add partial index for efficient frequency cap lookups

-- 1. Expand status CHECK constraint
ALTER TABLE notification_delivery_log
  DROP CONSTRAINT IF EXISTS notification_delivery_log_status_check;
ALTER TABLE notification_delivery_log
  ADD CONSTRAINT notification_delivery_log_status_check
  CHECK (status IN ('sent', 'delivered', 'failed', 'invalid_token', 'throttled', 'bounced'));

-- 2. Partial index for frequency cap queries
-- Only indexes 'sent' pushes — the only rows the cap logic reads
CREATE INDEX IF NOT EXISTS idx_delivery_log_frequency_cap
  ON notification_delivery_log(user_id, created_at DESC)
  WHERE status = 'sent' AND channel IN ('web_push', 'expo_push');
