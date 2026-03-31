'use client'

import Link from 'next/link'
import { Check, X, Sparkles, Crown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Reveal } from '@/components/ui/animations/Reveal'
import { Card3DTilt } from '@/components/ui/animations/Card3DTilt'
import { trackEvent } from '@/lib/analytics'

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: '',
    periodNote: 'forever',
    description: 'Perfect for getting started',
    features: [
      { text: '4-week briefing window', included: true },
      { text: '30-day task window', included: true },
      { text: 'All 15+ checklists', included: true },
      { text: 'Full budget planner', included: true },
      { text: 'Daily mood check-ins', included: true },
    ],
    cta: 'Get Started Free',
    ctaLink: '/signup',
    highlighted: false,
  },
  {
    name: 'Monthly',
    price: '$4.99',
    period: '/month',
    periodNote: 'Cancel anytime',
    description: 'Flexible month-to-month',
    features: [
      { text: 'All ~140 weekly briefings', included: true },
      { text: 'Full task timeline', included: true },
      { text: 'Real-time partner sync', included: true },
      { text: 'Push notifications', included: true },
      { text: 'Mood trends & insights', included: true },
    ],
    cta: 'Start Monthly',
    ctaLink: '/signup?plan=monthly',
    highlighted: false,
  },
  {
    name: 'Yearly',
    price: '$39.99',
    period: '/year',
    periodNote: '$3.33/mo — Save 33%',
    description: 'Best value for your journey',
    features: [
      { text: 'All ~140 weekly briefings', included: true },
      { text: 'Full task timeline', included: true },
      { text: 'Real-time partner sync', included: true },
      { text: 'Push notifications', included: true },
      { text: 'Mood trends & insights', included: true },
    ],
    cta: 'Get Started',
    ctaLink: '/signup?plan=yearly',
    highlighted: true,
    badge: 'Best Value',
  },
  {
    name: 'Lifetime',
    price: '$99.99',
    period: '',
    periodNote: 'One-time payment',
    description: 'Pay once, access forever',
    features: [
      { text: 'Everything in Yearly', included: true },
      { text: 'Lifetime updates', included: true },
      { text: 'Priority support', included: true },
      { text: 'Early access features', included: true },
      { text: 'Never pay again', included: true },
    ],
    cta: 'Get Lifetime Access',
    ctaLink: '/signup?plan=lifetime',
    highlighted: false,
    icon: Crown,
  },
]

export function Pricing() {
  return (
    <section id="pricing" className="relative py-16 sm:py-24 md:py-32">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        {/* Section header */}
        <Reveal className="text-center mb-16">
          <span className="section-pre justify-center">Pricing</span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-[--cream] leading-[1.2] mb-12">
            Choose your plan
          </h2>
        </Reveal>

        {/* Pricing cards — 4 columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 items-start">
          {plans.map((plan, index) => (
            <Reveal key={index} delay={80 + index * 120}>
              <Card3DTilt maxTilt={plan.highlighted ? 4 : 3} gloss>
                <div
                  className={`relative rounded-2xl flex flex-col p-5 sm:p-8 transition-all duration-300 ${
                    plan.highlighted
                      ? 'bg-gradient-to-b from-gold/8 to-[--card] border-2 border-gold/40 shadow-gold'
                      : 'bg-[--card] border border-[--border] shadow-card'
                  }`}
                  style={plan.highlighted ? { animation: 'featuredFloat 4s ease-in-out infinite' } : undefined}
                  onMouseEnter={(e) => {
                    if (plan.highlighted) (e.currentTarget as HTMLElement).style.animation = 'none'
                  }}
                  onMouseLeave={(e) => {
                    if (plan.highlighted) (e.currentTarget as HTMLElement).style.animation = 'featuredFloat 4s ease-in-out infinite'
                  }}
                >
                  {/* Badge */}
                  {plan.badge && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gold text-[--bg] font-ui text-xs font-semibold">
                        <Sparkles className="h-3 w-3" />
                        {plan.badge}
                      </div>
                    </div>
                  )}

                  {/* Plan name */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-1">
                      {plan.icon && <plan.icon className="h-5 w-5 text-gold" />}
                      <h3 className="font-display text-lg font-semibold text-[--cream]">{plan.name}</h3>
                    </div>
                    <p className="font-ui text-xs text-[--muted]">{plan.description}</p>
                  </div>

                  {/* Price */}
                  <div className="mb-1">
                    <span className="font-display font-bold text-3xl sm:text-4xl text-[--cream]">{plan.price}</span>
                    {plan.period && <span className="font-ui text-[--muted] text-sm">{plan.period}</span>}
                  </div>
                  <p className="font-ui text-xs text-[--muted] mb-6">{plan.periodNote}</p>

                  {/* Features */}
                  <ul className="space-y-2.5 mb-6 flex-1">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2">
                        {feature.included ? (
                          <Check className="h-4 w-4 text-sage mt-0.5 shrink-0" />
                        ) : (
                          <X className="h-4 w-4 text-[--dim] mt-0.5 shrink-0" />
                        )}
                        <span className={`font-ui text-sm ${feature.included ? 'text-[--cream]' : 'text-[--dim]'}`}>
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <Button
                    asChild
                    className={`w-full font-ui font-semibold text-[13px] uppercase tracking-[0.06em] ${
                      plan.highlighted
                        ? 'btn-glow-hover bg-gold hover:bg-gold-hover text-[--bg] shadow-gold'
                        : 'bg-[--card-hover] hover:bg-[--dim] text-[--cream] border border-[--border-hover]'
                    }`}
                    size="default"
                  >
                    <Link href={plan.ctaLink} onClick={() => trackEvent('cta_clicked', { button: `pricing_${plan.name.toLowerCase()}`, page: 'landing' })}>{plan.cta}</Link>
                  </Button>
                </div>
              </Card3DTilt>
            </Reveal>
          ))}
        </div>

        {/* Free tier callout */}
        <Reveal delay={500} className="mt-12 text-center">
          <p className="font-ui text-[--muted] text-sm">
            Free for 30 days — no credit card needed.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
