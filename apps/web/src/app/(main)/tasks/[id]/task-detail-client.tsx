'use client'

import { useParams, useRouter } from 'next/navigation'
import { useTask, useCompleteTask, useSnoozeTask, useSkipTask, useDeleteTask } from '@/hooks/use-tasks'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
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
import {
  ArrowLeft,
  Check,
  Clock,
  SkipForward,
  Trash,
  Calendar,
  User,
  Tag,
} from 'lucide-react'
import { format, addDays } from 'date-fns'
import Link from 'next/link'
import { useToast } from '@/hooks/use-toast'

export default function TaskDetailClient() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()

  const { data: task, isLoading } = useTask(params.id as string)
  const completeTask = useCompleteTask()
  const snoozeTask = useSnoozeTask()
  const skipTask = useSkipTask()
  const deleteTask = useDeleteTask()

  if (isLoading) {
    return (
      <div className="p-4 space-y-4 max-w-2xl">
        <Skeleton className="h-8 w-48 bg-[--card]" />
        <Skeleton className="h-48 w-full bg-[--card]" />
      </div>
    )
  }

  if (!task) {
    return (
      <div className="p-4">
        <p className="text-[--muted] font-body">Task not found</p>
      </div>
    )
  }

  const handleComplete = async () => {
    await completeTask.mutateAsync(task.id)
    toast({ title: 'Task completed!' })
  }

  const handleSnooze = async (days: number) => {
    const until = addDays(new Date(), days).toISOString().split('T')[0]
    await snoozeTask.mutateAsync({ id: task.id, until })
    toast({ title: `Task snoozed for ${days} days` })
  }

  const handleSkip = async () => {
    await skipTask.mutateAsync(task.id)
    toast({ title: 'Task skipped' })
    router.push('/tasks')
  }

  const handleDelete = async () => {
    await deleteTask.mutateAsync(task.id)
    toast({ title: 'Task deleted' })
    router.push('/tasks')
  }

  return (
    <div className="p-4 space-y-4 max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/tasks">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <h1 className="text-xl font-display font-bold text-[--cream] flex-1">{task.title}</h1>
      </div>

      {/* Status Badge */}
      <div className="flex items-center gap-2">
        <Badge variant={task.status === 'completed' ? 'default' : 'outline'} className="font-ui">
          {task.status}
        </Badge>
        {task.priority === 'must-do' && (
          <Badge variant="destructive" className="font-ui">Must-Do</Badge>
        )}
      </div>

      {/* Details Card */}
      <Card className="bg-[--surface] border-[--border]">
        <CardContent className="pt-6 space-y-4">
          <p className="text-[--cream] font-body">{task.description}</p>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-[--muted]" />
              <span className="text-[--muted] font-body">Due:</span>
              <span className="text-[--cream] font-body">{format(new Date(task.due_date), 'MMMM d, yyyy')}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-[--muted]" />
              <span className="text-[--muted] font-body">Assigned to:</span>
              <span className="text-[--cream] font-body capitalize">{task.assigned_to}</span>
            </div>
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-[--muted]" />
              <span className="text-[--muted] font-body">Category:</span>
              <span className="text-[--cream] font-body">{task.category}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      {task.status === 'pending' && (
        <div className="space-y-3">
          <Button
            className="w-full bg-sage hover:bg-sage/90 text-[--bg] font-ui font-semibold"
            onClick={handleComplete}
            disabled={completeTask.isPending}
          >
            <Check className="h-4 w-4 mr-2" />
            Mark Complete
          </Button>

          <div className="grid grid-cols-3 gap-2">
            <Button
              variant="outline"
              onClick={() => handleSnooze(1)}
              disabled={snoozeTask.isPending}
              className="border-[--border-hover] hover:bg-[--card] font-ui"
            >
              <Clock className="h-4 w-4 mr-1" />
              +1 Day
            </Button>
            <Button
              variant="outline"
              onClick={() => handleSnooze(3)}
              disabled={snoozeTask.isPending}
              className="border-[--border-hover] hover:bg-[--card] font-ui"
            >
              <Clock className="h-4 w-4 mr-1" />
              +3 Days
            </Button>
            <Button
              variant="outline"
              onClick={() => handleSnooze(7)}
              disabled={snoozeTask.isPending}
              className="border-[--border-hover] hover:bg-[--card] font-ui"
            >
              <Clock className="h-4 w-4 mr-1" />
              +1 Week
            </Button>
          </div>

          <div className="flex gap-2">
            <Button
              variant="ghost"
              className="flex-1 text-[--muted] hover:text-[--cream] hover:bg-[--card] font-ui"
              onClick={handleSkip}
              disabled={skipTask.isPending}
            >
              <SkipForward className="h-4 w-4 mr-2" />
              Skip Task
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" className="text-coral hover:bg-coral-dim font-ui">
                  <Trash className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-[--surface] border-[--border]">
                <AlertDialogHeader>
                  <AlertDialogTitle className="font-display text-[--cream]">Delete Task?</AlertDialogTitle>
                  <AlertDialogDescription className="font-body text-[--muted]">
                    This action cannot be undone. This will permanently delete the task.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="border-[--border-hover] font-ui">Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} className="bg-coral hover:bg-coral/90 text-[--bg] font-ui">
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      )}
    </div>
  )
}
