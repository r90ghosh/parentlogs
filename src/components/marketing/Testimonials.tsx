'use client'

import { Star, Quote } from 'lucide-react'

const testimonials = [
  {
    quote: "Finally, an app that doesn't treat me like an idiot. The week-by-week briefings are exactly what I needed to feel prepared without drowning in information.",
    author: 'Michael T.',
    role: 'Software Engineer',
    avatar: 'M',
    color: 'blue',
  },
  {
    quote: "The task system is brilliant. I didn't even know half of these things needed to happen, and now I'm ahead of schedule on everything.",
    author: 'David K.',
    role: 'Product Manager',
    avatar: 'D',
    color: 'green',
  },
  {
    quote: "My wife was skeptical at first, but when she saw how organized I was with the nursery prep, she became a bigger fan than me.",
    author: 'James R.',
    role: 'Data Scientist',
    avatar: 'J',
    color: 'amber',
  },
]

const colorClasses = {
  blue: {
    bg: 'bg-blue-500',
    light: 'bg-blue-500/10',
  },
  green: {
    bg: 'bg-green-500',
    light: 'bg-green-500/10',
  },
  amber: {
    bg: 'bg-amber-500',
    light: 'bg-amber-500/10',
  },
}

export function Testimonials() {
  return (
    <section className="relative py-24 md:py-32 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-purple-500/10 text-purple-400 text-sm font-medium mb-4">
            Testimonials
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            Trusted by 10,000+ dads
          </h2>
          <p className="text-lg text-slate-400">
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
                className="relative p-8 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-all duration-300"
              >
                {/* Quote icon */}
                <Quote className="h-8 w-8 text-slate-700 mb-4" />

                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>

                {/* Quote text */}
                <p className="text-slate-300 leading-relaxed mb-6">
                  "{testimonial.quote}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full ${colors.bg} flex items-center justify-center text-white font-semibold`}>
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-medium text-white">{testimonial.author}</p>
                    <p className="text-sm text-slate-500">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Logos section placeholder */}
        <div className="mt-20">
          <p className="text-center text-sm text-slate-600 mb-8">As featured in</p>
          <div className="flex items-center justify-center gap-12 opacity-30">
            {/* Placeholder logos - replace with actual logos later */}
            {['TechCrunch', 'Forbes', 'Fatherly', 'Men\'s Health'].map((name, i) => (
              <div
                key={i}
                className="text-xl font-bold text-slate-600"
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
