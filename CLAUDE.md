# The Dad Center — Project Context

> The operating system for modern fatherhood. Built by dads, for dads who refuse to wing it.

## What This App Is

The Dad Center is a pregnancy & parenting companion app designed primarily for dads (but also moms). It provides week-by-week briefings, task management, mood tracking, budget planning, checklists, and a "dad journey" system with challenge tiles across 7 pillars. One subscription covers the whole family — both partners share access.

## Branding & Pricing Constants

- **Brand:** The Dad Center (never "ParentLogs")
- **Domain:** thedadcenter.com
- **Pricing:** $4.99/mo | $39.99/yr ($3.33/mo) | $99.99 lifetime
- **Free task window:** 30-day rolling (not 14-day)
- **Free briefing window:** 4 weeks from signup
- **Free push notifications:** 30 days from signup
- **Family subscription:** One subscription per family — both partners share access

## Tech Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 16.1.x (App Router) |
| UI | React 19.x, Tailwind CSS 3.x, Radix UI (shadcn pattern) |
| Animation | Framer Motion 12.x + custom animation components |
| DB/Auth | Supabase (PostgreSQL, Auth, Realtime) |
| State | TanStack React Query 5.x |
| Payments | Stripe (web) + RevenueCat (mobile) |
| Icons | Lucide React |
| Dates | date-fns 4.x |
| Forms | React Hook Form + Zod |
| Deploy | Netlify (frontend) + Supabase Cloud (backend) |
| Fonts | Playfair Display (display), Jost (body), Karla (UI) |

## Design System — "Warm Luxury Editorial"
See `.claude/rules/design-system.md` for full color palette, fonts, animation components, and CSS details.
Key: Dark theme, copper/gold accents, Playfair Display + Jost + Karla fonts, 10 animation wrapper components.

## Architecture Patterns

### Auth Flow
```
Request → Middleware → Server Layout → getServerAuth()
  → UserProvider → Client Components (useUser(), useAuth())
```
All protected routes fetch auth server-side. No client-side auth loading spinners.

### Patterns
See `.claude/rules/` for detailed service, hook, component, migration, and page patterns.

## Project Structure

```
src/
├── app/
│   ├── (auth)/          # login, signup, onboarding (no nav)
│   ├── (main)/          # dashboard, tasks, briefing, tracker, etc. (full app chrome)
│   ├── (marketing)/     # landing page, resources (marketing layout)
│   ├── (public)/        # upgrade page
│   └── api/             # stripe webhooks, account deletion
├── components/
│   ├── briefings/       # BriefingHero, BriefingSection, BabySizeCard, etc.
│   ├── budget/          # TierFilter, ProductExamplesDrawer
│   ├── dashboard/       # 20+ dashboard cards + dad-journey/ subfolder
│   ├── layouts/         # main-layout-client.tsx (header, sidebar, bottom nav)
│   ├── marketing/       # Hero, Features, Pricing, Testimonials, etc.
│   ├── shared/          # timeline bars, paywall overlay, partner activity
│   ├── tasks/           # task items, filters, progress, animations
│   └── ui/              # shadcn primitives + animations/ subfolder
├── hooks/               # 18 React Query hooks
├── lib/                 # supabase/, auth/, stripe/, utils, config files
├── services/            # 9 domain services (briefing, budget, task, etc.)
└── types/               # TypeScript types (database, dashboard, dad-journey)
```

### Route Groups & Navigation

| Group | Path | Auth | Layout |
|-------|------|------|--------|
| `(auth)` | `/login`, `/signup`, `/onboarding/*` | No (except onboarding) | Minimal (WarmBackground + FloatingParticles) |
| `(main)` | `/dashboard`, `/tasks`, `/briefing`, `/tracker`, etc. | Yes + family required | Full app chrome (header, sidebar, bottom nav) |
| `(marketing)` | `/`, `/resources` | No | Marketing (ScrollProgressBar, header, footer) |
| `(public)` | `/upgrade` | Varies | Minimal |

**Bottom Nav (mobile):** Home | Tasks | Briefing | Tracker | More
**Sidebar (desktop):** Same items + Tools (Checklists, Budget) + Family + Account sections

### Key Pages

