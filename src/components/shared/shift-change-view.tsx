'use client'

import { useState } from 'react'
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
        <Button variant="outline" size="sm" className="gap-2">
          <ArrowRightLeft className="h-4 w-4" />
          Shift Change
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-surface-900 border-surface-800 max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-accent-500" />
            Shift Handoff
          </DialogTitle>
          <DialogDescription>
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

  // Group logs by type for the last 8 hours
  const eightHoursAgo = new Date(Date.now() - 8 * 60 * 60 * 1000)
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
    const hoursSinceFeeding = (Date.now() - new Date(shiftData.last_feeding.logged_at).getTime()) / (1000 * 60 * 60)
    if (hoursSinceFeeding > 4) {
      alerts.push(`Last feeding was ${formatDistanceToNow(new Date(shiftData.last_feeding.logged_at))} ago`)
    }
  }
  if (shiftData?.last_diaper) {
    const hoursSinceDiaper = (Date.now() - new Date(shiftData.last_diaper.logged_at).getTime()) / (1000 * 60 * 60)
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
            <AvatarFallback>{currentUser?.full_name?.charAt(0) || 'Y'}</AvatarFallback>
          </Avatar>
          <p className="text-xs text-surface-400">You</p>
        </div>
        <ArrowRightLeft className="h-5 w-5 text-surface-500" />
        <div className="text-center">
          <Avatar className="h-12 w-12 mx-auto mb-1">
            <AvatarImage src={partner?.avatar_url} />
            <AvatarFallback>{partner?.full_name?.charAt(0) || 'P'}</AvatarFallback>
          </Avatar>
          <p className="text-xs text-surface-400">{partner?.full_name?.split(' ')[0] || 'Partner'}</p>
        </div>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <Card className="bg-amber-500/10 border-amber-500/30">
          <CardContent className="py-3">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-400">Heads Up</p>
                <ul className="text-xs text-amber-300/80 mt-1 space-y-1">
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
          iconColor="text-amber-400"
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
          iconColor="text-green-400"
          label="Medicine"
          value={medicineLogs.length > 0 ? 'Given' : 'None logged'}
          subValue={medicineLogs.length > 0
            ? (medicineLogs[0].log_data as Record<string, any>)?.name || ''
            : 'In last 8hrs'}
        />
      </div>

      {/* Recent Activity Timeline */}
      <Card className="bg-surface-800/50 border-surface-700">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Recent Activity (8hrs)</CardTitle>
        </CardHeader>
        <CardContent className="max-h-48 overflow-y-auto">
          {recentActivity.length > 0 ? (
            <div className="space-y-2">
              {recentActivity.slice(0, 8).map((log, i) => (
                <div key={log.id} className="flex items-center gap-2 text-xs">
                  <span className="text-surface-500 w-14">
                    {format(new Date(log.logged_at), 'h:mm a')}
                  </span>
                  <Badge variant="outline" className="capitalize text-xs">
                    {log.log_type.replace('_', ' ')}
                  </Badge>
                  {log.notes && (
                    <span className="text-surface-400 truncate">{log.notes}</span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-surface-500 text-sm text-center py-4">
              No activity in the last 8 hours
            </p>
          )}
        </CardContent>
      </Card>

      {/* Handoff Complete */}
      <Button className="w-full gap-2">
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
  icon: any
  iconColor: string
  label: string
  value: string
  subValue: string
}) {
  return (
    <div className="bg-surface-800 rounded-lg p-3">
      <div className="flex items-center gap-2 mb-1">
        <Icon className={cn("h-4 w-4", iconColor)} />
        <span className="text-xs text-surface-400">{label}</span>
      </div>
      <p className="text-sm font-medium text-white">{value}</p>
      <p className="text-xs text-surface-500">{subValue}</p>
    </div>
  )
}

export function ShiftChangeCard() {
  return (
    <Card className="bg-surface-900 border-surface-800">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <ArrowRightLeft className="h-5 w-5 text-accent-500" />
          Shift Handoff
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-surface-400 mb-4">
          Use the shift change feature to give your partner a quick summary when they take over.
        </p>
        <ShiftChangeButton />
      </CardContent>
    </Card>
  )
}
