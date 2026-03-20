-- Extend subscriptions table for RevenueCat (mobile IAP) alongside Stripe (web)

ALTER TABLE subscriptions
  ADD COLUMN IF NOT EXISTS revenucat_app_user_id TEXT,
  ADD COLUMN IF NOT EXISTS platform TEXT DEFAULT 'web'
    CHECK (platform IN ('web', 'ios', 'android')),
  ADD COLUMN IF NOT EXISTS store_product_id TEXT,
  ADD COLUMN IF NOT EXISTS store_original_transaction_id TEXT,
  ADD COLUMN IF NOT EXISTS last_verified_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_subscriptions_revenucat
  ON subscriptions(revenucat_app_user_id)
  WHERE revenucat_app_user_id IS NOT NULL;

COMMENT ON COLUMN subscriptions.platform IS 'Where subscription was purchased: web (Stripe), ios/android (RevenueCat)';
COMMENT ON COLUMN subscriptions.store_product_id IS 'App Store or Play Store product ID';
COMMENT ON COLUMN subscriptions.store_original_transaction_id IS 'Original transaction ID for dedup';
