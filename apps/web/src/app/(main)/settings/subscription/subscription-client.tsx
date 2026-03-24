'use client'

import { Suspense, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useSubscription, useIsPremium, useCheckout } from '@/hooks/use-subscription'
import { subscriptionService } from '@/lib/services'
import { GRACE_PERIOD_DAYS } from '@tdc/shared/utils/subscription-utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Crown,
  Loader2,
  Check,
  ExternalLink,
  Calendar,
  CreditCard,
  Sparkles,
  AlertCircle,
  AlertTriangle,
  RotateCcw,
  Mail,
} from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'

function SubscriptionContent() {
  const searchParams = useSearchParams()
  const success = searchParams.get('success')
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)

  const { data: subscription, isLoading: subLoading } = useSubscription()
  const { isPremium, isLifetime, tier, isLoading: tierLoading } = useIsPremium()
  const { openPortal, isOpeningPortal } = useCheckout()

  const features = subscriptionService.getFeatureList()
  const isLoading = subLoading || tierLoading
  const isPastDue = subscription?.status === 'past_due'
  const isCanceling = subscription?.cancel_at_period_end && !isLifetime

  if (isLoading) {
    return (
      <div className="p-4 flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-copper" />
      </div>
    )
  }

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A'
    return format(new Date(dateString), 'MMMM d, yyyy')
  }

  function handleManageBilling() {
    if (isCanceling) {
      // Already canceling — go straight to portal (to resubscribe)
      openPortal()
    } else {
      // Show confirmation dialog before portal
      setShowCancelConfirm(true)
    }
  }

  function handleConfirmPortal() {
    setShowCancelConfirm(false)
    openPortal()
  }

  return (
    <div className="p-4 space-y-6 max-w-3xl">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold text-white">Subscription</h1>
        <p className="font-body text-[--muted]">Manage your subscription and billing</p>
      </div>

      {/* Success Alert */}
      {success && (
        <Alert className="bg-sage/10 border-sage/30">
          <Check className="h-4 w-4 text-sage" />
          <AlertDescription className="font-body text-sage">
            Welcome to Premium! Your subscription is now active.
          </AlertDescription>
        </Alert>
      )}

      {/* Fix #1: Payment Failed Alert */}
      {isPastDue && (
        <Alert className="bg-coral/10 border-coral/30">
          <AlertTriangle className="h-4 w-4 text-coral" />
          <AlertDescription className="font-body text-coral">
            <p className="font-semibold">Payment failed</p>
            <p className="mt-1">
              Your last payment didn&apos;t go through. Please update your payment method to keep your premium access.
            </p>
            <Button
              size="sm"
              variant="outline"
              onClick={() => openPortal()}
              disabled={isOpeningPortal}
              className="mt-2 border-coral/30 text-coral hover:bg-coral/10 font-ui font-semibold"
            >
              {isOpeningPortal ? (
                <Loader2 className="mr-2 h-3 w-3 animate-spin" />
              ) : (
                <CreditCard className="mr-2 h-3 w-3" />
              )}
              Update Payment Method
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Current Plan Card */}
      <Card className="bg-[--surface] border-[--border]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="font-display text-white flex items-center gap-2">
                {isPremium && <Crown className="h-5 w-5 text-gold" />}
                Current Plan
              </CardTitle>
              <CardDescription className="font-body">
                {isPremium
                  ? isLifetime
                    ? 'Lifetime Premium'
                    : 'Premium Subscription'
                  : 'Free Plan'}
              </CardDescription>
            </div>
            <Badge
              className={
                isPastDue
                  ? 'bg-coral/20 text-coral border-coral/30'
                  : isPremium
                    ? 'bg-copper/20 text-copper border-copper/30'
                    : 'bg-[--card] text-[--muted] border-[--border]'
              }
            >
              {isPastDue ? 'Past Due' : tier.charAt(0).toUpperCase() + tier.slice(1)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {isPremium && subscription && (
            <>
              {/* Subscription Details */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-3 p-3 bg-[--card]/50 rounded-lg">
                  <Calendar className="h-5 w-5 text-[--muted]" />
                  <div>
                    <p className="font-ui text-sm text-[--muted]">
                      {isLifetime ? 'Purchased' : 'Current Period'}
                    </p>
                    <p className="font-body text-white font-medium">
                      {isLifetime
                        ? formatDate(subscription.created_at)
                        : `${formatDate(subscription.current_period_start)} - ${formatDate(subscription.current_period_end)}`}
                    </p>
                  </div>
                </div>

                {!isLifetime && (
                  <div className="flex items-center gap-3 p-3 bg-[--card]/50 rounded-lg">
                    <CreditCard className="h-5 w-5 text-[--muted]" />
                    <div>
                      <p className="font-ui text-sm text-[--muted]">Status</p>
                      <p className="font-body text-white font-medium capitalize">
                        {isPastDue ? 'Past Due' : subscription.status}
                        {isCanceling && ' (Canceling)'}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Fix #6: Enhanced Canceling State Detail */}
              {isCanceling && (
                <Alert className="bg-gold/10 border-gold/30">
                  <AlertCircle className="h-4 w-4 text-gold" />
                  <AlertDescription className="font-body text-gold space-y-2">
                    <p>
                      Your premium access continues until{' '}
                      <span className="font-semibold">{formatDate(subscription.current_period_end)}</span>.
                    </p>
                    {/* Fix #2: Grace period explanation */}
                    <p className="text-gold/80">
                      After that date, you&apos;ll have a {GRACE_PERIOD_DAYS}-day grace period before
                      switching to the free plan. Your data will be preserved.
                    </p>
                    <p className="text-gold/80">
                      You can resubscribe anytime to keep your premium access.
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      asChild
                      className="mt-1 border-gold/30 text-gold hover:bg-gold/10 font-ui font-semibold"
                    >
                      <Link href="/upgrade">
                        <RotateCcw className="mr-2 h-3 w-3" />
                        Resubscribe
                      </Link>
                    </Button>
                  </AlertDescription>
                </Alert>
              )}
            </>
          )}

          {!isPremium && (
            <div className="text-center py-4">
              <Sparkles className="h-12 w-12 text-[--dim] mx-auto mb-3" />
              <p className="font-body text-[--muted] mb-4">
                Upgrade to Premium to unlock all features
              </p>
              <Button asChild className="bg-copper hover:bg-copper/80 font-ui font-semibold">
                <Link href="/upgrade">
                  <Crown className="mr-2 h-4 w-4" />
                  Upgrade to Premium
                </Link>
              </Button>
            </div>
          )}
        </CardContent>

        {isPremium && !isLifetime && (
          <CardFooter>
            <Button
              variant="outline"
              onClick={handleManageBilling}
              disabled={isOpeningPortal}
              className="w-full sm:w-auto font-ui font-semibold"
            >
              {isOpeningPortal ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Opening...
                </>
              ) : (
                <>
                  <ExternalLink className="mr-2 h-4 w-4" />
                  {isCanceling ? 'Reactivate Subscription' : 'Manage Billing'}
                </>
              )}
            </Button>
          </CardFooter>
        )}
      </Card>

      {/* Features Comparison */}
      <Card className="bg-[--surface] border-[--border]">
        <CardHeader>
          <CardTitle className="font-display text-white">Feature Comparison</CardTitle>
          <CardDescription className="font-body">
            {isPremium ? 'You have access to all features' : 'Free vs Premium — see what you\'re missing'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[--border]">
                  <th className="text-left py-3 px-3 font-ui font-semibold text-[11px] uppercase tracking-[0.12em] text-[--muted]">Feature</th>
                  <th className="text-center py-3 px-3 font-ui font-semibold text-[11px] uppercase tracking-[0.12em] text-[--muted] w-24">Free</th>
                  <th className="text-center py-3 px-3 font-ui font-semibold text-[11px] uppercase tracking-[0.12em] text-copper w-24">Premium</th>
                </tr>
              </thead>
              <tbody className="font-body text-sm">
                {features.map((feature, index) => {
                  const hasAccess = isPremium || feature.free
                  return (
                    <tr key={index} className="border-b border-[--border]/50">
                      <td className={`py-2.5 px-3 ${hasAccess ? 'text-white' : 'text-[--dim]'}`}>
                        {feature.name}
                      </td>
                      <td className="text-center py-2.5 px-3">
                        {feature.free ? (
                          <Check className="h-4 w-4 text-sage mx-auto" />
                        ) : (
                          <span className="text-[--dim]">—</span>
                        )}
                      </td>
                      <td className="text-center py-2.5 px-3">
                        <Check className="h-4 w-4 text-copper mx-auto" />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {!isPremium && (
            <div className="mt-4 p-3 rounded-lg bg-copper/10 border border-copper/20 text-center">
              <p className="font-ui text-sm text-copper font-medium">
                One subscription per family — both partners share access
              </p>
            </div>
          )}
        </CardContent>

        {!isPremium && (
          <CardFooter className="flex-col gap-2">
            <Button asChild className="w-full bg-copper hover:bg-copper/80 font-ui font-semibold">
              <Link href="/upgrade">
                <Sparkles className="mr-2 h-4 w-4" />
                Upgrade — $39.99/yr ($3.33/mo)
              </Link>
            </Button>
            <p className="font-body text-xs text-[--dim]">
              Or $4.99/month · $99.99 lifetime · 30-day money-back guarantee
            </p>
          </CardFooter>
        )}
      </Card>

      {/* Fix #3: Refund & Help Section */}
      <Card className="bg-[--surface] border-[--border]">
        <CardContent className="pt-6 space-y-4">
          {/* Refund info — show for premium users */}
          {isPremium && !isLifetime && (
            <div className="p-3 rounded-lg bg-[--card]/50 border border-[--border]">
              <div className="flex items-start gap-3">
                <Mail className="h-4 w-4 text-[--muted] mt-0.5 shrink-0" />
                <div>
                  <p className="font-ui text-sm text-white font-medium">30-Day Money-Back Guarantee</p>
                  <p className="font-body text-xs text-[--muted] mt-1">
                    Not satisfied? Request a full refund within 30 days of purchase.
                  </p>
                  <a
                    href="mailto:info@thedadcenter.com?subject=Refund%20Request%20-%20The%20Dad%20Center%20Premium"
                    className="inline-flex items-center gap-1.5 font-ui text-xs text-copper hover:text-copper/80 mt-2"
                  >
                    <Mail className="h-3 w-3" />
                    Request a Refund
                  </a>
                </div>
              </div>
            </div>
          )}

          <div className="text-center font-body text-sm text-[--muted]">
            <p>Need help with your subscription?</p>
            <p className="mt-1">
              Contact us at{' '}
              <a href="mailto:info@thedadcenter.com" className="text-copper hover:text-copper/80">
                info@thedadcenter.com
              </a>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Fix #5: Cancel Confirmation Dialog */}
      <AlertDialog open={showCancelConfirm} onOpenChange={setShowCancelConfirm}>
        <AlertDialogContent className="bg-[--surface] border-[--border]">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display text-white">
              Manage Your Subscription
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-3 font-body text-[--muted]">
                <p>
                  You&apos;re about to open the billing portal where you can update payment details or cancel your subscription.
                </p>
                <div className="p-3 rounded-lg bg-gold/10 border border-gold/20">
                  <p className="font-ui text-sm font-medium text-gold mb-2">
                    If you cancel, you&apos;ll lose access to:
                  </p>
                  <ul className="space-y-1 text-sm text-gold/80">
                    <li>- Full task timeline (pregnancy to 24 months)</li>
                    <li>- All weekly briefings (40+ weeks)</li>
                    <li>- Push notifications & reminders</li>
                    <li>- Partner sync & coordination</li>
                    <li>- Complete budget planner</li>
                    <li>- Advanced tracker & mood insights</li>
                  </ul>
                </div>
                <p className="text-sm">
                  After cancellation, your premium access continues until the end of your
                  billing period, plus a {GRACE_PERIOD_DAYS}-day grace period. Your data is always preserved.
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="font-ui font-semibold">
              Keep Premium
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmPortal}
              className="bg-[--card] hover:bg-[--card-hover] font-ui font-semibold"
            >
              Continue to Billing Portal
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default function SubscriptionClient() {
  return (
    <Suspense fallback={
      <div className="p-4 flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-copper" />
      </div>
    }>
      <SubscriptionContent />
    </Suspense>
  )
}
