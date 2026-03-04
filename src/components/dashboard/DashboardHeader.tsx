'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'

interface DashboardHeaderProps {
  userName: string
  overdueCount: number
}

function getGreeting(hour: number): string {
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

export function DashboardHeader({ userName, overdueCount }: DashboardHeaderProps) {
  const [mounted, setMounted] = useState(false)
  const [today, setToday] = useState<Date | null>(null)

  useEffect(() => {
    setMounted(true)
    setToday(new Date())
  }, [])

  const greeting = mounted && today ? getGreeting(today.getHours()) : 'Hello'

  return (
    <header className="flex justify-between items-start mb-8">
      <div>
        <h1 className="text-[32px] font-display font-bold text-[--cream] mb-2">
          {greeting},{' '}
          <span className="text-gradient-copper">
            {userName}
          </span>{' '}
          <span className="inline-block">👋</span>
        </h1>
        <div className="flex items-center gap-4 text-sm text-[--muted] font-body">
          <span suppressHydrationWarning>
            {today ? format(today, 'EEEE, MMMM d, yyyy') : ''}
          </span>
          {overdueCount > 0 && (
            <span className={cn(
              'flex items-center gap-1.5 px-3 py-1 rounded-full text-[13px] font-medium font-ui',
              'bg-coral-dim text-coral'
            )}>
              <span className="w-1.5 h-1.5 rounded-full bg-coral" />
              {overdueCount} {overdueCount === 1 ? 'task needs' : 'tasks need'} attention
            </span>
          )}
        </div>
      </div>
    </header>
  )
}
