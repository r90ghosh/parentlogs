'use client'

import { useUser } from '@/components/user-provider'
import { useFamily } from '@/hooks/use-family'
import { useDashboardCards } from '@/hooks/use-dashboard-context'
import { useDashboardData } from '@/hooks/use-dashboard'
import { DashboardHeader } from './DashboardHeader'
import { QuickActionsBar } from './QuickActionsBar'
import { MoodCheckinCard } from './MoodCheckinCard'
import { BriefingTeaserCard } from './BriefingTeaserCard'
import { TasksDueCard } from './TasksDueCard'
import { OnYourMindCard } from './OnYourMindCard'
import { PersonalizeCard } from './PersonalizeCard'
import { InvitePartnerCard } from './InvitePartnerCard'
import { BudgetSnapshotCard } from './BudgetSnapshotCard'
import { ChecklistProgressCard } from './ChecklistProgressCard'
import { PartnerActivityCard } from './PartnerActivityCard'
import { UpgradePromptCard } from './UpgradePromptCard'
import { Skeleton } from '@/components/ui/skeleton'
import { CardEntrance } from '@/components/ui/animations/CardEntrance'
import { Card3DTilt } from '@/components/ui/animations/Card3DTilt'

interface DashboardClientProps {
  familyId: string
  userName: string
}

// Full-width card IDs (render at top, spanning both columns)
const FULL_WIDTH_CARDS = ['mood', 'partner-activity', 'shift-briefing']

// Left column card IDs
const LEFT_COLUMN_CARDS = ['briefing-teaser', 'on-your-mind', 'upgrade-prompt', 'invite-partner', 'personalize']

// Right column card IDs
const RIGHT_COLUMN_CARDS = ['tasks-due', 'quick-actions', 'budget-snapshot', 'checklist-progress']

export function DashboardClient({
  familyId,
  userName,
}: DashboardClientProps) {
  useUser() // ensures UserProvider context is available for child card components
  const { data: family } = useFamily()
  const cards = useDashboardCards()
  const { data: dashboardData, isLoading } = useDashboardData(
    familyId,
    family?.current_week || 1
  )

  const taskStats = dashboardData?.taskStats || { completed: 0, remaining: 0, overdue: 0 }

  const cardComponents: Record<string, React.ReactNode> = {
    'mood': <MoodCheckinCard />,
    'partner-activity': <PartnerActivityCard partner={dashboardData?.partner || null} />,
    'shift-briefing': null, // Future phase — placeholder
    'briefing-teaser': <BriefingTeaserCard />,
    'tasks-due': <TasksDueCard />,
    'on-your-mind': <OnYourMindCard />,
    'quick-actions': <QuickActionsBar />,
    'upgrade-prompt': <UpgradePromptCard />,
    'personalize': <PersonalizeCard />,
    'invite-partner': <InvitePartnerCard />,
    'budget-snapshot': <BudgetSnapshotCard />,
    'checklist-progress': <ChecklistProgressCard />,
  }

  const fullWidthCards = cards.filter(c => FULL_WIDTH_CARDS.includes(c.id))
  const leftCards = cards.filter(c => LEFT_COLUMN_CARDS.includes(c.id))
  const rightCards = cards.filter(c => RIGHT_COLUMN_CARDS.includes(c.id))

  let cardIndex = 0

  return (
    <div className="max-w-[1600px] mx-auto px-6 md:px-10 py-8 bg-[--bg]">
      {/* Header with TypewriterGreeting + CopperDivider */}
      <DashboardHeader
        userName={userName}
        overdueCount={taskStats.overdue}
      />

      {/* Full-width cards (mood check-in, partner activity, shift briefing) */}
      {fullWidthCards.length > 0 && (
        <div className="space-y-4 mb-6">
          {fullWidthCards.map((card) => {
            const component = cardComponents[card.id]
            if (!component) return null
            const delay = cardIndex++ * 120
            return (
              <CardEntrance key={card.id} delay={delay}>
                <Card3DTilt maxTilt={4} gloss>
                  {component}
                </Card3DTilt>
              </CardEntrance>
            )
          })}
        </div>
      )}

      {/* Two-column desktop layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
        {/* Left column */}
        <div className="space-y-6">
          {isLoading && leftCards.length === 0 ? (
            <>
              <Skeleton className="h-40 w-full rounded-[20px]" />
              <Skeleton className="h-48 w-full rounded-[20px]" />
            </>
          ) : (
            leftCards.map((card) => {
              const component = cardComponents[card.id]
              if (!component) return null
              const delay = cardIndex++ * 120
              return (
                <CardEntrance key={card.id} delay={delay}>
                  <Card3DTilt maxTilt={4} gloss>
                    {component}
                  </Card3DTilt>
                </CardEntrance>
              )
            })
          )}
        </div>

        {/* Right column */}
        <div className="space-y-5">
          {isLoading && rightCards.length === 0 ? (
            <>
              <Skeleton className="h-60 w-full rounded-[20px]" />
              <Skeleton className="h-32 w-full rounded-2xl" />
              <Skeleton className="h-28 w-full rounded-2xl" />
            </>
          ) : (
            rightCards.map((card) => {
              const component = cardComponents[card.id]
              if (!component) return null
              const delay = cardIndex++ * 120
              return (
                <CardEntrance key={card.id} delay={delay}>
                  <Card3DTilt maxTilt={4} gloss>
                    {component}
                  </Card3DTilt>
                </CardEntrance>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
