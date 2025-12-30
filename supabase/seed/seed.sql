-- ParentLogs Content Seed File
-- Run with: psql $DATABASE_URL -f supabase/seed/seed.sql

-- Clear existing template data
TRUNCATE task_templates, briefing_templates, budget_templates, checklist_templates, checklist_item_templates CASCADE;

-- Import seed files
\i 001_task_templates.sql
\i 002_briefing_templates.sql
\i 003_checklist_templates.sql
\i 004_budget_templates.sql

-- Verify counts
SELECT 'Task templates:' as table_name, COUNT(*) as count FROM task_templates
UNION ALL SELECT 'Briefing templates:', COUNT(*) FROM briefing_templates
UNION ALL SELECT 'Budget templates:', COUNT(*) FROM budget_templates
UNION ALL SELECT 'Checklists:', COUNT(*) FROM checklist_templates
UNION ALL SELECT 'Checklist items:', COUNT(*) FROM checklist_item_templates;

-- Expected counts:
-- Tasks: 215
-- Briefings: 62
-- Budget items: 29
-- Checklists: 15
-- Checklist items: 352
