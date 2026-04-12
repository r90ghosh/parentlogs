import { createClient } from '@/lib/supabase/client'
import {
  createTaskService,
  createBriefingService,
  createBudgetService,
  createChecklistService,
  createDadJourneyService,
  createFamilyService,
  createTrackerService,
  createBabyService,
  createContactService,
  createNotificationHistoryService,
  createSubscriptionService,
  createFeedbackService,
  createProfileService,
  createArticlesService,
} from '@tdc/services'

const supabase = createClient()

export const taskService = createTaskService(supabase)
export const briefingService = createBriefingService(supabase)
export const budgetService = createBudgetService(supabase)
export const checklistService = createChecklistService(supabase)
export const dadJourneyService = createDadJourneyService(supabase)
export const familyService = createFamilyService(supabase)
export const trackerService = createTrackerService(supabase)
export const babyService = createBabyService(supabase)
export const contactService = createContactService(supabase)
export const notificationHistoryService = createNotificationHistoryService(supabase)
export const subscriptionService = createSubscriptionService(supabase)
export const feedbackService = createFeedbackService(supabase)
export const profileService = createProfileService(supabase)
export const articlesService = createArticlesService(supabase)
