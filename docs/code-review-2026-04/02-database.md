# Database / Supabase Review — 2026-04-07

Scope: 34 migrations in `supabase/migrations/` + consumer services in `packages/services/src/` + edge functions under `supabase/functions/`. Mobile app excluded.

Overall: the schema has been aggressively hardened. Most early gaps (missing `search_path`, weak RLS, permissive profile inserts, low-entropy invite codes, unauthenticated RPCs) were fixed in `20260317000001_security_fixes.sql`, `20260319000003_fix_function_search_paths.sql`, `20260319000005_upgrade_invite_code_entropy.sql`, and `20260330000001_partner_sync_security_fixes.sql`. What remains is a cluster of cross-platform subscription race conditions, family-leak edges on the `babies` table, a broken subscription tier protection trigger for admin flows, and an unclaimed post-grace-period downgrade path. Detail below.

---

## Critical

### C1. `babies` RLS uses subquery → two-family leak possible during join window
**Location:** `20260324000007_capture_babies_table.sql:50-87`

All four `babies` policies use:
```sql
family_id IN (SELECT family_id FROM profiles WHERE id = auth.uid())
```
For **SELECT** this is fine. For **INSERT/UPDATE/DELETE** it is a problem: the policy passes as long as the *target row's* `family_id` matches the caller's `family_id`. But `profiles.active_baby_id` (added in the same migration) points into `babies` across families, and there's no FK-level check that the caller's own family owns the baby they're activating. Combined with the fact that `join_family` (`20260330000001:74-80`) sets `active_baby_id` to `v_primary_baby_id` unconditionally, a partner joining a family momentarily has two valid RLS frames during the update (old family_id, new family_id) — deleting babies via a race that chains two upserts is possible.

**Fix:** rewrite the WITH CHECK clauses explicitly, and ensure the active_baby_id FK is constrained to the caller's current family via a trigger:
```sql
DROP POLICY "Family members can insert babies" ON babies;
CREATE POLICY "Family members can insert babies" ON babies
  FOR INSERT TO authenticated
  WITH CHECK (family_id = (SELECT family_id FROM profiles WHERE id = auth.uid()));

DROP POLICY "Family members can update babies" ON babies;
CREATE POLICY "Family members can update babies" ON babies
  FOR UPDATE TO authenticated
  USING (family_id = (SELECT family_id FROM profiles WHERE id = auth.uid()))
  WITH CHECK (family_id = (SELECT family_id FROM profiles WHERE id = auth.uid()));
-- same pattern for DELETE
```
Also add a BEFORE UPDATE trigger on `profiles` that rejects `active_baby_id` assignment where `babies.family_id <> NEW.family_id`.

---

### C2. `protect_subscription_fields` trigger is bypassed by `join_family`, `handle_new_user`, and `whitelist_email`
**Location:** `20260330000001_partner_sync_security_fixes.sql:114-134`

The trigger zeroes out writes to `subscription_tier`/`subscription_expires_at` when `current_user = 'authenticated'`. This is good, but:

1. `join_family` is `SECURITY DEFINER`, so `current_user = 'postgres'` inside it — the trigger allows its write. Fine.
2. The Stripe webhook uses the service_role key → `current_user = 'service_role'` → passes. Fine.
3. **But the trigger uses `current_user`, not `session_user`. With PostgREST, `current_user` under RLS is actually the role PostgREST set via `SET LOCAL ROLE authenticated`** — so this does fire for direct `UPDATE profiles` client calls. Verified correct for the common case.
4. **BUT:** the trigger silently swallows the offending fields by rewriting `NEW.subscription_tier := OLD.subscription_tier`. A client can still `UPDATE profiles SET subscription_tier = 'lifetime'` and the query will **succeed** with the rewrite. No error. If there's any code path that reads back the returned row and trusts it (e.g. `.select().single()` after update), the client gets the stale value and may cache it client-side, causing UI drift. Worse, if a future endpoint reads from `RETURNING *` before the rewrite propagates, it could trust the requested value.

