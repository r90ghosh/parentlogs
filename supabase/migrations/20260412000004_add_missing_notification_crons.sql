-- Add missing notification cron jobs, partner-activity triggers, and notification cleanup
--
-- Part A: Expand invoke_notification_job() to accept new notification types
-- Part B: Schedule missing cron jobs
-- Part C: Database triggers for partner activity notifications
-- Part D: Notification cleanup cron

-- ============================================================================
-- Part A: Update invoke_notification_job() to accept the new notification types
-- ============================================================================

CREATE OR REPLACE FUNCTION public.invoke_notification_job(notification_type TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  project_url TEXT;
  service_key TEXT;
BEGIN
  SELECT decrypted_secret INTO project_url
  FROM vault.decrypted_secrets
  WHERE name = 'supabase_project_url'
  LIMIT 1;

  SELECT decrypted_secret INTO service_key
  FROM vault.decrypted_secrets
  WHERE name = 'service_role_key'
  LIMIT 1;

  IF project_url IS NULL THEN
    RAISE WARNING 'supabase_project_url not found in vault. Run: SELECT vault.create_secret(''supabase_project_url'', ''YOUR_URL'');';
    RETURN;
  END IF;

  IF service_key IS NULL THEN
    RAISE WARNING 'service_role_key not found in vault. Run: SELECT vault.create_secret(''service_role_key'', ''YOUR_KEY'');';
    RETURN;
  END IF;

  IF notification_type NOT IN (
    'daily_digest', 'task_reminder', 'overdue_alert', 'weekly_briefing',
    'milestone', 'onboarding_nudge', 'mood_reminder', 're_engagement',
    'push_window_warning', 'onboarding_drip', 'celebration'
  ) THEN
    RAISE EXCEPTION 'Unknown notification_type: %', notification_type;
  END IF;

  PERFORM net.http_post(
    url := project_url || '/functions/v1/send-notifications',
    body := jsonb_build_object('type', notification_type),
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || service_key
    )
  );
END;
$$;

-- Maintain restricted access
REVOKE EXECUTE ON FUNCTION public.invoke_notification_job(TEXT) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.invoke_notification_job(TEXT) FROM authenticated;
REVOKE EXECUTE ON FUNCTION public.invoke_notification_job(TEXT) FROM anon;

-- ============================================================================
-- Part B: Schedule missing cron jobs (idempotent: unschedule first)
-- ============================================================================

-- Milestone notifications — daily at 8 AM UTC
DO $$ BEGIN PERFORM cron.unschedule('notification-milestones'); EXCEPTION WHEN others THEN NULL; END $$;
SELECT cron.schedule('notification-milestones', '0 8 * * *',
  'SELECT public.invoke_notification_job(''milestone'')');

-- Onboarding nudges — every 6 hours (catch users in different timezones)
DO $$ BEGIN PERFORM cron.unschedule('notification-onboarding-nudges'); EXCEPTION WHEN others THEN NULL; END $$;
SELECT cron.schedule('notification-onboarding-nudges', '0 */6 * * *',
  'SELECT public.invoke_notification_job(''onboarding_nudge'')');

-- Mood reminders — daily at 6 PM UTC (evening check-in)
DO $$ BEGIN PERFORM cron.unschedule('notification-mood-reminders'); EXCEPTION WHEN others THEN NULL; END $$;
SELECT cron.schedule('notification-mood-reminders', '0 18 * * *',
  'SELECT public.invoke_notification_job(''mood_reminder'')');

-- Re-engagement — daily at 11 AM UTC
DO $$ BEGIN PERFORM cron.unschedule('notification-re-engagement'); EXCEPTION WHEN others THEN NULL; END $$;
SELECT cron.schedule('notification-re-engagement', '0 11 * * *',
  'SELECT public.invoke_notification_job(''re_engagement'')');

-- Push window warnings — daily at 9 AM UTC
DO $$ BEGIN PERFORM cron.unschedule('notification-push-window-warnings'); EXCEPTION WHEN others THEN NULL; END $$;
SELECT cron.schedule('notification-push-window-warnings', '0 9 * * *',
  'SELECT public.invoke_notification_job(''push_window_warning'')');

-- Onboarding drip emails — daily at 10 AM UTC
DO $$ BEGIN PERFORM cron.unschedule('notification-onboarding-drip'); EXCEPTION WHEN others THEN NULL; END $$;
SELECT cron.schedule('notification-onboarding-drip', '0 10 * * *',
  'SELECT public.invoke_notification_job(''onboarding_drip'')');

