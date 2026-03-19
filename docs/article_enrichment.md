# Article Enrichment Specification — Dictation Story Integration

## Context for Claude Code

The `articles` table in Supabase (project: `oeeeiquclwfpypojjigx`) has 46 articles. All are AI-generated with proper structure (Quick Brief → Baby → Mom → Dad Should Do → Relationship Check-In → Coming Up → Quick Reference → Sources). Content is 5,000-7,000 chars each.

**Problem:** 43 of 46 articles have zero personal voice. They read like medical reference content, not like a dad who went through it. The founder dictated extensive personal experiences across all phases.

**Task:** For each article mapped below, INSERT the founder's personal stories into the existing content — primarily in the "What Dad Should Do" and "Relationship Check-In" sections. Do NOT rewrite entire articles. Surgically add 200-500 chars of personal story per article, woven naturally into existing paragraphs.

**Voice rule:** Personal stories should be framed as "one dad found that..." or "a first-time dad discovered..." — anonymized but clearly real experience, not hypothetical.

**Article structure (preserved as-is):**
1. Quick Brief
2. What's Happening with Baby
3. What's Happening with Mom
4. What Dad Should Do This Week (← PRIMARY insertion point)
5. The Relationship Check-In (← SECONDARY insertion point)
6. What's Coming Up
7. Quick Reference Box
8. Sources

---

## TIER 1: STRONG DICTATION MATCHES (20 articles)

### FIRST TRIMESTER (5 articles)

**week-5-the-heartbeat-begins**
- INSERT into "What Dad Should Do" section on anti-nausea stocking:
  "Don't just stock the kitchen. Put crackers, ginger ale, and water in her car, on her office desk, in her purse, and in her bag. One dad only stocked at home — his wife got dehydrated at work, and they ended up in the ER for IV fluids. A completely preventable trip."
- INSERT into Relationship Check-In:
  "How you show up in these early weeks is what she'll remember. She's going through body changes, nausea, and exhaustion while you look and feel the same. The least you can do is handle the house and the emotional support."

**week-8-the-first-ultrasound**
- INSERT into "What Dad Should Do" / ultrasound section:
  "Go to this appointment. One dad described the first ultrasound: 'The baby looked like a dinosaur or a tiny seahorse — nothing like a human. But hearing that heartbeat changed something in my brain. It converted abstract news into something real.' Every dad should have this experience."
- INSERT into "What's Happening with Mom" section on fatigue:
  "She is metabolically running a marathon while sitting on the couch. This isn't laziness — her body is building an entirely new organ (the placenta) while supporting rapid cell division. Let her sleep."

**week-10-the-genetic-testing-decision**
- INSERT into Relationship Check-In:
  "She'll sleep a lot in the first trimester. Some women also develop intense food and smell aversions. One dad's friend's wife became allergic to the smell of onions during pregnancy — and it never went away. If she suddenly can't stand your favorite meal, eat it outside the house. Don't argue about it. It's hormonal and involuntary."

**week-12-the-safe-zone**
- INSERT into "What Dad Should Do" section:
  "Here's what most guys don't realize at week 12: daycare waitlists in metro areas run 9-18 months. If you wait until the baby is born to apply, you won't have a spot when your parental leave ends. Apply this week — it feels absurdly early, but it's already almost late."

**week-13-second-trimester-prep**
- INSERT into "What Dad Should Do" section on leave:
  "Research your parental leave now. FMLA gives 12 weeks unpaid — your company may offer paid leave on top of that. There are notification deadlines that most dads miss. Ask HR this week, not when you're packing the hospital bag."

### SECOND TRIMESTER (5 articles)

**week-16-the-quickening**
- INSERT into Relationship Check-In:
  "Start the financial planning conversation. Create a shared spreadsheet with estimated post-baby costs: diapers (~$80/month), childcare ($1,200-2,500/month in most metros), formula if needed ($150-300/month). People think you need perfect finances to have a baby. It's not true — it's all doable. Your priorities change, your lifestyle adjusts. But knowing the numbers removes the vague financial anxiety."