**Fix:** raise instead of silently rewriting, so the misuse is loud:
```sql
IF current_user = 'authenticated' THEN
  IF NEW.subscription_tier IS DISTINCT FROM OLD.subscription_tier
     OR NEW.subscription_expires_at IS DISTINCT FROM OLD.subscription_expires_at THEN
    RAISE EXCEPTION 'subscription fields are read-only for clients';
  END IF;
END IF;
```

---

### C3. Stripe & RevenueCat webhooks race-overwrite each other for cross-platform subscribers
**Location:**
- `apps/web/src/app/api/stripe/webhook/route.ts:208-248`
- `supabase/functions/handle-revenucat-webhook/index.ts:107-136`

Both handlers `upsert` into `subscriptions` with `onConflict: 'user_id'` (enforced by the `UNIQUE(user_id)` constraint from `001_initial_schema.sql:199`). For a user who subscribed via iOS and then opens the web and hits a Stripe lifecycle event (or vice versa), **whichever webhook arrives second clobbers the `platform` and `store_product_id` of the first**. There is no reconciliation: the schema allows exactly one subscription row per user, but the code writes from two sources that don't check platform first.

Evidence: the `platform` column was added in `20260320000002_subscriptions_multi_platform.sql:3-8` with `DEFAULT 'web'`, and the Stripe webhook never sets `platform` — so any Stripe event on an iOS-purchased lifetime row will leave `platform='ios'` but the `tier`/`status` reset to Stripe's view, which may be `past_due` or `canceled` (because they have no Stripe customer!).

Worse, the Stripe handler at line 208 does an `UPDATE` keyed on `user_id` only (no `platform` filter) — this silently blows away iOS subscription data.

**Fix — pick one strategy:**

Option A (preferred): split into two rows keyed on `(user_id, platform)`:
```sql
ALTER TABLE subscriptions DROP CONSTRAINT subscriptions_user_id_key;
ALTER TABLE subscriptions
  ADD CONSTRAINT subscriptions_user_platform_key UNIQUE(user_id, platform);
```
Then each webhook `upsert({...}, { onConflict: 'user_id,platform' })` and the `getSubscription` service resolves to "best tier across rows".

Option B: gate every Stripe write on `platform IN ('web', NULL)` and every RevenueCat write on `platform IN ('ios','android', NULL)`:
```ts
// stripe webhook
.update({...}).eq('user_id', userId).in('platform', ['web'])
```
Option B is smaller but leaves `UNIQUE(user_id)` intact and prevents clobbering.

---

### C4. Grace-period downgrade never happens server-side
**Location:** `packages/services/src/subscription-service.ts:46-57`; `20260320000002` et al.

The comment at `apps/web/.../stripe/webhook/route.ts:297` says: *"A cron job or on-read check should downgrade tier to 'free' after expiry."* There is no such cron. The only mechanism is the **client-side** check in `subscription-service.ts`, which returns `'free'` only on read. This means:

- The `profiles.subscription_tier` column stays at `'premium'` indefinitely for cancelled users.
- Any server code (edge functions, RLS policies, SQL views, pg_cron jobs, email blasts) that reads `subscription_tier` directly will treat cancelled users as premium forever.
- The `handle-revenucat-webhook` `EXPIRATION` path *does* downgrade, but the Stripe side does not.

**Fix:** add a pg_cron job similar to the one in `20260326000001`:
```sql
SELECT cron.schedule(
  'downgrade-expired-subscriptions',
  '0 2 * * *',
  $$UPDATE public.profiles
    SET subscription_tier = 'free', subscription_expires_at = NULL
    WHERE subscription_tier IN ('premium')
      AND subscription_expires_at IS NOT NULL
      AND subscription_expires_at < NOW() - interval '7 days'$$
);
```
Also downgrade the matching `subscriptions` row.

---

### C5. Stripe webhook 30-day fallback invents a subscription period on garbage data
**Location:** `apps/web/src/app/api/stripe/webhook/route.ts:188-198`

