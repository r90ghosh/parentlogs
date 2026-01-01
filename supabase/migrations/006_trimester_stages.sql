-- Migration: Add trimester stages to family_stage enum
-- This splits the single 'pregnancy' stage into 3 distinct trimesters
-- Note: Adding enum values only - they need to be committed before use

-- Step 1: Add new enum values to family_stage
ALTER TYPE family_stage ADD VALUE IF NOT EXISTS 'first-trimester';
ALTER TYPE family_stage ADD VALUE IF NOT EXISTS 'second-trimester';
ALTER TYPE family_stage ADD VALUE IF NOT EXISTS 'third-trimester';
