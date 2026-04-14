# Core Features Code Review — The Dad Center (web)

Reviewed: Dashboard, Tasks, Briefing, Tracker, Journey, hooks/services layer.

---

## Critical (must fix before merge)

### C1. Dashboard briefing teaser hardcoded to legacy `'pregnancy'` stage
`apps/web/src/hooks/use-dashboard.ts:85` calls `briefingService.getBriefingTeaser('pregnancy', currentWeek)` regardless of actual family stage. The DB now uses `first-trimester` / `second-trimester` / `third-trimester`. `getBriefingTeaser` filters with `.eq('stage', stage)` (`packages/services/src/briefing-service.ts:118`), so any user whose `family.stage` is a trimester-specific value gets `null` back. **Effect:** the BriefingTeaserCard on the dashboard shows just "Week N" with no excerpt for the majority of users.
**Fix:** pass the actual stage in, or query by `briefing_id` like `getBriefingByWeek` does (which already handles legacy + trimester via `isPregnancyStage`).

### C2. PaywallOverlay does not actually restrict premium content
`apps/web/src/components/shared/paywall-overlay.tsx:38-42` is just an `absolute inset-0 bg-[--bg]/80 backdrop-blur-sm` div. The premium content is fully rendered into the DOM beneath it. In `DadChallengeTile.tsx:163-168` premium tiles render the entire `narrative`, `action_items`, and `dad_quotes` then layer the overlay on top. **Effect:** trivial CSS bypass via DevTools — disable the overlay and free users read the full premium content. `dad-journey-service.getContentForPhase` does not filter by `is_premium` or subscription tier either, so the data hits the wire too.
**Fix:** server-side: stop returning premium `narrative`/`action_items`/`dad_quotes` to non-premium clients (RLS or query filter); client-side: short-circuit the render path with a `PaywallCard` instead of overlaying.

### C3. Free briefing window enforces 9 weeks, not 4
`apps/web/src/app/(main)/briefing/briefing-client.tsx:67-68` and `apps/web/src/app/(main)/briefing/[weekId]/briefing-week-client.tsx:54-55`:
```ts
const freeWindowAnchor = profile.signup_week ?? currentWeek
const isPremiumLocked = !isPremium && Math.abs(weekToView - freeWindowAnchor) > 4
```
`Math.abs(...) > 4` allows weeks `[anchor-4, anchor+4]` — that's a 9-week window centered on the anchor. The CLAUDE.md spec says "Free briefing window: 4 weeks from signup" (forward only). **Effect:** free users get more than 2× the intended free briefings, including 4 weeks of pre-signup content.
**Fix:** `weekToView - freeWindowAnchor > 4 || weekToView < freeWindowAnchor`. Decide explicitly whether week-before-signup is free or paywalled; the current code is forgiving in both directions and that's almost certainly not intentional.

### C4. `getLastCheckin` uses UTC midnight, breaks "checked in today" detection
`packages/services/src/dad-journey-service.ts:77-91`:
```ts
const todayStart = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()))
```
This is the start of *UTC* day computed from local Y/M/D, which is wrong in two directions. For a user in Pacific time at 6pm local Apr 6, `Date.UTC(2026, 3, 6)` = Apr 6 00:00 UTC, which is *before* the user's actual local "today" (Apr 6 PT = Apr 6 07:00 UTC). For a user east of UTC at 1am local Apr 7, the UTC date is still Apr 6 — the cutoff misses today's window entirely. **Effect:** `MoodCheckinWidget` shows "How are you feeling today?" *after* the user has already checked in (or vice-versa), and the mutation will now create a duplicate row, then UI flickers when the cache invalidates.
**Fix:** compute today in the user's timezone, then submit the *local-day* boundary as ISO. Or store `checked_in_at` as a `date` and compare equality.

### C5. `bulkTriageTasks` is not scoped to family_id
`packages/services/src/task-service.ts:375-378`:
```ts
const { error } = await supabase
  .from('family_tasks')
  .update(updates)
  .in('id', ids)
```
No `.eq('family_id', resolved.familyId)` clause. RLS likely catches this, but it's the only mutation in this service that drops the defense-in-depth filter (every other update has it). If RLS is ever loosened, this becomes a cross-family write. The `triageTask` sibling does scope correctly.
**Fix:** add `.eq('family_id', resolved.familyId)`.

---

## High (wrong behavior / incorrect business logic)

