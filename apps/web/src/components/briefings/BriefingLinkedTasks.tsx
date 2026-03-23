'use client'

import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { useCompleteDashboardTask } from '@/hooks/use-dashboard'
import { cn } from '@/lib/utils'
import { Check, ListTodo } from 'lucide-react'
import { FamilyTask } from '@tdc/shared/types'

const supabase = createClient()

interface BriefingLinkedTasksProps {
  weekNumber: number
  familyId: string
}

function useBriefingWeekTasks(familyId: string, weekNumber: number) {
  return useQuery<FamilyTask[]>({
    queryKey: ['briefing-tasks', familyId, weekNumber],
    queryFn: async () => {
      // Use select('*') to avoid Supabase type inference issues with
      // extended columns (like week_due) that may not be in generated types
      const { data, error } = await supabase
        .from('family_tasks')
        .select('*')
        .eq('family_id', familyId)
        .order('created_at', { ascending: true })

      if (error) throw error

      const allTasks = (data || []) as FamilyTask[]

      // Filter client-side by week_due
      return allTasks.filter(task => task.week_due === weekNumber)
    },
    enabled: !!familyId && !!weekNumber,
    staleTime: 1000 * 30, // 30 seconds
  })
}

export function BriefingLinkedTasks({ weekNumber, familyId }: BriefingLinkedTasksProps) {
  const { data: tasks, isLoading } = useBriefingWeekTasks(familyId, weekNumber)
  const completeTask = useCompleteDashboardTask()

  if (isLoading) {
    return (
      <div className="bg-[--card] border border-[--border] rounded-2xl p-6 shadow-card">
        <div className="h-4 w-32 bg-[--card-hover] rounded animate-pulse mb-4" />
        <div className="space-y-2">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-12 bg-[--card-hover]/50 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  if (!tasks || tasks.length === 0) return null

  const completedCount = tasks.filter(t => t.status === 'completed').length
  const totalCount = tasks.length

  const handleToggle = (taskId: string, isCompleted: boolean) => {
    if (!isCompleted && !completeTask.isPending) {
      completeTask.mutate(taskId)
    }
  }

  return (
    <div className="bg-[--card] border border-[--border] rounded-2xl p-6 shadow-card">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-copper-dim flex items-center justify-center">
            <ListTodo className="h-4 w-4 text-copper" />
          </div>
          <span className="text-sm font-semibold font-ui text-[--cream]">Tasks This Week</span>
        </div>
        {/* Completion summary */}
        <span
          className={cn(
            'text-xs font-medium font-ui px-2.5 py-1 rounded-full',
            completedCount === totalCount
              ? 'bg-[--sage-dim] text-[--sage]'
              : 'bg-[--card-hover] text-[--muted]'
          )}
        >
          {completedCount === totalCount
            ? `All ${totalCount} done`
            : `${completedCount} of ${totalCount} done`}
        </span>
      </div>

      {/* Task list */}
      <div className="space-y-2">
        {tasks.map(task => {
          const isCompleted = task.status === 'completed'
          return (
            <button
              key={task.id}
              onClick={() => handleToggle(task.id, isCompleted)}
              disabled={isCompleted || completeTask.isPending}
              className={cn(
                'w-full flex items-center gap-3 p-3 rounded-xl transition-colors text-left',
                isCompleted
                  ? 'bg-[--bg] cursor-default'
                  : 'bg-[--bg] hover:bg-[--card-hover] cursor-pointer'
              )}
            >
              {/* Checkbox */}
              <div
                className={cn(
                  'w-5 h-5 rounded-md border-2 flex-shrink-0 flex items-center justify-center transition-all',
                  isCompleted
                    ? 'bg-copper border-copper'
                    : 'border-[--dim] hover:border-copper/60'
                )}
              >
                {isCompleted && <Check className="h-3 w-3 text-[--white]" />}
              </div>

              {/* Title */}
              <span
                className={cn(
                  'text-sm font-body flex-1 leading-snug',
                  isCompleted
                    ? 'text-[--dim] line-through'
                    : 'text-[--cream]'
                )}
              >
                {task.title}
              </span>

              {/* Priority badge */}
              {task.priority === 'must-do' && !isCompleted && (
                <span className="text-xs font-ui text-copper bg-copper-dim px-1.5 py-0.5 rounded flex-shrink-0">
                  Must do
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
