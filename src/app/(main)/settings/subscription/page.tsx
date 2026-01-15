'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { useSubscription, useIsPremium, useCheckout } from '@/hooks/use-subscription'
import { subscriptionService } from '@/services/subscription-service'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import {
  Crown,
  Loader2,
  Check,
  ExternalLink,
  Calendar,
  CreditCard,
  Sparkles,
  AlertCircle,
} from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'

function SubscriptionContent() {
  const searchParams = useSearchParams()
  const success = searchParams.get('success')

  const { data: subscription, isLoading: subLoading } = useSubscription()
  const { isPremium, isLifetime, tier, isLoading: tierLoading } = useIsPremium()
  const { openPortal, isOpeningPortal } = useCheckout()

  const features = subscriptionService.getFeatureList()
  const isLoading = subLoading || tierLoading

  if (isLoading) {
    return (
      <div className="p-4 flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-accent-500" />
      </div>
    )
  }

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A'
    return format(new Date(dateString), 'MMMM d, yyyy')
  }

  return (
    <div className="p-4 space-y-6 max-w-3xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Subscription</h1>
        <p className="text-surface-400">Manage your subscription and billing</p>
      </div>

      {/* Success Alert */}
      {success && (
        <Alert className="bg-green-500/10 border-green-500/30">
          <Check className="h-4 w-4 text-green-500" />
          <AlertDescription className="text-green-300">
            Welcome to Premium! Your subscription is now active.
          </AlertDescription>
        </Alert>
      )}

      {/* Current Plan Card */}
      <Card className="bg-surface-900 border-surface-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white flex items-center gap-2">
                {isPremium && <Crown className="h-5 w-5 text-amber-500" />}
                Current Plan
              </CardTitle>
              <CardDescription>
                {isPremium
                  ? isLifetime
                    ? 'Lifetime Premium'
                    : 'Premium Subscription'
                  : 'Free Plan'}
              </CardDescription>
            </div>
            <Badge
              className={
                isPremium
                  ? 'bg-accent-500/20 text-accent-400 border-accent-500/30'
                  : 'bg-surface-800 text-surface-400 border-surface-700'
              }
            >
              {tier.charAt(0).toUpperCase() + tier.slice(1)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {isPremium && subscription && (
            <>
              {/* Subscription Details */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-3 p-3 bg-surface-800/50 rounded-lg">
                  <Calendar className="h-5 w-5 text-surface-400" />
                  <div>
                    <p className="text-sm text-surface-400">
                      {isLifetime ? 'Purchased' : 'Current Period'}
                    </p>
                    <p className="text-white font-medium">
                      {isLifetime
                        ? formatDate(subscription.created_at)
                        : `${formatDate(subscription.current_period_start)} - ${formatDate(subscription.current_period_end)}`}
                    </p>
                  </div>
                </div>

                {!isLifetime && (
                  <div className="flex items-center gap-3 p-3 bg-surface-800/50 rounded-lg">
                    <CreditCard className="h-5 w-5 text-surface-400" />
                    <div>
                      <p className="text-sm text-surface-400">Status</p>
                      <p className="text-white font-medium capitalize">
                        {subscription.status}
                        {subscription.cancel_at_period_end && ' (Canceling)'}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Cancel Warning */}
              {subscription.cancel_at_period_end && (
                <Alert className="bg-amber-500/10 border-amber-500/30">
                  <AlertCircle className="h-4 w-4 text-amber-500" />
                  <AlertDescription className="text-amber-300">
                    Your subscription will end on {formatDate(subscription.current_period_end)}.
                    You can reactivate anytime before then.
                  </AlertDescription>
                </Alert>
              )}
            </>
          )}

          {!isPremium && (
            <div className="text-center py-4">
              <Sparkles className="h-12 w-12 text-surface-600 mx-auto mb-3" />
              <p className="text-surface-400 mb-4">
                Upgrade to Premium to unlock all features
              </p>
              <Button asChild className="bg-accent-500 hover:bg-accent-600">
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
              onClick={() => openPortal()}
              disabled={isOpeningPortal}
              className="w-full sm:w-auto"
            >
              {isOpeningPortal ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Opening...
                </>
              ) : (
                <>
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Manage Billing
                </>
              )}
            </Button>
          </CardFooter>
        )}
      </Card>

      {/* Features List */}
      <Card className="bg-surface-900 border-surface-800">
        <CardHeader>
          <CardTitle className="text-white">Your Features</CardTitle>
          <CardDescription>What&apos;s included in your plan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2">
            {features.map((feature, index) => {
              const hasAccess = isPremium || feature.free
              return (
                <div
                  key={index}
                  className={`flex items-center gap-3 p-2 rounded-lg ${
                    hasAccess ? '' : 'opacity-50'
                  }`}
                >
                  <div
                    className={`h-6 w-6 rounded-full flex items-center justify-center ${
                      hasAccess
                        ? 'bg-accent-500/20'
                        : 'bg-surface-800'
                    }`}
                  >
                    {hasAccess ? (
                      <Check className="h-4 w-4 text-accent-500" />
                    ) : (
                      <Crown className="h-3 w-3 text-surface-500" />
                    )}
                  </div>
                  <span className={hasAccess ? 'text-white' : 'text-surface-500'}>
                    {feature.name}
                  </span>
                  {!feature.free && !isPremium && (
                    <Badge variant="outline" className="ml-auto text-xs border-surface-700 text-surface-500">
                      Premium
                    </Badge>
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>

        {!isPremium && (
          <CardFooter>
            <Button asChild className="w-full bg-accent-500 hover:bg-accent-600">
              <Link href="/upgrade">
                <Sparkles className="mr-2 h-4 w-4" />
                Unlock All Features
              </Link>
            </Button>
          </CardFooter>
        )}
      </Card>

      {/* Help Section */}
      <Card className="bg-surface-900 border-surface-800">
        <CardContent className="pt-6">
          <div className="text-center text-sm text-surface-400">
            <p>Need help with your subscription?</p>
            <p className="mt-1">
              Contact us at{' '}
              <a href="mailto:support@parentlogs.com" className="text-accent-500 hover:text-accent-400">
                support@parentlogs.com
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function SubscriptionSettingsPage() {
  return (
    <Suspense fallback={
      <div className="p-4 flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-accent-500" />
      </div>
    }>
      <SubscriptionContent />
    </Suspense>
  )
}
