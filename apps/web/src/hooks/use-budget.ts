'use client'

import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query'
import { budgetService } from '@/lib/services'
import { BudgetPeriod } from '@tdc/shared/types'
import { useUser } from '@/components/user-provider'

function useServiceContext() {
  const { user, profile } = useUser()
  if (!user || !profile?.family_id) return undefined
  return {
    userId: user.id,
    familyId: profile.family_id,
    subscriptionTier: profile.subscription_tier ?? undefined,
  }
}

export function useBudgetTemplates(period?: BudgetPeriod) {
  return useQuery({
    queryKey: ['budget-templates', period],
    queryFn: () => budgetService.getBudgetTemplates(period),
    staleTime: 1000 * 60 * 10, // 10 minutes - templates rarely change
  })
}

export function useBudgetSummary() {
  const { profile } = useUser()
  const ctx = useServiceContext()

  return useQuery({
    queryKey: ['budget-summary', profile?.family_id],
    queryFn: () => budgetService.getBudgetSummary(ctx),
    enabled: !!profile?.family_id,
    staleTime: 1000 * 60 * 10, // 10 minutes — templates are static, mutations invalidate cache
    placeholderData: keepPreviousData, // show cached data while refetching
  })
}

export function useAddToBudget() {
  const queryClient = useQueryClient()
  const ctx = useServiceContext()

  return useMutation({
    mutationFn: ({ templateId, estimatedPrice }: { templateId: string; estimatedPrice?: number }) =>
      budgetService.addToFamilyBudget(templateId, estimatedPrice, ctx),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budget-summary'] })
    },
  })
}

export function useAddCustomBudgetItem() {
  const queryClient = useQueryClient()
  const ctx = useServiceContext()

  return useMutation({
    mutationFn: ({ item, category, estimatedPrice }: { item: string; category: string; estimatedPrice: number }) =>
      budgetService.addCustomItem(item, category, estimatedPrice, ctx),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budget-summary'] })
    },
  })
}

export function useUpdateBudgetItem() {
  const queryClient = useQueryClient()
  const ctx = useServiceContext()

  return useMutation({
    mutationFn: ({ itemId, updates }: {
      itemId: string;
      updates: { estimated_price?: number; actual_price?: number; is_purchased?: boolean; notes?: string }
    }) => budgetService.updateBudgetItem(itemId, updates, ctx),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budget-summary'] })
    },
  })
}

export function useRemoveBudgetItem() {
  const queryClient = useQueryClient()
  const ctx = useServiceContext()

  return useMutation({
    mutationFn: (itemId: string) => budgetService.removeBudgetItem(itemId, ctx),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budget-summary'] })
    },
  })
}

export function useMarkAsPurchased() {
  const queryClient = useQueryClient()
  const ctx = useServiceContext()

  return useMutation({
    mutationFn: ({ itemId, actualPrice }: { itemId: string; actualPrice?: number }) =>
      budgetService.markAsPurchased(itemId, actualPrice, ctx),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budget-summary'] })
    },
  })
}

export function useBudgetItems() {
  const { profile } = useUser()
  const ctx = useServiceContext()

  return useQuery({
    queryKey: ['budget-items', profile?.family_id],
    queryFn: async () => {
      const summary = await budgetService.getBudgetSummary(ctx)
      return summary?.familyItems || []
    },
    enabled: !!profile?.family_id,
    staleTime: 1000 * 60 * 2,
  })
}
