# The Dad Center — Paywall Strategy v2.1

**Version:** 2.1  
**Status:** APPROVED  
**Updated:** March 2026  
**Domain:** thedadcenter.com

---

## Core Paywall Principle

A solo dad gets immense emotional support and practical tools for **free**. The moment he wants to **see further ahead**, **coordinate with his partner in real-time**, or **unlock analytics and insights** — that's the upgrade.

- **Free** = "This app gets me" + SEO surface
- **Freemium** = "I need the full version" (time-gated)
- **Premium** = Coordination + analytics + full timeline

---

## Pricing

| Plan | Price | Notes |
|------|-------|-------|
| **Free** | $0 forever | Lead generation, trust-building, SEO |
| **Monthly** | $4.99/mo | Trial-hesitant users |
| **Annual** | $39.99/yr ($3.33/mo) | Core business, best value messaging |
| **Lifetime** | $99.99 once | Multi-child planners, early adopters |

- 14-day free trial, no credit card required
- 30-day money-back guarantee
- One subscription per family — both partners share access

### Revenue Per Sale (After Fees)

| Plan | Price | Web (Stripe) | App Store (15%) | App Store (30%) |
|------|-------|-------------|-----------------|-----------------|
| Monthly | $4.99 | $4.55 | $4.24 | $3.49 |
| Annual | $39.99 | $38.30 | $33.99 | $28.00 |
| Lifetime | $99.99 | $96.60 | $84.99 | $70.00 |

Push users to web checkout for best margins.

---

## Feature Access Matrix — Complete Reference

### 1. Dad Journey — My Journey Tab (NEW)

| Feature | Free | Premium |
|---------|------|---------|
| 7 Challenge Pillar Tiles | ✅ All 7 tiles with headlines + previews for current phase | — |
| Tile Narrative Content (500-1000 words) | ✅ Current phase: all 7 pillars fully expanded | All phases unlocked (past + future) |
| Tile Ordering by Concerns | ✅ Personalized for all users who complete onboarding | — |
| Mood Check-ins | ✅ Unlimited daily check-ins with full flag selection + streaks | — |
| Mood History & Trends | Last 7 days of check-in history | Full history + trend charts + flag correlation insights |
| Dad-Specific Onboarding | ✅ Full onboarding flow with skip options | — |

**Gating rationale:** The emotional content IS the hook. Current-phase narratives are free so the dad always has relevant deep content. Premium unlocks past/future phases — "see what's ahead" aligns with the "no surprises" positioning. Mood check-ins are free to build daily habit; analytics on top are premium.

---

### 2. Weekly Briefings

| Feature | Free | Premium |
|---------|------|---------|
| Weekly Briefings (~140 total) | Current week + 3 adjacent weeks (4-week rolling window from signup) | All ~140 briefings from conception through 24 months |
| Briefing Archive | ✗ | ✅ Full archive with search |

**Gating logic:** Signup date determines Week 1 of free window. User signing up at pregnancy Week 20 gets Weeks 20-23 free. Week 24 (5th week) triggers paywall. This is the **#1 expected conversion trigger**.

---

### 3. Smart Task Management

| Feature | Free | Premium |
|---------|------|---------|
| Task Timeline (200+ tasks) | 30-day rolling window | Full timeline (conception → 24 months) |
| Mark Tasks Complete | ✅ For all visible tasks | ✅ |
| Custom Tasks | ✅ Unlimited | ✅ |
| Snooze / Reschedule Tasks | ✗ | ✅ |
| Task Assignment (to partner) | ✗ | ✅ |
| Catch-up / Backlog Triage | Last 30 days of backlog (full triage). Older tasks: titles visible but locked. | Full backlog triage for entire timeline |

**Anti-gaming note:** Catch-up backlog is capped at 30 days free to prevent users from signing up with fake late-pregnancy dates and triaging the full 9-month timeline for free. 30-day limit matches the task window.

---

### 4. Baby Tracker (Post-birth)

| Feature | Free | Premium |
|---------|------|---------|
| Basic Logging (feed, diaper, sleep) | ✅ Full logging with timestamps and attribution | ✅ |
| Quick Log Buttons | ✅ | ✅ |
| Advanced Log Types (temp, medicine, vitamin D, mood, weight, height, milestones, custom) | ✗ | ✅ All types including custom |
| Tracker History | Last 7 days | All time with search |
| Daily / Weekly Summaries | ✗ | ✅ Full analytics dashboard |
| Shift Briefing (partner handoff) | ✗ | ✅ |

---

### 5. Budget Planner (ALL FREE)

| Feature | Free | Premium |
|---------|------|---------|
| Browse Budget Items (100+ items, 3 price tiers, real brands) | ✅ Full browse | ✅ |
| My Budget (personalized tracking, purchases, actual vs estimated) | ✅ Full editing and tracking | ✅ |
| Budget Timeline Widget | ✅ Full visualization | ✅ |

**Rationale:** Budget planner is entirely free. It's a primary hook for data-minded dads and a key SEO surface for searches like "baby budget calculator", "how much does a baby cost". Every budget interaction deepens engagement. Potential affiliate revenue from brand recommendations.

