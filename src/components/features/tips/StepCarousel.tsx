'use client'

import { useState, useCallback, type ComponentType } from 'react'
import { motion, AnimatePresence, type PanInfo } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { StepCard } from './StepCard'
import type { TipStep } from '@/types/tips'

interface StepCarouselProps {
  steps: TipStep[]
  illustrations: Record<string, ComponentType<{ className?: string }>>
}

const SWIPE_THRESHOLD = 50
const SWIPE_VELOCITY = 500

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -300 : 300,
    opacity: 0,
  }),
}

const slideTransition = {
  x: { type: 'spring' as const, stiffness: 300, damping: 30 },
  opacity: { duration: 0.2 },
}

export function StepCarousel({ steps, illustrations }: StepCarouselProps) {
  const [[currentIndex, direction], setPage] = useState([0, 0])

  const paginate = useCallback(
    (newDirection: number) => {
      setPage(([prev]) => {
        const next = prev + newDirection
        if (next < 0 || next >= steps.length) return [prev, 0]
        return [next, newDirection]
      })
    },
    [steps.length]
  )

  const goTo = useCallback(
    (index: number) => {
      setPage(([prev]) => [index, index > prev ? 1 : -1])
    },
    []
  )

  const handleDragEnd = useCallback(
    (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      const { offset, velocity } = info
      if (offset.x < -SWIPE_THRESHOLD || velocity.x < -SWIPE_VELOCITY) {
        paginate(1)
      } else if (offset.x > SWIPE_THRESHOLD || velocity.x > SWIPE_VELOCITY) {
        paginate(-1)
      }
    },
    [paginate]
  )

  const step = steps[currentIndex]
  const IllustrationComponent = illustrations[step.illustrationId] || null
  const isFirst = currentIndex === 0
  const isLast = currentIndex === steps.length - 1

  return (
    <div className="flex flex-col gap-4">
      {/* Carousel viewport */}
      <div className="relative overflow-hidden">
        {/* Arrow buttons */}
        <button
          onClick={() => paginate(-1)}
          disabled={isFirst}
          aria-label="Previous step"
          className={cn(
            'absolute left-2 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center',
            'w-10 h-10 rounded-full bg-[--surface]/80 backdrop-blur-sm border border-[--border]',
            'transition-opacity duration-200',
            isFirst ? 'opacity-0 pointer-events-none' : 'opacity-100 hover:bg-[--card-hover]'
          )}
        >
          <ChevronLeft className="h-5 w-5 text-[--cream]" />
        </button>

        <button
          onClick={() => paginate(1)}
          disabled={isLast}
          aria-label="Next step"
          className={cn(
            'absolute right-2 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center',
            'w-10 h-10 rounded-full bg-[--surface]/80 backdrop-blur-sm border border-[--border]',
            'transition-opacity duration-200',
            isLast ? 'opacity-0 pointer-events-none' : 'opacity-100 hover:bg-[--card-hover]'
          )}
        >
          <ChevronRight className="h-5 w-5 text-[--cream]" />
        </button>

        {/* Swipeable card area */}
        <div className="px-4">
          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={slideTransition}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.15}
              onDragEnd={handleDragEnd}
              className="w-full touch-pan-y"
            >
              <StepCard
                step={step}
                totalSteps={steps.length}
                illustration={IllustrationComponent}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Dot indicators */}
      <div className="flex items-center justify-center gap-1.5 py-2">
        {steps.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Go to step ${i + 1}`}
            className={cn(
              'rounded-full transition-all duration-300 min-w-[10px] min-h-[10px]',
              i === currentIndex
                ? 'w-6 h-2.5 bg-copper'
                : 'w-2.5 h-2.5 bg-[--dim] hover:bg-[--muted]'
            )}
          />
        ))}
      </div>
    </div>
  )
}
