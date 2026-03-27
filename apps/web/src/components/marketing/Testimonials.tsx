'use client'

import { BookOpen, CheckSquare, TrendingUp } from 'lucide-react'
import { RevealOnScroll } from '@/components/ui/animations/RevealOnScroll'
import { Card3DTilt } from '@/components/ui/animations/Card3DTilt'

const highlights = [
  {
    icon: BookOpen,
    week: 'Week 28',
    title: 'The Third Trimester Shift',
    quote: 'Install infant car seat. Research pediatricians. Pack hospital bag. Start birth plan. — All laid out, week by week.',
    color: 'var(--copper)',
  },
  {
    icon: CheckSquare,
    week: 'Week 12',
    title: 'First Trimester Wrap-Up',
    quote: 'Verify prenatal insurance. Schedule anatomy scan. Start a baby registry. Morning sickness support plan. — Nothing falls through the cracks.',
    color: 'var(--gold)',
  },
  {
    icon: TrendingUp,
    week: '0–3 Months',
    title: 'The Fourth Trimester',
    quote: 'Set up feeding station. Learn swaddle technique. Track feeds and diapers. Split night shifts fairly. — From day one, you know what to do.',
    color: 'var(--sage)',
  },
]

export function Testimonials() {
  return (
    <section className="relative py-16 sm:py-24 md:py-32">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6">
        {/* Section header */}
        <RevealOnScroll className="text-center mb-16">
          <span className="section-pre justify-center">Inside the App</span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-[--cream] leading-[1.2] mb-4">
            Your Roadmap at Every Stage
          </h2>
          <p className="font-body text-[--muted] text-base sm:text-lg max-w-xl mx-auto">
            Real tasks and briefings from The Dad Center — here&apos;s what a week looks like.
          </p>
        </RevealOnScroll>

        {/* Featured highlight */}
        <RevealOnScroll>
          <div className="relative max-w-3xl mx-auto text-center p-4 sm:p-8 md:p-12">
            {/* Rotating quote mark */}
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/4 font-display text-[120px] leading-none text-[--cream] pointer-events-none select-none"
              style={{ opacity: 0.15, animation: 'quoteRotate 30s linear infinite' }}
              aria-hidden="true"
            >
              &ldquo;
            </div>

            {/* Week badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-copper-dim border border-copper/25 mb-6">
              <span className="font-ui text-xs font-semibold uppercase tracking-wider text-copper">{highlights[0].week}</span>
            </div>

            {/* Quote */}
            <blockquote className="font-body text-base sm:text-xl md:text-2xl text-[--cream] leading-relaxed mb-6 italic">
              &ldquo;{highlights[0].quote}&rdquo;
            </blockquote>

            <p className="font-ui text-sm text-[--muted]">{highlights[0].title}</p>
          </div>
        </RevealOnScroll>

        {/* Highlights grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {highlights.map((highlight, index) => (
            <RevealOnScroll key={index} delay={80 + index * 120} className="h-full">
              <Card3DTilt maxTilt={3} gloss className="h-full">
                <div className="p-6 rounded-xl bg-[--card] border border-[--border] shadow-card h-full">
                  {/* Week + Icon */}
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center"
                      style={{ background: `color-mix(in srgb, ${highlight.color} 15%, transparent)` }}
                    >
                      <highlight.icon className="h-4 w-4" style={{ color: highlight.color }} />
                    </div>
                    <div>
                      <p className="font-ui font-semibold text-xs uppercase tracking-wider" style={{ color: highlight.color }}>
                        {highlight.week}
                      </p>
                      <p className="font-ui text-xs text-[--muted]">{highlight.title}</p>
                    </div>
                  </div>

                  {/* Content */}
                  <p className="font-body text-sm text-[--cream] leading-relaxed">
                    &ldquo;{highlight.quote}&rdquo;
                  </p>
                </div>
              </Card3DTilt>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  )
}
