-- Budget Templates Seed Data (V2 — Full Rewrite from CSV)
-- Generated: 2026-03-18
-- Total items: 200
-- Uses ON CONFLICT (budget_id) DO UPDATE to upsert all rows

-- =============================================================================
-- 1ST TRIMESTER (7 items)
-- =============================================================================

-- 001: Prenatal Vitamins & Folic Acid
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-ADM-MED-001',
  'Admin',
  'Medical',
  'Prenatal Vitamins & Folic Acid',
  'Wife starts immediately; doctor recommended',
  'pregnancy',
  NULL,
  NULL,
  'must-have',
  'USD',
  NULL,
  false,
  '1st Trimester',
  0,
  0,
  'Varies',
  false,
  NULL,
  'Ritual Prenatal',
  'Nature Made, Garden of Life'
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 002: OB-GYN / Midwife Selection
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-ADM-MED-002',
  'Admin',
  'Medical',
  'OB-GYN / Midwife Selection',
  'Research and book first appointment; confirm insurance coverage',
  'pregnancy',
  NULL,
  NULL,
  'must-have',
  'USD',
  NULL,
  false,
  '1st Trimester',
  0,
  0,
  'Varies',
  false,
  NULL,
  NULL,
  NULL
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 003: Daycare Deposit
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-ADM-CHI-003',
  'Admin',
  'Childcare',
  'Daycare Deposit',
  'Secures waitlist spot. Critical for metro areas where waitlists exceed 9 months. Do this immediately after the 12-week scan.',
  'pregnancy',
  NULL,
  NULL,
  'must-have',
  'USD',
  NULL,
  false,
  '1st Trimester',
  0,
  0,
  'Varies',
  false,
  NULL,
  NULL,
  NULL
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 004: Housing Assessment
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-ADM-PLN-004',
  'Admin',
  'Planning',
  'Housing Assessment',
  'Evaluate current space: room for baby, nearby hospitals/clinics, driving distance to work, nearby parks',
  'pregnancy',
  NULL,
  NULL,
  'tip',
  'USD',
  NULL,
  false,
  '1st Trimester',
  0,
  0,
  'Varies',
  false,
  NULL,
  NULL,
  NULL
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 005: Maternity Clothes
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-MOM-MAT-005',
  'Mom',
  'Maternity',
  'Maternity Clothes',
  'Comfortable everyday wear — stretchy pants, belly-friendly tops, dresses. Start buying around 10-14 weeks as bump shows.',
  'pregnancy',
  NULL,
  NULL,
  'must-have',
  'USD',
  NULL,
  false,
  '1st Trimester',
  30000,
  100000,
  '$300-$1000',
  false,
  NULL,
  'Seraphine',
  'Target Ingrid & Isabel, Amazon Motherhood Maternity'
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 006: Maternity Bras
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-MOM-MAT-006',
  'Mom',
  'Maternity',
  'Maternity Bras',
  'Supportive, wire-free bras that accommodate size changes throughout pregnancy. Buy 2-3 to start.',
  'pregnancy',
  NULL,
  NULL,
  'must-have',
  'USD',
  NULL,
  false,
  '1st Trimester',
  5800,
  12000,
  '$58-$120',
  false,
  NULL,
  'Kindred Bravely Busty Sublime',
  'Motherhood Maternity, Bravado Designs'
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 007: Maternity Underwear
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-MOM-MAT-007',
  'Mom',
  'Maternity',
  'Maternity Underwear',
  'Under-belly or over-belly styles. Cotton/breathable fabric. Buy a multi-pack.',
  'pregnancy',
  NULL,
  NULL,
  'must-have',
  'USD',
  NULL,
  false,
  '1st Trimester',
  6000,
  20000,
  '$60-$200',
  false,
  NULL,
  'Kindred Bravely',
  'Innersy Maternity Underwear (Amazon)'
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- =============================================================================
-- 2ND TRIMESTER (80 items)
-- =============================================================================