**week-20-the-anatomy-scan**
- INSERT into "What Dad Should Do" section:
  "Bring a notebook to this appointment. There is a lot of information. One dad said: 'It went from looking like a dinosaur baby to a proper human — you could see the spine, the heart chambers, tiny fingers. It blew my mind.' This is the appointment that converts skeptics into believers."
- INSERT into "What's Coming Up" section:
  "Second trimester is also the babymoon window. Your wife's morning sickness is fading, energy is back, the belly isn't big enough to limit activity. Travel now. Restaurants, concerts, hikes, long drives. Once the baby arrives, a 2-hour drive that used to need coffee and a playlist requires 6 hours of logistics."

**week-22-the-nursery-project**
- INSERT into "What Dad Should Do" section:
  "Second trimester is the optimal shopping window. In the third trimester, her belly grows rapidly, energy drops, appointments multiply, and you'll have less time and mental bandwidth for research and purchasing. Do the big-ticket decisions now: crib, stroller, car seat, nursery layout. Order early — furniture delivery takes 4-8 weeks."

**week-24-viability-week**
- INSERT into "What Dad Should Do" section:
  "Plan the babymoon NOW. This is the optimal travel window before third-trimester restrictions. Airlines restrict flying after week 36 — some require a doctor's certificate earlier. Research your airline's policy before booking any late-pregnancy travel. One dad booked a trip without checking and had to cancel at a loss."
- INSERT into Relationship Check-In:
  "Travel together as much as you can right now. Once the baby arrives, spontaneity dies. At 7 PM in Italy wanting pizza on a whim? Not happening with a baby. Every outing requires planning around feeding schedules, nap times, diaper bags, and car seats. Enjoy the freedom while you have it."

**week-27-third-trimester-prep**
- INSERT into "What Dad Should Do" section:
  "Buy a pregnancy seatbelt adjuster (like the Mimi Belt, ~$30). Standard seatbelts cross the belly and can put dangerous pressure on the abdomen in a sudden stop. Also: when friends and family ask what gift to buy, tell them DoorDash or Uber Eats gift cards. Not flowers, not baby clothes. Meal delivery is the single most useful gift a new parent receives — you'll use it every day for a month."

### THIRD TRIMESTER (5 articles)

**week-30-the-final-stretch-begins**
- INSERT into "What Dad Should Do" section:
  "Take the classes now. Delivery preparation, breastfeeding, newborn care, infant CPR. One couple went from terrified about delivery to confident after just one class. The fear wasn't about pain — it was about not knowing. Once they understood how contractions work, what oxytocin does, and how breathing techniques help, the fear converted into a plan. Classes are the highest-ROI time investment of the third trimester."

**week-34-the-lung-milestone**
- INSERT into "What Dad Should Do" section:
  "Tour the delivery hospital. Know where to park (which lot, which entrance), where to check in, what the room looks like, where you'll sleep, whether you need to bring toothpaste. Every unknown you eliminate reduces stress on delivery day. Less stress means more natural oxytocin. More oxytocin means fewer physical interventions. Fewer interventions means less pain. A 30-minute tour literally improves the delivery outcome."

**week-36-early-term-territory**
- INSERT into "What Dad Should Do" section:
  "Print 4-5 copies of your birth plan. Nurses work 8-12 hour shifts — you'll go through 4-6 different nurses during your stay. Each new nurse walks in and asks the same questions. Hand them a printed copy instead: lighting preferences, music, visitor policy, allergies, breastfeeding intent, who cuts the cord. The nurses will thank you for being prepared."

**week-38-any-day-now**
- INSERT into Relationship Check-In:
  "Distraction duty is your job right now. Take her to a movie, a slow walk, dinner out. Waiting for labor is harder than labor itself. Also: her body may produce a delivery experience document — some call it a birth plan, some call it preferences. Help her create it. Include: who she wants in the room, who talks to nurses first (consider being the intermediary so she can focus), ambient preferences (dim lights, music), and contingency preferences for C-section."

**week-40-due-date-and-beyond**
- INSERT into Quick Brief or Dad section:
  "Only 5% of babies arrive on their due date. Don't panic if nothing happens today. Keep phone charged, car fueled, bag in trunk. When labor starts, your job is simple: reduce stress, be her calm, advocate for her preferences, and follow her lead."

