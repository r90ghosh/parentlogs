# Mobile Perf Phase 1 + 2 — Implementation Plan

**Scope:** Ship Phases 1 & 2 from `docs/mobile-perf-plan.html`. Phase 3 (New Arch, BlurView refactor, FlashList) is deferred.
**Target:** Dashboard cold-start under 1.5s on iPhone 13, 60fps tab switches, warm-cache hits on every dashboard mount, no wrong-page-after-notification bug.
**Estimate:** 2–3 working days across 9 tasks.
**Branch strategy:** One feature branch `perf/phase-1-2`. Worktree the `lazy:true` change in Task 1.2 first to verify it doesn't recur the stuck-route bug before merging.

---

## Prerequisites

Before starting:
- [ ] Baseline recording: TestFlight build, screen-record cold start + tab switches. Save to `docs/perf-baseline-2026-04-14.mov`.
- [ ] Install React Query Devtools plugin: `npx expo install @dev-plugins/react-query`.
- [ ] Confirm `npx tsc -p tsconfig.json --noEmit` passes on main.
- [ ] Create branch: `git checkout -b perf/phase-1-2`.

---

## Phase 1 — Quick Wins (1 day, ~80% perceived improvement)

### Task 1.1 · Align prefetch keys with query keys
**File:** `components/providers/AuthProvider.tsx:171–200`
**Problem:** Prefetch uses `['tasks-due']`, dashboard reads `['tasks-due', family?.id]`. Cache miss on every mount.

**Steps:**
1. Move the `prefetchTabData(userId)` call out of the `getSession` block (currently `AuthProvider.tsx:124`) into the end of `fetchProfile()` after `setFamily(familyData)` (line 99). It must run after `family.id` is known.
2. Rename the function to `prefetchTabData(userId, familyId)` — accept both as args.
3. Replace the three prefetch keys with the full dashboard set:
   - `['tasks-due', familyId]` → use `taskService.getTasks({ status: 'pending', limit: 5 }, ctx)` via the same code path as `use-dashboard.ts:26` (or inline the query to avoid service-layer dependency).
   - `['current-briefing', familyId]` → use `briefingService.getCurrentBriefing(briefingCtx)` (needs stage + currentWeek — pull from `familyData`).
   - `['babies', userId]` → already matches, keep.
   - `['subscription-status', userId]` → match `hooks/use-subscription.ts` key exactly.
   - `['backlog-count', familyId]` → match `hooks/use-triage.ts` key exactly.
   - `['checklists', familyId]` → match `hooks/use-checklists.ts` key exactly.
4. Set realistic `staleTime` on each prefetch (match the consuming hook or default to 2 min).

**Verify:**
- Add React Query Devtools to the app in dev builds. Open home tab. All 6 queries should show `fresh` not `fetching` on first render.
- Log to console: `console.log('[prefetch] keys:', queryClient.getQueryCache().getAll().map(q => q.queryKey))` — should include all 6 on sign-in.

**Commit:** `perf(mobile): match prefetch keys to dashboard query keys`

---

### Task 1.2 · Re-enable lazy:true on Tabs (worktree first)
**File:** `app/(tabs)/_layout.tsx:117–179`
**Problem:** All 5 tabs + 21 More sub-screens mount on first render. The 2026-04-12 revert (`57698eb`) disabled both `lazy:true` AND `freezeOnBlur:true`, but only `freezeOnBlur` was the real culprit.

**⚠️ Risk control — do this in a worktree:**
```bash
git worktree add ../parentlogs-lazy-test perf/lazy-test
cd ../parentlogs-lazy-test/apps/mobile
```

**Steps:**
1. In the worktree, edit `app/(tabs)/_layout.tsx` to add `lazy: true` (but NOT `freezeOnBlur`) to the `screenOptions` prop on line 119:
   ```ts
   screenOptions={{
     headerShown: false,
     sceneStyle: { backgroundColor: 'transparent' },
     lazy: true,
   }}
   ```
2. `npx expo start` → iOS simulator.
3. Manually exercise every nested Stack flow:
   - Home → navigate to no stack (just index)
   - Tasks tab → tap a task → detail screen → back
   - Briefing tab → tap a week → weekly briefing → back
   - Tracker tab → all internal screens
   - More tab → budget → detail → back; checklists → detail → back; journey → challenge tile → back; settings → sub-screens → back
4. Specifically test the failure mode from `57698eb`: switch tabs while a nested Stack is deep (e.g. Tasks → task detail → switch to Briefing → switch back to Tasks). Route should remain on the detail screen, not reset to index, not get stuck.
5. If all flows work for 10+ minutes of exercise: merge the branch into `perf/phase-1-2` and delete the worktree.
6. If stuck routes recur: the revert was correct, abort Task 1.2, document the specific failure path, and escalate.

