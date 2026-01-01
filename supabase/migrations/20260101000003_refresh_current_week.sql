-- Migration: Refresh current_week for all families
-- The current_week is calculated by a trigger on UPDATE, but it can become stale
-- This migration forces a recalculation

-- Update all families to trigger the current_week recalculation
UPDATE families
SET updated_at = NOW()
WHERE true;

-- Verify the update
DO $$
DECLARE
  f_record RECORD;
BEGIN
  FOR f_record IN
    SELECT id, current_week, due_date, birth_date
    FROM families
  LOOP
    RAISE NOTICE 'Family %: current_week=%, due_date=%', f_record.id, f_record.current_week, f_record.due_date;
  END LOOP;
END $$;
