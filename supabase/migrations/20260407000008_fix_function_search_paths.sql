-- Medium fix M2: Set search_path = '' on all remaining flagged functions to
-- prevent search-path injection. Functions that reference public objects are
-- recreated with fully qualified names.

-- update_updated_at_column: trivial trigger function, no public references.
ALTER FUNCTION public.update_updated_at_column() SET search_path = '';

-- update_updated_at: same.
ALTER FUNCTION public.update_updated_at() SET search_path = '';

-- initialize_family_tasks_with_catchup: still used by the onboarding/family
-- page. Recreate with public.* qualified table names so search_path = '' works.
CREATE OR REPLACE FUNCTION public.initialize_family_tasks_with_catchup(
  p_family_id uuid,
  p_due_date date,
  p_signup_week integer
)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
  task_record RECORD;
  tasks_created INTEGER := 0;
  task_due_date DATE;
  task_week INTEGER;
  task_is_backlog BOOLEAN;
BEGIN
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
        family_id, task_template_id, title, description, why_it_matters,
        due_date, week_due, assigned_to, category, priority,
        time_estimate_minutes, is_backlog, backlog_status, status
      ) VALUES (
        p_family_id, task_record.task_id, task_record.title, task_record.description,
        task_record.why_it_matters, task_due_date, task_week,
        task_record.default_assignee, task_record.category, task_record.priority,
        task_record.time_estimate_minutes, task_is_backlog,
        CASE WHEN task_is_backlog THEN 'pending' ELSE NULL END,
        'pending'
      );
      tasks_created := tasks_created + 1;
    END IF;
  END LOOP;

  RETURN tasks_created;
END;
$function$;
