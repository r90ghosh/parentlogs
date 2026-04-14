# Code Review: Marketing, Onboarding, Budget, Checklists, Notifications, Settings, Help

Scope: `/Users/ashirbadghosh/Projects/parentlogs/apps/web` web app only. Mobile skipped.

## Critical

None. No "ParentLogs" brand violations, no broken pricing on user-visible pages, no dead routes that 404 silently.

## High

**1. Pricing CTA query params silently dropped — broken funnel**
`src/components/marketing/Pricing.tsx:42,59,77` link to `/signup?plan=monthly|yearly|lifetime`. `src/app/(auth)/signup/page.tsx` never reads `searchParams.get('plan')`, never persists it, never threads it through to `/upgrade` after onboarding. A user clicking "Get Lifetime Access" lands on `/dashboard` and is never offered checkout. Fix: read `plan` in signup, store to localStorage/cookie, redirect to `/upgrade?plan=lifetime` after `OnboardingReady` (or skip to Stripe checkout directly).

**2. Briefing count contradicts itself across marketing pages**
- `src/components/marketing/Hero.tsx:315` — "60+ Weekly Briefings"
- `src/components/marketing/Features.tsx:23` — "60+ detailed briefings covering pregnancy through 24 months"
- `src/components/marketing/Pricing.tsx:35,52` — "All ~140 weekly briefings"
- `src/app/llms.txt/route.ts` — does not state a count
Either the content was enriched to 140 and Hero/Features are stale, or 140 is aspirational. Pick one number and propagate.

**3. Marketing checklists page metadata stale: hardcoded "15"**
`src/app/(marketing)/baby-checklists/page.tsx:15-23` — `metadata.title = '... 15 Essential Lists'` and `description = '...15 curated baby preparation checklists...'`. Page body renders `{checklists.length}` dynamically; the actual count is 31 (CL-01..CL-31, see `src/lib/checklist-constants.ts:34-65`). SERPs and social shares show "15 Essential Lists" while users land on a 31-item page. Fix: drop "15" from metadata or generate it from the same query.

**4. Sitemap only emits 15 of 31 checklists**
`src/app/sitemap.ts:68` — `Array.from({ length: 15 })` hardcodes 15 checklist URLs. Sixteen real `/baby-checklists/CL-16` through `CL-31` pages exist and are crawlable but not in the sitemap. Fix: query checklist_templates or use `Object.keys(CHECKLIST_ICONS)`.

**5. `OnboardingJoin` is visually orphaned**
`src/app/(auth)/onboarding/join/page.tsx` uses raw shadcn `Card` and `bg-primary-500/20` (line 119) — no `Card3DTilt`, no copper/gold accent bar, no step indicator (1 of 3 / 2 of 3 / All done!) like every other onboarding step. After joining it pushes to `/onboarding/complete` (line 96) which redirects to `/onboarding/ready`. Stylistic break and an extra hop.

## Medium

**6. `/llms.txt` route handler is dead code**
Both `public/llms.txt` (static) and `src/app/llms.txt/route.ts` (dynamic) exist. Static file precedence wins. The dynamic route is shadowed and never serves traffic. Worse, the two are out of sync — diverging copy. Pick one.

**7. Root layout `og-default.png` shadows the dynamic OG handler**
`src/app/layout.tsx:56-64` explicitly sets `openGraph.images: ['/og-default.png']`. `src/app/opengraph-image.tsx` was added in commit 812f208 but is overridden everywhere by the explicit `images` array. Either remove the explicit images so the file-based handler runs, or delete `opengraph-image.tsx` to make intent clear.

**8. JSON-LD `sameAs` lists URLs that probably don't exist**
`src/components/marketing/JsonLd.tsx:21-23` — `reddit.com/r/thedadcenter`, `pinterest.com/thedadcenter/`, `threads.com/@thedadcenter`. Verify each resolves; Google penalises stale `sameAs`. Twitter/Instagram/LinkedIn (lines 18-20) match the footer.

**9. "Join thousands of dads" — unverifiable claim**
`src/components/marketing/FinalCTA.tsx:32`. Pre-launch product. FTC takes a dim view of fabricated user counts. Soften to "Join the dads who…" or remove the number.

**10. Hero stats are vague + soft**
`src/components/marketing/Hero.tsx:312-316` — "200+ Pre-loaded Tasks", "60+ Weekly Briefings", "Built for First-Time Dads" (not a stat), "Evidence-Based" (not a stat). Trust bar mixes facts and adjectives — feels like padding.

**11. Header navigation includes Privacy, omits Terms**
`src/components/marketing/Header.tsx:33` — Resources dropdown has Privacy but no Terms. Footer has both. Inconsistent.

**12. `Testimonials.tsx` is misnamed**
`src/components/marketing/Testimonials.tsx` — file/export named `Testimonials` but renders "Inside the App" highlights, no person quotes, no avatars. Fine for honesty (no fake testimonials), but the filename misleads. Rename to `InsideTheApp.tsx`.

**13. `/help` disallowed by robots.txt but linked in app**
`src/app/robots.ts:19` disallows `/help`. Help is auth-gated so crawlers can't reach it anyway, and disallowing makes the listing redundant. Not harmful, just noise.

**14. Settings has no Help link**
`src/app/(main)/settings/settings-client.tsx:21-52` — settings list goes Profile, Family, Notifications, Appearance, Subscription. No Help. The bottom-nav More drawer presumably has it, but Settings is a natural place to surface it too.

