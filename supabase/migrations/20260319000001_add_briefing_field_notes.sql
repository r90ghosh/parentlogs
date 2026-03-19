-- Add field_notes column to briefing_templates for "real talk" dad tips
ALTER TABLE briefing_templates ADD COLUMN IF NOT EXISTS field_notes TEXT DEFAULT NULL;