---

### 6. Checklists (ALL FREE)

| Feature | Free | Premium |
|---------|------|---------|
| All 15+ Checklists (350+ items) | ✅ Full access, check-off, progress tracking | ✅ |

Includes: Hospital bag (mom & dad), car seat safety, babyproofing, emergency info, pediatrician prep, newborn essentials, first illness, solid foods, first car ride, first flight, road trip, restaurant outing, daycare tour, returning to work, first hotel, first night away.

**Rationale:** Every checklist is a potential Google landing page. SEO value of all checklists as landing pages outweighs any premium gating revenue.

---

### 7. Partner Sync & Mom's Role

| Feature | Free | Premium |
|---------|------|---------|
| Partner Invite | ✅ Mom can join and access the app | ✅ |
| Mom's Dashboard View | ✅ Action Items default, read-only Journey tab, shared tasks/logs/checklists/budget (manual refresh) | Realtime sync + activity feed |
| Realtime Sync | ✗ (manual refresh) | ✅ Instant sync via Supabase Realtime |
| Partner Activity Feed | ✗ | ✅ |
| Checklist Progress Sharing | ✅ Basic shared view (updated on refresh) | Realtime sync |

**Design principle:** "The app is for him. She has access to help." Mom is co-pilot, not a separate user journey. Free: she can see and contribute. Premium: real-time coordination.

---

### 8. Calendar & Notifications

| Feature | Free | Premium |
|---------|------|---------|
| Calendar View (multi-source, month/week/agenda) | First 4 weeks from signup — full calendar with all overlays | ✅ Ongoing access |
| Push Notifications (task reminders, briefing alerts, partner activity, quiet hours) | First 30 days — full push notifications with all reminder types | ✅ Ongoing, fully configurable |
| Weekly Briefing Email | ✅ During free briefing window (first 4 weeks) | ✅ Ongoing |
| Task Reminder Emails | ✗ | ✅ |

**Key conversion trigger:** Push notifications and tasks both expire around day 30, creating a dual conversion trigger — dad loses both task visibility AND reminders at the same time.

---

### 9. Resource Library (ALL FREE)

| Feature | Free | Premium |
|---------|------|---------|
| Articles (100+) | ✅ All articles free (SEO-critical) | ✅ |
| Videos (50+) | ✅ All videos free (YouTube embeds) | ✅ |

**Rationale:** Articles are the organic acquisition channel. Every article is a Google/AI search landing page that leads users INTO gated features. Videos are YouTube embeds — content already free on the internet.

---

### 10. Settings & Account

| Feature | Free | Premium |
|---------|------|---------|
| Profile & Family Management | ✅ | ✅ |
| Theme (Light/Dark/Auto) | ✅ | ✅ |
| Data Export | ✅ Full data export for all users | ✅ |

**Data Export note:** Free for all users. GDPR Article 20 (data portability) and CCPA require users to be able to export their personal data. This is a legal compliance requirement, not a feature to gate.

---

## Free Tier Summary (What's NOT behind the paywall)

Everything below is free — either an SEO landing page, a daily engagement hook, or a legal requirement:

- Complete budget planner (100+ items, 3 tiers, editing, timeline)
- All 15+ checklists (350+ items)
- All 100+ articles (SEO landing pages)
- All 50+ curated videos
- All 7 dad journey pillar tiles (current phase narratives)
- Mood check-ins + 7-day history
- Push notifications (first 30 days)
- Calendar (first 4 weeks)
- 30-day task window + custom tasks
- Basic baby logging (feed, diaper, sleep) + 7-day history
- Partner invite + basic shared view
- Full personalized onboarding
- Data export (GDPR/CCPA)
- Light/dark theme

---

## Premium Value Proposition Summary

Everything in Free, plus:

- All phase narratives (past + future) — "see what's ahead"
- Full mood trends & correlation insights
- All ~140 weekly briefings + archive
- Full task timeline (pregnancy → 24 months)
- Task snooze, reschedule, and assignment
- Full backlog triage (all past tasks)
- All baby log types + unlimited history
- Daily/weekly tracker summaries
- Shift briefings for partner handoff
- Ongoing calendar access
- Ongoing push notifications
- Realtime partner sync + activity feed
- Task reminder emails

---

## Upgrade Trigger Locations

### HIGH Conversion

| Location | Trigger | Copy |
|----------|---------|------|
| Briefings (Week 5+) | Navigate to week 5+ from signup | "Your free briefings have ended. Upgrade to keep getting weekly guidance tailored to your exact week — all the way through age 2." |
| Tasks (Day 31+) | Tap task beyond 30-day window | "Unlock your complete timeline. 200+ expert tasks from pregnancy through Year 2 — so nothing catches you off guard." |
| Push Notifications (Day 31+) | Notification settings show free period ended | "Keep your reminders. Upgrade so nothing slips through the cracks — task alerts, briefing notifications, and partner updates." |
| Weekly Briefing Email (Week 5) | Week 5 email delivery | "This is your last free briefing. Upgrade to continue receiving weekly guidance every [day] morning." |

### MEDIUM-HIGH Conversion

