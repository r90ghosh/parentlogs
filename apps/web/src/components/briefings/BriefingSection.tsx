import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

export type SectionType = 'baby' | 'mom' | 'dad' | 'relationship' | 'coming'

interface BriefingSectionProps {
  type: SectionType
  title: string
  icon: string
  children: ReactNode
  className?: string
}

const sectionStyles: Record<SectionType, {
  borderClass: string
  iconBgClass: string
  titleClass: string
}> = {
  baby: {
    borderClass: 'before:bg-gradient-to-b before:from-[--sage] before:to-[--sky]',
    iconBgClass: 'bg-[--sage-dim]',
    titleClass: 'text-[--sage]',
  },
  mom: {
    borderClass: 'before:bg-gradient-to-b before:from-[--rose] before:to-[--coral]',
    iconBgClass: 'bg-[--rose-dim]',
    titleClass: 'text-[--rose]',
  },
  dad: {
    borderClass: 'before:bg-gradient-to-b before:from-[--copper] before:to-[--gold]',
    iconBgClass: 'bg-copper-dim',
    titleClass: 'text-copper',
  },
  relationship: {
    borderClass: 'before:bg-gradient-to-b before:from-[--rose] before:to-[--sky]',
    iconBgClass: 'bg-[--rose-dim]',
    titleClass: 'text-[--rose]',
  },
  coming: {
    borderClass: 'before:bg-gradient-to-b before:from-[--sky] before:to-[--sage]',
    iconBgClass: 'bg-[--sky-dim]',
    titleClass: 'text-[--sky]',
  },
}

export function BriefingSection({
  type,
  title,
  icon,
  children,
  className,
}: BriefingSectionProps) {
  const styles = sectionStyles[type]

  return (
    <div
      className={cn(
        'relative bg-[--card] border border-[--border] rounded-2xl p-7 overflow-hidden shadow-card',
        'before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1',
        styles.borderClass,
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div
          className={cn(
            'w-10 h-10 rounded-xl flex items-center justify-center text-xl',
            styles.iconBgClass
          )}
        >
          {icon}
        </div>
        <h2 className={cn('text-lg font-display font-bold', styles.titleClass)}>
          {title}
        </h2>
      </div>

      {/* Content */}
      <div className="text-[--muted] font-body text-[15px] leading-relaxed">
        {children}
      </div>
    </div>
  )
}

// Highlight box for special callouts within sections
interface HighlightBoxProps {
  icon?: string
  children: ReactNode
  color?: 'teal' | 'amber' | 'pink'
}

export function HighlightBox({ icon = '💡', children, color = 'teal' }: HighlightBoxProps) {
  const colorStyles = {
    teal: 'bg-[--sage-dim] border-[--sage]/20 text-[--sage]',
    amber: 'bg-copper-dim border-copper/20 text-copper',
    pink: 'bg-[--rose-dim] border-[--rose]/20 text-[--rose]',
  }

  return (
    <div className={cn('rounded-xl border p-4 mt-4', colorStyles[color])}>
      <div className="flex items-start gap-2.5 text-sm font-body">
        <span className="text-lg flex-shrink-0">{icon}</span>
        <div>{children}</div>
      </div>
    </div>
  )
}
