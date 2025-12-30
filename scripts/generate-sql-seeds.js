#!/usr/bin/env node

/**
 * SQL Seed Generator for ParentLogs
 *
 * Reads JSON content files and generates SQL INSERT statements for Supabase.
 *
 * Usage: node scripts/generate-sql-seeds.js
 */

const fs = require('fs');
const path = require('path');

// Paths
const CONTENT_DIR = path.join(__dirname, '..', 'content');
const SEED_DIR = path.join(__dirname, '..', 'supabase', 'seed');

// Ensure seed directory exists
if (!fs.existsSync(SEED_DIR)) {
  fs.mkdirSync(SEED_DIR, { recursive: true });
}

/**
 * Escape single quotes for SQL
 */
function escapeSQL(str) {
  if (str === null || str === undefined) return 'NULL';
  return `'${String(str).replace(/'/g, "''")}'`;
}

/**
 * Convert array to PostgreSQL ARRAY syntax
 */
function toPostgresArray(arr) {
  if (!arr || arr.length === 0) return 'ARRAY[]::TEXT[]';
  const escaped = arr.map(item => escapeSQL(item).slice(1, -1)); // Remove outer quotes
  return `ARRAY['${escaped.join("', '")}']`;
}

/**
 * Map assignee values to enum
 */
function mapAssignee(assignee) {
  const mapping = {
    'Dad': 'dad',
    'dad': 'dad',
    'Mom': 'mom',
    'mom': 'mom',
    'Either': 'either',
    'either': 'either',
    'Both': 'both',
    'both': 'both'
  };
  return mapping[assignee] || 'either';
}

/**
 * Map priority values to enum
 */
function mapPriority(priority) {
  const mapping = {
    'Must-Do': 'must-do',
    'must-do': 'must-do',
    'Good-to-Do': 'good-to-do',
    'good-to-do': 'good-to-do'
  };
  return mapping[priority] || 'good-to-do';
}

/**
 * Map stage values to enum
 */
function mapStage(stage) {
  const mapping = {
    'pregnancy': 'pregnancy',
    'post-birth': 'post-birth',
    'newborn': 'post-birth',
    'infant': 'post-birth',
    'toddler': 'post-birth'
  };
  return mapping[stage] || 'pregnancy';
}

/**
 * Generate task_templates SQL
 */
function generateTasksSeed() {
  console.log('Generating task_templates seed...');

  const tasksPath = path.join(CONTENT_DIR, 'tasks.json');
  if (!fs.existsSync(tasksPath)) {
    console.warn('  tasks.json not found, skipping');
    return;
  }

  const tasks = JSON.parse(fs.readFileSync(tasksPath, 'utf-8'));

  let sql = `-- Task Templates Seed Data
-- Generated: ${new Date().toISOString()}
-- Source: content/tasks.json

`;

  tasks.forEach((task, index) => {
    sql += `INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  ${escapeSQL(task.task_id)},
  ${escapeSQL(task.title)},
  ${escapeSQL(task.description)},
  '${mapStage(task.stage)}',
  ${task.due_date_offset_days || 0},
  '${mapAssignee(task.assigned_to)}',
  ${escapeSQL(task.category)},
  '${mapPriority(task.priority)}',
  FALSE,
  ${index}
) ON CONFLICT (task_id) DO NOTHING;

`;
  });

  const outputPath = path.join(SEED_DIR, '001_task_templates.sql');
  fs.writeFileSync(outputPath, sql);
  console.log(`  Generated ${tasks.length} task templates → ${outputPath}`);
}

/**
 * Generate briefing_templates SQL
 */
function generateBriefingsSeed() {
  console.log('Generating briefing_templates seed...');

  const briefingsPath = path.join(CONTENT_DIR, 'briefings.json');
  if (!fs.existsSync(briefingsPath)) {
    console.warn('  briefings.json not found, skipping');
    return;
  }

  const briefings = JSON.parse(fs.readFileSync(briefingsPath, 'utf-8'));

  let sql = `-- Briefing Templates Seed Data
-- Generated: ${new Date().toISOString()}
-- Source: content/briefings.json

`;

  briefings.forEach((briefing) => {
    sql += `INSERT INTO briefing_templates (briefing_id, stage, week, title, baby_update, mom_update, dad_focus, relationship_tip, coming_up, medical_source, linked_task_ids, is_premium)
VALUES (
  ${escapeSQL(briefing.briefing_id)},
  '${mapStage(briefing.stage)}',
  ${briefing.week},
  ${escapeSQL(briefing.title)},
  ${escapeSQL(briefing.baby_update)},
  ${escapeSQL(briefing.mom_update)},
  ${toPostgresArray(briefing.dad_focus)},
  ${escapeSQL(briefing.relationship_tip)},
  ${escapeSQL(briefing.coming_up)},
  ${escapeSQL(briefing.medical_source)},
  ${toPostgresArray(briefing.linked_task_ids)},
  FALSE
) ON CONFLICT (briefing_id) DO NOTHING;

`;
  });

  const outputPath = path.join(SEED_DIR, '002_briefing_templates.sql');
  fs.writeFileSync(outputPath, sql);
  console.log(`  Generated ${briefings.length} briefing templates → ${outputPath}`);
}

/**
 * Generate checklist_templates and checklist_item_templates SQL
 */
