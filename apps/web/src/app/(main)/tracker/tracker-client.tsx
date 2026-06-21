'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { format, formatDistanceToNowStrict, isToday, isSameDay, addDays, subDays } from 'date-fns'
import { ChevronLeft, ChevronRight, Lock } from 'lucide-react'
import type { BabyLog } from '@tdc/shared/types'
import { useUser } from '@/components/user-provider'
import { useFamily, useFamilyMembers } from '@/hooks/use-family'
import { useTrackerLogs } from '@/hooks/use-tracker'
import { BASIC_LOG_TYPES, PREMIUM_LOG_TYPES } from '@tdc/services'
import { LOG_TYPE_CONFIG } from '@/lib/tracker-constants'
import { Panel } from '@/components/digest'
import { MedicalDisclaimer } from '@/components/shared/medical-disclaimer'
import { usePageHeader } from '@/components/layouts/topbar-context'
import { cn } from '@/lib/utils'

const typeColor: Record<string, string> = {
  feeding: 'var(--accent)',
  diaper: 'var(--sage)',
  sleep: 'var(--sky)',
  temperature: 'var(--gold)',
  medicine: 'var(--gold)',
  vitamin_d: 'var(--gold)',
  mood: 'var(--rose)',
  weight: 'var(--ink2)',
  height: 'var(--ink2)',
  milestone: 'var(--ink2)',
  custom: 'var(--muted)',
}

function fmtDuration(mins?: number) {
  if (!mins) return ''
  if (mins < 60) return `${mins}m`
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return m ? `${h}h ${m}m` : `${h}h`
}

function formatLog(log: BabyLog): string {
  const d = log.log_data || {}
  switch (log.log_type) {
    case 'feeding': {
      if (d.type === 'bottle') return `Bottle · ${d.amount_oz ?? '?'} oz`
      if (d.type === 'breast') return `Breast · ${fmtDuration(d.duration_minutes)}${d.side ? ` (${String(d.side)[0].toUpperCase()})` : ''}`
      if (d.type === 'solid') return 'Solid food'
      return 'Feeding'
    }
    case 'diaper':
      return `Diaper · ${d.type ?? 'change'}`
    case 'sleep':
      return `Sleep · ${fmtDuration(d.duration_minutes) || '—'}`
    case 'temperature':
      return `Temp · ${d.value ?? '?'}°${d.unit ?? 'F'}`
    case 'medicine':
      return `${d.name ?? 'Medicine'}${d.dosage ? ` · ${d.dosage}` : ''}`
    case 'vitamin_d':
      return 'Vitamin D'
    case 'mood':
      return `Mood · ${d.level ?? ''}`
    case 'weight':
      return `Weight · ${d.value ?? '?'} ${d.unit ?? ''}`
    case 'height':
      return `Height · ${d.value ?? '?'} ${d.unit ?? ''}`
    case 'milestone':
      return `Milestone · ${d.name ?? ''}`
    default:
      return log.log_type.replace('_', ' ')
  }
}

function sublineFor(log: BabyLog, byName: string): string {
  const d = log.log_data || {}
  if (log.log_type === 'sleep' && d.quality) return `Quality: ${d.quality} · ${byName}`
  return byName
}

