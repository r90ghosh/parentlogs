-- Migration: Capture feedback table with RLS
-- This table was created via Supabase dashboard but never captured in version control.
-- Feedback supports both authenticated and anonymous submissions (user_id nullable).

CREATE TABLE IF NOT EXISTS feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  type TEXT NOT NULL,
  message TEXT NOT NULL,
  page_url TEXT,
  user_agent TEXT,
  user_role TEXT,
  family_stage TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT feedback_type_check CHECK (type IN ('bug', 'feature', 'question', 'other')),
  CONSTRAINT feedback_message_length CHECK (char_length(message) BETWEEN 10 AND 2000)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_feedback_user_id ON feedback(user_id);
CREATE INDEX IF NOT EXISTS idx_feedback_type ON feedback(type);
CREATE INDEX IF NOT EXISTS idx_feedback_created_at ON feedback(created_at);

-- RLS
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- Authenticated users can insert feedback (with their own user_id or null)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'feedback' AND policyname = 'Authenticated users can submit feedback') THEN
    CREATE POLICY "Authenticated users can submit feedback" ON feedback
      FOR INSERT TO authenticated
      WITH CHECK (user_id IS NULL OR user_id = auth.uid());
  END IF;
END $$;

-- Users can read only their own feedback
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'feedback' AND policyname = 'Users can read own feedback') THEN
    CREATE POLICY "Users can read own feedback" ON feedback
      FOR SELECT TO authenticated
      USING (user_id = auth.uid());
  END IF;
END $$;

-- No UPDATE or DELETE for regular users — admin-only via service role

-- Rate limiting: max 5 feedback submissions per user per hour
-- Enforced via a function that checks recent submissions
CREATE OR REPLACE FUNCTION check_feedback_rate_limit()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  recent_count INTEGER;
BEGIN
  IF NEW.user_id IS NOT NULL THEN
    SELECT COUNT(*) INTO recent_count
    FROM public.feedback
    WHERE user_id = NEW.user_id
      AND created_at > now() - interval '1 hour';

    IF recent_count >= 5 THEN
      RAISE EXCEPTION 'Rate limit exceeded: max 5 feedback submissions per hour';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'enforce_feedback_rate_limit'
  ) THEN
    CREATE TRIGGER enforce_feedback_rate_limit
      BEFORE INSERT ON feedback
      FOR EACH ROW EXECUTE FUNCTION check_feedback_rate_limit();
  END IF;
END $$;
