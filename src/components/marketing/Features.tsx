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
    color: 'sky',
    highlight: '47 articles',
  },
  {
    icon: CheckSquare,
    title: 'Smart Task Management',
    description: 'Pre-loaded tasks that appear based on your due date. No guesswork about what needs to happen when.',
    color: 'sage',
    highlight: '200+ tasks',
  },
  {
    icon: Users,
    title: 'Partner Sync',
    description: 'Real-time collaboration with your partner. Share tasks, track progress together, and stay aligned.',
    color: 'copper',
    highlight: 'Real-time',
  },
  {
    icon: DollarSign,
    title: 'Budget Tracker',
    description: 'Plan the real costs of having a baby. From gear to childcare, know what to expect financially.',
    color: 'gold',
    highlight: '127 items',
  },
  {
    icon: Video,
    title: 'Curated Resources',
    description: 'Hand-picked expert videos covering everything from diaper changes to developmental milestones.',
    color: 'coral',
    highlight: '83 videos',
  },
  {
    icon: ClipboardList,
    title: 'Checklists',
    description: 'Hospital bag, nursery setup, baby-proofing, and more. Never wonder if you forgot something important.',
    color: 'rose',
    highlight: '15 lists',
  },
]

const colorClasses = {
  sky: {
    bg: 'bg-sky/10',
    text: 'text-sky',
    glow: 'from-sky/8',
  },
  sage: {
    bg: 'bg-sage/10',
    text: 'text-sage',
    glow: 'from-sage/8',
  },
  copper: {
    bg: 'bg-copper/10',
    text: 'text-copper',
    glow: 'from-copper/8',
  },
  gold: {
    bg: 'bg-gold/10',
    text: 'text-gold',
    glow: 'from-gold/8',
  },
  coral: {
    bg: 'bg-coral/10',
    text: 'text-coral',
    glow: 'from-coral/8',
  },
  rose: {
    bg: 'bg-rose/10',
    text: 'text-rose',
    glow: 'from-rose/8',
  },
}

export function Features() {
  return (
    <section id="features" className="relative py-24 md:py-32 bg-[--surface]">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[--card]/60 via-[--surface] to-[--surface]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="font-ui font-semibold text-[11px] uppercase tracking-[0.2em] text-copper inline-block mb-4">
            Everything You Need
          </span>
          <h2 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl text-[--white] mb-6">
            Built for how dads actually think
          </h2>
          <p className="font-body text-lg text-[--muted]">
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
                className="group relative p-6 rounded-2xl bg-[--card] border border-[--border] hover:border-[--border-hover] shadow-card hover:shadow-hover transition-all duration-300"
              >
                {/* Icon */}
                <div className={`inline-flex p-3 rounded-xl ${colors.bg} mb-4`}>
                  <feature.icon className={`h-6 w-6 ${colors.text}`} />
                </div>

                {/* Highlight badge */}
                <span className={`absolute top-6 right-6 px-2 py-1 rounded font-ui text-xs font-medium ${colors.bg} ${colors.text}`}>
                  {feature.highlight}
                </span>

                {/* Content */}
                <h3 className="font-display text-xl font-semibold text-[--white] mb-2">
                  {feature.title}
                </h3>
                <p className="font-body text-[--muted] text-sm leading-relaxed">
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
          <Button asChild size="lg" className="bg-copper hover:bg-copper-hover text-[--bg] font-ui font-semibold shadow-copper">
            <Link href="/signup">
              Start Your Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <p className="mt-4 font-ui text-sm text-[--muted]">
            No credit card required. 30-day money-back guarantee.
          </p>
        </div>
      </div>
    </section>
  )
}
