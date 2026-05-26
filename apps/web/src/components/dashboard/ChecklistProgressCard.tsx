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
    return <Skeleton className="h-36 w-full rounded-[20px]" />
  }

  const allChecklists = checklists || []
  const totalCompleted = allChecklists.reduce((sum, c) => sum + c.progress.completed, 0)
  const totalItems = allChecklists.reduce((sum, c) => sum + c.progress.total, 0)
  const overallPercent = totalItems > 0 ? Math.round((totalCompleted / totalItems) * 100) : 0

  // Show up to 2 checklists, preferring ones with partial progress
  const withProgress = allChecklists.filter(
    c => c.progress.completed > 0 && c.progress.completed < c.progress.total
  )
  const notStarted = allChecklists.filter(
    c => c.progress.completed === 0 && c.progress.total > 0
  )
  const display = [...withProgress, ...notStarted].slice(0, 2)
  const remaining = allChecklists.length - display.length

  return (
    <div
      className={cn(
        'animate-fade-in-up rounded-[20px] p-5 card-copper-top',
        'bg-[--card]',
        'border border-[--border]',
        'shadow-card'
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <ListChecks className="h-4 w-4 text-copper" />
          <span className="text-sm font-semibold font-ui text-[--cream]">Checklists</span>
        </div>
        <Link
          href="/checklists"
          className="text-xs font-ui text-[--muted] hover:text-[--cream] transition-colors flex items-center gap-1"
        >
          View all <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      {/* Overall summary */}
      <div className="flex items-center justify-between text-xs mb-3">
        <span className="font-body text-[--muted]">
          {totalCompleted} of {totalItems} items across {allChecklists.length} checklists
        </span>
        <span className="text-copper font-medium font-ui">{overallPercent}%</span>
      </div>

      {/* Individual checklists */}
      {display.length > 0 && (
        <div className="space-y-3">
          {display.map((checklist, index) => (
            <div key={checklist.checklist_id}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-body text-[--cream] truncate mr-2">
                  {checklist.name}
                </span>
                <span className="text-xs text-copper font-medium font-ui shrink-0">
                  {checklist.progress.percentage}%
                </span>
              </div>
              <div className="relative h-1.5 bg-[--dim] rounded-full overflow-hidden mb-1">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${checklist.progress.percentage}%` }}
                  transition={{ duration: 0.6, delay: index * 0.15, ease: 'easeOut' }}
                  className="absolute inset-y-0 left-0 bg-copper rounded-full"
                />
              </div>
              <span className="text-[11px] font-body text-[--muted]">
                {checklist.progress.completed} of {checklist.progress.total} items
              </span>
            </div>
          ))}
        </div>
      )}

      {remaining > 0 && (
        <Link
          href="/checklists"
          className="block mt-3 text-xs font-ui text-[--muted] hover:text-[--cream] transition-colors"
        >
          +{remaining} more {remaining === 1 ? 'checklist' : 'checklists'}
        </Link>
      )}
    </div>
  )
}
