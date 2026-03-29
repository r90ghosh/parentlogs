'use client'

import { ComponentProps } from 'react'
import { FamilyTask } from '@tdc/shared/types'
import { FocusCard, WeekCalendarCard, ProgressCard, StreakBanner } from '@/components/tasks'
import { Card3DTilt } from '@/components/ui/animations/Card3DTilt'
import { Reveal } from '@/components/ui/animations/Reveal'
import { Lock } from 'lucide-react'

interface TasksSidebarPanelProps {
  focusTask: FamilyTask | null
  weekDays: ComponentProps<typeof WeekCalendarCard>['days']
  progressPercent: number
  thisWeekDone: number
  thisWeekActive: number
  catchUpQueue: number
  isPremium: boolean
  onComplete: (taskId: string) => void
  onSnooze: (taskId: string) => void
}

export function TasksSidebarPanel({
  focusTask,
  weekDays,
  progressPercent,
  thisWeekDone,
  thisWeekActive,
  catchUpQueue,
  isPremium,
  onComplete,
  onSnooze,
}: TasksSidebarPanelProps) {
  return (
    <div className="space-y-5">
      {/* Focus card */}
      <Reveal variant="card" delay={100}>
        <Card3DTilt maxTilt={3} gloss>
          <FocusCard
            task={focusTask}
            onDone={() => focusTask && onComplete(focusTask.id)}
            onSnooze={() => {
              if (!isPremium || !focusTask) return
              onSnooze(focusTask.id)
            }}
          />
        </Card3DTilt>
      </Reveal>

      {/* Snooze premium badge */}
      {!isPremium && (
        <Reveal delay={150}>
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[--surface] border border-[--border]">
            <Lock className="h-3.5 w-3.5 text-[--muted]" />
            <span className="text-xs text-[--muted] font-body">Snooze & reschedule are premium features</span>
          </div>
        </Reveal>
      )}

      {/* Week calendar */}
      <Reveal variant="card" delay={200}>
        <Card3DTilt maxTilt={3} gloss>
          <WeekCalendarCard days={weekDays} />
        </Card3DTilt>
      </Reveal>

      {/* Progress */}
      <Reveal variant="card" delay={300}>
        <Card3DTilt maxTilt={3} gloss>
          <ProgressCard
            percentComplete={progressPercent}
            done={thisWeekDone}
            active={thisWeekActive}
            toTriage={catchUpQueue}
          />
        </Card3DTilt>
      </Reveal>

      {/* Streak banner */}
      <Reveal variant="card" delay={400}>
        <Card3DTilt maxTilt={3} gloss>
          <StreakBanner days={3} />
        </Card3DTilt>
      </Reveal>
    </div>
  )
}