-- 008: Life Insurance
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-ADM-LEG-008',
  'Admin',
  'Legal',
  'Life Insurance',
  'Term life policy for both parents (10x annual income). Apply before birth to avoid medical delays. Price is annual premium.',
  'pregnancy',
  NULL,
  NULL,
  'good-to-have',
  'USD',
  NULL,
  false,
  '2nd Trimester',
  0,
  0,
  'Varies',
  false,
  NULL,
  'LegalZoom (DIY)',
  'Local attorney'
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 009: Will & Estate Plan
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-ADM-LEG-009',
  'Admin',
  'Legal',
  'Will & Estate Plan',
  'Legal guardianship designation for the child. Essential for asset protection.',
  'pregnancy',
  NULL,
  NULL,
  'good-to-have',
  'USD',
  NULL,
  false,
  '2nd Trimester',
  0,
  0,
  'Varies',
  false,
  NULL,
  'LegalZoom (DIY)',
  'Local attorney'
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 010: Changing Station
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-BAB-DIA-010',
  'Baby Care',
  'Diapering',
  'Changing Station',
  'Dedicated changing area at home; can use dresser top with changing pad',
  'pregnancy',
  NULL,
  NULL,
  'good-to-have',
  'USD',
  NULL,
  false,
  '2nd Trimester',
  13000,
  140000,
  '$130-$1400',
  false,
  NULL,
  'West Elm Gwyn Changing Table',
  NULL
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 011: Diapers (Newborn → age appropriate)
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-BAB-DIA-011',
  'Baby Care',
  'Diapering',
  'Diapers (Newborn → age appropriate)',
  'Stock newborn size but don''t overbuy; baby grows out of NB in 2-4 weeks',
  'pregnancy',
  NULL,
  NULL,
  'must-have',
  'USD',
  NULL,
  false,
  '2nd Trimester',
  3000,
  8000,
  '$30-$80',
  false,
  NULL,
  'Coterie',
  'Target Up & Up , Amazon Mama Bear, Costco Kirkland'
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 012: Diaper Cream
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-BAB-DIA-012',
  'Baby Care',
  'Diapering',
  'Diaper Cream',
  'Prevents diaper rash',
  'pregnancy',
  NULL,
  NULL,
  'must-have',
  'USD',
  NULL,
  false,
  '2nd Trimester',
  1200,
  2000,
  '$12-$20',
  false,
  NULL,
  'Honest Company',
  'Aquaphor, Desitin'
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 013: Wet Wipes
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-BAB-DIA-013',
  'Baby Care',
  'Diapering',
  'Wet Wipes',
  'Unscented recommended for newborns',
  'pregnancy',
  NULL,
  NULL,
  'must-have',
  'USD',
  NULL,
  false,
  '2nd Trimester',
  4000,
  13200,
  '$40-$132',
  false,
  NULL,
  'Coterie The Wipe',
  'The Honest Company Wipes, Waterwipes'
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 014: Washcloths
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-BAB-DIA-014',
  'Baby Care',
  'Diapering',
  'Washcloths',
  'Soft cotton; multiple packs needed',
  'pregnancy',
  NULL,
  NULL,
  'must-have',
  'USD',
  NULL,
  false,
  '2nd Trimester',
  4000,
  16000,
  '$40-$160',
  false,
  NULL,
  'Quince Organic Turkish Cotton Baby Washcloths',
  NULL
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 015: Diaper Pail
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-BAB-DIA-015',
  'Baby Care',
  'Diapering',
  'Diaper Pail',
  'Odor-locking trash can. Steel is better than plastic for smell. Factor in cost of specialty bags.',
  'pregnancy',
  NULL,
  NULL,
  'good-to-have',
  'USD',
  NULL,
  false,
  '2nd Trimester',
  3000,
  7000,
  '$30-$70',
  false,
  NULL,
  'Ubbi (steel)',
  'Diaper Genie (plastic)'
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 016: Diaper Bag
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-BAB-DIA-016',
  'Baby Care',
  'Diapering',
  'Diaper Bag',
  'Backpack style preferred for dads — hands-free. Needs insulated bottle pocket, changing pad, and lots of compartments.',
  'pregnancy',
  NULL,
  NULL,
  'must-have',
  'USD',
  NULL,
  false,
  '2nd Trimester',
  8000,
  40000,
  '$80-$400',
  false,
  NULL,
  'caraa diaper backpack',
  'Skip Hop Forma Backpack'
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 017: Portable Changing Pad
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-BAB-DIA-017',
  'Baby Care',
  'Diapering',
  'Portable Changing Pad',
  'Foldable pad for diaper changes on the go. Fits inside diaper bag.',
  'pregnancy',
  NULL,
  NULL,
  'must-have',
  'USD',
  NULL,
  false,
  '2nd Trimester',
  3000,
  15000,
  '$30-$150',
  false,
  NULL,
  'Keekaroo Travel Pad',
  'Skip Hop Pronto'
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 018: Bottles (Nipples: Newborn → age appropriate) 8
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-BAB-FED-018',
  'Baby Care',
  'Feeding',
  'Bottles (Nipples: Newborn → age appropriate) 8',
  'Start with newborn-flow nipples. Get a sampler pack first; babies are picky about nipple shape.',
  'pregnancy',
  NULL,
  NULL,
  'must-have',
  'USD',
  NULL,
  false,
  '2nd Trimester',
  5000,
  5200,
  '$50-$52',
  false,
  NULL,
  'Comotomo',
  'Philips Avent, Dr Brown'
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 019: Formula
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-BAB-FED-019',
  'Baby Care',
  'Feeding',
  'Formula',
  'Have backup even if planning to breastfeed; fed is best',
  'pregnancy',
  NULL,
  NULL,
  'must-have',
  'USD',
  NULL,
  false,
  '2nd Trimester',
  10000,
  10000,
  '$100',
  false,
  NULL,
  'Bobbie Organic',
  'Enfamil, Similac'
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 020: Breast Pump
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-BAB-FED-020',
  'Baby Care',
  'Feeding',
  'Breast Pump',
  'Electric pump for milk extraction. Often free via insurance (ACA). Check coverage first before buying.',
  'pregnancy',
  NULL,
  NULL,
  'must-have',
  'USD',
  NULL,
  false,
  '2nd Trimester',
  25000,
  35000,
  '$250-$350',
  false,
  NULL,
  'Willow 3.0 Wearable Breast Pump',
  'Spectra S1 Plus'
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 021: Bottle Cleaner / Sterilizer
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-BAB-FED-021',
  'Baby Care',
  'Feeding',
  'Bottle Cleaner / Sterilizer',
  'Electric sterilizer saves time',
  'pregnancy',
  NULL,
  NULL,
  'good-to-have',
  'USD',
  NULL,
  false,
  '2nd Trimester',
  25000,
  30000,
  '$250-$300',
  false,
  NULL,
  'Momcozy KleanPal Pro',
  'Baby Brezza Bottle Washer Pro'
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 022: Bottle Soap / Cleaner Agent
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-BAB-FED-022',
  'Baby Care',
  'Feeding',
  'Bottle Soap / Cleaner Agent',
  'Dedicated baby-safe dish soap',
  'pregnancy',
  NULL,
  NULL,
  'must-have',
  'USD',
  NULL,
  false,
  '2nd Trimester',
  1500,
  1800,
  '$15-$18',
  false,
  NULL,
  'Dapple Baby',
  'Babyganics Dish Soap'
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 023: Nursing Pillow
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-BAB-FED-023',
  'Baby Care',
  'Feeding',
  'Nursing Pillow',
  'Support pillow for breastfeeding/bottle-feeding. Also useful for tummy time and propping.',
  'pregnancy',
  NULL,
  NULL,
  'good-to-have',
  'USD',
  NULL,
  false,
  '2nd Trimester',
  2000,
  7000,
  '$20-$70',
  false,
  NULL,
  'My Brest Friend',
  'Boppy Original'
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 024: Breast Milk Storage Bags
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-BAB-FED-024',
  'Baby Care',
  'Feeding',
  'Breast Milk Storage Bags',
  'For storing pumped milk. Pre-sterilized bags that lay flat in freezer. Buy 100+ count.',
  'pregnancy',
  NULL,
  NULL,
  'must-have',
  'USD',
  NULL,
  false,
  '2nd Trimester',
  3000,
  3000,
  '$30',
  false,
  NULL,
  'Lansinoh',
  'Medela'
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 025: Nursing Pads
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-BAB-FED-025',
  'Baby Care',
  'Feeding',
  'Nursing Pads',
  'Disposable or reusable pads to catch leaks. Stock up — mom will go through a lot in the first months.',
  'pregnancy',
  NULL,
  NULL,
  'must-have',
  'USD',
  NULL,
  false,
  '2nd Trimester',
  5000,
  10000,
  '$50-$100',
  false,
  NULL,
  'frida mom ice pads',
  'Lansinoh Disposable'
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 026: Nipple Cream
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-BAB-FED-026',
  'Baby Care',
  'Feeding',
  'Nipple Cream',
  'Lanolin-based cream for cracked/sore nipples from nursing. Start using from day one.',
  'pregnancy',
  NULL,
  NULL,
  'must-have',
  'USD',
  NULL,
  false,
  '2nd Trimester',
  1400,
  4000,
  '$14-$40',
  false,
  NULL,
  'sunbornorganics',
  'Earth Mama Organic Nipple Butter'
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 027: Burp Cloths
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-BAB-FED-027',
  'Baby Care',
  'Feeding',
  'Burp Cloths',
  'Buy 10-12 minimum. Muslin or cotton. You will go through 4-6 per day easily.',
  'pregnancy',
  NULL,
  NULL,
  'good-to-have',
  'USD',
  NULL,
  false,
  '2nd Trimester',
  1500,
  4500,
  '$15-$45',
  false,
  NULL,
  'Aden + Anais Muslin',
  'Gerber Birdseye Cloth'
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 028: Portable Bottle Warmer
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-BAB-FED-028',
  'Baby Care',
  'Feeding',
  'Portable Bottle Warmer',
  'Battery/USB-powered warmer for on-the-go feeds. Essential for travel, car rides, and outings.',
  'pregnancy',
  NULL,
  NULL,
  'good-to-have',
  'USD',
  NULL,
  false,
  '2nd Trimester',
  5000,
  10000,
  '$50-$100',
  false,
  NULL,
  'Baby''s Brew Portable Warmer',
  'Philips avent bottle warmer'
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 029: Baby Bathwash Gel
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-BAB-BAT-029',
  'Baby Care',
  'Bathing',
  'Baby Bathwash Gel',
  'Fragrance-free for sensitive skin',
  'pregnancy',
  NULL,
  NULL,
  'must-have',
  'USD',
  NULL,
  false,
  '2nd Trimester',
  800,
  2000,
  '$8-$20',
  false,
  NULL,
  'CeraVe Baby, Mustela Cleansing Oil',
  'Johnson''s, Cetaphil, Aveeno'
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 030: Baby Shampoo
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-BAB-BAT-030',
  'Baby Care',
  'Bathing',
  'Baby Shampoo',
  'Tear-free formula',
  'pregnancy',
  NULL,
  NULL,
  'must-have',
  'USD',
  NULL,
  false,
  '2nd Trimester',
  800,
  2100,
  '$8-$21',
  false,
  NULL,
  'Mustela',
  'Aveeno'
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 031: Baby Body Cream / Lotion
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-BAB-BAT-031',
  'Baby Care',
  'Bathing',
  'Baby Body Cream / Lotion',
  'Moisturize after every bath',
  'pregnancy',
  NULL,
  NULL,
  'must-have',
  'USD',
  NULL,
  false,
  '2nd Trimester',
  900,
  1000,
  '$9-$10',
  false,
  NULL,
  'CeraVe',
  'Aveeno Baby Daily Moisture, Aquaphor'
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 032: Baby Towel
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-BAB-BAT-032',
  'Baby Care',
  'Bathing',
  'Baby Towel',
  'Hooded towels work great',
  'pregnancy',
  NULL,
  NULL,
  'good-to-have',
  'USD',
  NULL,
  false,
  '2nd Trimester',
  5000,
  12000,
  '$50-$120',
  false,
  NULL,
  'Quince Organic Turkish Cotton Baby Hooded Towel',
  'Momcozy Baby Hooded Towel'
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 033: Baby Bathtub
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-BAB-BAT-033',
  'Baby Care',
  'Bathing',
  'Baby Bathtub',
  'Infant-to-toddler tub with sling support',
  'pregnancy',
  NULL,
  NULL,
  'must-have',
  'USD',
  NULL,
  false,
  '2nd Trimester',
  2000,
  5000,
  '$20-$50',
  false,
  NULL,
  'Puj Tub',
  'The First Years Sure Comfort'
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 034: Bath Toys
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-BAB-BAT-034',
  'Baby Care',
  'Bathing',
  'Bath Toys',
  'Not needed until 3-6 months+',
  'pregnancy',
  NULL,
  NULL,
  'good-to-have',
  'USD',
  NULL,
  false,
  '2nd Trimester',
  0,
  0,
  'Varies',
  false,
  NULL,
  NULL,
  NULL
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 035: Baby Bandaids
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-BAB-FAI-035',
  'Baby Care',
  'First Aid',
  'Baby Bandaids',
  'Soft fabric; newborn-safe',
  'pregnancy',
  NULL,
  NULL,
  'must-have',
  'USD',
  NULL,
  false,
  '2nd Trimester',
  0,
  0,
  'Varies',
  false,
  NULL,
  NULL,
  NULL
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 036: Thermometer (armpit + forehead)
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-BAB-FAI-036',
  'Baby Care',
  'First Aid',
  'Thermometer (armpit + forehead)',
  'Rectal thermometer most accurate for newborns. Fever in newborn (<3mo) is an ER trip.',
  'pregnancy',
  NULL,
  NULL,
  'must-have',
  'USD',
  NULL,
  false,
  '2nd Trimester',
  1400,
  6000,
  '$14-$60',
  false,
  NULL,
  'Exergen Temporal Artery Thermometer',
  'FridaBaby Quick-Read Digital Rectal'
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 037: Baby Tylenol
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-BAB-FAI-037',
  'Baby Care',
  'First Aid',
  'Baby Tylenol',
  'Consult doctor before use; keep on hand',
  'pregnancy',
  NULL,
  NULL,
  'doctor',
  'USD',
  NULL,
  false,
  '2nd Trimester',
  0,
  0,
  'Varies',
  false,
  NULL,
  NULL,
  NULL
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 038: Nasal Aspirator (NoseFrida)
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-BAB-FAI-038',
  'Baby Care',
  'First Aid',
  'Nasal Aspirator (NoseFrida)',
  'Nasal suction for congestion',
  'pregnancy',
  NULL,
  NULL,
  'must-have',
  'USD',
  NULL,
  false,
  '2nd Trimester',
  2100,
  5000,
  '$21-$50',
  false,
  NULL,
  'Momcozy nasal aspirator',
  'Nosefrida'
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 039: Nail Clippers / File
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-BAB-FAI-039',
  'Baby Care',
  'First Aid',
  'Nail Clippers / File',
  'Baby-specific; those nails are razor sharp',
  'pregnancy',
  NULL,
  NULL,
  'must-have',
  'USD',
  NULL,
  false,
  '2nd Trimester',
  1300,
  4000,
  '$13-$40',
  false,
  NULL,
  'FridaBaby NailFrida Electric',
  'FridaBaby NailFrida'
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 040: Saline Drops
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-BAB-FAI-040',
  'Baby Care',
  'First Aid',
  'Saline Drops',
  'Loosens congestion before using aspirator. Essential companion to NoseFrida.',
  'pregnancy',
  NULL,
  NULL,
  'must-have',
  'USD',
  NULL,
  false,
  '2nd Trimester',
  500,
  500,
  '$5',
  false,
  NULL,
  'Little Remedies Saline Drops',
  'Simply Saline Baby'
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 041: Humidifier (Cool Mist)
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-BAB-FAI-041',
  'Baby Care',
  'First Aid',
  'Humidifier (Cool Mist)',
  'Helps with congestion, dry air, and croup. Run in nursery during sleep. Clean weekly to prevent mold.',
  'pregnancy',
  NULL,
  NULL,
  'good-to-have',
  'USD',
  NULL,
  false,
  '2nd Trimester',
  8500,
  16000,
  '$85-$160',
  false,
  NULL,
  'Canopy Humidifier',
  'Honeywell HCM-350'
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 042: Pacifiers
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-BAB-FAI-042',
  'Baby Care',
  'First Aid',
  'Pacifiers',
  'Orthodontic-style recommended. Buy 3-4; baby may reject some brands. Wait until breastfeeding is established (~4 weeks).',
  'pregnancy',
  NULL,
  NULL,
  'good-to-have',
  'USD',
  NULL,
  false,
  '2nd Trimester',
  800,
  900,
  '$8-$9',
  false,
  NULL,
  'MAM Original',
  'Philips Avent Soothie'
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 043: Crib
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-NUR-FUR-043',
  'Nursery',
  'Furniture',
  'Crib',
  'Ensure meets current safety standards. Avoid drop-sides (banned). Order early — lead times can be 8-12 weeks.',
  'pregnancy',
  NULL,
  NULL,
  'must-have',
  'USD',
  NULL,
  false,
  '2nd Trimester',
  24000,
  120000,
  '$240-$1200',
  false,
  NULL,
  'SNOO Smart Bassinet, CradleWise',
  'Chicco Lullaby Playard'
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 044: Crib Mattress
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-NUR-FUR-044',
  'Nursery',
  'Furniture',
  'Crib Mattress',
  'Firm, flat surface — no memory foam. Two-finger test: no more than 2 fingers between mattress and crib.',
  'pregnancy',
  NULL,
  NULL,
  'must-have',
  'USD',
  NULL,
  false,
  '2nd Trimester',
  28000,
  30000,
  '$280-$300',
  false,
  NULL,
  'Naturepedic, Avocado',
  'Newton Baby, Lullaby Earth'
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 045: Crib Sheets
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-NUR-FUR-045',
  'Nursery',
  'Furniture',
  'Crib Sheets',
  'Buy 2-3 sets for rotation',
  'pregnancy',
  NULL,
  NULL,
  'must-have',
  'USD',
  NULL,
  false,
  '2nd Trimester',
  7500,
  17000,
  '$75-$170',
  false,
  NULL,
  'Nestig crib sheets',
  'Momcozy crib sheets'
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 046: Dresser / Changing Table Combo
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-NUR-FUR-046',
  'Nursery',
  'Furniture',
  'Dresser / Changing Table Combo',
  'Doubles as changing station; long-term furniture piece',
  'pregnancy',
  NULL,
  NULL,
  'good-to-have',
  'USD',
  NULL,
  false,
  '2nd Trimester',
  10000,
  80000,
  '$100-$800',
  false,
  NULL,
  'Babyletto Hudson Changer Dresser',
  'IKEA Hemnes + changing pad'
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 047: Glider / Rocker
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-NUR-FUR-047',
  'Nursery',
  'Furniture',
  'Glider / Rocker',
  'Chair for feeding/soothing. Test for ability to stand up without using hands (you will be holding a baby).',
  'pregnancy',
  NULL,
  NULL,
  'good-to-have',
  'USD',
  NULL,
  false,
  '2nd Trimester',
  20000,
  180000,
  '$200-$1800',
  false,
  NULL,
  'Pottery Barn Kids Dream Deluxe Power Swivel Recliner',
  'Naomi Home Brisbane Glider'
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 048: Blackout Curtains
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-NUR-DEC-048',
  'Nursery',
  'Decor',
  'Blackout Curtains',
  'Room darkening shades to extend sleep cycles. Pitch black room = longer naps.',
  'pregnancy',
  NULL,
  NULL,
  'good-to-have',
  'USD',
  NULL,
  false,
  '2nd Trimester',
  5000,
  20000,
  '$50-$200',
  false,
  NULL,
  'Pottery Barn Kids',
  'IKEA Majgull'
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 049: Wallpapers / Wall Decals
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-NUR-DEC-049',
  'Nursery',
  'Decor',
  'Wallpapers / Wall Decals',
  'Set up in 2nd trimester before nesting urge',
  'pregnancy',
  NULL,
  NULL,
  'good-to-have',
  'USD',
  NULL,
  false,
  '2nd Trimester',
  0,
  0,
  'Varies',
  false,
  NULL,
  NULL,
  NULL
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 050: Sound Machine
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-NUR-DEC-050',
  'Nursery',
  'Decor',
  'Sound Machine',
  'White noise for sleep; game changer',
  'pregnancy',
  NULL,
  NULL,
  'must-have',
  'USD',
  NULL,
  false,
  '2nd Trimester',
  9000,
  10000,
  '$90-$100',
  false,
  NULL,
  'Hatch Rest+',
  'Yogasleep Dohm'
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 051: Night Light
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-NUR-DEC-051',
  'Nursery',
  'Decor',
  'Night Light',
  'Dim red/orange light for nighttime feeds and diaper changes. Avoid blue/white light — it disrupts melatonin.',
  'pregnancy',
  NULL,
  NULL,
  'good-to-have',
  'USD',
  NULL,
  false,
  '2nd Trimester',
  2200,
  17000,
  '$22-$170',
  false,
  NULL,
  'Hatch Rest+ (doubles as sound machine)',
  'VAVA Baby Night Light'
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 052: Open Space Planning
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-NUR-PLN-052',
  'Nursery',
  'Planning',
  'Open Space Planning',
  'Leave floor space for playmat and tummy time',
  'pregnancy',
  NULL,
  NULL,
  'good-to-have',
  'USD',
  NULL,
  false,
  '2nd Trimester',
  0,
  0,
  'Varies',
  false,
  NULL,
  NULL,
  NULL
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 053: Baby Swaddles
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-BAB-SLP-053',
  'Baby Care',
  'Sleeping',
  'Baby Swaddles',
  'Velcro swaddles easier for nighttime',
  'pregnancy',
  NULL,
  NULL,
  'must-have',
  'USD',
  NULL,
  false,
  '2nd Trimester',
  9000,
  20000,
  '$90-$200',
  false,
  NULL,
  'B.E.S.T. Swaddle (Taking Cara Babies)',
  'Halo swaddle (target)'
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 054: Sleep Sacks
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-BAB-SLP-054',
  'Baby Care',
  'Sleeping',
  'Sleep Sacks',
  'Transition from swaddle around 3-4 months',
  'pregnancy',
  NULL,
  NULL,
  'must-have',
  'USD',
  NULL,
  false,
  '2nd Trimester',
  9000,
  15000,
  '$90-$150',
  false,
  NULL,
  'Kyte Baby',
  'Halo SleepSack'
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 055: Onesies (7)
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-BAB-DLY-055',
  'Baby Care',
  'Dailywear',
  'Onesies (7)',
  'Multiple sizes; baby grows fast',
  'pregnancy',
  NULL,
  NULL,
  'must-have',
  'USD',
  NULL,
  false,
  '2nd Trimester',
  7500,
  15000,
  '$75-$150',
  false,
  NULL,
  'Magnetic Me',
  'Carters baby'
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 056: Pyjamas (7)
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-BAB-DLY-056',
  'Baby Care',
  'Dailywear',
  'Pyjamas (7)',
  'Magnetic snaps easier than zippers at 3am',
  'pregnancy',
  NULL,
  NULL,
  'must-have',
  'USD',
  NULL,
  false,
  '2nd Trimester',
  8000,
  31500,
  '$80-$315',
  false,
  NULL,
  'Magnetic Me',
  'Carters baby'
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 057: Hats / Mittens / Socks (5)
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-BAB-DLY-057',
  'Baby Care',
  'Dailywear',
  'Hats / Mittens / Socks (5)',
  'Newborns lose heat fast; scratch mittens prevent face scratching',
  'pregnancy',
  NULL,
  NULL,
  'must-have',
  'USD',
  NULL,
  false,
  '2nd Trimester',
  2000,
  20000,
  '$20-$200',
  false,
  NULL,
  'Canada Goose Baby Double Pom Hat, Burberry Baby Two-piece Cotton Blend Socks Set',
  'Gerber Baby Boy Cotton Caps (3-Pack), Gerber Unisex Wiggle-Proof Socks (12-Pack)'
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 058: Sweater / Jacket (Newborn) (2)
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-BAB-DLY-058',
  'Baby Care',
  'Dailywear',
  'Sweater / Jacket (Newborn) (2)',
  'Seasonal outerwear for cold weather outings. Fleece or knit. Remember: no puffy coats in car seat — jacket goes over buckled baby.',
  'pregnancy',
  NULL,
  NULL,
  'good-to-have',
  'USD',
  NULL,
  false,
  '2nd Trimester',
  4000,
  15000,
  '$40-$150',
  false,
  NULL,
  'Patagonia Baby Synchilla',
  'Carter''s Fleece Jacket'
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 059: Baby-Safe Laundry Detergent
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-BAB-DLY-059',
  'Baby Care',
  'Dailywear',
  'Baby-Safe Laundry Detergent',
  'Fragrance-free, dye-free detergent for washing all baby clothes, sheets, and blankets before first use.',
  'pregnancy',
  NULL,
  NULL,
  'must-have',
  'USD',
  NULL,
  false,
  '2nd Trimester',
  600,
  1500,
  '$6-$15',
  false,
  NULL,
  'Dreft Stage 1',
  'All Free Clear Baby'
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 060: Infant Car Seat
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-GEA-TRA-060',
  'Gear',
  'Travel',
  'Infant Car Seat',
  'Bucket seat for 0-12 months. Removable base. DO NOT BUY USED — expired/crashed seats are invisible risks.',
  'pregnancy',
  NULL,
  NULL,
  'must-have',
  'USD',
  NULL,
  false,
  '2nd Trimester',
  25000,
  110000,
  '$250-$1100',
  false,
  NULL,
  'Babyark, Nuna Pipa RX',
  'Graco'
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 061: Stroller
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-GEA-TRA-061',
  'Gear',
  'Travel',
  'Stroller',
  'Full-size stroller compatible with car seat (Travel System). Look for one-hand fold. Test trunk fit before buying.',
  'pregnancy',
  NULL,
  NULL,
  'must-have',
  'USD',
  NULL,
  false,
  '2nd Trimester',
  30000,
  150000,
  '$300-$1500',
  false,
  NULL,
  'UPPAbaby Vista V3, Cybex Gazelle S',
  'Graco'
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 062: Baby Car Mirror
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-GEA-TRA-062',
  'Gear',
  'Travel',
  'Baby Car Mirror',
  'Rear-facing mirror so you can see baby from the driver seat. Shatterproof.',
  'pregnancy',
  NULL,
  NULL,
  'good-to-have',
  'USD',
  NULL,
  false,
  '2nd Trimester',
  4000,
  6000,
  '$40-$60',
  false,
  NULL,
  'leoella baby car mirror',
  'Munchkin'
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 063: Baby Carrier
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-GEA-WEA-063',
  'Gear',
  'Wearable',
  'Baby Carrier',
  'Hands-free; great for dad bonding. Essential for Dad Ops — allows working while holding baby.',
  'pregnancy',
  NULL,
  NULL,
  'good-to-have',
  'USD',
  NULL,
  false,
  '2nd Trimester',
  6000,
  90000,
  '$60-$900',
  false,
  NULL,
  'artipoppe',
  'Momvozy'
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 064: Baby Monitor
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-TEC-MON-064',
  'Tech',
  'Monitoring',
  'Baby Monitor',
  'Video/Audio monitor. WiFi (Nanit) has latency; Local RF (Infant Optics) is bulletproof.',
  'pregnancy',
  NULL,
  NULL,
  'must-have',
  'USD',
  NULL,
  false,
  '2nd Trimester',
  10000,
  40000,
  '$100-$400',
  false,
  NULL,
  'Nanit Pro',
  'Owlet dream'
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 065: Playmat
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-BAB-PLY-065',
  'Baby Care',
  'Playtime',
  'Playmat',
  'Tummy time support; developmental',
  'pregnancy',
  NULL,
  NULL,
  'good-to-have',
  'USD',
  NULL,
  false,
  '2nd Trimester',
  5000,
  15000,
  '$50-$150',
  false,
  NULL,
  'Lovevery Play Gym',
  'Baby Einstein 4-in-1 Kickin'' Tunes'
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 066: Playpen
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-BAB-PLY-066',
  'Baby Care',
  'Playtime',
  'Playpen',
  'Safe contained play area for when you need hands free',
  'pregnancy',
  NULL,
  NULL,
  'good-to-have',
  'USD',
  NULL,
  false,
  '2nd Trimester',
  5500,
  13000,
  '$55-$130',
  false,
  NULL,
  'Lalo The Play Pen',
  'Regalo My Play'
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 067: Toys (Newborn)
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-BAB-PLY-067',
  'Baby Care',
  'Playtime',
  'Toys (Newborn)',
  'Age-appropriate; black & white contrast for newborns',
  'pregnancy',
  NULL,
  NULL,
  'must-have',
  'USD',
  NULL,
  false,
  '2nd Trimester',
  0,
  0,
  'Varies',
  false,
  NULL,
  'Lovery',
  NULL
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 068: Audio Books
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-BAB-PLY-068',
  'Baby Care',
  'Playtime',
  'Audio Books',
  'Stimulates language development early',
  'pregnancy',
  NULL,
  NULL,
  'must-have',
  'USD',
  NULL,
  false,
  '2nd Trimester',
  0,
  0,
  'Varies',
  false,
  NULL,
  NULL,
  NULL
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 069: Toys that Move / Make Sounds
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-BAB-PLY-069',
  'Baby Care',
  'Playtime',
  'Toys that Move / Make Sounds',
  'Encourages sensory development',
  'pregnancy',
  NULL,
  NULL,
  'good-to-have',
  'USD',
  NULL,
  false,
  '2nd Trimester',
  0,
  0,
  'Varies',
  false,
  NULL,
  NULL,
  NULL
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 070: Sensory Toys
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-BAB-PLY-070',
  'Baby Care',
  'Playtime',
  'Sensory Toys',
  'Different textures, shapes',
  'pregnancy',
  NULL,
  NULL,
  'must-have',
  'USD',
  NULL,
  false,
  '2nd Trimester',
  2000,
  15000,
  '$20-$150',
  false,
  NULL,
  'Lovevery Play Kits',
  'Basic textured ball sets'
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 071: Sensory Books
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-BAB-PLY-071',
  'Baby Care',
  'Playtime',
  'Sensory Books',
  'Touch-and-feel books great for 0-12m',
  'pregnancy',
  NULL,
  NULL,
  'must-have',
  'USD',
  NULL,
  false,
  '2nd Trimester',
  0,
  0,
  'Varies',
  false,
  NULL,
  NULL,
  NULL
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 072: Baby Audio Books for Nursery
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-NUR-EXT-072',
  'Nursery',
  'Extras',
  'Baby Audio Books for Nursery',
  'Background audio for calm environment',
  'pregnancy',
  NULL,
  NULL,
  'good-to-have',
  'USD',
  NULL,
  false,
  '2nd Trimester',
  0,
  0,
  'Varies',
  false,
  NULL,
  NULL,
  NULL
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 073: Travel Crib
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-BAB-PLY-073',
  'Baby Care',
  'Playtime',
  'Travel Crib',
  'Useful once you are mobile',
  'pregnancy',
  NULL,
  NULL,
  'good-to-have',
  'USD',
  NULL,
  false,
  '2nd Trimester',
  18000,
  50000,
  '$180-$500',
  false,
  NULL,
  'Nuna SENA Aire',
  'Chicco Alfa Light'
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 074: Maternity Clothes (2nd Trimester Update)
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-MOM-MAT-074',
  'Mom',
  'Maternity',
  'Maternity Clothes (2nd Trimester Update)',
  'Bump is bigger — may need more pants, belly band, or work-appropriate outfits. Some moms need a second round.',
  'pregnancy',
  NULL,
  NULL,
  'must-have',
  'USD',
  NULL,
  false,
  '2nd Trimester',
  20000,
  100000,
  '$200-$1000',
  false,
  NULL,
  'Seraphine',
  'Target Ingrid & Isabel, Amazon Motherhood Maternity'
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 075: Nursing Bras (Buy Ahead)
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-MOM-MAT-075',
  'Mom',
  'Maternity',
  'Nursing Bras (Buy Ahead)',
  'Buy 1-2 nursing bras in late 2nd trimester while you can still shop comfortably. Size up one cup from current.',
  'pregnancy',
  NULL,
  NULL,
  'good-to-have',
  'USD',
  NULL,
  false,
  '2nd Trimester',
  6000,
  12000,
  '$60-$120',
  false,
  NULL,
  'Kindred Bravely Sublime',
  'Bravado Designs Body Silk'
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 076: Baby Shusher
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-BAB-SOO-076',
  'Baby Care',
  'Soothing',
  'Baby Shusher',
  'Portable sound machine that makes rhythmic shushing sounds. Helpful for calming newborns on the go and during sleep training.',
  'pregnancy',
  NULL,
  NULL,
  'good-to-have',
  'USD',
  NULL,
  false,
  '2nd Trimester',
  3500,
  10000,
  '$35-$100',
  false,
  NULL,
  'Hatch Baby (Putty)',
  'Baby Shusher (The Sleep Miracle)'
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 077: Bassinet
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-BAB-SLP-077',
  'Baby Care',
  'Sleeping',
  'Bassinet',
  'Portable sleep space for parents'' room (0-4 months). AAP recommends room sharing for 6 months. Separate from crib.',
  'pregnancy',
  NULL,
  NULL,
  'must-have',
  'USD',
  NULL,
  false,
  '2nd Trimester',
  20000,
  150000,
  '$200-$1500',
  false,
  NULL,
  'SNOO Smart Bassinet, CradleWise',
  'Halo BassiNest, Chicco LullaGo'
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 078: Baby Bouncer / Infant Swing
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-BAB-SOO-078',
  'Baby Care',
  'Soothing',
  'Baby Bouncer / Infant Swing',
  'The ''put baby down somewhere safe while you eat/shower'' device. Bouncer preferred for portability; swing for longer soothing sessions.',
  'pregnancy',
  NULL,
  NULL,
  'good-to-have',
  'USD',
  NULL,
  false,
  '2nd Trimester',
  5000,
  40000,
  '$50-$400',
  false,
  NULL,
  'Nuna baby bouncer',
  'Fisher-Price Infant-to-Toddler Rocker'
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 079: Waterproof Crib Mattress Pad
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-NUR-BED-079',
  'Nursery',
  'Bedding',
  'Waterproof Crib Mattress Pad',
  'Goes between mattress and fitted sheet. Essential for 3 AM blowouts and spit-up — saves you from stripping the whole crib. Buy 2 for rotation.',
  'pregnancy',
  NULL,
  NULL,
  'must-have',
  'USD',
  NULL,
  false,
  '2nd Trimester',
  3500,
  8500,
  '$35-$85',
  false,
  NULL,
  'Naturepedic Waterproof Pad',
  'American Baby Company Waterproof Pad'
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 080: Gas Drops / Gripe Water
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-BAB-FAI-080',
  'Baby Care',
  'First Aid',
  'Gas Drops / Gripe Water',
  'Simethicone gas drops (Mylicon) and gripe water for newborn gas and colic. Stock before baby arrives — newborn gas is relentless at 2 AM.',
  'pregnancy',
  NULL,
  NULL,
  'must-have',
  'USD',
  NULL,
  false,
  '2nd Trimester',
  1000,
  1000,
  '$10',
  false,
  NULL,
  'Mommy''s Bliss Gripe Water',
  'Little Remedies Gas Drops (Mylicon)'
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 081: Stroller Rain Cover
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-GEA-TRA-081',
  'Gear',
  'Travel',
  'Stroller Rain Cover',
  'Universal-fit clear cover for rainy day walks. Often forgotten until the first downpour. Check stroller brand for compatible covers.',
  'pregnancy',
  NULL,
  NULL,
  'good-to-have',
  'USD',
  NULL,
  false,
  '2nd Trimester',
  1800,
  4000,
  '$18-$40',
  false,
  NULL,
  'UPPAbaby Rain Shield (brand-specific)',
  'Universal Stroller Rain Cover (Amazon)'
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 082: Nursing Cover
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-MOM-NRS-082',
  'Mom',
  'Nursing',
  'Nursing Cover',
  'Lightweight breathable cover for breastfeeding in public or with guests. Some double as car seat covers and shopping cart covers.',
  'pregnancy',
  NULL,
  NULL,
  'good-to-have',
  'USD',
  NULL,
  false,
  '2nd Trimester',
  5000,
  20000,
  '$50-$200',
  false,
  NULL,
  'We are Amma Cocoon',
  'Solly baby nursing cover'
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 083: Waterproof Changing Pad Liners
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-BAB-DIA-083',
  'Baby Care',
  'Diapering',
  'Waterproof Changing Pad Liners',
  'Disposable or washable liners placed on top of changing pad cover. Saves you from washing the full pad cover after every blowout. Buy in multi-pack.',
  'pregnancy',
  NULL,
  NULL,
  'good-to-have',
  'USD',
  NULL,
  false,
  '2nd Trimester',
  200,
  1200,
  '$2-$12',
  false,
  NULL,
  'Munchkin Waterproof Liners',
  'Amazon Basics Disposable Changing Pads'
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 084: Crib Mobile
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-NUR-DEC-084',
  'Nursery',
  'Decor',
  'Crib Mobile',
  'Visual stimulation for newborns. Black and white or high-contrast designs best for first months. Remove by 5 months or when baby can push up on hands/knees (entanglement risk).',
  'pregnancy',
  NULL,
  NULL,
  'good-to-have',
  'USD',
  NULL,
  false,
  '2nd Trimester',
  3500,
  8000,
  '$35-$80',
  false,
  NULL,
  'Pottery Barn Kids Mobile',
  'IKEA KLAPPA Mobile'
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 085: Baby Memory Book / Milestone Cards
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-BAB-KEP-085',
  'Baby Care',
  'Keepsakes',
  'Baby Memory Book / Milestone Cards',
  'Record firsts: first smile, first steps, first words. Milestone cards for monthly photos are popular on social media. You will NOT remember to do this later — set it up now.',
  'pregnancy',
  NULL,
  NULL,
  'good-to-have',
  'USD',
  NULL,
  false,
  '2nd Trimester',
  1500,
  6800,
  '$15-$68',
  false,
  NULL,
  'Artifact Uprising Baby Book',
  'Mushie Milestone Cards'
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 086: Stroller Organizer / Cup Holder
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-GEA-TRA-086',
  'Gear',
  'Travel',
  'Stroller Organizer / Cup Holder',
  'Attaches to stroller handlebar for phone, keys, drinks, and snacks. Small accessory that makes a huge daily difference on walks.',
  'pregnancy',
  NULL,
  NULL,
  'good-to-have',
  'USD',
  NULL,
  false,
  '2nd Trimester',
  2600,
  6000,
  '$26-$60',
  false,
  NULL,
  'UPPAbaby Carry-All Parent Organizer',
  'Universal Stroller Organizer (Amazon)'
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 087: Bottle Drying Rack
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-BAB-FED-087',
  'Baby Care',
  'Feeding',
  'Bottle Drying Rack',
  'Dedicated drying rack for bottles, nipples, pump parts. Keeps kitchen counter organized and parts clean. Grass-style racks are popular.',
  'pregnancy',
  NULL,
  NULL,
  'good-to-have',
  'USD',
  NULL,
  false,
  '2nd Trimester',
  2500,
  2500,
  '$25',
  false,
  NULL,
  'Boon Lawn Countertop Drying Rack',
  'OXO Tot Bottle Drying Rack'
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- =============================================================================
-- 3RD TRIMESTER (10 items)
-- =============================================================================

