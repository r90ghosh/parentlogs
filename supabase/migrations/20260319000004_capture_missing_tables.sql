-- Migration: Capture 6 tables that were created via Supabase dashboard
-- These tables already exist in production with RLS enabled.
-- This migration documents their schema for version control and local dev.

-- ============================================================
-- 1. dad_challenge_content
-- ============================================================
CREATE TABLE IF NOT EXISTS dad_challenge_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pillar dad_challenge_pillar NOT NULL,
  phase TEXT NOT NULL,
  headline TEXT NOT NULL,
  preview TEXT NOT NULL,
  icon TEXT NOT NULL,
  narrative TEXT NOT NULL,
  action_items JSONB NOT NULL DEFAULT '[]'::jsonb,
  dad_quotes JSONB NOT NULL DEFAULT '[]'::jsonb,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_premium BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT dad_challenge_content_phase_check CHECK (phase = ANY (ARRAY['pre-pregnancy','trimester-1','trimester-2','trimester-3','0-3-months','3-6-months','6-12-months','12-18-months','18-plus'])),
  CONSTRAINT dad_challenge_content_pillar_phase_key UNIQUE (pillar, phase)
);

CREATE INDEX IF NOT EXISTS idx_dad_challenge_phase ON dad_challenge_content(phase);
CREATE INDEX IF NOT EXISTS idx_dad_challenge_pillar ON dad_challenge_content(pillar);

ALTER TABLE dad_challenge_content ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'dad_challenge_content' AND policyname = 'Authenticated users can read challenge content') THEN
    CREATE POLICY "Authenticated users can read challenge content" ON dad_challenge_content
      FOR SELECT TO authenticated USING (true);
  END IF;
END $$;

-- ============================================================
-- 2. dad_profiles
-- ============================================================
CREATE TABLE IF NOT EXISTS dad_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id),
  work_situation TEXT,
  is_first_time_dad BOOLEAN,
  concerns TEXT[] DEFAULT '{}'::text[],
  partner_relationship TEXT,
  family_nearby BOOLEAN,
  has_friend_support BOOLEAN,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT dad_profiles_user_id_key UNIQUE (user_id),
  CONSTRAINT dad_profiles_work_situation_check CHECK (work_situation = ANY (ARRAY['full-time','part-time','remote','hybrid','self-employed','stay-at-home','looking'])),
  CONSTRAINT dad_profiles_partner_relationship_check CHECK (partner_relationship = ANY (ARRAY['great','good','complicated','struggling','single','prefer-not-say']))
);

CREATE INDEX IF NOT EXISTS idx_dad_profiles_user ON dad_profiles(user_id);

ALTER TABLE dad_profiles ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'dad_profiles' AND policyname = 'Users can read own dad profile') THEN
    CREATE POLICY "Users can read own dad profile" ON dad_profiles
      FOR SELECT USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'dad_profiles' AND policyname = 'Users can insert own dad profile') THEN
    CREATE POLICY "Users can insert own dad profile" ON dad_profiles
      FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'dad_profiles' AND policyname = 'Users can update own dad profile') THEN
    CREATE POLICY "Users can update own dad profile" ON dad_profiles
      FOR UPDATE USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'dad_profiles' AND policyname = 'Users can delete own dad profile') THEN
    CREATE POLICY "Users can delete own dad profile" ON dad_profiles
      FOR DELETE USING (auth.uid() = user_id);
  END IF;
END $$;

-- ============================================================
-- 3. mood_checkins
-- ============================================================
CREATE TABLE IF NOT EXISTS mood_checkins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id),
  family_id UUID NOT NULL REFERENCES families(id),
  mood TEXT NOT NULL,
  situation_flags TEXT[] DEFAULT '{}'::text[],
  note TEXT,
  phase TEXT,
  checked_in_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT mood_checkins_mood_check CHECK (mood = ANY (ARRAY['struggling','rough','okay','good','great']))
);

CREATE INDEX IF NOT EXISTS idx_mood_user ON mood_checkins(user_id);
CREATE INDEX IF NOT EXISTS idx_mood_family ON mood_checkins(family_id);
CREATE INDEX IF NOT EXISTS idx_mood_checked_in ON mood_checkins(checked_in_at);

ALTER TABLE mood_checkins ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'mood_checkins' AND policyname = 'Users can read family mood checkins') THEN
    CREATE POLICY "Users can read family mood checkins" ON mood_checkins
      FOR SELECT USING (family_id IN (SELECT profiles.family_id FROM profiles WHERE profiles.id = auth.uid()));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'mood_checkins' AND policyname = 'Users can insert own mood checkins') THEN
    CREATE POLICY "Users can insert own mood checkins" ON mood_checkins
      FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'mood_checkins' AND policyname = 'Users can update own mood checkins') THEN
    CREATE POLICY "Users can update own mood checkins" ON mood_checkins
      FOR UPDATE USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'mood_checkins' AND policyname = 'Users can delete own mood checkins') THEN
    CREATE POLICY "Users can delete own mood checkins" ON mood_checkins
      FOR DELETE USING (auth.uid() = user_id);
  END IF;
END $$;

-- ============================================================
-- 4. contact_messages
-- ============================================================
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT contact_messages_status_check CHECK (status = ANY (ARRAY['new','read','replied','closed']))
);

CREATE INDEX IF NOT EXISTS idx_contact_messages_user_id ON contact_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON contact_messages(status);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'contact_messages' AND policyname = 'Authenticated users can insert messages') THEN
    CREATE POLICY "Authenticated users can insert messages" ON contact_messages
      FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'contact_messages' AND policyname = 'Users can read own messages') THEN
    CREATE POLICY "Users can read own messages" ON contact_messages
      FOR SELECT TO authenticated USING (auth.uid() = user_id);
  END IF;
END $$;

-- ============================================================
-- 5. timeline_milestones
-- ============================================================
CREATE TABLE IF NOT EXISTS timeline_milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL,
  label TEXT NOT NULL,
  sub_label TEXT NOT NULL,
  sort_order INTEGER NOT NULL,
  direction TEXT NOT NULL DEFAULT 'ltr',
  created_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT timeline_milestones_slug_key UNIQUE (slug),
  CONSTRAINT timeline_milestones_direction_check CHECK (direction = ANY (ARRAY['ltr','rtl']))
);

CREATE INDEX IF NOT EXISTS idx_timeline_milestones_sort ON timeline_milestones(sort_order);

ALTER TABLE timeline_milestones ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'timeline_milestones' AND policyname = 'Public read timeline_milestones') THEN
    CREATE POLICY "Public read timeline_milestones" ON timeline_milestones
      FOR SELECT USING (true);
  END IF;
END $$;

-- ============================================================
-- 6. timeline_dots
-- ============================================================
CREATE TABLE IF NOT EXISTS timeline_dots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  milestone_id UUID REFERENCES timeline_milestones(id),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  domain TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT timeline_dots_domain_check CHECK (domain = ANY (ARRAY['health','budget','childcare','relationship','logistics']))
);

CREATE INDEX IF NOT EXISTS idx_timeline_dots_milestone ON timeline_dots(milestone_id);
CREATE INDEX IF NOT EXISTS idx_timeline_dots_domain ON timeline_dots(domain);

ALTER TABLE timeline_dots ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'timeline_dots' AND policyname = 'Public read timeline_dots') THEN
    CREATE POLICY "Public read timeline_dots" ON timeline_dots
      FOR SELECT USING (true);
  END IF;
END $$;
