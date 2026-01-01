-- Migration: Add catch-up system for late signups
-- Allows users who sign up mid-pregnancy to triage past tasks

-- =====================================================
-- STEP 1: Add missing columns to profiles
-- =====================================================

-- Track which week the user signed up (for catch-up calculation)
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS signup_week INTEGER;

COMMENT ON COLUMN profiles.signup_week IS 'The pregnancy week when user signed up, used to determine backlog tasks';

-- =====================================================
-- STEP 2: Add missing columns to task_templates
-- =====================================================

-- Week number (1-40 for pregnancy) - more intuitive than offset
ALTER TABLE task_templates
ADD COLUMN IF NOT EXISTS week INTEGER;

-- For identifying time-sensitive tasks (medical appointments with narrow windows)
ALTER TABLE task_templates
ADD COLUMN IF NOT EXISTS is_time_sensitive BOOLEAN DEFAULT false;

-- How many weeks after the due week is this task still relevant
ALTER TABLE task_templates
ADD COLUMN IF NOT EXISTS window_weeks INTEGER DEFAULT 4;

-- Tasks that most people complete early (likely already done)
ALTER TABLE task_templates
ADD COLUMN IF NOT EXISTS commonly_completed_early BOOLEAN DEFAULT false;

-- Explanation of why this task matters (for context in UI)
ALTER TABLE task_templates
ADD COLUMN IF NOT EXISTS why_it_matters TEXT;

COMMENT ON COLUMN task_templates.week IS 'Pregnancy week (1-40) when this task is due';
COMMENT ON COLUMN task_templates.is_time_sensitive IS 'True for medical appointments with narrow timing windows';
COMMENT ON COLUMN task_templates.window_weeks IS 'Number of weeks after due date the task is still relevant';
COMMENT ON COLUMN task_templates.commonly_completed_early IS 'True if most users complete this in early pregnancy';
COMMENT ON COLUMN task_templates.why_it_matters IS 'Explanation shown to users about task importance';

-- =====================================================
-- STEP 3: Add missing columns to family_tasks
-- =====================================================

-- Track which pregnancy week this task was due
ALTER TABLE family_tasks
ADD COLUMN IF NOT EXISTS week_due INTEGER;

-- Mark tasks as backlog (from before signup week)
ALTER TABLE family_tasks
ADD COLUMN IF NOT EXISTS is_backlog BOOLEAN DEFAULT false;

-- Status of backlog task: 'pending' (needs triage) or 'triaged' (user reviewed)
ALTER TABLE family_tasks
ADD COLUMN IF NOT EXISTS backlog_status TEXT;

-- What action did user take: 'completed', 'added', or 'skipped'
ALTER TABLE family_tasks
ADD COLUMN IF NOT EXISTS triage_action TEXT;

-- When was the task triaged
ALTER TABLE family_tasks
ADD COLUMN IF NOT EXISTS triage_date TIMESTAMPTZ;

-- Why this task matters (copied from template or custom)
ALTER TABLE family_tasks
ADD COLUMN IF NOT EXISTS why_it_matters TEXT;

COMMENT ON COLUMN family_tasks.week_due IS 'Pregnancy week (1-40) when this task is due';
COMMENT ON COLUMN family_tasks.is_backlog IS 'True if task was from before user signup week';
COMMENT ON COLUMN family_tasks.backlog_status IS 'pending = needs triage, triaged = user reviewed';
COMMENT ON COLUMN family_tasks.triage_action IS 'completed = already did, added = add to list, skipped = not doing';
COMMENT ON COLUMN family_tasks.triage_date IS 'When the user triaged this backlog task';
COMMENT ON COLUMN family_tasks.why_it_matters IS 'Explanation of task importance for user context';

-- =====================================================
-- STEP 4: Add indexes for catch-up queries
-- =====================================================

-- Index for finding backlog tasks needing triage
CREATE INDEX IF NOT EXISTS idx_family_tasks_backlog
ON family_tasks(family_id, is_backlog, backlog_status)
WHERE is_backlog = true;

-- Index for week-based queries
CREATE INDEX IF NOT EXISTS idx_family_tasks_week_due
ON family_tasks(family_id, week_due);

-- Index for finding tasks by status efficiently
CREATE INDEX IF NOT EXISTS idx_family_tasks_family_status
ON family_tasks(family_id, status);

-- =====================================================
-- STEP 5: Add check constraints for valid values
-- =====================================================

-- Ensure backlog_status is valid
ALTER TABLE family_tasks
DROP CONSTRAINT IF EXISTS chk_backlog_status;

ALTER TABLE family_tasks
ADD CONSTRAINT chk_backlog_status
CHECK (backlog_status IS NULL OR backlog_status IN ('pending', 'triaged'));

-- Ensure triage_action is valid
ALTER TABLE family_tasks
DROP CONSTRAINT IF EXISTS chk_triage_action;

