-- Phase 4: Add onboarding tracking + timezone + last_active_at to profiles
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS last_active_at TIMESTAMPTZ DEFAULT now(),
  ADD COLUMN IF NOT EXISTS timezone TEXT DEFAULT 'America/New_York',
  ADD COLUMN IF NOT EXISTS first_briefing_viewed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS first_task_completed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS partner_invited_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS first_mood_checkin_at TIMESTAMPTZ;

-- Index for re-engagement queries (find inactive users)
CREATE INDEX IF NOT EXISTS idx_profiles_last_active
  ON profiles(last_active_at)
  WHERE last_active_at IS NOT NULL;
