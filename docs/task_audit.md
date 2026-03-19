# ParentLogs Task Audit — Complete Overhaul Specification

## Context for Claude Code
This document contains the complete specification for updating all 227 tasks in the `task_templates` table of the ParentLogs Supabase database (project: `oeeeiquclwfpypojjigx`). Every change is informed by the founder's personal experience as a first-time dad, dictated across pre-pregnancy through year one. The voice should be: direct, practical, dad-ops framing, no condescension, no fluff. Medical claims must be attributed. Personal experience stories should be woven into `why_it_matters` fields.

---

## PHASE 1: DELETE DUPLICATES (9 tasks)

Before deleting, merge useful content from the duplicate into the keeper.

### Merge then Delete:

1. **PREG-W26-003** "Birth Plan First Draft" → DELETE (duplicate of PREG-W22-001 "Start Birth Plan Draft")
2. **PREG-W28-008** "Maternity Photos Schedule" → DELETE (duplicate of PREG-W22-002 "Hire Photographer for Maternity")  
3. **PREG-W38-002** "Prepare Freezer Meals" → Merge "10-15 easy meals reheated one-handed" into PREG-W30-005, then DELETE
4. **PREG-W39-004** "House Cleaning" → DELETE (duplicate of PREG-W36-010 "Nesting Deep Clean")
5. **PREG-W38-010** "Signs of Labor Review" → Merge "contractions, water breaking, bloody show" into PREG-W32-006, then DELETE
6. **POST-W03-002** "Start Tummy Time" → Merge into POST-W04-003, then DELETE
7. **POST-W40-002** "First Shoes Fitting" → DELETE (duplicate of POST-W48-002)
8. **POST-W20-004** "Sippy Cup Practice" → DELETE (duplicate of POST-W28-001)
9. **POST-W64-001** "Potty Training Readiness" → DELETE (duplicate of POST-W60-003)

---

## PHASE 2: CONSOLIDATE CATEGORIES (4 updates)

- PREG-W30-001 (Glider/Rocker): `furniture` → `gear`
- PREG-W36-020 (Meal Delivery Cards): `food` → `prep`  
- POST-W01-022 (Night Shift Schedule): `planning` → `admin`
- PREG-W24-020 (Airline Restrictions): `logistics` → `admin`

---

## PHASE 3: REASSIGN DAD-NATURAL TASKS (8 updates)

