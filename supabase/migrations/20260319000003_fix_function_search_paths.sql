-- =====================================================
-- Fix search_path on non-SECURITY-DEFINER functions
-- The security_fixes migration (20260317) already fixed
-- all SECURITY DEFINER functions. This migration fixes
-- the remaining functions that lacked SET search_path.
-- =====================================================

-- =====================================================
-- 1. get_trimester_from_week (from 20250101000001)
--    IMMUTABLE helper, no table access, but best practice
-- =====================================================
CREATE OR REPLACE FUNCTION get_trimester_from_week(pregnancy_week INTEGER)
RETURNS family_stage
LANGUAGE plpgsql
IMMUTABLE
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

-- =====================================================
-- 2. update_family_week_and_stage (from 20250101000001)
--    Trigger on families — qualify table/function refs
-- =====================================================
CREATE OR REPLACE FUNCTION update_family_week_and_stage()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = ''
AS $$
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
    NEW.stage := 'post-birth'::public.family_stage;
  ELSIF NEW.due_date IS NOT NULL AND NEW.stage IN ('pregnancy', 'first-trimester', 'second-trimester', 'third-trimester') THEN
    NEW.stage := public.get_trimester_from_week(NEW.current_week);
  END IF;

  RETURN NEW;
END;
$$;

-- =====================================================
-- 3. calculate_current_week (from 003_functions.sql)
--    STABLE function, no table access
-- =====================================================
CREATE OR REPLACE FUNCTION calculate_current_week(
  p_due_date DATE,
  p_birth_date DATE DEFAULT NULL
)
RETURNS INTEGER
LANGUAGE plpgsql
STABLE
SET search_path = ''
AS $$
DECLARE
  reference_date DATE;
  weeks INTEGER;
BEGIN
  IF p_birth_date IS NOT NULL THEN
    -- Post-birth: weeks since birth
    weeks := EXTRACT(DAYS FROM (CURRENT_DATE - p_birth_date))::INTEGER / 7;
  ELSIF p_due_date IS NOT NULL THEN
    -- Pregnancy: 40 weeks - weeks until due date
    weeks := 40 - (EXTRACT(DAYS FROM (p_due_date - CURRENT_DATE))::INTEGER / 7);
  ELSE
    weeks := 0;
  END IF;

  RETURN GREATEST(0, weeks);
END;
$$;

-- =====================================================
-- 4. update_updated_at_column (from 004_create_articles_videos.sql)
--    Trigger function used by articles and videos tables
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- =====================================================
-- 5. update_updated_at (from 001_initial_schema.sql)
--    Trigger function used by profiles, families,
--    family_tasks, family_budget, subscriptions, etc.
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;
