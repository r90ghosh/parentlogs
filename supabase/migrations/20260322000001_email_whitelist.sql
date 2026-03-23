-- Email Whitelist for Automatic Lifetime Access

-- 1. Create whitelisted_emails table
CREATE TABLE public.whitelisted_emails (
  email TEXT PRIMARY KEY,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. RLS enabled, zero policies = admin/service-role only
ALTER TABLE public.whitelisted_emails ENABLE ROW LEVEL SECURITY;
COMMENT ON TABLE public.whitelisted_emails IS
  'Emails that get lifetime subscription on signup. No RLS policies = admin-only.';

-- 3. Modify handle_new_user() to check whitelist
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  _is_whitelisted BOOLEAN;
  _tier TEXT;
BEGIN
  -- Check if email is whitelisted for lifetime access
  SELECT EXISTS (
    SELECT 1 FROM public.whitelisted_emails WHERE email = LOWER(NEW.email)
  ) INTO _is_whitelisted;

  _tier := CASE WHEN _is_whitelisted THEN 'lifetime' ELSE 'free' END;

  -- Insert profile with appropriate tier
  INSERT INTO public.profiles (id, email, full_name, avatar_url, subscription_tier)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url',
    _tier::public.subscription_tier
  );

  INSERT INTO public.notification_preferences (user_id)
  VALUES (NEW.id);

  INSERT INTO public.subscriptions (user_id, tier, status)
  VALUES (NEW.id, _tier::public.subscription_tier, 'active');

  RETURN NEW;
EXCEPTION
  WHEN unique_violation THEN
    RETURN NEW;
  WHEN OTHERS THEN
    RAISE WARNING 'Error in handle_new_user: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- 4. Helper function: single call to whitelist + upgrade
CREATE OR REPLACE FUNCTION whitelist_email(p_email TEXT, p_notes TEXT DEFAULT NULL)
RETURNS TEXT AS $$
DECLARE
  _email TEXT := LOWER(p_email);
  _result TEXT;
BEGIN
  -- Add to whitelist (skip if already there)
  INSERT INTO public.whitelisted_emails (email, notes)
  VALUES (_email, p_notes)
  ON CONFLICT (email) DO UPDATE SET notes = COALESCE(EXCLUDED.notes, public.whitelisted_emails.notes);

  -- Upgrade existing profile if account exists
  UPDATE public.profiles SET subscription_tier = 'lifetime'
  WHERE LOWER(email) = _email AND subscription_tier != 'lifetime';

  IF FOUND THEN
    UPDATE public.subscriptions SET tier = 'lifetime', status = 'active'
    WHERE user_id = (SELECT id FROM public.profiles WHERE LOWER(email) = _email);
    _result := 'whitelisted + existing account upgraded to lifetime';
  ELSE
    _result := 'whitelisted (no existing account — will get lifetime on signup)';
  END IF;

  RETURN _result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- 4b. Restrict whitelist_email() to service-role only (prevent privilege escalation)
REVOKE EXECUTE ON FUNCTION public.whitelist_email(TEXT, TEXT) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.whitelist_email(TEXT, TEXT) FROM authenticated;
REVOKE EXECUTE ON FUNCTION public.whitelist_email(TEXT, TEXT) FROM anon;

-- 5. Upgrade any existing accounts that match
UPDATE public.profiles
SET subscription_tier = 'lifetime'
WHERE LOWER(email) IN (SELECT email FROM public.whitelisted_emails)
  AND subscription_tier != 'lifetime';

UPDATE public.subscriptions
SET tier = 'lifetime', status = 'active'
WHERE user_id IN (
  SELECT id FROM public.profiles
  WHERE LOWER(email) IN (SELECT email FROM public.whitelisted_emails)
) AND tier != 'lifetime';
