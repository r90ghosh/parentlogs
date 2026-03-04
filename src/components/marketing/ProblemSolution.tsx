'use client'

import { AlertTriangle, CheckCircle, ArrowRight, Brain, Calendar, Users } from 'lucide-react'

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
    <section className="relative py-24 md:py-32 bg-[--bg]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl text-[--white] mb-6">
            Other apps give you an{' '}
            <span className="text-[--muted]">empty container</span>.
            <br />
            We give you a{' '}
            <span className="text-gradient-copper">
              complete system
            </span>.
          </h2>
          <p className="font-body text-lg text-[--muted]">
            Stop piecing together information from a dozen sources. The Dad Center gives you
            everything you need in one place.
          </p>
        </div>

        {/* Pain points grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {painPoints.map((point, index) => (
            <div
              key={index}
              className="group relative"
            >
              {/* Card */}
              <div className="relative h-full p-8 rounded-2xl bg-[--card] border border-[--border] hover:border-[--border-hover] shadow-card hover:shadow-hover transition-all duration-300">
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
                  <p className="font-body text-lg text-[--white] font-medium">
                    {point.solution}
                  </p>
                </div>

                {/* Hover effect gradient */}
                <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none ${
                  point.color === 'sky' ? 'bg-gradient-to-br from-sky/5 to-transparent' :
                  point.color === 'copper' ? 'bg-gradient-to-br from-copper/5 to-transparent' :
                  'bg-gradient-to-br from-gold/5 to-transparent'
                }`} />
              </div>
            </div>
          ))}
        </div>

        {/* Bottom emphasis */}
        <div className="mt-16 text-center">
          <p className="font-body text-[--muted] text-sm max-w-2xl mx-auto">
            We&apos;ve helped thousands of dads navigate pregnancy and early parenthood with confidence.
            Our content is reviewed by medical professionals and updated regularly.
          </p>
        </div>
      </div>
    </section>
  )
}
