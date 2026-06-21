'use client'

import Link from 'next/link'
import { format, formatDistanceToNowStrict } from 'date-fns'
import {
  Check,
  ArrowRight,
  AlertTriangle,
  CreditCard,
  Loader2,
  Clock,
  Crown,
} from 'lucide-react'
import type { FamilyBudgetItem } from '@tdc/shared/types'
import { cn } from '@/lib/utils'
import { useUser } from '@/components/user-provider'
import { useFamily, useFamilyMembers } from '@/hooks/use-family'
import { useDashboardData, useCompleteDashboardTask } from '@/hooks/use-dashboard'
import { useBudgetSummary, useBudgetItems } from '@/hooks/use-budget'
import { useRecentLogs } from '@/hooks/use-tracker'
import { useChecklists } from '@/hooks/use-checklists'
import { useSubscription, useCheckout } from '@/hooks/use-subscription'
import { useWelcomeAnimation } from '@/hooks/use-welcome-animation'
import { WelcomeOverlay } from '@/components/welcome/WelcomeOverlay'
import { MedicalDisclaimer } from '@/components/shared/medical-disclaimer'
import { Hero, Panel, SectionLabel, ProgressBar } from '@/components/digest'
import { usePageHeader } from '@/components/layouts/topbar-context'

export interface RecommendedArticle {
  slug: string
  title: string
  excerpt: string
  readTime: number
  isFree: boolean
  stageLabel: string
}

const formatPrice = (cents: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100)

function greetingFor(name: string): string {
  const h = new Date().getHours()
  const part = h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening'
  return `${part}, ${name}.`
}

function trimesterLabel(week: number): string {
  if (week <= 13) return 'First trimester'
  if (week <= 27) return 'Second trimester'
  return 'Third trimester'
}

function postBirthPhase(week: number): string {
  if (week <= 12) return 'The fourth trimester'
  if (week <= 26) return '3–6 months'
  if (week <= 52) return '6–12 months'
  if (week <= 78) return '12–18 months'
  return '18+ months'
}

function contextLine(stage: string, week: number, babyName?: string | null): string {
  if (stage === 'post-birth') {
    const name = babyName?.trim()
    const age = `${week} ${week === 1 ? 'week' : 'weeks'} old`
    return [name, age, postBirthPhase(week)].filter(Boolean).join(' · ')
  }
  return `Week ${week} · ${trimesterLabel(week)}`
}

const dueClass = (label: string) =>
  label === 'Due today'
    ? 'text-clay-ink'
    : label === 'Overdue'
      ? 'text-[--amber]'
      : 'text-mute'

function CheckRow({
  title,
  category,
  dueLabel,
  onComplete,
  busy,
}: {
  title: string
  category: string
  dueLabel: string
  onComplete: () => void
  busy?: boolean
}) {
  return (
    <div className="flex items-center gap-3.5 border-b border-line2 px-[18px] py-[15px] last:border-b-0">
      <button
        type="button"
        onClick={onComplete}
        disabled={busy}
        aria-label={`Complete ${title}`}
        className="group grid h-[22px] w-[22px] flex-none place-items-center rounded-full border-2 border-line transition-colors hover:border-clay"
      >
        <Check className="h-3 w-3 text-transparent transition-colors group-hover:text-clay" strokeWidth={3} />
      </button>
      <div className="min-w-0 flex-1">
        <div className="truncate text-[15.5px] font-semibold text-ink">{title}</div>
        <div className="mt-[5px] flex items-center gap-2.5 text-[12.5px]">
          <span className="font-medium capitalize text-mute">{category}</span>
          <span className={cn('ml-auto font-bold', dueClass(dueLabel))}>{dueLabel}</span>
        </div>
      </div>
    </div>
  )
}

function RailCard({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <Panel className="mb-[18px] p-[18px]">
      <div className="mb-3.5 text-[11px] font-bold uppercase tracking-[1.2px] text-faint">{label}</div>
      {children}
    </Panel>
  )
}

function Mini({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex items-center justify-between py-2.5">
      <span className="text-[13.5px] font-semibold text-ink">{label}</span>
      <span className={cn('text-[13.5px] font-extrabold', accent ? 'text-clay-ink' : 'text-ink')}>{value}</span>
    </div>
  )
}

const SkeletonBlock = ({ className }: { className?: string }) => (
  <div className={cn('animate-pulse rounded-[18px] bg-card2', className)} />
)

