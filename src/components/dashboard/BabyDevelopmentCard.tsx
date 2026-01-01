'use client'

import { cn } from '@/lib/utils'
import { BabyDevelopment } from '@/types/dashboard'

interface BabyDevelopmentCardProps {
  baby: BabyDevelopment
}

function getTrimesterLabel(trimester: 1 | 2 | 3): string {
  switch (trimester) {
    case 1: return 'First Trimester'
    case 2: return 'Second Trimester'
    case 3: return 'Third Trimester'
  }
}

function formatWeight(weightOz: number): string {
  if (weightOz >= 16) {
    const lb = weightOz / 16
    return `${lb.toFixed(1)} lb`
  }
  return `${weightOz.toFixed(1)} oz`
}

export function BabyDevelopmentCard({ baby }: BabyDevelopmentCardProps) {
  return (
    <div
      className={cn(
        'rounded-[20px] p-7 flex gap-6',
        'bg-gradient-to-br from-teal-500/10 to-cyan-500/5',
        'border border-teal-500/20'
      )}
    >
      {/* Baby visual */}
      <div
        className={cn(
          'w-[140px] h-[140px] rounded-full flex-shrink-0',
          'bg-gradient-to-br from-teal-500/20 to-cyan-500/10',
          'flex flex-col items-center justify-center'
        )}
      >
        <span className="text-[56px] mb-1">{baby.sizeEmoji}</span>
        <span className="text-[13px] text-teal-500 font-semibold">
          Size of a {baby.sizeComparison}
        </span>
      </div>

      {/* Baby info */}
      <div className="flex-1">
        <h2 className="text-xl font-bold text-white mb-1">Baby's Development</h2>
        <div className="text-sm text-teal-500 font-semibold mb-4">
          Week {baby.week} of 40 • {getTrimesterLabel(baby.trimester)}
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-black/20 p-3 rounded-xl">
            <div className="text-lg font-bold text-white">
              {baby.lengthInches}"
            </div>
            <div className="text-[11px] text-zinc-500 mt-0.5">Length</div>
          </div>
          <div className="bg-black/20 p-3 rounded-xl">
            <div className="text-lg font-bold text-white">
              {formatWeight(baby.weightOz)}
            </div>
            <div className="text-[11px] text-zinc-500 mt-0.5">Weight</div>
          </div>
          <div className="bg-black/20 p-3 rounded-xl">
            <div className="text-lg font-bold text-white">
              {baby.heartRateBpm > 0 ? `💓 ${baby.heartRateBpm}` : '—'}
            </div>
            <div className="text-[11px] text-zinc-500 mt-0.5">Heart BPM</div>
          </div>
        </div>
      </div>
    </div>
  )
}
