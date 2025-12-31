'use client'

import Link from 'next/link'
import { ArrowRight, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function FinalCTA() {
  return (
    <section className="relative py-24 md:py-32 bg-slate-950 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-slate-950" />

      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-amber-500/10 rounded-full blur-[100px]" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Trust badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700/50 mb-8">
          <Shield className="h-4 w-4 text-green-400" />
          <span className="text-sm text-slate-300">Join 10,000+ prepared dads</span>
        </div>

        {/* Headline */}
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
          Ready to feel{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
            prepared
          </span>{' '}
          instead of overwhelmed?
        </h2>

        {/* Subheadline */}
        <p className="text-lg text-slate-400 mb-10 max-w-2xl mx-auto">
          Stop piecing together advice from a dozen sources. Get the complete system
          that thousands of dads trust to navigate pregnancy and early parenthood.
        </p>

        {/* CTA */}
        <Button asChild size="lg" className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold text-lg px-10 py-6 h-auto">
          <Link href="/signup">
            Get Started Free
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>

        {/* No credit card note */}
        <p className="mt-6 text-sm text-slate-500">
          No credit card required. Upgrade anytime.
        </p>

        {/* Quick stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: '2 min', label: 'Setup time' },
            { value: '10+ hrs', label: 'Time saved' },
            { value: '4.9/5', label: 'User rating' },
            { value: '24/7', label: 'Access' },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-sm text-slate-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
