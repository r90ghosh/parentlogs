'use client'

import { createTrackerHooks } from '@tdc/shared/hooks'
import { trackerService } from '@/lib/services'
import { useServiceContext } from './use-service-context'

export type { CreateLogInput } from '@tdc/shared/hooks'

const {
  useTrackerLogs,
  useRecentLogs,
  useTrackerLog,
  useShiftBriefing,
  useDailySummary,
  useWeeklySummary,
  useTrackerSummary,
  useCreateLog,
  useUpdateLog,
  useDeleteLog,
} = createTrackerHooks({
  useServiceContext,
  trackerService,
})

export {
  useTrackerLogs,
  useRecentLogs,
  useTrackerLog,
  useShiftBriefing,
  useDailySummary,
  useWeeklySummary,
  useTrackerSummary,
  useCreateLog,
  useUpdateLog,
  useDeleteLog,
}
