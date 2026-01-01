'use client'

import { cn } from '@/lib/utils'
import { BudgetTier, BudgetTemplate } from '@/types'
import { DollarSign, Crown } from 'lucide-react'

type DisplayTier = 'budget' | 'premium'

interface TierFilterProps {
  templates: BudgetTemplate[]
  selectedTier: BudgetTier
  onTierChange: (tier: BudgetTier) => void
}

interface TierStats {
  count: number
  total: number // in cents
}

function calculateTierStats(templates: BudgetTemplate[]): Record<DisplayTier, TierStats> {
  const stats: Record<DisplayTier, TierStats> = {
    budget: { count: 0, total: 0 },
    premium: { count: 0, total: 0 },
  }

  // Only count non-admin items
  templates.filter(t => t.category !== 'Admin').forEach(template => {
    stats.budget.count++
    stats.budget.total += template.price_low
    stats.premium.count++
    stats.premium.total += template.price_high
  })

  return stats
}

function formatPrice(cents: number): string {
  if (cents >= 100000) {
    return `$${(cents / 100).toLocaleString('en-US', { maximumFractionDigits: 0 })}`
  }
  return `$${Math.round(cents / 100).toLocaleString()}`
}

const tierConfig: Record<DisplayTier, {
  label: string
  icon: typeof DollarSign
  description: string
  activeColor: string
  borderColor: string
  textColor: string
}> = {
  budget: {
    label: 'Budget',
    icon: DollarSign,
    description: 'Affordable options',
    activeColor: 'from-emerald-500/40 to-green-500/40',
    borderColor: 'border-emerald-500/50',
    textColor: 'text-emerald-400',
  },
  premium: {
    label: 'Premium',
    icon: Crown,
    description: 'Top-tier picks',
    activeColor: 'from-amber-500/40 to-orange-500/40',
    borderColor: 'border-amber-500/50',
    textColor: 'text-amber-400',
  },
}

export function TierFilter({ templates, selectedTier, onTierChange }: TierFilterProps) {
  const stats = calculateTierStats(templates)
  const displayTiers: DisplayTier[] = ['budget', 'premium']

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-surface-500 mr-1">View:</span>
      {displayTiers.map((tier) => {
        const config = tierConfig[tier]
        const tierStats = stats[tier]
        const isSelected = selectedTier === tier
        const Icon = config.icon

        return (
          <button
            key={tier}
            onClick={() => onTierChange(tier)}
            className={cn(
              'flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-200',
              'backdrop-blur-md border text-sm',
              isSelected
                ? `bg-gradient-to-br ${config.activeColor} ${config.borderColor}`
                : `bg-white/[0.03] border-white/10 hover:bg-white/[0.06] hover:border-white/20`
            )}
          >
            <Icon className={cn('h-3.5 w-3.5', isSelected ? config.textColor : 'text-surface-400')} />
            <span className={cn('font-medium', isSelected ? 'text-white' : 'text-surface-300')}>
              {config.label}
            </span>
            <span className={cn('font-bold', isSelected ? config.textColor : 'text-surface-400')}>
              {formatPrice(tierStats.total)}
            </span>
            <span className="text-[10px] text-surface-500">
              ({tierStats.count})
            </span>
          </button>
        )
      })}
    </div>
  )
}