-- 088: Postpartum Kit (for Mom)
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-HEA-REC-088',
  'Health',
  'Recovery',
  'Postpartum Kit (for Mom)',
  'Pads; peri-bottle; witch hazel; pain relief spray. FridaMom makes a standard kit. Do not skimp on this.',
  'pregnancy',
  NULL,
  NULL,
  'must-have',
  'USD',
  NULL,
  false,
  '3rd Trimester',
  6000,
  10000,
  '$60-$100',
  false,
  NULL,
  'FridaMom Postpartum Recovery Essentials',
  'Earth Mama Organics'
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 089: Mimi Belt (Pregnancy Seatbelt)
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-HEA-COM-089',
  'Health',
  'Comfort',
  'Mimi Belt (Pregnancy Seatbelt)',
  'If wife drives or rides often; reduces pressure on belly in car',
  'pregnancy',
  NULL,
  NULL,
  'tip',
  'USD',
  NULL,
  false,
  '3rd Trimester',
  3500,
  3500,
  '$35',
  false,
  NULL,
  'Mimi belt',
  'Mimi belt'
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 090: Hospital Bag (Mom + Dad)
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-ADM-PLN-090',
  'Admin',
  'Planning',
  'Hospital Bag (Mom + Dad)',
  'Pack by week 36; include snacks and phone chargers for dad',
  'pregnancy',
  NULL,
  NULL,
  'must-have',
  'USD',
  NULL,
  false,
  '3rd Trimester',
  0,
  0,
  'Varies',
  false,
  NULL,
  NULL,
  NULL
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 091: Delivery Preferences Document
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-ADM-PLN-091',
  'Admin',
  'Planning',
  'Delivery Preferences Document',
  'Birth plan / preferences doc to share with hospital staff',
  'pregnancy',
  NULL,
  NULL,
  'tip',
  'USD',
  NULL,
  false,
  '3rd Trimester',
  0,
  0,
  'Varies',
  false,
  NULL,
  NULL,
  NULL
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 092: Car Seat Installation & Verification
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-ADM-PLN-092',
  'Admin',
  'Planning',
  'Car Seat Installation & Verification',
  'Install before due date; many fire stations will verify for free',
  'pregnancy',
  NULL,
  NULL,
  'must-have',
  'USD',
  NULL,
  false,
  '3rd Trimester',
  0,
  0,
  'Varies',
  false,
  NULL,
  NULL,
  NULL
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 093: Hospital Tour / Visit
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-ADM-PLN-093',
  'Admin',
  'Planning',
  'Hospital Tour / Visit',
  'Visit the delivery hospital to understand rooms and process',
  'pregnancy',
  NULL,
  NULL,
  'tip',
  'USD',
  NULL,
  false,
  '3rd Trimester',
  0,
  0,
  'Varies',
  false,
  NULL,
  NULL,
  NULL
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 094: Pediatrician Selection
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-ADM-PLN-094',
  'Admin',
  'Planning',
  'Pediatrician Selection',
  'Interview and select pediatrician before birth; confirm insurance',
  'pregnancy',
  NULL,
  NULL,
  'must-have',
  'USD',
  NULL,
  false,
  '3rd Trimester',
  0,
  0,
  'Varies',
  false,
  NULL,
  NULL,
  NULL
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 095: LifeVac Choking Rescue Device
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-SAF-EMR-095',
  'Safety',
  'Emergency',
  'LifeVac Choking Rescue Device',
  'Anti-choking device for infants and children. One-time purchase — have it before solids start. Learn how to use it before you need it.',
  'pregnancy',
  NULL,
  NULL,
  'must-have',
  'USD',
  NULL,
  false,
  '3rd Trimester',
  7000,
  7000,
  '$70',
  false,
  NULL,
  'LifeVac',
  'Dechoker'
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 096: Pregnancy Pillow
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-MOM-MAT-096',
  'Mom',
  'Maternity',
  'Pregnancy Pillow',
  'Full-body or wedge pillow for sleep support in 3rd trimester. Game changer for hip and back pain.',
  'pregnancy',
  NULL,
  NULL,
  'good-to-have',
  'USD',
  NULL,
  false,
  '3rd Trimester',
  5000,
  20000,
  '$50-$200',
  false,
  NULL,
  'yanasleep',
  'Momcozy'
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 097: Postpartum Recovery Belt / Belly Band
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-HEA-REC-097',
  'Health',
  'Recovery',
  'Postpartum Recovery Belt / Belly Band',
  'Abdominal support wrap for post-delivery recovery. Helps with core stability and comfort. Different from the FridaMom kit — this is structural support.',
  'pregnancy',
  NULL,
  NULL,
  'good-to-have',
  'USD',
  NULL,
  false,
  '3rd Trimester',
  2700,
  8500,
  '$27-$85',
  false,
  NULL,
  'Bellefit Postpartum Girdle',
  'Revive 3-in-1 Postpartum Belly Band'
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- =============================================================================
-- 0-3 MONTHS (18 items)
-- =============================================================================

