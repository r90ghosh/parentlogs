import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/components/providers/AuthProvider'
import { budgetService } from '@/lib/services'
import type { BudgetPeriod } from '@tdc/shared/types'

export function useBudgetTemplates(period?: BudgetPeriod) {
  return useQuery({
    queryKey: ['budget-templates', period],
    queryFn: () => budgetService.getBudgetTemplates(period),
    staleTime: 1000 * 60 * 10,
  })
}

export function useBudgetSummary() {
  const { family } = useAuth()

  return useQuery({
    queryKey: ['budget-summary', family?.id],
    queryFn: () => budgetService.getBudgetSummary(),
    enabled: !!family?.id,
    staleTime: 1000 * 60 * 2,
  })
}

export function useAddToBudget() {
  const queryClient = useQueryClient()
  const { family } = useAuth()

  return useMutation({
    mutationFn: ({
      templateId,
      estimatedPrice,
    }: {
      templateId: string
      estimatedPrice?: number
    }) => budgetService.addToFamilyBudget(templateId, estimatedPrice),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budget-summary', family?.id] })
    },
  })
}

export function useTogglePurchased() {
  const queryClient = useQueryClient()
  const { family } = useAuth()

  return useMutation({
    mutationFn: ({
      itemId,
      isPurchased,
      actualPrice,
    }: {
      itemId: string
      isPurchased: boolean
      actualPrice?: number
    }) =>
      isPurchased
        ? budgetService.markAsPurchased(itemId, actualPrice)
        : budgetService.updateBudgetItem(itemId, { is_purchased: false }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budget-summary', family?.id] })
    },
  })
}
