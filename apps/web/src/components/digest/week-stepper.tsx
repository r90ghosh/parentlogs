'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface WeekStepperProps {
  /** Center value, e.g. "Week 24" or "Today". */
  label: string
  /** Optional left-aligned uppercase context label, e.g. "Briefing". */
  title?: string
  onPrev?: () => void
  onNext?: () => void
  prevDisabled?: boolean
  nextDisabled?: boolean
  /** Click the label to open a "jump to" sheet. */
  onLabelClick?: () => void
  className?: string
}

/** Quiet `‹ Week N ›` control that replaces the long pill bar. (§1.3) */
export function WeekStepper({
  label,
  title,
  onPrev,
  onNext,
  prevDisabled,
  nextDisabled,
  onLabelClick,
  className,
}: WeekStepperProps) {
  const NavButton = ({ dir, onPress, disabled }: { dir: 'left' | 'right'; onPress?: () => void; disabled?: boolean }) => (
    <button
      type="button"
      onClick={onPress}
      disabled={disabled || !onPress}
      className={cn(
        'grid h-[30px] w-[30px] place-items-center rounded-full border border-line bg-card text-ink2 transition-opacity',
        'shadow-[var(--shadow-sm)] disabled:opacity-35 enabled:hover:opacity-70'
      )}
    >
      {dir === 'left' ? <ChevronLeft className="h-[15px] w-[15px]" /> : <ChevronRight className="h-[15px] w-[15px]" />}
    </button>
  )

  return (
    <div className={cn('flex items-center justify-between', className)}>
      {title ? (
        <span className="text-[13px] font-bold uppercase tracking-[0.3px] text-mute">{title}</span>
      ) : (
        <span />
      )}
      <div className="flex items-center gap-3">
        <NavButton dir="left" onPress={onPrev} disabled={prevDisabled} />
        <button
          type="button"
          onClick={onLabelClick}
          disabled={!onLabelClick}
          className="text-[14px] font-bold text-ink enabled:hover:text-clay-ink"
        >
          {label}
        </button>
        <NavButton dir="right" onPress={onNext} disabled={nextDisabled} />
      </div>
    </div>
  )
}
