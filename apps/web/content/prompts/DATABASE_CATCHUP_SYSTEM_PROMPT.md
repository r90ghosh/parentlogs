# Claude Code Prompt: Database Schema & Catch-Up System

## Context

We're building ParentLogs, a pregnancy/parenting task management app. We need to ensure our database has all required tables and add a "smart catch-up system" for users who sign up mid-pregnancy.

**The Problem We're Solving:**
A dad who signs up at Week 20 shouldn't see "156 overdue tasks" - instead, they should see a "Catch-Up Queue" where they can quickly triage past tasks as "Already Did", "Add to List", or "Skip".

## Instructions

### Step 1: Inspect Current Database State

First, use Supabase MCP to check what tables and columns already exist:

```
1. List all existing tables in the public schema
2. For each relevant table, show its columns and types
3. Identify what's missing vs what we need
```

Look for these tables:
- profiles
- families  
- task_templates (or tasks)
- family_tasks (or user_tasks)
- briefing_templates (or briefings)
- checklist_templates
- checklist_item_templates
- checklist_progress
- budget_templates
- family_budget
- baby_logs
- subscriptions
- notification_preferences
- push_subscriptions

### Step 2: Create Missing Tables

Based on what's missing, create any tables that don't exist. Here's what we need:

#### Core Tables

**profiles** (extends auth.users)
- id: UUID PRIMARY KEY (references auth.users)
- email: TEXT NOT NULL
- full_name: TEXT
- avatar_url: TEXT
- role: TEXT ('mom' | 'dad' | 'other')
- family_id: UUID (references families)
- subscription_tier: TEXT DEFAULT 'free'
- subscription_status: TEXT
- subscription_expires_at: TIMESTAMPTZ
- stripe_customer_id: TEXT
- fcm_token: TEXT
- signup_week: INTEGER ← **IMPORTANT for catch-up**
- onboarding_completed: BOOLEAN DEFAULT false
- created_at, updated_at: TIMESTAMPTZ

**families**
- id: UUID PRIMARY KEY
- name: TEXT
- due_date: DATE ← **IMPORTANT**
- birth_date: DATE
- baby_name: TEXT
- stage: TEXT ('pre-pregnancy' | 'pregnancy' | 'post-birth')
- invite_code: TEXT UNIQUE
- created_by: UUID
- created_at, updated_at: TIMESTAMPTZ

#### Task System

**task_templates** (master list of all tasks - content we pre-populate)
- id: UUID PRIMARY KEY
- task_id: TEXT UNIQUE (e.g., 'PREG-W24-001')
- title: TEXT NOT NULL
- description: TEXT
- why_it_matters: TEXT
- stage: TEXT ('pregnancy' | 'newborn' | 'infant' | 'toddler')
- week: INTEGER
- default_assignee: TEXT ('mom' | 'dad' | 'both')
- category: TEXT ('medical' | 'shopping' | 'planning' | 'financial' | 'partner' | 'self_care')
- priority: TEXT ('must-do' | 'good-to-do')
- time_estimate_minutes: INTEGER
- **is_time_sensitive: BOOLEAN DEFAULT false** ← For catch-up
- **window_weeks: INTEGER DEFAULT 4** ← How long after due is it still relevant
- **commonly_completed_early: BOOLEAN DEFAULT false** ← For catch-up
- is_premium: BOOLEAN DEFAULT false
- sort_order: INTEGER
- created_at: TIMESTAMPTZ

