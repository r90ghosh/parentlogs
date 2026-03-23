'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { useBriefings } from '@/hooks/use-briefings'
import { useUser } from '@/components/user-provider'
import { useFamily } from '@/hooks/use-family'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Baby,
  Heart,
  Lock,
  ChevronLeft,
  Sparkles,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { BriefingTemplate, FamilyStage } from '@tdc/shared/types'
import { isPregnancyStage, getTrimesterLabel, getTrimesterFromWeek } from '@tdc/shared/utils'
import { RevealOnScroll, Card3DTilt, CardEntrance } from '@/components/ui/animations'

export default function ArchiveClient() {
  const { data: briefings, isLoading } = useBriefings()
  const { activeBaby } = useUser()
  const { data: family } = useFamily()

  const currentWeek = activeBaby?.current_week ?? family?.current_week ?? 0
  const currentStage = activeBaby?.stage || family?.stage || 'first-trimester'

  // Determine which tab should be active based on current stage
  const defaultTab = useMemo(() => {
    if (!isPregnancyStage(currentStage)) return 'post-birth'
    if (currentStage === 'first-trimester') return 'first-trimester'
    if (currentStage === 'second-trimester') return 'second-trimester'
    if (currentStage === 'third-trimester') return 'third-trimester'
    // Legacy 'pregnancy' - determine by week
    return getTrimesterFromWeek(currentWeek)
  }, [currentStage, currentWeek])

  // Group briefings by trimester
  const groupedBriefings = useMemo(() => {
    if (!briefings) return {
      'first-trimester': [],
      'second-trimester': [],
      'third-trimester': [],
      'post-birth': [],
    }

    const groups: Record<string, BriefingTemplate[]> = {
      'first-trimester': [],
      'second-trimester': [],
      'third-trimester': [],
      'post-birth': [],
    }

    briefings.forEach(b => {
      if (b.stage === 'post-birth') {
        groups['post-birth'].push(b)
      } else if (isPregnancyStage(b.stage as FamilyStage)) {
        // Handle both new trimester stages and legacy 'pregnancy' stage
        if (b.stage === 'first-trimester' || (b.stage === 'pregnancy' && b.week <= 13)) {
          groups['first-trimester'].push(b)
        } else if (b.stage === 'second-trimester' || (b.stage === 'pregnancy' && b.week <= 27)) {
          groups['second-trimester'].push(b)
        } else {
          groups['third-trimester'].push(b)
        }
      }
    })

    // Sort each group by week
    Object.keys(groups).forEach(key => {
      groups[key].sort((a, b) => a.week - b.week)
    })

    return groups
  }, [briefings])

  if (isLoading) {
    return (
      <div className="p-4 space-y-4 max-w-4xl">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4 md:grid-cols-2">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-6 max-w-4xl">
      {/* Header */}
      <CardEntrance delay={0}>
        <div className="flex items-center gap-4">
          <Link
            href="/briefing"
            className="p-2 rounded-lg hover:bg-[--card] transition-colors"
          >
            <ChevronLeft className="h-5 w-5 text-[--muted]" />
          </Link>
          <div>
            <h1 className="text-2xl font-display font-bold text-[--cream]">Briefing Archive</h1>
            <p className="text-sm text-[--muted]">
              Your complete pregnancy and parenting journey
            </p>
          </div>
        </div>
      </CardEntrance>

      {/* Current Position Indicator */}
      <RevealOnScroll delay={0}>
        <Card className="bg-copper-dim border-copper/30">
          <CardContent className="py-4 flex items-center gap-3">
            <Sparkles className="h-5 w-5 text-copper" />
            <span className="text-[--cream]">
              You are currently at{' '}
              <strong className="text-copper">
                {getTrimesterLabel(currentStage)} Week {currentWeek}
              </strong>
            </span>
          </CardContent>
        </Card>
      </RevealOnScroll>

      {/* Info about content visibility */}
      <RevealOnScroll delay={80}>
        <p className="text-sm text-[--dim] flex items-center gap-2">
          <Lock className="h-4 w-4" />
          Only your current week shows full content. Other weeks show a preview.
        </p>
      </RevealOnScroll>

      {/* Tabs for Trimester/Stage */}
      <RevealOnScroll delay={160}>
        <Tabs defaultValue={defaultTab} className="w-full">
        <TabsList className="bg-[--surface] w-full justify-start gap-1 p-1">
          <TabsTrigger value="first-trimester" className="flex-1">
            T1 ({groupedBriefings['first-trimester'].length})
          </TabsTrigger>
          <TabsTrigger value="second-trimester" className="flex-1">
            T2 ({groupedBriefings['second-trimester'].length})
          </TabsTrigger>
          <TabsTrigger value="third-trimester" className="flex-1">
            T3 ({groupedBriefings['third-trimester'].length})
          </TabsTrigger>
          <TabsTrigger value="post-birth" className="flex-1">
            Post-Birth ({groupedBriefings['post-birth'].length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="first-trimester" className="mt-6">
          <BriefingGrid
            briefings={groupedBriefings['first-trimester']}
            currentWeek={defaultTab === 'first-trimester' ? currentWeek : 999}
            stage="first-trimester"
          />
        </TabsContent>

        <TabsContent value="second-trimester" className="mt-6">
          <BriefingGrid
            briefings={groupedBriefings['second-trimester']}
            currentWeek={defaultTab === 'second-trimester' ? currentWeek : 999}
            stage="second-trimester"
          />
        </TabsContent>

        <TabsContent value="third-trimester" className="mt-6">
          <BriefingGrid
            briefings={groupedBriefings['third-trimester']}
            currentWeek={defaultTab === 'third-trimester' ? currentWeek : 999}
            stage="third-trimester"
          />
        </TabsContent>

        <TabsContent value="post-birth" className="mt-6">
          <BriefingGrid
            briefings={groupedBriefings['post-birth']}
            currentWeek={currentStage === 'post-birth' ? currentWeek : -1}
            stage="post-birth"
          />
        </TabsContent>
        </Tabs>
      </RevealOnScroll>
    </div>
  )
}

function BriefingGrid({
  briefings,
  currentWeek,
  stage,
}: {
  briefings: BriefingTemplate[]
  currentWeek: number
  stage: string
}) {
  if (briefings.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-[--muted]">No briefings available for this stage.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {briefings.map((briefing, index) => (
        <RevealOnScroll key={briefing.briefing_id} delay={index * 60}>
          <Card3DTilt maxTilt={3} gloss>
            <BriefingCard
              briefing={briefing}
              isCurrent={briefing.week === currentWeek}
              isFuture={briefing.week > currentWeek}
              stage={stage}
            />
          </Card3DTilt>
        </RevealOnScroll>
      ))}
    </div>
  )
}