### H1. Tracker preview gate ignores trimester-specific stages
`apps/web/src/app/(main)/tracker/tracker-client.tsx:36`:
```ts
const isPreview = stage === 'pregnancy'
```
The valid pregnancy stages are now `first-trimester`, `second-trimester`, `third-trimester` plus legacy `pregnancy` (per `pregnancy-utils.ts:15`). Anyone whose stage is set to a trimester sees the live tracker UI in pregnancy — they will see "Shift Briefing" / log diapers / feedings even though no baby exists yet. The `useShiftBriefing` query with `refetchInterval: 60000` will hammer the DB returning empty.
**Fix:** `const isPreview = isPregnancyStage(stage)`.

### H2. Free 30-day task window: client filter is wrong AND doesn't match server
- `apps/web/src/components/tasks/tasks-page-client.tsx:112-116`: `freeWindowCutoff = currentWeek + Math.ceil(30/7)` = `currentWeek + 5`. That's a *week index* upper bound, has no lower bound, and treats "30 days" as 5 weeks. A task in week 1 is still visible to a free user in week 30.
- `packages/services/src/task-service.ts:78-84`: server filters by `due_date <= today + 30 days`, with no lower bound either.

The spec is "30-day rolling window" — should be `due_date BETWEEN today - X AND today + 30` (or whatever the X is). Two separate, mutually inconsistent implementations of the same gate is exactly how compliance bugs happen.
**Fix:** centralize the rolling window in one util (`getFreeTaskWindow(today, signupAt): {from, to}`), apply server-side as the source of truth, and use the same util on the client only for the "X tasks locked behind upgrade" hint.

### H3. `useDashboardData` cache key inconsistency causes duplicate fetches and stale data
`DashboardClient.tsx:67-71` calls `useDashboardData(familyId, currentWeek, activeBaby?.id)`.
`BriefingTeaserCard.tsx:15`, `TasksDueCard.tsx:15`, `OnYourMindCard.tsx`, and others call `useDashboardData(profile.family_id, currentWeek)` — **without the babyId**.

Cache keys are `['dashboard', familyId, currentWeek, babyId]` (use-dashboard.ts:63), so each tree of cards triggers two parallel queries on every dashboard mount and the cards downstream see different data (babyless query vs. baby-scoped query). For multi-baby families, the child cards are reading the wrong baby's tasks.
**Fix:** drill `babyId` through (or read it from `useUser()` inside each card) so all callsites produce the same query key. Long-term: stop fan-out — DashboardClient already has the data, pass it down via props or a small context.

### H4. `useCurrentBriefing` cache key omits stage and currentWeek
`apps/web/src/hooks/use-briefings.ts:22-27`:
```ts
queryKey: ['current-briefing', activeBaby?.id]
```
The query function depends on `stage` and `currentWeek`. If a user advances a week (or stage transitions), React Query will return the cached old briefing until the key changes — which only happens on baby switch.
**Fix:** include stage + currentWeek in the key.

### H5. `BriefingTemplate.getBriefingTeaser` query won't match enriched data
`packages/services/src/briefing-service.ts:114-124` filters teaser by `.eq('stage', stage)`. Combined with C1, this is doubly broken: the dashboard hardcodes `'pregnancy'`, and `briefing_templates` stores `briefing_id` (e.g. `PREG-W12`) so a stage-based filter would only work if the `stage` column is populated for every row. Worth verifying the column actually exists with the legacy values; if not, all dashboard teasers are blank.

### H6. `useSnoozeDashboardTask` lets free users snooze
`apps/web/src/components/dashboard/TasksDueCard.tsx:104-110` exposes a Snooze button on every priority task, calling `useSnoozeDashboardTask` (use-dashboard.ts:250). On the Tasks page snooze is gated behind `isPremium` (`tasks-page-client.tsx:106-109`), but on the dashboard it isn't. Free users can snooze tasks indefinitely from this card.
**Fix:** check subscription tier in TasksDueCard or block in the mutation.

### H7. `TasksHeader` `now = useMemo(() => Date.now(), [])` is hydration-unsafe
`apps/web/src/app/(main)/tasks/tasks-client.tsx:25`. Even though the file is `'use client'`, Next will prerender the client component on the server and reconcile. `Date.now()` returns the server's wall clock; the client recomputes. Days-to-go can flip across midnight. Wrap in a state initialised in `useEffect`, or compute on the server and pass down.

---

