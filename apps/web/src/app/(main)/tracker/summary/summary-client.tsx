'use client'

import { useState } from 'react'
import { useTrackerLogs } from '@/hooks/use-tracker'
import { useRequirePremium } from '@/hooks/use-subscription'
import { Skeleton } from '@/components/ui/skeleton'
import { PaywallOverlay } from '@/components/shared/paywall-overlay'
import { type LucideIcon } from 'lucide-react'
import {
  ArrowLeft,
  Baby,
  Milk,
  Moon,
  TrendingUp,
  TrendingDown,
  Minus,
} from 'lucide-react'
import Link from 'next/link'
import { format, subDays, eachDayOfInterval } from 'date-fns'
import { cn } from '@/lib/utils'
import { Panel, ScopeSwitch } from '@/components/digest'
import { usePageHeader } from '@/components/layouts/topbar-context'

export default function SummaryClient() {
  const { isPremium } = useRequirePremium()
  const [period, setPeriod] = useState<'7d' | '30d'>('7d')

  const daysBack = period === '7d' ? 7 : 30
  const dateFrom = subDays(new Date(), daysBack).toISOString()

  const { data: logs, isLoading } = useTrackerLogs({
    date_from: dateFrom,
    limit: 1000,
  })

  usePageHeader({ title: 'Summary' }, [])

  if (!isPremium) {
    return (
      <div className="mx-auto max-w-3xl">
        <Link
          href="/tracker"
          className="mb-5 inline-flex items-center gap-1.5 text-sm font-bold text-clay-ink hover:opacity-80"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>
        <PaywallOverlay
          feature="tracker_summary"
          message="Upgrade to Premium to see detailed charts, trends, and insights about your baby's patterns."
        />
      </div>
    )
  }

  // Calculate stats
  const days = eachDayOfInterval({
    start: subDays(new Date(), daysBack - 1),
    end: new Date(),
  })

  const dailyStats = days.map(day => {
    const dayStr = format(day, 'yyyy-MM-dd')
    const dayLogs = logs?.filter(log =>
      format(new Date(log.logged_at), 'yyyy-MM-dd') === dayStr
    ) || []

    return {
      date: day,
      feedings: dayLogs.filter(l => l.log_type === 'feeding').length,
      diapers: dayLogs.filter(l => l.log_type === 'diaper').length,
      sleepMinutes: dayLogs
        .filter(l => l.log_type === 'sleep')
        .reduce((sum, l) => sum + ((l.log_data as Record<string, any>)?.duration_minutes || 0), 0),
    }
  })

  const avgFeedings = dailyStats.reduce((sum, d) => sum + d.feedings, 0) / daysBack
  const avgDiapers = dailyStats.reduce((sum, d) => sum + d.diapers, 0) / daysBack
  const avgSleepHours = dailyStats.reduce((sum, d) => sum + d.sleepMinutes, 0) / daysBack / 60

  // Calculate trends (compare last half to first half)
  const midpoint = Math.floor(daysBack / 2)
  const firstHalf = dailyStats.slice(0, midpoint)
  const secondHalf = dailyStats.slice(midpoint)

  const feedingTrend = (
    secondHalf.reduce((sum, d) => sum + d.feedings, 0) / secondHalf.length -
    firstHalf.reduce((sum, d) => sum + d.feedings, 0) / firstHalf.length
  )
  const diaperTrend = (
    secondHalf.reduce((sum, d) => sum + d.diapers, 0) / secondHalf.length -
    firstHalf.reduce((sum, d) => sum + d.diapers, 0) / firstHalf.length
  )
  const sleepTrend = (
    secondHalf.reduce((sum, d) => sum + d.sleepMinutes, 0) / secondHalf.length -
    firstHalf.reduce((sum, d) => sum + d.sleepMinutes, 0) / firstHalf.length
  ) / 60

  const maxFeedings = Math.max(...dailyStats.map(d => d.feedings), 1)
  const maxDiapers = Math.max(...dailyStats.map(d => d.diapers), 1)
  const maxSleep = Math.max(...dailyStats.map(d => d.sleepMinutes), 1)

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        href="/tracker"
        className="mb-5 inline-flex items-center gap-1.5 text-sm font-bold text-clay-ink hover:opacity-80"
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </Link>

      {/* Period Selector */}
      <ScopeSwitch
        options={[
          { key: '7d', label: 'Last 7 Days' },
          { key: '30d', label: 'Last 30 Days' },
        ]}
        value={period}
        onChange={(k) => setPeriod(k as '7d' | '30d')}
      />

      {isLoading ? (
        <div className="mt-7 space-y-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
        </div>
      ) : (
        <>
          {/* Summary stat tiles */}
          <div className="mt-7 grid grid-cols-3 gap-3">
            <SummaryCard
              icon={Milk}
              iconColor="text-sky"
              bgColor="bg-sky-dim"
              label="Avg Feedings"
              value={avgFeedings.toFixed(1)}
              unit="/day"
              trend={feedingTrend}
            />
            <SummaryCard
              icon={Baby}
              iconColor="text-gold"
              bgColor="bg-gold-dim"
              label="Avg Diapers"
              value={avgDiapers.toFixed(1)}
              unit="/day"
              trend={diaperTrend}
            />
            <SummaryCard
              icon={Moon}
              iconColor="text-rose"
              bgColor="bg-rose-dim"
              label="Avg Sleep"
              value={avgSleepHours.toFixed(1)}
              unit="hrs/day"
              trend={sleepTrend}
            />
          </div>

          {/* Feeding Chart */}
          <div className="mb-3 mt-7 text-[11px] font-bold uppercase tracking-[1.5px] text-faint">Feedings</div>
          <Panel className="p-[22px]">
            <div className="flex h-32 items-end gap-1">
              {dailyStats.map((day, i) => (
                <div key={i} className="flex flex-1 flex-col items-center gap-1">
                  <div
                    className="w-full rounded-t border-t-2 border-sky/50 bg-sky-dim transition-all"
                    style={{ height: `${(day.feedings / maxFeedings) * 100}%` }}
                  />
                  <span className="text-[10px] font-semibold text-faint">
                    {format(day.date, period === '7d' ? 'EEE' : 'd')}
                  </span>
                </div>
              ))}
            </div>
          </Panel>

          {/* Diaper Chart */}
          <div className="mb-3 mt-7 text-[11px] font-bold uppercase tracking-[1.5px] text-faint">Diapers</div>
          <Panel className="p-[22px]">
            <div className="flex h-32 items-end gap-1">
              {dailyStats.map((day, i) => (
                <div key={i} className="flex flex-1 flex-col items-center gap-1">
                  <div
                    className="w-full rounded-t border-t-2 border-gold/50 bg-gold-dim transition-all"
                    style={{ height: `${(day.diapers / maxDiapers) * 100}%` }}
                  />
                  <span className="text-[10px] font-semibold text-faint">
                    {format(day.date, period === '7d' ? 'EEE' : 'd')}
                  </span>
                </div>
              ))}
            </div>
          </Panel>

          {/* Sleep Chart */}
          <div className="mb-3 mt-7 text-[11px] font-bold uppercase tracking-[1.5px] text-faint">Sleep (hours)</div>
          <Panel className="p-[22px]">
            <div className="flex h-32 items-end gap-1">
              {dailyStats.map((day, i) => (
                <div key={i} className="flex flex-1 flex-col items-center gap-1">
                  <div
                    className="w-full rounded-t border-t-2 border-rose/50 bg-rose-dim transition-all"
                    style={{ height: `${(day.sleepMinutes / maxSleep) * 100}%` }}
                  />
                  <span className="text-[10px] font-semibold text-faint">
                    {format(day.date, period === '7d' ? 'EEE' : 'd')}
                  </span>
                </div>
              ))}
            </div>
          </Panel>
        </>
      )}
    </div>
  )
}

function SummaryCard({
  icon: Icon,
  iconColor,
  bgColor,
  label,
  value,
  unit,
  trend,
}: {
  icon: LucideIcon
  iconColor: string
  bgColor: string
  label: string
  value: string
  unit: string
  trend: number
}) {
  const TrendIcon = trend > 0.1 ? TrendingUp : trend < -0.1 ? TrendingDown : Minus
  const trendColor = trend > 0.1 ? 'text-[--sage]' : trend < -0.1 ? 'text-danger' : 'text-faint'

  return (
    <div className="rounded-[18px] border border-line bg-card p-5 text-center">
      <div className={cn('mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-lg', bgColor)}>
        <Icon className={cn('h-5 w-5', iconColor)} />
      </div>
      <p className="mb-1 text-[12px] font-semibold text-mute">{label}</p>
      <p className="text-[24px] font-extrabold text-ink">
        {value}
        <span className="text-[13px] font-medium text-mute">{unit}</span>
      </p>
      <div className={cn('mt-1 flex items-center justify-center gap-1', trendColor)}>
        <TrendIcon className="h-3 w-3" />
        <span className="text-[12px] font-semibold">{Math.abs(trend).toFixed(1)}</span>
      </div>
    </div>
  )
}
