'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { useBudgetSummary, useRemoveBudgetItem, useMarkAsPurchased } from '@/hooks/use-budget'
import { budgetService } from '@/lib/services'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Progress } from '@/components/ui/progress'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DollarSign,
  Check,
  Trash2,
  ShoppingCart,
  TrendingUp,
  Wallet,
  AlertCircle,
  RefreshCw,
  Download,
  ArrowLeft,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import type { FamilyBudgetItem } from '@tdc/shared/types'
import type { BudgetSummary } from '@tdc/services'
import { Reveal } from '@/components/ui/animations/Reveal'
import { Card3DTilt } from '@/components/ui/animations/Card3DTilt'
import { getCategoryStyle } from '@/lib/budget-constants'

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

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-6 space-y-6" role="status" aria-busy="true">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="bg-[--surface] border-[--border]">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-11 w-11 rounded-lg" />
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-6 w-32" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="bg-[--surface] border-[--border]">
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-5 w-5 rounded" />
                    <Skeleton className="h-5 w-36" />
                  </div>
                  <Skeleton className="h-5 w-20" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  const totalItems = summary?.familyItems.length ?? 0
  const estimatedTotal = pendingItems.reduce((sum, i) => sum + (i.estimated_price || 0), 0)
  const purchasedTotal = purchasedItems.reduce((sum, i) => sum + (i.actual_price || i.estimated_price || 0), 0)
  const remainingTotal = estimatedTotal

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/budget">
              <ArrowLeft className="h-5 w-5 text-[--cream]" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-display font-bold text-[--cream]">My Budget</h1>
            <p className="text-[--muted] mt-0.5 font-body">
              {totalItems} {totalItems === 1 ? 'item' : 'items'} tracked
            </p>
          </div>
        </div>
        {totalItems > 0 && (
          <Button variant="outline" size="sm" className="font-ui" onClick={handleExportCSV}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        )}
      </div>

      {/* Empty State */}
      {totalItems === 0 ? (
        <Reveal variant="card" delay={0}>
          <Card className="bg-[--surface] border-[--border]">
            <CardContent className="py-16 text-center">
              <DollarSign className="h-12 w-12 text-[--dim] mx-auto mb-4" />
              <h3 className="text-lg font-medium text-[--cream] mb-2 font-display">No items yet</h3>
              <p className="text-[--muted] mb-6 font-body max-w-sm mx-auto">
                Browse our curated list of baby essentials and add items to start tracking your budget.
              </p>
              <Button asChild className="font-ui">
                <Link href="/budget">Browse Budget Items</Link>
              </Button>
            </CardContent>
          </Card>
        </Reveal>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Reveal variant="card" delay={0}>
              <Card3DTilt maxTilt={3} gloss>
                <Card className="bg-[--surface] border-[--border] card-gold-top">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-lg bg-sky/20">
                        <TrendingUp className="h-5 w-5 text-sky" />
                      </div>
                      <div>
                        <p className="text-xs text-[--muted] font-ui">Estimated Total</p>
                        <p className="text-xl font-bold text-[--cream] tabular-nums">
                          {budgetService.formatPrice(estimatedTotal + purchasedTotal)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Card3DTilt>
            </Reveal>

            <Reveal variant="card" delay={120}>
              <Card3DTilt maxTilt={3} gloss>
                <Card className="bg-[--surface] border-[--border] card-gold-top">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-lg bg-sage/20">
                        <ShoppingCart className="h-5 w-5 text-sage" />
                      </div>
                      <div>
                        <p className="text-xs text-[--muted] font-ui">Purchased</p>
                        <p className="text-xl font-bold text-[--cream] tabular-nums">
                          {budgetService.formatPrice(purchasedTotal)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Card3DTilt>
            </Reveal>

            <Reveal variant="card" delay={240}>
              <Card3DTilt maxTilt={3} gloss>
                <Card className="bg-[--surface] border-[--border] card-gold-top">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-lg bg-gold/20">
                        <Wallet className="h-5 w-5 text-gold" />
                      </div>
                      <div>
                        <p className="text-xs text-[--muted] font-ui">Remaining</p>
                        <p className="text-xl font-bold text-[--cream] tabular-nums">
                          {budgetService.formatPrice(remainingTotal)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Card3DTilt>
            </Reveal>
          </div>

          {/* Progress */}
          <Reveal variant="card" delay={360}>
            <Card className="bg-[--surface] border-[--border]">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-[--muted] font-body">Shopping Progress</span>
                  <span className="text-sm font-medium text-[--cream] tabular-nums font-ui">
                    {purchasedItems.length} of {totalItems} items
                  </span>
                </div>
                <Progress
                  value={(purchasedItems.length / totalItems) * 100}
                  className="h-2 bg-[--dim]"
                />
              </CardContent>
            </Card>
          </Reveal>

          {/* Pending Items by Category */}
          {pendingByCategory.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-sm font-medium text-[--muted] font-ui flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                To Buy ({pendingItems.length})
              </h2>
              {pendingByCategory.map(([category, items], catIdx) => {
                const { Icon, colors } = getCategoryStyle(category)
                return (
                  <Reveal variant="card" key={category} delay={480 + catIdx * 80}>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 px-1">
                        <div className={cn('p-1.5 rounded-md', colors.bg)}>
                          <Icon className={cn('h-4 w-4', colors.text)} />
                        </div>
                        <span className="text-sm font-medium text-[--cream] font-body">{category}</span>
                        <Badge variant="outline" className="text-xs font-ui">{items.length}</Badge>
                      </div>
                      {items.map(item => (
                        <BudgetItemRow
                          key={item.id}
                          item={item}
                          onMarkPurchased={() => setPurchaseDialogItem(item)}
                          onRemove={() => handleRemoveItem(item.id)}
                        />
                      ))}
                    </div>
                  </Reveal>
                )
              })}
            </div>
          )}

          {/* Purchased Items by Category */}
          {purchasedByCategory.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-sm font-medium text-[--muted] font-ui flex items-center gap-2">
                <Check className="h-4 w-4" />
                Purchased ({purchasedItems.length})
              </h2>
              {purchasedByCategory.map(([category, items], catIdx) => {
                const { Icon, colors } = getCategoryStyle(category)
                return (
                  <Reveal variant="card" key={category} delay={catIdx * 80}>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 px-1">
                        <div className={cn('p-1.5 rounded-md', colors.bg)}>
                          <Icon className={cn('h-4 w-4', colors.text)} />
                        </div>
                        <span className="text-sm font-medium text-[--cream]/70 font-body">{category}</span>
                        <Badge variant="outline" className="text-xs font-ui">{items.length}</Badge>
                      </div>
                      {items.map(item => (
                        <BudgetItemRow
                          key={item.id}
                          item={item}
                          isPurchased
                          onRemove={() => handleRemoveItem(item.id)}
                        />
                      ))}
                    </div>
                  </Reveal>
                )
              })}
            </div>
          )}
        </>
      )}

      {/* Mark as Purchased Dialog */}
      <Dialog open={!!purchaseDialogItem} onOpenChange={() => setPurchaseDialogItem(null)}>
        <DialogContent className="bg-[--surface] border-[--border]">
          <DialogHeader>
            <DialogTitle className="font-display text-[--cream]">Mark as Purchased</DialogTitle>
            <DialogDescription className="font-body text-[--muted]">
              Enter the actual price you paid (optional)
            </DialogDescription>
          </DialogHeader>
          {purchaseDialogItem && (
            <div className="space-y-4">
              <div className="p-4 bg-[--card] rounded-lg">
                <h4 className="font-medium text-[--cream] font-body">{purchaseDialogItem.item}</h4>
                <p className="text-sm text-[--muted] font-body">
                  Estimated: {budgetService.formatPrice(purchaseDialogItem.estimated_price)}
                </p>
              </div>
              <div>
                <label className="text-sm text-[--muted] mb-2 block font-ui">
                  Actual Price (optional)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[--dim]" />
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={actualPrice}
                    onChange={(e) => setActualPrice(e.target.value)}
                    className="pl-9 bg-[--card] border-[--border-hover]"
                  />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" className="font-ui" onClick={() => setPurchaseDialogItem(null)}>
              Cancel
            </Button>
            <Button className="font-ui" onClick={handleMarkPurchased} disabled={markAsPurchased.isPending}>
              <Check className="h-4 w-4 mr-2" />
              Mark Purchased
            </Button>
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
    <Card className={cn(
      'bg-[--surface] border-[--border]',
      isPurchased && 'opacity-70',
    )}>
      <CardContent className="py-3 px-4">
        <div className="flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className={cn(
                'font-medium text-sm font-body',
                isPurchased ? 'text-[--muted] line-through' : 'text-[--cream]',
              )}>
                {item.item}
              </span>
              {item.is_custom && (
                <Badge variant="outline" className="text-xs font-ui">Custom</Badge>
              )}
              {item.is_recurring && (
                <Badge variant="outline" className="text-xs border-sky/50 text-sky font-ui flex items-center gap-1">
                  <RefreshCw className="h-3 w-3" /> Recurring
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-[--muted] font-ui mt-0.5">
              <span className="tabular-nums">
                {isPurchased && item.actual_price
                  ? `Paid: ${budgetService.formatPrice(item.actual_price)}`
                  : `Est: ${budgetService.formatPrice(item.estimated_price)}`}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            {!isPurchased && onMarkPurchased && (
              <Button size="icon" variant="ghost" onClick={onMarkPurchased}>
                <Check className="h-4 w-4 text-sage" />
              </Button>
            )}
            <Button size="icon" variant="ghost" onClick={onRemove}>
              <Trash2 className="h-4 w-4 text-coral" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
