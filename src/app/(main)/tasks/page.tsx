'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useTasks, useCompleteTask } from '@/hooks/use-tasks'
import { useRequirePremium } from '@/hooks/use-require-auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Plus,
  Search,
  Filter,
  ChevronRight,
  AlertCircle,
  Clock,
  Lock,
} from 'lucide-react'
import { format, isPast, isToday, isTomorrow, addDays } from 'date-fns'
import { cn } from '@/lib/utils'
import { FamilyTask } from '@/types'
import { PaywallBanner } from '@/components/shared/paywall-banner'

export default function TasksPage() {
  const [statusFilter, setStatusFilter] = useState<string>('pending')
  const [search, setSearch] = useState('')
  const { isPremium } = useRequirePremium()

  const { data: tasks, isLoading } = useTasks({
    status: statusFilter as any,
    search: search || undefined,
  })

  const completeTask = useCompleteTask()

  const groupedTasks = groupTasksByDate(tasks || [])

  return (
    <div className="p-4 md:ml-64 space-y-4 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Tasks</h1>
        <Button asChild>
          <Link href="/tasks/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </Link>
        </Button>
      </div>

      {/* Premium Banner */}
      {!isPremium && (
        <PaywallBanner
          message="Free users can only see tasks within 14 days. Upgrade to see your complete timeline."
          feature="tasks_beyond_14_days"
        />
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-surface-400" />
        <Input
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 bg-surface-900 border-surface-700"
        />
      </div>

      {/* Filters */}
      <Tabs value={statusFilter} onValueChange={setStatusFilter}>
        <TabsList className="bg-surface-900">
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="all">All</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Task List */}
      {isLoading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : tasks && tasks.length > 0 ? (
        <div className="space-y-6">
          {Object.entries(groupedTasks).map(([dateGroup, groupTasks]) => (
            <div key={dateGroup}>
              <h3 className="text-sm font-medium text-surface-400 mb-2">{dateGroup}</h3>
              <div className="space-y-2">
                {groupTasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onComplete={() => completeTask.mutate(task.id)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-surface-400">No tasks found</p>
        </div>
      )}
    </div>
  )
}

function TaskItem({ task, onComplete }: { task: FamilyTask; onComplete: () => void }) {
  const isOverdue = isPast(new Date(task.due_date)) && task.status === 'pending'

  return (
    <div className={cn(
      "flex items-center gap-3 p-4 rounded-lg bg-surface-900 border transition-colors",
      isOverdue ? "border-red-500/50" : "border-surface-800"
    )}>
      <Checkbox
        checked={task.status === 'completed'}
        onCheckedChange={() => {
          if (task.status !== 'completed') onComplete()
        }}
        disabled={task.status === 'completed'}
      />

      <Link href={`/tasks/${task.id}`} className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className={cn(
            "font-medium truncate",
            task.status === 'completed' ? "text-surface-500 line-through" : "text-white"
          )}>
            {task.title}
          </p>
          {task.priority === 'must-do' && (
            <Badge variant="destructive" className="text-xs">Must-Do</Badge>
          )}
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span className={cn(
            "text-xs",
            isOverdue ? "text-red-400" : "text-surface-400"
          )}>
            {formatDueDate(task.due_date)}
          </span>
          <Badge variant="outline" className="text-xs">{task.category}</Badge>
        </div>
      </Link>

      <ChevronRight className="h-4 w-4 text-surface-500" />
    </div>
  )
}

function groupTasksByDate(tasks: FamilyTask[]): Record<string, FamilyTask[]> {
  const groups: Record<string, FamilyTask[]> = {}

  tasks.forEach(task => {
    const date = new Date(task.due_date)
    let group: string

    if (isPast(date) && !isToday(date)) {
      group = 'Overdue'
    } else if (isToday(date)) {
      group = 'Today'
    } else if (isTomorrow(date)) {
      group = 'Tomorrow'
    } else if (date <= addDays(new Date(), 7)) {
      group = 'This Week'
    } else {
      group = format(date, 'MMMM yyyy')
    }

    if (!groups[group]) groups[group] = []
    groups[group].push(task)
  })

  return groups
}

function formatDueDate(date: string) {
  const d = new Date(date)
  if (isToday(d)) return 'Today'
  if (isTomorrow(d)) return 'Tomorrow'
  if (isPast(d)) return `Overdue - ${format(d, 'MMM d')}`
  return format(d, 'MMM d')
}
