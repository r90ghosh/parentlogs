'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { RevealOnScroll } from '@/components/ui/animations/RevealOnScroll'
import { MagneticButton } from '@/components/ui/animations/MagneticButton'

export function FinalCTA() {
  return (
    <section className="relative py-16 sm:py-24 md:py-32 overflow-hidden">
      {/* Breathing glow behind */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(196,112,63,0.06) 0%, transparent 70%)',
          animation: 'ctaGlowBreath 4s ease-in-out infinite',
        }}
        aria-hidden="true"
      />

      <div className="relative max-w-[560px] mx-auto px-4 sm:px-6 text-center z-[1]">
        <RevealOnScroll>
          <h2 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl text-[--cream] leading-[1.2] mb-6">
            Ready to step up?
          </h2>
        </RevealOnScroll>

        <RevealOnScroll delay={80}>
          <p className="font-body text-lg text-[--muted] mb-10">
            Join thousands of dads who stopped winging it and started
            showing up prepared.
          </p>
        </RevealOnScroll>

        <RevealOnScroll delay={160}>
          {/* CTA with pulse rings */}
          <div className="relative inline-block mb-8">
            {/* Pulse rings */}
            {[0, 0.8, 1.6].map((delay, i) => (
              <span
                key={i}
                className="absolute inset-0 rounded-lg border-2 border-copper pointer-events-none"
                style={{
                  animation: `pulseRingExpand 2.4s ease-out ${delay}s infinite`,
                }}
                aria-hidden="true"
              />
            ))}

            <MagneticButton maxOffset={6}>
              <Button asChild size="lg" className="btn-glow-hover relative z-[1] bg-copper hover:bg-copper-hover text-[--bg] font-ui font-semibold text-sm uppercase tracking-[0.08em] px-10 py-4 h-auto shadow-copper">
                <Link href="/signup">
                  Start Your Journey Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </MagneticButton>
          </div>
        </RevealOnScroll>

        <RevealOnScroll delay={240}>
          <p className="font-ui text-sm text-[--muted]">
            30-day money-back guarantee. No credit card required.
          </p>
        </RevealOnScroll>
      </div>
    </section>
  )
}
