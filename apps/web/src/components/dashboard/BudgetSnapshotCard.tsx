'use client'

import Link from 'next/link'
import { DollarSign, ArrowRight, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useBudgetSummary } from '@/hooks/use-budget'
import { Skeleton } from '@/components/ui/skeleton'

export function BudgetSnapshotCard() {
  const { data: summary, isLoading } = useBudgetSummary()

  if (isLoading) {
    return <Skeleton className="h-32 w-full rounded-[20px]" />
  }

  const purchasedTotal = summary?.purchasedTotal || 0
  const remainingTotal = summary?.remainingTotal || 0
  const monthlyRecurringMin = summary?.monthlyRecurringMin || 0
  const monthlyRecurringMax = summary?.monthlyRecurringMax || 0

  const formatPrice = (cents: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(cents / 100)

  const formatRange = (min: number, max: number) => {
    if (min === max || max === 0) return formatPrice(min)
    return `${formatPrice(min)}-${formatPrice(max)}`
  }

  return (
    <div
      className={cn(
        'animate-fade-in-up rounded-[20px] p-5 card-gold-top',
        'bg-[--card]',
        'border border-[--border]',
        'shadow-card'
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-gold" />
          <span className="text-sm font-semibold font-ui text-[--cream]">Budget</span>
        </div>
        <Link
          href="/budget"
          className="text-xs font-ui text-[--muted] hover:text-[--cream] transition-colors flex items-center gap-1"
        >
          View <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 rounded-xl bg-gold-dim border border-gold/20">
          <div className="text-xs font-ui text-gold mb-1">Purchased</div>
          <div className="text-lg font-bold font-display text-[--cream]">{formatPrice(purchasedTotal)}</div>
        </div>
        <div className="p-3 rounded-xl bg-[--surface] border border-[--border]">
          <div className="text-xs font-ui text-[--muted] mb-1">Remaining</div>
          <div className="text-lg font-bold font-display text-[--cream]">{formatPrice(remainingTotal)}</div>
        </div>
      </div>

      {monthlyRecurringMin > 0 && (
        <div className="mt-3 p-2.5 rounded-xl bg-sky/5 border border-sky/15 flex items-center gap-2">
          <RefreshCw className="h-3.5 w-3.5 text-sky shrink-0" />
          <span className="text-xs font-ui text-sky">
            Monthly recurring: <span className="font-bold">{formatRange(monthlyRecurringMin, monthlyRecurringMax)}</span>/mo
          </span>
        </div>
      )}
    </div>
  )
}
