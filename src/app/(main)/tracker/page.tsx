'use client'

import { useFamily } from '@/hooks/use-family'
import { useShiftBriefing, useTrackerLogs } from '@/hooks/use-tracker'
import { useRequirePremium } from '@/hooks/use-require-auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import Link from 'next/link'
import {
  Baby,
  Milk,
  Moon,
  Thermometer,
  Pill,
  Sun,
  Smile,
  Scale,
  Ruler,
  Star,
  Plus,
  Clock,
  History,
  BarChart3,
  Lock,
} from 'lucide-react'
import { format, formatDistanceToNow } from 'date-fns'
import { cn } from '@/lib/utils'
import { BASIC_LOG_TYPES, PREMIUM_LOG_TYPES, LogType } from '@/services/tracker-service'

const LOG_TYPE_CONFIG: Record<LogType, { icon: any; color: string; bgColor: string; label: string }> = {
  feeding: { icon: Milk, color: 'text-blue-400', bgColor: 'bg-blue-500/20', label: 'Feeding' },
  diaper: { icon: Baby, color: 'text-amber-400', bgColor: 'bg-amber-500/20', label: 'Diaper' },
  sleep: { icon: Moon, color: 'text-purple-400', bgColor: 'bg-purple-500/20', label: 'Sleep' },
  temperature: { icon: Thermometer, color: 'text-red-400', bgColor: 'bg-red-500/20', label: 'Temperature' },
  medicine: { icon: Pill, color: 'text-green-400', bgColor: 'bg-green-500/20', label: 'Medicine' },
  vitamin_d: { icon: Sun, color: 'text-yellow-400', bgColor: 'bg-yellow-500/20', label: 'Vitamin D' },
  mood: { icon: Smile, color: 'text-pink-400', bgColor: 'bg-pink-500/20', label: 'Mood' },
  weight: { icon: Scale, color: 'text-cyan-400', bgColor: 'bg-cyan-500/20', label: 'Weight' },
  height: { icon: Ruler, color: 'text-indigo-400', bgColor: 'bg-indigo-500/20', label: 'Height' },
  milestone: { icon: Star, color: 'text-accent-400', bgColor: 'bg-accent-500/20', label: 'Milestone' },
  custom: { icon: Plus, color: 'text-surface-400', bgColor: 'bg-surface-500/20', label: 'Custom' },
}

