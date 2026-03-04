'use client'

import {
  Calendar,
  CheckSquare,
  Users,
  DollarSign,
  Smile,
  Compass,
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { RevealOnScroll } from '@/components/ui/animations/RevealOnScroll'
import { Card3DTilt } from '@/components/ui/animations/Card3DTilt'
import { MagneticButton } from '@/components/ui/animations/MagneticButton'
import { ArrowRight } from 'lucide-react'

const features = [
  {
    icon: Calendar,
    title: 'Weekly Briefings',
    description: '47 detailed articles covering pregnancy through 24 months. Know exactly what\'s happening and what to do each week.',
  },
  {
    icon: CheckSquare,
    title: 'Smart Tasks',
    description: 'Pre-loaded tasks that appear based on your due date. No guesswork about what needs to happen when.',
  },
  {
    icon: Smile,
    title: 'Mood Check-ins',
    description: 'Track how you\'re feeling as a dad. Identify patterns, manage anxiety, and celebrate the wins.',
  },
  {
    icon: Compass,
    title: 'Dad Journey',
    description: '7 core challenge areas from finances to anxiety. Personalized guidance for what matters most to you.',
  },
  {
    icon: Users,
    title: 'Partner Sync',
    description: 'Real-time collaboration with your partner. Share tasks, track progress together, and stay aligned.',
  },
  {
    icon: DollarSign,
    title: 'Budget Planner',
    description: 'Plan the real costs of having a baby. From gear to childcare, know what to expect financially.',
  },
]

export function Features() {
  return (
    <section id="features" className="relative py-24 md:py-32">
      <div className="max-w-[1100px] mx-auto px-6">
        {/* Section header */}
        <RevealOnScroll className="text-center mb-12">
          <span className="section-pre justify-center">Features</span>
          <h2 className="font-display font-bold text-4xl text-[--cream] leading-[1.2] mb-12">
            Everything you need,<br />nothing you don&apos;t
          </h2>
        </RevealOnScroll>

        {/* Features grid - 2 columns like mockup */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {features.map((feature, index) => (
            <RevealOnScroll key={index} delay={80 + index * 80}>
              <Card3DTilt maxTilt={3} gloss>
                <div className="card-copper-top p-8 rounded-xl bg-[--card] border border-[--border] hover:border-[--border-hover] shadow-card transition-all duration-300 cursor-default">
                  {/* Icon */}
                  <div
                    className="w-11 h-11 rounded-full flex items-center justify-center mb-4"
                    style={{
                      background: 'rgba(196,112,63,0.1)',
                      border: '1px solid rgba(196,112,63,0.2)',
                    }}
                  >
                    <feature.icon
                      className="h-[22px] w-[22px] text-copper"
                      strokeWidth={1.5}
                      style={{ animation: 'iconPulse 3s ease-in-out infinite' }}
                    />
                  </div>

                  {/* Content */}
                  <h3 className="font-display text-xl font-semibold text-[--cream] mb-2">
                    {feature.title}
                  </h3>
                  <p className="font-body text-sm text-[--muted] leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </Card3DTilt>
            </RevealOnScroll>
          ))}
        </div>

        {/* CTA */}
        <RevealOnScroll delay={600} className="mt-16 text-center">
          <MagneticButton>
            <Button asChild size="lg" className="btn-glow-hover bg-copper hover:bg-copper-hover text-[--bg] font-ui font-semibold text-[13px] uppercase tracking-[0.08em] shadow-copper">
              <Link href="/signup">
                Start Your Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </MagneticButton>
          <p className="mt-4 font-ui text-sm text-[--muted]">
            No credit card required. 30-day money-back guarantee.
          </p>
        </RevealOnScroll>
      </div>
    </section>
  )
}
