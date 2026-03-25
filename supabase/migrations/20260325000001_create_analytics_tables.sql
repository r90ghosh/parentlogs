-- Analytics tables for The Dad Center
-- Tracks events and page/screen engagement across web + mobile
-- Data retention: 90-day cleanup should be added via pg_cron later

-- ============================================================================
-- Table: analytics_events
-- ============================================================================
CREATE TABLE analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id TEXT,
  event_name TEXT NOT NULL,
  properties JSONB DEFAULT '{}',
  page_path TEXT,
  platform TEXT NOT NULL DEFAULT 'web' CHECK (platform IN ('web', 'ios', 'android')),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_analytics_events_user_id ON analytics_events(user_id);
CREATE INDEX idx_analytics_events_event_name ON analytics_events(event_name);
CREATE INDEX idx_analytics_events_created_at ON analytics_events(created_at);
CREATE INDEX idx_analytics_events_platform ON analytics_events(platform);

-- ============================================================================
-- Table: page_engagements
-- ============================================================================
CREATE TABLE page_engagements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id TEXT,
  page_path TEXT NOT NULL,
  page_group TEXT NOT NULL,
  duration_seconds INTEGER NOT NULL,
  duration_bucket TEXT NOT NULL CHECK (duration_bucket IN ('<1m', '1-5m', '5-10m', '10+m')),
  platform TEXT NOT NULL DEFAULT 'web' CHECK (platform IN ('web', 'ios', 'android')),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_page_engagements_user_id ON page_engagements(user_id);
CREATE INDEX idx_page_engagements_page_group ON page_engagements(page_group);
CREATE INDEX idx_page_engagements_created_at ON page_engagements(created_at);
CREATE INDEX idx_page_engagements_platform ON page_engagements(platform);

-- ============================================================================
-- RLS: service_role only (clients write via API route, never directly)
-- ============================================================================
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role only" ON analytics_events FOR ALL TO service_role USING (true) WITH CHECK (true);

ALTER TABLE page_engagements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role only" ON page_engagements FOR ALL TO service_role USING (true) WITH CHECK (true);
