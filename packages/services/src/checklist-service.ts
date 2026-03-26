import type { ChecklistTemplate, ChecklistItemTemplate } from '@tdc/shared/types'
import { isPremiumTier } from '@tdc/shared/utils/subscription-utils'
import type { AppSupabaseClient, ServiceContext } from './types'

// All checklists are free for SEO
const PREMIUM_CHECKLIST_IDS: string[] = []

export interface ChecklistWithItems extends ChecklistTemplate {
  items: ChecklistItemTemplate[]
  progress: {
    completed: number
    total: number
    percentage: number
  }
  is_premium: boolean
  is_locked: boolean
}

export interface ChecklistProgress {
  id: string
  family_id: string
  checklist_id: string
  item_id: string
  is_checked: boolean | null
  checked_at: string | null
  checked_by: string | null
  created_at: string | null
}

export function createChecklistService(supabase: AppSupabaseClient) {
  async function resolveContext(ctx?: Partial<ServiceContext>): Promise<ServiceContext | null> {
    if (ctx?.userId && ctx?.familyId) {
      return ctx as ServiceContext
    }
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null
    const { data: profile } = await supabase
      .from('profiles')
      .select('family_id, subscription_tier, active_baby_id')
      .eq('id', user.id)
      .single()
    if (!profile?.family_id) return null
    return {
      userId: user.id,
      familyId: profile.family_id,
      babyId: profile.active_baby_id ?? undefined,
      subscriptionTier: profile.subscription_tier ?? undefined,
    }
  }

  return {
    async getChecklists(ctx?: Partial<ServiceContext>): Promise<ChecklistWithItems[]> {
      const resolved = await resolveContext(ctx)
      if (!resolved) return []

      const isPremium = isPremiumTier(resolved.subscriptionTier)

      // Get all checklist templates
      const { data: checklists } = await supabase
        .from('checklist_templates')
        .select('*')
        .order('sort_order', { ascending: true })

      if (!checklists) return []

      // Get all items for all checklists
      const { data: allItems } = await supabase
        .from('checklist_item_templates')
        .select('*')
        .order('sort_order', { ascending: true })

      // Get user's progress
      let progressQuery = supabase
        .from('checklist_progress')
        .select('*')
        .eq('family_id', resolved.familyId)

      if (resolved.babyId) {
        progressQuery = progressQuery.eq('baby_id', resolved.babyId)
      }

      const { data: progressData } = await progressQuery

      const progressMap = new Map<string, boolean>()
      progressData?.forEach(p => {
        progressMap.set(`${p.checklist_id}-${p.item_id}`, p.is_checked ?? false)
      })

      return checklists.map(checklist => {
        const items = (allItems || []).filter(item => item.checklist_id === checklist.checklist_id)
        const completedCount = items.filter(item =>
          progressMap.get(`${checklist.checklist_id}-${item.item_id}`)
        ).length

        return {
          ...checklist,
          items,
          progress: {
            completed: completedCount,
            total: items.length,
            percentage: items.length > 0 ? Math.round((completedCount / items.length) * 100) : 0,
          },
          is_premium: PREMIUM_CHECKLIST_IDS.includes(checklist.checklist_id),
          is_locked: !isPremium && PREMIUM_CHECKLIST_IDS.includes(checklist.checklist_id),
        }
      }) as ChecklistWithItems[]
    },

    async getChecklistById(checklistId: string, ctx?: Partial<ServiceContext>): Promise<ChecklistWithItems | null> {
      const resolved = await resolveContext(ctx)
      if (!resolved) return null

      const isPremium = isPremiumTier(resolved.subscriptionTier)

      // Check if locked
      if (!isPremium && PREMIUM_CHECKLIST_IDS.includes(checklistId)) {
        return null
      }

      // Get checklist
      const { data: checklist } = await supabase
        .from('checklist_templates')
        .select('*')
        .eq('checklist_id', checklistId)
        .maybeSingle()

      if (!checklist) return null

      // Get items
      const { data: items } = await supabase
        .from('checklist_item_templates')
        .select('*')
        .eq('checklist_id', checklistId)
        .order('sort_order', { ascending: true })

      // Get progress
      let progressQuery = supabase
        .from('checklist_progress')
        .select('*')
        .eq('family_id', resolved.familyId)
        .eq('checklist_id', checklistId)

      if (resolved.babyId) {
        progressQuery = progressQuery.eq('baby_id', resolved.babyId)
      }

      const { data: progressData } = await progressQuery

      const progressMap = new Map<string, ChecklistProgress>()
      progressData?.forEach(p => {
        progressMap.set(p.item_id, p)
      })

      const itemsWithProgress = (items || []).map(item => ({
        ...item,
        completed: progressMap.get(item.item_id)?.is_checked || false,
      }))

      const completedCount = itemsWithProgress.filter(i => i.completed).length

      return {
        ...checklist,
        items: itemsWithProgress,
        progress: {
          completed: completedCount,
          total: itemsWithProgress.length,
          percentage: itemsWithProgress.length > 0
            ? Math.round((completedCount / itemsWithProgress.length) * 100)
            : 0,
        },
        is_premium: PREMIUM_CHECKLIST_IDS.includes(checklistId),
        is_locked: false, // If we got here, the checklist is accessible
      } as ChecklistWithItems
    },

    async toggleItem(checklistId: string, itemId: string, completed: boolean, ctx?: Partial<ServiceContext>): Promise<{ error: Error | null }> {
      const resolved = await resolveContext(ctx)
      if (!resolved) return { error: new Error('Not authenticated') }

      // Upsert progress
      const { error } = await supabase
        .from('checklist_progress')
        .upsert({
          family_id: resolved.familyId,
          baby_id: resolved.babyId,
          checklist_id: checklistId,
          item_id: itemId,
          is_checked: completed,
          checked_at: completed ? new Date().toISOString() : null,
          checked_by: completed ? resolved.userId : null,
        }, {
          onConflict: 'family_id,baby_id,checklist_id,item_id',
        })

      return { error: error as Error | null }
    },

    async resetChecklist(checklistId: string, ctx?: Partial<ServiceContext>): Promise<{ error: Error | null }> {
      const resolved = await resolveContext(ctx)
      if (!resolved) return { error: new Error('Not authenticated') }

      let query = supabase
        .from('checklist_progress')
        .delete()
        .eq('family_id', resolved.familyId)
        .eq('checklist_id', checklistId)

      if (resolved.babyId) {
        query = query.eq('baby_id', resolved.babyId)
      }

      const { error } = await query

      return { error: error as Error | null }
    },

    isPremiumChecklist(checklistId: string): boolean {
      return PREMIUM_CHECKLIST_IDS.includes(checklistId)
    },
  }
}

export type ChecklistService = ReturnType<typeof createChecklistService>
