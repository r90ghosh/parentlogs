-- Task Templates Seed Data
-- Generated: 2025-12-30T17:43:56.343Z
-- Source: content/tasks.json

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'PREG-W10-001',
  'Verify Prenatal Insurance',
  'Call insurer to confirm coverage details for prenatal visits, ultrasounds, and delivery. Ask about deductible and out-of-pocket maximums.',
  'pregnancy',
  -210,
  'dad',
  'admin',
  'must-do',
  FALSE,
  0
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'PREG-W12-001',
  'Schedule Nuchal Translucency',
  'Book the NT scan (screening for chromosomal abnormalities) which must occur between weeks 11 and 14.',
  'pregnancy',
  -196,
  'mom',
  'health',
  'must-do',
  FALSE,
  1
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'PREG-W08-001',
  'Select OB-GYN/Midwife',
  'Research and select a provider. Confirm they have privileges at your desired delivery hospital or birth center.',
  'pregnancy',
  -224,
  'mom',
  'health',
  'must-do',
  FALSE,
  2
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'PREG-W20-001',
  'Research Pediatricians',
  'Compile a list of in-network pediatricians. Check reviews and schedule "meet-and-greet" interviews if offered.',
  'pregnancy',
  -140,
  'either',
  'health',
  'must-do',
  FALSE,
  3
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'PREG-W12-002',
  'Daycare Waitlist Application',
  'Identify top 3 daycare centers. Submit deposits and applications immediately as waitlists can exceed 12 months.',
  'pregnancy',
  -196,
  'dad',
  'education',
  'must-do',
  FALSE,
  4
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'PREG-W16-001',
  'FSA/HSA Contribution Review',
  'Review pre-tax health savings accounts. Maximize contributions for upcoming hospital bills and dependent care.',
  'pregnancy',
  -168,
  'either',
  'finance',
  'good-to-do',
  FALSE,
  5
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'PREG-W16-002',
  'Employer Leave Policy Review',
  'Request FMLA and Paid Parental Leave handbooks from HR. Determine eligibility and notification deadlines.',
  'pregnancy',
  -168,
  'either',
  'admin',
  'must-do',
  FALSE,
  6
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'PREG-W12-003',
  'Genetic Screening Decision',
  'Discuss with OB-GYN whether to proceed with NIPT (Non-Invasive Prenatal Testing) or carrier screening.',
  'pregnancy',
  -196,
  'mom',
  'health',
  'must-do',
  FALSE,
  7
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'PREG-W20-002',
  '20-Week Anatomy Scan',
  'Attend the mid-pregnancy ultrasound to check fetal organ development and measurements.',
  'pregnancy',
  -140,
  'either',
  'health',
  'must-do',
  FALSE,
  8
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'PREG-W20-003',
  'Dental Cleaning (Mom)',
  'Schedule a cleaning. Hormonal changes increase risk of pregnancy gingivitis, which is linked to preterm birth.',
  'pregnancy',
  -140,
  'mom',
  'health',
  'good-to-do',
  FALSE,
  9
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'PREG-W16-003',
  'Create Baby Registry',
  'Begin selecting gear. Focus on needs vs. wants to guide shower gifts and personal budgeting.',
  'pregnancy',
  -168,
  'either',
  'gear',
  'good-to-do',
  FALSE,
  10
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'PREG-W20-004',
  'Budget Planning: Post-Baby',
  'Create a pro-forma monthly budget including estimated diaper, formula, and childcare costs.',
  'pregnancy',
  -140,
  'dad',
  'finance',
  'must-do',
  FALSE,
  11
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'PREG-W26-001',
  'Glucose Screening Test',
  'Complete the 1-hour glucose challenge test to screen for gestational diabetes (standard at 24-28 weeks).',
  'pregnancy',
  -98,
  'mom',
  'health',
  'must-do',
  FALSE,
  12
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'PREG-W24-001',
  'Nursery Room Clearance',
  'Clear the designated nursery room of existing furniture/clutter to prepare for painting and setup.',
  'pregnancy',
  -112,
  'dad',
  'home',
  'good-to-do',
  FALSE,
  13
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'PREG-W28-001',
  'Research Cord Blood Banking',
  'Decide whether to bank cord blood privately, donate to a public bank, or discard. Order kit if banking.',
  'pregnancy',
  -84,
  'either',
  'health',
  'good-to-do',
  FALSE,
  14
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'PREG-W28-002',
  'Purchase Crib',
  'Buy a crib that meets current CPSC safety standards (no drop sides). Measure room to ensure fit.',
  'pregnancy',
  -84,
  'dad',
  'gear',
  'must-do',
  FALSE,
  15
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'PREG-W28-003',
  'Buy Firm Crib Mattress',
  'Purchase a specifically firm infant mattress. Perform the "two-finger test" to ensure snug fit in crib frame.',
  'pregnancy',
  -84,
  'dad',
  'gear',
  'must-do',
  FALSE,
  16
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'PREG-W20-005',
  'Research Doula Support',
  'Decide if a birth doula is desired for labor support. Interview and hire if applicable.',
  'pregnancy',
  -140,
  'mom',
  'health',
  'good-to-do',
  FALSE,
  17
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'PREG-W20-006',
  'Maternity Wardrobe Audit',
  'Purchase essential maternity clothes (jeans, leggings, tops) as regular clothes become restrictive.',
  'pregnancy',
  -140,
  'mom',
  'gear',
  'good-to-do',
  FALSE,
  18
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'PREG-W24-002',
  'Plan Babymoon',
  'Schedule a final trip or weekend away before travel becomes restricted in the third trimester.',
  'pregnancy',
  -112,
  'dad',
  'magic',
  'good-to-do',
  FALSE,
  19
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'PREG-W28-004',
  'Life Insurance Audit',
  'Review existing life insurance policies. Determine if coverage needs increasing to protect the new dependent.',
  'pregnancy',
  -84,
  'either',
  'finance',
  'must-do',
  FALSE,
  20
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'PREG-W28-005',
  'Update Beneficiaries',
  'Check 401k/IRA beneficiary designations. Plan to add child as contingent beneficiary post-birth.',
  'pregnancy',
  -84,
  'either',
  'finance',
  'must-do',
  FALSE,
  21
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'PREG-W28-006',
  'Pet Behavioral Prep',
  'Begin training pets to respect nursery boundaries and baby sounds (play recordings of crying).',
  'pregnancy',
  -84,
  'dad',
  'home',
  'good-to-do',
  FALSE,
  22
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'PREG-W30-001',
  'Purchase Glider/Rocker',
  'Select a comfortable chair for nursing/feeding. Test for back support and ease of standing up.',
  'pregnancy',
  -70,
  'dad',
  'furniture',
  'good-to-do',
  FALSE,
  23
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'PREG-W30-002',
  'Nursery Painting',
  'Paint nursery early to allow VOCs/fumes to dissipate well before baby arrives.',
  'pregnancy',
  -70,
  'dad',
  'home',
  'good-to-do',
  FALSE,
  24
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'PREG-W32-001',
  'TDAP Vaccine (Mom)',
  'Receive Tdap booster (27-36 weeks) to pass whooping cough antibodies to the fetus.',
  'pregnancy',
  -56,
  'mom',
  'health',
  'must-do',
  FALSE,
  25
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'PREG-W36-001',
  'TDAP Vaccine (Dad/Partners)',
  'Dad and close caregivers get Tdap booster to create a "cocoon" of immunity around the newborn.',
  'pregnancy',
  -28,
  'dad',
  'health',
  'must-do',
  FALSE,
  26
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'PREG-W36-002',
  'Flu Shot (Family)',
  'If in season, all household members should receive the influenza vaccine.',
  'pregnancy',
  -28,
  'either',
  'health',
  'must-do',
  FALSE,
  27
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'PREG-W36-003',
  'Install Infant Car Seat',
  'Install car seat base in primary vehicle using LATCH or seatbelt. Ensure level indicator is correct.',
  'pregnancy',
  -28,
  'dad',
  'safety',
  'must-do',
  FALSE,
  28
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'PREG-W37-001',
  'Car Seat Inspection',
  'Visit a certified Child Passenger Safety Technician (CPST) to verify installation angle and tightness.',
  'pregnancy',
  -21,
  'dad',
  'safety',
  'must-do',
  FALSE,
  29
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'PREG-W35-001',
  'Pack Hospital Bag (Mom)',
  'Pack nursing bras, robe, comfortable clothes, toiletries, heavy flow pads, ID, and insurance card.',
  'pregnancy',
  -35,
  'mom',
  'prep',
  'must-do',
  FALSE,
  30
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'PREG-W35-002',
  'Pack Hospital Bag (Dad)',
  'Pack snacks, hydration, change of clothes, pillow/blanket, chargers, and entertainment.',
  'pregnancy',
  -35,
  'dad',
  'prep',
  'must-do',
  FALSE,
  31
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'PREG-W36-004',
  'Purchase Postpartum Care Kit',
  'Buy peri-bottle, witch hazel pads, sitz bath soak, and maxi pads for recovery.',
  'pregnancy',
  -28,
  'mom',
  'health',
  'must-do',
  FALSE,
  32
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'PREG-W36-005',
  'Wash Baby Clothes',
  'Wash all newborn and 0-3 month clothes/sheets in fragrance-free, hypoallergenic detergent.',
  'pregnancy',
  -28,
  'dad',
  'home',
  'must-do',
  FALSE,
  33
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'PREG-W34-001',
  'Breast Pump Acquisition',
  'Order breast pump through insurance (often free). Sterilize parts upon arrival.',
  'pregnancy',
  -42,
  'mom',
  'feeding',
  'must-do',
  FALSE,
  34
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'PREG-W38-001',
  'Bottle Sterilization',
  'Sterilize a starter set of bottles and nipples (boil or steam) even if breastfeeding, for emergencies.',
  'pregnancy',
  -14,
  'dad',
  'feeding',
  'must-do',
  FALSE,
  35
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'PREG-W38-002',
  'Purchase Formula (Emergency)',
  'Buy 1-2 containers of ready-to-feed newborn formula as a backup supply.',
  'pregnancy',
  -14,
  'dad',
  'feeding',
  'must-do',
  FALSE,
  36
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'PREG-W36-006',
  'Pediatrician Registration',
  'Confirm the selected pediatrician is accepting new patients and note their after-hours line.',
  'pregnancy',
  -28,
  'dad',
  'health',
  'must-do',
  FALSE,
  37
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'PREG-W36-007',
  'Hospital Pre-Registration',
  'Complete all admission paperwork online to avoid administrative delays during active labor.',
  'pregnancy',
  -28,
  'mom',
  'admin',
  'must-do',
  FALSE,
  38
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'PREG-W36-008',
  'Create Birth Plan',
  'Draft preferences for pain management, labor movement, and immediate newborn procedures (e.g., Vitamin K).',
  'pregnancy',
  -28,
  'mom',
  'health',
  'good-to-do',
  FALSE,
  39
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'PREG-W38-003',
  'Deep Clean House',
  'Perform or hire a deep clean (floors, bathrooms, dusting) to prepare a sanitary environment.',
  'pregnancy',
  -14,
  'dad',
  'home',
  'good-to-do',
  FALSE,
  40
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'PREG-W37-002',
  'Stock Freezer Meals',
  'Cook or buy 14 days worth of freezeable dinners to reduce cooking load postpartum.',
  'pregnancy',
  -21,
  'either',
  'food',
  'good-to-do',
  FALSE,
  41
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'PREG-W37-003',
  'Purchase Diapers/Wipes',
  'Stock 1 box of Newborn and 1 box of Size 1 diapers, plus 4 packs of unscented wipes.',
  'pregnancy',
  -21,
  'dad',
  'supplies',
  'must-do',
  FALSE,
  42
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'PREG-W38-004',
  'Setup Safe Sleep Space',
  'Ensure crib/bassinet is free of bumpers, blankets, pillows, and toys (AAP Safe Sleep guidelines).',
  'pregnancy',
  -14,
  'dad',
  'safety',
  'must-do',
  FALSE,
  43
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'PREG-W38-005',
  'Plan Hospital Route',
  'Map the primary and secondary routes to the hospital. Practice the drive if anxious about traffic.',
  'pregnancy',
  -14,
  'dad',
  'logistics',
  'good-to-do',
  FALSE,
  44
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'PREG-W38-006',
  'Arrange Pet Care',
  'Confirm who will care for pets during the hospital stay. Provide keys and feeding instructions.',
  'pregnancy',
  -14,
  'dad',
  'logistics',
  'must-do',
  FALSE,
  45
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'PREG-W38-007',
  'Arrange Sibling Care',
  'If applicable, confirm who will watch older children during labor/delivery.',
  'pregnancy',
  -14,
  'either',
  'logistics',
  'must-do',
  FALSE,
  46
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'PREG-W37-004',
  'Sibling Gift Purchase',
  'Buy a gift "from the baby" to give to the older sibling upon meeting to foster positive association.',
  'pregnancy',
  -21,
  'mom',
  'family',
  'good-to-do',
  FALSE,
  47
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'PREG-W38-008',
  'Install Baby Monitor',
  'Set up camera and parent unit. Test connectivity and audio levels.',
  'pregnancy',
  -14,
  'dad',
  'gear',
  'good-to-do',
  FALSE,
  48
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'PREG-W37-005',
  'Assemble Baby Gear',
  'Assemble swing, bouncer, and stroller. Ensure batteries are installed if needed.',
  'pregnancy',
  -21,
  'dad',
  'gear',
  'good-to-do',
  FALSE,
  49
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'PREG-W36-009',
  'Purchase Nursing Supplies',
  'Buy nursing pads, nipple cream (lanolin), and nursing pillow.',
  'pregnancy',
  -28,
  'mom',
  'feeding',
  'must-do',
  FALSE,
  50
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'PREG-W39-001',
  'Work Hand-off Plan',
  'Finalize transition documents for colleagues. Set Out-of-Office email response.',
  'pregnancy',
  -7,
  'either',
  'work',
  'must-do',
  FALSE,
  51
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'PREG-W39-002',
  'Charge Electronics',
  'Ensure camera batteries, power banks, and portable speakers are fully charged.',
  'pregnancy',
  -3,
  'dad',
  'tech',
  'must-do',
  FALSE,
  52
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'PREG-W39-003',
  'Final Grocery Run',
  'Stock fridge with perishables, snacks, and hydration drinks for early labor/postpartum.',
  'pregnancy',
  -3,
  'dad',
  'food',
  'must-do',
  FALSE,
  53
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'PREG-W39-004',
  'Download Contraction App',
  'Install a contraction timer app on Dad''s phone to track labor progression.',
  'pregnancy',
  -7,
  'dad',
  'tech',
  'good-to-do',
  FALSE,
  54
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'POST-W01-001',
  'Birth Certificate Worksheet',
  'Complete the official worksheet at the hospital. Verify exact spelling of full names.',
  'post-birth',
  1,
  'dad',
  'admin',
  'must-do',
  FALSE,
  55
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'POST-W01-002',
  'Request Social Security #',
  'Check the box on the birth certificate worksheet to auto-request the SSN card.',
  'post-birth',
  1,
  'dad',
  'admin',
  'must-do',
  FALSE,
  56
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'POST-W01-003',
  'Sign Paternity Affidavit',
  '(If unmarried) Complete legal paternity acknowledgment forms at the hospital.',
  'post-birth',
  1,
  'dad',
  'legal',
  'must-do',
  FALSE,
  57
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'POST-W01-004',
  'Add Baby to Insurance',
  'Contact HR/Insurer to add baby. "Qualifying Life Event" window is strictly 30 days.',
  'post-birth',
  5,
  'dad',
  'admin',
  'must-do',
  FALSE,
  58
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'POST-W01-005',
  'Schedule First Ped Visit',
  'Call from hospital to book the first checkup (usually 2-5 days after discharge).',
  'post-birth',
  1,
  'dad',
  'health',
  'must-do',
  FALSE,
  59
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'POST-W01-006',
  'Hospital Discharge Plan',
  'Review discharge instructions. Ensure all prescriptions (pain relief/stool softeners) are filled.',
  'post-birth',
  2,
  'dad',
  'health',
  'must-do',
  FALSE,
  60
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'POST-W01-007',
  'Attend 1st Pediatrician Visit',
  'Bring hospital discharge papers. Check weight and bilirubin levels.',
  'post-birth',
  4,
  'either',
  'health',
  'must-do',
  FALSE,
  61
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'POST-W02-001',
  'Order Birth Certificates',
  'Request 3-5 certified copies from County/State Vital Records. Needed for passport/school.',
  'post-birth',
  14,
  'dad',
  'admin',
  'must-do',
  FALSE,
  62
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'POST-W02-002',
  'File PFL/FMLA Claims',
  'Submit final forms for state/employer paid leave benefits to ensure income continuity.',
  'post-birth',
  14,
  'either',
  'finance',
  'must-do',
  FALSE,
  63
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'POST-W03-001',
  'Write Thank You Notes',
  'Begin writing thank yous for gifts. Do 1-2 per day to manage volume.',
  'post-birth',
  21,
  'mom',
  'social',
  'good-to-do',
  FALSE,
  64
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'POST-W01-008',
  'Newborn Photo Shoot',
  'If desired, schedule newborn photography (best done in first 2 weeks).',
  'post-birth',
  10,
  'mom',
  'magic',
  'good-to-do',
  FALSE,
  65
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'POST-W01-009',
  'Lactation Consultant',
  'Schedule appointment if breastfeeding is painful or weight gain is slow.',
  'post-birth',
  7,
  'mom',
  'health',
  'good-to-do',
  FALSE,
  66
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'POST-W01-010',
  'Vitamin D Drops',
  'Start administering 400 IU Vitamin D daily if exclusively breastfeeding (AAP guideline).',
  'post-birth',
  5,
  'mom',
  'health',
  'must-do',
  FALSE,
  67
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'POST-W02-003',
  'Tummy Time Initiation',
  'Begin short (1-2 min) sessions 2-3 times a day to strengthen neck muscles.',
  'post-birth',
  14,
  'either',
  'dev',
  'must-do',
  FALSE,
  68
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'POST-W04-001',
  'Assess Flat Head',
  'Monitor head shape. Rotate head position during sleep to prevent plagiocephaly.',
  'post-birth',
  30,
  'dad',
  'health',
  'must-do',
  FALSE,
  69
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'POST-W04-002',
  'Update W-4',
  'Adjust tax withholding with employer to account for new dependent (Child Tax Credit).',
  'post-birth',
  30,
  'either',
  'finance',
  'good-to-do',
  FALSE,
  70
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'POST-W08-001',
  'Open 529 College Plan',
  'Open account once SSN arrives. Share contribution link with family.',
  'post-birth',
  60,
  'dad',
  'finance',
  'good-to-do',
  FALSE,
  71
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'POST-W12-001',
  'Update Estate Plan',
  'Amend Will/Trust to name a legal guardian for the child. Essential for asset protection.',
  'post-birth',
  90,
  'either',
  'legal',
  'must-do',
  FALSE,
  72
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'POST-W12-002',
  'Life Insurance Review',
  'Purchase/increase term life insurance to cover child''s expenses to adulthood.',
  'post-birth',
  90,
  'either',
  'finance',
  'must-do',
  FALSE,
  73
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'POST-W12-003',
  'Freeze Child''s Credit',
  'Contact Equifax, Experian, TransUnion to freeze child''s file and prevent identity theft.',
  'post-birth',
  90,
  'dad',
  'security',
  'good-to-do',
  FALSE,
  74
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'POST-W04-003',
  'Create Child''s Email',
  'Register firstname.lastname@gmail.com to reserve digital identity.',
  'post-birth',
  30,
  'dad',
  'tech',
  'good-to-do',
  FALSE,
  75
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'POST-W12-004',
  'Bottle Nipple Transition',
  'Check if baby needs faster flow nipple (Level 1 to 2) if feeding takes >20 mins.',
  'post-birth',
  90,
  'mom',
  'feeding',
  'good-to-do',
  FALSE,
  76
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'POST-W12-005',
  'Check Pacifier Size',
  'Upgrade pacifiers to 3m+ size for safety (larger shield prevents choking).',
  'post-birth',
  90,
  'mom',
  'safety',
  'must-do',
  FALSE,
  77
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'POST-W06-001',
  'Schedule 2-Month Shots',
  'Book well-baby visit for first major round of vaccinations (DTaP, Hib, Polio, etc.).',
  'post-birth',
  42,
  'mom',
  'health',
  'must-do',
  FALSE,
  78
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'POST-W06-002',
  'Postpartum Checkup',
  'Attend 6-week checkup for Mom (healing, mental health, contraception).',
  'post-birth',
  42,
  'mom',
  'health',
  'must-do',
  FALSE,
  79
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'POST-W08-002',
  'Pelvic Floor Therapy',
  'Assess need for rehabilitation therapy post-birth. Schedule evaluation.',
  'post-birth',
  56,
  'mom',
  'health',
  'good-to-do',
  FALSE,
  80
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'POST-W10-001',
  'Return to Work Plan',
  'Confirm start date with employer. Arrange trial run of morning routine.',
  'post-birth',
  70,
  'either',
  'work',
  'must-do',
  FALSE,
  81
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'POST-W11-001',
  'Daycare Transition',
  'Begin transition days (partial hours) to acclimate baby to childcare provider.',
  'post-birth',
  77,
  'either',
  'logistics',
  'good-to-do',
  FALSE,
  82
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'POST-W11-002',
  'Prepare Bottle Labels',
  'Label all bottles/milk bags for daycare with name and date (licensing requirement).',
  'post-birth',
  77,
  'dad',
  'feeding',
  'must-do',
  FALSE,
  83
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'POST-W10-002',
  'Milk Stash Inventory',
  'Audit frozen milk supply. Ensure enough reserve for first week of work.',
  'post-birth',
  70,
  'mom',
  'feeding',
  'must-do',
  FALSE,
  84
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'TASK-GEN-001',
  '4-Month Well Visit',
  'Schedule checkup: DTaP, Hib, Polio, PCV, Rotavirus doses. Sleep regression discussion.',
  'pregnancy',
  0,
  'mom',
  'health',
  'must-do',
  FALSE,
  85
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'POST-W17-001',
  'Assess Sleep Regression',
  'Research sleep training methods if 4-month regression causes sleep disruption.',
  'post-birth',
  120,
  'either',
  'sleep',
  'good-to-do',
  FALSE,
  86
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'TASK-GEN-002',
  'Stop Swaddling',
  'Transition to sleep sack if baby shows signs of rolling over (safety hazard).',
  'pregnancy',
  0,
  'dad',
  'safety',
  'must-do',
  FALSE,
  87
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'POST-W21-001',
  'High Chair Research',
  'Research high chairs with footrests and easy-to-clean surfaces.',
  'post-birth',
  150,
  'either',
  'gear',
  'good-to-do',
  FALSE,
  88
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'TASK-GEN-003',
  'Purchase High Chair',
  'Buy chair before solids introduction. Assemble and clean.',
  'pregnancy',
  0,
  'dad',
  'gear',
  'must-do',
  FALSE,
  89
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'TASK-GEN-004',
  'Solids Readiness Check',
  'Check signs: sitting up with support, head control, loss of tongue-thrust reflex.',
  'pregnancy',
  0,
  'either',
  'dev',
  'must-do',
  FALSE,
  90
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'POST-W25-001',
  'Solids Introduction',
  'Begin single-ingredient solids (iron-fortified cereal/puree). Wait 3-5 days between new foods.',
  'post-birth',
  180,
  'either',
  'feeding',
  'must-do',
  FALSE,
  91
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'TASK-GEN-005',
  '6-Month Well Visit',
  'Schedule checkup: Vaccines, anemia check, lead screening assessment.',
  'pregnancy',
  0,
  'mom',
  'health',
  'must-do',
  FALSE,
  92
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'TASK-GEN-006',
  'Allergen Introduction',
  'Introduce peanut/egg protein early (check w/ doctor) to reduce allergy risk.',
  'pregnancy',
  0,
  'either',
  'feeding',
  'must-do',
  FALSE,
  93
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'POST-W30-001',
  'Sippy Cup Introduction',
  'Offer water in a sippy/straw cup with meals to practice oral motor skills.',
  'post-birth',
  210,
  'mom',
  'feeding',
  'good-to-do',
  FALSE,
  94
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'POST-W30-002',
  'Baby Proofing: Mobility',
  'Re-evaluate floor safety as baby begins army crawling/scooting.',
  'post-birth',
  210,
  'dad',
  'safety',
  'must-do',
  FALSE,
  95
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'POST-W25-002',
  'Lower Crib Mattress',
  'Lower mattress to middle setting as baby begins pushing up on hands/knees.',
  'post-birth',
  180,
  'dad',
  'safety',
  'must-do',
  FALSE,
  96
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'POST-W34-001',
  'Object Permanence Games',
  'Play peek-a-boo and hide toys to support cognitive development (finding hidden objects).',
  'post-birth',
  240,
  'either',
  'dev',
  'good-to-do',
  FALSE,
  97
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'TASK-GEN-007',
  '9-Month Well Visit',
  'Schedule checkup: Developmental screening (ASQ), catch-up vaccines.',
  'pregnancy',
  0,
  'mom',
  'health',
  'must-do',
  FALSE,
  98
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'POST-W38-001',
  'Finger Foods Intro',
  'Transition to dissolvable solids (puffs, soft fruit) to practice pincer grasp.',
  'post-birth',
  270,
  'mom',
  'feeding',
  'good-to-do',
  FALSE,
  99
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'POST-W38-002',
  'Car Seat Adjustment',
  'Check harness height (at/below shoulders) and head clearance (1 inch from top).',
  'post-birth',
  270,
  'dad',
  'safety',
  'must-do',
  FALSE,
  100
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'POST-W42-001',
  'Research Convertible Seat',
  'Research rear-facing convertible seats as infant seat limits approach (height/weight).',
  'post-birth',
  300,
  'dad',
  'gear',
  'good-to-do',
  FALSE,
  101
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'POST-W47-001',
  'Buy Convertible Seat',
  'Purchase next-stage seat. Ensure high rear-facing weight limit (40-50 lbs).',
  'post-birth',
  330,
  'dad',
  'gear',
  'must-do',
  FALSE,
  102
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'POST-W47-002',
  'First Dentist Visit',
  'Schedule "happy visit" upon first tooth eruption or by 1st birthday (AAP guideline).',
  'post-birth',
  330,
  'dad',
  'health',
  'must-do',
  FALSE,
  103
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'POST-W42-002',
  'First Birthday Planning',
  'Plan celebration. Keep it simple; focus on photos and "smash cake."',
  'post-birth',
  300,
  'mom',
  'magic',
  'good-to-do',
  FALSE,
  104
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'TASK-GEN-008',
  '12-Month Well Visit',
  'Schedule checkup: MMR, Varicella, Hep A vaccines. Lead/Anemia blood draw.',
  'pregnancy',
  0,
  'mom',
  'health',
  'must-do',
  FALSE,
  105
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'POST-W51-001',
  'Transition to Cow''s Milk',
  'Begin mixing formula/breastmilk with whole cow''s milk (after 1 year).',
  'post-birth',
  360,
  'mom',
  'feeding',
  'must-do',
  FALSE,
  106
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'POST-W51-002',
  'Wean from Bottle',
  'Aim to discontinue bottle use by 12-15 months to prevent dental decay.',
  'post-birth',
  360,
  'either',
  'feeding',
  'good-to-do',
  FALSE,
  107
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'POST-W51-003',
  'Walking Shoes Purchase',
  'Buy soft-soled, flexible shoes once baby is walking outdoors. Barefoot is best indoors.',
  'post-birth',
  360,
  'mom',
  'gear',
  'must-do',
  FALSE,
  108
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'POST-W51-004',
  'Vision Screening',
  'Ensure formal vision screening is conducted (often photoscreening) at well-visit.',
  'post-birth',
  360,
  'dad',
  'health',
  'must-do',
  FALSE,
  109
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'POST-W51-005',
  'Pacifier Weaning',
  'Begin limiting pacifier use to sleep times to support speech development.',
  'post-birth',
  360,
  'either',
  'dev',
  'good-to-do',
  FALSE,
  110
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'TASK-GEN-001',
  'Toy Rotation',
  'Rotate toys to maintain interest and reduce clutter. Store outgrown items.',
  'pregnancy',
  0,
  'mom',
  'play',
  'good-to-do',
  FALSE,
  111
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'TASK-GEN-002',
  'Flashlight Test',
  'Check eyes in photos for "white reflex" (rare sign of retinoblastoma).',
  'pregnancy',
  0,
  'dad',
  'health',
  'good-to-do',
  FALSE,
  112
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'POST-W25-003',
  'Sun Safety',
  'Begin using mineral sunscreen (SPF 30+) once baby is >6 months.',
  'post-birth',
  180,
  'either',
  'health',
  'must-do',
  FALSE,
  113
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'TASK-GEN-003',
  'Flu Vaccine (Seasonal)',
  'Schedule annual flu shot (requires 2 doses 1 month apart for first-timers).',
  'pregnancy',
  0,
  'either',
  'health',
  'must-do',
  FALSE,
  114
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'POST-W01-011',
  'Set Water Heater Temp',
  'Lower water heater thermostat to 120Â°F (49Â°C) to prevent accidental scalding.',
  'post-birth',
  7,
  'dad',
  'safety',
  'must-do',
  FALSE,
  115
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'POST-W01-012',
  'Smoke/CO Detectors',
  'Install/test units on every floor and outside every sleeping area. Check dates.',
  'post-birth',
  7,
  'dad',
  'safety',
  'must-do',
  FALSE,
  116
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'POST-W01-013',
  'Fire Extinguishers',
  'Place extinguishers in kitchen and garage. Verify pressure gauge is in green zone.',
  'post-birth',
  7,
  'dad',
  'safety',
  'must-do',
  FALSE,
  117
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'POST-W01-014',
  'Poison Control Prep',
  'Save 1-800-222-1222 in both phones. Post number on fridge/magnet.',
  'post-birth',
  1,
  'dad',
  'safety',
  'must-do',
  FALSE,
  118
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'POST-W04-004',
  'Fire Escape Plan',
  'Map exit routes from all rooms. Determine exactly who grabs the baby in a fire.',
  'post-birth',
  30,
  'either',
  'safety',
  'must-do',
  FALSE,
  119
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'POST-W08-003',
  'CPR/First Aid Class',
  'Parents and caregivers take infant-specific refresher course (online or in-person).',
  'post-birth',
  60,
  'either',
  'safety',
  'must-do',
  FALSE,
  120
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'POST-W21-002',
  'Anchor Furniture',
  'Secure dressers, bookshelves, and TVs to walls using anti-tip straps/brackets.',
  'post-birth',
  150,
  'dad',
  'safety',
  'must-do',
  FALSE,
  121
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'POST-W21-003',
  'Cover Outlets',
  'Install plug covers or sliding safety plates on all accessible electrical sockets.',
  'post-birth',
  150,
  'dad',
  'safety',
  'must-do',
  FALSE,
  122
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'POST-W25-004',
  'Manage Cords',
  'Secure blind cords (cleats) and electrical cords (raceways) out of reach.',
  'post-birth',
  180,
  'dad',
  'safety',
  'must-do',
  FALSE,
  123
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'POST-W25-005',
  'Cabinet Locks',
  'Install locks on cabinets containing chemicals (kitchen/bath) and medicines.',
  'post-birth',
  180,
  'dad',
  'safety',
  'must-do',
  FALSE,
  124
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'POST-W25-006',
  'Stair Gates',
  'Install hardware-mounted gate at top of stairs (pressure gates are unsafe at top).',
  'post-birth',
  180,
  'dad',
  'safety',
  'must-do',
  FALSE,
  125
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'POST-W34-002',
  'Toilet Lid Locks',
  'Install locks to prevent drowning risk and hygiene issues.',
  'post-birth',
  240,
  'dad',
  'safety',
  'must-do',
  FALSE,
  126
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'POST-W38-003',
  'Appliance Latches',
  'Secure oven, dishwasher, and fridge doors if accessible.',
  'post-birth',
  270,
  'dad',
  'safety',
  'good-to-do',
  FALSE,
  127
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'POST-W34-003',
  'Corner Guards',
  'Apply cushioning to sharp corners of coffee tables/hearths.',
  'post-birth',
  240,
  'dad',
  'safety',
  'good-to-do',
  FALSE,
  128
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'POST-W21-004',
  'Remove Crib Mobile',
  'Remove mobile when baby can push up on hands/knees to prevent entanglement.',
  'post-birth',
  150,
  'dad',
  'safety',
  'must-do',
  FALSE,
  129
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'POST-W34-004',
  'Lowest Crib Setting',
  'Drop mattress to lowest point when baby pulls to stand.',
  'post-birth',
  240,
  'dad',
  'safety',
  'must-do',
  FALSE,
  130
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'POST-W25-007',
  'Toy Safety Audit',
  'Purge toys with small parts (use toilet paper tube test) or loose batteries.',
  'post-birth',
  180,
  'either',
  'safety',
  'must-do',
  FALSE,
  131
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'POST-W42-003',
  'Window Guards/Stops',
  'Install stops to prevent windows opening >4 inches (fall prevention).',
  'post-birth',
  300,
  'dad',
  'safety',
  'must-do',
  FALSE,
  132
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'POST-W25-008',
  'Pool Safety Fence',
  'If pool exists, ensure 4-sided isolation fence with self-latching gate is installed.',
  'post-birth',
  180,
  'dad',
  'safety',
  'must-do',
  FALSE,
  133
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'POST-W25-009',
  'Lead Paint Test',
  'If home built pre-1978, test peeling paint or renovation dust for lead.',
  'post-birth',
  180,
  'dad',
  'safety',
  'must-do',
  FALSE,
  134
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'POST-W08-004',
  'Radon Test',
  'Conduct long-term radon test in basement/living areas.',
  'post-birth',
  60,
  'dad',
  'safety',
  'good-to-do',
  FALSE,
  135
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'POST-W25-010',
  'Detergent Pod Storage',
  'Move laundry pods to high shelf; lock container (high poisoning risk).',
  'post-birth',
  180,
  'dad',
  'safety',
  'must-do',
  FALSE,
  136
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'POST-W01-015',
  'Unload Firearms',
  'Ensure all firearms are unloaded and locked in a safe; ammo stored separately.',
  'post-birth',
  1,
  'dad',
  'safety',
  'must-do',
  FALSE,
  137
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'TASK-GEN-004',
  'Car Seat Cleaning',
  'Clean car seat per manual (no harsh chemicals on straps). Check for crumbs interfering with buckles.',
  'pregnancy',
  0,
  'dad',
  'maintenance',
  'good-to-do',
  FALSE,
  138
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'TASK-GEN-005',
  'Stroller Maintenance',
  'Check tire pressure and lubricate wheels of stroller.',
  'pregnancy',
  0,
  'dad',
  'maintenance',
  'good-to-do',
  FALSE,
  139
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'TASK-GEN-006',
  'Humidifier Cleaning',
  'Descale and disinfect humidifier weekly to prevent mold growth.',
  'pregnancy',
  0,
  'dad',
  'health',
  'must-do',
  FALSE,
  140
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'TASK-GEN-007',
  'Bath Toy Sanitization',
  'Bleach/clean bath toys to prevent mold inside squeeze toys.',
  'pregnancy',
  0,
  'dad',
  'hygiene',
  'good-to-do',
  FALSE,
  141
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'TASK-GEN-008',
  'Check Recalls',
  'Search CPSC database for recalls on owned crib, stroller, car seat, and toys.',
  'pregnancy',
  0,
  'dad',
  'safety',
  'must-do',
  FALSE,
  142
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'POST-W25-011',
  'Medicine Cabinet Audit',
  'Discard expired infant Tylenol/Motrin. Verify dosing chart for current weight.',
  'post-birth',
  180,
  'mom',
  'health',
  'must-do',
  FALSE,
  143
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'POST-W04-005',
  'Emergency Bag Prep',
  'Pack "Go Bag" with diapers/formula for unexpected ER trips or evacuations.',
  'post-birth',
  30,
  'mom',
  'safety',
  'good-to-do',
  FALSE,
  144
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'POST-W77-001',
  'Research Preschools',
  'Identify philosophy (Montessori, Reggio, Play-based) and location/cost.',
  'post-birth',
  540,
  'either',
  'edu',
  'good-to-do',
  FALSE,
  145
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'POST-W85-001',
  'Schedule School Tours',
  'Book visits for potential preschools. Ask about ratios, discipline, and turnover.',
  'post-birth',
  600,
  'either',
  'edu',
  'good-to-do',
  FALSE,
  146
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'POST-W102-001',
  'Submit Preschool Apps',
  'Submit applications for the following academic year (deadlines often Jan/Feb).',
  'post-birth',
  720,
  'dad',
  'edu',
  'must-do',
  FALSE,
  147
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'POST-W51-006',
  'Swim Lessons',
  'Enroll in water safety/survival swim classes (ISR or traditional).',
  'post-birth',
  360,
  'dad',
  'activity',
  'must-do',
  FALSE,
  148
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'POST-W51-007',
  'Library Story Time',
  'Identify local library schedule for free socialization/literacy events.',
  'post-birth',
  360,
  'either',
  'social',
  'good-to-do',
  FALSE,
  149
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'POST-W64-001',
  'Music/Gym Class',
  'Research toddler activity classes for gross motor skills/socialization.',
  'post-birth',
  450,
  'either',
  'activity',
  'good-to-do',
  FALSE,
  150
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'TASK-GEN-009',
  'Playdate Scheduling',
  'Coordinate social time with other parents. Reciprocate invitations.',
  'pregnancy',
  0,
  'either',
  'social',
  'good-to-do',
  FALSE,
  151
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'POST-W12-006',
  'Passport Application',
  'Apply for baby''s passport (both parents must appear or notarize consent).',
  'post-birth',
  90,
  'dad',
  'admin',
  'good-to-do',
  FALSE,
  152
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'POST-W25-012',
  'Global Entry/TSA Pre',
  'Enroll child (requires interview) for travel ease.',
  'post-birth',
  180,
  'dad',
  'admin',
  'good-to-do',
  FALSE,
  153
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'POST-W94-001',
  'Potty Readiness Check',
  'Assess signs: dry naps, hiding to poop, interest in toilet, communicating urge.',
  'post-birth',
  660,
  'either',
  'dev',
  'must-do',
  FALSE,
  154
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'POST-W94-002',
  'Buy Small Potty',
  'Purchase floor potty (easier ergonomics for squatting than seat insert).',
  'post-birth',
  660,
  'dad',
  'gear',
  'must-do',
  FALSE,
  155
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'POST-W102-002',
  'Clear Weekend Schedule',
  'Block 3 days for "Oh Crap" Block 1 (naked time) training. No outings.',
  'post-birth',
  720,
  'either',
  'logistics',
  'must-do',
  FALSE,
  156
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'POST-W102-003',
  'Stock Potty Supplies',
  'Buy juice/water (push fluids), cleaning spray, rags, and wine (for parents).',
  'post-birth',
  720,
  'dad',
  'supplies',
  'must-do',
  FALSE,
  157
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'POST-W102-004',
  'Daycare Potty Plan',
  'Discuss potty plan with teachers. Supply extra clothes/underwear/wet bag.',
  'post-birth',
  720,
  'mom',
  'edu',
  'must-do',
  FALSE,
  158
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'POST-W128-001',
  'Night Training Prep',
  'Buy waterproof mattress protectors (layer: sheet-protector-sheet-protector).',
  'post-birth',
  900,
  'dad',
  'gear',
  'good-to-do',
  FALSE,
  159
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'TASK-GEN-009',
  '18-Month Well Visit',
  'Schedule checkup: Autism screening (M-CHAT), Hep A, DTaP vaccines.',
  'pregnancy',
  0,
  'mom',
  'health',
  'must-do',
  FALSE,
  160
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'TASK-GEN-010',
  '2-Year Well Visit',
  'Schedule checkup: BMI check, lead screen, developmental milestones.',
  'pregnancy',
  0,
  'mom',
  'health',
  'must-do',
  FALSE,
  161
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'POST-W102-005',
  'Dentist Checkup (2Yr)',
  'Schedule 6-month cleaning/exam. Fluoride varnish application.',
  'post-birth',
  720,
  'dad',
  'health',
  'must-do',
  FALSE,
  162
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'POST-W128-002',
  'Transition to Bed',
  'Convert crib to toddler bed if climbing out (or by age 3).',
  'post-birth',
  900,
  'dad',
  'safety',
  'must-do',
  FALSE,
  163
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'POST-W102-006',
  'Purchase Toddler Pillow',
  'Introduce small pillow/light blanket once in a bed (safe after age 2).',
  'post-birth',
  720,
  'mom',
  'gear',
  'good-to-do',
  FALSE,
  164
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'TASK-GEN-011',
  'Preschool Health Forms',
  'Complete immunization/physical forms for school entry.',
  'pregnancy',
  0,
  'mom',
  'admin',
  'must-do',
  FALSE,
  165
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'TASK-GEN-012',
  'School Supply Shop',
  'Buy backpack, lunchbox, indoor shoes per school list.',
  'pregnancy',
  0,
  'mom',
  'gear',
  'must-do',
  FALSE,
  166
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'TASK-GEN-013',
  'Label Everything',
  'Apply waterproof labels to all school clothes/gear.',
  'pregnancy',
  0,
  'mom',
  'prep',
  'must-do',
  FALSE,
  167
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'TASK-GEN-014',
  'Emergency Contact Update',
  'Update school with current work numbers and authorized pickup list.',
  'pregnancy',
  0,
  'dad',
  'admin',
  'must-do',
  FALSE,
  168
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'TASK-GEN-015',
  'Back-to-School Haircut',
  'Schedule haircut before first day photos.',
  'pregnancy',
  0,
  'dad',
  'hygiene',
  'good-to-do',
  FALSE,
  169
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'TASK-GEN-010',
  'Seasonal Gear Swap',
  'Check fit of coats/boots/rain gear. Buy next size up.',
  'pregnancy',
  0,
  'mom',
  'gear',
  'must-do',
  FALSE,
  170
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'TASK-GEN-011',
  'Developmental Activities',
  'Research age-appropriate crafts/activities (e.g., threading, sorting).',
  'pregnancy',
  0,
  'mom',
  'edu',
  'good-to-do',
  FALSE,
  171
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'POST-W77-002',
  'Limit Screen Time',
  'Audit apps/shows. Set limits per AAP guidelines (high quality, co-viewing).',
  'post-birth',
  540,
  'either',
  'dev',
  'must-do',
  FALSE,
  172
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'TASK-GEN-012',
  'Rotate Books',
  'Refresh book selection from library to encourage reading interest.',
  'pregnancy',
  0,
  'mom',
  'edu',
  'good-to-do',
  FALSE,
  173
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'POST-W77-003',
  'Behavioral Strategy',
  'Agree on discipline/tantrum strategies (e.g., "Time-In," redirection).',
  'post-birth',
  540,
  'either',
  'parenting',
  'must-do',
  FALSE,
  174
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'TASK-GEN-016',
  'Dishes/Bottles (PM)',
  'Wash/sterilize all bottles; run dishwasher. Reset kitchen for morning.',
  'pregnancy',
  0,
  'dad',
  'home',
  'must-do',
  FALSE,
  175
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'TASK-GEN-017',
  'Diaper Pail Empty',
  'Empty and replace bag before it overflows/smells.',
  'pregnancy',
  0,
  'dad',
  'home',
  'must-do',
  FALSE,
  176
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'TASK-GEN-018',
  'Baby Laundry',
  'Wash, fold, put away baby clothes (high turnover). Stain treat.',
  'pregnancy',
  0,
  'mom',
  'home',
  'must-do',
  FALSE,
  177
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'TASK-GEN-019',
  'Meal Planning',
  'Decide menu for the week; generate grocery list. Check pantry staples.',
  'pregnancy',
  0,
  'mom',
  'food',
  'good-to-do',
  FALSE,
  178
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'TASK-GEN-020',
  'Grocery Execution',
  'Execute the grocery run or manage online delivery. Put food away.',
  'pregnancy',
  0,
  'dad',
  'food',
  'must-do',
  FALSE,
  179
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'TASK-GEN-013',
  'Trash/Recycling',
  'Gather trash from all bins; take to curb. Return bins.',
  'pregnancy',
  0,
  'dad',
  'home',
  'must-do',
  FALSE,
  180
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'TASK-GEN-014',
  'Bill Pay/Finance',
  'Review accounts; pay utilities/mortgage/medical bills. File receipts.',
  'pregnancy',
  0,
  'dad',
  'admin',
  'must-do',
  FALSE,
  181
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'TASK-GEN-021',
  'Sunday Sync',
  '15-min meeting to review upcoming week''s logistics/pickups.',
  'pregnancy',
  0,
  'either',
  'admin',
  'must-do',
  FALSE,
  182
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'TASK-GEN-015',
  'Digital Photo Backup',
  'Offload phone photos to cloud/hard drive. Organize into folders.',
  'pregnancy',
  0,
  'dad',
  'tech',
  'good-to-do',
  FALSE,
  183
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'TASK-GEN-016',
  'Restock Diapers/Wipes',
  'Inventory check; order Amazon/Target subscription.',
  'pregnancy',
  0,
  'dad',
  'supplies',
  'must-do',
  FALSE,
  184
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'TASK-GEN-017',
  'Nail Trimming',
  'Clip/file baby''s nails while sleeping to prevent scratching.',
  'pregnancy',
  0,
  'mom',
  'hygiene',
  'must-do',
  FALSE,
  185
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'TASK-GEN-022',
  'Bath Routine',
  'Bathe baby (soap not needed daily, but routine helps sleep).',
  'pregnancy',
  0,
  'dad',
  'hygiene',
  'good-to-do',
  FALSE,
  186
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'TASK-GEN-023',
  'Unicorn Space (Dad)',
  '1 hour of uninterrupted time for hobby/self (no work/chores).',
  'pregnancy',
  0,
  'dad',
  'self',
  'must-do',
  FALSE,
  187
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'TASK-GEN-024',
  'Unicorn Space (Mom)',
  '1 hour of uninterrupted time for hobby/self (no work/chores).',
  'pregnancy',
  0,
  'mom',
  'self',
  'must-do',
  FALSE,
  188
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'TASK-GEN-018',
  'Relationship Check-in',
  'Discuss "State of the Union" - emotional check-in, no logistics allowed.',
  'pregnancy',
  0,
  'either',
  'social',
  'good-to-do',
  FALSE,
  189
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'TASK-GEN-019',
  'Gift Buying (Family)',
  'Track birthdays for extended family; buy/ship gifts.',
  'pregnancy',
  0,
  'mom',
  'social',
  'good-to-do',
  FALSE,
  190
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'TASK-GEN-025',
  'Holiday Planning',
  'Plan logistics/meals/travel for upcoming major holiday.',
  'pregnancy',
  0,
  'mom',
  'magic',
  'good-to-do',
  FALSE,
  191
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'TASK-GEN-020',
  'Vehicle Maintenance',
  'Oil change, tire rotation, car wash. Vacuum car seat crumbs.',
  'pregnancy',
  0,
  'dad',
  'home',
  'must-do',
  FALSE,
  192
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'TASK-GEN-021',
  'HVAC Maintenance',
  'Replace furnace/AC filters. Check humidifier pads.',
  'pregnancy',
  0,
  'dad',
  'home',
  'good-to-do',
  FALSE,
  193
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'TASK-GEN-022',
  'Declutter/Donation',
  'Bag up outgrown clothes/toys; donate or store labeled bins.',
  'pregnancy',
  0,
  'mom',
  'home',
  'good-to-do',
  FALSE,
  194
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'TASK-GEN-023',
  'Smoke Alarm Test',
  'Test buttons on all alarms. Vacuum dust from sensors.',
  'pregnancy',
  0,
  'dad',
  'safety',
  'must-do',
  FALSE,
  195
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'TASK-GEN-024',
  'Gutter Cleaning',
  'Clean gutters to prevent water damage (or hire out).',
  'pregnancy',
  0,
  'dad',
  'home',
  'good-to-do',
  FALSE,
  196
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'TASK-GEN-026',
  'Lawn/Yard Care',
  'Mow, rake, or manage landscaping service.',
  'pregnancy',
  0,
  'dad',
  'home',
  'good-to-do',
  FALSE,
  197
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'TASK-GEN-027',
  'Tax Prep',
  'Gather W2s, 1099s, childcare receipts (Daycare tax ID).',
  'pregnancy',
  0,
  'dad',
  'admin',
  'must-do',
  FALSE,
  198
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'POST-W04-006',
  'Apple Legacy Contact',
  'Set up Legacy Contact in Apple ID to allow access to photos if deceased.',
  'post-birth',
  30,
  'either',
  'tech',
  'must-do',
  FALSE,
  199
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'POST-W04-007',
  'Google Inactive Acct',
  'Configure Google Inactive Account Manager to auto-transfer data.',
  'post-birth',
  30,
  'either',
  'tech',
  'must-do',
  FALSE,
  200
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'POST-W04-008',
  'Password Sharing',
  'Ensure partner has access to Master Password (1Password/LastPass).',
  'post-birth',
  30,
  'either',
  'security',
  'must-do',
  FALSE,
  201
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'TASK-GEN-025',
  'Update Emergency Info',
  'Review/update emergency contacts on phones and fridge.',
  'pregnancy',
  0,
  'either',
  'safety',
  'must-do',
  FALSE,
  202
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'TASK-GEN-026',
  'Date Night Planning',
  'Book babysitter and make reservations.',
  'pregnancy',
  0,
  'either',
  'social',
  'good-to-do',
  FALSE,
  203
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'TASK-GEN-027',
  'Book Babysitter',
  'Secure childcare for specific upcoming adult events.',
  'pregnancy',
  0,
  'mom',
  'logistics',
  'must-do',
  FALSE,
  204
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'TASK-GEN-028',
  'Travel Prep',
  'Book flights/hotels. Request crib. Pack travel gear.',
  'pregnancy',
  0,
  'dad',
  'logistics',
  'must-do',
  FALSE,
  205
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'TASK-GEN-029',
  'Vacation Hold',
  'Stop mail/newspapers. Set thermostat/lights for travel.',
  'pregnancy',
  0,
  'dad',
  'home',
  'good-to-do',
  FALSE,
  206
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'TASK-GEN-028',
  'Medical Bill Audit',
  'Review EOBs against bills. Dispute errors. Pay balances.',
  'pregnancy',
  0,
  'dad',
  'admin',
  'good-to-do',
  FALSE,
  207
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'TASK-GEN-029',
  'Deep Clean Appliances',
  'Run cleaning cycles on dishwasher and washing machine.',
  'pregnancy',
  0,
  'dad',
  'home',
  'good-to-do',
  FALSE,
  208
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'TASK-GEN-030',
  'Defrost Freezer',
  'Organize freezer, check dates on breast milk/food.',
  'pregnancy',
  0,
  'mom',
  'food',
  'good-to-do',
  FALSE,
  209
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'TASK-GEN-031',
  'Pet Vet Visits',
  'Schedule annual vaccinations and checkups for pets.',
  'pregnancy',
  0,
  'dad',
  'home',
  'must-do',
  FALSE,
  210
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'TASK-GEN-032',
  'Review Subscriptions',
  'Audit streaming/app subscriptions. Cancel unused services.',
  'pregnancy',
  0,
  'dad',
  'finance',
  'good-to-do',
  FALSE,
  211
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'TASK-GEN-030',
  'Holiday Cards',
  'Organize family photo, order cards, update address list.',
  'pregnancy',
  0,
  'mom',
  'magic',
  'good-to-do',
  FALSE,
  212
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'TASK-GEN-031',
  'Halloween Costumes',
  'Plan/buy costumes before popular sizes sell out.',
  'pregnancy',
  0,
  'mom',
  'magic',
  'good-to-do',
  FALSE,
  213
) ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_templates (task_id, title, description, stage, due_date_offset_days, default_assignee, category, priority, is_premium, sort_order)
VALUES (
  'POST-W01-016',
  'Birthday Party Prep',
  'Book venue, order cake, send invites.',
  'post-birth',
  -42,
  'mom',
  'magic',
  'good-to-do',
  FALSE,
  214
) ON CONFLICT (task_id) DO NOTHING;

