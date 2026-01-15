'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { useBriefings } from '@/hooks/use-briefings'
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
import { BriefingTemplate, FamilyStage } from '@/types'
import { isPregnancyStage, getTrimesterLabel, getTrimesterFromWeek } from '@/lib/pregnancy-utils'

export default function BriefingArchivePage() {
  const { data: briefings, isLoading } = useBriefings()
  const { data: family } = useFamily()

  const currentWeek = family?.current_week || 0
  const currentStage = family?.stage || 'first-trimester'

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
      <div className="flex items-center gap-4">
        <Link
          href="/briefing"
          className="p-2 rounded-lg hover:bg-surface-800 transition-colors"
        >
          <ChevronLeft className="h-5 w-5 text-surface-400" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">Briefing Archive</h1>
          <p className="text-sm text-surface-400">
            Your complete pregnancy and parenting journey
          </p>
        </div>
      </div>

      {/* Current Position Indicator */}
      <Card className="bg-accent-600/10 border-accent-600/30">
        <CardContent className="py-4 flex items-center gap-3">
          <Sparkles className="h-5 w-5 text-accent-400" />
          <span className="text-surface-200">
            You are currently at{' '}
            <strong className="text-accent-400">
              {getTrimesterLabel(currentStage)} Week {currentWeek}
            </strong>
          </span>
        </CardContent>
      </Card>

      {/* Info about content visibility */}
      <p className="text-sm text-surface-500 flex items-center gap-2">
        <Lock className="h-4 w-4" />
        Only your current week shows full content. Other weeks show a preview.
      </p>

      {/* Tabs for Trimester/Stage */}
      <Tabs defaultValue={defaultTab} className="w-full">
        <TabsList className="bg-surface-900 w-full justify-start gap-1 p-1">
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
        <p className="text-surface-400">No briefings available for this stage.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {briefings.map((briefing) => (
        <BriefingCard
          key={briefing.briefing_id}
          briefing={briefing}
          isCurrent={briefing.week === currentWeek}
          isFuture={briefing.week > currentWeek}
          stage={stage}
        />
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
          "h-full transition-all hover:border-surface-600",
          isCurrent && "border-accent-500 bg-accent-900/20",
          isLocked && "bg-surface-900/50 border-surface-800"
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
                    isCurrent && "bg-accent-600"
                  )}
                >
                  Week {briefing.week}
                </Badge>
                {isCurrent && (
                  <Badge variant="outline" className="text-xs border-accent-500 text-accent-400">
                    Current
                  </Badge>
                )}
                {isLocked && (
                  <Lock className="h-3 w-3 text-surface-500" />
                )}
              </div>
              <CardTitle className={cn(
                "text-lg mt-2",
                isLocked ? "text-surface-400" : "text-white"
              )}>
                {briefing.title}
              </CardTitle>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          {/* Baby Update Preview */}
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-blue-400">
              <Baby className="h-3 w-3" />
              Baby Update
            </div>
            <div className="relative">
              <p className={cn(
                "text-sm line-clamp-2",
                isLocked ? "text-surface-500" : "text-surface-300"
              )}>
                {babyPreview}
              </p>
              {isLocked && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-surface-900/90" />
              )}
            </div>
          </div>

          {/* Mom Update Preview */}
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-pink-400">
              <Heart className="h-3 w-3" />
              Mom Update
            </div>
            <div className="relative">
              <p className={cn(
                "text-sm line-clamp-2",
                isLocked ? "text-surface-500" : "text-surface-300"
              )}>
                {momPreview}
              </p>
              {isLocked && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-surface-900/90" />
              )}
            </div>
          </div>

          {/* Dad Focus Count */}
          {briefing.dad_focus && briefing.dad_focus.length > 0 && (
            <div className="pt-2 border-t border-surface-800">
              <span className={cn(
                "text-xs",
                isLocked ? "text-surface-600" : "text-surface-500"
              )}>
                {briefing.dad_focus.length} focus {briefing.dad_focus.length === 1 ? 'area' : 'areas'} for dad
              </span>
            </div>
          )}

          {/* Locked briefing message */}
          {isLocked && (
            <div className="flex items-center gap-2 text-xs text-surface-500 pt-2">
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