export default function TrackerPage() {
  const { data: family } = useFamily()
  const { data: shiftBriefing, isLoading: briefingLoading } = useShiftBriefing()
  const { data: recentLogs, isLoading: logsLoading } = useTrackerLogs({ limit: 5 })
  const { isPremium } = useRequirePremium()

  // Show preview UI for pregnancy
  const isPreview = family?.stage === 'pregnancy'

  return (
    <div className="p-4 space-y-6 max-w-2xl overflow-x-hidden">
      {/* Preview Banner for Pregnancy */}
      {isPreview && (
        <Card className="bg-primary-600/20 border-primary-600/30">
          <CardContent className="py-4 flex items-center gap-3">
            <Lock className="h-6 w-6 text-primary-400" />
            <div>
              <p className="font-medium text-primary-300">Preview Mode</p>
              <p className="text-sm text-primary-300/70">
                The baby tracker will unlock after your baby is born. Here's a preview of what you'll be able to track!
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Baby Tracker</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled={isPreview} asChild={!isPreview}>
            {isPreview ? (
              <>
                <History className="h-4 w-4 mr-1" />
                History
              </>
            ) : (
              <Link href="/tracker/history">
                <History className="h-4 w-4 mr-1" />
                History
              </Link>
            )}
          </Button>
          <Button variant="outline" size="sm" disabled={isPreview} asChild={!isPreview}>
            {isPreview ? (
              <>
                <BarChart3 className="h-4 w-4 mr-1" />
                Summary
              </>
            ) : (
              <Link href="/tracker/summary">
                <BarChart3 className="h-4 w-4 mr-1" />
                Summary
              </Link>
            )}
          </Button>
        </div>
      </div>

      {/* Shift Briefing */}
      <Card className={cn("bg-surface-900 border-surface-800", isPreview && "opacity-70")}>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="h-5 w-5 text-accent-500" />
            Shift Briefing
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isPreview ? (
            <div className="grid grid-cols-3 gap-4">
              <BriefingStat
                label="Last Feed"
                value="2h ago"
                subValue="6 today"
                icon={Milk}
                color="text-blue-400"
              />
              <BriefingStat
                label="Last Diaper"
                value="45m ago"
                subValue="4 today"
                icon={Baby}
                color="text-amber-400"
              />
              <BriefingStat
                label="Sleep Today"
                value="12h"
                subValue="2h ago"
                icon={Moon}
                color="text-purple-400"
              />
            </div>
          ) : briefingLoading ? (
            <div className="grid grid-cols-3 gap-4">
              <Skeleton className="h-16" />
              <Skeleton className="h-16" />
              <Skeleton className="h-16" />
            </div>
          ) : shiftBriefing ? (
            <div className="grid grid-cols-3 gap-4">
              <BriefingStat
                label="Last Feed"
                value={shiftBriefing.last_feeding
                  ? formatDistanceToNow(new Date(shiftBriefing.last_feeding.logged_at), { addSuffix: true })
                  : 'No logs'}
                subValue={`${shiftBriefing.total_feedings_today} today`}
                icon={Milk}
                color="text-blue-400"
              />
              <BriefingStat
                label="Last Diaper"
                value={shiftBriefing.last_diaper
                  ? formatDistanceToNow(new Date(shiftBriefing.last_diaper.logged_at), { addSuffix: true })
                  : 'No logs'}
                subValue={`${shiftBriefing.total_diapers_today} today`}
                icon={Baby}
                color="text-amber-400"
              />
              <BriefingStat
                label="Sleep Today"
                value={`${shiftBriefing.total_sleep_hours_today}h`}
                subValue={shiftBriefing.last_sleep
                  ? formatDistanceToNow(new Date(shiftBriefing.last_sleep.logged_at), { addSuffix: true })
                  : 'No logs'}
                icon={Moon}
                color="text-purple-400"
              />
            </div>
          ) : (
            <p className="text-surface-400 text-center py-4">No data available</p>
          )}
        </CardContent>
      </Card>

      {/* Quick Log Grid - Basic Types */}
      <div className={cn(isPreview && "opacity-70")}>
        <h2 className="text-lg font-medium text-white mb-3">Quick Log</h2>
        <div className="grid grid-cols-3 gap-3">
          {BASIC_LOG_TYPES.map((type) => {
            const config = LOG_TYPE_CONFIG[type]
            return isPreview ? (
              <div
                key={type}
                className={cn(
                  "flex flex-col items-center gap-2 p-4 rounded-lg border cursor-not-allowed",
                  config.bgColor,
                  "border-surface-700"
                )}
              >
                <config.icon className={cn("h-8 w-8", config.color)} />
                <span className="text-sm text-surface-200">{config.label}</span>
              </div>
            ) : (
              <Link
                key={type}
                href={`/tracker/log?type=${type}`}
                className={cn(
                  "flex flex-col items-center gap-2 p-4 rounded-lg border transition-colors",
                  config.bgColor,
                  "border-surface-700 hover:border-surface-600"
                )}
              >
                <config.icon className={cn("h-8 w-8", config.color)} />
                <span className="text-sm text-surface-200">{config.label}</span>
              </Link>
            )
          })}
        </div>
      </div>

      {/* More Log Types - Premium */}
      <div className={cn(isPreview && "opacity-70")}>
        <h2 className="text-lg font-medium text-white mb-3 flex items-center gap-2">
          More Logs
          {(!isPremium || isPreview) && <Lock className="h-4 w-4 text-surface-500" />}
        </h2>
        <div className="grid grid-cols-4 gap-2">
          {PREMIUM_LOG_TYPES.map((type) => {
            const config = LOG_TYPE_CONFIG[type]
            return isPreview ? (
              <div
                key={type}
                className={cn(
                  "flex flex-col items-center gap-1.5 p-3 rounded-lg border cursor-not-allowed",
                  "bg-surface-800/50",
                  "border-surface-700",
                  "opacity-60"
                )}
              >
                <config.icon className={cn("h-6 w-6", "text-surface-500")} />
                <span className="text-xs text-surface-300">{config.label}</span>
              </div>
            ) : (
              <Link
                key={type}
                href={isPremium ? `/tracker/log?type=${type}` : '/settings/subscription'}
                className={cn(
                  "flex flex-col items-center gap-1.5 p-3 rounded-lg border transition-colors",
                  isPremium ? config.bgColor : "bg-surface-800/50",
                  "border-surface-700",
                  isPremium ? "hover:border-surface-600" : "opacity-60"
                )}
              >
                <config.icon className={cn("h-6 w-6", isPremium ? config.color : "text-surface-500")} />
                <span className="text-xs text-surface-300">{config.label}</span>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Recent Logs */}
      <div className={cn(isPreview && "opacity-70")}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-medium text-white">Recent Activity</h2>
          {isPreview ? (
            <span className="text-sm text-surface-500 cursor-not-allowed">View All</span>
          ) : (
            <Link href="/tracker/history" className="text-sm text-accent-500">
              View All
            </Link>
          )}
        </div>
        {isPreview ? (
          <div className="space-y-2">
            {[
              { type: 'feeding', time: '2:30 PM', notes: 'Bottle - 4oz' },
              { type: 'diaper', time: '1:15 PM', notes: 'Wet' },
              { type: 'sleep', time: '12:00 PM', notes: 'Nap - 45 mins' },
            ].map((log, idx) => {
              const config = LOG_TYPE_CONFIG[log.type as LogType]
              return (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-3 rounded-lg bg-surface-900 border border-surface-800"
                >
                  <div className={cn("p-2 rounded-lg", config?.bgColor)}>
                    {config && <config.icon className={cn("h-4 w-4", config.color)} />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white capitalize">
                      {log.type.replace('_', ' ')}
                    </p>
                    <p className="text-xs text-surface-400">
                      {log.time}
                      {log.notes && ` - ${log.notes}`}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        ) : logsLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-14" />
            <Skeleton className="h-14" />
            <Skeleton className="h-14" />
          </div>
        ) : recentLogs && recentLogs.length > 0 ? (
          <div className="space-y-2">
            {recentLogs.map((log) => {
              const config = LOG_TYPE_CONFIG[log.log_type as LogType]
              return (
                <div
                  key={log.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-surface-900 border border-surface-800"
                >
                  <div className={cn("p-2 rounded-lg", config?.bgColor)}>
                    {config && <config.icon className={cn("h-4 w-4", config.color)} />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white capitalize">
                      {log.log_type.replace('_', ' ')}
                    </p>
                    <p className="text-xs text-surface-400">
                      {format(new Date(log.logged_at), 'h:mm a')}
                      {log.notes && ` - ${log.notes}`}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <Card className="bg-surface-900 border-surface-800">
            <CardContent className="py-8 text-center">
              <p className="text-surface-400">No logs yet. Start tracking!</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

function BriefingStat({
  label,
  value,
  subValue,
  icon: Icon,
  color,
}: {
  label: string
  value: string
  subValue: string
  icon: any
  color: string
}) {
  return (
    <div className="text-center">
      <Icon className={cn("h-5 w-5 mx-auto mb-1", color)} />
      <p className="text-xs text-surface-400">{label}</p>
      <p className="text-sm font-medium text-white">{value}</p>
      <p className="text-xs text-surface-500">{subValue}</p>
    </div>
  )
}