-- 098: Birth Certificate (x3 copies)
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-ADM-DOC-098',
  'Admin',
  'Docs',
  'Birth Certificate (x3 copies)',
  'Order multiple certified copies immediately. Needed for insurance/passport.',
  'post-birth',
  NULL,
  NULL,
  'must-have',
  'USD',
  NULL,
  false,
  '0-3 Months',
  0,
  0,
  'Varies',
  false,
  NULL,
  NULL,
  NULL
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 099: Social Security Card
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-ADM-DOC-099',
  'Admin',
  'Docs',
  'Social Security Card',
  'Apply at hospital or SSA office shortly after birth',
  'post-birth',
  NULL,
  NULL,
  'must-have',
  'USD',
  NULL,
  false,
  '0-3 Months',
  0,
  0,
  'Varies',
  false,
  NULL,
  NULL,
  NULL
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 100: Add Baby to Health Insurance
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-ADM-INS-100',
  'Admin',
  'Insurance',
  'Add Baby to Health Insurance',
  'Typically 30-day window after birth to add newborn',
  'post-birth',
  NULL,
  NULL,
  'must-have',
  'USD',
  NULL,
  false,
  '0-3 Months',
  0,
  0,
  'Varies',
  false,
  NULL,
  NULL,
  NULL
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 101: Passport
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-ADM-DOC-101',
  'Admin',
  'Docs',
  'Passport',
  'Both parents must be present at application. Photos are tricky.',
  'post-birth',
  NULL,
  NULL,
  'good-to-have',
  'USD',
  NULL,
  false,
  '0-3 Months',
  0,
  0,
  'Varies',
  false,
  NULL,
  NULL,
  NULL
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 102: 529 College Savings Fund
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-ADM-FIN-102',
  'Admin',
  'Financial',
  '529 College Savings Fund',
  'Open account and set auto-draft. Compound interest is the goal.',
  'post-birth',
  NULL,
  NULL,
  'good-to-have',
  'USD',
  NULL,
  false,
  '0-3 Months',
  0,
  0,
  'Varies',
  false,
  NULL,
  NULL,
  NULL
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 103: Diapers (Size 1-2) — Restock
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-BAB-DIA-103',
  'Baby Care',
  'Diapering',
  'Diapers (Size 1-2) — Restock',
  'Recurring monthly. Baby moves to Size 1 around 2-4 weeks and Size 2 around 2-3 months. Buy in bulk once you know the brand that works.',
  'post-birth',
  NULL,
  NULL,
  'must-have',
  'USD',
  NULL,
  false,
  '0-3 Months',
  3000,
  8000,
  '$30-$80',
  true,
  'monthly',
  'Coterie',
  'Target Up & Up , Amazon Mama Bear, Costco Kirkland'
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 104: Diaper Cream — Restock
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-BAB-DIA-104-03M',
  'Baby Care',
  'Diapering',
  'Diaper Cream — Restock',
  'Recurring every 2-3 months. Keep one at changing station and one in diaper bag.',
  'post-birth',
  NULL,
  NULL,
  'must-have',
  'USD',
  NULL,
  false,
  '0-3 Months',
  1200,
  2000,
  '$12-$20',
  true,
  'monthly',
  'Honest Company',
  'Aquaphor, Desitin'
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 105: Wet Wipes — Restock
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-BAB-DIA-105-03M',
  'Baby Care',
  'Diapering',
  'Wet Wipes — Restock',
  'Recurring monthly. Buy in bulk cases — you''ll go through 60-80 wipes/day in the early weeks.',
  'post-birth',
  NULL,
  NULL,
  'must-have',
  'USD',
  NULL,
  false,
  '0-3 Months',
  4000,
  13200,
  '$40-$132',
  true,
  'monthly',
  'Coterie The Wipe',
  'The Honest Company Wipes, Waterwipes'
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 106: Formula — Restock
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-BAB-FED-106-03M',
  'Baby Care',
  'Feeding',
  'Formula — Restock',
  'Recurring monthly if formula feeding. ~$150-200/month for exclusive formula feeding. Don''t switch brands without reason.',
  'post-birth',
  NULL,
  NULL,
  'must-have',
  'USD',
  NULL,
  false,
  '0-3 Months',
  10000,
  10000,
  '$100',
  true,
  'monthly',
  'Bobbie Organic',
  'Enfamil, Similac'
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 107: Bottle Soap / Cleaner Agent — Restock
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-BAB-FED-107-03M',
  'Baby Care',
  'Feeding',
  'Bottle Soap / Cleaner Agent — Restock',
  'Recurring every 2-3 months. You''re washing 8-12 bottles a day.',
  'post-birth',
  NULL,
  NULL,
  'must-have',
  'USD',
  NULL,
  false,
  '0-3 Months',
  2000,
  3000,
  '$20-$30',
  true,
  'monthly',
  'Dapple Baby',
  'Babyganics Dish Soap'
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 108: Bottles — Size 1 Nipples
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-BAB-FED-108',
  'Baby Care',
  'Feeding',
  'Bottles — Size 1 Nipples',
  'Upgrade nipples around 1 month if baby is struggling with slow-flow. Same brand as initial bottles.',
  'post-birth',
  NULL,
  NULL,
  'must-have',
  'USD',
  NULL,
  false,
  '0-3 Months',
  4000,
  6000,
  '$40-$60',
  false,
  NULL,
  'Comotomo',
  'Philips Avent, Dr Brown'
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 109: Baby Bathwash Gel — Restock
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-BAB-BAT-109-03M',
  'Baby Care',
  'Bathing',
  'Baby Bathwash Gel — Restock',
  'Recurring every 2-3 months. One bottle lasts a while since you only bathe 2-3x per week early on.',
  'post-birth',
  NULL,
  NULL,
  'must-have',
  'USD',
  NULL,
  false,
  '0-3 Months',
  800,
  2000,
  '$8-$20',
  true,
  'monthly',
  'CeraVe Baby, Mustela Cleansing Oil',
  'Johnson''s, Cetaphil, Aveeno'
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 110: Baby Shampoo — Restock
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-BAB-BAT-110-03M',
  'Baby Care',
  'Bathing',
  'Baby Shampoo — Restock',
  'Recurring every 2-3 months.',
  'post-birth',
  NULL,
  NULL,
  'must-have',
  'USD',
  NULL,
  false,
  '0-3 Months',
  800,
  2100,
  '$8-$21',
  true,
  'monthly',
  'Mustela',
  'Aveeno Baby Daily Moisture, Aquaphor'
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 111: Baby Body Cream / Lotion — Restock
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-BAB-BAT-111-03M',
  'Baby Care',
  'Bathing',
  'Baby Body Cream / Lotion — Restock',
  'Recurring every 1-2 months. Apply after every bath and as needed for dry patches.',
  'post-birth',
  NULL,
  NULL,
  'must-have',
  'USD',
  NULL,
  false,
  '0-3 Months',
  900,
  1000,
  '$9-$10',
  true,
  'monthly',
  'CeraVe',
  'Aveeno Baby Daily Moisture, Aquaphor'
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 112: Vitamin D Drops — Restock
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-BAB-FED-112-03M',
  'Baby Care',
  'Feeding',
  'Vitamin D Drops — Restock',
  'Recurring every 2-3 months. One dropper per day for breastfed babies.',
  'post-birth',
  NULL,
  NULL,
  'doctor',
  'USD',
  NULL,
  false,
  '0-3 Months',
  0,
  0,
  'Varies',
  true,
  'monthly',
  NULL,
  NULL
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 113: Onesies (0-3mo size) (7)
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-BAB-DLY-113',
  'Baby Care',
  'Dailywear',
  'Onesies (0-3mo size) (7)',
  'Restock/size up. Baby outgrows newborn size in 2-4 weeks. Stock 7-10 onesies in 0-3mo.',
  'post-birth',
  NULL,
  NULL,
  'must-have',
  'USD',
  NULL,
  false,
  '0-3 Months',
  7500,
  15000,
  '$75-$150',
  false,
  NULL,
  'Magnetic Me',
  'Carters baby'
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 114: Pyjamas (0-3mo size) (7)
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-BAB-DLY-114',
  'Baby Care',
  'Dailywear',
  'Pyjamas (0-3mo size) (7)',
  'Restock/size up. Need 5-7 pairs for rotation plus spit-up changes.',
  'post-birth',
  NULL,
  NULL,
  'must-have',
  'USD',
  NULL,
  false,
  '0-3 Months',
  8000,
  31500,
  '$80-$315',
  false,
  NULL,
  'Magnetic Me',
  'Carters baby'
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 115: Diaper Pail Refill Bags — Restock
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-BAB-DIA-115-03M',
  'Baby Care',
  'Diapering',
  'Diaper Pail Refill Bags — Restock',
  'Recurring every 1-2 months. Brand-specific refills (Ubbi uses standard trash bags — a money saver vs. Diaper Genie proprietary bags).',
  'post-birth',
  NULL,
  NULL,
  'must-have',
  'USD',
  NULL,
  false,
  '0-3 Months',
  2000,
  2700,
  '$20-$27',
  true,
  'monthly',
  'Ubbi (uses standard 13-gal bags)',
  'Diaper Genie Refills'
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- =============================================================================
-- 3-6 MONTHS (21 items)
-- =============================================================================

