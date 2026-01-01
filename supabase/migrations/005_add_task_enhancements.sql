-- Migration: Add task enhancements for new UI
-- Adds time estimates and related article references

-- Add time estimate column to family_tasks
ALTER TABLE family_tasks
ADD COLUMN IF NOT EXISTS time_estimate_minutes INTEGER;

-- Add related article reference to family_tasks
ALTER TABLE family_tasks
ADD COLUMN IF NOT EXISTS related_article_slug TEXT;

-- Add time estimate column to task_templates
ALTER TABLE task_templates
ADD COLUMN IF NOT EXISTS time_estimate_minutes INTEGER;

-- Add related article reference to task_templates
ALTER TABLE task_templates
ADD COLUMN IF NOT EXISTS related_article_slug TEXT;

-- Add index for article lookups
CREATE INDEX IF NOT EXISTS idx_family_tasks_article
ON family_tasks(related_article_slug)
WHERE related_article_slug IS NOT NULL;

-- Add comments for documentation
COMMENT ON COLUMN family_tasks.time_estimate_minutes IS 'Estimated time to complete task in minutes';
COMMENT ON COLUMN family_tasks.related_article_slug IS 'Slug reference to related article for task context';
COMMENT ON COLUMN task_templates.time_estimate_minutes IS 'Default time estimate for this task template';
COMMENT ON COLUMN task_templates.related_article_slug IS 'Default related article for this task template';
