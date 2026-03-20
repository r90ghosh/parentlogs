import { BabySize, formatWeight, formatLength } from '@/lib/baby-sizes'

interface BabySizeCardProps {
  size: BabySize
  week: number
}

export function BabySizeCard({ size, week }: BabySizeCardProps) {
  return (
    <div className="bg-[--card] border border-[--border] rounded-2xl p-6 shadow-card">
      {/* Header */}
      <div className="text-xs font-ui text-[--muted] uppercase tracking-wider mb-4">
        Week {week} Size
      </div>

      {/* Emoji Circle - Centered */}
      <div className="flex justify-center mb-4">
        <div className="relative w-20 h-20">
          <div className="absolute inset-[-6px] border-2 border-dashed border-copper/30 rounded-full" />
          <div className="w-full h-full bg-gradient-to-br from-copper-dim to-gold-dim rounded-full flex items-center justify-center">
            <span className="text-4xl">{size.emoji}</span>
          </div>
        </div>
      </div>

      {/* Fruit Name */}
      <div className="text-xl font-display font-bold text-[--cream] text-center mb-4">
        {size.fruit}
      </div>

      {/* Stats Row */}
      <div className="flex justify-center gap-8 pt-4 border-t border-[--border]">
        <div className="text-center">
          <div className="text-sm font-semibold font-ui text-gold">{formatLength(size)}</div>
          <div className="text-xs font-ui text-[--muted]">length</div>
        </div>
        <div className="text-center">
          <div className="text-sm font-semibold font-ui text-gold">{formatWeight(size)}</div>
          <div className="text-xs font-ui text-[--muted]">weight</div>
        </div>
      </div>
    </div>
  )
}
