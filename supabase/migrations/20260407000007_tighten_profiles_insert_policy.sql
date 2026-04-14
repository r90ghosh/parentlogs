-- Medium fix M1: The "System can insert profiles" policy had WITH CHECK = true
-- which let any authenticated user insert arbitrary profile rows. The trigger
-- handle_new_user (security definer) handles signup-time inserts and bypasses
-- RLS via SECURITY DEFINER, so the policy can be tightened to require the user
-- to insert their own row.

DROP POLICY IF EXISTS "System can insert profiles" ON public.profiles;

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);
