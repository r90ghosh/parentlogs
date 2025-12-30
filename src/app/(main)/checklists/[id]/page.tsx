'use client'

import { useParams, useRouter } from 'next/navigation'
import { useChecklist, useToggleChecklistItem, useResetChecklist } from '@/hooks/use-checklists'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Progress } from '@/components/ui/progress'
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
import { ArrowLeft, RotateCcw, CheckCircle, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'

export default function ChecklistDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const checklistId = params.id as string

  const { data: checklist, isLoading } = useChecklist(checklistId)
  const toggleItem = useToggleChecklistItem()
  const resetChecklist = useResetChecklist()

  const handleToggle = async (itemId: string, currentValue: boolean) => {
    await toggleItem.mutateAsync({
      checklistId,
      itemId,
      completed: !currentValue,
    })
  }

  const handleReset = async () => {
    await resetChecklist.mutateAsync(checklistId)
    toast({ title: 'Checklist reset' })
  }

  if (isLoading) {
    return (
      <div className="p-4 md:ml-64 space-y-4 max-w-2xl">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (!checklist) {
    return (
      <div className="p-4 md:ml-64 space-y-4 max-w-2xl">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/checklists">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-xl font-bold text-white">Checklist Not Found</h1>
        </div>
        <Card className="bg-surface-900 border-surface-800">
          <CardContent className="py-12 text-center">
            <p className="text-surface-400">
              This checklist doesn't exist or requires a premium subscription.
            </p>
            <Button asChild className="mt-4">
              <Link href="/checklists">Back to Checklists</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const isComplete = checklist.progress.percentage === 100

  return (
    <div className="p-4 md:ml-64 space-y-6 max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/checklists">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-white">{checklist.name}</h1>
          <p className="text-sm text-surface-400">{checklist.description}</p>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="icon">
              <RotateCcw className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-surface-900 border-surface-800">
            <AlertDialogHeader>
              <AlertDialogTitle>Reset Checklist?</AlertDialogTitle>
              <AlertDialogDescription>
                This will uncheck all items. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleReset}>Reset</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-surface-400">
            {checklist.progress.completed} of {checklist.progress.total} items completed
          </span>
          <span className="text-accent-400">
            {checklist.progress.percentage}%
          </span>
        </div>
        <Progress
          value={checklist.progress.percentage}
          className="h-2 bg-surface-800"
        />
      </div>

      {/* Completion Banner */}
      {isComplete && (
        <Card className="bg-accent-600/20 border-accent-600/30">
          <CardContent className="py-4 flex items-center gap-3">
            <CheckCircle className="h-6 w-6 text-accent-500" />
            <div>
              <p className="font-medium text-accent-400">Checklist Complete!</p>
              <p className="text-sm text-accent-300/70">Great job preparing for your baby!</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Items */}
      <Card className="bg-surface-900 border-surface-800">
        <CardContent className="pt-6 divide-y divide-surface-800">
          {checklist.items.map((item: any, index: number) => (
            <div
              key={item.item_id}
              className={cn(
                "py-4 first:pt-0 last:pb-0",
                item.completed && "opacity-60"
              )}
            >
              <div className="flex items-start gap-3">
                <Checkbox
                  checked={item.completed}
                  onCheckedChange={() => handleToggle(item.item_id, item.completed)}
                  className="mt-0.5"
                />
                <div className="flex-1 min-w-0">
                  <p className={cn(
                    "text-sm font-medium",
                    item.completed ? "text-surface-500 line-through" : "text-white"
                  )}>
                    {item.name}
                  </p>
                  {item.description && (
                    <p className="text-xs text-surface-400 mt-1">
                      {item.description}
                    </p>
                  )}
                  {item.link && (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-accent-500 hover:text-accent-400 mt-1"
                    >
                      Learn more
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
                {item.is_essential && (
                  <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded">
                    Essential
                  </span>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
