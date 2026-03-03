'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { DollarSign, ArrowRight } from 'lucide-react'
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

  const formatPrice = (cents: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(cents / 100)

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'rounded-[20px] p-5',
        'bg-gradient-to-br from-zinc-800 to-zinc-900',
        'border border-white/[0.06]'
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-green-400" />
          <span className="text-sm font-semibold text-white">Budget</span>
        </div>
        <Link
          href="/budget"
          className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors flex items-center gap-1"
        >
          View <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/20">
          <div className="text-xs text-green-400 mb-1">Purchased</div>
          <div className="text-lg font-bold text-white">{formatPrice(purchasedTotal)}</div>
        </div>
        <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
          <div className="text-xs text-zinc-400 mb-1">Remaining</div>
          <div className="text-lg font-bold text-white">{formatPrice(remainingTotal)}</div>
        </div>
      </div>
    </motion.div>
  )
}
