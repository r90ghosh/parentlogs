-- =============================================================================
-- Partner Sync: Security fixes, RPC functions, invite code upgrade
-- =============================================================================

-- 1. Fix invite_code default to 12-char high-entropy codes
ALTER TABLE public.families
  ALTER COLUMN invite_code SET DEFAULT UPPER(encode(gen_random_bytes(6), 'hex'));

-- 2. Lookup family by invite code (bypasses RLS for non-members)
CREATE OR REPLACE FUNCTION public.lookup_family_by_invite(p_code TEXT)
RETURNS TABLE(family_id UUID, family_name TEXT, family_stage TEXT)
LANGUAGE sql SECURITY DEFINER STABLE SET search_path = ''
AS $$
  SELECT id, name, stage::TEXT
  FROM public.families
  WHERE invite_code = UPPER(p_code);
$$;

-- 3. Atomic join_family: validates invite, checks limits, syncs subscription
CREATE OR REPLACE FUNCTION public.join_family(p_invite_code TEXT)
RETURNS JSONB
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  v_family_id UUID;
  v_member_count INT;
  v_sub_tier TEXT;
  v_sub_expires TIMESTAMPTZ;
  v_primary_baby_id UUID;
  v_caller_family UUID;
BEGIN
  -- Look up family by invite code
  SELECT id INTO v_family_id
  FROM public.families
  WHERE invite_code = UPPER(p_invite_code);

  IF v_family_id IS NULL THEN
    RAISE EXCEPTION 'Invalid invite code';
  END IF;

  -- Check caller isn't already in a family
  SELECT family_id INTO v_caller_family
  FROM public.profiles WHERE id = auth.uid();

  IF v_caller_family IS NOT NULL THEN
    RAISE EXCEPTION 'You are already in a family. Leave your current family first.';
  END IF;

  -- Enforce max 2 members per family
  SELECT COUNT(*) INTO v_member_count
  FROM public.profiles
  WHERE family_id = v_family_id;

  IF v_member_count >= 2 THEN
    RAISE EXCEPTION 'This family already has the maximum number of members';
  END IF;

  -- Get existing subscriber tier (if any)
  SELECT subscription_tier::TEXT, subscription_expires_at
  INTO v_sub_tier, v_sub_expires
  FROM public.profiles
  WHERE family_id = v_family_id
  AND subscription_tier IN ('premium', 'lifetime')
  LIMIT 1;

  -- Get the family's primary baby for active_baby_id
  SELECT id INTO v_primary_baby_id
  FROM public.babies
  WHERE family_id = v_family_id
  ORDER BY sort_order ASC, created_at ASC
  LIMIT 1;

  -- Atomically update joining user's profile
  UPDATE public.profiles SET
    family_id = v_family_id,
    active_baby_id = COALESCE(v_primary_baby_id, active_baby_id),
    subscription_tier = COALESCE(v_sub_tier, 'free')::public.subscription_tier,
    subscription_expires_at = v_sub_expires,
    updated_at = now()
  WHERE id = auth.uid();

  RETURN jsonb_build_object(
    'family_id', v_family_id,
    'tier', COALESCE(v_sub_tier, 'free'),
    'baby_id', v_primary_baby_id
  );
END;
$$;

-- 4. Upgrade regenerate_invite_code to 12-char + proper search_path
CREATE OR REPLACE FUNCTION public.regenerate_invite_code(p_family_id UUID)
RETURNS TEXT
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  new_code TEXT;
BEGIN
  -- Verify caller is the family owner
  IF NOT EXISTS (
    SELECT 1 FROM public.families
    WHERE id = p_family_id AND owner_id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'Only the family owner can regenerate the invite code';
  END IF;

  new_code := UPPER(encode(gen_random_bytes(6), 'hex'));
  UPDATE public.families SET invite_code = new_code, updated_at = now() WHERE id = p_family_id;
  RETURN new_code;
END;
$$;

-- 5. Protect subscription fields from client-side manipulation
-- Only service_role and SECURITY DEFINER functions can modify these
CREATE OR REPLACE FUNCTION public.protect_subscription_fields()
RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  -- current_user is 'authenticated' for direct client calls via PostgREST
  -- current_user is 'postgres' inside SECURITY DEFINER functions
  -- current_user is 'service_role' for admin/webhook calls
  IF current_user = 'authenticated' THEN
    NEW.subscription_tier := OLD.subscription_tier;
    NEW.subscription_expires_at := OLD.subscription_expires_at;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS protect_subscription_on_update ON public.profiles;
CREATE TRIGGER protect_subscription_on_update
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.protect_subscription_fields();

-- 6. Fix search_path on existing security-sensitive functions
CREATE OR REPLACE FUNCTION public.is_family_member(family_uuid UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql SECURITY DEFINER STABLE SET search_path = ''
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
    AND family_id = family_uuid
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.get_user_family_id(user_uuid UUID)
RETURNS UUID
LANGUAGE sql SECURITY DEFINER STABLE SET search_path = ''
AS $$
  SELECT family_id FROM public.profiles WHERE id = user_uuid;
$$;

-- 7. Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION public.lookup_family_by_invite(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.join_family(TEXT) TO authenticated;
