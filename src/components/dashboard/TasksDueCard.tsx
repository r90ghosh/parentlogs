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
        'rounded-[20px] p-5 card-copper-top',
        'bg-[--card]',
        'border border-[--border]',
        'shadow-card'
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <CheckSquare className="h-4 w-4 text-copper" />
          <span className="text-sm font-semibold font-ui text-[--cream]">Tasks Due This Week</span>
        </div>
        <Link
          href="/tasks"
          className="text-xs font-ui text-[--muted] hover:text-[--cream] transition-colors flex items-center gap-1"
        >
          See all <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      {tasks.length === 0 ? (
        <div className="py-6 text-center">
          <div className="text-2xl mb-2">✅</div>
          <div className="text-sm font-ui text-[--muted] font-medium">All caught up!</div>
          <div className="text-xs font-body text-[--dim] mt-1">No tasks due this week</div>
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
                'bg-[--surface] border border-[--border]',
                'hover:bg-[--card-hover] hover:border-[--border-hover] transition-colors group'
              )}
            >
              {/* Complete button */}
              <button
                onClick={() => completeTask.mutate(task.id)}
                disabled={completeTask.isPending}
                className={cn(
                  'w-5 h-5 rounded-full border flex-shrink-0 transition-all',
                  'border-[--dim] hover:border-copper hover:bg-copper-dim',
                  'flex items-center justify-center'
                )}
              >
                <CheckCircle className="h-3 w-3 text-transparent group-hover:text-copper transition-colors" />
              </button>

              {/* Task info */}
              <div className="flex-1 min-w-0">
                <div className="text-sm font-body text-[--cream] truncate">{task.title}</div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className={cn(
                    'text-[11px] font-medium font-ui',
                    task.isOverdue ? 'text-gold' : task.isUrgent ? 'text-copper' : 'text-[--muted]'
                  )}>
                    {task.dueLabel}
                  </span>
                  {task.timeEstimate && (
                    <>
                      <span className="text-[--dim]">·</span>
                      <span className="text-[11px] font-ui text-[--dim] flex items-center gap-1">
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
                className="opacity-0 group-hover:opacity-100 text-[10px] font-ui text-[--muted] hover:text-[--cream] transition-all px-2 py-1 rounded-md hover:bg-[--card-hover]"
              >
                Snooze
              </button>
            </motion.div>
          ))}

          {tasks.length > 4 && (
            <Link
              href="/tasks"
              className="block text-center text-xs font-ui text-[--muted] hover:text-[--cream] py-2 transition-colors"
            >
              +{tasks.length - 4} more tasks
            </Link>
          )}
        </div>
      )}
    </motion.div>
  )
}
