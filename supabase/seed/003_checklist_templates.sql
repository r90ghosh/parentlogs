-- Checklist Templates Seed Data
-- Generated: 2026-03-26T05:22:18.888Z
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
  false,
  4
) ON CONFLICT (checklist_id) DO NOTHING;

INSERT INTO checklist_templates (checklist_id, name, description, stage, week_relevant, is_premium, sort_order)
VALUES (
  'CL-06',
  'First Restaurant Outing',
  'How to successfully eat at a restaurant with a baby',
  'post-birth',
  '6+',
  false,
  5
) ON CONFLICT (checklist_id) DO NOTHING;

INSERT INTO checklist_templates (checklist_id, name, description, stage, week_relevant, is_premium, sort_order)
VALUES (
  'CL-07',
  'First Road Trip',
  'Everything you need for a 2+ hour car trip with baby',
  'post-birth',
  '8+',
  false,
  6
) ON CONFLICT (checklist_id) DO NOTHING;

INSERT INTO checklist_templates (checklist_id, name, description, stage, week_relevant, is_premium, sort_order)
VALUES (
  'CL-08',
  'First Night Away from Baby',
  'How to prepare when leaving baby with a caregiver overnight',
  'post-birth',
  '12+',
  false,
  7
) ON CONFLICT (checklist_id) DO NOTHING;

INSERT INTO checklist_templates (checklist_id, name, description, stage, week_relevant, is_premium, sort_order)
VALUES (
  'CL-09',
  'First Hotel Stay',
  'How to survive staying in a hotel with a baby',
  'post-birth',
  '12+',
  false,
  8
) ON CONFLICT (checklist_id) DO NOTHING;

INSERT INTO checklist_templates (checklist_id, name, description, stage, week_relevant, is_premium, sort_order)
VALUES (
  'CL-10',
  'Daycare Tour Questions',
  'What to look for and ask when touring daycare facilities',
  'pregnancy',
  '20-28',
  false,
  9
) ON CONFLICT (checklist_id) DO NOTHING;