**Verify:**
- React DevTools Profiler: record first render. Only `(tabs)/index.tsx` subtree should mount. Tasks/Briefing/Tracker/More should not appear in the render tree.
- Cold-start JS bundle eval time drops (Hermes profiler).

**Commit:** `perf(mobile): re-enable lazy:true on tabs (freezeOnBlur remains off)`

---

### Task 1.3 · Dashboard skeleton screens
**Files:** `app/(tabs)/index.tsx`, `app/(tabs)/tasks/index.tsx`, `app/(tabs)/briefing/index.tsx`
**Problem:** Blank screen with ActivityIndicator during load — feels dead.

**Steps:**
1. Create `components/skeletons/DashboardSkeleton.tsx`:
   - One skeleton per card (greeting line, 8 card placeholders).
   - Opaque (no BlurView) — use `colors.surfaceElevated` or `colors.card` for the bg.
   - Use `react-native-reanimated`'s shimmer via animated `opacity` between 0.4 and 0.8 (one shared value, all rows reference it — NOT per-row).
   - Match final card outer shape: same height, border radius, margin.
2. Replace `ActivityIndicator` block at `app/(tabs)/index.tsx:135-138` with `<DashboardSkeleton />` when `isPending && !cachedData`.
3. If cache was warm (React Query returned cached data synchronously), render cards immediately (no skeleton, no entrance animation — see 1.4).
4. Mirror for `tasks/index.tsx` (`TasksSkeleton`) and `briefing/index.tsx` (`BriefingSkeleton`).

**Verify:**
- Cold start with airplane mode on → see skeleton, not spinner.
- Turn airplane mode off → skeleton replaced by real content smoothly (no flash).

**Commit:** `perf(mobile): add skeleton screens for dashboard/tasks/briefing`

---

### Task 1.4 · Cut dashboard animation cost
**File:** `app/(tabs)/index.tsx:103–190`
**Problem:** 8 staggered spring animations (0–360ms delays) + LinearTransition.springify() re-springs all siblings on any card refresh.

**Steps:**
1. Remove the `layout={reducedMotion ? undefined : LinearTransition.springify().damping(16).stiffness(200)}` prop from `<Animated.View>` at line 142. If layout animation is genuinely needed, use `LinearTransition.duration(150)` (linear timing, no spring).
2. Compress stagger delays from `40, 80, 120, 160, 200, 280, 320, 360` → `0, 30, 60, 90, 120, 150, 180, 210`. Total timeline drops 360ms → 210ms.
3. Add `skipEnter` prop to `components/animations/CardEntrance.tsx`. When `skipEnter` is true, render children in a plain `View` — no `Animated.View`, no entering animation.
4. In `app/(tabs)/index.tsx`, check if data was already cached before mount:
   ```ts
   const tasksWarm = queryClient.getQueryState(['tasks-due', family?.id])?.status === 'success'
   const briefingWarm = queryClient.getQueryState(['current-briefing', family?.id])?.status === 'success'
   const cacheWarm = tasksWarm && briefingWarm
   ```
   Pass `skipEnter={cacheWarm}` to every `CardEntrance`. On warm cache: no animation, cards just appear.

**Verify:**
- Record cold start (cache cold): cards stagger in over ~210ms.
- Record warm tab switch (cache hot): cards render instantly, no animation.
- Refresh data via pull-to-refresh: no sibling cards re-animate.

**Commit:** `perf(mobile): reduce dashboard animation cost (stagger, skip-on-warm)`

---

## Phase 2 — Meaningful Gains (1–2 days)

### Task 2.1 · Memoize TabHeader + BabySwitcher
**File:** `app/(tabs)/_layout.tsx:51–102`
**Problem:** `useSegments()` at line 54 fires on every route change → TabHeader re-renders → cascades to BabySwitcher (useBabies, useColors).

**Steps:**
1. Extract the segments-dependent logic into a small inner component:
   ```ts
   function TabHeaderContent() {
     const segments = useSegments()
     const isMoreSubScreen = segments.length >= 3 && segments[1] === 'more' && segments[2] !== 'index'
     return isMoreSubScreen ? <View style={{ flex: 1 }} /> : <BabySwitcher />
   }
   ```