```ts
if (!rawPeriodEnd) { console.warn(...) }
const currentPeriodEnd = rawPeriodEnd ?? Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60
```
If Stripe sends an event without `items.data[0].current_period_end` (e.g. incomplete/metered subscription or schema change on Stripe's side), this grants the user 30 free days of premium. Combined with C4, that 30 days becomes forever.

**Fix:** fail loudly:
```ts
if (!rawPeriodEnd || !rawPeriodStart) {
  console.error(`Stripe subscription ${subscription.id} missing period dates`, { rawPeriodEnd, rawPeriodStart })
  throw new Error('Invalid subscription payload')
}
```
The webhook already catches exceptions at line 103 and returns 200, so Stripe won't retry-storm.

---

## High

### H1. `handle_new_user` trigger silently swallows all errors
**Location:** `20260322000001_email_whitelist.sql:46-53` (latest version)

```sql
EXCEPTION
  WHEN unique_violation THEN RETURN NEW;
  WHEN OTHERS THEN RAISE WARNING 'Error in handle_new_user: %', SQLERRM; RETURN NEW;
```
Any bug — missing column, enum value mismatch, RLS regression — creates an auth user but no profile. The app relies on profile row existing; downstream code will crash with "profile not found". The `WHEN OTHERS` block hides these failures as WARNINGs that never surface outside Postgres logs.

**Fix:** re-raise for everything except `unique_violation`. Use Supabase's post-signup hook (exists in commit `0898cfb`) to handle idempotent side effects like welcome emails.

### H2. `profiles.subscription_tier` is the source of truth but can drift from `subscriptions.tier`
`001_initial_schema.sql:21` and `:192` both carry `subscription_tier`. The Stripe webhook writes to both (`route.ts:208-229`), RevenueCat writes to both (`index.ts:107-134`), but `whitelist_email` only updates `profiles` (`20260322000001:68-70`) and separately updates `subscriptions` in a non-atomic block (`:72-74`). The `UPDATE public.subscriptions ... WHERE user_id = (SELECT id FROM profiles ...)` could match zero rows if the profile hasn't been created yet; the whitelist insert still reports "whitelisted". Consolidate tier into **one** table and treat the other as a derived view, or add a DB trigger to keep them in sync.

### H3. `updated_at` trigger missing on `dad_challenge_content`, `dad_profiles`, `mood_checkins`, `babies` has it but `notifications` got it retroactively only on `20260317000001:466-474`
**Location:** `20260319000004_capture_missing_tables.sql`

The dashboard-captured tables have `updated_at` columns but no triggers. App writes will never bump them, making cache invalidation and "last edited" displays incorrect. Add triggers wherever an `updated_at` column exists.

### H4. `mood_checkins` RLS leaks within family but allows any family member to insert as anyone
**Location:** `20260319000004:107-109`
```sql
CREATE POLICY "Users can insert own mood checkins" ON mood_checkins
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```
Good. But there's no check that `NEW.family_id = get_user_family_id(auth.uid())`. A malicious authenticated user could INSERT a mood checkin with `user_id = self`, `family_id = <someone else's family_id>` and have it show up on that family's dashboard via the SELECT policy. Same pattern on `baby_logs` inserts (`002_rls_policies.sql:72`) — `is_family_member(family_id)` is checked but not that `logged_by = auth.uid()`.

**Fix:**
```sql
CREATE POLICY "Users can insert own mood checkins" ON mood_checkins
  FOR INSERT WITH CHECK (
    auth.uid() = user_id
    AND family_id = (SELECT family_id FROM profiles WHERE id = auth.uid())
  );
```

### H5. `contact_messages.user_id` is nullable but policy requires `user_id = auth.uid()`
**Location:** `20260319000004:124-151`

Anonymous contact submissions (user_id NULL) pass the schema but fail the `INSERT WITH CHECK (auth.uid() = user_id)` policy because `auth.uid() = NULL` is NULL, not TRUE. So anonymous contact form submissions silently fail. Either add `TO anon` policy, or drop the column nullability.

### H6. `push_subscriptions` predates RLS hardening — `FOR ALL` without WITH CHECK
**Location:** `002_rls_policies.sql:93`
```sql
CREATE POLICY "Users can manage own push subscriptions" ON push_subscriptions FOR ALL USING (user_id = auth.uid());
```
The `FOR ALL` policy omits `WITH CHECK`. For INSERT/UPDATE, Postgres requires WITH CHECK to restrict what can be written; without it, an authenticated user can insert a push_subscription with **another user's** `user_id`, then the USING clause (user_id = auth.uid()) hides it from their own view but it still delivers push to the victim's device. Same issue on `family_budget` (`:78`), `checklist_progress` (`:82`), `notification_preferences` (`:90`).

**Fix:** split each `FOR ALL` into explicit INSERT/UPDATE/DELETE with matching WITH CHECK, or add `WITH CHECK (user_id = auth.uid())` to the existing `FOR ALL` policies.

### H7. `lookup_family_by_invite` lets anyone enumerate invite codes
**Location:** `20260330000001:10-17`

`SECURITY DEFINER` + no rate limiting + brute-forceable despite the 48-bit entropy upgrade (`20260319000005`). An attacker who knows one invite code prefix can iterate. Add rate limiting at the edge, or require authentication (`GRANT EXECUTE ... TO authenticated` — already done, but anon is still revoked, so this is OK). Verify anon is blocked by running `get_advisors`. Also consider logging failed lookups.

---

## Medium

### M1. Missing FK indexes remain on several tables
- `mood_checkins.family_id` has an index (`idx_mood_family`), but `mood_checkins.user_id` also has one. Good.
- `dad_profiles.user_id` indexed. Good.
- `babies.family_id` indexed. Good.
- **`notification_delivery_log.notification_id`** indexed (`idx_delivery_log_notification`). Good.
- **`contact_messages.user_id`** indexed. Good.
- **`feedback.user_id`** indexed. Good.
- **`analytics_events.session_id`** — NOT indexed. Sessions queries will full-scan. Add `CREATE INDEX idx_analytics_events_session ON analytics_events(session_id)`.
- **`page_engagements.session_id`** — NOT indexed. Same.
- **`profiles.active_baby_id`** is indexed only inside a DO block conditional on column creation (`20260324000007:31`). If the column already existed in some environments, the index was skipped. Verify with `get_advisors`.

### M2. Enum use despite project rule "CHECK > enums"
`001_initial_schema.sql:5-11` declares 8 enums. The project CLAUDE.md and migrations.md explicitly say: *"Content phases use TEXT with CHECK constraint (not enum) for flexibility"*. Newer tables correctly use TEXT+CHECK (`dad_challenge_content.phase`, `mood_checkins.mood`, etc.), but the old enums are deeply wired in and can't be dropped without migration. At minimum, **do not add new enum values without a plan to convert**. The `family_stage` enum already took hits from `006_trimester_stages.sql` — `ALTER TYPE ... ADD VALUE` is transaction-unsafe and contributed to the trigger drop/recreate dance in `20250101000001:4-16`. Flag for eventual migration to TEXT+CHECK.

### M3. `calculate_current_week` and `update_family_week_and_stage` computed `current_week` on INSERT/UPDATE but daily cron only touches `updated_at`
**Location:** `20260326000001:134-138`
```sql
SELECT cron.schedule('refresh-pregnancy-weeks','0 3 * * *',
  $$UPDATE public.babies SET updated_at = NOW() WHERE due_date IS NOT NULL$$);
```
This relies on the `update_baby_stage` BEFORE UPDATE trigger running and recomputing `current_week`. Good pattern, **but** there's no equivalent refresh for families that don't have a `babies` row (legacy families created before the babies table existed). They'll have stale `current_week` until someone edits them. Add a second cron:
```sql
SELECT cron.schedule('refresh-families-week', '5 3 * * *',
  $$UPDATE public.families SET updated_at = NOW()
    WHERE due_date IS NOT NULL
      AND NOT EXISTS (SELECT 1 FROM public.babies WHERE babies.family_id = families.id)$$);
```

### M4. `family_tasks.assigned_to` has no NOT NULL constraint
`001:69`: `assigned_to task_assignee DEFAULT 'either'`. Nullable. The service layer assumes it's populated. Add `NOT NULL`.

### M5. `families.owner_id` is nullable but app treats it as authoritative
`001:38`: `owner_id UUID REFERENCES profiles(id)` — no NOT NULL. If the owner is deleted, `owner_id` goes to NULL (the FK has no ON DELETE), but the FK action isn't set so actually it errors, which is good. But initial families created without an owner_id would break `regenerate_invite_code`'s owner check silently. Add `NOT NULL`.

### M6. `subscriptions.status` CHECK allows `'free'`, which is a tier not a status
**Location:** `20260319000002:27-29`
```sql
CHECK (status IN ('active','canceled','past_due','incomplete','incomplete_expired','trialing','unpaid','free'))
```
`'free'` should not be a Stripe status. Having it in the CHECK makes it a magic value: who sets it? The app treats `tier='free', status='active'` elsewhere. Remove `'free'` from the status CHECK.

### M7. `notifications` table has no partial index for unread lookups
The common dashboard query is "unread notifications for user X". `idx_notifications_user_read` exists but indexes every row. A partial index would be smaller:
```sql
CREATE INDEX idx_notifications_unread ON notifications(user_id, created_at DESC)
  WHERE is_read = FALSE;
```

### M8. `analytics_events` and `page_engagements` have RLS policies granting `service_role`, which is a no-op
`20260325000001:48,51`. service_role bypasses RLS regardless. The policy is harmless but misleading. Remove the policies and leave RLS enabled with no policies (same effect as `stripe_webhook_events`).

### M9. `delete-account` edge function deletes via `auth.admin.deleteUser` which cascades through the profiles FK
Verify there is no `ON DELETE CASCADE` chain from profiles → babies → family_tasks that accidentally removes the co-parent's data when one parent deletes their account. Quick read of the migrations shows `families` has no `ON DELETE CASCADE` on `profiles.family_id` (it's `ON DELETE SET NULL`, `001:44`), which is correct. But `babies.family_id ON DELETE CASCADE` (`20260324000007:7`) means: if deleting the last family member triggers family deletion, all babies and then all tasks get wiped. Verify the delete-account function checks `IF family_member_count = 1` before deleting the family. Flag to cross-check with Eng Review #4 (core-features).

---

## Low / Nits

- **L1.** Legacy `update_family_stage()` trigger function (`003_functions.sql:135-146`) is defined but superseded by `update_family_week_and_stage`. No migration drops the old function. Orphan SQL.
- **L2.** `log_type` enum has `'custom'` but no column on `baby_logs` for a custom label. UI-side only.
- **L3.** `briefing_templates.dad_focus` is `TEXT[]`. Queries on array elements require GIN index; none exists. Likely fine if the field is always returned whole.
- **L4.** `20260326000001:137` schedules a cron that touches `babies.updated_at` but `babies` `updated_at` trigger is also added in the same migration chain. Ensure the trigger is installed *before* the cron fires; check migration ordering vs production apply timestamps.
- **L5.** Naming inconsistency: `revenucat_*` (missing 'e') vs `RevenueCat` in comments. Cosmetic but will frustrate future grep.
- **L6.** `family_budget` has no `created_by` column; you can't tell which partner added an item. Consider adding.
- **L7.** `002_rls_policies.sql:53-55` "Users can view family members" policy queries profiles from within a profiles policy. The helper `get_user_family_id` correctly uses `SECURITY DEFINER` to avoid recursion. Verified correct.
- **L8.** `20260325000001` (analytics) has no cleanup cron despite the comment saying "Data retention: 90-day cleanup should be added via pg_cron later." Open action item — GDPR/CCPA exposure grows over time.
- **L9.** `invoke_notification_job` cron reads the service role key from Vault (`20260324000002:35-39`). Good pattern. But if Vault lookup fails, it returns silently (`RAISE WARNING`). Cron will show "success" but nothing will be sent. Make it RAISE EXCEPTION so cron job status flags failures.

---

## Verified correct

- **All `SECURITY DEFINER` functions now have `SET search_path = ''`** (verified via `20260317000001` + `20260319000003` + `20260326000001` + `20260330000001`). No unqualified table refs remain in the functions I read.
- **Stripe & RevenueCat webhook idempotency**: both use `UNIQUE(event_id)` + upsert with `ignoreDuplicates: true`. Atomic, race-safe. (`stripe_webhook_events`, `revenucat_webhook_events`)
- **`handle_new_user` whitelist check uses LOWER() on both sides** — case-insensitive email match. Correct.
- **Invite code entropy upgrade from MD5(RANDOM()) 32 bits → `gen_random_bytes(6)` 48 bits** (`20260319000005`). Applied to both default and `regenerate_invite_code` function.
- **`join_family` atomic pre-checks**: already-in-family, max-2-members, copies subscription tier, sets active_baby_id. Race-safe under single-row UPDATE semantics. (`20260330000001:20-88`)
- **Template tables `USING (true)`** on `task_templates`, `briefing_templates`, etc. — intentional, they're seed content. Correct.
- **`whitelisted_emails` has RLS enabled with zero policies** (`20260322000001:11`) — correctly service-role-only.
- **`stripe_webhook_events` and `revenucat_webhook_events`** follow the same pattern.
- **`check_feedback_rate_limit` trigger** (`20260324000008:49-70`) — 5-per-hour rate limit, uses `SECURITY DEFINER` + `search_path = ''`.
- **Profile INSERT policy fixed** from `WITH CHECK (true)` to `WITH CHECK (auth.uid() = id)` in `20260317000001:291-293`.
- **FK indexes added in bulk** in `20260317000001:297-334`: family_tasks.task_template_id, family_budget.family_id, family_budget.budget_template_id, checklist_progress.checked_by, checklist_item_templates.checklist_id, baby_logs.logged_by, families.owner_id. All correct.
- **`(SELECT auth.uid())` wrapping** applied to all hot RLS policies (`20260317000001:339-457`). Prevents per-row function evaluation.

---

## Schema health score

**6.5 / 10**

The good: the team has done serious remediation work between December and March. Every `SECURITY DEFINER` function is properly scoped. Webhook idempotency is correct. Partner-join race is closed. RLS is enabled on every table.

The bad: the multi-platform subscription model is half-built (C3), server-side post-grace downgrade doesn't exist (C4), and several INSERT policies still use `FOR ALL` without `WITH CHECK`, which is a well-known RLS footgun (H6). A couple of tables capture from dashboard still have the weaker "subquery" form of family scoping (C1, H4).

Another revision pass focused specifically on subscription reconciliation and `WITH CHECK` audits would push this to 8+.

---

## Tables missing RLS or with weak RLS

All public tables have RLS **enabled**. Weak policies:

| Table | Issue |
|---|---|
| `babies` | INSERT/UPDATE/DELETE use subquery form; family_id not pinned in WITH CHECK (C1) |
| `mood_checkins` | INSERT policy doesn't verify family_id matches caller's family (H4) |
| `baby_logs` | INSERT doesn't verify logged_by = auth.uid() (H4) |
| `push_subscriptions` | `FOR ALL` without `WITH CHECK` — can insert with another user's user_id (H6) |
| `family_budget` | Same — `FOR ALL` without `WITH CHECK` (H6) |
| `checklist_progress` | Same — `FOR ALL` without `WITH CHECK` (H6) |
| `notification_preferences` | Same — `FOR ALL` without `WITH CHECK` (H6) |
| `contact_messages` | Anon inserts blocked by `auth.uid() = user_id` on nullable column (H5) |
| `subscriptions` | No INSERT or DELETE policies — only SELECT/UPDATE. Probably intentional (service role inserts), but should be explicit. |

No public table is missing RLS entirely. `whitelisted_emails`, `stripe_webhook_events`, `revenucat_webhook_events`, `analytics_events`, `page_engagements` are intentionally service-role-only and are correct.

---

## Top 5 prioritized fixes

1. **Fix multi-platform subscription clobbering (C3).** Add `(user_id, platform)` unique key and filter webhook writes by platform. This is the biggest blast radius: any iOS user who opens the web app today can have their lifetime subscription silently demoted. High priority.

2. **Add post-grace-period downgrade cron (C4).** One pg_cron job, 10 lines of SQL. Without it, cancelled users remain `premium` in the database forever and every server-side tier check is a lie.

3. **Close `WITH CHECK` gaps on `FOR ALL` policies (H6).** Rewrite 4 policies. Low effort, prevents cross-user writes on push_subscriptions, notification_preferences, family_budget, checklist_progress.

4. **Tighten `mood_checkins` and `baby_logs` INSERT policies (H4).** Add family_id and logged_by WITH CHECK constraints. Prevents cross-family poisoning.

5. **Make `protect_subscription_fields` RAISE instead of silently rewriting (C2)**, and make `handle_new_user` re-raise on non-unique errors (H1). Both make silent failures loud.
