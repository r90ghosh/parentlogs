-- Briefing Templates Seed Data
-- Generated: 2025-12-30T17:43:56.345Z
-- Source: content/briefings.json

INSERT INTO briefing_templates (briefing_id, stage, week, title, baby_update, mom_update, dad_focus, relationship_tip, coming_up, medical_source, linked_task_ids, is_premium)
VALUES (
  'PREG-W04',
  'pregnancy',
  4,
  'The Positive Test',
  'Poppy Seed size. Implantation complete. Neural tube forming.',
  'Missed period. Potential fatigue and breast tenderness. Emotional shock/joy.',
  ARRAY['Start the ''Protocol'' folder', 'Calculate Due Date', 'Verify health insurance coverage for prenatal care.'],
  'Don''t pressure her to feel ''happy'' immediately. Fear is normal.',
  'First prenatal appointment (Week 8).',
  'Mayo Clinic',
  ARRAY['PREG-W04-01'],
  FALSE
) ON CONFLICT (briefing_id) DO NOTHING;

INSERT INTO briefing_templates (briefing_id, stage, week, title, baby_update, mom_update, dad_focus, relationship_tip, coming_up, medical_source, linked_task_ids, is_premium)
VALUES (
  'PREG-W05',
  'pregnancy',
  5,
  'The Circulatory System',
  'Sesame Seed size. Heart is beginning to form and beat. Circulatory system operational.',
  'HCG hormone levels doubling every 48 hours. Nausea (Morning Sickness) may begin.',
  ARRAY['Screen OB-GYNs', 'Check hospital ratings', 'Buy ginger ale/crackers for the house.'],
  'Ask ''How are you feeling?'' and accept ''Terrible'' as an answer.',
  'Heartbeat visualization.',
  'ACOG',
  ARRAY['PREG-W05-01'],
  FALSE
) ON CONFLICT (briefing_id) DO NOTHING;

INSERT INTO briefing_templates (briefing_id, stage, week, title, baby_update, mom_update, dad_focus, relationship_tip, coming_up, medical_source, linked_task_ids, is_premium)
VALUES (
  'PREG-W06',
  'pregnancy',
  6,
  'The Facial Features',
  'Lentil size. Nose/mouth/ears taking shape. Heart beating 100-160bpm.',
  'Peak nausea zone. Exhaustion is physical and metabolic. Smell aversion likely.',
  ARRAY['Take over kitchen duty', 'Cooking smells may trigger her', 'Manage trash/compost.'],
  'Bring her water before she asks. Hydration is critical.',
  'First Ultrasound window opens.',
  'AAP',
  ARRAY['PREG-W06-01'],
  FALSE
) ON CONFLICT (briefing_id) DO NOTHING;

INSERT INTO briefing_templates (briefing_id, stage, week, title, baby_update, mom_update, dad_focus, relationship_tip, coming_up, medical_source, linked_task_ids, is_premium)
VALUES (
  'PREG-W07',
  'pregnancy',
  7,
  'The Limb Buds',
  'Blueberry size. Arm and leg buds sprouting. Kidneys developing.',
  'Frequent urination begins (uterus pressing on bladder). Mood swings due to hormones.',
  ARRAY['Clean the bathroom', 'She is spending a lot of time there', 'Keep it pristine.'],
  'Don''t joke about the mood swings. Just ride the wave.',
  'Early ultrasound to confirm viability.',
  'WebMD',
  ARRAY['PREG-W07-01'],
  FALSE
) ON CONFLICT (briefing_id) DO NOTHING;

INSERT INTO briefing_templates (briefing_id, stage, week, title, baby_update, mom_update, dad_focus, relationship_tip, coming_up, medical_source, linked_task_ids, is_premium)
VALUES (
  'PREG-W08',
  'pregnancy',
  8,
  'The Raspberry',
  'Raspberry size (1.6cm). Fingers/toes webbed. Taste buds forming.',
  'Progesterone fatigue. She is metabolically running a marathon while sitting on the couch.',
  ARRAY['Gatekeeper Duty: Manage family expectations', 'Don''t announce yet if you prefer safety.'],
  'Watch a movie she picks. Low energy activity is key.',
  'NIPT (Genetic Testing) decision.',
  'Mayo Clinic',
  ARRAY['PREG-W08-01'],
  FALSE
) ON CONFLICT (briefing_id) DO NOTHING;

INSERT INTO briefing_templates (briefing_id, stage, week, title, baby_update, mom_update, dad_focus, relationship_tip, coming_up, medical_source, linked_task_ids, is_premium)
VALUES (
  'PREG-W09',
  'pregnancy',
  9,
  'The Muscle Era',
  'Cherry size. Muscles forming. Baby starts moving (she can''t feel it yet).',
  'Digestive slowdown. Bloating and gas are common progesterone side effects.',
  ARRAY['Grocery Ops: High fiber foods', 'helping with digestion', 'Keep snacks accessible.'],
  'Tell her she''s doing a good job growing a human.',
  'Doppler heartbeat check.',
  'ACOG',
  ARRAY['PREG-W09-01'],
  FALSE
) ON CONFLICT (briefing_id) DO NOTHING;

