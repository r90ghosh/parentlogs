import { createClient } from '@/lib/supabase/client'
import { Family, FamilyMember } from '@/types'

const supabase = createClient()

export interface ServiceContext {
  userId: string
  familyId: string
  subscriptionTier?: string
}

async function resolveUserId(ctx?: Partial<ServiceContext>): Promise<string | null> {
  if (ctx?.userId) return ctx.userId
  const { data: { user } } = await supabase.auth.getUser()
  return user?.id ?? null
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

export const familyService = {
  async createFamily(data: {
    due_date?: string
    birth_date?: string
    baby_name?: string
  }, ctx?: Partial<ServiceContext>): Promise<{ family: Family | null; error: Error | null }> {
    const userId = await resolveUserId(ctx)
    if (!userId) return { family: null, error: new Error('Not authenticated') }

    // Create family
    const { data: family, error: familyError } = await supabase
      .from('families')
      .insert({
        due_date: data.due_date,
        birth_date: data.birth_date,
        baby_name: data.baby_name,
        stage: data.birth_date ? 'post-birth' : 'pregnancy',
        owner_id: userId,
      })
      .select()
      .single()

    if (familyError) return { family: null, error: familyError as Error }

    // Update user's family_id
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ family_id: family.id })
      .eq('id', userId)

    if (profileError) return { family: null, error: profileError as Error }

    // Generate tasks with proper week_due and catch-up handling
    const referenceDate = data.due_date || data.birth_date
    if (referenceDate) {
      const currentWeek = family.current_week || 1
      await supabase.rpc('initialize_family_tasks_with_catchup', {
        p_family_id: family.id,
        p_due_date: referenceDate,
        p_signup_week: currentWeek,
      })
    }

    return { family: family as Family, error: null }
  },

  async joinFamily(inviteCode: string, ctx?: Partial<ServiceContext>): Promise<{ family: Family | null; error: Error | null }> {
    const userId = await resolveUserId(ctx)
    if (!userId) return { family: null, error: new Error('Not authenticated') }

    // Find family by invite code
    const { data: family, error: findError } = await supabase
      .from('families')
      .select('*')
      .eq('invite_code', inviteCode.toUpperCase())
      .single()

    if (findError || !family) {
      return { family: null, error: new Error('Invalid invite code') }
    }

    // Update user's family_id
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ family_id: family.id })
      .eq('id', userId)

    if (updateError) return { family: null, error: updateError as Error }

    return { family: family as Family, error: null }
  },

  async getFamily(ctx?: Partial<ServiceContext>): Promise<Family | null> {
    const resolved = await resolveContext(ctx)
    if (!resolved) return null

    const { data: family } = await supabase
      .from('families')
      .select('*')
      .eq('id', resolved.familyId)
      .single()

    return family as Family | null
  },

  async getFamilyMembers(ctx?: Partial<ServiceContext>): Promise<FamilyMember[]> {
    const resolved = await resolveContext(ctx)
    if (!resolved) return []

    const { data: members } = await supabase
      .from('profiles')
      .select('*')
      .eq('family_id', resolved.familyId)

    return (members || []) as FamilyMember[]
  },

  async updateFamily(updates: Partial<Pick<Family, 'due_date' | 'birth_date' | 'baby_name' | 'stage'>>, ctx?: Partial<ServiceContext>): Promise<{ error: Error | null }> {
    const family = await this.getFamily(ctx)
    if (!family) return { error: new Error('No family found') }

    // Only allow safe fields
    const safeUpdates: Record<string, unknown> = {}
    if (updates.due_date !== undefined) safeUpdates.due_date = updates.due_date
    if (updates.birth_date !== undefined) safeUpdates.birth_date = updates.birth_date
    if (updates.baby_name !== undefined) safeUpdates.baby_name = updates.baby_name
    if (updates.stage !== undefined) safeUpdates.stage = updates.stage

    const { error } = await supabase
      .from('families')
      .update(safeUpdates)
      .eq('id', family.id)

    return { error: error as Error | null }
  },

  async regenerateInviteCode(ctx?: Partial<ServiceContext>): Promise<string | null> {
    const family = await this.getFamily(ctx)
    if (!family) return null

    const { data } = await supabase.rpc('regenerate_invite_code', {
      p_family_id: family.id,
    })

    return data
  },

  async leaveFamily(ctx?: Partial<ServiceContext>): Promise<{ error: Error | null }> {
    const userId = await resolveUserId(ctx)
    if (!userId) return { error: new Error('Not authenticated') }

    const { error } = await supabase
      .from('profiles')
      .update({ family_id: null })
      .eq('id', userId)

    return { error: error as Error | null }
  },
}
