-- =====================================================
-- Fix checklist_progress upsert constraint + add missing indexes
-- =====================================================

-- Fix checklist_progress upsert constraint
-- The service uses onConflict: 'family_id,checklist_id,item_id' but the constraint is only on (family_id, item_id)
ALTER TABLE checklist_progress DROP CONSTRAINT IF EXISTS checklist_progress_family_id_item_id_key;
ALTER TABLE checklist_progress ADD CONSTRAINT checklist_progress_family_checklist_item_key
  UNIQUE (family_id, checklist_id, item_id);

-- Add index for mood_checkins dashboard query (user_id + checked_in_at DESC)
CREATE INDEX IF NOT EXISTS idx_mood_checkins_user_date
  ON mood_checkins(user_id, checked_in_at DESC);

-- Add indexes for Stripe webhook lookups on subscriptions
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_customer
  ON subscriptions(stripe_customer_id) WHERE stripe_customer_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_subscription
  ON subscriptions(stripe_subscription_id) WHERE stripe_subscription_id IS NOT NULL;

-- Add index for dad_challenge_content phase queries
CREATE INDEX IF NOT EXISTS idx_dad_challenge_content_phase
  ON dad_challenge_content(phase, sort_order);

-- Add CHECK constraint for subscription status
ALTER TABLE subscriptions DROP CONSTRAINT IF EXISTS chk_subscription_status;
ALTER TABLE subscriptions ADD CONSTRAINT chk_subscription_status
  CHECK (status IN ('active', 'canceled', 'past_due', 'incomplete', 'incomplete_expired', 'trialing', 'unpaid', 'free'));
