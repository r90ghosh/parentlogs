-- Phase 2: Add email preference columns + notification preference expansion
ALTER TABLE notification_preferences
  ADD COLUMN IF NOT EXISTS email_weekly_briefing BOOLEAN DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS email_task_digest BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS email_lifecycle BOOLEAN DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS email_milestones BOOLEAN DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS preferred_notification_time TEXT DEFAULT '08:00',
  ADD COLUMN IF NOT EXISTS mood_reminders BOOLEAN DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS milestone_notifications BOOLEAN DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS onboarding_nudges BOOLEAN DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS re_engagement_emails BOOLEAN DEFAULT TRUE;
