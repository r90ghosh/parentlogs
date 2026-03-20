import type { AppSupabaseClient } from './types'

export interface ContactMessage {
  id: string
  user_id: string | null
  name: string
  email: string
  subject: string
  message: string
  status: string
  created_at: string | null
  updated_at: string | null
}

export interface SubmitContactMessagePayload {
  user_id: string
  name: string
  email: string
  subject: string
  message: string
}

export function createContactService(supabase: AppSupabaseClient) {
  return {
    async submitMessage(payload: SubmitContactMessagePayload): Promise<ContactMessage> {
      const { data, error } = await supabase
        .from('contact_messages')
        .insert(payload)
        .select()
        .single()
      if (error) throw error
      return data
    },
  }
}

export type ContactService = ReturnType<typeof createContactService>
