-- =====================================================
-- Security Fixes Migration
-- Addresses: search_path on SECURITY DEFINER functions,
-- auth checks on RPC-callable functions, permissive
-- INSERT policy, missing FK indexes, RLS policy
-- performance (SELECT auth.uid()), and notifications
-- updated_at column.
-- =====================================================

-- =====================================================
-- 1. SET search_path on ALL SECURITY DEFINER functions
--    Recreate each with fully-qualified table names
-- =====================================================

-- 1a. get_user_family_id(UUID)
CREATE OR REPLACE FUNCTION get_user_family_id(user_uuid UUID)
RETURNS UUID AS $$
  SELECT family_id FROM public.profiles WHERE id = user_uuid;
$$ LANGUAGE sql SECURITY DEFINER STABLE SET search_path = '';

-- 1b. is_family_member(UUID)
CREATE OR REPLACE FUNCTION is_family_member(family_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
    AND family_id = family_uuid
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- 1c. is_premium_user()
CREATE OR REPLACE FUNCTION is_premium_user()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
    AND subscription_tier IN ('premium', 'lifetime')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- 1d. handle_new_user() — trigger function
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  );

  INSERT INTO public.notification_preferences (user_id)
  VALUES (NEW.id);

  INSERT INTO public.subscriptions (user_id, tier, status)
  VALUES (NEW.id, 'free', 'active');

  RETURN NEW;
EXCEPTION
  WHEN unique_violation THEN
    RETURN NEW;
  WHEN OTHERS THEN
    RAISE WARNING 'Error in handle_new_user: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- 1e. generate_family_tasks(UUID, DATE, DATE) — with auth check (section 2)
CREATE OR REPLACE FUNCTION generate_family_tasks(
  p_family_id UUID,
  p_due_date DATE DEFAULT NULL,
  p_birth_date DATE DEFAULT NULL
)
RETURNS INTEGER AS $$
DECLARE
  task_count INTEGER := 0;
  reference_date DATE;
  task_record RECORD;
BEGIN
  -- Auth check: caller must be a family member
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND family_id = p_family_id) THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  DELETE FROM public.family_tasks WHERE family_id = p_family_id AND is_custom = FALSE;

  reference_date := COALESCE(p_birth_date, p_due_date);

  IF reference_date IS NULL THEN
    RETURN 0;
  END IF;

  FOR task_record IN
    SELECT * FROM public.task_templates ORDER BY sort_order
  LOOP
    INSERT INTO public.family_tasks (
      family_id,
      task_template_id,
      title,
      description,
      due_date,
      assigned_to,
      priority,
      category,
      is_custom
    ) VALUES (
      p_family_id,
      task_record.task_id,
      task_record.title,
      task_record.description,
      reference_date + (task_record.due_date_offset_days || ' days')::INTERVAL,
      task_record.default_assignee,
      task_record.priority,
      task_record.category,
      FALSE
    );
    task_count := task_count + 1;
  END LOOP;

  RETURN task_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- 1f. regenerate_invite_code(UUID) — with auth check (section 2)
CREATE OR REPLACE FUNCTION regenerate_invite_code(p_family_id UUID)
RETURNS TEXT AS $$
DECLARE
  new_code TEXT;
BEGIN
  -- Auth check: caller must be the family owner
  IF NOT EXISTS (SELECT 1 FROM public.families WHERE id = p_family_id AND owner_id = auth.uid()) THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  new_code := UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 8));

  UPDATE public.families SET invite_code = new_code WHERE id = p_family_id;

  RETURN new_code;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- 1g. get_shift_briefing(UUID) — with auth check (section 2)
CREATE OR REPLACE FUNCTION get_shift_briefing(p_family_id UUID)
RETURNS JSONB AS $$
DECLARE
  result JSONB;
