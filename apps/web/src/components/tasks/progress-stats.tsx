'use client'

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
  color = 'copper',
}: {
  label: string
  completed: number
  total: number
  color?: 'copper' | 'sage'
}) {
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-[--cream] font-body">{label}</span>
        <span className="text-[--cream] font-ui font-medium">
          {completed}/{total}
        </span>
      </div>
      <div className="h-2 bg-[--card] rounded-full overflow-hidden">
        <div
          className={cn(
            'h-full rounded-full',
            color === 'copper' && 'bg-gradient-to-r from-copper to-gold',
            color === 'sage' && 'bg-sage'
          )}
          style={{ width: `${percent}%`, transition: 'width 0.8s ease-out 0.3s' }}
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
    <div className={cn('rounded-xl bg-[--card] border border-[--border] p-4', className)}>
      <div className="space-y-4">
        <ProgressBar
          label="This week"
          completed={weekProgress.completed}
          total={weekProgress.total}
          color="copper"
        />

        <ProgressBar
          label="Overall"
          completed={overallProgress.completed}
          total={overallProgress.total}
          color="sage"
        />

        {/* Quick links */}
        <div className="flex gap-3 pt-2">
          <Link
            href="/tasks?filter=all"
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-[--card-hover] hover:bg-[--border-hover]/20 transition-colors text-sm text-[--cream] font-ui"
          >
            <ListTodo className="h-4 w-4" />
            View All
          </Link>
          <Link
            href="/tasks?status=completed"
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-[--card-hover] hover:bg-[--border-hover]/20 transition-colors text-sm text-[--cream] font-ui"
          >
            <CheckCircle2 className="h-4 w-4" />
            Completed
          </Link>
        </div>
      </div>
    </div>
  )
}
