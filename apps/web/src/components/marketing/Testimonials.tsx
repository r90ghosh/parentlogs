'use client'

import { Star } from 'lucide-react'
import { RevealOnScroll } from '@/components/ui/animations/RevealOnScroll'
import { Card3DTilt } from '@/components/ui/animations/Card3DTilt'

const testimonials = [
  {
    quote: "Finally, an app that doesn't treat me like an idiot. The week-by-week briefings are exactly what I needed to feel prepared without drowning in information.",
    author: 'Michael T.',
    role: 'Early Access Dad',
    avatar: 'M',
  },
  {
    quote: "The task system is brilliant. I didn't even know half of these things needed to happen, and now I'm ahead of schedule on everything.",
    author: 'David K.',
    role: 'Early Access Dad',
    avatar: 'D',
  },
  {
    quote: "My wife was skeptical at first, but when she saw how organized I was with the nursery prep, she became a bigger fan than me.",
    author: 'James R.',
    role: 'Early Access Dad',
    avatar: 'J',
  },
]

export function Testimonials() {
  return (
    <section className="relative py-16 sm:py-24 md:py-32">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6">
        {/* Section header */}
        <RevealOnScroll className="text-center mb-16">
          <span className="section-pre justify-center">Early Feedback</span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-[--cream] leading-[1.2] mb-12">
            What Early Access Dads Are Saying
          </h2>
        </RevealOnScroll>

        {/* Single featured testimonial - like mockup */}
        <RevealOnScroll>
          <div className="relative max-w-3xl mx-auto text-center p-4 sm:p-8 md:p-12">
            {/* Rotating quote mark */}
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/4 font-display text-[120px] leading-none text-[--cream] pointer-events-none select-none"
              style={{ opacity: 0.15, animation: 'quoteRotate 30s linear infinite' }}
              aria-hidden="true"
            >
              &ldquo;
            </div>

            {/* Stars */}
            <div className="flex justify-center gap-1 mb-6">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 text-gold fill-gold" />
              ))}
            </div>

            {/* Quote */}
            <blockquote className="font-body text-base sm:text-xl md:text-2xl text-[--cream] leading-relaxed mb-8 italic">
              &ldquo;{testimonials[0].quote}&rdquo;
            </blockquote>

            {/* Author */}
            <div className="flex items-center justify-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center font-ui font-semibold text-[--bg]"
                style={{ background: 'linear-gradient(135deg, var(--copper), var(--gold))' }}
              >
                {testimonials[0].avatar}
              </div>
              <div className="text-left">
                <p className="font-ui font-medium text-[--cream]">{testimonials[0].author}</p>
                <p className="font-ui text-sm text-[--muted]">{testimonials[0].role}</p>
              </div>
            </div>
          </div>
        </RevealOnScroll>

        {/* Additional testimonials grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {testimonials.map((testimonial, index) => (
            <RevealOnScroll key={index} delay={80 + index * 120}>
              <Card3DTilt maxTilt={3} gloss>
                <div className="p-6 rounded-xl bg-[--card] border border-[--border] shadow-card h-full">
                  {/* Stars */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-gold fill-gold" />
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="font-body text-sm text-[--cream] leading-relaxed mb-6">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center font-ui font-semibold text-sm text-[--bg]"
                      style={{ background: 'linear-gradient(135deg, var(--copper), var(--gold))' }}
                    >
                      {testimonial.avatar}
                    </div>
                    <div>
                      <p className="font-ui font-medium text-sm text-[--cream]">{testimonial.author}</p>
                      <p className="font-ui text-xs text-[--muted]">{testimonial.role}</p>
                    </div>
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
