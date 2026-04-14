-- Single-round-trip bootstrap payload for mobile AuthProvider.
-- Previously AuthProvider fetched profiles then families sequentially (2 RTTs).
-- This RPC returns both plus babies in one call.
--
-- Security:
--   SECURITY DEFINER + SET search_path = '' (hardened against search_path
--   hijacking per Supabase best practices)
--   Caller must equal p_user_id -- auth.uid() check inside.
--
-- Performance:
--   Postgres executes the single query with a LEFT JOIN on families and
--   a jsonb_agg subquery on babies. One round-trip end-to-end.
CREATE OR REPLACE FUNCTION public.get_initial_app_state(p_user_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  result jsonb;
BEGIN
  IF auth.uid() IS NULL OR auth.uid() <> p_user_id THEN
    RAISE EXCEPTION 'unauthorized';
  END IF;

  SELECT jsonb_build_object(
    'profile', to_jsonb(p.*),
    'family',  CASE WHEN f.id IS NULL THEN NULL ELSE to_jsonb(f.*) END,
    'babies',  COALESCE(
      (
        SELECT jsonb_agg(to_jsonb(b.*) ORDER BY b.created_at)
        FROM public.babies b
        WHERE b.family_id = p.family_id
      ),
      '[]'::jsonb
    )
  ) INTO result
  FROM public.profiles p
  LEFT JOIN public.families f ON f.id = p.family_id
  WHERE p.id = p_user_id;

  RETURN result;
END;
$$;

REVOKE ALL ON FUNCTION public.get_initial_app_state(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_initial_app_state(uuid) TO authenticated;
