'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ListChecks, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useChecklists } from '@/hooks/use-checklists'
import { Skeleton } from '@/components/ui/skeleton'

export function ChecklistProgressCard() {
  const { data: checklists, isLoading } = useChecklists()

  if (isLoading) {
    return <Skeleton className="h-28 w-full rounded-[20px]" />
  }

  // Show the first active checklist with partial progress
  const activeChecklists = (checklists || []).filter(
    c => c.progress.total > 0 && c.progress.completed < c.progress.total
  )

  const featured = activeChecklists[0]
  const totalCompleted = (checklists || []).reduce((sum, c) => sum + c.progress.completed, 0)
  const totalItems = (checklists || []).reduce((sum, c) => sum + c.progress.total, 0)
  const overallPercent = totalItems > 0 ? Math.round((totalCompleted / totalItems) * 100) : 0

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
          <ListChecks className="h-4 w-4 text-teal-400" />
          <span className="text-sm font-semibold text-white">Checklists</span>
        </div>
        <Link
          href="/checklists"
          className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors flex items-center gap-1"
        >
          View all <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      {featured ? (
        <>
          <div className="text-xs text-zinc-400 mb-2 truncate">{featured.name}</div>
          <div className="relative h-2 bg-zinc-700 rounded-full overflow-hidden mb-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${featured.progress.percentage}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="absolute inset-y-0 left-0 bg-teal-500 rounded-full"
            />
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-500">
              {featured.progress.completed} of {featured.progress.total} items
            </span>
            <span className="text-teal-400 font-medium">{featured.progress.percentage}%</span>
          </div>
        </>
      ) : (
        <>
          <div className="relative h-2 bg-zinc-700 rounded-full overflow-hidden mb-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${overallPercent}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="absolute inset-y-0 left-0 bg-teal-500 rounded-full"
            />
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-500">
              {totalCompleted} of {totalItems} items complete
            </span>
            <span className="text-teal-400 font-medium">{overallPercent}%</span>
          </div>
        </>
      )}
    </motion.div>
  )
}
