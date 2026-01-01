'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Check,
  ArrowRight,
  X,
  Clock,
  Stethoscope,
  ShoppingCart,
  FileText,
  Search,
  Heart,
  Users,
  MoreHorizontal,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FamilyTask } from '@/types'
import { cn } from '@/lib/utils'
import { focusCardVariants } from './animations/task-animations'
import { Confetti } from './animations/confetti'

interface TodaysFocusCardProps {
  task: FamilyTask | null
  onComplete: (taskId: string) => void
  onSnooze: (taskId: string) => void
  onSkip: (taskId: string) => void
  isLoading?: boolean
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

const categoryColors: Record<string, string> = {
  medical: 'bg-red-500/20 text-red-400',
  shopping: 'bg-blue-500/20 text-blue-400',
  documents: 'bg-purple-500/20 text-purple-400',
  research: 'bg-cyan-500/20 text-cyan-400',
  'self-care': 'bg-pink-500/20 text-pink-400',
  relationship: 'bg-rose-500/20 text-rose-400',
  preparation: 'bg-amber-500/20 text-amber-400',
  other: 'bg-surface-500/20 text-surface-400',
}

export function TodaysFocusCard({
  task,
  onComplete,
  onSnooze,
  onSkip,
  isLoading,
}: TodaysFocusCardProps) {
  const [showConfetti, setShowConfetti] = useState(false)
  const [isExiting, setIsExiting] = useState(false)

  const handleComplete = () => {
    if (!task) return
    setShowConfetti(true)
    setIsExiting(true)

    // Delay the actual completion to show animation
    setTimeout(() => {
      onComplete(task.id)
    }, 800)
  }

  const handleSnooze = () => {
    if (!task) return
    setIsExiting(true)
    setTimeout(() => {
      onSnooze(task.id)
    }, 300)
  }

  const handleSkip = () => {
    if (!task) return
    onSkip(task.id)
  }

  if (!task) {
    return (
      <div className="relative rounded-2xl bg-surface-800/50 border border-surface-700 p-8 text-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center">
            <Check className="h-8 w-8 text-green-400" />
          </div>
          <h3 className="text-xl font-semibold text-white">All caught up!</h3>
          <p className="text-surface-400">
            No urgent tasks right now. Check back later or browse upcoming tasks.
          </p>
        </div>
      </div>
    )
  }

  const CategoryIcon = categoryIcons[task.category.toLowerCase()] || MoreHorizontal
  const categoryColor = categoryColors[task.category.toLowerCase()] || categoryColors.other

  return (
    <div className="relative">
      <Confetti isActive={showConfetti} onComplete={() => setShowConfetti(false)} />

      <AnimatePresence mode="wait">
        {!isExiting && (
          <motion.div
            key={task.id}
            variants={focusCardVariants}
            initial="initial"
            animate="enter"
            exit="exit"
            className="relative rounded-2xl bg-gradient-to-br from-surface-800 to-surface-900 border border-surface-700 shadow-xl overflow-hidden"
          >
            {/* Top accent bar */}
            <div className="h-1 bg-gradient-to-r from-amber-500 to-orange-500" />

            <div className="p-6 space-y-4">
              {/* Header with category and time */}
              <div className="flex items-center justify-between">
                <div className={cn('flex items-center gap-2 px-3 py-1.5 rounded-lg', categoryColor)}>
                  <CategoryIcon className="h-4 w-4" />
                  <span className="text-sm font-medium capitalize">{task.category}</span>
                </div>

                {task.time_estimate_minutes && (
                  <div className="flex items-center gap-1.5 text-surface-400">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">~{task.time_estimate_minutes} min</span>
                  </div>
                )}
              </div>

              {/* Title */}
              <h2 className="text-2xl font-bold text-white leading-tight">
                {task.title}
              </h2>

              {/* Description / Context */}
              {task.description && (
                <p className="text-surface-300 line-clamp-3">
                  {task.description}
                </p>
              )}

              {/* Priority badge */}
              {task.priority === 'must-do' && (
                <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-red-500/10 text-red-400 text-xs font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                  Must Do
                </div>
              )}

              {/* Action buttons */}
              <div className="flex gap-3 pt-2">
                <Button
                  onClick={handleComplete}
                  disabled={isLoading}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold h-12"
                >
                  <Check className="h-5 w-5 mr-2" />
                  Done
                </Button>

                <Button
                  onClick={handleSnooze}
                  disabled={isLoading}
                  variant="outline"
                  className="flex-1 border-surface-600 hover:bg-surface-700 h-12"
                >
                  <ArrowRight className="h-5 w-5 mr-2" />
                  Tomorrow
                </Button>

                <Button
                  onClick={handleSkip}
                  disabled={isLoading}
                  variant="ghost"
                  className="h-12 px-4 text-surface-400 hover:text-white hover:bg-surface-700"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
