'use client'

import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

// Full page loading spinner
export function PageLoading({ message }: { message?: string }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-surface-950">
      <Loader2 className="h-10 w-10 animate-spin text-accent-500 mb-4" />
      {message && <p className="text-surface-400">{message}</p>}
    </div>
  )
}

// Inline loading spinner
export function InlineLoading({ size = 'md', className }: { size?: 'sm' | 'md' | 'lg'; className?: string }) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  }

  return (
    <div className={cn('flex items-center justify-center', className)}>
      <Loader2 className={cn('animate-spin text-accent-500', sizeClasses[size])} />
    </div>
  )
}

// Card skeleton for dashboard items
export function CardSkeleton({ className }: { className?: string }) {
  return (
    <Card className={cn('bg-surface-900 border-surface-800', className)}>
      <CardHeader>
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-4 w-48 mt-1" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-20 w-full" />
      </CardContent>
    </Card>
  )
}

// List skeleton for task/item lists
export function ListSkeleton({ count = 3, className }: { count?: number; className?: string }) {
  return (
    <div className={cn('space-y-3', className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-3 bg-surface-800/50 rounded-lg">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  )
}

// Dashboard skeleton
export function DashboardSkeleton() {
  return (
    <div className="p-4 md:ml-64 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>

      {/* Main Content */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-surface-900 border-surface-800">
          <CardHeader>
            <Skeleton className="h-5 w-32" />
          </CardHeader>
          <CardContent>
            <ListSkeleton count={3} />
          </CardContent>
        </Card>
        <Card className="bg-surface-900 border-surface-800">
          <CardHeader>
            <Skeleton className="h-5 w-32" />
          </CardHeader>
          <CardContent>
            <ListSkeleton count={3} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Task list skeleton
export function TaskListSkeleton() {
  return (
    <div className="p-4 md:ml-64 space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-10 w-24" />
      </div>
      <ListSkeleton count={5} />
    </div>
  )
}

// Tracker skeleton
export function TrackerSkeleton() {
  return (
    <div className="p-4 md:ml-64 space-y-6">
      <Skeleton className="h-8 w-32" />

      {/* Quick log buttons */}
      <div className="grid grid-cols-3 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-20 rounded-lg" />
        ))}
      </div>

      {/* Recent logs */}
      <Skeleton className="h-6 w-24" />
      <ListSkeleton count={4} />
    </div>
  )
}

// Settings skeleton
export function SettingsSkeleton() {
  return (
    <div className="p-4 md:ml-64 space-y-6 max-w-2xl">
      <Skeleton className="h-8 w-32" />
      <CardSkeleton />
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-lg" />
        ))}
      </div>
    </div>
  )
}

// Button loading state
export function ButtonLoading({ children, loading, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { loading?: boolean }) {
  return (
    <button {...props} disabled={loading || props.disabled}>
      {loading ? (
        <span className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  )
}

// Empty state component
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: React.ElementType
  title: string
  description: string
  action?: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="h-16 w-16 rounded-full bg-surface-800 flex items-center justify-center mb-4">
        <Icon className="h-8 w-8 text-surface-500" />
      </div>
      <h3 className="text-lg font-medium text-white mb-1">{title}</h3>
      <p className="text-sm text-surface-400 max-w-sm mb-4">{description}</p>
      {action}
    </div>
  )
}
