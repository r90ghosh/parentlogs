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
        'bg-gradient-to-br from-zinc-800 to-zinc-900',
        'border',
        isCatchUp ? 'border-indigo-500/30' : 'border-white/[0.06]'
      )}
    >
      {/* Section header */}
      <div
        className={cn(
          'flex items-center justify-between px-5 py-4',
          'border-b border-white/[0.06]',
          isCatchUp && 'bg-gradient-to-r from-indigo-500/10 to-purple-500/5',
          collapsible && 'cursor-pointer'
        )}
        onClick={collapsible ? () => setIsExpanded(!isExpanded) : undefined}
      >
        <div>
          <div className="flex items-center gap-2.5">
            <span className="text-lg">{icon}</span>
            <h3 className="text-[15px] font-semibold text-white">{title}</h3>
            <span className="text-xs text-zinc-500 bg-white/[0.06] px-2 py-0.5 rounded-[10px]">
              {typeof count === 'number' ? `${count} tasks` : count}
            </span>
            {collapsible && (
              <ChevronDown
                className={cn(
                  'w-4 h-4 text-zinc-500 transition-transform',
                  !isExpanded && '-rotate-90'
                )}
              />
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-zinc-500 ml-7 mt-1">{subtitle}</p>
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
        'text-xs px-3 py-1.5 rounded-md transition-all',
        variant === 'default' && 'bg-white/[0.04] text-zinc-500 hover:bg-white/[0.08] hover:text-zinc-400',
        variant === 'primary' && 'bg-indigo-500/15 text-indigo-400 hover:bg-indigo-500/25',
        variant === 'success' && 'bg-green-500/15 text-green-400 hover:bg-green-500/25'
      )}
    >
      {children}
    </button>
  )
}
