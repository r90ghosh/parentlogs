/**
 * Factory for budget-related React Query hooks.
 *
 * Both web and mobile apps call `createBudgetHooks(deps)` with their
 * platform-specific service context hook and budget service instance,
 * then re-export the returned hooks.
 */
import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query'
import { queryKeys } from '../constants/query-keys'
import type { ServiceContext } from '../types/service-context'
import type { BudgetPeriod } from '../types'

// ---------------------------------------------------------------------------
// Dependency types
// ---------------------------------------------------------------------------

/** Minimal surface the factory needs from each platform's budget service. */
export interface BudgetServiceLike {
  getBudgetTemplates(period?: BudgetPeriod): Promise<any>
  getBudgetSummary(ctx?: Partial<ServiceContext>): Promise<any>
  addToFamilyBudget(templateId: string, estimatedPrice: number | undefined, ctx?: Partial<ServiceContext>): Promise<any>
  addCustomItem(item: string, category: string, estimatedPrice: number, ctx?: Partial<ServiceContext>): Promise<any>
  updateBudgetItem(itemId: string, updates: Record<string, any>, ctx?: Partial<ServiceContext>): Promise<any>
  removeBudgetItem(itemId: string, ctx?: Partial<ServiceContext>): Promise<any>
  markAsPurchased(itemId: string, actualPrice: number | undefined, ctx?: Partial<ServiceContext>): Promise<any>
}

export interface CreateBudgetHooksDeps {
  useServiceContext: () => Partial<ServiceContext> | undefined
  budgetService: BudgetServiceLike
}

// ---------------------------------------------------------------------------
// Factory
// ---------------------------------------------------------------------------

export function createBudgetHooks(deps: CreateBudgetHooksDeps) {
  const { useServiceContext, budgetService } = deps

  function useBudgetTemplates(period?: BudgetPeriod) {
    return useQuery({
      queryKey: queryKeys.budget.templates(period),
      queryFn: () => budgetService.getBudgetTemplates(period),
      staleTime: 1000 * 60 * 10,
    })
  }

  function useBudgetSummary() {
    const ctx = useServiceContext()
    return useQuery({
      queryKey: queryKeys.budget.summary(ctx?.familyId!),
      queryFn: () => budgetService.getBudgetSummary(ctx),
      enabled: !!ctx?.familyId,
      staleTime: 1000 * 60 * 2,
      placeholderData: keepPreviousData,
    })
  }

  function useBudgetItems() {
    const ctx = useServiceContext()
    return useQuery({
      queryKey: queryKeys.budget.items(ctx?.familyId!),
      queryFn: async () => {
        const summary = await budgetService.getBudgetSummary(ctx)
        return summary?.familyItems || []
      },
      enabled: !!ctx?.familyId,
      staleTime: 1000 * 60 * 2,
    })
  }

  function useAddToBudget() {
    const queryClient = useQueryClient()
    const ctx = useServiceContext()
    return useMutation({
      mutationFn: ({ templateId, estimatedPrice }: { templateId: string; estimatedPrice?: number }) =>
        budgetService.addToFamilyBudget(templateId, estimatedPrice, ctx),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.budget.all })
      },
    })
  }

  function useAddCustomBudgetItem() {
    const queryClient = useQueryClient()
    const ctx = useServiceContext()
    return useMutation({
      mutationFn: ({ item, category, estimatedPrice }: { item: string; category: string; estimatedPrice: number }) =>
        budgetService.addCustomItem(item, category, estimatedPrice, ctx),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.budget.all })
      },
    })
  }

  function useUpdateBudgetItem() {
    const queryClient = useQueryClient()
    const ctx = useServiceContext()
    return useMutation({
      mutationFn: ({ itemId, updates }: {
        itemId: string
        updates: { estimated_price?: number; actual_price?: number; is_purchased?: boolean; notes?: string }
      }) => budgetService.updateBudgetItem(itemId, updates, ctx),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.budget.all })
      },
    })
  }

  function useRemoveBudgetItem() {
    const queryClient = useQueryClient()
    const ctx = useServiceContext()
    return useMutation({
      mutationFn: (itemId: string) => budgetService.removeBudgetItem(itemId, ctx),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.budget.all })
      },
    })
  }

  function useMarkAsPurchased() {
    const queryClient = useQueryClient()
    const ctx = useServiceContext()
    return useMutation({
      mutationFn: ({ itemId, actualPrice }: { itemId: string; actualPrice?: number }) =>
        budgetService.markAsPurchased(itemId, actualPrice, ctx),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.budget.all })
      },
    })
  }

  function useTogglePurchased() {
    const queryClient = useQueryClient()
    const ctx = useServiceContext()
    return useMutation({
      mutationFn: ({ itemId, isPurchased, actualPrice }: {
        itemId: string
        isPurchased: boolean
        actualPrice?: number
      }) =>
        isPurchased
          ? budgetService.markAsPurchased(itemId, actualPrice, ctx)
          : budgetService.updateBudgetItem(itemId, { is_purchased: false }, ctx),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.budget.all })
      },
    })
  }

  return {
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
}