INSERT INTO briefing_templates (briefing_id, stage, week, title, baby_update, mom_update, dad_focus, relationship_tip, coming_up, medical_source, linked_task_ids, is_premium)
VALUES (
  'PREG-W10',
  'pregnancy',
  10,
  'The Strawberry',
  'Strawberry size. Vital organs functioning. Bones hardening.',
  'Round Ligament Pain (sharp pains in abdomen) as uterus stretches.',
  ARRAY['Finance Audit: Check ''Out of Pocket Max'' on insurance', 'Start saving cash buffer.'],
  'Offer a back rub. Her posture is starting to shift.',
  'Nuchal Translucency Scan (Week 11-13).',
  'RadiologyInfo',
  ARRAY['PREG-W10-01'],
  FALSE
) ON CONFLICT (briefing_id) DO NOTHING;

INSERT INTO briefing_templates (briefing_id, stage, week, title, baby_update, mom_update, dad_focus, relationship_tip, coming_up, medical_source, linked_task_ids, is_premium)
VALUES (
  'PREG-W11',
  'pregnancy',
  11,
  'The Fig',
  'Fig size. Tooth buds forming. Skin is transparent.',
  'Blood volume increasing. She may feel warmer or dizzy.',
  ARRAY['Hydration Ops: Ensure she has a 40oz water bottle', 'Dehydration causes headaches.'],
  'Compliment her changes. ''You look glowing'' > ''You look big''.',
  'End of First Trimester approaching.',
  'CDC',
  ARRAY['PREG-W11-01'],
  FALSE
) ON CONFLICT (briefing_id) DO NOTHING;

INSERT INTO briefing_templates (briefing_id, stage, week, title, baby_update, mom_update, dad_focus, relationship_tip, coming_up, medical_source, linked_task_ids, is_premium)
VALUES (
  'PREG-W12',
  'pregnancy',
  12,
  'The Safe Zone',
  'Plum size. Reflexes developing. Miscarriage risk drops significantly.',
  'Nausea often subsides (placenta takes over). Energy may return slightly.',
  ARRAY['Announcement Strategy: Plan the social media/family reveal', 'Clear the nursery room.'],
  'Celebrate the milestone. Dinner out (if she can eat).',
  'Second Trimester Energy Surge.',
  'NIH',
  ARRAY['PREG-W12-01'],
  FALSE
) ON CONFLICT (briefing_id) DO NOTHING;

INSERT INTO briefing_templates (briefing_id, stage, week, title, baby_update, mom_update, dad_focus, relationship_tip, coming_up, medical_source, linked_task_ids, is_premium)
VALUES (
  'PREG-W13',
  'pregnancy',
  13,
  'The Vocal Cords',
  'Lemon size. Vocal cords forming. Fingerprints developed.',
  'Libido may return due to increased blood flow. ''The Glow'' appears.',
  ARRAY['Daycare RFP: Research local daycares', 'Waitlists are 9-12 months.'],
  'Intimacy may change. Follow her lead and comfort level.',
  'Gender Reveal window.',
  'AAP',
  ARRAY['PREG-W13-01'],
  FALSE
) ON CONFLICT (briefing_id) DO NOTHING;

INSERT INTO briefing_templates (briefing_id, stage, week, title, baby_update, mom_update, dad_focus, relationship_tip, coming_up, medical_source, linked_task_ids, is_premium)
VALUES (
  'PREG-W14',
  'pregnancy',
  14,
  'The Second Trimester',
  'Orange size. Kidneys making urine. Lanugo (hair) covers body.',
  'Round Ligament Pain intensifies. Bump may start showing.',
  ARRAY['Maternity Clothes Ops: Offer budget/time to shop for clothes that fit.'],
  'Validate her body image. It''s a major psychological shift.',
  'Quad Screen (Week 15-20).',
  'Mayo Clinic',
  ARRAY['PREG-W14-01'],
  FALSE
) ON CONFLICT (briefing_id) DO NOTHING;

INSERT INTO briefing_templates (briefing_id, stage, week, title, baby_update, mom_update, dad_focus, relationship_tip, coming_up, medical_source, linked_task_ids, is_premium)
VALUES (
  'PREG-W15',
  'pregnancy',
  15,
  'The Light Sensor',
  'Apple size. Eyes sense light. Legs growing longer than arms.',
  'Pregnancy Brain'' (forgetfulness) is real. Volume loss in grey matter (temporary).',
  ARRAY['Dental Audit: Schedule cleaning for her (gingivitis risk)', 'Do yours too.'],
  'Write things down for her. Don''t mock the forgetfulness.',
  '16 Week Appointment.',
  'ACOG',
  ARRAY['PREG-W15-01'],
  FALSE
) ON CONFLICT (briefing_id) DO NOTHING;

INSERT INTO briefing_templates (briefing_id, stage, week, title, baby_update, mom_update, dad_focus, relationship_tip, coming_up, medical_source, linked_task_ids, is_premium)
VALUES (
  'PREG-W16',
  'pregnancy',
  16,
  'The Quickening',
  'Avocado size. Heart pumping 25qts blood/day.',
  'Flutters'' (movement) may be felt. Back pain begins.',
  ARRAY['Registry Ops: Start building', 'Focus on utility (Car Seat) over cute (Onesies).'],
  'Ask to feel the belly. Connect with the physical reality.',
  'Anatomy Scan (Week 20).',
  'APA',
  ARRAY['PREG-W16-01'],
  FALSE
) ON CONFLICT (briefing_id) DO NOTHING;

