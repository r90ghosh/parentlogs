'use client'

import Link from 'next/link'
import { ArrowRight, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function FinalCTA() {
  return (
    <section className="relative py-24 md:py-32 bg-[--bg] overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[--surface] to-[--bg]" />

      {/* Ambient copper glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-copper/10 rounded-full blur-[100px]" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Trust badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[--card] border border-[--border] mb-8">
          <Shield className="h-4 w-4 text-sage" />
          <span className="font-ui text-sm text-[--cream]">Join 10,000+ prepared dads</span>
        </div>

        {/* Headline */}
        <h2 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl text-[--white] mb-6">
          Ready to feel{' '}
          <span className="text-gradient-copper">
            prepared
          </span>{' '}
          instead of overwhelmed?
        </h2>

        {/* Subheadline */}
        <p className="font-body text-lg text-[--muted] mb-10 max-w-2xl mx-auto">
          Stop piecing together advice from a dozen sources. Get the complete system
          that thousands of dads trust to navigate pregnancy and early parenthood.
        </p>

        {/* CTA */}
        <Button asChild size="lg" className="bg-copper hover:bg-copper-hover text-[--bg] font-ui font-semibold text-lg px-10 py-6 h-auto shadow-copper">
          <Link href="/signup">
            Get Started Free
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>

        {/* No credit card note */}
        <p className="mt-6 font-ui text-sm text-[--muted]">
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
              <p className="font-display font-bold text-2xl text-[--white]">{stat.value}</p>
              <p className="font-ui text-sm text-[--muted]">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
