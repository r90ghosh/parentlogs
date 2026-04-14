# Payments & Subscription Code Review — The Dad Center

Stack: Next.js 16 (web) + Supabase Edge Functions + Stripe + RevenueCat (mobile reconciliation only).

---

## Critical (must fix before merge)

### C1. Server-side paywall is bypassable for tasks via the service context
**File:** `packages/services/src/task-service.ts:16-34`, `apps/web/src/hooks/use-subscription.ts:13-21`

`resolveContext()` in task-service trusts the caller-supplied `subscriptionTier` whenever both `userId` and `familyId` are present:
```ts
if (ctx?.userId && ctx?.familyId) {
  return ctx as ServiceContext  // ← skips DB read, trusts client-supplied tier
}
```
The React hook in `use-subscription.ts:13-21` (`useServiceContext`) builds that context from `useUser()` (a client React provider). A user can edit local state or call the underlying Supabase query directly (browser console) and pass `subscriptionTier: 'premium'`, bypassing the 30-day rolling window in `getTasks()` (line 78-84).

**Impact:** Free user opens devtools, runs the React Query function with a mutated context, and reads all tasks across the entire 24-month timeline. Same pattern repeats in budget-service, checklist-service.

**Fix:** Never accept `subscriptionTier` from the caller. Always resolve it server-side from `profiles.subscription_tier` (which is protected by the `protect_subscription_fields` trigger). Either drop `subscriptionTier` from `ServiceContext` entirely, or have services re-fetch it. Better: enforce gating at the database layer with RLS predicates that join to `profiles.subscription_tier`.

### C2. `getAllTasksForTimeline` explicitly ignores premium gating
**File:** `packages/services/src/task-service.ts:278-296`

The comment literally says "ignores premium gating." A free user can call this hook directly via the singleton service and receive every task in the family, bypassing the 30-day filter on `getTasks`.

**Fix:** Either return only minimal columns required for timeline rendering (id, due_date, status) AND scope to the same window OR add a database-side check.

### C3. Briefing service has zero server-side premium enforcement
**File:** `packages/services/src/briefing-service.ts` (entire file), `apps/web/src/app/(main)/briefing/[weekId]/briefing-week-client.tsx:33-94`

None of `getCurrentBriefing`, `getBriefingByWeek`, `getBriefingTeaser`, or `getAllBriefings` checks subscription tier or `signup_week`. The 4-week window is enforced ONLY in client components (`Math.abs(localWeek - freeWindowAnchor) > 4`), and the data fetch happens BEFORE the paywall check renders. The paywall is rendered visually on top of data already loaded into browser memory.

Plus, RLS in `002_rls_policies.sql:97` allows anyone authenticated to `SELECT` from `briefing_templates`. So `useBriefingByWeek('pregnancy', 30)` returns the full week 30 briefing for a free user.

**Impact:** A free user can read every premium briefing by either (a) hitting the URL `/briefing/30` (data is in network panel even though paywall renders), or (b) calling the React Query key directly. This is the entire premium briefing library leaked.

**Fix:** Move the gating to a SQL function (`get_briefing_for_user(week)`) that checks the user's `subscription_tier` AND `signup_week`, OR add a `briefing_templates` RLS policy that joins on the caller's profile. Strip `briefing_templates` from public-read RLS and route all reads through a SECURITY DEFINER RPC.

### C4. Subscriptions table allows authenticated users to UPDATE their own row, including `tier`
**File:** `supabase/migrations/002_rls_policies.sql:85-86`

```sql
CREATE POLICY "Users can update own subscription" ON subscriptions FOR UPDATE USING (user_id = auth.uid());
```
There's no equivalent of `protect_subscription_fields` trigger on the `subscriptions` table. A user can run `UPDATE subscriptions SET tier='lifetime', status='active' WHERE user_id=auth.uid()` from the browser via PostgREST.

