-- Track push delivery status for debugging and analytics

CREATE TABLE notification_delivery_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  notification_id UUID REFERENCES notifications(id) ON DELETE SET NULL,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  channel TEXT NOT NULL CHECK (channel IN ('web_push', 'expo_push', 'email')),
  status TEXT NOT NULL CHECK (status IN ('sent', 'delivered', 'failed', 'invalid_token')),
  error_message TEXT,
  token_id UUID,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_delivery_log_user ON notification_delivery_log(user_id);
CREATE INDEX idx_delivery_log_notification ON notification_delivery_log(notification_id);

ALTER TABLE notification_delivery_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own delivery logs"
  ON notification_delivery_log FOR SELECT USING (user_id = auth.uid());
