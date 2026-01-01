// User & Auth Types
export type UserRole = 'mom' | 'dad' | 'other'
export type SubscriptionTier = 'free' | 'premium' | 'lifetime'

export interface User {
  id: string
  email: string
  full_name: string
  avatar_url?: string
  role: UserRole
  family_id?: string
  subscription_tier: SubscriptionTier
  subscription_expires_at?: string
  onboarding_completed?: boolean
  signup_week?: number
  created_at: string
  updated_at: string
}

// Family Types
export type FamilyStage =
  | 'pregnancy'           // Legacy - kept for backward compatibility
  | 'first-trimester'
  | 'second-trimester'
  | 'third-trimester'
  | 'post-birth'

export type PregnancyTrimester = 'first-trimester' | 'second-trimester' | 'third-trimester'

export interface Family {
  id: string
  name?: string
  due_date?: string
  birth_date?: string
  baby_name?: string
  stage: FamilyStage
  current_week: number
  invite_code: string
  created_at: string
  updated_at: string
}

export interface FamilyMember extends User {
  is_owner: boolean
}

// Task Types
export type TaskStatus = 'pending' | 'completed' | 'skipped' | 'snoozed'
export type TaskPriority = 'must-do' | 'good-to-do'
export type TaskAssignee = 'mom' | 'dad' | 'both' | 'either'
export type TaskCategory = 'medical' | 'shopping' | 'planning' | 'financial' | 'partner' | 'self_care'
export type BacklogStatus = 'pending' | 'triaged'
export type TriageAction = 'completed' | 'added' | 'skipped'
export type BacklogCategory = 'still_relevant' | 'window_passed' | 'probably_done'

export interface TaskTemplate {
  task_id: string
  title: string
  description: string
  stage: FamilyStage
  week?: number
  due_date_offset_days: number
  default_assignee: TaskAssignee
  category: string
  priority: TaskPriority
  is_premium: boolean
  sort_order: number
  time_estimate_minutes?: number
  related_article_slug?: string
  // Catch-up fields
  is_time_sensitive?: boolean
  window_weeks?: number
  commonly_completed_early?: boolean
  why_it_matters?: string
}

export interface FamilyTask {
  id: string
  family_id: string
  task_template_id?: string
  title: string
  description: string
  due_date: string
  week_due?: number
  assigned_to: TaskAssignee
  status: TaskStatus
  priority: TaskPriority
  category: string
  completed_by?: string
  completed_at?: string
  snoozed_until?: string
  notes?: string
  is_custom: boolean
  time_estimate_minutes?: number
  related_article_slug?: string
  why_it_matters?: string
  // Catch-up fields
  is_backlog?: boolean
  backlog_status?: BacklogStatus
  triage_action?: TriageAction
  triage_date?: string
  // Joined from template (for catch-up logic)
  is_time_sensitive?: boolean
  window_weeks?: number
  commonly_completed_early?: boolean
  created_at: string
  updated_at: string
}

export interface TaskStats {
  dueToday: number
  thisWeek: number
  completed: number
  partnerTasks: number
  catchUpQueue: number
}

// Briefing Types
export interface BriefingTemplate {
  briefing_id: string
  stage: FamilyStage
  week: number
  title: string
  baby_update: string
  mom_update: string
  dad_focus: string[]
  relationship_tip: string
  coming_up: string
  medical_source: string
  linked_task_ids: string[]
  is_premium: boolean
}

// Baby Tracker Types
export type LogType =
  | 'feeding'
  | 'diaper'
  | 'sleep'
  | 'temperature'
  | 'medicine'
  | 'vitamin_d'
  | 'mood'
  | 'weight'
  | 'height'
  | 'milestone'
  | 'custom'

export type FeedingType = 'breast' | 'bottle' | 'solid'
export type DiaperType = 'wet' | 'dirty' | 'both'
export type MoodType = 'happy' | 'calm' | 'fussy' | 'crying' | 'sleepy'

export interface BabyLog {
  id: string
  family_id: string
  logged_by: string
  log_type: LogType
  log_data: Record<string, any>
  logged_at: string
  notes?: string
  created_at: string
}

export interface FeedingLogData {
  type: FeedingType
  amount_ml?: number
  duration_minutes?: number
  side?: 'left' | 'right' | 'both'
  food_type?: string
}

export interface DiaperLogData {
  type: DiaperType
  color?: string
}

export interface SleepLogData {
  start_time: string
  end_time?: string
  is_ongoing: boolean
  duration_minutes?: number
}

// Budget Types
export type BudgetTier = 'budget' | 'premium'

export interface ProductExample {
  brand: string
  product: string
  price: number // in cents
  url?: string
}

export interface BudgetTemplate {
  budget_id: string
  category: string
  subcategory: string
  item: string
  description: string
  stage: FamilyStage
  week_start: number
  week_end: number
  priority: 'must-have' | 'good-to-have'
  price_low: number
  price_mid: number
  price_high: number
  price_currency: string
  notes?: string
  is_premium: boolean
  product_examples?: ProductExample[]
}

export interface FamilyBudgetItem {
  id: string
  family_id: string
  budget_template_id?: string
  item: string
  category: string
  estimated_price: number
  actual_price?: number
  is_purchased: boolean
  purchased_at?: string
  notes?: string
  is_custom: boolean
}

// Checklist Types
export interface ChecklistTemplate {
  checklist_id: string
  name: string
  description: string
  stage: FamilyStage
  week_relevant: string
  is_premium: boolean
  sort_order: number
}

export interface ChecklistItemTemplate {
  item_id: string
  checklist_id: string
  category: string
  item: string
  details: string
  required: boolean
  bring_or_do: 'bring' | 'do'
  sort_order: number
}

export interface ChecklistProgress {
  id: string
  family_id: string
  checklist_id: string
  item_id: string
  is_checked: boolean
  checked_by?: string
  checked_at?: string
}

// Notification Types
export interface NotificationPreferences {
  id: string
  user_id: string
  push_enabled: boolean
  email_enabled: boolean
  task_reminders?: boolean
  task_reminders_7_day?: boolean
  task_reminders_3_day?: boolean
  task_reminders_1_day?: boolean
  due_date_reminders?: boolean
  overdue_alerts?: boolean
  partner_activity: boolean
  shift_reminders?: boolean
  weekly_briefing: boolean
  weekly_briefing_day: number
  weekly_briefing_time: string
  quiet_hours_enabled?: boolean
  quiet_hours_start?: string
  quiet_hours_end?: string
}

// Subscription Types
export interface Subscription {
  id: string
  user_id: string
  stripe_customer_id?: string
  stripe_subscription_id?: string
  tier: SubscriptionTier
  status: 'active' | 'canceled' | 'past_due' | 'trialing'
  current_period_start?: string
  current_period_end?: string
  cancel_at_period_end: boolean
  created_at: string
  updated_at: string
}

// API Response Types
export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
}

// Premium Feature Keys
export type PremiumFeature =
  | 'tasks_beyond_14_days'
  | 'briefings_beyond_4_weeks'
  | 'tracker_history'
  | 'tracker_summaries'
  | 'tracker_advanced_logs'
  | 'budget_full_access'
  | 'budget_edit'
  | 'premium_checklists'
  | 'partner_sync'
  | 'push_notifications'
  | 'export_data'
