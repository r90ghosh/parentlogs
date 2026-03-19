'use client'

import { useState, useMemo, type ComponentType } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { dadTips } from '@/data/dadTips'
import { TopicSelector } from '@/components/features/tips/TopicSelector'
import { StepCarousel } from '@/components/features/tips/StepCarousel'

import {
  BabyChangingStep1,
  BabyChangingStep2,
  BabyChangingStep3,
  BabyChangingStep4,
  BabyChangingStep5,
  BabyChangingStep6,
  BabyChangingStep7,
  BabyChangingStep8,
  BabyChangingStep9,
  BabyChangingStep10,
  BabyChangingStep11,
  BabyChangingStep12,
} from '@/components/features/tips/illustrations/BabyChanging'

import {
  BottlePrepPlaceholder,
  SwaddlingPlaceholder,
  BathTimePlaceholder,
  CarSeatPlaceholder,
  BurpingPlaceholder,
} from '@/components/features/tips/illustrations/Placeholders'

const illustrationMap: Record<string, ComponentType<{ className?: string }>> = {
  'baby-changing-step-1': BabyChangingStep1,
  'baby-changing-step-2': BabyChangingStep2,
  'baby-changing-step-3': BabyChangingStep3,
  'baby-changing-step-4': BabyChangingStep4,
  'baby-changing-step-5': BabyChangingStep5,
  'baby-changing-step-6': BabyChangingStep6,
  'baby-changing-step-7': BabyChangingStep7,
  'baby-changing-step-8': BabyChangingStep8,
  'baby-changing-step-9': BabyChangingStep9,
  'baby-changing-step-10': BabyChangingStep10,
  'baby-changing-step-11': BabyChangingStep11,
  'baby-changing-step-12': BabyChangingStep12,
  'bottle-prep-step-1': BottlePrepPlaceholder,
  'bottle-prep-step-2': BottlePrepPlaceholder,
  'bottle-prep-step-3': BottlePrepPlaceholder,
  'swaddling-step-1': SwaddlingPlaceholder,
  'swaddling-step-2': SwaddlingPlaceholder,
  'swaddling-step-3': SwaddlingPlaceholder,
  'bath-time-step-1': BathTimePlaceholder,
  'bath-time-step-2': BathTimePlaceholder,
  'bath-time-step-3': BathTimePlaceholder,
  'car-seat-step-1': CarSeatPlaceholder,
  'car-seat-step-2': CarSeatPlaceholder,
  'car-seat-step-3': CarSeatPlaceholder,
  'burping-step-1': BurpingPlaceholder,
  'burping-step-2': BurpingPlaceholder,
  'burping-step-3': BurpingPlaceholder,
}

export default function DadTipsPage() {
  const [activeTopicId, setActiveTopicId] = useState(dadTips[0].id)

  const activeTopic = useMemo(
    () => dadTips.find((t) => t.id === activeTopicId) ?? dadTips[0],
    [activeTopicId]
  )

  return (
    <div className="min-h-screen bg-[--bg]">
      {/* Hero area */}
      <section className="relative pt-20 pb-4 md:pt-28 md:pb-6">
        <div className="absolute inset-0 bg-gradient-to-b from-[--surface] via-[--bg] to-[--bg]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-copper/5 via-transparent to-transparent" />

        <div className="relative max-w-2xl mx-auto px-4">
          {/* Back link */}
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-[--muted] hover:text-[--cream] font-ui text-sm transition-colors mb-6 min-h-[44px]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>

          {/* Title */}
          <h1 className="font-display text-3xl md:text-4xl font-bold text-[--white] mb-2">
            Dad Tips
          </h1>
          <p className="font-body text-base text-[--muted] leading-relaxed mb-6">
            Step-by-step visual guides for the hands-on skills that matter most.
            Swipe through at your own pace.
          </p>
        </div>
      </section>

      {/* Topic selector — sticky */}
      <div className="sticky top-0 z-20 bg-[--bg]/90 backdrop-blur-md border-b border-[--border]">
        <div className="max-w-2xl mx-auto">
          <TopicSelector
            topics={dadTips}
            activeId={activeTopicId}
            onSelect={setActiveTopicId}
          />
        </div>
      </div>

      {/* Topic description */}
      <div className="max-w-2xl mx-auto px-4 pt-5 pb-2">
        <p className="font-body text-sm text-[--cream] leading-relaxed">
          {activeTopic.description}
        </p>
      </div>

      {/* Step carousel */}
      <div className="max-w-2xl mx-auto pb-12">
        <StepCarousel
          key={activeTopicId}
          steps={activeTopic.steps}
          illustrations={illustrationMap}
        />
      </div>
    </div>
  )
}