**Impact:** While `useIsPremium` reads from `profiles.subscription_tier` (which IS protected), some UI surfaces (`useSubscription`-derived state, `subscriptionService.getSubscription`) read from `subscriptions`.

**Fix:** Drop the `Users can update own subscription` policy entirely. Subscriptions are write-only by `service_role` (webhook handlers).

### C5. Leaving a premium family does not downgrade the leaver
**File:** `packages/services/src/family-service.ts:247-256`

`leaveFamily()` only sets `family_id = null`. The leaver's `profiles.subscription_tier` was set to `'premium'` when they joined. Since the leaver's tier is not reset, and webhooks for the original subscriber's plan changes only fire `UPDATE profiles ... WHERE family_id = subscriber.family_id`, the leaver retains `subscription_tier='premium'` indefinitely.

**Impact:** Partner joins a premium family → leaves the family → keeps premium for the rest of time. The `protect_subscription_fields` trigger blocks them from un-setting it themselves but it equally blocks any client-side fix.

**Fix:** `leaveFamily` should be a SECURITY DEFINER RPC that:
1. Sets `family_id = null`
2. Resets `subscription_tier = 'free'` and `subscription_expires_at = NULL`

### C6. `join_family` RPC has no `FOR UPDATE` lock — race condition still present
**File:** `supabase/migrations/20260330000001_partner_sync_security_fixes.sql:20-88`

The commit message in `7c808c7` claims "join_family() — FOR UPDATE lock prevents concurrent join race condition" but that change is NOT in any migration file in the repo. The current `join_family()` does:
```sql
SELECT COUNT(*) INTO v_member_count FROM public.profiles WHERE family_id = v_family_id;
IF v_member_count >= 2 THEN RAISE EXCEPTION ...
```
With no row lock. Two simultaneous joins can both read `count = 1`, both pass the check, and both join → 3 members.

**Fix:** Add `FOR UPDATE` to the COUNT query. Ensure the migration is committed to the repo. (See also security review C2.)

### C7. Stripe webhook function is the canonical handler but supabase deprecated copy is still deployable
**File:** `supabase/functions/stripe-webhook/index.ts` (DEPRECATED but present)

The deprecated Supabase Edge Function is still in the repo and deployable. It has BUGS the Next.js handler doesn't:
- No idempotency / event dedupe
- No grace period (line 191-194: `tier: 'free'` immediately on cancel)
- Reads `subscription.current_period_end` directly (line 140) instead of from `subscription.items.data[0]` — this is the OLD Stripe API shape; on the current API (`2026-02-25.clover`) `current_period_end` is undefined on the Subscription object. Will throw.
- Outdated Stripe API version `2024-12-18.acacia`

If anyone accidentally points the Stripe Dashboard webhook URL at this function, customers will be incorrectly downgraded immediately on cancellation.

**Fix:** Delete `supabase/functions/stripe-webhook/index.ts` from the repo. A `// DEPRECATED` comment is not protection.

### C8. RevenueCat webhook will be rejected by Supabase gateway
**File:** `supabase/config.toml` (no `[functions.handle-revenucat-webhook]` block)

Supabase Edge Functions default to `verify_jwt = true`. The gateway rejects requests without a valid Supabase JWT BEFORE the function code runs. RevenueCat sends a custom Bearer token, not a Supabase JWT. The function-internal check at `handle-revenucat-webhook/index.ts:44-47` will never be reached unless `verify_jwt = false` is explicitly set.

There is no `[functions.handle-revenucat-webhook]` block in `config.toml`.

**Impact:** If the production deployment matches this config (or the dev was deployed without setting verify_jwt explicitly via dashboard), every RevenueCat webhook returns 401 at the gateway. Mobile subscriptions never sync.

**Fix:** Add to `config.toml`:
```toml
[functions.handle-revenucat-webhook]
verify_jwt = false
```
Verify in the Supabase dashboard. Same for delete-account if invoked from mobile with a custom token.

---

## High (should fix)

