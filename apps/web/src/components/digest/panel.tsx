import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface PanelProps {
  children: ReactNode
  className?: string
}

/** The digest `.card` container — flat panel, hairline border, subtle shadow. (§1.3) */
export function Panel({ children, className }: PanelProps) {
  return (
    <div className={cn('rounded-[18px] border border-line bg-card shadow-[var(--shadow-sm)]', className)}>
      {children}
    </div>
  )
}
