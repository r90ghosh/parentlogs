import { createServerSupabaseClient } from '@/lib/supabase/server'
import { BudgetTemplate } from '@/types'

// Premium checklists: CL-05 through CL-11
const PREMIUM_CHECKLIST_IDS = ['CL-05', 'CL-06', 'CL-07', 'CL-08', 'CL-09', 'CL-10', 'CL-11']

/**
 * Fetch all V2 budget templates (public, no auth required)
 * Only returns rows with period set (V2 format)
 */
export async function getPublicBudgetTemplates(): Promise<BudgetTemplate[]> {
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from('budget_templates')
    .select('*')
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

  const { data: checklists, error: clError } = await supabase
    .from('checklist_templates')
    .select('*')
    .order('checklist_id', { ascending: true })

  if (clError) throw clError
  if (!checklists) return []

  // Get item counts per checklist
  const { data: items, error: itemError } = await supabase
    .from('checklist_item_templates')
    .select('checklist_id')

  if (itemError) throw itemError

  const countMap = new Map<string, number>()
  items?.forEach(item => {
    countMap.set(item.checklist_id, (countMap.get(item.checklist_id) || 0) + 1)
  })

  return checklists.map(cl => ({
    checklist_id: cl.checklist_id,
    name: cl.name,
    description: cl.description,
    stage: cl.stage,
    is_premium: PREMIUM_CHECKLIST_IDS.includes(cl.checklist_id),
    itemCount: countMap.get(cl.checklist_id) || 0,
  }))
}

/**
 * Fetch a single checklist with all its items (public, no auth required)
 */
export async function getPublicChecklistById(id: string) {
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
