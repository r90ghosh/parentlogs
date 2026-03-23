'use client'

import { useState } from 'react'
import { useTrackerLogs, useDeleteLog } from '@/hooks/use-tracker'
import { useRequirePremium } from '@/hooks/use-subscription'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
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
import {
  ArrowLeft,
  Trash,
  Filter,
} from 'lucide-react'
import Link from 'next/link'
import { format, isToday, isYesterday } from 'date-fns'
import { cn } from '@/lib/utils'
import { BASIC_LOG_TYPES, PREMIUM_LOG_TYPES, type LogType } from '@tdc/services'
import { LOG_TYPE_CONFIG } from '@/lib/tracker-constants'
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
      <div className="p-4 space-y-4 max-w-2xl">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/tracker">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-xl font-bold font-display text-[--cream]">Log History</h1>
        </div>
        <PaywallOverlay
          feature="tracker_history"
          message="Upgrade to Premium to view your complete log history and track patterns over time."
        />
      </div>
    )
  }

  return (
    <div className="p-4 space-y-4 max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/tracker">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <h1 className="text-xl font-bold font-display text-[--cream] flex-1">Log History</h1>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-[--muted]" />
        <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as any)}>
          <SelectTrigger className="w-40 bg-[--card] border-[--border]">
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
        <div className="space-y-6">
          {Object.entries(groupedLogs).map(([date, dateLogs]) => (
            <div key={date}>
              <h3 className="text-sm font-medium font-ui text-[--muted] mb-2">
                {formatDateHeader(date)}
              </h3>
              <div className="space-y-2">
                {dateLogs.map((log) => {
                  const config = LOG_TYPE_CONFIG[log.log_type as LogType]
                  return (
                    <div
                      key={log.id}
                      className="flex items-center gap-3 p-3 rounded-lg bg-[--surface] border border-[--border]"
                    >
                      <div className={cn("p-2 rounded-lg", config?.bgColor)}>
                        {config && <config.icon className={cn("h-4 w-4", config.color)} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium font-ui text-[--cream] capitalize">
                            {log.log_type.replace('_', ' ')}
                          </p>
                          <span className="text-xs font-ui text-[--dim]">
                            {format(new Date(log.logged_at), 'h:mm a')}
                          </span>
                        </div>
                        <p className="text-xs font-body text-[--muted]">
                          {formatLogDetails(log)}
                          {log.notes && ` • ${log.notes}`}
                        </p>
                      </div>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-[--dim] hover:text-coral">
                            <Trash className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-[--surface] border-[--border]">
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Log?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(log.id)}
                              className="bg-coral hover:bg-coral/80"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Card className="bg-[--surface] border-[--border] shadow-card">
          <CardContent className="py-12 text-center">
            <p className="text-[--muted] font-body">No logs found</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