function generateChecklistsSeed() {
  console.log('Generating checklist seeds...');

  const checklistsPath = path.join(CONTENT_DIR, 'checklists.json');
  if (!fs.existsSync(checklistsPath)) {
    console.warn('  checklists.json not found, skipping');
    return;
  }

  const checklists = JSON.parse(fs.readFileSync(checklistsPath, 'utf-8'));

  // Free checklists
  const FREE_CHECKLISTS = ['CL-01', 'CL-02', 'CL-03', 'CL-04', 'CL-12', 'CL-13', 'CL-14', 'CL-15'];

  let sql = `-- Checklist Templates Seed Data
-- Generated: ${new Date().toISOString()}
-- Source: content/checklists.json

-- Part 1: Checklist Templates (parent records)
`;

  // Generate checklist templates
  checklists.forEach((checklist, index) => {
    const isPremium = !FREE_CHECKLISTS.includes(checklist.checklist_id);

    sql += `INSERT INTO checklist_templates (checklist_id, name, description, stage, week_relevant, is_premium, sort_order)
VALUES (
  ${escapeSQL(checklist.checklist_id)},
  ${escapeSQL(checklist.name)},
  ${escapeSQL(checklist.description)},
  ${checklist.stage ? `'${mapStage(checklist.stage)}'` : 'NULL'},
  ${escapeSQL(checklist.week_relevant)},
  ${isPremium},
  ${index}
) ON CONFLICT (checklist_id) DO NOTHING;

`;
  });

  sql += `
-- Part 2: Checklist Item Templates (child records)
`;

  // Generate checklist item templates
  let itemCount = 0;
  checklists.forEach((checklist) => {
    if (!checklist.items || checklist.items.length === 0) return;

    checklist.items.forEach((item, itemIndex) => {
      const bringOrDo = item.action_type === 'bring' ? 'bring' : 'do';

      sql += `INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  ${escapeSQL(item.item_id)},
  ${escapeSQL(checklist.checklist_id)},
  ${escapeSQL(item.category)},
  ${escapeSQL(item.item)},
  ${escapeSQL(item.details)},
  ${item.required ? 'TRUE' : 'FALSE'},
  '${bringOrDo}',
  ${itemIndex}
) ON CONFLICT (item_id) DO NOTHING;

`;
      itemCount++;
    });
  });

  const outputPath = path.join(SEED_DIR, '003_checklist_templates.sql');
  fs.writeFileSync(outputPath, sql);
  console.log(`  Generated ${checklists.length} checklists, ${itemCount} items → ${outputPath}`);
}

/**
 * Generate budget_templates SQL
 */
function generateBudgetSeed() {
  console.log('Generating budget_templates seed...');

  const budgetPath = path.join(CONTENT_DIR, 'budget.json');
  if (!fs.existsSync(budgetPath)) {
    console.warn('  budget.json not found, skipping');
    return;
  }

  const budget = JSON.parse(fs.readFileSync(budgetPath, 'utf-8'));

  let sql = `-- Budget Templates Seed Data
-- Generated: ${new Date().toISOString()}
-- Source: content/budget.json

`;

  budget.forEach((item) => {
    // is_premium based on week_start (13-27 = free, else premium)
    const weekStart = item.week_start || 0;
    const isPremium = !(weekStart >= 13 && weekStart <= 27);

    // Convert prices from dollars to cents
    const priceLow = item.price_low ? item.price_low * 100 : null;
    const priceMid = item.price_mid ? item.price_mid * 100 : null;
    const priceHigh = item.price_high ? item.price_high * 100 : null;

    sql += `INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_low, price_mid, price_high, price_currency, notes, is_premium)
VALUES (
  ${escapeSQL(item.budget_id)},
  ${escapeSQL(item.category)},
  ${escapeSQL(item.subcategory)},
  ${escapeSQL(item.item)},
  ${escapeSQL(item.description)},
  '${mapStage(item.stage)}',
  ${item.week_start || 'NULL'},
  ${item.week_end || 'NULL'},
  ${escapeSQL(item.priority)},
  ${priceLow || 'NULL'},
  ${priceMid || 'NULL'},
  ${priceHigh || 'NULL'},
  ${escapeSQL(item.currency || 'USD')},
  ${escapeSQL(item.notes)},
  ${isPremium}
) ON CONFLICT (budget_id) DO NOTHING;

`;
  });

  const outputPath = path.join(SEED_DIR, '004_budget_templates.sql');
  fs.writeFileSync(outputPath, sql);
  console.log(`  Generated ${budget.length} budget items → ${outputPath}`);
}

/**
 * Main execution
 */
function main() {
  console.log('='.repeat(50));
  console.log('ParentLogs SQL Seed Generator');
  console.log('='.repeat(50));
  console.log(`Content directory: ${CONTENT_DIR}`);
  console.log(`Output directory: ${SEED_DIR}`);
  console.log('');

  try {
    generateTasksSeed();
    generateBriefingsSeed();
    generateChecklistsSeed();
    generateBudgetSeed();

    console.log('');
    console.log('='.repeat(50));
    console.log('Seed generation complete!');
    console.log('');
    console.log('To apply seeds to Supabase, run:');
    console.log('  psql $DATABASE_URL -f supabase/seed/001_task_templates.sql');
    console.log('  psql $DATABASE_URL -f supabase/seed/002_briefing_templates.sql');
    console.log('  psql $DATABASE_URL -f supabase/seed/003_checklist_templates.sql');
    console.log('  psql $DATABASE_URL -f supabase/seed/004_budget_templates.sql');
    console.log('');
    console.log('Or use the Supabase MCP tools to execute_sql with the file contents.');
    console.log('='.repeat(50));
  } catch (error) {
    console.error('Error generating seeds:', error);
    process.exit(1);
  }
}

main();