-- 116: High Chair
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-FEE-SOL-116',
  'Feeding',
  'Solids',
  'High Chair',
  'Easy-to-clean chair for solids introduction. Footrest is critical for safe swallowing (posture).',
  'post-birth',
  NULL,
  NULL,
  'must-have',
  'USD',
  NULL,
  false,
  '3-6 Months',
  10000,
  45000,
  '$100-$450',
  false,
  NULL,
  'Stokke Tripp Trapp, Lalo The Chair',
  'IKEA Antilop, Ingenuity SmartClean'
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 117: Feeding Gear (Bibs / Plates / Cups)
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-FEE-SOL-117',
  'Feeding',
  'Solids',
  'Feeding Gear (Bibs / Plates / Cups)',
  'Silicone bibs; suction plates; tiny open cups to teach oral motor skills.',
  'post-birth',
  NULL,
  NULL,
  'must-have',
  'USD',
  NULL,
  false,
  '3-6 Months',
  1000,
  2000,
  '$10-$20',
  false,
  NULL,
  'ezpz Happy Mat',
  'Bumkins Suction Plate'
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 118: Baby Food Maker
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-FEE-SOL-118',
  'Feeding',
  'Solids',
  'Baby Food Maker',
  'Babycook Neo Baby Food Maker',
  'post-birth',
  NULL,
  NULL,
  'good-to-have',
  'USD',
  NULL,
  false,
  '3-6 Months',
  7000,
  30000,
  '$70-$300',
  false,
  NULL,
  'BEABA Babycook',
  'Nutribullet baby food blender'
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 119: Baby Spoons (Soft Tip)
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-FEE-SOL-119',
  'Feeding',
  'Solids',
  'Baby Spoons (Soft Tip)',
  'Silicone-tipped spoons sized for tiny mouths. Buy 4-6. Some babies prefer self-feeding from the start.',
  'post-birth',
  NULL,
  NULL,
  'must-have',
  'USD',
  NULL,
  false,
  '3-6 Months',
  700,
  3000,
  '$7-$30',
  false,
  NULL,
  'NumNum Pre-Spoon GOOtensils',
  'Munchkin Soft-Tip Infant Spoons'
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 120: Teethers
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-BAB-TEE-120',
  'Baby Care',
  'Teething',
  'Teethers',
  'Silicone or rubber teethers for sore gums. Refrigerate (don''t freeze) for extra soothing. Teething starts around 4-6 months.',
  'post-birth',
  NULL,
  NULL,
  'must-have',
  'USD',
  NULL,
  false,
  '3-6 Months',
  500,
  1000,
  '$5-$10',
  false,
  NULL,
  'Comotomo Silicone Teether',
  'Sophie la Girafe, Nuby Ice Gel Teether'
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 121: Diapers (Size 2-3) — Restock
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-BAB-DIA-121',
  'Baby Care',
  'Diapering',
  'Diapers (Size 2-3) — Restock',
  'Recurring monthly. Most babies are in Size 2 by 3 months and Size 3 by 5-6 months.',
  'post-birth',
  NULL,
  NULL,
  'must-have',
  'USD',
  NULL,
  false,
  '3-6 Months',
  3000,
  8000,
  '$30-$80',
  true,
  'monthly',
  'Coterie',
  'Target Up & Up , Amazon Mama Bear, Costco Kirkland'
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 122: Diaper Cream — Restock
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-BAB-DIA-122-36M',
  'Baby Care',
  'Diapering',
  'Diaper Cream — Restock',
  'Recurring every 2-3 months. Especially important as solids introduction begins — diaper rash flare-ups are common.',
  'post-birth',
  NULL,
  NULL,
  'must-have',
  'USD',
  NULL,
  false,
  '3-6 Months',
  1200,
  2000,
  '$12-$20',
  true,
  'monthly',
  'Honest Company',
  'Aquaphor, Desitin'
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 123: Wet Wipes — Restock
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-BAB-DIA-123-36M',
  'Baby Care',
  'Diapering',
  'Wet Wipes — Restock',
  'Recurring monthly. Usage stays high; messier diapers as solids start.',
  'post-birth',
  NULL,
  NULL,
  'must-have',
  'USD',
  NULL,
  false,
  '3-6 Months',
  4000,
  13200,
  '$40-$132',
  true,
  'monthly',
  'Coterie The Wipe',
  'The Honest Company Wipes, Waterwipes'
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 124: Formula — Restock
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-BAB-FED-124-36M',
  'Baby Care',
  'Feeding',
  'Formula — Restock',
  'Recurring monthly. May need to size up to larger cans. Appetite increases significantly around 4 months.',
  'post-birth',
  NULL,
  NULL,
  'must-have',
  'USD',
  NULL,
  false,
  '3-6 Months',
  10000,
  10000,
  '$100',
  true,
  'monthly',
  'Bobbie Organic',
  'Enfamil, Similac'
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 125: Bottle Soap / Cleaner Agent — Restock
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-BAB-FED-125-36M',
  'Baby Care',
  'Feeding',
  'Bottle Soap / Cleaner Agent — Restock',
  'Recurring every 2-3 months.',
  'post-birth',
  NULL,
  NULL,
  'must-have',
  'USD',
  NULL,
  false,
  '3-6 Months',
  2000,
  3000,
  '$20-$30',
  true,
  'monthly',
  'Dapple Baby',
  'Babyganics Dish Soap'
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 126: Bottles — Size 2 Nipples
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-BAB-FED-126',
  'Baby Care',
  'Feeding',
  'Bottles — Size 2 Nipples',
  'Upgrade nipples around 3-4 months for faster flow as baby gets more efficient at feeding.',
  'post-birth',
  NULL,
  NULL,
  'must-have',
  'USD',
  NULL,
  false,
  '3-6 Months',
  4000,
  6000,
  '$40-$60',
  false,
  NULL,
  'Comotomo',
  'Philips Avent, Dr Brown'
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 127: Baby Bathwash Gel — Restock
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-BAB-BAT-127-36M',
  'Baby Care',
  'Bathing',
  'Baby Bathwash Gel — Restock',
  'Recurring every 2-3 months. May increase bath frequency to 3-4x/week as baby gets messier.',
  'post-birth',
  NULL,
  NULL,
  'must-have',
  'USD',
  NULL,
  false,
  '3-6 Months',
  800,
  2000,
  '$8-$20',
  true,
  'monthly',
  'CeraVe Baby, Mustela Cleansing Oil',
  'Johnson''s, Cetaphil, Aveeno'
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 128: Baby Shampoo — Restock
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-BAB-BAT-128-36M',
  'Baby Care',
  'Bathing',
  'Baby Shampoo — Restock',
  'Recurring every 2-3 months. More hair = more shampoo.',
  'post-birth',
  NULL,
  NULL,
  'must-have',
  'USD',
  NULL,
  false,
  '3-6 Months',
  800,
  2100,
  '$8-$21',
  true,
  'monthly',
  'Mustela',
  'Aveeno Baby Daily Moisture, Aquaphor'
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 129: Baby Body Cream / Lotion — Restock
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-BAB-BAT-129-36M',
  'Baby Care',
  'Bathing',
  'Baby Body Cream / Lotion — Restock',
  'Recurring every 1-2 months.',
  'post-birth',
  NULL,
  NULL,
  'must-have',
  'USD',
  NULL,
  false,
  '3-6 Months',
  900,
  1000,
  '$9-$10',
  true,
  'monthly',
  'CeraVe',
  'Aveeno Baby Daily Moisture, Aquaphor'
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 130: Vitamin D Drops — Restock
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-BAB-FED-130-36M',
  'Baby Care',
  'Feeding',
  'Vitamin D Drops — Restock',
  'Recurring every 2-3 months.',
  'post-birth',
  NULL,
  NULL,
  'doctor',
  'USD',
  NULL,
  false,
  '3-6 Months',
  0,
  0,
  'Varies',
  true,
  'monthly',
  NULL,
  NULL
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 131: Onesies (3-6mo size) (7)
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-BAB-DLY-131',
  'Baby Care',
  'Dailywear',
  'Onesies (3-6mo size) (7)',
  'Size up. Baby outgrows 0-3mo around 3-4 months. Stock 7-10.',
  'post-birth',
  NULL,
  NULL,
  'must-have',
  'USD',
  NULL,
  false,
  '3-6 Months',
  7500,
  15000,
  '$75-$150',
  false,
  NULL,
  'Magnetic Me',
  'Carters baby'
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 132: Pyjamas (3-6mo size) (7)
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-BAB-DLY-132',
  'Baby Care',
  'Dailywear',
  'Pyjamas (3-6mo size) (7)',
  'Size up. Need 5-7 pairs.',
  'post-birth',
  NULL,
  NULL,
  'must-have',
  'USD',
  NULL,
  false,
  '3-6 Months',
  8000,
  31500,
  '$80-$315',
  false,
  NULL,
  'Magnetic Me',
  'Carters baby'
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 133: Sleep Sacks (Medium)
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-BAB-SLP-133',
  'Baby Care',
  'Sleeping',
  'Sleep Sacks (Medium)',
  'Size up from small. Transition from swaddle to arms-out sleep sack around 3-4 months.',
  'post-birth',
  NULL,
  NULL,
  'must-have',
  'USD',
  NULL,
  false,
  '3-6 Months',
  0,
  0,
  'Varies',
  false,
  NULL,
  'Kyte Baby',
  'Halo SleepSack'
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 134: Sweater / Jacket (3-6mo) (2)
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-BAB-DLY-134',
  'Baby Care',
  'Dailywear',
  'Sweater / Jacket (3-6mo) (2)',
  'Seasonal outerwear sized up. Fleece layering works best.',
  'post-birth',
  NULL,
  NULL,
  'good-to-have',
  'USD',
  NULL,
  false,
  '3-6 Months',
  4000,
  15000,
  '$40-$150',
  false,
  NULL,
  'Patagonia Baby Synchilla',
  'Carter''s Fleece Jacket'
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 135: Toys — Age Appropriate Refresh
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-BAB-PLY-135-36M',
  'Baby Care',
  'Playtime',
  'Toys — Age Appropriate Refresh',
  'Recurring. New developmental toys every 2-3 months. Focus on cause-and-effect, grabbing, rattles at this stage.',
  'post-birth',
  NULL,
  NULL,
  'must-have',
  'USD',
  NULL,
  false,
  '3-6 Months',
  0,
  0,
  'Varies',
  true,
  'monthly',
  'Lovevery Play Kits (3-6mo)',
  'Assorted (Amazon basics)'
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 136: Diaper Pail Refill Bags — Restock
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-BAB-DIA-136-36M',
  'Baby Care',
  'Diapering',
  'Diaper Pail Refill Bags — Restock',
  'Recurring every 1-2 months.',
  'post-birth',
  NULL,
  NULL,
  'must-have',
  'USD',
  NULL,
  false,
  '3-6 Months',
  2000,
  2700,
  '$20-$27',
  true,
  'monthly',
  'Ubbi (uses standard 13-gal bags)',
  'Diaper Genie Refills'
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- =============================================================================
-- 6-12 MONTHS (39 items)
-- =============================================================================

