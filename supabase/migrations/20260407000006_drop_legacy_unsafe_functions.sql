-- High fix H4: Drop legacy SECURITY DEFINER functions with mutable search_path
-- that are no longer referenced by frontend or any database object.
--
-- Verified unused (frontend grep + pg_trigger + pg_proc reference scan):
--   - get_shift_briefing(uuid)              -- replaced by direct queries in tracker-service
--   - get_shift_briefing(uuid, uuid)        -- also unused (service does direct queries)
--   - generate_family_tasks(uuid,date,date) -- replaced by initialize_*_with_catchup
--   - set_family_owner()                    -- replaced by create_family_for_user RPC
--   - update_family_stage()                 -- replaced by update_family_week_and_stage trigger
--
-- NOTE: initialize_family_tasks_with_catchup is INTENTIONALLY kept because the
-- onboarding flow at apps/web/src/app/(auth)/onboarding/family/page.tsx still
-- calls it. It is recreated in 20260407000008 with a safe search_path.

DROP FUNCTION IF EXISTS public.get_shift_briefing(uuid);
DROP FUNCTION IF EXISTS public.get_shift_briefing(uuid, uuid);
DROP FUNCTION IF EXISTS public.generate_family_tasks(uuid, date, date);
DROP FUNCTION IF EXISTS public.set_family_owner();
DROP FUNCTION IF EXISTS public.update_family_stage();
