'use client'

import { cn } from '@/lib/utils'
import Link from 'next/link'

interface QuickAction {
  icon: string
  label: string
  href: string
  color: 'teal' | 'purple' | 'blue' | 'amber'
}

const actions: QuickAction[] = [
  { icon: '📝', label: 'Add Task', href: '/tasks/new', color: 'teal' },
  { icon: '📊', label: 'Log Data', href: '/tracker/log', color: 'purple' },
  { icon: '📅', label: 'Add Event', href: '/calendar', color: 'blue' },
  { icon: '💰', label: 'Log Expense', href: '/budget', color: 'amber' },
]

const colorStyles: Record<string, string> = {
  teal: 'bg-sage-dim',
  purple: 'bg-copper-dim',
  blue: 'bg-sky-dim',
  amber: 'bg-gold-dim',
}

export function QuickActionsBar() {
  return (
    <div
      className={cn(
        'rounded-[20px] p-5',
        'bg-[--card]',
        'border border-[--border]',
        'shadow-card'
      )}
    >
      {/* Title */}
      <div className="text-sm font-semibold font-ui text-[--muted] mb-4">
        ⚡ Quick Actions
      </div>

      {/* Actions grid */}
      <div className="grid grid-cols-4 gap-3">
        {actions.map((action) => (
          <Link
            key={action.label}
            href={action.href}
            className={cn(
              'flex flex-col items-center gap-2.5 py-5 px-4 rounded-[14px]',
              'bg-[--surface] border border-[--border]',
              'hover:bg-[--card-hover] hover:border-[--border-hover] hover:-translate-y-0.5',
              'transition-all cursor-pointer'
            )}
          >
            <div
              className={cn(
                'w-12 h-12 rounded-[14px] flex items-center justify-center text-2xl',
                colorStyles[action.color]
              )}
            >
              {action.icon}
            </div>
            <span className="text-[13px] font-medium font-ui text-[--muted]">
              {action.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
