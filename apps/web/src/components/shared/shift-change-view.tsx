'use client'

import { useState, useMemo } from 'react'
import { useShiftBriefing, useTrackerLogs } from '@/hooks/use-tracker'
import { useFamilyMembers } from '@/hooks/use-family'
import { useAuth } from '@/lib/auth/auth-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Clock,
  Milk,
  Baby,
  Moon,
  Pill,
  AlertTriangle,
  CheckCircle,
  ArrowRightLeft,
} from 'lucide-react'
import { format, formatDistanceToNow } from 'date-fns'
import { cn } from '@/lib/utils'

export function ShiftChangeButton() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 font-ui font-semibold">
          <ArrowRightLeft className="h-4 w-4" />
          Shift Change
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-[--surface] border-[--border] max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display flex items-center gap-2">
            <Clock className="h-5 w-5 text-copper" />
            Shift Handoff
          </DialogTitle>
          <DialogDescription className="font-body">
            Quick summary for your partner taking over
          </DialogDescription>
        </DialogHeader>
        <ShiftChangeContent />
      </DialogContent>
    </Dialog>
  )
}

export function ShiftChangeContent() {
  const { user } = useAuth()
  const { data: members } = useFamilyMembers()
  const { data: shiftData } = useShiftBriefing()
  const { data: recentLogs } = useTrackerLogs({ limit: 10 })

  const partner = members?.find(m => m.id !== user?.id)
  const currentUser = members?.find(m => m.id === user?.id)

  const now = useMemo(() => Date.now(), [])

  // Group logs by type for the last 8 hours
  const eightHoursAgo = new Date(now - 8 * 60 * 60 * 1000)
  const recentActivity = recentLogs?.filter(
    log => new Date(log.logged_at) > eightHoursAgo
  ) || []

  const feedingLogs = recentActivity.filter(l => l.log_type === 'feeding')
  const diaperLogs = recentActivity.filter(l => l.log_type === 'diaper')
  const sleepLogs = recentActivity.filter(l => l.log_type === 'sleep')
  const medicineLogs = recentActivity.filter(l => l.log_type === 'medicine')

  // Check for any alerts
  const alerts: string[] = []
  if (shiftData?.last_feeding) {
    const hoursSinceFeeding = (now - new Date(shiftData.last_feeding.logged_at).getTime()) / (1000 * 60 * 60)
    if (hoursSinceFeeding > 4) {
      alerts.push(`Last feeding was ${formatDistanceToNow(new Date(shiftData.last_feeding.logged_at))} ago`)
    }
  }
  if (shiftData?.last_diaper) {
    const hoursSinceDiaper = (now - new Date(shiftData.last_diaper.logged_at).getTime()) / (1000 * 60 * 60)
    if (hoursSinceDiaper > 3) {
      alerts.push(`Last diaper change was ${formatDistanceToNow(new Date(shiftData.last_diaper.logged_at))} ago`)
    }
  }

  return (
    <div className="space-y-4 mt-4">
      {/* Handoff participants */}
      <div className="flex items-center justify-center gap-4">
        <div className="text-center">
          <Avatar className="h-12 w-12 mx-auto mb-1">
            <AvatarImage src={currentUser?.avatar_url} />
            <AvatarFallback className="font-display">{currentUser?.full_name?.charAt(0) || 'Y'}</AvatarFallback>
          </Avatar>
          <p className="font-body text-xs text-[--muted]">You</p>
        </div>
        <ArrowRightLeft className="h-5 w-5 text-[--dim]" />
        <div className="text-center">
          <Avatar className="h-12 w-12 mx-auto mb-1">
            <AvatarImage src={partner?.avatar_url} />
            <AvatarFallback className="font-display">{partner?.full_name?.charAt(0) || 'P'}</AvatarFallback>
          </Avatar>
          <p className="font-body text-xs text-[--muted]">{partner?.full_name?.split(' ')[0] || 'Partner'}</p>
        </div>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <Card className="bg-gold/10 border-gold/30">
          <CardContent className="py-3">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-gold mt-0.5" />
              <div>
                <p className="font-ui text-sm font-medium text-gold">Heads Up</p>
                <ul className="font-body text-xs text-gold/80 mt-1 space-y-1">
                  {alerts.map((alert, i) => (
                    <li key={i}>• {alert}</li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3">
        <ShiftStat
          icon={Milk}
          iconColor="text-blue-400"
          label="Last Feeding"
          value={shiftData?.last_feeding
            ? formatDistanceToNow(new Date(shiftData.last_feeding.logged_at), { addSuffix: true })
            : 'No logs'}
          subValue={`${feedingLogs.length} in last 8hrs`}
        />
        <ShiftStat
          icon={Baby}
          iconColor="text-gold"
          label="Last Diaper"
          value={shiftData?.last_diaper
            ? formatDistanceToNow(new Date(shiftData.last_diaper.logged_at), { addSuffix: true })
            : 'No logs'}
          subValue={`${diaperLogs.length} in last 8hrs`}
        />
        <ShiftStat
          icon={Moon}
          iconColor="text-purple-400"
          label="Last Sleep"
          value={shiftData?.last_sleep
            ? formatDistanceToNow(new Date(shiftData.last_sleep.logged_at), { addSuffix: true })
            : 'No logs'}
          subValue={`${shiftData?.total_sleep_hours_today || 0}h total today`}
        />
        <ShiftStat
          icon={Pill}
          iconColor="text-sage"
          label="Medicine"
          value={medicineLogs.length > 0 ? 'Given' : 'None logged'}
          subValue={medicineLogs.length > 0
            ? (medicineLogs[0].log_data as Record<string, string>)?.name || ''
            : 'In last 8hrs'}
        />
      </div>

      {/* Recent Activity Timeline */}
      <Card className="bg-[--card]/50 border-[--border]">
        <CardHeader className="pb-2">
          <CardTitle className="font-ui text-sm font-semibold text-[11px] uppercase tracking-[0.12em] text-[--muted]">Recent Activity (8hrs)</CardTitle>
        </CardHeader>
        <CardContent className="max-h-48 overflow-y-auto">
          {recentActivity.length > 0 ? (
            <div className="space-y-2">
              {recentActivity.slice(0, 8).map((log, i) => (
                <div key={log.id} className="flex items-center gap-2 font-body text-xs">
                  <span className="text-[--dim] w-14">
                    {format(new Date(log.logged_at), 'h:mm a')}
                  </span>
                  <Badge variant="outline" className="font-ui capitalize text-xs">
                    {log.log_type.replace('_', ' ')}
                  </Badge>
                  {log.notes && (
                    <span className="text-[--muted] truncate">{log.notes}</span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="font-body text-[--dim] text-sm text-center py-4">
              No activity in the last 8 hours
            </p>
          )}
        </CardContent>
      </Card>

      {/* Handoff Complete */}
      <Button className="w-full gap-2 font-ui font-semibold">
        <CheckCircle className="h-4 w-4" />
        Confirm Handoff
      </Button>
    </div>
  )
}

function ShiftStat({
  icon: Icon,
  iconColor,
  label,
  value,
  subValue,
}: {
  icon: React.ElementType
  iconColor: string
  label: string
  value: string
  subValue: string
}) {
  return (
    <div className="bg-[--card] rounded-lg p-3">
      <div className="flex items-center gap-2 mb-1">
        <Icon className={cn("h-4 w-4", iconColor)} />
        <span className="font-ui text-xs text-[--muted]">{label}</span>
      </div>
      <p className="font-body text-sm font-medium text-white">{value}</p>
      <p className="font-body text-xs text-[--dim]">{subValue}</p>
    </div>
  )
}

export function ShiftChangeCard() {
  return (
    <Card className="bg-[--surface] border-[--border]">
      <CardHeader className="pb-2">
        <CardTitle className="font-display text-lg flex items-center gap-2">
          <ArrowRightLeft className="h-5 w-5 text-copper" />
          Shift Handoff
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="font-body text-sm text-[--muted] mb-4">
          Use the shift change feature to give your partner a quick summary when they take over.
        </p>
        <ShiftChangeButton />
      </CardContent>
    </Card>
  )
}
