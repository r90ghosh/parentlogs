# Dad-First Experience Redesign — Full Plan & Discussion

## Context

ParentLogs is currently a shared parenting app with generic content. The goal is to transform it into a **dad-first emotional support platform** that addresses the 7 core challenges fathers face. The redesign adds expandable challenge tiles on a tabbed dashboard, deeper onboarding for dads, and mood check-ins — all written in the tone of a peer dad who's been through it.

### Key Decisions Made
1. **Dad-first focus** — entire experience through a father's lens
2. **Expandable tiles** — deep content, not one-liners
3. **Content tone** — written as another dad who's been through these experiences (peer, not mentor)
4. **Personalization v1** — Curated content that feels personal (A), plus foundations for actual personalization (B) via deeper onboarding + ongoing mood check-ins
5. **Keep current phases** — pre-pregnancy, trimesters 1-3, 0-3 months, 3-6, 6-12, 12-18, 18+
6. **Tabbed dashboard** — "My Journey" tab (default, dad tiles) + "Action Items" tab (existing tasks, tracker, budget)
7. **Content creation** — AI-generated in dad-peer tone, user reviews/edits
8. **Both** deeper onboarding AND ongoing mood/situation check-ins

### Open Questions (to resolve next session)
- **Tone depth**: Does the tile content feel right? Too heavy? Too light? Balance of honesty vs optimism/humor?
- **Mom/partner view**: Does she see the same 7 tiles (mom lens), the original dashboard, or shared dad-focused tiles?
- **Tile ordering**: Fixed order for everyone, concern-based (from onboarding), or phase-dependent?
- **Landing page**: Should the marketing page speak directly to dads, or stay generic?

---

## The 7 Challenge Pillars

| # | Pillar | Icon | Core Question |
|---|--------|------|---------------|
| 1 | Knowledge/Information | 🧠 | "What do I need to know right now?" |
| 2 | Planning | 📋 | "What should I be preparing for?" |
| 3 | Finances | 💰 | "Can we actually afford this?" |
| 4 | Anxiety & Fear | 🫣 | "Is what I'm feeling normal?" |
| 5 | Baby Bonding | 👶 | "How do I connect with my baby?" |
| 6 | Relationship with Partner | 💑 | "We feel like we're drifting apart" |
| 7 | Extended Family | 👨‍👩‍👦 | "How do I handle boundaries?" |

---

## User Workflows

### Flow A: New Dad Signs Up

1. **Landing Page** → Sign up
2. **Role Selection** → Picks "Dad" (triggers dad-first track)
3. **Family Setup** → Due date or birth date, baby name (unchanged)
4. **Partner Invite** → Share invite code (unchanged)
5. **NEW — "Tell us about you"** (Dad Profile screen)
   - Work situation: Full-time / Part-time / Remote / Hybrid / Self-employed / Stay-at-home / Looking
   - First-time dad? Yes / No
   - "What keeps you up at night?" — multi-select: Finances, Relationship changes, Being a good dad, Work-life balance, Family interference, Health anxiety, Labor & delivery, Losing my identity
   - "Skip for now" option
6. **NEW — "Your support system"**
   - Relationship with partner: Great / Good / It's complicated / Struggling / Single / Prefer not to say
   - Family nearby? Yes / No
   - Friends who are dads? Yes / No
   - "Skip for now" option
7. **Complete** → "Your journey configured, 56 challenge guides loaded, Weekly check-ins ready"
8. **Dashboard** → "My Journey" tab, mood check-in at top, 7 tiles below (first tile auto-expanded on first visit)

### Flow B: Daily Use (Returning Dad)

- Open app → Dashboard → "My Journey" tab
- If not checked in today: mood check-in widget at top (emoji row)
- 7 tiles below in collapsed state — scan headlines
- Tap to expand any tile → full narrative, action items, dad quotes
- Switch to "Action Items" tab for tasks, budget, tracker
- Content auto-updates when phase changes

### Flow C: Partner (Mom) Experience
- Joins via invite code, selects "Mom" role
- Skips dad-specific onboarding screens
- Dashboard experience: **TBD** (see open questions above)