2. Wrap `TabHeader` in `React.memo`. Now only `TabHeaderContent` re-renders on navigation; the outer BlurView + bell stay memoized.
3. Confirm `BabySwitcher` is memoized. If it consumes `useColors()` and the returned object is a fresh reference each render, add a selector: `const copper = useColors(c => c.copper)` if the hook supports it, or memoize the colors slice used.
4. Check whether `useColors()` returns a new object per call (read `hooks/use-colors.ts`). If it does, memoize its return inside the provider.

**Verify:**
- React DevTools Profiler: record tab switch. `TabHeader` shows no re-render; only `TabHeaderContent` updates.

**Commit:** `perf(mobile): memoize TabHeader; isolate useSegments`

---

### Task 2.2 · Consolidate profile + family into one Supabase RPC
**Files:** `components/providers/AuthProvider.tsx:63–106`, new Supabase migration
**Problem:** Sequential `profiles` fetch → `families` fetch on boot. Extra 200–400ms cellular RTT.

**Steps:**
1. Create migration `20260414_create_get_initial_app_state_rpc.sql`:
   ```sql
   CREATE OR REPLACE FUNCTION public.get_initial_app_state(p_user_id uuid)
   RETURNS jsonb
   LANGUAGE plpgsql
   SECURITY DEFINER
   SET search_path = ''
   AS $$
   DECLARE
     result jsonb;
   BEGIN
     IF auth.uid() IS NULL OR auth.uid() != p_user_id THEN
       RAISE EXCEPTION 'unauthorized';
     END IF;
     SELECT jsonb_build_object(
       'profile', to_jsonb(p.*),
       'family', to_jsonb(f.*),
       'babies', COALESCE((SELECT jsonb_agg(to_jsonb(b.*)) FROM public.babies b WHERE b.family_id = p.family_id), '[]'::jsonb)
     ) INTO result
     FROM public.profiles p
     LEFT JOIN public.families f ON f.id = p.family_id
     WHERE p.id = p_user_id;
     RETURN result;
   END;
   $$;
   GRANT EXECUTE ON FUNCTION public.get_initial_app_state(uuid) TO authenticated;
   ```
2. Apply migration via Supabase MCP `apply_migration`.
3. Replace `AuthProvider.tsx:65–102` with a single RPC call:
   ```ts
   const { data, error } = await supabase.rpc('get_initial_app_state', { p_user_id: userId })
   if (error) { /* existing Sentry + Alert path */ return }
   const { profile: profileData, family: familyData, babies } = data
   // ...existing grace-period normalization on profileData
   setProfile(profileData)
   setFamily(familyData)
   queryClient.setQueryData(['babies', userId], babies)  // seed the cache
   ```
4. Run `mcp__claude_ai_Supabase__get_advisors` → confirm no new warnings.
5. TypeScript: regenerate types (`mcp__claude_ai_Supabase__generate_typescript_types`) if needed.

**Verify:**
- Network tab in dev: only one request to `/rpc/get_initial_app_state`, no separate profiles/families calls.
- Babies query on dashboard shows `fresh` in devtools (seeded from RPC payload).
- Cold-start time drops ~200–400ms (measure in Sentry performance / manual stopwatch).

**Commit:** `perf(mobile): collapse profile+family+babies into one RPC`

---

### Task 2.3 · Add staleTime to orphan hooks
**Files:** `hooks/use-triage.ts:24–32`, `hooks/use-content.ts:18`, plus full sweep of `hooks/`

**Steps:**
1. Audit every `useQuery` call in `hooks/`:
   ```bash
   grep -rn "useQuery(" apps/mobile/hooks/ | grep -v staleTime
   ```
2. Add `staleTime` per use case:
   - `useBacklogCount` → `1000 * 60 * 2` (2 min, counts change frequently)
   - `useBacklogTasks` → `1000 * 60 * 2`
   - `useArticle` → `1000 * 60 * 30` (articles rarely change)
   - `useBabies` → already 5 min, keep
   - Any content-ish query (briefings, articles, challenge content) → 10–30 min
   - Any per-user state (tasks, checklists) → 2–5 min
3. Default rule: no orphan queries. If uncertain, use 60 seconds as a floor.

**Verify:**
- React Query Devtools: navigate Home → Tasks → Home. Backlog count should show `fresh` on return, not re-fetch.

**Commit:** `perf(mobile): set staleTime on previously-unconfigured queries`

---

### Task 2.4 · Fix notification race (intent queue)
**Files:** `components/providers/NotificationListener.tsx:50–92`, `components/providers/AuthProvider.tsx:202–232`
**Problem:** 500ms hardcoded delay races the auth redirect. If auth resolves first, the deep-link push is clobbered.