BEGIN
  -- Auth check: caller must be a family member
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND family_id = p_family_id) THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  SELECT jsonb_build_object(
    'last_feeding', (
      SELECT jsonb_build_object('logged_at', logged_at, 'data', log_data, 'by', p.full_name)
      FROM public.baby_logs bl
      JOIN public.profiles p ON p.id = bl.logged_by
      WHERE bl.family_id = p_family_id AND bl.log_type = 'feeding'
      ORDER BY bl.logged_at DESC LIMIT 1
    ),
    'last_diaper', (
      SELECT jsonb_build_object('logged_at', logged_at, 'data', log_data, 'by', p.full_name)
      FROM public.baby_logs bl
      JOIN public.profiles p ON p.id = bl.logged_by
      WHERE bl.family_id = p_family_id AND bl.log_type = 'diaper'
      ORDER BY bl.logged_at DESC LIMIT 1
    ),
    'last_sleep', (
      SELECT jsonb_build_object('logged_at', logged_at, 'data', log_data, 'by', p.full_name)
      FROM public.baby_logs bl
      JOIN public.profiles p ON p.id = bl.logged_by
      WHERE bl.family_id = p_family_id AND bl.log_type = 'sleep'
      ORDER BY bl.logged_at DESC LIMIT 1
    ),
    'last_medicine', (
      SELECT jsonb_build_object('logged_at', logged_at, 'data', log_data, 'by', p.full_name)
      FROM public.baby_logs bl
      JOIN public.profiles p ON p.id = bl.logged_by
      WHERE bl.family_id = p_family_id AND bl.log_type = 'medicine'
      ORDER BY bl.logged_at DESC LIMIT 1
    ),
    'today_stats', (
      SELECT jsonb_build_object(
        'feedings', COUNT(*) FILTER (WHERE log_type = 'feeding'),
        'diapers', COUNT(*) FILTER (WHERE log_type = 'diaper'),
        'sleep_logs', COUNT(*) FILTER (WHERE log_type = 'sleep')
      )
      FROM public.baby_logs
      WHERE family_id = p_family_id AND logged_at >= CURRENT_DATE
    )
  ) INTO result;

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- 1h. initialize_family_tasks_with_catchup(UUID, DATE, INTEGER) — with auth check (section 2)
CREATE OR REPLACE FUNCTION initialize_family_tasks_with_catchup(
  p_family_id UUID,
  p_due_date DATE,
  p_signup_week INTEGER
)
RETURNS INTEGER AS $$
DECLARE
  task_record RECORD;
  tasks_created INTEGER := 0;
  task_due_date DATE;
  task_week INTEGER;
  task_is_backlog BOOLEAN;
BEGIN
  -- Auth check: caller must be a family member
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND family_id = p_family_id) THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  FOR task_record IN
    SELECT * FROM public.task_templates
    WHERE stage IN ('pregnancy', 'first-trimester', 'second-trimester', 'third-trimester')
    ORDER BY COALESCE(week, 40 - (due_date_offset_days / 7)), sort_order
  LOOP
    task_week := COALESCE(task_record.week, 40 - (task_record.due_date_offset_days / 7));
    task_due_date := p_due_date - ((40 - task_week) * 7);
    task_is_backlog := task_week < p_signup_week;

    IF NOT EXISTS (
      SELECT 1 FROM public.family_tasks
      WHERE family_id = p_family_id
      AND task_template_id = task_record.task_id
    ) THEN
      INSERT INTO public.family_tasks (
        family_id,
        task_template_id,
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
        task_record.task_id,
        task_record.title,
        task_record.description,
        task_record.why_it_matters,
        task_due_date,
        task_week,
        task_record.default_assignee,
        task_record.category,
        task_record.priority,
        task_record.time_estimate_minutes,
        task_is_backlog,
        CASE WHEN task_is_backlog THEN 'pending' ELSE NULL END,
        'pending'
      );

      tasks_created := tasks_created + 1;
    END IF;
  END LOOP;

  RETURN tasks_created;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- =====================================================
-- 2. Auth checks on RPC-callable functions
--    (Already included inline in section 1 above)
--    - regenerate_invite_code: owner check
--    - generate_family_tasks: family member check
--    - initialize_family_tasks_with_catchup: family member check
--    - get_shift_briefing: family member check
-- =====================================================