---

## Tile Content Examples — What Each Pillar Actually Says

### Anxiety & Fear

| Phase | Headline | Preview | Core Theme |
|-------|----------|---------|------------|
| Trimester 1 | *"That pit in your stomach? Every dad has it."* | You just found out. Everyone's celebrating. But there's this weight in your chest... | Normalizing mixed emotions. It's okay to not be purely excited. |
| Trimester 3 | *"The delivery room is coming. Here's what nobody tells you."* | You've read the books. You've been to the classes. But there's a difference between knowing and being ready. | Practical prep for what you'll actually experience. The waiting, the helplessness, the moment it gets real. |
| 0-3 months | *"3 AM and you're wondering if you're cut out for this."* | The sleep deprivation isn't just tiredness. It's a fog that makes everything feel harder. | Post-birth reality check. Anxiety shifts from "will I be ready" to "am I doing this right." |
| 6-12 months | *"They're crawling and you're still figuring it out."* | You thought it would feel more natural by now. Some days it does. Some days it doesn't. | Slow build of confidence. Normalizing that competence isn't instant. |

### Relationship with Partner

| Phase | Headline | Preview | Core Theme |
|-------|----------|---------|------------|
| Trimester 2 | *"She's changing. You're not. That's the problem."* | Her body is transforming, her hormones are shifting. You feel the same but everything around you is different. | The asymmetry of pregnancy. How to stay connected when the experience is unequal. |
| 0-3 months | *"You're both drowning. She just doesn't have time to tell you."* | The baby needs her 24/7. You want to help but feel like you're in the way. She's exhausted and you're lonely. | Fourth trimester on relationships. Scripts for checking in without adding pressure. |
| 3-6 months | *"When did we stop being us?"* | You used to be a couple. Now you're a logistics team. Date nights feel impossible. | Rebuilding the relationship while managing a baby. |
| 12-18 months | *"You made it through the hardest part. Now rebuild."* | The crisis mode is fading. But the distance you built up doesn't disappear on its own. | Active relationship repair. What couples who make it through do differently. |

### Extended Family

| Phase | Headline | Preview | Core Theme |
|-------|----------|---------|------------|
| Trimester 1 | *"Everyone has an opinion. Not everyone gets a vote."* | Your mom wants to be in the delivery room. Her mom has rules about names. Your uncle has advice from 1987. | Setting boundaries early. Actual scripts that work. |
| 0-3 months | *"The invasion starts now."* | Visitors, advice, criticism disguised as concern, and everyone holding your baby while you watch. | Managing the postpartum visitor flood. Being the gatekeeper. |
| 6-12 months | *"When your parenting style isn't their parenting style."* | They raised kids differently. They undermine your rules when you're not looking. | Navigating real disagreements. When to flex, when to hold the line. |

### Baby Bonding

| Phase | Headline | Preview | Core Theme |
|-------|----------|---------|------------|
| Trimester 2 | *"She can feel the kicks. You can only watch."* | The bond between mom and baby is physical. Yours is imaginary right now. That doesn't mean it's less real. | How dads bond during pregnancy: talking to the belly, feeling kicks, writing letters. |
| 0-3 months | *"You're not babysitting. You're parenting."* | Skin-to-skin isn't just for mom. The bond doesn't happen by watching — it happens by doing. | Practical bonding: solo time, skin-to-skin, being the one who soothes at 2 AM. |
| 6-12 months | *"They just said 'dada' and meant it."* | The first months felt one-directional. But now they light up when you walk in. | The payoff. How bonding compounds. |

### Finances

| Phase | Headline | Preview | Core Theme |
|-------|----------|---------|------------|
| Trimester 1 | *"The real cost of a baby isn't what the internet says."* | Every article says "$300K to raise a child." That number is designed to scare you. | Demystifying costs. What you actually need vs. what marketing says. |
| Trimester 3 | *"Parental leave: what you're actually entitled to."* | If you're lucky, you get some paid leave. If you're not, you're figuring out FMLA and burning vacation days. | Practical leave planning. How to negotiate with your employer. |
| 3-6 months | *"Childcare costs more than your mortgage."* | You've been doing the math. Every option has a number attached. | Real talk about childcare economics and trade-offs. |

