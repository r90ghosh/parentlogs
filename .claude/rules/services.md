---
description: Rules for Supabase service layer
globs: src/services/**
---

# Service Layer Rules

## Pattern (follow `src/services/briefing-service.ts`)
```typescript
import { createClient } from '@/lib/supabase/client'
import { TypeA, TypeB } from '@/types/relevant-types'

const supabase = createClient()

export const exampleService = {
  async getItems(): Promise<TypeA[]> {
    const { data, error } = await supabase
      .from('table_name')
      .select('*')
      .order('sort_order')
    if (error) throw error
    return data || []
  },

  async getByUser(userId: string): Promise<TypeA | null> {
    const { data, error } = await supabase
      .from('table_name')
      .select('*')
      .eq('user_id', userId)
      .single()
    // PGRST116 = "no rows returned" — not an error for optional data
    if (error && error.code !== 'PGRST116') throw error
    return data
  },

  async upsert(userId: string, payload: Partial<TypeA>): Promise<TypeA> {
    const { data, error } = await supabase
      .from('table_name')
      .upsert({ user_id: userId, ...payload }, { onConflict: 'user_id' })
      .select()
      .single()
    if (error) throw error
    return data
  },
}
```

## Conventions
- **Singleton client:** `const supabase = createClient()` at module level
- **Named export:** `export const fooService = { ... }` (not default export)
- **Error handling:** Throw Supabase errors, let hooks/components handle UI
- **PGRST116:** Handle "no rows" case for `.single()` calls on optional data
- **Types:** Import from `@/types/` — never use `any`
- **Return patterns:**
  - Single item: `Promise<Type | null>`
  - Lists: `Promise<Type[]>` (return `data || []`)
  - Mutations: `Promise<Type>` (return created/updated item)

## Additional Services
- `src/services/dad-journey-service.ts` — challenge content, dad profiles, mood check-ins
- Notification + subscription services handle free window checks
