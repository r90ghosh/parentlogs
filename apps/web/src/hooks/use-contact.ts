'use client'

import { useMutation } from '@tanstack/react-query'
import { contactService, SubmitContactMessagePayload } from '@/services/contact-service'

export function useSubmitContactMessage() {
  return useMutation({
    mutationFn: (payload: SubmitContactMessagePayload) =>
      contactService.submitMessage(payload),
  })
}
