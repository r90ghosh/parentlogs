# Security Review — The Dad Center (parentlogs/apps/web)

**Date:** 2026-04-07
**Scope:** Web app at `apps/web` + Supabase edge functions + SQL migrations. Mobile (`apps/mobile`) excluded per request.

---

## Critical (must fix before merge)

### C1. Email confirmation is disabled — accounts can be created with anyone's email
**File:** `supabase/config.toml:209`
```toml
[auth.email]
enable_confirmations = false
```

**Risk:** A signup at `/signup` does **not** require the user to confirm they own the email address. The signup page UI claims "We've sent you a confirmation link" (`apps/web/src/app/(auth)/signup/page.tsx:113-117`), but the underlying Supabase project is configured to skip confirmation. An attacker can:
- Create an account using somebody else's email and immediately sign in (the password they chose works).
- Receive transactional emails (welcome, partner-invited, payment-failed) addressed to the victim from `noreply@thedadcenter.com`, which is reputational damage and a phishing vector.
- Pollute the user table, blocking the legitimate owner from registering later (Supabase rejects duplicate emails on signup).
- Combined with the whitelist mechanism (`20260322000001_email_whitelist.sql:24`), if any whitelisted email exists, an attacker can sign up *as that email* and inherit the lifetime tier.

**Fix:** Set `enable_confirmations = true` in `supabase/config.toml`, push the project, and verify the dashboard `Auth → Providers → Email → Confirm email` toggle is ON in the *production* project (config.toml does not auto-apply to remote projects — the dashboard setting is authoritative). The signup UI already shows the "check your email" success state, so no client change is needed.

---

### C2. Database migrations are out of sync with production — `join_family` race fix and `is_premium_user` fix exist only in production
**Files:** Commit `7c808c7` ("fix(security): subscription sync, family downgrade, join_family race condition") + `supabase/migrations/`

**Risk:** Commit 7c808c7 explicitly claims:
- `join_family() — FOR UPDATE lock prevents concurrent join race condition`
- `join_family() — set signup_week for invited partners`
- `is_premium_user() — check subscription_expires_at, add search_path, STABLE`
- `sync_subscription_tier trigger — auto-sync profiles→subscriptions on tier change`
- `one-time reconciliation of all mismatched subscription tiers`

But the commit only modifies five JS/TS files — **no SQL migration was added.** The current `supabase/migrations/20260330000001_partner_sync_security_fixes.sql:50-56` still contains the un-locked version:

```sql
SELECT COUNT(*) INTO v_member_count
FROM public.profiles
WHERE family_id = v_family_id;

IF v_member_count >= 2 THEN
  RAISE EXCEPTION 'This family already has the maximum number of members';
END IF;
```

This means:
1. Two attackers (or two browser tabs) calling `join_family()` against a 1-member family at the same time will both pass the count check and both be inserted, allowing **3+ members in a family** (violating the "max 2 / one subscription per family" billing model and the "one subscription covers both" guarantee).
2. Any future fresh deployment, local-dev reset, or `supabase db reset` will recreate the broken function (race condition + missing `expires_at` check + missing `signup_week`).
3. `is_premium_user()` (used in RLS gating) still does NOT check `subscription_expires_at` per the migration files at `20260317000001_security_fixes.sql:34-43` and `002_rls_policies.sql:38-46`. If a developer reseeds locally to debug, expired subscribers will appear as premium.

**Exploit (race):**
```
# Two simultaneous requests as different authenticated users with the same valid invite code
curl -X POST $URL/rest/v1/rpc/join_family -H "..." -d '{"p_invite_code":"ABC..."}' &
curl -X POST $URL/rest/v1/rpc/join_family -H "..." -d '{"p_invite_code":"ABC..."}' &
```
Both succeed → 3 family members on one paid seat.

