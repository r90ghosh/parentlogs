import { createBudgetHooks } from '@tdc/shared/hooks'
import { budgetService } from '@/lib/services'
import { useServiceContext } from './use-service-context'

const {
  useBudgetTemplates,
  useBudgetSummary,
  useBudgetItems,
  useAddToBudget,
  useAddCustomBudgetItem,
  useUpdateBudgetItem,
  useRemoveBudgetItem,
  useMarkAsPurchased,
  useTogglePurchased,
} = createBudgetHooks({
  useServiceContext,
  budgetService,
})

export {
  useBudgetTemplates,
  useBudgetSummary,
  useBudgetItems,
  useAddToBudget,
  useAddCustomBudgetItem,
  useUpdateBudgetItem,
  useRemoveBudgetItem,
  useMarkAsPurchased,
  useTogglePurchased,
}
