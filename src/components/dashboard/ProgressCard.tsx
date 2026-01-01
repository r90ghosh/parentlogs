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
        'bg-gradient-to-br from-zinc-800 to-zinc-900',
        'border border-white/[0.06]'
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-sm font-semibold text-white">📊 Your Progress</span>
      </div>

      {/* Progress visual */}
      <div className="flex items-center gap-4 mb-4">
        {/* Progress ring */}
        <div className="relative w-20 h-20">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
            <defs>
              <linearGradient id="dashboardProgressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#22c55e" />
                <stop offset="100%" stopColor="#14b8a6" />
              </linearGradient>
            </defs>
            {/* Background circle */}
            <circle
              cx="40"
              cy="40"
              r={radius}
              fill="none"
              stroke="rgba(255,255,255,0.1)"
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
            <div className="text-lg font-bold text-white">
              {Math.round(percentComplete)}%
            </div>
            <div className="text-[9px] text-zinc-500">Complete</div>
          </div>
        </div>

        {/* Stats */}
        <div className="flex-1">
          <div className="flex justify-between py-2 border-b border-white/[0.04]">
            <span className="text-[13px] text-zinc-500">Completed</span>
            <span className="text-[13px] font-semibold text-green-500">{completed}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-white/[0.04]">
            <span className="text-[13px] text-zinc-500">Remaining</span>
            <span className="text-[13px] font-semibold text-white">{remaining}</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-[13px] text-zinc-500">Overdue</span>
            <span className={cn(
              "text-[13px] font-semibold",
              overdue > 0 ? "text-amber-500" : "text-white"
            )}>
              {overdue}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
