'use client'

import { Check, RotateCcw } from 'lucide-react'
import { useUser } from '@/components/user-provider'
import { useFamilyMembers } from '@/hooks/use-family'
import { Panel, Badge } from '@/components/digest'
import { cn } from '@/lib/utils'

export interface ChecklistItem {
  item_id: string
  item: string
  details?: string
  required?: boolean
  bring_or_do?: 'bring' | 'do'
  category?: string
  completed: boolean
  checked_by?: string | null
}

export interface OpenChecklistData {
  name: string
  description?: string
  week_relevant?: string
  progress: { completed: number; total: number; percentage: number }
  items: ChecklistItem[]
}

function weeksLabel(week_relevant?: string) {
  if (!week_relevant) return null
  return week_relevant.includes('-') ? `Weeks ${week_relevant}` : `Week ${week_relevant}`
}

export function OpenChecklist({
  checklist,
  kicker,
  onToggle,
  onReset,
  busy,
}: {
  checklist: OpenChecklistData
  kicker?: string
  onToggle: (itemId: string, completed: boolean) => void
  onReset?: () => void
  busy?: boolean
}) {
  const { user } = useUser()
  const { data: members } = useFamilyMembers()

  const categories = Array.from(new Set(checklist.items.map((i) => i.category || 'General')))
  const grouped = categories.map((cat) => ({
    cat,
    items: checklist.items.filter((i) => (i.category || 'General') === cat),
  }))

  const whoChecked = (item: ChecklistItem) => {
    if (!item.completed || !item.checked_by) return null
    if (item.checked_by === user.id) return 'You'
    const m = members?.find((mm) => mm.id === item.checked_by)
    return m ? m.full_name?.split(' ')[0] : null
  }

  const metaBits = [
    `${checklist.progress.completed} of ${checklist.progress.total} done`,
    weeksLabel(checklist.week_relevant),
    categories.length ? categories.slice(0, 3).join(', ').toLowerCase() : null,
  ].filter(Boolean)

  return (
    <div className="min-w-0">
      <div className="rounded-[20px] border border-line border-l-[3px] border-l-clay bg-card p-[26px] shadow-[var(--shadow)]">
        <div className="flex items-start justify-between gap-3">
          {kicker && <div className="text-[11px] font-extrabold uppercase tracking-[1.5px] text-clay-ink">{kicker}</div>}
          {onReset && (
            <button onClick={onReset} className="text-faint transition-colors hover:text-clay-ink" aria-label="Reset checklist">
              <RotateCcw className="h-[18px] w-[18px]" />
            </button>
          )}
        </div>
        <h2 className="mt-[11px] text-[27px] font-extrabold leading-[1.18] tracking-[-0.5px] text-ink">{checklist.name}</h2>
        <div className="mt-3 text-[13px] font-semibold text-mute">{metaBits.join(' · ')}</div>
        <div className="mt-4 h-1.5 overflow-hidden rounded-md bg-line">
          <div className="h-full rounded-md bg-clay" style={{ width: `${checklist.progress.percentage}%` }} />
        </div>
      </div>

      {grouped.map((g) => (
        <div key={g.cat}>
          <div className="mb-3 mt-7 text-[11px] font-bold uppercase tracking-[1.5px] text-faint">{g.cat}</div>
          <Panel>
            {g.items.map((item) => {
              const who = whoChecked(item)
              return (
                <button
                  key={item.item_id}
                  type="button"
                  onClick={() => onToggle(item.item_id, !item.completed)}
                  disabled={busy}
                  className="flex w-full items-center gap-3.5 border-b border-line2 px-[18px] py-[15px] text-left transition-colors last:border-b-0 hover:bg-card-hover"
                >
                  <span
                    className={cn(
                      'grid h-[22px] w-[22px] flex-none place-items-center rounded-full border-2 transition-colors',
                      item.completed ? 'border-[--sage] bg-[--sage]' : 'border-line'
                    )}
                  >
                    {item.completed && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className={cn('block text-[15.5px] font-semibold', item.completed ? 'text-mute line-through decoration-faint' : 'text-ink')}>
                      {item.item}
                    </span>
                    {item.details && <span className="mt-0.5 block text-[12.5px] text-mute">{item.details}</span>}
                    {(item.bring_or_do === 'bring' || item.required === false) && (
                      <span className="mt-1.5 flex items-center gap-1.5">
                        {item.bring_or_do === 'bring' && <Badge tone="sage">Pack</Badge>}
                        {item.required === false && <Badge tone="neutral">Optional</Badge>}
                      </span>
                    )}
                  </span>
                  {who && (
                    <span className="flex-none text-[11.5px] font-bold uppercase tracking-[0.4px] text-mute">{who}</span>
                  )}
                </button>
              )
            })}
          </Panel>
        </div>
      ))}
    </div>
  )
}
