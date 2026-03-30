# The Dad Center -- Comprehensive Marketing Audit & Gap Analysis
**Date:** March 29, 2026
**Scope:** Web (desktop), Web-Mobile (PWA), Mobile-Native (Expo)

---

## Table of Contents
1. [Executive Summary](#executive-summary)
2. [Current State: What's Strong](#whats-strong)
3. [Current State: What's Broken](#whats-broken)
4. [SEO & Content Gaps](#1-seo--content-grade-d)
5. [Analytics & Attribution Gaps](#2-analytics--attribution-grade-f)
6. [Conversion Rate Optimization Gaps](#3-conversion-rate-optimization-grade-c)
7. [Retention & Churn Prevention Gaps](#4-retention--churn-prevention-grade-d)
8. [Growth & Distribution Gaps](#5-growth--distribution-grade-d-)
9. [Mobile-Specific Gaps](#6-mobile-specific-grade-b)
10. [Prioritized Action Plan](#prioritized-action-plan)
11. [Impact Projections](#impact-projections)

---

## Executive Summary

The Dad Center has **exceptional product depth** (200+ tasks, 140+ briefings, 41 articles, 65 videos, 15+ checklists, budget planner) but **critical marketing infrastructure gaps** that are preventing growth. The five most impactful issues:

1. **Email automation is completely dead** -- 10 email types are built and written but zero cron jobs fire them
2. **Partner invite says "Coming Soon"** -- the #1 viral loop is gated
3. **No email capture anywhere** -- only path is full account signup
4. **Native app built but not in App Store** -- losing credibility
5. **No GA4/GTM** -- impossible to measure what's working

| Domain | Grade | Biggest Gap |
|--------|-------|-------------|
| SEO & Content | D+ | No blog, no programmatic pages |
| Analytics & Attribution | F | No GA4, no UTM tracking |
| Conversion Rate Optimization | C | No social proof, misleading free tier copy |
| Retention & Churn Prevention | D | No emails sending, no custom cancel flow |
| Growth & Distribution | D- | Partner invite gated, no referral program |
| Mobile-Specific | B | Solid PWA but no install prompt |

---

## What's Strong

These are things already done well -- no action needed:

- **Product content**: 200+ pre-loaded tasks, 140+ weekly briefings, 41 articles, 65 videos, 15+ checklists, budget planner with real pricing across tiers
- **7 marketing pages**: Landing (9 sections), About, FAQ (18 Qs), Content library, Dad Tips (6 guides), Budget Guide, Baby Checklists
- **SEO technical foundation**: robots.ts, sitemap.ts (dynamic with articles + checklists), canonical URLs on all pages, OG tags, Google Search Console verified, llms.txt for AI crawlers
- **Structured data**: JSON-LD for Organization, WebSite, SoftwareApplication, FAQPage, HowTo, CollectionPage
- **PWA implementation**: manifest.json (standalone display), service worker (offline + push + background sync), app shortcuts for Tasks/Tracker/Briefing
- **Mobile UX**: Bottom nav + sidebar (responsive at md breakpoint), swipe gestures on task cards, safe-area insets for notched devices, 44px touch targets, glassmorphic light/dark modes, momentum scrolling
- **Paywall system**: 5 component variants (overlay, card, modal, banner, lock), 14 context-specific copy entries, Stripe checkout with webhook dedup, 7-day grace period
- **Email templates**: 10 types built (welcome, partner_invited, partner_joined, subscription_confirmed, subscription_expiring, payment_failed, weekly_briefing, overdue_digest, re_engagement, onboarding_drip)
- **Native app codebase**: Expo/React Native built at /apps/mobile/, EAS configured, AASA for deep linking, RevenueCat integrated
- **Design system**: "Warm Luxury Editorial" -- copper/gold palette, Playfair Display + Jost + Karla fonts, 10 animation wrapper components, consistent across all surfaces
- **Onboarding flow**: 3-step (Role -> Family -> Ready) with progress bar, welcome celebration overlay (confetti, balloons, particles)

---

## What's Broken

These are the critical issues requiring immediate attention:

### No emails are actually sending
The `send-email` Supabase Edge Function has 10 well-written email templates. The `onboarding_drip` covers days 1, 3, 5, 7. The `re_engagement` has 3 tiers (7-day, 21-day, 30-day). But **there are no cron jobs or schedulers triggering any of them**. The daily cron (`20260326000001_daily_week_refresh_cron.sql`) only refreshes week data -- it doesn't send emails. Free users get zero nudges after day 7.

### Partner invite is gated as "Coming Soon"
The `InvitePartnerCard` on the dashboard literally shows a "Coming Soon" badge. Partner sync is marketed as a core feature on the landing page ("Partner sync & coordination") but the actual invite mechanism is disabled. The 8-character invite code system works -- the `/onboarding/join` page accepts codes -- but the dashboard card that surfaces it is gated. This blocks the product's most natural viral loop (every user has exactly 1 potential partner).

### Free tier messaging is inconsistent
Three different definitions exist:
- **PRODUCT_FEATURES.md**: "14-day task window, 4 briefings, 10 checklists"
- **Landing page Pricing component**: "30-day task window, 4-week briefing window, all 15+ checklists, full budget planner"
- **FinalCTA.tsx**: "Free for 30 days -- no credit card needed" (implies a free trial, but it's freemium)
- **llms.txt**: "30-day rolling task window, 4 weeks of briefings, 30 days of push notifications"

The "Free for 30 days" language is the most problematic -- it implies full access for 30 days (trial), but the reality is permanent free tier with limited features (freemium). This creates trust damage when users discover the truth.

### Grace period banner is built but never rendered
The `useGracePeriodStatus` hook exists in `use-subscription.ts` and correctly calculates grace period remaining days. But it is **never imported or rendered anywhere** in the app. Expired premium users see no renewal prompt.

### Paywalls fire in only 5 of 14 defined locations
`paywall-copy.ts` has 14 context-specific paywall entries (briefings, tasks, notifications, future_phases, calendar, shift_briefing, mood_trends, tracker_advanced, realtime_sync, partner_invite, soft_prompt, catch_up_backlog, budget_full_access). But paywall components are only imported in 5 files: briefing client, briefing week client, dad challenge tile, tracker history, tracker summary. Features like calendar, budget, notifications, and partner invite have copy ready but no UI gate.

---

## 1. SEO & Content (Grade: D+)

### 1.1 No blog route (CRITICAL)

**What's missing:** There is no `/blog` route. The 41 articles live at `/content/articles/[slug]` inside a resource library with stage/format filtering. This is a product feature, not a content marketing asset. A blog differs because it:
- Is fully free and publicly crawlable (no paywall)
- Targets specific SEO keywords per post
- Has publishing dates, categories, and discovery-friendly browsing
- Can cover topics beyond the pregnancy timeline (comparisons, listicles, guides)

**Why it matters:** The GTM Strategy identifies 4 blog content pillars (Expecting Dad Guides, Baby Cost & Budget, New Dad Life, Comparison/Alternative). None exist. This is the single biggest organic growth lever.

**Recommendation:** Create a `/blog` route under `(marketing)` with a listing page and individual post pages. Start with 3 cornerstone posts:
1. "How Much Does Having a Baby Cost in 2026?" (leverage budget data)
2. "The Complete Pregnancy Checklist for First-Time Dads" (leverage task templates)
3. "Best Parenting Apps for Dads in 2026" (comparison/owned media)

### 1.2 No "week-by-week" public content (HIGH)

**What's missing:** 140+ weekly briefings are gated behind signup. Zero public pages target "pregnancy week X" searches, which are among the highest-volume parenting queries.

**Why it matters:** Creating abbreviated public versions (e.g., `/pregnancy-week/20-what-dads-should-know`) would capture massive organic traffic and funnel visitors into signup for the full briefing.

**Recommendation:** Create `/pregnancy-week/[number]` as programmatic SEO pages pulling abbreviated content from `briefing_templates`. Each page targets "pregnancy week X for dads" and ends with "Get the full briefing -- sign up free."

### 1.3 Article pages use `force-dynamic` (HIGH)

**What's missing:** At `/content/articles/[slug]/page.tsx` line 20: `export const dynamic = 'force-dynamic'`. Every article is server-rendered on each request instead of statically generated.

**Why it matters:** This increases Time to First Byte (TTFB), hurts Core Web Vitals, prevents edge caching, and makes pages fragile if Supabase is slow. Google uses Core Web Vitals as a ranking factor.

**Recommendation:** Switch to `generateStaticParams` + ISR (Incremental Static Regeneration) with a revalidation period. The checklists page already does this correctly -- follow that pattern.

### 1.4 No individual tip pages (HIGH)

**What's missing:** 6 dad tips (diaper changing, bottle prep, swaddling, bath time, car seat, burping) are all on a single page at `/tips`. Each topic has significant search volume ("how to change a diaper," "how to swaddle a baby," "how to install a car seat").

**Why it matters:** A single page can only rank for 1-2 primary keywords. Split into 6 pages, each ranks independently and serves as a landing page for its specific query. The HowTo schema already exists.

**Recommendation:** Create `/tips/[slug]` dynamic route. Each page gets its own metadata, HowTo schema, and targeted keywords.

### 1.5 No comparison/alternatives pages (MEDIUM)

**What's missing:** No "Dad Center vs BabyCenter," "Dad Center vs What to Expect," or "Best Pregnancy Apps Compared" pages. These capture competitor search traffic.

**Recommendation:** Create 2-3 comparison pages under `(marketing)`:
- `/compare/dad-center-vs-babycenter`
- `/compare/dad-center-vs-what-to-expect`
- `/compare/best-parenting-apps-for-dads`

### 1.6 FAQ schema on wrong page (MEDIUM)

**What's missing:** The FAQ JSON-LD in `JsonLd.tsx` has 6 questions and lives on the landing page. The actual `/faq` page has 18 questions across 4 categories but zero structured data.

**Recommendation:** Move FAQ schema to `/faq` page with all 18 questions. Keep a smaller subset (3-4 top questions) on the landing page.

### 1.7 Article schema incomplete (MEDIUM)

**What's missing:** The Article JSON-LD at `/content/articles/[slug]/page.tsx` is missing `datePublished`, `dateModified`, `image`, `articleSection`, and `wordCount`. These are needed for rich results in Google.

**Recommendation:** Populate from the articles table's created/updated timestamps.

### 1.8 No page-specific OG images (MEDIUM)

**What's missing:** One global OG image at the app root. Every page shares it. Pages like /tips, /budget-guide, /baby-checklists, and individual articles should each have their own OG image for better social sharing click-through.

**Recommendation:** Create `opengraph-image.tsx` in each marketing route directory using Next.js Image Response API.

### 1.9 No BreadcrumbList schema (LOW)

**What's missing:** Checklist detail pages and article pages have visual breadcrumbs but no BreadcrumbList JSON-LD. This enables rich breadcrumb display in Google SERPs.

---

## 2. Analytics & Attribution (Grade: F)

### 2.1 No GA4 or equivalent (CRITICAL)

**What exists:** Custom cookie-consent-gated analytics to `/api/analytics` endpoint, tracking events to Supabase tables (`analytics_events`, `page_engagements`). Sentry for error tracking.

**What's missing:** No Google Analytics 4, no Google Tag Manager, no PostHog, no Mixpanel. The custom system has:
- No attribution tracking (can't see where users came from)
- No conversion funnel visualization
- No audience demographics
- No integration with ad platforms
- No way to see which pages drive signups

**Recommendation:** Install GA4 + GTM behind cookie consent. Extend existing `cookie-consent.tsx` to gate the scripts. The GTM Strategy doc explicitly calls this a Week 1 task.

### 2.2 No UTM parameter capture (HIGH)

**What's missing:** Signup links (`/signup`, `/signup?plan=monthly`) don't capture UTM parameters. No mechanism to track which campaign, channel, or source drove a signup.

**Recommendation:** Capture `utm_source`, `utm_medium`, `utm_campaign` from URL on landing. Persist in session storage. Pass through to signup and store on the profiles table or analytics_events.

### 2.3 No Meta Pixel / Google Ads tag (HIGH)

**What's missing:** The GTM Strategy allocates $150-250/month to ads. Without a Meta Pixel or Google Ads conversion tag, there is no way to track signups back to ad clicks, build retargeting audiences, optimize delivery, or measure ROAS.

**Recommendation:** Install via GTM (once GTM is set up). Requires no code changes beyond the initial GTM container script.

### 2.4 No onboarding step-level analytics (HIGH)

**What's missing:** `analytics.ts` tracks `onboarding_started` and `onboarding_completed` but not each step (role_selected, family_created, ready_viewed). Without step-level data, you can't identify which step has the highest drop-off.

**Recommendation:** Add analytics events to each onboarding page component.

### 2.5 No marketing event tracking (MEDIUM)

**What's missing:** CTA button clicks on marketing pages, scroll depth on landing page, FAQ accordion opens, content filter usage, checklist browsing patterns, time-on-section metrics. The custom analytics tracks product events (task_created, briefing_viewed) but not marketing funnel events.

**Recommendation:** Add `trackEvent` calls to marketing components for CTA clicks, section views, and interactions.

---

## 3. Conversion Rate Optimization (Grade: C)

### 3.1 No real social proof on landing page (HIGH)

**What exists:** The Hero trust bar shows static product stats ("200+ Pre-loaded Tasks", "60+ Weekly Briefings", "Evidence-Based"). The FinalCTA says "Join thousands of dads" with no backing metric.

**What's missing:** No user count, no download count, no app store ratings, no star ratings, no real testimonials. The "Testimonials" section (`Testimonials.tsx`) is titled "Inside the App" and shows hardcoded task previews from different weeks -- it's a feature demo, not social proof.

**Recommendation:**
- Add real metric to hero: "Trusted by X families" (even if X is small, specificity builds trust)
- Replace "Testimonials" content with real user quotes (even 3 beta users with first name + role)
- Add founder credibility: "Built by [name], father of [N]"

### 3.2 "Free for 30 days" messaging is misleading (HIGH)

**What exists:** FinalCTA says "Free for 30 days -- no credit card needed." PaywallOverlay says "Free for 30 days -- no credit card needed." Upgrade success page says it too.

**The problem:** This implies a 30-day free trial with full access. The actual model is freemium -- free tier forever with limited features (30-day task window, 4-week briefing window). Users who sign up expecting full access for 30 days will feel deceived when they hit a paywall on day 1.

**Recommendation:** Either:
- **Option A:** Implement a true 30-day free trial with Stripe `trial_period_days` (full access, credit card required, charges after 30 days)
- **Option B:** Change messaging to "Free forever. Upgrade when you're ready." or "Start free -- no credit card needed"

Option B is simpler and more honest. The 30-day framing creates false urgency.

### 3.3 No email capture / lead magnet (HIGH)

**What's missing:** The entire site has zero email capture. Every CTA goes to `/signup`. No lead magnet, no "Get our free hospital bag checklist" offer, no exit-intent popup, no newsletter form in the footer.

**Why it matters:** For visitors who are interested but not ready to create an account (likely 60-70% of landing page traffic), there is no intermediate conversion step. They leave and are lost forever.

**Recommendation:**
- Add email input to the footer ("Get weekly dad tips -- enter your email")
- Add a lead magnet section above Pricing ("Free: Expecting Dad's Master Checklist" -- gated behind email)
- Consider exit-intent popup with lead magnet offer

### 3.4 No video demo on landing page (HIGH)

**What exists:** The "See How It Works" button in Hero scrolls to `#how-it-works` section. The ContentPreview mentions "65+ Videos." But there is no embedded video anywhere on the landing page.

**Why it matters:** A 60-90 second product walkthrough video dramatically increases time on page, understanding, and conversion. Video is the #1 content type for app landing pages.

**Recommendation:** Create a product demo video (screen recording + voiceover) and embed it in the HowItWorks section or as a standalone section between Features and Testimonials.

### 3.5 Paywalls only fire in 5 of 14 locations (HIGH)

**What exists:** `paywall-copy.ts` has 14 context-specific entries. Paywall components render in 5 places: briefing client, briefing week client, dad challenge tile, tracker history, tracker summary.

**What's missing:** Calendar, budget, notifications, shift_briefing, mood_trends, partner_invite, realtime_sync, catch_up_backlog, and soft_prompt all have copy defined but limited or no UI implementation. Users access these premium features without hitting a paywall.

**Recommendation:** Audit each premium feature and add the appropriate paywall variant (overlay, banner, or lock) using the existing copy.

### 3.6 No usage countdown banners (MEDIUM)

**What's missing:** No "3 briefings left on free plan," no "Your task window expires in 5 days," no "You've used 80% of your free briefings." The `UpgradePromptCard` on the dashboard uses a simple day-count heuristic (invisible 0-7 days, visible 8-21, urgent 22+) but doesn't account for actual usage levels.

**Recommendation:** Add countdown banners to briefing and task views showing remaining free allowance. High-engagement users should see upgrade prompts earlier than low-engagement users.

### 3.7 CTA copy is inconsistent (MEDIUM)

**What exists:** Different CTAs across the site:
- Hero: "Start Free"
- Features: "Start Your Free Trial" (misleading -- it's freemium, not a trial)
- Final CTA: "Start Your Journey Free"
- Pricing Free: "Get Started Free"
- Pricing Yearly: "Get Started"
- Header: "Get Started Free"

**Recommendation:** Standardize to "Start Free" everywhere. Remove all "Free Trial" language.

### 3.8 No money-back guarantee displayed (MEDIUM)

**What exists:** PRODUCT_FEATURES.md mentions a 30-day money-back guarantee. It is not shown on any pricing surface -- not on the landing page Pricing section, not on the upgrade page.

**Recommendation:** Add a guarantee badge below the CTA on both pricing surfaces: "30-day money-back guarantee -- no questions asked."

### 3.9 Signup form has unnecessary friction (LOW)

**What exists:** 4 fields: name, email, password, confirm password. The "confirm password" field adds friction with minimal security value.

**Recommendation:** Remove confirm password. Add a show/hide password toggle instead. Also add a "Resend email" button to the email confirmation screen.

### 3.10 Plan selection lost during signup (MEDIUM)

**What exists:** Pricing links to `/signup?plan=monthly`, `/signup?plan=yearly`, etc. But the signup page does not read or display `searchParams.plan`. The user's plan intent is lost -- they have to re-select after onboarding.

**Recommendation:** Persist the `plan` param through signup. Show "You selected the Yearly plan" on the signup page. After onboarding, prompt checkout for the selected plan.

---

## 4. Retention & Churn Prevention (Grade: D)

### 4.1 No email automation is running (CRITICAL)

**What exists:** The `send-email` Supabase Edge Function handles 10 email types. Templates are written. The onboarding drip covers days 1, 3, 5, 7. Re-engagement has 3 tiers.

**What's missing:** Zero cron jobs or scheduled functions trigger any emails. The onboarding drip, weekly briefing, overdue digest, and re-engagement emails are all dead code.

**Recommendation:** Build a Supabase cron job (or pg_cron entry) that:
- Runs daily: checks for users matching drip/re-engagement criteria
- Runs weekly: sends weekly_briefing to active users
- Runs daily: sends overdue_digest for users with overdue tasks
- Fires triggers: subscription_expiring (7 days before), payment_failed (on webhook)

### 4.2 No free-to-paid email drip after day 7 (HIGH)

**What exists:** Onboarding drip stops at day 7. After that, zero nudges until the user hits a paywall in the product.

**What's missing:** A conversion-focused drip sequence:
- Day 10: Highlight a premium feature they've been blocked from
- Day 14: "Your task history is growing -- keep it all with Premium"
- Day 21: Social proof ("Join X dads who upgraded this week")
- Day 28: "Your briefing window is closing this week"
- Day 30: Value recap + limited-time annual discount

### 4.3 No custom cancellation flow (HIGH)

**What exists:** Cancellation goes straight to Stripe's Customer Portal via `createPortalSession`. There's a confirmation dialog listing features they'll lose.

**What's missing:** No in-app cancellation flow with:
- Save offers ("We'll give you 50% off for 3 months")
- Pause option ("Take a 1-month break instead")
- Downgrade offer ("Switch to monthly instead of canceling")
- Cancellation reason survey

**Why it matters:** The cancellation moment is the single highest-leverage retention intervention. A custom flow with a save offer typically retains 10-30% of users who would otherwise cancel.

### 4.4 Grace period banner not rendered (HIGH)

**What exists:** `useGracePeriodStatus` hook in `use-subscription.ts` correctly calculates remaining grace days. The hook is exported but **never imported anywhere** outside its definition file.

**Why it matters:** Expired premium users in their 7-day grace period see no renewal prompt. This is free conversion recovery.

**Recommendation:** Import and render in `DashboardClient.tsx` as a prominent banner: "Your premium access expires in X days. Renew to keep [features]."

### 4.5 No win-back email sequence (HIGH)

**What exists:** `re_engagement` email type with 3 tiers. The last tier says "This is our last check-in. We won't email again."

**What's missing:** A win-back attempt 60-90 days after cancellation with a special offer. Also no sequence for users who had premium and downgraded.

### 4.6 No engagement streaks or milestones (MEDIUM)

**What's missing:** No "7-day check-in streak," no "You've completed 50 tasks!" milestone, no completion badges. The mood check-in happens daily but there's no streak celebration.

**Why it matters:** Streaks and milestones create psychological investment. Users who have a "14-day streak" are less likely to churn because they don't want to break it.

### 4.7 No in-app guided tour or tooltips (MEDIUM)

**What's missing:** After the welcome overlay dismisses (after 5 seconds -- which is too fast), users land on the dashboard with no guidance. No tooltips pointing to the first task, no "Complete your first task" prompt, no feature discovery nudges.

**Why it matters:** The first action a user takes is critical for activation. Users who complete their first task in the first session are significantly more likely to return.

### 4.8 No subscription pause option (MEDIUM)

**What's missing:** Cancel is the only option. Pregnancy and early parenthood have natural lulls (between trimesters, during recovery). A "pause for 1 month" option retains users who might otherwise cancel.

---

## 5. Growth & Distribution (Grade: D-)

### 5.1 Partner invite is gated (CRITICAL)

**What exists:** 8-character invite code system works. `/onboarding/join` accepts codes. `partner_invited` and `partner_joined` email types exist.

**What's broken:** The `InvitePartnerCard` on the dashboard shows "Coming Soon." The core viral loop is disabled.

**Additional gap:** The invite code is text-only. It should also generate a direct link (`thedadcenter.com/join?code=ABCD1234`) that auto-fills the code. The AASA supports deep linking.

**Recommendation:**
- Ungate the partner invite immediately
- Generate shareable links (not just codes)
- Add share buttons (WhatsApp, SMS, email with pre-filled message)
- Add persistent dashboard banner when partner hasn't joined
- Trigger `partner_invited` email when code is shared

### 5.2 Native app not in App Store (CRITICAL)

**What exists:** Expo/React Native app at `/apps/mobile/`, EAS build configs, Apple App Store Connect ID (`6760888897`), detailed launch checklist in `steps.md`, RevenueCat integrated.

**What's missing:** The app is not submitted. "Coming soon to iOS & Android" on the homepage loses trust over time.

**Recommendation:** Ship to iOS first (Apple reviews take 24-48 hours). Get 20-30 TestFlight testers to leave App Store reviews on launch day. Coordinate with a Reddit post and social push.

### 5.3 No referral program (HIGH)

**What's missing:** Zero referral infrastructure -- no `referral_codes` table, no UTM capture, no `referred_by` column on profiles. The GTM Strategy describes "Give a friend 1 month free, get 1 month free" but nothing is built.

**Recommendation:** Build a simple referral system:
- Each user gets a referral link (`thedadcenter.com/ref/XXXX`)
- Referred user gets 1 month premium free
- Referrer gets 1 month premium free when referred user signs up
- Track with a `referral_codes` table + `referred_by` on profiles

### 5.4 No lead magnets or top-of-funnel assets (HIGH)

**What's missing:** No PDFs, quizzes, calculators, or gated resources. The only conversion path is full signup.

**Recommended lead magnets (ranked by effort/impact):**

1. **"Expecting Dad Master Checklist" PDF** (Low effort, high impact) -- Extract from 200+ tasks and 15 checklists. Gate behind email.
2. **"Baby Cost Calculator" interactive tool** (Medium effort, very high SEO value) -- Public version of budget planner. Email capture to "save your estimate."
3. **"Dad Readiness Quiz"** (Medium effort, high viral potential) -- 10 questions, generates score + recommendations, shareable result card.
4. **"Week-by-Week Pregnancy Guide for Dads" email course** (Low effort) -- Repurpose briefing content into a 40-week email series timed to due date.
5. **Printable Hospital Bag Checklist** (Lowest effort) -- Extract from existing checklist CL-01 as branded PDF.

### 5.5 No social sharing anywhere (HIGH)

**What's missing:** Zero share buttons on articles, tips, checklists, budget guide, or milestone achievements. These are all naturally shareable content types.

**Recommendation:** Add Web Share API (with clipboard fallback) to articles, tips, checklists, and budget guide pages.

### 5.6 No shareable milestone cards (HIGH)

**What's missing:** "Baby is the size of a mango" cards, "82% prepared for baby" progress badges, budget breakdown cards, tracker summaries -- none of these exist as shareable images.

**Why it matters:** These are zero-cost viral assets. Every share puts the brand in front of potential users.

**Recommendation:** Build shareable card components that generate branded images (using Canvas API or server-side image generation) for:
- Weekly baby size/development
- Preparation progress percentage
- Budget breakdown summary
- Baby's first month in numbers

### 5.7 No community presence (MEDIUM)

**What exists:** Social profiles for X, Instagram, LinkedIn in the footer. Reddit, Pinterest, Threads in schema.

**What's missing:** No active engagement on any platform.

**Recommendation:**
- **Reddit (Primary):** Build karma in r/predaddit (125K+) and r/daddit (1M+) for 3 weeks before any product mention. Share budget data as value-first posts. Share task lists as standalone content.
- **Facebook Groups:** Join dad-specific groups. Target mom groups with "Share with your partner" messaging.
- **Pinterest:** Create Pinterest-sized images (1000x1500) for checklists and budget data. Set-and-forget distribution.

### 5.8 No partnership infrastructure (MEDIUM)

**What's missing:** No affiliate links, no partner codes, no co-marketing pages.

**Highest-impact partnerships:**
1. **OB-GYN offices** -- Physical card with QR code to `thedadcenter.com/partner/[office]`
2. **Prenatal class providers** -- "The app prenatal class instructors recommend to dads"
3. **Baby registry platforms** -- Budget planner is the natural bridge to affiliate links
4. **Dad podcasts** -- Guest appearances with unique promo codes
5. **Baby gear DTC brands** -- Mutual promotion (brand promotes app, app features brand in budget tool)

### 5.9 No "Gift a Subscription" feature (MEDIUM)

**What's missing:** No way to purchase a gift code. Baby showers and registry gifting are natural distribution channels.

**Recommendation:** Build a simple gift code flow: purchaser buys a code, recipient redeems it. Could also be listed as a baby registry item on Babylist.

### 5.10 No PWA install prompt (MEDIUM)

**What exists:** Full PWA with manifest.json, service worker, offline support. `prefer_related_applications` is `false`.

**What's missing:** No `beforeinstallprompt` event handler. Users are never prompted to add the app to their home screen.

**Recommendation:** Show a custom install banner after onboarding completion or after the user's 2nd session.

### 5.11 No "For Your Partner" landing page (MEDIUM)

**What's missing:** When moms share the app with their partners, the partner lands on the generic homepage. A dedicated page at `/for-your-partner` with messaging like "Your partner signed you up because they think you'll find this useful" would convert better.

---

## 6. Mobile-Specific (Grade: B)

### 6.1 No sticky mobile CTA on landing page (MEDIUM)

**What exists:** The landing page header has "Get Started Free" but it's small on mobile. Once past the hero, the only CTA is in the fixed header.

**Recommendation:** Add a sticky bottom CTA bar on mobile: "Start Free" fixed to the bottom of the viewport, appearing after the user scrolls past the hero.

### 6.2 Pricing cards scroll order on mobile (LOW)

**What exists:** 4 pricing cards in `grid-cols-1` on mobile. The "Best Value" yearly card is the 3rd of 4, requiring significant scrolling.

**Recommendation:** Reorder on mobile so Yearly (featured) appears first, or use a tab/toggle UI for mobile pricing.

### 6.3 Welcome overlay dismisses too fast (LOW)

**What exists:** `WelcomeOverlay.tsx` auto-dismisses after 5 seconds. Users still reading "Welcome to Fatherhood" have it pulled away.

**Recommendation:** Change to click-to-dismiss with optional auto-dismiss after 15-20 seconds.

### 6.4 No App Clips / Instant Apps (FUTURE)

When native apps launch, consider App Clips (iOS) for the baby cost calculator or hospital bag checklist. Useful for in-person distribution via QR codes at OB-GYN offices.

---

## Prioritized Action Plan

### Week 1: Critical Fixes (High Impact, Low Effort)

| # | Action | Effort | Why |
|---|--------|--------|-----|
| 1 | Fix free tier copy inconsistency across all surfaces | 2h | Inconsistent messaging erodes trust |
| 2 | Render grace period renewal banner on dashboard | 1h | Hook exists, never used -- free conversion recovery |
| 3 | Add step-level onboarding analytics events | 2h | Can't optimize what you can't measure |
| 4 | Standardize CTA copy, remove "Free Trial" language | 1h | Reduces cognitive friction |
| 5 | Add social proof metric to hero section | 1h | "Trusted by X families" beats nothing |
| 6 | Add money-back guarantee badge to pricing | 1h | Zero-risk signal for conversion |
| 7 | Start Reddit engagement (manual, no code) | 3h/wk | Highest-ROI $0 acquisition channel |

### Week 2: Activation & Email Infrastructure

| # | Action | Effort | Why |
|---|--------|--------|-----|
| 8 | Build email cron scheduler for all email types | 6h | Emails are built but never sent -- biggest missed loop |
| 9 | Build free-to-paid email drip (days 10, 14, 21, 28, 30) | 4h | Nothing converts free users after day 7 |
| 10 | Ungate partner invite + add shareable links | 4h | #1 viral loop currently disabled |
| 11 | Add persistent "Invite Partner" banner on dashboard | 2h | Current nudge is buried |
| 12 | Install GA4 + GTM behind cookie consent | 3h | Can't measure anything without this |
| 13 | Add UTM parameter capture on signup flow | 3h | Need attribution to optimize channels |

### Weeks 3-4: Conversion & Content

| # | Action | Effort | Why |
|---|--------|--------|-----|
| 14 | Switch article pages from force-dynamic to ISR | 2h | Fixes Core Web Vitals, enables caching |
| 15 | Add email capture to landing page (footer + lead magnet section) | 4h | Captures 60-70% of traffic that isn't ready to signup |
| 16 | Create "Expecting Dad Checklist" PDF lead magnet | 4h | Top-of-funnel asset for all channels |
| 17 | Add usage countdown banners ("3 briefings left") | 4h | Creates urgency at the right moment |
| 18 | Implement paywall gates across all 14 feature areas | 6h | Copy exists, UI doesn't |
| 19 | Move personalization into core onboarding flow | 4h | Currently buried post-onboarding |
| 20 | Ship iOS app to App Store | 2d | Entire distribution channel + credibility |

### Month 2: Growth Infrastructure

| # | Action | Effort | Why |
|---|--------|--------|-----|
| 21 | Create /blog route with listing + post pages | 2d | Foundation for organic growth |
| 22 | Write 3 cornerstone blog posts | 1d | Seeds the blog with high-value content |
| 23 | Create individual tip pages at /tips/[slug] | 4h | Each ranks for its own keywords |
| 24 | Build shareable milestone cards | 1d | Zero-cost viral distribution |
| 25 | Install Meta Pixel + Google Ads tag via GTM | 2h | Required before any paid spend |
| 26 | Build custom cancellation flow with save offers | 1d | Retains 10-30% of canceling users |
| 27 | Build referral program ("Give 1 month, get 1 month") | 2d | Compounds over time |
| 28 | Add PWA install prompt | 3h | Free engagement improvement |
| 29 | Build "Baby Cost Calculator" as public ungated tool | 2d | High-volume SEO keyword + lead magnet |
| 30 | Add social share buttons to content pages | 3h | Enables organic distribution |

### Month 3: Scale & Optimize

| # | Action | Effort | Why |
|---|--------|--------|-----|
| 31 | Create programmatic "pregnancy week" pages | 1d | Massive organic traffic opportunity |
| 32 | Build "Gift a Subscription" feature | 1d | Baby shower distribution channel |
| 33 | Create competitor comparison pages | 1d | Captures competitor search traffic |
| 34 | Run first paid ads ($150/month) | Ongoing | Meta targeting moms + Google high-intent |
| 35 | Build win-back email sequence (Day 3, 7, 14 post-cancel) | 4h | Recovers churned users |
| 36 | Collect and display real testimonials | 2h | Replace "Inside the App" with real quotes |
| 37 | Launch "For Your Partner" landing page | 4h | Better conversion when moms share |
| 38 | Build "Dad Readiness Quiz" as viral lead magnet | 1d | Shareable, high-engagement top-of-funnel |

---

## Impact Projections

If the top 10 recommendations are implemented:

- **Email automation** (items 8-9): Could convert 5-15% of free users who currently get zero nudges after day 7
- **Partner invite ungating** (items 10-11): Could 2x organic growth via the built-in viral loop (every user has exactly 1 partner)
- **Email capture + lead magnet** (items 15-16): Captures visitors not ready to signup (est. 60-70% of landing traffic)
- **GA4 + UTM tracking** (items 12-13): Enables data-driven optimization of every other initiative
- **App Store launch** (item 20): Adds an entire distribution channel + credibility signal + ASO organic discovery
- **Grace period banner** (item 2): Recovers expired premium users during their 7-day window at near-zero cost
- **Paywall expansion** (item 18): Converts free users who are already using premium features without hitting a gate

---

## Paid Ads Strategy (When Ready)

**Pre-requisites (must complete first):**
- GA4 + GTM installed
- Meta Pixel + Google Ads tag installed
- UTM parameter capture on signup
- At least one dedicated landing page variant

**Recommended First $150/month:**

| Campaign | Budget | Target | Creative |
|----------|--------|--------|----------|
| Meta: "Gift to Partner" | $100/mo | Women 25-38, pregnancy interests | "Your partner wants to help but doesn't know how. Show him The Dad Center." |
| Google: High-Intent | $50/mo | Exact match: "parenting app for dads", "expecting father app" | Text ads with "Start Free" CTA |

**Month 2 addition:**
| Retargeting | $25/mo | Site visitors who didn't sign up | Testimonials + "Start free, no credit card" |

---

## Key Files Reference

| Purpose | File Path |
|---------|-----------|
| Landing page | `apps/web/src/app/(marketing)/page.tsx` |
| Hero component | `apps/web/src/components/marketing/Hero.tsx` |
| Pricing component | `apps/web/src/components/marketing/Pricing.tsx` |
| Testimonials | `apps/web/src/components/marketing/Testimonials.tsx` |
| FinalCTA | `apps/web/src/components/marketing/FinalCTA.tsx` |
| Footer | `apps/web/src/components/marketing/Footer.tsx` |
| JSON-LD schemas | `apps/web/src/components/marketing/JsonLd.tsx` |
| Paywall overlay | `apps/web/src/components/shared/paywall-overlay.tsx` |
| Paywall copy | `packages/shared/src/constants/paywall-copy.ts` |
| Upgrade page | `apps/web/src/app/(public)/upgrade/upgrade-client.tsx` |
| Signup page | `apps/web/src/app/(auth)/signup/page.tsx` |
| Onboarding pages | `apps/web/src/app/(auth)/onboarding/` |
| Dashboard client | `apps/web/src/components/dashboard/DashboardClient.tsx` |
| Invite partner card | `apps/web/src/components/dashboard/InvitePartnerCard.tsx` |
| Upgrade prompt card | `apps/web/src/components/dashboard/UpgradePromptCard.tsx` |
| Analytics | `apps/web/src/lib/analytics.ts` |
| Subscription hook | `apps/web/src/hooks/use-subscription.ts` |
| Email edge function | `supabase/functions/send-email/index.ts` |
| Article pages | `apps/web/src/app/(marketing)/content/articles/[slug]/page.tsx` |
| Tips page | `apps/web/src/app/(marketing)/tips/page.tsx` |
| Cookie consent | `apps/web/src/components/shared/cookie-consent.tsx` |
| Root layout | `apps/web/src/app/layout.tsx` |
| Mobile app | `apps/mobile/` |
| iOS launch checklist | `apps/mobile/steps.md` |
| GTM Strategy doc | `GTM_STRATEGY.txt` |
