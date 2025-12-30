import { createClient } from '@/lib/supabase/client'
import { BudgetTemplate, FamilyBudgetItem, FamilyStage } from '@/types'

const supabase = createClient()

export interface BudgetCategory {
  name: string
  items: BudgetTemplate[]
  totalLow: number
  totalMid: number
  totalHigh: number
}

export interface BudgetSummary {
  categories: BudgetCategory[]
  grandTotalLow: number
  grandTotalMid: number
  grandTotalHigh: number
  familyItems: FamilyBudgetItem[]
  purchasedTotal: number
  remainingTotal: number
}

export const budgetService = {
  async getBudgetTemplates(stage?: FamilyStage): Promise<BudgetTemplate[]> {
    let query = supabase
      .from('budget_templates')
      .select('*')
      .order('category', { ascending: true })
      .order('week_start', { ascending: true })

    if (stage) {
      query = query.eq('stage', stage)
    }

    const { data } = await query
    return (data || []) as BudgetTemplate[]
  },

  async getBudgetSummary(): Promise<BudgetSummary | null> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data: profile } = await supabase
      .from('profiles')
      .select('family_id, subscription_tier')
      .eq('id', user.id)
      .single()

    if (!profile?.family_id) return null

    const isPremium = profile.subscription_tier === 'premium' || profile.subscription_tier === 'lifetime'

    // Get all templates
    const { data: templates } = await supabase
      .from('budget_templates')
      .select('*')
      .order('category', { ascending: true })
      .order('week_start', { ascending: true })

    // Get family's budget items
    const { data: familyItems } = await supabase
      .from('family_budget')
      .select('*')
      .eq('family_id', profile.family_id)
      .order('created_at', { ascending: true })

    // Group templates by category
    const categoryMap = new Map<string, BudgetTemplate[]>()
    templates?.forEach(t => {
      const existing = categoryMap.get(t.category) || []
      existing.push(t as BudgetTemplate)
      categoryMap.set(t.category, existing)
    })

    const categories: BudgetCategory[] = Array.from(categoryMap.entries()).map(([name, items]) => ({
      name,
      items: items.map(item => ({
        ...item,
        is_premium: !isPremium && item.is_premium,
      })),
      totalLow: items.reduce((sum, i) => sum + (i.price_low || 0), 0),
      totalMid: items.reduce((sum, i) => sum + (i.price_mid || 0), 0),
      totalHigh: items.reduce((sum, i) => sum + (i.price_high || 0), 0),
    }))

    const grandTotalLow = categories.reduce((sum, c) => sum + c.totalLow, 0)
    const grandTotalMid = categories.reduce((sum, c) => sum + c.totalMid, 0)
    const grandTotalHigh = categories.reduce((sum, c) => sum + c.totalHigh, 0)

    const purchasedItems = familyItems?.filter(i => i.is_purchased) || []
    const purchasedTotal = purchasedItems.reduce((sum, i) => sum + (i.actual_price || i.estimated_price || 0), 0)

    const pendingItems = familyItems?.filter(i => !i.is_purchased) || []
    const remainingTotal = pendingItems.reduce((sum, i) => sum + (i.estimated_price || 0), 0)

    return {
      categories,
      grandTotalLow,
      grandTotalMid,
      grandTotalHigh,
      familyItems: (familyItems || []) as FamilyBudgetItem[],
      purchasedTotal,
      remainingTotal,
    }
  },

  async addToFamilyBudget(templateId: string, estimatedPrice?: number): Promise<{ error: Error | null }> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: new Error('Not authenticated') }

    const { data: profile } = await supabase
      .from('profiles')
      .select('family_id')
      .eq('id', user.id)
      .single()

    if (!profile?.family_id) return { error: new Error('No family found') }

    // Get template details
    const { data: template } = await supabase
      .from('budget_templates')
      .select('*')
      .eq('budget_id', templateId)
      .single()

    if (!template) return { error: new Error('Template not found') }

    // Check if already added
    const { data: existing } = await supabase
      .from('family_budget')
      .select('id')
      .eq('family_id', profile.family_id)
      .eq('budget_template_id', templateId)
      .single()

    if (existing) return { error: new Error('Item already in your budget') }

    const { error } = await supabase
      .from('family_budget')
      .insert({
        family_id: profile.family_id,
        budget_template_id: templateId,
        item: template.item,
        category: template.category,
        estimated_price: estimatedPrice || template.price_mid,
        is_purchased: false,
        is_custom: false,
      })

    return { error: error as Error | null }
  },

  async addCustomItem(item: string, category: string, estimatedPrice: number): Promise<{ error: Error | null }> {
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
      .insert({
        family_id: profile.family_id,
        item,
        category,
        estimated_price: estimatedPrice,
        is_purchased: false,
        is_custom: true,
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
    if (updates.is_purchased) {
      updateData.purchased_at = new Date().toISOString()
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

    const { error } = await supabase
      .from('family_budget')
      .delete()
      .eq('id', itemId)

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

  formatPriceRange(low: number, high: number): string {
    if (low === high || high === 0) return this.formatPrice(low)
    return `${this.formatPrice(low)} - ${this.formatPrice(high)}`
  },
}
