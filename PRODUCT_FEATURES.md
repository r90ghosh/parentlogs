# The Dad Center (thedadcenter.com) — Complete Product Feature Reference

> Use this document as context when working with Claude on marketing, content, strategy, or product decisions for The Dad Center.

## Product Overview

**The Dad Center** is a web app (PWA) that guides parents — primarily dads — from pregnancy through baby's first 24 months. It combines weekly briefings, 200+ pre-loaded tasks, baby tracking, budget planning, checklists, and partner sync into one platform.

- **Tagline:** "The Operating System for Modern Fatherhood"
- **Positioning:** "Finally, a parenting app that respects your intelligence"
- **Stack:** Next.js 16, React 19, Supabase (Postgres + Auth + Realtime), Stripe, Tailwind CSS
- **Deployed on:** Netlify (frontend), Supabase Cloud (backend)
- **Domain:** thedadcenter.com

---

## Target Audience

| Segment | Description |
|---------|-------------|
| **Primary:** The Planner Dad | First-time expectant father, 28-38, tech-comfortable, wants a system |
| **Primary:** The Involved Partner | Dad who wants to help but doesn't know what to do each week |
| **Secondary:** The Gift-Giver Mom | Pregnant woman or new mom who wants her partner more involved |

---

## Pricing

| Plan | Price | Features |
|------|-------|----------|
| **Free** | $0 forever | 14-day task window, 4 briefings, 10 checklists, basic tracker (7-day history), limited budget |
| **Monthly** | $4.99/mo | Everything unlocked |
| **Yearly** | $39.99/yr | Everything unlocked (save 33%) |
| **Lifetime** | $99.99 once | Everything unlocked forever |

Payment via Stripe. 14-day free trial, no credit card required. 30-day money-back guarantee.

---

## Core Features

### 1. Dashboard (Command Center)

The home screen after login. Shows a personalized overview based on the user's pregnancy/postpartum stage.

**Components displayed:**
- Welcome greeting with partner's name
- Current week briefing preview card
- Baby development card (size comparison during pregnancy, e.g., "Your baby is the size of a mango")
- Priority/overdue tasks card
- Upcoming events (next 7 days)
- Mom status card (what partner is experiencing this week)
- Partner activity feed (recent partner actions — Premium)
- Achievement banner (progress milestones)
- Countdown to due date / days since birth
- Quick action buttons (calendar, add task)

**Personalization:** All content dynamically adjusts based on due date, birth date, current week, and family stage.

---

### 2. Weekly Briefings

Expert-written, medically-sourced weekly guides. The core content experience.

**Coverage:**
- **Pregnancy:** 40 weeks (Week 1 through Week 40)
- **Post-birth weeks:** Weeks 1-12 (weekly granularity)
- **Post-birth months:** Months 2-24 (monthly after week 12)
- **Total:** ~140 briefings

**Each briefing contains:**
- **Baby Update** — Development milestones, size comparisons, what's forming/changing
- **Mom Update** — Physical and emotional changes the partner is experiencing
- **Dad Focus** — 3-5 specific, actionable items for the father this week
- **Relationship Check-in** — Communication tips, ways to support the partnership
- **Coming Up** — Preview of what's ahead in the next 1-2 weeks
- **Medical Sources** — Citations from ACOG, AAP, Mayo Clinic
- **Linked Tasks** — Related tasks from the task system

**Free vs Premium:**
- Free: Current week + 4 weeks in either direction
- Premium: Full archive (all ~140 briefings)

**Navigation:** Previous/next week buttons, archive browser for jumping to any week.

---

### 3. Smart Task Management

The largest content feature. 200+ pre-loaded tasks auto-generated based on the user's due date.

**Task properties:**
- **Status:** pending, completed, skipped, snoozed
- **Priority:** must-do, good-to-do
- **Assigned to:** mom, dad, both, either
- **Category:** medical, shopping, planning, financial, partner, self_care
- **Due date:** Auto-calculated from due date + offset
- **Time estimate:** Minutes to complete
- **Why it matters:** Explanation of importance

**Key sub-features:**

**Auto-population:** When a family is created with a due date, all 200+ tasks are generated with correct due dates. No empty state — the user sees a full timeline immediately.

**Catch-up System:** For users who sign up mid-pregnancy (e.g., at week 25), tasks from earlier weeks are flagged as "backlog." A triage flow lets the user quickly process past tasks:
- "Already did it" → mark completed
- "Add to my list" → move to active tasks
- "Skip it" → dismiss

