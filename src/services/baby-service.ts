import { createClient } from '@/lib/supabase/client'
import { Baby, FamilyStage } from '@/types'

const supabase = createClient()

export interface ServiceContext {
  userId: string
  familyId: string
}

async function resolveContext(ctx?: Partial<ServiceContext>): Promise<ServiceContext | null> {
  if (ctx?.userId && ctx?.familyId) {
    return ctx as ServiceContext
  }
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data: profile } = await supabase
    .from('profiles')
    .select('family_id')
    .eq('id', user.id)
    .single()
  if (!profile?.family_id) return null
  return { userId: user.id, familyId: profile.family_id }
}

export const babyService = {
  async getBabies(ctx?: Partial<ServiceContext>): Promise<Baby[]> {
    const resolved = await resolveContext(ctx)
    if (!resolved) return []

    const { data, error } = await supabase
      .from('babies')
      .select('*')
      .eq('family_id', resolved.familyId)
      .eq('is_active', true)
      .order('sort_order', { ascending: true })

    if (error) throw error
    return (data || []) as Baby[]
  },

  async getBaby(babyId: string): Promise<Baby | null> {
    const { data, error } = await supabase
      .from('babies')
      .select('*')
      .eq('id', babyId)
      .single()

    if (error && error.code !== 'PGRST116') throw error
    return data as Baby | null
  },

  async addBaby(baby: {
    baby_name?: string
    due_date?: string
    birth_date?: string
    stage?: string
  }, ctx?: Partial<ServiceContext>): Promise<{ baby: Baby | null; error: Error | null }> {
    const resolved = await resolveContext(ctx)
    if (!resolved) return { baby: null, error: new Error('Not authenticated') }

    const { data: existing } = await supabase
      .from('babies')
      .select('sort_order')
      .eq('family_id', resolved.familyId)
      .order('sort_order', { ascending: false })
      .limit(1)

    const nextOrder = (existing?.[0]?.sort_order ?? -1) + 1

    const { data, error } = await supabase
      .from('babies')
      .insert({
        family_id: resolved.familyId,
        baby_name: baby.baby_name,
        due_date: baby.due_date,
        birth_date: baby.birth_date,
        stage: (baby.birth_date ? 'post-birth' : (baby.stage || 'pregnancy')) as FamilyStage,
        sort_order: nextOrder,
        is_active: true,
      })
      .select()
      .single()

    if (error) return { baby: null, error: error as Error }

    const newBaby = data as Baby

    // Initialize tasks for the new baby with catch-up handling
    if (newBaby.due_date) {
      const currentWeek = newBaby.current_week || 1
      await supabase.rpc('initialize_baby_tasks_with_catchup', {
        p_baby_id: newBaby.id,
        p_signup_week: currentWeek,
      })
    }

    return { baby: newBaby, error: null }
  },

  async updateBaby(babyId: string, updates: Partial<Pick<Baby, 'baby_name' | 'due_date' | 'birth_date'>>): Promise<{ error: Error | null }> {
    const safeUpdates: Record<string, unknown> = {}
    if (updates.baby_name !== undefined) safeUpdates.baby_name = updates.baby_name
    if (updates.due_date !== undefined) safeUpdates.due_date = updates.due_date
    if (updates.birth_date !== undefined) safeUpdates.birth_date = updates.birth_date

    const { error } = await supabase
      .from('babies')
      .update(safeUpdates)
      .eq('id', babyId)

    return { error: error as Error | null }
  },

  async setActiveBaby(babyId: string, ctx?: Partial<ServiceContext>): Promise<{ error: Error | null }> {
    const resolved = await resolveContext(ctx)
    if (!resolved) return { error: new Error('Not authenticated') }

    // Verify baby belongs to user's family
    const { data: baby, error: verifyError } = await supabase
      .from('babies')
      .select('id')
      .eq('id', babyId)
      .eq('family_id', resolved.familyId)
      .single()

    if (verifyError || !baby) {
      return { error: new Error('Baby not found in your family') }
    }

    const { error } = await supabase
      .from('profiles')
      .update({ active_baby_id: babyId })
      .eq('id', resolved.userId)

    return { error: error as Error | null }
  },

  async archiveBaby(babyId: string, ctx?: Partial<ServiceContext>): Promise<{ error: Error | null }> {
    const resolved = await resolveContext(ctx)

    const { error } = await supabase
      .from('babies')
      .update({ is_active: false })
      .eq('id', babyId)

    if (!error && resolved) {
      // If archived baby was active, switch to first remaining active baby
      const { data: profile } = await supabase
        .from('profiles')
        .select('active_baby_id')
        .eq('id', resolved.userId)
        .single()

      if (profile?.active_baby_id === babyId) {
        const { data: remaining } = await supabase
          .from('babies')
          .select('id')
          .eq('family_id', resolved.familyId)
          .eq('is_active', true)
          .order('sort_order')
          .limit(1)

        await supabase
          .from('profiles')
          .update({ active_baby_id: remaining?.[0]?.id ?? null })
          .eq('id', resolved.userId)
      }
    }

    return { error: error as Error | null }
  },
}
