'use client'

import { createChecklistHooks } from '@tdc/shared/hooks'
import { checklistService } from '@/lib/services'
import { useServiceContext } from './use-service-context'

const {
  useChecklists,
  useChecklist,
  useToggleChecklistItem,
  useResetChecklist,
} = createChecklistHooks({
  useServiceContext,
  checklistService,
})

export {
  useChecklists,
  useChecklist,
  useToggleChecklistItem,
  useResetChecklist,
}
