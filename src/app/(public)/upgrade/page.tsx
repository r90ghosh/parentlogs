'use client'

import { Suspense, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { useCheckout, useIsPremium } from '@/hooks/use-subscription'
import { subscriptionService, PRICING, PricingPlan } from '@/services/subscription-service'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Check, Crown, Loader2, Sparkles, Zap, ArrowLeft, X } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

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
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-accent-500" />
      </div>
    )
  }

  if (isPremium) {
    return (
      <div className="min-h-screen bg-surface-950 p-4">
        <div className="max-w-2xl mx-auto pt-8">
          <Card className="bg-surface-900 border-surface-800">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-accent-500/20 flex items-center justify-center">
                <Crown className="h-8 w-8 text-accent-500" />
              </div>
              <CardTitle className="text-2xl text-white">You&apos;re Already Premium!</CardTitle>
              <CardDescription>
                {tier === 'lifetime'
                  ? "You have lifetime access to all premium features."
                  : "You have full access to all premium features."}
              </CardDescription>
            </CardHeader>
            <CardFooter className="justify-center">
              <Button asChild>
                <Link href="/dashboard">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Dashboard
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    )
  }

  const handleCheckout = () => {
    checkout(selectedPlan)
  }

  return (
    <div className="min-h-screen bg-surface-950">
      {/* Header */}
      <div className="border-b border-surface-800 bg-surface-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="text-surface-400 hover:text-white flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-accent-500" />
            <span className="font-semibold text-white">ParentLogs Premium</span>
          </div>
          <div className="w-16" />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Alerts */}
        {canceled && (
          <Alert className="mb-8 bg-amber-500/10 border-amber-500/30">
            <X className="h-4 w-4 text-amber-500" />
            <AlertDescription className="text-amber-300">
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
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-accent-500/20 text-accent-400 border-accent-500/30">
            Limited Time Offer
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Unlock Your Full Parenting Potential
          </h1>
          <p className="text-lg text-surface-400 max-w-2xl mx-auto">
            Get complete access to all features, unlimited history, and premium content to support your parenting journey.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {/* Monthly */}
          <Card
            className={cn(
              "bg-surface-900 border-2 cursor-pointer transition-all",
              selectedPlan === 'monthly'
                ? "border-accent-500"
                : "border-surface-800 hover:border-surface-700"
            )}
            onClick={() => setSelectedPlan('monthly')}
          >
            <CardHeader>
              <CardTitle className="text-white">Monthly</CardTitle>
              <CardDescription>Flexible month-to-month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <span className="text-4xl font-bold text-white">$4.99</span>
                <span className="text-surface-400">/month</span>
              </div>
              <ul className="space-y-2 text-sm text-surface-300">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-accent-500" />
                  All premium features
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-accent-500" />
                  Cancel anytime
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Yearly - Popular */}
          <Card
            className={cn(
              "bg-surface-900 border-2 cursor-pointer transition-all relative",
              selectedPlan === 'yearly'
                ? "border-accent-500"
                : "border-surface-800 hover:border-surface-700"
            )}
            onClick={() => setSelectedPlan('yearly')}
          >
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <Badge className="bg-accent-500 text-white">Most Popular</Badge>
            </div>
            <CardHeader>
              <CardTitle className="text-white">Yearly</CardTitle>
              <CardDescription>Best for new parents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <span className="text-4xl font-bold text-white">$39.99</span>
                <span className="text-surface-400">/year</span>
              </div>
              <div className="mb-4 p-2 bg-accent-500/10 rounded-lg text-center">
                <span className="text-accent-400 font-medium">Save 33% vs monthly</span>
              </div>
              <ul className="space-y-2 text-sm text-surface-300">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-accent-500" />
                  All premium features
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-accent-500" />
                  Priority support
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Lifetime */}
          <Card
            className={cn(
              "bg-surface-900 border-2 cursor-pointer transition-all relative",
              selectedPlan === 'lifetime'
                ? "border-amber-500"
                : "border-surface-800 hover:border-surface-700"
            )}
            onClick={() => setSelectedPlan('lifetime')}
          >
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <Badge className="bg-amber-500 text-black">Best Value</Badge>
            </div>
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Crown className="h-5 w-5 text-amber-500" />
                Lifetime
              </CardTitle>
              <CardDescription>One-time payment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <span className="text-4xl font-bold text-white">$99.99</span>
                <span className="text-surface-400"> once</span>
              </div>
              <div className="mb-4 p-2 bg-amber-500/10 rounded-lg text-center">
                <span className="text-amber-400 font-medium">Never pay again</span>
              </div>
              <ul className="space-y-2 text-sm text-surface-300">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-amber-500" />
                  All premium features forever
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-amber-500" />
                  All future updates included
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* CTA Button */}
        <div className="text-center mb-12">
          <Button
            size="lg"
            className="px-12 py-6 text-lg bg-accent-500 hover:bg-accent-600"
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
          <p className="mt-4 text-sm text-surface-500">
            Secure payment powered by Stripe
          </p>
        </div>

        {/* Feature Comparison */}
        <Card className="bg-surface-900 border-surface-800">
          <CardHeader>
            <CardTitle className="text-white text-center">Compare Plans</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-surface-800">
                    <th className="text-left py-3 px-4 text-surface-400 font-medium">Feature</th>
                    <th className="text-center py-3 px-4 text-surface-400 font-medium">Free</th>
                    <th className="text-center py-3 px-4 text-accent-400 font-medium">Premium</th>
                  </tr>
                </thead>
                <tbody>
                  {features.map((feature, index) => (
                    <tr key={index} className="border-b border-surface-800/50">
                      <td className="py-3 px-4 text-white">{feature.name}</td>
                      <td className="text-center py-3 px-4">
                        {feature.free ? (
                          <Check className="h-5 w-5 text-green-500 mx-auto" />
                        ) : (
                          <X className="h-5 w-5 text-surface-600 mx-auto" />
                        )}
                      </td>
                      <td className="text-center py-3 px-4">
                        <Check className="h-5 w-5 text-accent-500 mx-auto" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* FAQ or Trust Signals */}
        <div className="mt-12 text-center text-surface-500 text-sm">
          <p>Questions? Contact us at support@parentlogs.com</p>
          <p className="mt-2">30-day money-back guarantee on all plans</p>
        </div>
      </div>
    </div>
  )
}

export default function UpgradePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-surface-950">
        <Loader2 className="h-8 w-8 animate-spin text-accent-500" />
      </div>
    }>
      <UpgradeContent />
    </Suspense>
  )
}
