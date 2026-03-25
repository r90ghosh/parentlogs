-- Migration: Capture babies table with RLS
-- This table was created via Supabase dashboard but never captured in version control.
-- This migration documents the schema and adds proper RLS policies.

CREATE TABLE IF NOT EXISTS babies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
  baby_name TEXT,
  due_date DATE,
  birth_date DATE,
  stage family_stage NOT NULL DEFAULT 'pregnancy',
  current_week INTEGER NOT NULL DEFAULT 0,
  signup_week INTEGER,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_babies_family_id ON babies(family_id);
CREATE INDEX IF NOT EXISTS idx_babies_is_active ON babies(is_active);

-- Add active_baby_id to profiles if not exists
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'active_baby_id'
  ) THEN
    ALTER TABLE profiles ADD COLUMN active_baby_id UUID REFERENCES babies(id) ON DELETE SET NULL;
    CREATE INDEX idx_profiles_active_baby_id ON profiles(active_baby_id);
  END IF;
END $$;

-- updated_at trigger
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_babies_updated_at'
  ) THEN
    CREATE TRIGGER update_babies_updated_at
      BEFORE UPDATE ON babies
      FOR EACH ROW EXECUTE FUNCTION update_updated_at();
  END IF;
END $$;

-- RLS
ALTER TABLE babies ENABLE ROW LEVEL SECURITY;

-- Family members can view babies in their family
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'babies' AND policyname = 'Family members can view babies') THEN
    CREATE POLICY "Family members can view babies" ON babies
      FOR SELECT USING (
        family_id IN (SELECT family_id FROM profiles WHERE id = auth.uid())
      );
  END IF;
END $$;

-- Family members can insert babies into their family
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'babies' AND policyname = 'Family members can insert babies') THEN
    CREATE POLICY "Family members can insert babies" ON babies
      FOR INSERT WITH CHECK (
        family_id IN (SELECT family_id FROM profiles WHERE id = auth.uid())
      );
  END IF;
END $$;

-- Family members can update babies in their family
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'babies' AND policyname = 'Family members can update babies') THEN
    CREATE POLICY "Family members can update babies" ON babies
      FOR UPDATE USING (
        family_id IN (SELECT family_id FROM profiles WHERE id = auth.uid())
      );
  END IF;
END $$;

-- Family members can delete babies in their family
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'babies' AND policyname = 'Family members can delete babies') THEN
    CREATE POLICY "Family members can delete babies" ON babies
      FOR DELETE USING (
        family_id IN (SELECT family_id FROM profiles WHERE id = auth.uid())
      );
  END IF;
END $$;