**family_tasks** (personalized tasks for each family)
- id: UUID PRIMARY KEY
- family_id: UUID REFERENCES families(id)
- template_id: UUID REFERENCES task_templates(id)
- title: TEXT NOT NULL
- description: TEXT
- why_it_matters: TEXT
- due_date: DATE
- week_due: INTEGER
- assigned_to: TEXT ('mom' | 'dad' | 'both')
- completed_by: UUID
- completed_at: TIMESTAMPTZ
- status: TEXT ('pending' | 'completed' | 'skipped' | 'snoozed')
- snoozed_until: DATE
- category: TEXT
- priority: TEXT
- time_estimate_minutes: INTEGER
- is_custom: BOOLEAN DEFAULT false
- notes: TEXT
- **is_backlog: BOOLEAN DEFAULT false** ← For catch-up
- **backlog_status: TEXT ('pending' | 'triaged')** ← For catch-up
- **triage_action: TEXT ('completed' | 'added' | 'skipped')** ← For catch-up
- **triage_date: TIMESTAMPTZ** ← For catch-up
- created_at, updated_at: TIMESTAMPTZ

### Step 3: Add Missing Columns to Existing Tables

If tables exist but are missing the catch-up columns, add them:

```sql
-- Add to profiles if missing
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS signup_week INTEGER;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT false;

-- Add to task_templates if missing
ALTER TABLE task_templates ADD COLUMN IF NOT EXISTS is_time_sensitive BOOLEAN DEFAULT false;
ALTER TABLE task_templates ADD COLUMN IF NOT EXISTS window_weeks INTEGER DEFAULT 4;
ALTER TABLE task_templates ADD COLUMN IF NOT EXISTS commonly_completed_early BOOLEAN DEFAULT false;
ALTER TABLE task_templates ADD COLUMN IF NOT EXISTS why_it_matters TEXT;
ALTER TABLE task_templates ADD COLUMN IF NOT EXISTS time_estimate_minutes INTEGER DEFAULT 30;

-- Add to family_tasks if missing
ALTER TABLE family_tasks ADD COLUMN IF NOT EXISTS is_backlog BOOLEAN DEFAULT false;
ALTER TABLE family_tasks ADD COLUMN IF NOT EXISTS backlog_status TEXT;
ALTER TABLE family_tasks ADD COLUMN IF NOT EXISTS triage_action TEXT;
ALTER TABLE family_tasks ADD COLUMN IF NOT EXISTS triage_date TIMESTAMPTZ;
ALTER TABLE family_tasks ADD COLUMN IF NOT EXISTS why_it_matters TEXT;
ALTER TABLE family_tasks ADD COLUMN IF NOT EXISTS time_estimate_minutes INTEGER;
ALTER TABLE family_tasks ADD COLUMN IF NOT EXISTS week_due INTEGER;
```

### Step 4: Create Indexes for Performance

```sql
-- Index for catch-up queries
CREATE INDEX IF NOT EXISTS idx_family_tasks_backlog 
ON family_tasks(family_id, is_backlog, backlog_status);

-- Index for week-based queries
CREATE INDEX IF NOT EXISTS idx_family_tasks_week 
ON family_tasks(family_id, week_due);

-- Index for status queries
CREATE INDEX IF NOT EXISTS idx_family_tasks_status 
ON family_tasks(family_id, status);
```

### Step 5: Create Helper Functions

