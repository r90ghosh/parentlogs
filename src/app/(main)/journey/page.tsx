'use client'

import { useUser } from '@/components/user-provider'
import { useFamily } from '@/hooks/use-family'
import { useDadChallengeContent, useMoodHistory } from '@/hooks/use-dad-journey'
import { getContentPhase } from '@/lib/phase-utils'
import { PILLAR_CONFIG } from '@/lib/dad-pillar-config'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from '@/components/ui/card'
import { ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export default function JourneyPage() {
  const { profile, user } = useUser()
  const { data: family, isLoading: familyLoading } = useFamily()

  const phase = family ? getContentPhase(family.stage, family.current_week) : null
  const { data: content, isLoading: contentLoading } = useDadChallengeContent(phase!)
  const { data: moodHistory } = useMoodHistory(user.id, 7)

  if (familyLoading || contentLoading) {
    return (
      <div className="min-h-screen pb-24 md:pb-8">
        <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-24 w-full rounded-xl" />
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  // Group content by pillar
  const contentByPillar = new Map(
    content?.map(c => [c.pillar, c]) || []
  )

  return (
    <div className="min-h-screen pb-24 md:pb-8">
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Your Journey</h1>
          <p className="text-surface-400 mt-1">
            {phase ? `Phase: ${phase.replace(/-/g, ' ')}` : 'Explore the 7 pillars of the dad challenge'}
          </p>
        </div>

        {/* Mood History Summary */}
        {moodHistory && moodHistory.length > 0 && (
          <Card className="bg-surface-900 border-surface-800">
            <CardContent className="py-4">
              <p className="text-sm text-surface-400 mb-2">Recent mood</p>
              <div className="flex gap-2">
                {moodHistory.map((checkin, i) => (
                  <span key={checkin.id || i} className="text-xl" title={checkin.mood}>
                    {checkin.mood === 'great' ? '😄' :
                     checkin.mood === 'good' ? '🙂' :
                     checkin.mood === 'okay' ? '😐' :
                     checkin.mood === 'rough' ? '😔' : '😞'}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Challenge Tiles */}
        <div className="space-y-3">
          {PILLAR_CONFIG.map((pillar, index) => {
            const pillarContent = contentByPillar.get(pillar.pillar)

            return (
              <motion.div
                key={pillar.pillar}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className={cn(
                  'bg-surface-900 border-surface-800 border-l-4 overflow-hidden cursor-pointer hover:bg-surface-800/80 transition-colors',
                  pillar.borderColor
                )}>
                  <CardContent className="py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{pillar.icon}</span>
                        <div>
                          <p className="font-medium text-white">{pillar.label}</p>
                          {pillarContent && (
                            <p className="text-sm text-surface-400 line-clamp-1 mt-0.5">
                              {pillarContent.headline}
                            </p>
                          )}
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-surface-500 flex-shrink-0" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
