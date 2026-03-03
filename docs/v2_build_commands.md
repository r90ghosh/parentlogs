# The Dad Center — V2 Build Commands

**Version:** 2.0
**Status:** APPROVED
**Updated:** March 2026
**Domain:** thedadcenter.com

> This document is the single source of truth for the V2 redesign. All file paths, patterns, and conventions reference the **actual codebase** (Next.js 16 + App Router). Build phases are ordered for minimal rework.

---

## Table of Contents

1. [Tech Stack & Architecture](#1-tech-stack--architecture)
2. [Codebase Conventions](#2-codebase-conventions)
3. [What Changed — V1 vs V2](#3-what-changed--v1-vs-v2)
4. [Phase 1 — Database Migrations](#4-phase-1--database-migrations)
5. [Phase 2 — Types, Utilities & Config](#5-phase-2--types-utilities--config)
6. [Phase 3 — Service Layer & Hooks](#6-phase-3--service-layer--hooks)
7. [Phase 4 — Onboarding Redesign](#7-phase-4--onboarding-redesign)
8. [Phase 5 — Navigation Restructure](#8-phase-5--navigation-restructure)
9. [Phase 6 — Router & Route Map](#9-phase-6--router--route-map)
10. [Phase 7 — Dashboard Redesign](#10-phase-7--dashboard-redesign)
11. [Phase 8 — Dad Journey & Challenge Tiles](#11-phase-8--dad-journey--challenge-tiles)
12. [Phase 9 — Mood Check-in System](#12-phase-9--mood-check-in-system)
13. [Phase 10 — Briefings Upgrade](#13-phase-10--briefings-upgrade)
14. [Phase 11 — Tasks Upgrade](#14-phase-11--tasks-upgrade)
15. [Phase 12 — Mom's Experience](#15-phase-12--moms-experience)
16. [Phase 13 — Mid-Pregnancy Catch-Up UX](#16-phase-13--mid-pregnancy-catch-up-ux)
17. [Phase 14 — Notification System](#17-phase-14--notification-system)
18. [Phase 15 — Free-to-Premium Upgrade Journey](#18-phase-15--free-to-premium-upgrade-journey)
19. [Phase 16 — Subscription & Paywall Implementation](#19-phase-16--subscription--paywall-implementation)
20. [Phase 17 — Content Generation & Seeding](#20-phase-17--content-generation--seeding)
21. [Feature Access Matrix](#21-feature-access-matrix)
22. [Upgrade Trigger Locations](#22-upgrade-trigger-locations)
23. [File Summary — New, Modified, Deleted](#23-file-summary--new-modified-deleted)
24. [Verification Plan](#24-verification-plan)
25. [Design Principles](#25-design-principles)

---

## 1. Tech Stack & Architecture

| Layer | Technology | Version |
|-------|-----------|---------|
| **Framework** | Next.js (App Router) | 16.1.x |
| **UI Library** | React | 19.x |
| **Language** | TypeScript | 5.x |
| **Database** | PostgreSQL via Supabase | — |
| **Auth** | Supabase Auth (email + Google OAuth) | — |
| **Realtime** | Supabase Realtime | — |
| **ORM/Client** | @supabase/supabase-js + @supabase/ssr | 2.89.x / 0.8.x |
| **State/Fetching** | TanStack React Query | 5.x |
| **Styling** | Tailwind CSS | 4.x |
| **Animation** | Framer Motion | 12.x |
| **UI Primitives** | Radix UI (shadcn/ui pattern) | — |
| **Icons** | Lucide React | 0.562.x |
| **Payments** | Stripe (web) + RevenueCat (mobile) | — |
| **Dates** | date-fns | 4.x |
| **Forms** | React Hook Form + Zod | — |
| **Deployment** | Netlify (frontend) + Supabase Cloud (backend) | — |

### Auth Flow (Server-Side)

```
Request → Next.js Middleware (src/lib/supabase/middleware.ts)
  → Server Component Layout (src/app/(main)/layout.tsx)
    → getServerAuth() (src/lib/supabase/server-auth.ts)
      → returns { user, profile, family }
    → UserProvider (src/components/user-provider.tsx)
      → Client Components use useUser() hook
      → Client Components use useAuth() hook (src/lib/auth/auth-context.tsx)
```

**Key principle:** All protected routes fetch auth data server-side via `getServerAuth()`. Data flows to client components through `UserProvider`. No client-side loading spinners for auth state.

### Route Groups

| Group | Path | Purpose |
|-------|------|---------|
| `(auth)` | `src/app/(auth)/` | Login, signup, onboarding, password reset |
| `(main)` | `src/app/(main)/` | All authenticated app pages (dashboard, tasks, etc.) |
| `(marketing)` | `src/app/(marketing)/` | Landing page, resources, articles |
| `(public)` | `src/app/(public)/` | Upgrade page (accessible without family setup) |

---

## 2. Codebase Conventions

### File Organization

```
src/
├── app/                          # Next.js App Router pages
│   ├── (auth)/                   # Auth route group
│   │   ├── layout.tsx            # Auth layout (no nav)
│   │   ├── login/page.tsx
│   │   ├── signup/page.tsx
│   │   ├── onboarding/           # Onboarding flow
│   │   │   ├── layout.tsx
│   │   │   ├── role/page.tsx
│   │   │   ├── family/page.tsx
│   │   │   ├── invite/page.tsx
│   │   │   └── complete/page.tsx
│   │   └── ...
│   ├── (main)/                   # Main app route group
│   │   ├── layout.tsx            # Server layout (auth + UserProvider)
│   │   ├── dashboard/page.tsx
│   │   ├── tasks/page.tsx
│   │   ├── briefing/page.tsx
│   │   ├── tracker/page.tsx
│   │   └── ...
│   ├── (marketing)/              # Public pages
│   ├── (public)/                 # Semi-public pages
│   └── api/                      # API routes
├── components/
│   ├── layouts/                  # Layout components
│   │   └── main-layout-client.tsx  # Nav + header + sidebar
│   ├── dashboard/                # Dashboard card components
│   ├── tasks/                    # Task components
│   ├── briefings/                # Briefing components
│   ├── budget/                   # Budget components
│   ├── shared/                   # Shared components (paywall, etc.)
│   ├── ui/                       # Radix/shadcn primitives
│   ├── user-provider.tsx         # User context provider
│   └── ...
├── services/                     # Supabase query layer
│   ├── briefing-service.ts
│   ├── task-service.ts
│   ├── tracker-service.ts
│   ├── budget-service.ts
│   └── ...
├── hooks/                        # React Query hooks
│   ├── use-dashboard.ts
│   ├── use-tasks.ts
│   ├── use-briefings.ts
│   └── ...
├── lib/                          # Utilities & config
│   ├── supabase/                 # Supabase clients
│   │   ├── client.ts             # Browser client
│   │   ├── server.ts             # Server client
│   │   ├── server-auth.ts        # getServerAuth()
│   │   └── middleware.ts         # Auth middleware
│   ├── auth/
│   │   └── auth-context.tsx      # useAuth() hook (signOut, etc.)
│   ├── pregnancy-utils.ts        # Phase/stage utilities
│   └── ...
├── types/
│   ├── index.ts                  # Core types (User, Family, Task, etc.)
│   └── dashboard.ts              # Dashboard-specific types
└── ...
```

### Service Pattern

Services live in `src/services/` and handle all Supabase queries:

```typescript
// src/services/example-service.ts
import { createClient } from '@/lib/supabase/client'
const supabase = createClient()

export const exampleService = {
  async getData(): Promise<DataType | null> {
    const { data, error } = await supabase
      .from('table_name')
      .select('*')
      .eq('column', value)
    if (error) throw error
    return data
  },
}
```

### Hook Pattern

Hooks live in `src/hooks/` and wrap services with React Query:

```typescript
// src/hooks/use-example.ts
'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { exampleService } from '@/services/example-service'

export function useExampleData(id: string) {
  return useQuery({
    queryKey: ['example', id],
    queryFn: () => exampleService.getData(id),
    enabled: !!id,
  })
}

export function useUpdateExample() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: exampleService.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['example'] })
    },
  })
}
```

### Component Pattern

- **Server Components** (default): Used for layouts and pages that fetch data
- **Client Components** (`'use client'`): Used for interactive UI
- **Page files** (`page.tsx`): Thin server components that pass props to client components
- **Layout files** (`layout.tsx`): Handle auth checks, data fetching, context providers

### Existing Enums (in Supabase)

```typescript
family_stage: 'pregnancy' | 'first-trimester' | 'second-trimester' | 'third-trimester' | 'post-birth'
log_type: 'feeding' | 'diaper' | 'sleep' | 'temperature' | 'medicine' | 'vitamin_d' | 'mood' | 'weight' | 'height' | 'milestone' | 'custom'
subscription_tier: 'free' | 'premium' | 'lifetime'
task_assignee: 'mom' | 'dad' | 'both' | 'either'
task_priority: 'must-do' | 'good-to-do'
task_status: 'pending' | 'completed' | 'skipped' | 'snoozed'
user_role: 'mom' | 'dad' | 'other'
```

---

## 3. What Changed — V1 vs V2

| Area | V1 (Current) | V2 (This Build) |
|------|-------------|-----------------|
| **Branding** | ParentLogs → The Dad Center | "The Dad Center" everywhere |
| **Onboarding** | 5 screens (welcome → role → family → invite → complete) | 4 screens (~45s). Partner invite + dad profile deferred to dashboard cards. |
| **Dashboard** | Static card grid (hero + sidebar) | Single unified feed. Priority-ordered cards. Role-aware. |
| **Bottom Nav** | Home, Tasks, Calendar, Tracker + More | Home, Tasks, Briefing, Tracker + More |
| **Calendar** | Dedicated bottom nav item | View toggle within Tasks page |
| **Briefings** | Inside More drawer | Dedicated bottom nav tab |
| **Dad Journey** | Not present | 7 challenge pillar tiles, /journey page, mood check-ins |
| **Task Window (Free)** | 14-day rolling | **30-day rolling** |
| **Briefing Window (Free)** | Current week + 4 adjacent | **4 weeks from signup** |
| **Pricing** | $5.99/$49.99 | **$4.99/mo, $39.99/yr, $99.99 lifetime** |
| **Mom Experience** | Same as dad | Coordination-focused: Partner Activity card replaces mood check-in |
| **Catch-Up** | Basic backlog triage | 2-bucket triage: auto-handled + catch-up with yellow badges |
| **Paywall** | Simple locked/unlocked | 3-phase journey: invisible (D1-7), visible (D8-21), urgent (D22+) |
| **Notifications** | Always available | Premium-only (first 30 days free) |
| **Push Notifications** | Available to all | **30-day free window**, then premium |
| **Budget Planner** | Partially gated | **ALL FREE** |
| **Checklists** | 10 free / 5 premium | **ALL FREE** (15+ checklists, 350+ items) |
| **Data Export** | Premium | **ALL FREE** (GDPR/CCPA compliance) |

---

## 4. Phase 1 — Database Migrations

### Migration 1: `dad_challenge_content` table

```sql
-- New enum for challenge pillars
CREATE TYPE dad_challenge_pillar AS ENUM (
  'knowledge', 'planning', 'finances', 'anxiety',
  'baby_bonding', 'relationship', 'extended_family'
);

-- Content phases (broader than family_stage)
-- Uses TEXT with CHECK for flexibility across pre-pregnancy through 18+ months
CREATE TABLE dad_challenge_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pillar dad_challenge_pillar NOT NULL,
  phase TEXT NOT NULL CHECK (phase IN (
    'pre-pregnancy', 'trimester-1', 'trimester-2', 'trimester-3',
    '0-3-months', '3-6-months', '6-12-months', '12-18-months', '18-plus'
  )),
  headline TEXT NOT NULL,
  preview TEXT NOT NULL,
  icon TEXT NOT NULL,
  narrative TEXT NOT NULL,               -- Markdown, 500-1000 words
  action_items JSONB NOT NULL DEFAULT '[]',  -- [{title, description}]
  dad_quotes JSONB NOT NULL DEFAULT '[]',    -- [{quote, attribution}]
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_premium BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(pillar, phase)
);

CREATE INDEX idx_dad_challenge_phase ON dad_challenge_content(phase);
CREATE INDEX idx_dad_challenge_pillar ON dad_challenge_content(pillar);
```

### Migration 2: `dad_profiles` table

```sql
CREATE TABLE dad_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  work_situation TEXT CHECK (work_situation IN (
    'full-time', 'part-time', 'remote', 'hybrid',
    'self-employed', 'stay-at-home', 'looking'
  )),
  is_first_time_dad BOOLEAN,
  concerns TEXT[] DEFAULT '{}',          -- Array of concern keys
  partner_relationship TEXT CHECK (partner_relationship IN (
    'great', 'good', 'complicated', 'struggling', 'single', 'prefer-not-say'
  )),
  family_nearby BOOLEAN,
  has_friend_support BOOLEAN,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id)
);

CREATE INDEX idx_dad_profiles_user ON dad_profiles(user_id);
```

### Migration 3: `mood_checkins` table

```sql
CREATE TABLE mood_checkins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  family_id UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
  mood TEXT NOT NULL CHECK (mood IN ('struggling', 'rough', 'okay', 'good', 'great')),
  situation_flags TEXT[] DEFAULT '{}',   -- e.g., ['sleep_deprived', 'argued_partner']
  note TEXT,
  phase TEXT,                            -- Content phase at time of check-in
  checked_in_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_mood_user ON mood_checkins(user_id);
CREATE INDEX idx_mood_family ON mood_checkins(family_id);
CREATE INDEX idx_mood_checked_in ON mood_checkins(checked_in_at);
```

### Migration 4: Add `catch_up_behavior` to `task_templates`

```sql
ALTER TABLE task_templates
  ADD COLUMN catch_up_behavior TEXT
  CHECK (catch_up_behavior IN ('expired', 'likely_done', 'catch_up'))
  DEFAULT 'catch_up';
```

### Migration 5: Add `signup_week` to `profiles`

```sql
-- Track the week when user signed up (for free window calculations)
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS signup_week INTEGER;
```

### Migration 6: RLS Policies

```sql
-- dad_challenge_content: read-only for all authenticated users
ALTER TABLE dad_challenge_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can read challenge content"
  ON dad_challenge_content FOR SELECT
  TO authenticated
  USING (true);

-- dad_profiles: users can CRUD their own
ALTER TABLE dad_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own dad profile"
  ON dad_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own dad profile"
  ON dad_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own dad profile"
  ON dad_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own dad profile"
  ON dad_profiles FOR DELETE USING (auth.uid() = user_id);

-- mood_checkins: users can CRUD own, read family members'
ALTER TABLE mood_checkins ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can insert own mood checkins"
  ON mood_checkins FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can read family mood checkins"
  ON mood_checkins FOR SELECT
  USING (family_id IN (
    SELECT family_id FROM profiles WHERE id = auth.uid()
  ));
CREATE POLICY "Users can update own mood checkins"
  ON mood_checkins FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own mood checkins"
  ON mood_checkins FOR DELETE USING (auth.uid() = user_id);
```

---

## 5. Phase 2 — Types, Utilities & Config

### New file: `src/types/dad-journey.ts`

```typescript
// Challenge pillar enum
export type DadChallengePillar =
  | 'knowledge' | 'planning' | 'finances' | 'anxiety'
  | 'baby_bonding' | 'relationship' | 'extended_family'

// Content phases (maps from family_stage + current_week)
export type ContentPhase =
  | 'pre-pregnancy' | 'trimester-1' | 'trimester-2' | 'trimester-3'
  | '0-3-months' | '3-6-months' | '6-12-months' | '12-18-months' | '18-plus'

// Challenge content row
export interface DadChallengeContent {
  id: string
  pillar: DadChallengePillar
  phase: ContentPhase
  headline: string
  preview: string
  icon: string
  narrative: string
  action_items: { title: string; description: string }[]
  dad_quotes: { quote: string; attribution: string }[]
  sort_order: number
  is_premium: boolean
}

// Dad profile (from onboarding + personalize card)
export interface DadProfile {
  id: string
  user_id: string
  work_situation: string | null
  is_first_time_dad: boolean | null
  concerns: string[]
  partner_relationship: string | null
  family_nearby: boolean | null
  has_friend_support: boolean | null
}

// Mood types
export type MoodLevel = 'struggling' | 'rough' | 'okay' | 'good' | 'great'

export interface MoodCheckin {
  id: string
  user_id: string
  family_id: string
  mood: MoodLevel
  situation_flags: string[]
  note: string | null
  phase: ContentPhase | null
  checked_in_at: string
}

// Pillar display config
export interface PillarConfig {
  pillar: DadChallengePillar
  label: string
  icon: string
  color: string
  gradient: string
  borderColor: string
}

// Mood display config
export interface MoodConfig {
  level: MoodLevel
  emoji: string
  label: string
  color: string
}

// Situation flag config
export interface SituationFlag {
  key: string
  emoji: string
  label: string
}

// Dad concern option (for onboarding)
export interface DadConcern {
  key: string
  emoji: string
  label: string
}
```

### New file: `src/lib/phase-utils.ts`

Maps `family_stage` + `current_week` → `ContentPhase`. Reuses `isPregnancyStage()` from `src/lib/pregnancy-utils.ts`.

```typescript
import { FamilyStage, ContentPhase } from '@/types'
import { isPregnancyStage } from '@/lib/pregnancy-utils'

export function getContentPhase(stage: FamilyStage, currentWeek: number): ContentPhase {
  if (isPregnancyStage(stage)) {
    if (currentWeek <= 13) return 'trimester-1'
    if (currentWeek <= 27) return 'trimester-2'
    return 'trimester-3'
  }

  // Post-birth (currentWeek = weeks since birth)
  if (currentWeek <= 13) return '0-3-months'
  if (currentWeek <= 26) return '3-6-months'
  if (currentWeek <= 52) return '6-12-months'
  if (currentWeek <= 78) return '12-18-months'
  return '18-plus'
}
```

### New file: `src/lib/dad-pillar-config.ts`

Constants for pillar display, mood levels, situation flags, and dad concerns.

```typescript
import { PillarConfig, MoodConfig, SituationFlag, DadConcern } from '@/types/dad-journey'

export const PILLAR_CONFIG: PillarConfig[] = [
  { pillar: 'anxiety', label: 'Anxiety & Fear', icon: '🫣', color: 'amber', gradient: 'from-amber-500/20 to-amber-600/10', borderColor: 'border-l-amber-500' },
  { pillar: 'baby_bonding', label: 'Baby Bonding', icon: '👶', color: 'blue', gradient: 'from-blue-500/20 to-blue-600/10', borderColor: 'border-l-blue-500' },
  { pillar: 'relationship', label: 'Relationship', icon: '💑', color: 'pink', gradient: 'from-pink-500/20 to-pink-600/10', borderColor: 'border-l-pink-500' },
  { pillar: 'finances', label: 'Finances', icon: '💰', color: 'green', gradient: 'from-green-500/20 to-green-600/10', borderColor: 'border-l-green-500' },
  { pillar: 'knowledge', label: 'Knowledge', icon: '🧠', color: 'purple', gradient: 'from-purple-500/20 to-purple-600/10', borderColor: 'border-l-purple-500' },
  { pillar: 'planning', label: 'Planning', icon: '📋', color: 'cyan', gradient: 'from-cyan-500/20 to-cyan-600/10', borderColor: 'border-l-cyan-500' },
  { pillar: 'extended_family', label: 'Extended Family', icon: '👨‍👩‍👦', color: 'orange', gradient: 'from-orange-500/20 to-orange-600/10', borderColor: 'border-l-orange-500' },
]

export const MOOD_CONFIG: MoodConfig[] = [
  { level: 'struggling', emoji: '😞', label: 'Struggling', color: 'text-red-400' },
  { level: 'rough', emoji: '😔', label: 'Rough', color: 'text-orange-400' },
  { level: 'okay', emoji: '😐', label: 'Okay', color: 'text-yellow-400' },
  { level: 'good', emoji: '🙂', label: 'Good', color: 'text-green-400' },
  { level: 'great', emoji: '😄', label: 'Great', color: 'text-emerald-400' },
]

export const SITUATION_FLAGS: SituationFlag[] = [
  { key: 'sleep_deprived', emoji: '😴', label: 'Sleep deprived' },
  { key: 'argued_partner', emoji: '💔', label: 'Argued with partner' },
  { key: 'feeling_disconnected', emoji: '🔌', label: 'Feeling disconnected' },
  { key: 'overwhelmed_work', emoji: '💼', label: 'Overwhelmed at work' },
  { key: 'family_pressure', emoji: '👨‍👩‍👦', label: 'Family pressure' },
  { key: 'feeling_great', emoji: '🌟', label: 'Feeling great' },
  { key: 'bonding_moment', emoji: '🥰', label: 'Bonding moment' },
  { key: 'anxious', emoji: '😰', label: 'Anxious' },
]

export const DAD_CONCERNS: DadConcern[] = [
  { key: 'finances', emoji: '💰', label: 'Finances' },
  { key: 'relationship_changes', emoji: '💑', label: 'Relationship changes' },
  { key: 'being_good_dad', emoji: '👨', label: 'Being a good dad' },
  { key: 'work_life_balance', emoji: '⚖️', label: 'Work-life balance' },
  { key: 'family_interference', emoji: '👨‍👩‍👦', label: 'Family interference' },
  { key: 'health_anxiety', emoji: '🏥', label: 'Health anxiety' },
  { key: 'labor_delivery', emoji: '🍼', label: 'Labor & delivery' },
  { key: 'losing_identity', emoji: '🪞', label: 'Losing my identity' },
]
```

---

## 6. Phase 3 — Service Layer & Hooks

### New file: `src/services/dad-journey-service.ts`

Follows the pattern in `src/services/briefing-service.ts`:

```typescript
import { createClient } from '@/lib/supabase/client'
import { DadChallengeContent, DadProfile, MoodCheckin, ContentPhase, MoodLevel } from '@/types/dad-journey'

const supabase = createClient()

export const dadJourneyService = {
  // Fetch all 7 pillar contents for a given phase
  async getContentForPhase(phase: ContentPhase): Promise<DadChallengeContent[]> {
    const { data, error } = await supabase
      .from('dad_challenge_content')
      .select('*')
      .eq('phase', phase)
      .order('sort_order')
    if (error) throw error
    return data || []
  },

  // Get dad profile for current user
  async getDadProfile(userId: string): Promise<DadProfile | null> {
    const { data, error } = await supabase
      .from('dad_profiles')
      .select('*')
      .eq('user_id', userId)
      .single()
    if (error && error.code !== 'PGRST116') throw error
    return data
  },

  // Create or update dad profile
  async upsertDadProfile(userId: string, profile: Partial<DadProfile>): Promise<DadProfile> {
    const { data, error } = await supabase
      .from('dad_profiles')
      .upsert({ user_id: userId, ...profile }, { onConflict: 'user_id' })
      .select()
      .single()
    if (error) throw error
    return data
  },

  // Submit mood check-in
  async submitMoodCheckin(params: {
    userId: string
    familyId: string
    mood: MoodLevel
    situationFlags?: string[]
    note?: string
    phase?: ContentPhase
  }): Promise<MoodCheckin> {
    const { data, error } = await supabase
      .from('mood_checkins')
      .insert({
        user_id: params.userId,
        family_id: params.familyId,
        mood: params.mood,
        situation_flags: params.situationFlags || [],
        note: params.note || null,
        phase: params.phase || null,
      })
      .select()
      .single()
    if (error) throw error
    return data
  },

  // Get recent mood check-ins (for history/trends)
  async getRecentCheckins(userId: string, limit = 7): Promise<MoodCheckin[]> {
    const { data, error } = await supabase
      .from('mood_checkins')
      .select('*')
      .eq('user_id', userId)
      .order('checked_in_at', { ascending: false })
      .limit(limit)
    if (error) throw error
    return data || []
  },

  // Get today's check-in (if any)
  async getLastCheckin(userId: string): Promise<MoodCheckin | null> {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const { data, error } = await supabase
      .from('mood_checkins')
      .select('*')
      .eq('user_id', userId)
      .gte('checked_in_at', today.toISOString())
      .order('checked_in_at', { ascending: false })
      .limit(1)
      .single()
    if (error && error.code !== 'PGRST116') throw error
    return data
  },
}
```

### New file: `src/hooks/use-dad-journey.ts`

Follows the pattern in `src/hooks/use-dashboard.ts`:

```typescript
'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { dadJourneyService } from '@/services/dad-journey-service'
import { ContentPhase, MoodLevel } from '@/types/dad-journey'

export function useDadChallengeContent(phase: ContentPhase) {
  return useQuery({
    queryKey: ['dad-challenge-content', phase],
    queryFn: () => dadJourneyService.getContentForPhase(phase),
    enabled: !!phase,
  })
}

export function useDadProfile(userId: string) {
  return useQuery({
    queryKey: ['dad-profile', userId],
    queryFn: () => dadJourneyService.getDadProfile(userId),
    enabled: !!userId,
  })
}

export function useUpsertDadProfile() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ userId, profile }: { userId: string; profile: Record<string, unknown> }) =>
      dadJourneyService.upsertDadProfile(userId, profile),
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ['dad-profile', userId] })
    },
  })
}

export function useSubmitMoodCheckin() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: dadJourneyService.submitMoodCheckin,
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ['mood-checkin', userId] })
      queryClient.invalidateQueries({ queryKey: ['mood-history', userId] })
    },
  })
}

export function useLastCheckin(userId: string) {
  return useQuery({
    queryKey: ['mood-checkin', userId],
    queryFn: () => dadJourneyService.getLastCheckin(userId),
    enabled: !!userId,
  })
}

export function useMoodHistory(userId: string, limit = 7) {
  return useQuery({
    queryKey: ['mood-history', userId, limit],
    queryFn: () => dadJourneyService.getRecentCheckins(userId, limit),
    enabled: !!userId,
  })
}
```

---

## 7. Phase 4 — Onboarding Redesign

### Key Decisions

- **4 screens to dashboard** (~45 seconds)
- Partner invite and dad profile deferred to dashboard cards
- Task generation fires in background during Screen 4

### V2 Onboarding Flow (Dad — Primary User)

| Step | Screen | Duration | Data Collected |
|------|--------|----------|---------------|
| 1 | Welcome + Sign Up (combined) | ~30s | Email/password or Google OAuth |
| 2 | Role Selection | ~5s | Dad / Mom / Other (auto-advances on tap) |
| 3 | Family Setup | ~15s | Expecting vs Baby Here, due/birth date, baby name (optional) |
| 4 | Preview + Transition | ~5s | None (shows generated content while tasks load in background) |

### V2 Onboarding Flow (Mom — Invited Partner)

| Step | Screen | Notes |
|------|--------|-------|
| 1 | Join Link Landing Page | "[Partner name] invited you to The Dad Center" |
| 2 | Sign Up (or Log In) | Same combined welcome + auth screen |
| 3 | Role Selection | Picks Mom or Other |
| 4 | Dashboard | Lands directly. Family data inherited from partner. |

### File Changes

**Modified: `src/app/(auth)/signup/page.tsx`**
- Combine welcome/value proposition with signup form above the fold
- Google OAuth as primary path (single tap)
- Tagline: "Built for dads. Works for both."
- Login link at bottom for returning users

**Modified: `src/app/(auth)/onboarding/role/page.tsx`**
- Three large tappable cards: Dad, Mom, Other
- Auto-advance on tap (no separate Continue button)

**Modified: `src/app/(auth)/onboarding/family/page.tsx`**
- Toggle: "Expecting" (due date picker) vs "Baby is here" (birth date picker)
- Baby name clearly optional
- This drives everything downstream: task generation, briefing phase, challenge content

**New: `src/app/(auth)/onboarding/ready/page.tsx`** (replaces invite + complete)
- Dynamic value preview while task generation runs in background
- Shows real numbers: "56 tasks loaded", "This week's briefing: Viability Week", "7 challenge guides tailored to your stage"
- "Go to Dashboard" button enables when generation completes (~2s)

**Modified: `src/app/(auth)/onboarding/invite/page.tsx`** → Remove from onboarding flow (keep as standalone route for backward compat, redirect to `/onboarding/ready`)

**Modified: `src/app/(auth)/onboarding/complete/page.tsx`** → Remove or redirect to `/onboarding/ready`

**New: `src/app/(main)/onboarding/personalize/page.tsx`** (accessed from dashboard card, not onboarding)
- Single combined screen with work situation, first-time dad, and top concerns (pick up to 3)
- Saves to `dad_profiles` table
- After completion, card disappears from dashboard

### Deferred Elements (Surface on Dashboard)

**Partner Invite Card:**
- Placement: Action section of dashboard, below briefing teaser
- Appears immediately on first dashboard load, persists until partner joins or dismissed
- "Not now" hides for 7 days, then resurfaces
- "I'm doing this solo" dismisses permanently
- Partner invite is premium → free users tapping "Share" see upgrade modal

**Dad Personalize Card:**
- Placement: Top of "On Your Mind" section on dashboard (dads only)
- Appears on first dashboard visit, disappears after completion
- Opens personalize screen (work situation, first-time dad, top concerns)

---

## 8. Phase 5 — Navigation Restructure

### Mobile Bottom Navigation (5 Items)

| Position | Label | Icon | Destination | Change |
|----------|-------|------|-------------|--------|
| 1 | Home | `Home` | /dashboard | No change |
| 2 | Tasks | `CheckSquare` | /tasks | No change |
| 3 | Briefing | `BookOpen` | /briefing | **NEW** (was in More drawer) |
| 4 | Tracker | `Baby` | /tracker | No change |
| 5 | More | `Menu` | Drawer | Restructured |

**Calendar removed from bottom nav** → becomes view toggle within Tasks page.
**Briefing promoted to bottom nav** → dedicated retention feature.

### More Drawer Structure (Redesigned)

**Tools Section:**
- Checklists (with total count badge, e.g., "15 total")
- Budget Planner (with upcoming count, e.g., "3 upcoming")

**Family Section:**
- Invite Partner (paywall trigger for free users)
- Family Settings

**Account Section:**
- Settings
- Upgrade to Premium (or "Manage Subscription" for premium users)
- Help & Support
- Sign Out

### Desktop Sidebar

On screens >768px, bottom nav becomes sidebar. Same hierarchy: Dashboard, Tasks, Briefing, Baby Tracker as primary items. Checklists and Budget under "Tools" separator. Invite Partner under "Family" separator. Settings and Upgrade near bottom.

### Header Changes

- App logo (taps to dashboard)
- Week indicator showing current pregnancy/baby week (taps to briefing as shortcut)
- Notification bell with badge (premium only; free users see upgrade prompt)
- Profile avatar (dropdown: Settings, Subscription, Sign Out)

### File Changes

**Modified: `src/components/layouts/main-layout-client.tsx`**

Update `mainNavItems`:
```typescript
const mainNavItems = [
  { href: '/dashboard', label: 'Home', icon: Home },
  { href: '/tasks', label: 'Tasks', icon: CheckSquare },
  { href: '/briefing', label: 'Briefing', icon: BookOpen },   // NEW — was in moreNavItems
  { href: '/tracker', label: 'Tracker', icon: Baby },
]
```

Remove Calendar from main nav. Restructure `moreNavItems` into sections:
```typescript
const moreToolItems = [
  { href: '/checklists', label: 'Checklists', icon: ClipboardList },
  { href: '/budget', label: 'Budget', icon: DollarSign },
]
const moreFamilyItems = [
  { href: '/settings/family', label: 'Invite Partner', icon: UserPlus },
  { href: '/settings/family', label: 'Family Settings', icon: Users },
]
const moreAccountItems = [
  { href: '/settings', label: 'Settings', icon: Settings },
  { href: '/upgrade', label: 'Upgrade to Premium', icon: Crown },
  { href: '/help', label: 'Help & Support', icon: HelpCircle },
]
```

Update the More drawer Sheet to render sections with separators. Update desktop sidebar to match.

---

## 9. Phase 6 — Router & Route Map

Next.js App Router uses file-based routing. No router config file needed — the directory structure IS the route map.

### Complete Route Map

| Route | File Path | Access |
|-------|-----------|--------|
| `/` | `src/app/(marketing)/page.tsx` | Public |
| `/login` | `src/app/(auth)/login/page.tsx` | Public |
| `/signup` | `src/app/(auth)/signup/page.tsx` | Public |
| `/forgot-password` | `src/app/(auth)/forgot-password/page.tsx` | Public |
| `/reset-password` | `src/app/(auth)/reset-password/page.tsx` | Public |
| `/join/:inviteCode` | `src/app/(auth)/onboarding/join/page.tsx` | Public |
| `/onboarding/role` | `src/app/(auth)/onboarding/role/page.tsx` | Auth, no family |
| `/onboarding/family` | `src/app/(auth)/onboarding/family/page.tsx` | Auth, no family |
| `/onboarding/ready` | `src/app/(auth)/onboarding/ready/page.tsx` | Auth, no family (**NEW**) |
| `/dashboard` | `src/app/(main)/dashboard/page.tsx` | Auth + family |
| `/journey` | `src/app/(main)/journey/page.tsx` | Auth + family (**NEW**) |
| `/onboarding/personalize` | `src/app/(main)/onboarding/personalize/page.tsx` | Auth + family (**NEW**) |
| `/tasks` | `src/app/(main)/tasks/page.tsx` | Auth + family |
| `/tasks?view=calendar` | `src/app/(main)/tasks/page.tsx` (query param) | Auth + family |
| `/tasks/new` | `src/app/(main)/tasks/new/page.tsx` | Auth + family |
| `/tasks/[id]` | `src/app/(main)/tasks/[id]/page.tsx` | Auth + family |
| `/briefing` | `src/app/(main)/briefing/page.tsx` | Auth + family |
| `/briefing/[weekId]` | `src/app/(main)/briefing/[weekId]/page.tsx` | Auth + family (**NEW**) |
| `/briefing/archive` | `src/app/(main)/briefing/archive/page.tsx` | Auth + family |
| `/tracker` | `src/app/(main)/tracker/page.tsx` | Auth + family |
| `/tracker/log` | `src/app/(main)/tracker/log/page.tsx` | Auth + family |
| `/tracker/history` | `src/app/(main)/tracker/history/page.tsx` | Auth + family |
| `/tracker/summary` | `src/app/(main)/tracker/summary/page.tsx` | Auth + family |
| `/checklists` | `src/app/(main)/checklists/page.tsx` | Auth + family |
| `/checklists/[id]` | `src/app/(main)/checklists/[id]/page.tsx` | Auth + family |
| `/budget` | `src/app/(main)/budget/page.tsx` | Auth + family |
| `/calendar` | `src/app/(main)/calendar/page.tsx` | Auth + family (consider redirect to `/tasks?view=calendar`) |
| `/settings` | `src/app/(main)/settings/page.tsx` | Auth + family |
| `/settings/profile` | `src/app/(main)/settings/profile/page.tsx` | Auth + family |
| `/settings/family` | `src/app/(main)/settings/family/page.tsx` | Auth + family |
| `/settings/notifications` | `src/app/(main)/settings/notifications/page.tsx` | Auth + family |
| `/settings/subscription` | `src/app/(main)/settings/subscription/page.tsx` | Auth + family |
| `/upgrade` | `src/app/(public)/upgrade/page.tsx` | Auth + family |
| `/resources` | `src/app/(marketing)/resources/page.tsx` | Public |
| `/resources/articles/[slug]` | `src/app/(marketing)/resources/articles/[slug]/page.tsx` | Public |

### New Routes to Create

| Route | File to Create |
|-------|---------------|
| `/onboarding/ready` | `src/app/(auth)/onboarding/ready/page.tsx` |
| `/journey` | `src/app/(main)/journey/page.tsx` |
| `/onboarding/personalize` | `src/app/(main)/onboarding/personalize/page.tsx` |
| `/briefing/[weekId]` | `src/app/(main)/briefing/[weekId]/page.tsx` |

---

## 10. Phase 7 — Dashboard Redesign

### Key Decision: Single Unified Feed, No Tabs

The dashboard is a single unified feed with no tabs. Cards are ordered by daily priority and conditionally shown based on context (pregnancy vs post-birth, role, time of day, task status).

### Card Priority Order (Dad)

| Priority | Card | Shows When | Hides When |
|----------|------|------------|------------|
| 1 | Mood Check-in | Not checked in today | Collapses to compact bar after check-in |
| 2 | Shift Briefing | Post-birth + partner logged today | Pre-birth, no tracker data |
| 3 | Briefing Teaser | Always | Never (always relevant) |
| 4 | Tasks Due This Week | Has tasks in next 7 days | All tasks completed (shows "All caught up!") |
| 5 | On Your Mind (2 tiles) | Dad role selected | Mom/Other role |
| 6 | Quick Actions | Post-birth always; pregnancy if tracker enabled | — |
| 7 | Personalize Card | Dad + hasn't completed profile | After profile completed |
| 7 | Invite Partner | No partner + not dismissed | Partner joined or "doing this solo" |
| 8 | Budget Snapshot | Upcoming items in next 4 weeks | No upcoming items |
| 9 | Checklist Progress | Active in-progress checklist | No active checklists |

The dashboard naturally gets shorter as users engage. A fully set-up user might see 5-6 cards; a new user sees 8-9.

### Card Priority Engine

```typescript
// src/hooks/use-dashboard-context.ts
interface DashboardCard {
  id: string
  component: React.ComponentType<any>
  priority: number
  visible: boolean
  props: Record<string, unknown>
}

function useDashboardCards(): DashboardCard[] {
  const { profile, family } = useUser()
  const { data: lastCheckin } = useLastCheckin(profile.id)
  const { data: dadProfile } = useDadProfile(profile.id)
  const { data: dashboardData } = useDashboardData(family.id, family.current_week)

  const isDad = profile.role === 'dad'
  const isPostBirth = family.stage === 'post-birth'
  const hasPartner = !!dashboardData?.partner
  const hasCheckedIn = !!lastCheckin
  const hasCompletedProfile = !!dadProfile?.work_situation

  return [
    { id: 'mood', priority: 1, visible: isDad, /* ... */ },
    { id: 'shift-briefing', priority: 2, visible: isPostBirth && hasPartner, /* ... */ },
    { id: 'briefing-teaser', priority: 3, visible: true, /* ... */ },
    { id: 'tasks-due', priority: 4, visible: true, /* ... */ },
    { id: 'on-your-mind', priority: 5, visible: isDad, /* ... */ },
    { id: 'quick-actions', priority: 6, visible: true, /* ... */ },
    { id: 'personalize', priority: 7, visible: isDad && !hasCompletedProfile, /* ... */ },
    { id: 'invite-partner', priority: 7, visible: !hasPartner, /* ... */ },
    { id: 'budget-snapshot', priority: 8, visible: true, /* ... */ },
    { id: 'checklist-progress', priority: 9, visible: true, /* ... */ },
  ].filter(card => card.visible)
}
```

### Desktop Layout

On desktop (>768px), two-column layout to reduce scroll depth:
- **Left column:** Briefing teaser, On Your Mind tiles, Invite Partner card
- **Right column:** Tasks due, Quick Actions, Budget Snapshot, Checklist Progress
- **Full width (above both):** Mood Check-in, Shift Briefing

The On Your Mind section shows 2 challenge tiles on desktop (1 on mobile) with a "See all 7 challenges" link to `/journey`.

### The /journey Page

When the user taps "See all 7 challenges", they navigate to `/journey` — a full-page experience with mood history at top followed by all 7 expandable challenge tiles for the current phase. Each tile expands in-place with the full narrative (500-1000 words), action items, and dad quotes.

### File Changes

**Modified: `src/components/dashboard/DashboardClient.tsx`**
- Rewrite to use priority-ordered card system
- Add Mood Check-in, Shift Briefing, On Your Mind, Personalize, Invite Partner, Budget Snapshot, Checklist Progress cards
- Remove static grid layout in favor of unified feed
- Add two-column desktop layout

**New: `src/components/dashboard/MoodCheckinCard.tsx`**
**New: `src/components/dashboard/BriefingTeaserCard.tsx`**
**New: `src/components/dashboard/TasksDueCard.tsx`**
**New: `src/components/dashboard/OnYourMindCard.tsx`**
**New: `src/components/dashboard/PersonalizeCard.tsx`**
**New: `src/components/dashboard/InvitePartnerCard.tsx`**
**New: `src/components/dashboard/BudgetSnapshotCard.tsx`**
**New: `src/components/dashboard/ChecklistProgressCard.tsx`**
**New: `src/components/dashboard/WelcomeCatchUpCard.tsx`** (mid-pregnancy catch-up)

**New: `src/hooks/use-dashboard-context.ts`** — Card priority engine

**New: `src/app/(main)/journey/page.tsx`** — Full /journey page

---

## 11. Phase 8 — Dad Journey & Challenge Tiles

### The 7 Challenge Pillars

| # | Pillar | Icon | Core Question |
|---|--------|------|---------------|
| 1 | Knowledge/Information | 🧠 | "What do I need to know right now?" |
| 2 | Planning | 📋 | "What should I be preparing for?" |
| 3 | Finances | 💰 | "Can we actually afford this?" |
| 4 | Anxiety & Fear | 🫣 | "Is what I'm feeling normal?" |
| 5 | Baby Bonding | 👶 | "How do I connect with my baby?" |
| 6 | Relationship with Partner | 💑 | "We feel like we're drifting apart" |
| 7 | Extended Family | 👨‍👩‍👦 | "How do I handle boundaries?" |

### Tile Content Examples

#### Anxiety & Fear

| Phase | Headline | Core Theme |
|-------|----------|------------|
| Trimester 1 | "That pit in your stomach? Every dad has it." | Normalizing mixed emotions |
| Trimester 3 | "The delivery room is coming. Here's what nobody tells you." | Practical prep for what you'll actually experience |
| 0-3 months | "3 AM and you're wondering if you're cut out for this." | Post-birth reality check |
| 6-12 months | "They're crawling and you're still figuring it out." | Slow build of confidence |

#### Relationship with Partner

| Phase | Headline | Core Theme |
|-------|----------|------------|
| Trimester 2 | "She's changing. You're not. That's the problem." | The asymmetry of pregnancy |
| 0-3 months | "You're both drowning. She just doesn't have time to tell you." | Fourth trimester on relationships |
| 3-6 months | "When did we stop being us?" | Rebuilding the relationship |
| 12-18 months | "You made it through the hardest part. Now rebuild." | Active relationship repair |

*(Full content for all 7 pillars × 9 phases = 63 pieces in `content/dad-challenges.json`)*

### Expanded Tile Design

Each tile expands in-place with:
1. **Full narrative** (500-1000 words, markdown, peer-dad tone)
2. **"Things you can do right now"** — Action items with title + description
3. **"What other dads say"** — Quotes with attribution

### File Changes

**New directory: `src/components/dashboard/dad-journey/`**

| File | Purpose |
|------|---------|
| `DadChallengeTiles.tsx` | Container — fetches content via `useDadChallengeContent()`, Framer Motion stagger animation |
| `DadChallengeTile.tsx` | Individual expandable tile — color-coded left border, gradient bg, expand/collapse animation, renders narrative (markdown), action items, dad quotes |
| `MoodCheckinWidget.tsx` | Two states: emoji selector + flags → submit, or compact "already checked in" summary with streak |
| `index.ts` | Barrel exports |

**Reuses existing components:**
- `src/components/ui/tabs.tsx` (Radix Tabs)
- `src/components/briefings/BriefingSection.tsx` (color pattern reference)
- `src/components/tasks/task-section.tsx` (collapsible pattern reference)
- `src/components/tasks/animations/task-animations.tsx` (stagger + spring animations)
- `src/components/marketing/ArticleContent.tsx` (react-markdown rendering, if exists)

### Tile Ordering

Default order is by pillar sort_order. If the user has completed the dad profile (personalize card), tiles are ordered by the user's top concerns first, then remaining pillars.

### Paywall Gating

- **Free:** All 7 tiles with full narrative for **current phase only**
- **Premium:** All phases unlocked (past + future) — "see what's ahead"

---

## 12. Phase 9 — Mood Check-in System

### Two States

**State 1: Not checked in today**
```
┌─── Mood Check-in ─────────────────────┐
│ How are you feeling today?             │
│ 😞  😔  😐  🙂  😄                    │
│                                        │
│ (After selecting mood, shows flags:)   │
│ Anything going on? (optional)          │
│ 😴 Sleep deprived  💔 Argued           │
│ 🔌 Disconnected    💼 Work overwhelmed │
│ 👨‍👩‍👦 Family pressure  🌟 Feeling great   │
│ 🥰 Bonding moment  😰 Anxious         │
│                                        │
│         [Check in]                     │
└────────────────────────────────────────┘
```

**State 2: Already checked in today**
```
┌─── Mood ────────────────────────────┐
│ 🙂 Today: feeling good   3-day streak│
└─────────────────────────────────────┘
```

### Free vs Premium

| Feature | Free | Premium |
|---------|------|---------|
| Daily check-ins | Unlimited | Unlimited |
| Flag selection | Full | Full |
| Streaks | Full | Full |
| History | Last 7 days | Full history |
| Trend charts | — | Full trends + flag correlation insights |

### File: `src/components/dashboard/dad-journey/MoodCheckinWidget.tsx`

Uses `useLastCheckin()` to determine state. Uses `useSubmitMoodCheckin()` for submission. Calculates streak from `useMoodHistory()`.

---

## 13. Phase 10 — Briefings Upgrade

### Key Change: Dedicated Bottom Nav Tab

Briefings move from the More drawer to a dedicated bottom nav slot (Position 3). This is the primary retention hook.

### Reading Experience

Single scrollable page for the current week. Content sections in order:

1. **Week title and stage context**
2. **Baby This Week** — developmental update
3. **How Mom's Doing** — physical and emotional changes
4. **Your Focus This Week** — 3 specific action items for dad
5. **Relationship Check-in** — one practical tip
6. **Coming Up Next Week** — preview
7. **Linked Tasks** — completable inline (check off without switching to Tasks tab)
8. **Source attribution**

### Week Navigation

- Left/right arrows at top (swipe on mobile)
- Week indicator taps to open timeline overlay
- Timeline shows all weeks grouped by trimester/stage
- Current week highlighted, locked weeks show lock icon (free users)

### Paywall Integration

| Status | Free User Sees | Premium User Sees |
|--------|---------------|-------------------|
| Current week + 3 prior (4-week window from signup) | Full briefing content | Full briefing content |
| Week 5+ from signup | Title only + "Upgrade to read full briefing" | Full content |
| Past week archives | Locked | Full access |
| Timeline overlay | All titles visible (FOMO), content locked | All accessible |

### Dashboard Connection

The Briefing Teaser card on dashboard shows week title, 2-line preview, and "Read full briefing" link. It's a pointer to the Briefing tab, not the content itself.

### File Changes

**Modified: `src/app/(main)/briefing/page.tsx`**
- Enhanced reading experience with section components
- Inline task completion

**New: `src/app/(main)/briefing/[weekId]/page.tsx`**
- Direct link to specific week's briefing

**Modified: `src/components/briefings/`**
- Add week navigation component
- Add timeline overlay
- Add inline task completion

---

## 14. Phase 11 — Tasks Upgrade

### Key Changes

- **30-day free window** (was 14-day)
- Calendar view toggle (replaces dedicated Calendar page)
- 2-bucket catch-up triage (see Phase 13)
- Task assignment to partner (premium)
- Snooze/reschedule (premium)

### Free vs Premium

| Feature | Free | Premium |
|---------|------|---------|
| Task timeline | **30-day rolling window** | Full timeline (pregnancy → 24 months) |
| Mark tasks complete | All visible tasks | All tasks |
| Custom tasks | Unlimited | Unlimited |
| Snooze / Reschedule | — | Yes |
| Task assignment (to partner) | — | Yes |
| Catch-up backlog triage | Last 30 days (full triage). Older: titles visible but locked. | Full backlog triage for entire timeline |

**Anti-gaming note:** Catch-up backlog capped at 30 days free to prevent users from signing up with fake late-pregnancy dates and triaging the full 9-month timeline for free.

### Calendar View Toggle

The Tasks page gets a list/calendar view toggle instead of a dedicated Calendar page:
- Default: List view (current behavior)
- Toggle: `/tasks?view=calendar`
- Calendar page (`/calendar`) can redirect to `/tasks?view=calendar`

### File Changes

**Modified: `src/app/(main)/tasks/page.tsx`** — Add view toggle query param
**Modified: `src/components/tasks/tasks-page-client.tsx`** — Add calendar view toggle
**Modified: `src/app/(main)/calendar/page.tsx`** — Redirect to `/tasks?view=calendar`

---

## 15. Phase 12 — Mom's Experience

### Dashboard Differences

| Card | Dad Sees | Mom Sees |
|------|----------|---------|
| Position 1 | Mood Check-in | **Partner Activity Card** |
| Position 5 | On Your Mind (challenge tiles) | Not shown |
| Personalize Card | Dad profile questions | Not shown |
| Invite Partner | Shown if no partner | Not shown (she IS the partner) |
| Everything else | Identical | Identical |

### Partner Activity Card

Replaces mood check-in at top of mom's dashboard. Shows partner's recent activity:
- Tasks completed
- Briefings read
- Baby logs entered
- Last active timestamp

Reinforces the "neutral third party" principle by showing what dad has done without mom needing to ask.

### Shared Content

- **Briefings:** Identical content. Both parents read the same briefing and share context for the week.
- **Tasks:** Identical experience. Tasks assigned to Mom, Dad, or Both.
- **Navigation:** Identical bottom nav, More drawer, sidebar, header. Role-agnostic.

### The "Other" Role

For V2, "Other" gets the mom experience (practical tools, partner activity, no dad-specific emotional content). Covers non-traditional family structures.

### File Changes

**Modified: `src/components/dashboard/DashboardClient.tsx`** — Role-aware card rendering
**Existing: `src/components/dashboard/PartnerActivityCard.tsx`** — Already exists, may need updates
**Existing: `src/components/shared/partner-activity.tsx`** — Already exists

---

## 16. Phase 13 — Mid-Pregnancy Catch-Up UX

### The Problem

Users who sign up mid-journey face a backlog of tasks with due dates that have already passed. The first experience must be empowering, not overwhelming.

### Two-Bucket Triage System

| Bucket | Contains | UI Treatment | User Action |
|--------|----------|-------------|------------|
| Auto-Handled | Expired tasks (medical window closed) + tasks almost certainly done (e.g., "select OB" at week 28) | Grouped as "X tasks auto-sorted." Greyed out, collapsed. | One-tap "Looks right" to dismiss, or expand to un-skip individual items |
| Catch-Up | Tasks still actionable even though past original due date | **Yellow** "Catch up" badge (not red "Overdue"). Shown as prioritized section in task list. | Complete normally. Urgent items flagged. |

### Task Template Metadata

Each task template requires the `catch_up_behavior` field (added in Phase 1, Migration 4):
- `'expired'` — Medical window closed
- `'likely_done'` — Almost certainly already done by this point
- `'catch_up'` — Still actionable

During task generation, all tasks with due dates before signup date are triaged into auto-handled (`expired` + `likely_done`) and catch-up buckets.

### Example: Week 28 Signup

17 pre-signup pregnancy tasks → 8 auto-handled (4 expired + 4 likely done) + 9 catch-up tasks.

### Dashboard Catch-Up Card

On first dashboard load, a special "Welcome to Your Timeline" card replaces the normal tasks card. Shows:
- Auto-handled count
- Catch-up count
- Upcoming task count

Persists for 3 days, then catch-up tasks move exclusively to the Tasks tab.

### Onboarding Preview Adaptation

Screen 4 (Ready) adapts for mid-pregnancy signups:
- Instead of "56 tasks loaded" → "32 tasks loaded through baby's first year" + "17 earlier tasks sorted — we'll help you catch up"

### File Changes

**Modified: `src/components/tasks/catch-up-section.tsx`** — Use yellow badges, 2-bucket system
**Modified: `src/components/tasks/catch-up-banner.tsx`** — Auto-handled display
**Modified: `src/components/tasks/catch-up-task-item.tsx`** — Yellow badge styling
**New: `src/components/dashboard/WelcomeCatchUpCard.tsx`** — Dashboard catch-up card

---

## 17. Phase 14 — Notification System

### Key Decision: Premium-Only Push Notifications (with 30-day free window)

| Feature | Free (first 30 days) | Free (after 30 days) | Premium |
|---------|---------------------|---------------------|---------|
| Push notifications | Full access | None | Full access |
| Task reminder emails | — | — | Yes |
| Weekly briefing email | During free briefing window | — | Yes |
| Partner activity alerts | — | — | Yes |

### Notification Types

| Type | Trigger | Who Receives | Copy Principle |
|------|---------|-------------|---------------|
| Task Reminder | 7 days + 1 day before due | Assigned user | "Car seat installation is due this week" |
| Task Completed | Partner completes task | Other partner | "Ashirbad completed: Research pediatricians" |
| New Week Briefing | Monday morning (configurable) | Both parents | "Week 24 Briefing: Viability Week is ready" |
| Baby Log Update | Partner logs event | Other partner (optional) | "Sarah logged a feeding: 4oz at 2:15 PM" |
| Partner Joined | Partner accepts invite | Original user | "Sarah has joined your family!" |

### Neutral Third Party Principle

All notifications come from "the app" as a neutral authority, never implying one partner assigned work to another.
- **Good:** "Car seat installation is due this week."
- **Bad:** "Your partner wants you to install the car seat."

### Conversion Trigger

Push notifications and tasks both expire around day 30, creating a **dual conversion trigger** — dad loses both task visibility AND reminders at the same time.

### File Changes

**Modified: `src/services/notification-service.ts`** — Add free window check
**Modified: `src/hooks/use-notifications.ts`** — Add subscription/window gating

---

## 18. Phase 15 — Free-to-Premium Upgrade Journey

### Three Phases

| Phase | Timeframe | Strategy | User Experience |
|-------|-----------|----------|----------------|
| **Invisible** | Days 1-7 | Let users explore freely | Rich free content: 30-day task window, 4 briefings, all checklists, 3 tracker types. Paywalls feel like edges, not walls. |
| **Visible** | Days 8-21 | User starts hitting limits naturally | Locked content becomes noticeable. Can't invite partner. Sees briefing titles they can't read. Each paywall plants a seed. |
| **Urgent** | Days 22+ | Free briefing window closing | Briefing paywall = highest-conversion moment. Loss aversion kicks in. $39.99/year feels justified. |

### Soft Upgrade Prompts (Dashboard Cards)

**Prompt 1 (Day 14):** Usage stats — "You've completed 8 tasks and read 2 briefings. Unlock everything: partner sync, full timeline, push notifications, and more." Dismissible.

**Prompt 2 (Day ~28):** Briefing cutoff — "Your free briefings have ended. Week 29: Breech Position is ready — upgrade to keep reading." Specific next briefing title creates targeted curiosity. **Highest-converting moment.**

### Post-Purchase Experience

Celebration screen showing what unlocked with specific numbers ("187 additional tasks now visible"). Primary CTA: "Invite your partner now" (ride purchase enthusiasm into viral loop). Secondary CTA: Go to dashboard.

---

## 19. Phase 16 — Subscription & Paywall Implementation

### Pricing

| Plan | Price | Notes |
|------|-------|-------|
| **Free** | $0 forever | Lead generation, trust-building, SEO |
| **Monthly** | **$4.99/mo** | Trial-hesitant users |
| **Annual** | **$39.99/yr** ($3.33/mo) | Core business, best value messaging |
| **Lifetime** | **$99.99** once | Multi-child planners, early adopters |

- 14-day free trial, no credit card required
- 30-day money-back guarantee
- One subscription per family — both partners share access

### Revenue Per Sale (After Fees)

| Plan | Price | Web (Stripe) | App Store (15%) | App Store (30%) |
|------|-------|-------------|-----------------|-----------------|
| Monthly | $4.99 | $4.55 | $4.24 | $3.49 |
| Annual | $39.99 | $38.30 | $33.99 | $28.00 |
| Lifetime | $99.99 | $96.60 | $84.99 | $70.00 |

Push users to web checkout for best margins.

### Paywall Modal Component

Every paywall trigger opens the same modal with:
- **Context-specific headline** (changes per trigger)
- **Feature list** (always shows full premium package)
- **Pricing:** Annual ($39.99/yr) as primary CTA, Monthly ($4.99/mo) as secondary
- **"Maybe later"** dismisses cleanly with no guilt

### Paywall Copy Per Feature Key

```typescript
// src/lib/paywall-copy.ts
export const PAYWALL_COPY: Record<string, { headline: string; body: string }> = {
  briefings: {
    headline: 'Continue your weekly briefings',
    body: 'Your free briefings have ended. Upgrade to keep getting weekly guidance tailored to your exact week — all the way through age 2.',
  },
  tasks: {
    headline: 'Unlock your complete timeline',
    body: 'Unlock your complete timeline. 200+ expert tasks from pregnancy through Year 2 — so nothing catches you off guard.',
  },
  notifications: {
    headline: 'Keep your reminders',
    body: 'Upgrade so nothing slips through the cracks — task alerts, briefing notifications, and partner updates.',
  },
  future_phases: {
    headline: "See what's ahead",
    body: "Unlock all phases so you're always one step prepared — no surprises.",
  },
  calendar: {
    headline: 'Keep your complete view',
    body: 'See tasks, briefings, and milestones all in one calendar — so nothing sneaks up on you.',
  },
  shift_briefing: {
    headline: 'Hand off like a pro',
    body: 'Get shift briefings so your partner knows exactly what happened while they slept.',
  },
  mood_trends: {
    headline: 'See your patterns',
    body: "You've been checking in — see what your patterns reveal. Unlock mood trends and insights.",
  },
  tracker_advanced: {
    headline: 'Track everything, see the full picture',
    body: 'Unlock all log types and unlimited history.',
  },
  realtime_sync: {
    headline: 'Get instant partner sync',
    body: 'See her updates the moment they happen — no more refreshing.',
  },
  partner_invite: {
    headline: 'Invite your partner',
    body: 'Share The Dad Center with your partner for real-time coordination and shared tasks.',
  },
  soft_prompt: {
    headline: 'Unlock the full operating system for fatherhood',
    body: "You've completed {tasksCompleted} tasks and checked in {checkinsCount} times. Get the complete experience.",
  },
  catch_up_backlog: {
    headline: 'Unlock your full history',
    body: 'Triage all past tasks and catch up on everything you might have missed.',
  },
}
```

### Client-Side vs Server-Side Enforcement

| Check | Client-Side | Server-Side |
|-------|-------------|-------------|
| Show/hide lock icons | Yes | — |
| Blur locked content | Yes | — |
| Trigger upgrade modals | Yes | — |
| Actual data access | — | **Yes (required)** |
| Subscription validation | — | **Yes (required)** |

**Critical:** Never trust client-side subscription state for data access. Always validate server-side.

### Upgrade/Downgrade Behavior

**Upgrade:** All existing data immediately unlocks. Full history becomes available. Partner gets realtime sync immediately.

**Downgrade (subscription lapse):**
- Data retained — nothing deleted
- Access reverts to free tier limits
- 7-day grace period after failed payment
- Partner sees "Subscription lapsed — contact [primary user] to restore"

### Platform-Specific Payment

| Platform | Processor | Notes |
|----------|-----------|-------|
| Web | Stripe | Push users here — best margins (96.5%) |
| iOS | RevenueCat → App Store | Required for in-app purchases |
| Android | RevenueCat → Google Play | Required for in-app purchases |

Cross-platform sync via RevenueCat.

### File Changes

**New: `src/lib/paywall-copy.ts`** — Paywall copy per feature key
**Modified: `src/components/shared/paywall-overlay.tsx`** — Use consistent modal design
**Modified: `src/components/shared/paywall-banner.tsx`** — Update copy
**Modified: `src/app/(public)/upgrade/page.tsx`** — Update pricing to $4.99/$39.99/$99.99
**Modified: `src/services/subscription-service.ts`** — Add free window checks
**Modified: `src/app/(main)/settings/subscription/page.tsx`** — Update comparison table

---

## 20. Phase 17 — Content Generation & Seeding

### New file: `content/dad-challenges.json`

63 content pieces (7 pillars × 9 phases). Each piece:

```json
{
  "pillar": "anxiety",
  "phase": "trimester-3",
  "headline": "The delivery room is coming. Here's what nobody tells you.",
  "preview": "You've read the books. You've been to the classes. But there's a difference between knowing and being ready.",
  "icon": "🫣",
  "narrative": "Here's the thing about the delivery room — you've seen it in movies...\n\n(500-1000 words, markdown, peer-dad tone)",
  "action_items": [
    { "title": "Take the hospital tour", "description": "Knowing the space removes one layer of anxiety on the day." },
    { "title": "Ask your partner about her plan", "description": "Birth plan, pain management, who she wants in the room." }
  ],
  "dad_quotes": [
    { "quote": "I thought I'd pass out. I didn't. You find strength you didn't know you had.", "attribution": "James, first-time dad, 34" },
    { "quote": "The worst part was the waiting. 12 hours of nothing happening and then everything at once.", "attribution": "David, dad of 2, 31" }
  ],
  "sort_order": 4,
  "is_premium": false
}
```

**Tone guidelines:**
- Written as a peer dad who's been through it
- Direct, honest, occasionally funny, never preachy
- AI-generated, user reviews and edits

### Seeding Migration

INSERT all 63 content pieces into `dad_challenge_content` table.

---

## 21. Feature Access Matrix

### Complete Reference

#### 1. Dad Journey — My Journey / On Your Mind

| Feature | Free | Premium |
|---------|------|---------|
| 7 Challenge Pillar Tiles | All 7 tiles with headlines + previews for current phase | — |
| Tile Narrative Content | Current phase: all 7 pillars fully expanded | All phases unlocked (past + future) |
| Tile Ordering by Concerns | Personalized for all users who complete onboarding | — |
| Mood Check-ins | Unlimited daily + full flag selection + streaks | — |
| Mood History & Trends | Last 7 days | Full history + trend charts + flag correlation |
| Dad-Specific Onboarding | Full flow with skip options | — |

#### 2. Weekly Briefings

| Feature | Free | Premium |
|---------|------|---------|
| Weekly Briefings (~140 total) | Current week + 3 adjacent (4-week window from signup) | All ~140 briefings |
| Briefing Archive | — | Full archive with search |

#### 3. Smart Task Management

| Feature | Free | Premium |
|---------|------|---------|
| Task Timeline (200+ tasks) | **30-day rolling window** | Full timeline (pregnancy → 24 months) |
| Mark Tasks Complete | All visible tasks | All tasks |
| Custom Tasks | Unlimited | Unlimited |
| Snooze / Reschedule | — | Yes |
| Task Assignment (to partner) | — | Yes |
| Catch-up Backlog Triage | Last 30 days full triage. Older: titles visible but locked. | Full backlog for entire timeline |

#### 4. Baby Tracker (Post-birth)

| Feature | Free | Premium |
|---------|------|---------|
| Basic Logging (feed, diaper, sleep) | Full logging with timestamps and attribution | — |
| Quick Log Buttons | Yes | — |
| Advanced Log Types (temp, medicine, vitamin D, mood, weight, height, milestones, custom) | — | All types including custom |
| Tracker History | Last 7 days | All time with search |
| Daily / Weekly Summaries | — | Full analytics dashboard |
| Shift Briefing (partner handoff) | — | Yes |

#### 5. Budget Planner (ALL FREE)

| Feature | Free | Premium |
|---------|------|---------|
| Browse Budget Items (100+ items, 3 price tiers, real brands) | Full browse | — |
| My Budget (personalized tracking, purchases, actual vs estimated) | Full editing and tracking | — |
| Budget Timeline Widget | Full visualization | — |

#### 6. Checklists (ALL FREE)

| Feature | Free | Premium |
|---------|------|---------|
| All 15+ Checklists (350+ items) | Full access, check-off, progress tracking | — |

#### 7. Partner Sync & Mom's Role

| Feature | Free | Premium |
|---------|------|---------|
| Partner Invite | Mom can join and access the app | — |
| Mom's Dashboard View | Action Items default, read-only Journey, shared data (manual refresh) | Realtime sync + activity feed |
| Realtime Sync | Manual refresh | Instant via Supabase Realtime |
| Partner Activity Feed | — | Yes |

#### 8. Calendar & Notifications

| Feature | Free | Premium |
|---------|------|---------|
| Calendar View | First 4 weeks from signup | Ongoing access |
| Push Notifications | **First 30 days** — full push with all reminder types | Ongoing, fully configurable |
| Weekly Briefing Email | During free briefing window (first 4 weeks) | Ongoing |
| Task Reminder Emails | — | Yes |

#### 9. Resource Library (ALL FREE)

| Feature | Free | Premium |
|---------|------|---------|
| Articles (100+) | All articles free (SEO-critical) | — |
| Videos (50+) | All videos free (YouTube embeds) | — |

#### 10. Settings & Account

| Feature | Free | Premium |
|---------|------|---------|
| Profile & Family Management | Yes | — |
| Theme (Light/Dark/Auto) | Yes | — |
| Data Export | **Yes** (GDPR/CCPA compliance) | — |

### Time-Gated Free Windows Summary

| Feature | Free Window | Premium |
|---------|-------------|---------|
| Weekly Briefings | 4 weeks from signup | All ~140 weeks |
| Task Timeline | **30-day rolling window** | Full timeline |
| Catch-up Backlog | Last 30 days | Full history |
| Calendar | 4 weeks from signup | Ongoing |
| Push Notifications | **30 days from signup** | Ongoing |
| Weekly Briefing Email | 4 weeks from signup | Ongoing |
| Mood History | Last 7 days | Full history |
| Tracker History | Last 7 days | Full history |

---

## 22. Upgrade Trigger Locations

### HIGH Conversion

| Location | Trigger | Copy Key |
|----------|---------|----------|
| Briefings (Week 5+) | Navigate to week 5+ from signup | `briefings` |
| Tasks (Day 31+) | Tap task beyond 30-day window | `tasks` |
| Push Notifications (Day 31+) | Notification settings show free period ended | `notifications` |
| Weekly Briefing Email (Week 5) | Week 5 email delivery | `briefings` |

### MEDIUM-HIGH Conversion

| Location | Trigger | Copy Key |
|----------|---------|----------|
| Dad Journey — Future Phases | Tap future/past phase tile narrative | `future_phases` |
| Calendar (Week 5+) | Open calendar after 4-week window expires | `calendar` |
| Shift Briefing | Tap "Create Shift Briefing" in tracker | `shift_briefing` |

### MEDIUM Conversion

| Location | Trigger | Copy Key |
|----------|---------|----------|
| Mood Trends | Tap "View trends" after 7+ check-ins | `mood_trends` |
| Baby Tracker — Advanced | Tap advanced log type or history beyond 7 days | `tracker_advanced` |
| Realtime Sync | Notice "last updated X min ago" | `realtime_sync` |
| Dashboard — Soft Prompt | After 30 days on free, if active | `soft_prompt` |

### LOW-MEDIUM Conversion

| Location | Trigger | Copy Key |
|----------|---------|----------|
| Catch-up Backlog (31+ days) | See locked older tasks during triage | `catch_up_backlog` |

---

## 23. File Summary — New, Modified, Deleted

### New Files

| File | Purpose |
|------|---------|
| **Types & Config** | |
| `src/types/dad-journey.ts` | All new TypeScript types |
| `src/lib/phase-utils.ts` | Phase mapping utility |
| `src/lib/dad-pillar-config.ts` | Pillar/mood/flag constants |
| `src/lib/paywall-copy.ts` | Paywall copy per feature key |
| **Service & Hooks** | |
| `src/services/dad-journey-service.ts` | Supabase queries for dad journey |
| `src/hooks/use-dad-journey.ts` | React Query hooks for dad journey |
| `src/hooks/use-dashboard-context.ts` | Card priority engine |
| **Onboarding** | |
| `src/app/(auth)/onboarding/ready/page.tsx` | Preview + transition screen |
| `src/app/(main)/onboarding/personalize/page.tsx` | Dad profile (from dashboard card) |
| **Dashboard Cards** | |
| `src/components/dashboard/MoodCheckinCard.tsx` | Mood check-in card |
| `src/components/dashboard/BriefingTeaserCard.tsx` | Briefing teaser card |
| `src/components/dashboard/TasksDueCard.tsx` | Tasks due this week card |
| `src/components/dashboard/OnYourMindCard.tsx` | 2 challenge tile teasers |
| `src/components/dashboard/PersonalizeCard.tsx` | Dad personalize CTA |
| `src/components/dashboard/InvitePartnerCard.tsx` | Partner invite CTA |
| `src/components/dashboard/BudgetSnapshotCard.tsx` | Budget snapshot |
| `src/components/dashboard/ChecklistProgressCard.tsx` | Checklist progress |
| `src/components/dashboard/WelcomeCatchUpCard.tsx` | Mid-pregnancy catch-up |
| **Dad Journey** | |
| `src/components/dashboard/dad-journey/DadChallengeTiles.tsx` | Tile container + stagger animation |
| `src/components/dashboard/dad-journey/DadChallengeTile.tsx` | Expandable tile component |
| `src/components/dashboard/dad-journey/MoodCheckinWidget.tsx` | Mood check-in widget |
| `src/components/dashboard/dad-journey/index.ts` | Barrel exports |
| **Pages** | |
| `src/app/(main)/journey/page.tsx` | Full /journey page (all 7 tiles) |
| `src/app/(main)/briefing/[weekId]/page.tsx` | Specific week briefing |
| **Content** | |
| `content/dad-challenges.json` | All 63 challenge content pieces |

### Modified Files

| File | Change |
|------|--------|
| `src/components/layouts/main-layout-client.tsx` | Nav restructure: Briefing to bottom nav, Calendar removed, More drawer sections |
| `src/components/dashboard/DashboardClient.tsx` | Rewrite to unified feed with priority-ordered cards |
| `src/app/(auth)/signup/page.tsx` | Combined welcome + signup |
| `src/app/(auth)/onboarding/role/page.tsx` | Auto-advance on tap |
| `src/app/(auth)/onboarding/family/page.tsx` | Expecting/Baby toggle |
| `src/app/(auth)/onboarding/invite/page.tsx` | Remove from flow (redirect to ready) |
| `src/app/(auth)/onboarding/complete/page.tsx` | Remove/redirect to ready |
| `src/app/(main)/briefing/page.tsx` | Enhanced reading experience, inline task completion |
| `src/app/(main)/tasks/page.tsx` | Add calendar view toggle |
| `src/app/(main)/calendar/page.tsx` | Redirect to `/tasks?view=calendar` |
| `src/components/tasks/tasks-page-client.tsx` | Calendar view toggle |
| `src/components/tasks/catch-up-section.tsx` | Yellow badges, 2-bucket triage |
| `src/components/tasks/catch-up-banner.tsx` | Auto-handled display |
| `src/components/tasks/catch-up-task-item.tsx` | Yellow badge styling |
| `src/components/shared/paywall-overlay.tsx` | Consistent modal design with paywall copy |
| `src/components/shared/paywall-banner.tsx` | Updated copy |
| `src/app/(public)/upgrade/page.tsx` | Pricing: $4.99/$39.99/$99.99 |
| `src/app/(main)/settings/subscription/page.tsx` | Updated comparison table |
| `src/services/subscription-service.ts` | Free window checks |
| `src/services/notification-service.ts` | Free window check for push notifications |
| `src/hooks/use-notifications.ts` | Subscription/window gating |

### Supabase Migrations (6)

1. `dad_challenge_content` table + `dad_challenge_pillar` enum
2. `dad_profiles` table
3. `mood_checkins` table
4. `catch_up_behavior` column on `task_templates`
5. `signup_week` column on `profiles`
6. RLS policies for all new tables

---

## 24. Verification Plan

### Database

- [ ] Run all 6 migrations successfully
- [ ] Verify tables with `list_tables` (public schema)
- [ ] Check RLS with `get_advisors` (security)
- [ ] Seed `dad_challenge_content` (63 rows)
- [ ] Verify `catch_up_behavior` on `task_templates`

### Onboarding

- [ ] Sign up as dad → 4 screens → dashboard in ~45 seconds
- [ ] Sign up as mom via invite → 3 screens → dashboard
- [ ] Role selection auto-advances on tap
- [ ] Family Setup shows Expecting/Baby toggle
- [ ] Ready screen shows real generation numbers
- [ ] Mid-pregnancy signup shows adapted preview ("X tasks loaded + Y earlier tasks sorted")

### Navigation

- [ ] Bottom nav: Home, Tasks, Briefing, Tracker, More
- [ ] Calendar NOT in bottom nav
- [ ] Briefing in bottom nav (not More drawer)
- [ ] More drawer has Tools, Family, Account sections
- [ ] Desktop sidebar mirrors same hierarchy

### Dashboard

- [ ] Dad sees: Mood Check-in, Briefing Teaser, Tasks Due, On Your Mind, Quick Actions
- [ ] Mom sees: Partner Activity Card (not mood), no On Your Mind tiles
- [ ] Personalize card appears for dads who haven't completed profile
- [ ] Invite Partner card appears when no partner
- [ ] Cards hide/show based on context correctly
- [ ] Desktop: two-column layout with full-width mood/shift cards

### Dad Journey

- [ ] `/journey` page shows all 7 expandable tiles for current phase
- [ ] Tiles expand with narrative, action items, dad quotes
- [ ] Free users: current phase content accessible, future/past phases locked
- [ ] Tile ordering respects user's concerns (from personalize card)

### Mood Check-in

- [ ] Not checked in → emoji selector → flags → submit → saved to DB
- [ ] Already checked in → compact bar with streak
- [ ] Refresh → "already checked in" state persists
- [ ] Next day → resets to unchecked state

### Briefings

- [ ] Dedicated bottom nav tab opens current week
- [ ] Week navigation (left/right arrows, swipe)
- [ ] Timeline overlay shows all weeks
- [ ] Free: 4-week window from signup. Week 5+ shows title only + upgrade prompt.
- [ ] Inline task completion works

### Tasks

- [ ] 30-day free window (not 14)
- [ ] Calendar view toggle on tasks page
- [ ] `/calendar` redirects to `/tasks?view=calendar`
- [ ] Yellow "Catch up" badges (not red "Overdue")
- [ ] 2-bucket triage for mid-pregnancy signups

### Paywall

- [ ] Pricing: $4.99/mo, $39.99/yr, $99.99 lifetime throughout
- [ ] Paywall modal uses context-specific copy
- [ ] Annual plan is primary CTA, monthly is secondary
- [ ] "Maybe later" dismisses cleanly
- [ ] All upgrade triggers fire correct copy

### Branding

- [ ] "The Dad Center" used everywhere (not "ParentLogs")
- [ ] Domain references: thedadcenter.com

### Content

- [ ] 63 content pieces (7 pillars × 9 phases) seeded
- [ ] Content tone: peer dad, direct, honest
- [ ] All prices reference $4.99/$39.99/$99.99

---

## 25. Design Principles

1. **Speed to Value.** Users see personalized, useful content within 60 seconds of opening the app.

2. **Neutral Third Party.** The app is the authority, not either partner. Tasks are auto-assigned. Notifications come from the system.

3. **Yellow, Not Red.** Frame catch-up tasks as empowering ("catch up") rather than punitive ("overdue"). Frame limitations as edges, not walls.

4. **One Subscription Per Family.** Both partners share access. No per-user pricing.

5. **Four-Level Attention Hierarchy.** 3-second notifications, 90-second briefings, 2-5 minute tasks, on-demand articles.

6. **Role-Agnostic Navigation, Role-Aware Content.** Navigation structure identical for all users. Dashboard cards and content change based on role.

7. **Dad-First, Not Dad-Only.** The emotional content IS the hook for dads. Mom gets practical coordination tools. Both experiences are valuable.

8. **Free Should Feel Complete.** The free tier delivers genuine value. Premium unlocks depth (full timeline, future phases, analytics, coordination).

---

*This document supersedes all prior specs. Use alongside `PAYWALL_STRATEGY_v2.1.md` for detailed paywall economics and `dad-first-redesign-plan.md` for content examples.*

*Build order: Phases 1-3 (foundation) → 4-6 (onboarding + nav + routing) → 7-9 (dashboard + journey + mood) → 10-11 (briefings + tasks) → 12-13 (mom + catch-up) → 14-17 (notifications + paywall + content)*