INSERT INTO briefing_templates (briefing_id, stage, week, title, baby_update, mom_update, dad_focus, relationship_tip, coming_up, medical_source, linked_task_ids, is_premium)
VALUES (
  'PREG-W17',
  'pregnancy',
  17,
  'The Skeleton',
  'Pear size. Cartilage hardening to bone. Umbilical cord thickening.',
  'Vivid dreams common. Balance issues as center of gravity shifts.',
  ARRAY['Nursery Prep: Paint now while she can help/tolerate fumes', 'Assemble heavy furniture.'],
  'Listen to her dreams. They are processing anxiety.',
  'Mid-pregnancy ultrasound.',
  'Sleep Foundation',
  ARRAY['PREG-W17-01'],
  FALSE
) ON CONFLICT (briefing_id) DO NOTHING;

INSERT INTO briefing_templates (briefing_id, stage, week, title, baby_update, mom_update, dad_focus, relationship_tip, coming_up, medical_source, linked_task_ids, is_premium)
VALUES (
  'PREG-W18',
  'pregnancy',
  18,
  'The Ears',
  'Bell Pepper size. Ears in final position. Myelin forming on nerves.',
  'Blood pressure may drop. Dizziness upon standing.',
  ARRAY['Talk to the Bump', 'Baby can hear low frequency (male) voices well.'],
  'Massage her lower back. Sciatica risk increases.',
  'Anatomy Scan.',
  'Mayo Clinic',
  ARRAY['PREG-W18-01'],
  FALSE
) ON CONFLICT (briefing_id) DO NOTHING;

INSERT INTO briefing_templates (briefing_id, stage, week, title, baby_update, mom_update, dad_focus, relationship_tip, coming_up, medical_source, linked_task_ids, is_premium)
VALUES (
  'PREG-W19',
  'pregnancy',
  19,
  'The Vernix',
  'Mango size. Vernix (waxy coat) protects skin.',
  'Leg cramps at night. Heartburn (acid reflux) begins.',
  ARRAY['Pediatrician RFI: Build list of 3 doctors to interview', 'Check weekend hours.'],
  'Cook low-acid meals. Avoid spicy/tomato based dinners.',
  'Halfway point.',
  'WebMD',
  ARRAY['PREG-W19-01'],
  FALSE
) ON CONFLICT (briefing_id) DO NOTHING;

INSERT INTO briefing_templates (briefing_id, stage, week, title, baby_update, mom_update, dad_focus, relationship_tip, coming_up, medical_source, linked_task_ids, is_premium)
VALUES (
  'PREG-W20',
  'pregnancy',
  20,
  'The Anatomy Audit',
  'Banana size. Swallowing fluid. Gender visible. 50% cooked.',
  'Belly button may pop out. Skin pigmentation (Line Nigra).',
  ARRAY['THE SCAN: Do not miss this', 'Checks heart chambers/brain structure', 'Bring notebook.'],
  'Take a ''Halfway There'' photo. Mark the occasion.',
  'Viability (Week 24).',
  'RadiologyInfo',
  ARRAY['PREG-W20-01'],
  FALSE
) ON CONFLICT (briefing_id) DO NOTHING;

INSERT INTO briefing_templates (briefing_id, stage, week, title, baby_update, mom_update, dad_focus, relationship_tip, coming_up, medical_source, linked_task_ids, is_premium)
VALUES (
  'PREG-W21',
  'pregnancy',
  21,
  'The Digestion',
  'Carrot size. Digestive system maturing.',
  'Stretch marks may appear. Varicose veins risk.',
  ARRAY['Furniture Ops: Order crib/glider', 'Supply chains lag 8-12 weeks.'],
  'Buy her cocoa butter/bio-oil. Offer to apply it.',
  'Glucose Test.',
  'AAD',
  ARRAY['PREG-W21-01'],
  FALSE
) ON CONFLICT (briefing_id) DO NOTHING;

INSERT INTO briefing_templates (briefing_id, stage, week, title, baby_update, mom_update, dad_focus, relationship_tip, coming_up, medical_source, linked_task_ids, is_premium)
VALUES (
  'PREG-W22',
  'pregnancy',
  22,
  'The Grip',
  'Spaghetti Squash size. Grip strong. Sense of touch.',
  'Feet swelling (edema). Rings may not fit.',
  ARRAY['Life Insurance: Apply now', 'You have a dependent.'],
  'Plan a ''Babymoon'' weekend. Travel gets hard soon.',
  'Ear development.',
  'LegalZoom',
  ARRAY['PREG-W22-01'],
  FALSE
) ON CONFLICT (briefing_id) DO NOTHING;

INSERT INTO briefing_templates (briefing_id, stage, week, title, baby_update, mom_update, dad_focus, relationship_tip, coming_up, medical_source, linked_task_ids, is_premium)
VALUES (
  'PREG-W23',
  'pregnancy',
  23,
  'The Hearing',
  'Large Mango size. Can hear loud noises outside womb.',
  'Braxton Hicks (practice contractions) may start. Mild/irregular.',
  ARRAY['Hospital Tour: Schedule L&D tour', 'Know where to park.'],
  'Get her water if she cramps. Dehydration triggers contractions.',
  'Viability next week.',
  'ACOG',
  ARRAY['PREG-W23-01'],
  FALSE
) ON CONFLICT (briefing_id) DO NOTHING;

INSERT INTO briefing_templates (briefing_id, stage, week, title, baby_update, mom_update, dad_focus, relationship_tip, coming_up, medical_source, linked_task_ids, is_premium)
VALUES (
  'PREG-W24',
  'pregnancy',
  24,
  'Viability Week',
  'Corn size. VIABLE if born now (NICU). Lungs producing surfactant.',
  'Glucose Screening Test (Gestational Diabetes).',
  ARRAY['Driver Duty: Drive her to Glucose test (sugar crash risk)', 'Babyproofing Phase 1.'],
  'Rub her feet. Edema is painful.',
  '3rd Trimester.',
  'ACOG',
  ARRAY['PREG-W24-01'],
  FALSE
) ON CONFLICT (briefing_id) DO NOTHING;

