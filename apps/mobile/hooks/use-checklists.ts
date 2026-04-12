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

// Mobile previously named this useChecklistById — keep the alias for compatibility
const useChecklistById = useChecklist

export {
  useChecklists,
  useChecklist,
  useChecklistById,
  useToggleChecklistItem,
  useResetChecklist,
}
