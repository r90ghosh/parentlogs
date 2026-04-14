-- Critical fix C2 + Medium fix M5: Change ON DELETE NO ACTION to ON DELETE SET NULL
-- for FKs that point at profiles(id). Without this, a partner who has logged any
-- baby activity, completed any task, checked off any checklist item, or owns the
-- family cannot have their account deleted because the cascade chain
-- (auth.users -> profiles) blocks at these constraints.
--
-- Family-scoped data is preserved with NULL attribution when a member leaves.

-- baby_logs.logged_by is currently NOT NULL — relax it so SET NULL is valid.
ALTER TABLE public.baby_logs ALTER COLUMN logged_by DROP NOT NULL;

ALTER TABLE public.baby_logs
  DROP CONSTRAINT baby_logs_logged_by_fkey,
  ADD CONSTRAINT baby_logs_logged_by_fkey
    FOREIGN KEY (logged_by) REFERENCES public.profiles(id) ON DELETE SET NULL;

ALTER TABLE public.family_tasks
  DROP CONSTRAINT family_tasks_completed_by_fkey,
  ADD CONSTRAINT family_tasks_completed_by_fkey
    FOREIGN KEY (completed_by) REFERENCES public.profiles(id) ON DELETE SET NULL;

ALTER TABLE public.checklist_progress
  DROP CONSTRAINT checklist_progress_checked_by_fkey,
  ADD CONSTRAINT checklist_progress_checked_by_fkey
    FOREIGN KEY (checked_by) REFERENCES public.profiles(id) ON DELETE SET NULL;

ALTER TABLE public.families
  DROP CONSTRAINT families_owner_id_fkey,
  ADD CONSTRAINT families_owner_id_fkey
    FOREIGN KEY (owner_id) REFERENCES public.profiles(id) ON DELETE SET NULL;
