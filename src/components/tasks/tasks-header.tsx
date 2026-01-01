'use client'

import Link from 'next/link'
import { Plus, Calendar } from 'lucide-react'

interface TasksHeaderProps {
  currentWeek: number
  daysToGo: number
}

export function TasksHeader({ currentWeek, daysToGo }: TasksHeaderProps) {
  // Get milestone message based on week
  const getMilestoneMessage = () => {
    if (currentWeek === 20) return 'Halfway there! 🎉'
    if (currentWeek >= 37) return 'Almost there! 👶'
    if (currentWeek >= 28) return 'Third trimester!'
    if (currentWeek >= 14) return 'Second trimester!'
    return 'First trimester'
  }

  return (
    <div className="flex justify-between items-start mb-6">
      {/* Left side */}
      <div>
        <h1 className="text-[28px] font-bold text-white mb-2">Tasks</h1>
        <div className="flex items-center gap-4 text-sm text-zinc-500">
          <span>Week {currentWeek} of 40 — {getMilestoneMessage()}</span>
          <span className="w-1 h-1 rounded-full bg-zinc-600" />
          <span>{daysToGo} days to go</span>
        </div>
      </div>

      {/* Right side - actions */}
      <div className="flex gap-3">
        <Link
          href="/calendar"
          className="flex items-center gap-2 px-5 py-2.5 rounded-[10px] text-sm font-semibold
            bg-white/[0.06] text-zinc-200 border border-white/10
            hover:bg-white/10 transition-all"
        >
          <Calendar className="w-4 h-4" />
          Calendar
        </Link>
        <Link
          href="/tasks/new"
          className="flex items-center gap-2 px-5 py-2.5 rounded-[10px] text-sm font-semibold
            bg-gradient-to-r from-amber-500 to-orange-600 text-white
            hover:shadow-lg hover:shadow-amber-500/30 hover:-translate-y-0.5 transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Task
        </Link>
      </div>
    </div>
  )
}
