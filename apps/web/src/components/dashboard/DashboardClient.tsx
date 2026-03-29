'use client'

import { useUser } from '@/components/user-provider'
import { useFamily } from '@/hooks/use-family'
import { useDashboardCards } from '@/hooks/use-dashboard-context'
import { useDashboardData } from '@/hooks/use-dashboard'
import { useSubscription, useCheckout } from '@/hooks/use-subscription'
import { useWelcomeAnimation } from '@/hooks/use-welcome-animation'
import { WelcomeOverlay } from '@/components/welcome/WelcomeOverlay'
import { DashboardHeader } from './DashboardHeader'
import { QuickActionsBar } from './QuickActionsBar'
import { MoodCheckinCard } from './MoodCheckinCard'
import { BriefingTeaserCard } from './BriefingTeaserCard'
import { TasksDueCard } from './TasksDueCard'
import { OnYourMindCard } from './OnYourMindCard'
import dynamic from 'next/dynamic'
import { Skeleton } from '@/components/ui/skeleton'

const CardSkeleton = () => <div className="h-32 rounded-xl bg-[--card] animate-pulse" />

const PersonalizeCard = dynamic(
  () => import('./PersonalizeCard').then(m => ({ default: m.PersonalizeCard })),
  { loading: CardSkeleton }
)
const InvitePartnerCard = dynamic(
  () => import('./InvitePartnerCard').then(m => ({ default: m.InvitePartnerCard })),
  { loading: CardSkeleton }
)
const BudgetSnapshotCard = dynamic(
  () => import('./BudgetSnapshotCard').then(m => ({ default: m.BudgetSnapshotCard })),
  { loading: CardSkeleton }
)
const ChecklistProgressCard = dynamic(
  () => import('./ChecklistProgressCard').then(m => ({ default: m.ChecklistProgressCard })),
  { loading: CardSkeleton }
)
const PartnerActivityCard = dynamic(
  () => import('./PartnerActivityCard').then(m => ({ default: m.PartnerActivityCard })),
  { loading: CardSkeleton }
)
const UpgradePromptCard = dynamic(
  () => import('./UpgradePromptCard').then(m => ({ default: m.UpgradePromptCard })),
  { loading: CardSkeleton }
)
import { Reveal } from '@/components/ui/animations/Reveal'
import { Card3DTilt } from '@/components/ui/animations/Card3DTilt'
import { MedicalDisclaimer } from '@/components/shared/medical-disclaimer'
import { AlertTriangle, CreditCard, Loader2 } from 'lucide-react'
import Link from 'next/link'

// Full-width card IDs (render at top, spanning both columns)
const FULL_WIDTH_CARDS = ['mood', 'partner-activity', 'shift-briefing']

// Left column card IDs
const LEFT_COLUMN_CARDS = ['briefing-teaser', 'on-your-mind', 'upgrade-prompt', 'invite-partner', 'personalize']

// Right column card IDs
const RIGHT_COLUMN_CARDS = ['tasks-due', 'quick-actions', 'budget-snapshot', 'checklist-progress']

export function DashboardClient() {
  const { isVisible: showWelcome, dismiss: dismissWelcome } = useWelcomeAnimation()
  const { profile, activeBaby } = useUser()
  const familyId = profile.family_id!
  const userName = profile?.full_name?.split(' ')[0] || 'there'
  const { data: family } = useFamily()
  const cards = useDashboardCards()
  const currentWeek = activeBaby?.current_week ?? family?.current_week ?? 1
  const { data: dashboardData, isLoading } = useDashboardData(
    familyId,
    currentWeek,
    activeBaby?.id
  )
  const { data: subscription } = useSubscription()
  const { openPortal, isOpeningPortal } = useCheckout()
  const isPastDue = subscription?.status === 'past_due'

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
    <>
    {showWelcome && <WelcomeOverlay onDismiss={dismissWelcome} />}
    <div className="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-10 py-6 md:py-8 bg-[--bg]">
      {/* Header with TypewriterGreeting + CopperDivider */}
      <DashboardHeader
        userName={userName}
        overdueCount={taskStats.overdue}
      />

      <MedicalDisclaimer className="mb-4" />

      {/* Payment Failed Banner */}
      {isPastDue && (
        <div className="mb-6 p-4 rounded-2xl bg-coral/10 border border-coral/20 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-coral shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-ui text-sm font-semibold text-coral">Payment failed</p>
            <p className="font-body text-sm text-coral/80 mt-0.5">
              Your last payment didn&apos;t go through. Update your payment method to keep premium access.
            </p>
            <button
              onClick={() => openPortal()}
              disabled={isOpeningPortal}
              className="mt-2 inline-flex items-center gap-1.5 font-ui text-sm font-semibold text-coral hover:text-coral/80"
            >
              {isOpeningPortal ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <CreditCard className="h-3.5 w-3.5" />
              )}
              Update Payment Method
            </button>
          </div>
          <Link
            href="/settings/subscription"
            className="font-ui text-xs text-coral/60 hover:text-coral/80 shrink-0"
          >
            Details
          </Link>
        </div>
      )}

      {/* Full-width cards (mood check-in, partner activity, shift briefing) */}
      {fullWidthCards.length > 0 && (
        <div className="space-y-4 mb-6">
          {fullWidthCards.map((card) => {
            const component = cardComponents[card.id]
            if (!component) return null
            const delay = cardIndex++ * 120
            return (
              <Reveal variant="card" key={card.id} delay={delay}>
                <Card3DTilt maxTilt={4} gloss>
                  {component}
                </Card3DTilt>
              </Reveal>
            )
          })}
        </div>
      )}

      {/* Two-column desktop layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-4 sm:gap-6">
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
                <Reveal variant="card" key={card.id} delay={delay}>
                  <Card3DTilt maxTilt={4} gloss>
                    {component}
                  </Card3DTilt>
                </Reveal>
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
                <Reveal variant="card" key={card.id} delay={delay}>
                  <Card3DTilt maxTilt={4} gloss>
                    {component}
                  </Card3DTilt>
                </Reveal>
              )
            })
          )}
        </div>
      </div>

    </div>
    </>
  )
}
