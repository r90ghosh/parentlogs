-- Critical fix C3: Drop legacy unique constraints on checklist_progress that
-- omit baby_id. They blocked multi-baby families from tracking the same
-- checklist item across multiple babies (insert for second baby would hit
-- the (family_id, item_id) duplicate-key violation).
--
-- The correct constraint (family_id, baby_id, checklist_id, item_id) was
-- added in migration 20260320001956 but the legacy ones were never dropped.

ALTER TABLE public.checklist_progress
  DROP CONSTRAINT IF EXISTS checklist_progress_family_checklist_item_unique;

ALTER TABLE public.checklist_progress
  DROP CONSTRAINT IF EXISTS checklist_progress_family_id_item_id_key;
