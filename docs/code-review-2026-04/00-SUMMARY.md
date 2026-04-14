# Comprehensive Code Review — The Dad Center (Web)

**Date:** 2026-04-07
**Scope:** `apps/web` (Next.js 16) + Supabase backend (34 migrations + 6 edge functions). Mobile app (`apps/mobile`) excluded.
**Reviewers:** 6 specialized agents in parallel — security, database, payments, core features, content/marketing, UX/perf/a11y.

---

## TL;DR — what to do this week

The codebase has been hardened iteratively and most fundamentals are right (server-side auth, RLS on every table, webhook signature verification, idempotency tables, search_path on SECURITY DEFINER functions, invite code entropy upgrade). **But there are three structural issues that compound across reviews and cost real money or trust today**:

1. **Migrations are out of sync with production.** Commit `7c808c7` claims a `join_family` race fix, an `is_premium_user` expiry check, and a `sync_subscription_tier` trigger — none are in `supabase/migrations/`. A `supabase db reset` would re-introduce the bugs. **(Security C2, Payments C6/H3/H4, Database referenced throughout.)**
2. **Premium content is not server-gated.** Tasks, briefings, and dad-challenge content are filtered client-side or with a CSS overlay. A free user can read every paid asset via DevTools or direct PostgREST. **(Core C2/C3, Payments C1/C2/C3, Database C4.)**
3. **Multi-platform subscriptions clobber each other.** Stripe and RevenueCat webhooks `upsert` on `user_id` only — whoever fires last wins, and there's no `verify_jwt = false` on the RevenueCat function so the gateway probably rejects it before the handler runs. **(Payments C8, Database C3.)**

If you fix only five things this week, fix these:

| # | Fix | Effort | Reports |
|---|---|---|---|
| 1 | Enable Supabase email confirmation in production dashboard | 5 min | Security C1 |
| 2 | Disable JWT verification on `handle-revenucat-webhook` (`verify_jwt = false` in `config.toml` + dashboard verify) | 10 min | Payments C8 |
| 3 | Commit the missing `join_family` FOR UPDATE / `is_premium_user` / `sync_subscription_tier` migrations | 1-2 h | Security C2, Payments C6/H3/H4 |
| 4 | Move briefing access behind a SECURITY DEFINER RPC (drop public read on `briefing_templates`) | 2-3 h | Payments C3, Core C3 |
| 5 | Fix the 4-week briefing free window math (`Math.abs > 4` is currently a 9-week window) | 5 min | Core C3 |

---

## Risk register — cross-cutting themes

These showed up in multiple reviews. Each one is worth one focused PR.

### Theme A — "Premium" is a UI veneer, not a server contract
- **Core C2:** `getAllTasksForTimeline` comment: "ignores premium gating."
- **Core C3 + Payments C3:** Briefing service has zero tier checks; data ships to client before paywall renders on top.
- **Payments C1:** `task-service.resolveContext()` trusts client-supplied `subscriptionTier`.
- **Database C2:** `protect_subscription_fields` trigger silently rewrites instead of raising — clients think their write succeeded.
- **Database C4:** No post-grace-period downgrade cron — `profiles.subscription_tier` stays `'premium'` forever after cancel.
- **Security C3 + Payments C4:** `subscriptions` table has user-facing UPDATE policy with no protection trigger.

**Action:** Audit every `is_premium`, `subscription_tier` access path. Move all gating into either RLS predicates (joining `profiles.subscription_tier`) or SECURITY DEFINER RPCs that the client cannot bypass. Add the missing cron job. Drop the `Users can update own subscription` policy.

### Theme B — Migrations vs. production schema drift
- **Security C2 + Payments C6/H3/H4:** Commit `7c808c7` shipped DB changes that were never committed as migration files.
- **Database H1 + H2:** `handle_new_user` swallows errors; `profiles.subscription_tier` and `subscriptions.tier` can drift.
- **Payments H4:** `sync_subscription_tier` trigger claimed in commit message is missing.

**Action:** Run `supabase db diff --linked` to capture every schema element that exists in prod but not in `supabase/migrations/`. Commit each as a real migration. Add CI that fails on drift.

