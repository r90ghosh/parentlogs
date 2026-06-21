'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { isToday, isTomorrow, isPast, endOfWeek, format } from 'date-fns'
import { Check, ChevronRight, Plus, Clock } from 'lucide-react'
import type { FamilyTask, TaskAssignee } from '@tdc/shared/types'
import { useUser } from '@/components/user-provider'
import { useTasks, useCompleteTask, useBacklogCount } from '@/hooks/use-tasks'
import { Panel, ScopeSwitch } from '@/components/digest'
import { usePageHeader } from '@/components/layouts/topbar-context'
import { cn } from '@/lib/utils'

const assigneeMeta: Record<TaskAssignee, { label: string; color: string }> = {
  dad: { label: 'Dad', color: 'var(--sky)' },
  mom: { label: 'Mom', color: 'var(--rose)' },
  both: { label: 'Both', color: 'var(--gold)' },
  either: { label: 'Either', color: 'var(--muted)' },
}

type AssigneeFilter = 'all' | 'mine' | 'partner'

function dueMeta(dueStr: string): { label: string; cls: string } {
  const d = new Date(dueStr)
  if (isToday(d)) return { label: 'Today', cls: 'text-clay-ink' }
  if (isPast(d)) return { label: 'Catch up', cls: 'text-[--amber]' }
  if (isTomorrow(d)) return { label: 'Tomorrow', cls: 'text-mute' }
  return { label: format(d, 'MMM d'), cls: 'text-mute' }
}

function TaskRow({
  task,
  onComplete,
  busy,
  done,
}: {
  task: FamilyTask
  onComplete: () => void
  busy?: boolean
  done?: boolean
}) {
  const a = assigneeMeta[task.assigned_to] ?? assigneeMeta.either
  const due = dueMeta(task.due_date)
  return (
    <Link
      href={`/tasks/${task.id}`}
      className="flex items-center gap-3.5 border-b border-line2 px-[18px] py-[15px] transition-colors last:border-b-0 hover:bg-card-hover"
    >
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault()
          if (!done) onComplete()
        }}
        disabled={busy || done}
        aria-label={`Complete ${task.title}`}
        className={cn(
          'group grid h-[22px] w-[22px] flex-none place-items-center rounded-full border-2 transition-colors',
          done ? 'border-[--sage] bg-[--sage]' : 'border-line hover:border-clay'
        )}
      >
        <Check
          className={cn('h-3 w-3 transition-colors', done ? 'text-white' : 'text-transparent group-hover:text-clay')}
          strokeWidth={3}
        />
      </button>

      <div className="min-w-0 flex-1">
        <div className={cn('truncate text-[15.5px] font-semibold', done ? 'text-mute line-through decoration-faint' : 'text-ink')}>
          {task.title}
        </div>
        <div className="mt-[5px] flex items-center gap-2">
          <span
            className="inline-flex items-center gap-1.5 text-[11.5px] font-bold uppercase tracking-[0.4px]"
            style={{ color: a.color }}
          >
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: a.color }} />
            {a.label}
          </span>
          {task.category && (
            <>
              <span className="text-faint">·</span>
              <span className="text-[12.5px] font-medium capitalize text-mute">{task.category}</span>
            </>
          )}
        </div>
      </div>

      {done ? (
        task.completed_at && <span className="text-[12.5px] font-semibold text-mute">{format(new Date(task.completed_at), 'MMM d')}</span>
      ) : (
        <span className={cn('text-[12.5px] font-bold', due.cls)}>{due.label}</span>
      )}
      <ChevronRight className="h-[18px] w-[18px] flex-none text-faint" />
    </Link>
  )
}

function Section({ label, count, amber, children }: { label: string; count: number; amber?: boolean; children: React.ReactNode }) {
  return (
    <>
      <div className={cn('mb-3 mt-7 text-[11px] font-bold uppercase tracking-[1.5px] first:mt-0', amber ? 'text-[--amber]' : 'text-faint')}>
        {label} · {count}
      </div>
      <Panel>{children}</Panel>
    </>
  )
}

