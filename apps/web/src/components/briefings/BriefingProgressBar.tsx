import { cn } from '@/lib/utils'

interface BriefingProgressBarProps {
  currentWeek: number
  totalWeeks?: number
  className?: string
}

export function BriefingProgressBar({
  currentWeek,
  totalWeeks = 40,
  className,
}: BriefingProgressBarProps) {
  const progress = Math.min(100, (currentWeek / totalWeeks) * 100)
  const percentComplete = Math.round(progress)

  return (
    <div className={cn('mb-10', className)}>
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <span className="text-sm font-ui text-[--muted]">Pregnancy Progress</span>
        <span className="text-sm font-semibold font-ui text-copper">
          Week {currentWeek} of {totalWeeks} ({percentComplete}%)
        </span>
      </div>

      {/* Progress Bar */}
      <div className="relative h-1.5 bg-[--dim] rounded-full">
        <div
          className="absolute left-0 top-0 h-full bg-gradient-to-r from-copper to-gold rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Markers */}
      <div className="flex justify-between mt-2 text-[11px] font-ui text-[--dim]">
        <span>Conception</span>
        <span className="hidden sm:inline">1st Trimester</span>
        <span className="hidden sm:inline">2nd Trimester</span>
        <span className="hidden sm:inline">3rd Trimester</span>
        <span className="sm:hidden">1st</span>
        <span className="sm:hidden">2nd</span>
        <span className="sm:hidden">3rd</span>
        <span>Due Date</span>
      </div>
    </div>
  )
}
