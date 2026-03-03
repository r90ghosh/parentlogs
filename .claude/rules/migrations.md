---
description: Rules for Supabase database migrations
globs: supabase/migrations/**
---

# Migration Rules

## Naming Convention
- Use `apply_migration` MCP tool with snake_case names
- Names describe the change: `create_dad_challenge_content`, `add_signup_week_to_profiles`

## Table Creation Pattern
```sql
CREATE TABLE table_name (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- columns...
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_table_column ON table_name(column);
```

## RLS Pattern (REQUIRED for all new tables)
```sql
ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;

-- Read-only content tables:
CREATE POLICY "Authenticated users can read" ON table_name
  FOR SELECT TO authenticated USING (true);

-- User-owned tables:
CREATE POLICY "Users can read own" ON table_name
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own" ON table_name
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own" ON table_name
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own" ON table_name
  FOR DELETE USING (auth.uid() = user_id);

-- Family-scoped reads:
CREATE POLICY "Users can read family data" ON table_name
  FOR SELECT USING (family_id IN (
    SELECT family_id FROM profiles WHERE id = auth.uid()
  ));
```

## Validation Steps
1. Run migration via `apply_migration`
2. Verify with `list_tables` (public schema)
3. Run `get_advisors` (security) to check for missing RLS
4. Test with `execute_sql` query

## V2 Migrations (Phase 1)
1. `dad_challenge_content` table + `dad_challenge_pillar` enum
2. `dad_profiles` table (user_id FK to profiles)
3. `mood_checkins` table (user_id + family_id FKs)
4. `catch_up_behavior` column on `task_templates`
5. `signup_week` column on `profiles`
6. RLS policies for all new tables

## Key Enums
- `dad_challenge_pillar`: knowledge, planning, finances, anxiety, baby_bonding, relationship, extended_family
- Content phases use TEXT with CHECK constraint (not enum) for flexibility
- Mood levels use TEXT with CHECK: struggling, rough, okay, good, great
