'use client'

import { CalendarDays, FileText, Users } from 'lucide-react'
import { RevealOnScroll } from '@/components/ui/animations/RevealOnScroll'
import { Card3DTilt } from '@/components/ui/animations/Card3DTilt'

const steps = [
  {
    number: '01',
    icon: CalendarDays,
    title: 'Enter your due date',
    description: 'Tell us when your baby is expected, and we personalize everything to your timeline. Tasks, briefings, and resources all sync to your specific week.',
  },
  {
    number: '02',
    icon: FileText,
    title: 'Get your weekly briefing',
    description: 'Each week, receive a detailed update on what\'s happening with baby, what mom is experiencing, and exactly what you should be doing as a dad.',
  },
  {
    number: '03',
    icon: Users,
    title: 'Track progress together',
    description: 'Invite your partner to share the dashboard. Tasks sync in real-time, so you always know who\'s handling what. No more dropped balls.',
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-16 sm:py-24 md:py-32 overflow-hidden">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6">
        {/* Section header */}
        <RevealOnScroll className="text-center mb-16">
          <span className="section-pre justify-center">How It Works</span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-[--cream] leading-[1.2] mb-12">
            Up and running in 2 minutes
          </h2>
        </RevealOnScroll>

        {/* Steps */}
        <div className="relative">
          {/* Connecting dashed line (desktop) */}
          <div className="hidden lg:block absolute top-20 left-[16.67%] right-[16.67%]">
            <svg width="100%" height="2" className="overflow-visible">
              <line
                x1="0" y1="1" x2="100%" y2="1"
                stroke="var(--copper)"
                strokeWidth="1.5"
                strokeDasharray="6 4"
                strokeOpacity="0.7"
              />
            </svg>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {steps.map((step, index) => (
              <RevealOnScroll key={index} delay={80 + index * 120}>
                <div className="relative text-center">
                  {/* Step number - flip in */}
                  <div
                    className="font-display font-bold text-4xl sm:text-[56px] text-copper leading-none mb-4"
                    style={{ opacity: 0.3 }}
                  >
                    {step.number}
                  </div>

                  {/* Step card */}
                  <Card3DTilt maxTilt={4} gloss>
                    <div className="p-6 rounded-xl bg-[--card] border border-[--border] shadow-card hover:shadow-hover transition-all duration-300">
                      {/* Icon */}
                      <div
                        className="inline-flex p-4 rounded-2xl mb-4"
                        style={{
                          background: 'rgba(196,112,63,0.1)',
                          border: '1px solid rgba(196,112,63,0.2)',
                        }}
                      >
                        <step.icon className="h-7 w-7 text-copper" strokeWidth={1.5} />
                      </div>

                      {/* Content */}
                      <h3 className="font-display text-xl font-semibold text-[--cream] mb-3">
                        {step.title}
                      </h3>
                      <p className="font-body text-sm text-[--muted] leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </Card3DTilt>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>

        {/* Time saved callout */}
        <RevealOnScroll delay={500} className="mt-16 text-center">
          <div className="inline-flex items-center gap-4 px-6 py-4 rounded-2xl bg-[--card] border border-[--border] shadow-card">
            <div className="text-right">
              <p className="font-display font-bold text-3xl text-[--cream]">10+</p>
              <p className="font-ui text-sm text-[--muted]">hours saved</p>
            </div>
            <div className="w-px h-12 bg-[--dim]" />
            <p className="font-body text-sm text-[--muted] text-left max-w-xs">
              Average time dads save by not having to research and organize everything themselves.
            </p>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  )
}
