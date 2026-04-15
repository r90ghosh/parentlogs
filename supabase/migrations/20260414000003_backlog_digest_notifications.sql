-- Phase 2 of the post-birth backlog problem.
-- Daily digest gets scoped to "this week" in the edge function. Here we wire up
-- the new monthly backlog digest: preference column, notifications type CHECK,
-- invoke_notification_job whitelist, and the cron entry.

-- 1. Preference column — default on so everyone gets at least the monthly nudge.
ALTER TABLE public.notification_preferences
  ADD COLUMN IF NOT EXISTS monthly_backlog_digest BOOLEAN DEFAULT TRUE;

-- 2. Allow the new in-app notification type.
ALTER TABLE public.notifications
  DROP CONSTRAINT IF EXISTS notifications_type_check;
ALTER TABLE public.notifications
  ADD CONSTRAINT notifications_type_check
  CHECK (type IN (
    'daily_digest', 'task_reminder', 'overdue_alert', 'weekly_briefing',
    'partner_activity', 'milestone', 'onboarding', 'celebration',
    'mood_reminder', 're_engagement', 'backlog_digest', 'system'
  ));

-- 3. Extend the whitelist in invoke_notification_job so the cron can call it.
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
    RAISE WARNING 'supabase_project_url not found in vault.';
    RETURN;
  END IF;

  IF service_key IS NULL THEN
    RAISE WARNING 'service_role_key not found in vault.';
    RETURN;
  END IF;

  IF notification_type NOT IN (
    'daily_digest', 'task_reminder', 'overdue_alert', 'weekly_briefing',
    'milestone', 'onboarding_nudge', 'mood_reminder', 're_engagement',
    'push_window_warning', 'onboarding_drip', 'celebration',
    'monthly_backlog_digest'
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

REVOKE EXECUTE ON FUNCTION public.invoke_notification_job(TEXT) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.invoke_notification_job(TEXT) FROM authenticated;
REVOKE EXECUTE ON FUNCTION public.invoke_notification_job(TEXT) FROM anon;

-- 4. Schedule: 1st of every month at 10:00 UTC. Edge fn handles quiet hours per
--    user, so we don't need to fan out by timezone at the cron layer.
DO $$ BEGIN PERFORM cron.unschedule('notification-monthly-backlog-digest'); EXCEPTION WHEN others THEN NULL; END $$;
SELECT cron.schedule(
  'notification-monthly-backlog-digest',
  '0 10 1 * *',
  'SELECT public.invoke_notification_job(''monthly_backlog_digest'')'
);
