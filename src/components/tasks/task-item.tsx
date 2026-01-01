'use client'

import { FamilyTask } from '@/types'
import { cn } from '@/lib/utils'
import { categoryConfig } from '@/lib/design-tokens'

interface TaskItemProps {
  task: FamilyTask
  isHighlighted?: boolean
  isDimmed?: boolean
  onComplete: () => void
  onSnooze?: () => void
}

export function TaskItem({
  task,
  isHighlighted = false,
  isDimmed = false,
  onComplete,
}: TaskItemProps) {
  const category = categoryConfig[task.category] || categoryConfig.planning

  // Format due date display
  const getDueDateDisplay = () => {
    if (!task.due_date) return null
    const dueDate = new Date(task.due_date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    dueDate.setHours(0, 0, 0, 0)

    const diffDays = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'Due today'
    if (diffDays === 1) return 'Due tomorrow'
    if (diffDays < 7 && diffDays > 0) {
      return `Due ${dueDate.toLocaleDateString('en-US', { weekday: 'short' })}`
    }
    if (task.week_due) return `Week ${task.week_due}`
    return dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  // Format time estimate
  const getTimeEstimate = () => {
    const mins = task.time_estimate_minutes
    if (!mins) return null
    if (mins < 60) return `${mins} min`
    const hours = Math.floor(mins / 60)
    const remainingMins = mins % 60
    if (remainingMins === 0) return `${hours} hour${hours > 1 ? 's' : ''}`
    return `${hours}h ${remainingMins}m`
  }

  // Get assignee display
  const getAssignee = () => {
    const assignee = task.assigned_to
    if (assignee === 'both') return { avatar: 'B', label: 'Both', gradient: 'from-amber-500 to-orange-600' }
    if (assignee === 'mom') return { avatar: 'M', label: 'Mom', gradient: 'from-pink-500 to-rose-500' }
    if (assignee === 'either') return { avatar: 'E', label: 'Either', gradient: 'from-zinc-500 to-zinc-600' }
    // Default: dad (the app user)
    return { avatar: 'D', label: 'Dad', gradient: 'from-indigo-500 to-purple-500' }
  }

  const assignee = getAssignee()
  const timeEstimate = getTimeEstimate()
  const dueDateDisplay = getDueDateDisplay()

  return (
    <div
      className={cn(
        'flex items-start gap-4 p-4 rounded-xl cursor-pointer transition-all',
        isHighlighted && 'bg-amber-500/5 border border-amber-500/20',
        !isHighlighted && 'hover:bg-white/[0.03]',
        isDimmed && 'opacity-70'
      )}
    >
      {/* Checkbox */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          onComplete()
        }}
        className={cn(
          'w-[22px] h-[22px] border-2 border-zinc-600 rounded-md flex-shrink-0 mt-0.5',
          'flex items-center justify-center transition-all',
          'hover:border-green-500 hover:bg-green-500/10',
          isDimmed && 'opacity-50'
        )}
      />

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Header with title and badges */}
        <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
          <span className="text-[15px] font-semibold text-zinc-200">{task.title}</span>
          <div className="flex gap-1.5">
            {task.priority === 'must-do' && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-[10px] uppercase tracking-wide bg-red-500/15 text-red-400">
                Must Do
              </span>
            )}
            {task.priority === 'good-to-do' && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-[10px] uppercase tracking-wide bg-blue-500/15 text-blue-500">
                Nice to Have
              </span>
            )}
            {task.is_time_sensitive && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-[10px] uppercase tracking-wide bg-amber-500/15 text-amber-500">
                Time Sensitive
              </span>
            )}
          </div>
        </div>

        {/* Description */}
        {task.description && (
          <p className="text-[13px] text-zinc-500 mb-2.5 line-clamp-2 leading-relaxed">
            {task.description}
          </p>
        )}

        {/* Meta row */}
        <div className="flex items-center gap-4 flex-wrap">
          {/* Category tag */}
          <span className={cn(
            'inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md',
            category.bgClass,
            category.textClass
          )}>
            <span>{category.icon}</span>
            {category.label}
          </span>

          {/* Time estimate */}
          {timeEstimate && (
            <div className="flex items-center gap-1.5 text-xs text-zinc-600">
              <span>⏱️</span>
              <span>{timeEstimate}</span>
            </div>
          )}

          {/* Due date */}
          {dueDateDisplay && (
            <div className="flex items-center gap-1.5 text-xs text-zinc-600">
              <span>📅</span>
              <span>{dueDateDisplay}</span>
            </div>
          )}

          {/* Assignee */}
          <div className="flex items-center gap-1.5">
            <div className={cn(
              'w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-semibold text-white bg-gradient-to-br',
              assignee.gradient
            )}>
              {assignee.avatar}
            </div>
            <span className="text-xs text-zinc-600">{assignee.label}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
