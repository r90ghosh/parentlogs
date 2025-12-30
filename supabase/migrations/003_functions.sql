-- Function: Handle new user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  );

  -- Create default notification preferences
  INSERT INTO notification_preferences (user_id)
  VALUES (NEW.id);

  -- Create default subscription (free tier)
  INSERT INTO subscriptions (user_id, tier, status)
  VALUES (NEW.id, 'free', 'active');

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function: Generate family tasks from templates
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
  -- Delete existing template-based tasks for this family
  DELETE FROM family_tasks WHERE family_id = p_family_id AND is_custom = FALSE;

  -- Use birth_date if available, otherwise due_date
  reference_date := COALESCE(p_birth_date, p_due_date);

  IF reference_date IS NULL THEN
    RETURN 0;
  END IF;

  -- Insert tasks from templates
  FOR task_record IN
    SELECT * FROM task_templates ORDER BY sort_order
  LOOP
    INSERT INTO family_tasks (
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Calculate current week
CREATE OR REPLACE FUNCTION calculate_current_week(
  p_due_date DATE,
  p_birth_date DATE DEFAULT NULL
)
RETURNS INTEGER AS $$
DECLARE
  reference_date DATE;
  weeks INTEGER;
BEGIN
  IF p_birth_date IS NOT NULL THEN
    -- Post-birth: weeks since birth
    weeks := EXTRACT(DAYS FROM (CURRENT_DATE - p_birth_date))::INTEGER / 7;
  ELSIF p_due_date IS NOT NULL THEN
    -- Pregnancy: 40 weeks - weeks until due date
    weeks := 40 - (EXTRACT(DAYS FROM (p_due_date - CURRENT_DATE))::INTEGER / 7);
  ELSE
    weeks := 0;
  END IF;

  RETURN GREATEST(0, weeks);
END;
$$ LANGUAGE plpgsql;

-- Function: Regenerate invite code
CREATE OR REPLACE FUNCTION regenerate_invite_code(p_family_id UUID)
RETURNS TEXT AS $$
DECLARE
  new_code TEXT;
BEGIN
  new_code := UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 8));

  UPDATE families SET invite_code = new_code WHERE id = p_family_id;

  RETURN new_code;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Update family stage
CREATE OR REPLACE FUNCTION update_family_stage()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.birth_date IS NOT NULL AND NEW.stage = 'pregnancy' THEN
    NEW.stage := 'post-birth';
  END IF;

  NEW.current_week := calculate_current_week(NEW.due_date, NEW.birth_date);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_family_stage_trigger
  BEFORE UPDATE ON families
  FOR EACH ROW EXECUTE FUNCTION update_family_stage();

-- Function: Get shift briefing data
CREATE OR REPLACE FUNCTION get_shift_briefing(p_family_id UUID)
RETURNS JSONB AS $$
DECLARE
  result JSONB;
BEGIN
  SELECT jsonb_build_object(
    'last_feeding', (
      SELECT jsonb_build_object('logged_at', logged_at, 'data', log_data, 'by', p.full_name)
      FROM baby_logs bl
      JOIN profiles p ON p.id = bl.logged_by
      WHERE bl.family_id = p_family_id AND bl.log_type = 'feeding'
      ORDER BY bl.logged_at DESC LIMIT 1
    ),
    'last_diaper', (
      SELECT jsonb_build_object('logged_at', logged_at, 'data', log_data, 'by', p.full_name)
      FROM baby_logs bl
      JOIN profiles p ON p.id = bl.logged_by
      WHERE bl.family_id = p_family_id AND bl.log_type = 'diaper'
      ORDER BY bl.logged_at DESC LIMIT 1
    ),
    'last_sleep', (
      SELECT jsonb_build_object('logged_at', logged_at, 'data', log_data, 'by', p.full_name)
      FROM baby_logs bl
      JOIN profiles p ON p.id = bl.logged_by
      WHERE bl.family_id = p_family_id AND bl.log_type = 'sleep'
      ORDER BY bl.logged_at DESC LIMIT 1
    ),
    'last_medicine', (
      SELECT jsonb_build_object('logged_at', logged_at, 'data', log_data, 'by', p.full_name)
      FROM baby_logs bl
      JOIN profiles p ON p.id = bl.logged_by
      WHERE bl.family_id = p_family_id AND bl.log_type = 'medicine'
      ORDER BY bl.logged_at DESC LIMIT 1
    ),
    'today_stats', (
      SELECT jsonb_build_object(
        'feedings', COUNT(*) FILTER (WHERE log_type = 'feeding'),
        'diapers', COUNT(*) FILTER (WHERE log_type = 'diaper'),
        'sleep_logs', COUNT(*) FILTER (WHERE log_type = 'sleep')
      )
      FROM baby_logs
      WHERE family_id = p_family_id AND logged_at >= CURRENT_DATE
    )
  ) INTO result;

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
