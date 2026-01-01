-- Migration: Fix existing data for catch-up system
-- This updates existing profiles and tasks to properly set backlog flags

-- =====================================================
-- STEP 1: Set signup_week for existing profiles
-- Calculate from current_week: if current_week is 12, and data was created X days ago,
-- we can estimate signup_week. For simplicity, use current_week as signup_week.
-- =====================================================

UPDATE profiles p
SET signup_week = f.current_week
FROM families f
WHERE p.family_id = f.id
  AND p.signup_week IS NULL
  AND f.current_week IS NOT NULL;

-- =====================================================
-- STEP 2: Update week_due for existing family_tasks
-- Calculate from due_date and family's due_date
-- week_due = 40 - (family_due_date - task_due_date) / 7
-- =====================================================

UPDATE family_tasks ft
SET week_due = 40 - ROUND((f.due_date - ft.due_date)::numeric / 7)::integer
FROM families f
WHERE ft.family_id = f.id
  AND ft.week_due IS NULL
  AND ft.due_date IS NOT NULL
  AND f.due_date IS NOT NULL;

-- =====================================================
-- STEP 3: Mark backlog tasks for users who joined late
-- A task is backlog if its week_due < signup_week
-- =====================================================

-- First, mark tasks as backlog where week_due < signup_week
UPDATE family_tasks ft
SET
  is_backlog = true,
  backlog_status = 'pending'
FROM profiles p
WHERE ft.family_id = p.family_id
  AND ft.week_due IS NOT NULL
  AND p.signup_week IS NOT NULL
  AND ft.week_due < p.signup_week
  AND ft.is_backlog IS NOT true
  AND ft.status = 'pending';

-- =====================================================
-- STEP 4: Ensure non-backlog tasks have is_backlog = false
-- =====================================================

UPDATE family_tasks
SET is_backlog = false
WHERE is_backlog IS NULL
  AND week_due IS NOT NULL;

-- =====================================================
-- STEP 5: Debug info - output counts for verification
-- =====================================================

DO $$
DECLARE
  profiles_updated integer;
  tasks_with_week integer;
  backlog_tasks integer;
BEGIN
  SELECT COUNT(*) INTO profiles_updated FROM profiles WHERE signup_week IS NOT NULL;
  SELECT COUNT(*) INTO tasks_with_week FROM family_tasks WHERE week_due IS NOT NULL;
  SELECT COUNT(*) INTO backlog_tasks FROM family_tasks WHERE is_backlog = true AND backlog_status = 'pending';

  RAISE NOTICE 'Profiles with signup_week: %', profiles_updated;
  RAISE NOTICE 'Tasks with week_due: %', tasks_with_week;
  RAISE NOTICE 'Backlog tasks pending triage: %', backlog_tasks;
END $$;
