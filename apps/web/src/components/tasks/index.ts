// Task components barrel export

// New design components
export { TasksHeader } from './tasks-header'
export { StatsBar } from './stats-bar'
export type { TaskStats } from './stats-bar'
export { FilterBar } from './filter-bar'
export { TaskItem } from './task-item'
export { TaskSection, SectionAction } from './task-section'
export { CatchUpBanner } from './catch-up-banner'
export { CatchUpSection } from './catch-up-section'
export { CatchUpTaskItem } from './catch-up-task-item'
export { FocusCard } from './focus-card'
export { WeekCalendarCard, generateWeekDays } from './week-calendar-card'
export { ProgressCard } from './progress-card'
export { StreakBanner } from './streak-banner'
export { TasksPageClient } from './tasks-page-client'

// Legacy components (may still be used elsewhere)
export { ProgressHeader } from './progress-header'
export { TodaysFocusCard } from './todays-focus-card'
export { WeekTaskCard } from './week-task-card'
export { ThisWeekSection } from './this-week-section'
export { ProgressStats } from './progress-stats'
export { ComingUpPreview } from './coming-up-preview'
export { TaskDetailSheet } from './task-detail-sheet'

// Animation exports
export * from './animations/task-animations'
export { Confetti, CheckBurst } from './animations/confetti'
