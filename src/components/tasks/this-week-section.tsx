'use client'

import { motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { FamilyTask } from '@/types'
import { WeekTaskCard } from './week-task-card'
import { staggerContainerVariants, staggerItemVariants } from './animations/task-animations'

interface ThisWeekSectionProps {
  tasks: FamilyTask[]
  onTaskComplete: (taskId: string) => void
  onTaskSnooze: (taskId: string) => void
  onTaskClick: (task: FamilyTask) => void
  maxVisible?: number
  focusTaskId?: string // Exclude the focus task from this section
}

export function ThisWeekSection({
  tasks,
  onTaskComplete,
  onTaskSnooze,
  onTaskClick,
  maxVisible = 4,
  focusTaskId,
}: ThisWeekSectionProps) {
  // Filter out the focus task if provided
  const filteredTasks = focusTaskId
    ? tasks.filter((t) => t.id !== focusTaskId)
    : tasks

  const visibleTasks = filteredTasks.slice(0, maxVisible)
  const remainingCount = filteredTasks.length - maxVisible

  if (filteredTasks.length === 0) {
    return null
  }

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">This Week</h3>
        {filteredTasks.length > maxVisible && (
          <Link
            href="/tasks?filter=this-week"
            className="text-sm text-accent-400 hover:text-accent-300 flex items-center gap-1"
          >
            View all
            <ChevronRight className="h-4 w-4" />
          </Link>
        )}
      </div>

      {/* Mobile: Horizontal scroll */}
      <div className="md:hidden">
        <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory -mx-4 px-4">
          {visibleTasks.map((task) => (
            <div key={task.id} className="flex-shrink-0 w-[280px] snap-start">
              <WeekTaskCard
                task={task}
                onComplete={onTaskComplete}
                onSnooze={onTaskSnooze}
                onClick={onTaskClick}
                enableSwipe={true}
              />
            </div>
          ))}

          {/* +X more card */}
          {remainingCount > 0 && (
            <Link
              href="/tasks?filter=this-week"
              className="flex-shrink-0 w-[120px] snap-start"
            >
              <div className="h-full rounded-xl bg-surface-800/50 border border-surface-700 border-dashed flex items-center justify-center hover:bg-surface-800 transition-colors">
                <div className="text-center">
                  <span className="text-2xl font-bold text-surface-400">
                    +{remainingCount}
                  </span>
                  <p className="text-xs text-surface-500 mt-1">more</p>
                </div>
              </div>
            </Link>
          )}
        </div>
      </div>

      {/* Desktop: Grid */}
      <motion.div
        className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3"
        variants={staggerContainerVariants}
        initial="hidden"
        animate="visible"
      >
        {visibleTasks.map((task) => (
          <motion.div key={task.id} variants={staggerItemVariants}>
            <WeekTaskCard
              task={task}
              onComplete={onTaskComplete}
              onSnooze={onTaskSnooze}
              onClick={onTaskClick}
              enableSwipe={false}
            />
          </motion.div>
        ))}

        {/* +X more card for desktop */}
        {remainingCount > 0 && (
          <motion.div variants={staggerItemVariants}>
            <Link href="/tasks?filter=this-week">
              <div className="h-full min-h-[80px] rounded-xl bg-surface-800/50 border border-surface-700 border-dashed flex items-center justify-center hover:bg-surface-800 transition-colors">
                <div className="text-center">
                  <span className="text-xl font-bold text-surface-400">
                    +{remainingCount}
                  </span>
                  <p className="text-xs text-surface-500 mt-1">more tasks</p>
                </div>
              </div>
            </Link>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
