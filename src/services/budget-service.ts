import { createClient } from '@/lib/supabase/client'
import { BudgetTemplate, BudgetPeriod, FamilyBudgetItem } from '@/types'
import { isPremiumTier } from '@/lib/subscription-utils'

const supabase = createClient()

export interface BudgetCategory {
  name: string
  items: BudgetTemplate[]
  totalMin: number
  totalMax: number
}

export interface BudgetSummary {
  categories: BudgetCategory[]
  grandTotalMin: number
  grandTotalMax: number
  monthlyRecurringMin: number
  monthlyRecurringMax: number
  familyItems: FamilyBudgetItem[]
  purchasedTotal: number
  remainingTotal: number
}

export const budgetService = {
  async getBudgetTemplates(period?: BudgetPeriod): Promise<BudgetTemplate[]> {
    let query = supabase
      .from('budget_templates')
      .select('*')
      .not('period', 'is', null)
      .order('category', { ascending: true })
      .order('price_min', { ascending: true })

    if (period) {
      query = query.eq('period', period)
    }

    const { data, error } = await query
    if (error) throw error
    return (data || []) as unknown as BudgetTemplate[]
  },

  async getBudgetSummary(): Promise<BudgetSummary | null> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('family_id, subscription_tier')
      .eq('id', user.id)
      .single()

    if (profileError && profileError.code !== 'PGRST116') throw profileError
    if (!profile?.family_id) return null

    const isPremium = isPremiumTier(profile.subscription_tier)

    // Get all templates (only V2 rows with period set)
    const { data: templates, error: templatesError } = await supabase
      .from('budget_templates')
      .select('*')
      .not('period', 'is', null)
      .order('category', { ascending: true })
      .order('price_min', { ascending: true })

    if (templatesError) throw templatesError

    // Get family's budget items
    const { data: familyItems, error: familyItemsError } = await supabase
      .from('family_budget')
      .select('*')
      .eq('family_id', profile.family_id)
      .order('created_at', { ascending: true })

    if (familyItemsError) throw familyItemsError

    // Group templates by category
    const categoryMap = new Map<string, BudgetTemplate[]>()
    templates?.forEach(t => {
      const existing = categoryMap.get(t.category) || []
      existing.push(t as unknown as BudgetTemplate)
      categoryMap.set(t.category, existing)
    })

    const categories: BudgetCategory[] = Array.from(categoryMap.entries()).map(([name, items]) => ({
      name,
      items: items.map(item => ({
        ...item,
        is_premium: !isPremium && item.is_premium,
      })),
      // Exclude tip items from totals
      totalMin: items.filter(i => i.priority !== 'tip').reduce((sum, i) => sum + (i.price_min || 0), 0),
      totalMax: items.filter(i => i.priority !== 'tip').reduce((sum, i) => sum + (i.price_max || 0), 0),
    }))

    const nonTipTemplates = (templates || []).filter(t => t.priority !== 'tip') as unknown as BudgetTemplate[]
    const grandTotalMin = nonTipTemplates.reduce((sum, t) => sum + (t.price_min || 0), 0)
    const grandTotalMax = nonTipTemplates.reduce((sum, t) => sum + (t.price_max || 0), 0)

    // Monthly recurring costs
    const recurringItems = nonTipTemplates.filter(t => t.is_recurring && t.recurring_frequency === 'monthly')
    const monthlyRecurringMin = recurringItems.reduce((sum, t) => sum + (t.price_min || 0), 0)
    const monthlyRecurringMax = recurringItems.reduce((sum, t) => sum + (t.price_max || 0), 0)

    const purchasedItems = familyItems?.filter(i => i.is_purchased) || []
    const purchasedTotal = purchasedItems.reduce((sum, i) => sum + (i.actual_price || i.estimated_price || 0), 0)

    const pendingItems = familyItems?.filter(i => !i.is_purchased) || []
    const remainingTotal = pendingItems.reduce((sum, i) => sum + (i.estimated_price || 0), 0)

    return {
      categories,
      grandTotalMin,
      grandTotalMax,
      monthlyRecurringMin,
      monthlyRecurringMax,
      familyItems: (familyItems || []) as FamilyBudgetItem[],
      purchasedTotal,
      remainingTotal,
    }
  },

  async addToFamilyBudget(templateId: string, estimatedPrice?: number): Promise<{ error: Error | null }> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: new Error('Not authenticated') }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('family_id')
      .eq('id', user.id)
      .single()

    if (profileError && profileError.code !== 'PGRST116') return { error: profileError as Error }
    if (!profile?.family_id) return { error: new Error('No family found') }

    // Get template details
    const { data: template, error: templateError } = await supabase
      .from('budget_templates')
      .select('*')
      .eq('budget_id', templateId)
      .single()

    if (templateError && templateError.code !== 'PGRST116') return { error: templateError as Error }
    if (!template) return { error: new Error('Template not found') }

    // Check if already added
    const { data: existing, error: existingError } = await supabase
      .from('family_budget')
      .select('id')
      .eq('family_id', profile.family_id)
      .eq('budget_template_id', templateId)
      .maybeSingle()

    if (existingError) return { error: existingError as Error }
    if (existing) return { error: new Error('Item already in your budget') }

    const { error } = await supabase
      .from('family_budget')
      .insert({
        family_id: profile.family_id,
        budget_template_id: templateId,
        item: template.item,
        category: template.category,
        estimated_price: estimatedPrice || template.price_min || 0,
        is_purchased: false,
        is_custom: false,
        is_recurring: template.is_recurring || false,
      })

    return { error: error as Error | null }
  },

  async addCustomItem(item: string, category: string, estimatedPrice: number): Promise<{ error: Error | null }> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: new Error('Not authenticated') }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('family_id')
      .eq('id', user.id)
      .single()

    if (profileError && profileError.code !== 'PGRST116') return { error: profileError as Error }
    if (!profile?.family_id) return { error: new Error('No family found') }

    const { error } = await supabase
      .from('family_budget')
      .insert({
        family_id: profile.family_id,
        item,
        category,
        estimated_price: estimatedPrice,
        is_purchased: false,
        is_custom: true,
        is_recurring: false,
      })

    return { error: error as Error | null }
  },

  async updateBudgetItem(
    itemId: string,
    updates: Partial<Pick<FamilyBudgetItem, 'estimated_price' | 'actual_price' | 'is_purchased' | 'notes'>>
  ): Promise<{ error: Error | null }> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: new Error('Not authenticated') }

    const updateData: Record<string, unknown> = { ...updates }
    if (updates.is_purchased === true) {
      updateData.purchased_at = new Date().toISOString()
    } else if (updates.is_purchased === false) {
      updateData.purchased_at = null
    }

    const { error } = await supabase
      .from('family_budget')
      .update(updateData)
      .eq('id', itemId)

    return { error: error as Error | null }
  },

  async removeBudgetItem(itemId: string): Promise<{ error: Error | null }> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: new Error('Not authenticated') }

    const { data: profile } = await supabase
      .from('profiles')
      .select('family_id')
      .eq('id', user.id)
      .single()

    if (!profile?.family_id) return { error: new Error('No family found') }

    const { error } = await supabase
      .from('family_budget')
      .delete()
      .eq('id', itemId)
      .eq('family_id', profile.family_id)

    return { error: error as Error | null }
  },

  async markAsPurchased(itemId: string, actualPrice?: number): Promise<{ error: Error | null }> {
    return this.updateBudgetItem(itemId, {
      is_purchased: true,
      actual_price: actualPrice,
    })
  },

  formatPrice(cents: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(cents / 100)
  },

  formatPriceRange(min: number, max: number): string {
    if (min === max || max === 0) return this.formatPrice(min)
    return `${this.formatPrice(min)} - ${this.formatPrice(max)}`
  },
}
