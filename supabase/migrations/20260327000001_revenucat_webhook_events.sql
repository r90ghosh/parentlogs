-- RevenueCat webhook event deduplication table (mirrors stripe_webhook_events)
CREATE TABLE IF NOT EXISTS revenucat_webhook_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id TEXT NOT NULL UNIQUE,
  event_type TEXT NOT NULL,
  processed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for fast lookups
CREATE INDEX idx_revenucat_webhook_events_event_id ON revenucat_webhook_events(event_id);

-- Auto-cleanup: events older than 30 days (RevenueCat retries within hours, so 30 is safe)
CREATE INDEX idx_revenucat_webhook_events_created_at ON revenucat_webhook_events(created_at);

-- RLS: Only service role should access this table
ALTER TABLE revenucat_webhook_events ENABLE ROW LEVEL SECURITY;
-- No policies = no access for anon/authenticated, only service_role bypasses RLS