**Fix:**
1. Create a new migration `20260405000001_partner_sync_security_followup.sql` that:
   - Replaces `join_family` with the FOR UPDATE-locked version (lock the family row before counting members):
     ```sql
     PERFORM 1 FROM public.families WHERE id = v_family_id FOR UPDATE;
     SELECT COUNT(*) INTO v_member_count FROM public.profiles WHERE family_id = v_family_id;
     ```
   - Recreates `is_premium_user()` to gate on `subscription_expires_at` and add `SET search_path = ''` + `STABLE`.
   - Recreates the `sync_subscription_tier` trigger.
2. Run the migration via the Supabase CLI to verify it's idempotent against the production state, then commit.
3. Add a CI check that fails if production schema diverges from migrations (`supabase db diff --linked`).

---

### C3. `subscriptions` table allows authenticated users to upgrade their own tier via PostgREST
**Files:**
- `supabase/migrations/20260317000001_security_fixes.sql:428-430`
- `supabase/migrations/20260330000001_partner_sync_security_fixes.sql:114-134`

The RLS policy on `subscriptions`:
```sql
CREATE POLICY "Users can update own subscription" ON public.subscriptions
  FOR UPDATE USING (user_id = (SELECT auth.uid()));
```

…allows a user to update **any column** of their own subscription row, including `tier`, `status`, `current_period_end`, `cancel_at_period_end`. The `protect_subscription_fields` trigger added in 20260330000001 is attached **only to `profiles`** (`...:130-134`), not to `subscriptions`.

**Risk:**
- A user with the public anon key + their own JWT can call `PATCH /rest/v1/subscriptions?user_id=eq.<their-id>` with `{"tier":"lifetime","current_period_end":"2099-01-01"}`. The change persists. The next Stripe webhook event will overwrite it, but in the meantime any code path that reads `subscriptions.tier` (or surfaces it to UI / future analytics / future export feature) will treat them as lifetime.
- Today the **primary gating** uses `profiles.subscription_tier` which IS protected, so the practical impact on access control is limited. But this is fragile defense-in-depth — anyone adding a new feature that reads from `subscriptions` (export, analytics, billing reports, the `useSubscription` hook in `apps/web/src/hooks/use-subscription.ts:23-32` already does) will silently inherit the bypass.
- The `useSubscription` hook returns the entire row, which the settings UI displays — a user could fake their own "Premium since 2024" badge.

**Fix:** Either
1. **Drop the UPDATE policy entirely** (the table is webhook-only):
   ```sql
   DROP POLICY "Users can update own subscription" ON public.subscriptions;
   ```
   Webhooks use the service role and bypass RLS. Users have no legitimate reason to write to this table.
2. **Or attach the same `protect_subscription_fields` trigger to `subscriptions`**, freezing `tier`, `status`, `current_period_end`, `cancel_at_period_end`, `stripe_subscription_id`, `stripe_customer_id` against authenticated writes.

Option 1 is simpler and removes a whole class of future bugs.

---

### C4. `partner-joined` API has no rate limiting → email-bombing the family owner
**File:** `apps/web/src/app/api/partner-joined/route.ts:7-63`

The endpoint requires authentication and verifies the caller is in a family. It then fires a `partner_joined` email to the family owner. There is **no idempotency check**, no "already-emailed" flag, no rate limit, and no check that the partner *just* joined.

**Exploit:** An authenticated partner (or compromised account) can `POST /api/partner-joined` repeatedly:
```bash
for i in {1..1000}; do curl -X POST -H "Cookie: ..." $APP/api/partner-joined; done
```
This sends 1,000 "X just joined your family" emails to the family owner from `noreply@thedadcenter.com`. Beyond annoying the owner, this:
- Burns Resend quota and damages domain reputation (Resend will throttle/blacklist).
- Triggers spam complaints → SPF/DKIM trust degradation.
- Costs real money on Resend's per-email pricing.

The same risk applies to anyone who can forge a session.

**Fix:** Track partner-joined notifications on the family row or in a small `family_events` table:
```sql
ALTER TABLE families ADD COLUMN partner_joined_notified_at TIMESTAMPTZ;
```
In the route, only fire the email if `partner_joined_notified_at IS NULL`, then set it. Alternatively (cleaner): fire the email from a Postgres trigger on `profiles.family_id IS NOT NULL` transition, and remove the API route entirely. Even simpler short-term: add a hard cooldown (e.g., one email per family per 24h) using a SQL function with `INSERT ... ON CONFLICT DO NOTHING` against a unique index.