### Theme C — Family seat / subscription race conditions
- **Security C2 + Payments C6 + Database (verified-correct claim is wrong):** `join_family` count check has no `FOR UPDATE` lock — 3-person families on one paid seat are possible.
- **Payments C5:** Leaving a premium family doesn't downgrade the leaver — they keep premium forever.
- **Database C1:** `babies` RLS uses subquery form, no pinned `family_id` in WITH CHECK — possible cross-family writes during a join window.
- **Payments H6:** Buying lifetime while having an active monthly does NOT cancel the monthly — double charge.

**Action:** Bundle these into a single "subscription/family integrity" migration: row-locked `join_family`, `leaveFamily` RPC that resets tier, lifetime-purchase auto-cancels-monthly handler, and tightened `babies` policies.

### Theme D — Content/free-window math is consistently off
- **Core C3:** Briefing free window `Math.abs(weekToView - anchor) > 4` allows a 9-week window, not 4 weeks.
- **Core H2:** Task 30-day window: client uses `currentWeek + ceil(30/7) = currentWeek + 5` (5 weeks, no lower bound). Server uses `due_date <= today + 30 days` (no lower bound). Two implementations, neither correct.
- **Payments H2:** Grace-period math counts grace twice for users who cancel in their last week (14 days instead of 7).

**Action:** One util module — `getFreeTaskWindow(today, signupAt)`, `getFreeBriefingWindow(signupWeek)`, `getGraceExpiry(periodEnd)` — used identically by client and server.

### Theme E — Marketing/funnel correctness
- **Content #1 + Payments M2:** Pricing CTAs link to `/signup?plan=monthly|yearly|lifetime` but the signup page never reads `plan` — users dead-end at the dashboard with no checkout offered.
- **Content #2:** Hero/Features say "60+ briefings", Pricing says "~140". Pick one.
- **Content #3 + #4:** `/baby-checklists` metadata says "15 Essential Lists" but real count is 31; sitemap only emits 15 of 31.
- **Payments M1:** Marketing pricing component lists "Full budget planner" as free; gating treats it as premium.

**Action:** Wire `?plan=` through signup → upgrade. Reconcile briefing count. Drop hardcoded "15" from checklists metadata + sitemap. Decide whether budget is free or premium and align both surfaces.

### Theme F — Mobile-web UX & accessibility floor
- **UX #1, #8:** Bottom-nav touch labels are 9-10px (below WCAG 1.4.4 + 2.5.5).
- **UX #2:** Radix `Sheet` (More menu) missing `SheetTitle` — accessibility violation + dev warning.
- **UX #7:** `--muted` and `--dim` text colors fail WCAG AA contrast on dark surfaces (used on dozens of cards).
- **UX #4:** `Providers` is a client component wrapping the entire tree — every marketing route ships QueryClient + Auth + SW + GTM JS.
- **UX #14:** No skip-to-content link.
- **UX #3:** Zero `next/image` usage; YouTube thumbnails ship as raw `<img>` (CLS).

**Action:** Single "a11y + perf sweep" PR — add skip link, fix `SheetTitle`, lighten `--muted`, split `Providers`, convert thumbnails to `next/image`, raise nav label to ≥11px.

---

## Critical findings — full list (sorted by blast radius)

| Code | Source | Title | Impact |
|---|---|---|---|
| **SEC C1** | Security | Email confirmation disabled in `supabase/config.toml` | Account takeover via signup with anyone's email |
| **PAY C8** | Payments | RevenueCat webhook missing `verify_jwt = false` | All mobile subscriptions silently fail |
| **PAY C3 / DB C4** | Payments + DB | Briefing templates are public-read; no server-side tier gate; no post-grace cron | Free users read every paid briefing; cancelled users stay premium forever |
| **PAY C1/C2 / CORE C2** | Payments + Core | `task-service` trusts client-supplied tier; `getAllTasksForTimeline` ignores gating | Free users read all paid tasks via DevTools |
| **CORE C2** | Core | `PaywallOverlay` is a CSS div, premium content fully in DOM | Disable overlay → full premium dad-challenge content |
| **PAY C5** | Payments | `leaveFamily` doesn't reset leaver's tier | Free premium for life |
| **SEC C2 / PAY C6** | Security + Payments | `join_family` race condition fix not in migrations | 3-person families on one paid seat |
| **DB C3** | Database | Stripe + RevenueCat webhooks both upsert on `user_id` only | iOS lifetime user opens web → tier silently demoted |
| **DB C1** | Database | `babies` RLS uses subquery form, no family-pinned WITH CHECK | Cross-family writes possible during join window |
| **CORE C3** | Core | Free briefing window enforces 9 weeks (Math.abs > 4), not 4 | Free users get more than 2× the intended free briefings |
| **CORE C4** | Core | `getLastCheckin` uses UTC midnight from local Y/M/D | Mood "checked in today" detection wrong by full day in non-UTC timezones |
| **SEC C3 / PAY C4** | Security + Payments | `subscriptions` table allows user-facing UPDATE without protection trigger | User PATCHes own row to `tier='lifetime'` via PostgREST |
| **PAY C7** | Payments | Deprecated Supabase `stripe-webhook` Edge Function still in repo with broken Stripe API version | Anyone redeploying it breaks billing |
| **DB C5** | Database | Stripe webhook 30-day fallback fabricates a subscription period on garbage events | Users get 30 free days of premium on malformed events; combined with C4, forever |
| **SEC C4** | Security | `partner-joined` API has no idempotency → email-bombable | Resend quota burn, domain reputation damage |
| **CORE C5** | Core | `bulkTriageTasks` not scoped to family_id (RLS catches it but defense-in-depth lost) | Cross-family writes if RLS ever loosened |
| **DB C2** | Database | `protect_subscription_fields` trigger silently rewrites instead of raising | Clients think a write succeeded; UI may cache stale value |