export default function TrackerClient() {
  const { user, activeBaby } = useUser()
  const { data: family } = useFamily()
  const { data: members } = useFamilyMembers()
  const { data: allLogs } = useTrackerLogs({ limit: 100 })

  const [selectedDate, setSelectedDate] = useState<Date>(new Date())

  const stage = activeBaby?.stage || family?.stage
  const isPreview = stage === 'pregnancy'
  const babyName = activeBaby?.baby_name ?? family?.baby_name
  const ageWeeks = activeBaby?.current_week ?? family?.current_week

  const nameFor = (id: string) => {
    if (id === user.id) return 'Logged by you'
    const m = members?.find((mm) => mm.id === id)
    return m ? `Logged by ${m.full_name?.split(' ')[0]}` : 'Logged'
  }

  const dayLogs = useMemo(() => {
    return (allLogs ?? [])
      .filter((l) => isSameDay(new Date(l.logged_at), selectedDate))
      .sort((a, b) => new Date(b.logged_at).getTime() - new Date(a.logged_at).getTime())
  }, [allLogs, selectedDate])

  const lastOfType = (t: string) => dayLogs.find((l) => l.log_type === t)
  const feeds = dayLogs.filter((l) => l.log_type === 'feeding').length
  const changes = dayLogs.filter((l) => l.log_type === 'diaper').length
  const sleepMins = dayLogs
    .filter((l) => l.log_type === 'sleep')
    .reduce((s, l) => s + (l.log_data?.duration_minutes ?? 0), 0)

  const tileLast = (t: string) => {
    const last = lastOfType(t)
    if (!last) return 'Tap to log'
    return isToday(selectedDate)
      ? `${formatDistanceToNowStrict(new Date(last.logged_at))} ago`
      : format(new Date(last.logged_at), 'h:mm a')
  }

  const atGlance = (t: string) => {
    const last = lastOfType(t)
    if (!last) return '—'
    return isToday(selectedDate)
      ? `${formatDistanceToNowStrict(new Date(last.logged_at))} ago`
      : format(new Date(last.logged_at), 'h:mm a')
  }

  const dateLabel = isToday(selectedDate) ? 'Today' : format(selectedDate, 'EEE, MMM d')

  usePageHeader(
    {
      title: 'Tracker',
      subtitle: [babyName, ageWeeks ? `${ageWeeks} weeks old` : null].filter(Boolean).join(' · ') || 'Baby tracker',
      actions: isPreview ? null : (
        <div className="flex items-center gap-1.5 rounded-full border border-line bg-card px-1.5 py-1 shadow-[var(--shadow-sm)]">
          <button
            type="button"
            onClick={() => setSelectedDate((d) => subDays(d, 1))}
            className="grid h-[30px] w-[30px] place-items-center rounded-full bg-line2 text-ink2 transition-opacity hover:opacity-70"
          >
            <ChevronLeft className="h-[15px] w-[15px]" />
          </button>
          <span className="px-1.5 text-[13px] font-bold text-ink">{dateLabel}</span>
          <button
            type="button"
            onClick={() => setSelectedDate((d) => addDays(d, 1))}
            disabled={isToday(selectedDate)}
            className="grid h-[30px] w-[30px] place-items-center rounded-full bg-line2 text-ink2 transition-opacity hover:opacity-70 disabled:opacity-30"
          >
            <ChevronRight className="h-[15px] w-[15px]" />
          </button>
        </div>
      ),
    },
    [babyName, ageWeeks, dateLabel, isPreview]
  )

  if (isPreview) {
    return (
      <>
        <MedicalDisclaimer className="mb-5" />
        <Panel className="border-l-[3px] border-l-clay p-8 text-center">
          <Lock className="mx-auto h-7 w-7 text-clay-ink" />
          <h2 className="mt-3 text-[18px] font-extrabold text-ink">Tracker unlocks after birth</h2>
          <p className="mx-auto mt-2 max-w-md text-[14px] leading-[1.6] text-ink2">
            Once your baby arrives, log feeds, diapers, sleep and more — and see the whole day as a clean timeline.
          </p>
        </Panel>
      </>
    )
  }

  return (
    <>
      <MedicalDisclaimer className="mb-5" />

      <div className="grid grid-cols-1 items-start gap-7 lg:grid-cols-[minmax(0,1fr)_336px]">
        {/* Main column */}
        <div className="min-w-0">
          <div className="mb-3 text-[11px] font-bold uppercase tracking-[1.5px] text-faint">Log now</div>
          <div className="flex gap-3.5">
            {BASIC_LOG_TYPES.map((t) => {
              const config = LOG_TYPE_CONFIG[t]
              const color = typeColor[t] ?? 'var(--accent)'
              const Icon = config.icon
              return (
                <Link
                  key={t}
                  href={`/tracker/log?type=${t}`}
                  className="flex max-w-[160px] flex-1 flex-col items-center rounded-[18px] border border-line bg-card px-3 py-5 text-center shadow-[var(--shadow-sm)] transition-shadow hover:shadow-[var(--shadow)]"
                >
                  <span
                    className="grid h-[52px] w-[52px] place-items-center rounded-full"
                    style={{ background: `color-mix(in srgb, ${color} 15%, transparent)` }}
                  >
                    <Icon className="h-[26px] w-[26px]" style={{ color }} />
                  </span>
                  <span className="mt-3 text-[15px] font-bold text-ink">{config.label}</span>
                  <span className="mt-0.5 text-[12px] font-semibold text-mute">{tileLast(t)}</span>
                </Link>
              )
            })}
          </div>

          <div className="mb-3 mt-7 text-[11px] font-bold uppercase tracking-[1.5px] text-faint">More</div>
          <div className="flex flex-wrap gap-2.5">
            {PREMIUM_LOG_TYPES.map((t) => {
              const config = LOG_TYPE_CONFIG[t]
              const color = typeColor[t] ?? 'var(--muted)'
              return (
                <Link
                  key={t}
                  href={`/tracker/log?type=${t}`}
                  className="inline-flex items-center gap-2 rounded-full border border-line bg-card px-[15px] py-2 text-[13px] font-bold text-ink2 transition-colors hover:border-faint"
                >
                  <span className="h-2 w-2 rounded-full" style={{ background: color }} />
                  {config.label}
                </Link>
              )
            })}
          </div>

          <div className="mb-3 mt-7 flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-[1.5px] text-faint">
              {isToday(selectedDate) ? "Today's timeline" : `${format(selectedDate, 'MMM d')} timeline`}
            </span>
            <Link href="/tracker/history" className="text-[12.5px] font-bold text-mute hover:text-clay-ink">
              History →
            </Link>
          </div>
          <Panel className="px-[22px] py-2">
            {dayLogs.length === 0 ? (
              <p className="py-8 text-center text-[14px] text-mute">Nothing logged {isToday(selectedDate) ? 'yet today' : 'this day'}.</p>
            ) : (
              dayLogs.map((log, i) => {
                const color = typeColor[log.log_type] ?? 'var(--muted)'
                const last = i === dayLogs.length - 1
                return (
                  <div key={log.id} className="flex">
                    <div className="w-14 flex-none pr-0.5 pt-3 text-right text-[12px] font-bold text-mute">
                      {format(new Date(log.logged_at), 'h:mma').toLowerCase()}
                    </div>
                    <div className="flex w-[34px] flex-none flex-col items-center">
                      <span
                        className="mt-[15px] h-3 w-3 rounded-full ring-1 ring-line"
                        style={{ background: color, boxShadow: '0 0 0 2px var(--card)' }}
                      />
                      {!last && <span className="w-0.5 flex-1 bg-line" />}
                    </div>
                    <div className="flex-1 pb-[15px] pt-[11px]">
                      <div className="text-[15px] font-semibold text-ink">{formatLog(log)}</div>
                      <div className="mt-0.5 text-[12.5px] font-medium text-mute">{sublineFor(log, nameFor(log.logged_by))}</div>
                    </div>
                  </div>
                )
              })
            )}
          </Panel>
        </div>

        {/* Right rail */}
        <div className="min-w-0">
          <Panel className="mb-[18px] p-[18px]">
            <div className="mb-3.5 text-[11px] font-bold uppercase tracking-[1.2px] text-faint">
              {isToday(selectedDate) ? 'Today so far' : 'That day'}
            </div>
            {[
              { k: 'Feeds', v: feeds ? String(feeds) : '—', accent: false },
              { k: 'Changes', v: changes ? String(changes) : '—', accent: false },
              { k: 'Sleep', v: sleepMins ? fmtDuration(sleepMins) : '—', accent: true },
            ].map((r) => (
              <div key={r.k} className="flex items-center justify-between border-b border-line2 py-2.5 last:border-b-0">
                <span className="text-[13.5px] font-semibold text-ink">{r.k}</span>
                <span className={cn('text-[13.5px] font-extrabold', r.accent ? 'text-clay-ink' : 'text-ink')}>{r.v}</span>
              </div>
            ))}
          </Panel>

          <Panel className="p-[18px]">
            <div className="mb-3.5 text-[11px] font-bold uppercase tracking-[1.2px] text-faint">At a glance</div>
            {[
              { k: 'Last fed', v: atGlance('feeding') },
              { k: 'Last change', v: atGlance('diaper') },
              { k: 'Last sleep', v: atGlance('sleep') },
            ].map((r) => (
              <div key={r.k} className="flex items-center justify-between border-b border-line2 py-2.5 last:border-b-0">
                <span className="text-[13.5px] font-semibold text-ink">{r.k}</span>
                <span className="text-[13.5px] font-extrabold text-ink">{r.v}</span>
              </div>
            ))}
          </Panel>
        </div>
      </div>
    </>
  )
}