---

## High (fix before deploy)

### H1. `analytics` API trusts client-supplied `user_id` and is wide-open CORS
**File:** `apps/web/src/app/api/analytics/route.ts:11-15, 66-87`

```ts
const CORS_HEADERS = { 'Access-Control-Allow-Origin': '*', ... }
// ...
user_id: sanitizeString(body.user_id, 36) || null,
```

The endpoint is unauthenticated (no JWT check) and accepts a user_id string from the request body. The header comment acknowledges "user_id is self-reported and untrusted," but downstream consumers (analytics dashboards, retention reports, conversion funnels) treat the field as authoritative. An attacker can:
- Inject fake events for any user_id (denial-of-quality on analytics).
- Pollute conversion funnels to make any feature look successful or unsuccessful before a launch decision.
- With `Access-Control-Allow-Origin: *`, this works from any browser tab on any site.

**Fix:** Either
1. Require a JWT (read `Authorization: Bearer ...`, call `supabase.auth.getUser(token)`, override `user_id` server-side from the verified identity, accept null for anon traffic), OR
2. Add an HMAC signed cookie set on first page load, validated server-side. The latter is friendlier to anonymous marketing visitors.
Also tighten CORS — restrict to `https://thedadcenter.com` and `https://www.thedadcenter.com`. The mobile app shouldn't be hitting this endpoint anyway (it has its own analytics path); if it does, allow only the mobile app's origin or no origin at all.

---

### H2. `auth.minimum_password_length = 6`
**File:** `supabase/config.toml:175`

```toml
minimum_password_length = 6
```

The signup form's Zod schema requires 8 characters (`apps/web/src/app/(auth)/signup/page.tsx:24`), but the **Supabase backend** only requires 6. Anyone hitting the Supabase REST endpoint directly (e.g., the mobile app, the Supabase dashboard, or a script using the public anon key) can create a 6-character password, completely bypassing the client-side schema. NIST 800-63B recommends 8 minimum for a memorized secret; modern guidance is 10+.

Also `password_requirements = ""` — no character class requirement at all.

**Fix:**
```toml
minimum_password_length = 10
password_requirements = "lower_upper_letters_digits"
```
Apply via dashboard since config.toml does not push to remote automatically.

---

### H3. Auth flow has zero brute-force / credential-stuffing protection
**Files:** `supabase/config.toml:180-194`, `apps/web/src/app/(auth)/login/page.tsx`

```toml
[auth.rate_limit]
sign_in_sign_ups = 30   # per IP per 5 minutes
```

This is *per IP* — a botnet trivially defeats it. There's no captcha (`[auth.captcha]` is commented out at lines 197-200), no per-account lockout, no MFA (`[auth.mfa.totp] enroll_enabled = false` at line 286). On a paid SaaS with billing data and PII (pregnancy stage, baby names, family details), this is below industry standard.

**Fix:** Enable Supabase captcha (hCaptcha or Turnstile) at `[auth.captcha]` and wire the public site key into the login/signup pages. As a follow-up: enable TOTP MFA for users who request it (`[auth.mfa.totp] enroll_enabled = true`).

---

### H4. Stripe checkout — successful checkouts assigned to currently-authenticated user without verifying email match
**File:** `apps/web/src/app/api/stripe/checkout/route.ts:38-58, 92-109`

The customer is created with `email: user.email` and `metadata.supabase_user_id: user.id`. The webhook later reads `metadata.user_id` and grants premium. This is correct flow.

But there's a subtle issue: **the route does not protect against user A initiating a checkout while signed in as user B**. The `Authorization: Bearer <token>` header is verified (line 23), so the checkout *can* only be initiated by an authenticated user. However:
- If a user shares a checkout link with another user (Stripe checkout URLs are bearer-style — anyone with the URL can complete payment), the second user pays but the first user gets the premium. This is annoying but not a security flaw per se.
- More important: the `metadata.user_id` in `subscription_data.metadata` and `payment_intent_data.metadata` is set, but the **checkout session metadata** is also set. The webhook reads `session.metadata?.user_id` (line 111). All three metadata containers are populated, so this is correct.

