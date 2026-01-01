'use client'

import { differenceInDays, differenceInWeeks } from 'date-fns'
import { useDashboardData, useCompleteDashboardTask, useSnoozeDashboardTask } from '@/hooks/use-dashboard'
import { getBabyDevelopment, getMomSymptoms, getDadTip, getAchievement } from '@/lib/baby-development-data'
import { DashboardHeader } from './DashboardHeader'
import { BabyDevelopmentCard } from './BabyDevelopmentCard'
import { MomStatusCard } from './MomStatusCard'
import { CountdownCard } from './CountdownCard'
import { ProgressCard } from './ProgressCard'
import { PriorityTasksCard } from './PriorityTasksCard'
import { QuickActionsBar } from './QuickActionsBar'
import { UpcomingEventsCard } from './UpcomingEventsCard'
import { PartnerActivityCard } from './PartnerActivityCard'
import { WeeklyBriefingCard } from './WeeklyBriefingCard'
import { AchievementBanner } from './AchievementBanner'
import { Skeleton } from '@/components/ui/skeleton'

interface DashboardClientProps {
  userId: string
  familyId: string
  userName: string
  partnerName: string
  currentWeek: number
  dueDate: string
}

export function DashboardClient({
  familyId,
  userName,
  partnerName,
  currentWeek,
  dueDate,
}: DashboardClientProps) {
  const { data: dashboardData, isLoading } = useDashboardData(familyId, currentWeek)
  const completeTask = useCompleteDashboardTask()
  const snoozeTask = useSnoozeDashboardTask()

  // Calculate countdown values
  const dueDateObj = new Date(dueDate)
  const today = new Date()
  const daysToGo = Math.max(0, differenceInDays(dueDateObj, today))
  const weeksToGo = Math.max(0, differenceInWeeks(dueDateObj, today))

  // Get static data for current week
  const baby = getBabyDevelopment(currentWeek)
  const symptoms = getMomSymptoms(currentWeek)
  const dadTip = getDadTip(currentWeek)
  const achievement = getAchievement(currentWeek)

  // Calculate progress percentage
  const taskStats = dashboardData?.taskStats || { completed: 0, remaining: 0, overdue: 0 }
  const totalTasks = taskStats.completed + taskStats.remaining
  const percentComplete = totalTasks > 0 ? Math.round((taskStats.completed / totalTasks) * 100) : 0

  // Get briefing with fallback
  const briefing = dashboardData?.briefing || {
    week: currentWeek,
    title: `Week ${currentWeek}`,
    excerpt: 'Your weekly briefing will appear here...',
    isNew: true,
  }

  // Handle task actions
  const handleComplete = (taskId: string) => {
    completeTask.mutate(taskId)
  }

  const handleSnooze = (taskId: string) => {
    snoozeTask.mutate(taskId)
  }

  return (
    <main className="flex-1 py-8 px-6 md:px-10 max-w-[1600px]">
      {/* Header */}
      <DashboardHeader
        userName={userName}
        overdueCount={taskStats.overdue}
      />

      {/* Hero Section - Baby & Mom Status */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <BabyDevelopmentCard baby={baby} />
        <MomStatusCard
          partnerName={partnerName}
          symptoms={symptoms}
          dadTip={dadTip.tip}
        />
      </section>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
        {/* Left Column */}
        <div className="flex flex-col gap-6">
          {isLoading ? (
            <>
              <Skeleton className="h-80 w-full rounded-[20px]" />
              <Skeleton className="h-32 w-full rounded-[20px]" />
              <Skeleton className="h-48 w-full rounded-[20px]" />
            </>
          ) : (
            <>
              <PriorityTasksCard
                tasks={dashboardData?.priorityTasks || []}
                onComplete={handleComplete}
                onSnooze={handleSnooze}
              />
              <QuickActionsBar />
              <UpcomingEventsCard events={dashboardData?.upcomingEvents || []} />
            </>
          )}
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-5">
          <CountdownCard
            daysToGo={daysToGo}
            weeksToGo={weeksToGo}
            dueDate={dueDateObj}
          />

          <ProgressCard
            completed={taskStats.completed}
            remaining={taskStats.remaining}
            overdue={taskStats.overdue}
            percentComplete={percentComplete}
          />

          {isLoading ? (
            <>
              <Skeleton className="h-40 w-full rounded-2xl" />
              <Skeleton className="h-36 w-full rounded-2xl" />
            </>
          ) : (
            <>
              <PartnerActivityCard partner={dashboardData?.partner || null} />
              <WeeklyBriefingCard briefing={briefing} />
            </>
          )}

          {/* Achievement Banner - Show if there's a milestone for this week */}
          {achievement && (
            <AchievementBanner achievement={achievement} />
          )}
        </div>
      </div>
    </main>
  )
}