-- 137: Baby Gates
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-SAF-HOM-137',
  'Safety',
  'Home',
  'Baby Gates',
  'Hardware-mounted for stairs; pressure for rooms. Install BEFORE they crawl. Top of stairs MUST be hardware mounted.',
  'post-birth',
  NULL,
  NULL,
  'must-have',
  'USD',
  NULL,
  false,
  '6-12 Months',
  5000,
  7000,
  '$50-$70',
  false,
  NULL,
  'BABELIO gates',
  'Momcozy Baby Gate'
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 138: Cabinet Locks
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-SAF-HOM-138',
  'Safety',
  'Home',
  'Cabinet Locks',
  'Magnetic or latch locks for chemicals/knives. Focus on kill zones: under sink and knife drawers.',
  'post-birth',
  NULL,
  NULL,
  'must-have',
  'USD',
  NULL,
  false,
  '6-12 Months',
  1200,
  4000,
  '$12-$40',
  false,
  NULL,
  'Safety 1st Magnetic Locks',
  'Child-proof latch set'
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 139: Outlet Covers
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-SAF-HOM-139',
  'Safety',
  'Home',
  'Outlet Covers',
  'Cover all accessible outlets',
  'post-birth',
  NULL,
  NULL,
  'must-have',
  'USD',
  NULL,
  false,
  '6-12 Months',
  0,
  0,
  'Varies',
  false,
  NULL,
  NULL,
  NULL
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 140: Corner Protectors
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-SAF-HOM-140',
  'Safety',
  'Home',
  'Corner Protectors',
  'Soft bumpers for sharp furniture edges',
  'post-birth',
  NULL,
  NULL,
  'good-to-have',
  'USD',
  NULL,
  false,
  '6-12 Months',
  0,
  0,
  'Varies',
  false,
  NULL,
  NULL,
  NULL
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 141: Travel Stroller
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-GEA-TRA-141',
  'Gear',
  'Travel',
  'Travel Stroller',
  'Lightweight, foldable for airplanes. Fits in overhead bin.',
  'post-birth',
  NULL,
  NULL,
  'good-to-have',
  'USD',
  NULL,
  false,
  '6-12 Months',
  19000,
  80000,
  '$190-$800',
  false,
  NULL,
  'Nuna trvl stroller',
  'Graco Ready2Jet'
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 142: Sick Day Buffer
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-HEA-MED-142',
  'Health',
  'Medical',
  'Sick Day Buffer',
  'Emergency meds for daycare illnesses. Tylenol, Motrin, Pedialyte. Stock before the fever hits at 2 AM.',
  'post-birth',
  NULL,
  NULL,
  'must-have',
  'USD',
  NULL,
  false,
  '6-12 Months',
  0,
  0,
  'Varies',
  false,
  NULL,
  NULL,
  NULL
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 143: Baby Hairbrush / Comb
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-BAB-HYG-143',
  'Baby Care',
  'Hygiene',
  'Baby Hairbrush / Comb',
  'Soft-bristle brush for cradle cap and hair grooming. Start using around 6 months or earlier for cradle cap.',
  'post-birth',
  NULL,
  NULL,
  'must-have',
  'USD',
  NULL,
  false,
  '6-12 Months',
  700,
  4000,
  '$7-$40',
  false,
  NULL,
  'momcozy hair core Set',
  'Safety 1st Brush & Comb Set'
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 144: Baby Toothbrush & Toothpaste
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-BAB-HYG-144',
  'Baby Care',
  'Hygiene',
  'Baby Toothbrush & Toothpaste',
  'Start brushing when first tooth appears (~6 months). Use rice-grain-sized amount of fluoride toothpaste. Finger brush works well at first.',
  'post-birth',
  NULL,
  NULL,
  'must-have',
  'USD',
  NULL,
  false,
  '6-12 Months',
  700,
  800,
  '$7-$8',
  false,
  NULL,
  'Dr. Brown''s Infant Toothbrush',
  'Baby Banana Infant Toothbrush'
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 145: Diapers (Size 3-4) — Restock
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-BAB-DIA-145',
  'Baby Care',
  'Diapering',
  'Diapers (Size 3-4) — Restock',
  'Recurring monthly. Most babies are in Size 3 around 6 months and Size 4 around 9-10 months.',
  'post-birth',
  NULL,
  NULL,
  'must-have',
  'USD',
  NULL,
  false,
  '6-12 Months',
  3000,
  8000,
  '$30-$80',
  true,
  'monthly',
  'Coterie',
  'Target Up & Up , Amazon Mama Bear, Costco Kirkland'
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 146: Diaper Cream — Restock
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-BAB-DIA-146-612M',
  'Baby Care',
  'Diapering',
  'Diaper Cream — Restock',
  'Recurring every 2-3 months. Teething + solids = more diaper rash. Keep stocked.',
  'post-birth',
  NULL,
  NULL,
  'must-have',
  'USD',
  NULL,
  false,
  '6-12 Months',
  1200,
  2000,
  '$12-$20',
  true,
  'monthly',
  'Honest Company',
  'Aquaphor, Desitin'
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 147: Wet Wipes — Restock
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-BAB-DIA-147-612M',
  'Baby Care',
  'Diapering',
  'Wet Wipes — Restock',
  'Recurring monthly. Solid food diapers are significantly messier — usage goes up.',
  'post-birth',
  NULL,
  NULL,
  'must-have',
  'USD',
  NULL,
  false,
  '6-12 Months',
  4000,
  13200,
  '$40-$132',
  true,
  'monthly',
  'Coterie The Wipe',
  'The Honest Company Wipes, Waterwipes'
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 148: Formula — Restock
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-BAB-FED-148-612M',
  'Baby Care',
  'Feeding',
  'Formula — Restock',
  'Recurring monthly. May start tapering around 9-10 months as solids increase. Continue until 12 months minimum.',
  'post-birth',
  NULL,
  NULL,
  'must-have',
  'USD',
  NULL,
  false,
  '6-12 Months',
  10000,
  10000,
  '$100',
  true,
  'monthly',
  'Bobbie Organic',
  'Enfamil, Similac'
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 149: Bottle Soap / Cleaner Agent — Restock
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-BAB-FED-149-612M',
  'Baby Care',
  'Feeding',
  'Bottle Soap / Cleaner Agent — Restock',
  'Recurring every 2-3 months. Now also cleaning sippy cups and solid feeding gear.',
  'post-birth',
  NULL,
  NULL,
  'must-have',
  'USD',
  NULL,
  false,
  '6-12 Months',
  2000,
  3000,
  '$20-$30',
  true,
  'monthly',
  'Dapple Baby',
  'Babyganics Dish Soap'
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 150: Bottles — Size 3 Nipples + Sippy Cup Intro
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-BAB-FED-150',
  'Baby Care',
  'Feeding',
  'Bottles — Size 3 Nipples + Sippy Cup Intro',
  'Upgrade to fast-flow nipples around 6 months. Start introducing sippy/straw cups alongside bottles.',
  'post-birth',
  NULL,
  NULL,
  'must-have',
  'USD',
  NULL,
  false,
  '6-12 Months',
  4000,
  6000,
  '$40-$60',
  false,
  NULL,
  'Comotomo',
  'Philips Avent, Dr Brown'
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 151: Baby Bathwash Gel — Restock
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-BAB-BAT-151-612M',
  'Baby Care',
  'Bathing',
  'Baby Bathwash Gel — Restock',
  'Recurring every 2-3 months. Daily baths often needed now with food mess.',
  'post-birth',
  NULL,
  NULL,
  'must-have',
  'USD',
  NULL,
  false,
  '6-12 Months',
  800,
  2000,
  '$8-$20',
  true,
  'monthly',
  'CeraVe Baby, Mustela Cleansing Oil',
  'Johnson''s, Cetaphil, Aveeno'
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 152: Baby Shampoo — Restock
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-BAB-BAT-152-612M',
  'Baby Care',
  'Bathing',
  'Baby Shampoo — Restock',
  'Recurring every 2-3 months.',
  'post-birth',
  NULL,
  NULL,
  'must-have',
  'USD',
  NULL,
  false,
  '6-12 Months',
  800,
  2100,
  '$8-$21',
  true,
  'monthly',
  'Mustela',
  'Aveeno Baby Daily Moisture, Aquaphor'
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 153: Baby Body Cream / Lotion — Restock
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-BAB-BAT-153-612M',
  'Baby Care',
  'Bathing',
  'Baby Body Cream / Lotion — Restock',
  'Recurring every 1-2 months.',
  'post-birth',
  NULL,
  NULL,
  'must-have',
  'USD',
  NULL,
  false,
  '6-12 Months',
  900,
  1000,
  '$9-$10',
  true,
  'monthly',
  'CeraVe',
  'Aveeno Baby Daily Moisture, Aquaphor'
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 154: Vitamin D Drops — Restock
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-BAB-FED-154-612M',
  'Baby Care',
  'Feeding',
  'Vitamin D Drops — Restock',
  'Recurring every 2-3 months. Continue through 12 months.',
  'post-birth',
  NULL,
  NULL,
  'doctor',
  'USD',
  NULL,
  false,
  '6-12 Months',
  0,
  0,
  'Varies',
  true,
  'monthly',
  NULL,
  NULL
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 155: Onesies (6-12mo size) (7)
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-BAB-DLY-155',
  'Baby Care',
  'Dailywear',
  'Onesies (6-12mo size) (7)',
  'Size up. Crawler-friendly styles; snaps at crotch for easy diaper access.',
  'post-birth',
  NULL,
  NULL,
  'must-have',
  'USD',
  NULL,
  false,
  '6-12 Months',
  7500,
  15000,
  '$75-$150',
  false,
  NULL,
  'Magnetic Me',
  'Carters baby'
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 156: Pyjamas (6-12mo size) (7)
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-BAB-DLY-156',
  'Baby Care',
  'Dailywear',
  'Pyjamas (6-12mo size) (7)',
  'Size up. Need 5-7 pairs. Footed PJs help keep socks on.',
  'post-birth',
  NULL,
  NULL,
  'must-have',
  'USD',
  NULL,
  false,
  '6-12 Months',
  8000,
  31500,
  '$80-$315',
  false,
  NULL,
  'Magnetic Me',
  'Carters baby'
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 157: Sleep Sacks (Large)
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-BAB-SLP-157',
  'Baby Care',
  'Sleeping',
  'Sleep Sacks (Large)',
  'Size up. Heavier TOG for winter or lighter for summer depending on season.',
  'post-birth',
  NULL,
  NULL,
  'must-have',
  'USD',
  NULL,
  false,
  '6-12 Months',
  0,
  0,
  'Varies',
  false,
  NULL,
  'Kyte Baby',
  'Halo SleepSack'
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 158: Baby Tylenol / Motrin — Restock
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-BAB-FAI-158',
  'Baby Care',
  'First Aid',
  'Baby Tylenol / Motrin — Restock',
  'Recurring every 2-3 months. Motrin (ibuprofen) can be added after 6 months. Critical for teething pain.',
  'post-birth',
  NULL,
  NULL,
  'must-have',
  'USD',
  NULL,
  false,
  '6-12 Months',
  0,
  0,
  'Varies',
  true,
  'monthly',
  NULL,
  NULL
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 159: Baby Sunscreen
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-HEA-SKN-159',
  'Health',
  'Skin',
  'Baby Sunscreen',
  'Can apply sunscreen starting at 6 months. Mineral/zinc oxide only. Apply before outdoor time.',
  'post-birth',
  NULL,
  NULL,
  'must-have',
  'USD',
  NULL,
  false,
  '6-12 Months',
  1000,
  4000,
  '$10-$40',
  false,
  NULL,
  'La Roche-Posay Anthelios',
  'Babyganics Mineral Sunscreen'
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 160: Sweater / Jacket (6-12mo) (2)
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-BAB-DLY-160',
  'Baby Care',
  'Dailywear',
  'Sweater / Jacket (6-12mo) (2)',
  'Seasonal outerwear sized up.',
  'post-birth',
  NULL,
  NULL,
  'good-to-have',
  'USD',
  NULL,
  false,
  '6-12 Months',
  4000,
  15000,
  '$40-$150',
  false,
  NULL,
  'Patagonia Baby Synchilla',
  'Carter''s Fleece Jacket'
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 161: Toys — Age Appropriate Refresh
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-BAB-PLY-161-612M',
  'Baby Care',
  'Playtime',
  'Toys — Age Appropriate Refresh',
  'Recurring. Stacking cups, shape sorters, push toys, board books. Focus on crawling/standing/cause-and-effect.',
  'post-birth',
  NULL,
  NULL,
  'must-have',
  'USD',
  NULL,
  false,
  '6-12 Months',
  5000,
  15000,
  '$50-$150',
  true,
  'monthly',
  'Lovevery Play Kits (6-12mo)',
  'Assorted (Amazon basics)'
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 162: Baby Toothpaste — Restock
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-BAB-HYG-162-612M',
  'Baby Care',
  'Hygiene',
  'Baby Toothpaste — Restock',
  'Recurring every 2-3 months once teeth appear.',
  'post-birth',
  NULL,
  NULL,
  'must-have',
  'USD',
  NULL,
  false,
  '6-12 Months',
  0,
  0,
  'Varies',
  true,
  'monthly',
  NULL,
  NULL
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 163: Teethers — Restock / New Types
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-BAB-TEE-163',
  'Baby Care',
  'Teething',
  'Teethers — Restock / New Types',
  'Recurring. May need different styles as molars come in. Mesh feeders with frozen fruit are great for 8+ months.',
  'post-birth',
  NULL,
  NULL,
  'must-have',
  'USD',
  NULL,
  false,
  '6-12 Months',
  500,
  1000,
  '$5-$10',
  true,
  'monthly',
  'Comotomo Silicone Teether',
  'Sophie la Girafe, Nuby Ice Gel Teether'
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 164: Baby Swim / Gym / Activity Classes
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-ACT-CLS-164-612M',
  'Activities',
  'Classes',
  'Baby Swim / Gym / Activity Classes',
  'Recurring monthly from ~9 months onwards. Parent-baby swim, baby gym, music classes, or sensory play. Great for socialization.',
  'post-birth',
  NULL,
  NULL,
  'good-to-have',
  'USD',
  NULL,
  false,
  '6-12 Months',
  0,
  0,
  'Varies',
  true,
  'monthly',
  'ISR Swim Lessons',
  'Local YMCA / community center classes'
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 165: Furniture Anchors / Anti-Tip Straps
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-SAF-BPR-165',
  'Safety',
  'Babyproofing',
  'Furniture Anchors / Anti-Tip Straps',
  'Anchor ALL tall furniture (dressers, bookshelves, TVs) to walls. #1 cause of furniture-related child deaths is tip-overs. Do this before crawling.',
  'post-birth',
  NULL,
  NULL,
  'must-have',
  'USD',
  NULL,
  false,
  '6-12 Months',
  0,
  0,
  'Varies',
  false,
  NULL,
  NULL,
  NULL
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 166: Stove Knob Covers
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-SAF-BPR-166',
  'Safety',
  'Babyproofing',
  'Stove Knob Covers',
  'Prevents baby from turning on burners. Clear plastic covers that still allow adult use.',
  'post-birth',
  NULL,
  NULL,
  'must-have',
  'USD',
  NULL,
  false,
  '6-12 Months',
  0,
  0,
  'Varies',
  false,
  NULL,
  NULL,
  NULL
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 167: Oven Door Lock
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-SAF-BPR-167',
  'Safety',
  'Babyproofing',
  'Oven Door Lock',
  'Prevents baby from opening hot oven. Heat-resistant adhesive lock.',
  'post-birth',
  NULL,
  NULL,
  'must-have',
  'USD',
  NULL,
  false,
  '6-12 Months',
  0,
  0,
  'Varies',
  false,
  NULL,
  NULL,
  NULL
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 168: Toilet Locks
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-SAF-BPR-168',
  'Safety',
  'Babyproofing',
  'Toilet Locks',
  'Drowning hazard — even a few inches of water is dangerous. Install on every toilet in the home.',
  'post-birth',
  NULL,
  NULL,
  'must-have',
  'USD',
  NULL,
  false,
  '6-12 Months',
  0,
  0,
  'Varies',
  false,
  NULL,
  NULL,
  NULL
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 169: Door Knob Covers
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-SAF-BPR-169',
  'Safety',
  'Babyproofing',
  'Door Knob Covers',
  'Prevents toddler from opening doors to stairs/garage/outside. Childproof lever or knob covers.',
  'post-birth',
  NULL,
  NULL,
  'must-have',
  'USD',
  NULL,
  false,
  '6-12 Months',
  0,
  0,
  'Varies',
  false,
  NULL,
  NULL,
  NULL
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 170: Window Guards / Stops
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-SAF-BPR-170',
  'Safety',
  'Babyproofing',
  'Window Guards / Stops',
  'Prevents windows from opening more than 4 inches (fall prevention). Install on all windows above ground floor.',
  'post-birth',
  NULL,
  NULL,
  'must-have',
  'USD',
  NULL,
  false,
  '6-12 Months',
  0,
  0,
  'Varies',
  false,
  NULL,
  NULL,
  NULL
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 171: Cord Covers / Management Kit
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-SAF-BPR-171',
  'Safety',
  'Babyproofing',
  'Cord Covers / Management Kit',
  'Secure blind cords (strangulation hazard) and electrical cords (raceways). Cleats for blinds, cord covers for electronics.',
  'post-birth',
  NULL,
  NULL,
  'must-have',
  'USD',
  NULL,
  false,
  '6-12 Months',
  0,
  0,
  'Varies',
  false,
  NULL,
  NULL,
  NULL
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 172: Non-Slip Bath Mat
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-SAF-BPR-172',
  'Safety',
  'Babyproofing',
  'Non-Slip Bath Mat',
  'For bathtub once baby transitions from infant tub. Suction-grip mat prevents slipping.',
  'post-birth',
  NULL,
  NULL,
  'must-have',
  'USD',
  NULL,
  false,
  '6-12 Months',
  0,
  0,
  'Varies',
  false,
  NULL,
  NULL,
  NULL
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 173: Appliance Latches (Dishwasher / Fridge)
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-SAF-BPR-173',
  'Safety',
  'Babyproofing',
  'Appliance Latches (Dishwasher / Fridge)',
  'Secures dishwasher, fridge, and other accessible appliance doors. Some babies figure out fridge doors by 9 months.',
  'post-birth',
  NULL,
  NULL,
  'good-to-have',
  'USD',
  NULL,
  false,
  '6-12 Months',
  0,
  0,
  'Varies',
  false,
  NULL,
  NULL,
  NULL
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 174: Activity Center / Exersaucer
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-BAB-PLY-174',
  'Baby Care',
  'Playtime',
  'Activity Center / Exersaucer',
  'Standing/bouncing station where baby develops leg strength and entertains themselves. Different from playpen — this is an active developmental toy. Use from ~5-6 months when baby can hold head up well.',
  'post-birth',
  NULL,
  NULL,
  'good-to-have',
  'USD',
  NULL,
  false,
  '6-12 Months',
  5000,
  20000,
  '$50-$200',
  false,
  NULL,
  'Baby Einstein Neptune''s Ocean Discovery',
  'Skip Hop Explore & More Activity Center'
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 175: Diaper Pail Refill Bags — Restock
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-BAB-DIA-175-612M',
  'Baby Care',
  'Diapering',
  'Diaper Pail Refill Bags — Restock',
  'Recurring every 1-2 months. Messier solid-food diapers mean more frequent bag changes.',
  'post-birth',
  NULL,
  NULL,
  'must-have',
  'USD',
  NULL,
  false,
  '6-12 Months',
  2000,
  2700,
  '$20-$27',
  true,
  'monthly',
  'Ubbi (uses standard 13-gal bags)',
  'Diaper Genie Refills'
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- =============================================================================
-- 12+ MONTHS (25 items)
-- =============================================================================

