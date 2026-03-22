# The Dad Center -- Weekend GTM Launch Plan (March 22-23, 2026)

## Context

The Dad Center is a production web app (Next.js 16 + Supabase + Stripe) with 149 components, 12 services, 20 hooks, and a polished "Warm Luxury Editorial" design system. A mobile app (Expo/React Native) is being built in parallel but is currently an empty shell with infrastructure only. The web app is feature-complete and ready for public launch. This plan covers everything needed to go to market by this weekend.

**What exists:** Landing page (8 sections), full SEO (sitemap, JSON-LD, robots.txt, llms.txt), GA4 analytics, Stripe payments, PWA with push notifications, cookie consent, privacy/terms pages, 4 public marketing pages (/content, /budget-guide, /baby-checklists, /tips).

**Critical gaps found:** Fake stats on landing page ("10,000+ Active Dads", "4.9/5 Rating"), fabricated aggregateRating in JSON-LD, 6+ dead footer links, no OG share image, no ad pixels, no email marketing, no blog, no referral system, monthly plan missing from pricing page, no about/FAQ pages.

---

## PHASE 0: FIX CREDIBILITY RISKS (Thu Mar 19)
**These MUST be done before any public launch activity.**

### 0.1 Remove Fake Stats from Landing Page
**Files:** `apps/web/src/components/marketing/Hero.tsx`, `apps/web/src/components/marketing/Testimonials.tsx`

- Replace "10,000+ Active Dads" with "Built for First-Time Dads"
- Replace "4.9/5 User Rating" with "Medically Sourced (ACOG, AAP)"
- Keep "200+ Pre-loaded Tasks" and "47 Weekly Briefings" (real)
- Remove "Trusted by 10,000+ dads" from Testimonials section

### 0.2 Remove Fabricated Structured Data
**File:** `apps/web/src/components/marketing/JsonLd.tsx`

- Remove the `aggregateRating` block (ratingValue "4.9", ratingCount "10000") from SoftwareApplication schema
- Google can penalize or de-index for fake structured data

### 0.3 Fix Dead Footer Links
**File:** `apps/web/src/components/marketing/Footer.tsx`