-- =====================================================
-- 3. Fix profile INSERT policy
--    Replace permissive "System can insert profiles"
--    with scoped "Users can insert own profile"
-- =====================================================

DROP POLICY IF EXISTS "System can insert profiles" ON public.profiles;
CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK ((SELECT auth.uid()) = id);

-- =====================================================
-- 4. Add missing FK indexes
--    Only for columns not already indexed
-- =====================================================

-- family_tasks.task_template_id — FK to task_templates, not indexed
CREATE INDEX IF NOT EXISTS idx_family_tasks_template_id
  ON public.family_tasks(task_template_id);

-- family_budget.family_id — FK to families, not indexed
CREATE INDEX IF NOT EXISTS idx_family_budget_family_id
  ON public.family_budget(family_id);

-- family_budget.budget_template_id — FK to budget_templates, not indexed
CREATE INDEX IF NOT EXISTS idx_family_budget_template_id
  ON public.family_budget(budget_template_id);

-- checklist_progress.checked_by — FK to profiles, not indexed
CREATE INDEX IF NOT EXISTS idx_checklist_progress_checked_by
  ON public.checklist_progress(checked_by);

-- subscriptions.user_id — FK to profiles, UNIQUE already provides an index but
-- adding explicit one for clarity (UNIQUE constraint creates implicit index, so skip)
-- subscriptions already has UNIQUE(user_id) which serves as index

-- notification_preferences.user_id — UNIQUE(user_id) already provides index, skip

-- push_subscriptions.user_id — part of UNIQUE(user_id, endpoint), user_id is leading column, skip

-- checklist_item_templates.checklist_id — FK to checklist_templates, not indexed
CREATE INDEX IF NOT EXISTS idx_checklist_item_templates_checklist_id
  ON public.checklist_item_templates(checklist_id);

-- baby_logs.logged_by — FK to profiles, not indexed
CREATE INDEX IF NOT EXISTS idx_baby_logs_logged_by
  ON public.baby_logs(logged_by);

-- families.owner_id — FK to profiles, not indexed
CREATE INDEX IF NOT EXISTS idx_families_owner_id
  ON public.families(owner_id);

-- =====================================================
-- 5. Wrap auth.uid() in (SELECT auth.uid()) in RLS
--    policies for performance (prevents per-row eval)
-- =====================================================

