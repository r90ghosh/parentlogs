'use client'

import { CalendarDays, FileText, Users } from 'lucide-react'

const steps = [
  {
    number: '01',
    icon: CalendarDays,
    title: 'Enter your due date',
    description: 'Tell us when your baby is expected, and we personalize everything to your timeline. Tasks, briefings, and resources all sync to your specific week.',
    color: 'amber',
  },
  {
    number: '02',
    icon: FileText,
    title: 'Get your weekly briefing',
    description: 'Each week, receive a detailed update on what\'s happening with baby, what mom is experiencing, and exactly what you should be doing as a dad.',
    color: 'blue',
  },
  {
    number: '03',
    icon: Users,
    title: 'Track progress together',
    description: 'Invite your partner to share the dashboard. Tasks sync in real-time, so you always know who\'s handling what. No more dropped balls.',
    color: 'green',
  },
]

const colorClasses = {
  amber: {
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
    border: 'border-amber-500/30',
    line: 'from-amber-500',
  },
  blue: {
    bg: 'bg-blue-500/10',
    text: 'text-blue-400',
    border: 'border-blue-500/30',
    line: 'from-blue-500',
  },
  green: {
    bg: 'bg-green-500/10',
    text: 'text-green-400',
    border: 'border-green-500/30',
    line: 'from-green-500',
  },
}

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-24 md:py-32 bg-slate-900 overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-[100px]" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="inline-block px-4 py-1.5 rounded-full bg-green-500/10 text-green-400 text-sm font-medium mb-4">
            Simple Setup
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            Up and running in 2 minutes
          </h2>
          <p className="text-lg text-slate-400">
            No complicated onboarding. No learning curve. Just enter your due date
            and we handle the rest.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connecting line (desktop) */}
          <div className="hidden lg:block absolute top-24 left-[16.67%] right-[16.67%] h-0.5 bg-gradient-to-r from-amber-500/50 via-blue-500/50 to-green-500/50" />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {steps.map((step, index) => {
              const colors = colorClasses[step.color as keyof typeof colorClasses]
              return (
                <div key={index} className="relative">
                  {/* Step card */}
                  <div className="relative p-8 rounded-2xl bg-slate-800/30 border border-slate-700/50 h-full">
                    {/* Number badge */}
                    <div className={`absolute -top-4 left-8 px-4 py-2 rounded-full ${colors.bg} ${colors.text} text-sm font-bold`}>
                      {step.number}
                    </div>

                    {/* Icon */}
                    <div className={`inline-flex p-4 rounded-2xl ${colors.bg} mt-4 mb-6`}>
                      <step.icon className={`h-8 w-8 ${colors.text}`} />
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-semibold text-white mb-3">
                      {step.title}
                    </h3>
                    <p className="text-slate-400 leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                  {/* Connecting dot (desktop) */}
                  <div className={`hidden lg:block absolute top-24 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full ${colors.bg} border-2 ${colors.border}`} />
                </div>
              )
            })}
          </div>
        </div>

        {/* Time saved callout */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-4 px-6 py-4 rounded-2xl bg-slate-800/50 border border-slate-700/50">
            <div className="text-right">
              <p className="text-3xl font-bold text-white">10+</p>
              <p className="text-sm text-slate-500">hours saved</p>
            </div>
            <div className="w-px h-12 bg-slate-700" />
            <p className="text-slate-400 text-left max-w-xs">
              Average time dads save by not having to research and organize everything themselves.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