### Knowledge

| Phase | Headline | Preview | Core Theme |
|-------|----------|---------|------------|
| Trimester 1 | *"The first 13 weeks: what's actually happening in there."* | Everyone talks about the baby. Nobody explains it in a way that makes sense to you. | Development milestones explained for dads. What to watch for, when to worry, when not to. |
| 0-3 months | *"Newborn manual: the stuff the hospital doesn't teach you."* | They hand you a baby and send you home. Here's what you actually need to know for the first 90 days. | Practical newborn care. Feeding cues, sleep patterns, when to call the doctor. |

### Planning

| Phase | Headline | Preview | Core Theme |
|-------|----------|---------|------------|
| Trimester 3 | *"12 weeks to go. Here's your actual checklist."* | Not the Pinterest nursery list. The real stuff that matters: car seat installed, hospital bag packed, pediatrician chosen. | Practical prep without the overwhelm. |
| 0-3 months | *"The first week home: a survival plan."* | Nobody tells you what the first 7 days actually look like. Here's a day-by-day guide from dads who lived it. | Day-by-day first week. Meals, sleep shifts, visitor management, when to accept help. |

---

## Dashboard UX — Wireframes

### "My Journey" Tab (Default)

```
┌─────────────────────────────────────────┐
│  Dashboard Header                       │
│  "Good morning, Ashirbad"    Week 28    │
├─────────────────────────────────────────┤
│  [ My Journey ]  [ Action Items ]       │
├─────────────────────────────────────────┤
│                                         │
│  ┌─── Mood Check-in ─────────────────┐  │
│  │ How are you feeling today?        │  │
│  │ 😞  😔  😐  🙂  😄               │  │
│  └───────────────────────────────────┘  │
│                                         │
│  Third Trimester • Week 28              │
│                                         │
│  ┌─── Tile ──────────────────────────┐  │
│  │ 🫣 "The delivery room is coming"  │  │
│  │    Here's what nobody tells you.  ▾  │
│  └───────────────────────────────────┘  │
│                                         │
│  ┌─── Tile ──────────────────────────┐  │
│  │ 👶 "She can feel the kicks..."    │  │
│  │    You can only watch.            ▾  │
│  └───────────────────────────────────┘  │
│                                         │
│  ┌─── Tile ──────────────────────────┐  │
│  │ 💑 "She's changing. You're not."  │  │
│  │    That's the problem.            ▾  │
│  └───────────────────────────────────┘  │
│                                         │
│  ... (4 more tiles: Finances,           │
│       Knowledge, Planning, Family)      │
│                                         │
└─────────────────────────────────────────┘
```

### Expanded Tile View

```
┌─── Anxiety & Fear ──────────────────────┐
│ 🫣 "The delivery room is coming.        │
│    Here's what nobody tells you."        │
│                                     ▴   │
│─────────────────────────────────────────│
│                                         │
│  Here's the thing about the delivery    │
│  room — you've seen it in movies, you   │
│  imagined it in your head, but nothing  │
│  prepares you for standing there while  │
│  the person you love most is in pain    │
│  and you can't do anything about it...  │
│                                         │
│  (500-1000 word narrative continues)    │
│                                         │
│  ── Things you can do right now ──      │
│  ┌──────────────────────────────────┐   │
│  │ Take the hospital tour           │   │
│  │ Knowing the space removes one    │   │
│  │ layer of anxiety on the day.     │   │
│  └──────────────────────────────────┘   │
│  ┌──────────────────────────────────┐   │
│  │ Ask your partner about her plan  │   │
│  │ Birth plan, pain management,     │   │
│  │ who she wants in the room.       │   │
│  └──────────────────────────────────┘   │
│                                         │
│  ── What other dads say ──              │
│  ┌──────────────────────────────────┐   │
│  │ "I thought I'd pass out. I       │   │
│  │  didn't. You find strength you   │   │
│  │  didn't know you had."           │   │
│  │  — James, first-time dad, 34     │   │
│  └──────────────────────────────────┘   │
│  ┌──────────────────────────────────┐   │
│  │ "The worst part was the waiting. │   │
│  │  12 hours of nothing happening   │   │
│  │  and then everything at once."   │   │
│  │  — David, dad of 2, 31          │   │
│  └──────────────────────────────────┘   │
│                                         │
└─────────────────────────────────────────┘
```

