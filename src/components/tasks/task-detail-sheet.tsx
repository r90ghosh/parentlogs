'use client'

import { useState, useEffect } from 'react'
import { format, isPast, isToday } from 'date-fns'
import {
  Check,
  Clock,
  Calendar,
  ArrowRight,
  X,
  Trash2,
  Stethoscope,
  ShoppingCart,
  FileText,
  Search,
  Heart,
  Users,
  MoreHorizontal,
  ExternalLink,
  User,
} from 'lucide-react'
import Link from 'next/link'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
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
import { FamilyTask } from '@/types'
import { cn } from '@/lib/utils'

interface TaskDetailSheetProps {
  task: FamilyTask | null
  isOpen: boolean
  onClose: () => void
  onComplete: (taskId: string) => void
  onSnooze: (taskId: string, days: number) => void
  onSkip: (taskId: string) => void
  onDelete: (taskId: string) => void
  onNotesChange: (taskId: string, notes: string) => void
}

const categoryIcons: Record<string, typeof Stethoscope> = {
  medical: Stethoscope,
  shopping: ShoppingCart,
  documents: FileText,
  research: Search,
  'self-care': Heart,
  relationship: Users,
  preparation: FileText,
  other: MoreHorizontal,
}

const categoryColors: Record<string, string> = {
  medical: 'bg-red-500/20 text-red-400 border-red-500/30',
  shopping: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  documents: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  research: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  'self-care': 'bg-pink-500/20 text-pink-400 border-pink-500/30',
  relationship: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
  preparation: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  other: 'bg-surface-500/20 text-surface-400 border-surface-500/30',
}

