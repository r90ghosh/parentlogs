'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { budgetService } from '@/services/budget-service'
import { FamilyStage } from '@/types'

export function useBudgetTemplates(stage?: FamilyStage) {
  return useQuery({
    queryKey: ['budget-templates', stage],
    queryFn: () => budgetService.getBudgetTemplates(stage),
  })
}

export function useBudgetSummary() {
  return useQuery({
    queryKey: ['budget-summary'],
    queryFn: () => budgetService.getBudgetSummary(),
  })
}

export function useAddToBudget() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ templateId, estimatedPrice }: { templateId: string; estimatedPrice?: number }) =>
      budgetService.addToFamilyBudget(templateId, estimatedPrice),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budget-summary'] })
    },
  })
}

export function useAddCustomBudgetItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ item, category, estimatedPrice }: { item: string; category: string; estimatedPrice: number }) =>
      budgetService.addCustomItem(item, category, estimatedPrice),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budget-summary'] })
    },
  })
}

export function useUpdateBudgetItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ itemId, updates }: {
      itemId: string;
      updates: { estimated_price?: number; actual_price?: number; is_purchased?: boolean; notes?: string }
    }) => budgetService.updateBudgetItem(itemId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budget-summary'] })
    },
  })
}

export function useRemoveBudgetItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (itemId: string) => budgetService.removeBudgetItem(itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budget-summary'] })
    },
  })
}

export function useMarkAsPurchased() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ itemId, actualPrice }: { itemId: string; actualPrice?: number }) =>
      budgetService.markAsPurchased(itemId, actualPrice),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budget-summary'] })
    },
  })
}

export function useBudgetItems() {
  return useQuery({
    queryKey: ['budget-items'],
    queryFn: async () => {
      const summary = await budgetService.getBudgetSummary()
      return summary?.familyItems || []
    },
  })
}
