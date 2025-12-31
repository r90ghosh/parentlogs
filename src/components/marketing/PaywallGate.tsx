'use client'

import Link from 'next/link'
import { Lock, Mail, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface PaywallGateProps {
  title: string
}

export function PaywallGate({ title }: PaywallGateProps) {
  return (
    <div className="relative mt-8">
      {/* Blur/fade overlay for content above */}
      <div className="absolute -top-32 left-0 right-0 h-32 bg-gradient-to-t from-slate-950 to-transparent pointer-events-none" />

      {/* Gate content */}
      <div className="relative p-8 md:p-12 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm">
        <div className="text-center max-w-md mx-auto">
          {/* Lock icon */}
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-500/10 mb-6">
            <Lock className="h-8 w-8 text-amber-400" />
          </div>

          {/* Title */}
          <h3 className="text-2xl font-bold text-white mb-3">Sign up free to continue reading</h3>

          {/* Description */}
          <p className="text-slate-400 mb-8">
            Create a free account to unlock this article and get access to weekly briefings
            personalized to your due date.
          </p>

          {/* Auth options */}
          <div className="space-y-3">
            <Button
              asChild
              size="lg"
              className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold"
            >
              <Link href="/signup">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="w-full border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              <Link href="/login">
                <Mail className="mr-2 h-5 w-5" />
                Sign in with Email
              </Link>
            </Button>
          </div>

          {/* Login link */}
          <p className="mt-6 text-sm text-slate-500">
            Already have an account?{' '}
            <Link href="/login" className="text-amber-400 hover:text-amber-300">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
