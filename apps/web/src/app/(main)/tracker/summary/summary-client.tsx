'use client'

import { useState } from 'react'
import { useTrackerLogs } from '@/hooks/use-tracker'
import { useRequirePremium } from '@/hooks/use-subscription'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
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

export default function SummaryClient() {
  const { isPremium } = useRequirePremium()
  const [period, setPeriod] = useState<'7d' | '30d'>('7d')

  const daysBack = period === '7d' ? 7 : 30
  const dateFrom = subDays(new Date(), daysBack).toISOString()

  const { data: logs, isLoading } = useTrackerLogs({
    date_from: dateFrom,
    limit: 1000,
  })

  if (!isPremium) {
    return (
      <div className="p-4 space-y-4 max-w-2xl">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/tracker">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-xl font-bold font-display text-[--cream]">Summary & Insights</h1>
        </div>
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
    <div className="p-4 space-y-6 max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/tracker">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <h1 className="text-xl font-bold font-display text-[--cream] flex-1">Summary & Insights</h1>
      </div>

      {/* Period Selector */}
      <Tabs value={period} onValueChange={(v) => setPeriod(v as any)}>
        <TabsList className="bg-[--surface]">
          <TabsTrigger value="7d">Last 7 Days</TabsTrigger>
          <TabsTrigger value="30d">Last 30 Days</TabsTrigger>
        </TabsList>
      </Tabs>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-3 gap-3">
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
          <Card className="bg-[--surface] border-[--border] shadow-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-display flex items-center gap-2 text-[--cream]">
                <Milk className="h-5 w-5 text-sky" />
                Feedings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-1 h-32">
                {dailyStats.map((day, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className="w-full bg-sky-dim rounded-t transition-all border-t-2 border-sky/50"
                      style={{ height: `${(day.feedings / maxFeedings) * 100}%` }}
                    />
                    <span className="text-[10px] font-ui text-[--dim]">
                      {format(day.date, period === '7d' ? 'EEE' : 'd')}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Diaper Chart */}
          <Card className="bg-[--surface] border-[--border] shadow-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-display flex items-center gap-2 text-[--cream]">
                <Baby className="h-5 w-5 text-gold" />
                Diapers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-1 h-32">
                {dailyStats.map((day, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className="w-full bg-gold-dim rounded-t transition-all border-t-2 border-gold/50"
                      style={{ height: `${(day.diapers / maxDiapers) * 100}%` }}
                    />
                    <span className="text-[10px] font-ui text-[--dim]">
                      {format(day.date, period === '7d' ? 'EEE' : 'd')}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Sleep Chart */}
          <Card className="bg-[--surface] border-[--border] shadow-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-display flex items-center gap-2 text-[--cream]">
                <Moon className="h-5 w-5 text-rose" />
                Sleep (hours)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-1 h-32">
                {dailyStats.map((day, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className="w-full bg-rose-dim rounded-t transition-all border-t-2 border-rose/50"
                      style={{ height: `${(day.sleepMinutes / maxSleep) * 100}%` }}
                    />
                    <span className="text-[10px] font-ui text-[--dim]">
                      {format(day.date, period === '7d' ? 'EEE' : 'd')}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
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
  const trendColor = trend > 0.1 ? 'text-sage' : trend < -0.1 ? 'text-coral' : 'text-[--dim]'

  return (
    <Card className="bg-[--surface] border-[--border] shadow-card">
      <CardContent className="pt-4 pb-3 px-3 text-center">
        <div className={cn("w-10 h-10 rounded-lg mx-auto flex items-center justify-center mb-2", bgColor)}>
          <Icon className={cn("h-5 w-5", iconColor)} />
        </div>
        <p className="text-xs font-ui text-[--muted] mb-1">{label}</p>
        <p className="text-xl font-bold font-display text-[--cream]">
          {value}
          <span className="text-sm font-normal font-body text-[--muted]">{unit}</span>
        </p>
        <div className={cn("flex items-center justify-center gap-1 mt-1", trendColor)}>
          <TrendIcon className="h-3 w-3" />
          <span className="text-xs font-ui">
            {Math.abs(trend).toFixed(1)}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
