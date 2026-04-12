// Realtime sync configuration
export {
  getRealtimeChannels,
  buildRealtimeFilter,
  type RealtimeEvent,
  type RealtimeTableConfig,
} from './create-realtime-sync'

// Hook factories — each app calls these with platform-specific deps
export { createTaskHooks, type CreateTaskHooksDeps, type TaskServiceLike, type CreateTaskInput, type TaskFilters } from './create-task-hooks'
export { createChecklistHooks, type CreateChecklistHooksDeps, type ChecklistServiceLike } from './create-checklist-hooks'
export { createBudgetHooks, type CreateBudgetHooksDeps, type BudgetServiceLike } from './create-budget-hooks'
export { createBriefingHooks, type CreateBriefingHooksDeps, type BriefingServiceLike } from './create-briefing-hooks'
export { createTrackerHooks, type CreateTrackerHooksDeps, type TrackerServiceLike, type CreateLogInput, type LogFilters } from './create-tracker-hooks'
export { createBabyHooks, type CreateBabyHooksDeps, type BabyServiceLike } from './create-baby-hooks'
