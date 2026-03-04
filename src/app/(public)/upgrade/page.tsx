'use client'

import { Suspense, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { useCheckout, useIsPremium } from '@/hooks/use-subscription'
import { subscriptionService, PRICING, PricingPlan } from '@/services/subscription-service'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Check, Crown, Loader2, Sparkles, Zap, ArrowLeft, X } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Card3DTilt } from '@/components/ui/animations/Card3DTilt'
import { RevealOnScroll } from '@/components/ui/animations/RevealOnScroll'
import { MagneticButton } from '@/components/ui/animations/MagneticButton'
import { CardEntrance } from '@/components/ui/animations/CardEntrance'

function UpgradeContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const canceled = searchParams.get('canceled')

  const { isPremium, tier, isLoading: tierLoading } = useIsPremium()
  const { checkout, isCheckingOut, checkoutError } = useCheckout()
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan>('yearly')

  const features = subscriptionService.getFeatureList()

  if (tierLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[--bg]">
        <Loader2 className="h-8 w-8 animate-spin text-copper" />
      </div>
    )
  }

  if (isPremium) {
    return (
      <div className="min-h-screen bg-[--bg] p-4">
        <div className="max-w-2xl mx-auto pt-16">
          <div className="bg-[--card] border border-[--border] rounded-2xl shadow-lift overflow-hidden">
            <div className="h-1 w-full bg-gradient-to-r from-copper via-gold to-copper" />
            <div className="p-10 text-center space-y-4">
              <div className="mx-auto mb-2 h-16 w-16 rounded-full bg-gold/20 flex items-center justify-center">
                <Crown className="h-8 w-8 text-gold" />
              </div>
              <h2 className="font-display text-2xl font-bold text-[--cream]">
                You&apos;re Already Premium!
              </h2>
              <p className="font-body text-sm text-[--muted]">
                {tier === 'lifetime'
                  ? "You have lifetime access to all premium features."
                  : "You have full access to all premium features."}
              </p>
              <Button
                asChild
                className="mt-4 bg-copper hover:bg-copper-hover text-[--bg] font-ui font-semibold shadow-copper"
              >
                <Link href="/dashboard">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Dashboard
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const handleCheckout = () => {
    checkout(selectedPlan)
  }

  return (
    <div className="min-h-screen bg-[--bg]">
      {/* Sticky header */}
      <div className="border-b border-[--border] bg-[--surface]/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="text-[--muted] hover:text-[--cream] flex items-center gap-2 font-ui transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-copper" />
            <span className="font-display font-bold text-[--cream]">The Dad Center Premium</span>
          </div>
          <div className="w-16" />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Alerts */}
        {canceled && (
          <Alert className="mb-8 bg-gold/10 border-gold/30">
            <X className="h-4 w-4 text-gold" />
            <AlertDescription className="text-[--cream] font-body">
              Checkout was canceled. You can try again when you&apos;re ready.
            </AlertDescription>
          </Alert>
        )}

        {checkoutError && (
          <Alert variant="destructive" className="mb-8">
            <AlertDescription>{checkoutError}</AlertDescription>
          </Alert>
        )}

        {/* Hero */}
        <RevealOnScroll delay={0}>
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-copper/15 border border-copper/30 mb-5">
              <Sparkles className="h-3.5 w-3.5 text-copper" />
              <span className="text-xs font-ui font-semibold text-copper tracking-wide uppercase">Limited Time Offer</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-[--cream] mb-4 leading-tight">
              Unlock Your Full<br />Parenting Potential
            </h1>
            <p className="font-body text-lg text-[--muted] max-w-2xl mx-auto mb-3">
              Get complete access to all features, unlimited history, and premium content to support your parenting journey.
            </p>
            <p className="text-sm text-[--dim] font-body">
              One subscription per family — both partners share access.
            </p>
          </div>
        </RevealOnScroll>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {/* Monthly */}
          <CardEntrance delay={100}>
            <Card3DTilt maxTilt={4} gloss>
              <div
                className={cn(
                  "bg-[--card] border-2 rounded-2xl cursor-pointer transition-all duration-200 overflow-hidden shadow-card hover:shadow-hover",
                  selectedPlan === 'monthly'
                    ? "border-copper shadow-copper"
                    : "border-[--border] hover:border-[--border-hover]"
                )}
                onClick={() => setSelectedPlan('monthly')}
              >
                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="font-display text-lg font-bold text-[--cream]">Monthly</h3>
                    <p className="font-body text-xs text-[--muted] mt-0.5">Flexible month-to-month</p>
                  </div>
                  <div>
                    <span className="font-display text-4xl font-bold text-[--cream]">$4.99</span>
                    <span className="text-[--muted] font-body text-sm">/month</span>
                  </div>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-sm font-body text-[--cream]">
                      <Check className="h-4 w-4 text-copper flex-shrink-0" />
                      All premium features
                    </li>
                    <li className="flex items-center gap-2 text-sm font-body text-[--cream]">
                      <Check className="h-4 w-4 text-copper flex-shrink-0" />
                      Cancel anytime
                    </li>
                  </ul>
                </div>
              </div>
            </Card3DTilt>
          </CardEntrance>

          {/* Yearly - Popular */}
          <CardEntrance delay={200}>
            <Card3DTilt maxTilt={4} gloss>
              <div
                className={cn(
                  "bg-[--card] border-2 rounded-2xl cursor-pointer transition-all duration-200 relative overflow-hidden shadow-card hover:shadow-hover",
                  selectedPlan === 'yearly'
                    ? "border-copper shadow-copper"
                    : "border-[--border] hover:border-[--border-hover]"
                )}
                onClick={() => setSelectedPlan('yearly')}
              >
                {/* Most Popular badge */}
                <div className="absolute top-0 left-0 right-0 h-7 bg-copper flex items-center justify-center">
                  <span className="text-xs font-ui font-bold text-[--bg] tracking-wide uppercase">Most Popular</span>
                </div>
                <div className="p-6 pt-10 space-y-4">
                  <div>
                    <h3 className="font-display text-lg font-bold text-[--cream]">Yearly</h3>
                    <p className="font-body text-xs text-[--muted] mt-0.5">Best for new parents</p>
                  </div>
                  <div>
                    <span className="font-display text-4xl font-bold text-[--cream]">$39.99</span>
                    <span className="text-[--muted] font-body text-sm">/year</span>
                  </div>
                  <div className="p-2.5 bg-copper/15 border border-copper/25 rounded-xl text-center">
                    <span className="text-copper font-ui font-semibold text-sm">Just $3.33/mo — Save 33%</span>
                  </div>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-sm font-body text-[--cream]">
                      <Check className="h-4 w-4 text-copper flex-shrink-0" />
                      All premium features
                    </li>
                    <li className="flex items-center gap-2 text-sm font-body text-[--cream]">
                      <Check className="h-4 w-4 text-copper flex-shrink-0" />
                      Priority support
                    </li>
                  </ul>
                </div>
              </div>
            </Card3DTilt>
          </CardEntrance>

          {/* Lifetime */}
          <CardEntrance delay={300}>
            <Card3DTilt maxTilt={4} gloss>
              <div
                className={cn(
                  "bg-[--card] border-2 rounded-2xl cursor-pointer transition-all duration-200 relative overflow-hidden shadow-card hover:shadow-hover",
                  selectedPlan === 'lifetime'
                    ? "border-gold shadow-gold"
                    : "border-[--border] hover:border-[--border-hover]"
                )}
                onClick={() => setSelectedPlan('lifetime')}
              >
                {/* Best Value badge */}
                <div className="absolute top-0 left-0 right-0 h-7 bg-gold flex items-center justify-center">
                  <span className="text-xs font-ui font-bold text-[--bg] tracking-wide uppercase">Best Value</span>
                </div>
                <div className="p-6 pt-10 space-y-4">
                  <div>
                    <h3 className="font-display text-lg font-bold text-[--cream] flex items-center gap-2">
                      <Crown className="h-5 w-5 text-gold" />
                      Lifetime
                    </h3>
                    <p className="font-body text-xs text-[--muted] mt-0.5">One-time payment</p>
                  </div>
                  <div>
                    <span className="font-display text-4xl font-bold text-[--cream]">$99.99</span>
                    <span className="text-[--muted] font-body text-sm"> once</span>
                  </div>
                  <div className="p-2.5 bg-gold/15 border border-gold/25 rounded-xl text-center">
                    <span className="text-gold font-ui font-semibold text-sm">Never pay again</span>
                  </div>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-sm font-body text-[--cream]">
                      <Check className="h-4 w-4 text-gold flex-shrink-0" />
                      All premium features forever
                    </li>
                    <li className="flex items-center gap-2 text-sm font-body text-[--cream]">
                      <Check className="h-4 w-4 text-gold flex-shrink-0" />
                      All future updates included
                    </li>
                  </ul>
                </div>
              </div>
            </Card3DTilt>
          </CardEntrance>
        </div>

        {/* CTA Button */}
        <RevealOnScroll delay={200}>
          <div className="text-center mb-14">
            <MagneticButton>
              <Button
                size="lg"
                className={cn(
                  "px-12 py-6 text-lg font-ui font-semibold",
                  selectedPlan === 'lifetime'
                    ? "bg-gold hover:bg-gold-hover text-[--bg] shadow-gold"
                    : "bg-copper hover:bg-copper-hover text-[--bg] shadow-copper"
                )}
                onClick={handleCheckout}
                disabled={isCheckingOut}
              >
                {isCheckingOut ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Zap className="mr-2 h-5 w-5" />
                    Get {selectedPlan === 'lifetime' ? 'Lifetime' : 'Premium'} Access
                  </>
                )}
              </Button>
            </MagneticButton>
            <p className="mt-4 text-sm text-[--dim] font-body">
              Secure payment powered by Stripe
            </p>
          </div>
        </RevealOnScroll>

        {/* Feature Comparison */}
        <RevealOnScroll delay={100}>
        <div className="bg-[--card] border border-[--border] rounded-2xl shadow-card overflow-hidden">
          <div className="p-6 border-b border-[--border]">
            <h2 className="font-display text-xl font-bold text-[--cream] text-center">
              Compare Plans
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[--border]">
                  <th className="text-left py-3 px-6 text-[--muted] font-ui font-medium text-sm">Feature</th>
                  <th className="text-center py-3 px-4 text-[--muted] font-ui font-medium text-sm">Free</th>
                  <th className="text-center py-3 px-4 text-copper font-ui font-semibold text-sm">Premium</th>
                </tr>
              </thead>
              <tbody>
                {features.map((feature, index) => (
                  <tr key={index} className="border-b border-[--border]/50 hover:bg-[--card-hover] transition-colors">
                    <td className="py-3 px-6 text-[--cream] font-body text-sm">{feature.name}</td>
                    <td className="text-center py-3 px-4">
                      {feature.free ? (
                        <Check className="h-4 w-4 text-sage mx-auto" />
                      ) : (
                        <X className="h-4 w-4 text-[--dim] mx-auto" />
                      )}
                    </td>
                    <td className="text-center py-3 px-4">
                      <Check className="h-4 w-4 text-copper mx-auto" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        </RevealOnScroll>

        {/* Trust signals */}
        <div className="mt-12 text-center space-y-2">
          <p className="text-sm text-[--dim] font-body">Questions? Contact us at support@thedadcenter.com</p>
          <p className="text-sm text-[--dim] font-body">30-day money-back guarantee on all plans</p>
        </div>
      </div>
    </div>
  )
}

export default function UpgradePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[--bg]">
        <Loader2 className="h-8 w-8 animate-spin text-copper" />
      </div>
    }>
      <UpgradeContent />
    </Suspense>
  )
}