| Page | File | Description |
|------|------|-------------|
| Landing | `(marketing)/page.tsx` | Hero, Features, HowItWorks, Testimonials, Pricing, FinalCTA |
| Dashboard | `(main)/dashboard/page.tsx` | Priority-ordered cards, role-aware |
| Tasks | `(main)/tasks/page.tsx` | Timeline bar, filters, task sections, calendar toggle |
| Briefing | `(main)/briefing/page.tsx` | Week navigation pills, hero, sections |
| Budget | `(main)/budget/page.tsx` | Timeline bar, tier filter, browse/my-budget tabs |
| Journey | `(main)/journey/page.tsx` | 7 challenge pillar tiles |
| Tracker | `(main)/tracker/page.tsx` | Baby development tracking |

## Key Enums (Supabase)

```
family_stage: 'pregnancy' | 'first-trimester' | 'second-trimester' | 'third-trimester' | 'post-birth'
dad_challenge_pillar: 'knowledge' | 'planning' | 'finances' | 'anxiety' | 'baby_bonding' | 'relationship' | 'extended_family'
content_phase: 'pre-pregnancy' | 'trimester-1' | 'trimester-2' | 'trimester-3' | '0-3-months' | '3-6-months' | '6-12-months' | '12-18-months' | '18-plus'
mood_level: 'struggling' | 'rough' | 'okay' | 'good' | 'great'
catch_up_behavior: 'expired' | 'likely_done' | 'catch_up'
subscription_tier: 'free' | 'premium' | 'lifetime'
task_assignee: 'mom' | 'dad' | 'both' | 'either'
user_role: 'mom' | 'dad' | 'other'
```

## Timeline Categories (Tasks & Budget)

Both the tasks and budget pages use 9 timeline categories for phase-based navigation:
- Trimester 1, Trimester 2, Trimester 3, Delivery
- 0-3 Months, 3-6 Months, 6-12 Months, 12-18 Months, 18+ Months

These render as pill-button navigation (similar to the Briefing page's week number UI) with copper highlights for current/selected phases.

## Dashboard Card Priority (Dad)

1. Mood Check-in (collapses after check-in)
2. Shift Briefing (post-birth + partner logged)
3. Briefing Teaser (always)
4. Tasks Due This Week
5. On Your Mind (2 challenge tiles)
6. Quick Actions
7. Personalize Card / Invite Partner
8. Budget Snapshot
9. Checklist Progress

Mom sees Partner Activity Card at position 1 instead of Mood Check-in. No On Your Mind tiles.

## Build Status
V2 complete (17 phases) + "Warm Luxury Editorial" visual redesign (13 phases). All animation components integrated across every page.

## Design Principles

1. **Speed to Value** — useful content within 60 seconds
2. **Neutral Third Party** — app is the authority, not either partner
3. **Yellow, Not Red** — "catch up" not "overdue"
4. **One Subscription Per Family**
5. **Role-Agnostic Navigation, Role-Aware Content**
6. **Dad-First, Not Dad-Only**
7. **Free Should Feel Complete**

## Gotchas
- Brand is "The Dad Center" — NEVER use "ParentLogs" anywhere user-facing
- Free task window is **30-day rolling**, not 14-day
- Free briefing window: **4 weeks from signup**, not unlimited
- Tailwind CSS **v3.4.x** — uses `tailwind.config.ts` with v3 plugin pattern
- React **19** — new hooks and features available (use, useActionState, etc.)
- Framer Motion **12.x** — API changes from v10/v11
- Animation components are wrappers — use `<FadeIn>`, `<SlideUp>`, etc., don't write raw framer-motion
- Pricing is $4.99/$39.99/$99.99 — triple-check any pricing display

## Session Checklist
- Is Build Status / Current Status still accurate?
- Any new patterns discovered? → update .claude/rules/ or Conventions
- Any recurring issues? → add to Gotchas
- Any architectural decisions made? → update Architecture section

## Verification Checklist

- `npm run build` passes with zero errors
- All 6 Supabase migrations applied
- `get_advisors` returns no security warnings
- Navigation: Home, Tasks, Briefing, Tracker, More
- Dashboard: unified feed with priority-ordered cards
- Pricing: $4.99/$39.99/$99.99 everywhere
- Branding: "The Dad Center" everywhere
- Task window: 30-day (not 14-day)
- Briefing window: 4 weeks from signup
- All animation components integrated on every page
- Header: logo and week badge baseline-aligned