INSERT INTO briefing_templates (briefing_id, stage, week, title, baby_update, mom_update, dad_focus, relationship_tip, coming_up, medical_source, linked_task_ids, is_premium)
VALUES (
  'PREG-W25',
  'pregnancy',
  25,
  'The Fat Stores',
  'Rutabaga size. Adding baby fat. Hair growing.',
  'Hemorrhoids/Constipation common. Sleep difficult.',
  ARRAY['Fiber Ops: Ensure high fiber diet', 'Buy Tucks pads (don''t ask/just buy).'],
  'Do not mention the hemorrhoids. Just help.',
  'Tdap Vaccine window.',
  'Mayo Clinic',
  ARRAY['PREG-W25-01'],
  FALSE
) ON CONFLICT (briefing_id) DO NOTHING;

INSERT INTO briefing_templates (briefing_id, stage, week, title, baby_update, mom_update, dad_focus, relationship_tip, coming_up, medical_source, linked_task_ids, is_premium)
VALUES (
  'PREG-W26',
  'pregnancy',
  26,
  'The Eye Opener',
  'Scallion size. Eyes open/close. Blue eyes (pigment later).',
  'Rib pain (baby kicking ribs). Shortness of breath.',
  ARRAY['Car Seat Purchase: Buy the bucket seat', 'Locate inspection station.'],
  'Help her put on socks/shoes. She can''t reach.',
  'Third Trimester.',
  'NHTSA',
  ARRAY['PREG-W26-01'],
  FALSE
) ON CONFLICT (briefing_id) DO NOTHING;

INSERT INTO briefing_templates (briefing_id, stage, week, title, baby_update, mom_update, dad_focus, relationship_tip, coming_up, medical_source, linked_task_ids, is_premium)
VALUES (
  'PREG-W27',
  'pregnancy',
  27,
  'The Brain Wave',
  'Cauliflower size. Brain activity spikes. Sleep cycles.',
  'Anxiety about labor may spike.',
  ARRAY['Pediatrician Interviews: Schedule meet & greets.'],
  'Ask about her labor fears. Just listen.',
  'Rhogam shot (if blood type negative).',
  'AAP',
  ARRAY['PREG-W27-01'],
  FALSE
) ON CONFLICT (briefing_id) DO NOTHING;

INSERT INTO briefing_templates (briefing_id, stage, week, title, baby_update, mom_update, dad_focus, relationship_tip, coming_up, medical_source, linked_task_ids, is_premium)
VALUES (
  'PREG-W28',
  'pregnancy',
  28,
  'The Third Trimester',
  'Eggplant size. 2.5 lbs. 90% survival rate.',
  'Fatigue returns. Sciatica possible.',
  ARRAY['Vaccine: Get Tdap booster (Whooping Cough)', 'Car maintenance check.'],
  'Take over floor-level chores (vacuuming).',
  'Baby Shower.',
  'CDC',
  ARRAY['PREG-W28-01'],
  FALSE
) ON CONFLICT (briefing_id) DO NOTHING;

INSERT INTO briefing_templates (briefing_id, stage, week, title, baby_update, mom_update, dad_focus, relationship_tip, coming_up, medical_source, linked_task_ids, is_premium)
VALUES (
  'PREG-W29',
  'pregnancy',
  29,
  'The Thermostat',
  'Butternut Squash size. Regulating body temp.',
  'Varicose veins. Frequent urination.',
  ARRAY['Diaper Stock: Buy 1 box Newborn/1 box Size 1.'],
  'Don''t complain about your sleep if she wakes up 4x.',
  'Growth Scan.',
  'WebMD',
  ARRAY['PREG-W29-01'],
  FALSE
) ON CONFLICT (briefing_id) DO NOTHING;

INSERT INTO briefing_templates (briefing_id, stage, week, title, baby_update, mom_update, dad_focus, relationship_tip, coming_up, medical_source, linked_task_ids, is_premium)
VALUES (
  'PREG-W30',
  'pregnancy',
  30,
  'The Memory Foam',
  'Cabbage size. 3lbs. Brain folding for memory.',
  'Heartburn severe. Pillow fortress required for sleep.',
  ARRAY['Hospital Bag: Start packing list', 'Emergency numbers on fridge.'],
  'Cook mild food. Late night snacks.',
  'Fetal position check.',
  'Sleep Fnd',
  ARRAY['PREG-W30-01'],
  FALSE
) ON CONFLICT (briefing_id) DO NOTHING;

INSERT INTO briefing_templates (briefing_id, stage, week, title, baby_update, mom_update, dad_focus, relationship_tip, coming_up, medical_source, linked_task_ids, is_premium)
VALUES (
  'PREG-W31',
  'pregnancy',
  31,
  'The Senses',
  'Coconut size. All 5 senses functional.',
  'Nesting'' instinct kicks in (cleaning frenzy).',
  ARRAY['Gear Assembly: Crib/Swing', 'Break down boxes immediately.'],
  'Support the nesting. Don''t fight the cleaning.',
  'Baby drops soon.',
  'APA',
  ARRAY['PREG-W31-01'],
  FALSE
) ON CONFLICT (briefing_id) DO NOTHING;