function BriefingCard({
  briefing,
  isCurrent,
  isFuture,
  stage,
}: {
  briefing: BriefingTemplate
  isCurrent: boolean
  isFuture: boolean
  stage: string
}) {
  const isPast = !isCurrent && !isFuture
  const isLocked = !isCurrent // Both past and future are locked

  // Truncate content for non-current briefings - show only first 40% of text
  const truncateContent = (text: string, percentage: number = 0.4) => {
    if (isCurrent || !text) return text
    const cutoff = Math.floor(text.length * percentage)
    return text.slice(0, cutoff)
  }

  const babyPreview = truncateContent(briefing.baby_update)
  const momPreview = truncateContent(briefing.mom_update)

  return (
    <Link
      href={`/briefing?week=${briefing.week}&stage=${stage}`}
      className="block"
    >
      <Card
        className={cn(
          "h-full transition-all hover:border-[--border-hover]",
          isCurrent && "border-copper bg-copper-dim",
          isLocked && "bg-[--surface]/50 border-[--border]"
        )}
      >
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <Badge
                  variant={isCurrent ? "default" : "secondary"}
                  className={cn(
                    "text-xs",
                    isCurrent && "bg-copper"
                  )}
                >
                  Week {briefing.week}
                </Badge>
                {isCurrent && (
                  <Badge variant="outline" className="text-xs border-copper text-copper">
                    Current
                  </Badge>
                )}
                {isLocked && (
                  <Lock className="h-3 w-3 text-[--dim]" />
                )}
              </div>
              <CardTitle className={cn(
                "text-lg mt-2",
                isLocked ? "text-[--muted]" : "text-[--cream]"
              )}>
                {briefing.title}
              </CardTitle>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          {/* Baby Update Preview */}
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-sage">
              <Baby className="h-3 w-3" />
              Baby Update
            </div>
            <div className="relative">
              <p className={cn(
                "text-sm line-clamp-2",
                isLocked ? "text-[--dim]" : "text-[--cream]"
              )}>
                {babyPreview}
              </p>
              {isLocked && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[--surface]/90" />
              )}
            </div>
          </div>

          {/* Mom Update Preview */}
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-rose-300">
              <Heart className="h-3 w-3" />
              Mom Update
            </div>
            <div className="relative">
              <p className={cn(
                "text-sm line-clamp-2",
                isLocked ? "text-[--dim]" : "text-[--cream]"
              )}>
                {momPreview}
              </p>
              {isLocked && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[--surface]/90" />
              )}
            </div>
          </div>

          {/* Dad Focus Count */}
          {briefing.dad_focus && briefing.dad_focus.length > 0 && (
            <div className="pt-2 border-t border-[--border]">
              <span className={cn(
                "text-xs",
                isLocked ? "text-[--dim]" : "text-[--muted]"
              )}>
                {briefing.dad_focus.length} focus {briefing.dad_focus.length === 1 ? 'area' : 'areas'} for dad
              </span>
            </div>
          )}

          {/* Locked briefing message */}
          {isLocked && (
            <div className="flex items-center gap-2 text-xs text-[--dim] pt-2">
              <Lock className="h-3 w-3" />
              <span>
                {isFuture
                  ? `Full content unlocks at Week ${briefing.week}`
                  : 'View full briefing'
                }
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}
