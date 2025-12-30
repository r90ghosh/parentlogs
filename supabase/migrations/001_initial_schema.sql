-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Custom types
CREATE TYPE user_role AS ENUM ('mom', 'dad', 'other');
CREATE TYPE subscription_tier AS ENUM ('free', 'premium', 'lifetime');
CREATE TYPE family_stage AS ENUM ('pregnancy', 'post-birth');
CREATE TYPE task_status AS ENUM ('pending', 'completed', 'skipped', 'snoozed');
CREATE TYPE task_priority AS ENUM ('must-do', 'good-to-do');
CREATE TYPE task_assignee AS ENUM ('mom', 'dad', 'both', 'either');
CREATE TYPE log_type AS ENUM ('feeding', 'diaper', 'sleep', 'temperature', 'medicine', 'vitamin_d', 'mood', 'weight', 'height', 'milestone', 'custom');

-- Profiles table (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role user_role DEFAULT 'dad',
  family_id UUID,
  subscription_tier subscription_tier DEFAULT 'free',
  subscription_expires_at TIMESTAMPTZ,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Families table
CREATE TABLE families (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT,
  due_date DATE,
  birth_date DATE,
  baby_name TEXT,
  stage family_stage DEFAULT 'pregnancy',
  current_week INTEGER DEFAULT 0,
  invite_code TEXT UNIQUE DEFAULT UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 8)),
  owner_id UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add foreign key from profiles to families
ALTER TABLE profiles ADD CONSTRAINT fk_profiles_family FOREIGN KEY (family_id) REFERENCES families(id) ON DELETE SET NULL;

-- Task templates (seeded content)
CREATE TABLE task_templates (
  task_id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  stage family_stage NOT NULL,
  due_date_offset_days INTEGER NOT NULL,
  default_assignee task_assignee DEFAULT 'either',
  category TEXT,
  priority task_priority DEFAULT 'good-to-do',
  is_premium BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Family tasks (personalized copies)
CREATE TABLE family_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  family_id UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
  task_template_id TEXT REFERENCES task_templates(task_id),
  title TEXT NOT NULL,
  description TEXT,
  due_date DATE NOT NULL,
  assigned_to task_assignee DEFAULT 'either',
  status task_status DEFAULT 'pending',
  priority task_priority DEFAULT 'good-to-do',
  category TEXT,
  completed_by UUID REFERENCES profiles(id),
  completed_at TIMESTAMPTZ,
  snoozed_until DATE,
  notes TEXT,
  is_custom BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Briefing templates (seeded content)
CREATE TABLE briefing_templates (
  briefing_id TEXT PRIMARY KEY,
  stage family_stage NOT NULL,
  title TEXT NOT NULL,
  week INTEGER NOT NULL,
  baby_update TEXT,
  mom_update TEXT,
  dad_focus TEXT[],
  relationship_tip TEXT,
  coming_up TEXT,
  medical_source TEXT,
  linked_task_ids TEXT[],
  is_premium BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Baby logs
CREATE TABLE baby_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  family_id UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
  logged_by UUID NOT NULL REFERENCES profiles(id),
  log_type log_type NOT NULL,
  log_data JSONB NOT NULL DEFAULT '{}',
  logged_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Budget templates (seeded content)
CREATE TABLE budget_templates (
  budget_id TEXT PRIMARY KEY,
  category TEXT NOT NULL,
  subcategory TEXT,
  item TEXT NOT NULL,
  description TEXT,
  stage family_stage NOT NULL,
  week_start INTEGER,
  week_end INTEGER,
  priority TEXT DEFAULT 'good-to-have',
  price_low INTEGER, -- in cents
  price_mid INTEGER,
  price_high INTEGER,
  price_currency TEXT DEFAULT 'USD',
  notes TEXT,
  is_premium BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Family budget items
CREATE TABLE family_budget (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  family_id UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
  budget_template_id TEXT REFERENCES budget_templates(budget_id),
  item TEXT NOT NULL,
  category TEXT,
  estimated_price INTEGER, -- in cents
  actual_price INTEGER,
  is_purchased BOOLEAN DEFAULT FALSE,
  purchased_at TIMESTAMPTZ,
  notes TEXT,
  is_custom BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Checklist templates (seeded content)
CREATE TABLE checklist_templates (
  checklist_id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  stage family_stage,
  week_relevant TEXT,
  is_premium BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Checklist item templates
CREATE TABLE checklist_item_templates (
  item_id TEXT PRIMARY KEY,
  checklist_id TEXT NOT NULL REFERENCES checklist_templates(checklist_id) ON DELETE CASCADE,
  category TEXT,
  item TEXT NOT NULL,
  details TEXT,
  required BOOLEAN DEFAULT FALSE,
  bring_or_do TEXT DEFAULT 'do',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Checklist progress (per family)
CREATE TABLE checklist_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  family_id UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
  checklist_id TEXT NOT NULL REFERENCES checklist_templates(checklist_id),
  item_id TEXT NOT NULL REFERENCES checklist_item_templates(item_id),
  is_checked BOOLEAN DEFAULT FALSE,
  checked_by UUID REFERENCES profiles(id),
  checked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(family_id, item_id)
);

-- Subscriptions
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  tier subscription_tier DEFAULT 'free',
  status TEXT DEFAULT 'active',
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Notification preferences
CREATE TABLE notification_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  push_enabled BOOLEAN DEFAULT FALSE,
  email_enabled BOOLEAN DEFAULT TRUE,
  task_reminders_7_day BOOLEAN DEFAULT TRUE,
  task_reminders_3_day BOOLEAN DEFAULT TRUE,
  task_reminders_1_day BOOLEAN DEFAULT TRUE,
  partner_activity BOOLEAN DEFAULT TRUE,
  weekly_briefing BOOLEAN DEFAULT TRUE,
  weekly_briefing_day INTEGER DEFAULT 0, -- 0 = Sunday
  weekly_briefing_time TIME DEFAULT '09:00',
  quiet_hours_start TIME,
  quiet_hours_end TIME,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Push subscriptions (for web push)
CREATE TABLE push_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, endpoint)
);

-- Indexes for performance
CREATE INDEX idx_profiles_family_id ON profiles(family_id);
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_family_tasks_family_id ON family_tasks(family_id);
CREATE INDEX idx_family_tasks_status ON family_tasks(status);
CREATE INDEX idx_family_tasks_due_date ON family_tasks(due_date);
CREATE INDEX idx_baby_logs_family_id ON baby_logs(family_id);
CREATE INDEX idx_baby_logs_logged_at ON baby_logs(logged_at);
CREATE INDEX idx_baby_logs_type ON baby_logs(log_type);
CREATE INDEX idx_checklist_progress_family ON checklist_progress(family_id);
CREATE INDEX idx_families_invite_code ON families(invite_code);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to relevant tables
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_families_updated_at BEFORE UPDATE ON families FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_family_tasks_updated_at BEFORE UPDATE ON family_tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_family_budget_updated_at BEFORE UPDATE ON family_budget FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_notification_preferences_updated_at BEFORE UPDATE ON notification_preferences FOR EACH ROW EXECUTE FUNCTION update_updated_at();
