'use client'

import { useState } from 'react'
import { useTrackerLogs, useDeleteLog } from '@/hooks/use-tracker'
import { useRequirePremium } from '@/hooks/use-subscription'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { PaywallOverlay } from '@/components/shared/paywall-overlay'
import { ArrowLeft, Trash, Filter } from 'lucide-react'
import Link from 'next/link'
import { format, isToday, isYesterday } from 'date-fns'
import { cn } from '@/lib/utils'
import { BASIC_LOG_TYPES, PREMIUM_LOG_TYPES, type LogType } from '@tdc/services'
import { LOG_TYPE_CONFIG } from '@/lib/tracker-constants'
import { Panel } from '@/components/digest'
import { usePageHeader } from '@/components/layouts/topbar-context'
import { useToast } from '@/hooks/use-toast'

export default function HistoryClient() {
  const { isPremium } = useRequirePremium()
  const { toast } = useToast()
  const deleteLog = useDeleteLog()

  const [typeFilter, setTypeFilter] = useState<LogType | 'all'>('all')

  const { data: logs, isLoading } = useTrackerLogs({
    log_type: typeFilter === 'all' ? undefined : typeFilter,
    limit: 100,
  })

  usePageHeader({ title: 'History' }, [])

  // Group logs by date
  const groupedLogs = logs?.reduce((groups, log) => {
    const date = new Date(log.logged_at).toDateString()
    if (!groups[date]) groups[date] = []
    groups[date].push(log)
    return groups
  }, {} as Record<string, typeof logs>) || {}

  const handleDelete = async (id: string) => {
    await deleteLog.mutateAsync(id)
    toast({ title: 'Log deleted' })
  }

  const formatDateHeader = (dateStr: string) => {
    const date = new Date(dateStr)
    if (isToday(date)) return 'Today'
    if (isYesterday(date)) return 'Yesterday'
    return format(date, 'EEEE, MMMM d')
  }

  const formatLogDetails = (log: any) => {
    const details = log.log_data || {}
    switch (log.log_type) {
      case 'feeding':
        if (details.type === 'breast') {
          return `${details.side} side, ${details.duration_minutes}min`
        }
        return `${details.amount_oz}oz ${details.type}`
      case 'diaper':
        return details.type
      case 'sleep':
        return `${details.duration_minutes}min (${details.quality})`
      case 'temperature':
        return `${details.value}°${details.unit}`
      case 'medicine':
        return `${details.name} - ${details.dosage}`
      case 'mood':
        const moods = ['😢', '😕', '😐', '😊', '😄']
        return moods[details.level - 1] || ''
      case 'weight':
        return `${details.value} ${details.unit}`
      case 'height':
        return `${details.value} ${details.unit}`
      case 'milestone':
        return details.name
      default:
        return ''
    }
  }

  if (!isPremium) {
    return (
      <div className="mx-auto max-w-2xl">
        <Link
          href="/tracker"
          className="mb-5 inline-flex items-center gap-1.5 text-sm font-bold text-clay-ink hover:opacity-80"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>
        <PaywallOverlay
          feature="tracker_history"
          message="Upgrade to Premium to view your complete log history and track patterns over time."
        />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href="/tracker"
        className="mb-5 inline-flex items-center gap-1.5 text-sm font-bold text-clay-ink hover:opacity-80"
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </Link>

      {/* Filter */}
      <div className="mb-5 flex items-center gap-2">
        <Filter className="h-4 w-4 text-mute" />
        <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as any)}>
          <SelectTrigger className="w-40 border-line bg-card">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {[...BASIC_LOG_TYPES, ...PREMIUM_LOG_TYPES].map((type) => (
              <SelectItem key={type} value={type}>
                {LOG_TYPE_CONFIG[type].label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Logs List */}
      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-16" />
          <Skeleton className="h-16" />
          <Skeleton className="h-16" />
        </div>
      ) : logs && logs.length > 0 ? (
        <div className="space-y-2">
          {Object.entries(groupedLogs).map(([date, dateLogs]) => (
            <div key={date}>
              <div className="mb-3 mt-7 text-[11px] font-bold uppercase tracking-[1.5px] text-faint first:mt-0">
                {formatDateHeader(date)}
              </div>
              <Panel>
                {dateLogs.map((log) => {
                  const config = LOG_TYPE_CONFIG[log.log_type as LogType]
                  return (
                    <div
                      key={log.id}
                      className="flex items-center gap-3.5 border-b border-line2 px-[18px] py-[15px] last:border-b-0"
                    >
                      <div className={cn('grid h-9 w-9 flex-none place-items-center rounded-full', config?.bgColor)}>
                        {config && <config.icon className={cn('h-[18px] w-[18px]', config.color)} />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-[15px] font-semibold capitalize text-ink">
                            {log.log_type.replace('_', ' ')}
                          </p>
                          <span className="text-[12px] font-medium text-faint">
                            {format(new Date(log.logged_at), 'h:mm a')}
                          </span>
                        </div>
                        <p className="mt-0.5 text-[12.5px] font-medium text-mute">
                          {formatLogDetails(log)}
                          {log.notes && ` • ${log.notes}`}
                        </p>
                      </div>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="flex-none text-faint hover:text-danger">
                            <Trash className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="border-line bg-card">
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Log?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(log.id)} className="bg-danger hover:opacity-90">
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  )
                })}
              </Panel>
            </div>
          ))}
        </div>
      ) : (
        <Panel className="p-12 text-center">
          <p className="text-[15px] text-mute">No logs found</p>
        </Panel>
      )}
    </div>
  )
}
