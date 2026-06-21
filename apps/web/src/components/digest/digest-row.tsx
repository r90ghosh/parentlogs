'use client'

import { useState } from 'react'
import { ChevronDown, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface DigestCategory {
  label: string
  /** CSS color (use a scoped var, e.g. "var(--dot-baby)"). */
  color: string
}

interface DigestRowProps {
  category: DigestCategory
  headline: string
  detail?: string | null
  /** Show the left check-circle (only DO items in Briefing). */
  checkable?: boolean
  checked?: boolean
  onToggleCheck?: () => void
  defaultOpen?: boolean
  className?: string
}

/**
 * Core digest list row: category dot + uppercase label, one-liner headline,
 * tap-to-expand detail, optional left check-circle. Mirrors the mobile
 * components/digest/DigestRow.tsx. (§1.3)
 */
export function DigestRow({
  category,
  headline,
  detail,
  checkable,
  checked,
  onToggleCheck,
  defaultOpen,
  className,
}: DigestRowProps) {
  const hasDetail = !!detail && detail.trim().length > 0
  const [open, setOpen] = useState(!!defaultOpen)

  const toggle = () => {
    if (!hasDetail) {
      if (checkable) onToggleCheck?.()
      return
    }
    setOpen((o) => !o)
  }

  return (
    <div
      onClick={toggle}
      className={cn(
        'flex cursor-pointer items-start gap-3.5 border-b border-line2 px-6 py-4 transition-colors last:border-b-0 hover:bg-card-hover',
        className
      )}
    >
      {checkable && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onToggleCheck?.()
          }}
          aria-pressed={checked}
          className={cn(
            'mt-0.5 grid h-[22px] w-[22px] flex-none place-items-center rounded-full border-2 transition-colors',
            checked ? 'border-clay bg-clay' : 'border-line'
          )}
        >
          {checked && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
        </button>
      )}

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: category.color }} />
          <span className="text-[11px] font-bold uppercase tracking-[1.2px]" style={{ color: category.color }}>
            {category.label}
          </span>
        </div>
        <p
          className={cn(
            'mt-[7px] text-[16px] font-semibold leading-[23px] tracking-[-0.1px]',
            checked ? 'text-mute line-through decoration-faint' : 'text-ink'
          )}
        >
          {headline}
        </p>
        {hasDetail && (
          <div className={cn('grid transition-[grid-template-rows] duration-200', open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]')}>
            <div className="overflow-hidden">
              <p className="pt-2 text-[14.5px] leading-[22px] text-ink2">{detail}</p>
            </div>
          </div>
        )}
      </div>

      {hasDetail && (
        <ChevronDown
          className={cn('mt-1.5 h-[18px] w-[18px] flex-none text-faint transition-transform', open && 'rotate-180')}
        />
      )}
    </div>
  )
}