### Mood Check-in — After Selection

```
┌─── Mood Check-in ─────────────────────┐
│ How are you feeling today?            │
│ 😞  😔  😐  [🙂]  😄    ← selected   │
│                                       │
│ Anything going on? (optional)         │
│ ┌────────────┐ ┌──────────────────┐   │
│ │ 😴 Sleep   │ │ 💔 Argued with   │   │
│ │  deprived  │ │    partner       │   │
│ └────────────┘ └──────────────────┘   │
│ ┌────────────┐ ┌──────────────────┐   │
│ │ 🔌 Feeling │ │ 💼 Overwhelmed   │   │
│ │disconnected│ │    at work       │   │
│ └────────────┘ └──────────────────┘   │
│ ┌────────────┐ ┌──────────────────┐   │
│ │ 👨‍👩‍👦 Family │ │ 🌟 Feeling      │   │
│ │  pressure  │ │    great         │   │
│ └────────────┘ └──────────────────┘   │
│ ┌────────────┐ ┌──────────────────┐   │
│ │ 🥰 Bonding │ │ 😰 Anxious      │   │
│ │   moment   │ │                  │   │
│ └────────────┘ └──────────────────┘   │
│                                       │
│ ┌─────────────────────────────────┐   │
│ │          Check in               │   │
│ └─────────────────────────────────┘   │
└───────────────────────────────────────┘
```

### Mood Check-in — Already Done Today

```
┌─── Mood ─────────────────────────────┐
│ 🙂 Today: feeling good   3-day streak│
└──────────────────────────────────────┘
```

### Onboarding Screen: "Tell us about you"

```
┌─────────────────────────────────────────┐
│                                         │
│  Every dad's situation is different.    │
│  Help us understand yours.              │
│                                         │
│  What's your work setup?                │
│  ┌──────────┐ ┌──────────┐              │
│  │ Full-time│ │ Part-time│              │
│  └──────────┘ └──────────┘              │
│  ┌──────────┐ ┌──────────┐              │
│  │  Remote  │ │  Hybrid  │              │
│  └──────────┘ └──────────┘              │
│  ┌──────────┐ ┌──────────┐              │
│  │Self-empl.│ │Stay-home │              │
│  └──────────┘ └──────────┘              │
│                                         │
│  Is this your first baby?               │
│  ┌──────┐ ┌──────┐                      │
│  │ Yes  │ │  No  │                      │
│  └──────┘ └──────┘                      │
│                                         │
│  What keeps you up at night?            │
│  (select all that apply)                │
│                                         │
│  💰 Finances    💑 Relationship changes │
│  👨 Being a     ⚖️ Work-life           │
│     good dad       balance              │
│  👨‍👩‍👦 Family      🏥 Health anxiety      │
│     interference                        │
│  🍼 Labor &     🪞 Losing my           │
│     delivery       identity             │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │          Continue →             │    │
│  └─────────────────────────────────┘    │
│  Skip for now                           │
└─────────────────────────────────────────┘
```

### Onboarding Screen: "Your support system"

