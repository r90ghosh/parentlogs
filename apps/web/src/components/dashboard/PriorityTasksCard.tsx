'use client'

import { cn } from '@/lib/utils'
import { PriorityTask } from '@tdc/shared/types/dashboard'
import Link from 'next/link'

interface PriorityTasksCardProps {
  tasks: PriorityTask[]
  onComplete: (taskId: string) => void
  onSnooze: (taskId: string) => void
}

const categoryStyles: Record<string, { bg: string; text: string; icon: string }> = {
  medical: { bg: 'bg-coral/15', text: 'text-coral', icon: '🏥' },
  planning: { bg: 'bg-purple-500/15', text: 'text-purple-400', icon: '📋' },
  shopping: { bg: 'bg-sky/15', text: 'text-sky', icon: '🛒' },
  financial: { bg: 'bg-sage/15', text: 'text-sage', icon: '💰' },
  partner: { bg: 'bg-rose/15', text: 'text-rose', icon: '💑' },
  self_care: { bg: 'bg-gold/15', text: 'text-gold', icon: '🧘' },
}

export function PriorityTasksCard({ tasks, onComplete, onSnooze }: PriorityTasksCardProps) {
  return (
    <div
      className={cn(
        'rounded-[20px] p-4 sm:p-6',
        'bg-gradient-to-br from-[--card] to-[--surface]',
        'border border-[--border]'
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5 text-base font-semibold text-white">
          🎯 Today's Priorities
        </div>
        {tasks.length > 0 && (
          <span className="px-2.5 py-1 rounded-full bg-gold/15 text-gold text-xs font-semibold">
            {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
          </span>
        )}
      </div>

      {/* Tasks list */}
      {tasks.length > 0 ? (
        <div className="flex flex-col gap-3">
          {tasks.map((task) => {
            const style = categoryStyles[task.category] || categoryStyles.planning

            return (
              <div
                key={task.id}
                className={cn(
                  'flex items-center gap-4 p-4 rounded-[14px] cursor-pointer transition-all',
                  'bg-white/[0.02] border border-white/[0.04]',
                  'hover:bg-white/[0.04] hover:border-white/[0.08]',
                  task.isUrgent && 'border-red-500/30 bg-red-500/5'
                )}
              >
                {/* Checkbox */}
                <button
                  onClick={() => onComplete(task.id)}
                  className={cn(
                    'w-6 h-6 rounded-lg border-2 border-[--border-hover] flex-shrink-0',
                    'flex items-center justify-center transition-all',
                    'hover:border-sage hover:bg-sage/10'
                  )}
                />

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="text-[15px] font-semibold text-[--cream] mb-1 truncate">
                    {task.title}
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 text-xs text-[--dim] flex-wrap">
                    <span className={cn('px-2 py-0.5 rounded-md text-[11px] font-medium', style.bg, style.text)}>
                      {style.icon} {task.category.replace('_', ' ')}
                    </span>
                    <span>⏱️ {task.timeEstimate}</span>
                    <span className={task.isOverdue ? 'text-red-500' : ''}>
                      {task.isOverdue ? '⚠️' : '📅'} {task.dueLabel}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => onComplete(task.id)}
                    className={cn(
                      'w-9 h-9 rounded-[10px] flex items-center justify-center text-base',
                      'bg-[--card-hover] text-[--dim] transition-all',
                      'hover:bg-sage/15 hover:text-sage'
                    )}
                  >
                    ✓
                  </button>
                  <button
                    onClick={() => onSnooze(task.id)}
                    className={cn(
                      'w-9 h-9 rounded-[10px] flex items-center justify-center text-base',
                      'bg-[--card-hover] text-[--dim] transition-all',
                      'hover:bg-[--border-hover] hover:text-[--cream]'
                    )}
                  >
                    →
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="text-4xl mb-3">🎉</div>
          <div className="text-sm text-[--muted]">All caught up for today!</div>
        </div>
      )}

      {/* View all link */}
      <Link
        href="/tasks"
        className={cn(
          'flex items-center justify-center gap-2 pt-3.5 mt-3',
          'border-t border-[--border]',
          'text-sm text-[--dim] font-medium',
          'hover:text-gold transition-colors'
        )}
      >
        View all tasks →
      </Link>
    </div>
  )
}
