'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { CheckCircle, Clock, ArrowRight, CheckSquare } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useUser } from '@/components/user-provider'
import { useDashboardData, useCompleteDashboardTask, useSnoozeDashboardTask } from '@/hooks/use-dashboard'
import { useFamily } from '@/hooks/use-family'
import { Skeleton } from '@/components/ui/skeleton'

export function TasksDueCard() {
  const { profile } = useUser()
  const { data: family } = useFamily()
  const { data: dashboardData, isLoading } = useDashboardData(
    profile.family_id,
    family?.current_week || 1
  )
  const completeTask = useCompleteDashboardTask()
  const snoozeTask = useSnoozeDashboardTask()

  if (isLoading) {
    return <Skeleton className="h-60 w-full rounded-[20px]" />
  }

  const tasks = dashboardData?.priorityTasks || []

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
          <CheckSquare className="h-4 w-4 text-teal-400" />
          <span className="text-sm font-semibold text-white">Tasks Due This Week</span>
        </div>
        <Link
          href="/tasks"
          className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors flex items-center gap-1"
        >
          See all <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      {tasks.length === 0 ? (
        <div className="py-6 text-center">
          <div className="text-2xl mb-2">✅</div>
          <div className="text-sm text-zinc-400 font-medium">All caught up!</div>
          <div className="text-xs text-zinc-600 mt-1">No tasks due this week</div>
        </div>
      ) : (
        <div className="space-y-2.5">
          {tasks.slice(0, 4).map((task, index) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={cn(
                'flex items-center gap-3 p-3 rounded-[12px]',
                'bg-white/[0.02] border border-white/[0.04]',
                'hover:bg-white/[0.04] transition-colors group'
              )}
            >
              {/* Complete button */}
              <button
                onClick={() => completeTask.mutate(task.id)}
                disabled={completeTask.isPending}
                className={cn(
                  'w-5 h-5 rounded-full border flex-shrink-0 transition-all',
                  'border-zinc-600 hover:border-teal-500 hover:bg-teal-500/10',
                  'flex items-center justify-center'
                )}
              >
                <CheckCircle className="h-3 w-3 text-transparent group-hover:text-teal-400 transition-colors" />
              </button>

              {/* Task info */}
              <div className="flex-1 min-w-0">
                <div className="text-sm text-zinc-200 truncate">{task.title}</div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className={cn(
                    'text-[11px] font-medium',
                    task.isOverdue ? 'text-yellow-500' : task.isUrgent ? 'text-orange-400' : 'text-zinc-500'
                  )}>
                    {task.dueLabel}
                  </span>
                  {task.timeEstimate && (
                    <>
                      <span className="text-zinc-700">·</span>
                      <span className="text-[11px] text-zinc-600 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {task.timeEstimate}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Snooze button */}
              <button
                onClick={() => snoozeTask.mutate(task.id)}
                disabled={snoozeTask.isPending}
                className="opacity-0 group-hover:opacity-100 text-[10px] text-zinc-500 hover:text-zinc-300 transition-all px-2 py-1 rounded-md hover:bg-white/[0.06]"
              >
                Snooze
              </button>
            </motion.div>
          ))}

          {tasks.length > 4 && (
            <Link
              href="/tasks"
              className="block text-center text-xs text-zinc-500 hover:text-zinc-300 py-2 transition-colors"
            >
              +{tasks.length - 4} more tasks
            </Link>
          )}
        </div>
      )}
    </motion.div>
  )
}