**Task views:**
- Upcoming/overdue list with filters (status, assignee, category)
- Timeline bar showing week-by-week progression
- Overdue section highlighting urgent items
- Partner's assigned tasks view

**Custom tasks:** Users can create their own tasks with full properties.

**Free vs Premium:**
- Free: 14-day rolling window of tasks
- Premium: Full timeline from conception to 24 months

---

### 4. Baby Tracker (Post-birth)

Logging system for tracking baby's daily activities and development.

**Free log types (basic):**
- **Feeding** — breast/bottle/solid, duration or amount, which side
- **Diaper** — wet/dirty/both
- **Sleep** — duration, quality (good/fair/poor)

**Premium log types (advanced):**
- **Temperature** — value in F or C
- **Medicine** — name, dosage
- **Vitamin D** — daily tracking
- **Mood** — 1-5 scale with emoji indicators
- **Weight** — value in lbs or kg
- **Height** — value in inches or cm
- **Milestone** — name and description of developmental milestone
- **Custom** — user-defined log type

**Sub-features:**
- **Shift Briefing** — Summary of last feeding, diaper, sleep + today's counts. Designed for partner handoffs ("here's what happened while you slept").
- **Quick Log** — 3 one-tap buttons for most common log types
- **Recent Activity** — Last 5 logs with timestamps
- **Daily Summary** — Aggregate counts/durations per type (Premium)
- **Weekly Summary** — 7-day trend charts (Premium)
- **History** — Browse past logs (Free: last 7 days, Premium: all time)

**During pregnancy:** The tracker page shows sample/preview data so users understand the feature before baby arrives.

**Data model:** Flexible JSONB storage for log-specific fields, with attribution (who logged it) and timestamps.

---

### 5. Budget Planner

Comprehensive baby cost tracker with 100+ pre-seeded items and real product pricing.

**Pre-loaded items include:**
- Categories: Nursery, Gear, Health, Feeding, Diapering, Tech, Safety, Clothing, and more
- Each item has 3 price tiers: Budget (low), Mid-range, Premium (high)
- Real product examples with brand names, prices, and links
- Timeline relevance: which weeks/months each item should be purchased

**Views:**
- **Browse tab** — Accordion-style category view, expandable items with descriptions, tier price display, filter by stage and timeline
- **My Budget tab** — User's personalized budget list, add items from browse, create custom items, track purchases with actual vs estimated price, progress bar showing % purchased

**Timeline bar widget:** Visual overview of budget categories mapped to pregnancy/postpartum weeks. Click a segment to filter items.

**Premium gating:** Free users see limited budget overview; premium unlocks full access and editing.

---

### 6. Checklists

15 curated, categorized checklists with 352 total items.

**Free checklists (10):**
1. Hospital Bag
2. Nursery Setup
3. Baby Essentials
4. Documents & Legal
5. Self-Care (for dad)
6. Return to Work
7. Postpartum Home
8. First Year Firsts
9-10. (Additional free lists)

**Premium checklists (5):**
5. Baby Proofing
6. Pediatrician Prep
7. Car Safety
8. Baby Shower Planning
9. Travel with Baby

**Features:**
- Items grouped by sub-category (e.g., Hospital Bag has "Mom items", "Dad items", "Baby items")
- Check/uncheck with attribution (who checked it, when)
- Progress percentage per checklist
- Shared across family (both partners see same progress)

---

### 7. Calendar View

Multi-source calendar showing everything in one place.

**Overlays:**
- Task due dates
- Current week's briefing
- Budget item purchase targets
- Baby log entries (post-birth)

**Views:** Month, week, and agenda formats. Day-click modal shows all events for that day.

---

### 8. Resource Library

Curated expert content hub.

**Articles:** 100+ expert-reviewed articles
- Organized by stage: First trimester → 24 months
- Read time estimates
- Medical source citations
- SEO-friendly URLs (/resources/articles/[slug])
- Mixed free and premium access

**Videos:** 50+ curated YouTube embeds
- Authoritative parenting channels
- Stage-tagged for relevance
- Duration and thumbnail previews

**Features:** Full-text search, filter by stage and format, article counts per stage.

---

### 9. Partner Sync & Family System

Multi-user family coordination. Each family has an owner + optional partner.

