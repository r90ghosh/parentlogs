-- Mobile push notification device tokens
-- Separate from push_subscriptions (Web Push VAPID) — different token format

CREATE TABLE device_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  token TEXT NOT NULL,
  platform TEXT NOT NULL CHECK (platform IN ('ios', 'android')),
  device_id TEXT,
  app_version TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, token)
);

CREATE INDEX idx_device_tokens_user ON device_tokens(user_id);
CREATE INDEX idx_device_tokens_active ON device_tokens(user_id, is_active) WHERE is_active = TRUE;

ALTER TABLE device_tokens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own device tokens"
  ON device_tokens FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can insert own device tokens"
  ON device_tokens FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own device tokens"
  ON device_tokens FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Users can delete own device tokens"
  ON device_tokens FOR DELETE USING (user_id = auth.uid());
