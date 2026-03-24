'use client'

import { useMutation } from '@tanstack/react-query'
import { feedbackService } from '@/lib/services'
import type { FeedbackPayload } from '@tdc/services'

export function useSubmitFeedback() {
  return useMutation({
    mutationFn: (payload: FeedbackPayload) => feedbackService.submit(payload),
  })
}
