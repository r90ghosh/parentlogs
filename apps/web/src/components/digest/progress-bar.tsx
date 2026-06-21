import { cn } from '@/lib/utils'

interface ProgressBarProps {
  /** 0..1 or 0..100. */
  value: number
  className?: string
}

/** Thin clay-fill progress bar. (desktop-*.html .bar) */
export function ProgressBar({ value, className }: ProgressBarProps) {
  const pct = Math.max(0, Math.min(1, value > 1 ? value / 100 : value))
  return (
    <div className={cn('h-1.5 overflow-hidden rounded-md bg-line', className)}>
      <div className="h-full rounded-md bg-clay transition-[width] duration-300" style={{ width: `${pct * 100}%` }} />
    </div>
  )
}