```sql
-- Calculate current week from due date
CREATE OR REPLACE FUNCTION calculate_current_week(p_due_date DATE)
RETURNS INTEGER AS $$
DECLARE
  weeks_until_due INTEGER;
BEGIN
  IF p_due_date IS NULL THEN
    RETURN NULL;
  END IF;
  
  weeks_until_due := CEIL((p_due_date - CURRENT_DATE)::NUMERIC / 7);
  RETURN GREATEST(1, LEAST(42, 40 - weeks_until_due));
END;
$$ LANGUAGE plpgsql;

-- Initialize tasks for a new family (handles catch-up automatically)
CREATE OR REPLACE FUNCTION initialize_family_tasks(
  p_family_id UUID,
  p_due_date DATE,
  p_signup_week INTEGER
)
RETURNS INTEGER AS $$
DECLARE
  task_record RECORD;
  tasks_created INTEGER := 0;
  task_due_date DATE;
  task_is_backlog BOOLEAN;
BEGIN
  FOR task_record IN 
    SELECT * FROM task_templates 
    WHERE stage = 'pregnancy' 
    ORDER BY week, sort_order 
  LOOP
    -- Calculate due date: due_date - (40 - week) weeks
    task_due_date := p_due_date - ((40 - task_record.week) * 7);
    
    -- Mark as backlog if before signup week
    task_is_backlog := task_record.week < p_signup_week;
    
    INSERT INTO family_tasks (
      family_id,
      template_id,
      title,
      description,
      why_it_matters,
      due_date,
      week_due,
      assigned_to,
      category,
      priority,
      time_estimate_minutes,
      is_backlog,
      backlog_status,
      status
    ) VALUES (
      p_family_id,
      task_record.id,
      task_record.title,
      task_record.description,
      task_record.why_it_matters,
      task_due_date,
      task_record.week,
      task_record.default_assignee,
      task_record.category,
      task_record.priority,
      task_record.time_estimate_minutes,
      task_is_backlog,
      CASE WHEN task_is_backlog THEN 'pending' ELSE NULL END,
      'pending'
    );
    
    tasks_created := tasks_created + 1;
  END LOOP;
  
  RETURN tasks_created;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### Step 6: Enable RLS (if not already)

Check if RLS is enabled on all tables. If not, enable it and create appropriate policies.

Key policies needed:
- Users can only see/edit their own family's data
- Template tables are read-only for all authenticated users

### Step 7: Seed Time-Sensitive Task Data

After schema is set up, mark which tasks are time-sensitive:

```sql
-- Time-sensitive medical appointments (small window)
UPDATE task_templates 
SET is_time_sensitive = true, window_weeks = 2 
WHERE title ILIKE '%12-week%' 
   OR title ILIKE '%nuchal%' 
   OR title ILIKE '%NIPT%'
   OR title ILIKE '%first trimester screen%'
   OR title ILIKE '%anatomy scan%'
   OR title ILIKE '%20-week%'
   OR title ILIKE '%glucose%'
   OR title ILIKE '%GBS%'
   OR title ILIKE '%tdap%';

-- Commonly completed early (probably already done)
UPDATE task_templates 
SET commonly_completed_early = true 
WHERE title ILIKE '%prenatal vitamin%'
   OR title ILIKE '%find ob%'
   OR title ILIKE '%choose provider%'
   OR title ILIKE '%confirm pregnancy%'
   OR title ILIKE '%first appointment%'
   OR title ILIKE '%tell partner%';

-- Set reasonable windows for different categories
UPDATE task_templates SET window_weeks = 4 WHERE category = 'medical' AND NOT is_time_sensitive;
UPDATE task_templates SET window_weeks = 8 WHERE category = 'planning';
UPDATE task_templates SET window_weeks = 12 WHERE category = 'shopping';
UPDATE task_templates SET window_weeks = 99 WHERE category = 'partner'; -- Always relevant
```

### Step 8: Verify Everything

After making changes:
1. List all tables again to confirm structure
2. Run a test query to make sure indexes work
3. Verify RLS policies are in place

## Summary of Catch-Up System

The catch-up system works like this:

1. **On signup**: Save `signup_week` to user's profile
2. **When initializing tasks**: Mark tasks from weeks < signup_week as `is_backlog = true, backlog_status = 'pending'`
3. **In the UI**: Show "Catch-Up Queue" instead of "Overdue" for backlog tasks
4. **Triage actions**:
   - "Already Did" → `triage_action = 'completed'`, `status = 'completed'`
   - "Add to List" → `triage_action = 'added'`, `is_backlog = false`
   - "Skip" → `triage_action = 'skipped'`, `backlog_status = 'triaged'`

## Important Notes

- Always check what exists before creating/altering
- Use `IF NOT EXISTS` and `ADD COLUMN IF NOT EXISTS` to be idempotent
- Don't drop existing data
- The template tables (task_templates, briefing_templates, etc.) contain our pre-populated content
- The family_* tables contain user-specific data

Please inspect the current state first and tell me what exists vs what needs to be created/modified before making any changes.
