import type { AppSupabaseClient } from './types'

export interface FeedbackPayload {
  user_id?: string | null
  type: 'bug' | 'feature' | 'question' | 'other'
  message: string
  page_url?: string | null
  user_agent?: string | null
  user_role?: 'mom' | 'dad' | 'other' | null
  family_stage?: string | null
}

export function createFeedbackService(supabase: AppSupabaseClient) {
  return {
    async submit(payload: FeedbackPayload): Promise<void> {
      const trimmed = payload.message.trim()
      if (trimmed.length < 10 || trimmed.length > 2000) {
        throw new Error('Message must be between 10 and 2000 characters')
      }

      const { error } = await supabase
        .from('feedback')
        .insert({ ...payload, message: trimmed })
      if (error) throw error
    },
  }
}

export type FeedbackService = ReturnType<typeof createFeedbackService>