-- Celebration notifications — daily at 7 PM UTC (evening celebration)
DO $$ BEGIN PERFORM cron.unschedule('notification-celebrations'); EXCEPTION WHEN others THEN NULL; END $$;
SELECT cron.schedule('notification-celebrations', '0 19 * * *',
  'SELECT public.invoke_notification_job(''celebration'')');

-- ============================================================================
-- Part C: Database triggers for partner activity notifications
-- ============================================================================

-- Function to notify partner on family events via the partner-activity edge function
CREATE OR REPLACE FUNCTION public.notify_partner_activity()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_family_id UUID;
  v_partner_id UUID;
  v_project_url TEXT;
  v_service_key TEXT;
  v_event_type TEXT;
  v_event_data JSONB;
  v_actor_id UUID;
BEGIN
  -- Get project URL and service key from vault
  SELECT decrypted_secret INTO v_project_url
  FROM vault.decrypted_secrets WHERE name = 'supabase_project_url' LIMIT 1;

  SELECT decrypted_secret INTO v_service_key
  FROM vault.decrypted_secrets WHERE name = 'service_role_key' LIMIT 1;

  -- Silently skip if vault secrets are not configured
  IF v_project_url IS NULL OR v_service_key IS NULL THEN
    RETURN NEW;
  END IF;

  -- Determine event type and data based on trigger table
  IF TG_TABLE_NAME = 'family_tasks' THEN
    v_family_id := NEW.family_id;
    v_event_type := 'task_completed';
    v_event_data := jsonb_build_object('title', NEW.title);
    v_actor_id := NEW.completed_by;

    -- Find partner (other family member who is not the actor)
    IF v_actor_id IS NOT NULL THEN
      SELECT id INTO v_partner_id
      FROM public.profiles
      WHERE family_id = v_family_id
        AND id != v_actor_id
      LIMIT 1;
    END IF;

  ELSIF TG_TABLE_NAME = 'baby_logs' THEN
    v_family_id := NEW.family_id;
    v_event_type := 'baby_log';
    v_event_data := jsonb_build_object('log_type', NEW.log_type);
    v_actor_id := NEW.logged_by;

    -- Find partner
    SELECT id INTO v_partner_id
    FROM public.profiles
    WHERE family_id = v_family_id
      AND id != v_actor_id
    LIMIT 1;
  END IF;

  -- Only send if we have both an actor and a partner
  IF v_partner_id IS NULL OR v_actor_id IS NULL THEN
    RETURN NEW;
  END IF;

  -- Call partner-activity edge function via pg_net
  PERFORM net.http_post(
    url := v_project_url || '/functions/v1/partner-activity',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || v_service_key
    ),
    body := jsonb_build_object(
      'partner_id', v_partner_id,
      'actor_id', v_actor_id,
      'event_type', v_event_type,
      'event_data', v_event_data
    )
  );

  RETURN NEW;
END;
$$;

-- Trigger on task completion (UPDATE where status changes to 'completed')
DROP TRIGGER IF EXISTS trg_notify_partner_task_completed ON public.family_tasks;
CREATE TRIGGER trg_notify_partner_task_completed
  AFTER UPDATE ON public.family_tasks
  FOR EACH ROW
  WHEN (NEW.status = 'completed' AND OLD.status IS DISTINCT FROM 'completed')
  EXECUTE FUNCTION public.notify_partner_activity();

-- Trigger on baby log insertion
DROP TRIGGER IF EXISTS trg_notify_partner_baby_log ON public.baby_logs;
CREATE TRIGGER trg_notify_partner_baby_log
  AFTER INSERT ON public.baby_logs
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_partner_activity();

-- ============================================================================
-- Part D: Notification cleanup cron
-- ============================================================================

-- Clean up read notifications older than 90 days — runs weekly on Sundays at 4 AM UTC
DO $$ BEGIN PERFORM cron.unschedule('cleanup-old-notifications'); EXCEPTION WHEN others THEN NULL; END $$;
SELECT cron.schedule(
  'cleanup-old-notifications',
  '0 4 * * 0',
  $$DELETE FROM public.notifications WHERE is_read = true AND created_at < NOW() - INTERVAL '90 days'$$
);
