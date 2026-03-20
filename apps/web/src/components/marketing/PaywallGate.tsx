'use client'

import Link from 'next/link'
import { Lock, Mail, ArrowRight, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface PaywallGateProps {
  title: string
  isAuthenticated?: boolean
}

export function PaywallGate({ title, isAuthenticated = false }: PaywallGateProps) {
  return (
    <div className="relative mt-8">
      {/* Blur/fade overlay for content above */}
      <div className="absolute -top-32 left-0 right-0 h-32 bg-gradient-to-t from-[--bg] to-transparent pointer-events-none" />

      {/* Gate content */}
      <div className="relative p-8 md:p-12 rounded-2xl bg-[--surface]/80 border border-[--border] backdrop-blur-sm">
        <div className="text-center max-w-md mx-auto">
          {/* Lock icon */}
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-copper/10 mb-6">
            {isAuthenticated ? (
              <Sparkles className="h-8 w-8 text-copper" />
            ) : (
              <Lock className="h-8 w-8 text-copper" />
            )}
          </div>

          {isAuthenticated ? (
            <>
              {/* Upgrade CTA for authenticated free users */}
              <h3 className="font-display text-2xl font-bold text-white mb-3">Upgrade to unlock this article</h3>
              <p className="font-body text-[--muted] mb-8">
                This is a premium article. Upgrade your account to read the full article and unlock
                all premium content.
              </p>

              <Button
                asChild
                size="lg"
                className="w-full bg-copper hover:bg-copper/80 text-white font-ui font-semibold"
              >
                <Link href="/upgrade">
                  Upgrade to Premium
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </>
          ) : (
            <>
              {/* Signup CTA for unauthenticated users */}
              <h3 className="font-display text-2xl font-bold text-white mb-3">Sign up free to continue reading</h3>
              <p className="font-body text-[--muted] mb-8">
                Create a free account to unlock this article and get access to weekly briefings
                personalized to your due date.
              </p>

              <div className="space-y-3">
                <Button
                  asChild
                  size="lg"
                  className="w-full bg-copper hover:bg-copper/80 text-white font-ui font-semibold"
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
                  className="w-full border-[--border] text-[--cream] hover:bg-[--card] hover:text-white font-ui font-semibold"
                >
                  <Link href="/login">
                    <Mail className="mr-2 h-5 w-5" />
                    Sign in with Email
                  </Link>
                </Button>
              </div>

              <p className="font-body mt-6 text-sm text-[--dim]">
                Already have an account?{' '}
                <Link href="/login" className="text-copper hover:text-copper/80">
                  Log in
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