### H1. Past-due subscriptions retain premium access indefinitely with no time bound
**File:** `apps/web/src/app/api/stripe/webhook/route.ts:325-347` (`handlePaymentFailed`)

When `invoice.payment_failed` fires, the handler sets `subscriptions.status = 'past_due'` but does NOT touch `profiles.subscription_tier` or `subscription_expires_at`. The `useIsPremium` hook only checks `tier`, not `status`. The user keeps premium until Stripe Smart Retries exhaust and `customer.subscription.deleted` fires (~3 weeks).

**Fix:** When marking past_due, also set `subscription_expires_at = now() + 7 days` so that the existing grace-period logic kicks in.

### H2. Grace period math is inconsistent and can grant >7 days extra
**File:** `apps/web/src/app/api/stripe/webhook/route.ts:269-274` and `packages/shared/src/utils/subscription-utils.ts:7-15`

On cancel, `expires_at = max(period_end, now() + 7 days)`. Then `isInGracePeriod()` adds another 7 days AFTER `expires_at`. So:
- User cancels with 30 days remaining → 30 days + 7 days grace = 37 days total. Correct.
- User cancels with 1 day remaining → `expires_at = now + 7 days` → 7 days + 7 days grace = 14 days total. **Double grace.**
- User cancels with 0 days remaining → same as above. 14 days.

**Fix:** Pick one. Either (a) `expires_at = period_end` and let `isInGracePeriod()` handle the 7-day grace, or (b) `expires_at = period_end + 7 days` (always) and have `isInGracePeriod()` return false. I'd recommend (b).

### H3. `is_premium_user()` SQL function doesn't check `subscription_expires_at`
**File:** `supabase/migrations/20260317000001_security_fixes.sql:34-43`

Function returns true for any user with `subscription_tier IN ('premium', 'lifetime')`, ignoring expiry. Commit `7c808c7` claims this was fixed but the change is not in any migration file.

**Fix:** Update the function to also check `(subscription_expires_at IS NULL OR subscription_expires_at > now())`. Commit the migration.

