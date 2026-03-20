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
  medical: 'bg-coral-dim text-coral border-coral/30',
  shopping: 'bg-sky-dim text-sky border-sky/30',
  documents: 'bg-copper-dim text-copper border-copper/30',
  research: 'bg-sky-dim text-sky border-sky/30',
  'self-care': 'bg-rose-dim text-rose border-rose/30',
  relationship: 'bg-rose-dim text-rose border-rose/30',
  preparation: 'bg-gold-dim text-gold border-gold/30',
  other: 'bg-[--card] text-[--muted] border-[--border]',
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
        className="bg-[--surface] border-[--border] w-full sm:max-w-md overflow-y-auto"
      >
        <SheetHeader className="space-y-4 pb-4 border-b border-[--border]">
          <div className="flex items-start gap-3">
            {/* Category icon */}
            <div className={cn('p-2 rounded-lg border', categoryColor)}>
              <CategoryIcon className="h-5 w-5" />
            </div>

            <div className="flex-1 min-w-0">
              <SheetTitle className="text-xl font-display font-bold text-[--cream] text-left leading-tight">
                {task.title}
              </SheetTitle>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge
                  variant="outline"
                  className={cn(
                    'text-xs font-ui',
                    isOverdue && 'border-coral/50 text-coral',
                    isDueToday && !isOverdue && 'border-gold/50 text-gold',
                    !isOverdue && !isDueToday && 'border-[--border-hover] text-[--cream]'
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
                  <Badge variant="outline" className="border-coral/50 text-coral text-xs font-ui">
                    Must Do
                  </Badge>
                )}

                <Badge variant="outline" className="border-[--border-hover] text-[--cream] text-xs capitalize font-ui">
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
              <h4 className="text-sm font-ui font-medium text-[--muted] mb-2">Description</h4>
              <p className="text-[--cream] font-body">{task.description}</p>
            </div>
          )}

          {/* Details grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {task.time_estimate_minutes && (
              <div className="rounded-lg bg-[--card] p-3">
                <div className="flex items-center gap-2 text-[--muted] mb-1">
                  <Clock className="h-4 w-4" />
                  <span className="text-xs font-ui">Time Estimate</span>
                </div>
                <p className="text-[--cream] font-ui font-medium">~{task.time_estimate_minutes} min</p>
              </div>
            )}

            <div className="rounded-lg bg-[--card] p-3">
              <div className="flex items-center gap-2 text-[--muted] mb-1">
                <User className="h-4 w-4" />
                <span className="text-xs font-ui">Assigned To</span>
              </div>
              <p className="text-[--cream] font-ui font-medium capitalize">{task.assigned_to}</p>
            </div>
          </div>

          {/* Related article link */}
          {task.related_article_slug && (
            <Link
              href={`/content/articles/${task.related_article_slug}`}
              className="flex items-center gap-3 p-3 rounded-lg bg-[--card] hover:bg-[--card-hover] transition-colors"
            >
              <FileText className="h-5 w-5 text-copper" />
              <div className="flex-1">
                <p className="text-sm text-[--cream] font-body">Related Article</p>
                <p className="text-sm font-ui font-medium text-[--cream]">Learn more about this task</p>
              </div>
              <ExternalLink className="h-4 w-4 text-[--muted]" />
            </Link>
          )}

          {/* Notes */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-ui font-medium text-[--muted]">Notes</h4>
              {notesSaved && (
                <span className="text-xs text-sage font-ui">Saved</span>
              )}
            </div>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add your notes here..."
              className="bg-[--card] border-[--border] min-h-[100px] resize-none font-body"
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
                className="w-full bg-sage hover:bg-sage/90 text-[--bg] font-ui font-semibold h-12"
              >
                <Check className="h-5 w-5 mr-2" />
                Mark Complete
              </Button>

              {/* Snooze options */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    onSnooze(task.id, 1)
                    onClose()
                  }}
                  className="border-[--border-hover] hover:bg-[--card] font-ui"
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
                  className="border-[--border-hover] hover:bg-[--card] font-ui"
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
                  className="border-[--border-hover] hover:bg-[--card] font-ui"
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
                  className="flex-1 text-[--muted] hover:text-[--cream] hover:bg-[--card] font-ui"
                >
                  <X className="h-4 w-4 mr-2" />
                  Skip Task
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex-1 text-coral hover:text-coral/80 hover:bg-coral-dim font-ui"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-[--surface] border-[--border]">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="font-display text-[--cream]">Delete Task</AlertDialogTitle>
                      <AlertDialogDescription className="font-body text-[--muted]">
                        Are you sure you want to delete this task? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="border-[--border-hover] font-ui">Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => {
                          onDelete(task.id)
                          onClose()
                        }}
                        className="bg-coral hover:bg-coral/90 text-[--bg] font-ui"
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
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[--sage-dim] text-sage">
                <Check className="h-5 w-5" />
                <span className="font-ui font-medium">Completed</span>
              </div>
              {task.completed_at && (
                <p className="text-sm text-[--muted] font-body mt-2">
                  {format(new Date(task.completed_at), 'MMM d, yyyy')}
                </p>
              )}
            </div>
          )}

          {/* Skipped state */}
          {task.status === 'skipped' && (
            <div className="text-center py-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[--card] text-[--muted]">
                <X className="h-5 w-5" />
                <span className="font-ui font-medium">Skipped</span>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
