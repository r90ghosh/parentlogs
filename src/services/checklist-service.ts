import { createClient } from '@/lib/supabase/client'
import { ChecklistTemplate, ChecklistItemTemplate } from '@/types'
import { isPremiumTier } from '@/lib/subscription-utils'

const supabase = createClient()

// Premium checklists: CL-05 through CL-11
const PREMIUM_CHECKLIST_IDS = ['CL-05', 'CL-06', 'CL-07', 'CL-08', 'CL-09', 'CL-10', 'CL-11']

export interface ServiceContext {
  userId: string
  familyId: string
  subscriptionTier?: string
}

async function resolveContext(ctx?: Partial<ServiceContext>): Promise<ServiceContext | null> {
  if (ctx?.userId && ctx?.familyId) {
    return ctx as ServiceContext
  }
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data: profile } = await supabase
    .from('profiles')
    .select('family_id, subscription_tier')
    .eq('id', user.id)
    .single()
  if (!profile?.family_id) return null
  return {
    userId: user.id,
    familyId: profile.family_id,
    subscriptionTier: profile.subscription_tier ?? undefined,
  }
}

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

export const checklistService = {
  async getChecklists(ctx?: Partial<ServiceContext>): Promise<ChecklistWithItems[]> {
    const resolved = await resolveContext(ctx)
    if (!resolved) return []

    const isPremium = isPremiumTier(resolved.subscriptionTier)

    // Get all checklist templates
    const { data: checklists } = await supabase
      .from('checklist_templates')
      .select('*')
      .order('checklist_id', { ascending: true })

    if (!checklists) return []

    // Get all items for all checklists
    const { data: allItems } = await supabase
      .from('checklist_item_templates')
      .select('*')
      .order('sort_order', { ascending: true })

    // Get user's progress
    const { data: progressData } = await supabase
      .from('checklist_progress')
      .select('*')
      .eq('family_id', resolved.familyId)

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
    const { data: progressData } = await supabase
      .from('checklist_progress')
      .select('*')
      .eq('family_id', resolved.familyId)
      .eq('checklist_id', checklistId)

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
        checklist_id: checklistId,
        item_id: itemId,
        is_checked: completed,
        checked_at: completed ? new Date().toISOString() : null,
        checked_by: completed ? resolved.userId : null,
      }, {
        onConflict: 'family_id,checklist_id,item_id',
      })

    return { error: error as Error | null }
  },

  async resetChecklist(checklistId: string, ctx?: Partial<ServiceContext>): Promise<{ error: Error | null }> {
    const resolved = await resolveContext(ctx)
    if (!resolved) return { error: new Error('Not authenticated') }

    const { error } = await supabase
      .from('checklist_progress')
      .delete()
      .eq('family_id', resolved.familyId)
      .eq('checklist_id', checklistId)

    return { error: error as Error | null }
  },

  isPremiumChecklist(checklistId: string): boolean {
    return PREMIUM_CHECKLIST_IDS.includes(checklistId)
  },
}
