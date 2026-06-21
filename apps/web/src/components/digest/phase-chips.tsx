'use client'

import { cn } from '@/lib/utils'

export interface PhaseChip {
  key: string
  label: string
}

interface PhaseChipsProps {
  chips: PhaseChip[]
  activeKey?: string | null
  onSelect: (key: string) => void
  className?: string
}

/** Horizontal chip row — the calm replacement for the long week-pill bar. (§2.2) */
export function PhaseChips({ chips, activeKey, onSelect, className }: PhaseChipsProps) {
  if (!chips.length) return null
  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {chips.map((c) => {
        const on = c.key === activeKey
        return (
          <button
            key={c.key}
            type="button"
            onClick={() => onSelect(c.key)}
            className={cn(
              'inline-flex items-center gap-[7px] rounded-full border px-[15px] py-2 text-[13px] font-bold transition-colors',
              on ? 'border-clay bg-clay text-white' : 'border-line bg-card text-ink2 hover:border-faint'
            )}
          >
            {c.label}
          </button>
        )
      })}
    </div>
  )
}
