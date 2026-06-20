# V2 Clean Build — Mobile Redesign Plan

> **Build spec — design phase complete (2026-06-19).** All 46 screens have an approved direction with HTML mockups. See **"How to build this (START HERE)"** below for build order, mockup index, and assumed decision defaults.

## Vision

Move the mobile app from the dark "Warm Luxury Editorial" look to a **light, clean, calm** system that respects a dad's time: less decoration, less motion, less on screen at once. Each screen is redesigned page-by-page; this doc is the running spec.

**Approved direction (Briefing): the "Digest" take** — light warm-paper theme, soft sans-serif, near-monochrome with one restrained accent, and content presented as a **feed of skimmable one-liners** (tap to expand for detail) instead of long scrolling sections. Mockup of record: `apps/mobile/docs/briefing-redesign-2.html` → **Take A · Digest**.

### Principles
1. **One-liner first, detail on demand** — the whole screen is readable in ~20 seconds; depth is one tap away.
2. **Almost no color** — neutral canvas + a single clay accent; tiny desaturated category dots only for scanning.
3. **No gratuitous motion** — no particles, no 3D tilt, no stagger-everything. Subtle expand/check transitions only.
4. **Calm type hierarchy** — real size/weight steps so the eye has anchors.
5. **Actionable where it makes sense** — e.g. "DO" items are checkable.

---

## How to build this (START HERE — for a fresh session)

**Status: design phase complete.** All 46 mobile screens have an approved direction. This doc is now the build spec. No design decisions remain that block coding.

**Visual references (open in a browser to see each approved screen):** all in `apps/mobile/docs/`
- Briefing → `briefing-redesign-2.html` (**Take A · Digest**)
- Tasks → `tasks-navigation.html` (**Option 1**)
- Home → `home-redesign.html` (**Option 1**) + `home-daily-brief-real.html` (real-data version)
- Tracker → `tracker-combined.html`
- Budget → `budget-redesign.html` (**Option 1**)
- Checklists → `checklists-redesign.html` (**Option 2**)
- Content/Library → `content-redesign.html` (**Option 2**)
- Settings ×10 → `settings-redesign.html`
- Detail/modal + all pre-auth (17) → `remaining-redesign.html`
- **Desktop / web** (separate build — Part 4) → `desktop-{home,briefing,tasks,tracker,budget,checklists,library}.html`
- *(superseded: `briefing-redesign.html` (dark v1), the non-chosen options in `tasks-redesign.html` / `tracker-redesign.html`)*

