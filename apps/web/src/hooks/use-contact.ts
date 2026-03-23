'use client'

import { useMutation } from '@tanstack/react-query'
import { contactService } from '@/lib/services'
import type { SubmitContactMessagePayload } from '@tdc/services'

export function useSubmitContactMessage() {
  return useMutation({
    mutationFn: (payload: SubmitContactMessagePayload) =>
      contactService.submitMessage(payload),
  })
}
