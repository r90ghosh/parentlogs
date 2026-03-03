'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useUser } from '@/components/user-provider'
import { useFamily } from '@/hooks/use-family'
import { useDadChallengeContent } from '@/hooks/use-dad-journey'
import { PILLAR_CONFIG } from '@/lib/dad-pillar-config'
import { getContentPhase } from '@/lib/phase-utils'
import { Skeleton } from '@/components/ui/skeleton'

export function OnYourMindCard() {
  const { profile } = useUser()
  const { data: family } = useFamily()

  const phase = family ? getContentPhase(family.stage, family.current_week) : undefined
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
        'bg-gradient-to-br from-zinc-800 to-zinc-900',
        'border border-white/[0.06]'
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-semibold text-white">On Your Mind</span>
        <Link
          href="/journey"
          className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors flex items-center gap-1"
        >
          See all 7 challenges <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      {tiles.length === 0 ? (
        <div className="py-4 text-center">
          <div className="text-sm text-zinc-400">Challenge content loading...</div>
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
                  `bg-gradient-to-r ${pillarCfg?.gradient || 'from-zinc-700/40 to-zinc-800/40'}`,
                  pillarCfg?.borderColor || 'border-l-zinc-500',
                  'border border-white/[0.04]'
                )}
              >
                <div className="flex items-start gap-3">
                  <span className="text-xl flex-shrink-0">{item.icon || pillarCfg?.icon}</span>
                  <div className="min-w-0">
                    <div className="text-xs text-zinc-400 mb-1">{pillarCfg?.label}</div>
                    <div className="text-sm font-semibold text-white leading-snug mb-1">
                      {item.headline}
                    </div>
                    <p className="text-xs text-zinc-400 line-clamp-2">{item.preview}</p>
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
