-- Checklist Templates Seed Data
-- Generated: 2025-12-30T17:43:56.346Z
-- Source: content/checklists.json

-- Part 1: Checklist Templates (parent records)
INSERT INTO checklist_templates (checklist_id, name, description, stage, week_relevant, is_premium, sort_order)
VALUES (
  'CL-01',
  'Hospital Bag â€” Mom',
  'Everything mom needs packed and ready for labor and delivery',
  'pregnancy',
  '35-36',
  false,
  0
) ON CONFLICT (checklist_id) DO NOTHING;

INSERT INTO checklist_templates (checklist_id, name, description, stage, week_relevant, is_premium, sort_order)
VALUES (
  'CL-02',
  'Hospital Bag â€” Dad',
  'Everything dad needs for the hospital stay during labor and delivery',
  'pregnancy',
  '35-36',
  false,
  1
) ON CONFLICT (checklist_id) DO NOTHING;

INSERT INTO checklist_templates (checklist_id, name, description, stage, week_relevant, is_premium, sort_order)
VALUES (
  'CL-03',
  'First Car Ride Home',
  'Everything you need for baby''s first car trip from hospital to home',
  'post-birth',
  '0',
  false,
  2
) ON CONFLICT (checklist_id) DO NOTHING;

INSERT INTO checklist_templates (checklist_id, name, description, stage, week_relevant, is_premium, sort_order)
VALUES (
  'CL-04',
  'First Pediatrician Visit',
  'What to bring and ask at baby''s first doctor appointment',
  'post-birth',
  '1',
  false,
  3
) ON CONFLICT (checklist_id) DO NOTHING;

INSERT INTO checklist_templates (checklist_id, name, description, stage, week_relevant, is_premium, sort_order)
VALUES (
  'CL-05',
  'First Flight with Baby',
  'Everything you need to survive air travel with an infant',
  'post-birth',
  '8+',
  true,
  4
) ON CONFLICT (checklist_id) DO NOTHING;

INSERT INTO checklist_templates (checklist_id, name, description, stage, week_relevant, is_premium, sort_order)
VALUES (
  'CL-06',
  'First Restaurant Outing',
  'How to successfully eat at a restaurant with a baby',
  'post-birth',
  '6+',
  true,
  5
) ON CONFLICT (checklist_id) DO NOTHING;

INSERT INTO checklist_templates (checklist_id, name, description, stage, week_relevant, is_premium, sort_order)
VALUES (
  'CL-07',
  'First Road Trip',
  'Everything you need for a 2+ hour car trip with baby',
  'post-birth',
  '8+',
  true,
  6
) ON CONFLICT (checklist_id) DO NOTHING;

INSERT INTO checklist_templates (checklist_id, name, description, stage, week_relevant, is_premium, sort_order)
VALUES (
  'CL-08',
  'First Night Away from Baby',
  'How to prepare when leaving baby with a caregiver overnight',
  'post-birth',
  '12+',
  true,
  7
) ON CONFLICT (checklist_id) DO NOTHING;

INSERT INTO checklist_templates (checklist_id, name, description, stage, week_relevant, is_premium, sort_order)
VALUES (
  'CL-09',
  'First Hotel Stay',
  'How to survive staying in a hotel with a baby',
  'post-birth',
  '12+',
  true,
  8
) ON CONFLICT (checklist_id) DO NOTHING;

INSERT INTO checklist_templates (checklist_id, name, description, stage, week_relevant, is_premium, sort_order)
VALUES (
  'CL-10',
  'Daycare Tour Questions',
  'What to look for and ask when touring daycare facilities',
  'pregnancy',
  '20-28',
  true,
  9
) ON CONFLICT (checklist_id) DO NOTHING;

INSERT INTO checklist_templates (checklist_id, name, description, stage, week_relevant, is_premium, sort_order)
VALUES (
  'CL-11',
  'Returning to Work',
  'Everything you need to prepare for going back to work after baby',
  'post-birth',
  '8-12',
  true,
  10
) ON CONFLICT (checklist_id) DO NOTHING;

INSERT INTO checklist_templates (checklist_id, name, description, stage, week_relevant, is_premium, sort_order)
VALUES (
  'CL-12',
  'Babyproofing Home',
  'Room by room checklist for making your home safe before crawling',
  'post-birth',
  '20-28',
  false,
  11
) ON CONFLICT (checklist_id) DO NOTHING;

INSERT INTO checklist_templates (checklist_id, name, description, stage, week_relevant, is_premium, sort_order)
VALUES (
  'CL-13',
  'Starting Solid Foods',
  'Everything you need to introduce solid foods safely',
  'post-birth',
  '20-24',
  false,
  12
) ON CONFLICT (checklist_id) DO NOTHING;

INSERT INTO checklist_templates (checklist_id, name, description, stage, week_relevant, is_premium, sort_order)
VALUES (
  'CL-14',
  'Baby''s First Illness',
  'What to have on hand and when to call the doctor',
  'post-birth',
  '4+',
  false,
  13
) ON CONFLICT (checklist_id) DO NOTHING;

INSERT INTO checklist_templates (checklist_id, name, description, stage, week_relevant, is_premium, sort_order)
VALUES (
  'CL-15',
  'Emergency Info Sheet',
  'One page document for babysitters and emergencies',
  'pregnancy',
  '36+',
  false,
  14
) ON CONFLICT (checklist_id) DO NOTHING;