- PREG-W32-005 "Baby Monitor Setup" → `dad` (tech setup is dad-ops)
- PREG-W18-003 "Register for Classes" → `dad` (research and logistics)
- POST-W04-004 "Sleep Safety Audit" → `dad` (safety inspection)
- POST-W04-003 "Tummy Time Routine" → `dad` (bonding activity)
- POST-W38-001 "First Words Encouragement" → `dad` (bonding activity)
- POST-W30-001 "Crawling Encouragement" → `dad` (bonding activity)
- POST-W08-007 "Establish Bedtime Routine" → `dad` (from dictation: bath routine is dad's domain)
- POST-W06-002 "Date Night Planning" → `dad` (initiative should come from dad)

---

## PHASE 4: ADD NEW TASKS (~10 tasks)

These are gaps identified by walking the timeline as a first-time dad.

### NEW-001: Set Visitor Boundaries
- **task_id**: POST-W01-030
- **title**: Set Visitor Boundaries
- **description**: Before the baby arrives, agree with your partner on visitor rules for the first 2-4 weeks: who can visit and when, maximum visit length (30-60 min), hand washing required, no visits if sick, no kissing the baby's face. Communicate these rules to family and friends BEFORE delivery — it's much harder to enforce boundaries after the baby is here and everyone is excited.
- **stage**: post-birth
- **due_date_offset_days**: 1
- **default_assignee**: dad
- **category**: admin
- **priority**: must-do
- **why_it_matters**: Without clear boundaries, your home becomes a revolving door of visitors during the most exhausting week of your life. Your wife is recovering from surgery, bleeding, learning to breastfeed — she doesn't need an audience. You are the gatekeeper. This is one of the most important dad-ops roles in month one.
- **week**: 40

### NEW-002: Stock House for Survival Mode
- **task_id**: POST-W01-031
- **title**: Stock House for Survival Mode
- **description**: Before delivery, do a bulk run: paper towels, trash bags, toilet paper, laundry detergent, dish soap, hand soap, toiletries, and easy one-hand foods (protein bars, trail mix, pre-made sandwiches, fruit). You will not have time or energy to shop for weeks. Also set up a DoorDash/Uber Eats account if you don't have one — you'll use it daily.
- **stage**: post-birth
- **due_date_offset_days**: 0
- **default_assignee**: dad
- **category**: prep
- **priority**: must-do
- **why_it_matters**: Every dad thinks they've prepared enough. Every dad ends up at Target at 10 PM buying something they forgot. Minimize the trips by stocking aggressively. The diaper cream gave him a rash? New brand needed. The swaddle is too warm? Different model needed. You can't prevent every Target run, but you can prevent the avoidable ones.
- **week**: 40

### NEW-003: Learn Newborn Fever Protocol
- **task_id**: POST-W01-032
- **title**: Learn Newborn Fever Protocol
- **description**: Know this rule cold: rectal temperature above 100.4°F (38°C) in a baby under 3 months is an EMERGENCY — go to the ER immediately, no exceptions, no waiting to see if it goes down. For babies 3-6 months, call your pediatrician's after-hours line. Know how to use a rectal thermometer (the only accurate method for infants). Practice before you need it.
- **stage**: post-birth
- **due_date_offset_days**: 3
- **default_assignee**: dad
- **category**: safety
- **priority**: must-do
- **why_it_matters**: A fever in a newborn can indicate a serious infection. The window for intervention is small. At 2 AM when the baby feels warm, you need to know the number (100.4°F) and the action (ER, immediately) without Googling it in a panic.
- **week**: 40

### NEW-004: SSN Arrival Follow-Up
- **task_id**: POST-W06-020
- **title**: SSN Card Follow-Up
- **description**: The Social Security card typically arrives 2-6 weeks after application. If it hasn't arrived by week 6, call the SSA (1-800-772-1213) with your confirmation number. You need the SSN to add baby to health insurance, file taxes, open a 529 account, and apply for a passport.
- **stage**: post-birth
- **due_date_offset_days**: 42
- **default_assignee**: dad
- **category**: admin
- **priority**: must-do
- **why_it_matters**: If you miss the 30-day insurance enrollment window because the SSN hasn't arrived, you may face a coverage gap. Follow up proactively.
- **week**: 34

### NEW-005: Babyproofing Phase 1 (Pre-Mobility)
- **task_id**: POST-W12-030
- **title**: Babyproofing Phase 1 (Pre-Mobility)
- **description**: Before baby starts rolling and grabbing (3-4 months), do a first-pass safety sweep: cover outlets in main living areas, remove small objects from floors, secure dangling cords (blinds, phone chargers, lamps), move cleaning chemicals to high shelves, and install a baby gate at the top of stairs if you have them. This is the light pass — Phase 2 at month 6 is the full lockdown when crawling starts.
- **stage**: post-birth
- **due_date_offset_days**: 90
- **default_assignee**: dad
- **category**: safety
- **priority**: must-do
- **why_it_matters**: There's currently a 5-month gap between Sleep Safety Audit (month 1) and Babyproofing Phase 2 (month 6). Babies start reaching and grabbing by month 3-4. You don't want to discover the gap when your baby grabs a phone charger cord.
- **week**: 28

### NEW-006: Buy and Install Convertible Car Seat
- **task_id**: POST-W40-020
- **title**: Buy and Install Convertible Car Seat
- **description**: Most babies outgrow the infant bucket car seat by 10-14 months (height limit, not weight). Research and purchase a convertible car seat that stays rear-facing until at least age 2 (AAP recommendation). Install it using LATCH or seatbelt, and get it inspected by a CPST just like you did with the infant seat.
- **stage**: post-birth
- **due_date_offset_days**: 300
- **default_assignee**: dad
- **category**: safety
- **priority**: must-do
- **why_it_matters**: The research task exists at month 9 but there's no actual purchase/install task. Don't wait until your baby's head is above the infant seat — order early and have it ready.
- **week**: -2

### NEW-007: Apply for Baby Passport
- **task_id**: POST-W10-020
- **title**: Apply for Baby Passport
- **description**: If you plan any international travel, apply for the baby's passport early — processing takes 6-8 weeks (routine) or 2-3 weeks (expedited, extra fee). Both parents must be present at the post office with the baby. Bring: baby's birth certificate, both parents' IDs, a passport photo (hardest part — baby must have eyes open, mouth closed, no hands visible). Budget item already in your tracker.
- **stage**: post-birth
- **due_date_offset_days**: 75
- **default_assignee**: dad
- **category**: admin
- **priority**: good-to-do
- **why_it_matters**: Taking a passport photo of a 2-month-old who can't hold their head up is an adventure. Getting both parents to the post office simultaneously with a newborn requires planning. Start early if you want it before the first family trip.
- **week**: 30

---

## PHASE 5: REWRITE ALL THIN DESCRIPTIONS

For every task with description under 100 characters, rewrite with: (1) specific actionable steps, (2) dad angle where applicable, (3) practical details a first-time parent wouldn't know. Use content from the founder's dictation where applicable.

### DICTATION CONTENT → TASK MAPPING:

**From Pre-Pregnancy section:**
- "People think you need a perfect house, perfect income, a car, good finances. It's not true — it's all doable." → Seed into Budget Planning task description
- "Time doesn't stop for anyone" → Seed into why_it_matters for planning tasks

**From T1/Morning Sickness section:**
- Salt crackers + water in car, office, purse, bag → Already updated PREG-W08-002 ✓
- ER visit for IV fluids from dehydration → Already in why_it_matters ✓
- Food/smell aversions, friend's wife permanent onion allergy → Seed into First Trimester Fatigue Support description
- "Don't mind if suddenly she doesn't like the smell of your favorite meal" → Seed into PREG-W10-004

**From T2 section:**
- "Travel as much as you can... once you have the baby your travel is going to be severely impacted" → Seed into PREG-W24-002 (Plan Babymoon)
- "At 7 PM you're walking in Italy and want pizza — not happening anymore" → Seed into why_it_matters for Babymoon
- "Second trimester is a good time to sit down and plan housing, nursery, what to buy" → Seed into PREG-W24-001 (Nursery Room Clearance)
- "After certain weeks of pregnancy airlines don't allow women to fly" → Already in PREG-W24-020 ✓

**From T3 section:**
- Mimi belt → Already added as PREG-W28-020 ✓
- "Go visit the delivery hospital once — parking, where she has to walk, how does the room look, where will you sleep, do you need toothpaste" → Seed into PREG-W32-002 (Hospital Tour)
- "Try to go to some classes — delivery experience, breastfeeding, newborn care, CPR" → Seed into PREG-W18-003 (Register for Classes)
- "Baby went from looking like a dinosaur to a proper human... blew my mind" → Seed into why_it_matters for First Prenatal Appointment
- Singing to the baby, phone light on belly → Seed into a new good-to-do task or into PREG-W37-002 (Full Term Celebration)

**From Delivery section:**
- Birth plan with 4-5 copies for nurse shift handoffs → Already added as PREG-W37-020 ✓
- "Reducing stress = more oxytocin = less physical interventions = less pain" → Seed into why_it_matters for Hospital Tour
- "Create a delivery experience expectation document" → Seed into PREG-W22-001 (Start Birth Plan Draft)
- Ambient environment: dim lights, minimal interruptions, music, letting husband be intermediary → Seed into Birth Plan task descriptions
- Visit hospital beforehand: parking, check-in, room layout → Already in Hospital Tour scope

**From Breastfeeding section:**
- "Baby knows how to suck but not properly/efficiently — latch is critical" → Already in POST-W01-020 ✓
- Saliva two-way exchange: baby's saliva tells mom's body what antibodies/nutrients to produce → Seed into why_it_matters for breastfeeding tasks
- Grape-sized stomach = feeds every 2 hours → Seed into POST-W02-004 (Establish Feeding Routine)
- Side-lying breastfeeding position helps with night feeds and back pain → Seed into POST-W02-006 (Establish Night Routine)
- "Wife becomes very happy when breastfeeding — body produces oxytocin" → Seed into why_it_matters for lactation tasks
- "Ask doctor for help during breastfeeding and someone will come every time" → Already in POST-W01-020 ✓

**From T4 (0-3 months) section:**
- Diapering routine: remove diaper, clean with wet wipe, dry with wash towel, barrier cream, new diaper → Seed into POST-W04-003 or a new "Diapering Basics" awareness task
- "Always supporting the neck no matter what" → Seed into early post-birth task descriptions
- Bathing: "Hold the baby, put a little glass of warm water" → Seed into POST-W01-007 (First Bath at Home)
- "Running to Target every night" reality despite planning → Already in Stock House survival task
- Wrong swaddle too warm, wrong diaper cream causing rash, wrong diapers causing rash → Seed into why_it_matters for Stock Diaper Supply
- Helping wife walk to bathroom, cooling pads every 2 hours, bleeding for weeks → Seed into description of POST-W02-002 (Mom OB Follow-Up) or a new postpartum recovery support task
- "Main role is make sure house is stocked all the time" → Seed into Stock House task

**From 3-12 months section:**
- Wake window shift: every 2 hours → 3-hour awake windows → Seed into POST-W08-007 (Establish Bedtime Routine)
- "6:30 to 7:30 melatonin window — target this for bedtime" → Seed into bedtime routine task
- Evening routine: dinner → bath with songs/music for 15-20 min → breast-feed + bottle → sleep → Seed into POST-W08-007
- Teaching baby milestones: how to hold, grab, press button, hand-to-hand transfer → Seed into POST-W16-020 (Milestone Toys)
- The stair-climbing teaching story (2-3 weeks of practice, then crying with joy) → Seed into why_it_matters for development tasks
- "First time he climbed the stairs by himself — I cried. My future is secure." → Great quote for why_it_matters

**From Tips for Dads section:**
- "Nobody asked how the dad is doing — not even in the hospital" → Already in POST-W20-020 ✓
- "Because of mood swings and hormones, wife becomes quite cranky — it's fine, remember you have a baby" → Seed into POST-W02-007 (Partner Check-In)
- "I personally felt more closer to my mom" → Seed into why_it_matters for self-care tasks
- "Be there. Your baby is there for you. Your baby's health, baby's smile, your health." → Seed into protected time task

**From Month 1 Post-Delivery section:**
- "There is no button now" hospital departure → Seed into why_it_matters for first week tasks
- "It's all doable — it's just tasks. Write them down." → Seed into why_it_matters for Night Shift Schedule
- "Every day almost going to Target at night to buy something" → Already seeded into Stock House task
- Cooling pads, bleeding, helping wife to bathroom → Seed into a postpartum recovery awareness task
- "Wife needs to eat, you need to eat, there is something to get for the house, something for the baby" → Seed into why_it_matters for Protected Time

**From Late Nights section:**
- No lights at night — babies get distracted by lights, shiny things → Seed into POST-W01-021 (Night Station) and POST-W02-006 (Night Routine)
- Load balancing night shifts: "I'm helping till midnight, she does the rest" → Already in POST-W01-022 ✓
- 4:30 AM body cream distraction story → Seed into why_it_matters for bedtime/night tasks
- "Baby replicates whatever I do — if I'm frustrated, he gets frustrated" → Seed into POST-W05-001 (Purple Crying Education)
- "Deep breaths, try something different, distract him, then rock again" → Seed into night routine descriptions

**From Toys section:**
- One toy at a time = 30 min deep play. 20 toys = 5 seconds each → Already in POST-W16-020 ✓
- Light switch story: taught on/off with toy, now flips every switch in house → Seed into why_it_matters for Milestone Toys
- Age-appropriate milestone buying framework → Already in task description ✓
- "Lovevery subscription sends toys monthly" → Mention as option in description

**From Impact on Yourself section:**
- Loss of spontaneity: can't grab coffee at 4 PM, can't go to movies at night → Seed into why_it_matters for Protected Time
- 15-minute driving radius from house → Seed into description of self-care tasks
- "Planning a 2-hour drive now requires 6 hours of logistics" → Seed into why_it_matters for First Outing
- Office empathy: senior director spent 45 minutes sharing his experience → Seed into Return to Work (Dad) description
- "With time things get back to normal" → Seed into why_it_matters for later-phase tasks

**From Sleepless Nights Impact section:**
- DoorDash gift cards as the best gift → Already in PREG-W36-020 ✓
- Deliberate 30-minute protected meal time → Already in POST-W02-020 ✓
- Black coffee with protein powder for sustained energy → Seed into description of Protected Time
- Short temper, yelling at friends, silly fights with wife → Seed into POST-W12-020 (Paternal PPD Research)
- "I used to just do takeout every single day" → Reinforce Meal Delivery Cards task
- Brain fog causing poor decisions → Seed into why_it_matters for PPD research

**From Postpartum section:**
- Pediatrician asking "how are YOU doing" at month 5 → tears → Already in POST-W20-020 ✓
- Wife threatening divorce during postpartum → lawyer suggested hormones → 180° recovery months later → Seed into POST-W02-007 (Partner Check-In) why_it_matters
- Heated towel $15 argument → example of impaired judgment from exhaustion → Seed into why_it_matters for Protected Time or PPD
- "Things change every 2-3 months — just when you figure it out, demands shift" → Seed into why_it_matters for development milestone tasks
- "Baby smile changes everything" → Seed into why_it_matters for bonding tasks
- "Talk to friends, family, therapist — don't be ashamed of asking for help" → Seed into PPD research task
- "Wife and intimacy — suddenly it will be like your wife hates you" → Seed into POST-W06-002 (Date Night Planning) description/why_it_matters
- Baby's smile as daily reset mechanism → Seed into multiple why_it_matters fields

---

## PHASE 6: CONVERT OBSERVATIONAL TASKS TO ACTIONABLE TASKS

These tasks describe what the baby is doing but don't tell dad what to DO. Rewrite each with a specific dad action.

| Task ID | Current Title | Problem | Rewrite Direction |
|---------|--------------|---------|-------------------|
| POST-W10-001 | Hands Discovery | "Baby begins discovering hands" — not a task | → "Hands Discovery: Give baby rattles and textured toys to grasp. Hold objects at midline so baby practices reaching. This is the foundation for all future hand skills." |
| POST-W14-001 | 3.5-Month Wonder Week | "Expect fussiness during developmental leap" — not actionable | → "Expect extra fussiness this week — it's a developmental leap, not regression. Increase contact time, offer more feeds, don't start sleep training during a wonder week. It passes in 1-2 weeks." |
| POST-W26-001 | Stranger Anxiety Normal | "Expect increased clinginess" — not actionable | → "Baby may suddenly cry with grandparents or friends they were fine with before. Don't force it — let baby warm up from your arms. Warn family members in advance so they don't take it personally." |
| POST-W26-002 | Eight Month Developments | "Expect crawling attempts" — observation | → "Baby is about to become mobile. Get on your hands and knees and look at your home from baby's eye level — you'll see hazards you missed standing up. Secure anything at floor level." |
| POST-W30-002 | Nine Month Milestones | "Check for waving, clapping, first words" — vague | → "At the 9-month checkup, your pediatrician will assess waving, clapping, babbling, and response to name. If baby isn't doing 2+ of these, mention it — early intervention is most effective when started early." |
| POST-W34-001 | Cruising Furniture | "Baby may begin pulling up" — observation | → "Baby is pulling up on everything — coffee tables, TV stands, bookshelves. Anchor ALL tall furniture to walls NOW with anti-tip straps. Remove anything at baby's reach height that could fall or break." |
| POST-W34-002 | Ten Month Skills | "Standing with support, cruising" — observation | → MERGE into POST-W34-001 (same phase, same topic). Delete POST-W34-002. |
| POST-W38-002 | Eleven Month Milestones | "First steps possible, more words" — observation | → "First steps may happen this month. Clear a safe walking path — remove rugs that slip, pad sharp table corners, and keep the floor clear of small objects. Let baby cruise between furniture pieces placed close together." |
| POST-W42-001 | First Steps Support | "Create safe environment for walking practice" — too vague | → "Baby is walking or about to. Best practice: let them walk barefoot indoors (builds foot muscles), place furniture as 'stepping stones' they can grab between, clap and cheer every attempt. Falls are normal — react calmly so they don't learn to be scared of falling." |
| POST-W46-001 | 13 Month Development | "Walking more confidently, 2-3 words" — observation | → "Track the words your baby is using — write them down in a note on your phone. By 13-15 months they should have 3-5 words. If they have fewer than 3 by 15 months, mention it at the next checkup." |
| POST-W48-003 | One Nap Transition Watch | "Look for signs baby is ready for one nap" — vague | → "Signs baby is ready to drop to one nap: fighting the morning nap, taking 30+ minutes to fall asleep for second nap, or bedtime getting later. Don't rush it — most babies transition between 13-18 months. When ready, shift to one midday nap around 12:30-1 PM." |
| POST-W52-004 | Language Explosion Prep | "15-18 months brings vocabulary explosion" — observation | → "Between 15-18 months, vocabulary explodes from ~10 words to 50+. Accelerate it: narrate everything you do ('Dad is pouring milk, now Dad is closing the fridge'), read board books daily, pause and let them try to say words. Respond to every babble attempt — it encourages more." |
| POST-W68-001 | Imaginative Play Begins | "Support pretend play with props" — thin | → "Your toddler is starting to pretend: feeding a stuffed animal, talking on a toy phone, stirring an empty pot. Join in. Pretend play is how they process the world. Give them simple props — cardboard boxes, play kitchen items, dolls — and follow their lead. This is bonding time disguised as play." |

---

## PHASE 7: POPULATE `why_it_matters` FOR ALL MUST-DO TASKS

Write `why_it_matters` for every must-do task that currently has NULL. Voice: direct, practical, slightly urgent. Frame as what goes wrong if you skip this, or what advantage you gain by doing it. Use founder's personal stories where applicable.

### Style Guide (from existing examples):
- "At 3 AM with a screaming baby, you do not want to be walking across the house looking for diapers in the dark."
- "Nurses rotate shifts every 8-12 hours. Without printed copies, your preferences get lost in verbal handoffs."
- "Without a schedule, both parents wake up for every cry and neither gets real sleep."
- "This is the single most important task most dads will skip. Nobody else will ask how you're doing."

### Examples for Claude Code to follow:

**PREG-W08-001 "Select OB-GYN/Midwife":**
"This person delivers your baby. You will see them 12-15 times over 9 months. If you don't like them or they don't have privileges at your preferred hospital, switching mid-pregnancy is stressful and sometimes not possible."

**PREG-W10-001 "Verify Prenatal Insurance":**
"Delivery costs $5,000-$15,000+ even with insurance. If your provider is out-of-network or certain tests aren't covered, you won't know until the bill arrives. One phone call now prevents a financial surprise later."

**PREG-W12-002 "Daycare Waitlist Application":**
"In metro areas, daycare waitlists run 9-18 months. If you wait until the baby is born to apply, you won't have a spot when parental leave ends. Apply at week 12 — even if it feels absurdly early."

**POST-W01-004 "Insurance: Add Baby":**
"You have a 30-day window from birth to add the baby to your health insurance. Miss it, and you wait until open enrollment — which could be months away. The baby will need multiple pediatrician visits and vaccines in that time."

**POST-W08-001 "2-Month Vaccines":**
"These vaccines protect against whooping cough, rotavirus, and other diseases that are genuinely dangerous for infants. The baby may be fussy and have a low fever for 24-48 hours after — stock infant Tylenol and clear your schedule."

**POST-W08-003 "Return to Work Prep (Dad)":**
"You've been in survival mode for weeks. Re-entering work mode is jarring. A senior director once spent 45 minutes telling a new dad about his own night feeding experience — your colleagues are more empathetic than you expect. But you need a plan: handoff notes, flexible schedule for sick days, and coverage for pediatrician appointments."

Generate similar `why_it_matters` for ALL remaining must-do tasks (~75-80) using this voice and incorporating founder stories where applicable. Each should be 1-3 sentences.

---

## PHASE 8: ENRICH DESCRIPTIONS FOR TASKS UNDER 100 CHARACTERS

Rewrite every task description that is under 100 characters. The new description should be 150-300 characters and include: what specifically to do, how to do it, and the dad angle. Here are specific rewrites for the thinnest descriptions:

**PREG-W10-004 "First Trimester Fatigue Support"** (51 chars → rewrite):
"Her body is building an entirely new organ (the placenta) while supporting rapid cell division — she is running a metabolic marathon while sitting on the couch. Let her sleep. Take over evening cooking, cleaning, and errands. Don't complain about her napping — her body is doing more work than yours right now. Some women also develop strong food and smell aversions — if she suddenly can't stand the smell of your favorite meal, eat it outside the house."

**POST-W08-007 "Establish Bedtime Routine"** (40 chars → rewrite):
"Create a consistent nightly routine: dinner/solids around 5:45-6 PM, warm bath with songs and play for 15-20 minutes (the warm water relaxes the body), change into pajamas, breast-feed or bottle, then into crib/bassinet. Target the 6:30-7:30 PM melatonin window — the body naturally produces sleep hormones during this time, making it the optimal bedtime. Consistency matters more than perfection."

**POST-W02-004 "Establish Feeding Routine"** (87 chars → enrich):
"Track every feed: breast or bottle, which side, how long, how much. In the first weeks, baby feeds every 2-3 hours — their stomach is the size of a grape (day 1), a walnut (week 1), then an egg (month 1). The small stomach means frequent hunger. Set phone alarms if needed. Feed on demand, but if baby hasn't eaten in 3 hours, wake them. This is critical for weight gain in the first month."

**POST-W01-007 "First Bath at Home"** (60 chars → rewrite):
"Before the umbilical cord stump falls off (usually 1-3 weeks), give sponge baths only — no submerging. After the cord falls off, use a small baby tub with 2-3 inches of warm water (test with your elbow, not hand — elbow skin is more sensitive and gives a better read). Support the head and neck at all times. Babies are slippery when wet. Keep it short — 5-10 minutes max. Have a towel ready to wrap immediately."

Continue this pattern for all ~94 tasks under 100 characters.

---

## SUMMARY: Expected Final State

| Metric | Before | After |
|--------|--------|-------|
| Total tasks | 227 | ~228 (9 deleted, ~10 added) |
| Tasks with description > 100 chars | 133 | 228 (all) |
| Tasks with why_it_matters populated | 12 | ~100+ (all must-do) |
| Unique categories | 16 | 12 |
| Dad-assigned tasks | 53 | ~61 |
| Observational-only tasks | ~15 | 0 |
| Duplicate tasks | 9 | 0 |