```
┌─────────────────────────────────────────┐
│                                         │
│  No dad does this alone.                │
│  Where do you stand?                    │
│                                         │
│  How's your relationship with           │
│  your partner?                          │
│  ┌──────────┐ ┌──────────┐              │
│  │  Great   │ │   Good   │              │
│  └──────────┘ └──────────┘              │
│  ┌──────────┐ ┌──────────┐              │
│  │ It's     │ │Struggling│              │
│  │ complex  │ │          │              │
│  └──────────┘ └──────────┘              │
│  ┌──────────┐ ┌──────────┐              │
│  │  Single  │ │ Prefer   │              │
│  │          │ │ not say  │              │
│  └──────────┘ └──────────┘              │
│                                         │
│  Do you have family nearby?             │
│  ┌──────┐ ┌──────┐                      │
│  │ Yes  │ │  No  │                      │
│  └──────┘ └──────┘                      │
│                                         │
│  Friends who are dads?                  │
│  ┌──────┐ ┌──────┐                      │
│  │ Yes  │ │  No  │                      │
│  └──────┘ └──────┘                      │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │       Let's get started →       │    │
│  └─────────────────────────────────┘    │
│  Skip for now                           │
└─────────────────────────────────────────┘
```

---

## Technical Implementation Plan

### Phase 1: Database Migrations (Supabase)

**Migration 1: `dad_challenge_content` table**
- New enum `dad_challenge_pillar`: knowledge, planning, finances, anxiety, baby_bonding, relationship, extended_family
- Phase as TEXT with CHECK constraint (9 phases including pre-pregnancy)
- Columns: pillar, phase, headline, preview, icon, narrative (markdown), action_items (JSONB array of {title, description}), dad_quotes (JSONB array of {quote, attribution}), sort_order, is_premium
- UNIQUE(pillar, phase)
- Indexes on phase and pillar

**Migration 2: `dad_profiles` table**
- user_id (FK to profiles, UNIQUE)
- work_situation (TEXT with CHECK), concerns (TEXT[]), partner_relationship (TEXT with CHECK)
- family_nearby (BOOLEAN), has_friend_support (BOOLEAN), is_first_time_dad (BOOLEAN)

**Migration 3: `mood_checkins` table**
- user_id, family_id (FKs), mood (TEXT CHECK: struggling/rough/okay/good/great)
- situation_flags (TEXT[]), note (TEXT), phase (TEXT), checked_in_at (TIMESTAMPTZ)
- Indexes on user_id, family_id, checked_in_at

**Migration 4: RLS policies**
- dad_challenge_content: read-only for authenticated users
- dad_profiles: users can CRUD their own
- mood_checkins: users can CRUD their own, read family members'

### Phase 2: Types, Utilities & Config

**New files:**
- `src/types/dad-journey.ts` — all new TypeScript types (DadChallengePillar, ContentPhase, DadChallengeContent, DadProfile, MoodCheckin, PillarConfig, MoodConfig, etc.)
- `src/lib/phase-utils.ts` — maps family_stage + current_week → ContentPhase, reuses isPregnancyStage() from src/lib/pregnancy-utils.ts
- `src/lib/dad-pillar-config.ts` — PILLAR_CONFIG (7 pillars with colors/icons/gradients), MOOD_CONFIG (5 levels), SITUATION_FLAGS (8 flags), DAD_CONCERNS (8 options)

### Phase 3: Service Layer & Hooks

**New files:**
- `src/services/dad-journey-service.ts` — Supabase queries (follows src/services/briefing-service.ts pattern)
  - getContentForPhase(), getDadProfile(), upsertDadProfile(), submitMoodCheckin(), getRecentCheckins(), getLastCheckin()
- `src/hooks/use-dad-journey.ts` — React Query hooks (follows src/hooks/use-dashboard.ts pattern)
  - useDadChallengeContent(), useDadProfile(), useUpsertDadProfile(), useSubmitMoodCheckin(), useLastCheckin()

### Phase 4: Deeper Onboarding (dad role only)

**New files:**
- `src/app/(auth)/onboarding/dad-profile/page.tsx` — work situation + first-time dad + concerns
- `src/app/(auth)/onboarding/dad-support/page.tsx` — partner relationship + family nearby + friend support

**Modified files:**
- `src/app/(auth)/onboarding/invite/page.tsx` — route dads to /onboarding/dad-profile after invite step

### Phase 5: Dashboard Restructure

**New files:**
- `src/components/dashboard/DadJourneyTab.tsx` — "My Journey" tab (mood widget + phase label + tiles)
- `src/components/dashboard/ActionItemsTab.tsx` — existing cards extracted here (no logic changes)