**Steps:**
1. In `NotificationListener.tsx`, replace the raw `router.push(...)` with an intent-queue pattern:
   ```ts
   // Shared queue module — a tiny ref-holder
   // lib/notification-intent.ts
   let pendingRoute: string | null = null
   let routerRef: Router | null = null
   let authReady = false

   export function setPendingRoute(route: string) {
     pendingRoute = route
     drainIfReady()
   }
   export function markAuthReady() {
     authReady = true
     drainIfReady()
   }
   export function setRouter(r: Router) { routerRef = r }
   function drainIfReady() {
     if (!authReady || !pendingRoute || !routerRef) return
     const route = pendingRoute
     pendingRoute = null
     try { routerRef.push(route as never) } catch { routerRef.push('/(tabs)') }
   }
   ```
2. `NotificationListener.tsx`: replace `router.push(route)` with `setPendingRoute(route)`. Remove the 500ms `setTimeout`.
3. `AuthProvider.tsx`: in the route-protection effect at line 203, after successful route resolution, call `markAuthReady()`. Also call `setRouter(router)` in a mount effect.
4. In `NotificationListener`, log unknown URLs to Sentry before falling back to `/(tabs)`:
   ```ts
   if (route === '/(tabs)' && url && url !== '/' && url !== '/dashboard') {
     Sentry.captureMessage('unknown notification URL', { level: 'warning', extra: { url } })
   }
   ```

**Verify:**
- Manually send a test push with URL `/budget` from a signed-out state (use Expo push notifications tool or Supabase `test_push` function).
- Kill the app. Tap the notification to cold-launch.
- Expected: land on `/(tabs)/more/budget`. Repeat 10 trials — should be 10/10 correct.
- Send a push with URL `/nonexistent-path`: confirm Sentry event fires.

**Commit:** `perf(mobile): replace notification 500ms timeout with intent queue`

---

### Task 2.5 · Reduce floating particle count + memoize colors
**Files:** `components/animations/FloatingParticles.tsx`, `components/shared/AppBackground.tsx`
**Problem:** 6 particles × 3 shared values = 18 infinite worklets. Particle regenerate on every theme-related re-render.

**Steps:**
1. Change the default `count` from 6 to 3 in `FloatingParticles.tsx:115`.
2. Fix the color memoization. `useMemo(() => getParticleColors(colors), [colors])` at line 119 breaks whenever `colors` is a new object reference. Replace with a primitive dep:
   ```ts
   const particleColors = useMemo(
     () => getParticleColors(colors),
     [colors.bg]  // only regenerate when the actual theme value changes
   )
   ```
3. Optional stretch: behind a feature flag or dev setting, support `count: 0` to disable particles entirely. Default keeps them at 3 for now.

**Verify:**
- Reanimated devtools: worklet count drops from ~24 → ~12 (18 → 9 particles).
- Toggle theme (dark ↔ light). Particles should re-render once (color swap), not regenerate animation values.

**Commit:** `perf(mobile): reduce particles 6→3 + stabilize color memo dep`

---

## Git / commit strategy

- One feature branch: `perf/phase-1-2`
- One commit per task (9 commits total). Keep them atomic — easy to bisect if something regresses.
- After all 9 tasks: open a PR against main, include screenshots/screen-recordings in the PR body.
- Ship to TestFlight before merging to main. Get one real-device confirmation.

## Rollback plan

Each commit is independent:
- If 1.2 (lazy tabs) regresses stuck routes → revert that commit only, keep the rest.
- If 2.2 (RPC) has a Supabase issue → revert the AuthProvider change, keep the migration (it's additive).
- If 2.4 (notification queue) breaks → revert and restore the 500ms timeout temporarily.

## Final verification (before PR merge)

- [ ] TestFlight build installs + cold-starts under 1.5s on iPhone 13.
- [ ] All 5 tabs switch in under 150ms perceived time.
- [ ] Every React Query on dashboard shows `fresh` on first mount (devtools).
- [ ] Reanimated worklets ~12 (down from ~24).
- [ ] 10/10 notification trials land on correct route.
- [ ] `npx tsc -p tsconfig.json --noEmit` passes.
- [ ] `get_advisors` returns no new security warnings.
- [ ] No regressions in dark/light theme toggle.
- [ ] No regressions in deep-link auth flows (password recovery, magic link).

## Out of scope (Phase 3 — defer)

- New Architecture (`newArchEnabled: true`) — requires native module audit + 1 week alpha.
- GlassCard refactor (one BlurView instead of N) — visual regression risk, needs design review.
- FlashList for tasks — nice to have, not critical.
- Suspense boundaries per tab — depends on React 19 + `useSuspenseQuery` adoption.
