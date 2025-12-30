-- Budget Templates Seed Data
-- Generated: 2025-12-30T17:43:56.347Z
-- Source: content/budget.json

INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_low, price_mid, price_high, price_currency, notes, is_premium)
VALUES (
  'BUD-ADM-CHI-001',
  'Admin',
  'Childcare',
  'Daycare Deposit',
  'Secures a spot on the waitlist. Critical for metro areas where waitlists exceed 9 months.',
  'pregnancy',
  12,
  20,
  'must-have',
  10000,
  50000,
  150000,
  'USD',
  'Non-refundable. Do this immediately after the 12-week scan.',
  true
) ON CONFLICT (budget_id) DO NOTHING;

INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_low, price_mid, price_high, price_currency, notes, is_premium)
VALUES (
  'BUD-ADM-LEG-002',
  'Admin',
  'Legal',
  'Life Insurance',
  'Term life policy for both parents (10x annual income recommended).',
  'pregnancy',
  20,
  30,
  'must-have',
  30000,
  60000,
  120000,
  'USD',
  'Price is annual premium. Apply before birth to avoid medical delays.',
  false
) ON CONFLICT (budget_id) DO NOTHING;

INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_low, price_mid, price_high, price_currency, notes, is_premium)
VALUES (
  'BUD-ADM-LEG-003',
  'Admin',
  'Legal',
  'Will & Estate Plan',
  'Legal guardianship designation for the child.',
  'pregnancy',
  24,
  36,
  'must-have',
  10000,
  50000,
  200000,
  'USD',
  'LegalZoom (Low) vs. Attorney (High). Essential for asset protection.',
  false
) ON CONFLICT (budget_id) DO NOTHING;

INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_low, price_mid, price_high, price_currency, notes, is_premium)
VALUES (
  'BUD-NUR-FUR-004',
  'Nursery',
  'Furniture',
  'Crib',
  'Standard full-size crib. Avoid drop-sides (banned).',
  'pregnancy',
  20,
  28,
  'must-have',
  15000,
  35000,
  80000,
  'USD',
  'Order early. Supply chain lead times can be 8-12 weeks for furniture.',
  false
) ON CONFLICT (budget_id) DO NOTHING;

INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_low, price_mid, price_high, price_currency, notes, is_premium)
VALUES (
  'BUD-NUR-FUR-005',
  'Nursery',
  'Furniture',
  'Crib Mattress',
  'Firm infant mattress. Must fit snugly in crib frame.',
  'pregnancy',
  20,
  28,
  'must-have',
  5000,
  15000,
  35000,
  'USD',
  'Two-finger test'': no more than 2 fingers width between mattress and crib.',
  false
) ON CONFLICT (budget_id) DO NOTHING;

INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_low, price_mid, price_high, price_currency, notes, is_premium)
VALUES (
  'BUD-NUR-FUR-006',
  'Nursery',
  'Furniture',
  'Glider/Rocker',
  'Chair for feeding/soothing. High back for head support is critical.',
  'pregnancy',
  24,
  32,
  'good-to-have',
  20000,
  45000,
  120000,
  'USD',
  'Test for ability to stand up without using hands (you will be holding a baby).',
  false
) ON CONFLICT (budget_id) DO NOTHING;

INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_low, price_mid, price_high, price_currency, notes, is_premium)
VALUES (
  'BUD-NUR-DEC-007',
  'Nursery',
  'Decor',
  'Blackout Curtains',
  'Room darkening shades to extend sleep cycles.',
  'pregnancy',
  28,
  34,
  'must-have',
  3000,
  6000,
  15000,
  'USD',
  'Protocol Hack: Pitch black room = longer naps.',
  true
) ON CONFLICT (budget_id) DO NOTHING;

INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_low, price_mid, price_high, price_currency, notes, is_premium)
VALUES (
  'BUD-GEA-TRA-008',
  'Gear',
  'Travel',
  'Infant Car Seat',
  'Bucket seat'' for 0-12 months. Removable base.',
  'pregnancy',
  28,
  34,
  'must-have',
  15000,
  25000,
  55000,
  'USD',
  'DO NOT BUY USED. Expired/crashed seats are invisible risks.',
  true
) ON CONFLICT (budget_id) DO NOTHING;

INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_low, price_mid, price_high, price_currency, notes, is_premium)
VALUES (
  'BUD-GEA-TRA-009',
  'Gear',
  'Travel',
  'Stroller',
  'Full-size stroller compatible with car seat (Travel System).',
  'pregnancy',
  28,
  34,
  'must-have',
  25000,
  50000,
  120000,
  'USD',
  'Look for ''one-hand fold'' capability. Test trunk fit before buying.',
  true
) ON CONFLICT (budget_id) DO NOTHING;

INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_low, price_mid, price_high, price_currency, notes, is_premium)
VALUES (
  'BUD-GEA-WEA-010',
  'Gear',
  'Wearable',
  'Baby Carrier',
  'Soft structured carrier or wrap for ''baby wearing''.',
  'pregnancy',
  32,
  38,
  'good-to-have',
  4000,
  12000,
  20000,
  'USD',
  'Essential for ''Dad Ops''â€”allows gaming/working while holding baby.',
  true
) ON CONFLICT (budget_id) DO NOTHING;

INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_low, price_mid, price_high, price_currency, notes, is_premium)
VALUES (
  'BUD-GEA-SLE-011',
  'Gear',
  'Sleep',
  'Bassinet',
  'Portable sleep space for parents'' room (0-4 months).',
  'pregnancy',
  30,
  36,
  'must-have',
  8000,
  20000,
  160000,
  'USD',
  'High end includes ''Snoo'' (smart bassinet). AAP recs room sharing for 6mo.',
  true
) ON CONFLICT (budget_id) DO NOTHING;

INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_low, price_mid, price_high, price_currency, notes, is_premium)
VALUES (
  'BUD-HEA-REC-012',
  'Health',
  'Recovery',
  'Postpartum Kit',
  'Pads, peri-bottle, witch hazel, pain relief spray for Mom.',
  'pregnancy',
  34,
  38,
  'must-have',
  4000,
  8000,
  15000,
  'USD',
  'FridaMom makes a standard kit. Do not skimp on this.',
  true
) ON CONFLICT (budget_id) DO NOTHING;

INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_low, price_mid, price_high, price_currency, notes, is_premium)
VALUES (
  'BUD-FEE-LAC-013',
  'Feeding',
  'Lactation',
  'Breast Pump',
  'Electric pump for milk extraction.',
  'pregnancy',
  28,
  36,
  'must-have',
  NULL,
  15000,
  50000,
  'USD',
  'Often free via insurance (ACA). Check coverage first before buying.',
  true
) ON CONFLICT (budget_id) DO NOTHING;

INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_low, price_mid, price_high, price_currency, notes, is_premium)
VALUES (
  'BUD-FEE-BOT-014',
  'Feeding',
  'Bottle',
  'Bottle Starter Set',
  '4-5 bottles (4oz and 8oz) with slow-flow nipples.',
  'pregnancy',
  34,
  38,
  'must-have',
  3000,
  6000,
  10000,
  'USD',
  'Get a ''sampler pack'' first; babies are picky about nipple shape.',
  true
) ON CONFLICT (budget_id) DO NOTHING;

INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_low, price_mid, price_high, price_currency, notes, is_premium)
VALUES (
  'BUD-DIA-SET-015',
  'Diapering',
  'Setup',
  'Diaper Pail',
  'Odor-locking trash can. Steel is better than plastic for smell.',
  'pregnancy',
  32,
  36,
  'good-to-have',
  4000,
  8000,
  12000,
  'USD',
  'Ubbi (steel) vs. Diaper Genie (plastic). Factor in cost of specialty bags.',
  true
) ON CONFLICT (budget_id) DO NOTHING;

INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_low, price_mid, price_high, price_currency, notes, is_premium)
VALUES (
  'BUD-DIA-CON-016',
  'Diapering',
  'Consumable',
  'Diapers (Month 1)',
  'Newborn (NB) and Size 1 supply.',
  'pregnancy',
  36,
  38,
  'must-have',
  5000,
  8000,
  10000,
  'USD',
  'Don''t overbuy NB size; they grow out of it in 2-4 weeks.',
  true
) ON CONFLICT (budget_id) DO NOTHING;

INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_low, price_mid, price_high, price_currency, notes, is_premium)
VALUES (
  'BUD-TEC-MON-017',
  'Tech',
  'Monitoring',
  'Baby Monitor',
  'Video/Audio monitor.',
  'pregnancy',
  32,
  36,
  'must-have',
  5000,
  16000,
  35000,
  'USD',
  'WiFi (Nanit) vs. Local RF (Infant Optics). WiFi has latency; RF is bulletproof.',
  true
) ON CONFLICT (budget_id) DO NOTHING;

INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_low, price_mid, price_high, price_currency, notes, is_premium)
VALUES (
  'BUD-HEA-SAF-018',
  'Health',
  'Safety',
  'Infant Medical Kit',
  'Rectal thermometer, nail clippers, nose sucker (Frida).',
  'pregnancy',
  34,
  38,
  'must-have',
  2500,
  5000,
  8000,
  'USD',
  'Fever in newborn (<3mo) is an ER trip. Accurate thermometer is vital.',
  true
) ON CONFLICT (budget_id) DO NOTHING;

INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_low, price_mid, price_high, price_currency, notes, is_premium)
VALUES (
  'BUD-ADM-DOC-019',
  'Admin',
  'Docs',
  'Birth Certificate',
  'Certified copies x3.',
  'post-birth',
  1,
  4,
  'must-have',
  2500,
  7500,
  10000,
  'USD',
  'Order multiple copies immediately. Needed for insurance/passport.',
  true
) ON CONFLICT (budget_id) DO NOTHING;

INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_low, price_mid, price_high, price_currency, notes, is_premium)
VALUES (
  'BUD-ADM-DOC-020',
  'Admin',
  'Docs',
  'Passport',
  'US Passport for infant.',
  'post-birth',
  8,
  12,
  'good-to-have',
  13500,
  16500,
  20000,
  'USD',
  'Both parents must be present at application. Photos are tricky.',
  true
) ON CONFLICT (budget_id) DO NOTHING;

INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_low, price_mid, price_high, price_currency, notes, is_premium)
VALUES (
  'BUD-FEE-SOL-021',
  'Feeding',
  'Solids',
  'High Chair',
  'Easy-to-clean chair for solids introduction.',
  'post-birth',
  20,
  24,
  'must-have',
  3000,
  15000,
  40000,
  'USD',
  'Footrest is critical for safe swallowing (posture). IKEA Antilop is the budget king.',
  false
) ON CONFLICT (budget_id) DO NOTHING;

INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_low, price_mid, price_high, price_currency, notes, is_premium)
VALUES (
  'BUD-FEE-SOL-022',
  'Feeding',
  'Solids',
  'Feeding Gear',
  'Bibs, silicone plates, tiny cups.',
  'post-birth',
  22,
  25,
  'must-have',
  2000,
  5000,
  10000,
  'USD',
  'Look for ''open cups'' to teach oral motor skills.',
  false
) ON CONFLICT (budget_id) DO NOTHING;

INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_low, price_mid, price_high, price_currency, notes, is_premium)
VALUES (
  'BUD-SAF-HOM-023',
  'Safety',
  'Home',
  'Baby Gates',
  'Hardware-mounted for stairs; pressure for rooms.',
  'post-birth',
  24,
  30,
  'must-have',
  5000,
  10000,
  30000,
  'USD',
  'Install BEFORE they crawl. Top of stairs MUST be hardware mounted.',
  false
) ON CONFLICT (budget_id) DO NOTHING;

INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_low, price_mid, price_high, price_currency, notes, is_premium)
VALUES (
  'BUD-SAF-HOM-024',
  'Safety',
  'Home',
  'Cabinet Locks',
  'Magnetic or latch locks for chemicals/knives.',
  'post-birth',
  24,
  30,
  'must-have',
  2000,
  4000,
  10000,
  'USD',
  'Focus on ''kill zones'': under sink and knife drawers.',
  false
) ON CONFLICT (budget_id) DO NOTHING;

INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_low, price_mid, price_high, price_currency, notes, is_premium)
VALUES (
  'BUD-GEA-TRA-025',
  'Gear',
  'Travel',
  'Convertible Car Seat',
  'Larger seat for toddlerhood (rear-facing).',
  'post-birth',
  36,
  44,
  'must-have',
  15000,
  35000,
  60000,
  'USD',
  'Replaces infant bucket seat when height limit reached (~1 year).',
  true
) ON CONFLICT (budget_id) DO NOTHING;

INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_low, price_mid, price_high, price_currency, notes, is_premium)
VALUES (
  'BUD-GEA-TRA-026',
  'Gear',
  'Travel',
  'Travel Stroller',
  'Lightweight, foldable for airplanes.',
  'post-birth',
  24,
  52,
  'good-to-have',
  10000,
  30000,
  50000,
  'USD',
  'Fits in overhead bin (e.g., Babyzen Yoyo).',
  false
) ON CONFLICT (budget_id) DO NOTHING;

INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_low, price_mid, price_high, price_currency, notes, is_premium)
VALUES (
  'BUD-CLO-SHO-027',
  'Clothing',
  'Shoes',
  'Walking Shoes',
  'Soft-soled shoes for first steps.',
  'post-birth',
  48,
  60,
  'must-have',
  2000,
  4000,
  6000,
  'USD',
  'Wait until they are actually walking outside. Barefoot is best indoors.',
  true
) ON CONFLICT (budget_id) DO NOTHING;

INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_low, price_mid, price_high, price_currency, notes, is_premium)
VALUES (
  'BUD-HEA-MED-028',
  'Health',
  'Medical',
  'Sick Day Buffer',
  'Emergency fund / meds for daycare illnesses.',
  'post-birth',
  12,
  100,
  'must-have',
  5000,
  10000,
  20000,
  'USD',
  'Tylenol, Motrin, Pedialyte. Stock before the fever hits at 2 AM.',
  true
) ON CONFLICT (budget_id) DO NOTHING;

INSERT INTO budget_templates (budget_id, category, subcategory, item, description, stage, week_start, week_end, priority, price_low, price_mid, price_high, price_currency, notes, is_premium)
VALUES (
  'BUD-ADM-EDU-029',
  'Admin',
  'Education',
  '529 Contribution',
  'College savings fund.',
  'post-birth',
  4,
  500,
  'good-to-have',
  5000,
  50000,
  500000,
  'USD',
  'Compound interest is the goal. Set auto-draft.',
  true
) ON CONFLICT (budget_id) DO NOTHING;

