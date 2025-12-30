import { createClient } from '@/lib/supabase/client'
import { Family, FamilyMember } from '@/types'

const supabase = createClient()

export const familyService = {
  async createFamily(data: {
    due_date?: string
    birth_date?: string
    baby_name?: string
  }): Promise<{ family: Family | null; error: Error | null }> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { family: null, error: new Error('Not authenticated') }

    // Create family
    const { data: family, error: familyError } = await supabase
      .from('families')
      .insert({
        due_date: data.due_date,
        birth_date: data.birth_date,
        baby_name: data.baby_name,
        stage: data.birth_date ? 'post-birth' : 'pregnancy',
        owner_id: user.id,
      })
      .select()
      .single()

    if (familyError) return { family: null, error: familyError as Error }

    // Update user's family_id
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ family_id: family.id })
      .eq('id', user.id)

    if (profileError) return { family: null, error: profileError as Error }

    // Generate tasks
    await supabase.rpc('generate_family_tasks', {
      p_family_id: family.id,
      p_due_date: data.due_date,
      p_birth_date: data.birth_date,
    })

    return { family: family as Family, error: null }
  },

  async joinFamily(inviteCode: string): Promise<{ family: Family | null; error: Error | null }> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { family: null, error: new Error('Not authenticated') }

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
      .eq('id', user.id)

    if (updateError) return { family: null, error: updateError as Error }

    return { family: family as Family, error: null }
  },

  async getFamily(): Promise<Family | null> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data: profile } = await supabase
      .from('profiles')
      .select('family_id')
      .eq('id', user.id)
      .single()

    if (!profile?.family_id) return null

    const { data: family } = await supabase
      .from('families')
      .select('*')
      .eq('id', profile.family_id)
      .single()

    return family as Family | null
  },

  async getFamilyMembers(): Promise<FamilyMember[]> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []

    const { data: profile } = await supabase
      .from('profiles')
      .select('family_id')
      .eq('id', user.id)
      .single()

    if (!profile?.family_id) return []

    const { data: members } = await supabase
      .from('profiles')
      .select('*')
      .eq('family_id', profile.family_id)

    return (members || []) as FamilyMember[]
  },

  async updateFamily(updates: Partial<Family>): Promise<{ error: Error | null }> {
    const family = await this.getFamily()
    if (!family) return { error: new Error('No family found') }

    const { error } = await supabase
      .from('families')
      .update(updates)
      .eq('id', family.id)

    return { error: error as Error | null }
  },

  async regenerateInviteCode(): Promise<string | null> {
    const family = await this.getFamily()
    if (!family) return null

    const { data } = await supabase.rpc('regenerate_invite_code', {
      p_family_id: family.id,
    })

    return data
  },

  async leaveFamily(): Promise<{ error: Error | null }> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: new Error('Not authenticated') }

    const { error } = await supabase
      .from('profiles')
      .update({ family_id: null })
      .eq('id', user.id)

    return { error: error as Error | null }
  },
}
