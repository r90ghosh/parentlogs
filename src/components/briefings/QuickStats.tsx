import { BabySize, formatWeight } from '@/lib/baby-sizes'
import { differenceInDays } from 'date-fns'

interface QuickStatsProps {
  week: number
  babySize?: BabySize
  dueDate?: string
}

export function QuickStats({ week, babySize, dueDate }: QuickStatsProps) {
  // Calculate trimester
  const getTrimester = (w: number) => {
    if (w <= 13) return { num: 1, label: w === 13 ? '1st (Final Week!)' : '1st' }
    if (w <= 27) return { num: 2, label: w === 27 ? '2nd (Final Week!)' : '2nd' }
    return { num: 3, label: w === 40 ? '3rd (Final Week!)' : '3rd' }
  }

  // Calculate days until due
  const daysUntilDue = dueDate
    ? Math.max(0, differenceInDays(new Date(dueDate), new Date()))
    : null

  // Miscarriage risk (only shown in first trimester)
  const getMiscarriageRisk = (w: number) => {
    if (w >= 14) return null // Only show in first trimester
    if (w >= 12) return '~2%'
    if (w >= 10) return '~3%'
    if (w >= 8) return '~5%'
    if (w >= 6) return '~10%'
    return '~15%'
  }

  const trimester = getTrimester(week)
  const miscarriageRisk = getMiscarriageRisk(week)

  return (
    <div className="bg-gradient-to-br from-zinc-800/80 to-zinc-900/80 border border-white/[0.08] rounded-2xl p-6">
      <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4">
        This Week at a Glance
      </div>

      <div className="space-y-0">
        <StatRow label="Trimester" value={trimester.label} />

        {babySize && (
          <>
            <StatRow
              label="Baby Size"
              value={`${babySize.fruit} ${babySize.emoji}`}
            />
            <StatRow label="Baby Weight" value={`~${formatWeight(babySize)}`} />
          </>
        )}

        {daysUntilDue !== null && (
          <StatRow label="Days Until Due" value={`${daysUntilDue} days`} />
        )}

        {miscarriageRisk && (
          <StatRow
            label="Miscarriage Risk"
            value={`${miscarriageRisk} \u2193`}
            highlight
          />
        )}
      </div>
    </div>
  )
}

function StatRow({
  label,
  value,
  highlight = false,
}: {
  label: string
  value: string
  highlight?: boolean
}) {
  return (
    <div className="flex justify-between items-center py-3 border-b border-white/[0.04] last:border-0">
      <span className="text-sm text-zinc-400">{label}</span>
      <span
        className={`text-sm font-semibold ${highlight ? 'text-green-500' : 'text-white'}`}
      >
        {value}
      </span>
    </div>
  )
}