---

## Per-area health scores

| Area | Score | Source |
|---|---|---|
| Security posture | **6/10** | Lots of hardening done; three structural gaps (email confirm, migration drift, subscriptions UPDATE) |
| Database / RLS | **6.5/10** | Search_path + idempotency + entropy fixed; multi-platform model half-built; 4 `FOR ALL` policies missing `WITH CHECK` |
| Payments / billing | **5/10** | Webhook signature + idempotency correct; gating bypasses + grace period bugs + multi-platform race make this the highest-risk area |
| Dashboard | **5/10** | Hardcoded 'pregnancy' stage in teaser; cache key fan-out; free snooze leak |
| Tasks | **6/10** | Free window math wrong on both client and server; bulk update missing scope |
| Briefing | **4/10** | Free window 9 weeks not 4; stale cache key; no server-side gate |
| Tracker | **7/10** | Preview gate ignores trimester stages; otherwise fine |
| Journey (dad challenges) | **4/10** | Paywall is cosmetic; today-detection broken |
| Marketing pages | **8/10** | Brand/pricing/free-window all consistent; dead `?plan=` funnel and stale checklist count |
| Onboarding | **7/10** | Solid except `OnboardingJoin` is visually orphaned |
| Mobile-web responsive | **6/10** | Safe-area handled, 16px inputs, but touch labels < 11px |
| Accessibility | **5/10** | Good keyboard support; missing skip link, dialog title, contrast failures, no toast aria-live |
| Performance | **7/10** | next/font + code splitting good; held back by all-routes client `Providers` and no `next/image` |

---

## Verified-good areas (no findings)

These came back clean and don't need attention:

- **Stripe webhook signature verification** + idempotency (`stripe.webhooks.constructEvent` + `UNIQUE(event_id)` upsert).
- **All `SECURITY DEFINER` functions** have `SET search_path = ''` (post-`20260319000003`).
- **Invite code entropy** upgraded from 32→48 bits and applied to both default and regenerate function.
- **RLS enabled on every public table** — no missing-RLS findings.
- **Server auth flow** uses token-validating `auth.getUser()` instead of cookie-only `getSession()`.
- **Auth callback `next` parameter** open-redirect protection is correct (`startsWith('/') && !startsWith('//')`).
- **Brand consistency** — zero "ParentLogs" references in `src/`.
- **Pricing consistency** — every $4.99/$39.99/$99.99 surface aligned.
- **Free push notification window** (30 days from signup) is server-enforced.
- **Free briefing window** (4 weeks) is enforced everywhere — but the math is wrong (CORE C3).
- **Account deletion family-ownership check** refuses to delete owner of multi-member family.
- **`react-markdown` usage** has no `rehype-raw` so HTML is escaped.
- **`/calendar` redirect** to `/tasks?view=calendar` works correctly.
- **`MedicalDisclaimer`** is rendered on every relevant page — broad compliance coverage.
- **`reduced-motion` handling** is implemented consistently across every animation wrapper plus a global CSS rule (rare and excellent).
- **`next/font` usage** is correct.
- **CSP headers, HSTS, X-Frame, Referrer-Policy, Permissions-Policy** all present in `next.config.ts` (with `unsafe-inline` caveat in SEC H7).
- **Service worker** registration is gated to production only.
- **`(main)` layout** fetches auth server-side before any client code — no flash of unauthenticated state.

