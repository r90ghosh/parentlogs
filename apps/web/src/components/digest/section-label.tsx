import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface SectionLabelProps {
  children: ReactNode
  /** Right-aligned secondary link/text, e.g. "View all →". */
  more?: ReactNode
  onMoreClick?: () => void
  className?: string
}

/** Small uppercase section label, with an optional right-aligned "more" link. (§1.3) */
export function SectionLabel({ children, more, onMoreClick, className }: SectionLabelProps) {
  return (
    <div className={cn('mt-7 mb-3 flex items-center justify-between first:mt-0', className)}>
      <span className="text-[11px] font-bold uppercase tracking-[1.5px] text-faint">{children}</span>
      {more != null &&
        (onMoreClick ? (
          <button
            type="button"
            onClick={onMoreClick}
            className="text-[12.5px] font-bold text-mute transition-colors hover:text-clay-ink"
          >
            {more}
          </button>
        ) : (
          <span className="text-[12.5px] font-bold text-mute">{more}</span>
        ))}
    </div>
  )
}
