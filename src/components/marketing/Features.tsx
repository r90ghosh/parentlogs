'use client'

import {
  Calendar,
  CheckSquare,
  Users,
  DollarSign,
  Video,
  ClipboardList,
  ArrowRight,
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

const features = [
  {
    icon: Calendar,
    title: 'Week-by-Week Briefings',
    description: '47 detailed articles covering pregnancy through 24 months. Know exactly what\'s happening and what to do each week.',
    color: 'blue',
    highlight: '47 articles',
  },
  {
    icon: CheckSquare,
    title: 'Smart Task Management',
    description: 'Pre-loaded tasks that appear based on your due date. No guesswork about what needs to happen when.',
    color: 'green',
    highlight: '200+ tasks',
  },
  {
    icon: Users,
    title: 'Partner Sync',
    description: 'Real-time collaboration with your partner. Share tasks, track progress together, and stay aligned.',
    color: 'purple',
    highlight: 'Real-time',
  },
  {
    icon: DollarSign,
    title: 'Budget Tracker',
    description: 'Plan the real costs of having a baby. From gear to childcare, know what to expect financially.',
    color: 'amber',
    highlight: '127 items',
  },
  {
    icon: Video,
    title: 'Curated Resources',
    description: 'Hand-picked expert videos covering everything from diaper changes to developmental milestones.',
    color: 'red',
    highlight: '83 videos',
  },
  {
    icon: ClipboardList,
    title: 'Checklists',
    description: 'Hospital bag, nursery setup, baby-proofing, and more. Never wonder if you forgot something important.',
    color: 'teal',
    highlight: '15 lists',
  },
]

const colorClasses = {
  blue: {
    bg: 'bg-blue-500/10',
    text: 'text-blue-400',
    glow: 'from-blue-500/10',
  },
  green: {
    bg: 'bg-green-500/10',
    text: 'text-green-400',
    glow: 'from-green-500/10',
  },
  purple: {
    bg: 'bg-purple-500/10',
    text: 'text-purple-400',
    glow: 'from-purple-500/10',
  },
  amber: {
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
    glow: 'from-amber-500/10',
  },
  red: {
    bg: 'bg-red-500/10',
    text: 'text-red-400',
    glow: 'from-red-500/10',
  },
  teal: {
    bg: 'bg-teal-500/10',
    text: 'text-teal-400',
    glow: 'from-teal-500/10',
  },
}

export function Features() {
  return (
    <section id="features" className="relative py-24 md:py-32 bg-slate-900">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800/50 via-slate-900 to-slate-900" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-400 text-sm font-medium mb-4">
            Everything You Need
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            Built for how dads actually think
          </h2>
          <p className="text-lg text-slate-400">
            No fluff. No condescension. Just practical tools and information that help you
            be the partner and parent you want to be.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const colors = colorClasses[feature.color as keyof typeof colorClasses]
            return (
              <div
                key={index}
                className="group relative p-6 rounded-2xl bg-slate-800/30 border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300"
              >
                {/* Icon */}
                <div className={`inline-flex p-3 rounded-xl ${colors.bg} mb-4`}>
                  <feature.icon className={`h-6 w-6 ${colors.text}`} />
                </div>

                {/* Highlight badge */}
                <span className={`absolute top-6 right-6 px-2 py-1 rounded text-xs font-medium ${colors.bg} ${colors.text}`}>
                  {feature.highlight}
                </span>

                {/* Content */}
                <h3 className="text-xl font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {feature.description}
                </p>

                {/* Hover gradient */}
                <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-gradient-to-br ${colors.glow} to-transparent`} />
              </div>
            )
          })}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <Button asChild size="lg" className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold">
            <Link href="/signup">
              Start Your Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <p className="mt-4 text-sm text-slate-500">
            No credit card required. Full access for 14 days.
          </p>
        </div>
      </div>
    </section>
  )
}