### DELIVERY & FOURTH TRIMESTER (5 articles)

**the-delivery-room-dads-role**
- INSERT into "What Dad Should Do" section:
  "Your job in the delivery room is NOT medical. It's operational and emotional. Reduce her stress in every possible way — dim the lights, play her music, be the intermediary with nurses, hold her hand, massage her back during contractions, remind her to breathe. Every stress you reduce increases oxytocin, which helps labor progress naturally and reduces the need for physical interventions."

**the-first-24-hours**
- INSERT into article body:
  "Request a lactation consultant visit immediately after delivery. Proper latch in the golden hour sets up the entire breastfeeding journey. Here's something most dads don't know: breastfeeding is a two-way biological exchange. The baby's saliva touches the nipple, gets absorbed, and mom's body analyzes what the baby needs. If the baby is low on iron, the next feeding produces more iron. If the baby is fighting an infection, mom produces matching antibodies. It's the most sophisticated food delivery system in nature."

**coming-home-days-2-4**
- INSERT into article body:
  "In the hospital, you press a button and a nurse appears. Day three, they say 'take the baby home.' There is no button at home. It hits you in the car. One dad described it: 'I was thinking — what if he needs a diaper change and I can't do it? What if he doesn't sleep? What if something goes wrong?' But here's what he discovered: the anxiety only lasts until you do the thing once. First solo diaper change converts anxiety to confidence. You become a pro faster than you expect."
- INSERT into "What Dad Should Do":
  "Before your first night home, set up a night station within arm's reach of the bed: diapers, wipes, barrier cream, change of clothes, water bottle, snacks, burp cloths, and a dim night light. No overhead lights — babies get distracted by any light or movement and sleep disappears instantly."

**the-first-week-survival-guide**
- INSERT into article body:
  "One dad created spreadsheets months in advance, talked to dozens of parents, and bought everything on every list. He still went to Target almost every night for the first month. The swaddle was too warm — needed a different model. The diaper cream caused a rash — needed a new brand. The diapers themselves caused a rash — try another brand. The nasal aspirator was too big for tiny nostrils — needed a smaller one. You cannot prepare for everything. You can prepare for 80% and accept that the other 20% sends you to Target at 10 PM."
- INSERT into dad section:
  "Your main role this week: make sure the house is stocked at all times. Diapers, wipes, formula backup, easy one-hand foods (protein bars, trail mix), DoorDash account set up. Also: she is bleeding heavily — changing cooling pads every 2 hours. She may need help walking to the bathroom. You're carrying out bags that smell terrible. This is not in any movie. This is what supporting your partner actually looks like in week one."

**week-2-the-weight-check**
- INSERT into Relationship Check-In:
  "Agree on a night shift schedule. Example: Dad covers 8 PM - 1 AM, Mom covers 1 AM - 6 AM. Or alternate nights. The app assigns this — neither partner is nagging the other. Without a plan, both parents wake for every cry and nobody gets real sleep. This one decision prevents more fights than anything else in month one."
- INSERT into dad section:
  "Also: learn the side-lying breastfeeding position. Mom lies on her side, baby lies facing her. It lets her feed while resting and dramatically reduces nighttime back pain for both of you. Ask the lactation consultant to demonstrate before you leave the hospital."

---

## TIER 2: MODERATE DICTATION MATCHES (10 articles)

### POST-BIRTH MONTHS 1-6

**week-4-6-the-first-real-smile**
- INSERT: "Negotiate 30 uninterrupted minutes per day for EACH parent. No baby, no chores, no questions. One dad ordered a nice meal every day at 3-4 PM, sat in a separate room, watched 20 minutes of a show, and ate in peace. 'That 30 minutes is what kept me sane through month two.' This isn't selfish — it's maintenance."

**week-8-the-two-month-vaccines**
- INSERT: "Returning to work is jarring after survival mode. But colleagues are more empathetic than you expect. One dad had a senior director — someone who normally wouldn't give him 5 minutes — spend 45 minutes sharing his own night feeding experience and offering tips. People who've been through it want to help. Let them in."

