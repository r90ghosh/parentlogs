import { createClient } from '@/lib/supabase/client'

const supabase = createClient()

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

export const contactService = {
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
