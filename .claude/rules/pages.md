---
description: Rules for Next.js App Router pages and layouts
globs: src/app/**
---

# Page & Layout Rules

## Server Components (default)
- Pages and layouts are server components by default
- Use `getServerAuth()` for auth in layouts (see `src/app/(main)/layout.tsx`)
- Pass data to client components via props or context providers

## Client Components
- Add `'use client'` only when needed (interactivity, hooks, browser APIs)
- Page files should be thin server wrappers passing to client components

## Layout Pattern (authenticated routes)
```typescript
// src/app/(main)/layout.tsx pattern
import { getServerAuth } from '@/lib/supabase/server-auth'
import { UserProvider } from '@/components/user-provider'
import { redirect } from 'next/navigation'

export default async function Layout({ children }) {
  const { user, profile, family } = await getServerAuth()
  if (!user) redirect('/login')
  if (!profile?.onboarding_completed) redirect('/onboarding')
  if (!family) redirect('/onboarding/family')
  return (
    <UserProvider user={user} profile={profile} family={family}>
      {children}
    </UserProvider>
  )
}
```

## Route Groups
| Group | Auth Required | Layout |
|-------|-------------|--------|
| `(auth)` | No (except onboarding steps) | Minimal (no nav) |
| `(main)` | Yes + family required | Full app chrome (nav, header, sidebar) |
| `(marketing)` | No | Marketing layout |
| `(public)` | Varies | Minimal |

## V2 New Routes
| Route | File | Notes |
|-------|------|-------|
| `/onboarding/ready` | `(auth)/onboarding/ready/page.tsx` | Replaces invite + complete |
| `/journey` | `(main)/journey/page.tsx` | All 7 challenge tiles |
| `/onboarding/personalize` | `(main)/onboarding/personalize/page.tsx` | Dad profile (from dashboard card) |
| `/briefing/[weekId]` | `(main)/briefing/[weekId]/page.tsx` | Specific week briefing |

## Navigation (V2)
- Bottom nav: Home, Tasks, Briefing, Tracker, More
- Calendar removed from nav → `/tasks?view=calendar`
- Briefing promoted from More drawer to bottom nav
- More drawer: Tools section, Family section, Account section

## File Naming
- Pages: `page.tsx` (Next.js convention)
- Layouts: `layout.tsx`
- Client wrappers: `*-client.tsx` (e.g., `DashboardClient.tsx`)
- Loading states: `loading.tsx`
- Error boundaries: `error.tsx`
