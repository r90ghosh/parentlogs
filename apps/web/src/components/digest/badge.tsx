import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type BadgeTone = 'clay' | 'gold' | 'sage' | 'neutral'

const toneClasses: Record<BadgeTone, string> = {
  clay: 'bg-clay-soft text-clay-ink',
  gold: 'bg-[--gold]/15 text-[--gold]',
  sage: 'bg-[--sage]/15 text-[--sage]',
  neutral: 'bg-line2 text-mute',
}

interface BadgeProps {
  children: ReactNode
  tone?: BadgeTone
  className?: string
}

/** Small uppercase pill badge. (desktop-*.html .badge) */
export function Badge({ children, tone = 'clay', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-[9px] py-[3px] text-[10.5px] font-extrabold uppercase tracking-[0.5px]',
        toneClasses[tone],
        className
      )}
    >
      {children}
    </span>
  )
}
