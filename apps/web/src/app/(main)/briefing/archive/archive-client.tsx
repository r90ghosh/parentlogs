'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Lock } from 'lucide-react'
import { useBriefings } from '@/hooks/use-briefings'
import { useUser } from '@/components/user-provider'
import { useFamily } from '@/hooks/use-family'
import { BriefingTemplate, FamilyStage } from '@tdc/shared/types'
import { isPregnancyStage, getTrimesterLabel, getTrimesterFromWeek } from '@tdc/shared/utils'
import { Panel, Badge, ScopeSwitch } from '@/components/digest'
import { usePageHeader } from '@/components/layouts/topbar-context'
import { cn } from '@/lib/utils'

const TAB_KEYS = ['first-trimester', 'second-trimester', 'third-trimester', 'post-birth'] as const
const TAB_LABELS: Record<string, string> = {
  'first-trimester': 'T1',
  'second-trimester': 'T2',
  'third-trimester': 'T3',
  'post-birth': 'Post-birth',
}

export default function ArchiveClient() {
  const { data: briefings, isLoading } = useBriefings()
  const { activeBaby } = useUser()
  const { data: family } = useFamily()

  const currentWeek = activeBaby?.current_week ?? family?.current_week ?? 0
  const currentStage = activeBaby?.stage || family?.stage || 'first-trimester'

  usePageHeader({ title: 'Briefing archive', subtitle: 'Your complete pregnancy & parenting journey' }, [])

  const defaultTab = useMemo(() => {
    if (!isPregnancyStage(currentStage)) return 'post-birth'
    if (currentStage === 'first-trimester') return 'first-trimester'
    if (currentStage === 'second-trimester') return 'second-trimester'
    if (currentStage === 'third-trimester') return 'third-trimester'
    return getTrimesterFromWeek(currentWeek)
  }, [currentStage, currentWeek])

  const [activeTab, setActiveTab] = useState<string>(defaultTab)

  const grouped = useMemo(() => {
    const groups: Record<string, BriefingTemplate[]> = {
      'first-trimester': [], 'second-trimester': [], 'third-trimester': [], 'post-birth': [],
    }
    ;(briefings ?? []).forEach((b: BriefingTemplate) => {
      if (b.stage === 'post-birth') groups['post-birth'].push(b)
      else if (isPregnancyStage(b.stage as FamilyStage)) {
        if (b.stage === 'first-trimester' || (b.stage === 'pregnancy' && b.week <= 13)) groups['first-trimester'].push(b)
        else if (b.stage === 'second-trimester' || (b.stage === 'pregnancy' && b.week <= 27)) groups['second-trimester'].push(b)
        else groups['third-trimester'].push(b)
      }
    })
    Object.keys(groups).forEach((k) => groups[k].sort((a, b) => a.week - b.week))
    return groups
  }, [briefings])

  const activeIsCurrentStage =
    (activeTab === 'post-birth' && currentStage === 'post-birth') || activeTab === defaultTab
  const list = grouped[activeTab] ?? []

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-44 animate-pulse rounded-[18px] bg-card2" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <p className="text-[13px] font-semibold text-mute">
        You&apos;re currently at{' '}
        <span className="text-clay-ink">
          {getTrimesterLabel(currentStage)} Week {currentWeek}
        </span>
        . Only your current week shows full content; others show a preview.
      </p>

      <ScopeSwitch
        options={TAB_KEYS.map((k) => ({ key: k, label: `${TAB_LABELS[k]} (${grouped[k].length})` }))}
        value={activeTab}
        onChange={setActiveTab}
      />

      {list.length === 0 ? (
        <Panel className="p-12 text-center">
          <p className="text-[15px] text-mute">No briefings available for this stage.</p>
        </Panel>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {list.map((b) => {
            const isCurrent = activeIsCurrentStage && b.week === currentWeek
            const isFuture = activeIsCurrentStage ? b.week > currentWeek : true
            const isLocked = !isCurrent
            const preview = isCurrent ? b.baby_update : b.baby_update?.slice(0, Math.floor((b.baby_update?.length || 0) * 0.4))
            return (
              <Link key={b.briefing_id} href={`/briefing?week=${b.week}&stage=${b.stage}`}>
                <Panel
                  className={cn(
                    'h-full p-5 transition-colors hover:bg-card-hover',
                    isCurrent && 'border-l-[3px] border-l-clay'
                  )}
                >
                  <div className="flex items-center gap-2">
                    <Badge tone={isCurrent ? 'clay' : 'neutral'}>Week {b.week}</Badge>
                    {isCurrent && <Badge tone="sage">Current</Badge>}
                    {isLocked && <Lock className="h-3 w-3 text-faint" />}
                  </div>
                  <h3 className={cn('mt-2.5 text-[17px] font-bold', isLocked ? 'text-ink2' : 'text-ink')}>{b.title}</h3>
                  <p className={cn('mt-2 line-clamp-2 text-[13.5px] leading-[1.5]', isLocked ? 'text-mute' : 'text-ink2')}>
                    {preview}
                  </p>
                  {b.dad_focus?.length > 0 && (
                    <div className="mt-3 border-t border-line2 pt-2.5 text-[12px] font-semibold text-mute">
                      {b.dad_focus.length} focus {b.dad_focus.length === 1 ? 'area' : 'areas'} for dad
                    </div>
                  )}
                  {isLocked && (
                    <div className="mt-2 flex items-center gap-1.5 text-[12px] text-faint">
                      <Lock className="h-3 w-3" />
                      {isFuture ? `Unlocks at Week ${b.week}` : 'View full briefing'}
                    </div>
                  )}
                </Panel>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
