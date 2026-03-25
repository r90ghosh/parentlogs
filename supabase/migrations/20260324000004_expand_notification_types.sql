-- Expand notification type CHECK to include new types
ALTER TABLE notifications
  DROP CONSTRAINT IF EXISTS notifications_type_check;
ALTER TABLE notifications
  ADD CONSTRAINT notifications_type_check
  CHECK (type IN (
    'daily_digest', 'task_reminder', 'overdue_alert', 'weekly_briefing',
    'partner_activity', 'milestone', 'onboarding', 'celebration',
    'mood_reminder', 're_engagement', 'system'
  ));
