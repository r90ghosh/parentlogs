'use client'

import { AlertTriangle, CheckCircle, ArrowRight, Brain, Calendar, Users } from 'lucide-react'
import { RevealOnScroll } from '@/components/ui/animations/RevealOnScroll'
import { Card3DTilt } from '@/components/ui/animations/Card3DTilt'

const painPoints = [
  {
    problem: 'Drowning in conflicting advice',
    solution: 'Expert-curated, medically reviewed content',
    icon: Brain,
    color: 'sky',
  },
  {
    problem: 'Apps that expect YOU to figure it out',
    solution: 'Pre-loaded tasks based on your due date',
    icon: Calendar,
    color: 'copper',
  },
  {
    problem: 'Partner coordination chaos',
    solution: 'Shared dashboard with automatic task assignment',
    icon: Users,
    color: 'gold',
  },
]

export function ProblemSolution() {
  return (
    <section className="relative py-24 md:py-32">
      <div className="max-w-[1100px] mx-auto px-6">
        {/* Section header */}
        <RevealOnScroll className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-display font-bold text-3xl md:text-4xl text-[--cream] mb-6 leading-[1.2]">
            Other apps give you an{' '}
            <span className="text-[--muted]">empty container</span>.
            <br />
            We give you a{' '}
            <span className="text-gradient-copper">complete system</span>.
          </h2>
          <p className="font-body text-lg text-[--muted]">
            Stop piecing together information from a dozen sources. The Dad Center gives you
            everything you need in one place.
          </p>
        </RevealOnScroll>

        {/* Pain points grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {painPoints.map((point, index) => (
            <RevealOnScroll key={index} delay={80 + index * 120}>
              <Card3DTilt maxTilt={3} gloss>
                <div className="relative h-full p-8 rounded-xl bg-[--card] border border-[--border] shadow-card">
                  {/* Icon */}
                  <div className={`inline-flex p-3 rounded-xl mb-6 ${
                    point.color === 'sky' ? 'bg-sky/10' :
                    point.color === 'copper' ? 'bg-copper/10' :
                    'bg-gold/10'
                  }`}>
                    <point.icon className={`h-6 w-6 ${
                      point.color === 'sky' ? 'text-sky' :
                      point.color === 'copper' ? 'text-copper' :
                      'text-gold'
                    }`} />
                  </div>

                  {/* Problem */}
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-4 w-4 text-coral" />
                      <span className="font-ui text-xs font-semibold text-coral uppercase tracking-[0.12em]">The Problem</span>
                    </div>
                    <p className="font-body text-lg text-[--cream] font-medium">
                      {point.problem}
                    </p>
                  </div>

                  {/* Arrow */}
                  <div className="flex justify-center my-4">
                    <ArrowRight className="h-5 w-5 text-[--dim] rotate-90" />
                  </div>

                  {/* Solution */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-4 w-4 text-sage" />
                      <span className="font-ui text-xs font-semibold text-sage uppercase tracking-[0.12em]">Our Solution</span>
                    </div>
                    <p className="font-body text-lg text-[--cream] font-medium">
                      {point.solution}
                    </p>
                  </div>
                </div>
              </Card3DTilt>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  )
}