**Modified files:**
- `src/components/dashboard/DashboardClient.tsx` — wrap content in Radix Tabs, compute ContentPhase

### Phase 6: Expandable Dad Challenge Tiles

**New directory: `src/components/dashboard/dad-journey/`**
- `DadChallengeTiles.tsx` — container, fetches content via useDadChallengeContent(), Framer Motion stagger animation
- `DadChallengeTile.tsx` — individual expandable tile with color-coded left border, gradient bg, expand/collapse with Framer Motion height animation, renders: narrative (markdown), action items, dad quotes
- `MoodCheckinWidget.tsx` — two states: emoji selector + flags → submit, or compact "already checked in" summary with streak
- `index.ts` — barrel exports

**Reuses existing components:**
- `src/components/ui/tabs.tsx` (Radix Tabs)
- `src/components/briefings/BriefingSection.tsx` (color pattern reference)
- `src/components/tasks/task-section.tsx` (collapsible pattern reference)
- `src/components/tasks/animations/task-animations.tsx` (stagger + spring animations)
- `src/components/marketing/ArticleContent.tsx` (react-markdown rendering)

### Phase 7: Content Generation & Seeding

**New file: `content/dad-challenges.json`**
- 63 content pieces (7 pillars x 9 phases)
- Each piece: headline, preview, icon, narrative (500-1000 words markdown), action_items [{title, description}], dad_quotes [{quote, attribution}]
- Tone: peer dad, direct, honest, occasionally funny, never preachy
- AI-generated, user reviews and edits

**Seeding migration** to INSERT all content into dad_challenge_content table

---

## File Summary

### New files (14):
| File | Purpose |
|------|---------|
| `src/types/dad-journey.ts` | All new TypeScript types |
| `src/lib/phase-utils.ts` | Phase mapping utility |
| `src/lib/dad-pillar-config.ts` | Pillar/mood/flag constants |
| `src/services/dad-journey-service.ts` | Supabase queries |
| `src/hooks/use-dad-journey.ts` | React Query hooks |
| `src/app/(auth)/onboarding/dad-profile/page.tsx` | Onboarding: work & concerns |
| `src/app/(auth)/onboarding/dad-support/page.tsx` | Onboarding: support system |
| `src/components/dashboard/DadJourneyTab.tsx` | "My Journey" tab content |
| `src/components/dashboard/ActionItemsTab.tsx` | "Action Items" tab (existing cards) |
| `src/components/dashboard/dad-journey/DadChallengeTiles.tsx` | Tile container |
| `src/components/dashboard/dad-journey/DadChallengeTile.tsx` | Expandable tile component |
| `src/components/dashboard/dad-journey/MoodCheckinWidget.tsx` | Mood check-in widget |
| `src/components/dashboard/dad-journey/index.ts` | Barrel exports |
| `content/dad-challenges.json` | All 63 challenge content pieces |

### Modified files (3):
| File | Change |
|------|--------|
| `src/components/dashboard/DashboardClient.tsx` | Wrap in Tabs, split into two tab views |
| `src/app/(auth)/onboarding/invite/page.tsx` | Route dads to deeper onboarding |
| `src/app/(auth)/onboarding/complete/page.tsx` | Update setup items list |

### Supabase migrations (4):
1. `dad_challenge_content` table + enum
2. `dad_profiles` table
3. `mood_checkins` table
4. RLS policies for all three

---

## Verification Plan

1. **Database**: Run migrations, verify tables with `list_tables`, check RLS with `get_advisors`
2. **Onboarding**: Sign up as dad → verify deeper onboarding screens appear → verify data in `dad_profiles`
3. **Dashboard**: Log in → "My Journey" is default tab → "Action Items" tab has all existing cards
4. **Tiles**: 7 tiles render for current phase → expand → narrative + action items + quotes display
5. **Mood**: Check in → saved to DB → refresh → "already checked in" → next day → reset
6. **Non-dad users**: Log in as mom → no dad-specific onboarding → dashboard tabs still work
