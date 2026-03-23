'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useUser } from '@/components/user-provider'
import { useFamily } from '@/hooks/use-family'
import { useDadChallengeContent } from '@/hooks/use-dad-journey'
import { PILLAR_CONFIG } from '@tdc/shared/constants'
import { getContentPhase } from '@tdc/shared/utils'
import { Skeleton } from '@/components/ui/skeleton'

export function OnYourMindCard() {
  const { profile, activeBaby } = useUser()
  const { data: family } = useFamily()

  const stage = activeBaby?.stage || family?.stage
  const currentWeek = activeBaby?.current_week ?? family?.current_week
  const phase = stage && currentWeek != null ? getContentPhase(stage, currentWeek) : undefined
  const { data: content, isLoading } = useDadChallengeContent(phase!)

  if (isLoading) {
    return <Skeleton className="h-48 w-full rounded-[20px]" />
  }

  // Show up to 2 challenge tiles
  const tiles = (content || []).slice(0, 2)

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'rounded-[20px] p-5',
        'bg-[--card]',
        'border border-[--border]',
        'shadow-card'
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-semibold font-display text-[--cream]">On Your Mind</span>
        <Link
          href="/journey"
          className="text-xs font-ui text-[--muted] hover:text-[--cream] transition-colors flex items-center gap-1"
        >
          See all 7 challenges <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      {tiles.length === 0 ? (
        <div className="py-4 text-center">
          <div className="text-sm font-body text-[--muted]">Challenge content loading...</div>
        </div>
      ) : (
        <div className="space-y-3">
          {tiles.map((item, index) => {
            const pillarCfg = PILLAR_CONFIG.find(p => p.pillar === item.pillar)
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.08 }}
                className={cn(
                  'p-4 rounded-[14px] border-l-4',
                  `bg-gradient-to-r ${pillarCfg?.gradient || 'from-[--card-hover]/40 to-[--card]/40'}`,
                  pillarCfg?.borderColor || 'border-l-[--dim]',
                  'border border-[--border]'
                )}
              >
                <div className="flex items-start gap-3">
                  <span className="text-xl flex-shrink-0">{item.icon || pillarCfg?.icon}</span>
                  <div className="min-w-0">
                    <div className="text-xs font-ui text-[--muted] mb-1">{pillarCfg?.label}</div>
                    <div className="text-sm font-semibold font-display text-[--cream] leading-snug mb-1">
                      {item.headline}
                    </div>
                    <p className="text-xs font-body text-[--muted] line-clamp-2">{item.preview}</p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </motion.div>
  )
}
