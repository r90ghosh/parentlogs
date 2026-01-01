'use client'

import Link from 'next/link'
import { useTasks, useCompleteTask } from '@/hooks/use-tasks'
import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'

interface RelatedTasksProps {
  linkedTaskIds?: string[]
}

export function RelatedTasks({ linkedTaskIds }: RelatedTasksProps) {
  const { data: allTasks } = useTasks({ status: 'pending' })
  const completeTask = useCompleteTask()

  // Filter to linked tasks or just show first few pending tasks
  const tasks = linkedTaskIds?.length
    ? allTasks?.filter(t => linkedTaskIds.includes(t.task_template_id || ''))
    : allTasks?.slice(0, 5)

  const handleToggle = (taskId: string, isCompleted: boolean) => {
    if (!isCompleted) {
      completeTask.mutate(taskId)
    }
  }

  return (
    <div className="bg-gradient-to-br from-zinc-800/80 to-zinc-900/80 border border-white/[0.08] rounded-2xl p-6">
      <div className="flex justify-between items-center mb-4">
        <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
          Related Tasks
        </div>
        <Link
          href="/tasks"
          className="text-xs text-teal-500 hover:text-teal-400 transition-colors"
        >
          View All &rarr;
        </Link>
      </div>

      {tasks && tasks.length > 0 ? (
        <div className="space-y-2">
          {tasks.map(task => {
            const isCompleted = task.status === 'completed'
            return (
              <button
                key={task.id}
                onClick={() => handleToggle(task.id, isCompleted)}
                disabled={completeTask.isPending}
                className="w-full flex items-center gap-3 p-3 bg-black/20 hover:bg-black/30 rounded-xl transition-colors text-left"
              >
                <div
                  className={cn(
                    'w-5 h-5 rounded-md border-2 flex-shrink-0 flex items-center justify-center transition-colors',
                    isCompleted
                      ? 'bg-green-500 border-green-500'
                      : 'border-zinc-600 hover:border-zinc-500'
                  )}
                >
                  {isCompleted && <Check className="h-3 w-3 text-white" />}
                </div>
                <span
                  className={cn(
                    'text-sm flex-1',
                    isCompleted
                      ? 'text-zinc-500 line-through'
                      : 'text-zinc-200'
                  )}
                >
                  {task.title}
                </span>
              </button>
            )
          })}
        </div>
      ) : (
        <p className="text-sm text-zinc-500 text-center py-4">
          No tasks for this week
        </p>
      )}
    </div>
  )
}
