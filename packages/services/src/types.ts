import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@tdc/shared/types/database'

export type AppSupabaseClient = SupabaseClient<Database>

export interface ServiceContext {
  userId: string
  familyId: string
  babyId?: string
  subscriptionTier?: string
}