**Real concern:** there's no idempotency on the checkout endpoint itself. A spam-clicker creates many Stripe customers. Each call to `customers.create` consumes Stripe API budget; pre-existing customers are reused. Lower-impact but worth a comment.

Also: `payment_method_types: ['card']` is hard-coded. This blocks Apple Pay, Google Pay, link, etc. that Stripe would otherwise auto-enable. Not security, but worth noting.

**Fix:** Lower-priority. Consider removing `payment_method_types` and letting Stripe choose. Add a per-user rate limit (e.g., 5 checkout sessions per minute). The actual security model is sound.

---

### H5. `triggerEmail` is fire-and-forget in serverless contexts → emails may silently never send
**Files:** `apps/web/src/lib/email/trigger-email.ts:13-43`, `apps/web/src/app/auth/callback/route.ts:86-89`, `apps/web/src/app/api/stripe/webhook/route.ts:162, 254, 317, 346`

```ts
triggerEmail('welcome', data.user!.id).catch((err) => console.error('Welcome email trigger failed:', err))
```

The `.catch(...)` is sync wiring — the actual `fetch()` may not run because Next.js / Netlify Functions / Vercel can terminate the function as soon as the route returns the response. Without `waitUntil()` or `after()`, the welcome email, subscription_confirmed email, payment_failed email, etc. may silently fail to send in production, even though the code-review-passed-OK on local dev.

**Security relevance:** Subscription_confirmed and payment_failed are *trust-critical* — a user who paid but never receives confirmation will charge back; a user whose card failed but isn't notified loses access without warning and may complain to Stripe.

**Fix:** Use Next.js's `unstable_after` (now `after()` in stable) or `waitUntil` from Vercel's `waitUntil` API:
```ts
import { after } from 'next/server'
// ...
after(() => triggerEmail('welcome', data.user!.id).catch(console.error))
```
Or `await triggerEmail(...)` if the latency is acceptable (the welcome email is the only one in a user-facing path; webhook events are server-to-server with no UX cost).

---

### H6. Login error reflection — Supabase error messages are surfaced verbatim, leaking enumeration
**File:** `apps/web/src/app/(auth)/login/page.tsx:51-58`

```ts
const { error } = await signIn(data.email, data.password)
if (error) {
  setError(error.message)
  ...
}
```

Supabase's `signInWithPassword` returns distinct messages: `"Invalid login credentials"` for wrong password vs. `"Email not confirmed"` for unconfirmed accounts (combined with C1, this leaks that the email is registered). The forgot-password flow also returns different responses depending on whether the email exists.

**Fix:** Map all auth errors to a single generic message client-side: `"Invalid email or password."` Log the original error to Sentry with the user-id (or hashed email) for ops debugging, but do not reflect to the user.

---

### H7. CSP allows `'unsafe-inline'` for scripts
**File:** `apps/web/next.config.ts:32`

```ts
"script-src 'self' 'unsafe-inline' https://js.stripe.com ..."
```

`'unsafe-inline'` defeats CSP's main purpose: preventing arbitrary inline `<script>` injection. The marketing pages render JSON-LD via `dangerouslySetInnerHTML` (legitimate), and the root layout (`apps/web/src/app/layout.tsx:91-118`) also has an inline script for chunk-recovery.

**Fix:** Use Next.js's nonce-based CSP (`headers()` is incompatible with per-request nonces directly — use `middleware.ts` to generate a nonce, set it on the response header, and read it from `headers()` in the layout via `next/headers`). This is a moderate refactor but eliminates `'unsafe-inline'`. Alternatively, pre-compute SHA-256 hashes of the inline scripts and add `'sha256-...'` to script-src. The chunk-recovery script is static so the hash is stable.

---

## Medium (fix soon)

