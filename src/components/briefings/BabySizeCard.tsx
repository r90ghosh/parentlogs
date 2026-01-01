import { BabySize, formatWeight, formatLength } from '@/lib/baby-sizes'

interface BabySizeCardProps {
  size: BabySize
  week: number
}

export function BabySizeCard({ size, week }: BabySizeCardProps) {
  return (
    <div className="bg-gradient-to-br from-zinc-800/80 to-zinc-900/80 border border-white/[0.08] rounded-2xl p-6">
      {/* Header */}
      <div className="text-xs text-zinc-500 uppercase tracking-wider mb-4">
        Week {week} Size
      </div>

      {/* Emoji Circle - Centered */}
      <div className="flex justify-center mb-4">
        <div className="relative w-20 h-20">
          <div className="absolute inset-[-6px] border-2 border-dashed border-teal-500/30 rounded-full" />
          <div className="w-full h-full bg-gradient-to-br from-teal-500/20 to-cyan-500/10 rounded-full flex items-center justify-center">
            <span className="text-4xl">{size.emoji}</span>
          </div>
        </div>
      </div>

      {/* Fruit Name */}
      <div className="text-xl font-bold text-white text-center mb-4">
        {size.fruit}
      </div>

      {/* Stats Row */}
      <div className="flex justify-center gap-8 pt-4 border-t border-white/[0.06]">
        <div className="text-center">
          <div className="text-sm font-semibold text-white">{formatLength(size)}</div>
          <div className="text-xs text-zinc-500">length</div>
        </div>
        <div className="text-center">
          <div className="text-sm font-semibold text-white">{formatWeight(size)}</div>
          <div className="text-xs text-zinc-500">weight</div>
        </div>
      </div>
    </div>
  )
}
