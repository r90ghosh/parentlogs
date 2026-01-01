'use client'

import { cn } from '@/lib/utils'
import { PriorityTask } from '@/types/dashboard'
import Link from 'next/link'

interface PriorityTasksCardProps {
  tasks: PriorityTask[]
  onComplete: (taskId: string) => void
  onSnooze: (taskId: string) => void
}

const categoryStyles: Record<string, { bg: string; text: string; icon: string }> = {
  medical: { bg: 'bg-red-500/15', text: 'text-red-400', icon: '🏥' },
  planning: { bg: 'bg-purple-500/15', text: 'text-purple-400', icon: '📋' },
  shopping: { bg: 'bg-blue-500/15', text: 'text-blue-400', icon: '🛒' },
  financial: { bg: 'bg-emerald-500/15', text: 'text-emerald-400', icon: '💰' },
  partner: { bg: 'bg-pink-500/15', text: 'text-pink-400', icon: '💑' },
  self_care: { bg: 'bg-amber-500/15', text: 'text-amber-400', icon: '🧘' },
}

export function PriorityTasksCard({ tasks, onComplete, onSnooze }: PriorityTasksCardProps) {
  return (
    <div
      className={cn(
        'rounded-[20px] p-6',
        'bg-gradient-to-br from-zinc-800 to-zinc-900',
        'border border-white/[0.06]'
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5 text-base font-semibold text-white">
          🎯 Today's Priorities
        </div>
        {tasks.length > 0 && (
          <span className="px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-500 text-xs font-semibold">
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
                    'w-6 h-6 rounded-lg border-2 border-zinc-600 flex-shrink-0',
                    'flex items-center justify-center transition-all',
                    'hover:border-green-500 hover:bg-green-500/10'
                  )}
                />

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="text-[15px] font-semibold text-zinc-200 mb-1 truncate">
                    {task.title}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-zinc-500">
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
                      'bg-white/[0.06] text-zinc-500 transition-all',
                      'hover:bg-green-500/15 hover:text-green-500'
                    )}
                  >
                    ✓
                  </button>
                  <button
                    onClick={() => onSnooze(task.id)}
                    className={cn(
                      'w-9 h-9 rounded-[10px] flex items-center justify-center text-base',
                      'bg-white/[0.06] text-zinc-500 transition-all',
                      'hover:bg-white/10 hover:text-zinc-300'
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
          <div className="text-sm text-zinc-400">All caught up for today!</div>
        </div>
      )}

      {/* View all link */}
      <Link
        href="/tasks"
        className={cn(
          'flex items-center justify-center gap-2 pt-3.5 mt-3',
          'border-t border-white/[0.04]',
          'text-sm text-zinc-500 font-medium',
          'hover:text-amber-500 transition-colors'
        )}
      >
        View all tasks →
      </Link>
    </div>
  )
}
