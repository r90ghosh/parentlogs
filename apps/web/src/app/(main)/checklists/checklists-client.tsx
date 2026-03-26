'use client'

import { useState, useMemo } from 'react'
import { useChecklists } from '@/hooks/use-checklists'
import { useUser } from '@/components/user-provider'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Progress } from '@/components/ui/progress'
import Link from 'next/link'
import { FileText, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { RevealOnScroll } from '@/components/ui/animations/RevealOnScroll'
import { Card3DTilt } from '@/components/ui/animations/Card3DTilt'
import { CardEntrance } from '@/components/ui/animations/CardEntrance'
import { CHECKLIST_ICONS, CHECKLIST_COLORS } from '@/lib/checklist-constants'
import { ChecklistTimelineBar } from '@/components/shared/checklist-timeline-bar'
import {
  type TimelineCategory,
  getCurrentTimelineCategory,
  getChecklistStatsByCategory,
  checklistOverlapsCategory,
} from '@tdc/shared/utils'

export default function ChecklistsClient() {
  const { data: checklists, isLoading } = useChecklists()
  const { family, activeBaby } = useUser()

  const [selectedCategory, setSelectedCategory] = useState<TimelineCategory | null>(null)

  const timelineSource = activeBaby || family || null

  const currentCategory = useMemo(() => {
    if (!timelineSource) return 'third-trimester' as TimelineCategory
    return getCurrentTimelineCategory(timelineSource)
  }, [timelineSource])

  const checklistStats = useMemo(() => {
    if (!checklists) return null
    return getChecklistStatsByCategory(checklists)
  }, [checklists])

  const filteredChecklists = useMemo(() => {
    if (!checklists) return []
    if (!selectedCategory) return checklists
    return checklists.filter(cl =>
      checklistOverlapsCategory(cl.stage, cl.week_relevant, selectedCategory)
    )
  }, [checklists, selectedCategory])

  return (
    <div className="p-4 space-y-6 max-w-4xl">
      {/* Header */}
      <RevealOnScroll delay={0}>
      <div>
        <h1 className="text-2xl font-display font-bold text-[--cream]">Checklists</h1>
        <p className="text-[--muted] mt-1 font-body">
          Stay organized with our curated preparation checklists
        </p>
      </div>
      </RevealOnScroll>

      {/* Timeline Filter */}
      {!isLoading && checklistStats && (
        <RevealOnScroll delay={50}>
          <ChecklistTimelineBar
            stats={checklistStats}
            currentCategory={currentCategory}
            selectedCategory={selectedCategory}
            onCategoryClick={setSelectedCategory}
          />
        </RevealOnScroll>
      )}

      {/* Checklists Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(9)].map((_, i) => (
            <Skeleton key={i} className="h-40" />
          ))}
        </div>
      ) : filteredChecklists.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredChecklists.map((checklist, index) => {
            const Icon = CHECKLIST_ICONS[checklist.checklist_id] || FileText
            const colors = CHECKLIST_COLORS[checklist.checklist_id] || CHECKLIST_COLORS['CL-15']

            return (
              <CardEntrance key={checklist.checklist_id} delay={index * 80} className="h-full">
              <Card3DTilt maxTilt={3} gloss className="h-full">
              <Link
                href={`/checklists/${checklist.checklist_id}`}
                className="block h-full"
              >
                <Card className="bg-[--surface] border-[--border] h-full transition-all hover:border-[--border-hover]">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className={cn("p-3 rounded-lg", colors.bg)}>
                        <Icon className={cn("h-6 w-6", colors.text)} />
                      </div>
                      {checklist.progress.percentage === 100 && (
                        <CheckCircle className="h-5 w-5 text-copper" />
                      )}
                    </div>

                    <h3 className="font-medium text-[--cream] mb-1 font-body">{checklist.name}</h3>
                    <p className="text-xs text-[--muted] mb-4 line-clamp-2 font-body">
                      {checklist.description}
                    </p>

                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-ui">
                        <span className="text-[--muted]">
                          {checklist.progress.completed} of {checklist.progress.total} items
                        </span>
                        <span className={colors.text}>
                          {checklist.progress.percentage}%
                        </span>
                      </div>
                      <Progress
                        value={checklist.progress.percentage}
                        className="h-1.5 bg-[--card]"
                      />
                    </div>
                  </CardContent>
                </Card>
              </Link>
              </Card3DTilt>
              </CardEntrance>
            )
          })}
        </div>
      ) : (
        <Card className="bg-[--surface] border-[--border]">
          <CardContent className="py-12 text-center">
            <p className="text-[--muted] font-body">No checklists in this phase</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
