-- High fix H3: The babies table had 8 RLS policies — 4 functional pairs that
-- evaluated the exact same family-membership subquery. This was migration drift
-- from add_babies_table + capture_babies_table running both definitions.
-- Drop the "Family members can ..." set, keep "Users can ..." (already aligned
-- with the rest of the codebase naming convention).

DROP POLICY IF EXISTS "Family members can delete babies" ON public.babies;
DROP POLICY IF EXISTS "Family members can insert babies" ON public.babies;
DROP POLICY IF EXISTS "Family members can view babies" ON public.babies;
DROP POLICY IF EXISTS "Family members can update babies" ON public.babies;