export function TaskDetailSheet({
  task,
  isOpen,
  onClose,
  onComplete,
  onSnooze,
  onSkip,
  onDelete,
  onNotesChange,
}: TaskDetailSheetProps) {
  const [notes, setNotes] = useState('')
  const [notesSaved, setNotesSaved] = useState(false)

  // Sync notes when task changes
  useEffect(() => {
    if (task) {
      setNotes(task.notes || '')
    }
  }, [task])

  // Auto-save notes after debounce
  useEffect(() => {
    if (!task || notes === (task.notes || '')) return

    const timer = setTimeout(() => {
      onNotesChange(task.id, notes)
      setNotesSaved(true)
      setTimeout(() => setNotesSaved(false), 2000)
    }, 1000)

    return () => clearTimeout(timer)
  }, [notes, task, onNotesChange])

  if (!task) return null

  const dueDate = new Date(task.due_date)
  const isOverdue = isPast(dueDate) && !isToday(dueDate)
  const isDueToday = isToday(dueDate)
  const CategoryIcon = categoryIcons[task.category.toLowerCase()] || MoreHorizontal
  const categoryColor = categoryColors[task.category.toLowerCase()] || categoryColors.other

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="right"
        className="bg-surface-900 border-surface-800 w-full sm:max-w-md overflow-y-auto"
      >
        <SheetHeader className="space-y-4 pb-4 border-b border-surface-800">
          <div className="flex items-start gap-3">
            {/* Category icon */}
            <div className={cn('p-2 rounded-lg border', categoryColor)}>
              <CategoryIcon className="h-5 w-5" />
            </div>

            <div className="flex-1 min-w-0">
              <SheetTitle className="text-xl font-bold text-white text-left leading-tight">
                {task.title}
              </SheetTitle>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge
                  variant="outline"
                  className={cn(
                    'text-xs',
                    isOverdue && 'border-red-500/50 text-red-400',
                    isDueToday && !isOverdue && 'border-amber-500/50 text-amber-400',
                    !isOverdue && !isDueToday && 'border-surface-600 text-surface-300'
                  )}
                >
                  <Calendar className="h-3 w-3 mr-1" />
                  {isOverdue
                    ? 'Overdue'
                    : isDueToday
                    ? 'Due Today'
                    : format(dueDate, 'MMM d, yyyy')}
                </Badge>

                {task.priority === 'must-do' && (
                  <Badge variant="outline" className="border-red-500/50 text-red-400 text-xs">
                    Must Do
                  </Badge>
                )}

                <Badge variant="outline" className="border-surface-600 text-surface-300 text-xs capitalize">
                  {task.category}
                </Badge>
              </div>
            </div>
          </div>
        </SheetHeader>

        <div className="space-y-6 py-6">
          {/* Description */}
          {task.description && (
            <div>
              <h4 className="text-sm font-medium text-surface-400 mb-2">Description</h4>
              <p className="text-surface-200">{task.description}</p>
            </div>
          )}

          {/* Details grid */}
          <div className="grid grid-cols-2 gap-4">
            {task.time_estimate_minutes && (
              <div className="rounded-lg bg-surface-800 p-3">
                <div className="flex items-center gap-2 text-surface-400 mb-1">
                  <Clock className="h-4 w-4" />
                  <span className="text-xs">Time Estimate</span>
                </div>
                <p className="text-white font-medium">~{task.time_estimate_minutes} min</p>
              </div>
            )}

            <div className="rounded-lg bg-surface-800 p-3">
              <div className="flex items-center gap-2 text-surface-400 mb-1">
                <User className="h-4 w-4" />
                <span className="text-xs">Assigned To</span>
              </div>
              <p className="text-white font-medium capitalize">{task.assigned_to}</p>
            </div>
          </div>

          {/* Related article link */}
          {task.related_article_slug && (
            <Link
              href={`/resources/articles/${task.related_article_slug}`}
              className="flex items-center gap-3 p-3 rounded-lg bg-surface-800 hover:bg-surface-700 transition-colors"
            >
              <FileText className="h-5 w-5 text-accent-400" />
              <div className="flex-1">
                <p className="text-sm text-surface-300">Related Article</p>
                <p className="text-sm font-medium text-white">Learn more about this task</p>
              </div>
              <ExternalLink className="h-4 w-4 text-surface-400" />
            </Link>
          )}

          {/* Notes */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-surface-400">Notes</h4>
              {notesSaved && (
                <span className="text-xs text-green-400">Saved</span>
              )}
            </div>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add your notes here..."
              className="bg-surface-800 border-surface-700 min-h-[100px] resize-none"
            />
          </div>

          {/* Actions */}
          {task.status === 'pending' && (
            <div className="space-y-3">
              {/* Primary action */}
              <Button
                onClick={() => {
                  onComplete(task.id)
                  onClose()
                }}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold h-12"
              >
                <Check className="h-5 w-5 mr-2" />
                Mark Complete
              </Button>

              {/* Snooze options */}
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    onSnooze(task.id, 1)
                    onClose()
                  }}
                  className="border-surface-600 hover:bg-surface-700"
                >
                  <ArrowRight className="h-4 w-4 mr-1" />
                  +1 Day
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    onSnooze(task.id, 3)
                    onClose()
                  }}
                  className="border-surface-600 hover:bg-surface-700"
                >
                  <ArrowRight className="h-4 w-4 mr-1" />
                  +3 Days
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    onSnooze(task.id, 7)
                    onClose()
                  }}
                  className="border-surface-600 hover:bg-surface-700"
                >
                  <ArrowRight className="h-4 w-4 mr-1" />
                  +1 Week
                </Button>
              </div>

              {/* Destructive actions */}
              <div className="flex gap-2 pt-2">
                <Button
                  variant="ghost"
                  onClick={() => {
                    onSkip(task.id)
                    onClose()
                  }}
                  className="flex-1 text-surface-400 hover:text-white hover:bg-surface-700"
                >
                  <X className="h-4 w-4 mr-2" />
                  Skip Task
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex-1 text-red-400 hover:text-red-300 hover:bg-red-950/20"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-surface-900 border-surface-800">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Task</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this task? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="border-surface-600">Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => {
                          onDelete(task.id)
                          onClose()
                        }}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          )}

          {/* Completed state */}
          {task.status === 'completed' && (
            <div className="text-center py-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 text-green-400">
                <Check className="h-5 w-5" />
                <span className="font-medium">Completed</span>
              </div>
              {task.completed_at && (
                <p className="text-sm text-surface-400 mt-2">
                  {format(new Date(task.completed_at), 'MMM d, yyyy')}
                </p>
              )}
            </div>
          )}

          {/* Skipped state */}
          {task.status === 'skipped' && (
            <div className="text-center py-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-700 text-surface-300">
                <X className="h-5 w-5" />
                <span className="font-medium">Skipped</span>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
