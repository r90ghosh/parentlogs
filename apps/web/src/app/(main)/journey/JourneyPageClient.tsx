'use client'

import { DadChallengeTiles } from '@/components/dashboard/dad-journey'
import { Reveal } from '@/components/ui/animations/Reveal'
import { MedicalDisclaimer } from '@/components/shared/medical-disclaimer'

export function JourneyPageClient() {
  return (
    <main className="flex-1 py-8 px-4 md:px-8 max-w-2xl mx-auto w-full">
      {/* Page Header */}
      <div className="mb-6 animate-fade-in-up">
        <h1 className="text-2xl font-bold font-display text-[--cream]">Your Dad Journey</h1>
        <p className="text-[--muted] mt-1 text-sm font-body">
          7 real challenges, real talk, and things you can actually do.
        </p>
      </div>

      <MedicalDisclaimer className="mb-4" />

      {/* All 7 challenge tiles */}
      <Reveal delay={80}>
        <p className="text-xs font-semibold font-ui text-[--muted] uppercase tracking-wider mb-3">
          Your challenges
        </p>
        <DadChallengeTiles maxTiles={7} />
      </Reveal>

    </main>
  )
}
