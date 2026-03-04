'use client'

import { cn } from '@/lib/utils'

interface ProgressCardProps {
  completed: number
  remaining: number
  overdue: number
  percentComplete: number
}

export function ProgressCard({ completed, remaining, overdue, percentComplete }: ProgressCardProps) {
  // SVG progress ring calculations
  const radius = 36
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (percentComplete / 100) * circumference

  return (
    <div
      className={cn(
        'rounded-2xl p-5',
        'bg-[--card]',
        'border border-[--border]'
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-sm font-semibold text-[--cream]">📊 Your Progress</span>
      </div>

      {/* Progress visual */}
      <div className="flex items-center gap-4 mb-4">
        {/* Progress ring */}
        <div className="relative w-20 h-20">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
            <defs>
              <linearGradient id="dashboardProgressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="var(--sage)" />
                <stop offset="100%" stopColor="var(--copper)" />
              </linearGradient>
            </defs>
            {/* Background circle */}
            <circle
              cx="40"
              cy="40"
              r={radius}
              fill="none"
              stroke="var(--border)"
              strokeWidth="6"
            />
            {/* Progress circle */}
            <circle
              cx="40"
              cy="40"
              r={radius}
              fill="none"
              stroke="url(#dashboardProgressGradient)"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-500 ease-out"
            />
          </svg>
          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-lg font-bold text-[--cream]">
              {Math.round(percentComplete)}%
            </div>
            <div className="text-[9px] text-[--dim]">Complete</div>
          </div>
        </div>

        {/* Stats */}
        <div className="flex-1">
          <div className="flex justify-between py-2 border-b border-[--border]">
            <span className="text-[13px] text-[--muted]">Completed</span>
            <span className="text-[13px] font-semibold text-[--sage]">{completed}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-[--border]">
            <span className="text-[13px] text-[--muted]">Remaining</span>
            <span className="text-[13px] font-semibold text-[--cream]">{remaining}</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-[13px] text-[--muted]">Overdue</span>
            <span className={cn(
              "text-[13px] font-semibold",
              overdue > 0 ? "text-[--gold]" : "text-[--cream]"
            )}>
              {overdue}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
