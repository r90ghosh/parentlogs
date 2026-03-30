'use client'

import { useMemo } from 'react'
import dynamic from 'next/dynamic'
import type { TipTopic, IllustrationComponent } from '@tdc/shared/types/tips'
import { InfographicSection } from './InfographicSection'
import { MedicalDisclaimer } from '@/components/shared/medical-disclaimer'

const illustrationsByTopic: Record<string, Record<string, IllustrationComponent>> = {
  'baby-changing': {
    'baby-changing-1': dynamic(() => import('./illustrations/BabyChanging').then(m => ({ default: m.BabyChangingSection1 }))),
    'baby-changing-2': dynamic(() => import('./illustrations/BabyChanging').then(m => ({ default: m.BabyChangingSection2 }))),
    'baby-changing-3': dynamic(() => import('./illustrations/BabyChanging').then(m => ({ default: m.BabyChangingSection3 }))),
    'baby-changing-4': dynamic(() => import('./illustrations/BabyChanging').then(m => ({ default: m.BabyChangingSection4 }))),
    'baby-changing-5': dynamic(() => import('./illustrations/BabyChanging').then(m => ({ default: m.BabyChangingSection5 }))),
  },
  'bottle-prep': {
    'bottle-prep-1': dynamic(() => import('./illustrations/BottlePrep').then(m => ({ default: m.BottlePrepSection1 }))),
    'bottle-prep-2': dynamic(() => import('./illustrations/BottlePrep').then(m => ({ default: m.BottlePrepSection2 }))),
  },
  'swaddling': {
    'swaddling-1': dynamic(() => import('./illustrations/Swaddling').then(m => ({ default: m.SwaddlingSection1 }))),
    'swaddling-2': dynamic(() => import('./illustrations/Swaddling').then(m => ({ default: m.SwaddlingSection2 }))),
  },
  'bath-time': {
    'bath-time-1': dynamic(() => import('./illustrations/BathTime').then(m => ({ default: m.BathTimeSection1 }))),
    'bath-time-2': dynamic(() => import('./illustrations/BathTime').then(m => ({ default: m.BathTimeSection2 }))),
  },
  'car-seat': {
    'car-seat-1': dynamic(() => import('./illustrations/CarSeat').then(m => ({ default: m.CarSeatSection1 }))),
    'car-seat-2': dynamic(() => import('./illustrations/CarSeat').then(m => ({ default: m.CarSeatSection2 }))),
  },
  'burping': {
    'burping-1': dynamic(() => import('./illustrations/Burping').then(m => ({ default: m.BurpingSection1 }))),
    'burping-2': dynamic(() => import('./illustrations/Burping').then(m => ({ default: m.BurpingSection2 }))),
  },
}

interface SingleTipViewProps {
  topic: TipTopic
}

export function SingleTipView({ topic }: SingleTipViewProps) {
  const illustrations = useMemo(
    () => illustrationsByTopic[topic.id] ?? {},
    [topic.id]
  )

  return (
    <div className="max-w-2xl mx-auto px-4">
      <MedicalDisclaimer className="mb-6" />

      <div className="animate-fade-in-up">
        {topic.sections.map((section, i) => (
          <InfographicSection
            key={section.number}
            section={section}
            illustration={illustrations[section.illustrationId]}
            isLast={i === topic.sections.length - 1}
          />
        ))}
      </div>
    </div>
  )
}
