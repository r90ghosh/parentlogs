/**
 * Canonical query key factory for The Dad Center.
 *
 * Both web and mobile apps MUST use these factories so that query keys
 * stay in sync and cache invalidation works cross-platform.
 *
 * Convention:
 *   - Every "root" key has an `all` entry for broad invalidation.
 *   - More specific keys extend the root array.
 *   - Parameters that scope data (familyId, babyId, userId) are always
 *     included in the key so React Query can differentiate caches.
 */
export const queryKeys = {
  // ---------------------------------------------------------------------------
  // Tasks
  // ---------------------------------------------------------------------------
  tasks: {
    /** Invalidate everything under "tasks" */
    all: ['tasks'] as const,
    /** Task list filtered by family, baby, and optional filters */
    list: (familyId: string, babyId?: string | null, filters?: Record<string, unknown>) =>
      ['tasks', familyId, babyId ?? null, filters ?? null] as const,
    /** Single task by ID */
    detail: (taskId: string) => ['tasks', 'detail', taskId] as const,
    /** All tasks for timeline display (ignores premium gating) */
    timeline: (familyId: string, babyId?: string | null) =>
      ['tasks', 'timeline', familyId, babyId ?? null] as const,
    /** Tasks due soon (dashboard widget) */
    due: (familyId: string) => ['tasks', 'due', familyId] as const,
    /** Backlog tasks awaiting triage */
    backlog: (familyId: string, babyId?: string | null) =>
      ['tasks', 'backlog', familyId, babyId ?? null] as const,
    /** Count of pending backlog tasks */
    backlogCount: (familyId: string, babyId?: string | null) =>
      ['tasks', 'backlog-count', familyId, babyId ?? null] as const,
    /** Briefing-linked tasks (dashboard) */
    briefingTasks: ['tasks', 'briefing-tasks'] as const,
  },

  // ---------------------------------------------------------------------------
  // Budget
  // ---------------------------------------------------------------------------
  budget: {
    all: ['budget'] as const,
    /** Browse-able budget templates, optionally filtered by period */
    templates: (period?: string) => ['budget', 'templates', period ?? null] as const,
    /** Family budget summary (totals, category breakdown) */
    summary: (familyId: string) => ['budget', 'summary', familyId] as const,
    /** Flat list of family budget items */
    items: (familyId: string) => ['budget', 'items', familyId] as const,
  },

  // ---------------------------------------------------------------------------
  // Checklists
  // ---------------------------------------------------------------------------
  checklists: {
    all: ['checklists'] as const,
    /** All checklists for a family + baby combo */
    list: (familyId: string, babyId?: string | null) =>
      ['checklists', familyId, babyId ?? null] as const,
    /** Single checklist with items and progress */
    detail: (checklistId: string, familyId: string, babyId?: string | null) =>
      ['checklists', 'detail', checklistId, familyId, babyId ?? null] as const,
  },

  // ---------------------------------------------------------------------------
  // Briefings
  // ---------------------------------------------------------------------------
  briefings: {
    all: ['briefings'] as const,
    /** Current week briefing for a baby/family */
    current: (babyId?: string | null) =>
      ['briefings', 'current', babyId ?? null] as const,
    /** Specific briefing by stage + week */
    byWeek: (stage: string, week: number) =>
      ['briefings', 'byWeek', stage, week] as const,
    /** Full list of all briefings */
    list: () => ['briefings', 'list'] as const,
  },

  // ---------------------------------------------------------------------------
  // Dashboard
  // ---------------------------------------------------------------------------
  dashboard: {
    all: ['dashboard'] as const,
    /** Aggregated dashboard data */
    data: (familyId: string, currentWeek: number, babyId?: string | null) =>
      ['dashboard', familyId, currentWeek, babyId ?? null] as const,
  },

  // ---------------------------------------------------------------------------
  // Tracker (baby logs)
  // ---------------------------------------------------------------------------
  tracker: {
    all: ['tracker'] as const,
    /** Filtered log entries */
    logs: (familyId: string, filters?: Record<string, unknown>) =>
      ['tracker', 'logs', familyId, filters ?? null] as const,
    /** Single log entry */
    detail: (logId: string) => ['tracker', 'detail', logId] as const,
    /** Shift briefing for partner hand-off */
    shiftBriefing: (familyId: string) =>
      ['tracker', 'shift-briefing', familyId] as const,
    /** Daily summary for a specific date */
    dailySummary: (familyId: string, date: string) =>
      ['tracker', 'daily-summary', familyId, date] as const,
    /** Weekly summary */
    weeklySummary: (familyId: string) =>
      ['tracker', 'weekly-summary', familyId] as const,
    /** N-day summary (mobile tracker-summary) */
    summary: (familyId: string, days: number) =>
      ['tracker', 'summary', familyId, days] as const,
  },

  // ---------------------------------------------------------------------------
  // Babies
  // ---------------------------------------------------------------------------
  babies: {
    all: ['babies'] as const,
    /** All babies for a family */
    list: (familyId: string) => ['babies', familyId] as const,
    /** Single baby */
    detail: (babyId: string) => ['babies', 'detail', babyId] as const,
  },

  // ---------------------------------------------------------------------------
  // Family
  // ---------------------------------------------------------------------------
  family: {
    all: ['family'] as const,
    /** Family record */
    detail: (familyId: string) => ['family', familyId] as const,
    /** Family members list */
    members: (familyId: string) => ['family', 'members', familyId] as const,
    /** Partner activity */
    partnerActivity: (familyId: string) =>
      ['family', 'partner-activity', familyId] as const,
  },

  // ---------------------------------------------------------------------------
  // Notifications
  // ---------------------------------------------------------------------------
  notifications: {
    all: ['notifications'] as const,
    /** Notification feed (paginated) */
    feed: (types?: string[]) =>
      ['notifications', 'feed', types ?? null] as const,
    /** Unread notification count */
    unreadCount: () => ['notifications', 'unread-count'] as const,
    /** Notification preferences */
    preferences: (userId: string) =>
      ['notifications', 'preferences', userId] as const,
    /** Push notification window status */
    pushWindowStatus: () => ['notifications', 'push-window-status'] as const,
  },

  // ---------------------------------------------------------------------------
  // Subscription
  // ---------------------------------------------------------------------------
  subscription: {
    all: ['subscription'] as const,
    /** Full subscription record */
    detail: () => ['subscription', 'detail'] as const,
    /** Current tier only */
    tier: () => ['subscription', 'tier'] as const,
    /** Subscription status (past_due, canceling, etc.) */
    status: (userId: string) => ['subscription', 'status', userId] as const,
  },

  // ---------------------------------------------------------------------------
  // Profile
  // ---------------------------------------------------------------------------
  profile: {
    all: ['profile'] as const,
    /** Profile for a specific user */
    detail: (userId: string) => ['profile', userId] as const,
    /** Current authenticated user's profile */
    current: () => ['profile', 'current'] as const,
  },

  // ---------------------------------------------------------------------------
  // Dad Journey (challenges, mood, dad profile)
  // ---------------------------------------------------------------------------
  journey: {
    all: ['journey'] as const,
    /** Challenge content for a content phase */
    challengeContent: (phase: string) =>
      ['journey', 'challenge-content', phase] as const,
    /** Dad profile */
    dadProfile: (userId: string) => ['journey', 'dad-profile', userId] as const,
    /** Last mood check-in */
    lastCheckin: (userId: string) =>
      ['journey', 'mood-checkin', userId] as const,
    /** Mood check-in history */
    moodHistory: (userId: string, limit?: number) =>
      ['journey', 'mood-history', userId, limit ?? null] as const,
  },

  // ---------------------------------------------------------------------------
  // Content / Articles
  // ---------------------------------------------------------------------------
  content: {
    all: ['content'] as const,
    /** Articles filtered by stage */
    articles: (stage?: string) => ['content', 'articles', stage ?? null] as const,
    /** Single article */
    article: (articleId: string) => ['content', 'article', articleId] as const,
  },

  // ---------------------------------------------------------------------------
  // Miscellaneous / UI
  // ---------------------------------------------------------------------------
  misc: {
    /** Snake timeline (web marketing) */
    snakeTimeline: () => ['misc', 'snake-timeline'] as const,
  },
} as const

/**
 * Helper type: extracts the return type of any query key factory function.
 *
 * Usage:
 *   type TasksListKey = QueryKeyOf<typeof queryKeys.tasks.list>
 *   // => readonly ['tasks', string, string | null, Record<string, unknown> | null]
 */
export type QueryKeyOf<T extends (...args: any[]) => readonly unknown[]> = ReturnType<T>
