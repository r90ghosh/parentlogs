-- Fix: family-level trigger was always using pregnancy formula (clamped 1-40),
-- ignoring birth_date. Post-birth families had current_week stuck at 40.
-- Now checks birth_date first and uses (today - birth_date) / 7 for post-birth.

CREATE OR REPLACE FUNCTION public.update_family_week_and_stage()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
DECLARE
  new_week INTEGER;
BEGIN
  IF NEW.birth_date IS NOT NULL THEN
    new_week := (CURRENT_DATE - NEW.birth_date) / 7;
    NEW.current_week := GREATEST(0, new_week);
    NEW.stage := 'post-birth'::public.family_stage;
  ELSIF NEW.due_date IS NOT NULL THEN
    new_week := 40 - FLOOR((NEW.due_date - CURRENT_DATE)::NUMERIC / 7);
    IF new_week < 0 THEN new_week := 0; END IF;
    IF new_week > 40 THEN new_week := 40; END IF;
    NEW.current_week := new_week;
    IF NEW.stage IN (
      'pregnancy'::public.family_stage,
      'first-trimester'::public.family_stage,
      'second-trimester'::public.family_stage,
      'third-trimester'::public.family_stage
    ) THEN
      NEW.stage := public.get_trimester_from_week(NEW.current_week);
    END IF;
  END IF;

  RETURN NEW;
END;
$function$;