### H4. `sync_subscription_tier` trigger claimed in commit message is missing
**File:** `supabase/migrations/` (file doesn't exist)

Commit `7c808c7` claims a `sync_subscription_tier trigger`. No such trigger exists in any migration in the repo.

**Fix:** Either add the migration to the repo, or remove the claim. Likely applied via Supabase MCP `apply_migration` and never written to the local migrations directory — repo migrations and DB state are out of sync.

### H5. `delete-account` Edge Function `platform !== 'mobile'` check uses wrong literal
**File:** `supabase/functions/delete-account/index.ts:261`

Schema says `platform IN ('web', 'ios', 'android')`. The check `subRecord?.platform !== 'mobile'` always evaluates true (no row has `platform='mobile'`). So the Stripe cancel attempt runs even for ios/android subscriptions.

**Fix:** `subRecord?.platform === 'web'`.

### H6. Lifetime purchase after monthly subscription does not cancel the existing subscription
**File:** `apps/web/src/app/api/stripe/webhook/route.ts:110-164` (`handleCheckoutComplete`)

If a user with an active monthly Stripe subscription buys lifetime, the lifetime branch updates `subscriptions.tier='lifetime'` but does NOT cancel the existing Stripe subscription. They continue to be billed monthly.

**Impact:** Double charge — user pays $99.99 lifetime AND keeps getting $4.99/mo charged.

**Fix:** In `handleCheckoutComplete` for lifetime, check for an existing `stripe_subscription_id` and call `stripe.subscriptions.cancel()` on it.

### H7. `handleCheckoutComplete` doesn't propagate error visibility
**File:** `apps/web/src/app/api/stripe/webhook/route.ts:102-108`

Catch block returns 200 with `{received: true, error: 'Processing failed'}` to prevent Stripe retries. This is good for non-retryable errors but masks transient DB errors that SHOULD trigger a Stripe retry. If the lifetime upgrade DB write fails, the customer paid Stripe but their subscription record is wrong, and Stripe will not retry.

**Fix:** Distinguish retryable vs non-retryable errors.

---

## Medium

### M1. Marketing pricing component lists "Full budget planner" as free, but gating says it's premium
**File:** `apps/web/src/components/marketing/Pricing.tsx:21` vs `packages/services/src/subscription-service.ts:107`

Marketing says free includes "Full budget planner" but `getFeatureList()` says "Complete budget planner" is premium-only.

**Impact:** Refund risk. User signs up for free expecting full budget access, hits paywall.

**Fix:** Pick one. The code currently treats budget as premium so the marketing copy needs updating.

### M2. Marketing CTAs link to `/signup?plan=monthly` but signup ignores `plan` param
**File:** `apps/web/src/components/marketing/Pricing.tsx:42,59,77` vs `apps/web/src/app/(auth)/signup/page.tsx`

(Cross-references content review #1.) Conversion drop. Read `plan` in signup, store in localStorage, redirect to `/upgrade?plan=...` after onboarding.

### M3. Webhook handler doesn't subscribe to `charge.refunded`, `charge.dispute.created`
**File:** `apps/web/src/app/api/stripe/webhook/route.ts:63-99`

If a customer is refunded, you should downgrade them. If a dispute is created, flag the account.

**Fix:** Add at least `charge.refunded` → downgrade.

### M4. Webhook handler `handleSubscriptionUpdate` and `handleSubscriptionCanceled` have inconsistent shapes
**File:** `apps/web/src/app/api/stripe/webhook/route.ts:294-314`

Refactor for clarity — one excludes self with `.neq('id', userId)` and updates separately, the other doesn't.

### M5. Webhook handler doesn't verify the `customer_id` belongs to the user before updating subscription
**File:** `apps/web/src/app/api/stripe/webhook/route.ts:166-179`

If two users somehow share a customer_id, updates go to the wrong user.

**Fix:** Cross-check `subscription.metadata.user_id` matches the looked-up `subRecord.user_id` before applying.

### M6. `getAllBriefings` returns the entire briefing library to anyone authenticated
**File:** `packages/services/src/briefing-service.ts:126-135`

Same issue as C3 but specifically for `getAllBriefings` which is used by `/briefing/archive`.

### M7. Webhook idempotency record has no TTL cleanup wired up
**File:** `supabase/migrations/20260324000006_stripe_webhook_events.sql`, `supabase/migrations/20260327000001_revenucat_webhook_events.sql`

Both tables have a comment saying "events older than 30 days" should be cleaned up via cron job, but no cron job exists. Tables grow forever.

**Fix:** Add a `pg_cron` job: `DELETE FROM stripe_webhook_events WHERE created_at < now() - interval '30 days'`.

---

## Low / Nits

### L1. `lib/stripe/server.ts` exports both `getStripe()` and a deprecated `stripe` Proxy
**File:** `apps/web/src/lib/stripe/server.ts:18-23`

Migrate callers and delete the proxy.

### L2. `handleCheckoutComplete` for lifetime doesn't handle the `customer_id` being missing
**File:** `apps/web/src/app/api/stripe/webhook/route.ts:120-132`

`session.customer as string` — `customer` can be `null`. Add a null check.

### L3. `useCheckout` uses `window.location.href` redirect on success
**File:** `apps/web/src/hooks/use-subscription.ts:75-79, 88-92`

Hard navigation outside Next.js router. Acceptable for going to Stripe but consider `router.push` for relative URLs.

### L4. "Welcome to Premium" message shows even for resumes/reactivations
**File:** `apps/web/src/app/(main)/settings/subscription/subscription-client.tsx:89-96`

Driven by `?success=true` in URL, not by checking whether this was a new subscription.

### L5. Webhook handler logs `console.log('Payment succeeded for invoice:', invoice.id)` but does nothing on success
Consider tracking MRR / analytics here.

### L6. `lookup_family_by_invite` has no rate limiting
12-char hex code (48 bits) so brute force is infeasible, but worth adding rate limiting at the API layer.

---

## Verified correct

- **VC1.** Stripe webhook signature verification (`webhook/route.ts:28-34`) — `stripe.webhooks.constructEvent`, returns 400 on mismatch.
- **VC2.** Idempotency dedupe via `stripe_webhook_events` UNIQUE constraint and `upsert(..., ignoreDuplicates: true)` — atomic.
- **VC3.** Stripe price IDs are env vars, not hardcoded (`stripe/server.ts:26-39`).
- **VC4.** `protect_subscription_fields` trigger on `profiles` blocks authenticated users from modifying tier/expiry directly.
- **VC5.** Pricing constants are consistent across all UI surfaces ($4.99/$39.99/$99.99).
- **VC6.** Localhost APP_URL fix correctly allows localhost in dev but blocks in prod.
- **VC7.** Webhook handler propagates Stripe subscription updates to all family members including downgrades.
- **VC8.** Grace period UI in `subscription-client.tsx` correctly shows the renewal banner.
- **VC9.** Customer creation in checkout correctly upserts with `onConflict: user_id`.
- **VC10.** RevenueCat webhook function-internal Bearer auth check (subject to gateway-level config — see C8).
- **VC11.** Onboarding → checkout flow: customer is created with the correct `email` and `metadata.supabase_user_id`.
- **VC12.** Account deletion correctly cancels Stripe subscription before deleting the local row (subject to H5).

---

## Can a user get free access they shouldn't have? **YES — multiple ways**

1. **C1**: Free user passes `subscriptionTier: 'premium'` in the React Query context, bypasses 30-day task filter. Trivial via devtools.
2. **C2**: Free user calls `getAllTasksForTimeline()` directly — comment literally says it ignores premium gating.
3. **C3**: Free user reads any premium briefing template directly (RLS allows it, briefing service has no checks).
4. **C4**: User UPDATEs their own `subscriptions.tier='lifetime'` via PostgREST. Profile is protected but subscriptions table isn't.
5. **C5**: Partner joins a premium family, leaves the family, keeps `subscription_tier='premium'` forever.
6. **H1**: User with failed payment keeps premium until Stripe deletes the subscription weeks later (or indefinitely if events are dropped).
7. **H3**: Any code path using `is_premium_user()` SQL function ignores expiry.
8. **C6**: Race-conditioned 3-person family sharing one subscription.

## Can a paying user lose access they should have? **YES**

1. **C8**: RevenueCat webhooks rejected at gateway (verify_jwt default). Mobile users never get premium.
2. **C7**: If anyone reverts to the deprecated `supabase/functions/stripe-webhook`, every cancellation immediately drops users to free with NO grace period.
3. **H7**: Transient DB errors during webhook → returns 200 → Stripe doesn't retry → user paid but `subscriptions.tier` is wrong.
4. **H6**: User who buys lifetime while having an active monthly is double-charged AND if the upgrade write fails the lifetime is lost.

## Top 5 Prioritized Action List

1. **C8** — Add `[functions.handle-revenucat-webhook] verify_jwt = false` to `config.toml` AND verify the production deployment matches. Without this, mobile subscriptions are completely broken.
2. **C3 + M6** — Move briefing access to a SECURITY DEFINER RPC that checks tier + signup_week, and remove the public-read RLS on `briefing_templates`. One-migration fix that closes the entire briefing leak.
3. **C5** — Convert `leaveFamily` to a SECURITY DEFINER RPC that resets the leaver's tier. Same migration can also tighten C4 by dropping the `Users can update own subscription` policy.
4. **C1 + C2** — Strip `subscriptionTier` from the client-supplied `ServiceContext`. Always re-resolve from DB. Drop or properly gate `getAllTasksForTimeline`.
5. **C6 + H3 + H4** — Audit the gap between `7c808c7` commit message and actual migrations. Re-derive each claimed fix as a real migration file and commit. The most important is the `FOR UPDATE` lock on `join_family`.
