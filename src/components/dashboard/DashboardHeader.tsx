'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import Link from 'next/link'

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
        <h1 className="text-[32px] font-bold text-white mb-2">
          {greeting},{' '}
          <span className="bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">
            {userName}
          </span>{' '}
          <span className="inline-block">👋</span>
        </h1>
        <div className="flex items-center gap-4 text-sm text-zinc-500">
          <span suppressHydrationWarning>
            {today ? format(today, 'EEEE, MMMM d, yyyy') : ''}
          </span>
          {overdueCount > 0 && (
            <span className={cn(
              'flex items-center gap-1.5 px-3 py-1 rounded-full text-[13px] font-medium',
              'bg-red-500/15 text-red-500'
            )}>
              <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
              {overdueCount} {overdueCount === 1 ? 'task needs' : 'tasks need'} attention
            </span>
          )}
        </div>
      </div>
      <div className="flex gap-3">
        <Link
          href="/calendar"
          className={cn(
            'px-5 py-2.5 rounded-[10px] text-sm font-semibold flex items-center gap-2',
            'bg-white/[0.06] text-zinc-200 border border-white/10',
            'hover:bg-white/[0.08] transition-colors'
          )}
        >
          📅 Calendar
        </Link>
        <Link
          href="/tasks/new"
          className={cn(
            'px-5 py-2.5 rounded-[10px] text-sm font-semibold flex items-center gap-2',
            'bg-gradient-to-r from-amber-500 to-orange-600 text-white',
            'hover:opacity-90 transition-opacity'
          )}
        >
          + Quick Add
        </Link>
      </div>
    </header>
  )
}