INSERT INTO briefing_templates (briefing_id, stage, week, title, baby_update, mom_update, dad_focus, relationship_tip, coming_up, medical_source, linked_task_ids, is_premium)
VALUES (
  'PREG-W32',
  'pregnancy',
  32,
  'The Practice Breaths',
  'Jicama size. Practicing breathing.',
  'Braxton Hicks intensify. Leaking colostrum.',
  ARRAY['Hospital Pre-Reg: Complete admin forms online', 'Test drive route.'],
  'Buy nursing pads for leaks.',
  'Pertussis immunity.',
  'ACOG',
  ARRAY['PREG-W32-01'],
  FALSE
) ON CONFLICT (briefing_id) DO NOTHING;

INSERT INTO briefing_templates (briefing_id, stage, week, title, baby_update, mom_update, dad_focus, relationship_tip, coming_up, medical_source, linked_task_ids, is_premium)
VALUES (
  'PREG-W33',
  'pregnancy',
  33,
  'The Immune Transfer',
  'Pineapple size. Receiving antibodies.',
  'Insomnia. Overheating.',
  ARRAY['Pet Ops: Arrange dog sitter for hospital stay.'],
  'Keep house cool. She is a radiator.',
  'GBS Test.',
  'CDC',
  ARRAY['PREG-W33-01'],
  FALSE
) ON CONFLICT (briefing_id) DO NOTHING;

INSERT INTO briefing_templates (briefing_id, stage, week, title, baby_update, mom_update, dad_focus, relationship_tip, coming_up, medical_source, linked_task_ids, is_premium)
VALUES (
  'PREG-W34',
  'pregnancy',
  34,
  'The Descent',
  'Cantaloupe size. Testicles descending (boys).',
  'Pelvic pressure increases. Vision blurs.',
  ARRAY['Work Handoff: Document tasks', 'Meal Prep (freezer).'],
  'Massage hips/glutes.',
  'Late Pre-term.',
  'Mayo Clinic',
  ARRAY['PREG-W34-01'],
  FALSE
) ON CONFLICT (briefing_id) DO NOTHING;

INSERT INTO briefing_templates (briefing_id, stage, week, title, baby_update, mom_update, dad_focus, relationship_tip, coming_up, medical_source, linked_task_ids, is_premium)
VALUES (
  'PREG-W35',
  'pregnancy',
  35,
  'The Rapid Gain',
  'Honeydew size. Gaining 0.5lb/week.',
  'Clumsiness (center of gravity).',
  ARRAY['Car Seat Base: Install in car', 'Bag Check.'],
  'Encourage rest. Marathon soon.',
  'GBS Swab.',
  'NHTSA',
  ARRAY['PREG-W35-01'],
  FALSE
) ON CONFLICT (briefing_id) DO NOTHING;

INSERT INTO briefing_templates (briefing_id, stage, week, title, baby_update, mom_update, dad_focus, relationship_tip, coming_up, medical_source, linked_task_ids, is_premium)
VALUES (
  'PREG-W36',
  'pregnancy',
  36,
  'The Drop',
  'Papaya size. Baby drops into pelvis (Lightening).',
  'Breathing easier/Walking harder (waddle).',
  ARRAY['Install Car Seat', 'Draft ''Baby is Here'' texts.'],
  'Discuss labor support role.',
  'Early Term.',
  'ACOG',
  ARRAY['PREG-W36-01'],
  FALSE
) ON CONFLICT (briefing_id) DO NOTHING;

INSERT INTO briefing_templates (briefing_id, stage, week, title, baby_update, mom_update, dad_focus, relationship_tip, coming_up, medical_source, linked_task_ids, is_premium)
VALUES (
  'PREG-W37',
  'pregnancy',
  37,
  'Early Term',
  'Romaine Lettuce size. Lungs ready.',
  'Cervix may efface/dilate. Mucus plug.',
  ARRAY['Logistics: Gas full', 'Phone volume ON.'],
  'Be patient. She is done being pregnant.',
  'Full Term.',
  'ACOG',
  ARRAY['PREG-W37-01'],
  FALSE
) ON CONFLICT (briefing_id) DO NOTHING;

INSERT INTO briefing_templates (briefing_id, stage, week, title, baby_update, mom_update, dad_focus, relationship_tip, coming_up, medical_source, linked_task_ids, is_premium)
VALUES (
  'PREG-W38',
  'pregnancy',
  38,
  'The Hand Grip',
  'Leek size. Grip strong.',
  'Anxiety. ''Lightning Crotch'' (nerve pain).',
  ARRAY['Final Sweep: Camera batteries', 'Snacks packed.'],
  'Distraction duty. Movie/Walk.',
  'Delivery Day?',
  'WebMD',
  ARRAY['PREG-W38-01'],
  FALSE
) ON CONFLICT (briefing_id) DO NOTHING;

INSERT INTO briefing_templates (briefing_id, stage, week, title, baby_update, mom_update, dad_focus, relationship_tip, coming_up, medical_source, linked_task_ids, is_premium)
VALUES (
  'PREG-W39',
  'pregnancy',
  39,
  'Full Term',
  'Watermelon size. Ready for launch.',
  'Discomfort maxed. Mental game tough.',
  ARRAY['Advocacy: Block ''Is baby here?'' texts.'],
  'Tell her you trust her strength.',
  'Due Date.',
  'Mayo Clinic',
  ARRAY['PREG-W39-01'],
  FALSE
) ON CONFLICT (briefing_id) DO NOTHING;

