-- Migration: Daily pg_cron to refresh current_week and stage on babies + families
-- Fixes: stale current_week, broken calculate_current_week(), unqualified schema
--        references in all trigger functions, missing trimester progression on babies.

-- Step 1: Fix calculate_current_week() — date minus date returns integer, not interval
CREATE OR REPLACE FUNCTION public.calculate_current_week(p_due_date DATE, p_birth_date DATE DEFAULT NULL)
RETURNS INTEGER
LANGUAGE plpgsql STABLE
SET search_path = ''
AS $$
DECLARE
  weeks INTEGER;
BEGIN
  IF p_birth_date IS NOT NULL THEN
    weeks := (CURRENT_DATE - p_birth_date) / 7;
  ELSIF p_due_date IS NOT NULL THEN
    weeks := 40 - ((p_due_date - CURRENT_DATE) / 7);
  ELSE
    weeks := 0;
  END IF;
  RETURN GREATEST(0, weeks);
END;
$$;

-- Step 2: Fix get_trimester_from_week() — qualify family_stage with public schema
CREATE OR REPLACE FUNCTION public.get_trimester_from_week(pregnancy_week INTEGER)
RETURNS public.family_stage
LANGUAGE plpgsql IMMUTABLE
SET search_path = ''
AS $$
BEGIN
  IF pregnancy_week IS NULL OR pregnancy_week <= 0 THEN
    RETURN 'first-trimester'::public.family_stage;
  ELSIF pregnancy_week <= 13 THEN
    RETURN 'first-trimester'::public.family_stage;
  ELSIF pregnancy_week <= 27 THEN
    RETURN 'second-trimester'::public.family_stage;
  ELSE
    RETURN 'third-trimester'::public.family_stage;
  END IF;
END;
$$;

-- Step 3: Fix update_family_week_and_stage() — qualify all type and function references
CREATE OR REPLACE FUNCTION public.update_family_week_and_stage()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = ''
AS $$
DECLARE
  new_week INTEGER;
BEGIN
  IF NEW.due_date IS NOT NULL THEN
    new_week := 40 - FLOOR((NEW.due_date - CURRENT_DATE)::NUMERIC / 7);
    IF new_week < 1 THEN new_week := 1; END IF;
    IF new_week > 40 THEN new_week := 40; END IF;
    NEW.current_week := new_week;
  END IF;

  IF NEW.birth_date IS NOT NULL THEN
    NEW.stage := 'post-birth'::public.family_stage;
  ELSIF NEW.due_date IS NOT NULL AND NEW.stage IN (
    'pregnancy'::public.family_stage,
    'first-trimester'::public.family_stage,
    'second-trimester'::public.family_stage,
    'third-trimester'::public.family_stage
  ) THEN
    NEW.stage := public.get_trimester_from_week(NEW.current_week);
  END IF;

  RETURN NEW;
END;
$$;

-- Step 4: Fix sync_family_from_primary_baby() — qualify families table
CREATE OR REPLACE FUNCTION public.sync_family_from_primary_baby()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF NEW.sort_order = 0 THEN
    UPDATE public.families
    SET
      baby_name = NEW.baby_name,
      due_date = NEW.due_date,
      birth_date = NEW.birth_date,
      stage = NEW.stage,
      current_week = NEW.current_week,
      updated_at = now()
    WHERE id = NEW.family_id;
  END IF;
  RETURN NEW;
END;
$$;

-- Step 4b: Revoke direct access to sync_family_from_primary_baby (SECURITY DEFINER)
REVOKE ALL ON FUNCTION public.sync_family_from_primary_baby() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.sync_family_from_primary_baby() FROM authenticated;
REVOKE ALL ON FUNCTION public.sync_family_from_primary_baby() FROM anon;

-- Step 5: Fix update_baby_stage() — add trimester progression + qualify references
CREATE OR REPLACE FUNCTION public.update_baby_stage()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  NEW.current_week := public.calculate_current_week(NEW.due_date, NEW.birth_date);

  IF NEW.birth_date IS NOT NULL THEN
    NEW.stage := 'post-birth'::public.family_stage;
  ELSIF NEW.due_date IS NOT NULL AND NEW.stage IN (
    'pregnancy'::public.family_stage,
    'first-trimester'::public.family_stage,
    'second-trimester'::public.family_stage,
    'third-trimester'::public.family_stage
  ) THEN
    NEW.stage := public.get_trimester_from_week(NEW.current_week);
  END IF;

  RETURN NEW;
END;
$$;

-- Step 6: Schedule daily cron job at 3 AM UTC to refresh all babies
-- Chain: update_baby_stage → sync_family_from_primary_baby → update_family_week_and_stage
DO $$ BEGIN
  PERFORM cron.unschedule('refresh-pregnancy-weeks');
EXCEPTION WHEN others THEN NULL;
END $$;

SELECT cron.schedule(
  'refresh-pregnancy-weeks',
  '0 3 * * *',
  $$UPDATE public.babies SET updated_at = NOW() WHERE due_date IS NOT NULL$$
);

-- Step 7: Immediate one-time refresh for all existing babies
UPDATE public.babies SET updated_at = NOW() WHERE due_date IS NOT NULL;
