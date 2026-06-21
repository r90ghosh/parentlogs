'use client'

import { useMemo, useState } from 'react'
import { Lock } from 'lucide-react'
import { useChecklists, useChecklist, useToggleChecklistItem, useResetChecklist } from '@/hooks/use-checklists'
import { useUser } from '@/components/user-provider'
import { useFamily } from '@/hooks/use-family'
import { getCurrentTimelineCategory, checklistOverlapsCategory } from '@tdc/shared/utils'
import { Panel } from '@/components/digest'
import { OpenChecklist } from '@/components/checklists/open-checklist'
import { MedicalDisclaimer } from '@/components/shared/medical-disclaimer'
import { usePageHeader } from '@/components/layouts/topbar-context'
import { cn } from '@/lib/utils'

export default function ChecklistsClient() {
  const { data: checklists, isLoading } = useChecklists()
  const { profile, family, activeBaby } = useUser()
  useFamily()

  const currentWeek = activeBaby?.current_week ?? family?.current_week ?? 1
  const isPremiumUser = profile.subscription_tier !== 'free'
  const source = activeBaby || family || null
  const currentCategory = source ? getCurrentTimelineCategory(source) : null

  const [selectedId, setSelectedId] = useState<string | null>(null)

  const { relevant, comingUp, completed } = useMemo(() => {
    const all = checklists ?? []
    const relevant: typeof all = []
    const comingUp: typeof all = []
    const completed: typeof all = []
    for (const cl of all) {
      const locked = cl.is_premium && !isPremiumUser
      if (cl.progress.percentage === 100) completed.push(cl)
      else if (
        !locked &&
        currentCategory &&
        checklistOverlapsCategory(cl.stage, cl.week_relevant, currentCategory)
      )
        relevant.push(cl)
      else comingUp.push(cl)
    }
    return { relevant, comingUp, completed }
  }, [checklists, currentCategory, isPremiumUser])

  const defaultId = relevant[0]?.checklist_id ?? completed[0]?.checklist_id ?? (checklists ?? [])[0]?.checklist_id ?? null
  const effectiveId = selectedId ?? defaultId

  const { data: detail } = useChecklist(effectiveId ?? '')
  const toggleItem = useToggleChecklistItem()
  const resetChecklist = useResetChecklist()

  const selectedMeta = (checklists ?? []).find((c) => c.checklist_id === effectiveId)

  usePageHeader({ title: 'Checklists', subtitle: `Week ${currentWeek}` }, [currentWeek])

  const Row = ({
    id,
    name,
    progressLabel,
    locked,
    done,
  }: {
    id: string
    name: string
    progressLabel?: string
    locked?: boolean
    done?: boolean
  }) => {
    const on = id === effectiveId
    return (
      <button
        type="button"
        onClick={() => !locked && setSelectedId(id)}
        disabled={locked}
        className={cn(
          '-mx-1.5 flex w-[calc(100%+12px)] items-center gap-2.5 rounded-[11px] px-3 py-2.5 text-left transition-colors',
          on ? 'bg-clay-soft' : 'hover:bg-card2',
          locked && 'opacity-60'
        )}
      >
        <span className={cn('min-w-0 flex-1 text-[13.5px] leading-[1.3]', on ? 'font-bold text-clay-ink' : 'font-semibold text-ink')}>
          {name}
        </span>
        {locked ? (
          <Lock className="h-3.5 w-3.5 flex-none text-mute" />
        ) : (
          <span className={cn('flex-none text-[11.5px] font-extrabold tracking-[0.2px]', done ? 'text-[--sage]' : 'text-clay-ink')}>
            {progressLabel}
          </span>
        )}
      </button>
    )
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 items-start gap-7 lg:grid-cols-[280px_minmax(0,1fr)]">
        <div className="h-80 animate-pulse rounded-[18px] bg-card2" />
        <div className="h-96 animate-pulse rounded-[20px] bg-card2" />
      </div>
    )
  }

  return (
    <>
      <MedicalDisclaimer className="mb-5" />

      <div className="grid grid-cols-1 items-start gap-7 lg:grid-cols-[280px_minmax(0,1fr)]">
        {/* Switcher */}
        <Panel className="p-[18px]">
          {relevant.length > 0 && (
            <>
              <div className="mb-2 text-[10.5px] font-bold uppercase tracking-[1.2px] text-clay-ink">For now · Week {currentWeek}</div>
              {relevant.map((c) => (
                <Row key={c.checklist_id} id={c.checklist_id} name={c.name} progressLabel={`${c.progress.completed}/${c.progress.total}`} />
              ))}
            </>
          )}
          {comingUp.length > 0 && (
            <>
              <div className="mb-2 mt-[18px] text-[10.5px] font-bold uppercase tracking-[1.2px] text-faint">Coming up</div>
              {comingUp.map((c) => {
                const locked = c.is_premium && !isPremiumUser
                return (
                  <Row
                    key={c.checklist_id}
                    id={c.checklist_id}
                    name={c.name}
                    locked={locked}
                    progressLabel={`${c.progress.completed}/${c.progress.total}`}
                  />
                )
              })}
            </>
          )}
          {completed.length > 0 && (
            <>
              <div className="mb-2 mt-[18px] text-[10.5px] font-bold uppercase tracking-[1.2px] text-faint">Completed</div>
              {completed.map((c) => (
                <Row key={c.checklist_id} id={c.checklist_id} name={c.name} done progressLabel={`${c.progress.completed}/${c.progress.total}`} />
              ))}
            </>
          )}
        </Panel>

        {/* Open checklist */}
        {detail && effectiveId ? (
          <OpenChecklist
            checklist={{ ...detail, week_relevant: selectedMeta?.week_relevant }}
            kicker={selectedMeta && relevant.some((r) => r.checklist_id === effectiveId) ? `For now · Week ${currentWeek}` : undefined}
            busy={toggleItem.isPending}
            onToggle={(itemId, completed) => toggleItem.mutate({ checklistId: effectiveId, itemId, completed })}
            onReset={() => resetChecklist.mutate(effectiveId)}
          />
        ) : (
          <Panel className="p-12 text-center">
            <p className="text-[15px] text-mute">Select a checklist to get started.</p>
          </Panel>
        )}
      </div>
    </>
  )
}