INSERT INTO briefing_templates (briefing_id, stage, week, title, baby_update, mom_update, dad_focus, relationship_tip, coming_up, medical_source, linked_task_ids, is_premium)
VALUES (
  'PREG-W40',
  'pregnancy',
  40,
  'The Arrival',
  'Pumpkin size. Bones soft for delivery.',
  'Labor imminent. 5-1-1 Rule.',
  ARRAY['Go Time: Execute route', 'Support mom.'],
  'You got this.',
  'Fourth Trimester.',
  'ACOG',
  ARRAY['PREG-W40-01'],
  FALSE
) ON CONFLICT (briefing_id) DO NOTHING;

INSERT INTO briefing_templates (briefing_id, stage, week, title, baby_update, mom_update, dad_focus, relationship_tip, coming_up, medical_source, linked_task_ids, is_premium)
VALUES (
  'POST-W01',
  'post-birth',
  1,
  'Survival Week',
  'Stomach cherry sized. Needs food q2h.',
  'Recovery/Baby Blues. Soreness.',
  ARRAY['Gatekeeper: No visitors', 'Admin: Birth Cert/SSN.'],
  'Hydrate her while she feeds.',
  'Umbilical cord.',
  'AAP',
  ARRAY['POST-W01-01'],
  FALSE
) ON CONFLICT (briefing_id) DO NOTHING;

INSERT INTO briefing_templates (briefing_id, stage, week, title, baby_update, mom_update, dad_focus, relationship_tip, coming_up, medical_source, linked_task_ids, is_premium)
VALUES (
  'POST-W02',
  'post-birth',
  2,
  'Cluster Feed',
  'Growth spurt. Eating constantly.',
  'Healing. Exhaustion sets in.',
  ARRAY['Shift Work: Take 8pm-1am shift', 'Insurance add.'],
  'Check HER recovery.',
  'Peak Crying.',
  'WIC',
  ARRAY['POST-W02-01'],
  FALSE
) ON CONFLICT (briefing_id) DO NOTHING;

INSERT INTO briefing_templates (briefing_id, stage, week, title, baby_update, mom_update, dad_focus, relationship_tip, coming_up, medical_source, linked_task_ids, is_premium)
VALUES (
  'POST-W03',
  'post-birth',
  3,
  'The Awakening',
  'Awake periods longer.',
  'Adrenaline gone. Sleep deprivation.',
  ARRAY['Pediatrician: Book 1mo visit', 'PFL claims.'],
  'Bring snacks. Breastfeeding burns 500cal.',
  'Social Smile.',
  'Sleep Fnd',
  ARRAY['POST-W03-01'],
  FALSE
) ON CONFLICT (briefing_id) DO NOTHING;

INSERT INTO briefing_templates (briefing_id, stage, week, title, baby_update, mom_update, dad_focus, relationship_tip, coming_up, medical_source, linked_task_ids, is_premium)
VALUES (
  'POST-W04',
  'post-birth',
  4,
  'One Month Mark',
  'Head control improving.',
  'PPD Risk. Watch for detachment.',
  ARRAY['Bottles: Introduce bottle (nipple confusion is rare).'],
  'Encourage her to leave house solo.',
  'Vaccines.',
  'Postpartum',
  ARRAY['POST-W04-01'],
  FALSE
) ON CONFLICT (briefing_id) DO NOTHING;

INSERT INTO briefing_templates (briefing_id, stage, week, title, baby_update, mom_update, dad_focus, relationship_tip, coming_up, medical_source, linked_task_ids, is_premium)
VALUES (
  'POST-W05',
  'post-birth',
  5,
  'The Peak',
  'Peak fussiness (Purple Crying).',
  'Feeling ''touched out''.',
  ARRAY['Baby Wearing: Wear baby for evening fuss.'],
  'Take baby for a walk so she can shower.',
  'Smile.',
  'Happiest Baby',
  ARRAY['POST-W05-01'],
  FALSE
) ON CONFLICT (briefing_id) DO NOTHING;

INSERT INTO briefing_templates (briefing_id, stage, week, title, baby_update, mom_update, dad_focus, relationship_tip, coming_up, medical_source, linked_task_ids, is_premium)
VALUES (
  'POST-W06',
  'post-birth',
  6,
  'The Smile',
  'Social smiles appear. Tracking objects.',
  '6-Week Checkup (Clearance).',
  ARRAY['Vaccine Prep: Buy Tylenol', 'Discuss intimacy.'],
  'Date Night In.',
  '2 Month Shots.',
  'AAP',
  ARRAY['POST-W06-01'],
  FALSE
) ON CONFLICT (briefing_id) DO NOTHING;

INSERT INTO briefing_templates (briefing_id, stage, week, title, baby_update, mom_update, dad_focus, relationship_tip, coming_up, medical_source, linked_task_ids, is_premium)
VALUES (
  'POST-W07',
  'post-birth',
  7,
  'The Hands',
  'Batting at objects. Hands open.',
  'Routine forming.',
  ARRAY['Play: Tummy time 5 min/day.'],
  'Take photos of them together.',
  'Sleep stretches.',
  'Pathways',
  ARRAY['POST-W07-01'],
  FALSE
) ON CONFLICT (briefing_id) DO NOTHING;