**week-10-finding-your-groove**
- INSERT: "Talk to your baby constantly. Narrate everything: 'Dad is making coffee. Now Dad is pouring milk. Look, the dog is outside.' It feels ridiculous. It builds their language foundation. Your voice — specifically your voice — is building neural pathways every time they hear it."

**week-12-fourth-trimester-graduation**
- INSERT: "Three months. You survived. But recognize: sleep deprivation is cumulative. The short temper, the brain fog, the silly fights with your wife about a $15 heated towel rack — it's accumulated sleep debt, not character flaws. One dad's hack: black coffee with protein powder. Sustained energy without the sugar crash. He credits it with getting through months 3-5 cognitively intact."

**month-4-the-sleep-regression**
- INSERT the 4:30 AM story: "One dad was rocking his baby at 4:30 AM for 45 minutes straight. Back killing him. The baby screamed directly in his ear. He was ready to lose it. But he remembered: babies mirror your energy. If you're frustrated, they escalate. So he took three deep breaths, grabbed a random tube of body cream from the counter, and let the baby explore it for five minutes. The baby calmed down. Then he rocked again — and the baby slept. The lesson: when what you're doing isn't working for 45 minutes, don't do it harder. Do something completely different."

**month-5-the-mobility-begins**
- INSERT: "Nobody asks how dad is doing. Not in the hospital, not at pediatrician visits, not at family gatherings. Everyone asks about the baby and mom. At a month 5 appointment, one pediatrician broke the pattern and asked a dad 'How are YOU doing?' He cried. It was the first time anyone had asked in five months. If you're reading this and you recognize yourself: you are allowed to not be fine. 1 in 10 dads experience postpartum depression. It's real, it's clinical, and it's drastically underdiagnosed because nobody screens for it."

**month-6-first-foods**
- INSERT: "Breastmilk does something extraordinary. The baby's saliva touches the nipple, gets absorbed by mom's body, and her system analyzes what the baby needs. Low on iron? Next feeding has more iron. Baby fighting a cold? Mom produces matching antibodies and passes them through the milk. It's the most sophisticated food system in nature. When introducing solids, don't rush weaning — breast milk continues providing benefits alongside solid foods."

**month-6-the-six-month-checkup**
- INSERT: "By 6 months, your life revolves entirely around the baby's schedule. At 4 PM you want coffee — but the baby is awake. Friends want to meet — but bedtime is 7 PM. Your driving radius from home is about 15 minutes because you can't be far in case of emergencies. This is temporary. One dad's wife went on a 3-day work trip to Seattle at month 10 while he stayed home solo. Six months earlier, unthinkable. Things normalize. But right now, accept the radius and plan within it."

### POST-BIRTH MONTHS 6-12

**month-7-8-the-crawling-revolution**
- INSERT: "Get on your hands and knees and look at your home from the baby's eye level. You'll find hazards you completely missed standing up: phone charger cords, chair legs, tiny objects under the couch, cleaning supplies at floor level. The baby is about to reach all of it. Also: anchor ALL tall furniture to walls with anti-tip straps. A $5 strap prevents a bookshelf from killing your child."

**month-10-the-cruiser**
- INSERT the stair climbing story: "One dad spent 2-3 weeks teaching his baby to climb stairs. Same staircase, same patient demonstration, every single day. Then one day, the baby did it alone. The dad cried. Not because it was objectively a big deal — babies learn to climb stairs — but because HE taught him. His time, his patience, his repetition produced this result. That feeling — 'my blood, I created this, I taught this, my future is secure' — is unique to parenthood."
- INSERT the one-toy-at-a-time insight: "Here's a counterintuitive discovery: give a baby 20 toys and they play with each for 5 seconds. Give them one toy and they explore it for 30 minutes — pressing every button, turning it over, figuring it out. One dad bought a simple toy with just an on/off switch. It took two weeks of demonstrating before the baby got it. Then the baby walked to the wall and started flipping every light switch in the house. Buy for the milestone your baby is working on, not what looks cute on the shelf."

---

## TIER 3: NO DIRECT DICTATION MATCH (16 articles)

