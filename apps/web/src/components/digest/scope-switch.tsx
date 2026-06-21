'use client'

import { cn } from '@/lib/utils'

export interface ScopeOption {
  key: string
  label: string
  badge?: number
  badgeTone?: 'accent' | 'amber'
}

interface ScopeSwitchProps {
  options: ScopeOption[]
  value: string
  onChange: (key: string) => void
  className?: string
  /** Stretch each segment to fill the bar (mobile-style). Default false (inline). */
  fill?: boolean
}

/** Segmented control (Now · Upcoming · Done). Generic — reused by other pages. (§2.2) */
export function ScopeSwitch({ options, value, onChange, className, fill }: ScopeSwitchProps) {
  return (
    <div className={cn('inline-flex rounded-xl bg-line2 p-[3px]', fill && 'flex w-full', className)}>
      {options.map((opt) => {
        const active = opt.key === value
        return (
          <button
            key={opt.key}
            type="button"
            onClick={() => onChange(opt.key)}
            className={cn(
              'inline-flex items-center justify-center gap-1.5 rounded-[9px] px-[18px] py-[9px] text-[13.5px] font-bold transition-colors',
              fill && 'flex-1',
              active ? 'bg-card text-ink shadow-[var(--shadow-sm)]' : 'text-mute hover:text-ink2'
            )}
          >
            {opt.label}
            {opt.badge != null && opt.badge > 0 && (
              <span
                className={cn(
                  'min-w-[17px] rounded-full px-1.5 py-px text-center text-[10px] font-extrabold text-white',
                  opt.badgeTone === 'amber' ? 'bg-[--amber]' : 'bg-clay'
                )}
              >
                {opt.badge}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
