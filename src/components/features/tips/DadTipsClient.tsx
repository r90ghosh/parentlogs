'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import type { IllustrationComponent } from '@/types/tips'
import { dadTips } from '@/data/dadTips'
import { TopicSelector } from '@/components/features/tips/TopicSelector'
import { InfographicView } from '@/components/features/tips/InfographicView'

import {
  BabyChangingSection1,
  BabyChangingSection2,
  BabyChangingSection3,
  BabyChangingSection4,
  BabyChangingSection5,
} from '@/components/features/tips/illustrations/BabyChanging'

import {
  BottlePrepSection1,
  BottlePrepSection2,
} from '@/components/features/tips/illustrations/BottlePrep'

import {
  SwaddlingSection1,
  SwaddlingSection2,
} from '@/components/features/tips/illustrations/Swaddling'

import {
  BathTimeSection1,
  BathTimeSection2,
} from '@/components/features/tips/illustrations/BathTime'

import {
  CarSeatSection1,
  CarSeatSection2,
} from '@/components/features/tips/illustrations/CarSeat'

import {
  BurpingSection1,
  BurpingSection2,
} from '@/components/features/tips/illustrations/Burping'

const illustrations: Record<string, IllustrationComponent> = {
  'baby-changing-1': BabyChangingSection1,
  'baby-changing-2': BabyChangingSection2,
  'baby-changing-3': BabyChangingSection3,
  'baby-changing-4': BabyChangingSection4,
  'baby-changing-5': BabyChangingSection5,
  'bottle-prep-1': BottlePrepSection1,
  'bottle-prep-2': BottlePrepSection2,
  'swaddling-1': SwaddlingSection1,
  'swaddling-2': SwaddlingSection2,
  'bath-time-1': BathTimeSection1,
  'bath-time-2': BathTimeSection2,
  'car-seat-1': CarSeatSection1,
  'car-seat-2': CarSeatSection2,
  'burping-1': BurpingSection1,
  'burping-2': BurpingSection2,
}

export function DadTipsClient() {
  const [activeTopicId, setActiveTopicId] = useState(dadTips[0].id)

  const activeTopic = useMemo(
    () => dadTips.find((t) => t.id === activeTopicId) ?? dadTips[0],
    [activeTopicId]
  )

  return (
    <div className="min-h-screen">
      {/* Hero area */}
      <section className="relative pt-20 pb-4 md:pt-28 md:pb-6">
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

      {/* Topic selector — sticky */}
      <div className="sticky top-0 z-20 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800">
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
