---
description: Rules for React components
globs: src/components/**
---

# Component Rules

## Client Components
- Add `'use client'` directive at the top
- Use hooks from `@/hooks/` for data fetching
- Use `useUser()` from `@/components/user-provider` for auth context
- Use `useAuth()` from `@/lib/auth/auth-context` for sign out

## UI Primitives
- Use Radix UI via shadcn pattern (`src/components/ui/`)
- Import from `@/components/ui/button`, `@/components/ui/card`, etc.
- Use `cn()` from `@/lib/utils` for className merging

## Styling
- Tailwind CSS 4.x classes
- Dark theme: `bg-surface-950` (page), `bg-surface-900` (cards/header), `bg-surface-800` (borders/hover)
- Accent: `accent-500`/`accent-600` for active states
- Text: `text-surface-300` (secondary), `text-surface-400` (muted)

## Animation (Framer Motion)
- Import from `framer-motion`
- Stagger animations for list items:
  ```tsx
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
  >
  ```
- Use `AnimatePresence` for enter/exit animations
- Reference: `src/components/tasks/animations/task-animations.tsx`

## Icons
- Import from `lucide-react`
- Size: `h-5 w-5` for nav, `h-4 w-4` for inline

## Dashboard Cards (V2)
- Each card is a self-contained component in `src/components/dashboard/`
- Cards receive props from the priority engine (`src/hooks/use-dashboard-context.ts`)
- Cards handle their own loading/empty states
- Role-aware: check `profile.role` for dad/mom differences
- Naming: `MoodCheckinCard.tsx`, `BriefingTeaserCard.tsx`, etc.

## Dad Journey Components (V2)
- Directory: `src/components/dashboard/dad-journey/`
- `DadChallengeTiles.tsx` — container with stagger animation
- `DadChallengeTile.tsx` — expandable tile (color-coded border, gradient bg)
- `MoodCheckinWidget.tsx` — emoji selector + flags + submit OR compact "already checked in"
- Barrel exports via `index.ts`

## Paywall Integration
- Use `PaywallOverlay` from `src/components/shared/paywall-overlay.tsx`
- Pass `featureKey` to get context-specific copy from `src/lib/paywall-copy.ts`
- Never trust client-side subscription state for data access