These articles cover phases beyond the founder's dictation (12-24 months) or topics not addressed in the dictation. Leave as-is for v1. Can be enriched post-launch as the founder's baby grows into these phases.

- month-9-understanding-separation-anxiety (could add peek-a-boo insight, minor)
- month-11-first-words (could add word tracking tip, minor)
- month-12-the-first-birthday (could add "you earned that reach" story, minor)
- month-13-14-the-new-walker
- month-15-the-opinion-era
- month-16-17-the-one-nap-transition
- month-18-the-developmental-screening
- month-19-20-peak-tantrum-season
- month-21-two-word-phrases
- month-22-23-potty-training-readiness
- month-24-the-second-birthday
- newborn-sleep-patterns-what-to-expect (could add melatonin window, minor)
- newborn-feeding-schedule-first-12-weeks (could add grape stomach, minor)
- witching-hour-evening-fussiness-survival-guide
- tummy-time-guide-newborn-strength-building
- easy-routine-newborn-schedule-guide (could add 6:30-7:30 bedtime window, minor)

**For Tier 3 "minor" items:** If time permits, add the one-liner insights noted in parentheses. These are small enrichments that don't require full stories — just a sentence or two of practical dad perspective.

---

## IMPLEMENTATION INSTRUCTIONS

1. For each article in Tier 1 and Tier 2:
   - SELECT the current `content` column
   - Find the relevant section (usually **What Dad Should Do** or **The Relationship Check-In**)
   - INSERT the story text as a new paragraph within that section
   - UPDATE the content column with the enriched version

2. **Do NOT change:**
   - Article titles, slugs, stages, or metadata
   - The Quick Brief section (keep it clinical/factual)
   - The Baby Update or Mom Update sections (keep medical accuracy)
   - The Sources section
   - The Quick Reference Box

3. **Formatting rules:**
   - Stories should flow as natural paragraphs within existing sections
   - Use "One dad" / "A first-time dad" / "One couple" framing — never use real names
   - Keep total article length between 5,500-8,000 chars (add 200-500 chars per article, not more)
   - Preserve all existing markdown formatting

4. **After all updates, verify:**
```sql
SELECT slug, title, LENGTH(content) as content_len,
  CASE WHEN content ILIKE '%one dad%' OR content ILIKE '%one couple%' 
       OR content ILIKE '%one father%' OR content ILIKE '%first-time dad%'
       THEN 'HAS PERSONAL' ELSE 'AI ONLY' END as voice_check
FROM articles
ORDER BY stage, week NULLS LAST;
```
Target: 30+ articles showing 'HAS PERSONAL'.

---

## DICTATION STORIES — QUICK REFERENCE (Deduplication Guide)

Each story should appear in AT MOST one article. If the same story was used in briefings or dad challenges, use a DIFFERENT angle or detail in the article version. The article version should be longer and more narrative than the briefing version.

