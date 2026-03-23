'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { useUser } from '@/components/user-provider'
import { useFamily } from '@/hooks/use-family'
import { useDadChallengeContent, useDadProfile } from '@/hooks/use-dad-journey'
import { getContentPhase } from '@/lib/phase-utils'
import { PILLAR_CONFIG } from '@/lib/dad-pillar-config'
import { DadChallengeTile } from './DadChallengeTile'
import { DadChallengeContent, DadChallengePillar } from '@tdc/shared/types/dad-journey'
import { Skeleton } from '@/components/ui/skeleton'
import { Card3DTilt } from '@/components/ui/animations/Card3DTilt'
import { CardEntrance } from '@/components/ui/animations/CardEntrance'

interface DadChallengeTilesProps {
  maxTiles?: number
}

/**
 * Reorder tiles so that pillars matching the user's declared concerns come first,
 * then remaining pillars in default sort_order.
 */
function reorderByUserConcerns(
  tiles: DadChallengeContent[],
  concerns: string[]
): DadChallengeContent[] {
  if (!concerns.length) return tiles

  // Map concern keys to pillar names where possible
  const concernPillarMap: Record<string, DadChallengePillar> = {
    finances: 'finances',
    relationship_changes: 'relationship',
    being_good_dad: 'baby_bonding',
    work_life_balance: 'anxiety',
    family_interference: 'extended_family',
    health_anxiety: 'anxiety',
    labor_delivery: 'knowledge',
    losing_identity: 'anxiety',
  }

  const priorityPillars = new Set<DadChallengePillar>(
    concerns.map(c => concernPillarMap[c]).filter(Boolean) as DadChallengePillar[]
  )

  const priority = tiles.filter(t => priorityPillars.has(t.pillar))
  const rest = tiles.filter(t => !priorityPillars.has(t.pillar))
  return [...priority, ...rest]
}

export function DadChallengeTiles({ maxTiles = 7 }: DadChallengeTilesProps) {
  const { user, family } = useUser()
  const { data: familyData } = useFamily()

  // Use family from context first (it's always populated in main layout),
  // fall back to React Query if needed
  const resolvedFamily = family ?? familyData

  const phase = resolvedFamily
    ? getContentPhase(resolvedFamily.stage, resolvedFamily.current_week)
    : undefined

  const { data: content, isLoading: contentLoading } = useDadChallengeContent(phase!)
  const { data: dadProfile } = useDadProfile(user.id)

  if (contentLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: Math.min(maxTiles, 3) }).map((_, i) => (
          <Skeleton key={i} className="h-20 w-full rounded-xl" />
        ))}
      </div>
    )
  }

  if (!content || content.length === 0) {
    return (
      <div className="rounded-xl bg-[--card] border border-[--border] p-6 text-center">
        <p className="text-[--muted] text-sm font-body">
          Challenge content will be available soon. Check back after setting up your family profile.
        </p>
      </div>
    )
  }

  // Reorder tiles by user concerns if available
  const ordered = dadProfile?.concerns?.length
    ? reorderByUserConcerns(content, dadProfile.concerns)
    : content

  const visibleTiles = ordered.slice(0, maxTiles)
  const showSeeAllLink = maxTiles < 7 && content.length > maxTiles

  return (
    <div className="space-y-3">
      {visibleTiles.map((tile, index) => {
        const config = PILLAR_CONFIG.find(c => c.pillar === tile.pillar) ?? PILLAR_CONFIG[0]
        return (
          <CardEntrance key={tile.id} delay={index * 80}>
            <Card3DTilt maxTilt={3} gloss>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3, ease: 'easeOut' }}
              >
                <DadChallengeTile content={tile} config={config} />
              </motion.div>
            </Card3DTilt>
          </CardEntrance>
        )
      })}

      {showSeeAllLink && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: visibleTiles.length * 0.05 + 0.1 }}
        >
          <Link
            href="/journey"
            className="flex items-center gap-1.5 text-sm font-ui text-copper hover:text-copper-hover font-medium pt-1"
          >
            See all 7 challenges
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      )}
    </div>
  )
}
