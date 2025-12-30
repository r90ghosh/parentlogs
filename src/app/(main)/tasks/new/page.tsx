'use client'

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useCreateTask } from '@/hooks/use-tasks'
import { useFamilyMembers } from '@/hooks/use-family'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useToast } from '@/hooks/use-toast'

const taskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title is too long'),
  description: z.string().optional(),
  due_date: z.string().min(1, 'Due date is required'),
  assigned_to: z.enum(['dad', 'mom', 'both']),
  priority: z.enum(['must-do', 'recommended', 'optional']),
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

export default function NewTaskPage() {
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
      priority: 'recommended',
      category: 'Other',
    },
  })

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

  return (
    <div className="p-4 md:ml-64 space-y-4 max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/tasks">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <h1 className="text-xl font-bold text-white">New Task</h1>
      </div>

      <Card className="bg-surface-900 border-surface-800">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                {...register('title')}
                placeholder="What needs to be done?"
                className="bg-surface-800 border-surface-700"
              />
              {errors.title && (
                <p className="text-sm text-red-500">{errors.title.message}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...register('description')}
                placeholder="Add more details..."
                className="bg-surface-800 border-surface-700 min-h-[100px]"
              />
            </div>

            {/* Due Date */}
            <div className="space-y-2">
              <Label htmlFor="due_date">Due Date *</Label>
              <Input
                id="due_date"
                type="date"
                {...register('due_date')}
                className="bg-surface-800 border-surface-700"
              />
              {errors.due_date && (
                <p className="text-sm text-red-500">{errors.due_date.message}</p>
              )}
            </div>

            {/* Assigned To */}
            <div className="space-y-2">
              <Label>Assigned To</Label>
              <Select
                value={watch('assigned_to')}
                onValueChange={(value) => setValue('assigned_to', value as any)}
              >
                <SelectTrigger className="bg-surface-800 border-surface-700">
                  <SelectValue placeholder="Who should do this?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="both">Both Partners</SelectItem>
                  <SelectItem value="dad">Dad</SelectItem>
                  <SelectItem value="mom">Mom</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Priority */}
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select
                value={watch('priority')}
                onValueChange={(value) => setValue('priority', value as any)}
              >
                <SelectTrigger className="bg-surface-800 border-surface-700">
                  <SelectValue placeholder="How important is this?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="must-do">Must-Do</SelectItem>
                  <SelectItem value="recommended">Recommended</SelectItem>
                  <SelectItem value="optional">Optional</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label>Category</Label>
              <Select
                value={watch('category')}
                onValueChange={(value) => setValue('category', value)}
              >
                <SelectTrigger className="bg-surface-800 border-surface-700">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting || createTask.isPending}
            >
              {(isSubmitting || createTask.isPending) ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Task'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
