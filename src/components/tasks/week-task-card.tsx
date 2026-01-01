'use client'

import { useState } from 'react'
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion'
import { format, isToday, isPast, isTomorrow } from 'date-fns'
import {
  Check,
  ArrowRight,
  Stethoscope,
  ShoppingCart,
  FileText,
  Search,
  Heart,
  Users,
  MoreHorizontal,
} from 'lucide-react'
import { FamilyTask } from '@/types'
import { cn } from '@/lib/utils'
import { checkboxVariants } from './animations/task-animations'

interface WeekTaskCardProps {
  task: FamilyTask
  onComplete: (taskId: string) => void
  onSnooze: (taskId: string) => void
  onClick: (task: FamilyTask) => void
  enableSwipe?: boolean
}

const categoryIcons: Record<string, typeof Stethoscope> = {
  medical: Stethoscope,
  shopping: ShoppingCart,
  documents: FileText,
  research: Search,
  'self-care': Heart,
  relationship: Users,
  preparation: FileText,
  other: MoreHorizontal,
}

const SWIPE_THRESHOLD = 80

export function WeekTaskCard({
  task,
  onComplete,
  onSnooze,
  onClick,
  enableSwipe = true,
}: WeekTaskCardProps) {
  const [isCompleting, setIsCompleting] = useState(false)
  const x = useMotionValue(0)

  // Transform for background reveal
  const completeOpacity = useTransform(x, [0, SWIPE_THRESHOLD], [0, 1])
  const snoozeOpacity = useTransform(x, [-SWIPE_THRESHOLD, 0], [1, 0])

  const dueDate = new Date(task.due_date)
  const isOverdue = isPast(dueDate) && !isToday(dueDate)
  const isDueToday = isToday(dueDate)
  const isDueTomorrow = isTomorrow(dueDate)

  const CategoryIcon = categoryIcons[task.category.toLowerCase()] || MoreHorizontal

  const getDayLabel = () => {
    if (isOverdue) return 'Overdue'
    if (isDueToday) return 'Today'
    if (isDueTomorrow) return 'Tomorrow'
    return format(dueDate, 'EEE')
  }

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x > SWIPE_THRESHOLD) {
      // Swipe right - complete
      setIsCompleting(true)
      setTimeout(() => onComplete(task.id), 300)
    } else if (info.offset.x < -SWIPE_THRESHOLD) {
      // Swipe left - snooze
      onSnooze(task.id)
    }
  }

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsCompleting(true)
    setTimeout(() => onComplete(task.id), 300)
  }

  return (
    <div className="relative">
      {/* Swipe reveal backgrounds */}
      {enableSwipe && (
        <>
          {/* Complete background (right swipe) */}
          <motion.div
            className="absolute inset-0 bg-green-600 rounded-xl flex items-center px-4"
            style={{ opacity: completeOpacity }}
          >
            <Check className="h-6 w-6 text-white" />
          </motion.div>

          {/* Snooze background (left swipe) */}
          <motion.div
            className="absolute inset-0 bg-amber-600 rounded-xl flex items-center justify-end px-4"
            style={{ opacity: snoozeOpacity }}
          >
            <ArrowRight className="h-6 w-6 text-white" />
          </motion.div>
        </>
      )}

      {/* Card content */}
      <motion.div
        drag={enableSwipe ? 'x' : false}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        style={{ x }}
        whileTap={{ scale: enableSwipe ? 1 : 0.98 }}
        animate={isCompleting ? { opacity: 0, scale: 0.8, x: 100 } : { opacity: 1, scale: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        onClick={() => onClick(task)}
        className={cn(
          'relative rounded-xl p-4 cursor-pointer transition-colors',
          'bg-surface-800 border',
          isOverdue && 'border-red-500/50 bg-red-950/10',
          isDueToday && !isOverdue && 'border-amber-500/50 bg-amber-950/10',
          !isOverdue && !isDueToday && 'border-surface-700 hover:border-surface-600'
        )}
      >
        <div className="flex items-center gap-3">
          {/* Checkbox */}
          <motion.button
            onClick={handleCheckboxClick}
            variants={checkboxVariants}
            animate={isCompleting ? 'checked' : 'unchecked'}
            className={cn(
              'flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors',
              isCompleting
                ? 'bg-green-500 border-green-500'
                : 'border-surface-500 hover:border-surface-400'
            )}
          >
            {isCompleting && <Check className="h-4 w-4 text-white" />}
          </motion.button>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <p className="text-white font-medium truncate">{task.title}</p>
            <div className="flex items-center gap-2 mt-1">
              <span
                className={cn(
                  'text-xs font-medium',
                  isOverdue && 'text-red-400',
                  isDueToday && !isOverdue && 'text-amber-400',
                  !isOverdue && !isDueToday && 'text-surface-400'
                )}
              >
                {getDayLabel()}
              </span>
              {task.priority === 'must-do' && (
                <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
              )}
            </div>
          </div>

          {/* Category icon */}
          <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-surface-700 flex items-center justify-center">
            <CategoryIcon className="h-4 w-4 text-surface-400" />
          </div>
        </div>
      </motion.div>
    </div>
  )
}
