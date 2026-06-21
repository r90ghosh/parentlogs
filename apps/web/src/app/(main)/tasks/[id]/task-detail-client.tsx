'use client'

import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { format, addDays } from 'date-fns'
import { ArrowLeft, Check, Clock, SkipForward, Trash } from 'lucide-react'
import type { TaskAssignee } from '@tdc/shared/types'
import { useTask, useCompleteTask, useSnoozeTask, useSkipTask, useDeleteTask } from '@/hooks/use-tasks'
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
import { Panel, Badge } from '@/components/digest'
import { usePageHeader } from '@/components/layouts/topbar-context'
import { useToast } from '@/hooks/use-toast'

const assigneeColor: Record<TaskAssignee, string> = {
  dad: 'var(--sky)',
  mom: 'var(--rose)',
  both: 'var(--gold)',
  either: 'var(--muted)',
}

export default function TaskDetailClient() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()

  const { data: task, isLoading } = useTask(params.id as string)
  const completeTask = useCompleteTask()
  const snoozeTask = useSnoozeTask()
  const skipTask = useSkipTask()
  const deleteTask = useDeleteTask()

  usePageHeader({ title: 'Task' }, [])

  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl space-y-4">
        <div className="h-8 w-48 animate-pulse rounded bg-card2" />
        <div className="h-48 w-full animate-pulse rounded-[18px] bg-card2" />
      </div>
    )
  }

  if (!task) {
    return <p className="text-[15px] text-mute">Task not found.</p>
  }

  const handleComplete = async () => {
    await completeTask.mutateAsync(task.id)
    toast({ title: 'Task completed!' })
    router.push('/tasks')
  }
  const handleSnooze = async (days: number) => {
    const until = addDays(new Date(), days).toISOString().split('T')[0]
    await snoozeTask.mutateAsync({ id: task.id, until })
    toast({ title: `Snoozed ${days} ${days === 1 ? 'day' : 'days'}` })
    router.push('/tasks')
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

  const aColor = assigneeColor[task.assigned_to] ?? assigneeColor.either
  const isPending = task.status === 'pending'

  const detailSections = [
    { label: 'Description', body: task.description },
    { label: 'Why it matters', body: task.why_it_matters },
    { label: 'Notes', body: task.notes },
  ].filter((s) => s.body && s.body.trim().length > 0)

  return (
    <div className="mx-auto max-w-2xl">
      <Link href="/tasks" className="mb-5 inline-flex items-center gap-1.5 text-sm font-bold text-clay-ink hover:opacity-80">
        <ArrowLeft className="h-4 w-4" /> Tasks
      </Link>

      <h1 className="text-[26px] font-extrabold leading-[1.2] tracking-[-0.4px] text-ink">{task.title}</h1>

      <div className="mt-3 flex flex-wrap items-center gap-2.5 text-[12.5px]">
        <span className="inline-flex items-center gap-1.5 font-bold uppercase tracking-[0.4px]" style={{ color: aColor }}>
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: aColor }} />
          {task.assigned_to}
        </span>
        <span className="text-faint">·</span>
        <span className="font-medium capitalize text-mute">{task.category}</span>
        <span className="text-faint">·</span>
        <span className="font-semibold text-mute">Due {format(new Date(task.due_date), 'MMM d, yyyy')}</span>
        {task.priority === 'must-do' && <Badge tone="clay">Must-do</Badge>}
        {!isPending && <Badge tone="sage">{task.status}</Badge>}
      </div>

      {detailSections.map((s) => (
        <Panel key={s.label} className="mt-4 p-[22px]">
          <div className="text-[11px] font-bold uppercase tracking-[1.6px] text-faint">{s.label}</div>
          <p className="mt-3 whitespace-pre-line text-[15.5px] leading-[1.65] text-ink2">{s.body}</p>
        </Panel>
      ))}

      {isPending && (
        <div className="mt-6 space-y-3">
          <button
            onClick={handleComplete}
            disabled={completeTask.isPending}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-clay px-5 py-3 text-[15px] font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            <Check className="h-4 w-4" /> Mark complete
          </button>

          <div className="grid grid-cols-3 gap-2">
            {[1, 3, 7].map((d) => (
              <button
                key={d}
                onClick={() => handleSnooze(d)}
                disabled={snoozeTask.isPending}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-line bg-card px-3 py-2.5 text-[13.5px] font-bold text-ink2 transition-colors hover:bg-card-hover"
              >
                <Clock className="h-3.5 w-3.5" /> {d === 7 ? '1 wk' : `${d}d`}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleSkip}
              disabled={skipTask.isPending}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-[13.5px] font-bold text-mute transition-colors hover:bg-card-hover"
            >
              <SkipForward className="h-4 w-4" /> Skip
            </button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-[13.5px] font-bold text-danger transition-colors hover:bg-danger/10">
                  <Trash className="h-4 w-4" /> Delete
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete task?</AlertDialogTitle>
                  <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} className="bg-danger text-white hover:opacity-90">
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