- Remove links to: `/blog`, `/careers`, `/status`, `/help` (these 404)
- Keep `/about` and `/faq` (we'll create minimal versions below)
- Create minimal `/about` page -- founder story, 300 words ("I couldn't find an app that wasn't pink")
- Create `/faq` page -- reuse 6 questions from existing JSON-LD FAQ schema + add 4-6 more (competitors, data privacy, cancellation, mobile app coming soon)

### 0.4 Create OG Share Image
- Design 1200x630px image: dark bg (#12100e), copper accents, logo, tagline, dashboard screenshot
- Save to `apps/web/public/images/og-default.png`
- Reference in `apps/web/src/app/(marketing)/layout.tsx` metadata
- **Without this, every share on Reddit/Twitter/Product Hunt shows a blank preview**

### 0.5 Add Monthly Plan to Pricing
**File:** `apps/web/src/components/marketing/Pricing.tsx`

- Add $4.99/mo Monthly card (currently only shows Free/Yearly/Lifetime)
- Users wanting to try premium month-to-month have no path right now

---

## PHASE 1: PRE-LAUNCH SETUP (Thu-Fri, Mar 19-21)

### 1.1 Install Ad Pixels (even if not running ads yet -- collecting audience data)
**File:** `apps/web/src/app/layout.tsx` (root layout, via `<Script>`)

- **Meta Pixel:** Create in Facebook Business Manager. Fire `PageView` on every page, `Lead` on signup, `Purchase` on subscription
- **Google Ads tag:** Create in Google Ads. Fire conversion on signup and subscription
- Optional: Reddit Pixel (15 min setup if planning Reddit ads)

### 1.2 Define UTM Convention
```
utm_source = [platform] (producthunt, reddit, twitter, instagram, tiktok, google, meta, email)
utm_medium = [type] (organic, paid, social, email, referral)
utm_campaign = [name] (launch-weekend, ph-launch, reddit-predaddit, welcome-series)
utm_content = [variant] (hero-cta, pricing-cta, dad-origin-story)
```
Pre-build all launch links in a spreadsheet before Saturday.

### 1.3 Prepare Product Hunt Listing
Submit Friday night before midnight PST for Saturday launch.

- **Tagline (60 chars):** "The operating system for modern fatherhood"
- **Description:** "The Dad Center gives expecting dads 200+ pre-loaded tasks, weekly briefings, a real-price budget tracker, mood check-ins, and partner sync. One subscription, whole family. Built by a dad who couldn't find an app that wasn't designed for moms."
- **Maker's first comment:** 3-4 paragraphs. Origin story: every app was pink, everything started empty, no week-by-week guide for how dads think. So you built one.
- **Screenshots:** Dashboard, Weekly Briefing, Task Timeline, Budget Planner, Partner Sync (5 high-quality)
- **Topics:** Parenting, Productivity, Health, SaaS

### 1.4 Draft Reddit Posts (write now, post Saturday)

**r/predaddit (origin story):**
> Title: "I couldn't find a single pregnancy app designed for dads, so I spent [X] months building one"
> Body: Personal story. Problem. What you built. Screenshots. Free to try. Ask for honest feedback.

**r/SideProject (builder story):**
> Title: "I built a parenting command center for dads -- 200+ pre-loaded tasks, budget tracker with real prices, weekly briefings"
> Body: Tech stack (Next.js, Supabase, Stripe). What you learned. Link.

**r/daddit (value post):**
> Title: "Complete list of everything dads should prepare for before baby arrives (200+ items organized by week)"
> Body: Massive value-first post. List categories and key tasks. Bottom: "I organized all of this into an interactive app called The Dad Center."

**r/BabyBumps (mom/gift angle):**
> Title: "My husband built a pregnancy app specifically for dads -- here's what it actually includes"
> Body: Framed from partner perspective. One subscription covers both. Free tier.

### 1.5 Claim Social Media Profiles
- Twitter/X @thedadcenter: Bio, logo, banner, pinned tweet ready
- Instagram @thedadcenter: Bio, logo, link in bio
- LinkedIn company page
- TikTok @thedadcenter
Just brand them. Don't post yet.

### 1.6 Landing Page Quick CRO Fixes
**Files:** `Hero.tsx`, `Testimonials.tsx`, `FinalCTA.tsx`, `Pricing.tsx`

- Add "No credit card required. Set up in 2 minutes." below hero CTA
- Add "One subscription covers your whole family" to pricing cards
- Diversify testimonials (currently all tech professionals -- add varied roles like firefighter, teacher, business owner)
- Add FAQ section between Pricing and FinalCTA (use existing JSON-LD questions + 4 more)
- **New file:** `apps/web/src/components/marketing/FAQ.tsx`

### 1.7 Launch Weekend Discount
- Create Stripe coupon: 40% off yearly ($23.99/yr instead of $39.99) for first 100 users
- Add countdown timer to upgrade page
- Display: ~~$39.99~~ **$23.99/yr** -- Launch Weekend Only

### 1.8 Signup Flow Quick Fixes
**File:** `apps/web/src/app/(auth)/signup/page.tsx`

- Remove "Confirm Password" field (4 fields -> 3, reduces friction 10-15%)
- Add social proof below form: "Setup takes 90 seconds. 200+ tasks load automatically."
- Add mini testimonial below form
- Improve email confirmation UX: add "Check spam/promotions" text, "Resend" button, Google OAuth escape hatch

### 1.9 Add Partner Invite to Onboarding
**File:** `apps/web/src/app/(auth)/onboarding/ready/page.tsx`

- Add "Share with your partner?" with copy-invite-code button + "Skip for now"
- Currently partner invite only happens post-purchase -- this captures the excitement moment for free users too
- Key viral loop: every user has exactly 1 partner

### 1.10 Add Critical Analytics Events
**File:** `apps/web/src/lib/analytics.ts`

```typescript
// New events to add:
landing_cta_clicked (cta_location: string)
landing_section_viewed (section: string)
signup_form_started ()
signup_form_abandoned (last_field: string)
onboarding_role_selected (role: string)
onboarding_partner_invited ()
onboarding_partner_skipped ()
first_task_completed (minutes_since_signup: number)
first_briefing_viewed (minutes_since_signup: number)
paywall_shown (feature: string, variant: string)
upgrade_page_viewed (source: string)
checkout_started (plan: string, price: number)
checkout_completed (plan: string, price: number)
checkout_abandoned ()
referral_code_copied ()
referral_link_shared (channel: string)
cancel_flow_started ()
cancel_reason_selected (reason: string)
save_offer_shown (offer: string)
save_offer_accepted (offer: string)
```

---

## PHASE 2: LAUNCH DAY (Saturday Mar 22)

### Hour-by-Hour Playbook

**5:00 AM PT** -- Product Hunt goes live (submitted Friday night)

**7:00 AM** -- First social posts
- Twitter: Launch announcement + PH link
- LinkedIn: Longer founder story (5-7 sentences) + PH link
- Instagram Story: "We're live on Product Hunt!" + link sticker

**8:00 AM** -- Reddit posts
- Post r/predaddit origin story
- Post r/SideProject builder story
- Space at least 30 min apart

**10:00 AM** -- Engage
- Reply to EVERY Product Hunt comment within 10 min
- Reply to every Reddit comment
- Share PH link in 2-3 dad Discord servers

**12:00 PM** -- Second wave
- Post r/daddit value post
- Instagram carousel: "5 Things Every Expecting Dad Should Know" (6 slides, final CTA)
- Twitter thread: "7 things I learned about what dads actually need" (each tweet = feature/insight)

**3:00 PM** -- Check results
- PH ranking check. If top 5, share update. If struggling, ask 5-10 friends for honest feedback + upvote
- Post r/BabyBumps mom-angle post

**6:00 PM** -- Evening push
- Instagram Reel: 30s screen recording with trending audio. Text overlay: "What a parenting app built for dads actually looks like"
- TikTok: Cross-post same video
- Twitter: Budget tracker screenshot + "We tracked the real cost of having a baby. 165+ items. Real prices."

**9:00 PM** -- Wrap day one
- Thank PH community (final comment)
- Share day-one stats on Twitter if impressive

### Expected Day 1 Results
| Metric | Estimate |
|--------|----------|
| Product Hunt upvotes | 50-150 |
| Reddit combined views | 1,000-5,000 |
| Reddit clicks | 20-100 |
| Signups | 30-75 |
| Social followers gained | 50-200 |

---

## PHASE 3: LAUNCH WEEK (Sun Mar 23 - Fri Mar 28)

### Sunday (Day 2)
- **Hacker News:** "Show HN: I built a parenting command center for dads" -- emphasize tech angle (Next.js 16, React 19, Supabase, Turborepo)
- **Free directories:** BetaList, AlternativeTo, SaaSHub, SideProjectors, StartupBase, Indie Hackers
- **Personal emails:** Email every signup. "What would make this worth $4.99/mo to you?" -- responses inform product AND yield testimonials
- Continue Reddit engagement

### Mon-Tue (Days 3-4): Email Infrastructure
**Tech:** Resend (API key already configured). Build API route or edge function for sending.

**Welcome Sequence (6 emails, implement at least #1 and #6 this week):**

| # | Timing | Subject | Content |
|---|--------|---------|---------|
| 1 | Immediate | Your dashboard is ready, {Name} | What was loaded, link to dashboard, "Here's your first task" |
| 2 | Day 1 | Your Week {X} briefing is waiting | Preview of this week's briefing |
| 3 | Day 3 | 3 tasks due this week -- here's your priority | Top 3 tasks with "why it matters" |
| 4 | Day 5 | "I didn't even know half of these needed to happen" | Testimonial-led, social proof |
| 5 | Day 7 | Your first week: {n} tasks completed | Progress celebration, what's next |
| 6 | Day 14 | Your task window is narrowing | Soft upgrade nudge, show what they'll lose |

**Post-Purchase Sequence (3 emails):**

| # | Timing | Subject | Content |
|---|--------|---------|---------|
| 1 | Immediate | Welcome to Premium -- here's what unlocked | All premium features, "start here" |
| 2 | Day 2 | Have you invited your partner yet? | Partner sync CTA |
| 3 | Day 7 | 3 features most dads miss | Highlight underused features |

### Wed-Thu (Days 5-6): First Blog Posts
Create `/blog` route under `(marketing)`.

**Post 1:** "How Much Does Having a Baby Cost in 2026? A Real Breakdown"
- Highest SEO potential. You have REAL prices for 165+ items (unique angle)
- Categories, budget/mid/premium tiers, real product examples
- CTA: "See the interactive version at The Dad Center"

**Post 2:** "The Expecting Dad's Complete Checklist: 200+ Tasks by Week"
- High-volume keyword target. Massive resource post.
- Tasks by trimester/phase, why each matters
- CTA: "Get the interactive, auto-scheduled version free"

### Friday (Day 7): Social Content Batch
Create first week of scheduled content:
- 3 TikTok/Reels (faceless screen recordings with text overlay)
- 2 Instagram carousels ("Hospital Bag Checklist for Dads", "What Your Baby Costs: Real Numbers")
- 5 tweets (tips, stats, features, humor)

---

## PHASE 4: WEEKS 2-4 (Mar 29 - Apr 12)

### Week 2: Paid Ads ($200-300 budget)

**Google Ads ($100/week):**
- Exact match only: "parenting app for dads", "expecting father app", "dad pregnancy tracker", "baby budget calculator"
- Daily budget: $15/day
- Target CPA: under $5/signup
- Kill keywords costing >$3/click without converting after 20 clicks

**Ad copy:**
```
Headline 1: Parenting App for Dads | Free
Headline 2: 200+ Tasks Pre-Loaded by Due Date
Headline 3: Weekly Briefings + Budget Tracker
Desc 1: Finally, a pregnancy app built for dads. Pre-loaded tasks, weekly briefings, partner sync. Start free.
Desc 2: 200+ tasks, budget tracker with real prices, mood check-ins. One subscription, whole family.
```

**Meta Ads ($100/week):**

Campaign 1 -- "Gift to Partner" (target women 25-38, pregnancy/baby interests):
```
Primary: "My husband actually knows what needs to happen this week. I didn't have to tell him."
Headline: The Dad Center -- Built for Dads, Better for Both
CTA: Learn More
```

Campaign 2 -- Retargeting (website visitors who didn't sign up):
```
Primary: "You checked out The Dad Center -- here's what you're missing"
Headline: 200+ Tasks Waiting for Your Due Date
CTA: Start Free
```

### Week 2: SEO Quick Wins
- Add FAQ schema to `/budget-guide` and `/baby-checklists`
- Add BreadcrumbList schema to all public pages
- Create competitor comparison pages: `/alternatives/babycenter`, `/alternatives/what-to-expect`
- Internal link blog posts <-> public pages
- Submit new URLs to Google Search Console

### Week 2: AI Search Optimization (AEO)
- Update `llms.txt` with new blog posts and features
- Write: "Best Parenting Apps for Dads in 2026 (Honest Comparison)" -- balanced, cite-worthy
- Write: "What Should Expecting Fathers Do to Prepare?" -- comprehensive, references features naturally
- Get mentioned on 3-5 external sites (PH, BetaList, Indie Hackers, Reddit) -- AI models weight cross-site mentions heavily

### Week 2: Full Email Sequences

**Free-to-Premium Nurture (triggered by usage):**

| # | Trigger | Subject |
|---|---------|---------|
| 1 | 3rd briefing viewed | You've read 3 briefings. There are 44 more. |
| 2 | 15th task completed | 15 tasks done -- you're ahead of 80% of dads |
| 3 | Hit task window limit | Tasks from Week {X} just became available |
| 4 | Partner invited (free) | Your partner joined -- unlock real-time sync |
| 5 | 3 days before briefing window | Your weekly briefings end in 3 days |

**Re-engagement (7+ days inactive):**

| # | Timing | Subject |
|---|--------|---------|
| 1 | Day 7 | You have {n} tasks this week -- here's what's due |
| 2 | Day 14 | Week {X}: what's happening with baby right now |
| 3 | Day 21 | We saved your spot |

**Partner Invite Nudge (user didn't invite partner within 3 days):**
- Day 3: "Your partner can see everything too -- invite them in 10 seconds"
- Day 7: "Couples who use The Dad Center together complete 2x more tasks"

### Week 3: Referral Program

**Mechanics:**
- Referrer gets: 1 free month of premium per successful referral (up to 6 months)
- Referee gets: 7-day premium trial
- "Successful" = referee completes onboarding + active 7 days

**Implementation:**
- New tables: `referral_codes` (user_id, code, uses), `referrals` (referrer_id, referee_id, status)
- Landing page param: `thedadcenter.com/?ref=ABCD12`
- Integration points: Settings page, post-onboarding ready page, dashboard sidebar, post-purchase page, email signatures

**Share templates:**
- Twitter: "Just found @TheDadCenter -- 200+ tasks auto-loaded the moment I entered our due date. {link}"
- Text/WhatsApp: "Check out The Dad Center. Auto-loads 200+ tasks based on your due date. Use my link for a free premium week: {link}"

### Week 3: Cold Outreach to Dad Bloggers/Podcasts (15-20 targets)

```
Subject: Built something your audience might genuinely use

Hey [Name],

I've been following your [podcast/blog/TikTok] -- loved your [specific piece] about [topic].

I'm a developer and expecting dad who spent [X] months building The Dad Center
(thedadcenter.com) because I couldn't find a single pregnancy app that wasn't
designed for moms. 200+ pre-loaded tasks, weekly briefings, budget tracker with
real prices, partner sync.

Try it free (premium access, no strings) and share your honest take if useful.
Happy to jump on your show if the story resonates.

[Your name]
```

**Targets:** The Dad Edge, Dad Tired, First Time Dad Podcast, Dad Verbs, TikTok/IG creators with 1K-20K followers (#expectingdad, #firsttimedad, #dadprep)

### Week 3: Churn Prevention

**Custom cancel flow** (replace Stripe portal redirect):

1. "Before you cancel, can you tell us why?" (Too expensive / Not using it enough / Missing features / Found alternative / Other)
2. Based on reason, show a save offer:
   - "Too expensive" -> 50% off for 3 months ($1.67/mo)
   - "Not using enough" -> Pause for up to 3 months
   - "Missing features" -> Feature request form + "We ship weekly"
3. If still cancelling: "Active until {date}. Resubscribe anytime."

**Win-back sequence (post-cancellation):**

| # | Timing | Subject |
|---|--------|---------|
| 1 | Day 3 | You still have {n} tasks coming up this week |
| 2 | Day 14 | Week {X}: here's what you missed |
| 3 | Day 30 | We've added 12 new features since you left (30% off comeback) |

### Week 4: Lead Magnets & Free Tools

**Lead Magnet:** "The Expecting Dad's Master Checklist" (PDF)
- Export 200+ tasks as beautifully formatted PDF
- Gate behind email on `/checklist-download` page
- Distribute on Pinterest, parenting forums, Facebook groups

**Free Tool 1:** Due Date Calculator
- Public page: enter LMP or conception date -> shows due date, week, trimester
- Below result: "Get weekly briefings and 200+ tasks for your journey -- free"
- SEO target: "due date calculator" (very high volume)

**Free Tool 2:** Baby Cost Calculator
- Simplified public version of budget planner
- Enter preferences -> estimated first-year costs
- CTA: "Get the full interactive tracker with 165+ items free"

**Free Tool 3:** Hospital Bag Checklist (Interactive)
- Public page, check items off without login
- Bottom: "Save progress and get 14 more checklists free"

All under `(marketing)` route group with full SEO metadata.

---

## CONVERSION OPTIMIZATION DETAIL

### Paywall Strategy Refinements

**Briefing soft gate (P1):** Show first 2 sections (Baby Update + Mom Update) of any briefing, blur "Dad Focus" section (the most valuable). Users see what they're missing.

**Task soft gate:** Show all tasks from all phases but disable "complete" on tasks outside free window. "This task is outside your free 30-day window. Upgrade to mark it complete."

**Budget soft gate:** Show all categories/items but hide prices. "Unlock real pricing data for 165+ baby items."

**Usage-based upgrade prompts:**

| Trigger | Action |
|---------|--------|
| 10th task completed | Congratulatory modal + soft upgrade nudge |
| 3rd briefing viewed | "1 week left on free briefings" banner |
| Day 7 of free tier | Dashboard upgrade card (persistent) |
| Day 25 (5 days before window) | PaywallModal with countdown |
| 80%+ tasks completed in window | "47 more tasks waiting in next trimester" |

**Rule:** Max 1 upgrade prompt per session (excluding actual feature blocks).

### Popup/Modal Strategy

**Exit-intent (landing page, non-authenticated visitors only):**
```
Headline: Before you go -- your due date unlocks 200+ tasks
Body: Enter your due date and see exactly what to do this week. Free forever.
CTA: [Enter Due Date] -> /signup
Secondary: "No thanks, I'll keep Googling"
```
Show once per session, only after 50% scroll depth.

**Launch countdown banner (top of page):**
"Launch Weekend: First 100 families get extended premium trial -- {countdown}"
Dismiss once, stays dismissed via localStorage.

### Onboarding CRO

**Make the task generation screen more engaging:**
Currently shows generic "Generating personalized tasks..." progress bar. Instead, show specific task previews appearing one by one:
- "Schedule 20-week anatomy scan... added"
- "Research pediatricians in your area... added"
- "Set up baby registry... added"

**Post-onboarding quick start:**
Instead of just "Go to Dashboard", show 3 options: "Read This Week's Briefing", "See Your Tasks", "Explore Budget Planner" -- gets to aha moment faster.

---

## ANALYTICS & KPIs

### Key Metrics by Funnel Stage

| Stage | Metric | Day 1 Target | Week 1 Target |
|-------|--------|-------------|---------------|
| Awareness | Unique visitors | 200-500 | 1,000-2,000 |
| Signup | Visitor->Signup rate | 10-15% | 8-12% |
| Activation | Onboarding completion | 60%+ | 65%+ |
| Engagement | Day-1 retention | 40%+ | 40%+ |
| Revenue | Free->Paid (30 day) | -- | 3-5% |

### GA4 Funnels to Set Up
- Landing -> Signup Page -> Signup Complete -> Onboarding Complete -> First Task
- Upgrade Page Viewed -> Checkout Started -> Purchase Complete

---

## BUDGET SUMMARY

| Phase | Spend | Notes |
|-------|-------|-------|
| Pre-Launch (Thu-Fri) | $0 | Content creation and setup |
| Launch Weekend | $0-50 | Optional $50 Reddit ad |
| Week 1 | $50-100 | Canva Pro ($13), optional Meta retargeting test |
| Weeks 2-4 | $300-500 | Google Ads ($200), Meta Ads ($200), micro-influencer ($100-200) |
| **Total Month 1** | **$350-650** | |

---

## WHAT TO SKIP (solo dev ruthless prioritization)

Do NOT do before or during launch weekend:
- TikTok content creation (week 2)
- YouTube channel (month 2)
- Pinterest (month 2)
- Podcast outreach (week 3)
- Blog beyond 2 posts (ongoing cadence)
- Referral program implementation (week 3)
- A/B testing (need traffic first)
- Competitor comparison pages (week 2-3)
- Re-engagement email sequences (week 2)
- Automation workflows (month 2)
- Custom cancel flow (week 3)

**Focus this weekend:** Fix credibility issues, OG image, dead links, Product Hunt, Reddit, first social posts.

---

## CRITICAL FILES TO MODIFY

| File | Changes |
|------|---------|
| `apps/web/src/components/marketing/Hero.tsx` | Remove fake stats, add de-risker text below CTA |
| `apps/web/src/components/marketing/JsonLd.tsx` | Remove fabricated aggregateRating |
| `apps/web/src/components/marketing/Footer.tsx` | Remove dead links, add /faq and /about |
| `apps/web/src/components/marketing/Pricing.tsx` | Add $4.99/mo plan, "one family" callout |
| `apps/web/src/components/marketing/Testimonials.tsx` | Remove fake "10,000+ dads" claim, diversify testimonials |
| `apps/web/src/components/marketing/FinalCTA.tsx` | Launch countdown + urgency for launch weekend |
| `apps/web/src/app/(marketing)/layout.tsx` | Add OG image metadata |
| `apps/web/src/app/(auth)/signup/page.tsx` | Remove confirm password, add social proof, improve confirmation UX |
| `apps/web/src/app/(auth)/onboarding/ready/page.tsx` | Add partner invite with copy-code button |
| `apps/web/src/lib/analytics.ts` | Add funnel events (CTA clicks, signup stages, activation, paywall) |
| `apps/web/src/app/layout.tsx` | Add Meta Pixel + Google Ads tag |
| **New:** `apps/web/src/components/marketing/FAQ.tsx` | FAQ accordion section for landing page |
| **New:** `apps/web/src/app/(marketing)/about/page.tsx` | Founder story page |
| **New:** `apps/web/src/app/(marketing)/faq/page.tsx` | Standalone FAQ page |
| **New:** `apps/web/src/components/marketing/ExitIntentPopup.tsx` | Exit-intent email capture |

---

## VERIFICATION CHECKLIST

- [ ] `pnpm run build` passes (apps/web)
- [ ] No fake stats on landing page (search for "10,000" and "4.9")
- [ ] OG image renders on Twitter Card Validator and Facebook Debugger
- [ ] All footer links resolve (no 404s)
- [ ] Monthly plan visible on pricing section
- [ ] Product Hunt listing submitted and approved
- [ ] Reddit posts drafted and ready
- [ ] Social profiles claimed and branded
- [ ] UTM links spreadsheet ready
- [ ] GA4 new events firing (test in debug mode)
- [ ] Stripe launch discount coupon created and working
- [ ] Welcome email sends on signup (Resend)