**How it works:**
- Owner creates family during onboarding (sets due date/birth date, baby name)
- System generates an 8-character invite code
- Partner joins by entering the code
- Both users see the same tasks, logs, checklists, and budget

**Shared features:**
- Task assignment (assign to mom, dad, both, or either)
- Activity feed showing partner's recent actions
- Shift handoff in baby tracker
- Checklist progress visible to both
- Budget shared across family

**Realtime sync:** Uses Supabase Realtime to push updates instantly when either partner makes changes.

---

### 10. Notification System

**Push notifications (Premium only):**
- Browser-based Web Push API with VAPID authentication
- Service Worker receives and displays notifications

**Configurable preferences:**
- Push notifications on/off
- Email notifications on/off
- Task reminder windows: 7 days, 3 days, 1 day before due
- Partner activity alerts
- Weekly briefing delivery (choose day and time)
- Quiet hours (no notifications between set times)

**Email notifications:**
- Infrastructure ready via Resend
- Weekly briefing emails (matched to pregnancy week)
- Task reminder emails
- Partner activity digests

---

### 11. Settings & Profile

**Profile:** Update name, upload avatar, change email, delete account
**Family:** Edit baby name, due/birth date, manage members, invite code, leave family
**Notifications:** All preference controls listed above
**Appearance:** Light/dark/auto theme toggle
**Subscription:** Current plan, renewal date, feature comparison, manage billing, upgrade CTA

---

## Authentication & Onboarding

**Auth methods:** Email/password + Google OAuth (via Supabase Auth)

**Onboarding flow (5 steps for new users):**
1. Welcome screen — feature overview
2. Role selection — Mom / Dad / Other
3. Family setup — Create new family (enter stage + due date/birth date + baby name) OR join existing family via invite code
4. Invite partner — Copy shareable invite code
5. Complete — Redirected to dashboard with 200+ tasks already loaded

**Catch-up flow (if signing up mid-pregnancy):** After onboarding, user is prompted to triage backlog tasks from earlier weeks.

---

## Data & Content Volume

| Content Type | Count | Source |
|---|---|---|
| Weekly briefings | ~140 | Medically sourced, pre-seeded |
| Task templates | 200+ | Expert-curated, pre-seeded |
| Budget items | 100+ | Real pricing data, pre-seeded |
| Checklists | 15 (352 items) | Categorized, pre-seeded |
| Articles | 100+ | Expert-reviewed |
| Videos | 50+ | Curated YouTube |

All content is seeded from JSON files in `/content/` and loaded via database migrations.

---

## Free vs Premium — Complete Comparison

| Feature | Free | Premium |
|---|---|---|
| Task timeline | 14-day window | Full pregnancy → 24 months |
| Briefings | Current week + 4 adjacent | All ~140 briefings |
| Tracker log types | Feeding, Diaper, Sleep | + Temperature, Medicine, Vitamin D, Mood, Weight, Height, Milestone, Custom |
| Tracker history | Last 7 days | All time |
| Tracker summaries | No | Daily + weekly analytics |
| Checklists | 10 of 15 | All 15 |
| Budget | Limited overview | Full access + editing |
| Partner sync | Invite only | Full realtime sync + activity feed |
| Push notifications | No | Yes |
| Data export | No | Yes |
| Custom tasks | Yes | Yes |

---

## Technical Details (for product/dev discussions)

**Database:** PostgreSQL via Supabase with Row-Level Security. All family data isolated — users can only access their own family's records.

**Key tables:** profiles, families, family_tasks, task_templates, briefing_templates, baby_logs, budget_templates, family_budget, checklist_templates, checklist_item_templates, checklist_progress, subscriptions, notification_preferences, push_subscriptions, articles, videos

**Week calculation logic:**
- Pregnancy: `week = 40 - (days_until_due / 7)`
- Post-birth: `week = days_since_birth / 7`
- Family stage auto-updates via database trigger

**Stripe integration:** Checkout sessions, customer portal, webhook handling for subscription lifecycle (created, updated, deleted, payment succeeded/failed).

**API routes:**
- `POST /api/stripe/checkout` — Create checkout session
- `POST /api/stripe/portal` — Open billing portal
- `POST /api/stripe/webhook` — Handle Stripe events
- `POST /api/account/delete` — Delete user account
- `POST /auth/callback` — OAuth callback

**Edge functions:** `send-notifications` (Deno) — scheduled notification delivery via Web Push API.

**Offline:** Service Worker registered, offline fallback page, PWA manifest for mobile install.
