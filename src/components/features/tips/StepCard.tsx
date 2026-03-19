'use client'

import { useState, type ComponentType } from 'react'
import { Lightbulb, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { TipStep } from '@/types/tips'

interface StepCardProps {
  step: TipStep
  totalSteps: number
  illustration: ComponentType<{ className?: string }> | null
}

export function StepCard({ step, totalSteps, illustration: Illustration }: StepCardProps) {
  const [proTipOpen, setProTipOpen] = useState(false)

  return (
    <div className="bg-[--card] rounded-2xl border border-[--border] p-5 flex flex-col gap-4 w-full select-none">
      {/* Step counter */}
      <p className="font-ui text-xs tracking-wide text-[--dim] uppercase">
        Step {step.stepNumber} of {totalSteps}
      </p>

      {/* SVG illustration */}
      <div className="flex items-center justify-center w-full aspect-[4/3] rounded-xl bg-[--bg] border border-[--border] overflow-hidden">
        {Illustration ? (
          <Illustration className="w-full h-full" />
        ) : (
          <div className="flex items-center justify-center w-full h-full">
            <span className="font-ui text-sm text-[--dim]">Illustration</span>
          </div>
        )}
      </div>

      {/* Title */}
      <h3 className="font-display text-lg font-bold text-[--white] leading-snug">
        {step.title}
      </h3>

      {/* Description */}
      <p className="font-body text-sm text-[--cream] leading-relaxed">
        {step.description}
      </p>

      {/* Pro tip — collapsible */}
      {step.proTip && (
        <div className="mt-1">
          <button
            onClick={() => setProTipOpen((prev) => !prev)}
            className={cn(
              'flex items-center gap-2 w-full text-left py-2 px-3 rounded-lg transition-colors duration-200 min-h-[44px]',
              proTipOpen
                ? 'bg-copper/10'
                : 'bg-transparent hover:bg-copper/5'
            )}
          >
            <Lightbulb className="h-4 w-4 text-copper shrink-0" />
            <span className="font-ui text-xs font-medium text-copper">Pro Tip</span>
            <ChevronDown
              className={cn(
                'h-3.5 w-3.5 text-copper ml-auto transition-transform duration-200',
                proTipOpen && 'rotate-180'
              )}
            />
          </button>
          <AnimatePresence initial={false}>
            {proTipOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: 'easeInOut' }}
                className="overflow-hidden"
              >
                <p className="font-body text-xs italic text-copper/80 leading-relaxed px-3 pb-2 pt-1">
                  {step.proTip}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
