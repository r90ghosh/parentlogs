# ParentLogs Content Data

This directory contains the template content data for the ParentLogs application.

## Directory Structure

```
content/
  tasks.json          # Task templates (215 tasks)
  briefings.json      # Weekly briefing templates (62 briefings)
  checklists.json     # Checklist templates with items (15 checklists, 352 items)
  budget.json         # Budget item templates (29 items)
  manifest.json       # Content manifest with version and counts
  README.md           # This file
  source/             # TSV source files for content regeneration
    tasks.tsv
    budget.tsv
    checklist.tsv
    weekly_briefings.tsv
```

## Content Files

### tasks.json
Task templates organized by pregnancy stage and post-birth weeks. Each task includes:
- `task_id`: Unique identifier (e.g., "PREG-W10-001", "POST-W01-002")
- `title`: Task name
- `description`: Detailed description
- `stage`: pregnancy, post-birth, ongoing, or custom
- `due_date_offset_days`: Days offset from due date (DD) or birth date (BD)
- `assigned_to`: dad, mom, or either
- `category`: admin, health, home, gear, etc.
- `priority`: must-do or good-to-do

### briefings.json
Weekly briefing templates with curated content for each pregnancy/post-birth week:
- `briefing_id`: Unique identifier (e.g., "PREG-W04", "POST-W01")
- `stage`: pregnancy, newborn, infant, or toddler
- `week`: Week number
- `title`: Briefing title
- `baby_update`: Baby development information
- `mom_update`: Mom's health information
- `dad_focus`: Array of dad-specific action items
- `relationship_tip`: Relationship advice
- `coming_up`: Preview of upcoming events/milestones
- `medical_source`: Medical reference

### checklists.json
Reusable checklists for specific events (hospital bag, appointments, etc.):
- `checklist_id`: Unique identifier (e.g., "CL-01")
- `name`: Checklist name
- `description`: What this checklist is for
- `stage`: When this checklist is relevant
- `items`: Array of checklist items with details

### budget.json
Budget planning items with price ranges:
- `budget_id`: Unique identifier
- `category`: Gear, Medical, Childcare, etc.
- `item`: Item name
- `price_low/mid/high`: Price range in dollars
- `priority`: must-have or good-to-have
- `stage`: When to purchase

## Content Update Workflow

### Option 1: Update TSV Source Files (Recommended for bulk edits)

1. Edit the TSV files in `/content/source/`:
   - `tasks.tsv` - Add/edit task templates
   - `budget.tsv` - Add/edit budget items
   - `checklist.tsv` - Add/edit checklists and items
   - `weekly_briefings.tsv` - Add/edit weekly briefings

2. Regenerate JSON from TSV:
   ```bash
   python scripts/process_content.py
   ```

3. Regenerate SQL seed files (optional, for psql deployment):
   ```bash
   node scripts/generate-sql-seeds.js
   ```

4. Seed the database using the Edge Function:
   ```bash
   npm run db:seed:edge           # Add/update content
   npm run db:seed:edge:truncate  # Clear and re-seed all
   ```

### Option 2: Edit JSON Directly (Quick edits)

1. Edit the JSON files directly in `/content/`

2. Seed the database:
   ```bash
   npm run db:seed:edge           # Add/update content
   npm run db:seed:edge:truncate  # Clear and re-seed all
   ```

## TSV Column Reference

### tasks.tsv
| Column | Description | Example |
|--------|-------------|---------|
| Title | Task name | "Verify Prenatal Insurance" |
| Description | Detailed description | "Call insurer to confirm..." |
| Due Date Logic | Timing formula | "DD - 30 Weeks", "BD + 1 Day" |
| Auto-Assign | Who to assign | dad, mom, either |
| Category | Task category | admin, health, home |
| Priority | Importance | must-do, good-to-do |

### budget.tsv
| Column | Description | Example |
|--------|-------------|---------|
| category | Main category | Gear, Medical, Childcare |
| subcategory | Sub-category | Sleep, Feeding |
| item | Item name | "Crib" |
| description | Details | "Safe sleep space for baby" |
| stage | When needed | pregnancy, post-birth |
| week_start | Starting week | 20 |
| week_end | Ending week | 36 |
| priority | Importance | must-have, good-to-have |
| price_low | Low price | $100 |
| price_mid | Mid price | $250 |
| price_high | High price | $500 |
| price_currency | Currency | USD |
| notes | Additional info | "Look for JPMA certified" |
| affiliate_ready | For affiliate links | yes, no |

### checklist.tsv
| Column | Description | Example |
|--------|-------------|---------|
| checklist_id | Unique ID | CL-01 |
| checklist_name | Name | "Hospital Bag - Mom" |
| checklist_description | Description | "Essential items to pack..." |
| stage | When relevant | pregnancy |
| week_relevant | Week range | "36-40" |
| category | Item category | Comfort, Documents |
| item | Item name | "ID and Insurance Cards" |
| details | Item details | "Keep in easy-access pocket" |
| required | Is required | yes, no |
| bring_or_do | Action type | bring, do |

### weekly_briefings.tsv
| Column | Description | Example |
|--------|-------------|---------|
| Briefing_ID | Unique ID | PREG-W04 |
| Stage | pregnancy/newborn/infant/toddler | pregnancy |
| Timeline_Logic | When to show | DD-252 |
| Title | Briefing title | "Week 4: The Positive Test" |
| Baby_Update | Baby development | "Embryo is size of a poppy seed" |
| Mom_Update | Mom's changes | "Hormone changes beginning" |
| Dad_Focus | Dad action items | "Schedule first OB appointment" |
| Relationship_Tip | Advice | "Celebrate together privately" |
| Coming_Up | Preview | "First ultrasound in 4-6 weeks" |
| Medical_Source | Reference | "ACOG Guidelines 2024" |
| Linked_Tasks | Related task IDs | "PREG-W04-001" |

## Scripts

| Script | Description | Usage |
|--------|-------------|-------|
| `scripts/process_content.py` | Convert TSV to JSON | `python scripts/process_content.py` |
| `scripts/generate-sql-seeds.js` | Generate SQL from JSON | `node scripts/generate-sql-seeds.js` |
| `scripts/seed-via-edge-function.js` | Seed via Edge Function | `npm run db:seed:edge` |

## npm Scripts

```bash
# Generate SQL seed files from JSON
npm run db:generate-seeds

# Seed via Edge Function (recommended for production)
npm run db:seed:edge              # Add/update content
npm run db:seed:edge:truncate     # Clear and re-seed all

# Seed via psql (requires DATABASE_URL and psql)
npm run db:seed
```

## Environment Variables

For Edge Function seeding, ensure these are set in `.env.local`:
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `SEED_SECRET` - Secret for authenticating with the seed Edge Function

The `SEED_SECRET` must also be configured in your Supabase dashboard under Edge Function settings.