## Medium (UX, missing states, stale caches)

### M1. Mood streak capped at history limit
`MoodCheckinWidget.tsx:48` calls `useMoodHistory(user.id, 7)`. `calculateStreak` then walks back up to 365 days (line 32), but the `seenDays` Set only contains the 7 most recent entries. A 14-day streak displays as "7-day streak". Either fetch more history or compute the streak server-side.

### M2. `BriefingLinkedTasks` invalidation gap
The briefing page mutates tasks via `BriefingLinkedTasks` (referenced in briefing-client.tsx:230). Confirm those mutations invalidate `['briefing-tasks']`, `['tasks']`, `['dashboard']`. Most task mutations in `use-tasks.ts` invalidate `['tasks']` but not `['briefing-tasks']`, while `use-dashboard.ts:222` does invalidate it. Audit the briefing-linked mutation path so the count of completed tasks updates without a full reload.

### M3. `useRealtimeSync` toast spam on every page load
`use-realtime-sync.ts:43-68` subscribes with `event: '*'`. On the first sync, every UPDATE event since the channel was last open fires the partner-completed toast. Not actually scoped by "since now". Either filter by `payload.commit_timestamp > mountedAt`, or only show toasts after the first SUBSCRIBED state confirmation.

### M4. `useRealtimeSync` doesn't clean up on unmount race
`use-realtime-sync.ts:41-126` declares the channel vars inside `setupSubscriptions` and the cleanup function references them. But `setupSubscriptions` is `async`. If the effect re-runs (family change) before subscriptions are wired up, cleanup runs first and the variables are still `undefined`, then the now-orphaned subscriptions stay alive. Build the subscriptions synchronously (the `.subscribe()` itself is async, the channel object is sync to obtain).

### M5. `Reveal` + `Card3DTilt` wrapping every card causes layout work without React.memo
`DashboardClient.tsx:142-206`. Each map iteration creates a new `Reveal`/`Card3DTilt` component and the inner card components don't use `React.memo`. On a single dashboard data invalidation, every card subtree re-renders even though props didn't change. The 3D tilt is mouse-bound — these re-renders also reset transform state. Memoize the leaf cards.

### M6. `tasksPerDay` ignores baby_id
`tasks-page-client.tsx:301-310` builds the calendar histogram from `tasks` (current filtered list), not `allTasks`. That's fine for "what's due" but the calendar is shown for the active list which already has filters applied. Cross-check with the calendar dynamic import — if it expects a full list, days will be missing tasks the user has snoozed/categorized away.

### M7. `taskCountByWeek` filters PREG vs POST with `task_template_id` prefix
`tasks-page-client.tsx:170-175` uses `templateId.startsWith('PREG-')` to filter. Custom (`is_custom: true`) tasks have no template id and slip through both filters. Fine for pregnancy users, but a post-birth user creates a custom task → it appears in their week pills. Probably intentional, but worth a comment.

### M8. `useTasks` query key includes the entire `filters` object
`use-tasks.ts:38`: `queryKey: ['tasks', familyId, babyId, filters]`. React Query stable-stringifies, but every search keystroke produces a new cache entry — no garbage collection until `gcTime`. Memoize the filters object or normalize the key.

### M9. `useSnoozeTask` invalidates `['dashboard']` but not `['briefing-tasks']`
Inconsistent with `useCompleteDashboardTask`. Pick one rule and apply across all task mutations.

---

## Low / Nits

