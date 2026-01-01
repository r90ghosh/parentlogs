-- Migration: Migrate data to use trimester stages
-- Depends on: 006_trimester_stages.sql (enum values must be committed first)

-- Step 1: Drop ALL triggers on families to prevent errors during UPDATE
DO $$
DECLARE
  trigger_rec RECORD;
BEGIN
  FOR trigger_rec IN
    SELECT tgname FROM pg_trigger t
    JOIN pg_class c ON t.tgrelid = c.oid
    WHERE c.relname = 'families' AND NOT tgisinternal
  LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS %I ON families', trigger_rec.tgname);
  END LOOP;
END $$;

-- Step 2: Create helper function to determine trimester from week number
CREATE OR REPLACE FUNCTION get_trimester_from_week(pregnancy_week INTEGER)
RETURNS family_stage AS $$
BEGIN
  IF pregnancy_week IS NULL OR pregnancy_week <= 0 THEN
    RETURN 'first-trimester'::family_stage;
  ELSIF pregnancy_week <= 13 THEN
    RETURN 'first-trimester'::family_stage;
  ELSIF pregnancy_week <= 27 THEN
    RETURN 'second-trimester'::family_stage;
  ELSE
    RETURN 'third-trimester'::family_stage;
  END IF;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Step 3: Migrate existing families with 'pregnancy' stage to appropriate trimester
-- Using a simple CASE to avoid function call issues
UPDATE families
SET stage = CASE
  WHEN current_week IS NULL OR current_week <= 0 THEN 'first-trimester'::family_stage
  WHEN current_week <= 13 THEN 'first-trimester'::family_stage
  WHEN current_week <= 27 THEN 'second-trimester'::family_stage
  ELSE 'third-trimester'::family_stage
END
WHERE stage = 'pregnancy' AND birth_date IS NULL;

-- Step 4: Migrate task_templates from 'pregnancy' to trimesters based on due_date_offset_days
UPDATE task_templates
SET stage = 'first-trimester'::family_stage
WHERE stage = 'pregnancy'
  AND due_date_offset_days <= -189;

UPDATE task_templates
SET stage = 'second-trimester'::family_stage
WHERE stage = 'pregnancy'
  AND due_date_offset_days > -189
  AND due_date_offset_days <= -84;

UPDATE task_templates
SET stage = 'third-trimester'::family_stage
WHERE stage = 'pregnancy'
  AND due_date_offset_days > -84;

-- Step 5: Migrate briefing_templates from 'pregnancy' to trimesters based on week
UPDATE briefing_templates
SET stage = 'first-trimester'::family_stage
WHERE stage = 'pregnancy' AND week <= 13;

UPDATE briefing_templates
SET stage = 'second-trimester'::family_stage
WHERE stage = 'pregnancy' AND week >= 14 AND week <= 27;

UPDATE briefing_templates
SET stage = 'third-trimester'::family_stage
WHERE stage = 'pregnancy' AND week >= 28;

-- Step 6: Migrate budget_templates from 'pregnancy' to trimesters based on week_end
UPDATE budget_templates
SET stage = 'first-trimester'::family_stage
WHERE stage = 'pregnancy' AND week_end <= 13;

UPDATE budget_templates
SET stage = 'second-trimester'::family_stage
WHERE stage = 'pregnancy' AND week_end >= 14 AND week_end <= 27;

UPDATE budget_templates
SET stage = 'third-trimester'::family_stage
WHERE stage = 'pregnancy' AND week_end >= 28;

-- Step 7: Migrate checklist_templates from 'pregnancy' to trimesters
UPDATE checklist_templates
SET stage = 'first-trimester'::family_stage
WHERE stage = 'pregnancy'
  AND (
    week_relevant LIKE '1-%'
    OR week_relevant LIKE '%-13'
    OR week_relevant IN ('1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13')
  );

UPDATE checklist_templates
SET stage = 'second-trimester'::family_stage
WHERE stage = 'pregnancy'
  AND (
    week_relevant LIKE '14-%'
    OR week_relevant LIKE '%-27'
    OR week_relevant ~ '^(1[4-9]|2[0-7])$'
  );

UPDATE checklist_templates
SET stage = 'third-trimester'::family_stage
WHERE stage = 'pregnancy'
  AND (
    week_relevant LIKE '28-%'
    OR week_relevant LIKE '%-40'
    OR week_relevant ~ '^(2[8-9]|3[0-9]|40)$'
  );

-- Catch any remaining pregnancy entries
UPDATE checklist_templates
SET stage = 'first-trimester'::family_stage
WHERE stage = 'pregnancy';

-- Step 8: Create the trigger function to handle trimester stages
CREATE OR REPLACE FUNCTION update_family_week_and_stage()
RETURNS TRIGGER AS $$
DECLARE
  new_week INTEGER;
BEGIN
  -- Calculate current week if we have a due_date
  IF NEW.due_date IS NOT NULL THEN
    -- Calculate week: 40 - (days until due / 7)
    new_week := 40 - FLOOR((NEW.due_date - CURRENT_DATE)::NUMERIC / 7);
    IF new_week < 1 THEN new_week := 1; END IF;
    IF new_week > 40 THEN new_week := 40; END IF;
    NEW.current_week := new_week;
  END IF;

  -- Determine appropriate stage
  IF NEW.birth_date IS NOT NULL THEN
    NEW.stage := 'post-birth'::family_stage;
  ELSIF NEW.due_date IS NOT NULL AND NEW.stage IN ('pregnancy', 'first-trimester', 'second-trimester', 'third-trimester') THEN
    NEW.stage := get_trimester_from_week(NEW.current_week);
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 9: Recreate the trigger
CREATE TRIGGER update_family_week
  BEFORE INSERT OR UPDATE ON families
  FOR EACH ROW
  EXECUTE FUNCTION update_family_week_and_stage();

COMMENT ON FUNCTION get_trimester_from_week(INTEGER) IS
  'Returns the appropriate pregnancy trimester stage based on week number:
   Week 1-13 = first-trimester, Week 14-27 = second-trimester, Week 28-40 = third-trimester';
