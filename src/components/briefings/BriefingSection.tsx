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
    borderClass: 'before:bg-gradient-to-b before:from-teal-500 before:to-cyan-500',
    iconBgClass: 'bg-teal-500/15',
    titleClass: 'text-teal-400',
  },
  mom: {
    borderClass: 'before:bg-gradient-to-b before:from-pink-500 before:to-rose-500',
    iconBgClass: 'bg-pink-500/15',
    titleClass: 'text-pink-400',
  },
  dad: {
    borderClass: 'before:bg-gradient-to-b before:from-amber-500 before:to-orange-500',
    iconBgClass: 'bg-amber-500/15',
    titleClass: 'text-amber-400',
  },
  relationship: {
    borderClass: 'before:bg-gradient-to-b before:from-violet-500 before:to-indigo-500',
    iconBgClass: 'bg-violet-500/15',
    titleClass: 'text-violet-400',
  },
  coming: {
    borderClass: 'before:bg-gradient-to-b before:from-indigo-500 before:to-blue-500',
    iconBgClass: 'bg-indigo-500/15',
    titleClass: 'text-indigo-400',
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
        'relative bg-gradient-to-br from-zinc-800/80 to-zinc-900/80 border border-white/[0.08] rounded-2xl p-7 overflow-hidden',
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
        <h2 className={cn('text-lg font-bold', styles.titleClass)}>
          {title}
        </h2>
      </div>

      {/* Content */}
      <div className="text-zinc-400 text-[15px] leading-relaxed">
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
    teal: 'bg-teal-500/10 border-teal-500/20 text-teal-400',
    amber: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
    pink: 'bg-pink-500/10 border-pink-500/20 text-pink-400',
  }

  return (
    <div className={cn('rounded-xl border p-4 mt-4', colorStyles[color])}>
      <div className="flex items-start gap-2.5 text-sm">
        <span className="text-lg flex-shrink-0">{icon}</span>
        <div>{children}</div>
      </div>
    </div>
  )
}
