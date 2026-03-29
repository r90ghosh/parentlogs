'use client'

import { type LucideIcon } from 'lucide-react'
import { useUser } from '@/components/user-provider'
import { useFamily } from '@/hooks/use-family'
import { useShiftBriefing, useTrackerLogs } from '@/hooks/use-tracker'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import Link from 'next/link'
import {
  Baby,
  Milk,
  Moon,
  Clock,
  History,
  BarChart3,
  Lock,
} from 'lucide-react'
import { format, formatDistanceToNow } from 'date-fns'
import { cn } from '@/lib/utils'
import { BASIC_LOG_TYPES, PREMIUM_LOG_TYPES, type LogType } from '@tdc/services'
import { LOG_TYPE_CONFIG } from '@/lib/tracker-constants'
import { MedicalDisclaimer } from '@/components/shared/medical-disclaimer'
import { Reveal } from '@/components/ui/animations/Reveal'
import { Card3DTilt } from '@/components/ui/animations/Card3DTilt'

export default function TrackerClient() {
  const { activeBaby } = useUser()
  const { data: family } = useFamily()
  const { data: shiftBriefing, isLoading: briefingLoading } = useShiftBriefing()
  const { data: recentLogs, isLoading: logsLoading } = useTrackerLogs({ limit: 5 })

  // Show preview UI for pregnancy
  const stage = activeBaby?.stage || family?.stage
  const isPreview = stage === 'pregnancy'

  return (
    <div className="p-4 space-y-6 max-w-2xl overflow-x-hidden">
      {/* Preview Banner for Pregnancy */}
      {isPreview && (
        <Reveal variant="card" delay={0}>
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
        </Reveal>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-display text-[--cream]">Baby Tracker</h1>
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
      <Reveal delay={80}>
      <Card3DTilt maxTilt={3} gloss>
      <Card className={cn("bg-[--surface] border-[--border] shadow-card", isPreview && "opacity-70")}>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-display flex items-center gap-2 text-[--cream]">
            <Clock className="h-5 w-5 text-copper" />
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
                color="text-sky"
              />
              <BriefingStat
                label="Last Diaper"
                value="45m ago"
                subValue="4 today"
                icon={Baby}
                color="text-gold"
              />
              <BriefingStat
                label="Sleep Today"
                value="12h"
                subValue="2h ago"
                icon={Moon}
                color="text-rose"
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
                color="text-sky"
              />
              <BriefingStat
                label="Last Diaper"
                value={shiftBriefing.last_diaper
                  ? formatDistanceToNow(new Date(shiftBriefing.last_diaper.logged_at), { addSuffix: true })
                  : 'No logs'}
                subValue={`${shiftBriefing.total_diapers_today} today`}
                icon={Baby}
                color="text-gold"
              />
              <BriefingStat
                label="Sleep Today"
                value={`${shiftBriefing.total_sleep_hours_today}h`}
                subValue={shiftBriefing.last_sleep
                  ? formatDistanceToNow(new Date(shiftBriefing.last_sleep.logged_at), { addSuffix: true })
                  : 'No logs'}
                icon={Moon}
                color="text-rose"
              />
            </div>
          ) : (
            <p className="text-[--muted] text-center py-4 font-body">No data available</p>
          )}
        </CardContent>
      </Card>
      </Card3DTilt>
      </Reveal>

      {/* Quick Log Grid - Basic Types */}
      <Reveal delay={160}>
      <div className={cn(isPreview && "opacity-70")}>
        <h2 className="text-lg font-display font-medium text-[--cream] mb-3">Quick Log</h2>
        <div className="grid grid-cols-3 gap-3">
          {BASIC_LOG_TYPES.map((type) => {
            const config = LOG_TYPE_CONFIG[type]
            return isPreview ? (
              <div
                key={type}
                className={cn(
                  "flex flex-col items-center gap-2 p-4 rounded-lg border cursor-not-allowed",
                  config.bgColor,
                  "border-[--border]"
                )}
              >
                <config.icon className={cn("h-8 w-8", config.color)} />
                <span className="text-sm font-ui text-[--cream]">{config.label}</span>
              </div>
            ) : (
              <Link
                key={type}
                href={`/tracker/log?type=${type}`}
                className={cn(
                  "flex flex-col items-center gap-2 p-4 rounded-lg border transition-colors",
                  config.bgColor,
                  "border-[--border] hover:border-[--border-hover]"
                )}
              >
                <config.icon className={cn("h-8 w-8", config.color)} />
                <span className="text-sm font-ui text-[--cream]">{config.label}</span>
              </Link>
            )
          })}
        </div>
      </div>
      </Reveal>

      {/* More Log Types */}
      <Reveal delay={240}>
      <div className={cn(isPreview && "opacity-70")}>
        <h2 className="text-lg font-display font-medium text-[--cream] mb-3">More Logs</h2>
        <div className="grid grid-cols-4 gap-2">
          {PREMIUM_LOG_TYPES.map((type) => {
            const config = LOG_TYPE_CONFIG[type]
            return isPreview ? (
              <div
                key={type}
                className={cn(
                  "flex flex-col items-center gap-1.5 p-3 rounded-lg border cursor-not-allowed",
                  config.bgColor,
                  "border-[--border]",
                  "opacity-60"
                )}
              >
                <config.icon className={cn("h-6 w-6", config.color)} />
                <span className="text-xs font-ui text-[--cream]">{config.label}</span>
              </div>
            ) : (
              <Link
                key={type}
                href={`/tracker/log?type=${type}`}
                className={cn(
                  "flex flex-col items-center gap-1.5 p-3 rounded-lg border transition-colors",
                  config.bgColor,
                  "border-[--border] hover:border-[--border-hover]"
                )}
              >
                <config.icon className={cn("h-6 w-6", config.color)} />
                <span className="text-xs font-ui text-[--cream]">{config.label}</span>
              </Link>
            )
          })}
        </div>
      </div>
      </Reveal>

      {/* Recent Logs */}
      <Reveal delay={320}>
      <div className={cn(isPreview && "opacity-70")}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-display font-medium text-[--cream]">Recent Activity</h2>
          {isPreview ? (
            <span className="text-sm font-ui text-[--dim] cursor-not-allowed">View All</span>
          ) : (
            <Link href="/tracker/history" className="text-sm font-ui text-copper hover:text-copper-hover">
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
                  className="flex items-center gap-3 p-3 rounded-lg bg-[--surface] border border-[--border]"
                >
                  <div className={cn("p-2 rounded-lg", config?.bgColor)}>
                    {config && <config.icon className={cn("h-4 w-4", config.color)} />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium font-ui text-[--cream] capitalize">
                      {log.type.replace('_', ' ')}
                    </p>
                    <p className="text-xs font-body text-[--muted]">
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
                  className="flex items-center gap-3 p-3 rounded-lg bg-[--surface] border border-[--border]"
                >
                  <div className={cn("p-2 rounded-lg", config?.bgColor)}>
                    {config && <config.icon className={cn("h-4 w-4", config.color)} />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium font-ui text-[--cream] capitalize">
                      {log.log_type.replace('_', ' ')}
                    </p>
                    <p className="text-xs font-body text-[--muted]">
                      {format(new Date(log.logged_at), 'h:mm a')}
                      {log.notes && ` - ${log.notes}`}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <Card className="bg-[--surface] border-[--border] shadow-card">
            <CardContent className="py-8 text-center">
              <p className="text-[--muted] font-body">No logs yet. Start tracking!</p>
            </CardContent>
          </Card>
        )}
      </div>
      </Reveal>

      {/* Medical Disclaimer */}
      <MedicalDisclaimer className="mt-8" />
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
  icon: LucideIcon
  color: string
}) {
  return (
    <div className="text-center">
      <Icon className={cn("h-5 w-5 mx-auto mb-1", color)} />
      <p className="text-xs font-ui text-[--muted]">{label}</p>
      <p className="text-sm font-medium font-ui text-[--cream]">{value}</p>
      <p className="text-xs font-body text-[--dim]">{subValue}</p>
    </div>
  )
}