INSERT INTO checklist_templates (checklist_id, name, description, stage, week_relevant, is_premium, sort_order)
VALUES (
  'CL-11',
  'Returning to Work',
  'Everything you need to prepare for going back to work after baby',
  'post-birth',
  '8-12',
  false,
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

INSERT INTO checklist_templates (checklist_id, name, description, stage, week_relevant, is_premium, sort_order)
VALUES (
  'CL-16',
  'Birth Plan Decisions',
  'Key labor and delivery decisions to discuss with your partner and OB before the big day',
  'pregnancy',
  '28-32',
  false,
  15
) ON CONFLICT (checklist_id) DO NOTHING;

INSERT INTO checklist_templates (checklist_id, name, description, stage, week_relevant, is_premium, sort_order)
VALUES (
  'CL-17',
  'Nursery Setup',
  'Everything you need to build a safe, functional nursery before baby arrives',
  'pregnancy',
  '20-28',
  false,
  16
) ON CONFLICT (checklist_id) DO NOTHING;

INSERT INTO checklist_templates (checklist_id, name, description, stage, week_relevant, is_premium, sort_order)
VALUES (
  'CL-18',
  'Car Seat Installation',
  'Step-by-step guide to getting the car seat installed correctly - the hospital won''t let you leave without it',
  'pregnancy',
  '34-36',
  false,
  17
) ON CONFLICT (checklist_id) DO NOTHING;

INSERT INTO checklist_templates (checklist_id, name, description, stage, week_relevant, is_premium, sort_order)
VALUES (
  'CL-19',
  'First Solo Outing with Baby',
  'Everything you need for your first trip out of the house alone with baby - you''ve got this',
  'post-birth',
  '4+',
  false,
  18
) ON CONFLICT (checklist_id) DO NOTHING;

INSERT INTO checklist_templates (checklist_id, name, description, stage, week_relevant, is_premium, sort_order)
VALUES (
  'CL-20',
  'First Bath at Home',
  'Step-by-step guide to baby''s first bath - all the supplies and steps to do it safely and calmly',
  'post-birth',
  '0-1',
  false,
  19
) ON CONFLICT (checklist_id) DO NOTHING;

INSERT INTO checklist_templates (checklist_id, name, description, stage, week_relevant, is_premium, sort_order)
VALUES (
  'CL-21',
  'Newborn Sleep Setup',
  'Everything you need to know and set up for safe sleep from day one',
  'post-birth',
  '0-2',
  false,
  20
) ON CONFLICT (checklist_id) DO NOTHING;

INSERT INTO checklist_templates (checklist_id, name, description, stage, week_relevant, is_premium, sort_order)
VALUES (
  'CL-22',
  'Postpartum Support Plan for Mom',
  'Your game plan to support mom''s recovery - physical, mental, and logistical',
  'pregnancy',
  '34-36',
  false,
  21
) ON CONFLICT (checklist_id) DO NOTHING;

INSERT INTO checklist_templates (checklist_id, name, description, stage, week_relevant, is_premium, sort_order)
VALUES (
  'CL-23',
  'First Vacation with Baby',
  'How to plan, pack, and survive your first trip away from home with a baby',
  'post-birth',
  '12+',
  false,
  22
) ON CONFLICT (checklist_id) DO NOTHING;

INSERT INTO checklist_templates (checklist_id, name, description, stage, week_relevant, is_premium, sort_order)
VALUES (
  'CL-24',
  'First Overnight at Grandparents''',
  'Everything you need to prep, pack, and hand off for baby''s first night away from home',
  'post-birth',
  '12+',
  false,
  23
) ON CONFLICT (checklist_id) DO NOTHING;

INSERT INTO checklist_templates (checklist_id, name, description, stage, week_relevant, is_premium, sort_order)
VALUES (
  'CL-25',
  'First Birthday Party Planning',
  'How to plan a first birthday that celebrates the milestone without losing your mind or your budget',
  'post-birth',
  '44+',
  false,
  24
) ON CONFLICT (checklist_id) DO NOTHING;

INSERT INTO checklist_templates (checklist_id, name, description, stage, week_relevant, is_premium, sort_order)
VALUES (
  'CL-26',
  'Choosing a Pediatrician',
  'How to research, interview, and pick the right doctor for your baby before they arrive',
  'pregnancy',
  '28-32',
  false,
  25
) ON CONFLICT (checklist_id) DO NOTHING;

INSERT INTO checklist_templates (checklist_id, name, description, stage, week_relevant, is_premium, sort_order)
VALUES (
  'CL-27',
  'First Sports / Activity Class',
  'How to choose, prep for, and get the most out of baby''s first structured activity class',
  'post-birth',
  '24+',
  false,
  26
) ON CONFLICT (checklist_id) DO NOTHING;

INSERT INTO checklist_templates (checklist_id, name, description, stage, week_relevant, is_premium, sort_order)
VALUES (
  'CL-28',
  'Baby Photo & Memory Keeping',
  'A system for capturing, organizing, and preserving baby''s first year before the moments slip away',
  'post-birth',
  '0+',
  false,
  27
) ON CONFLICT (checklist_id) DO NOTHING;

INSERT INTO checklist_templates (checklist_id, name, description, stage, week_relevant, is_premium, sort_order)
VALUES (
  'CL-29',
  'Infant CPR & First Aid Prep',
  'Training, supplies, and knowledge every parent needs before an emergency happens',
  'pregnancy',
  '28-36',
  false,
  28
) ON CONFLICT (checklist_id) DO NOTHING;

INSERT INTO checklist_templates (checklist_id, name, description, stage, week_relevant, is_premium, sort_order)
VALUES (
  'CL-30',
  'Life Insurance & Will Updates',
  'The financial and legal prep most parents put off but every family needs done before baby arrives',
  'pregnancy',
  '20-28',
  false,
  29
) ON CONFLICT (checklist_id) DO NOTHING;

INSERT INTO checklist_templates (checklist_id, name, description, stage, week_relevant, is_premium, sort_order)
VALUES (
  'CL-31',
  'Paternity Leave Planning',
  'How to prepare, protect, and maximize your time off when baby arrives',
  'pregnancy',
  '28-36',
  false,
  30
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

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-16-001',
  'CL-16',
  'Labor Preferences',
  'Decide on unmedicated vs medicated labor',
  'Talk through pain tolerance honestly. No medals for suffering - pick what works for your partner.',
  TRUE,
  'do',
  0
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-16-002',
  'CL-16',
  'Labor Preferences',
  'Research birthing positions',
  'Upright, hands-and-knees, side-lying, squatting - your partner should know the options before labor starts.',
  FALSE,
  'do',
  1
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-16-003',
  'CL-16',
  'Labor Preferences',
  'Discuss water birth or laboring in tub',
  'Not all hospitals offer this. Confirm availability now so there''s no day-of disappointment.',
  FALSE,
  'do',
  2
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-16-004',
  'CL-16',
  'Labor Preferences',
  'Movement during labor preferences',
  'Walking the halls, bouncing on a birth ball, swaying - continuous monitoring may limit options.',
  FALSE,
  'do',
  3
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-16-005',
  'CL-16',
  'Labor Preferences',
  'Decide on intermittent vs continuous fetal monitoring',
  'Continuous keeps you tethered to the bed. Ask your OB if intermittent is an option for low-risk pregnancies.',
  TRUE,
  'do',
  4
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-16-006',
  'CL-16',
  'Pain Management',
  'Discuss epidural timing preferences',
  'Some want it early, some want to wait. Know that you can request one at almost any point during labor.',
  TRUE,
  'do',
  5
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-16-007',
  'CL-16',
  'Pain Management',
  'Ask about nitrous oxide availability',
  'Not every hospital has it. It takes the edge off without full numbness - worth knowing if it''s an option.',
  FALSE,
  'do',
  6
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-16-008',
  'CL-16',
  'Pain Management',
  'Learn breathing and relaxation techniques',
  'Take a class or watch videos together. Even with an epidural, breathing helps during early labor and pushing.',
  TRUE,
  'do',
  7
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-16-009',
  'CL-16',
  'Pain Management',
  'Discuss IV pain medication options',
  'Fentanyl or Stadol can help in early labor. They make you drowsy and cross to baby, so timing matters.',
  FALSE,
  'do',
  8
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-16-010',
  'CL-16',
  'Delivery Room',
  'Decide who will be in the delivery room',
  'Partner, doula, family members - set this boundary now. Most hospitals limit to 2-3 support people.',
  TRUE,
  'do',
  9
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-16-011',
  'CL-16',
  'Delivery Room',
  'Photography and video preferences',
  'Decide what''s okay to capture. Some hospitals prohibit video during delivery itself - ask in advance.',
  FALSE,
  'do',
  10
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-16-012',
  'CL-16',
  'Delivery Room',
  'Music and lighting preferences',
  'Make a playlist, bring a speaker. Most rooms have dimmable lights - a calmer environment helps.',
  FALSE,
  'do',
  11
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-16-013',
  'CL-16',
  'Delivery Room',
  'Decide if dad wants to cut the cord',
  'No pressure either way. The nurse will guide you through it if you do. It''s tougher than you''d think - like cutting a garden hose.',
  FALSE,
  'do',
  12
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-16-014',
  'CL-16',
  'Post-Delivery',
  'Request delayed cord clamping',
  'Waiting 1-3 minutes lets extra blood flow to baby. AAP recommends it. Put it in your plan and remind the team.',
  TRUE,
  'do',
  13
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-16-015',
  'CL-16',
  'Post-Delivery',
  'Immediate skin-to-skin contact plan',
  'Baby goes directly on mom''s chest. If mom can''t, dad does skin-to-skin. Tell the nurses this is your preference.',
  TRUE,
  'do',
  14
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-16-016',
  'CL-16',
  'Post-Delivery',
  'Research cord blood banking',
  'Private banking costs $1,500-2,500 upfront plus $150-300/year storage. Public donation is free. Decide by week 34.',
  FALSE,
  'do',
  15
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-16-017',
  'CL-16',
  'Post-Delivery',
  'Golden hour preferences',
  'Request that non-urgent newborn procedures (weighing, vitamin K, eye ointment) wait until after the first hour of skin-to-skin.',
  TRUE,
  'do',
  16
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-16-018',
  'CL-16',
  'Post-Delivery',
  'Feeding plan for first hour',
  'Breastfeeding within the first hour boosts success rates. Even if formula-feeding, that first latch attempt matters.',
  TRUE,
  'do',
  17
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-16-019',
  'CL-16',
  'Emergency Scenarios',
  'Discuss C-section preferences',
  'If it goes to C-section: who stays in the OR, does dad want to watch, clear drape vs standard. Have this conversation before labor.',
  TRUE,
  'do',
  18
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-16-020',
  'CL-16',
  'Emergency Scenarios',
  'NICU plan if baby needs extra care',
  'Who stays with baby, who stays with mom. Know where the NICU is in your hospital. Ask about parent access policies.',
  TRUE,
  'do',
  19
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-16-021',
  'CL-16',
  'Emergency Scenarios',
  'Blood transfusion consent discussion',
  'If there''s hemorrhaging, the team needs to act fast. Discuss any religious or personal objections with your OB now, not in the moment.',
  TRUE,
  'do',
  20
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-16-022',
  'CL-16',
  'Emergency Scenarios',
  'Discuss assisted delivery preferences',
  'Vacuum or forceps may be needed if pushing stalls. Know the risks and tell your OB your preferences in advance.',
  FALSE,
  'do',
  21
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-17-001',
  'CL-17',
  'Furniture',
  'Assemble crib and check for recalls',
  'Check cpsc.gov for recalls on your model. Slat spacing must be under 2-3/8 inches. No drop-side cribs - they''re banned.',
  TRUE,
  'do',
  0
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-17-002',
  'CL-17',
  'Furniture',
  'Set up changing table or dresser-top changer',
  'Waist height saves your back. Secure the changing pad with straps - babies roll sooner than you think.',
  TRUE,
  'do',
  1
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-17-003',
  'CL-17',
  'Furniture',
  'Get a glider or rocker for night feeds',
  'You''ll log 200+ hours in this chair the first year. Test before buying - comfort beats style.',
  TRUE,
  'bring',
  2
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-17-004',
  'CL-17',
  'Furniture',
  'Set up dresser for baby clothes',
  'Organize by size and type. Pro tip: dividers with labels save 3 AM fumbling in the dark.',
  FALSE,
  'do',
  3
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-17-005',
  'CL-17',
  'Safety',
  'Anchor all furniture to the wall',
  'Dressers, bookshelves, changing table - use anti-tip straps. A dresser falling is the #1 nursery danger. Takes 10 minutes per piece.',
  TRUE,
  'do',
  4
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-17-006',
  'CL-17',
  'Safety',
  'Install cord covers or cord cleats',
  'Blinds cords are a strangulation risk. Switch to cordless blinds or secure cords out of reach with cleats.',
  TRUE,
  'do',
  5
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-17-007',
  'CL-17',
  'Safety',
  'Cover unused electrical outlets',
  'Use sliding outlet covers (not plug-in caps, which are choking hazards). Cover every outlet within 3 feet of the floor.',
  TRUE,
  'do',
  6
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-17-008',
  'CL-17',
  'Safety',
  'Install smoke and CO detectors',
  'One smoke detector in the nursery, CO detector on the same floor. Test them monthly. Replace batteries every 6 months.',
  TRUE,
  'do',
  7
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-17-009',
  'CL-17',
  'Sleep Environment',
  'Install blackout curtains',
  'Even a sliver of light can wreck a nap. Overlap curtains past the window frame or use Velcro strips for full coverage.',
  TRUE,
  'bring',
  8
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-17-010',
  'CL-17',
  'Sleep Environment',
  'Set up a white noise machine',
  'Place it at least 7 feet from the crib at under 50 decibels. Continuous white noise beats heartbeat or wave sounds for most babies.',
  TRUE,
  'bring',
  9
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-17-011',
  'CL-17',
  'Sleep Environment',
  'Install baby monitor',
  'Video monitors with night vision are worth it. Mount it out of reach, at least 3 feet from the crib. No cords near the crib.',
  TRUE,
  'do',
  10
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-17-012',
  'CL-17',
  'Sleep Environment',
  'Set up a dim night light',
  'Red or amber light only - blue and white light suppress melatonin. You need just enough light for diaper changes.',
  FALSE,
  'bring',
  11
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-17-013',
  'CL-17',
  'Sleep Environment',
  'Get a room thermometer',
  'Ideal nursery temp is 68-72°F. Babies can''t regulate body temp well - overheating increases SIDS risk.',
  TRUE,
  'bring',
  12
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-17-014',
  'CL-17',
  'Organization',
  'Set up the diaper station',
  'Diapers, wipes, cream, bags for dirty diapers, hand sanitizer - all within one-arm reach. You''ll change 10-12 diapers a day.',
  TRUE,
  'do',
  13
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-17-015',
  'CL-17',
  'Organization',
  'Organize clothing by size',
  'Newborn, 0-3, 3-6 months in separate sections. Remove tags and wash everything in fragrance-free detergent before baby arrives.',
  TRUE,
  'do',
  14
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-17-016',
  'CL-17',
  'Organization',
  'Place a laundry hamper in the nursery',
  'You''ll generate a shocking amount of tiny laundry. A hamper in the room means fewer trips with spit-up clothes.',
  FALSE,
  'bring',
  15
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-17-017',
  'CL-17',
  'Organization',
  'Stock a nursery first-aid kit',
  'Infant Tylenol, gas drops, saline drops, nasal aspirator, thermometer, nail clippers. Keep it in a labeled bin on the shelf.',
  TRUE,
  'bring',
  16
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-17-018',
  'CL-17',
  'Organization',
  'Set up a feeding station in the nursery',
  'Water bottle, burp cloths, nursing pillow, phone charger - everything you need during 2 AM feeds in one spot.',
  FALSE,
  'do',
  17
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-17-019',
  'CL-17',
  'Finishing Touches',
  'Hang wall art or decals',
  'High-contrast black and white patterns are best for newborn vision. Save the pastel stuff for 3+ months.',
  FALSE,
  'do',
  18
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-17-020',
  'CL-17',
  'Finishing Touches',
  'Attach crib mobile',
  'Mount securely out of reach. Remove it once baby can push up on hands and knees (around 5 months).',
  FALSE,
  'do',
  19
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-17-021',
  'CL-17',
  'Finishing Touches',
  'Set up a small bookshelf',
  'Board books from day one. Reading to your newborn builds neural connections even if they can''t understand a word.',
  FALSE,
  'bring',
  20
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-17-022',
  'CL-17',
  'Finishing Touches',
  'Lay a washable area rug',
  'Soft surface for tummy time later. Make sure it''s non-slip and machine washable - it will get bodily fluids on it.',
  FALSE,
  'bring',
  21
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-18-001',
  'CL-18',
  'Before Purchase',
  'Research rear-facing infant seats',
  'Rear-facing until at least age 2 or until they outgrow the height/weight limit. Convertible seats last longer but infant carriers are easier to carry.',
  TRUE,
  'do',
  0
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-18-002',
  'CL-18',
  'Before Purchase',
  'Check vehicle compatibility',
  'Not every seat fits every car. Check the seat manufacturer''s fit guide and measure your back seat before buying.',
  TRUE,
  'do',
  1
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-18-003',
  'CL-18',
  'Before Purchase',
  'Register the car seat with the manufacturer',
  'Takes 2 minutes online. If there''s ever a recall, they''ll contact you directly instead of you finding out by accident.',
  TRUE,
  'do',
  2
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-18-004',
  'CL-18',
  'Before Purchase',
  'Check the manufacture and expiration date',
  'Car seats expire 6-10 years from manufacture date. Never use a secondhand seat if you don''t know its full history.',
  TRUE,
  'do',
  3
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-18-005',
  'CL-18',
  'Installation',
  'Choose LATCH or seatbelt installation method',
  'LATCH is easier but has a weight limit (usually 65 lbs combined child + seat). Seatbelt works for any weight. Never use both at the same time.',
  TRUE,
  'do',
  4
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-18-006',
  'CL-18',
  'Installation',
  'Install the base at the correct angle',
  'Most bases have a built-in level indicator. Newborns need a more reclined angle (30-45 degrees) to keep their airway open.',
  TRUE,
  'do',
  5
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-18-007',
  'CL-18',
  'Installation',
  'Perform the 1-inch movement test',
  'Grab the base where the seatbelt or LATCH connects and pull hard. It should not move more than 1 inch side to side or front to back.',
  TRUE,
  'do',
  6
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-18-008',
  'CL-18',
  'Installation',
  'Check the recline angle indicator',
  'The level bubble or line should be in the green zone. If not, use a rolled towel under the base to adjust. Recheck after adjusting.',
  TRUE,
  'do',
  7
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-18-009',
  'CL-18',
  'Installation',
  'Route the harness straps correctly',
  'For rear-facing, harness straps go through slots at or below baby''s shoulders. Chest clip sits at armpit level.',
  TRUE,
  'do',
  8
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-18-010',
  'CL-18',
  'Installation',
  'Do the pinch test on harness straps',
  'Tighten straps, then try to pinch the strap at baby''s shoulder. If you can pinch a fold of webbing, it''s too loose.',
  TRUE,
  'do',
  9
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-18-011',
  'CL-18',
  'Verification',
  'Schedule a fire station or police inspection',
  'Free car seat checks are available at most fire stations and some police departments. Call ahead - not all locations have certified technicians on duty.',
  TRUE,
  'do',
  10
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-18-012',
  'CL-18',
  'Verification',
  'Read the car seat manual cover to cover',
  'Every seat is different. YouTube videos are great but your specific manual is the final authority on installation for your model.',
  TRUE,
  'do',
  11
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-18-013',
  'CL-18',
  'Verification',
  'Read your vehicle owner''s manual car seat section',
  'Your car may have specific LATCH anchor locations or seatbelt lock-off features you don''t know about. Check pages on child restraints.',
  TRUE,
  'do',
  12
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-18-014',
  'CL-18',
  'Practice Runs',
  'Practice buckling in a baby-sized doll or stuffed animal',
  'Use a 7-8 lb stuffed animal to practice strapping in. Get the harness adjustment and chest clip placement muscle memory down.',
  FALSE,
  'do',
  13
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-18-015',
  'CL-18',
  'Practice Runs',
  'Practice removing and reinstalling the carrier from the base',
  'You''ll do this dozens of times. The click-in and release mechanism should be second nature before baby arrives.',
  TRUE,
  'do',
  14
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-18-016',
  'CL-18',
  'Practice Runs',
  'Time yourself on a full install and removal',
  'You should be able to install the base from scratch in under 10 minutes. If you can''t, practice more or get it inspected.',
  FALSE,
  'do',
  15
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-18-017',
  'CL-18',
  'Vehicle Prep',
  'Install a back seat mirror',
  'Clips to the rear headrest so you can see baby''s face in your rearview mirror. Essential for rear-facing peace of mind.',
  TRUE,
  'do',
  16
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-18-018',
  'CL-18',
  'Vehicle Prep',
  'Add window shades on rear windows',
  'Static cling shades block sun without suction cups falling off. Keeps baby cool and prevents sunburn on the drive home.',
  FALSE,
  'do',
  17
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-18-019',
  'CL-18',
  'Vehicle Prep',
  'Stock a car emergency kit',
  'Extra diapers, wipes, change of clothes, blanket, plastic bags in a small bin in the trunk. You will need this sooner than you think.',
  TRUE,
  'do',
  18
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-18-020',
  'CL-18',
  'Vehicle Prep',
  'Remove any loose objects from the rear shelf and back seat',
  'In a sudden stop, a water bottle becomes a projectile. Clear the back seat area completely around the car seat.',
  TRUE,
  'do',
  19
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-19-001',
  'CL-19',
  'Diaper Bag',
  'Pack 6 diapers minimum',
  'You''ll probably use 2-3, but blowouts happen in pairs. Better to carry extra than sprint to a store one-handed.',
  TRUE,
  'bring',
  0
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-19-002',
  'CL-19',
  'Diaper Bag',
  'Full pack of wipes',
  'Wipes clean everything - hands, face, surfaces, blowout situations. Never go anywhere with a half-empty pack.',
  TRUE,
  'bring',
  1
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-19-003',
  'CL-19',
  'Diaper Bag',
  '2 changes of clothes for baby',
  'One for the expected spit-up, one for the unexpected blowout. Full outfits including socks.',
  TRUE,
  'bring',
  2
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-19-004',
  'CL-19',
  'Diaper Bag',
  'Plastic bags for dirty clothes',
  'Ziplock bags or wet bags. Nothing worse than a poop-covered onesie loose in your bag contaminating everything.',
  TRUE,
  'bring',
  3
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-19-005',
  'CL-19',
  'Diaper Bag',
  'Portable changing pad',
  'Not every restroom has a changing table. A foldable pad lets you change baby on any flat surface hygienically.',
  TRUE,
  'bring',
  4
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-19-006',
  'CL-19',
  'Feeding',
  'Pack bottles and formula if bottle-feeding',
  'Bring one more bottle than you think you need. Pre-measured formula dispenser is a game changer for outings.',
  TRUE,
  'bring',
  5
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-19-007',
  'CL-19',
  'Feeding',
  'Pack 2-3 burp cloths',
  'Cloth diapers work great as burp cloths. Drape one over your shoulder before every feed - saves your shirt.',
  TRUE,
  'bring',
  6
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-19-008',
  'CL-19',
  'Feeding',
  'Bring a nursing cover if breastfeeding in public',
  'Totally optional - feed however you''re comfortable. But having one in the bag gives you the choice.',
  FALSE,
  'bring',
  7
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-19-009',
  'CL-19',
  'Comfort',
  'Pacifier (plus a spare)',
  'Pacifiers fall on the ground constantly. Bring 2 and a pacifier clip. The clip saves you from the floor-pacifier-panic cycle.',
  FALSE,
  'bring',
  8
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-19-010',
  'CL-19',
  'Comfort',
  'Favorite small toy or lovey',
  'Something familiar that smells like home. It can buy you 5 minutes of calm in a pinch.',
  FALSE,
  'bring',
  9
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-19-011',
  'CL-19',
  'Comfort',
  'Light blanket and an extra swaddle',
  'For warmth, shade, nursing cover backup, stroller cover, or emergency spit-up cleanup. Blankets are Swiss army knives.',
  TRUE,
  'bring',
  10
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-19-012',
  'CL-19',
  'Logistics',
  'Plan your route with potential stops',
  'Know where the restrooms and changing stations are along your route. Google Maps reviews often mention family-friendly facilities.',
  TRUE,
  'do',
  11
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-19-013',
  'CL-19',
  'Logistics',
  'Locate changing stations at your destination',
  'Not every bathroom has one. Check the family restroom or ask guest services. Worst case, your car trunk and a changing pad work.',
  TRUE,
  'do',
  12
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-19-014',
  'CL-19',
  'Logistics',
  'Save emergency contacts in your phone favorites',
  'Pediatrician, partner, and one backup person on speed dial. You need to be able to call one-handed while holding baby.',
  TRUE,
  'do',
  13
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-19-015',
  'CL-19',
  'Logistics',
  'Do a car seat check before you leave',
  'Harness snug, chest clip at armpit level, nothing loose in the back seat. Takes 30 seconds and it''s non-negotiable every trip.',
  TRUE,
  'do',
  14
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-19-016',
  'CL-19',
  'Mental Prep',
  'Start with a short 30-minute trip',
  'Coffee shop, quick grocery run, a walk in the park. Build confidence before attempting a 3-hour Target run.',
  TRUE,
  'do',
  15
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-19-017',
  'CL-19',
  'Mental Prep',
  'Have a backup plan if things go sideways',
  'Know your exit strategy. If baby melts down, it''s totally fine to abandon the cart and leave. No one is judging you.',
  TRUE,
  'do',
  16
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-19-018',
  'CL-19',
  'Mental Prep',
  'Accept that baby might cry in public',
  'Every parent in earshot has been there. Most strangers are sympathetic, not annoyed. You''re doing fine.',
  FALSE,
  'do',
  17
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-19-019',
  'CL-19',
  'Mental Prep',
  'Text your partner updates',
  'A quick photo or ''we''re doing great'' text keeps everyone calm. Plus you''ll want to remember this milestone.',
  FALSE,
  'do',
  18
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-19-020',
  'CL-19',
  'Mental Prep',
  'Bring a change of shirt for yourself',
  'Spit-up on your shoulder at the grocery store is a rite of passage, but a backup shirt in the car is clutch.',
  FALSE,
  'bring',
  19
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-20-001',
  'CL-20',
  'Supplies',
  'Baby tub or sink insert',
  'A contoured infant tub with a sling insert supports the head and keeps baby from sliding. The kitchen sink with an insert also works great.',
  TRUE,
  'bring',
  0
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-20-002',
  'CL-20',
  'Supplies',
  '2 hooded towels',
  'One to wrap baby in immediately, one as backup if the first gets wet during the process. Hooded towels keep the head warm.',
  TRUE,
  'bring',
  1
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-20-003',
  'CL-20',
  'Supplies',
  '3 soft washcloths',
  'One for face, one for body, one spare. Baby-specific washcloths are softer than regular ones.',
  TRUE,
  'bring',
  2
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-20-004',
  'CL-20',
  'Supplies',
  'Tear-free baby soap and shampoo',
  'Fragrance-free, hypoallergenic. You only need a tiny amount - a pea-sized drop for the whole body. Less is more with newborn skin.',
  TRUE,
  'bring',
  3
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-20-005',
  'CL-20',
  'Supplies',
  'Cotton balls for eye and face cleaning',
  'Dampen with warm water and wipe each eye from inner corner outward. Use a fresh cotton ball for each eye.',
  FALSE,
  'bring',
  4
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-20-006',
  'CL-20',
  'Supplies',
  'Fresh diaper and clean outfit ready',
  'Have these laid out and unfolded before you start the bath. Wet naked babies get cold fast - speed matters.',
  TRUE,
  'bring',
  5
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-20-007',
  'CL-20',
  'Before Bath',
  'Check room temperature is 72-75°F',
  'Babies lose body heat fast when wet. Close windows, turn up the heat if needed. A warm room prevents shivering and crying.',
  TRUE,
  'do',
  6
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-20-008',
  'CL-20',
  'Before Bath',
  'Test water temperature at 98-100°F',
  'Use a bath thermometer or your elbow - it should feel warm, not hot. Wrist testing is unreliable. 100°F max, always.',
  TRUE,
  'do',
  7
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-20-009',
  'CL-20',
  'Before Bath',
  'Gather everything within arm''s reach before starting',
  'Soap, towels, washcloths, diaper, clothes - all within one arm''s length. You can never, ever leave baby unattended in water. Not for one second.',
  TRUE,
  'do',
  8
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-20-010',
  'CL-20',
  'Umbilical Cord Care',
  'Sponge bath only until the cord stump falls off',
  'No submerging in water until the umbilical cord falls off (usually 1-3 weeks). Use a damp washcloth for sponge baths instead.',
  TRUE,
  'do',
  9
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-20-011',
  'CL-20',
  'Umbilical Cord Care',
  'Keep the cord stump dry',
  'Pat around it, never scrub it. Let it air dry after sponge baths. It''ll look gross and crusty - that''s normal.',
  TRUE,
  'do',
  10
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-20-012',
  'CL-20',
  'Umbilical Cord Care',
  'Fold diaper below the cord stump',
  'Fold the front of the diaper down so it doesn''t rub or trap moisture against the cord. Some newborn diapers have a cord cutout.',
  TRUE,
  'do',
  11
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-20-013',
  'CL-20',
  'Bath Steps',
  'Wash face first with a damp cloth only',
  'No soap on the face. Wipe eyes, nose, ears, then cheeks and chin with a warm damp washcloth. Do this before getting the body wet.',
  TRUE,
  'do',
  12
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-20-014',
  'CL-20',
  'Bath Steps',
  'Support head and neck at all times',
  'Your forearm under the head, hand gripping the far armpit. This is the football hold - practice it before bath day.',
  TRUE,
  'do',
  13
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-20-015',
  'CL-20',
  'Bath Steps',
  'Wash scalp gently with fingertips',
  'Soft circular motions with a tiny amount of baby shampoo. Don''t worry about the soft spot - it''s tougher than it looks.',
  TRUE,
  'do',
  14
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-20-016',
  'CL-20',
  'Bath Steps',
  'Work top to bottom, front to back',
  'Neck, chest, arms, hands, belly, legs, feet, then diaper area last. This keeps the cleanest areas from getting contaminated.',
  TRUE,
  'do',
  15
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-20-017',
  'CL-20',
  'After Bath',
  'Have a warm towel ready to wrap immediately',
  'Wrap baby in the hooded towel the second they come out. Pat dry, don''t rub. Pay special attention to skin folds - neck, armpits, thighs.',
  TRUE,
  'do',
  16
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-20-018',
  'CL-20',
  'After Bath',
  'Diaper and dress baby quickly',
  'Moisturize with fragrance-free lotion if skin is dry, then diaper and dress fast. The whole process from water to clothed should be under 2 minutes.',
  TRUE,
  'do',
  17
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-21-001',
  'CL-21',
  'Safe Sleep Environment',
  'Firm, flat mattress with tight-fitting sheet only',
  'No memory foam, no toppers, no soft mattresses. The crib mattress should not indent when you press on it. One fitted sheet and nothing else.',
  TRUE,
  'do',
  0
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-21-002',
  'CL-21',
  'Safe Sleep Environment',
  'Remove all bumpers, blankets, toys, and pillows from the crib',
  'Bare crib only. No matter how cute the crib set looks, those items are suffocation hazards. AAP is unambiguous on this.',
  TRUE,
  'do',
  1
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-21-003',
  'CL-21',
  'Safe Sleep Environment',
  'Room share but not bed share',
  'Baby sleeps in their own crib or bassinet in your room for the first 6-12 months. Bed-sharing increases SIDS risk even if you''re a light sleeper.',
  TRUE,
  'do',
  2
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-21-004',
  'CL-21',
  'Safe Sleep Environment',
  'Always place baby on their back to sleep',
  'Back to sleep, every sleep, every time. Once baby can roll both ways on their own, you don''t need to reposition them.',
  TRUE,
  'do',
  3
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-21-005',
  'CL-21',
  'Safe Sleep Environment',
  'No inclined sleepers, swings, or rockers for unsupervised sleep',
  'Dozens of infant deaths linked to inclined sleepers. The only safe sleep surfaces are flat cribs, bassinets, and play yards.',
  TRUE,
  'do',
  4
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-21-006',
  'CL-21',
  'Equipment',
  'Set up bassinet or crib by your bed',
  'Bassinet is easier for the first 3-4 months since you can reach baby without getting up. Check the weight limit - most cap at 20 lbs.',
  TRUE,
  'do',
  5
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-21-007',
  'CL-21',
  'Equipment',
  'Stock 4-5 swaddles of different types',
  'Velcro swaddles are the easiest. Muslin wraps take practice. Try a few styles - every baby has a preference. Stop swaddling when baby shows signs of rolling.',
  TRUE,
  'do',
  6
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-21-008',
  'CL-21',
  'Equipment',
  'Set up white noise machine',
  'Volume under 50 decibels, placed at least 7 feet from baby''s head. Continuous noise, not nature sounds or lullabies that cycle off.',
  TRUE,
  'do',
  7
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-21-009',
  'CL-21',
  'Equipment',
  'Install blackout curtains',
  'Darkness signals melatonin production. Cover the window completely - even small light leaks affect naps. Test from inside with lights off.',
  TRUE,
  'do',
  8
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-21-010',
  'CL-21',
  'Equipment',
  'Place room thermometer near the crib',
  'Keep the room between 68-72°F. Dress baby in one more layer than you''d wear. If they''re sweating at the neck, they''re too warm.',
  TRUE,
  'do',
  9
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-21-011',
  'CL-21',
  'Equipment',
  'Set up baby monitor',
  'Video with night vision so you can check without opening the door. Audio-only works too, but you''ll end up sneaking in to look anyway.',
  TRUE,
  'do',
  10
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-21-012',
  'CL-21',
  'Sleep Schedule',
  'Learn newborn wake windows (45-60 minutes)',
  'Newborns can only stay awake 45-60 minutes before they''re overtired. Watch for yawning, eye rubbing, fussiness - those are the cues.',
  TRUE,
  'do',
  11
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-21-013',
  'CL-21',
  'Sleep Schedule',
  'Practice drowsy-but-awake placement',
  'Put baby down when eyes are heavy but still open. It won''t work every time at first - that''s normal. You''re building a skill, not flipping a switch.',
  TRUE,
  'do',
  12
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-21-014',
  'CL-21',
  'Sleep Schedule',
  'Establish day vs night difference from week one',
  'Bright lights, activity, and noise during the day. Dim lights, quiet voices, and boring diaper changes at night. Baby will catch on in 2-4 weeks.',
  TRUE,
  'do',
  13
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-21-015',
  'CL-21',
  'Sleep Schedule',
  'Keep night feeds dim and boring',
  'Red or amber light only. No talking, no eye contact, no stimulation. Feed, burp, change, back to bed. The goal is ''this is still nighttime.''',
  TRUE,
  'do',
  14
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-21-016',
  'CL-21',
  'Partner Shifts',
  'Agree on a night shift schedule',
  'Split the night into shifts: 8 PM - 1 AM and 1 AM - 6 AM. Each person gets one uninterrupted 5-hour block. Sleep deprivation wrecks everything.',
  TRUE,
  'do',
  15
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-21-017',
  'CL-21',
  'Partner Shifts',
  'Prep bottles for night feeds',
  'If bottle-feeding, have bottles pre-made in the fridge (use within 24 hours) or have formula and water measured out. Fumbling at 3 AM is miserable.',
  TRUE,
  'do',
  16
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-21-018',
  'CL-21',
  'Partner Shifts',
  'Set up a night feeding station',
  'Dim lamp, water bottle, burp cloth, extra swaddle, phone charger, snack - all in arm''s reach of the glider. You shouldn''t need to leave the room.',
  TRUE,
  'do',
  17
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-21-019',
  'CL-21',
  'Troubleshooting',
  'Know when to transition from swaddle to sleep sack',
  'When baby starts showing signs of rolling (usually 3-4 months), switch to a sleep sack with arms free. Cold turkey or one-arm-out method both work.',
  TRUE,
  'do',
  18
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-21-020',
  'CL-21',
  'Troubleshooting',
  'Offer a pacifier after feeding is established',
  'AAP recommends pacifiers at sleep time after breastfeeding is established (around 3-4 weeks). Reduces SIDS risk. Don''t stress if it falls out.',
  FALSE,
  'do',
  19
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-22-001',
  'CL-22',
  'Physical Recovery',
  'Stock peri bottles (2-3)',
  'Hospital gives one but buy backups. Warm water rinse after every bathroom trip for 2-4 weeks. The upside-down squeeze bottle design is easier to use.',
  TRUE,
  'do',
  0
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-22-002',
  'CL-22',
  'Physical Recovery',
  'Buy perineal ice packs',
  'Instant cold packs or DIY with witch hazel pads in the freezer. She''ll want these for the first 1-2 weeks. Stock at least a dozen.',
  TRUE,
  'do',
  1
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-22-003',
  'CL-22',
  'Physical Recovery',
  'Stock stool softeners',
  'The first postpartum bowel movement is genuinely feared. Colace (docusate) daily starting day one post-delivery. This is non-negotiable.',
  TRUE,
  'do',
  2
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-22-004',
  'CL-22',
  'Physical Recovery',
  'Buy high-waist disposable underwear',
  'Mesh hospital underwear runs out fast. High-waist disposable or period underwear protects the incision site (C-section) and holds pads in place.',
  TRUE,
  'do',
  3
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-22-005',
  'CL-22',
  'Physical Recovery',
  'Stock nursing pads (disposable and reusable)',
  'Milk leaks are constant in the first weeks, especially during letdown. Keep extras in every room and the diaper bag.',
  TRUE,
  'do',
  4
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-22-006',
  'CL-22',
  'Physical Recovery',
  'Buy nipple cream (lanolin or organic)',
  'Apply after every feeding session for the first 2-3 weeks. Cracked nipples are common and incredibly painful. This isn''t optional.',
  TRUE,
  'do',
  5
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-22-007',
  'CL-22',
  'Meal Prep',
  'Freeze 2 weeks of meals before the due date',
  'Soups, casseroles, burritos, pasta bakes - things you can reheat one-handed. Label everything with the date and reheating instructions.',
  TRUE,
  'do',
  6
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-22-008',
  'CL-22',
  'Meal Prep',
  'Set up a meal train with friends and family',
  'Use MealTrain.com or TakeThemAMeal.com. Coordinate dates so you don''t get 5 lasagnas on Monday and nothing by Thursday.',
  TRUE,
  'do',
  7
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-22-009',
  'CL-22',
  'Meal Prep',
  'Stock easy one-handed snacks',
  'Granola bars, trail mix, cheese sticks, cut fruit, lactation cookies. Mom will be hungry and holding a baby 80% of the time.',
  TRUE,
  'do',
  8
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-22-010',
  'CL-22',
  'Meal Prep',
  'Place water bottles in every room',
  'Breastfeeding moms need 80-100 oz of water daily. Put a filled 32 oz bottle on every surface she sits - couch, bed, glider, kitchen.',
  TRUE,
  'do',
  9
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-22-011',
  'CL-22',
  'Mental Health',
  'Learn the warning signs of postpartum depression and anxiety',
  'Persistent sadness, inability to bond with baby, intrusive thoughts, panic attacks, rage. This is not ''baby blues'' - baby blues resolve in 2 weeks.',
  TRUE,
  'do',
  10
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-22-012',
  'CL-22',
  'Mental Health',
  'Save Postpartum Support International hotline: 1-800-944-4773',
  '24/7 helpline, text support, and online support groups. Save this number in both your phones now, not when you need it.',
  TRUE,
  'do',
  11
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-22-013',
  'CL-22',
  'Mental Health',
  'Identify a therapist who takes your insurance',
  'Find one who specializes in perinatal mental health. Get the intake paperwork done before baby arrives so it''s one call to start sessions.',
  TRUE,
  'do',
  12
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-22-014',
  'CL-22',
  'Mental Health',
  'Plan daily emotional check-ins with your partner',
  'Ask ''How are you really doing?'' every day and actually listen. A 5-minute honest conversation catches problems before they spiral.',
  TRUE,
  'do',
  13
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-22-015',
  'CL-22',
  'Mental Health',
  'Understand that postpartum depression affects dads too',
  '1 in 10 new fathers experience PPD. Sleep deprivation, identity shifts, and feeling helpless are real. You''re allowed to not be okay.',
  TRUE,
  'do',
  14
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-22-016',
  'CL-22',
  'Household',
  'Line up cleaning help for the first month',
  'Hire a cleaner, ask a friend, or accept every offer of help. The house will be a wreck and that''s fine, but basic cleaning keeps things livable.',
  FALSE,
  'do',
  15
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-22-017',
  'CL-22',
  'Household',
  'Stock household supplies for 2 weeks',
  'Toilet paper, paper towels, dish soap, laundry detergent, trash bags. One less reason to leave the house in those bleary first weeks.',
  TRUE,
  'do',
  16
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-22-018',
  'CL-22',
  'Household',
  'Arrange pet care if you have pets',
  'Dog walking, feeding schedule backup, vet info accessible. Your dog doesn''t understand why walks got shorter. Line up a friend or service.',
  FALSE,
  'do',
  17
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-22-019',
  'CL-22',
  'Household',
  'Set up grocery delivery service',
  'Instacart, Amazon Fresh, or your store''s delivery. Create a recurring order template with essentials so reordering takes 2 minutes.',
  TRUE,
  'do',
  18
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-22-020',
  'CL-22',
  'Visitor Management',
  'Set visiting hours and communicate them',
  '10 AM - 2 PM works for most families. Text it to everyone before baby arrives. ''We love you but we need sleep'' is a complete sentence.',
  TRUE,
  'do',
  19
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-22-021',
  'CL-22',
  'Visitor Management',
  'Require flu shot and TDAP for all visitors',
  'Whooping cough can kill a newborn. Anyone holding baby needs TDAP (ideally 2 weeks before visit) and a current flu shot. No exceptions.',
  TRUE,
  'do',
  20
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-22-022',
  'CL-22',
  'Visitor Management',
  'Designate a gatekeeper for visitor coordination',
  'Pick one trusted person (sibling, parent, best friend) to manage all visit requests. You and your partner should not be fielding 30 texts about visit times.',
  FALSE,
  'do',
  21
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-23-001',
  'CL-23',
  'Planning',
  'Choose a baby-friendly destination',
  'Skip the 14-hour flight to Bali. Pick somewhere 2-4 hours away with baby-friendly amenities, a kitchen, and a washer/dryer.',
  TRUE,
  'do',
  0
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-23-002',
  'CL-23',
  'Planning',
  'Book refundable everything',
  'Flights, hotels, rentals - all refundable or flexible cancellation. Babies get sick, plans change, and a no-refund policy makes everything worse.',
  TRUE,
  'do',
  1
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-23-003',
  'CL-23',
  'Planning',
  'Check with pediatrician about travel vaccines or restrictions',
  'Some destinations require specific vaccines. Pediatrician may recommend waiting on certain trips based on baby''s age and immunization schedule.',
  TRUE,
  'do',
  2
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-23-004',
  'CL-23',
  'Planning',
  'Research nearest hospital and urgent care at destination',
  'Find the closest pediatric ER and save the address in your phone. Know your insurance coverage for out-of-network emergency visits.',
  TRUE,
  'do',
  3
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-23-005',
  'CL-23',
  'Planning',
  'Get a letter from your pediatrician for medications',
  'If traveling with infant Tylenol, prescription meds, or formula, a doctor''s note prevents hassles at airport security or border crossings.',
  FALSE,
  'do',
  4
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-23-006',
  'CL-23',
  'Packing',
  'Pack double the diapers you think you need',
  'For a 3-day trip, that''s 30-40 diapers. Travel disrupts routines and that often means more blowouts. You can always bring extras home.',
  TRUE,
  'bring',
  5
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-23-007',
  'CL-23',
  'Packing',
  'Bring a portable crib or pack-n-play',
  'Hotel cribs are unreliable and often unavailable. Your own portable crib means baby sleeps in something familiar with a mattress you trust.',
  TRUE,
  'bring',
  6
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-23-008',
  'CL-23',
  'Packing',
  'Bring a travel stroller that fits overhead or gate-checks easily',
  'Compact umbrella strollers fold small and survive gate-checking. Your full-size jogger is not the move for airports.',
  TRUE,
  'bring',
  7
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-23-009',
  'CL-23',
  'Packing',
  'Use a car seat travel bag',
  'Protects the car seat from damage during flights. Some bags have wheels - worth the extra $20. Check your car seat free on most airlines.',
  FALSE,
  'bring',
  8
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-23-010',
  'CL-23',
  'Packing',
  'Pack baby''s sound machine and sleep sack',
  'Recreate the sleep environment from home. Same sound, same sleep sack, same bedtime routine. Consistency is the only thing fighting jet lag.',
  TRUE,
  'bring',
  9
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-23-011',
  'CL-23',
  'Travel Day',
  'Time travel around baby''s nap schedule',
  'Drive during nap time or fly during a sleep window. A well-rested baby handles travel 10x better than an overtired one.',
  TRUE,
  'do',
  10
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-23-012',
  'CL-23',
  'Travel Day',
  'Bring 2-3 new small toys for distraction',
  'Dollar store toys they''ve never seen. The novelty buys you 20-30 minutes of quiet. Ration them throughout the trip.',
  FALSE,
  'bring',
  11
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-23-013',
  'CL-23',
  'Travel Day',
  'Pack an extra outfit for yourself',
  'Spit-up on a plane with 3 hours left is rough. A clean shirt in your carry-on saves you from arriving at your destination smelling like formula.',
  TRUE,
  'bring',
  12
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-23-014',
  'CL-23',
  'Travel Day',
  'Bring more snacks and formula than you think you need',
  'Delays happen. Pack enough food and formula for double the travel time. A hungry baby on a delayed flight is everyone''s nightmare.',
  TRUE,
  'bring',
  13
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-23-015',
  'CL-23',
  'Travel Day',
  'Feed baby during takeoff and landing',
  'Swallowing equalizes ear pressure. Nurse or give a bottle during ascent and descent. Pacifiers work too if baby isn''t hungry.',
  TRUE,
  'do',
  14
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-23-016',
  'CL-23',
  'Accommodation',
  'Request a crib from the hotel in advance',
  'Call ahead, don''t rely on the booking note. Confirm it''ll be in the room at check-in. Have your pack-n-play as backup.',
  TRUE,
  'do',
  15
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-23-017',
  'CL-23',
  'Accommodation',
  'Bring outlet covers and do a room safety scan',
  'Get on your hands and knees and look for hazards: cords, sharp edges, small objects, unsecured furniture. Takes 5 minutes at check-in.',
  TRUE,
  'do',
  16
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-23-018',
  'CL-23',
  'Accommodation',
  'Check room for hazards at baby level',
  'Minibars with glass bottles, curtain cords, balcony access, loose lamp cords. Move or block anything within reach before you unpack.',
  TRUE,
  'do',
  17
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-23-019',
  'CL-23',
  'Accommodation',
  'Download a white noise app as backup',
  'In case you forget the sound machine or it breaks. Test it before the trip so you know which sounds work. Keep your phone charged.',
  FALSE,
  'do',
  18
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-23-020',
  'CL-23',
  'Activities',
  'Plan activities around baby''s schedule',
  'Morning outings when baby is fresh, back for afternoon nap, easy evening. Fighting the schedule means everyone suffers.',
  TRUE,
  'do',
  19
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-23-021',
  'CL-23',
  'Activities',
  'Alternate adventure days with rest days',
  'Beach day Monday, pool hangout Tuesday, explore Wednesday, lazy day Thursday. Baby (and you) need recovery time between activities.',
  TRUE,
  'do',
  20
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-23-022',
  'CL-23',
  'Activities',
  'Have indoor backup plans for every outdoor plan',
  'Rain, heat, unexpected meltdowns - always have a Plan B. Hotel pool, local library, baby-friendly cafe. Flexibility is the whole game.',
  FALSE,
  'do',
  21
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-24-001',
  'CL-24',
  'Instructions Sheet',
  'Write out the full daily routine with times',
  'Wake time, nap windows, meal times, bath time, bedtime. Grandparents need a minute-by-minute playbook, not vibes.',
  TRUE,
  'do',
  0
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-24-002',
  'CL-24',
  'Instructions Sheet',
  'Document feeding schedule and exact amounts',
  'Breast milk or formula amounts per bottle, solid food portions if applicable. Include how to warm bottles and what temperature baby prefers.',
  TRUE,
  'do',
  1
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-24-003',
  'CL-24',
  'Instructions Sheet',
  'Write out the full sleep routine step by step',
  'Every step matters: diaper, sleep sack, sound machine on, lights off, specific song or phrase. Skip a step and you''ll get a 1am phone call.',
  TRUE,
  'do',
  2
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-24-004',
  'CL-24',
  'Instructions Sheet',
  'Include medication instructions if any',
  'Dosage, timing, how to administer. Leave the medication in original packaging with a printed label showing the schedule.',
  FALSE,
  'do',
  3
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-24-005',
  'CL-24',
  'Instructions Sheet',
  'Print emergency contacts sheet',
  'Both parents'' numbers, pediatrician, poison control (1-800-222-1222), nearest ER address. Stick it on the fridge.',
  TRUE,
  'do',
  4
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-24-006',
  'CL-24',
  'Comfort Items',
  'Pack favorite stuffed animal or lovey',
  'The one specific comfort object baby reaches for at bedtime. If you don''t send it, nobody sleeps.',
  TRUE,
  'bring',
  5
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-24-007',
  'CL-24',
  'Comfort Items',
  'Pack sleep sack or swaddle',
  'Whatever baby sleeps in at home. Grandparents defaulting to loose blankets is the #1 safe sleep risk to address.',
  TRUE,
  'bring',
  6
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-24-008',
  'CL-24',
  'Comfort Items',
  'Send sound machine or share the app',
  'White noise is non-negotiable if baby uses it. Portable Hatch or download the same app on grandparent''s phone.',
  TRUE,
  'bring',
  7
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-24-009',
  'CL-24',
  'Comfort Items',
  'Pack pacifier if baby uses one',
  'Send at least 2 - one will disappear into couch cushions within the first hour. Include the clip if you use one.',
  FALSE,
  'bring',
  8
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-24-010',
  'CL-24',
  'Comfort Items',
  'Include a familiar blanket',
  'Not for sleeping - for floor time and comfort. A blanket that smells like home helps baby settle in an unfamiliar space.',
  FALSE,
  'bring',
  9
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-24-011',
  'CL-24',
  'Supplies to Send',
  'Pack diapers for 24+ hours',
  'Count on 8-12 diapers for an overnight. Pack 15 to be safe - running out means a grandparent guessing your diaper brand at Target.',
  TRUE,
  'bring',
  10
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-24-012',
  'CL-24',
  'Supplies to Send',
  'Pack wipes and diaper cream',
  'Full pack of wipes plus the specific diaper cream you use. Generic substitutions can cause rashes on sensitive skin.',
  TRUE,
  'bring',
  11
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-24-013',
  'CL-24',
  'Supplies to Send',
  'Pack 2 full changes of clothes plus pajamas',
  'Blowouts, spit-up, food mishaps. Two daytime outfits and one set of pajamas is the minimum for an overnight.',
  TRUE,
  'bring',
  12
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-24-014',
  'CL-24',
  'Safety Prep',
  'Review babyproofing at grandparents'' house',
  'Outlet covers, cabinet locks, gate at stairs, cords out of reach. Their house hasn''t had a baby in 25+ years - walk through it together.',
  TRUE,
  'do',
  13
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-24-015',
  'CL-24',
  'Safety Prep',
  'Check crib or pack-n-play setup',
  'Firm mattress, fitted sheet, nothing else in the crib. No bumpers, pillows, or quilts. Set it up together and verify it meets current safety standards.',
  TRUE,
  'do',
  14
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-24-016',
  'CL-24',
  'Safety Prep',
  'Discuss safe sleep rules clearly',
  'Back to sleep, nothing in the crib, room temperature 68-72°F. This conversation feels awkward but it''s the most important one you''ll have.',
  TRUE,
  'do',
  15
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-24-017',
  'CL-24',
  'Safety Prep',
  'Share car seat installation video',
  'If grandparents will be driving, install the car seat yourself or send a how-to video for their specific vehicle. 80% of car seats are installed wrong.',
  TRUE,
  'do',
  16
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-24-018',
  'CL-24',
  'Parent Prep',
  'Leave a comfort item that smells like you',
  'Worn t-shirt tucked near (not in) the crib, or a burp cloth you''ve used. Your scent is the strongest comfort signal baby has.',
  FALSE,
  'do',
  17
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-24-019',
  'CL-24',
  'Parent Prep',
  'Do a trial run with a shorter stay first',
  'Start with a 4-5 hour stretch before committing to overnight. Builds confidence for everyone - baby, grandparents, and you.',
  FALSE,
  'do',
  18
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-24-020',
  'CL-24',
  'Parent Prep',
  'Agree on photo/video update schedule and have a pickup plan',
  'Set expectations: one update at bedtime, one in the morning. And agree on the threshold for calling you to come get baby - better to have the plan and not need it.',
  TRUE,
  'do',
  19
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-25-001',
  'CL-25',
  'Planning',
  'Set a realistic budget and stick to it',
  'First birthdays can spiral fast. Set a number - $200, $500, whatever works - and make every decision against it. Baby won''t remember any of this.',
  TRUE,
  'do',
  0
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-25-002',
  'CL-25',
  'Planning',
  'Choose venue: home, park, or rented space',
  'Home is cheapest and easiest for nap time. Parks are great but have no climate control. Rented venues mean no cleanup but higher cost.',
  TRUE,
  'do',
  1
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-25-003',
  'CL-25',
  'Planning',
  'Pick a date 4-6 weeks out',
  'Doesn''t have to be the exact birthday. Pick a weekend that works for key family members and gives you time to plan without stress.',
  TRUE,
  'do',
  2
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-25-004',
  'CL-25',
  'Planning',
  'Create the guest list',
  'Keep it manageable - 15-20 guests is the sweet spot. More people means more stimulation for baby and more logistics for you.',
  TRUE,
  'do',
  3
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-25-005',
  'CL-25',
  'Planning',
  'Send invites at least 3 weeks ahead',
  'Digital invites are fine. Include start time, end time (critical), address, and any allergy info you need from guests with kids.',
  TRUE,
  'do',
  4
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-25-006',
  'CL-25',
  'Food & Cake',
  'Order a separate smash cake',
  'Small 4-6 inch cake just for baby. Get it in a flavor baby has already tried - not the time to discover a new food allergy on camera.',
  TRUE,
  'do',
  5
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-25-007',
  'CL-25',
  'Food & Cake',
  'Plan an allergen-safe menu for babies',
  'If other babies are attending, avoid common allergens or clearly label everything. Ask parents about allergies on the invite.',
  TRUE,
  'do',
  6
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-25-008',
  'CL-25',
  'Food & Cake',
  'Prepare finger foods for toddlers',
  'Cut fruit, cheese cubes, puffs, soft crackers. Everything bite-sized, nothing round and hard. Think grab-and-go, not sit-down meal.',
  TRUE,
  'do',
  7
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-25-009',
  'CL-25',
  'Food & Cake',
  'Plan adult food and drinks',
  'Adults need to eat too. Pizza, sandwiches, or a simple taco bar. Easy to serve, easy to eat one-handed while holding a baby.',
  TRUE,
  'do',
  8
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-25-010',
  'CL-25',
  'Food & Cake',
  'Confirm allergy info from all parents attending',
  'Follow up on your invite RSVP. One missed peanut allergy can turn a birthday party into an ER visit.',
  TRUE,
  'do',
  9
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-25-011',
  'CL-25',
  'Decorations',
  'Get a high chair birthday banner',
  'Simple, photogenic, and keeps baby''s area festive. Attach it securely - baby will try to eat it.',
  FALSE,
  'do',
  10
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-25-012',
  'CL-25',
  'Decorations',
  'Get a "1" balloon or number display',
  'Great photo prop and instant party atmosphere. Mylar lasts longer than latex and is less of a choking hazard when it pops.',
  FALSE,
  'do',
  11
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-25-013',
  'CL-25',
  'Decorations',
  'Create a monthly milestone photo display',
  'Print one photo from each month. String them up with mini clothespins. Guests love it and it hits you right in the feelings.',
  FALSE,
  'do',
  12
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-25-014',
  'CL-25',
  'Decorations',
  'Keep all decorations out of baby''s reach',
  'Balloons, streamers, confetti - all choking hazards. Hang everything high and skip confetti entirely. Not worth the risk or the cleanup.',
  TRUE,
  'do',
  13
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-25-015',
  'CL-25',
  'Activities',
  'Set up a photo station with props',
  'Simple backdrop, a few props (party hat, the "1" sign), good lighting. You''ll use these photos for years.',
  FALSE,
  'do',
  14
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-25-016',
  'CL-25',
  'Activities',
  'Plan the party around baby''s nap schedule',
  'An overtired birthday baby is a crying birthday baby. Schedule the party during baby''s best awake window - usually late morning or mid-afternoon.',
  TRUE,
  'do',
  15
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-25-017',
  'CL-25',
  'Activities',
  'Designate a quiet room for overwhelmed babies',
  'Noise, strangers, stimulation overload. Have a calm space with a white noise machine where any baby can decompress.',
  TRUE,
  'do',
  16
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-25-018',
  'CL-25',
  'Activities',
  'Keep the party under 2 hours',
  '90 minutes is perfect. Two hours is the max. After that, baby is done and adults are ready to leave. End on a high note.',
  TRUE,
  'do',
  17
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-25-019',
  'CL-25',
  'Capture the Day',
  'Charge all cameras and phones the night before',
  'Dead battery during cake smash is a pain you don''t recover from. Charge everything, clear storage space, and have backup power banks.',
  TRUE,
  'do',
  18
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-25-020',
  'CL-25',
  'Capture the Day',
  'Assign someone to take candid photos',
  'You''ll be hosting, not photographing. Ask a friend or family member to be the unofficial photographer so you can actually be present.',
  TRUE,
  'do',
  19
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-25-021',
  'CL-25',
  'Capture the Day',
  'Capture the cake smash on video',
  'Set up a tripod or prop your phone before cake time. You want both hands free and a stable shot. This is the money moment.',
  TRUE,
  'do',
  20
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-25-022',
  'CL-25',
  'Capture the Day',
  'Get the group photo early, before meltdowns',
  'First 30 minutes when everyone''s fresh. After cake, half the kids will be crying and half the adults will be covered in frosting.',
  FALSE,
  'do',
  21
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-26-001',
  'CL-26',
  'Research',
  'Check your insurance network first',
  'The best pediatrician in town is useless if they''re out-of-network. Start by filtering your insurance provider''s directory for in-network options.',
  TRUE,
  'do',
  0
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-26-002',
  'CL-26',
  'Research',
  'Read online reviews but weigh them carefully',
  'Google, Healthgrades, and Zocdoc reviews give you a vibe check. Look for patterns (always running late, great with anxious parents) rather than one-off complaints.',
  FALSE,
  'do',
  1
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-26-003',
  'CL-26',
  'Research',
  'Ask friends and family for recommendations',
  'Parents in your area with kids are your best resource. They''ll tell you things no review will - how the office handles a screaming 2-year-old at 5pm on a Friday.',
  FALSE,
  'do',
  2
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-26-004',
  'CL-26',
  'Research',
  'Verify board certification',
  'Check the American Board of Pediatrics website. Board-certified means they passed rigorous exams and maintain continuing education. Non-negotiable.',
  TRUE,
  'do',
  3
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-26-005',
  'CL-26',
  'Research',
  'Check office location and hours',
  'A 45-minute drive with a sick baby at 7am is brutal. Prioritize proximity and look for offices with early morning, evening, or weekend hours.',
  TRUE,
  'do',
  4
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-26-006',
  'CL-26',
  'Interview Questions',
  'Ask about the after-hours protocol',
  'Babies get sick at 2am, not during business hours. Find out if they have a nurse line, on-call doctor, or partner with an urgent care.',
  TRUE,
  'do',
  5
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-26-007',
  'CL-26',
  'Interview Questions',
  'Ask who covers when the doctor is out',
  'Solo practitioners take vacations. Multi-doctor practices mean you''ll see someone different sometimes. Know the backup plan before you need it.',
  TRUE,
  'do',
  6
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-26-008',
  'CL-26',
  'Interview Questions',
  'Discuss their vaccination philosophy',
  'You want a doctor who follows the AAP/CDC schedule and can clearly explain why. If their answer is vague or wishy-washy, keep looking.',
  TRUE,
  'do',
  7
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-26-009',
  'CL-26',
  'Interview Questions',
  'Ask how they handle urgent phone calls',
  'Can you call with a quick question, or does everything require an appointment? The difference matters at midnight with a 103°F fever.',
  TRUE,
  'do',
  8
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-26-010',
  'CL-26',
  'Interview Questions',
  'Ask about average wait times',
  '15-20 minutes is normal. If they''re consistently 45+ minutes behind, that''s a practice management issue that won''t improve with your baby screaming in the waiting room.',
  FALSE,
  'do',
  9
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-26-011',
  'CL-26',
  'Office Tour',
  'Observe general cleanliness of the office',
  'Clean floors, sanitized toys (or no shared toys), wiped-down surfaces. Your newborn''s immune system is brand new - the office should reflect that.',
  TRUE,
  'do',
  10
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-26-012',
  'CL-26',
  'Office Tour',
  'Check for separate sick and well-child waiting areas',
  'You don''t want your healthy newborn sitting next to a kid with the flu during a routine checkup. Separate areas or staggered scheduling is a green flag.',
  TRUE,
  'do',
  11
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-26-013',
  'CL-26',
  'Office Tour',
  'Evaluate staff friendliness and responsiveness',
  'The front desk sets the tone. If they''re dismissive or rushed during your visit, imagine calling them panicked about a rash at 4pm.',
  TRUE,
  'do',
  12
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-26-014',
  'CL-26',
  'Office Tour',
  'Check appointment availability and booking ease',
  'Can you book online? How far out are well-visits booked? Can they fit in a same-day sick visit? Accessibility matters more than aesthetics.',
  TRUE,
  'do',
  13
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-26-015',
  'CL-26',
  'Office Tour',
  'Evaluate parking and accessibility',
  'Carrying a car seat, diaper bag, and stroller into a building with no parking and no elevator is a nightmare. Drive the route and test the parking situation.',
  FALSE,
  'do',
  14
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-26-016',
  'CL-26',
  'Logistics',
  'Confirm same-day sick appointments are available',
  'This is the single most important logistical question. If you can''t get a same-day sick visit, you''ll end up in urgent care or the ER instead.',
  TRUE,
  'do',
  15
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-26-017',
  'CL-26',
  'Logistics',
  'Ask if lab work is done on-site or by referral',
  'On-site labs mean one trip instead of two. Dragging a sick baby to a separate lab is an extra hour nobody has.',
  FALSE,
  'do',
  16
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-26-018',
  'CL-26',
  'Logistics',
  'Check for a patient portal for messaging',
  'Secure messaging for non-urgent questions saves phone calls and wait times. Photo uploads for rashes are a game changer.',
  FALSE,
  'do',
  17
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-26-019',
  'CL-26',
  'Logistics',
  'Confirm newborn visit within 48 hours of hospital discharge',
  'Most pediatricians want to see your baby 1-2 days after discharge. Confirm they can schedule this before you commit - it''s your first real appointment.',
  TRUE,
  'do',
  18
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-26-020',
  'CL-26',
  'Decision Factors',
  'Trust your gut feeling after the visit',
  'Credentials and logistics matter, but so does the feeling you get. Did the doctor listen? Did you feel heard? Your instinct is data too.',
  TRUE,
  'do',
  19
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-27-001',
  'CL-27',
  'Choosing a Class',
  'Research age-appropriate options',
  'Parent-baby swim starts at 6 months, music classes at 3 months, baby gym at 6 months. Match the class to your baby''s developmental stage, not your ambition.',
  TRUE,
  'do',
  0
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-27-002',
  'CL-27',
  'Choosing a Class',
  'Check instructor certifications',
  'Infant swim instructors should have ISR or equivalent certification. Music teachers should have early childhood training. Credentials matter when your baby is involved.',
  TRUE,
  'do',
  1
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-27-003',
  'CL-27',
  'Choosing a Class',
  'Read parent reviews for the specific class',
  'Not the facility - the specific class and instructor. A great gym can have a terrible baby class. Ask in local parent groups for honest feedback.',
  FALSE,
  'do',
  2
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-27-004',
  'CL-27',
  'Choosing a Class',
  'Try a free trial class before committing',
  'Most places offer a free or discounted first class. Never pay for a 10-week session without testing it. Baby might hate it and that''s OK.',
  TRUE,
  'do',
  3
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-27-005',
  'CL-27',
  'What to Bring',
  'Pack swim diaper and regular diaper for swim class',
  'Swim diaper goes on in the pool, regular diaper for before and after. Bring two of each because one blowout changes everything.',
  TRUE,
  'bring',
  4
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-27-006',
  'CL-27',
  'What to Bring',
  'Bring a full change of clothes',
  'Wet, messy, or just a surprise blowout. You''ll need a complete outfit including socks. Pack it even for a music class.',
  TRUE,
  'bring',
  5
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-27-007',
  'CL-27',
  'What to Bring',
  'Pack a snack and water',
  'Post-activity hunger is real. Puffs, a pouch, or crackers and a sippy cup. Fed baby equals happy car ride home.',
  TRUE,
  'bring',
  6
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-27-008',
  'CL-27',
  'What to Bring',
  'Bring a towel for swim or messy classes',
  'Hooded baby towels are ideal. Facility towels are rough and never warm enough. Your own towel is a comfort signal for baby.',
  FALSE,
  'bring',
  7
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-27-009',
  'CL-27',
  'What to Bring',
  'Apply sunscreen if the class is outdoors',
  'SPF 50, broad spectrum, applied 15 minutes before class. For babies under 6 months, shade and clothing are better than sunscreen - check with your pediatrician.',
  FALSE,
  'do',
  8
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-27-010',
  'CL-27',
  'Before Class',
  'Feed baby 30 minutes before class',
  'Not too full, not hungry. A full stomach in a swim class leads to spit-up. A hungry baby in a music class leads to screaming through every song.',
  TRUE,
  'do',
  9
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-27-011',
  'CL-27',
  'Before Class',
  'Pack the diaper bag the night before',
  'Morning scramble plus class prep equals forgetting something essential. Pack everything the night before and do a 30-second check before you leave.',
  FALSE,
  'do',
  10
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-27-012',
  'CL-27',
  'Before Class',
  'Arrive 10 minutes early for the first class',
  'Paperwork, waivers, finding the room, getting baby changed. Rushing in late with a baby is maximum stress. Early is on time.',
  TRUE,
  'do',
  11
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-27-013',
  'CL-27',
  'Before Class',
  'Dress baby in easy-on/off clothes',
  'Snaps beat zippers, onesies beat full outfits. You''ll be changing in a locker room or a corner in approximately 90 seconds.',
  FALSE,
  'do',
  12
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-27-014',
  'CL-27',
  'During Class',
  'Follow baby''s lead, not the class schedule',
  'If baby wants to watch instead of participate, that''s OK. If they need a break, take one. Learning happens through observation too.',
  TRUE,
  'do',
  13
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-27-015',
  'CL-27',
  'During Class',
  'It''s OK to step out if baby is overwhelmed',
  'New sounds, new people, new environment - it''s a lot. Step out, calm down, try again. No instructor worth their certification will judge you.',
  TRUE,
  'do',
  14
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-27-016',
  'CL-27',
  'During Class',
  'Don''t compare your baby to other kids',
  'The baby doing perfect kicks started 6 months ago. Yours is exactly where they should be. Comparison steals the joy from every activity class.',
  TRUE,
  'do',
  15
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-27-017',
  'CL-27',
  'After Class',
  'Offer a snack or feed immediately after',
  'Activity burns energy. Baby will be hungry and possibly overtired. Feed first, then head home for a nap.',
  TRUE,
  'do',
  16
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-27-018',
  'CL-27',
  'After Class',
  'Give it 3 sessions before deciding if baby enjoys it',
  'First class is sensory overload. Second class is adjustment. Third class is the real test. Don''t quit after one bad experience.',
  TRUE,
  'do',
  17
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-28-001',
  'CL-28',
  'Monthly Photos',
  'Buy milestone cards or a milestone blanket',
  'Monthly number cards or a blanket with months printed on it. Pick one style and stick with it for consistency across all 12 months.',
  TRUE,
  'do',
  0
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-28-002',
  'CL-28',
  'Monthly Photos',
  'Use the same spot and time of day each month',
  'Same chair, same blanket, same window light. The consistency is what makes the 12-month comparison photo hit. Natural light near a window works best.',
  TRUE,
  'do',
  1
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-28-003',
  'CL-28',
  'Monthly Photos',
  'Include a size reference item in every photo',
  'Same stuffed animal, same pillow, or same parent''s hands. It shows how much baby has grown in a way numbers can''t capture.',
  FALSE,
  'do',
  2
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-28-004',
  'CL-28',
  'Monthly Photos',
  'Take the photo on the actual monthly date',
  'Born on the 15th? Photo on the 15th of every month. Set a recurring calendar reminder or you''ll be 3 days late by month 4.',
  TRUE,
  'do',
  3
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-28-005',
  'CL-28',
  'Monthly Photos',
  'Shoot in natural light near a window',
  'No flash, no overhead lighting. Position baby facing a window for soft, even light. Morning light is usually the most flattering.',
  FALSE,
  'do',
  4
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-28-006',
  'CL-28',
  'Daily Captures',
  'Photograph the mundane moments',
  'Tiny socks on the counter, the bottle warmer at 3am, sleeping on dad''s chest. These boring moments become the most precious photos in 5 years.',
  TRUE,
  'do',
  5
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-28-007',
  'CL-28',
  'Daily Captures',
  'Set up automatic cloud backup for photos',
  'iCloud, Google Photos, or Amazon Photos - pick one and enable auto-upload. A dropped phone in month 8 shouldn''t erase months 1-7.',
  TRUE,
  'do',
  6
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-28-008',
  'CL-28',
  'Daily Captures',
  'Create a shared album with your partner',
  'Shared Google Photos album or iCloud shared library. Both parents capture moments - combine them so neither misses the other''s perspective.',
  TRUE,
  'do',
  7
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-28-009',
  'CL-28',
  'Milestone Tracking',
  'Capture first smile on camera',
  'Usually happens around 6-8 weeks. Keep your phone ready during alert, happy times. The first real smile (not gas) changes everything.',
  TRUE,
  'do',
  8
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-28-010',
  'CL-28',
  'Milestone Tracking',
  'Record first laugh on video',
  'Typically around 3-4 months. Video, not photo - you want the sound. You''ll replay this clip hundreds of times.',
  TRUE,
  'do',
  9
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-28-011',
  'CL-28',
  'Milestone Tracking',
  'Document first roll, first solid food, and first steps with date',
  'Write the date on your phone immediately or text it to yourself. Memory is unreliable - by month 9 you won''t remember if the first roll was month 4 or 5.',
  TRUE,
  'do',
  10
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-28-012',
  'CL-28',
  'Memory Book',
  'Choose a physical or digital baby book',
  'Physical books (Mushie, Promptly) feel special but require effort. Digital apps (Tinybeans, Qeepsake) are easier to maintain. Pick whichever you''ll actually use.',
  TRUE,
  'do',
  11
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-28-013',
  'CL-28',
  'Memory Book',
  'Save the hospital bracelet and hat',
  'Those tiny hospital ID bracelets and the first knit hat are irreplaceable keepsakes. Stick them in a ziplock bag immediately - they disappear into laundry piles fast.',
  TRUE,
  'do',
  12
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-28-014',
  'CL-28',
  'Memory Book',
  'Keep baby''s first outfit or going-home outfit',
  'Wash it, fold it, and store it in an airtight bag. In 20 years you''ll hold it and not believe a human that small existed.',
  FALSE,
  'do',
  13
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-28-015',
  'CL-28',
  'Memory Book',
  'Press one flower from baby''s birth month',
  'Buy or pick a flower from the month baby was born. Press it in a heavy book for 2 weeks. A small, beautiful keepsake that costs almost nothing.',
  FALSE,
  'do',
  14
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-28-016',
  'CL-28',
  'Organization',
  'Create monthly photo folders on your phone or computer',
  'Month 1, Month 2, etc. Move photos weekly or you''ll have 3,000 unsorted photos by the first birthday and zero motivation to organize them.',
  TRUE,
  'do',
  15
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-28-017',
  'CL-28',
  'Organization',
  'Back up photos to two separate locations',
  'Cloud + external hard drive, or two different cloud services. One backup is zero backup. The 3-2-1 rule applies to baby photos too.',
  TRUE,
  'do',
  16
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-28-018',
  'CL-28',
  'Organization',
  'Print your favorite photos quarterly',
  'Pick 10-15 favorites every 3 months and print them. Digital photos stay on phones - printed photos go on walls and into grandparents'' hands.',
  FALSE,
  'do',
  17
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-28-019',
  'CL-28',
  'Keepsakes',
  'Get a hand and footprint kit',
  'Ink pad or clay impression kit. Do it in the first week when hands and feet are impossibly tiny. The clay kits from Amazon work fine - don''t overpay.',
  TRUE,
  'do',
  18
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-28-020',
  'CL-28',
  'Keepsakes',
  'Save a lock from baby''s first haircut',
  'Put it in a small envelope or locket. Label it with the date. First haircuts happen around 12-18 months for most babies.',
  FALSE,
  'do',
  19
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-29-001',
  'CL-29',
  'Training',
  'Find an AHA or Red Cross infant CPR class',
  'Search redcross.org or heart.org for classes near you. In-person beats online - you need to feel the compression depth on a mannequin to get it right.',
  TRUE,
  'do',
  0
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-29-002',
  'CL-29',
  'Training',
  'Both parents attend the class together',
  'Both of you need the muscle memory. If one parent is with baby and something happens, there''s no time to call the other one for instructions.',
  TRUE,
  'do',
  1
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-29-003',
  'CL-29',
  'Training',
  'Practice compressions and rescue breaths on an infant mannequin',
  'Two fingers, 1.5 inches deep, 100-120 compressions per minute. It feels aggressive on something that small. That''s normal - practice until it''s automatic.',
  TRUE,
  'do',
  2
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-29-004',
  'CL-29',
  'Training',
  'Learn the Heimlich maneuver for infants',
  '5 back blows, 5 chest thrusts, check the mouth, repeat. Different from adult Heimlich - never do abdominal thrusts on an infant under 1 year.',
  TRUE,
  'do',
  3
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-29-005',
  'CL-29',
  'Training',
  'Plan to refresh your training annually',
  'Set a calendar reminder for 12 months out. Skills degrade fast without practice. A 1-hour refresher course can save a life.',
  TRUE,
  'do',
  4
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-29-006',
  'CL-29',
  'First Aid Kit',
  'Get an infant thermometer (rectal is most accurate)',
  'Rectal temperature is the gold standard for babies under 3 months. Forehead and ear thermometers are convenient but less accurate when precision matters most.',
  TRUE,
  'do',
  5
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-29-007',
  'CL-29',
  'First Aid Kit',
  'Stock infant acetaminophen (Tylenol)',
  'Safe for babies 2+ months. Know the weight-based dosing before you need it - check with your pediatrician for your baby''s specific dose.',
  TRUE,
  'do',
  6
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-29-008',
  'CL-29',
  'First Aid Kit',
  'Stock infant ibuprofen for 6 months and older',
  'Motrin or Advil infant drops. NOT for babies under 6 months. Keep both acetaminophen and ibuprofen so you can alternate if needed during high fevers.',
  TRUE,
  'do',
  7
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-29-009',
  'CL-29',
  'First Aid Kit',
  'Get a nasal aspirator and saline drops',
  'NoseFrida or bulb syringe plus saline drops. Babies can''t blow their noses - you''ll use this weekly during cold season. Two drops of saline, wait 30 seconds, then suction.',
  TRUE,
  'do',
  8
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-29-010',
  'CL-29',
  'First Aid Kit',
  'Stock bandages and antibiotic ointment',
  'Assorted adhesive bandages, gauze pads, medical tape, and Neosporin or Bacitracin. Minor cuts and scrapes start happening as soon as baby is mobile.',
  TRUE,
  'do',
  9
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-29-011',
  'CL-29',
  'Emergency Numbers',
  'Save pediatrician''s after-hours line in your phone',
  'Program it as a contact now, not when you''re panicked at 2am trying to remember the office number. Label it clearly: ''Dr. Smith After Hours.''',
  TRUE,
  'do',
  10
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-29-012',
  'CL-29',
  'Emergency Numbers',
  'Save Poison Control: 1-800-222-1222',
  'Save it in both parents'' phones right now. When baby eats something they shouldn''t (and they will), you need this number in 10 seconds, not 10 minutes.',
  TRUE,
  'do',
  11
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-29-013',
  'CL-29',
  'Emergency Numbers',
  'Save the nearest ER address in your phone''s maps',
  'Star it in Google Maps or Apple Maps as a favorite. Know the fastest route from your house. Practice the drive so it''s automatic when adrenaline takes over.',
  TRUE,
  'do',
  12
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-29-014',
  'CL-29',
  'Emergency Numbers',
  'Identify a trusted neighbor for emergencies',
  'Someone within 5 minutes who can come watch your other kids or meet you at the house. Exchange keys and phone numbers. Community is the real safety net.',
  FALSE,
  'do',
  13
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-29-015',
  'CL-29',
  'Choking Prevention',
  'Learn which foods are choking hazards',
  'Grapes, hot dogs, popcorn, raw carrots, peanut butter by the spoonful. The AAP has a full list. Print it and tape it to the inside of a kitchen cabinet.',
  TRUE,
  'do',
  14
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-29-016',
  'CL-29',
  'Choking Prevention',
  'Always cut grapes and hot dogs lengthwise',
  'Quarter grapes and cut hot dogs lengthwise, then into small pieces. Round shapes are the exact size and shape of a baby''s airway. This is the #1 choking food.',
  TRUE,
  'do',
  15
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-29-017',
  'CL-29',
  'Choking Prevention',
  'No popcorn, whole nuts, or hard candy under age 4',
  'These are firm choking hazards that can''t be crushed by baby teeth. It''s not being paranoid - it''s being informed. The ER sees these cases every week.',
  TRUE,
  'do',
  16
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-29-018',
  'CL-29',
  'Choking Prevention',
  'Always supervise eating and know gagging vs. choking',
  'Gagging is loud with coughing - baby is handling it. Choking is silent with no airflow. If baby is coughing, let them work it out. Silent and red? That''s when you act.',
  TRUE,
  'do',
  17
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-29-019',
  'CL-29',
  'When to Call 911',
  'Know the signs that require calling 911 immediately',
  'Difficulty breathing, lips turning blue, unresponsive, seizure, severe allergic reaction (swelling, hives, trouble breathing), or fall from significant height. Don''t hesitate - call first, assess second.',
  TRUE,
  'do',
  18
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-29-020',
  'CL-29',
  'Home Safety',
  'Learn how to take baby''s temperature correctly',
  'Rectal for under 3 months (lubricate tip, insert 1/2 inch). Armpit works for a quick check on older babies. Know the method before the 2am fever arrives.',
  TRUE,
  'do',
  19
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-29-021',
  'CL-29',
  'Home Safety',
  'Know normal temperature ranges and fever thresholds',
  'Normal: 97.8-100.4°F. For babies under 3 months, 100.4°F or higher is an ER visit - no exceptions. For older babies, call the pediatrician at 101°F+.',
  TRUE,
  'do',
  20
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-29-022',
  'CL-29',
  'Home Safety',
  'Recognize signs of dehydration in infants',
  'Fewer than 6 wet diapers in 24 hours, no tears when crying, sunken fontanelle (soft spot), dry mouth. Dehydration in babies escalates fast - call the pediatrician immediately.',
  TRUE,
  'do',
  21
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-30-001',
  'CL-30',
  'Life Insurance',
  'Calculate coverage needed: 10-12x your annual income',
  'If you make $80k, you need $800k-$960k in coverage. Factor in mortgage payoff, childcare costs for 18 years, and your partner''s lost income if they stop working.',
  TRUE,
  'do',
  0
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-30-002',
  'CL-30',
  'Life Insurance',
  'Compare term life vs. whole life insurance',
  'Term life is cheaper and covers you for 20-30 years - the period your family most needs it. Whole life is more expensive and rarely the right call for young parents. Start with term.',
  TRUE,
  'do',
  1
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-30-003',
  'CL-30',
  'Life Insurance',
  'Get quotes from at least 3 providers',
  'Policygenius, Haven Life, and Ladder are good starting points for online quotes. Rates vary wildly - a 30-year-old non-smoker can get $500k term for $20-30/month.',
  TRUE,
  'do',
  2
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-30-004',
  'CL-30',
  'Life Insurance',
  'Both parents need coverage, not just the breadwinner',
  'If the stay-at-home parent dies, the cost of full-time childcare, cooking, cleaning, and household management is $40-60k/year. Both lives have financial value.',
  TRUE,
  'do',
  3
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-30-005',
  'CL-30',
  'Life Insurance',
  'Name your beneficiary correctly',
  'Spouse as primary, with a contingent beneficiary (usually a trust for the child). Never name a minor as a direct beneficiary - the court will appoint a guardian for the money.',
  TRUE,
  'do',
  4
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-30-006',
  'CL-30',
  'Will & Trust',
  'Draft or update your will',
  'An online will through Trust & Will or LegalZoom costs $150-300. It''s not romantic, but dying without one means a judge decides who raises your kid.',
  TRUE,
  'do',
  5
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-30-007',
  'CL-30',
  'Will & Trust',
  'Name a legal guardian for your baby',
  'The hardest conversation you''ll have. Pick someone who shares your values, has the capacity, and has agreed to the responsibility. Have the conversation before you write it down.',
  TRUE,
  'do',
  6
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-30-008',
  'CL-30',
  'Will & Trust',
  'Name a backup guardian',
  'If your first choice can''t serve, the court needs a Plan B that you chose. Without one, a judge picks based on whatever petition comes first.',
  TRUE,
  'do',
  7
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-30-009',
  'CL-30',
  'Will & Trust',
  'Consider setting up a living trust',
  'A trust avoids probate and gives you more control over how money is managed for your child. Worth the $500-1500 cost, especially if you own property.',
  FALSE,
  'do',
  8
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-30-010',
  'CL-30',
  'Will & Trust',
  'Store legal documents securely and tell someone where',
  'Fireproof safe at home or safe deposit box. Your executor needs to know where to find the will. A will nobody can find is the same as no will at all.',
  TRUE,
  'do',
  9
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-30-011',
  'CL-30',
  'Beneficiary Updates',
  'Update 401k and IRA beneficiaries',
  'Log into your retirement accounts and update beneficiary designations. These override your will - if your ex is still listed, they get the money regardless of what the will says.',
  TRUE,
  'do',
  10
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-30-012',
  'CL-30',
  'Beneficiary Updates',
  'Update bank account beneficiaries',
  'Add payable-on-death (POD) designations to checking and savings accounts. Takes 10 minutes at the bank and ensures money transfers instantly without probate.',
  TRUE,
  'do',
  11
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-30-013',
  'CL-30',
  'Beneficiary Updates',
  'Review and update existing life insurance beneficiaries',
  'If you had a policy before baby, the beneficiary might be outdated. Log in and verify. This takes 5 minutes and prevents months of legal headaches.',
  TRUE,
  'do',
  12
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-30-014',
  'CL-30',
  'Important Documents',
  'Plan for birth certificate storage',
  'You''ll receive the birth certificate 2-6 weeks after birth. Order 2-3 certified copies - you''ll need them for insurance, passport, and school enrollment.',
  TRUE,
  'do',
  13
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-30-015',
  'CL-30',
  'Important Documents',
  'Plan for Social Security card application',
  'Apply at the hospital when you fill out birth certificate paperwork. Card arrives by mail in 2-4 weeks. You''ll need the SSN to add baby to insurance and open a 529.',
  TRUE,
  'do',
  14
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-30-016',
  'CL-30',
  'Important Documents',
  'Add baby to health insurance within 30 days of birth',
  'This is a hard deadline - most insurers give you 30 days from birth to add a dependent. Miss it and you wait until open enrollment. Call HR on day 1.',
  TRUE,
  'do',
  15
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-30-017',
  'CL-30',
  'Important Documents',
  'Update your tax withholding (W-4)',
  'New dependent = lower tax withholding. Submit an updated W-4 to HR to increase your take-home pay. You''ll also get the Child Tax Credit ($2,000/year) at tax time.',
  TRUE,
  'do',
  16
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-30-018',
  'CL-30',
  'Financial Planning',
  'Open a 529 college savings account',
  'Tax-advantaged education savings. Even $25/month adds up over 18 years. Most states offer a tax deduction for contributions. Start early - compound interest is your best friend.',
  FALSE,
  'do',
  17
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-30-019',
  'CL-30',
  'Financial Planning',
  'Review your disability insurance coverage',
  'If you can''t work due to injury or illness, disability insurance replaces 60-70% of your income. Check your employer benefits - most people are underinsured and don''t know it.',
  TRUE,
  'do',
  18
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-30-020',
  'CL-30',
  'Financial Planning',
  'Update your emergency fund target to 6 months of expenses',
  'Baby increases monthly expenses by $500-1500. Recalculate 6 months of expenses with the new number. This fund is the difference between a tough month and a crisis.',
  TRUE,
  'do',
  19
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-31-001',
  'CL-31',
  'Company Policy',
  'Confirm your paternity leave duration and pay',
  'Check your employee handbook or ask HR directly. Some companies offer 2 weeks paid, some offer 12+ weeks. Know exactly how many days you get and at what pay percentage.',
  TRUE,
  'do',
  0
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-31-002',
  'CL-31',
  'Company Policy',
  'Understand FMLA eligibility requirements',
  'FMLA gives you 12 weeks unpaid (job-protected) if you''ve worked 12+ months and 1,250+ hours at a company with 50+ employees. Know your eligibility before you plan.',
  TRUE,
  'do',
  1
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-31-003',
  'CL-31',
  'Company Policy',
  'Check state-specific paid family leave laws',
  'California, New York, New Jersey, Washington, and others have state-paid leave programs. Some stack on top of employer benefits. Google ''[your state] paid family leave'' now.',
  TRUE,
  'do',
  2
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-31-004',
  'CL-31',
  'Company Policy',
  'Review short-term disability options if applicable',
  'Some employers offer STD that covers bonding time. Check if it applies to non-birthing parents. It''s often overlooked free money sitting in your benefits package.',
  FALSE,
  'do',
  3
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-31-005',
  'CL-31',
  'Work Prep',
  'Document all ongoing projects with status and next steps',
  'For every project you own, write a one-page summary: current status, next milestone, blockers, and who to contact. Your brain will be mush after day 3 of no sleep.',
  TRUE,
  'do',
  4
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-31-006',
  'CL-31',
  'Work Prep',
  'Create handoff documents for each project',
  'Name the person covering each project, walk them through it, and give them everything they need to succeed. A good handoff means fewer calls during your leave.',
  TRUE,
  'do',
  5
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-31-007',
  'CL-31',
  'Work Prep',
  'Set up auto-responders on email and Slack',
  'Draft your out-of-office now so it''s ready to flip on. Include who to contact for urgent issues, your return date, and a clear statement that you won''t be checking messages.',
  TRUE,
  'do',
  6
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-31-008',
  'CL-31',
  'Work Prep',
  'Brief your backup person or cover',
  'Don''t just send a doc - sit down (or call) and walk them through everything. Answer their questions now so they don''t need to call you at 2am during a feeding.',
  TRUE,
  'do',
  7
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-31-009',
  'CL-31',
  'Timing Strategy',
  'Discuss your start date with your manager 6+ weeks before the due date',
  'Give your manager time to plan coverage. Be direct: ''Baby is due [date], I plan to start leave on [date], and here''s my transition plan.'' Proactive beats reactive.',
  TRUE,
  'do',
  8
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-31-010',
  'CL-31',
  'Timing Strategy',
  'Plan for early arrival - babies don''t check calendars',
  '10-15% of babies arrive before the due date. Have your handoff docs ready by week 36 at the latest. If baby comes early, you don''t get a planning grace period.',
  TRUE,
  'do',
  9
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-31-011',
  'CL-31',
  'Timing Strategy',
  'Consider splitting leave if your company allows it',
  'Some dads take 2 weeks at birth and save the rest for when partner returns to work. Splitting covers two critical transition periods instead of one.',
  FALSE,
  'do',
  10
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-31-012',
  'CL-31',
  'Timing Strategy',
  'Coordinate your leave with your partner''s leave',
  'Overlapping leave in the first 2 weeks is essential - you both need to learn together. Then stagger remaining leave to extend total coverage before childcare starts.',
  TRUE,
  'do',
  11
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-31-013',
  'CL-31',
  'During Leave',
  'Set firm boundaries on work contact',
  'Tell your team: ''I''m unreachable unless the building is on fire.'' Every Slack message you answer trains them to keep messaging. Boundaries are a skill, not a perk.',
  TRUE,
  'do',
  12
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-31-014',
  'CL-31',
  'During Leave',
  'Designate one check-in per week maximum if needed',
  'If you absolutely must stay connected, one 15-minute call per week with your manager. Not daily emails, not ''just a quick question'' Slacks. One call, scheduled, boundaried.',
  FALSE,
  'do',
  13
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-31-015',
  'CL-31',
  'During Leave',
  'Turn on out-of-office on all platforms',
  'Email, Slack, Teams, Notion, whatever your company uses. Set it on every single platform. One missed out-of-office status and people think you''re available.',
  TRUE,
  'do',
  14
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-31-016',
  'CL-31',
  'During Leave',
  'Don''t feel guilty about being offline',
  'Your company existed before you and will exist while you''re out. The baby who needs you right now won''t be this small ever again. This is the job right now.',
  TRUE,
  'do',
  15
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-31-017',
  'CL-31',
  'Return Plan',
  'Schedule a gradual return if your company allows it',
  'Half days for the first week, or 3 days the first week then full the second. Going from 24/7 baby mode to full work mode in one day is brutal on everyone.',
  FALSE,
  'do',
  16
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-31-018',
  'CL-31',
  'Return Plan',
  'Arrange childcare before your return date',
  'Daycare waitlists can be 6-12 months long. If you''re using daycare, get on the list during pregnancy. If it''s family, confirm the schedule weeks ahead.',
  TRUE,
  'do',
  17
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-31-019',
  'CL-31',
  'Return Plan',
  'Plan a first-week-back buffer with lighter workload',
  'Block your first week''s calendar with ''transition'' time. No major meetings, no deadlines. You''ll need time to catch up on what happened while you were out.',
  TRUE,
  'do',
  18
) ON CONFLICT (item_id) DO NOTHING;

INSERT INTO checklist_item_templates (item_id, checklist_id, category, item, details, required, bring_or_do, sort_order)
VALUES (
  'CL-31-020',
  'CL-31',
  'Return Plan',
  'Discuss flexible schedule options and update emergency contacts',
  'Ask about remote days, adjusted hours, or compressed work weeks. Also update HR with your new emergency contacts and any changes to your benefits. One conversation covers both.',
  TRUE,
  'do',
  19
) ON CONFLICT (item_id) DO NOTHING;