### M1. `dangerouslySetInnerHTML({__html: JSON.stringify(...)})` for JSON-LD does not escape `</script>`
**Files:** `apps/web/src/components/marketing/JsonLd.tsx:107-119`, `apps/web/src/app/(marketing)/blog/[slug]/page.tsx:115, 125, 129`, `apps/web/src/app/(marketing)/content/articles/[slug]/page.tsx:113, 117`, `apps/web/src/app/(marketing)/faq/page.tsx:169`, `apps/web/src/app/(marketing)/tips/[slug]/page.tsx:199`, `apps/web/src/app/(marketing)/tips/page.tsx:136, 142`

`JSON.stringify` does not escape `<` or `/`. If a blog post title (loaded from Supabase, currently editor-controlled but user-input *in principle*) contains `</script><script>alert(1)</script>`, it will execute. Today the editor is you, but as soon as user feedback or a CMS connector lands, it's a live XSS.

**Fix:** Wrap the JSON output:
```ts
const safe = JSON.stringify(obj).replace(/</g, '\\u003c')
<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safe }} />
```

---

### M2. Family `invite_code` is rendered into every authenticated page's HTML
**Files:** `apps/web/src/lib/supabase/server-auth.ts:86`, `apps/web/src/components/user-provider.tsx:44-77`

`getServerAuth()` does `select('*')` from `families`, including `invite_code`. The full Family object is then handed to `UserProvider` and serialized into the HTML for every (main) layout page. If the page is ever cached on a CDN by mistake, or if any future XSS (M1, H7) lands, the invite code is one selector away.

