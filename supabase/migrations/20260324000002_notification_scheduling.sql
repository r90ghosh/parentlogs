-- Phase 1: Notification Scheduling via pg_cron
-- Enable pg_cron + pg_net, create helper function, schedule cron jobs
--
-- PREREQUISITE: Store the service role key in vault before cron jobs will work:
--   SELECT vault.create_secret('service_role_key', 'YOUR_SERVICE_ROLE_KEY_HERE');

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
  project_url TEXT := 'https://oeeeiquclwfpypojjigx.supabase.co';
  service_key TEXT;
BEGIN
  SELECT decrypted_secret INTO service_key
  FROM vault.decrypted_secrets
  WHERE name = 'service_role_key'
  LIMIT 1;

  IF service_key IS NULL THEN
    RAISE WARNING 'service_role_key not found in vault. Run: SELECT vault.create_secret(''service_role_key'', ''YOUR_KEY'');';
    RETURN;
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

-- 3. Schedule cron jobs
-- Daily digest: every hour (edge function filters by user timezone in V2)
SELECT cron.schedule('notification-daily-digest', '0 * * * *',
  'SELECT public.invoke_notification_job(''daily_digest'')');

-- Task reminders: daily at 9 AM UTC
SELECT cron.schedule('notification-task-reminders', '0 9 * * *',
  'SELECT public.invoke_notification_job(''task_reminder'')');

-- Overdue alerts: daily at 10 AM UTC
SELECT cron.schedule('notification-overdue-alerts', '0 10 * * *',
  'SELECT public.invoke_notification_job(''overdue_alert'')');

-- Weekly briefing: Mondays at 8 AM UTC
SELECT cron.schedule('notification-weekly-briefing', '0 8 * * 1',
  'SELECT public.invoke_notification_job(''weekly_briefing'')');