- `use-dashboard.ts:151` hardcodes `'~15 min'` for every priority task time estimate. Either compute from the row or remove the field.
- `use-dashboard.ts:62-74` returns a hand-rolled empty result when `familyId` is undefined; the query already has `enabled: !!familyId`, so the branch is dead.
- `DashboardClient.tsx:78` types `cardComponents` as `Record<string, React.ReactNode>` and uses `null` for `'shift-briefing'` (line 80) — the entire card is filtered out anyway in `LEFT/RIGHT/FULL_WIDTH_CARDS` (it's in `FULL_WIDTH_CARDS` though, so renders nothing). Dead path.
- `task-item.tsx:88` checkbox button has no `aria-label` ("Complete task" or similar). Same with the snooze button in `TasksDueCard.tsx:104`.
- `briefing-client.tsx:42-44` calls `trackActivity('briefing_viewed')` on every render where `profile.id` is stable — fine, but the comment says "once per user" which it doesn't enforce; remount will retrigger.
- `useDashboardData` and `useDashboardCards` both call `useDashboardData` with different signatures (cards version omits babyId — same as H3).
- `DashboardClient.tsx:60-65` reads `profile.family_id!` with non-null assertion right after extracting from useUser which already guarantees it. Fine, but inconsistent with `family_id ?? ''` patterns elsewhere.
- `dad-journey-service.ts:14` casts `as unknown as DadChallengeContent[]` — drop the double cast and fix the upstream type.
- `DadChallengeTiles.tsx:53-58` resolves `family` from both `useUser()` and `useFamily()` — pick one (the context value is server-fetched and authoritative).
- `briefing-client.tsx:67` falls back `profile.signup_week ?? currentWeek` — silent fallback masks bugs in the new signup_week migration. Log/Sentry on missing.
- `tasks-page-client.tsx:233-237` filter `!week || week <= cutoff` lets tasks with `week == null` slip through unconditionally. Intentional?
- `use-tracker.ts:53` `refetchInterval: 60000` runs even when the tab is hidden. Add `refetchIntervalInBackground: false`.

---

## Verified working

- `task-service.ts:66` search ILIKE escaping handles `%`, `_`, `\`.
- `useBabies` cascade invalidation on baby switch is exhaustive (`use-babies.ts:67-83`).
- `(main)/error.tsx` Sentry-wired error boundary exists for the entire authenticated app group.
- Service layer follows the project's PGRST116 pattern for `.single()` calls on optional rows (`task-service.ts:99`, `dad-journey-service.ts:24`, `briefing-service.ts:32`).
- `useFocusTask` priority scoring (`use-tasks.ts:154-191`) is straightforward and correct (overdue > today > must-do > soonest).
- React Query mutations on tasks (`use-tasks.ts`) consistently invalidate `['tasks']`, `['tasks-timeline']`, `['dashboard']`.
- `categorizeBacklogTask` ("yellow not red") logic in `task-utils.ts` correctly classifies window_passed / probably_done / still_relevant — though no UI surfaces "expired" / "likely_done" / "catch_up" enum values from `task_templates.catch_up_behavior`, which is dead in the app code despite being in the schema.
- `TaskTimelineBar` filtering by family stage prevents PREG/POST mixing at week-number collisions (tasks-page-client.tsx:167-181).
- BriefingHero week navigation correctly clamps to `[1, maxWeek]`.

---

## Per-feature health scores

| Feature | Score | Notes |
|---|---|---|
| Dashboard | 5/10 | C1 (broken teaser for trimester stages), H3 (cache key fan-out), H6 (free snooze leak), M5 (re-render heavy). Architecture is decent but the data plumbing is fragmented. |
| Tasks | 6/10 | H2 (free window correctness), C5 (bulk update missing scope), H7 (hydration), but the rest of the page is solid and the catch-up engine works. |
| Briefing | 4/10 | C3 (free window 9 weeks not 4), H4 (stale cache key), H5 (teaser query). The client is otherwise clean. |
| Tracker | 7/10 | H1 (preview gate ignores trimesters) is the main bug; rest looks fine. |
| Journey | 4/10 | C2 (paywall is cosmetic), C4 (today detection), M1 (streak capped). The content rendering is good but the gates are broken. |

---

## Top 5 prioritized fixes

1. **C2 — Server-side enforce premium gating on dad challenge content.** This is the only finding that loses revenue today. Filter `getContentForPhase` by subscription tier (or RLS) and remove the cosmetic overlay path for `is_premium` rows.
2. **C3 — Fix the 4-week briefing free window math.** One-line change in two files; users are getting 9 weeks free.
3. **C1 + H5 — Make `getBriefingTeaser` work for trimester stages.** Stop hardcoding `'pregnancy'` in `use-dashboard.ts`; switch to the same `briefing_id` lookup `getBriefingByWeek` uses. Without this most users see no dashboard teaser.
4. **C4 — Fix `getLastCheckin` timezone bug** so the "already checked in today" UI is correct, and stop creating duplicate mood rows. Compute the local-day boundary, not UTC.
5. **H3 — Unify `useDashboardData` cache key.** Pass `babyId` (or read from `useUser()`) in every consumer so cards and the parent share one query, eliminating duplicate fetches and stale-baby data on multi-baby accounts.

Bonus: **C5 (bulk triage scope)** is a 1-line defense-in-depth fix and should land in the same PR as the bulk-update audit.