-- 176: Convertible Car Seat
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-GEA-TRA-176',
  'Gear',
  'Travel',
  'Convertible Car Seat',
  'Replaces infant bucket seat when height limit reached (~1 year). Rear-facing as long as possible.',
  'post-birth',
  NULL,
  NULL,
  'must-have',
  'USD',
  NULL,
  false,
  '12+ Months',
  30000,
  60000,
  '$300-$600',
  false,
  NULL,
  'Nuna Rava, Clek Fllo',
  'Graco Extend2Fit, Chicco NextFit'
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 177: Walking Shoes
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-CLO-SHO-177',
  'Clothing',
  'Shoes',
  'Walking Shoes',
  'Soft-soled shoes for first steps. Wait until actually walking outside. Barefoot is best indoors.',
  'post-birth',
  NULL,
  NULL,
  'must-have',
  'USD',
  NULL,
  false,
  '12+ Months',
  4000,
  5000,
  '$40-$50',
  false,
  NULL,
  'See Kai Run',
  'Stride Rite Soft Motion'
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 178: Toddler Toys & Books
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-BAB-PLY-178',
  'Baby Care',
  'Playtime',
  'Toddler Toys & Books',
  'Age-appropriate developmental toys for 12m+',
  'post-birth',
  NULL,
  NULL,
  'must-have',
  'USD',
  NULL,
  false,
  '12+ Months',
  5000,
  20000,
  '$50-$200',
  false,
  NULL,
  'Lovevery Toddler Kits',
  'Melissa & Doug'
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 179: Diapers (Size 4-5) — Restock
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-BAB-DIA-179',
  'Baby Care',
  'Diapering',
  'Diapers (Size 4-5) — Restock',
  'Recurring monthly. Most toddlers are Size 4 by 12 months and Size 5 by 18-24 months. Usage drops to ~6-8/day.',
  'post-birth',
  NULL,
  NULL,
  'must-have',
  'USD',
  NULL,
  false,
  '12+ Months',
  3000,
  8000,
  '$30-$80',
  true,
  'monthly',
  'Coterie',
  'Target Up & Up , Amazon Mama Bear, Costco Kirkland'
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 180: Diaper Cream — Restock
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-BAB-DIA-180-12M',
  'Baby Care',
  'Diapering',
  'Diaper Cream — Restock',
  'Recurring every 2-3 months.',
  'post-birth',
  NULL,
  NULL,
  'must-have',
  'USD',
  NULL,
  false,
  '12+ Months',
  1200,
  2000,
  '$12-$20',
  true,
  'monthly',
  'Honest Company',
  'Aquaphor, Desitin'
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 181: Wet Wipes — Restock
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-BAB-DIA-181-12M',
  'Baby Care',
  'Diapering',
  'Wet Wipes — Restock',
  'Recurring monthly. Also used for hands/face cleanup at meals.',
  'post-birth',
  NULL,
  NULL,
  'must-have',
  'USD',
  NULL,
  false,
  '12+ Months',
  4000,
  13200,
  '$40-$132',
  true,
  'monthly',
  'Coterie The Wipe',
  'The Honest Company Wipes, Waterwipes'
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 182: Whole Milk Transition
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-BAB-FED-182',
  'Baby Care',
  'Feeding',
  'Whole Milk Transition',
  'Transition from formula to whole milk at 12 months (per pediatrician). ~16-24oz per day.',
  'post-birth',
  NULL,
  NULL,
  'must-have',
  'USD',
  NULL,
  false,
  '12+ Months',
  0,
  0,
  'Varies',
  false,
  NULL,
  'Whole milk (any brand)',
  'Whole milk (any brand)'
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 183: Sippy Cups / Straw Cups
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-BAB-FED-183',
  'Baby Care',
  'Feeding',
  'Sippy Cups / Straw Cups',
  'Wean off bottles by 12-15 months. Straw cups preferred over sippy for oral development.',
  'post-birth',
  NULL,
  NULL,
  'must-have',
  'USD',
  NULL,
  false,
  '12+ Months',
  800,
  3500,
  '$8-$35',
  false,
  NULL,
  'Elk and Friends Straw Cup',
  'Munchkin 360, NUK Learner Cup'
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 184: Bottle Soap / Cleaner Agent — Restock
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-BAB-FED-184-12M',
  'Baby Care',
  'Feeding',
  'Bottle Soap / Cleaner Agent — Restock',
  'Recurring every 2-3 months. Still cleaning cups and feeding gear daily.',
  'post-birth',
  NULL,
  NULL,
  'must-have',
  'USD',
  NULL,
  false,
  '12+ Months',
  10000,
  10000,
  '$100',
  true,
  'monthly',
  'Dapple Baby',
  'Babyganics Dish Soap'
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 185: Baby Bathwash Gel — Restock
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-BAB-BAT-185-12M',
  'Baby Care',
  'Bathing',
  'Baby Bathwash Gel — Restock',
  'Recurring every 2-3 months. Daily baths are standard now.',
  'post-birth',
  NULL,
  NULL,
  'must-have',
  'USD',
  NULL,
  false,
  '12+ Months',
  800,
  2000,
  '$8-$20',
  true,
  'monthly',
  'CeraVe Baby, Mustela Cleansing Oil',
  'Johnson''s, Cetaphil, Aveeno'
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 186: Baby Shampoo — Restock
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-BAB-BAT-186-12M',
  'Baby Care',
  'Bathing',
  'Baby Shampoo — Restock',
  'Recurring every 2-3 months.',
  'post-birth',
  NULL,
  NULL,
  'must-have',
  'USD',
  NULL,
  false,
  '12+ Months',
  800,
  2100,
  '$8-$21',
  true,
  'monthly',
  'Mustela',
  'Aveeno Baby Daily Moisture, Aquaphor'
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 187: Baby Body Cream / Lotion — Restock
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-BAB-BAT-187-12M',
  'Baby Care',
  'Bathing',
  'Baby Body Cream / Lotion — Restock',
  'Recurring every 1-2 months.',
  'post-birth',
  NULL,
  NULL,
  'must-have',
  'USD',
  NULL,
  false,
  '12+ Months',
  900,
  1000,
  '$9-$10',
  true,
  'monthly',
  'CeraVe',
  'Aveeno Baby Daily Moisture, Aquaphor'
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 188: Onesies / Toddler Clothes (12-18mo size) (7)
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-BAB-DLY-188',
  'Baby Care',
  'Dailywear',
  'Onesies / Toddler Clothes (12-18mo size) (7)',
  'Size up. Transition from onesies to separates (shirts + pants). Stock 7-10 outfits.',
  'post-birth',
  NULL,
  NULL,
  'must-have',
  'USD',
  NULL,
  false,
  '12+ Months',
  7500,
  15000,
  '$75-$150',
  false,
  NULL,
  'Magnetic Me',
  'Carters baby'
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 189: Pyjamas (12-18mo size) (7)
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-BAB-DLY-189',
  'Baby Care',
  'Dailywear',
  'Pyjamas (12-18mo size) (7)',
  'Size up. Need 5-7 pairs.',
  'post-birth',
  NULL,
  NULL,
  'must-have',
  'USD',
  NULL,
  false,
  '12+ Months',
  8000,
  31500,
  '$80-$315',
  false,
  NULL,
  'Magnetic Me',
  'Carters baby'
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 190: Sleep Sacks (XL / Toddler)
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-BAB-SLP-190',
  'Baby Care',
  'Sleeping',
  'Sleep Sacks (XL / Toddler)',
  'Size up. Some kids use sleep sacks through age 2-3. Wearable blanket keeps them warm without loose bedding.',
  'post-birth',
  NULL,
  NULL,
  'must-have',
  'USD',
  NULL,
  false,
  '12+ Months',
  10000,
  20000,
  '$100-$200',
  false,
  NULL,
  'Kyte Baby',
  'Halo SleepSack'
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 191: Tylenol / Motrin — Restock
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-BAB-FAI-191',
  'Baby Care',
  'First Aid',
  'Tylenol / Motrin — Restock',
  'Recurring every 2-3 months. Dosage increases with weight — update with pediatrician.',
  'post-birth',
  NULL,
  NULL,
  'must-have',
  'USD',
  NULL,
  false,
  '12+ Months',
  0,
  0,
  'Varies',
  true,
  'monthly',
  NULL,
  NULL
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 192: Baby Sunscreen — Restock
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-HEA-SKN-192',
  'Health',
  'Skin',
  'Baby Sunscreen — Restock',
  'Recurring every 1-2 months in summer. Reapply every 2 hours outdoors.',
  'post-birth',
  NULL,
  NULL,
  'must-have',
  'USD',
  NULL,
  false,
  '12+ Months',
  1000,
  4000,
  '$10-$40',
  true,
  'monthly',
  'La Roche-Posay Anthelios',
  'Babyganics Mineral Sunscreen'
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 193: Sweater / Jacket (12-18mo) (2)
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-BAB-DLY-193',
  'Baby Care',
  'Dailywear',
  'Sweater / Jacket (12-18mo) (2)',
  'Seasonal outerwear sized up. Toddlers are more active — need durable outwear.',
  'post-birth',
  NULL,
  NULL,
  'good-to-have',
  'USD',
  NULL,
  false,
  '12+ Months',
  4000,
  15000,
  '$40-$150',
  false,
  NULL,
  'Patagonia Baby Synchilla',
  'Carter''s Fleece Jacket'
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 194: Toys — Age Appropriate Refresh
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-BAB-PLY-194-12M',
  'Baby Care',
  'Playtime',
  'Toys — Age Appropriate Refresh',
  'Recurring. Walking toys, ride-ons, stacking/nesting, crayons, puzzles. Developmental focus shifts to language and motor skills.',
  'post-birth',
  NULL,
  NULL,
  'must-have',
  'USD',
  NULL,
  false,
  '12+ Months',
  5000,
  20000,
  '$50-$200',
  true,
  'monthly',
  'Lovevery Toddler Kits',
  'Melissa & Doug'
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 195: Baby Toothpaste — Restock
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-BAB-HYG-195-12M',
  'Baby Care',
  'Hygiene',
  'Baby Toothpaste — Restock',
  'Recurring every 2-3 months. Increase to pea-sized amount of fluoride toothpaste.',
  'post-birth',
  NULL,
  NULL,
  'must-have',
  'USD',
  NULL,
  false,
  '12+ Months',
  0,
  0,
  'Varies',
  true,
  'monthly',
  NULL,
  NULL
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 196: Toddler Toothbrush — Replace
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-BAB-HYG-196',
  'Baby Care',
  'Hygiene',
  'Toddler Toothbrush — Replace',
  'Replace toothbrush every 3 months. Upgrade to age-appropriate size.',
  'post-birth',
  NULL,
  NULL,
  'must-have',
  'USD',
  NULL,
  false,
  '12+ Months',
  200,
  800,
  '$2-$8',
  false,
  NULL,
  'Baby Banana Infant Toothbrush',
  'Colgate Kids Toothbrush'
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 197: Teethers — Restock
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-BAB-TEE-197',
  'Baby Care',
  'Teething',
  'Teethers — Restock',
  'Recurring. Molars come in 12-18 months — painful. Frozen washcloth trick works well too.',
  'post-birth',
  NULL,
  NULL,
  'must-have',
  'USD',
  NULL,
  false,
  '12+ Months',
  0,
  0,
  'Varies',
  true,
  'monthly',
  'Comotomo Silicone Teether',
  'Nuby Ice Gel Teether'
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 198: Baby Swim / Gym / Activity Classes
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-ACT-CLS-198-12M',
  'Activities',
  'Classes',
  'Baby Swim / Gym / Activity Classes',
  'Recurring monthly. Continued from 9 months. Swimming, tumbling, music, Montessori-style play. Critical for socialization and development.',
  'post-birth',
  NULL,
  NULL,
  'must-have',
  'USD',
  NULL,
  false,
  '12+ Months',
  0,
  0,
  'Varies',
  true,
  'monthly',
  'ISR Swim Lessons / Gymboree',
  'Local YMCA / community center classes'
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 199: Walking Shoes — Size Up
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-CLO-SHO-199',
  'Clothing',
  'Shoes',
  'Walking Shoes — Size Up',
  'Recurring every 3-4 months. Toddler feet grow fast — check sizing monthly. Continue soft-soled shoes.',
  'post-birth',
  NULL,
  NULL,
  'must-have',
  'USD',
  NULL,
  false,
  '12+ Months',
  0,
  0,
  'Varies',
  true,
  'monthly',
  'See Kai Run',
  'Stride Rite Soft Motion'
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;

-- 200: Diaper Pail Refill Bags — Restock
INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_currency, notes, is_premium, period, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value)
VALUES (
  'BUD-BAB-DIA-200-12M',
  'Baby Care',
  'Diapering',
  'Diaper Pail Refill Bags — Restock',
  'Recurring every 1-2 months. Continues until potty training (~2-3 years).',
  'post-birth',
  NULL,
  NULL,
  'must-have',
  'USD',
  NULL,
  false,
  '12+ Months',
  2000,
  2700,
  '$20-$27',
  true,
  'monthly',
  'Ubbi (uses standard 13-gal bags)',
  'Diaper Genie Refills'
) ON CONFLICT (budget_id) DO UPDATE SET
  period = EXCLUDED.period,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_display = EXCLUDED.price_display,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  brand_premium = EXCLUDED.brand_premium,
  brand_value = EXCLUDED.brand_value,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes;
