'use client'

import { cn } from '@/lib/utils'
import type { TaskStats } from '@tdc/shared/types'

interface StatsBarProps {
  stats: TaskStats
  activeCard: string | null
  onCardClick: (card: string) => void
}

const statCards = [
  {
    id: 'dueToday',
    label: 'Due Today',
    color: 'text-copper',
    bg: 'bg-copper-dim',
    border: 'border-copper/20',
    activeBorder: 'border-copper/60',
  },
  {
    id: 'thisWeek',
    label: 'This Week',
    color: 'text-[--cream]',
    bg: 'bg-gold-dim',
    border: 'border-gold/20',
    activeBorder: 'border-gold/60',
  },
  {
    id: 'completed',
    label: 'Completed',
    color: 'text-sage',
    bg: 'bg-[--sage-dim]',
    border: 'border-sage/20',
    activeBorder: 'border-sage/60',
  },
  {
    id: 'partnerTasks',
    label: "Partner's",
    color: 'text-rose',
    bg: 'bg-rose-dim',
    border: 'border-rose/20',
    activeBorder: 'border-rose/60',
  },
  {
    id: 'catchUpQueue',
    label: 'Catch-Up',
    color: 'text-gold',
    bg: 'bg-gold-dim',
    border: 'border-gold/20',
    activeBorder: 'border-gold/60',
  },
]

export function StatsBar({ stats, activeCard, onCardClick }: StatsBarProps) {
  const getValue = (id: string): number => {
    switch (id) {
      case 'dueToday': return stats.dueToday
      case 'thisWeek': return stats.thisWeek
      case 'completed': return stats.completed
      case 'partnerTasks': return stats.partnerTasks
      case 'catchUpQueue': return stats.catchUpQueue
      default: return 0
    }
  }

  // Filter out catch-up queue if 0
  const visibleCards = statCards.filter(card =>
    card.id !== 'catchUpQueue' || stats.catchUpQueue > 0
  )

  return (
    <div className="flex items-center gap-1.5 flex-wrap py-1 mb-4">
      {visibleCards.map(card => {
        const value = getValue(card.id)
        const isActive = activeCard === card.id

        return (
          <button
            key={card.id}
            onClick={() => onCardClick(card.id)}
            className={cn(
              'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] font-ui font-bold tabular-nums border transition-all cursor-pointer',
              card.bg,
              card.color,
              isActive ? card.activeBorder : card.border,
              isActive && 'ring-1 ring-current/20'
            )}
          >
            <span className="text-[10px] font-medium opacity-75">{card.label}</span>
            {value}
          </button>
        )
      })}
    </div>
  )
}
