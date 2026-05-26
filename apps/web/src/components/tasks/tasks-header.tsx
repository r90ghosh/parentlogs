'use client'

import Link from 'next/link'
import { Plus, Calendar } from 'lucide-react'

interface TasksHeaderProps {
  currentWeek: number
  daysToGo: number
  stage?: string
}

export function TasksHeader({ currentWeek, daysToGo, stage }: TasksHeaderProps) {
  const isPostBirth = stage === 'post-birth'

  // Get milestone message based on week and stage
  const getMilestoneMessage = () => {
    if (isPostBirth) {
      const month = Math.ceil(currentWeek / 4)
      return `Month ${month}`
    }
    if (currentWeek === 20) return 'Halfway there! 🎉'
    if (currentWeek >= 37) return 'Almost there! 👶'
    if (currentWeek >= 28) return 'Third trimester!'
    if (currentWeek >= 14) return 'Second trimester!'
    return 'First trimester'
  }

  const weekLabel = isPostBirth
    ? `Post-birth · Week ${currentWeek}`
    : `Week ${currentWeek} of 40`

  return (
    <div className="flex justify-between items-start mb-6">
      {/* Left side */}
      <div>
        <h1 className="text-[28px] font-display font-bold text-[--cream] mb-2">Tasks</h1>
        <div className="flex items-center gap-4 text-sm text-[--muted] font-body">
          <span>{weekLabel} — {getMilestoneMessage()}</span>
          <span className="w-1 h-1 rounded-full bg-[--dim]" />
          <span>{isPostBirth ? `Born · Week ${currentWeek}` : `${daysToGo} days to go`}</span>
        </div>
      </div>

      {/* Right side - actions */}
      <div className="flex gap-3">
        <Link
          href="/calendar"
          className="flex items-center gap-2 px-5 py-2.5 rounded-[10px] text-sm font-ui font-semibold
            bg-[--card] text-[--cream] border border-[--border]
            hover:bg-[--card-hover] hover:border-[--border-hover] transition-all"
        >
          <Calendar className="w-4 h-4" />
          Calendar
        </Link>
        <Link
          href="/tasks/new"
          className="flex items-center gap-2 px-5 py-2.5 rounded-[10px] text-sm font-ui font-semibold
            bg-copper text-[--bg] hover:bg-copper-hover
            hover:shadow-copper hover:-translate-y-0.5 transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Task
        </Link>
      </div>
    </div>
  )
}
