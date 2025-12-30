-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE families ENABLE ROW LEVEL SECURITY;
ALTER TABLE family_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE baby_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE family_budget ENABLE ROW LEVEL SECURITY;
ALTER TABLE checklist_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;

-- Template tables are public read-only
ALTER TABLE task_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE briefing_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE checklist_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE checklist_item_templates ENABLE ROW LEVEL SECURITY;

-- Helper function: Check if user is family member
CREATE OR REPLACE FUNCTION is_family_member(family_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND family_id = family_uuid
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function: Check if user is premium
CREATE OR REPLACE FUNCTION is_premium_user()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND subscription_tier IN ('premium', 'lifetime')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can view family members" ON profiles FOR SELECT USING (
  family_id IN (SELECT family_id FROM profiles WHERE id = auth.uid())
);

-- Families policies
CREATE POLICY "Users can view own family" ON families FOR SELECT USING (is_family_member(id));
CREATE POLICY "Users can update own family" ON families FOR UPDATE USING (is_family_member(id));
CREATE POLICY "Users can create family" ON families FOR INSERT WITH CHECK (auth.uid() = owner_id);

-- Family tasks policies
CREATE POLICY "Users can view family tasks" ON family_tasks FOR SELECT USING (is_family_member(family_id));
CREATE POLICY "Users can create family tasks" ON family_tasks FOR INSERT WITH CHECK (is_family_member(family_id));
CREATE POLICY "Users can update family tasks" ON family_tasks FOR UPDATE USING (is_family_member(family_id));
CREATE POLICY "Users can delete family tasks" ON family_tasks FOR DELETE USING (is_family_member(family_id));

-- Baby logs policies
CREATE POLICY "Users can view family logs" ON baby_logs FOR SELECT USING (is_family_member(family_id));
CREATE POLICY "Users can create family logs" ON baby_logs FOR INSERT WITH CHECK (is_family_member(family_id));
CREATE POLICY "Users can update own logs" ON baby_logs FOR UPDATE USING (logged_by = auth.uid());
CREATE POLICY "Users can delete own logs" ON baby_logs FOR DELETE USING (logged_by = auth.uid());

-- Family budget policies
CREATE POLICY "Users can view family budget" ON family_budget FOR SELECT USING (is_family_member(family_id));
CREATE POLICY "Users can manage family budget" ON family_budget FOR ALL USING (is_family_member(family_id));

-- Checklist progress policies
CREATE POLICY "Users can view family checklist progress" ON checklist_progress FOR SELECT USING (is_family_member(family_id));
CREATE POLICY "Users can manage family checklist progress" ON checklist_progress FOR ALL USING (is_family_member(family_id));

-- Subscriptions policies
CREATE POLICY "Users can view own subscription" ON subscriptions FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can update own subscription" ON subscriptions FOR UPDATE USING (user_id = auth.uid());

-- Notification preferences policies
CREATE POLICY "Users can view own preferences" ON notification_preferences FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can manage own preferences" ON notification_preferences FOR ALL USING (user_id = auth.uid());

-- Push subscriptions policies
CREATE POLICY "Users can manage own push subscriptions" ON push_subscriptions FOR ALL USING (user_id = auth.uid());

-- Template tables: Public read access
CREATE POLICY "Anyone can view task templates" ON task_templates FOR SELECT USING (true);
CREATE POLICY "Anyone can view briefing templates" ON briefing_templates FOR SELECT USING (true);
CREATE POLICY "Anyone can view budget templates" ON budget_templates FOR SELECT USING (true);
CREATE POLICY "Anyone can view checklist templates" ON checklist_templates FOR SELECT USING (true);
CREATE POLICY "Anyone can view checklist item templates" ON checklist_item_templates FOR SELECT USING (true);