INSERT INTO briefing_templates (briefing_id, stage, week, title, baby_update, mom_update, dad_focus, relationship_tip, coming_up, medical_source, linked_task_ids, is_premium)
VALUES (
  'POST-W08',
  'post-birth',
  8,
  'Vaccine Week',
  '2 Month Shots (fever common).',
  'Anxiety about daycare/work.',
  ARRAY['Admin: Check SSN arrived', 'Daycare forms.'],
  'Comfort baby post-shots.',
  'Return to work.',
  'CDC',
  ARRAY['POST-W08-01'],
  FALSE
) ON CONFLICT (briefing_id) DO NOTHING;

INSERT INTO briefing_templates (briefing_id, stage, week, title, baby_update, mom_update, dad_focus, relationship_tip, coming_up, medical_source, linked_task_ids, is_premium)
VALUES (
  'POST-W09',
  'post-birth',
  9,
  'Patterns',
  'Sleep cycles maturing.',
  'Hormones leveling out.',
  ARRAY['Routine: Bath/Book/Bed consistency.'],
  'Ask about her day (adult conversation).',
  'Rolling over.',
  'Sleep Fnd',
  ARRAY['POST-W09-01'],
  FALSE
) ON CONFLICT (briefing_id) DO NOTHING;

INSERT INTO briefing_templates (briefing_id, stage, week, title, baby_update, mom_update, dad_focus, relationship_tip, coming_up, medical_source, linked_task_ids, is_premium)
VALUES (
  'POST-W10',
  'post-birth',
  10,
  'The Voice',
  'Cooing/Babbling.',
  'Hair loss (postpartum shed).',
  ARRAY['Reading: Read simple books', 'Narrate life.'],
  'Tell her she''s beautiful (hair loss is hard).',
  'Grabbing.',
  'Zero to Three',
  ARRAY['POST-W10-01'],
  FALSE
) ON CONFLICT (briefing_id) DO NOTHING;

INSERT INTO briefing_templates (briefing_id, stage, week, title, baby_update, mom_update, dad_focus, relationship_tip, coming_up, medical_source, linked_task_ids, is_premium)
VALUES (
  'POST-W11',
  'post-birth',
  11,
  'The Roll',
  'Rolling belly to back.',
  'Work/Life balance struggle.',
  ARRAY['Safety: Stop swaddling if rolling.'],
  'Plan weekend activity.',
  '4 Month Regression.',
  'AAP',
  ARRAY['POST-W11-01'],
  FALSE
) ON CONFLICT (briefing_id) DO NOTHING;

INSERT INTO briefing_templates (briefing_id, stage, week, title, baby_update, mom_update, dad_focus, relationship_tip, coming_up, medical_source, linked_task_ids, is_premium)
VALUES (
  'POST-W12',
  'post-birth',
  12,
  'Graduation',
  'Exiting 4th Trimester. Laughing.',
  'Feeling more ''human''.',
  ARRAY['Review Budget', 'Plan first trip?'],
  'Celebrate surviving 3 months.',
  'Solids soon.',
  'CDC',
  ARRAY['POST-W12-01'],
  FALSE
) ON CONFLICT (briefing_id) DO NOTHING;

INSERT INTO briefing_templates (briefing_id, stage, week, title, baby_update, mom_update, dad_focus, relationship_tip, coming_up, medical_source, linked_task_ids, is_premium)
VALUES (
  'POST-M04',
  'post-birth',
  16,
  'Sleep Regression',
  'Adult sleep cycles. Waking up.',
  'Sleep deprivation returns.',
  ARRAY['Sleep Training: Agree on method', 'Lower crib.'],
  'Don''t fight at 3am.',
  'Solids (M6).',
  'Sleep Fnd',
  ARRAY['POST-M04-01'],
  FALSE
) ON CONFLICT (briefing_id) DO NOTHING;

INSERT INTO briefing_templates (briefing_id, stage, week, title, baby_update, mom_update, dad_focus, relationship_tip, coming_up, medical_source, linked_task_ids, is_premium)
VALUES (
  'POST-M05',
  'post-birth',
  20,
  'The Core',
  'Sitting with support.',
  'Back to work reality.',
  ARRAY['High Chair Research', 'Buy bibs.'],
  'Plan a date.',
  'Teething.',
  'AAP',
  ARRAY['POST-M05-01'],
  FALSE
) ON CONFLICT (briefing_id) DO NOTHING;

INSERT INTO briefing_templates (briefing_id, stage, week, title, baby_update, mom_update, dad_focus, relationship_tip, coming_up, medical_source, linked_task_ids, is_premium)
VALUES (
  'POST-M06',
  'post-birth',
  24,
  'Solids Boot',
  'Sitting up. Tongue thrust gone.',
  'Excitement/Nerves re: choking.',
  ARRAY['CPR Refresher', 'Buy First Foods.'],
  'Watch for allergies.',
  'Crawling.',
  'CDC',
  ARRAY['POST-M06-01'],
  FALSE
) ON CONFLICT (briefing_id) DO NOTHING;

INSERT INTO briefing_templates (briefing_id, stage, week, title, baby_update, mom_update, dad_focus, relationship_tip, coming_up, medical_source, linked_task_ids, is_premium)
VALUES (
  'POST-M07',
  'post-birth',
  28,
  'Teething',
  'First tooth? Drooling.',
  'Broken sleep due to teeth.',
  ARRAY['Babyproof: Cords/Outlets', 'Floor audit.'],
  'Give her a break.',
  'Mobility.',
  'ADA',
  ARRAY['POST-M07-01'],
  FALSE
) ON CONFLICT (briefing_id) DO NOTHING;

