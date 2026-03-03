---
description: Rules for React Query hooks
globs: src/hooks/**
---

# React Query Hook Rules

## Pattern (follow `src/hooks/use-dashboard.ts`)
```typescript
'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { exampleService } from '@/services/example-service'

// Read hook
export function useExampleData(id: string) {
  return useQuery({
    queryKey: ['example', id],
    queryFn: () => exampleService.getData(id),
    enabled: !!id,
  })
}

// Mutation hook
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

## Conventions
- **Always `'use client'`** at the top of hook files
- **Query key convention:** `['domain', ...params]`
  - Dashboard: `['dashboard', familyId, currentWeek]`
  - Dad journey: `['dad-challenge-content', phase]`, `['dad-profile', userId]`
  - Mood: `['mood-checkin', userId]`, `['mood-history', userId, limit]`
  - Tasks: `['tasks', familyId]`
  - Briefings: `['briefing', weekId]`
- **`enabled` guard:** Always gate queries on required params (`enabled: !!id`)
- **Invalidation on mutation:** Invalidate related query keys in `onSuccess`
- **Cross-domain invalidation:** Mutations that affect dashboard should also invalidate `['dashboard']`
- **Stale time:** Use `staleTime` for data that doesn't change often (default: 0)
  - Dashboard: 2 minutes (`1000 * 60 * 2`)
  - Challenge content: 10 minutes (changes rarely)
  - Mood check-in (today's): 30 seconds

## V2 New Hooks
- `src/hooks/use-dad-journey.ts` — challenge content, dad profile, mood check-ins
- `src/hooks/use-dashboard-context.ts` — card priority engine
