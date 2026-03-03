# The Dad Center — V2 Build Context

> Full spec: `@docs/v2_build_commands.md`

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
| Animation | Framer Motion 12.x |
| DB/Auth | Supabase (PostgreSQL, Auth, Realtime) |
| State | TanStack React Query 5.x |
| Payments | Stripe (web) + RevenueCat (mobile) |
| Icons | Lucide React |
| Dates | date-fns 4.x |
| Forms | React Hook Form + Zod |
| Deploy | Netlify (frontend) + Supabase Cloud (backend) |

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

### Route Groups
| Group | Path | Purpose |
|-------|------|---------|
| `(auth)` | `/login`, `/signup`, `/onboarding/*` | Auth + onboarding |
| `(main)` | `/dashboard`, `/tasks`, `/briefing`, etc. | Authenticated app |
| `(marketing)` | `/`, `/resources` | Public pages |
| `(public)` | `/upgrade` | Semi-public |

## V2 Phase Tracker

### Group A — Foundation (Sequential)
- [ ] **Phase 1:** Database Migrations (6 migrations via Supabase MCP)
- [ ] **Phase 2:** Types, Utilities & Config (`dad-journey.ts`, `phase-utils.ts`, `dad-pillar-config.ts`, `paywall-copy.ts`)
- [ ] **Phase 3:** Service Layer & Hooks (`dad-journey-service.ts`, `use-dad-journey.ts`)

### Group B — Structure (Phases 4+5 parallel, then 6)
- [ ] **Phase 4:** Onboarding Redesign (4 screens, ~45s to dashboard)
- [ ] **Phase 5:** Navigation Restructure (Briefing to bottom nav, Calendar removed)
- [ ] **Phase 6:** Router & Route Map (new routes: `/journey`, `/onboarding/ready`, `/onboarding/personalize`, `/briefing/[weekId]`)

### Group C — Features (MAX PARALLEL after Group A + Phase 6)
- [ ] **Phase 7:** Dashboard Redesign (unified feed, priority-ordered cards, role-aware)
- [ ] **Phase 8:** Dad Journey & Challenge Tiles (7 pillars, expandable tiles, `/journey` page)
- [ ] **Phase 9:** Mood Check-in System (emoji selector, flags, streaks)
- [ ] **Phase 10:** Briefings Upgrade (dedicated nav tab, week navigation, inline tasks)
- [ ] **Phase 11:** Tasks Upgrade (30-day window, calendar toggle, catch-up triage)
- [ ] **Phase 12:** Mom's Experience (Partner Activity Card, role-aware dashboard)
- [ ] **Phase 13:** Mid-Pregnancy Catch-Up UX (2-bucket triage, yellow badges)
- [ ] **Phase 14:** Notification System (premium-only push, 30-day free window)

### Group D — Monetization (Sequential)
- [ ] **Phase 15:** Free-to-Premium Upgrade Journey (3-phase: invisible → visible → urgent)
- [ ] **Phase 16:** Subscription & Paywall Implementation ($4.99/$39.99/$99.99)

### Group E — Content (Anytime after Phase 2)
- [ ] **Phase 17:** Content Generation & Seeding (63 pieces: 7 pillars × 9 phases)

## Phase Dependency Graph

```
Phase 1 → Phase 2 → Phase 3 ─┬─→ Phase 4 ─┐
                               ├─→ Phase 5 ─┤→ Phase 6 → Phases 7-14 (parallel)
                               └─→ Phase 17  └─→ Phases 15 → 16
```

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

## Bottom Nav (V2)

Home | Tasks | **Briefing** | Tracker | More

Calendar removed from nav → view toggle in Tasks page (`/tasks?view=calendar`).

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