INSERT INTO briefing_templates (briefing_id, stage, week, title, baby_update, mom_update, dad_focus, relationship_tip, coming_up, medical_source, linked_task_ids, is_premium)
VALUES (
  'POST-M08',
  'post-birth',
  32,
  'The Crawl',
  'Scooting/Crawling. Pincer grasp.',
  'Chasing baby. Physically tiring.',
  ARRAY['Install Gates', 'Lock chemicals.'],
  'Plan family outing.',
  'Separation Anxiety.',
  'AAP',
  ARRAY['POST-M08-01'],
  FALSE
) ON CONFLICT (briefing_id) DO NOTHING;

INSERT INTO briefing_templates (briefing_id, stage, week, title, baby_update, mom_update, dad_focus, relationship_tip, coming_up, medical_source, linked_task_ids, is_premium)
VALUES (
  'POST-M09',
  'post-birth',
  36,
  'Separation',
  'Object permanence (cries when you leave).',
  'Guilt about leaving.',
  ARRAY['Car Seat: Check height limits', 'Convertible seat?'],
  'Play Peek-a-boo.',
  'Standing.',
  'Zero to Three',
  ARRAY['POST-M09-01'],
  FALSE
) ON CONFLICT (briefing_id) DO NOTHING;

INSERT INTO briefing_templates (briefing_id, stage, week, title, baby_update, mom_update, dad_focus, relationship_tip, coming_up, medical_source, linked_task_ids, is_premium)
VALUES (
  'POST-M10',
  'post-birth',
  40,
  'Cruising',
  'Pulling to stand. Cruising furniture.',
  'Safety anxiety.',
  ARRAY['Lower crib mattress', 'Anchor furniture.'],
  'Take videos.',
  'Walking.',
  'AAP',
  ARRAY['POST-M10-01'],
  FALSE
) ON CONFLICT (briefing_id) DO NOTHING;

INSERT INTO briefing_templates (briefing_id, stage, week, title, baby_update, mom_update, dad_focus, relationship_tip, coming_up, medical_source, linked_task_ids, is_premium)
VALUES (
  'POST-M11',
  'post-birth',
  44,
  'First Words',
  'Mama/Dada. Pointing.',
  'Planning birthday.',
  ARRAY['First Shoes: Flexible soles', 'Party prep.'],
  'Help with party logistics.',
  '1 Year.',
  'CDC',
  ARRAY['POST-M11-01'],
  FALSE
) ON CONFLICT (briefing_id) DO NOTHING;

INSERT INTO briefing_templates (briefing_id, stage, week, title, baby_update, mom_update, dad_focus, relationship_tip, coming_up, medical_source, linked_task_ids, is_premium)
VALUES (
  'POST-M12',
  'post-birth',
  48,
  'The Toddler',
  'Walking. Cow''s milk transition.',
  'Emotional: ''My baby is 1''.',
  ARRAY['Vet Visit 12mo', 'Dentist #1', 'Purge baby clothes.'],
  'Celebrate HER year.',
  'Tantrums.',
  'AAP',
  ARRAY['POST-M12-01'],
  FALSE
) ON CONFLICT (briefing_id) DO NOTHING;

INSERT INTO briefing_templates (briefing_id, stage, week, title, baby_update, mom_update, dad_focus, relationship_tip, coming_up, medical_source, linked_task_ids, is_premium)
VALUES (
  'POST-M15',
  'post-birth',
  60,
  'The Climber',
  'Climbing everything. 5-10 words.',
  'Exhaustion level: Cardio.',
  ARRAY['Safety: Window locks', 'Falls risk.'],
  'Playground duty.',
  '18mo check.',
  'CDC',
  ARRAY['POST-M15-01'],
  FALSE
) ON CONFLICT (briefing_id) DO NOTHING;

INSERT INTO briefing_templates (briefing_id, stage, week, title, baby_update, mom_update, dad_focus, relationship_tip, coming_up, medical_source, linked_task_ids, is_premium)
VALUES (
  'POST-M18',
  'post-birth',
  72,
  'The Independence',
  'Running. ''No''. Tantrums.',
  'Frustration with behavior.',
  ARRAY['Discipline: Redirection', '18mo Autism screen.'],
  'Patience.',
  'Potty Train (M24).',
  'Zero to Three',
  ARRAY['POST-M18-01'],
  FALSE
) ON CONFLICT (briefing_id) DO NOTHING;

INSERT INTO briefing_templates (briefing_id, stage, week, title, baby_update, mom_update, dad_focus, relationship_tip, coming_up, medical_source, linked_task_ids, is_premium)
VALUES (
  'POST-M21',
  'post-birth',
  84,
  'The Mimic',
  'Copying everything. 20+ words.',
  'Laughing more.',
  ARRAY['Watch your language', 'Model kindness.'],
  'One-on-one dates.',
  '2 Year.',
  'AAP',
  ARRAY['POST-M21-01'],
  FALSE
) ON CONFLICT (briefing_id) DO NOTHING;

INSERT INTO briefing_templates (briefing_id, stage, week, title, baby_update, mom_update, dad_focus, relationship_tip, coming_up, medical_source, linked_task_ids, is_premium)
VALUES (
  'POST-M24',
  'post-birth',
  96,
  'The Two Year Old',
  '2-word sentences. Jumping.',
  'Potty training readiness?',
  ARRAY['Potty Ops: Buy potty', 'Read ''Oh Crap''.'],
  'Celebrate 2 years.',
  'Preschool.',
  'CDC',
  ARRAY['POST-M24-01'],
  FALSE
) ON CONFLICT (briefing_id) DO NOTHING;

