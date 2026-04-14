# The Dad Center — Mobile App

> Expo/React Native iOS app, TestFlight live. See root CLAUDE.md for brand/pricing/business context.

## Quick Reference

- **Stack:** Expo 55 + React Native 0.83 + expo-router 55 + React Query 5 + Supabase
- **Dev:** `cd apps/mobile && npx expo start` (press `i` for iOS simulator)
- **Build:** `eas build --platform ios --profile production --auto-submit`
- **Type check:** `npx tsc -p tsconfig.json --noEmit`

## Theme System (critical — don't hardcode colors)

All colors go through `useColors()` hook:

```tsx
import { useColors } from '@/hooks/use-colors'

const colors = useColors()
<Text style={[styles.title, { color: colors.textPrimary }]}>Hello</Text>
<View style={{ backgroundColor: colors.bg }}>...</View>
```

- **Tokens defined in:** `lib/colors.ts` (33 semantic tokens, dark + light palettes)
- **Static styles:** keep layout (padding, flex, fontFamily, borderRadius) in `StyleSheet.create()` at module level
- **Colors:** apply inline via style arrays `[styles.foo, { color: colors.x }]`
- **Theme toggle:** `useTheme().setTheme('dark'|'light'|'system')` — persists to AsyncStorage

See `memory/reference_mobile_color_tokens.md` for full token list.

## Route Structure

```
(tabs)/          — bottom dock visible
  index.tsx      — Home/Dashboard
  tasks/         — Tasks tab (Stack)
  briefing/      — Briefing tab (Stack)
  tracker/       — Tracker tab (Stack)
  more/          — More tab (Stack) — 21 sub-screens here
    index.tsx    — the More menu
    budget.tsx, checklists.tsx, journey.tsx, settings.tsx, etc.
    article.tsx  — has markdown parser for #, ##, **bold**, - bullets
(screens)/       — modal overlays (NO dock)
  upgrade.tsx, create-task.tsx, appearance.tsx, upgrade-success.tsx
(auth)/          — landing (has theme toggle), login, signup
(onboarding)/    — new user flow
(guest)/         — browse-as-guest (has theme toggle)
```

