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
| UI | React 19.x, Tailwind CSS 4.x, Radix UI (shadcn pattern) |
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

### Color Palette (CSS Custom Properties)

**Core Surfaces (dark theme):**
- `--bg`: #12100e (page background)
- `--surface`: #1a1714 (header, sidebar, nav)
- `--card`: #201c18 (cards)
- `--card-hover`: #282420

**Text:**
- `--white`: #faf6f0 (headings)
- `--cream`: #ede6dc (body text)
- `--muted`: #7a6f62 (secondary text)
- `--dim`: #4a4239 (tertiary/disabled)

**Accent Colors:**
- `--copper`: #c4703f (primary accent, CTAs, active states)
- `--gold`: #d4a853 (premium, highlights)
- `--sage`: #6b8f71 (success, completed)
- `--coral`: #d4836b (warnings, destructive)
- `--sky`: #5b9bd5 (info, links)
- `--rose`: #c47a8f (pregnancy-related)

Each accent has a `-dim` variant (15% opacity) and `-glow` variant (25% opacity).

**Borders & Shadows:**
- `--border`: rgba(237, 230, 220, 0.08)
- `--border-hover`: rgba(237, 230, 220, 0.15)
- `--shadow-card`, `--shadow-hover`, `--shadow-lift`, `--shadow-copper`, `--shadow-gold`

### Font Usage
- `font-display` — Playfair Display: headings, hero text, card titles
- `font-body` — Jost: body text, descriptions, paragraphs
- `font-ui` — Karla: buttons, labels, badges, nav items, stats

### Animation Components (`src/components/ui/animations/`)

All pages use these animation wrappers for visual consistency:

| Component | Purpose | Usage |
|-----------|---------|-------|
| `Card3DTilt` | 3D mouse-follow tilt with gloss overlay | Wrap any card (`maxTilt={3-4}`, `gloss`) |
| `RevealOnScroll` | IntersectionObserver fade-up on scroll | Wrap sections (`delay={ms}`) |
| `CardEntrance` | "Dealt from deck" perspective+rotateX entrance | Wrap cards with stagger (`delay={index * 120}`) |
| `TypewriterGreeting` | Character-by-character typing with copper cursor | Dashboard greeting |
| `CopperDivider` | Animated line draw with traveling glow tip | After TypewriterGreeting |
| `ScrollProgressBar` | Copper-to-gold gradient progress bar at top | Marketing pages |
| `MagneticButton` | Slight translate toward cursor on hover | CTAs on marketing pages |
| `WarmBackground` | Radial gradients + noise texture overlay | Page backgrounds |
| `FloatingParticles` | CSS-animated copper/gold particles | Page backgrounds |
| `MoodEmojiPop` | 3D emoji selection with ripple | Mood check-in |

### CSS Keyframes (in `globals.css`)
- `subtitleGradient` — Animated gradient for hero subtitles
- `featuredFloat` — Floating animation for featured pricing card
- `iconPulse` — Pulsing opacity for feature icons
- `ctaGlowBreath` — Breathing glow for CTA backgrounds
- `pulseRingExpand` — Ring expansion animation
- `quoteRotate` — Slow 360deg rotation for decorative quote marks

### Utility Classes
- `.section-pre` — Section pre-label with `::after` copper line (60px)
- `.card-*-top` — Colored top border accents (copper, gold, sage, coral, sky, rose)
- `.text-gradient-copper` — Copper-to-gold gradient text

## Architecture Patterns

### Auth Flow
```
Request → Middleware → Server Layout → getServerAuth()
  → UserProvider → Client Components (useUser(), useAuth())
```
All protected routes fetch auth server-side. No client-side auth loading spinners.

### Service Pattern (`src/services/`)
```typescript
import { createClient } from '@/lib/supabase/client'
const supabase = createClient()
export const exampleService = {
  async getData(): Promise<Type | null> {
    const { data, error } = await supabase.from('table').select('*')
    if (error) throw error
    return data
  },
}
```

### Hook Pattern (`src/hooks/`)
```typescript
'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
export function useExampleData(id: string) {
  return useQuery({
    queryKey: ['example', id],
    queryFn: () => exampleService.getData(id),
    enabled: !!id,
  })
}
```

### Component Pattern
- **Server Components** (default): layouts, pages that fetch data
- **Client Components** (`'use client'`): interactive UI
- **Pages**: thin server components passing props to client components
- **Layouts**: auth checks, data fetching, context providers

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

## V2 Build Phases (All Complete)

All 17 phases have been implemented:
- **Phases 1-3:** Database migrations, types/config, service layer
- **Phases 4-6:** Onboarding redesign, navigation restructure, routing
- **Phases 7-14:** Dashboard, dad journey, mood check-in, briefings, tasks, mom's experience, catch-up UX, notifications
- **Phases 15-16:** Free-to-premium upgrade journey, subscription & paywall
- **Phase 17:** Content generation & seeding (63 pieces: 7 pillars x 9 phases)

### Visual Redesign (Post-V2)

A 13-phase "Warm Luxury Editorial" visual redesign was applied across all pages:
- Custom animation components integrated into every page
- Card3DTilt + RevealOnScroll + CardEntrance on all card-based UIs
- TypewriterGreeting + CopperDivider on dashboard header
- ScrollProgressBar + WarmBackground + FloatingParticles on marketing pages
- MagneticButton on primary CTAs
- Section pre-labels with copper accent lines
- Split-letter heading animation on hero

## Design Principles

1. **Speed to Value** — useful content within 60 seconds
2. **Neutral Third Party** — app is the authority, not either partner
3. **Yellow, Not Red** — "catch up" not "overdue"
4. **One Subscription Per Family**
5. **Role-Agnostic Navigation, Role-Aware Content**
6. **Dad-First, Not Dad-Only**
7. **Free Should Feel Complete**

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