---

## Suggested PR sequence

To minimize merge conflicts and group related fixes:

1. **PR1 — "Subscription gating + migration drift" (highest impact, biggest blast radius)**
   - Commit missing `join_family` FOR UPDATE migration
   - Commit missing `is_premium_user` expiry check
   - Commit missing `sync_subscription_tier` trigger
   - Drop user-facing UPDATE policy on `subscriptions`
   - Make `protect_subscription_fields` RAISE instead of silently rewrite
   - Add post-grace-period downgrade cron
   - Convert `leaveFamily` to SECURITY DEFINER RPC that resets tier

2. **PR2 — "Server-side premium enforcement"**
   - Move briefing access behind SECURITY DEFINER RPC; drop public-read on `briefing_templates`
   - Strip `subscriptionTier` from client-supplied `ServiceContext`; always re-resolve from DB
   - Add tier filter to `getAllTasksForTimeline` (or scope columns)
   - Remove `PaywallOverlay` cosmetic path for premium dad-challenge content; gate at the service layer

3. **PR3 — "Multi-platform subscription model"**
   - Add `verify_jwt = false` for `handle-revenucat-webhook` in `config.toml`
   - Pick: split `subscriptions` row per `(user_id, platform)` OR filter every write by platform
   - Lifetime purchase auto-cancels existing monthly subscription
   - Delete the deprecated `supabase/functions/stripe-webhook/index.ts`

4. **PR4 — "Free window math"**
   - One util module for free task window, free briefing window, grace expiry
   - Fix briefing free window from `Math.abs > 4` to forward-only > 4
   - Replace `currentWeek + 5` task filter with the util
   - Apply the util identically on client and server

5. **PR5 — "Auth hardening"**
   - Enable email confirmation in production dashboard
   - Bump `minimum_password_length` to 10
   - Enable hCaptcha or Turnstile on login + signup
   - Generic error mapping on login (close enumeration leak)
   - Add `Origin` header check to state-changing routes
   - Add idempotency to `partner-joined` notification

6. **PR6 — "Accessibility & perf sweep"**
   - Add skip-to-content link
   - Add `SheetTitle` to More menu
   - Lighten `--muted` to meet WCAG AA
   - Split `Providers` so marketing routes are server-only
   - Convert YouTube thumbnails + avatars to `next/image`
   - Raise bottom-nav label to ≥11px, bump `--nav-h` to 72px
   - Replace `min-h-screen` with `min-h-[100dvh]` site-wide

7. **PR7 — "Marketing funnel + content cleanup"**
   - Wire `?plan=` through signup → upgrade
   - Reconcile briefing count (60+ vs ~140)
   - Fix `/baby-checklists` metadata + sitemap to use real count
   - Style `OnboardingJoin` to match the rest of the flow
   - Resolve `/llms.txt` static-vs-route conflict
   - Console.log cleanup

---

## Reports

- [01-security.md](./01-security.md) — Security & auth (29 KB)
- [02-database.md](./02-database.md) — Database & RLS (25 KB)
- [03-payments.md](./03-payments.md) — Payments & subscriptions (20 KB)
- [04-core-features.md](./04-core-features.md) — Dashboard / Tasks / Briefing / Tracker / Journey (17 KB)
- [05-content-marketing.md](./05-content-marketing.md) — Marketing / Onboarding / Budget / Checklists / Settings (10 KB)
- [06-ux-perf-a11y.md](./06-ux-perf-a11y.md) — Mobile-web / a11y / perf (17 KB)

---

## Methodology notes

- Six specialized review agents ran in parallel, each with its own scope and a separate report file.
- The database review agent failed on API overload twice before succeeding on the third attempt.
- The security, payments, content, core-features, and UX agents all completed on the first try; their findings were captured and persisted manually.
- No code was modified during this review. All recommendations require explicit human review before applying.
- The reviewers explicitly did NOT call `mcp__claude_ai_Supabase__get_advisors` or hit the live database — all findings are from reading source files only. A follow-up live `get_advisors` run is recommended after PR1 lands.
