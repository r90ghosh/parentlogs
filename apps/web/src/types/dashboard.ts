// Dashboard-specific types

export interface BabyDevelopment {
  week: number
  trimester: 1 | 2 | 3
  sizeComparison: string      // "lime", "avocado", etc.
  sizeEmoji: string           // emoji
  lengthInches: number
  weightOz: number
  heartRateBpm: number
  keyDevelopments: string[]
}

export interface MomSymptom {
  name: string
  isCommon: boolean           // Highlighted if common this week
}

export interface DadTip {
  week: number
  tip: string
}

export interface PriorityTask {
  id: string
  title: string
  category: 'medical' | 'planning' | 'shopping' | 'financial' | 'partner' | 'self_care'
  timeEstimate: string        // "10 min", "1 hour"
  dueLabel: string            // "Due today", "This week"
  isUrgent: boolean
  isOverdue: boolean
}

export interface UpcomingEvent {
  id: string
  title: string
  date: Date
  time?: string
  location?: string
  icon: string                // emoji
}

export interface PartnerActivity {
  name: string
  initial: string
  lastActive: string          // "2 min ago"
  isSynced: boolean
  recentTasks: Array<{
    title: string
    status: 'completed' | 'in-progress'
    time: string
  }>
}

export interface WeeklyBriefing {
  week: number
  title: string               // "The Safe Zone"
  excerpt: string
  isNew: boolean
}

export interface Achievement {
  title: string
  description: string
  icon: string
}

export interface TaskStats {
  completed: number
  remaining: number
  overdue: number
}

export interface DashboardData {
  user: {
    name: string
    role: 'dad' | 'mom'
  }
  pregnancy: {
    currentWeek: number
    dueDate: Date
    daysToGo: number
    weeksToGo: number
  }
  baby: BabyDevelopment
  momSymptoms: MomSymptom[]
  dadTip: DadTip
  priorityTasks: PriorityTask[]
  taskStats: TaskStats
  upcomingEvents: UpcomingEvent[]
  partner: PartnerActivity | null
  briefing: WeeklyBriefing
  achievement: Achievement | null
}
