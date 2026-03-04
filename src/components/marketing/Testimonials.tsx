'use client'

import { Star, Quote } from 'lucide-react'

const testimonials = [
  {
    quote: "Finally, an app that doesn't treat me like an idiot. The week-by-week briefings are exactly what I needed to feel prepared without drowning in information.",
    author: 'Michael T.',
    role: 'Software Engineer',
    avatar: 'M',
    color: 'sky',
  },
  {
    quote: "The task system is brilliant. I didn't even know half of these things needed to happen, and now I'm ahead of schedule on everything.",
    author: 'David K.',
    role: 'Product Manager',
    avatar: 'D',
    color: 'sage',
  },
  {
    quote: "My wife was skeptical at first, but when she saw how organized I was with the nursery prep, she became a bigger fan than me.",
    author: 'James R.',
    role: 'Data Scientist',
    avatar: 'J',
    color: 'copper',
  },
]

const colorClasses = {
  sky: {
    bg: 'bg-sky',
    light: 'bg-sky/10',
  },
  sage: {
    bg: 'bg-sage',
    light: 'bg-sage/10',
  },
  copper: {
    bg: 'bg-copper',
    light: 'bg-copper/10',
  },
}

export function Testimonials() {
  return (
    <section className="relative py-24 md:py-32 bg-[--bg]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="font-ui font-semibold text-[11px] uppercase tracking-[0.2em] text-copper inline-block mb-4">
            Testimonials
          </span>
          <h2 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl text-[--white] mb-6">
            Trusted by 10,000+ dads
          </h2>
          <p className="font-body text-lg text-[--muted]">
            Join the community of prepared fathers who refuse to wing it.
          </p>
        </div>

        {/* Testimonials grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => {
            const colors = colorClasses[testimonial.color as keyof typeof colorClasses]
            return (
              <div
                key={index}
                className="relative p-8 rounded-2xl bg-[--card] border border-[--border] hover:border-[--border-hover] shadow-card hover:shadow-hover transition-all duration-300"
              >
                {/* Quote icon */}
                <Quote className="h-8 w-8 text-[--dim] mb-4" />

                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-gold fill-gold" />
                  ))}
                </div>

                {/* Quote text */}
                <p className="font-body text-[--cream] leading-relaxed mb-6">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full ${colors.bg} flex items-center justify-center font-ui font-semibold text-[--white]`}>
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-ui font-medium text-[--white]">{testimonial.author}</p>
                    <p className="font-ui text-sm text-[--muted]">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Logos section placeholder */}
        <div className="mt-20">
          <p className="font-ui text-center text-sm text-[--dim] mb-8">As featured in</p>
          <div className="flex items-center justify-center gap-12 opacity-25">
            {/* Placeholder logos - replace with actual logos later */}
            {['TechCrunch', 'Forbes', 'Fatherly', 'Men\'s Health'].map((name, i) => (
              <div
                key={i}
                className="font-display text-xl font-bold text-[--muted]"
              >
                {name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
