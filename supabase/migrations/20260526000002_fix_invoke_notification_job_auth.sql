-- Fix: invoke_notification_job was using stale service_role_key from vault.
-- Switched to cron_webhook_secret which we control and won't rotate.

CREATE OR REPLACE FUNCTION public.invoke_notification_job(notification_type text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
DECLARE
  project_url TEXT;
  webhook_secret TEXT;
BEGIN
  SELECT decrypted_secret INTO project_url
  FROM vault.decrypted_secrets
  WHERE name = 'supabase_project_url'
  LIMIT 1;

  SELECT decrypted_secret INTO webhook_secret
  FROM vault.decrypted_secrets
  WHERE name = 'cron_webhook_secret'
  LIMIT 1;

  IF project_url IS NULL THEN
    RAISE WARNING 'supabase_project_url not found in vault.';
    RETURN;
  END IF;

  IF webhook_secret IS NULL THEN
    RAISE WARNING 'cron_webhook_secret not found in vault.';
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
      'Authorization', 'Bearer ' || webhook_secret
    )
  );
END;
$function$;
