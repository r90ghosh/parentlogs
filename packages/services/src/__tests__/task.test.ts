import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createTaskService } from '../task-service'
import type { AppSupabaseClient } from '../types'

// ---------------------------------------------------------------------------
// Helpers to build a mock Supabase client
// ---------------------------------------------------------------------------

function createMockQuery(resolvedData: unknown = [], resolvedError: unknown = null) {
  const query: Record<string, unknown> = {}
  const chainMethods = [
    'select', 'insert', 'update', 'delete', 'upsert',
    'eq', 'neq', 'in', 'ilike', 'lte', 'gte',
    'order', 'limit', 'range', 'single',
  ]

  for (const method of chainMethods) {
    query[method] = vi.fn().mockReturnValue(query)
  }

  // Terminal — the last call in a chain resolves
  query.then = vi.fn((resolve: (v: unknown) => void) =>
    resolve({ data: resolvedData, error: resolvedError, count: Array.isArray(resolvedData) ? resolvedData.length : 0 })
  )

  return query
}

function createMockSupabase(overrides?: {
  fromData?: unknown
  fromError?: unknown
  authUser?: { id: string } | null
  profileData?: Record<string, unknown> | null
}) {
  const {
    fromData = [],
    fromError = null,
    authUser = { id: 'user-1' },
    profileData = { family_id: 'fam-1', subscription_tier: 'free', active_baby_id: null },
  } = overrides ?? {}

  // Profile query is a nested chain ending in .single()
  const profileQuery = createMockQuery(profileData, null)
  const mainQuery = createMockQuery(fromData, fromError)

  const mock = {
    from: vi.fn((table: string) => {
      if (table === 'profiles') return profileQuery
      return mainQuery
    }),
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: authUser }, error: null }),
    },
  }

  return mock as unknown as AppSupabaseClient
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('createTaskService', () => {
  it('returns an object with expected methods', () => {
    const supabase = createMockSupabase()
    const service = createTaskService(supabase)

    expect(service).toHaveProperty('getTasks')
    expect(service).toHaveProperty('getTaskById')
    expect(service).toHaveProperty('completeTask')
    expect(service).toHaveProperty('uncompleteTask')
    expect(service).toHaveProperty('snoozeTask')
    expect(service).toHaveProperty('skipTask')
    expect(service).toHaveProperty('createTask')
    expect(service).toHaveProperty('updateTask')
    expect(service).toHaveProperty('deleteTask')
    expect(service).toHaveProperty('getDashboardPriorityTasks')
    expect(service).toHaveProperty('getDashboardTaskStats')
    expect(service).toHaveProperty('getBacklogTasks')
    expect(service).toHaveProperty('triageTask')
    expect(service).toHaveProperty('bulkTriageTasks')
    expect(service).toHaveProperty('getBacklogCount')

    // All are functions
    for (const value of Object.values(service)) {
      expect(typeof value).toBe('function')
    }
  })

  describe('getTasks', () => {
    it('queries family_tasks filtered by family_id from context', async () => {
      const mockTasks = [
        { id: 't1', title: 'Buy crib', family_id: 'fam-1', status: 'pending', due_date: '2026-05-01' },
        { id: 't2', title: 'Book hospital tour', family_id: 'fam-1', status: 'pending', due_date: '2026-05-10' },
      ]

      const supabase = createMockSupabase({ fromData: mockTasks })
      const service = createTaskService(supabase)

      const result = await service.getTasks({}, { userId: 'user-1', familyId: 'fam-1' })

      expect(result).toEqual(mockTasks)
      expect(supabase.from).toHaveBeenCalledWith('family_tasks')
    })

    it('returns empty array when context cannot be resolved', async () => {
      const supabase = createMockSupabase({ authUser: null })
      const service = createTaskService(supabase)

      const result = await service.getTasks()

      expect(result).toEqual([])
    })
  })

  describe('getTaskById', () => {
    it('returns a single task by id', async () => {
      const task = { id: 't1', title: 'Buy crib', family_id: 'fam-1' }
      const supabase = createMockSupabase({ fromData: task })
      const service = createTaskService(supabase)

      const result = await service.getTaskById('t1')

      expect(result).toEqual(task)
      expect(supabase.from).toHaveBeenCalledWith('family_tasks')
    })
  })

  describe('error handling', () => {
    it('throws when supabase returns an error on getTasks', async () => {
      const supabase = createMockSupabase({
        fromError: { message: 'permission denied', code: '42501' },
      })
      const service = createTaskService(supabase)

      await expect(
        service.getTasks({}, { userId: 'user-1', familyId: 'fam-1' })
      ).rejects.toEqual({ message: 'permission denied', code: '42501' })
    })
  })
})
