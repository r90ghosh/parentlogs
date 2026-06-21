'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { useBudgetSummary, useRemoveBudgetItem, useMarkAsPurchased } from '@/hooks/use-budget'
import { budgetService } from '@/lib/services'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Panel, Badge } from '@/components/digest'
import { usePageHeader } from '@/components/layouts/topbar-context'
import {
  DollarSign,
  Check,
  Trash2,
  AlertCircle,
  Download,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import type { FamilyBudgetItem } from '@tdc/shared/types'
import type { BudgetSummary } from '@tdc/services'

export default function MyBudgetClient() {
  const { data: summary, isLoading } = useBudgetSummary() as { data: BudgetSummary | null | undefined, isLoading: boolean }
  const removeBudgetItem = useRemoveBudgetItem()
  const markAsPurchased = useMarkAsPurchased()

  const [purchaseDialogItem, setPurchaseDialogItem] = useState<FamilyBudgetItem | null>(null)
  const [actualPrice, setActualPrice] = useState('')

  const pendingItems = useMemo(
    () => summary?.familyItems.filter(i => !i.is_purchased) || [],
    [summary],
  )
  const purchasedItems = useMemo(
    () => summary?.familyItems.filter(i => i.is_purchased) || [],
    [summary],
  )

  // Group items by category
  const pendingByCategory = useMemo(() => {
    const map = new Map<string, FamilyBudgetItem[]>()
    pendingItems.forEach(item => {
      const existing = map.get(item.category) || []
      existing.push(item)
      map.set(item.category, existing)
    })
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b))
  }, [pendingItems])

  const purchasedByCategory = useMemo(() => {
    const map = new Map<string, FamilyBudgetItem[]>()
    purchasedItems.forEach(item => {
      const existing = map.get(item.category) || []
      existing.push(item)
      map.set(item.category, existing)
    })
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b))
  }, [purchasedItems])

  const handleMarkPurchased = async () => {
    if (!purchaseDialogItem) return

    const priceInCents = actualPrice ? Math.round(parseFloat(actualPrice) * 100) : undefined
    const result = await markAsPurchased.mutateAsync({
      itemId: purchaseDialogItem.id,
      actualPrice: priceInCents,
    })

    if (result.error) {
      toast.error(result.error.message)
    } else {
      toast.success('Marked as purchased!')
    }
    setPurchaseDialogItem(null)
    setActualPrice('')
  }

  const handleRemoveItem = async (itemId: string) => {
    const result = await removeBudgetItem.mutateAsync(itemId)
    if (result.error) {
      toast.error(result.error.message)
    } else {
      toast.success('Item removed from budget')
    }
  }

  const handleExportCSV = () => {
    if (!summary?.familyItems.length) return
    const headers = ['Item', 'Category', 'Estimated Price', 'Actual Price', 'Status', 'Recurring']
    const rows = summary.familyItems.map(item => [
      `"${item.item.replace(/"/g, '""')}"`,
      `"${item.category}"`,
      (item.estimated_price / 100).toFixed(2),
      item.actual_price ? (item.actual_price / 100).toFixed(2) : '',
      item.is_purchased ? 'Purchased' : 'To Buy',
      item.is_recurring ? 'Yes' : 'No',
    ])
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `my-budget-${new Date().toISOString().slice(0, 10)}.csv`
    link.click()
    URL.revokeObjectURL(url)
    toast.success('Budget exported to CSV')
  }

  const totalItems = summary?.familyItems.length ?? 0

  usePageHeader(
    {
      title: 'Budget',
      subtitle: `${totalItems} ${totalItems === 1 ? 'item' : 'items'} tracked`,
      actions: totalItems > 0 ? (
        <button
          onClick={handleExportCSV}
          className="inline-flex items-center gap-2 rounded-xl border border-line bg-card px-4 py-2.5 text-[14px] font-bold text-ink2 transition-colors hover:bg-card-hover"
        >
          <Download className="h-4 w-4" /> Export CSV
        </button>
      ) : undefined,
    },
    [totalItems]
  )

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl" role="status" aria-busy="true">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-[18px] bg-card2" />
          ))}
        </div>
        <div className="mt-4 h-16 animate-pulse rounded-[18px] bg-card2" />
        <div className="mt-4 space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-[18px] bg-card2" />
          ))}
        </div>
      </div>
    )
  }

  const estimatedTotal = pendingItems.reduce((sum, i) => sum + (i.estimated_price || 0), 0)
  const purchasedTotal = purchasedItems.reduce((sum, i) => sum + (i.actual_price || i.estimated_price || 0), 0)
  const remainingTotal = estimatedTotal

  return (
    <div className="mx-auto max-w-3xl">
      {/* Empty State */}
      {totalItems === 0 ? (
        <Panel className="p-12 text-center">
          <DollarSign className="mx-auto mb-4 h-10 w-10 text-faint" />
          <p className="text-[15px] font-semibold text-ink">No items yet</p>
          <p className="mx-auto mt-1 max-w-sm text-[13px] text-mute">
            Browse our curated list of baby essentials and add items to start tracking your budget.
          </p>
          <Link
            href="/budget"
            className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-clay px-4 py-2.5 text-[14px] font-bold text-white hover:opacity-90"
          >
            Browse Budget Items
          </Link>
        </Panel>
      ) : (
        <>
          {/* Summary */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Panel className="p-[18px]">
              <p className="text-[11px] font-bold uppercase tracking-[1.2px] text-faint">Estimated Total</p>
              <p className="mt-1.5 text-[20px] font-extrabold tabular-nums text-ink">
                {budgetService.formatPrice(estimatedTotal + purchasedTotal)}
              </p>
            </Panel>
            <Panel className="p-[18px]">
              <p className="text-[11px] font-bold uppercase tracking-[1.2px] text-faint">Purchased</p>
              <p className="mt-1.5 text-[20px] font-extrabold tabular-nums text-ink">
                {budgetService.formatPrice(purchasedTotal)}
              </p>
            </Panel>
            <Panel className="p-[18px]">
              <p className="text-[11px] font-bold uppercase tracking-[1.2px] text-faint">Remaining</p>
              <p className="mt-1.5 text-[20px] font-extrabold tabular-nums text-clay-ink">
                {budgetService.formatPrice(remainingTotal)}
              </p>
            </Panel>
          </div>

          {/* Progress */}
          <Panel className="mt-4 p-[18px]">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[13.5px] font-semibold text-ink">Shopping Progress</span>
              <span className="text-[13.5px] font-extrabold tabular-nums text-ink">
                {purchasedItems.length} of {totalItems} items
              </span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-md bg-line">
              <div
                className="h-full rounded-md bg-clay"
                style={{ width: `${totalItems > 0 ? (purchasedItems.length / totalItems) * 100 : 0}%` }}
              />
            </div>
          </Panel>

          {/* Pending Items by Category */}
          {pendingByCategory.length > 0 && (
            <>
              <div className="mb-3 mt-7 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[1.5px] text-faint">
                <AlertCircle className="h-3.5 w-3.5" />
                To Buy ({pendingItems.length})
              </div>
              {pendingByCategory.map(([category, items]) => (
                <div key={category} className="mb-5">
                  <div className="mb-3 flex items-center gap-2">
                    <span className="text-[12.5px] font-bold uppercase tracking-[0.8px] text-mute">{category}</span>
                    <Badge tone="neutral">{items.length}</Badge>
                  </div>
                  <Panel>
                    {items.map(item => (
                      <BudgetItemRow
                        key={item.id}
                        item={item}
                        onMarkPurchased={() => setPurchaseDialogItem(item)}
                        onRemove={() => handleRemoveItem(item.id)}
                      />
                    ))}
                  </Panel>
                </div>
              ))}
            </>
          )}

          {/* Purchased Items by Category */}
          {purchasedByCategory.length > 0 && (
            <>
              <div className="mb-3 mt-7 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[1.5px] text-faint">
                <Check className="h-3.5 w-3.5" />
                Purchased ({purchasedItems.length})
              </div>
              {purchasedByCategory.map(([category, items]) => (
                <div key={category} className="mb-5">
                  <div className="mb-3 flex items-center gap-2">
                    <span className="text-[12.5px] font-bold uppercase tracking-[0.8px] text-mute">{category}</span>
                    <Badge tone="neutral">{items.length}</Badge>
                  </div>
                  <Panel>
                    {items.map(item => (
                      <BudgetItemRow
                        key={item.id}
                        item={item}
                        isPurchased
                        onRemove={() => handleRemoveItem(item.id)}
                      />
                    ))}
                  </Panel>
                </div>
              ))}
            </>
          )}
        </>
      )}

      {/* Mark as Purchased Dialog */}
      <Dialog open={!!purchaseDialogItem} onOpenChange={() => setPurchaseDialogItem(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mark as Purchased</DialogTitle>
            <DialogDescription>
              Enter the actual price you paid (optional)
            </DialogDescription>
          </DialogHeader>
          {purchaseDialogItem && (
            <div className="space-y-4">
              <div className="rounded-xl bg-card2 p-4">
                <h4 className="text-[15px] font-semibold text-ink">{purchaseDialogItem.item}</h4>
                <p className="text-[13px] text-mute">
                  Estimated: {budgetService.formatPrice(purchaseDialogItem.estimated_price)}
                </p>
              </div>
              <div>
                <label className="mb-2 block text-[13px] font-semibold text-ink">
                  Actual Price (optional)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-faint" />
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={actualPrice}
                    onChange={(e) => setActualPrice(e.target.value)}
                    className="w-full rounded-xl border border-line bg-card py-2.5 pl-9 pr-3.5 text-[15px] text-ink outline-none focus:border-clay"
                  />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <button
              onClick={() => setPurchaseDialogItem(null)}
              className="rounded-xl border border-line bg-card px-4 py-2.5 text-[14px] font-bold text-ink2 hover:bg-card-hover"
            >
              Cancel
            </button>
            <button
              onClick={handleMarkPurchased}
              disabled={markAsPurchased.isPending}
              className="inline-flex items-center gap-1.5 rounded-xl bg-clay px-4 py-2.5 text-[14px] font-bold text-white hover:opacity-90 disabled:opacity-50"
            >
              <Check className="h-4 w-4" />
              Mark Purchased
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function BudgetItemRow({
  item,
  isPurchased = false,
  onMarkPurchased,
  onRemove,
}: {
  item: FamilyBudgetItem
  isPurchased?: boolean
  onMarkPurchased?: () => void
  onRemove: () => void
}) {
  return (
    <div className="flex items-center gap-3.5 border-b border-line2 px-[18px] py-[15px] last:border-b-0">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className={cn(
            'text-[15.5px] font-semibold',
            isPurchased ? 'text-mute line-through decoration-faint' : 'text-ink',
          )}>
            {item.item}
          </span>
          {item.is_custom && <Badge tone="neutral">Custom</Badge>}
          {item.is_recurring && <Badge tone="sage">Recurring</Badge>}
        </div>
        <div className="mt-[5px] text-[12.5px] font-medium tabular-nums text-mute">
          {isPurchased && item.actual_price
            ? `Paid: ${budgetService.formatPrice(item.actual_price)}`
            : `Est: ${budgetService.formatPrice(item.estimated_price)}`}
        </div>
      </div>
      <div className="flex flex-none items-center gap-1">
        {!isPurchased && onMarkPurchased && (
          <button
            type="button"
            onClick={onMarkPurchased}
            aria-label="Mark purchased"
            className="grid h-8 w-8 place-items-center rounded-full text-[--sage] transition-colors hover:bg-card-hover"
          >
            <Check className="h-4 w-4" />
          </button>
        )}
        <button
          type="button"
          onClick={onRemove}
          aria-label="Remove"
          className="grid h-8 w-8 place-items-center rounded-full text-faint transition-colors hover:bg-card-hover hover:text-danger"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
