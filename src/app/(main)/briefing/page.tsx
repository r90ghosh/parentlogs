'use client'

import { useState } from 'react'
import { useCurrentBriefing, useBriefingByWeek } from '@/hooks/use-briefings'
import { useFamily } from '@/hooks/use-family'
import { useRequirePremium } from '@/hooks/use-require-auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { PaywallOverlay } from '@/components/shared/paywall-overlay'
import {
  ChevronLeft,
  ChevronRight,
  Baby,
  Heart,
  User,
  Lightbulb,
  Calendar,
  BookOpen,
} from 'lucide-react'
import Link from 'next/link'

export default function BriefingPage() {
  const { data: family } = useFamily()
  const { data: currentBriefing, isLoading } = useCurrentBriefing()
  const { isPremium } = useRequirePremium()

  const [viewingWeek, setViewingWeek] = useState<number | null>(null)
  const stage = family?.stage || 'pregnancy'
  const currentWeek = family?.current_week || 0
  const weekToView = viewingWeek ?? currentWeek

  const { data: briefing } = useBriefingByWeek(stage, weekToView)
  const displayBriefing = viewingWeek !== null ? briefing : currentBriefing

  // Premium check: Free users get 4 weeks from their signup
  // For simplicity, we'll check if week > currentWeek + 4
  const isPremiumLocked = !isPremium && Math.abs(weekToView - currentWeek) > 4

  if (isLoading) {
    return (
      <div className="p-4 md:ml-64 space-y-4 max-w-2xl">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-96 w-full" />
      </div>
    )
  }

  return (
    <div className="p-4 md:ml-64 space-y-6 max-w-2xl">
      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setViewingWeek((viewingWeek ?? currentWeek) - 1)}
          disabled={weekToView <= 4}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>

        <div className="text-center">
          <h1 className="text-xl font-bold text-white">
            {stage === 'pregnancy' ? 'Pregnancy' : 'Post-Birth'} Week {weekToView}
          </h1>
          {viewingWeek !== null && viewingWeek !== currentWeek && (
            <button
              onClick={() => setViewingWeek(null)}
              className="text-xs text-accent-500"
            >
              Back to current week
            </button>
          )}
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setViewingWeek((viewingWeek ?? currentWeek) + 1)}
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      {/* Briefing Content */}
      {isPremiumLocked ? (
        <PaywallOverlay feature="briefings_beyond_4_weeks" />
      ) : displayBriefing ? (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white">{displayBriefing.title}</h2>

          {/* Baby Update */}
          <BriefingSection
            icon={Baby}
            iconColor="text-blue-500"
            title="Baby Update"
            content={displayBriefing.baby_update}
          />

          {/* Mom Update */}
          <BriefingSection
            icon={Heart}
            iconColor="text-pink-500"
            title="Mom Update"
            content={displayBriefing.mom_update}
          />

          {/* Dad Focus */}
          <Card className="bg-accent-600/10 border-accent-600/30">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-accent-400">
                <User className="h-5 w-5" />
                Dad Focus
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {displayBriefing.dad_focus.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-accent-500 mt-1">•</span>
                    <span className="text-surface-200">{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Relationship Tip */}
          <BriefingSection
            icon={Lightbulb}
            iconColor="text-amber-500"
            title="Relationship Tip"
            content={displayBriefing.relationship_tip}
          />

          {/* Coming Up */}
          {displayBriefing.coming_up && (
            <BriefingSection
              icon={Calendar}
              iconColor="text-purple-500"
              title="Coming Up"
              content={displayBriefing.coming_up}
            />
          )}

          {/* Source */}
          {displayBriefing.medical_source && (
            <p className="text-xs text-surface-500 flex items-center gap-1">
              <BookOpen className="h-3 w-3" />
              Source: {displayBriefing.medical_source}
            </p>
          )}
        </div>
      ) : (
        <Card className="bg-surface-900 border-surface-800">
          <CardContent className="py-12 text-center">
            <p className="text-surface-400">No briefing available for this week.</p>
          </CardContent>
        </Card>
      )}

      {/* Archive Link */}
      <div className="text-center">
        <Link href="/briefing/archive" className="text-sm text-accent-500 hover:text-accent-400">
          View All Briefings →
        </Link>
      </div>
    </div>
  )
}

function BriefingSection({
  icon: Icon,
  iconColor,
  title,
  content
}: {
  icon: any
  iconColor: string
  title: string
  content: string
}) {
  return (
    <Card className="bg-surface-900 border-surface-800">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Icon className={`h-5 w-5 ${iconColor}`} />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-surface-300">{content}</p>
      </CardContent>
    </Card>
  )
}