**Recommended build order**
1. **Part 1 Foundation** — Plus Jakarta fonts, retune `lib/colors.ts` (light=warm-paper + dark=warm-dark), build `components/digest/`, reuse `BrandLogo`. Verify both themes render before any screen.
2. **Briefing (§2.1)** — the reference digest screen; establishes every pattern. Ship with the client-side one-liner fallback (no migration needed first).
3. **Tasks (§2.2), Home (§2.3), Tracker (§2.4), Budget (§2.5), Checklists (§2.6)** — all **no-DB**, any order.
4. **Content/Library (§2.7)** — no-DB (keys off `content_phase` after PR #3 merges; has a `stage` fallback until then).
5. **Settings (§2.8)** → **Detail/modal (§2.9)** → **Pre-auth (Part 3)** — all on the shared kit.
6. **Cleanup** — Deprecations section (journey/mood); merge Family+Invite and Help+FAQ; delete dead components after verifying consumers.
7. **Merge PR #3** (`fix/normalize-content-phase-taxonomy`) when ready — unblocks keying Content off `content_phase`.

**Decision defaults the build assumes** (all reversible; change only if you say so): §A ✅ theme-aware/`system`. §B → local AsyncStorage (don't couple Briefing DO-items to Tasks yet). §C → derive one-liners client-side now, author `digest` JSON later. §D → drop the standalone calendar. §F → file export only (CSV/PDF/share, no live link). §E → shipping in PR #3.

**Project refs:** run/build/theme conventions in `apps/mobile/CLAUDE.md`; patterns in `apps/mobile/.claude/rules/`; theme via `useColors()` / `useTheme()`; migrations via Supabase MCP (`apply_migration`) or `supabase/migrations/`.

---

## Build Roadmap (execute top to bottom)

> Designed to run in one driving session and **survive context compaction**: git + this plan are the source of truth, not the session's memory. Re-read the cited section before each step.

**Rules for every step (non-negotiable):**
- Work on one branch: `git checkout main && git pull && git checkout -b feat/v2-clean-build`.
- **Re-read the cited plan section + §1.2 tokens** at the start of each screen — don't rely on memory.
- After each screen: `cd apps/mobile && npx tsc -p tsconfig.json --noEmit` must pass, then **commit**: `feat(v2): <screen>` (state lives in git, so compaction/interruption can't lose work).
- Every screen must render in **both light and dark** (warm-paper + warm-dark).
- Follow each section's **Definition of done**. Decision defaults: §B local AsyncStorage · §C derive one-liners now · §D drop calendar · §F file export.
- **Mobile only.** Do NOT touch web/desktop (Part 4) or push to `main` (open a PR at the end).

**Steps:**
- [ ] **0. Branch** off main (above).
- [ ] **1. Foundation** (§1.1 fonts → §1.2 colors light+dark → §1.3 `components/digest/` → confirm `BrandLogo`). Commit `feat(v2): foundation`.
  - 🛑 **CHECKPOINT 1 (human):** run the app, toggle light/dark, confirm fonts + tokens look right. **Do not continue until the user confirms.**
- [ ] **2. Briefing** (§2.1) — the reference screen; client-side one-liner fallback (no migration). Commit.
  - 🛑 **CHECKPOINT 2 (human):** verify Briefing in both themes (stepper, expand/collapse, archive parity). This locks the patterns for the other 44 screens. **Wait for user confirm.**
- [ ] **3. Tasks** (§2.2) → commit.   _(no DB)_
- [ ] **4. Home** (§2.3) → commit.   _(no DB)_
- [ ] **5. Tracker** (§2.4) → commit.   _(no DB)_
- [ ] **6. Budget** (§2.5) → commit.   _(no DB)_
- [ ] **7. Checklists** (§2.6) → commit.   _(no DB)_
- [ ] **8. Content / Library** (§2.7) → commit.   _(no DB; `stage` fallback until PR #3 merges)_
  - 👁 spot-check a few of steps 3–8 in the app as you go.
- [ ] **9. Settings & secondary** (§2.8, 10 pages) — shared settings kit. **Agents OK** (parallel drafts), but integrate + `tsc` + commit. 
- [ ] **10. Detail / modal / utility** (§2.9, 7 screens) — **agents OK**. Commit.
- [ ] **11. Pre-auth** (Part 3 — auth/onboarding/guest, 12 screens) — **agents OK**. Commit.
- [ ] **12. Cleanup** — delete deprecated journey/mood (Deprecations §); merge Family+Invite and Help+FAQ menu rows; remove dead components after verifying consumers. `tsc` + commit.
- [ ] **13. Final QA** — both themes across all tabs; dad + mom; pregnancy + post-birth; empty/backlog/stale states. Then **open PR** `feat/v2-clean-build` → main. Merge **PR #3** (taxonomy) when ready.

---

## Part 1 — Shared Design Foundation (build once, reused by every page)

These land before/with the first page and are reused by all later screens. Mark done when merged.

### 1.1 Typography — add Plus Jakarta Sans
- [ ] Add font files to `apps/mobile/assets/fonts/`: `PlusJakartaSans-{Regular,Medium,SemiBold,Bold,ExtraBold}.ttf` (weights 400/500/600/700/800).
- [ ] Register in `app/_layout.tsx` `useFonts({...})` alongside the existing families.
- [ ] Naming convention: `Jakarta-Regular`, `Jakarta-Medium`, `Jakarta-SemiBold`, `Jakarta-Bold`, `Jakarta-ExtraBold`.
- Rationale: the Digest look depends on 600–800 weights; current set tops out at Karla-SemiBold (600) / Playfair-Bold. Jakarta becomes the v2 primary **UI** sans.
- **Brand logo stays as-is:** reuse the existing `components/BrandLogo.tsx` — the SVG parent/child mark (copper→gold gradient) + **"The Dad Center" wordmark in Playfair Display**. Playfair is kept for the wordmark only; all other text is Jakarta. (Mockups previously used a text-only placeholder; now corrected to the real mark.)
- **Logo placement (audited 2026-06-19) — `BrandLogo` ON these screens only:**

| Screen | Logo | Note |
|---|---|---|
| Splash | mark (icon.png) | native launch |
| Landing | mark + wordmark | already in app |
| Login / Sign up | mark + wordmark | already in app |
| Forgot password | small mark + wordmark | **new** — completes the auth family |
| Onboarding · Welcome | mark + wordmark | **new** (improvement) |
| Guest · Browse intro / Home | mark + wordmark | already in app |
| About | mark + wordmark | **new** (improvement) |

  - **Everything else (all in-app screens — Home, Tasks, Briefing, Tracker, More hub, detail/modal, settings sub-pages, Pricing) shows NO logo** — they lead with a page title/greeting. Putting the logo everywhere would clutter the digest look.

### 1.2 Color — theme-aware v2 tokens (warm-paper **and** warm-dark)
**Decided (§A): the Digest is theme-aware. Same layout in both; `system` is the default theme** so a dad on scheduled dark mode gets the night-friendly version automatically at 3am, and warm-paper by day. Both palettes authored up front; the layout never branches on theme — only `useColors()` values do.

Add to `lib/colors.ts` by **retuning the existing `light` palette to warm-paper** and **simplifying the existing `dark` palette to warm-dark digest** (drop the heavy copper/gold-everywhere luxury usage; near-mono + one clay accent). Exact values:

| Token | Light (day · warm paper) | Dark (night · warm) | Use |
|---|---|---|---|
| `bg` | `#F6F5F2` | `#15130F` | page background |
| `card` | `#FFFFFF` | `#201C18` | rows / cards |
| `ink` | `#1E1C19` | `#EDE7DD` | primary text |
| `ink2` | `#56524B` | `#B8B0A4` | secondary / detail body |
| `muted` | `#928D84` | `#8A8378` | tertiary / sub labels |
| `faint` | `#B6B1A8` | `#5E574D` | hairline-level text, chevrons |
| `line` | `#EAE7E1` | `rgba(237,230,220,0.10)` | borders |
| `line2` | `#F2F0EB` | `rgba(237,230,220,0.05)` | row separators |
| `accent` | `#C0673D` | `#C77A4C` | the one accent (progress, primary) |
| `accentInk` | `#A8542E` | `#D08A5E` | accent text (links) |
| `accentSoft` | `#F4E8E0` | `rgba(196,112,63,0.14)` | accent tint bg (field note) |
| dot · baby | `#5E86A8` | `#7BA3C4` | tiny scanning dot |
| dot · her | `#B07C93` | `#C496AB` | tiny scanning dot |
| dot · do | `#C0673D` | `#CC8056` | tiny scanning dot |
| dot · tip | `#9C8A56` | `#B6A471` | tiny scanning dot |
| dot · next | `#6F9079` | `#89AC94` | tiny scanning dot |

- [ ] Retune `light` palette → warm-paper values above.
- [ ] Retune `dark` palette → warm-dark digest values above (keeps night reading; sheds the luxury copper/gold heaviness as screens migrate).
- [ ] Confirm app default theme is `system` (set in the theme provider / first-run default).
- [ ] Dark-mode QA is a first-class checkbox on every page migration, not an afterthought.

### 1.3 Shared Digest components — `apps/mobile/components/digest/`
Built generic so Tasks/Tracker/etc. can reuse them later.
- [ ] `DigestRow.tsx` — category dot + uppercase label, one-liner, tap-to-expand detail, optional left check-circle. (= the core list row from Take A.)
- [ ] `DigestHero.tsx` — big "Week N", sub line, thin progress bar, TL;DR sentence.
- [ ] `WeekStepper.tsx` — quiet `‹ Week N ›` control (replaces the 104-pill bar). Optional "jump to week" sheet reusing existing `WeekNavPills` on demand.
- [ ] `FieldNoteCard.tsx` — soft `accentSoft` block for the quote.
- [ ] `SectionLabel.tsx` — small uppercase "This week" label.
- [ ] `firstSentence()` util in `lib/` for deriving one-liners from paragraphs.

---

## Part 2 — Page Migrations

### 2.1 Briefing → Digest  *(approved 2026-06-19)*

**Files in scope**
- `app/(tabs)/briefing/index.tsx` (current week)
- `app/(tabs)/briefing/[weekId].tsx` (archive / specific week — must reach parity)
- `components/briefing/BriefingSection.tsx`, `WeekNavPills.tsx`, `FieldNotesCallout.tsx` (deprecate/replace for this screen)
- `components/skeletons/BriefingSkeleton.tsx`
- Data hooks `useCurrentBriefing` / `useBriefingByWeek` — **unchanged**.

**Content model (the real work)**
The DB has long paragraphs and no one-liners. Approach:
- [ ] Add a nullable `digest jsonb` column to `briefing_templates` via migration: `{ tldr: string, headlines: { baby, her, tip, next: string } }`. One column, no sprawl, extensible.
- [ ] **v1 fallback (ship UI without a content sprint):** if `digest` is null, derive each one-liner client-side with `firstSentence(paragraph)`; `tldr` falls back to `title`. DO items use `dad_focus[]` strings directly (already short).
- [ ] **v1.1 content pass (separate task):** author punchy `tldr` + `headlines` per week and backfill `digest`. Tracked in content backlog, not blocking the UI.

**Transform layer**
- [ ] `buildBriefingDigest(briefing, babySize, role)` → `{ hero, items[] }`:
  - `hero = { week, weeksToGo, trimesterLabel, progressPct, tldr }`
  - `items` (ordered): `baby` → `her` → one `do` per `dad_focus[]` → `tip` (relationship) → `next` (coming up). `field_notes` rendered separately as `FieldNoteCard`.
  - Each item: `{ category, headline, detail, checkable }`. `checkable: true` only for `do`.
  - Role-aware label: `her` = "What She's Experiencing" (dad) / "Your Body" (mom).
  - Place in `packages/shared` if web will reuse; else `apps/mobile/lib/`.

**Screen rebuild**
- [ ] Rewrite `briefing/index.tsx` to render: `WeekStepper` → `DigestHero` → `SectionLabel` → list of `DigestRow` → `FieldNoteCard` → `next` row → "Read the full briefing →" link + source microcopy.
- [ ] Remove the always-expanded `BriefingSection` stack and the inline 104-pill `WeekNavPills` bar.
- [ ] Keep "Read the full briefing" → routes to the existing long-form view (or `[weekId]` rendered in full mode) so depth isn't lost.
- [ ] Apply the same digest to `[weekId].tsx`; fold its `BriefingProgressBar` into `DigestHero`; keep its "This Week's Tasks" section if desired (or surface as `do` rows).

**Checkable DO items — persistence**
- [ ] v1: persist to `AsyncStorage` key `briefing-done:{familyId}:{stage}:{week}` → array of checked indices. Ephemeral-feeling but survives reloads, zero backend.
- [ ] **Decision required** (Open Decisions §B): should checking a DO item create/complete a real Task instead? Overlaps with the Tasks screen.

**Cleanup & QA**
- [ ] Verify `WeekNavPills` still used by Tasks before any change (it is — keep the component, only change Briefing's usage).
- [ ] Check `BriefingSection` / `FieldNotesCallout` usages; delete if Briefing was the only consumer.
- [ ] Update `BriefingSkeleton` to the light digest layout.
- [ ] `npx tsc -p tsconfig.json --noEmit` clean.
- [ ] Simulator pass **in both light and dark** (toggle + `system`): no 104-pill bar; feed scannable; expand/collapse; check toggling persists; archive/`[weekId]` parity; Dynamic Type & long-content wrapping; accent + category dots legible on warm-dark.

**Definition of done**
Briefing renders as the light Digest, whole week skimmable above ~1.5 screens, one-liners expand to full paragraphs, DO items check off and persist, full-briefing depth still reachable, types clean, runs on device.

---

### 2.2 Tasks → Today List + Now/Upcoming/Done nav  *(approved 2026-06-19)*

Mockup of record: `apps/mobile/docs/tasks-navigation.html` → **Option 1 (Today List · with nav)**. Uses the same digest theme/components from Part 1 — only the layout is task-specific.

**Files in scope**
- `app/(tabs)/tasks/index.tsx` (714 lines — full rewrite)
- `app/(tabs)/tasks/[id].tsx` (detail — retheme to v2 tokens; keep snooze/reschedule)
- `components/tasks/TaskItem.tsx` → replace with v2 `TaskRow`; `TaskFilterTabs.tsx`, `TaskStatsRow.tsx` → remove from screen
- `WeekNavPills` (shared with Briefing) — stop using the 104-pill bar here too
- Hooks `useTasks` / task mutations — **unchanged**

**No new DB/content work.** Unlike Briefing, the whole redesign is pure client derivation from existing fields (`due_date` + `status`). Ships without a migration.

**The scope model (this is the nav)**
`ScopeSwitch` — sticky segmented control **Now · Upcoming · Done**. Replaces the stats row + filter tabs + 104-pill bar + calendar toggle in one move.
- **Now** (default, active tasks only):
  - *Today* = `isToday(due_date)` · *This week* = due later this week · *Catch up* = past-due & not done (amber, "yellow not red")
  - Top summary line: "You've got N today and M more this week."
- **Upcoming** (active, due beyond this week): **grouped by the app's 9 phases** (Trimester 3, Delivery, 0–3mo, …) via the existing timeline util. `PhaseChips` row (≈9 chips) jumps to a phase — the calm replacement for 104 week pills. Fallback: month grouping.
- **Done**: `status === 'completed'`, reverse-chron, grouped "This week" / "Earlier", with completion date.

**Secondary controls (off the main surface)**
- Assignee filter (All / Mine / Partner) → behind a **funnel icon** in the header; applies within the active scope. (Was 3 of the 5 removed tabs.)
- Search → behind a **search icon**, on demand (not an always-on bar).
- `+` **FAB** → existing create-task route.

**Components**
- New, in v2 digest language: `TaskRow` (check-circle completes · 1-line title · meta = category + assignee dot + due label), `ScopeSwitch`, `PhaseChips`, `TaskSection` (label + count), `TaskSummary`. Put generic `ScopeSwitch`/`PhaseChips` in `components/digest/` for reuse by other pages.
- Reuse: `SwipeAction` (swipe complete/snooze), existing mutations, existing detail route.
- Assignee dots (warm, desaturated): dad `#5E86A8` · mom `#B07C93` · both `#9C8A56`. Late/catch-up label `#B17F35` (amber).

**Remove**
- `TaskStatsRow`, `TaskFilterTabs`, the always-on search bar, the calendar `viewMode` toggle, the inline 104-pill `WeekNavPills` usage. Verify component consumers before deleting files.

**Cleanup & QA**
- [ ] Verify `TaskStatsRow` / `TaskFilterTabs` have no other consumers → delete.
- [ ] Verify `WeekNavPills` consumers after Briefing + Tasks migrate → delete if none.
- [ ] Empty states: clear-today ("You're clear today — nice."), no upcoming, no completed.
- [ ] Swipe-to-complete + snooze still work on `TaskRow`.
- [ ] Simulator pass in **both light & dark**: scope switch sticky + correct grouping; phase chips jump; catch-up shows in **Now** (not Done); completing a task moves it → Done; FAB; Dynamic Type; long titles truncate.
- [ ] `npx tsc -p tsconfig.json --noEmit` clean.

**Definition of done**
Tasks opens on **Now** with today's work above the fold (zero control pile-up), Upcoming browses the whole journey by phase, Done is the history, completing a task moves it across scopes — all in both themes.

---

### 2.3 Home → Daily Brief  *(approved 2026-06-19)*

Mockup: `apps/mobile/docs/home-redesign.html` → **Option 1**, validated with live data in `home-daily-brief-real.html` (account office.mu.sigma). Reuses Part 1 theme + digest components.

**Files in scope**
- `app/(tabs)/index.tsx` (dashboard — full rewrite)
- `components/dashboard/*` — most removed/replaced (see Remove)
- Reuse `components/digest/` (DigestHero, DigestRow) + a few small home pieces

**Layout (top → bottom)**
1. Greeting + context line
2. **Hero** — "This week · Briefing" (headline + one-liner + CTA) — the single primary
3. **Today · N** — top 1–2 tasks due today, checkable, "View all →"
4. **Catch-up** — one calm amber line if backlog > 0
5. **Recommended read** — 1 phase-matched article (from `articles`) *(replaces the deprecated On Your Mind / journey tile)*
6. **Progress duo** — stage-aware (see variants)
7. **Partner activity** — only if recent activity
8. **Upgrade** — free tier only, quiet, last

**Section → data source**
| Section | Source |
|---|---|
| Greeting/context | `profiles` + `families` (stage, week, baby) |
| Hero | `useCurrentBriefing` (+ nearest-prior-week fallback) |
| Today | `family_tasks` (pending, due today) |
| Catch-up | `family_tasks` (pending past-due count) |
| Recommended read | `articles` (phase-matched, top unread) |
| Budget | `family_budget` |
| Tracker (post-birth) | `baby_logs` (latest) |
| Checklist (pregnancy) | `checklist_progress` |
| Partner | partner profile + recent activity |

**Role / stage variants**
- **Dad**: standard order; partner activity secondary.
- **Mom**: partner activity moves to top (under hero). *(No journey/On-Your-Mind distinction — that feature is deprecated; both roles see "Recommended read".)*
- **Pregnancy**: hero shows baby-size; progress duo = Budget + Checklist.
- **Post-birth**: hero shows age + dev milestone (no fruit); progress duo = Budget + Tracker.

**Real-data states (validated on office.mu.sigma — must handle)**
- Empty "Today" / "This week" → omit the section (no empty box).
- Large catch-up (e.g. 151) → ONE amber line, never N rows ("yellow not red").
- Lifetime/premium → no upgrade card.
- Partner inactive → hide the partner line.
- Stale tracker → "Log a feed" prompt, not stale stats.
- Missing briefing for current week → nearest-prior-week fallback (post-birth briefings are sparse: 25 across weeks 1–96).

**Remove**
- The 8-card stack, `QuickActionsBar` (duplicate routes), `BudgetSnapshotCard` (no-data nav card), background particles. Verify each `components/dashboard/*` consumer before deleting; wire up the dead `PartnerActivityCard`/`MoodCheckinCard` or delete them.

**QA** — both themes; dad + mom; pregnancy + post-birth; empty/backlog/stale/free-vs-paid states; nearest-week fallback; `tsc` clean.

**Definition of done**
Home opens with one clear hero + today's 1–2 actions above the fold, adapts to role & stage, and gracefully handles empty / backlog / stale / free-vs-paid — in both themes.

---

### 2.4 Tracker → Quick Log + Day Timeline  *(approved 2026-06-19)*

Mockup: `apps/mobile/docs/tracker-combined.html` (merge of Options 1 + 2 from `tracker-redesign.html`). Reuses Part 1 theme + digest components.

**Files in scope**
- `app/(tabs)/tracker/index.tsx` (677 lines — full rewrite)
- `app/(tabs)/tracker/log.tsx` (entry form — retheme to v2, keep per-type logic)
- `app/(tabs)/tracker/history.tsx` + `more/tracker-summary.tsx` (fold into the date-stepper + "History →"; move heavy stats here, not on the index)
- Hooks `useRecentLogs` / log mutations — **unchanged**

**No new DB/content work** — pure client refactor over existing `baby_logs`. Same pattern as Tasks: derive everything from rows.

**Layout (top → bottom)**
1. Header — "Tracker" + baby (name · age) + **date stepper** (`‹ Today ›`)
2. **Log now** — 3 core tiles (Feed / Diaper / Sleep) each showing "last X ago" + a **"More" chip row** (temperature, medicine, vitamin D, mood, weight, height, milestone)
3. **Today so far** — 3 stats (feeds count · changes count · sleep total)
4. **Today's timeline** — chronological list of the day's logs (reverse), each with time, type dot, detail, and **logged-by attribution** + "History →"

**Data model (`baby_logs`)**
- Columns: `log_type`, `log_data` (jsonb, shape varies), `logged_at`, `logged_by`, `baby_id`, `family_id`, `notes`.
- `log_type` ∈ feeding · diaper · sleep · temperature · medicine · vitamin_d · mood · weight · height · milestone · custom.
- `log_data` per type: feeding `{type:breast|bottle|solid, side, duration_minutes, amount_oz}` · diaper `{type:wet|dirty|both}` · sleep `{quality, duration_minutes}` · temperature `{value,unit}` · medicine `{name,dosage}` · vitamin_d `{given}` · mood `{level}` · weight/height `{value,unit}` · milestone `{name}`.
- Helpers: `formatLogEntry(log)` → title/subtitle per type; `summarizeDay(logs)` → the 3 stats; `logged_by` → "you" / partner name (resolve via family members).

**Components**
- New (v2): `LogTile` (3 core), `MoreLogChips`, `TodaySummary`, `DayTimeline` + `TimelineRow`, `DateStepper` (reuse the Tasks/Briefing stepper), `LogTypeIcon` + color map.
- Color map (desaturated): feed `#C0673D` · sleep `#5E86A8` · diaper `#6F9079` · mood `#B07C93` · health(temp/meds/vit-D) `#9C8A56`.
- Reuse: the `log.tsx` entry sheet for actual data capture.

**Remove**
- The 11-button two-grid (→ 3 core + More), the "Shift Briefing" 3-stat wall, the 10-row inline recent list, the Summary/History header pills (→ date stepper + History link). Heavy stats move to `tracker-summary`.

**States to handle**
- **Empty/stale today** (real account is stale since Apr 14): tiles → "Tap to start"; stats → "—"; timeline → "Nothing logged yet today."
- **Pregnancy stage**: tracker is pre-birth-locked → keep the preview/lock state (don't show logging).
- **Multi-baby** (twins via `babies` / `active_baby_id`): respect active baby; baby switcher in header if >1.
- *(Optional, parked)* one-line "overnight, on \<partner\>'s shift" summary — the calm replacement for the old Shift Briefing.

**QA** — both themes; post-birth (active) + post-birth (empty/stale) + pregnancy (locked); date stepper history; partner attribution; multi-baby; `tsc` clean.

**Definition of done**
Tracker opens with the 3 core log actions + today's totals above the fold, the full day as a clean timeline below, history via the date stepper, gracefully handling empty/stale/locked — in both themes.

---

### 2.5 Budget → My Budget first  *(approved 2026-06-19)*

Mockup: `apps/mobile/docs/budget-redesign.html` → **Option 1**. Reuses Part 1 theme + digest components. Core jobs: **select**, **toggle** (purchased + price tier), **export**.

**Files in scope**
- `app/(tabs)/more/budget.tsx` (full rewrite)
- `components/budget/*` (TierFilter / BrandRecommendationSheet — retheme/reuse)
- Budget hooks (family_budget query + mutations) — reuse; add export

**Layout**
1. Header — "Budget" + **export** icon
2. Segmented — **My list** (default) / **Browse**
3. Summary card — Planned / Spent / Left + progress bar + "N of M bought"
4. Tier toggle — **Best value / Premium** (reprices rows + summary)
5. **My list**: item rows with a **checkbox = purchased** toggle; price; category; tags (must-have / monthly)
6. **Browse**: catalog rows with **Add / Added** toggle + brand line; auto-filtered to current stage; category chips
7. **FAB → Browse**; empty state → "Start your budget"

**Data model**
- `family_budget`: `item`, `category`, `estimated_price` (cents), `actual_price`, `is_purchased`, `purchased_at`, `is_recurring`, `is_custom`, `budget_template_id`. Family-scoped → **both partners already share the list**.
- `budget_templates` (200; `stage` pregnancy/post-birth): the Browse catalog + the **premium / best-value tier** prices. Browse defaults to the family's current stage (matches the web `auto-select current phase` fix).
- **Select** = insert a `family_budget` row from a template. **Toggle purchased** = update `is_purchased` + `purchased_at` (+ optional `actual_price`). **Tier** = client display switch between the template's premium vs best-value price.

**Export (client-side — no backend)**
- Sheet: **Share / CSV / PDF**, generated on-device:
  - CSV → build string + `expo-sharing`
  - PDF → `expo-print` (print-ready checklist)
  - Share → native share sheet for the file
- "Share with Sarah" is mostly redundant (family_budget is already shared in-app); keep export focused on CSV/PDF/native-share. A public live-link would need backend → see §F (parked, optional).

**Components**
- New (v2): `BudgetSummary`, `BudgetRow` (purchased checkbox), `BrowseRow` (Add toggle + brand line), `TierToggle`, `ExportSheet`. Reuse the digest segmented control + FAB.

**Remove**
- The two stacked horizontal pill scrollers (7 timeline + 5 priority), the heavy multi-row header. Phase → auto-current-stage; category → chips in Browse; priority → optional filter icon.

**States** — empty (no items → "Start your budget"); recurring (`/mo`); fully-purchased; premium vs best-value reprice; post-birth vs pregnancy catalog.

**QA** — both themes; my-list + browse; purchased toggle persists; tier reprices summary + rows; add-from-catalog; export CSV/PDF/share; empty state; `tsc` clean.

**Definition of done**
Budget opens on your list with Planned/Spent/Left up top, one-tap purchased toggle, Browse to add (stage-filtered), a live tier switch, and working CSV/PDF/share export — in both themes.

---

### 2.6 Checklists → Open checklist  *(approved 2026-06-19)*

Mockup: `apps/mobile/docs/checklists-redesign.html` → **Option 2**. Reuses Part 1 theme + digest components.

**Files in scope**
- `app/(tabs)/more/checklists.tsx` (rewrite → item-focused)
- New "All lists" index (library) as a secondary screen/sheet behind the back button
- Checklist hooks (templates / items / progress + check mutation) — reuse

**No new DB/content work** — client refactor over existing tables.

**Layout**
1. Header — "‹ All lists" + (no export)
2. **Switcher** — chips of stage-relevant checklists, relevance-sorted; active = the current one
3. **Hero** — checklist name + "N of M done · Weeks 8–12" + one progress bar
4. **Items grouped by `category`** (Childcare / Pumping / Work…), each a checkbox row with required/pack tags + who-checked

**Data model**
- `checklist_templates`: `name`, `stage`, `is_premium`, `week_relevant` (e.g. "8-12", "4+", "0+"), `sort_order`, `checklist_id`.
- `checklist_item_templates`: `item`, `details`, `category`, `required`, `bring_or_do` ('bring'|'do'), `sort_order`.
- `checklist_progress`: `item_id`, `is_checked`, `checked_at`, `checked_by`, `baby_id`, `family_id` (per-item, who/when).
- **Relevance**: parse `week_relevant` vs family `current_week` → default-open the most relevant checklist + sort the switcher (reuse the web "auto-select current phase + relevance sorting" logic).
- **Tags**: `bring_or_do='bring'` → "Pack" tag; `required=false` → "Optional" tag. `checked_by` → "You"/partner name.

**Components**
- New (v2): `ChecklistSwitcher` (chips), `ChecklistHero` (name + progress + week), `CategorySubhead`, `ItemRow` (checkbox + tags + who-checked), `AllListsIndex` (the library: For now / Coming up / Completed, with lock for not-yet-relevant/premium).

**Remove**
- The 3 redundant progress indicators (→ one bar), the inline reset button in the collapsed header.

**States** — relevant list auto-selected; not-yet-relevant/premium → locked in switcher + index; completed lists in index "Completed"; empty progress (all unchecked) fine; multi-baby → progress per `active_baby_id`.

**QA** — both themes; relevance auto-select + switcher swap; check persists + who-checked attribution; required/pack tags; category grouping; All-lists index (locked/completed); `tsc` clean.

**Definition of done**
Checklists opens on the week-relevant list with items grouped by category and one-tap check-off (with who-checked), a chip switcher to change lists, and an All-lists index for the rest — in both themes.

---

### 2.7 Content / Library → Magazine  *(approved 2026-06-19)*

Mockup: `apps/mobile/docs/content-redesign.html` → **Option 2**. Reuses Part 1 theme + digest components. This **replaces the deprecated Dad Journey** as the More-tab content feature (see Deprecations).

**Files in scope**
- `app/(tabs)/more/content.tsx` (rewrite → Magazine library; today serves both "Blog" and "Dad Tips")
- `app/(tabs)/more/videos.tsx` (becomes the Resources index / "See all"; retheme)
- `app/(tabs)/more/article.tsx` (reader — retheme to v2)
- More menu: collapse **Blog + Dad Tips + Video Library → one "Library"** row
- Hooks `useArticles` / videos hook — reuse

**No new DB/content work** — client refactor over `articles` + `videos`.

**Layout (Magazine)**
1. Header — "Library" + search
2. Stage chips — default current stage (0–3 Mo)
3. **Featured read** — typographic hero (stage/topic label + title + excerpt + read-time) — *articles have no images, so hero is type-led*
4. **More reads** — article cards with excerpt + read-time + Free/Premium
5. **Watch & learn** — horizontal Resources shelf (curated external links, source-attributed + ↗)

**Data model**
- `articles`: `title`, `slug`, `stage` (uses the outlier vocab today — see §E), `stage_label`, `excerpt`, `read_time`, `is_free`, `sources[]`, `week`. In-app reads via `article.tsx`.
- `videos`: `title`, `source`, `url` (external — Mayo/CDC/AAP/Red Cross), `stage`. Curated links, **not embeds** → render as source-attributed resource cards opening the URL.
- Premium: `is_free=false` + non-premium tier → lock + upgrade prompt.
- Stage filter: All / Trimester 1–3 / 0–3 / 3–6 / 6–12 Mo (default = current stage; once §E lands, key off `content_phase`).

**Components**
- New (v2): `FeaturedRead`, `ArticleCard` (excerpt), `ResourceShelf` + `ResourceCard` (external, source badge, ↗), `StageChips`, `LibrarySearch`. Reuse the article reader (retheme).

**Remove / merge**
- The 3 near-duplicate menu rows → one "Library"; drop the "Dad Tips" param duplicate.

**States** — premium lock (free tier); empty stage → fall back to All / cross-phase; external resource opens in browser (trusted curated sources); search; both themes.

**Definition of done**
One "Library" opens on a featured stage-matched read with article cards + a resources shelf, premium-aware, in both themes — and Blog/Dad Tips/Videos are no longer separate menu rows.

---

### 2.8 Settings & secondary pages → shared kit  *(approved 2026-06-19)*

Mockup: `apps/mobile/docs/settings-redesign.html` (all 10 pages, one option each, built to a single component kit — agent-assisted).

**Scope (one shared kit, no 3-options needed)**
Profile · Family Members · Invite Partner · Subscription · Appearance · Notifications · Help & Support · Send Feedback · About · FAQ.

**Files in scope** (retheme to v2; logic mostly unchanged)
- `more/settings.tsx` (the index), `more/edit-profile.tsx`, `more/family.tsx`, `more/change-password.tsx`, `more/notifications.tsx`, `more/help.tsx`, `more/faq.tsx`, `more/feedback.tsx`, `more/about.tsx`
- `(screens)/appearance.tsx` (theme), `(screens)/upgrade.tsx` (subscription/plans)

**Shared settings component kit** (build in `components/digest/` or `components/ui/`)
`NavHeader` (back + centered title) · `SettingsGroup` + `SettingsRow` (icon · label · sub · value/chev/toggle) · `Toggle` (iOS switch, accent on) · `Field` (label + input/textarea) · `Button` (primary/ghost/danger) · `SegCards` (Appearance theme / Feedback type) · `InviteCode` box · `FaqItem` (accordion) · `MemberRow` · `Badge` · `Brandmark` · `Note` / `InfoText`.

**Per-page notes**
- **Appearance**: System / Light / Dark with warm-paper + warm-dark swatches; default System (ties to §A).
- **Notifications**: master toggle + per-type toggles (briefing, tasks, partner activity, tracker, weekly, milestones, articles) + quiet hours. Maps to `notification_preferences`.
- **Subscription**: shows current plan (Lifetime → "Active" badge + included list + restore/billing); free users see plans ($4.99 / $39.99 / $99.99). Routes via existing upgrade screen.
- **Family / Invite**: member list + invite code + "one subscription per family" note. **Merge the duplicate "Family Members" and "Invite Partner" menu rows → one "Family".**
- **Help / FAQ**: keep both but de-dupe (FAQ content lives in FAQ; Help = contact + links). **Was duplicated across `help.tsx` and `faq.tsx`.**
- **About / Feedback**: brand mark + version + legal links; feedback type + message.

**No DB/content work** — UI retheme over existing screens/hooks.

**QA** — both themes; forms submit; toggles persist; theme switch live; premium vs free subscription state; `tsc` clean.

**Definition of done**
All 10 secondary pages render in the v2 kit, consistent with the core screens, in both themes — with the Family/Invite and Help/FAQ duplicates merged.

---

### 2.9 Detail, modal & utility screens  *(designed 2026-06-19)*

Mockup: `apps/mobile/docs/remaining-redesign.html` (In-app group). The §2.x work covered the main screens but several **detail / modal / utility** screens belong to those features. Now mocked, one option each, against the shared kit. They **inherit the v2 kit + existing digest components** — mostly retheme, no new patterns. No DB work.

| Screen | File | Treatment |
|---|---|---|
| **Task detail** | `tasks/[id].tsx` | Retheme to digest: title, meta badges (assignee dot · category · due), progressive cards (Description / Why It Matters / Notes — render only when present), bottom action bar (Skip · snooze 1d/3d/7d · **Mark Complete**). One accent. *(Was missing from §2.2.)* |
| **Create task** | `(screens)/create-task.tsx` | Retheme form with kit `Field` + `SegCards` (title, due date, assignee, category) + primary "Add task". |
| **Catch-up / Triage** | `more/triage.tsx` | The "tidy the backlog" flow reached from the Now-scope catch-up line (the 151-item state). Focused list with quick Skip / Done / Reschedule. |
| **Notification inbox** | `more/notification-inbox.tsx` | The header-bell inbox → digest rows (icon · title · time · unread dot), grouped Today / Earlier. |
| **Upgrade success** | `(screens)/upgrade-success.tsx` | Brandmark + "You're in" + what's unlocked + Continue. |
| **Briefing archive** | `more/briefing-archive.tsx` | Past briefings → reuse the week-stepper + digest list. |
| **More menu hub** | `more/index.tsx` | Apply the kit + the consolidated structure: **Library** (1 row, replaces Blog/Dad Tips/Videos), **Tools** (Budget, Checklists), **Family**, **Account** (Profile, Notifications, Appearance, Subscription, Security), **Support** (Help, FAQ, Feedback, About), Sign out. Remove the "Dad Journey" row; consistent push (no modal/push mix). |

Already covered in their parent sections: `briefing/[weekId].tsx` (§2.1), `tracker/history.tsx` + `tracker-summary.tsx` (§2.4), `more/article.tsx` + `videos.tsx` (§2.7), all `more/*` settings + `(screens)/appearance|upgrade` (§2.8).

---

## Part 3 — Pre-auth flows  *(designed 2026-06-19)*

Mockup: `apps/mobile/docs/remaining-redesign.html` (Auth / Onboarding / Guest groups). One option each, on the shared kit (+ a few marketing/auth/pricing components added to the kit). No DB work.
- **Auth** — `landing` (pitch + 3 features), `login`, `signup` (+ Apple/Google), `forgot-password`
- **Onboarding** — 5-step flow with progress dots: `welcome` → `role` → `stage`(due date) → `invite`(code) → `ready`
- **Guest** — `index` (browse intro), `home` (sample dashboard + locked), `pricing` (3 plans, Yearly featured)
- Note: auth copy/conversion can be tuned later; the kit + structure are set.

---

## Part 4 — Web / Desktop  *(mockups 2026-06-19 · separate build)*

**Scope note:** desktop = the **web app** (`apps/web`, Next.js — a *different codebase* from mobile). This is a parallel effort, not part of the mobile migration (Parts 1–3). Same v2 digest design system, adapted to a desktop shell. The web app currently runs the dark "Warm Luxury Editorial" theme; this moves it to the digest light/dark.

**Mockups** (in `apps/mobile/docs/`): `desktop-home.html` (template) · `desktop-briefing.html` · `desktop-tasks.html` · `desktop-tracker.html` · `desktop-budget.html` · `desktop-checklists.html` · `desktop-library.html`.

**Desktop shell** (replaces mobile bottom tabs)
- Left **sidebar**: BrandLogo (mark + Playfair wordmark), nav (Home · Tasks · Briefing · Tracker; **Tools**: Budget · Checklists · Library), account chip at bottom.
- **Top bar**: page title / greeting + search · bell · avatar.
- **Content**: centered max-width; multi-column where desktop space helps.

**Per-page desktop layout**
| Page | Layout |
|---|---|
| Home | main feed + right rail (progress, family) |
| Briefing | reading column + rail (week stepper, "in this briefing" index, sources) |
| Tasks | Now/Upcoming/Done segmented + list + rail (counts, filters) |
| Tracker | log tiles + day timeline + "at a glance" rail |
| Budget | table-style list + summary/export rail |
| Checklists | switcher column + open-checklist column |
| Library | featured + 3-column magazine grid + resources shelf |

**Foundation reuse**: same warm-paper light/dark tokens (port into the web Tailwind theme), Plus Jakarta + Playfair wordmark, `BrandLogo`, and the digest components rebuilt as web/React (stack: Next.js + Tailwind + Radix/shadcn). Settings / auth / onboarding desktop variants derive from the mobile §2.8 / §2.9 / Part 3 specs dropped into this shell.

**Not yet detailed** (do when the web build is scheduled): per-screen web file paths, the Tailwind token mapping, and the React component port.

---

## Deprecations (remove in cleanup)

- **Dad Journey + Mood check-in** — removed from mobile; content is now article-based (§2.7). Delete/retire: `app/(tabs)/more/journey.tsx`, the "Dad Journey" More-menu row (`more/index.tsx:124`), `components/dashboard/OnYourMindCard.tsx`, `components/dashboard/MoodCheckinCard.tsx`, `hooks/use-journey.ts`, and the dashboard "On Your Mind" usage (replaced by "Recommended read" in §2.3). Leave `dad_challenge_content` / `mood_checkins` tables in place (no destructive DB change) until confirmed unused by web.

---

## Backend coverage audit (2026-06-19)

Triggered by the Home work — checked whether post-birth content exists before designing around it. **It does, fully:**

| Table | Post-birth coverage |
|---|---|
| `briefing_templates` | 25 (weeks 1–96) |
| `task_templates` | 122 |
| `budget_templates` | 103 |
| `checklist_templates` | 12 |
| `dad_challenge_content` | 35 (5 post-birth phases × 7) |
| `articles` | ~30 · `videos` ~35 |

No post-birth content needs building. The real issue found was **taxonomy inconsistency** → see §E (shipping).

---

## Open Decisions (need your call)

- **§A — Theme strategy.** ✅ **DECIDED (2026-06-19): theme-aware Digest, both warm-paper (light) and warm-dark (night) palettes authored, default theme `system`.** Rationale: late-night 3am reading is core to who the app is for, dark must stay; but the "clean" win is the *layout*, not the background — so we keep both and let the system decide. Plumbing already exists (`useColors()` + `useTheme()` + persisted theme). See §1.2.
- **§B — Do DO items become real Tasks?** Either keep them as a lightweight local checklist (AsyncStorage), or have them create/complete entries in the Tasks system. Affects whether Briefing and Tasks share state.
- **§C — One-liner content.** Ship with client-derived first-sentence one-liners now, author the `digest` JSON later? *Recommended: yes — don't block UI on content.*
- **§D — Calendar view (Tasks).** The standalone calendar mode is removed; Upcoming (phase-grouped) + per-task due dates cover it. Keep it fully gone, or re-add a calendar behind the header as a secondary view? *Recommended: drop it.*
- **§F — Budget export: live link?** Export ships client-side as CSV/PDF/native-share (no backend). A public "live link both partners open in a browser" would need a backend endpoint + RLS-safe public view. Worth it, or is in-app shared family_budget + file export enough? *Recommended: file export now; live link later if asked.*
- **§E — Phase taxonomy normalization.** 🚢 **Shipping** (branch `fix/normalize-content-phase-taxonomy`, PR). Audit found 4 vocabularies for the same periods; `articles`/`videos` use outliers (`fourth-trimester`, `18-24-months`, `delivery`, `cross-phase`) that are **read by live web + mobile code**, so renaming would break them. Fix is **additive + non-breaking**: add canonical `content_phase` (TEXT + CHECK) to `articles` & `videos`, backfilled from `stage`, `stage` kept. `dad_challenge_content.phase` is already canonical; stage+week tables derive via the existing `familyStageToContentPhase(stage, week)` util. *Follow-up (separate PR): migrate web/mobile consumers off `stage` → `content_phase`, then deprecate the outlier vocab.*

---

## Selection Log
- **2026-06-19** — Briefing: chose **Digest** (light + feed). Plan added (§2.1). Foundation §1 introduced.
- **2026-06-19** — §A resolved: **theme-aware Digest** (warm-paper + warm-dark), default `system`. Dark stays for 3am reading; layout is shared, only colors switch. §1.2 now has both palettes.
- **2026-06-19** — Tasks: chose **Today List + Now/Upcoming/Done nav** (§2.2). Phase chips replace the 104-week pill bar; calendar mode dropped (pending §D confirm). No DB work — pure client derivation.
- **2026-06-19** — Home: chose **Daily Brief** (§2.3), validated against live data (office.mu.sigma, post-birth). Surfaced 6 real-data states + the taxonomy issue.
- **2026-06-19** — Backend: post-birth content audit (all covered). §E taxonomy fix shipping as additive `content_phase` migration (PR).
- **2026-06-19** — Tracker: chose **Quick Log + Day Timeline** (§2.4), a merge of options 1 + 2. No DB work — client refactor over `baby_logs`.
- **2026-06-19** — Budget: chose **My Budget first** (§2.5). Export is client-side CSV/PDF/share (no backend); live-link parked as §F.
- **2026-06-19** — Checklists: chose **Open checklist** (§2.6), item-focused with switcher + All-lists index. No DB work — client refactor.
- **2026-06-19** — Dad Journey: **deprecated on mobile** (user confirmed it's removed; content is article-based). See Deprecations.
- **2026-06-19** — Content/Library: chose **Magazine** (§2.7), merging Blog + Dad Tips + Videos into one Library. Home "On Your Mind" → "Recommended read".
- **2026-06-19** — Dad Tips: confirmed = stage-filtered articles (no separate feature). Covered by §2.7 Library's "For you now"; the standalone "Dad Tips" menu row is dropped.
- **2026-06-19** — Settings & secondary (10 pages): one-shot to a shared component kit (§2.8), agent-assisted. No DB work. Merges Family/Invite and de-dupes Help/FAQ.
- **2026-06-19** — Coverage audit of all 46 screens: added §2.9 (7 detail/modal/utility screens incl. **task detail**, create-task, triage, notification inbox, More hub) and Part 3 (12 pre-auth screens).
- **2026-06-19** — One-shot designed all 17 remaining screens (§2.9 + Part 3) via 5 parallel agents on a shared kit → `remaining-redesign.html`. **Every one of the 46 screens now has an approved direction.**
- **2026-06-19** — Added logo: real `BrandLogo` (parent/child mark + Playfair wordmark) wired into all brand surfaces (auth/onboarding/guest/About); audited placement (§1.1). Fixed a dropped About page.
- **2026-06-19** — Desktop/web mockups: 7 desktop pages (sidebar shell, multi-column) via per-page agents → `desktop-*.html`. Added **Part 4 — Web/Desktop** (separate build).
