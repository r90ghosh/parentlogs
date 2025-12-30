'use client'

import { useAuth } from '@/lib/auth/auth-context'
import { useFamily } from '@/hooks/use-family'
import { useTasks } from '@/hooks/use-tasks'
import { useCurrentBriefing } from '@/hooks/use-briefings'
import { useShiftBriefing } from '@/hooks/use-tracker'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import Link from 'next/link'
import {
  CheckSquare,
  FileText,
  Baby,
  DollarSign,
  ChevronRight,
  Clock,
  AlertCircle,
} from 'lucide-react'
import { format, isToday, isTomorrow, isPast } from 'date-fns'

export default function DashboardPage() {
  const { profile } = useAuth()
  const { data: family, isLoading: familyLoading } = useFamily()
  const { data: tasks, isLoading: tasksLoading } = useTasks({ limit: 5, status: 'pending' })
  const { data: briefing, isLoading: briefingLoading } = useCurrentBriefing()
  const { data: shiftData } = useShiftBriefing()

  const greeting = getGreeting()
  const firstName = profile?.full_name?.split(' ')[0] || 'there'

  return (
    <div className="p-4 md:ml-64 space-y-6 max-w-4xl">
      {/* Welcome Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">
          {greeting}, {firstName}
        </h1>
        {family && (
          <p className="text-surface-400 mt-1">
            {family.stage === 'pregnancy'
              ? `Week ${family.current_week} of pregnancy`
              : `${family.baby_name || 'Baby'} is ${family.current_week} weeks old`
            }
          </p>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-4 gap-3">
        <QuickActionButton
          icon={Baby}
          label="Log Feed"
          href="/tracker/log?type=feeding"
          color="text-blue-400"
        />
        <QuickActionButton
          icon={Baby}
          label="Log Diaper"
          href="/tracker/log?type=diaper"
          color="text-amber-400"
        />
        <QuickActionButton
          icon={Baby}
          label="Log Sleep"
          href="/tracker/log?type=sleep"
          color="text-purple-400"
        />
        <QuickActionButton
          icon={CheckSquare}
          label="Add Task"
          href="/tasks/new"
          color="text-accent-400"
        />
      </div>

      {/* Shift Briefing (post-birth only) */}
      {family?.stage === 'post-birth' && shiftData && (
        <Card className="bg-surface-900 border-surface-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5 text-accent-500" />
              Shift Briefing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-surface-400">Last feeding:</span>
                <p className="text-white">
                  {shiftData.last_feeding
                    ? formatTimeAgo(shiftData.last_feeding.logged_at)
                    : 'No logs today'}
                </p>
              </div>
              <div>
                <span className="text-surface-400">Last diaper:</span>
                <p className="text-white">
                  {shiftData.last_diaper
                    ? formatTimeAgo(shiftData.last_diaper.logged_at)
                    : 'No logs today'}
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="mt-3 w-full" asChild>
              <Link href="/tracker">View Full Briefing</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Weekly Briefing Card */}
      <Card className="bg-surface-900 border-surface-800">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary-500" />
              This Week's Briefing
            </CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/briefing" className="flex items-center gap-1">
                View <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {briefingLoading ? (
            <Skeleton className="h-20 w-full" />
          ) : briefing ? (
            <div>
              <h3 className="font-medium text-white mb-2">{briefing.title}</h3>
              <p className="text-sm text-surface-300 line-clamp-2">
                {briefing.baby_update}
              </p>
            </div>
          ) : (
            <p className="text-surface-400 text-sm">No briefing available for this week.</p>
          )}
        </CardContent>
      </Card>

      {/* Tasks Due Card */}
      <Card className="bg-surface-900 border-surface-800">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <CheckSquare className="h-5 w-5 text-accent-500" />
              Upcoming Tasks
            </CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/tasks" className="flex items-center gap-1">
                All <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {tasksLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : tasks && tasks.length > 0 ? (
            <div className="space-y-2">
              {tasks.map((task) => (
                <Link
                  key={task.id}
                  href={`/tasks/${task.id}`}
                  className="flex items-center justify-between p-3 rounded-lg bg-surface-800 hover:bg-surface-700 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{task.title}</p>
                    <p className="text-xs text-surface-400">
                      {formatDueDate(task.due_date)}
                    </p>
                  </div>
                  {isPast(new Date(task.due_date)) && task.status === 'pending' && (
                    <AlertCircle className="h-4 w-4 text-red-500 ml-2" />
                  )}
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-surface-400 text-sm">No upcoming tasks!</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function QuickActionButton({
  icon: Icon,
  label,
  href,
  color
}: {
  icon: any
  label: string
  href: string
  color: string
}) {
  return (
    <Link
      href={href}
      className="flex flex-col items-center gap-2 p-3 rounded-lg bg-surface-900 border border-surface-800 hover:bg-surface-800 transition-colors"
    >
      <Icon className={`h-6 w-6 ${color}`} />
      <span className="text-xs text-surface-300">{label}</span>
    </Link>
  )
}

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

function formatDueDate(date: string) {
  const d = new Date(date)
  if (isToday(d)) return 'Due today'
  if (isTomorrow(d)) return 'Due tomorrow'
  if (isPast(d)) return `Overdue - ${format(d, 'MMM d')}`
  return `Due ${format(d, 'MMM d')}`
}

function formatTimeAgo(timestamp: string) {
  const diff = Date.now() - new Date(timestamp).getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)

  if (minutes < 60) return `${minutes}m ago`
  return `${hours}h ago`
}