-- --- profiles ---
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING ((SELECT auth.uid()) = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING ((SELECT auth.uid()) = id);

DROP POLICY IF EXISTS "Users can view family members" ON public.profiles;
CREATE POLICY "Users can view family members" ON public.profiles
  FOR SELECT USING (
    family_id IS NOT NULL AND family_id = get_user_family_id((SELECT auth.uid()))
  );

-- "Users can insert own profile" already created with (SELECT auth.uid()) in section 3

-- --- families ---
DROP POLICY IF EXISTS "Users can view own family" ON public.families;
CREATE POLICY "Users can view own family" ON public.families
  FOR SELECT USING (is_family_member(id));

DROP POLICY IF EXISTS "Users can update own family" ON public.families;
CREATE POLICY "Users can update own family" ON public.families
  FOR UPDATE USING (is_family_member(id));

DROP POLICY IF EXISTS "Users can create family" ON public.families;
CREATE POLICY "Users can create family" ON public.families
  FOR INSERT WITH CHECK ((SELECT auth.uid()) = owner_id);

-- --- family_tasks ---
DROP POLICY IF EXISTS "Users can view family tasks" ON public.family_tasks;
CREATE POLICY "Users can view family tasks" ON public.family_tasks
  FOR SELECT USING (is_family_member(family_id));

DROP POLICY IF EXISTS "Users can create family tasks" ON public.family_tasks;
CREATE POLICY "Users can create family tasks" ON public.family_tasks
  FOR INSERT WITH CHECK (is_family_member(family_id));

DROP POLICY IF EXISTS "Users can update family tasks" ON public.family_tasks;
CREATE POLICY "Users can update family tasks" ON public.family_tasks
  FOR UPDATE USING (is_family_member(family_id));

DROP POLICY IF EXISTS "Users can delete family tasks" ON public.family_tasks;
CREATE POLICY "Users can delete family tasks" ON public.family_tasks
  FOR DELETE USING (is_family_member(family_id));

-- --- baby_logs ---
DROP POLICY IF EXISTS "Users can view family logs" ON public.baby_logs;
CREATE POLICY "Users can view family logs" ON public.baby_logs
  FOR SELECT USING (is_family_member(family_id));

DROP POLICY IF EXISTS "Users can create family logs" ON public.baby_logs;
CREATE POLICY "Users can create family logs" ON public.baby_logs
  FOR INSERT WITH CHECK (is_family_member(family_id));

DROP POLICY IF EXISTS "Users can update own logs" ON public.baby_logs;
CREATE POLICY "Users can update own logs" ON public.baby_logs
  FOR UPDATE USING (logged_by = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can delete own logs" ON public.baby_logs;
CREATE POLICY "Users can delete own logs" ON public.baby_logs
  FOR DELETE USING (logged_by = (SELECT auth.uid()));

-- --- family_budget ---
DROP POLICY IF EXISTS "Users can view family budget" ON public.family_budget;
CREATE POLICY "Users can view family budget" ON public.family_budget
  FOR SELECT USING (is_family_member(family_id));

DROP POLICY IF EXISTS "Users can manage family budget" ON public.family_budget;
CREATE POLICY "Users can manage family budget" ON public.family_budget
  FOR ALL USING (is_family_member(family_id));

-- --- checklist_progress ---
DROP POLICY IF EXISTS "Users can view family checklist progress" ON public.checklist_progress;
CREATE POLICY "Users can view family checklist progress" ON public.checklist_progress
  FOR SELECT USING (is_family_member(family_id));

DROP POLICY IF EXISTS "Users can manage family checklist progress" ON public.checklist_progress;
CREATE POLICY "Users can manage family checklist progress" ON public.checklist_progress
  FOR ALL USING (is_family_member(family_id));

-- --- subscriptions ---
DROP POLICY IF EXISTS "Users can view own subscription" ON public.subscriptions;
CREATE POLICY "Users can view own subscription" ON public.subscriptions
  FOR SELECT USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can update own subscription" ON public.subscriptions;
CREATE POLICY "Users can update own subscription" ON public.subscriptions
  FOR UPDATE USING (user_id = (SELECT auth.uid()));

-- --- notification_preferences ---
DROP POLICY IF EXISTS "Users can view own preferences" ON public.notification_preferences;
CREATE POLICY "Users can view own preferences" ON public.notification_preferences
  FOR SELECT USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can manage own preferences" ON public.notification_preferences;
CREATE POLICY "Users can manage own preferences" ON public.notification_preferences
  FOR ALL USING (user_id = (SELECT auth.uid()));

-- --- push_subscriptions ---
DROP POLICY IF EXISTS "Users can manage own push subscriptions" ON public.push_subscriptions;
CREATE POLICY "Users can manage own push subscriptions" ON public.push_subscriptions
  FOR ALL USING (user_id = (SELECT auth.uid()));

-- --- notifications ---
DROP POLICY IF EXISTS "Users can view own notifications" ON public.notifications;
CREATE POLICY "Users can view own notifications" ON public.notifications
  FOR SELECT USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can update own notifications" ON public.notifications;
CREATE POLICY "Users can update own notifications" ON public.notifications
  FOR UPDATE USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can delete own notifications" ON public.notifications;
CREATE POLICY "Users can delete own notifications" ON public.notifications
  FOR DELETE USING (user_id = (SELECT auth.uid()));

-- Template tables: public read — no auth.uid() involved, no changes needed
-- (task_templates, briefing_templates, budget_templates, checklist_templates, checklist_item_templates)
-- Articles and videos also use FOR SELECT USING (true), no changes needed

-- =====================================================
-- 6. Add updated_at to notifications table
-- =====================================================

ALTER TABLE public.notifications
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

-- Add updated_at trigger for notifications
DROP TRIGGER IF EXISTS update_notifications_updated_at ON public.notifications;
CREATE TRIGGER update_notifications_updated_at
  BEFORE UPDATE ON public.notifications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
