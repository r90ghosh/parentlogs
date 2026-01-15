'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { format, startOfWeek, endOfWeek, addWeeks } from 'date-fns'
import { ChevronDown, Calendar } from 'lucide-react'
import Link from 'next/link'
import { FamilyTask } from '@/types'
import { cn } from '@/lib/utils'

interface ComingUpPreviewProps {
  tasks: FamilyTask[]
  className?: string
}

interface WeekGroup {
  weekStart: Date
  weekEnd: Date
  label: string
  tasks: FamilyTask[]
}

function groupTasksByWeek(tasks: FamilyTask[], referenceDate: Date): WeekGroup[] {
  const thisWeekEnd = endOfWeek(referenceDate, { weekStartsOn: 1 })

  // Filter to only tasks after this week
  const futureTasks = tasks.filter((t) => new Date(t.due_date) > thisWeekEnd)

  // Group by week
  const weekMap = new Map<string, WeekGroup>()

  futureTasks.forEach((task) => {
    const taskDate = new Date(task.due_date)
    const weekStart = startOfWeek(taskDate, { weekStartsOn: 1 })
    const weekEnd = endOfWeek(taskDate, { weekStartsOn: 1 })
    const key = weekStart.toISOString()

    if (!weekMap.has(key)) {
      weekMap.set(key, {
        weekStart,
        weekEnd,
        label: `${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d')}`,
        tasks: [],
      })
    }

    weekMap.get(key)!.tasks.push(task)
  })

  // Sort by week and take first 2 weeks
  return Array.from(weekMap.values())
    .sort((a, b) => a.weekStart.getTime() - b.weekStart.getTime())
    .slice(0, 2)
}

export function ComingUpPreview({ tasks, className }: ComingUpPreviewProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [now, setNow] = useState<Date | null>(null)

  useEffect(() => {
    setMounted(true)
    setNow(new Date())
  }, [])

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted || !now) {
    return null
  }

  const weekGroups = groupTasksByWeek(tasks, now)

  if (weekGroups.length === 0) {
    return null
  }

  const totalUpcoming = weekGroups.reduce((sum, g) => sum + g.tasks.length, 0)

  return (
    <div className={cn('rounded-xl bg-surface-800/30 border border-surface-700', className)}>
      {/* Header - clickable to expand */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-surface-800/50 transition-colors rounded-t-xl"
      >
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-surface-400" />
          <span className="font-medium text-white">Coming Up</span>
          <span className="text-sm text-surface-400">({totalUpcoming} tasks)</span>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="h-5 w-5 text-surface-400" />
        </motion.div>
      </button>

      {/* Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-4 pt-0 space-y-4">
              {weekGroups.map((group, groupIndex) => (
                <div key={group.weekStart.toISOString()}>
                  {/* Week label */}
                  <p className="text-xs font-medium text-surface-400 uppercase tracking-wide mb-2">
                    {group.label}
                  </p>

                  {/* Tasks in this week */}
                  <div className="space-y-2">
                    {group.tasks.slice(0, 3).map((task) => (
                      <Link
                        key={task.id}
                        href={`/tasks/${task.id}`}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-surface-700 transition-colors"
                      >
                        <div
                          className={cn(
                            'w-2 h-2 rounded-full flex-shrink-0',
                            task.priority === 'must-do' ? 'bg-red-400' : 'bg-surface-500'
                          )}
                        />
                        <span className="text-sm text-surface-300 truncate flex-1">
                          {task.title}
                        </span>
                        <span className="text-xs text-surface-500 flex-shrink-0">
                          {format(new Date(task.due_date), 'EEE')}
                        </span>
                      </Link>
                    ))}

                    {group.tasks.length > 3 && (
                      <p className="text-xs text-surface-500 pl-5">
                        +{group.tasks.length - 3} more
                      </p>
                    )}
                  </div>

                  {/* Divider between weeks */}
                  {groupIndex < weekGroups.length - 1 && (
                    <div className="border-t border-surface-700 mt-4" />
                  )}
                </div>
              ))}

              {/* View all link */}
              <Link
                href="/tasks?filter=upcoming"
                className="block text-center text-sm text-accent-400 hover:text-accent-300 py-2"
              >
                View all upcoming tasks →
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