| Story | Primary Article | Also in Briefing? | Differentiation |
|---|---|---|---|
| ER dehydration | week-5 | PREG-W05 | Article: fuller narrative with lesson. Briefing: quick reference. |
| Dinosaur ultrasound | week-8 | PREG-W08 | Article: describe progression across visits. Briefing: one-liner. |
| Onion allergy | week-10 | PREG-W06 | Article: expand on food/smell aversion range. Briefing: the specific story. |
| Daycare waitlist | week-12 | PREG-W12 | Same urgency, similar framing — OK to overlap since these are different surfaces. |
| Babymoon urgency | week-24 | PREG-W24 | Article: full travel perspective. Briefing: compressed version. |
| Birth plan copies | week-36 | PREG-W38 | Article: explain full birth plan contents. Briefing: the copies logistics. |
| Hospital tour + oxytocin | week-34 | PREG-W32 | Article: full tour checklist. Briefing: why it matters chain. |
| No button | coming-home-days-2-4 | POST-W01 | Article: extended version with the car ride feeling. Briefing: compressed. |
| Target runs | first-week-survival | POST-W04 | Article: list specific items that were wrong. Briefing: summary. |
| 4:30 AM body cream | month-4-sleep-regression | POST-M04 | Article: full story with emotional arc. Briefing: the lesson. |
| Nobody asks about dad | month-5 | POST-W06 | Article: expand into PPD awareness. Briefing: the moment. |
| Stair climbing | month-10 | POST-M10 | Article: full teaching arc. Briefing: the achievement moment. |
| One toy at a time + light switch | month-10 | POST-M10 | Article: the learning framework. Briefing: n/a. |
| Coffee + protein powder | week-12-graduation | POST-W12 | Article: practical survival hack context. Briefing: one-liner. |
| Senior director empathy | week-8-vaccines | POST-W08 | Article: workplace reentry story. Briefing: one-liner. |
| Cooling pads / bleeding | first-week-survival | POST-W02 | Article: full operational description. Briefing: awareness. |
| Night shift schedule | week-2-weight-check | POST-W02 | Article: detailed examples. Briefing: example format. |
| Protected 30 min | week-4-6-first-smile | POST-W04 | Article: the 3-4 PM meal ritual. Briefing: the principle. |
| Breastmilk saliva exchange | first-24-hours + month-6 | POST-M06 | Article: full biology explanation. Briefing: compressed. |
| 15-minute radius | month-6-checkup | POST-M07 | Article: full lifestyle change description. Briefing: one-liner. |
| Side-lying breastfeeding | week-2 | POST-W02 | Article: practical description. Briefing: mention. |

---

## NEW ARTICLES TO CREATE (4 articles — entirely from dictation)

These topics have strong dictation content but NO existing article. Claude Code should draft these following the exact same structure as existing articles (Quick Brief → Baby → Mom → Dad Should Do → Relationship Check-In → Coming Up → Quick Reference → Sources). Target 5,500-7,000 chars each.

### NEW ARTICLE 1: "What Dads Need to Know About Breastfeeding"
- **slug**: what-dads-need-to-know-about-breastfeeding
- **stage**: fourth-trimester
- **stage_label**: Fourth Trimester
- **week**: null
- **is_free**: true (SEO landing page — high search volume)

**Dictation content to seed:**
- "All I thought was baby sucks milk from nipple. It's not true. Baby knows how to suck but not properly/efficiently."
- Proper latch technique importance — improper latch = pain for mom, insufficient milk for baby
- The two-way saliva exchange: baby's saliva tells mom's body what nutrients to produce
- Grape-sized stomach → feeds every 2 hours
- Side-lying breastfeeding position for night feeds — reduces back pain
- Multiple breastfeeding positions (sitting, walking, sleeping)
- "Wife becomes very happy when breastfeeding — body produces oxytocin"
- "Try to figure out breastfeeding — getting it right makes wife very happy, baby very happy, and you don't have to deal with formula bottles, washing, cleaning, heating"
- Lactation consultant in hospital — request help with every feeding
- After going home: hire breastfeeding professionals if needed, hospital provides contacts

**Sources to cite**: AAP breastfeeding guidelines, CDC breastfeeding data, La Leche League

### NEW ARTICLE 2: "How to Split Night Feeds with Your Partner"
- **slug**: how-to-split-night-feeds-with-your-partner
- **stage**: fourth-trimester
- **stage_label**: Fourth Trimester
- **week**: null
- **is_free**: true (SEO landing page — high search volume)

**Dictation content to seed:**
- "If you just let your wife handle everything, she's feeding at night AND awake all day with baby — 24/7 with no break"
- Load balancing: "I'm helping till midnight or 1 AM and then she does the rest"
- OR: "letting her sleep early around 8, I do until 12-1, then she takes over"
- No lights at night — babies get distracted by any light, shiny thing
- Deep sleeper problem: "I am a deep sleeper and I thought if I sleep, baby will cry and I won't wake up, so I just never slept — slept in daytime instead"
- The 4:30 AM body cream story — when rocking isn't working after 45 minutes, try something different
- "Baby replicates whatever I do — if I'm frustrated, he gets frustrated"
- Physical toll: back pain, shoulder pain from carrying and rocking
- "It becomes muscle memory. You just do it. You don't even realize anymore."

