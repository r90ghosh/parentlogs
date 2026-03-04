'use client'

import { cn } from '@/lib/utils'

interface ProgressCardProps {
  percentComplete: number
  done: number
  active: number
  toTriage: number
}

export function ProgressCard({
  percentComplete,
  done,
  active,
  toTriage,
}: ProgressCardProps) {
  // Calculate stroke offset for SVG ring
  const circumference = 2 * Math.PI * 50 // r = 50
  const strokeOffset = circumference - (percentComplete / 100) * circumference

  return (
    <div
      className={cn(
        'rounded-2xl p-5',
        'bg-[--surface]',
        'border border-[--border]'
      )}
    >
      {/* Title */}
      <h3 className="text-sm font-ui font-semibold text-[--cream] mb-4">📊 Your Progress</h3>

      {/* Progress ring */}
      <div className="flex justify-center mb-4">
        <div className="relative w-[120px] h-[120px]">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
            <defs>
              <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#c4703f" />
                <stop offset="100%" stopColor="#d4a853" />
              </linearGradient>
            </defs>
            {/* Background circle */}
            <circle
              cx="60"
              cy="60"
              r="50"
              fill="none"
              stroke="rgba(237,230,220,0.08)"
              strokeWidth="8"
            />
            {/* Progress circle */}
            <circle
              cx="60"
              cy="60"
              r="50"
              fill="none"
              stroke="url(#progressGradient)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeOffset}
              className="transition-all duration-500 ease-out"
            />
          </svg>
          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-[28px] font-display font-extrabold text-gradient-copper">
              {Math.round(percentComplete)}%
            </div>
            <div className="text-[11px] text-[--muted] font-body">complete</div>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="flex justify-around">
        <div className="text-center">
          <div className="text-lg font-ui font-bold text-sage">{done}</div>
          <div className="text-[11px] text-[--dim] font-body">Done</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-ui font-bold text-[--cream]">{active}</div>
          <div className="text-[11px] text-[--dim] font-body">Active</div>
        </div>
        {toTriage > 0 && (
          <div className="text-center">
            <div className="text-lg font-ui font-bold text-gold">{toTriage}</div>
            <div className="text-[11px] text-[--dim] font-body">To Triage</div>
          </div>
        )}
      </div>
    </div>
  )
}