| Location | Trigger | Copy |
|----------|---------|------|
| Dad Journey — Future Phases | Tap future/past phase tile narrative | "See what's ahead. Unlock all phases so you're always one step prepared — no surprises." |
| Calendar (Week 5+) | Open calendar after 4-week window expires | "Keep your complete view. See tasks, briefings, and milestones all in one calendar — so nothing sneaks up on you." |
| Shift Briefing | Tap 'Create Shift Briefing' in tracker | "Hand off like a pro. Get shift briefings so your partner knows exactly what happened while they slept." |

### MEDIUM Conversion

| Location | Trigger | Copy |
|----------|---------|------|
| Mood Trends | Tap 'View trends' after 7+ check-ins | "You've been checking in — see what your patterns reveal. Unlock mood trends and insights." |
| Baby Tracker — Advanced | Tap advanced log type or history beyond 7 days | "Track everything, see the full picture. Unlock all log types and unlimited history." |
| Realtime Sync | Notice 'last updated X min ago' instead of instant | "Get instant partner sync. See her updates the moment they happen — no more refreshing." |
| Dashboard — Soft Prompt | After 30 days on free, if active | "You've completed X tasks and checked in Y times. Unlock the full operating system for fatherhood." |

### LOW-MEDIUM Conversion

| Location | Trigger | Copy |
|----------|---------|------|
| Catch-up Backlog (31+ days) | See locked older tasks during triage | "Unlock your full history. Triage all past tasks and catch up on everything you might have missed." |

---

## Implementation Notes

### Client-Side vs Server-Side Enforcement

| Check | Client-Side | Server-Side |
|-------|-------------|-------------|
| Show/hide lock icons | ✅ | — |
| Blur locked content | ✅ | — |
| Trigger upgrade modals | ✅ | — |
| Actual data access | — | ✅ Required |
| Subscription validation | — | ✅ Required |

**Critical:** Never trust client-side subscription state for data access. Always validate server-side.

### Free-to-Premium Data Migration

When a user upgrades:
- All existing data (baby logs, completed tasks, mood history) immediately unlocks
- Full history view becomes available
- No data is ever deleted during free period
- Partner gets full realtime sync immediately

### Premium-to-Free Downgrade (Subscription Lapse)

When subscription expires:
- **Data is retained** — nothing is deleted
- Access reverts to free tier limits
- Baby logs beyond 7 days become inaccessible (but preserved)
- Tasks revert to 30-day window
- Briefings revert to title-only for locked weeks
- Realtime partner sync disabled (falls back to manual refresh)
- Push notifications disabled
- Calendar access disabled
- Grace period: 7 days of premium access after failed payment before downgrade
- Partner account sees "Subscription lapsed — contact [primary user] to restore"

### Partner Account Handling

| Scenario | Behavior |
|----------|----------|
| Primary subscribes | Both users get premium |
| Primary cancels | Both users downgrade to free |
| Partner tries to subscribe | Prompt to have primary subscribe, or become new primary |
| Primary deletes account | Partner becomes primary (if subscribed) or loses shared data access |

### Platform-Specific Payment

| Platform | Processor | Notes |
|----------|-----------|-------|
| Web | Stripe | Push users here — best margins (96.5%) |
| iOS | RevenueCat → App Store | Required for in-app purchases |
| Android | RevenueCat → Google Play | Required for in-app purchases |

Cross-platform sync via RevenueCat. Web subscriber sees premium on mobile and vice versa.

---

## Time-Gated Free Windows Summary

| Feature | Free Window | Premium |
|---------|-------------|---------|
| Weekly Briefings | 4 weeks from signup | All ~140 weeks |
| Task Timeline | 30-day rolling window | Full timeline |
| Catch-up Backlog | Last 30 days | Full history |
| Calendar | 4 weeks from signup | Ongoing |
| Push Notifications | 30 days from signup | Ongoing |
| Weekly Briefing Email | 4 weeks from signup | Ongoing |
| Mood History | Last 7 days | Full history |
| Tracker History | Last 7 days | Full history |

---

## Metrics to Track

### Conversion Funnel

| Metric | Target |
|--------|--------|
| Free → Premium conversion rate | 10% (Year 1), 12-15% (Year 2+) |
| Time to conversion (median) | 21-30 days |
| Upgrade trigger with highest conversion | Track and optimize |

### Paywall Performance

| Metric | Track |
|--------|-------|
| Paywall views by trigger location | Which walls get seen most |
| Conversion rate by trigger | Which walls convert best |
| Dismissal rate | How often users close without action |
| Day-30 cliff conversion | How many convert when tasks + notifications expire simultaneously |

---

## Document History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | December 2025 | Initial paywall spec (as "The Family Protocol") |
| 2.0 | March 2026 | Dad-first redesign, resolved doc conflicts, new pricing, dad journey features |
| 2.1 | March 2026 | 30-day task window (was 14), 30-day catch-up limit (anti-gaming), budget planner all free, all checklists free, calendar 4-week free window, data export free (GDPR), push notifications 30-day free window |

---

*This document is the source of truth for paywall implementation. Use alongside PRODUCT_FEATURES.md and dad-first-redesign-plan.md.*