**Sources to cite**: AAP safe sleep guidelines, Sleep Foundation on adult sleep needs

### NEW ARTICLE 3: "Should You Have a Baby? A Decision Framework for Men"
- **slug**: should-you-have-a-baby-decision-framework
- **stage**: first-trimester (or create a new "pre-pregnancy" stage if supported)
- **stage_label**: First Trimester
- **week**: null
- **is_free**: true (SEO — unique, low competition keyword)

**Dictation content to seed:**
- "I would recommend that please do your research, be very proactive to think about planning your life"
- Age and fertility: "learning from the gyno that after 35, probability of complications increases — this was shocking and eye-opening"
- "That one gyno appointment changed the game — my wife now wants to have even more babies"
- The myth of readiness: "People think you need perfect house, perfect income, a car. It's not true — it's all doable"
- "Your priorities change. You become more sane. You get a schedule in your life."
- "Expenses increase a little but it's not as big as you think — depends on your lifestyle"
- Planning framework: "Have a high-level goal — maybe in a year, maybe two years. What's stopping you? Work on it."
- "If you don't plan it, it's not happening. Time doesn't stop for anyone."
- Think about what you dream of doing with kids: soccer, camping, dance recitals, hiking — "the more you delay, the more chances you won't be able to do those things as efficiently"

**Sources to cite**: ACOG on maternal age, CDC fertility data, March of Dimes

### NEW ARTICLE 4: "How Fatherhood Actually Changes Your Life (Honestly)"
- **slug**: how-fatherhood-changes-your-life-honestly
- **stage**: fourth-trimester
- **stage_label**: Fourth Trimester
- **week**: null
- **is_free**: true (SEO — high search intent, emotional engagement)

**Dictation content to seed:**
- Loss of spontaneity: "4 PM you want coffee — baby is awake. Friends want to meet — baby sleeps at 7. Can't go more than 15 minutes driving from house."
- The 2-hour drive story: "Used to just take coffee and go. Now we need bottles, bottle warmer, diapers, extra clothes, car seat — planning a 2-hour drive now requires 6 hours of logistics"
- "All of those things are gone guys — going to movies at night, grabbing a snack somewhere"
- "But the ROI of spending time with baby is the highest ROI you'll ever get"
- Baby smile as reset: "Every time I enter the room, he looks at me and smiles — that smile erases everything"
- Feeling closer to parents: "I called my mom and asked 'did you do all this for me at 2 AM?' — 'yes, of course' — it rewrites your understanding"
- The normalization: "My wife went to Seattle for three days on a work trip — I watched the baby solo. Six months earlier, unthinkable."
- Impact on work: colleagues being empathetic, senior director sharing experience
- Physical impact: back pain, sleep deprivation compounding, short temper
- "It gets easier with time. It becomes muscle memory."
- Identity shift: "You are not just a husband or friend or brother anymore. You are also a dad now. Complete new identity."
- Sleepless nights impact: "DoorDash every day, one meal at 3 PM, black coffee with protein powder"

**Sources to cite**: APA on paternal adjustment, Zero to Three on father involvement

---

## VERIFICATION AFTER ALL CHANGES

```sql
-- Article enrichment verification
SELECT stage, COUNT(*) as total,
  COUNT(CASE WHEN content ILIKE '%one dad%' OR content ILIKE '%one couple%' 
       OR content ILIKE '%one father%' OR content ILIKE '%first-time dad%'
       THEN 1 END) as has_personal,
  ROUND(AVG(LENGTH(content))) as avg_content_len
FROM articles
GROUP BY stage
ORDER BY 
  CASE stage 
    WHEN 'first-trimester' THEN 1
    WHEN 'second-trimester' THEN 2
    WHEN 'third-trimester' THEN 3
    WHEN 'delivery' THEN 4
    WHEN 'fourth-trimester' THEN 5
    WHEN '3-6-months' THEN 6
    WHEN '6-12-months' THEN 7
    WHEN '12-18-months' THEN 8
    WHEN '18-24-months' THEN 9
  END;
```

Target state: 50 total articles (46 existing + 4 new), 30+ with personal voice, avg content length 6,000+.
