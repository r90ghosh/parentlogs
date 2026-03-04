'use client'

import Link from 'next/link'
import { Check, X, Sparkles, Crown } from 'lucide-react'
import { Button } from '@/components/ui/button'

const freeFeatures = [
  { text: '4-week briefing window', included: true },
  { text: '30-day task window', included: true },
  { text: 'All 15+ checklists (350+ items)', included: true },
  { text: 'Full budget planner', included: true },
  { text: 'Daily mood check-ins', included: true },
  { text: 'Full task timeline', included: false },
  { text: 'Real-time partner sync', included: false },
  { text: 'Push notifications (after 30 days)', included: false },
]

const premiumFeatures = [
  { text: 'All ~140 weekly briefings', included: true },
  { text: 'Full task timeline (pregnancy → 24 months)', included: true },
  { text: 'Real-time partner sync', included: true },
  { text: 'Push notifications & reminders', included: true },
  { text: 'Mood trends & insights', included: true },
  { text: 'Advanced baby tracker', included: true },
  { text: 'Full briefing archive', included: true },
  { text: 'Task snooze & assignment', included: true },
]

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: '',
    periodNote: 'forever',
    description: 'Perfect for getting started',
    features: freeFeatures,
    cta: 'Get Started Free',
    ctaLink: '/signup',
    highlighted: false,
  },
  {
    name: 'Monthly',
    price: '$4.99',
    period: '/month',
    periodNote: 'Billed monthly',
    description: 'Full access, flexible commitment',
    features: premiumFeatures,
    cta: 'Start Free Trial',
    ctaLink: '/signup?plan=monthly',
    highlighted: false,
  },
  {
    name: 'Yearly',
    price: '$39.99',
    period: '/year',
    periodNote: 'Save 33% vs monthly',
    description: 'Best value for your journey',
    features: premiumFeatures,
    cta: 'Start Free Trial',
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
    features: premiumFeatures,
    cta: 'Get Lifetime Access',
    ctaLink: '/signup?plan=lifetime',
    highlighted: false,
    icon: Crown,
  },
]

export function Pricing() {
  return (
    <section id="pricing" className="relative py-24 md:py-32 bg-[--surface]">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-copper/4 via-[--surface] to-[--surface]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="font-ui font-semibold text-[11px] uppercase tracking-[0.2em] text-copper inline-block mb-4">
            Simple Pricing
          </span>
          <h2 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl text-[--white] mb-6">
            Choose your plan
          </h2>
          <p className="font-body text-lg text-[--muted]">
            Start free, upgrade when you&apos;re ready. Less than the cost of one parenting book.
          </p>
        </div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-2xl flex flex-col ${
                plan.highlighted
                  ? 'bg-gradient-to-b from-gold/8 to-[--card] border-2 border-gold/40 lg:scale-105 lg:-my-2 shadow-gold'
                  : 'bg-[--card] border border-[--border] shadow-card'
              } p-6`}
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

              {/* Plan name with optional icon */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-1">
                  {plan.icon && <plan.icon className="h-5 w-5 text-gold" />}
                  <h3 className="font-display text-lg font-semibold text-[--white]">{plan.name}</h3>
                </div>
                <p className="font-ui text-xs text-[--muted]">{plan.description}</p>
              </div>

              {/* Price */}
              <div className="mb-1">
                <span className="font-display font-bold text-3xl text-[--white]">{plan.price}</span>
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
                className={`w-full font-ui font-semibold ${
                  plan.highlighted
                    ? 'bg-gold hover:bg-gold-hover text-[--bg] shadow-gold'
                    : 'bg-[--card-hover] hover:bg-[--dim] text-[--cream] border border-[--border-hover]'
                }`}
                size="default"
              >
                <Link href={plan.ctaLink}>{plan.cta}</Link>
              </Button>
            </div>
          ))}
        </div>

        {/* Money back guarantee */}
        <div className="mt-12 text-center">
          <p className="font-ui text-[--muted] text-sm">
            No credit card required. Cancel anytime.
            <br />
            30-day money-back guarantee.
          </p>
        </div>
      </div>
    </section>
  )
}
