'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle } from 'lucide-react'

const features = [
  '200+ expert-curated tasks auto-loaded to your timeline',
  'Weekly briefings tailored to your stage',
  'Partner sync for seamless coordination',
  'Baby tracker with shift handoff',
]

export default function OnboardingWelcome() {
  const router = useRouter()

  return (
    <Card className="w-full max-w-md bg-surface-900 border-surface-800">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl text-white">Welcome to ParentLogs</CardTitle>
        <CardDescription>Your parenting command center</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <ul className="space-y-3">
          {features.map((feature, i) => (
            <li key={i} className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-accent-500 shrink-0 mt-0.5" />
              <span className="text-sm text-surface-200">{feature}</span>
            </li>
          ))}
        </ul>

        <div className="space-y-2">
          <Button
            className="w-full"
            onClick={() => router.push('/onboarding/role')}
          >
            Get Started
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => router.push('/onboarding/join')}
          >
            Join Partner&apos;s Family
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
