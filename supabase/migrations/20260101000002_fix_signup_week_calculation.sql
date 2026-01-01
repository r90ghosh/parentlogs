-- Migration: Fix signup_week calculation based on profile creation date
-- The previous migration set signup_week = current_week, which is incorrect.
-- We need to calculate what week the user was at when they signed up.

-- =====================================================
-- STEP 1: Recalculate signup_week from profile created_at
-- Formula: 40 - ((due_date - created_at::date) / 7)
-- This gives us the pregnancy week when the profile was created
-- =====================================================

UPDATE profiles p
SET signup_week = GREATEST(1, LEAST(40,
  40 - ROUND((f.due_date - p.created_at::date)::numeric / 7)::integer
))
FROM families f
WHERE p.family_id = f.id
  AND f.due_date IS NOT NULL
  AND p.created_at IS NOT NULL;

-- =====================================================
-- STEP 2: Reset is_backlog for all tasks first
-- =====================================================

UPDATE family_tasks
SET is_backlog = false, backlog_status = NULL
WHERE is_backlog = true OR is_backlog IS NULL;

-- =====================================================
-- STEP 3: Re-mark backlog tasks based on corrected signup_week
-- A task is backlog if week_due < signup_week
-- =====================================================

UPDATE family_tasks ft
SET
  is_backlog = true,
  backlog_status = 'pending'
FROM profiles p
WHERE ft.family_id = p.family_id
  AND ft.week_due IS NOT NULL
  AND p.signup_week IS NOT NULL
  AND ft.week_due < p.signup_week
  AND ft.status = 'pending';

-- =====================================================
-- STEP 4: Debug info
-- =====================================================

DO $$
DECLARE
  p_record RECORD;
  backlog_count integer;
  active_week12 integer;
BEGIN
  FOR p_record IN
    SELECT p.id, p.signup_week, f.current_week, f.due_date, p.created_at::date as signup_date
    FROM profiles p
    JOIN families f ON p.family_id = f.id
    WHERE p.family_id IS NOT NULL
  LOOP
    RAISE NOTICE 'Profile: signup_week=%, current_week=%, due_date=%, signup_date=%',
      p_record.signup_week, p_record.current_week, p_record.due_date, p_record.signup_date;
  END LOOP;

  SELECT COUNT(*) INTO backlog_count
  FROM family_tasks
  WHERE is_backlog = true AND backlog_status = 'pending';

  SELECT COUNT(*) INTO active_week12
  FROM family_tasks
  WHERE is_backlog = false AND week_due = 12 AND status = 'pending';

  RAISE NOTICE 'Backlog tasks pending triage: %', backlog_count;
  RAISE NOTICE 'Active tasks with week_due=12: %', active_week12;
END $$;
