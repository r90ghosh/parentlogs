'use client'

import { useState } from 'react'
import { useTrackerLogs, useDeleteLog } from '@/hooks/use-tracker'
import { useRequirePremium } from '@/hooks/use-require-auth'
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
  Trash,
  Filter,
} from 'lucide-react'
import Link from 'next/link'
import { format, isToday, isYesterday } from 'date-fns'
import { cn } from '@/lib/utils'
import { LogType, BASIC_LOG_TYPES, PREMIUM_LOG_TYPES } from '@/services/tracker-service'
import { useToast } from '@/hooks/use-toast'

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

export default function TrackerHistoryPage() {
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
          <h1 className="text-xl font-bold text-white">Log History</h1>
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
        <h1 className="text-xl font-bold text-white flex-1">Log History</h1>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-surface-400" />
        <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as any)}>
          <SelectTrigger className="w-40 bg-surface-800 border-surface-700">
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
              <h3 className="text-sm font-medium text-surface-400 mb-2">
                {formatDateHeader(date)}
              </h3>
              <div className="space-y-2">
                {dateLogs.map((log) => {
                  const config = LOG_TYPE_CONFIG[log.log_type as LogType]
                  return (
                    <div
                      key={log.id}
                      className="flex items-center gap-3 p-3 rounded-lg bg-surface-900 border border-surface-800"
                    >
                      <div className={cn("p-2 rounded-lg", config?.bgColor)}>
                        {config && <config.icon className={cn("h-4 w-4", config.color)} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-white capitalize">
                            {log.log_type.replace('_', ' ')}
                          </p>
                          <span className="text-xs text-surface-500">
                            {format(new Date(log.logged_at), 'h:mm a')}
                          </span>
                        </div>
                        <p className="text-xs text-surface-400">
                          {formatLogDetails(log)}
                          {log.notes && ` • ${log.notes}`}
                        </p>
                      </div>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-surface-500 hover:text-red-500">
                            <Trash className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-surface-900 border-surface-800">
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
                              className="bg-red-600 hover:bg-red-700"
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
        <Card className="bg-surface-900 border-surface-800">
          <CardContent className="py-12 text-center">
            <p className="text-surface-400">No logs found</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