**Risk:** Anyone with a stolen invite code can join the family (max 2 members, but if the legitimate partner hasn't joined yet, the attacker takes their seat). Combined with C2's race condition, the seat count can also be exceeded.

**Fix:** Remove `invite_code` from the default select in `getServerAuth`. Fetch it on-demand only on `/settings/family` where it's actually displayed. While you're there, narrow the `select('*')` calls to explicit column lists for all three tables.

---

### M3. Welcome email re-sent on every login within 60 seconds of account creation
**File:** `apps/web/src/app/auth/callback/route.ts:83-90`

```ts
if (profile?.created_at) {
  const profileAgeMs = Date.now() - new Date(profile.created_at).getTime()
  if (profileAgeMs < 60_000) {
    triggerEmail('welcome', data.user!.id).catch(...)
  }
}
```

A user who completes signup (account created), receives the welcome email, and signs in again within 60 seconds receives a **second** welcome email. Worse, if they sign in 5 times in 60 seconds (e.g., script, tab refresh after OAuth), they get 5 emails. There is no idempotency flag.

**Fix:** Add a `welcome_email_sent_at` column on `profiles` (or use `notification_delivery_log` which already exists). Check it before triggering.

---

### M4. `delete-account` route writes errors but continues — partial deletes silently leave orphaned data
**Files:** `apps/web/src/app/api/account/delete/route.ts:69-220`, `supabase/functions/delete-account/index.ts:202-400`

Every `console.error('Failed to delete X:', err)` does NOT abort the deletion. If the user_id has FK references to other tables (or if a future migration adds a new table that references `user_id`), the route will reach `supabase.auth.admin.deleteUser(user.id)` which will fail with FK constraint, and the auth user remains while half their data is gone. The user thinks they're deleted but their account still works, or worse, partially-deleted data leaks across re-creation.

**Fix:** Move the entire deletion into a single SECURITY DEFINER SQL function (`delete_user_cascade(p_user_id UUID)`) that runs in one transaction with proper FK ordering. The route just calls the function and then `auth.admin.deleteUser`. Errors abort the transaction.

---

### M5. `xlsx` ^0.18.5 has known CVEs (Prototype Pollution, ReDoS)
**File:** `apps/web/package.json:66`

`xlsx@0.18.5` is in `devDependencies` only, and not imported in `apps/web/src/`, so production exposure is zero. But CVE-2023-30533 (prototype pollution) and CVE-2024-22363 (ReDoS) are live. The package was deprecated on npm; the maintainer now distributes via CDN only.

**Fix:** Remove `xlsx` from `devDependencies` if unused. Otherwise, replace with `exceljs` or `read-excel-file`.

---

### M6. `SUPABASE_SERVICE_ROLE_KEY` available in route handler context; any new server route is one typo away from leaking it
**Files:** `apps/web/src/lib/supabase/admin.ts`, `apps/web/src/lib/email/trigger-email.ts:19`

**Fix:** Add `import 'server-only'` at the top of `admin.ts` and `trigger-email.ts`. Next.js will throw a build error if these are imported into a client component.

---

### M7. `lookup_family_by_invite` returns family name and stage to any authenticated user with a valid code
**File:** `supabase/migrations/20260330000001_partner_sync_security_fixes.sql:10-17`

Anyone with a valid code learns the family's display name (which often contains a real name). Code entropy is 48 bits so brute force is infeasible, but invite codes leak through screenshots, browser history, and chat logs more often than you'd think.

**Fix:** Return only `family_id` (UUID) and `stage`. Drop `family_name` from the return type.

---

### M8. No CSRF protection on state-changing routes
**Files:** All `apps/web/src/app/api/*/route.ts`

The routes rely on cookie-based session auth (Supabase SSR cookies have `SameSite=Lax` by default, which protects against most CSRF). However:
- Lax does *not* protect against same-site CSRF (e.g., a malicious blog post on `thedadcenter.com/blog/foo` if a future CMS allows user content).
- The stripe checkout/portal routes use `Authorization: Bearer` instead of cookies, which is CSRF-immune.

**Fix:** Defense-in-depth: add an `Origin` header check on all state-changing routes.

---

### M9. `analytics` API silently catches all errors — no observable failure mode
**File:** `apps/web/src/app/api/analytics/route.ts:89-100`

Every failure returns 200 OK. Sentry sees the error, but the client (and any monitoring on client-side error rates) sees success. If the analytics insert is failing for everyone (e.g., RLS misconfigured), the dashboard looks healthy.

**Fix:** Add a Sentry alert on `tags: { component: 'analytics-api' }` warning rate.

---

## Low / Nits

### L1. `console.log` in middleware always ships to production
**File:** `apps/web/src/lib/supabase/middleware.ts:7, 49-50, 57, 67, 78`

The strings are evaluated unconditionally. Skip.

### L2. `Sentry.setUser({ id, email })` ships email to Sentry
**File:** `apps/web/src/lib/auth/auth-context.tsx:53`

Many privacy regimes (CCPA, GDPR) treat email as PII. Replace with `id` only if you want the strictest posture.

### L3. Subscription tampering via UPDATE policy (covered by C3)

### L4. `partner-activity` and `send-notifications` edge functions use string-equality auth check
**Files:** `supabase/functions/partner-activity/index.ts:11`, `supabase/functions/send-notifications/index.ts:95`

```ts
if (!supabaseServiceKey || authHeader !== `Bearer ${supabaseServiceKey}`) { ... }
```

String equality leaks timing information in theory. With 200+ char keys and TLS jitter, it's practically not exploitable. The newer `send-email` function uses JWT decode which is the right pattern. Migrate the others to the same.

### L5. `supabase/functions/stripe-webhook/index.ts` is marked DEPRECATED but still deployable
**File:** `supabase/functions/stripe-webhook/index.ts:1-7`

It also has known bugs (no idempotency, no grace period, uses outdated Stripe API). If anyone re-points the Stripe Dashboard webhook here, billing breaks silently.

**Fix:** Delete the file. Comments don't enforce anything.

### L6. `delete-account` edge function CORS misconfig
**File:** `supabase/functions/delete-account/index.ts:14-25`

Returns first allowed origin when origin doesn't match — code smell. Cleaner: return no `Access-Control-Allow-Origin` header at all when the origin is disallowed.

### L7. `enable_confirmations = false` lets attackers flood signup with fake addresses (operational, see C1)

---

## Verified safe (areas reviewed and OK)

- **Stripe webhook signature verification** (`apps/web/src/app/api/stripe/webhook/route.ts:13-34`) — uses `stripe.webhooks.constructEvent`, returns 400 on mismatch. Idempotency via UNIQUE constraint on `event_id`. Correct.
- **RevenueCat webhook auth** (`supabase/functions/handle-revenucat-webhook/index.ts:43-47`) — bearer token compared. Idempotency check via `revenucat_webhook_events`. Correct.
- **`send-email` JWT role check** (`supabase/functions/send-email/index.ts:11-25`) — given Supabase's gateway verifies JWTs by default, decoding the payload to read role is safe. The recent commit 391fc6d switched correctly.
- **Auth callback `next` parameter** — open redirect closed via `startsWith('/') && !startsWith('//')`. Correct.
- **Login `redirect` parameter** — same protection. Correct.
- **Server auth flow** — uses `supabase.auth.getUser()` (token-validating) instead of `getSession()` (cookie-only). Correct per Supabase docs.
- **Middleware route protection** — protected paths list looks complete. Public path early-return correctly skips auth lookup.
- **`react-markdown` usage** — no `rehype-raw`, so HTML is escaped. Safe.
- **Supabase RLS on `analytics_events` and `page_engagements`** — service-role only, clients can't write directly. Correct.
- **`whitelist_email` SQL function** — explicitly REVOKE'd from anon and authenticated. Correct.
- **`regenerate_invite_code` SQL function** — verifies caller is family owner. Correct.
- **`generate_family_tasks` SQL function** — verifies caller is family member. Correct.
- **`.env` gitignore status** — only `.env.example` files in git, no leaked secrets.
- **CSRF posture on cookie-auth routes** — SameSite=Lax + non-form methods provide adequate protection.
- **Security headers in `next.config.ts`** — HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy all present. CSP defined (with the H7 caveat).
- **Account deletion family-ownership check** — refuses to delete owner of multi-member family. Correct in both web route and edge function.
- **`onboarding/join` family lookup** — uses RPC (not direct table read), validates length, debounces. Correct.

---

## Overall security posture

The codebase has **clearly been reviewed and hardened iteratively** — webhook signature verification, idempotency tables, family-ownership checks on deletion, RLS on every table, search_path on SECURITY DEFINER functions, the recent JWT-role fix on send-email, the protect_subscription_fields trigger, and an entropy upgrade on invite codes are all signs of an attentive maintainer. However, three significant gaps undercut the rest: (1) **email confirmation is disabled** at the Supabase project level so the entire identity model relies on client-side honesty, (2) **the most recent security commit (7c808c7) shipped DB changes that were never committed as migration files**, leaving the production schema and the source-of-truth migrations out of sync — and any local reset will reintroduce a `join_family` race condition and an expired-subscription bypass — and (3) **the `subscriptions` table is writable by authenticated users**, with the protection trigger only attached to `profiles`. None of these would block a launch on their own, but together they're a credible path to account takeover, billing manipulation, and family-seat abuse before the next code review.

---

## Prioritized action list (top 5)

1. **Enable email confirmation** in the production Supabase Auth settings (C1) — blocks account takeover via signup. 5-minute change in the dashboard.
2. **Commit the missing DB migrations** for `join_family` (FOR UPDATE lock + signup_week), `is_premium_user` (expires_at check), and `sync_subscription_tier` trigger as a new file in `supabase/migrations/` (C2). Diff against production with `supabase db diff --linked` to capture exactly what's drifted and add CI to prevent recurrence.
3. **Drop the user-facing UPDATE policy on `subscriptions`** (C3) — single SQL line, removes a whole class of tier-tampering bugs.
4. **Add idempotency to `partner-joined`** notification (C4) — cheapest fix is a `partner_joined_notified_at` column on `families`.
5. **Authenticate the analytics endpoint** (H1) — switch user_id to the verified JWT identity, tighten CORS to your own origins.

Then, once the above is done, raise the auth bar: bump `minimum_password_length` to 10 and enable a captcha (H2 + H3) to bring the auth flow up to industry standard.
