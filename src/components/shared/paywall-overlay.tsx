'use client'

import { Button } from '@/components/ui/button'
import { Crown, Lock } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export interface PaywallOverlayProps {
  feature: string
  message?: string
  description?: string
  className?: string
}

export function PaywallOverlay({ feature, message, description, className }: PaywallOverlayProps) {
  const displayMessage = message || description || `Upgrade to Premium to access ${feature}`

  return (
    <div className={cn(
      "absolute inset-0 bg-surface-950/80 backdrop-blur-sm flex items-center justify-center z-10 rounded-lg",
      className
    )}>
      <div className="text-center p-6 max-w-sm">
        <div className="mx-auto w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center mb-4">
          <Crown className="h-6 w-6 text-amber-400" />
        </div>
        <h3 className="text-lg font-medium text-white mb-2">
          Premium Feature
        </h3>
        <p className="text-sm text-surface-400 mb-4">
          {displayMessage}
        </p>
        <Button asChild className="bg-amber-500 hover:bg-amber-600 text-black">
          <Link href="/settings/subscription">
            <Crown className="h-4 w-4 mr-2" />
            Upgrade to Premium
          </Link>
        </Button>
      </div>
    </div>
  )
}

export function PaywallCard({ feature, description }: PaywallOverlayProps) {
  return (
    <div className="relative p-6 bg-surface-900 border border-surface-800 rounded-lg">
      <div className="absolute top-3 right-3">
        <Lock className="h-4 w-4 text-surface-500" />
      </div>
      <div className="text-center">
        <div className="mx-auto w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center mb-3">
          <Crown className="h-5 w-5 text-amber-400" />
        </div>
        <h3 className="font-medium text-white mb-1">{feature}</h3>
        {description && (
          <p className="text-xs text-surface-400 mb-3">{description}</p>
        )}
        <Button asChild size="sm" variant="outline" className="border-amber-500/50 text-amber-400 hover:bg-amber-500/10">
          <Link href="/settings/subscription">
            Unlock
          </Link>
        </Button>
      </div>
    </div>
  )
}
