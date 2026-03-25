import { Platform } from 'react-native'
import { useMutation } from '@tanstack/react-query'
import { useAuth } from '@/components/providers/AuthProvider'
import { feedbackService } from '@/lib/services'

export function useSubmitFeedback() {
  const { user, profile, family } = useAuth()

  return useMutation({
    mutationFn: (payload: { type: 'bug' | 'feature' | 'question' | 'other'; message: string }) =>
      feedbackService.submit({
        ...payload,
        user_id: user?.id ?? null,
        user_role: (profile?.role as 'mom' | 'dad' | 'other') ?? null,
        family_stage: family?.stage ?? null,
        user_agent: `mobile/${Platform.OS}`,
      }),
  })
}