-- Part 2: Checklist Item Templates (child records)
INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-01-001',
  'CL-01',
  'Documents',
  'ID and insurance card',
  'Government ID and insurance card - hospital will need both at check-in',
  TRUE,
  'bring',
  0
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-01-002',
  'CL-01',
  'Documents',
  'Birth plan (if any)',
  'Printed copies for nurses and doctor - keep expectations flexible',
  FALSE,
  'bring',
  1
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-01-003',
  'CL-01',
  'Documents',
  'Hospital pre-registration confirmation',
  'Most hospitals let you pre-register online - do this around week 32',
  TRUE,
  'bring',
  2
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-01-004',
  'CL-01',
  'Documents',
  'Pediatrician contact info',
  'Name and phone number of the pediatrician you''ve chosen',
  TRUE,
  'bring',
  3
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-01-005',
  'CL-01',
  'Clothing',
  'Robe',
  'Comfortable robe for walking halls during labor and postpartum',
  TRUE,
  'bring',
  4
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-01-006',
  'CL-01',
  'Clothing',
  'Non-slip socks',
  'Hospital floors are slippery - bring warm socks with grip',
  TRUE,
  'bring',
  5
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-01-007',
  'CL-01',
  'Clothing',
  'Nursing bras (2-3)',
  'Even if not planning to nurse - breasts will be swollen',
  TRUE,
  'bring',
  6
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-01-008',
  'CL-01',
  'Clothing',
  'Going-home outfit',
  'Loose and comfortable - you''ll still look 5-6 months pregnant',
  TRUE,
  'bring',
  7
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-01-009',
  'CL-01',
  'Clothing',
  'Underwear',
  'Bring underwear you don''t mind throwing away - or use hospital mesh',
  TRUE,
  'bring',
  8
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-01-010',
  'CL-01',
  'Toiletries',
  'Toothbrush and toothpaste',
  'Hospital may provide but yours is better',
  TRUE,
  'bring',
  9
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-01-011',
  'CL-01',
  'Toiletries',
  'Lip balm',
  'Hospitals are very dry - lips will crack',
  TRUE,
  'bring',
  10
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-01-012',
  'CL-01',
  'Toiletries',
  'Hair ties',
  'Keep hair out of face during labor',
  TRUE,
  'bring',
  11
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-01-013',
  'CL-01',
  'Toiletries',
  'Face wipes',
  'Refreshing when you can''t shower',
  FALSE,
  'bring',
  12
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-01-014',
  'CL-01',
  'Toiletries',
  'Glasses or contacts',
  'If you wear them - don''t forget',
  TRUE,
  'bring',
  13
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-01-015',
  'CL-01',
  'Toiletries',
  'Shampoo and conditioner',
  'Hospital soap is harsh',
  FALSE,
  'bring',
  14
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-01-016',
  'CL-01',
  'Comfort',
  'Phone charger with long cord',
  'Hospital outlets are often far from bed - bring 6ft+ cord',
  TRUE,
  'bring',
  15
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-01-017',
  'CL-01',
  'Comfort',
  'Pillow from home',
  'Hospital pillows are flat and uncomfortable - use a colored pillowcase so it doesn''t get mixed up',
  FALSE,
  'bring',
  16
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-01-018',
  'CL-01',
  'Comfort',
  'Eye mask',
  'Helps sleep when nurses come in at all hours',
  FALSE,
  'bring',
  17
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-01-019',
  'CL-01',
  'Comfort',
  'Headphones',
  'For music during labor or drowning out hospital noise',
  FALSE,
  'bring',
  18
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-01-020',
  'CL-01',
  'Postpartum',
  'Nipple cream',
  'Lanolin or similar - nursing can be rough on nipples initially',
  TRUE,
  'bring',
  19
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-01-021',
  'CL-01',
  'Postpartum',
  'Peri bottle',
  'Hospital provides but you can bring your own nicer one',
  FALSE,
  'bring',
  20
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-01-022',
  'CL-01',
  'Postpartum',
  'Heavy pads',
  'Hospital provides but pack some for the ride home',
  TRUE,
  'bring',
  21
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-01-023',
  'CL-01',
  'Baby',
  'Going-home outfit for baby',
  'Weather appropriate - newborns can''t regulate temperature well',
  TRUE,
  'bring',
  22
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-01-024',
  'CL-01',
  'Baby',
  'Swaddle blanket',
  'For the ride home and photos',
  TRUE,
  'bring',
  23
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-01-025',
  'CL-01',
  'Baby',
  'Car seat installed in car',
  'Required for discharge - have it checked before due date',
  TRUE,
  'bring',
  24
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-01-026',
  'CL-01',
  'Optional',
  'Snacks',
  'Labor is long - pack protein bars and easy snacks',
  FALSE,
  'bring',
  25
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-01-027',
  'CL-01',
  'Optional',
  'Bluetooth speaker',
  'For music during labor',
  FALSE,
  'bring',
  26
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-01-028',
  'CL-01',
  'Optional',
  'Tablet with downloaded shows',
  'Entertainment during long early labor or recovery',
  FALSE,
  'bring',
  27
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-01-029',
  'CL-01',
  'Optional',
  'Nursing pillow',
  'Hospital has some but yours is more comfortable',
  FALSE,
  'bring',
  28
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-02-001',
  'CL-02',
  'Essentials',
  'ID',
  'May be needed for hospital security or check-in',
  TRUE,
  'bring',
  0
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-02-002',
  'CL-02',
  'Essentials',
  'Insurance card',
  'Backup copy in case mom''s is misplaced',
  TRUE,
  'bring',
  1
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-02-003',
  'CL-02',
  'Essentials',
  'Phone charger',
  'Long cord recommended - you''ll be on your phone a lot',
  TRUE,
  'bring',
  2
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-02-004',
  'CL-02',
  'Essentials',
  'Cash',
  'For vending machines and parking - $40-60 recommended',
  TRUE,
  'bring',
  3
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-02-005',
  'CL-02',
  'Essentials',
  'Credit card',
  'For cafeteria and any unexpected needs',
  TRUE,
  'bring',
  4
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-02-006',
  'CL-02',
  'Clothing',
  'Change of clothes (2 days)',
  'Labor can be long - pack like a short trip',
  TRUE,
  'bring',
  5
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-02-007',
  'CL-02',
  'Clothing',
  'Comfortable shoes',
  'You''ll be on your feet a lot - skip the dress shoes',
  TRUE,
  'bring',
  6
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-02-008',
  'CL-02',
  'Clothing',
  'Flip flops for shower',
  'Hospital showers need shower shoes',
  TRUE,
  'bring',
  7
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-02-009',
  'CL-02',
  'Clothing',
  'Jacket or hoodie',
  'Hospitals are cold - especially at night',
  TRUE,
  'bring',
  8
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-02-010',
  'CL-02',
  'Sleep',
  'Pillow',
  'Hospital chairs and fold-out beds are uncomfortable',
  TRUE,
  'bring',
  9
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-02-011',
  'CL-02',
  'Sleep',
  'Blanket',
  'Hospital may provide but bring your own to be sure',
  FALSE,
  'bring',
  10
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-02-012',
  'CL-02',
  'Sleep',
  'Eye mask',
  'Room will never be fully dark - nurses come in constantly',
  FALSE,
  'bring',
  11
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-02-013',
  'CL-02',
  'Sleep',
  'Earplugs',
  'Hospital is noisy - protect your sleep when you can get it',
  FALSE,
  'bring',
  12
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-02-014',
  'CL-02',
  'Entertainment',
  'Book or e-reader',
  'Early labor can be slow - you''ll have downtime',
  FALSE,
  'bring',
  13
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-02-015',
  'CL-02',
  'Entertainment',
  'Tablet with downloaded content',
  'Hospital wifi is often terrible - download shows in advance',
  FALSE,
  'bring',
  14
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-02-016',
  'CL-02',
  'Entertainment',
  'Headphones',
  'For entertainment without disturbing mom',
  TRUE,
  'bring',
  15
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-02-017',
  'CL-02',
  'Sustenance',
  'Snacks',
  'Protein bars and nuts - cafeteria may be closed at night',
  TRUE,
  'bring',
  16
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-02-018',
  'CL-02',
  'Sustenance',
  'Empty water bottle',
  'Stay hydrated - refill at water stations',
  TRUE,
  'bring',
  17
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-02-019',
  'CL-02',
  'Sustenance',
  'Coffee money or travel mug',
  'You will need caffeine - know where the coffee is',
  FALSE,
  'bring',
  18
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-02-020',
  'CL-02',
  'Support',
  'Camera',
  'Phone works but dedicated camera takes better photos',
  FALSE,
  'bring',
  19
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-02-021',
  'CL-02',
  'Support',
  'List of people to notify',
  'Pre-written text message ready to send after birth',
  TRUE,
  'bring',
  20
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-02-022',
  'CL-02',
  'Support',
  'Massage ball or tennis ball',
  'For counter-pressure during back labor - can be huge relief',
  FALSE,
  'bring',
  21
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-02-023',
  'CL-02',
  'Don''t Forget',
  'Car seat installed and inspected',
  'Baby cannot leave hospital without it - check installation before due date',
  TRUE,
  'do',
  22
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-02-024',
  'CL-02',
  'Don''t Forget',
  'Baby''s going-home outfit',
  'Pack in mom''s bag or yours - just make sure it''s packed',
  TRUE,
  'bring',
  23
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-02-025',
  'CL-02',
  'Don''t Forget',
  'Full tank of gas',
  'Fill up the car around week 37 and keep it topped off',
  TRUE,
  'do',
  24
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-02-026',
  'CL-02',
  'Don''t Forget',
  'Know the route to hospital',
  'Drive it once beforehand - know parking and entrance locations',
  TRUE,
  'do',
  25
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-03-001',
  'CL-03',
  'Before Discharge',
  'Car seat properly installed',
  'Rear-facing in back seat - base secured tightly (less than 1 inch movement)',
  TRUE,
  'do',
  0
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-03-002',
  'CL-03',
  'Before Discharge',
  'Car seat inspected by professional',
  'Fire station or certified tech - do this before due date not day of discharge',
  TRUE,
  'do',
  1
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-03-003',
  'CL-03',
  'Before Discharge',
  'Practice buckling with doll',
  'Car seat buckles are tricky - practice before baby arrives',
  TRUE,
  'do',
  2
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-03-004',
  'CL-03',
  'Before Discharge',
  'Understand chest clip position',
  'Clip should be at armpit level - not on belly or neck',
  TRUE,
  'do',
  3
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-03-005',
  'CL-03',
  'Safety',
  'No puffy coats in car seat',
  'Coat goes over buckled baby as blanket - not under straps',
  TRUE,
  'do',
  4
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-03-006',
  'CL-03',
  'Safety',
  'Straps snug but not tight',
  'Should not be able to pinch strap material at shoulder',
  TRUE,
  'do',
  5
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-03-007',
  'CL-03',
  'Safety',
  'Check car seat angle',
  'Most have a level indicator - head should not flop forward',
  TRUE,
  'do',
  6
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-03-008',
  'CL-03',
  'What to Bring',
  'Weather-appropriate blanket',
  'For over the buckled baby if cold - not under straps',
  TRUE,
  'bring',
  7
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-03-009',
  'CL-03',
  'What to Bring',
  'Diaper bag with 2-3 diapers',
  'Probably won''t need but be prepared',
  TRUE,
  'bring',
  8
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-03-010',
  'CL-03',
  'What to Bring',
  'Wipes',
  'Pack travel pack in diaper bag',
  TRUE,
  'bring',
  9
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-03-011',
  'CL-03',
  'What to Bring',
  'Change of clothes for baby',
  'Blowouts happen - be prepared',
  TRUE,
  'bring',
  10
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-03-012',
  'CL-03',
  'What to Bring',
  'Burp cloth',
  'For spit-up during ride',
  TRUE,
  'bring',
  11
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-03-013',
  'CL-03',
  'Optional',
  'Rear-facing mirror',
  'Lets you see baby from driver seat - install before discharge',
  FALSE,
  'bring',
  12
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-03-014',
  'CL-03',
  'Optional',
  'Window shade',
  'Blocks sun from baby''s eyes',
  FALSE,
  'bring',
  13
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-03-015',
  'CL-03',
  'The Drive',
  'Drive slowly and carefully',
  'This is not a race - take your time',
  TRUE,
  'do',
  14
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-03-016',
  'CL-03',
  'The Drive',
  'Take surface streets if anxious',
  'Highway is fine but local roads feel safer to some parents',
  FALSE,
  'do',
  15
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-03-017',
  'CL-03',
  'The Drive',
  'Go directly home',
  'No errands - no stopping - baby and mom need rest',
  TRUE,
  'do',
  16
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-03-018',
  'CL-03',
  'The Drive',
  'One parent in back seat optional',
  'If it makes you feel better to sit with baby first time',
  FALSE,
  'do',
  17
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-04-001',
  'CL-04',
  'Before the Visit',
  'Schedule before leaving hospital',
  'Most pediatricians want to see baby within 3-5 days of birth',
  TRUE,
  'do',
  0
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-04-002',
  'CL-04',
  'Before the Visit',
  'Confirm appointment time',
  'Call day before to confirm - sleep deprivation causes missed appointments',
  TRUE,
  'do',
  1
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-04-003',
  'CL-04',
  'Before the Visit',
  'Write down your questions',
  'You will forget everything in the moment - write it down',
  TRUE,
  'do',
  2
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-04-004',
  'CL-04',
  'What to Bring',
  'Insurance card',
  'They''ll need to copy it for records',
  TRUE,
  'bring',
  3
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-04-005',
  'CL-04',
  'What to Bring',
  'Hospital discharge papers',
  'Includes birth weight and any notes from hospital pediatrician',
  TRUE,
  'bring',
  4
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-04-006',
  'CL-04',
  'What to Bring',
  'Diaper bag (2-3 diapers)',
  'Baby will probably need a change during visit',
  TRUE,
  'bring',
  5
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-04-007',
  'CL-04',
  'What to Bring',
  'Extra outfit for baby',
  'In case of blowout',
  TRUE,
  'bring',
  6
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-04-008',
  'CL-04',
  'What to Bring',
  'Phone or notebook for notes',
  'You''ll want to write down what doctor says',
  TRUE,
  'bring',
  7
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-04-009',
  'CL-04',
  'What to Bring',
  'Feeding supplies',
  'Bottle or be ready to nurse - baby may get hungry',
  TRUE,
  'bring',
  8
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-04-010',
  'CL-04',
  'What to Bring',
  'Pacifier if using',
  'Can help soothe during exam',
  FALSE,
  'bring',
  9
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-04-011',
  'CL-04',
  'Questions to Ask',
  'What weight gain should I expect by next visit?',
  'Helps you know if feeding is on track',
  TRUE,
  'do',
  10
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-04-012',
  'CL-04',
  'Questions to Ask',
  'How do I reach you after hours?',
  'Know the process for urgent questions',
  TRUE,
  'do',
  11
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-04-013',
  'CL-04',
  'Questions to Ask',
  'When should I worry about jaundice?',
  'Common in newborns - know the warning signs',
  TRUE,
  'do',
  12
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-04-014',
  'CL-04',
  'Questions to Ask',
  'Is baby''s feeding on track?',
  'Whether nursing or bottle - confirm it''s going well',
  TRUE,
  'do',
  13
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-04-015',
  'CL-04',
  'Questions to Ask',
  'When is the next appointment?',
  'Usually 2 weeks for weight check then 1 month',
  TRUE,
  'do',
  14
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-04-016',
  'CL-04',
  'Questions to Ask',
  'What are warning signs I should watch for?',
  'Temperature thresholds and other red flags',
  TRUE,
  'do',
  15
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-04-017',
  'CL-04',
  'Questions to Ask',
  'Is the umbilical cord stump healing normally?',
  'They''ll check but ask if you have concerns',
  FALSE,
  'do',
  16
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-04-018',
  'CL-04',
  'Questions to Ask',
  'Should we give vitamin D drops?',
  'Usually yes for breastfed babies - confirm dosage',
  TRUE,
  'do',
  17
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-04-019',
  'CL-04',
  'What Happens',
  'Weight check',
  'Comparing to birth weight - some loss is normal but should be regaining',
  TRUE,
  'do',
  18
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-04-020',
  'CL-04',
  'What Happens',
  'Jaundice check',
  'Visual inspection and possibly bilirubin test',
  TRUE,
  'do',
  19
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-04-021',
  'CL-04',
  'What Happens',
  'Feeding assessment',
  'Discussion of how nursing or bottles are going',
  TRUE,
  'do',
  20
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-04-022',
  'CL-04',
  'What Happens',
  'Physical exam',
  'Head to toe check of baby',
  TRUE,
  'do',
  21
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-04-023',
  'CL-04',
  'What Happens',
  'Circumcision check (if applicable)',
  'Making sure it''s healing properly',
  FALSE,
  'do',
  22
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-04-024',
  'CL-04',
  'What Happens',
  'Questions about mom''s recovery',
  'Good pediatricians ask how mom is doing too',
  FALSE,
  'do',
  23
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-05-001',
  'CL-05',
  'Before Booking',
  'Check airline lap infant policy',
  'Most require baby to be 14+ days old - some airlines 7 days',
  TRUE,
  'do',
  0
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-05-002',
  'CL-05',
  'Before Booking',
  'Book lap infant when purchasing ticket',
  'Free for under 2 but must be added to reservation',
  TRUE,
  'do',
  1
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-05-003',
  'CL-05',
  'Before Booking',
  'Request bulkhead or window seat',
  'Bulkhead has more room - window gives privacy for nursing',
  FALSE,
  'do',
  2
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-05-004',
  'CL-05',
  'Before Booking',
  'Avoid tight connections',
  'You''ll be slow moving through airport - 90+ min connections minimum',
  TRUE,
  'do',
  3
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-05-005',
  'CL-05',
  'Before Booking',
  'Book during nap time if possible',
  'Sleeping baby is a happy flight',
  FALSE,
  'do',
  4
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-05-006',
  'CL-05',
  'TSA and Security',
  'Formula and breast milk exempt from 3.4oz rule',
  'Can bring as much as you need - inform TSA before screening',
  TRUE,
  'do',
  5
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-05-007',
  'CL-05',
  'TSA and Security',
  'Inform TSA you have baby supplies',
  'They may test liquids but will not make you dump them',
  TRUE,
  'do',
  6
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-05-008',
  'CL-05',
  'TSA and Security',
  'Stroller and car seat gate-checked free',
  'Does not count toward bag limit',
  TRUE,
  'do',
  7
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-05-009',
  'CL-05',
  'TSA and Security',
  'Wear baby through security if possible',
  'Easier than folding stroller - you''ll walk through with baby',
  FALSE,
  'do',
  8
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-05-010',
  'CL-05',
  'TSA and Security',
  'Get TSA PreCheck if you don''t have it',
  'Shorter lines make everything easier with baby',
  FALSE,
  'do',
  9
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-05-011',
  'CL-05',
  'Carry-On Packing',
  'Double the diapers you think you need',
  'Delays happen - pack 1 diaper per hour of travel plus extras',
  TRUE,
  'bring',
  10
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-05-012',
  'CL-05',
  'Carry-On Packing',
  '2 full outfit changes for baby',
  'Blowouts at altitude are real',
  TRUE,
  'bring',
  11
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-05-013',
  'CL-05',
  'Carry-On Packing',
  'Plastic bags for dirty clothes',
  'Ziplock bags for blowout situations',
  TRUE,
  'bring',
  12
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-05-014',
  'CL-05',
  'Carry-On Packing',
  'Extra pacifiers (3+)',
  'They will fall on the floor or get lost',
  TRUE,
  'bring',
  13
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-05-015',
  'CL-05',
  'Carry-On Packing',
  'Feeding supplies (bottles or nursing cover)',
  'Pack more formula than you think you need',
  TRUE,
  'bring',
  14
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-05-016',
  'CL-05',
  'Carry-On Packing',
  'Change of shirt for you',
  'Baby will spit up on you - guarantee it',
  TRUE,
  'bring',
  15
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-05-017',
  'CL-05',
  'Carry-On Packing',
  'Hand sanitizer and sanitizing wipes',
  'Airplanes are dirty - wipe down area',
  TRUE,
  'bring',
  16
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-05-018',
  'CL-05',
  'Carry-On Packing',
  'Portable changing pad',
  'Airplane changing tables are gross',
  TRUE,
  'bring',
  17
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-05-019',
  'CL-05',
  'Gear Decisions',
  'Gate-check stroller',
  'Keeps it with you until boarding - picked up at jet bridge',
  TRUE,
  'do',
  18
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-05-020',
  'CL-05',
  'Gear Decisions',
  'Baby carrier is essential',
  'Your best friend in airport - hands free and baby is happy',
  TRUE,
  'bring',
  19
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-05-021',
  'CL-05',
  'Gear Decisions',
  'Consider travel car seat',
  'If renting car at destination - or check your regular one',
  FALSE,
  'bring',
  20
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-05-022',
  'CL-05',
  'During Flight',
  'Feed during takeoff and landing',
  'Nursing or bottle helps ears equalize pressure',
  TRUE,
  'do',
  21
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-05-023',
  'CL-05',
  'During Flight',
  'New small toys for novelty',
  'Save a new toy for the flight - novelty buys time',
  FALSE,
  'bring',
  22
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-05-024',
  'CL-05',
  'During Flight',
  'White noise app on phone',
  'Can help soothe baby during flight',
  FALSE,
  'do',
  23
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-05-025',
  'CL-05',
  'During Flight',
  'Walk the aisle if baby is fussy',
  'Motion often calms babies - don''t feel trapped in seat',
  TRUE,
  'do',
  24
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-05-026',
  'CL-05',
  'During Flight',
  'Don''t apologize excessively',
  'Babies cry - you''re allowed to travel - do your best',
  TRUE,
  'do',
  25
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-06-001',
  'CL-06',
  'Planning',
  'Choose the right restaurant',
  'Loud and casual is better - skip quiet fine dining',
  TRUE,
  'do',
  0
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-06-002',
  'CL-06',
  'Planning',
  'Go at off-peak hours',
  'Early dinner (4-5pm) or late lunch (2pm) - less crowded and faster service',
  TRUE,
  'do',
  1
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-06-003',
  'CL-06',
  'Planning',
  'Make a reservation if possible',
  'Reduces wait time with baby',
  FALSE,
  'do',
  2
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-06-004',
  'CL-06',
  'Planning',
  'Check if they have high chairs',
  'Not all restaurants do - car seat carrier can work in a pinch',
  FALSE,
  'do',
  3
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-06-005',
  'CL-06',
  'Planning',
  'Feed baby before leaving or plan to feed there',
  'Well-fed baby is happy baby',
  TRUE,
  'do',
  4
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-06-006',
  'CL-06',
  'Seating',
  'Request booth if available',
  'Easier to nurse or bottle feed with some privacy',
  FALSE,
  'do',
  5
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-06-007',
  'CL-06',
  'Seating',
  'Ask for table near exit',
  'Easy escape if baby has meltdown',
  FALSE,
  'do',
  6
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-06-008',
  'CL-06',
  'Seating',
  'Car seat carrier fits on booth seat or high chair base',
  'You don''t have to hold baby the whole time',
  TRUE,
  'do',
  7
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-06-009',
  'CL-06',
  'What to Bring',
  'Pacifier',
  'Essential for buying a few quiet minutes',
  TRUE,
  'bring',
  8
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-06-010',
  'CL-06',
  'What to Bring',
  'Small toy or rattle',
  'Something to grab attention if fussy',
  TRUE,
  'bring',
  9
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-06-011',
  'CL-06',
  'What to Bring',
  'Blanket',
  'For covering car seat or nursing',
  TRUE,
  'bring',
  10
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-06-012',
  'CL-06',
  'What to Bring',
  'Fully stocked diaper bag',
  '2-3 diapers and wipes and change of clothes',
  TRUE,
  'bring',
  11
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-06-013',
  'CL-06',
  'What to Bring',
  'Bottle or be ready to nurse',
  'Hungry babies don''t wait',
  TRUE,
  'bring',
  12
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-06-014',
  'CL-06',
  'At the Restaurant',
  'Order immediately when seated',
  'Don''t wait - time is limited',
  TRUE,
  'do',
  13
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-06-015',
  'CL-06',
  'At the Restaurant',
  'Ask for the check early',
  'Have it ready so you can leave quickly if needed',
  TRUE,
  'do',
  14
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-06-016',
  'CL-06',
  'At the Restaurant',
  'Order food that can be boxed',
  'You might not finish - be okay with taking it home',
  TRUE,
  'do',
  15
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-06-017',
  'CL-06',
  'At the Restaurant',
  'Take turns eating if needed',
  'One eats while other soothes baby',
  FALSE,
  'do',
  16
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-06-018',
  'CL-06',
  'Mindset',
  'Know you might leave before finishing',
  'That''s okay - it''s practice for next time',
  TRUE,
  'do',
  17
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-06-019',
  'CL-06',
  'Mindset',
  'Don''t apologize for your baby existing',
  'Babies are allowed in restaurants - you''re allowed to eat out',
  TRUE,
  'do',
  18
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-06-020',
  'CL-06',
  'Mindset',
  'Tip well',
  'Servers deal with extra mess - be generous',
  TRUE,
  'do',
  19
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-07-001',
  'CL-07',
  'Timing',
  'Start at nap time or bedtime',
  'Sleeping baby means peaceful drive',
  TRUE,
  'do',
  0
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-07-002',
  'CL-07',
  'Timing',
  'Plan stops every 2 hours maximum',
  'Baby shouldn''t be in car seat more than 2 hours at a stretch',
  TRUE,
  'do',
  1
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-07-003',
  'CL-07',
  'Timing',
  'Add extra time to your estimate',
  'Everything takes longer with a baby - plan for it',
  TRUE,
  'do',
  2
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-07-004',
  'CL-07',
  'Car Seat Safety',
  'Check car seat angle before leaving',
  'Head should not flop forward - most seats have level indicator',
  TRUE,
  'do',
  3
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-07-005',
  'CL-07',
  'Car Seat Safety',
  'No puffy clothing under straps',
  'Jacket goes over buckled baby as blanket',
  TRUE,
  'do',
  4
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-07-006',
  'CL-07',
  'Car Seat Safety',
  'Chest clip at armpit level',
  'Not on belly and not on neck',
  TRUE,
  'do',
  5
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-07-007',
  'CL-07',
  'Car Seat Safety',
  'Straps snug - can''t pinch material',
  'Should not be able to pinch strap at shoulder',
  TRUE,
  'do',
  6
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-07-008',
  'CL-07',
  'Packing - Accessible',
  'Diaper bag in back seat not trunk',
  'You may need to access it without stopping',
  TRUE,
  'do',
  7
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-07-009',
  'CL-07',
  'Packing - Accessible',
  'Extra diapers - double what you think',
  'Pack 1 per hour of travel plus extras for delays',
  TRUE,
  'bring',
  8
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-07-010',
  'CL-07',
  'Packing - Accessible',
  'Extra clothes - 2 full outfits',
  'Blowouts happen - be prepared',
  TRUE,
  'bring',
  9
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-07-011',
  'CL-07',
  'Packing - Accessible',
  'Plastic bags for dirty clothes',
  'Ziplock or grocery bags for blowout disasters',
  TRUE,
  'bring',
  10
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-07-012',
  'CL-07',
  'Packing - Accessible',
  'Burp cloths and bibs',
  'For spit-up during the ride',
  TRUE,
  'bring',
  11
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-07-013',
  'CL-07',
  'Packing - Accessible',
  'Bottles or nursing supplies',
  'More than you think you need - traffic happens',
  TRUE,
  'bring',
  12
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-07-014',
  'CL-07',
  'Entertainment',
  'Window shades',
  'Blocks sun from baby''s eyes and keeps car cooler',
  TRUE,
  'bring',
  13
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-07-015',
  'CL-07',
  'Entertainment',
  'Rear-facing mirror',
  'So you can see baby from front seat',
  FALSE,
  'bring',
  14
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-07-016',
  'CL-07',
  'Entertainment',
  'Soft toys that attach to car seat',
  'Things that can''t be dropped or thrown',
  FALSE,
  'bring',
  15
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-07-017',
  'CL-07',
  'Entertainment',
  'Music or white noise ready',
  'Have playlists ready to soothe or entertain',
  FALSE,
  'do',
  16
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-07-018',
  'CL-07',
  'First Aid',
  'Thermometer',
  'In case baby feels warm during trip',
  TRUE,
  'bring',
  17
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-07-019',
  'CL-07',
  'First Aid',
  'Infant Tylenol (if over 2 months)',
  'Check with pediatrician for dosing by weight',
  TRUE,
  'bring',
  18
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-07-020',
  'CL-07',
  'First Aid',
  'Nasal aspirator',
  'For stuffy nose',
  FALSE,
  'bring',
  19
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-07-021',
  'CL-07',
  'First Aid',
  'Saline drops',
  'Helps loosen congestion',
  FALSE,
  'bring',
  20
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-07-022',
  'CL-07',
  'During the Drive',
  'One parent in back seat if possible',
  'Can soothe baby and handle needs without stopping',
  FALSE,
  'do',
  21
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-07-023',
  'CL-07',
  'During the Drive',
  'Stop at baby''s feeding times',
  'Don''t try to feed in moving car - take a real break',
  TRUE,
  'do',
  22
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-07-024',
  'CL-07',
  'During the Drive',
  'Get baby out of car seat at stops',
  'Stretch and move - being strapped in is tiring',
  TRUE,
  'do',
  23
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-08-001',
  'CL-08',
  'Choosing the Caregiver',
  'Grandparents or trusted family ideal for first time',
  'Someone who knows baby already',
  TRUE,
  'do',
  0
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-08-002',
  'CL-08',
  'Choosing the Caregiver',
  'Do a trial run first',
  'Have them watch baby for a few hours while you''re nearby before overnight',
  TRUE,
  'do',
  1
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-08-003',
  'CL-08',
  'Choosing the Caregiver',
  'Make sure they know infant CPR',
  'Or give them a quick refresher before you leave',
  TRUE,
  'do',
  2
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-08-004',
  'CL-08',
  'Written Instructions',
  'Feeding schedule and amounts',
  'Exact times and ounces or nursing routine',
  TRUE,
  'do',
  3
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-08-005',
  'CL-08',
  'Written Instructions',
  'Nap schedule and sleep routine',
  'Include any sleep cues or rituals',
  TRUE,
  'do',
  4
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-08-006',
  'CL-08',
  'Written Instructions',
  'Bedtime routine step by step',
  'Bath - bottle - book - bed or whatever your routine is',
  TRUE,
  'do',
  5
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-08-007',
  'CL-08',
  'Written Instructions',
  'Medicine dosages if needed',
  'Tylenol dosage by weight and when to give',
  TRUE,
  'do',
  6
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-08-008',
  'CL-08',
  'Written Instructions',
  'Comfort techniques that work',
  'What soothes your specific baby',
  TRUE,
  'do',
  7
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-08-009',
  'CL-08',
  'Supplies to Leave',
  'More diapers than needed',
  'At least double what you''d use',
  TRUE,
  'do',
  8
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-08-010',
  'CL-08',
  'Supplies to Leave',
  'Extra clothes - 3+ outfits',
  'More than you think necessary',
  TRUE,
  'do',
  9
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-08-011',
  'CL-08',
  'Supplies to Leave',
  'All feeding supplies',
  'Bottles and formula or pumped milk with extra',
  TRUE,
  'do',
  10
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-08-012',
  'CL-08',
  'Supplies to Leave',
  'Sleep items',
  'Sleep sack or swaddle and sound machine',
  TRUE,
  'do',
  11
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-08-013',
  'CL-08',
  'Supplies to Leave',
  'Comfort items',
  'Favorite pacifier and lovey if using',
  TRUE,
  'do',
  12
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-08-014',
  'CL-08',
  'Supplies to Leave',
  'First aid basics',
  'Thermometer and infant Tylenol',
  TRUE,
  'do',
  13
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-08-015',
  'CL-08',
  'Emergency Info',
  'Your phone numbers',
  'Both parents'' cells clearly written',
  TRUE,
  'do',
  14
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-08-016',
  'CL-08',
  'Emergency Info',
  'Pediatrician name and number',
  'Including after-hours line',
  TRUE,
  'do',
  15
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-08-017',
  'CL-08',
  'Emergency Info',
  'Nearest hospital address',
  'Know where the closest ER is',
  TRUE,
  'do',
  16
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-08-018',
  'CL-08',
  'Emergency Info',
  'Insurance card copy',
  'Photo or photocopy',
  TRUE,
  'do',
  17
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-08-019',
  'CL-08',
  'Emergency Info',
  'Backup emergency contact',
  'Another family member or neighbor who can help',
  TRUE,
  'do',
  18
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-08-020',
  'CL-08',
  'For You',
  'Leave your phone on',
  'But set boundaries on how often you''ll check in',
  TRUE,
  'do',
  19
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-08-021',
  'CL-08',
  'For You',
  'Agree on check-in schedule',
  'One update at bedtime is usually enough',
  FALSE,
  'do',
  20
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-08-022',
  'CL-08',
  'For You',
  'It''s okay to feel anxious',
  'First time is hard - it gets easier',
  TRUE,
  'do',
  21
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-08-023',
  'CL-08',
  'For You',
  'Trust your caregiver',
  'You chose them for a reason - let them handle it',
  TRUE,
  'do',
  22
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-08-024',
  'CL-08',
  'For You',
  'Bring breast pump if nursing',
  'You''ll need to pump to stay comfortable',
  TRUE,
  'bring',
  23
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-09-001',
  'CL-09',
  'Booking',
  'Request room away from elevator and ice machine',
  'Quieter for baby sleep',
  TRUE,
  'do',
  0
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-09-002',
  'CL-09',
  'Booking',
  'Ask about cribs in advance',
  'Most hotels have pack-n-plays available free - request at booking',
  TRUE,
  'do',
  1
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-09-003',
  'CL-09',
  'Booking',
  'Request mini-fridge if not standard',
  'For bottles and milk storage',
  TRUE,
  'do',
  2
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-09-004',
  'CL-09',
  'Booking',
  'Consider suite or adjoining rooms',
  'Separate sleeping space helps everyone sleep better',
  FALSE,
  'do',
  3
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-09-005',
  'CL-09',
  'Booking',
  'Check for microwave access',
  'For warming bottles - or use bottle warmer',
  FALSE,
  'do',
  4
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-09-006',
  'CL-09',
  'Packing',
  'Portable crib or travel bassinet',
  'If you don''t trust hotel''s crib or they don''t have one',
  FALSE,
  'bring',
  5
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-09-007',
  'CL-09',
  'Packing',
  'White noise machine or app',
  'Hotels have unfamiliar sounds - white noise helps',
  TRUE,
  'bring',
  6
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-09-008',
  'CL-09',
  'Packing',
  'Blackout curtains or black trash bags',
  'Hotel curtains rarely block enough light - tape trash bags over windows',
  FALSE,
  'bring',
  7
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-09-009',
  'CL-09',
  'Packing',
  'Baby''s sleep sack or swaddle',
  'Familiar sleep items help with strange environment',
  TRUE,
  'bring',
  8
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-09-010',
  'CL-09',
  'Packing',
  'Outlet covers if mobile baby',
  'Quick babyproofing for hotel room',
  FALSE,
  'bring',
  9
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-09-011',
  'CL-09',
  'Packing',
  'Dish soap for washing bottles',
  'Hotels don''t have this - pack a small container',
  TRUE,
  'bring',
  10
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-09-012',
  'CL-09',
  'Packing',
  'Bottle brush',
  'For cleaning bottles in hotel sink',
  TRUE,
  'bring',
  11
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-09-013',
  'CL-09',
  'Packing',
  'Portable bottle warmer or thermos',
  'For middle of night feeds without going to microwave',
  FALSE,
  'bring',
  12
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-09-014',
  'CL-09',
  'Sleep Setup',
  'Put crib in bathroom or closet if possible',
  'Darker and more separate from your movements',
  FALSE,
  'do',
  13
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-09-015',
  'CL-09',
  'Sleep Setup',
  'Keep bedtime routine as normal as possible',
  'Bath book bottle bed - same as home',
  TRUE,
  'do',
  14
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-09-016',
  'CL-09',
  'Sleep Setup',
  'Bring something that smells like home',
  'Fitted crib sheet from home can help',
  FALSE,
  'bring',
  15
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-09-017',
  'CL-09',
  'Sleep Setup',
  'Accept first night might be rough',
  'Sleep regression in new places is normal',
  TRUE,
  'do',
  16
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-09-018',
  'CL-09',
  'Safety',
  'Check crib meets safety standards',
  'Firm mattress and fitted sheet only - nothing else',
  TRUE,
  'do',
  17
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-09-019',
  'CL-09',
  'Safety',
  'Quick scan of room for hazards',
  'Cords and outlets and sharp corners',
  TRUE,
  'do',
  18
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-09-020',
  'CL-09',
  'Safety',
  'Know where nearest hospital is',
  'Quick Google search on arrival',
  TRUE,
  'do',
  19
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-10-001',
  'CL-10',
  'Logistics',
  'What are your hours?',
  'Make sure they match your work schedule with buffer time',
  TRUE,
  'do',
  0
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-10-002',
  'CL-10',
  'Logistics',
  'What''s the waitlist situation?',
  'Some daycares have 6-12 month waits',
  TRUE,
  'do',
  1
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-10-003',
  'CL-10',
  'Logistics',
  'What''s the cost and what''s included?',
  'Diapers and food and sunscreen - or do you provide',
  TRUE,
  'do',
  2
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-10-004',
  'CL-10',
  'Logistics',
  'What''s your sick policy?',
  'How sick is too sick - when must they stay home',
  TRUE,
  'do',
  3
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-10-005',
  'CL-10',
  'Logistics',
  'What''s your vacation and closure policy?',
  'How many days closed per year - do you still pay',
  TRUE,
  'do',
  4
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-10-006',
  'CL-10',
  'Safety and Licensing',
  'Are you licensed by the state?',
  'Should be yes - ask to see license',
  TRUE,
  'do',
  5
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-10-007',
  'CL-10',
  'Safety and Licensing',
  'What''s your teacher to child ratio?',
  'Infants should be 1:3 or 1:4 maximum',
  TRUE,
  'do',
  6
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-10-008',
  'CL-10',
  'Safety and Licensing',
  'Are staff CPR and first aid certified?',
  'Should be yes for all staff',
  TRUE,
  'do',
  7
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-10-009',
  'CL-10',
  'Safety and Licensing',
  'What''s your security protocol?',
  'How do you ensure only authorized people pick up',
  TRUE,
  'do',
  8
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-10-010',
  'CL-10',
  'Safety and Licensing',
  'What''s your emergency and evacuation plan?',
  'They should have one and be able to explain it',
  TRUE,
  'do',
  9
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-10-011',
  'CL-10',
  'Safety and Licensing',
  'How do you handle allergies?',
  'Important even if your baby doesn''t have any yet',
  TRUE,
  'do',
  10
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-10-012',
  'CL-10',
  'Staff',
  'What''s your staff turnover rate?',
  'High turnover is a red flag',
  TRUE,
  'do',
  11
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-10-013',
  'CL-10',
  'Staff',
  'What training do teachers receive?',
  'Ongoing training is important',
  TRUE,
  'do',
  12
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-10-014',
  'CL-10',
  'Staff',
  'Will my baby have a primary caregiver?',
  'Consistency matters for attachment',
  TRUE,
  'do',
  13
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-10-015',
  'CL-10',
  'Staff',
  'How do you communicate with parents?',
  'App or email or daily sheets',
  TRUE,
  'do',
  14
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-10-016',
  'CL-10',
  'Daily Care',
  'What''s a typical day schedule?',
  'Should be able to describe routine clearly',
  TRUE,
  'do',
  15
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-10-017',
  'CL-10',
  'Daily Care',
  'How do you handle feeding and bottles?',
  'Including breastmilk storage and warming',
  TRUE,
  'do',
  16
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-10-018',
  'CL-10',
  'Daily Care',
  'What''s your sleep and nap policy?',
  'Safe sleep practices - back to sleep',
  TRUE,
  'do',
  17
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-10-019',
  'CL-10',
  'Daily Care',
  'Do babies get outdoor time?',
  'Fresh air and nature are important',
  TRUE,
  'do',
  18
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-10-020',
  'CL-10',
  'Daily Care',
  'How do you handle diapering?',
  'Sanitation practices and frequency',
  TRUE,
  'do',
  19
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-10-021',
  'CL-10',
  'Red Flags to Watch',
  'Are children engaged or zoned out?',
  'Kids should look happy and stimulated',
  TRUE,
  'do',
  20
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-10-022',
  'CL-10',
  'Red Flags to Watch',
  'Is the facility clean and organized?',
  'Should smell clean and look tidy',
  TRUE,
  'do',
  21
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-10-023',
  'CL-10',
  'Red Flags to Watch',
  'Are teachers warm and attentive?',
  'Watch how they interact with kids',
  TRUE,
  'do',
  22
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-10-024',
  'CL-10',
  'Red Flags to Watch',
  'Do they discourage drop-in visits?',
  'Good daycares welcome unannounced visits',
  TRUE,
  'do',
  23
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-10-025',
  'CL-10',
  'Red Flags to Watch',
  'Do they dismiss your questions?',
  'Should welcome and thoroughly answer all questions',
  TRUE,
  'do',
  24
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-11-001',
  'CL-11',
  'Logistics',
  'Confirm your return date with HR',
  'Usually 6-12 weeks depending on leave policy',
  TRUE,
  'do',
  0
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-11-002',
  'CL-11',
  'Logistics',
  'Childcare solidified and start date set',
  'Daycare or nanny confirmed and ready',
  TRUE,
  'do',
  1
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-11-003',
  'CL-11',
  'Logistics',
  'Do a trial run with childcare',
  'A few hours or half day before your first day back',
  TRUE,
  'do',
  2
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-11-004',
  'CL-11',
  'Logistics',
  'Plan your commute with new timing',
  'Account for daycare dropoff in your schedule',
  TRUE,
  'do',
  3
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-11-005',
  'CL-11',
  'Logistics',
  'Have backup childcare plan',
  'What if baby is sick and can''t go to daycare',
  TRUE,
  'do',
  4
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-11-006',
  'CL-11',
  'Pumping at Work',
  'Know your legal rights',
  'Employers must provide time and private space to pump',
  TRUE,
  'do',
  5
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-11-007',
  'CL-11',
  'Pumping at Work',
  'Request private pumping space',
  'Not a bathroom - a clean room with locking door',
  TRUE,
  'do',
  6
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-11-008',
  'CL-11',
  'Pumping at Work',
  'Get a work pump or portable pump',
  'Leaving pump at work or getting a portable one',
  TRUE,
  'do',
  7
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-11-009',
  'CL-11',
  'Pumping at Work',
  'Stock up on pump supplies',
  'Extra flanges and valves and milk bags',
  TRUE,
  'do',
  8
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-11-010',
  'CL-11',
  'Pumping at Work',
  'Get insulated cooler bag',
  'For transporting milk home',
  TRUE,
  'bring',
  9
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-11-011',
  'CL-11',
  'Pumping at Work',
  'Block pumping time on calendar',
  'Protect that time like meetings',
  TRUE,
  'do',
  10
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-11-012',
  'CL-11',
  'Pumping at Work',
  'Know where to store milk',
  'Fridge at work or in cooler bag with ice',
  TRUE,
  'do',
  11
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-11-013',
  'CL-11',
  'Preparation',
  'Build freezer stash before returning',
  'Aim for a few days worth as backup',
  TRUE,
  'do',
  12
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-11-014',
  'CL-11',
  'Preparation',
  'Try on work clothes beforehand',
  'Body may have changed - know what fits',
  TRUE,
  'do',
  13
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-11-015',
  'CL-11',
  'Preparation',
  'Prep bottles and daycare bag night before',
  'Mornings will be hectic',
  TRUE,
  'do',
  14
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-11-016',
  'CL-11',
  'Preparation',
  'Set realistic expectations with manager',
  'Ease back in if possible - first week is hard',
  TRUE,
  'do',
  15
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-11-017',
  'CL-11',
  'Emotional',
  'It''s normal to feel conflicted',
  'Guilt and relief and sadness are all normal',
  TRUE,
  'do',
  16
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-11-018',
  'CL-11',
  'Emotional',
  'First week is the hardest',
  'It gets easier after you find your rhythm',
  TRUE,
  'do',
  17
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-11-019',
  'CL-11',
  'Emotional',
  'Stay connected during day',
  'Ask daycare for photos or updates',
  FALSE,
  'do',
  18
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-11-020',
  'CL-11',
  'Emotional',
  'Protect evening time with baby',
  'Resist urge to catch up on work - be present',
  TRUE,
  'do',
  19
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-12-001',
  'CL-12',
  'General - All Rooms',
  'Outlet covers on all unused outlets',
  'Baby fingers fit perfectly in outlets',
  TRUE,
  'do',
  0
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-12-002',
  'CL-12',
  'General - All Rooms',
  'Secure cords and blind strings',
  'Strangulation hazard - tie up or cut off',
  TRUE,
  'do',
  1
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-12-003',
  'CL-12',
  'General - All Rooms',
  'Anchor tall furniture to walls',
  'Bookshelves and dressers can tip - use wall anchors',
  TRUE,
  'do',
  2
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-12-004',
  'CL-12',
  'General - All Rooms',
  'Cover sharp corners on furniture',
  'Corner guards on coffee tables and hearths',
  TRUE,
  'do',
  3
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-12-005',
  'CL-12',
  'General - All Rooms',
  'Move breakables out of reach',
  'Anything on low tables needs to go up',
  TRUE,
  'do',
  4
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-12-006',
  'CL-12',
  'General - All Rooms',
  'Check for small objects on floor',
  'Coins and buttons and anything that fits in toilet paper roll is choking hazard',
  TRUE,
  'do',
  5
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-12-007',
  'CL-12',
  'Kitchen',
  'Cabinet locks on all lower cabinets',
  'Especially under sink with cleaning supplies',
  TRUE,
  'do',
  6
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-12-008',
  'CL-12',
  'Kitchen',
  'Stove knob covers',
  'Prevents baby from turning on burners',
  TRUE,
  'do',
  7
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-12-009',
  'CL-12',
  'Kitchen',
  'Oven door lock',
  'Prevents opening hot oven',
  TRUE,
  'do',
  8
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-12-010',
  'CL-12',
  'Kitchen',
  'Move cleaning supplies up high',
  'Or lock cabinet they''re in',
  TRUE,
  'do',
  9
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-12-011',
  'CL-12',
  'Kitchen',
  'Secure trash can',
  'Lock lid or put in cabinet',
  TRUE,
  'do',
  10
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-12-012',
  'CL-12',
  'Kitchen',
  'Refrigerator lock if needed',
  'Some babies figure out how to open fridge',
  FALSE,
  'do',
  11
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-12-013',
  'CL-12',
  'Bathroom',
  'Toilet lock',
  'Drowning hazard - keep lid locked',
  TRUE,
  'do',
  12
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-12-014',
  'CL-12',
  'Bathroom',
  'Medicine cabinet cleared or locked',
  'Move all medications up high',
  TRUE,
  'do',
  13
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-12-015',
  'CL-12',
  'Bathroom',
  'Non-slip bath mat',
  'For when baby starts bath time in tub',
  TRUE,
  'do',
  14
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-12-016',
  'CL-12',
  'Bathroom',
  'Hot water heater set to 120F or below',
  'Prevents scalding',
  TRUE,
  'do',
  15
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-12-017',
  'CL-12',
  'Bathroom',
  'Cabinet locks under sink',
  'Cleaning supplies are poison',
  TRUE,
  'do',
  16
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-12-018',
  'CL-12',
  'Living Room',
  'Baby gate at stairs',
  'Top and bottom of stairs once mobile',
  TRUE,
  'do',
  17
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-12-019',
  'CL-12',
  'Living Room',
  'Fireplace gate or hearth padding',
  'Hard edges are dangerous for new walkers',
  TRUE,
  'do',
  18
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-12-020',
  'CL-12',
  'Living Room',
  'TV secured to wall or stand',
  'TVs can tip over onto baby',
  TRUE,
  'do',
  19
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-12-021',
  'CL-12',
  'Living Room',
  'Houseplants moved out of reach',
  'Many are toxic if eaten',
  TRUE,
  'do',
  20
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-12-022',
  'CL-12',
  'Bedroom',
  'Crib meets current safety standards',
  'No drop sides and slats less than 2 3/8 inches apart',
  TRUE,
  'do',
  21
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-12-023',
  'CL-12',
  'Bedroom',
  'Nothing in crib but fitted sheet',
  'No bumpers or pillows or blankets or toys',
  TRUE,
  'do',
  22
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-12-024',
  'CL-12',
  'Bedroom',
  'Dresser anchored to wall',
  'Especially if baby might climb drawers',
  TRUE,
  'do',
  23
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-12-025',
  'CL-12',
  'Bedroom',
  'Cords from monitor and blinds out of reach',
  'Strangulation hazard near crib',
  TRUE,
  'do',
  24
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-13-001',
  'CL-13',
  'Signs of Readiness',
  'Baby can sit with support',
  'Needs core strength to eat safely',
  TRUE,
  'do',
  0
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-13-002',
  'CL-13',
  'Signs of Readiness',
  'Good head control',
  'Can hold head steady',
  TRUE,
  'do',
  1
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-13-003',
  'CL-13',
  'Signs of Readiness',
  'Shows interest in food',
  'Watches you eat and reaches for food',
  TRUE,
  'do',
  2
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-13-004',
  'CL-13',
  'Signs of Readiness',
  'Lost tongue thrust reflex',
  'Doesn''t automatically push food out with tongue',
  TRUE,
  'do',
  3
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-13-005',
  'CL-13',
  'Signs of Readiness',
  'Usually around 6 months',
  'Not before 4 months - check with pediatrician',
  TRUE,
  'do',
  4
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-13-006',
  'CL-13',
  'Gear Needed',
  'High chair',
  'Sturdy with safety straps - easy to clean',
  TRUE,
  'do',
  5
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-13-007',
  'CL-13',
  'Gear Needed',
  'Soft-tipped baby spoons',
  'Gentle on gums if doing purees',
  TRUE,
  'do',
  6
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-13-008',
  'CL-13',
  'Gear Needed',
  'Bibs - lots of them',
  'Silicone pocket bibs catch food',
  TRUE,
  'do',
  7
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-13-009',
  'CL-13',
  'Gear Needed',
  'Splat mat under high chair',
  'Floor will get destroyed otherwise',
  FALSE,
  'do',
  8
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-13-010',
  'CL-13',
  'Gear Needed',
  'Baby food storage containers',
  'If making your own purees',
  FALSE,
  'do',
  9
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-13-011',
  'CL-13',
  'First Foods',
  'Single ingredient foods first',
  'One new food at a time to spot allergies',
  TRUE,
  'do',
  10
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-13-012',
  'CL-13',
  'First Foods',
  'Wait 3-5 days between new foods',
  'Watch for allergic reactions',
  TRUE,
  'do',
  11
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-13-013',
  'CL-13',
  'First Foods',
  'Good starter foods',
  'Iron-fortified cereal or pureed sweet potato or avocado or banana',
  TRUE,
  'do',
  12
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-13-014',
  'CL-13',
  'First Foods',
  'Introduce allergens early',
  'Peanut and egg and dairy between 6-12 months reduces allergy risk',
  TRUE,
  'do',
  13
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-13-015',
  'CL-13',
  'First Foods',
  'Breast milk or formula still primary',
  'Solids are practice and exposure - milk is still main nutrition',
  TRUE,
  'do',
  14
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-13-016',
  'CL-13',
  'Safety - Choking',
  'Know infant choking first aid',
  'Take a class or watch videos before starting',
  TRUE,
  'do',
  15
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-13-017',
  'CL-13',
  'Safety - Choking',
  'Avoid choking hazards',
  'Whole grapes and hot dogs and popcorn and nuts and raw carrots',
  TRUE,
  'do',
  16
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-13-018',
  'CL-13',
  'Safety - Choking',
  'Always supervise eating',
  'Never leave baby alone with food',
  TRUE,
  'do',
  17
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-13-019',
  'CL-13',
  'Safety - Choking',
  'Baby should be upright when eating',
  'Not reclined - sitting position in high chair',
  TRUE,
  'do',
  18
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-13-020',
  'CL-13',
  'Safety - Choking',
  'Gagging is normal - choking is not',
  'Gagging is loud and coughing - choking is silent',
  TRUE,
  'do',
  19
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-13-021',
  'CL-13',
  'Approach Options',
  'Purees - traditional spoon feeding',
  'Start thin and gradually thicken',
  FALSE,
  'do',
  20
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-13-022',
  'CL-13',
  'Approach Options',
  'Baby Led Weaning - soft finger foods',
  'Baby feeds themselves from start',
  FALSE,
  'do',
  21
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-13-023',
  'CL-13',
  'Approach Options',
  'Combination approach',
  'Mix of purees and finger foods',
  FALSE,
  'do',
  22
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-13-024',
  'CL-13',
  'Approach Options',
  'Discuss with pediatrician',
  'They can recommend approach for your baby',
  TRUE,
  'do',
  23
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-14-001',
  'CL-14',
  'Medicine Cabinet Essentials',
  'Infant thermometer',
  'Rectal is most accurate for babies',
  TRUE,
  'do',
  0
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-14-002',
  'CL-14',
  'Medicine Cabinet Essentials',
  'Infant acetaminophen (Tylenol)',
  'For 2+ months - know dosage by weight from pediatrician',
  TRUE,
  'do',
  1
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-14-003',
  'CL-14',
  'Medicine Cabinet Essentials',
  'Infant ibuprofen (Motrin)',
  'For 6+ months - know dosage by weight',
  TRUE,
  'do',
  2
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-14-004',
  'CL-14',
  'Medicine Cabinet Essentials',
  'Nasal aspirator',
  'NoseFrida or bulb syringe for stuffy nose',
  TRUE,
  'do',
  3
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-14-005',
  'CL-14',
  'Medicine Cabinet Essentials',
  'Saline drops',
  'Loosens congestion before aspirating',
  TRUE,
  'do',
  4
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-14-006',
  'CL-14',
  'Medicine Cabinet Essentials',
  'Humidifier',
  'Cool mist helps with congestion',
  TRUE,
  'do',
  5
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-14-007',
  'CL-14',
  'Medicine Cabinet Essentials',
  'Pedialyte or electrolyte solution',
  'For dehydration with vomiting or diarrhea',
  TRUE,
  'do',
  6
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-14-008',
  'CL-14',
  'Medicine Cabinet Essentials',
  'Medicine syringe',
  'For accurate dosing of liquid medicine',
  TRUE,
  'do',
  7
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-14-009',
  'CL-14',
  'Call Doctor Immediately',
  'Fever over 100.4F in baby under 3 months',
  'This is an emergency - call immediately',
  TRUE,
  'do',
  8
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-14-010',
  'CL-14',
  'Call Doctor Immediately',
  'Fever over 104F at any age',
  'High fever needs medical attention',
  TRUE,
  'do',
  9
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-14-011',
  'CL-14',
  'Call Doctor Immediately',
  'Difficulty breathing',
  'Ribs showing with each breath or flaring nostrils',
  TRUE,
  'do',
  10
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-14-012',
  'CL-14',
  'Call Doctor Immediately',
  'Refusing to eat or drink',
  'Dehydration risk especially in infants',
  TRUE,
  'do',
  11
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-14-013',
  'CL-14',
  'Call Doctor Immediately',
  'Fewer wet diapers than usual',
  'Sign of dehydration',
  TRUE,
  'do',
  12
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-14-014',
  'CL-14',
  'Call Doctor Immediately',
  'Lethargy or unresponsiveness',
  'Hard to wake or unusually limp',
  TRUE,
  'do',
  13
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-14-015',
  'CL-14',
  'Call Doctor Immediately',
  'Rash that doesn''t fade with pressure',
  'Could indicate serious infection',
  TRUE,
  'do',
  14
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-14-016',
  'CL-14',
  'Call Doctor Immediately',
  'Inconsolable crying for hours',
  'Pain or serious illness possible',
  TRUE,
  'do',
  15
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-14-017',
  'CL-14',
  'Can Usually Wait for Office Hours',
  'Low grade fever with cold symptoms',
  'Monitor and call in morning',
  TRUE,
  'do',
  16
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-14-018',
  'CL-14',
  'Can Usually Wait for Office Hours',
  'Runny nose and cough without distress',
  'Common cold - supportive care at home',
  TRUE,
  'do',
  17
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-14-019',
  'CL-14',
  'Can Usually Wait for Office Hours',
  'Mild diarrhea with normal behavior',
  'Push fluids and monitor',
  TRUE,
  'do',
  18
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-14-020',
  'CL-14',
  'Can Usually Wait for Office Hours',
  'Single episode of vomiting',
  'Monitor for more - could be nothing',
  TRUE,
  'do',
  19
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-14-021',
  'CL-14',
  'Home Care Tips',
  'Push fluids',
  'Breast milk or formula or pedialyte',
  TRUE,
  'do',
  20
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-14-022',
  'CL-14',
  'Home Care Tips',
  'Rest and comfort',
  'Extra cuddles and quiet time',
  TRUE,
  'do',
  21
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-14-023',
  'CL-14',
  'Home Care Tips',
  'Run humidifier',
  'Helps with congestion',
  TRUE,
  'do',
  22
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-14-024',
  'CL-14',
  'Home Care Tips',
  'Saline and suction for stuffy nose',
  'Before feeds and before sleep',
  TRUE,
  'do',
  23
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-14-025',
  'CL-14',
  'Home Care Tips',
  'Trust your gut',
  'If something feels wrong call the doctor',
  TRUE,
  'do',
  24
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-15-001',
  'CL-15',
  'Parents Info',
  'Mom''s full name and cell phone',
  'Include if you might be unreachable',
  TRUE,
  'do',
  0
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-15-002',
  'CL-15',
  'Parents Info',
  'Dad''s full name and cell phone',
  'Include if you might be unreachable',
  TRUE,
  'do',
  1
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-15-003',
  'CL-15',
  'Parents Info',
  'Home address',
  'Full address including zip code',
  TRUE,
  'do',
  2
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-15-004',
  'CL-15',
  'Parents Info',
  'Work addresses and phones',
  'Where each parent can be reached during work',
  FALSE,
  'do',
  3
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-15-005',
  'CL-15',
  'Emergency Contacts',
  'Backup emergency contact',
  'Grandparent or close friend who can come quickly',
  TRUE,
  'do',
  4
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-15-006',
  'CL-15',
  'Emergency Contacts',
  'Neighbor who has a key',
  'Someone very close who can help',
  FALSE,
  'do',
  5
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-15-007',
  'CL-15',
  'Medical Info',
  'Pediatrician name and phone',
  'Including after hours number',
  TRUE,
  'do',
  6
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-15-008',
  'CL-15',
  'Medical Info',
  'Nearest emergency room address',
  'Know which hospital you''d go to',
  TRUE,
  'do',
  7
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-15-009',
  'CL-15',
  'Medical Info',
  'Poison control number',
  '1-800-222-1222 in US',
  TRUE,
  'do',
  8
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-15-010',
  'CL-15',
  'Medical Info',
  'Baby''s date of birth',
  'For medical providers',
  TRUE,
  'do',
  9
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-15-011',
  'CL-15',
  'Medical Info',
  'Known allergies',
  'Food or medicine allergies',
  TRUE,
  'do',
  10
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-15-012',
  'CL-15',
  'Medical Info',
  'Current medications',
  'Any regular medications baby takes',
  TRUE,
  'do',
  11
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-15-013',
  'CL-15',
  'Medical Info',
  'Health insurance info',
  'Insurance company name and policy number and phone',
  TRUE,
  'do',
  12
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-15-014',
  'CL-15',
  'Care Instructions',
  'Feeding schedule and amounts',
  'What and when and how much',
  TRUE,
  'do',
  13
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-15-015',
  'CL-15',
  'Care Instructions',
  'Nap schedule',
  'When and how long typically',
  TRUE,
  'do',
  14
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-15-016',
  'CL-15',
  'Care Instructions',
  'Bedtime routine',
  'Step by step if caregiver is doing bedtime',
  TRUE,
  'do',
  15
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-15-017',
  'CL-15',
  'Care Instructions',
  'Comfort techniques',
  'What works to calm your specific baby',
  TRUE,
  'do',
  16
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-15-018',
  'CL-15',
  'Location Info',
  'Where to find diapers and supplies',
  'So caregiver doesn''t have to search',
  TRUE,
  'do',
  17
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-15-019',
  'CL-15',
  'Location Info',
  'Where to find first aid kit',
  'Quick access in emergency',
  TRUE,
  'do',
  18
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-15-020',
  'CL-15',
  'Location Info',
  'Wifi password',
  'For caregiver''s use',
  FALSE,
  'do',
  19
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-15-021',
  'CL-15',
  'Authorization',
  'Medical treatment authorization',
  'Written permission for emergency care if you can''t be reached',
  TRUE,
  'do',
  20
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-15-022',
  'CL-15',
  'Authorization',
  'Copy of insurance card',
  'Photo or photocopy attached',
  TRUE,
  'do',
  21
) ON CONFLICT (item_id) DO NOTHING;

