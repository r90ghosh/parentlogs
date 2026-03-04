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
  medical: 'bg-coral-dim text-coral',
  shopping: 'bg-sky-dim text-sky',
  documents: 'bg-copper-dim text-copper',
  research: 'bg-sky-dim text-sky',
  'self-care': 'bg-rose-dim text-rose',
  relationship: 'bg-rose-dim text-rose',
  preparation: 'bg-gold-dim text-gold',
  other: 'bg-[--card] text-[--muted]',
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
      <div className="relative rounded-2xl bg-[--card] border border-[--border] p-8 text-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-16 h-16 rounded-full bg-[--sage-dim] flex items-center justify-center">
            <Check className="h-8 w-8 text-sage" />
          </div>
          <h3 className="text-xl font-display font-semibold text-[--cream]">All caught up!</h3>
          <p className="text-[--muted] font-body">
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
            className="relative rounded-2xl bg-[--surface] border border-[--border] shadow-card overflow-hidden"
          >
            {/* Top accent bar */}
            <div className="h-1 bg-gradient-to-r from-copper to-gold" />

            <div className="p-6 space-y-4">
              {/* Header with category and time */}
              <div className="flex items-center justify-between">
                <div className={cn('flex items-center gap-2 px-3 py-1.5 rounded-lg', categoryColor)}>
                  <CategoryIcon className="h-4 w-4" />
                  <span className="text-sm font-ui font-medium capitalize">{task.category}</span>
                </div>

                {task.time_estimate_minutes && (
                  <div className="flex items-center gap-1.5 text-[--muted]">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm font-body">~{task.time_estimate_minutes} min</span>
                  </div>
                )}
              </div>

              {/* Title */}
              <h2 className="text-2xl font-display font-bold text-[--cream] leading-tight">
                {task.title}
              </h2>

              {/* Description / Context */}
              {task.description && (
                <p className="text-[--cream] font-body line-clamp-3">
                  {task.description}
                </p>
              )}

              {/* Priority badge */}
              {task.priority === 'must-do' && (
                <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-coral-dim text-coral text-xs font-ui font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-coral" />
                  Must Do
                </div>
              )}

              {/* Action buttons */}
              <div className="flex gap-3 pt-2">
                <Button
                  onClick={handleComplete}
                  disabled={isLoading}
                  className="flex-1 bg-sage hover:bg-sage/90 text-[--bg] font-ui font-semibold h-12"
                >
                  <Check className="h-5 w-5 mr-2" />
                  Done
                </Button>

                <Button
                  onClick={handleSnooze}
                  disabled={isLoading}
                  variant="outline"
                  className="flex-1 border-[--border-hover] hover:bg-[--card] h-12 font-ui"
                >
                  <ArrowRight className="h-5 w-5 mr-2" />
                  Tomorrow
                </Button>

                <Button
                  onClick={handleSkip}
                  disabled={isLoading}
                  variant="ghost"
                  className="h-12 px-4 text-[--muted] hover:text-[--cream] hover:bg-[--card]"
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
