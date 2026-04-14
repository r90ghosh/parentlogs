-- High fixes H1 + H2: Add missing indexes on foreign-key columns to avoid
-- sequential scans on every JOIN/lookup.
--
-- Most critical: family_budget.family_id had no index at all despite being
-- the primary scoping key for every budget query. Will cause sequential scans
-- on the budget table as soon as data scales beyond a few rows.

CREATE INDEX IF NOT EXISTS idx_family_budget_family_id
  ON public.family_budget(family_id);

CREATE INDEX IF NOT EXISTS idx_family_budget_template_id
  ON public.family_budget(budget_template_id);

CREATE INDEX IF NOT EXISTS idx_families_owner_id
  ON public.families(owner_id);

CREATE INDEX IF NOT EXISTS idx_profiles_active_baby_id
  ON public.profiles(active_baby_id) WHERE active_baby_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_family_tasks_completed_by
  ON public.family_tasks(completed_by) WHERE completed_by IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_family_tasks_template_id
  ON public.family_tasks(task_template_id);

CREATE INDEX IF NOT EXISTS idx_baby_logs_logged_by
  ON public.baby_logs(logged_by) WHERE logged_by IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_checklist_progress_checked_by
  ON public.checklist_progress(checked_by) WHERE checked_by IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_checklist_progress_checklist_id
  ON public.checklist_progress(checklist_id);

CREATE INDEX IF NOT EXISTS idx_checklist_progress_item_id
  ON public.checklist_progress(item_id);

CREATE INDEX IF NOT EXISTS idx_checklist_item_templates_checklist_id
  ON public.checklist_item_templates(checklist_id);
