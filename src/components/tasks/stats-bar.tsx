'use client'

import { cn } from '@/lib/utils'

export interface TaskStats {
  dueToday: number
  thisWeek: number
  completed: number
  partnerTasks: number
  catchUpQueue: number
}

interface StatsBarProps {
  stats: TaskStats
  activeCard: string | null
  onCardClick: (card: string) => void
}

const statCards = [
  {
    id: 'dueToday',
    icon: '🎯',
    label: 'Due Today',
    iconBg: 'bg-amber-500/15',
    valueColor: 'text-amber-500',
  },
  {
    id: 'thisWeek',
    icon: '📅',
    label: 'This Week',
    iconBg: 'bg-blue-500/15',
    valueColor: 'text-white',
  },
  {
    id: 'completed',
    icon: '✅',
    label: 'Completed',
    iconBg: 'bg-green-500/15',
    valueColor: 'text-green-500',
  },
  {
    id: 'partnerTasks',
    icon: '👥',
    label: "Partner's",
    iconBg: 'bg-purple-500/15',
    valueColor: 'text-white',
  },
  {
    id: 'catchUpQueue',
    icon: '📥',
    label: 'Catch-Up Queue',
    iconBg: 'bg-indigo-500/15',
    valueColor: 'text-indigo-400',
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
    <div className="flex gap-3 mb-6 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 md:overflow-visible md:grid md:gap-4 md:grid-cols-4 lg:grid-cols-5">
      {visibleCards.map(card => {
        const value = getValue(card.id)
        const isActive = activeCard === card.id

        return (
          <button
            key={card.id}
            onClick={() => onCardClick(card.id)}
            className={cn(
              'flex items-center gap-3 p-3 md:p-4 md:pr-5 rounded-xl cursor-pointer transition-all text-left flex-shrink-0',
              'bg-gradient-to-br from-zinc-800 to-zinc-900',
              'border min-w-[140px] md:min-w-0',
              isActive
                ? 'border-amber-500/50 bg-gradient-to-br from-amber-500/10 to-orange-600/5'
                : 'border-white/[0.06] hover:border-white/15'
            )}
          >
            <div className={cn(
              'w-9 h-9 md:w-11 md:h-11 rounded-xl flex items-center justify-center text-lg md:text-xl',
              card.iconBg
            )}>
              {card.icon}
            </div>
            <div>
              <div className={cn('text-xl md:text-2xl font-bold', card.valueColor)}>
                {value}
              </div>
              <div className="text-[10px] md:text-xs text-zinc-500">{card.label}</div>
            </div>
          </button>
        )
      })}
    </div>
  )
}
