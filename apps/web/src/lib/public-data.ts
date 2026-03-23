import { createServerSupabaseClient } from '@/lib/supabase/server'
import { PREMIUM_CHECKLIST_IDS } from '@/lib/checklist-constants'
import { BudgetTemplate } from '@tdc/shared/types'

/**
 * Fetch all V2 budget templates (public, no auth required)
 * Only returns rows with period set (V2 format)
 */
export async function getPublicBudgetTemplates(): Promise<BudgetTemplate[]> {
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from('budget_templates')
    .select('budget_id, category, subcategory, item, description, period, priority, price_min, price_max, price_display, is_recurring, recurring_frequency, brand_premium, brand_value, notes, is_premium, price_currency')
    .not('period', 'is', null)
    .order('category', { ascending: true })
    .order('price_min', { ascending: true })

  if (error) throw error
  return (data || []) as unknown as BudgetTemplate[]
}

/**
 * Fetch all checklist templates with item counts (public, no auth required)
 */
export async function getPublicChecklists() {
  const supabase = await createServerSupabaseClient()

  const { data: checklists, error } = await supabase
    .from('checklist_templates')
    .select('*, checklist_item_templates(count)')
    .order('checklist_id', { ascending: true })

  if (error) throw error
  if (!checklists) return []

  return checklists.map(cl => ({
    checklist_id: cl.checklist_id,
    name: cl.name,
    description: cl.description,
    stage: cl.stage,
    is_premium: PREMIUM_CHECKLIST_IDS.includes(cl.checklist_id),
    itemCount: cl.checklist_item_templates?.[0]?.count ?? 0,
  }))
}

/**
 * Fetch a single checklist with all its items (public, no auth required)
 */
export async function getPublicChecklistById(id: string) {
  if (!/^CL-\d{2}$/.test(id)) return null

  const supabase = await createServerSupabaseClient()

  const { data: checklist, error: clError } = await supabase
    .from('checklist_templates')
    .select('*')
    .eq('checklist_id', id)
    .single()

  if (clError && clError.code !== 'PGRST116') throw clError
  if (!checklist) return null

  const { data: items, error: itemError } = await supabase
    .from('checklist_item_templates')
    .select('*')
    .eq('checklist_id', id)
    .order('sort_order', { ascending: true })

  if (itemError) throw itemError

  return {
    ...checklist,
    is_premium: PREMIUM_CHECKLIST_IDS.includes(checklist.checklist_id),
    items: items || [],
    itemCount: items?.length || 0,
  }
}
