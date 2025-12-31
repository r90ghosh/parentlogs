'use client'

import Link from 'next/link'
import { Check, X, Sparkles, Zap, Crown } from 'lucide-react'
import { Button } from '@/components/ui/button'

const freeFeatures = [
  { text: 'Current week briefing', included: true },
  { text: '2-week task window', included: true },
  { text: 'Basic checklists (4)', included: true },
  { text: 'Budget overview', included: true },
  { text: 'Full timeline access', included: false },
  { text: 'Partner sync', included: false },
  { text: 'All 15 checklists', included: false },
  { text: 'Video library', included: false },
]

const premiumFeatures = [
  { text: 'All 47 weekly briefings', included: true },
  { text: 'Full task timeline', included: true },
  { text: 'All 15 premium checklists', included: true },
  { text: 'Complete budget tracker', included: true },
  { text: 'Real-time partner sync', included: true },
  { text: '83 curated videos', included: true },
  { text: 'Offline access', included: true },
  { text: 'Priority support', included: true },
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
    price: '$5.99',
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
    price: '$49.99',
    period: '/year',
    periodNote: 'Save 30% vs monthly',
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
    <section id="pricing" className="relative py-24 md:py-32 bg-slate-900">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-amber-500/5 via-slate-900 to-slate-900" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-400 text-sm font-medium mb-4">
            Simple Pricing
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            Choose your plan
          </h2>
          <p className="text-lg text-slate-400">
            Start free, upgrade when you're ready. Less than the cost of one parenting book.
          </p>
        </div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-2xl flex flex-col ${
                plan.highlighted
                  ? 'bg-gradient-to-b from-amber-500/10 to-slate-900 border-2 border-amber-500/50 lg:scale-105 lg:-my-2'
                  : 'bg-slate-800/30 border border-slate-700/50'
              } p-6`}
            >
              {/* Badge */}
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500 text-slate-900 text-xs font-semibold">
                    <Sparkles className="h-3 w-3" />
                    {plan.badge}
                  </div>
                </div>
              )}

              {/* Plan name with optional icon */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-1">
                  {plan.icon && <plan.icon className="h-5 w-5 text-amber-400" />}
                  <h3 className="text-lg font-semibold text-white">{plan.name}</h3>
                </div>
                <p className="text-xs text-slate-400">{plan.description}</p>
              </div>

              {/* Price */}
              <div className="mb-1">
                <span className="text-3xl font-bold text-white">{plan.price}</span>
                {plan.period && <span className="text-slate-400 text-sm">{plan.period}</span>}
              </div>
              <p className="text-xs text-slate-500 mb-6">{plan.periodNote}</p>

              {/* Features */}
              <ul className="space-y-2.5 mb-6 flex-1">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2">
                    {feature.included ? (
                      <Check className="h-4 w-4 text-green-400 mt-0.5 shrink-0" />
                    ) : (
                      <X className="h-4 w-4 text-slate-600 mt-0.5 shrink-0" />
                    )}
                    <span className={`text-sm ${feature.included ? 'text-slate-300' : 'text-slate-600'}`}>
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Button
                asChild
                className={`w-full ${
                  plan.highlighted
                    ? 'bg-amber-500 hover:bg-amber-600 text-slate-900'
                    : 'bg-slate-700 hover:bg-slate-600 text-white'
                } font-semibold`}
                size="default"
              >
                <Link href={plan.ctaLink}>{plan.cta}</Link>
              </Button>
            </div>
          ))}
        </div>

        {/* Money back guarantee */}
        <div className="mt-12 text-center">
          <p className="text-slate-500 text-sm">
            14-day free trial. No credit card required to start.
            <br />
            Cancel anytime. 30-day money-back guarantee.
          </p>
        </div>
      </div>
    </section>
  )
}
