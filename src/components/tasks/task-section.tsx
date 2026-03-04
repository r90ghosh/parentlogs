'use client'

import { ReactNode, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TaskSectionProps {
  icon: string
  title: string
  count: string | number
  subtitle?: string
  actions?: ReactNode
  isCatchUp?: boolean
  collapsible?: boolean
  defaultExpanded?: boolean
  children: ReactNode
}

export function TaskSection({
  icon,
  title,
  count,
  subtitle,
  actions,
  isCatchUp = false,
  collapsible = false,
  defaultExpanded = true,
  children,
}: TaskSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)

  return (
    <div
      className={cn(
        'rounded-2xl overflow-hidden',
        'bg-[--surface]',
        'border',
        isCatchUp ? 'border-gold/30' : 'border-[--border]'
      )}
    >
      {/* Section header */}
      <div
        className={cn(
          'flex items-center justify-between px-5 py-4',
          'border-b border-[--border]',
          isCatchUp && 'bg-gradient-to-r from-gold-dim to-copper-dim',
          collapsible && 'cursor-pointer'
        )}
        onClick={collapsible ? () => setIsExpanded(!isExpanded) : undefined}
      >
        <div>
          <div className="flex items-center gap-2.5">
            <span className="text-lg">{icon}</span>
            <h3 className="text-[15px] font-ui font-semibold text-[--cream]">{title}</h3>
            <span className="text-xs text-[--muted] bg-[--card] px-2 py-0.5 rounded-[10px]">
              {typeof count === 'number' ? `${count} tasks` : count}
            </span>
            {collapsible && (
              <ChevronDown
                className={cn(
                  'w-4 h-4 text-[--muted] transition-transform',
                  !isExpanded && '-rotate-90'
                )}
              />
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-[--muted] ml-7 mt-1 font-body">{subtitle}</p>
          )}
        </div>

        {actions && (
          <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
            {actions}
          </div>
        )}
      </div>

      {/* Task list */}
      {isExpanded && (
        <div className="p-2">
          {children}
        </div>
      )}
    </div>
  )
}

// Section action button component
interface SectionActionProps {
  children: ReactNode
  onClick?: () => void
  variant?: 'default' | 'primary' | 'success'
}

export function SectionAction({ children, onClick, variant = 'default' }: SectionActionProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'text-xs px-3 py-1.5 rounded-md transition-all font-ui',
        variant === 'default' && 'bg-[--card] text-[--muted] hover:bg-[--card-hover] hover:text-[--cream]',
        variant === 'primary' && 'bg-copper-dim text-copper hover:bg-copper-glow',
        variant === 'success' && 'bg-[--sage-dim] text-sage hover:bg-sage/25'
      )}
    >
      {children}
    </button>
  )
}