export function DashboardClient({ recommendedArticle }: { recommendedArticle: RecommendedArticle | null }) {
  const { isVisible: showWelcome, dismiss: dismissWelcome } = useWelcomeAnimation()
  const { user, profile, activeBaby } = useUser()
  const { data: family } = useFamily()
  const { data: members } = useFamilyMembers()

  const firstName = profile.full_name?.split(' ')[0] || 'there'
  const currentWeek = activeBaby?.current_week ?? family?.current_week ?? 1
  const stage = (activeBaby?.stage ?? family?.stage ?? 'pregnancy') as string
  const babyName = activeBaby?.baby_name ?? family?.baby_name
  const isPostBirth = stage === 'post-birth'

  usePageHeader(
    { title: greetingFor(firstName), subtitle: contextLine(stage, currentWeek, babyName) },
    [firstName, stage, currentWeek, babyName]
  )

  const { data: dashboardData, isLoading } = useDashboardData(
    profile.family_id,
    currentWeek,
    activeBaby?.id,
    activeBaby?.stage ?? family?.stage
  )
  const completeTask = useCompleteDashboardTask()
  const { data: budgetSummary } = useBudgetSummary()
  const { data: budgetItems } = useBudgetItems()
  const { data: recentLogs } = useRecentLogs(1)
  const { data: checklists } = useChecklists()
  const { data: subscription } = useSubscription()
  const { openPortal, isOpeningPortal } = useCheckout()

  const isPastDue = subscription?.status === 'past_due'
  const isFree = profile.subscription_tier === 'free'

  const briefing = dashboardData?.briefing
  const priorityTasks = dashboardData?.priorityTasks ?? []
  const overdue = dashboardData?.taskStats.overdue ?? 0
  const todayTasks = priorityTasks.filter((t) => t.dueLabel === 'Due today')
  const weekTasks = priorityTasks.filter((t) => !t.isOverdue && t.dueLabel !== 'Due today')
  const taskSection = todayTasks.length > 0
    ? { label: `Today · ${todayTasks.length} ${todayTasks.length === 1 ? 'task' : 'tasks'}`, tasks: todayTasks }
    : weekTasks.length > 0
      ? { label: `This week · ${weekTasks.length}`, tasks: weekTasks }
      : null

  // Budget rail
  const purchasedTotal = budgetSummary?.purchasedTotal ?? 0
  const remainingTotal = budgetSummary?.remainingTotal ?? 0
  const budgetTotalItems = budgetItems?.length ?? 0
  const budgetBought = budgetItems?.filter((i: FamilyBudgetItem) => i.is_purchased).length ?? 0
  const budgetPct = purchasedTotal + remainingTotal > 0 ? purchasedTotal / (purchasedTotal + remainingTotal) : 0

  // Tracker rail
  const latestLog = recentLogs?.[0]
  const logTypeLabel: Record<string, string> = {
    feeding: 'feed', diaper: 'change', sleep: 'sleep', temperature: 'temp',
    medicine: 'medicine', vitamin_d: 'vitamin D', mood: 'mood', weight: 'weight',
    height: 'height', milestone: 'milestone',
  }

  // Checklist rail (pregnancy)
  const checklistDone = checklists?.reduce((sum, c) => sum + (c.progress?.completed ?? 0), 0) ?? 0
  const checklistTotal = checklists?.reduce((sum, c) => sum + (c.progress?.total ?? 0), 0) ?? 0

  return (
    <>
      {showWelcome && <WelcomeOverlay onDismiss={dismissWelcome} />}

      <MedicalDisclaimer className="mb-5" />

      {isPastDue && (
        <div className="mb-5 flex items-start gap-3 rounded-2xl border border-danger/25 bg-danger/10 p-4">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-danger" />
          <div className="flex-1">
            <p className="text-sm font-bold text-danger">Payment failed</p>
            <p className="mt-0.5 text-sm text-danger/80">
              Your last payment didn&apos;t go through. Update your payment method to keep premium access.
            </p>
            <button
              onClick={() => openPortal()}
              disabled={isOpeningPortal}
              className="mt-2 inline-flex items-center gap-1.5 text-sm font-bold text-danger hover:opacity-80"
            >
              {isOpeningPortal ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CreditCard className="h-3.5 w-3.5" />}
              Update Payment Method
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 items-start gap-7 lg:grid-cols-[minmax(0,1fr)_336px]">
        {/* Main column */}
        <div className="min-w-0">
          {isLoading && !briefing ? (
            <SkeletonBlock className="h-44 w-full" />
          ) : (
            <Hero
              kicker="This week · Briefing"
              title={briefing?.title || `Week ${currentWeek}`}
              meta={`Week ${currentWeek}`}
              cta={{ label: 'Read the briefing', href: '/briefing' }}
            >
              {briefing?.excerpt || 'Your weekly briefing is ready — tap to read what matters this week.'}
            </Hero>
          )}

          {taskSection && (
            <>
              <SectionLabel
                more={
                  <Link href="/tasks" className="hover:text-clay-ink">
                    View all →
                  </Link>
                }
              >
                {taskSection.label}
              </SectionLabel>
              <Panel>
                {taskSection.tasks.slice(0, 3).map((t) => (
                  <CheckRow
                    key={t.id}
                    title={t.title}
                    category={t.category.replace('_', ' ')}
                    dueLabel={t.dueLabel}
                    busy={completeTask.isPending}
                    onComplete={() => completeTask.mutate(t.id)}
                  />
                ))}
              </Panel>
            </>
          )}

          {overdue > 0 && (
            <Link
              href="/tasks"
              className="mt-3.5 flex items-center gap-3 rounded-2xl border border-[--amber]/25 bg-[--amber]/10 px-[18px] py-[15px] transition-opacity hover:opacity-90"
            >
              <Clock className="h-[19px] w-[19px] flex-none text-[--amber]" />
              <div className="min-w-0 flex-1">
                <div className="text-[14.5px] font-bold text-[--amber]">
                  {overdue} {overdue === 1 ? 'task' : 'tasks'} to catch up
                </div>
                <div className="mt-0.5 text-[12.5px] font-medium text-mute">Tidy your backlog when you have a minute</div>
              </div>
              <ArrowRight className="h-4 w-4 flex-none text-[--amber]" />
            </Link>
          )}

          {recommendedArticle && (
            <>
              <SectionLabel>Recommended read</SectionLabel>
              <Link href={`/blog/${recommendedArticle.slug}`}>
                <Panel className="p-[18px] transition-colors hover:bg-card-hover">
                  <div className="text-[10.5px] font-bold uppercase tracking-[0.8px] text-mute">
                    {recommendedArticle.stageLabel}
                  </div>
                  <h4 className="mt-1.5 text-[17px] font-bold leading-[1.3] text-ink">{recommendedArticle.title}</h4>
                  {recommendedArticle.excerpt && (
                    <p className="mt-[7px] max-w-[60ch] text-[13.5px] leading-[1.5] text-ink2 line-clamp-2">
                      {recommendedArticle.excerpt}
                    </p>
                  )}
                  <div className="mt-2.5 text-[12.5px] font-semibold text-mute">
                    {recommendedArticle.readTime} min read · {recommendedArticle.isFree ? 'Free' : 'Premium'}
                  </div>
                </Panel>
              </Link>
            </>
          )}
        </div>

        {/* Right rail */}
        <div className="min-w-0">
          <RailCard label="Your progress">
            <Mini label="Budget" value={formatPrice(purchasedTotal)} />
            <ProgressBar value={budgetPct} />
            <div className="mt-[7px] text-[11.5px] font-semibold text-mute">
              {budgetTotalItems > 0 ? `${budgetBought} of ${budgetTotalItems} items bought` : 'Start your budget'}
            </div>

            {isPostBirth ? (
              <>
                <Mini
                  label="Tracker"
                  value={latestLog ? `Last ${logTypeLabel[latestLog.log_type] ?? 'log'}` : 'Log a feed'}
                  accent={!latestLog}
                />
                <div className="text-[11.5px] font-semibold text-mute">
                  {latestLog
                    ? `Logged ${formatDistanceToNowStrict(new Date(latestLog.logged_at))} ago`
                    : 'Nothing logged yet today'}
                </div>
              </>
            ) : (
              <>
                <Mini
                  label="Checklists"
                  value={checklistTotal > 0 ? `${checklistDone}/${checklistTotal}` : 'Get started'}
                  accent={checklistTotal === 0}
                />
                <div className="text-[11.5px] font-semibold text-mute">
                  {checklistTotal > 0 ? 'Items checked off' : 'Open your first checklist'}
                </div>
              </>
            )}
          </RailCard>

          <RailCard label="Your family">
            {(members ?? []).map((m) => {
              const isSelf = m.id === user.id
              const role = m.role ? m.role.charAt(0).toUpperCase() + m.role.slice(1) : 'Parent'
              const sub = isSelf ? `You · ${role}` : `${role} · joined ${format(new Date(m.created_at), 'MMM d')}`
              return (
                <div key={m.id} className="flex items-center gap-3 py-2.5">
                  <span className="grid h-[34px] w-[34px] flex-none place-items-center overflow-hidden rounded-full bg-clay-soft text-[13px] font-extrabold text-clay-ink">
                    {m.avatar_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={m.avatar_url} alt="" className="h-full w-full object-cover" />
                    ) : (
                      m.full_name?.charAt(0).toUpperCase() || 'U'
                    )}
                  </span>
                  <div className="min-w-0">
                    <div className="truncate text-[13.5px] font-bold text-ink">{m.full_name}</div>
                    <div className="text-[11.5px] text-mute">{sub}</div>
                  </div>
                </div>
              )
            })}
            <p className="mt-2 text-[11.5px] font-medium leading-[1.5] text-mute">One subscription covers you both.</p>
          </RailCard>

          {isFree && (
            <Panel className="border-l-[3px] border-l-clay p-[18px]">
              <div className="flex items-center gap-2">
                <Crown className="h-4 w-4 text-clay-ink" />
                <span className="text-[11px] font-bold uppercase tracking-[1.2px] text-clay-ink">Premium</span>
              </div>
              <p className="mt-2 text-[13.5px] leading-[1.5] text-ink2">
                Unlock every briefing, the full task timeline, and the complete library.
              </p>
              <Link
                href="/upgrade"
                className="mt-3 inline-flex items-center gap-1.5 text-[13.5px] font-bold text-clay-ink hover:opacity-80"
              >
                See plans <ArrowRight className="h-4 w-4" />
              </Link>
            </Panel>
          )}
        </div>
      </div>
    </>
  )
}
