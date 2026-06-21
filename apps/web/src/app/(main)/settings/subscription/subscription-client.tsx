'use client'

import { Suspense, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useSubscription, useIsPremium, useCheckout } from '@/hooks/use-subscription'
import { subscriptionService } from '@/lib/services'
import { GRACE_PERIOD_DAYS } from '@tdc/shared/utils/subscription-utils'
import { Panel, Badge } from '@/components/digest'
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
  ArrowLeft,
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
import { usePageHeader } from '@/components/layouts/topbar-context'

function SubscriptionContent() {
  const searchParams = useSearchParams()
  const success = searchParams.get('success')
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)

  const { data: subscription, isLoading: subLoading } = useSubscription()
  const { isPremium, isLifetime, tier, isLoading: tierLoading } = useIsPremium()
  const { openPortal, isOpeningPortal } = useCheckout()

  usePageHeader({ title: 'Subscription', subtitle: 'Manage your subscription and billing' }, [])

  const features = subscriptionService.getFeatureList()
  const isLoading = subLoading || tierLoading
  const isPastDue = subscription?.status === 'past_due'
  const isCanceling = subscription?.cancel_at_period_end && !isLifetime

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-clay-ink" />
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
    <div className="mx-auto max-w-2xl">
      <Link href="/settings" className="mb-5 inline-flex items-center gap-1.5 text-sm font-bold text-clay-ink hover:opacity-80">
        <ArrowLeft className="h-4 w-4" /> Settings
      </Link>

      {/* Success Alert */}
      {success && (
        <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-[--sage]/30 bg-[--sage]/10 px-4 py-3 text-[13.5px] text-[--sage]">
          <Check className="mt-0.5 h-4 w-4 flex-none" />
          <span>Welcome to Premium! Your subscription is now active.</span>
        </div>
      )}

      {/* Fix #1: Payment Failed Alert */}
      {isPastDue && (
        <div className="mb-5 rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-[13.5px] text-danger">
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="mt-0.5 h-4 w-4 flex-none" />
            <div>
              <p className="font-semibold">Payment failed</p>
              <p className="mt-1">
                Your last payment didn&apos;t go through. Please update your payment method to keep your premium access.
              </p>
              <button
                onClick={() => openPortal()}
                disabled={isOpeningPortal}
                className="mt-2 inline-flex items-center justify-center gap-2 rounded-xl border border-danger/40 bg-card px-3.5 py-2 text-[13px] font-bold text-danger hover:bg-card-hover disabled:opacity-50"
              >
                {isOpeningPortal ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <CreditCard className="h-3 w-3" />
                )}
                Update Payment Method
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Current Plan Card */}
      <div className="mb-3 text-[11px] font-bold uppercase tracking-[1.5px] text-faint">Current Plan</div>
      <Panel className="p-[18px]">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              {isPremium && <Crown className="h-5 w-5 text-[--gold]" />}
              <p className="text-[16px] font-extrabold text-ink">Current Plan</p>
            </div>
            <p className="text-[13px] text-mute">
              {isPremium
                ? isLifetime
                  ? 'Lifetime Premium'
                  : 'Premium Subscription'
                : 'Free Plan'}
            </p>
          </div>
          <Badge tone={isPastDue ? 'sage' : isPremium ? 'clay' : 'neutral'} className={isPastDue ? 'bg-danger/15 text-danger' : undefined}>
            {isPastDue ? 'Past Due' : tier.charAt(0).toUpperCase() + tier.slice(1)}
          </Badge>
        </div>

        <div className="mt-4 space-y-4">
          {isPremium && subscription && (
            <>
              {/* Subscription Details */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-3 rounded-xl bg-card2 p-3">
                  <Calendar className="h-5 w-5 text-mute" />
                  <div>
                    <p className="text-[13px] text-mute">
                      {isLifetime ? 'Purchased' : 'Current Period'}
                    </p>
                    <p className="text-[14px] font-semibold text-ink">
                      {isLifetime
                        ? formatDate(subscription.created_at)
                        : `${formatDate(subscription.current_period_start)} - ${formatDate(subscription.current_period_end)}`}
                    </p>
                  </div>
                </div>

                {!isLifetime && (
                  <div className="flex items-center gap-3 rounded-xl bg-card2 p-3">
                    <CreditCard className="h-5 w-5 text-mute" />
                    <div>
                      <p className="text-[13px] text-mute">Status</p>
                      <p className="text-[14px] font-semibold capitalize text-ink">
                        {isPastDue ? 'Past Due' : subscription.status}
                        {isCanceling && ' (Canceling)'}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Fix #6: Enhanced Canceling State Detail */}
              {isCanceling && (
                <div className="rounded-xl border border-[--gold]/30 bg-[--gold]/10 px-4 py-3 text-[13.5px] text-[--gold]">
                  <div className="flex items-start gap-2.5">
                    <AlertCircle className="mt-0.5 h-4 w-4 flex-none" />
                    <div className="space-y-2">
                      <p>
                        Your premium access continues until{' '}
                        <span className="font-semibold">{formatDate(subscription.current_period_end)}</span>.
                      </p>
                      {/* Fix #2: Grace period explanation */}
                      <p className="text-[--gold]/80">
                        After that date, you&apos;ll have a {GRACE_PERIOD_DAYS}-day grace period before
                        switching to the free plan. Your data will be preserved.
                      </p>
                      <p className="text-[--gold]/80">
                        You can resubscribe anytime to keep your premium access.
                      </p>
                      <Link
                        href="/upgrade"
                        className="mt-1 inline-flex items-center justify-center gap-2 rounded-xl border border-[--gold]/40 bg-card px-3.5 py-2 text-[13px] font-bold text-[--gold] hover:bg-card-hover"
                      >
                        <RotateCcw className="h-3 w-3" />
                        Resubscribe
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {!isPremium && (
            <div className="py-4 text-center">
              <Sparkles className="mx-auto mb-3 h-12 w-12 text-faint" />
              <p className="mb-4 text-[15px] text-mute">
                Upgrade to Premium to unlock all features
              </p>
              <Link
                href="/upgrade"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-clay px-4 py-2.5 text-[14px] font-bold text-white hover:opacity-90"
              >
                <Crown className="h-4 w-4" />
                Upgrade to Premium
              </Link>
            </div>
          )}

          {isPremium && !isLifetime && (
            <button
              onClick={handleManageBilling}
              disabled={isOpeningPortal}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-line bg-card px-4 py-2.5 text-[14px] font-bold text-ink2 hover:bg-card-hover disabled:opacity-50 sm:w-auto"
            >
              {isOpeningPortal ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Opening...
                </>
              ) : (
                <>
                  <ExternalLink className="h-4 w-4" />
                  {isCanceling ? 'Reactivate Subscription' : 'Manage Billing'}
                </>
              )}
            </button>
          )}
        </div>
      </Panel>

      {/* Features Comparison */}
      <div className="mb-3 mt-7 text-[11px] font-bold uppercase tracking-[1.5px] text-faint">Feature Comparison</div>
      <Panel className="p-[18px]">
        <p className="mb-4 text-[13px] text-mute">
          {isPremium ? 'You have access to all features' : 'Free vs Premium — see what you\'re missing'}
        </p>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-line2">
                <th className="px-3 py-3 text-left text-[11px] font-bold uppercase tracking-[1.5px] text-faint">Feature</th>
                <th className="w-24 px-3 py-3 text-center text-[11px] font-bold uppercase tracking-[1.5px] text-faint">Free</th>
                <th className="w-24 px-3 py-3 text-center text-[11px] font-bold uppercase tracking-[1.5px] text-clay-ink">Premium</th>
              </tr>
            </thead>
            <tbody className="text-[14px]">
              {features.map((feature, index) => {
                const hasAccess = isPremium || feature.free
                return (
                  <tr key={index} className="border-b border-line2 last:border-b-0">
                    <td className={`px-3 py-2.5 ${hasAccess ? 'text-ink' : 'text-faint'}`}>
                      {feature.name}
                    </td>
                    <td className="px-3 py-2.5 text-center">
                      {feature.free ? (
                        <Check className="mx-auto h-4 w-4 text-[--sage]" />
                      ) : (
                        <span className="text-faint">—</span>
                      )}
                    </td>
                    <td className="px-3 py-2.5 text-center">
                      <Check className="mx-auto h-4 w-4 text-clay-ink" />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {!isPremium && (
          <div className="mt-4 rounded-xl bg-clay-soft px-4 py-3 text-center text-[14px] font-semibold text-clay-ink">
            One subscription per family — both partners share access
          </div>
        )}

        {!isPremium && (
          <div className="mt-4 flex flex-col items-center gap-2">
            <Link
              href="/upgrade"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-clay px-4 py-2.5 text-[14px] font-bold text-white hover:opacity-90"
            >
              <Sparkles className="h-4 w-4" />
              Upgrade to Premium
            </Link>
            <p className="text-[12px] text-faint">
              Starting at $4.99/mo · Free for 30 days
            </p>
          </div>
        )}
      </Panel>

      {/* Help & Support Section */}
      <Panel className="mt-7 space-y-4 p-[18px]">
        {/* Cancellation info — show for premium users */}
        {isPremium && !isLifetime && (
          <div className="rounded-xl border border-line bg-card2 p-3">
            <div className="flex items-start gap-3">
              <Mail className="mt-0.5 h-4 w-4 flex-none text-mute" />
              <div>
                <p className="text-[14px] font-semibold text-ink">Need Help?</p>
                <p className="mt-1 text-[12.5px] text-mute">
                  Cancel anytime from Settings. You keep access through your billing period.
                </p>
                <a
                  href="mailto:info@thedadcenter.com?subject=Support%20-%20The%20Dad%20Center%20Premium"
                  className="mt-2 inline-flex items-center gap-1.5 text-[12.5px] font-bold text-clay-ink hover:opacity-80"
                >
                  <Mail className="h-3 w-3" />
                  Contact Support
                </a>
              </div>
            </div>
          </div>
        )}

        <div className="text-center text-[14px] text-mute">
          <p>Need help with your subscription?</p>
          <p className="mt-1">
            Contact us at{' '}
            <a href="mailto:info@thedadcenter.com" className="text-clay-ink hover:opacity-80">
              info@thedadcenter.com
            </a>
          </p>
        </div>
      </Panel>

      {/* Fix #5: Cancel Confirmation Dialog */}
      <AlertDialog open={showCancelConfirm} onOpenChange={setShowCancelConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Manage Your Subscription
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-3">
                <p>
                  You&apos;re about to open the billing portal where you can update payment details or cancel your subscription.
                </p>
                <div className="rounded-xl border border-[--gold]/20 bg-[--gold]/10 p-3">
                  <p className="mb-2 text-sm font-medium text-[--gold]">
                    If you cancel, you&apos;ll lose access to:
                  </p>
                  <ul className="space-y-1 text-sm text-[--gold]/80">
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
            <AlertDialogCancel>
              Keep Premium
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmPortal}
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
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-clay-ink" />
      </div>
    }>
      <SubscriptionContent />
    </Suspense>
  )
}
