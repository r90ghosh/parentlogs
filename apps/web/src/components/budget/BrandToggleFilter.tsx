'use client'

import { cn } from '@/lib/utils'
import { BudgetBrandView } from '@tdc/shared/types'
import { Crown, Sparkles } from 'lucide-react'

interface BrandToggleFilterProps {
  selectedView: BudgetBrandView
  onViewChange: (view: BudgetBrandView) => void
}

const viewConfig: Record<BudgetBrandView, {
  label: string
  icon: typeof Crown
  description: string
  activeColor: string
  borderColor: string
  textColor: string
}> = {
  premium: {
    label: 'Premium Picks',
    icon: Crown,
    description: 'Top-tier brands',
    activeColor: 'from-gold/40 to-gold/20',
    borderColor: 'border-gold/50',
    textColor: 'text-gold',
  },
  value: {
    label: 'Best Value',
    icon: Sparkles,
    description: 'Best bang for your buck',
    activeColor: 'from-sage/40 to-sage/20',
    borderColor: 'border-sage/50',
    textColor: 'text-sage',
  },
}

export function BrandToggleFilter({ selectedView, onViewChange }: BrandToggleFilterProps) {
  const views: BudgetBrandView[] = ['premium', 'value']

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-[--dim] mr-1 font-ui">Brands:</span>
      {views.map((view) => {
        const config = viewConfig[view]
        const isSelected = selectedView === view
        const Icon = config.icon

        return (
          <button
            key={view}
            onClick={() => onViewChange(view)}
            className={cn(
              'flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-200',
              'backdrop-blur-md border text-sm font-ui',
              isSelected
                ? `bg-gradient-to-br ${config.activeColor} ${config.borderColor}`
                : `bg-white/[0.03] border-[--border] hover:bg-white/[0.06] hover:border-[--border-hover]`
            )}
          >
            <Icon className={cn('h-3.5 w-3.5', isSelected ? config.textColor : 'text-[--muted]')} />
            <span className={cn('font-medium font-ui', 'text-[--cream]')}>
              {config.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}