ALTER TABLE family_tasks
ADD CONSTRAINT chk_triage_action
CHECK (triage_action IS NULL OR triage_action IN ('completed', 'added', 'skipped'));

-- =====================================================
-- STEP 6: Update week column from due_date_offset_days
-- =====================================================

-- Calculate week from offset: week = 40 - (offset / 7)
-- Example: offset -84 days = 12 weeks before due = week 28
UPDATE task_templates
SET week = 40 - (due_date_offset_days / 7)
WHERE week IS NULL AND due_date_offset_days IS NOT NULL;

-- =====================================================
-- STEP 7: Mark time-sensitive medical tasks
-- =====================================================

-- Time-sensitive medical appointments with small windows
UPDATE task_templates
SET is_time_sensitive = true, window_weeks = 2
WHERE (
  title ILIKE '%12-week%'
  OR title ILIKE '%nuchal%'
  OR title ILIKE '%NIPT%'
  OR title ILIKE '%first trimester screen%'
  OR title ILIKE '%anatomy scan%'
  OR title ILIKE '%20-week%'
  OR title ILIKE '%glucose%'
  OR title ILIKE '%GBS%'
  OR title ILIKE '%tdap%'
  OR title ILIKE '%group b strep%'
  OR title ILIKE '%gestational diabetes%'
)
AND is_time_sensitive IS NOT true;

-- Mark tasks commonly completed early
UPDATE task_templates
SET commonly_completed_early = true
WHERE (
  title ILIKE '%prenatal vitamin%'
  OR title ILIKE '%find ob%'
  OR title ILIKE '%choose provider%'
  OR title ILIKE '%confirm pregnancy%'
  OR title ILIKE '%first appointment%'
  OR title ILIKE '%tell partner%'
  OR title ILIKE '%find midwife%'
  OR title ILIKE '%find doctor%'
  OR title ILIKE '%pregnancy test%'
)
AND commonly_completed_early IS NOT true;

-- Set reasonable windows for different categories
UPDATE task_templates SET window_weeks = 4
WHERE category = 'medical' AND NOT COALESCE(is_time_sensitive, false)
AND window_weeks IS NULL;

UPDATE task_templates SET window_weeks = 8
WHERE category = 'planning' AND window_weeks IS NULL;

UPDATE task_templates SET window_weeks = 12
WHERE category = 'shopping' AND window_weeks IS NULL;

UPDATE task_templates SET window_weeks = 99
WHERE category = 'partner' AND window_weeks IS NULL; -- Always relevant

UPDATE task_templates SET window_weeks = 99
WHERE category = 'self_care' AND window_weeks IS NULL; -- Always relevant

-- =====================================================
-- STEP 8: Create or replace helper function
-- =====================================================

-- Function to initialize family tasks with catch-up handling
CREATE OR REPLACE FUNCTION initialize_family_tasks_with_catchup(
  p_family_id UUID,
  p_due_date DATE,
  p_signup_week INTEGER
)
RETURNS INTEGER AS $$
DECLARE
  task_record RECORD;
  tasks_created INTEGER := 0;
  task_due_date DATE;
  task_week INTEGER;
  task_is_backlog BOOLEAN;
BEGIN
  FOR task_record IN
    SELECT * FROM task_templates
    WHERE stage IN ('pregnancy', 'first-trimester', 'second-trimester', 'third-trimester')
    ORDER BY COALESCE(week, 40 - (due_date_offset_days / 7)), sort_order
  LOOP
    -- Calculate week from offset if not set
    task_week := COALESCE(task_record.week, 40 - (task_record.due_date_offset_days / 7));

    -- Calculate due date: due_date - (40 - week) weeks
    task_due_date := p_due_date - ((40 - task_week) * 7);

    -- Mark as backlog if before signup week
    task_is_backlog := task_week < p_signup_week;

    -- Skip if task already exists for this family
    IF NOT EXISTS (
      SELECT 1 FROM family_tasks
      WHERE family_id = p_family_id
      AND task_template_id = task_record.task_id
    ) THEN
      INSERT INTO family_tasks (
        family_id,
        task_template_id,
        title,
        description,
        why_it_matters,
        due_date,
        week_due,
        assigned_to,
        category,
        priority,
        time_estimate_minutes,
        is_backlog,
        backlog_status,
        status
      ) VALUES (
        p_family_id,
        task_record.task_id,
        task_record.title,
        task_record.description,
        task_record.why_it_matters,
        task_due_date,
        task_week,
        task_record.default_assignee,
        task_record.category,
        task_record.priority,
        task_record.time_estimate_minutes,
        task_is_backlog,
        CASE WHEN task_is_backlog THEN 'pending' ELSE NULL END,
        'pending'
      );

      tasks_created := tasks_created + 1;
    END IF;
  END LOOP;

  RETURN tasks_created;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION initialize_family_tasks_with_catchup IS 'Creates family tasks from templates, marking pre-signup tasks as backlog';
