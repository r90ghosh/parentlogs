'use client'

import { useState, useMemo } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import type { IllustrationComponent } from '@tdc/shared/types/tips'
import { dadTips } from '@/data/dadTips'
import { TopicSelector } from '@/components/features/tips/TopicSelector'
import { InfographicView } from '@/components/features/tips/InfographicView'

// Dynamically import illustration components grouped by topic.
// Only the active topic's illustrations are loaded.
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

export function DadTipsClient() {
  const [activeTopicId, setActiveTopicId] = useState(dadTips[0].id)

  const activeTopic = useMemo(
    () => dadTips.find((t) => t.id === activeTopicId) ?? dadTips[0],
    [activeTopicId]
  )

  // Only pass illustrations for the active topic
  const illustrations = useMemo(
    () => illustrationsByTopic[activeTopicId] ?? {},
    [activeTopicId]
  )

  return (
    <div className="min-h-screen">
      {/* Hero area */}
      <section className="relative pt-28 pb-4 md:pt-28 md:pb-6">
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-900 to-transparent" />

        <div className="relative max-w-2xl mx-auto px-4">
          {/* Back link */}
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground text-sm transition-colors mb-6 min-h-[44px]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Dad Tips
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed">
            Step-by-step visual guides for hands-on skills.
          </p>
        </div>
      </section>

      {/* Topic selector — sticky below marketing header */}
      <div className="sticky top-[92px] md:top-14 z-20 bg-[--surface]/95 backdrop-blur-[16px] border-b border-[--border]">
        <div className="max-w-2xl mx-auto">
          <TopicSelector
            topics={dadTips}
            activeId={activeTopicId}
            onSelect={setActiveTopicId}
          />
        </div>
      </div>

      {/* Infographic */}
      <div className="max-w-2xl mx-auto pt-6 pb-12">
        <InfographicView
          topic={activeTopic}
          illustrations={illustrations}
        />
      </div>
    </div>
  )
}
