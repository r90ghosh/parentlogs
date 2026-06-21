'use client'

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useCreateTask } from '@/hooks/use-tasks'
import { useFamilyMembers } from '@/hooks/use-family'
import { Panel } from '@/components/digest'
import { usePageHeader } from '@/components/layouts/topbar-context'
import { ArrowLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

const taskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title is too long'),
  description: z.string().optional(),
  due_date: z.string().min(1, 'Due date is required'),
  assigned_to: z.enum(['dad', 'mom', 'both']),
  priority: z.enum(['must-do', 'good-to-do']),
  category: z.string().min(1, 'Category is required'),
})

type TaskFormData = z.infer<typeof taskSchema>

const categories = [
  'Medical',
  'Shopping',
  'Preparation',
  'Research',
  'Documents',
  'Self-Care',
  'Relationship',
  'Other',
]

const assignees: { value: TaskFormData['assigned_to']; label: string }[] = [
  { value: 'both', label: 'Both Partners' },
  { value: 'dad', label: 'Dad' },
  { value: 'mom', label: 'Mom' },
]

const priorities: { value: TaskFormData['priority']; label: string }[] = [
  { value: 'must-do', label: 'Must-Do' },
  { value: 'good-to-do', label: 'Good-to-Do' },
]

const fieldLabel = 'mb-1.5 block text-[12.5px] font-bold uppercase tracking-[0.5px] text-mute'
const fieldInput =
  'w-full rounded-xl border border-line bg-card px-3.5 py-2.5 text-[15px] text-ink outline-none placeholder:text-faint focus:border-clay'
const chip = 'rounded-full px-[15px] py-2 text-[13px] font-bold transition-colors'

export default function NewTaskClient() {
  const router = useRouter()
  const { toast } = useToast()
  const createTask = useCreateTask()
  const { data: members } = useFamilyMembers()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      assigned_to: 'both',
      priority: 'good-to-do',
      category: 'Other',
    },
  })

  usePageHeader({ title: 'New task' }, [])

  const onSubmit = async (data: TaskFormData) => {
    const result = await createTask.mutateAsync({
      title: data.title,
      description: data.description || '',
      due_date: data.due_date,
      assigned_to: data.assigned_to,
      priority: data.priority,
      category: data.category,
      status: 'pending',
    })

    if (result.error) {
      toast({
        title: 'Error',
        description: result.error.message,
        variant: 'destructive',
      })
    } else {
      toast({ title: 'Task created!' })
      router.push('/tasks')
    }
  }

  const assignedTo = watch('assigned_to')
  const priority = watch('priority')
  const category = watch('category')

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href="/tasks"
        className="mb-5 inline-flex items-center gap-1.5 text-sm font-bold text-clay-ink hover:opacity-80"
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </Link>

      <Panel className="p-[18px] sm:p-[22px]">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Title */}
          <div>
            <label htmlFor="title" className={fieldLabel}>
              Title
            </label>
            <input
              id="title"
              {...register('title')}
              placeholder="What needs to be done?"
              className={fieldInput}
            />
            {errors.title && <p className="mt-1.5 text-[13px] font-semibold text-danger">{errors.title.message}</p>}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className={fieldLabel}>
              Description
            </label>
            <textarea
              id="description"
              {...register('description')}
              placeholder="Add more details..."
              className={cn(fieldInput, 'min-h-[100px] resize-y')}
            />
          </div>

          {/* Due Date */}
          <div>
            <label htmlFor="due_date" className={fieldLabel}>
              Due date
            </label>
            <input id="due_date" type="date" {...register('due_date')} className={fieldInput} />
            {errors.due_date && (
              <p className="mt-1.5 text-[13px] font-semibold text-danger">{errors.due_date.message}</p>
            )}
          </div>

          {/* Assigned To */}
          <div>
            <span className={fieldLabel}>Assigned to</span>
            <div className="flex flex-wrap gap-2">
              {assignees.map((a) => (
                <button
                  key={a.value}
                  type="button"
                  onClick={() => setValue('assigned_to', a.value)}
                  className={cn(
                    chip,
                    assignedTo === a.value
                      ? 'bg-clay text-white'
                      : 'border border-line bg-card text-ink2 hover:border-faint'
                  )}
                >
                  {a.label}
                </button>
              ))}
            </div>
          </div>

          {/* Priority */}
          <div>
            <span className={fieldLabel}>Priority</span>
            <div className="flex flex-wrap gap-2">
              {priorities.map((p) => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => setValue('priority', p.value)}
                  className={cn(
                    chip,
                    priority === p.value
                      ? 'bg-clay text-white'
                      : 'border border-line bg-card text-ink2 hover:border-faint'
                  )}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Category */}
          <div>
            <span className={fieldLabel}>Category</span>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setValue('category', cat)}
                  className={cn(
                    chip,
                    category === cat
                      ? 'bg-clay text-white'
                      : 'border border-line bg-card text-ink2 hover:border-faint'
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="flex w-full items-center justify-center rounded-xl bg-clay px-5 py-3 text-[15px] font-bold text-white hover:opacity-90 disabled:opacity-50"
            disabled={isSubmitting || createTask.isPending}
          >
            {isSubmitting || createTask.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              'Create Task'
            )}
          </button>
        </form>
      </Panel>
    </div>
  )
}