**15. `budget-client.tsx` is 968 lines**
`src/app/(main)/budget/budget-client.tsx` mixes the timeline filter, browse tab, my-budget tab, item card, drawer wiring, brand toggle, and tier filter. Single file is hard to navigate. Split into `BudgetBrowse.tsx`, `BudgetItemCard.tsx`, `BudgetTemplateRow.tsx`. Not a bug — maintainability.

## Low / Nits

**16. Production console.log noise**
- `src/lib/analytics.ts:104,140,168,175` — `[Analytics]` logs run unconditionally (no `isDev` guard).
- `src/components/shared/gtm.tsx:31` — `[GTM] Loaded` log.
- `src/app/api/stripe/webhook/route.ts:97,322` — "Unhandled event type" / "Payment succeeded for invoice" logs.
- `src/app/layout.tsx:101` — inline `[Recovery]` log inside the chunk-recovery script (acceptable, fires only on stale reload).
Wrap in `if (process.env.NODE_ENV !== 'production')`.

**17. `OnboardingFamily` step indicator says "Step 2 of 3"**
`src/app/(auth)/onboarding/family/page.tsx:185`. The role page says "Step 1 of 3", ready says "All done!". But the join branch (`OnboardingJoin`) has no step indicator at all. If a user goes role -> join, they see Step 1, then no step, then ready. Inconsistent journey.

**18. Settings version label hardcoded**
`src/app/(main)/settings/settings-client.tsx:141` — `<p>The Dad Center v1.0.0</p>`. Static. Pull from `package.json` or strip.

**19. `/onboarding/complete` and `/onboarding/invite` are redirect-only stubs**
`src/app/(auth)/onboarding/complete/page.tsx`, `.../invite/page.tsx` — both just `redirect('/onboarding/ready')`. Per pages.md these are intentionally kept "for backward compatibility". Worth a code comment specifying when they can be deleted (and `OnboardingJoin:96` should be updated to push directly to `/onboarding/ready`).

**20. `notification-service.ts:186` fails open**
If `profile.created_at` is missing, `isPushWindowActive` returns `true`. Defensive but means a row with stripped `created_at` retains push forever. Tighten to `return false`.

**21. `Notifications` page has no metadata description**
`src/app/(main)/notifications/page.tsx:4-6` only sets `title`. Auth-gated, low impact, but consistency.

**22. `OnboardingJoin` has stale eslint-disable**
`src/app/(auth)/onboarding/join/page.tsx:69` — `// eslint-disable-next-line react-hooks/exhaustive-deps`. Either inline the supabase reference into useCallback or actually fix the dep array.

## Verified Clean

- **No `ParentLogs` references anywhere** (grepped src/).
- **No `14-day` references anywhere** — task window copy is uniformly "30-day" in marketing, FAQ, terms, help, llms.txt, and `tasks-page-client.tsx`.
- **All pricing displays show $4.99 / $39.99 / $99.99**: `Pricing.tsx`, `upgrade-client.tsx`, `paywall-overlay.tsx`, `terms-content.tsx`, `JsonLd.tsx`, `FaqContent.tsx`, `llms.txt`, `subscription-client.tsx`, `lib/stripe/checkout.ts` all aligned.
- **No hardcoded `localhost` outside the legitimate dev guard** (`src/app/api/stripe/checkout/route.ts:69-71`).
- **No `TODO`/`FIXME`/`XXX` in src/.**
- **`/calendar` route correctly redirects to `/tasks?view=calendar`** (`src/app/(main)/calendar/page.tsx`).
- **Account deletion API exists and is wired up** (`profile-client.tsx:193` -> `/api/account/delete`).
- **NotFound 404 page is branded and links home.**
- **`global-error.tsx` reports to Sentry.**
- **`MedicalDisclaimer` component is rendered on dashboard, briefing, tasks, budget, tracker, journey, checklists, tips, and all marketing content pages** — broad compliance coverage.
- **Free push notification window is enforced server-side at 30 days from signup** (`notification-service.ts:189-191`), matching the brand rule.
- **Free briefing window of 4 weeks from signup is enforced** (`briefing-client.tsx:65`, `briefing-week-client.tsx:53`).

## Brand consistency check
**PASS.** Zero "ParentLogs" matches in src/. All user-facing copy says "The Dad Center".

## Pricing consistency check
**PASS.** Every visible price across landing, paywall, upgrade, terms, FAQ, JSON-LD, llms.txt, checkout, and subscription settings shows $4.99 / $39.99 ($3.33/mo) / $99.99.

## Free window consistency check
**PASS.** 30-day rolling task window and 4-weeks-from-signup briefing window are stated consistently in marketing copy, FAQ, terms, help, llms.txt, and enforced in `tasks-page-client.tsx`, `briefing-client.tsx`, `notification-service.ts`.

## Top 5 prioritized fixes

1. **Wire `?plan=` through signup -> upgrade.** Pricing CTAs currently dead-end at the dashboard (#1).
2. **Reconcile briefing count.** Hero/Features say 60+, Pricing says ~140. Pick one and update both (#2).
3. **Drop hardcoded "15" from `/baby-checklists` metadata + sitemap.** Real count is 31; SERPs and crawlers see stale numbers (#3, #4).
4. **Resolve `/llms.txt` static-vs-route conflict.** One file, one source of truth (#6).
5. **Style `OnboardingJoin` to match the rest of the flow.** Add the step indicator and Card3DTilt wrapper, push directly to `/onboarding/ready` (#5, #17).
