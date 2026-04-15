-- Phase 1 of the post-birth backlog problem.
-- When a family transitions to post-birth, pre-birth template tasks that are
-- tagged as `expired` (no longer doable) or `likely_done` (baby stuff the user
-- probably handled) should stop nagging. `catch_up` tasks stay pending — they
-- remain actionable and will be surfaced via a monthly digest (Phase 2).

-- ---------------------------------------------------------------------------
-- Idempotent RPC: sweep one family's pre-birth template tasks.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.sweep_expired_phase_tasks(p_family_id uuid)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_affected integer := 0;
BEGIN
  IF p_family_id IS NULL THEN
    RETURN 0;
  END IF;

  -- Only sweep families that have actually reached post-birth. A pregnancy-phase
  -- family shouldn't have its own in-phase tasks swept.
  IF NOT EXISTS (
    SELECT 1
    FROM public.families
    WHERE id = p_family_id
      AND stage = 'post-birth'::public.family_stage
  ) THEN
    RETURN 0;
  END IF;

  WITH swept AS (
    UPDATE public.family_tasks ft
    SET status = 'skipped'::public.task_status,
        updated_at = now()
    FROM public.task_templates tt
    WHERE ft.task_template_id = tt.task_id
      AND ft.family_id = p_family_id
      AND ft.is_custom = false
      AND ft.status = 'pending'::public.task_status
      AND tt.stage IN (
        'pregnancy'::public.family_stage,
        'first-trimester'::public.family_stage,
        'second-trimester'::public.family_stage,
        'third-trimester'::public.family_stage
      )
      AND tt.catch_up_behavior IN ('expired', 'likely_done')
    RETURNING ft.id
  )
  SELECT COUNT(*) INTO v_affected FROM swept;

  RETURN v_affected;
END;
$$;

COMMENT ON FUNCTION public.sweep_expired_phase_tasks(uuid) IS
  'Sweeps pregnancy-era family_tasks to status=skipped when the template is tagged expired or likely_done. Idempotent. catch_up tasks remain pending for the backlog digest.';

-- Trigger function: fires when a family row transitions to post-birth.
CREATE OR REPLACE FUNCTION public.sweep_phase_tasks_on_stage_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF NEW.stage = 'post-birth'::public.family_stage
     AND (OLD.stage IS DISTINCT FROM NEW.stage) THEN
    PERFORM public.sweep_expired_phase_tasks(NEW.id);
  END IF;
  RETURN NEW;
END;
$$;

-- AFTER UPDATE so the BEFORE UPDATE triggers (update_family_week, etc.) have
-- already resolved the final stage value before we react to it.
DROP TRIGGER IF EXISTS sweep_phase_tasks_on_stage_change_trigger ON public.families;
CREATE TRIGGER sweep_phase_tasks_on_stage_change_trigger
AFTER UPDATE OF stage ON public.families
FOR EACH ROW
EXECUTE FUNCTION public.sweep_phase_tasks_on_stage_change();

-- Lock down the RPC. The trigger runs as the function owner, so it can call
-- the RPC regardless of grants; direct callers must go through service_role.
REVOKE ALL ON FUNCTION public.sweep_expired_phase_tasks(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.sweep_expired_phase_tasks(uuid) TO service_role;

-- ---------------------------------------------------------------------------
-- One-time backfill: every family already in post-birth gets swept now.
-- Idempotent — re-running this block has no effect because the swept rows
-- are already status=skipped.
-- ---------------------------------------------------------------------------
DO $$
DECLARE
  v_family_id uuid;
  v_total    integer := 0;
  v_count    integer;
BEGIN
  FOR v_family_id IN
    SELECT id FROM public.families WHERE stage = 'post-birth'::public.family_stage
  LOOP
    v_count := public.sweep_expired_phase_tasks(v_family_id);
    v_total := v_total + v_count;
  END LOOP;
  RAISE NOTICE 'Backfill swept % tasks across post-birth families', v_total;
END;
$$;
