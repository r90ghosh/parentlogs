-- Upgrade invite code generation from MD5(RANDOM()) (32 bits) to gen_random_bytes (48 bits)
-- Old: UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 8)) = 8 hex chars, ~4B possibilities
-- New: UPPER(encode(gen_random_bytes(6), 'hex')) = 12 hex chars, ~281T possibilities

-- Update the default on the families table
ALTER TABLE families
  ALTER COLUMN invite_code SET DEFAULT UPPER(encode(gen_random_bytes(6), 'hex'));

-- Update the regenerate_invite_code function
CREATE OR REPLACE FUNCTION regenerate_invite_code(p_family_id UUID)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  new_code TEXT;
BEGIN
  -- Verify the caller owns this family
  IF NOT EXISTS (
    SELECT 1 FROM public.families
    WHERE id = p_family_id AND owner_id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  new_code := UPPER(encode(gen_random_bytes(6), 'hex'));

  UPDATE public.families SET invite_code = new_code WHERE id = p_family_id;

  RETURN new_code;
END;
$$;
