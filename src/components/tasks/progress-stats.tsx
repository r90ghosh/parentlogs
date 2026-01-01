'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { CheckCircle2, ListTodo } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ProgressStatsProps {
  weekProgress: { completed: number; total: number }
  overallProgress: { completed: number; total: number }
  className?: string
}

function ProgressBar({
  label,
  completed,
  total,
  color = 'amber',
}: {
  label: string
  completed: number
  total: number
  color?: 'amber' | 'green'
}) {
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-surface-300">{label}</span>
        <span className="text-white font-medium">
          {completed}/{total}
        </span>
      </div>
      <div className="h-2 bg-surface-800 rounded-full overflow-hidden">
        <motion.div
          className={cn(
            'h-full rounded-full',
            color === 'amber' && 'bg-gradient-to-r from-amber-500 to-orange-500',
            color === 'green' && 'bg-gradient-to-r from-green-500 to-emerald-500'
          )}
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
        />
      </div>
    </div>
  )
}

export function ProgressStats({
  weekProgress,
  overallProgress,
  className,
}: ProgressStatsProps) {
  return (
    <div className={cn('rounded-xl bg-surface-800/50 border border-surface-700 p-4', className)}>
      <div className="space-y-4">
        <ProgressBar
          label="This week"
          completed={weekProgress.completed}
          total={weekProgress.total}
          color="amber"
        />

        <ProgressBar
          label="Overall"
          completed={overallProgress.completed}
          total={overallProgress.total}
          color="green"
        />

        {/* Quick links */}
        <div className="flex gap-3 pt-2">
          <Link
            href="/tasks?filter=all"
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-surface-700 hover:bg-surface-600 transition-colors text-sm text-surface-300 hover:text-white"
          >
            <ListTodo className="h-4 w-4" />
            View All
          </Link>
          <Link
            href="/tasks?status=completed"
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-surface-700 hover:bg-surface-600 transition-colors text-sm text-surface-300 hover:text-white"
          >
            <CheckCircle2 className="h-4 w-4" />
            Completed
          </Link>
        </div>
      </div>
    </div>
  )
}