**Rules:**
1. Content-heavy screens → `(tabs)/more/` (shows dock)
2. Action/alert modals → `(screens)/` (fullScreenModal)
3. Modal layouts need own `<AppBackground />` (root doesn't show through)
4. All containers use `backgroundColor: 'transparent'`
5. `ScreenHeader` goes INSIDE ScrollView/FlatList (as ListHeaderComponent) so it scrolls

See `memory/reference_mobile_routing.md` for full routing reference.

## Key Components

- `components/glass/GlassCard.tsx` — Blur-backed card, uses `colors.blurTint`/`blurIntensity`
- `components/shared/AppBackground.tsx` — Gradient + particles, accepts `particles` prop
- `components/ui/ScreenHeader.tsx` — Back button + title with blur, supports `transparent` prop
- `components/ui/AnimatedPressable.tsx` — Spring scale + haptic on press
- `components/animations/CardEntrance.tsx` — Memoized FadeInDown spring
- `components/animations/FloatingParticles.tsx` — 6 particles default
- `components/providers/NotificationListener.tsx` — Maps notification URLs to routes
- `components/providers/QueryProvider.tsx` — Persistent React Query cache (7d)
- `components/providers/AuthProvider.tsx` — Uses getSession() for fast cold start, prefetches tab data

## Performance Patterns

- React Query persisted to AsyncStorage (7 day gcTime, 5min default staleTime)
- **Prefetch keys MUST match the query keys the consuming hook uses** — e.g. prefetch `['tasks-due', familyId]` not `['tasks-due']`. Mismatched keys = silent cache miss on every mount. This is the single most common perf bug in the app.
- Prefetch runs at the end of `fetchProfile()` in AuthProvider — after `family.id` is known — not inside `getSession` before family loads.
- `lazy: true` on `<Tabs>` is **safe and correct**. Only `freezeOnBlur: true` was the culprit in commit `57698eb` that caused stuck nested-Stack routes. Never enable `freezeOnBlur`.
- Animations should be skipped when cache was warm pre-mount. Animations communicate freshness; warm cache means "already here."
- Do NOT wrap a list of cards in `Animated.View layout={LinearTransition.springify()}` — any data refresh re-springs every sibling.
- FloatingParticles disabled on modal layouts (`particles={false}`)
- BlurView intensity: 50 dark / 60 light (don't go higher — iOS GPU cost)
- Never stack BlurViews — one BlurView per hierarchy (Apple HIG §Materials). `GlassCard` being a BlurView per card is already at the limit of acceptable.
- CardEntrance wrapped in React.memo

See `memory/feedback_mobile_performance.md` for details.

## Notification System

- Edge function `send-notifications` authenticated via `cron_webhook_secret` (vault)
- See `memory/reference_notification_system_v2.md` for auth flow
- Tap-to-navigate via `NotificationListener.tsx`
- iOS push tokens stored in `device_tokens` table

## Gotchas

- **BlurView clips overflow on iOS** — render badges/absolute elements OUTSIDE BlurView
- **Modal screens need own AppBackground** — root doesn't show through `fullScreenModal`
- **Tab header visibility** — full on main tabs, compact (bell only) on More sub-screens (uses `useSegments()`)
- **`freezeOnBlur: true` on Tabs breaks nested Stack state** (commit `57698eb`). `lazy: true` alone is fine — that was wrongly reverted together with `freezeOnBlur`.
- **`useSegments()` fires on every route change** — don't put it at the top of a large component or you'll re-render the entire subtree on every navigation. Isolate it in a small inner child.
- **Theme-aware icons** — pass `color={colors.copper}` etc to lucide-react-native icons
- **Article content** — has `# ##` raw markdown, parsed inline in article.tsx

## Things to Specifically Not Do

These are tempting shortcuts that have known failure modes in this codebase. Each one comes from a real incident:

1. **Don't set `freezeOnBlur: true` on `<Tabs>`.** It freezes a tab's Stack state mid-navigation — users see stuck screens and wrong pages after switching tabs. This is the real root cause of the `57698eb` revert; `lazy: true` was collateral damage and is safe to re-enable on its own.
2. **Don't use a prefetch key that differs from the consuming query key.** `['tasks-due']` and `['tasks-due', familyId]` are different caches. Every dashboard mount was firing cold network calls because of this. Always copy the exact key from the consuming hook.
3. **Don't add a `useQuery` without a `staleTime`.** The default is 0 = refetch on every mount = tab-switch refetch thrash. Floor is 30s; most data should be 2–10 min.
4. **Don't animate card entrances when the cache was already warm.** Animations communicate freshness. If data is cached, skip the animation — warm cache means "already here" not "new content just arrived."
5. **Don't wrap a list of cards in `Animated.View layout={LinearTransition.springify()}`.** Any single-card refresh will re-spring all siblings. Use `LinearTransition.duration(150)` (linear) or no layout animation.
6. **Don't stack BlurViews.** Apple HIG says one material per hierarchy. Every new BlurView = a separate rasterization pass on iOS. If a parent already has a BlurView, children must be opaque.
7. **Don't enable `newArchEnabled: true` without auditing every native module first.** One non-Fabric module = broken build for all users. Gate any New Arch migration behind a 1-week TestFlight alpha.
8. **Don't introduce new provider abstractions to "solve" perf** (PerformanceProvider, HOCs, context-in-context). The fix is usually the opposite — move `useSegments()` / `useTheme()` down closer to where they're consumed.
9. **Don't replace React Query when something feels slow.** The bug is almost always a key mismatch or missing `staleTime`, not the library.
10. **Don't use hardcoded `setTimeout` for "wait for the app to be ready" patterns.** (e.g. the 500ms in NotificationListener.) Use an intent queue that drains when the consumer signals ready. Timeouts race whatever is happening in the other effect.
11. **Don't remove the AsyncStorage React Query persister.** Once prefetch keys match (#2), it becomes a real 7-day offline cache.
12. **Don't fetch profile and family sequentially in AuthProvider.** Use a single Supabase RPC that returns `{ profile, family, babies }` in one round-trip. Every sequential await on the boot path is felt by the user.

## Session Checklist

- Read changed files before editing (useColors hook + migration pattern)
- Run TypeScript check before committing
- Only use existing tokens from `lib/colors.ts` (don't add new ones unless needed)
- Preserve layout in StyleSheet.create(), only inline colors