export default function TasksClient() {
  const { profile } = useUser()
  const { data: activeTasks } = useTasks({ status: 'pending' })
  const { data: doneTasks } = useTasks({ status: 'completed', limit: 50 })
  const { data: backlogCount } = useBacklogCount()
  const completeTask = useCompleteTask()

  const [scope, setScope] = useState<'now' | 'upcoming' | 'done'>('now')
  const [assignee, setAssignee] = useState<AssigneeFilter>('all')

  const myRole = profile.role ?? 'dad'
  const partnerRole = myRole === 'dad' ? 'mom' : 'dad'

  const matchAssignee = (t: FamilyTask) => {
    if (assignee === 'all') return true
    if (assignee === 'mine') return t.assigned_to === myRole || t.assigned_to === 'both' || t.assigned_to === 'either'
    return t.assigned_to === partnerRole || t.assigned_to === 'both'
  }

  const { today, thisWeek, catchUp, upcomingByMonth } = useMemo(() => {
    const active = (activeTasks ?? []).filter(matchAssignee)
    const weekEnd = endOfWeek(new Date())
    const today: FamilyTask[] = []
    const thisWeek: FamilyTask[] = []
    const catchUp: FamilyTask[] = []
    const upcoming: FamilyTask[] = []
    for (const t of active) {
      const d = new Date(t.due_date)
      if (isToday(d)) today.push(t)
      else if (isPast(d)) catchUp.push(t)
      else if (d <= weekEnd) thisWeek.push(t)
      else upcoming.push(t)
    }
    const byMonth = new Map<string, FamilyTask[]>()
    upcoming
      .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())
      .forEach((t) => {
        const key = format(new Date(t.due_date), 'MMMM yyyy')
        if (!byMonth.has(key)) byMonth.set(key, [])
        byMonth.get(key)!.push(t)
      })
    return { today, thisWeek, catchUp, upcomingByMonth: Array.from(byMonth.entries()) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTasks, assignee, myRole])

  const done = (doneTasks ?? []).filter(matchAssignee)
  const doneThisWeek = done.filter((t) => t.completed_at && new Date(t.completed_at) >= endOfWeek(new Date(Date.now() - 7 * 864e5)))
  const doneEarlier = done.filter((t) => !doneThisWeek.includes(t))

  usePageHeader(
    {
      title: 'Tasks',
      subtitle: `${today.length} today · ${thisWeek.length} this week · ${catchUp.length} to catch up`,
      actions: (
        <Link
          href="/tasks/new"
          className="inline-flex items-center gap-1.5 rounded-xl bg-clay px-4 py-2.5 text-[14px] font-bold text-white transition-opacity hover:opacity-90"
        >
          <Plus className="h-4 w-4" /> New task
        </Link>
      ),
    },
    [today.length, thisWeek.length, catchUp.length]
  )

  const complete = (id: string) => completeTask.mutate(id)

  return (
    <div>
      <div className="mb-1 flex items-center justify-between gap-3.5">
        <ScopeSwitch
          options={[
            { key: 'now', label: 'Now', badge: today.length + thisWeek.length },
            { key: 'upcoming', label: 'Upcoming' },
            { key: 'done', label: 'Done' },
          ]}
          value={scope}
          onChange={(k) => setScope(k as typeof scope)}
        />
      </div>

      <div className="grid grid-cols-1 items-start gap-7 lg:grid-cols-[minmax(0,1fr)_336px]">
        {/* Main column */}
        <div className="min-w-0">
          {scope === 'now' && (
            <>
              {today.length > 0 && (
                <Section label="Today" count={today.length}>
                  {today.map((t) => (
                    <TaskRow key={t.id} task={t} busy={completeTask.isPending} onComplete={() => complete(t.id)} />
                  ))}
                </Section>
              )}
              {thisWeek.length > 0 && (
                <Section label="This week" count={thisWeek.length}>
                  {thisWeek.map((t) => (
                    <TaskRow key={t.id} task={t} busy={completeTask.isPending} onComplete={() => complete(t.id)} />
                  ))}
                </Section>
              )}
              {catchUp.length > 0 && (
                <Section label="Catch up" count={catchUp.length} amber>
                  {catchUp.map((t) => (
                    <TaskRow key={t.id} task={t} busy={completeTask.isPending} onComplete={() => complete(t.id)} />
                  ))}
                </Section>
              )}
              {today.length + thisWeek.length + catchUp.length === 0 && (
                <Panel className="p-12 text-center">
                  <p className="text-[15px] font-semibold text-ink">You&apos;re clear right now — nice.</p>
                  <p className="mt-1 text-[13px] text-mute">Nothing due today or this week.</p>
                </Panel>
              )}
            </>
          )}

          {scope === 'upcoming' &&
            (upcomingByMonth.length > 0 ? (
              upcomingByMonth.map(([month, tasks]) => (
                <Section key={month} label={month} count={tasks.length}>
                  {tasks.map((t) => (
                    <TaskRow key={t.id} task={t} busy={completeTask.isPending} onComplete={() => complete(t.id)} />
                  ))}
                </Section>
              ))
            ) : (
              <Panel className="p-12 text-center">
                <p className="text-[15px] text-mute">Nothing scheduled beyond this week.</p>
              </Panel>
            ))}

          {scope === 'done' &&
            (done.length > 0 ? (
              <>
                {doneThisWeek.length > 0 && (
                  <Section label="This week" count={doneThisWeek.length}>
                    {doneThisWeek.map((t) => (
                      <TaskRow key={t.id} task={t} done onComplete={() => {}} />
                    ))}
                  </Section>
                )}
                {doneEarlier.length > 0 && (
                  <Section label="Earlier" count={doneEarlier.length}>
                    {doneEarlier.map((t) => (
                      <TaskRow key={t.id} task={t} done onComplete={() => {}} />
                    ))}
                  </Section>
                )}
              </>
            ) : (
              <Panel className="p-12 text-center">
                <p className="text-[15px] text-mute">No completed tasks yet.</p>
              </Panel>
            ))}
        </div>

        {/* Right rail */}
        <div className="min-w-0">
          <Panel className="mb-[18px] p-[18px]">
            <div className="mb-3.5 text-[11px] font-bold uppercase tracking-[1.2px] text-faint">This week</div>
            {[
              { k: 'Today', v: today.length, amber: false },
              { k: 'This week', v: thisWeek.length, amber: false },
              { k: 'Catch up', v: catchUp.length, amber: true },
              { k: 'Done', v: done.length, amber: false },
            ].map((r) => (
              <div key={r.k} className="flex items-center justify-between border-b border-line2 py-2.5 last:border-b-0">
                <span className="text-[13.5px] font-semibold text-ink">{r.k}</span>
                <span className={cn('text-[13.5px] font-extrabold', r.amber && r.v > 0 ? 'text-[--amber]' : 'text-ink')}>{r.v}</span>
              </div>
            ))}
          </Panel>

          {(backlogCount ?? 0) > 0 && (
            <Link
              href="/tasks/triage"
              className="mb-[18px] flex items-center gap-3 rounded-2xl border border-[--amber]/25 bg-[--amber]/10 px-[18px] py-[15px] transition-opacity hover:opacity-90"
            >
              <Clock className="h-[19px] w-[19px] flex-none text-[--amber]" />
              <div className="min-w-0 flex-1">
                <div className="text-[14px] font-bold text-[--amber]">{backlogCount} in your backlog</div>
                <div className="mt-0.5 text-[12px] font-medium text-mute">Tidy it up in triage</div>
              </div>
              <ChevronRight className="h-4 w-4 flex-none text-[--amber]" />
            </Link>
          )}

          <Panel className="p-[18px]">
            <div className="mb-3.5 text-[11px] font-bold uppercase tracking-[1.2px] text-faint">Filter</div>
            <div className="flex flex-wrap gap-2">
              {(['all', 'mine', 'partner'] as AssigneeFilter[]).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setAssignee(f)}
                  className={cn(
                    'inline-flex items-center rounded-full border px-[15px] py-2 text-[13px] font-bold capitalize transition-colors',
                    assignee === f ? 'border-clay bg-clay text-white' : 'border-line bg-card text-ink2 hover:border-faint'
                  )}
                >
                  {f}
                </button>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </div>
  )
}
