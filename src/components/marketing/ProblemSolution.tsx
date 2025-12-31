'use client'

import { AlertTriangle, CheckCircle, ArrowRight, Brain, Calendar, Users } from 'lucide-react'

const painPoints = [
  {
    problem: 'Drowning in conflicting advice',
    solution: 'Expert-curated, medically reviewed content',
    icon: Brain,
    color: 'blue',
  },
  {
    problem: 'Apps that expect YOU to figure it out',
    solution: 'Pre-loaded tasks based on your due date',
    icon: Calendar,
    color: 'green',
  },
  {
    problem: 'Partner coordination chaos',
    solution: 'Shared dashboard with automatic task assignment',
    icon: Users,
    color: 'amber',
  },
]

export function ProblemSolution() {
  return (
    <section className="relative py-24 md:py-32 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            Other apps give you an{' '}
            <span className="text-slate-500">empty container</span>.
            <br />
            We give you a{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
              complete system
            </span>.
          </h2>
          <p className="text-lg text-slate-400">
            Stop piecing together information from a dozen sources. ParentLogs gives you
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
              <div className="relative h-full p-8 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-all duration-300">
                {/* Icon */}
                <div className={`inline-flex p-3 rounded-xl mb-6 ${
                  point.color === 'blue' ? 'bg-blue-500/10' :
                  point.color === 'green' ? 'bg-green-500/10' :
                  'bg-amber-500/10'
                }`}>
                  <point.icon className={`h-6 w-6 ${
                    point.color === 'blue' ? 'text-blue-400' :
                    point.color === 'green' ? 'text-green-400' :
                    'text-amber-400'
                  }`} />
                </div>

                {/* Problem */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-red-400" />
                    <span className="text-xs font-medium text-red-400 uppercase tracking-wider">The Problem</span>
                  </div>
                  <p className="text-lg text-slate-300 font-medium">
                    {point.problem}
                  </p>
                </div>

                {/* Arrow */}
                <div className="flex justify-center my-4">
                  <ArrowRight className="h-5 w-5 text-slate-600 rotate-90" />
                </div>

                {/* Solution */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span className="text-xs font-medium text-green-400 uppercase tracking-wider">Our Solution</span>
                  </div>
                  <p className="text-lg text-white font-medium">
                    {point.solution}
                  </p>
                </div>

                {/* Hover effect gradient */}
                <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none ${
                  point.color === 'blue' ? 'bg-gradient-to-br from-blue-500/5 to-transparent' :
                  point.color === 'green' ? 'bg-gradient-to-br from-green-500/5 to-transparent' :
                  'bg-gradient-to-br from-amber-500/5 to-transparent'
                }`} />
              </div>
            </div>
          ))}
        </div>

        {/* Bottom emphasis */}
        <div className="mt-16 text-center">
          <p className="text-slate-500 text-sm max-w-2xl mx-auto">
            We've helped thousands of dads navigate pregnancy and early parenthood with confidence.
            Our content is reviewed by medical professionals and updated regularly.
          </p>
        </div>
      </div>
    </section>
  )
}
