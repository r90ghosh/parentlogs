# Last Mile: Web vs Mobile Gap Analysis

> Comparing Next.js web (`apps/web/`) vs Expo mobile (`apps/mobile/`) — what's different and what needs fixing.

---

## Must Fix (Core UX Broken)

| # | Gap | Web | Mobile | Why It Matters |
|---|-----|-----|--------|----------------|
| 1 | **Forgot/Reset Password** | `/forgot-password`, `/reset-password` | Missing entirely | Users locked out — must use web to recover |
| 2 | **Profile Editing** | `/settings/profile` — edit name, avatar, role | Display-only (read but can't edit) | Can't change name or role from mobile |
| 3 | **Family Members dead button** | `/settings/family` — full editing | `onPress={() => {}}` is a no-op | Button does nothing when tapped |
| 4 | **Task Creation** | `/tasks/new` — dedicated form | No screen | Can't create custom tasks from mobile |
| 5 | **Help & Support** | `/help` — FAQ + contact form | Missing | No way to get help or contact support |

---

## Should Fix (Feature Parity)

| # | Gap | Web | Mobile | Impact |
|---|-----|-----|--------|--------|
| 6 | **Task Triage/Catch-up** | `/tasks/triage` — overdue backlog management | Missing | Can't manage overdue tasks |
| 7 | **Briefing Archive** | `/briefing/archive` — browse all past weeks | Missing | Only prev/next nav, no full archive |
| 8 | **Tracker Summary** | `/tracker/summary` — analytics/trends | Missing | No data insights on mobile |
| 9 | **Content Library** | `/content`, `/content/articles/[slug]` — articles, tips, videos | Missing | No educational content on mobile |
| 10 | **Subscription Management** | `/settings/subscription` — billing portal, dates, cancel | Upgrade only (RevenueCat) | Can't view billing details or manage plan |
| 11 | **Family Settings** | `/settings/family` — edit due date, birth date, baby name, remove members | Read-only | Can't edit family data from mobile |
| 12 | **Notification Preferences** | `/settings/notifications` — push/email/reminder granular toggles | Basic screen | Fewer options than web |

---

## Nice to Have

| # | Gap | Web | Mobile | Notes |
|---|-----|-----|--------|-------|
| 13 | **Calendar View** | `/tasks?view=calendar` | Missing | Visual calendar for tasks |
| 14 | **Checklist Detail** | `/checklists/[id]` — per-checklist drill-down | Unclear if drill-down works | Needs verification |
| 15 | **Onboarding Welcome** | `/onboarding` — feature highlight screen | Jumps to role selection | Less context for new users |
| 16 | **Appearance Settings** | `/settings/appearance` — theme/display | Missing | Minor — mobile is dark-only |
| 17 | **Privacy/Terms** | `/privacy`, `/terms` | Missing | Can deep-link to web |

---

## UX Inconsistencies

### More Menu Differences
- **Web**: Checklists, Budget, **Articles**, **Dad Tips**, Family Settings, Invite Partner, Settings, Upgrade, **Help**
- **Mobile**: Budget Planner, Checklists, **Dad Journey**, Family Members, Invite Partner, Profile, Notifications, Subscription, Settings
- Missing from mobile: **Articles/Content**, **Help & Support**
- Mobile adds Dad Journey here (web has it at `/journey` from dashboard)

### Settings Architecture
- **Web**: Hub + 5 sub-pages (Profile, Family, Notifications, Appearance, Subscription) — each a full editable page
- **Mobile**: Single flat scrollable screen — profile fields are display-only, Family Members is a dead button

### Task Screen Depth
- **Web**: StatsBar, FilterBar, CatchUpBanner, CatchUpSection, FocusCard, ProgressCard, StreakBanner, ComingUpPreview, WeekCalendarCard
- **Mobile**: Stats row, filter tabs, grouped sections, task detail — missing triage, catch-up, calendar, streak/focus

### Dashboard Cards
- **Web**: 20+ cards with priority engine (role-aware ordering)
- **Mobile**: Subset — needs audit of which cards are implemented

---

## Architectural Divergences

### 1. Duplicate Services
- `apps/web/src/services/` — 12 files, singleton pattern (`const supabase = createClient()`)
- `packages/services/src/` — 11 files, factory pattern (`createFooService(supabase)`)
- Mobile only uses `@tdc/services`. Web uses both — **drift risk**.
- **Fix**: Migrate web to use only `@tdc/services`

### 2. Duplicate Types
- `apps/web/src/types/` — database, dashboard, dad-journey types
- `packages/shared/src/types/` — same domains
- **Fix**: Consolidate to `@tdc/shared/types`

### 3. Split Delete Account
- Web: API route `/api/account/delete`
- Mobile: Edge Function `/functions/v1/delete-account`
- **Fix**: Both should use the same backend (Edge Function or API route)

---

## Summary

| Category | Count |
|----------|-------|
| Must fix (core UX broken) | 5 |
| Should fix (feature parity) | 7 |
| Nice to have | 5 |
| UX inconsistencies | 4 areas |
| Architectural issues | 3 |
| **Total gaps** | **~15 screens/features** |
| Web missing from mobile | Minimal (platform-specific only) |
