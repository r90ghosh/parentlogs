'use client'

import { createBabyHooks } from '@tdc/shared/hooks'
import { babyService } from '@/lib/services'
import { useServiceContext } from './use-service-context'

const {
  useBabies,
  useBaby,
  useAddBaby,
  useUpdateBaby,
  useSwitchBaby,
  useArchiveBaby,
} = createBabyHooks({
  useServiceContext,
  babyService,
})

export {
  useBabies,
  useBaby,
  useAddBaby,
  useUpdateBaby,
  useSwitchBaby,
  useArchiveBaby,
}
