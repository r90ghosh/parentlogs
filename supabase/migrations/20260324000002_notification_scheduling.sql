-- Phase 1: Notification Scheduling via pg_cron
-- Enable pg_cron + pg_net, create helper function, schedule cron jobs
--
-- PREREQUISITE: Store the service role key in vault before cron jobs will work:
--   SELECT vault.create_secret('service_role_key', 'YOUR_SERVICE_ROLE_KEY_HERE');

-- 0. Store project URL in vault (idempotent — vault.create_secret errors on duplicate,
--    so we catch and ignore if it already exists)
DO $$
BEGIN
  PERFORM vault.create_secret('supabase_project_url', 'https://oeeeiquclwfpypojjigx.supabase.co');
EXCEPTION WHEN unique_violation THEN NULL;
END $$;

-- 1. Enable scheduling extensions
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA pg_catalog;
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- 2. Helper function to invoke the send-notifications edge function
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

  IF notification_type NOT IN ('daily_digest', 'task_reminder', 'overdue_alert', 'weekly_briefing') THEN
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

-- 2b. Revoke public access — only pg_cron (superuser) should invoke this
REVOKE EXECUTE ON FUNCTION public.invoke_notification_job(TEXT) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.invoke_notification_job(TEXT) FROM authenticated;
REVOKE EXECUTE ON FUNCTION public.invoke_notification_job(TEXT) FROM anon;

-- 3. Schedule cron jobs (idempotent: unschedule first, ignore if not exists)

-- Daily digest: every hour (edge function filters by user timezone in V2)
DO $$
BEGIN
  PERFORM cron.unschedule('notification-daily-digest');
EXCEPTION WHEN others THEN NULL;
END $$;
SELECT cron.schedule('notification-daily-digest', '0 * * * *',
  'SELECT public.invoke_notification_job(''daily_digest'')');

-- Task reminders: daily at 9 AM UTC
DO $$
BEGIN
  PERFORM cron.unschedule('notification-task-reminders');
EXCEPTION WHEN others THEN NULL;
END $$;
SELECT cron.schedule('notification-task-reminders', '0 9 * * *',
  'SELECT public.invoke_notification_job(''task_reminder'')');

-- Overdue alerts: daily at 10 AM UTC
DO $$
BEGIN
  PERFORM cron.unschedule('notification-overdue-alerts');
EXCEPTION WHEN others THEN NULL;
END $$;
SELECT cron.schedule('notification-overdue-alerts', '0 10 * * *',
  'SELECT public.invoke_notification_job(''overdue_alert'')');

-- Weekly briefing: Mondays at 8 AM UTC
DO $$
BEGIN
  PERFORM cron.unschedule('notification-weekly-briefing');
EXCEPTION WHEN others THEN NULL;
END $$;
SELECT cron.schedule('notification-weekly-briefing', '0 8 * * 1',
  'SELECT public.invoke_notification_job(''weekly_briefing'')');
