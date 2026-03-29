'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { CheckCircle } from 'lucide-react'
import { Card3DTilt } from '@/components/ui/animations/Card3DTilt'
import { Reveal } from '@/components/ui/animations/Reveal'
import { MagneticButton } from '@/components/ui/animations/MagneticButton'

const features = [
  '200+ expert-curated tasks auto-loaded to your timeline',
  'Weekly briefings tailored to your stage',
  'Partner sync for seamless coordination',
  'Baby tracker with shift handoff',
]

export default function OnboardingWelcome() {
  const router = useRouter()

  return (
    <Reveal variant="card" delay={100}>
      <Card3DTilt maxTilt={4} gloss>
        <div className="w-full max-w-md bg-[--card] border border-[--border] rounded-2xl shadow-lift overflow-hidden">
          {/* Top accent bar */}
          <div className="h-1 w-full bg-gradient-to-r from-copper via-gold to-copper opacity-90" />

          <div className="p-8">
            {/* Header */}
            <Reveal delay={0}>
              <div className="text-center mb-8">
                <h1 className="font-display text-3xl font-bold text-[--cream] mb-2 leading-tight">
                  Welcome to<br />The Dad Center
                </h1>
                <p className="font-body text-[--muted] text-sm">
                  Your parenting command center
                </p>
              </div>
            </Reveal>

            {/* Feature list */}
            <Reveal delay={150}>
              <ul className="space-y-3 mb-8">
                {features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-copper shrink-0 mt-0.5" />
                    <span className="font-body text-sm text-[--cream]">{feature}</span>
                  </li>
                ))}
              </ul>
            </Reveal>

            {/* CTAs */}
            <Reveal delay={300}>
              <div className="space-y-3">
                <MagneticButton className="w-full">
                  <Button
                    className="w-full bg-copper hover:bg-copper-hover text-[--bg] font-ui font-semibold shadow-copper"
                    onClick={() => router.push('/onboarding/role')}
                  >
                    Get Started
                  </Button>
                </MagneticButton>
                <MagneticButton className="w-full">
                  <Button
                    variant="outline"
                    className="w-full border-[--border-hover] text-[--muted] hover:bg-[--card-hover] hover:text-[--cream] font-ui"
                    onClick={() => router.push('/onboarding/join')}
                  >
                    Join Partner&apos;s Family
                  </Button>
                </MagneticButton>
              </div>
            </Reveal>
          </div>
        </div>
      </Card3DTilt>
    </Reveal>
  )
}
