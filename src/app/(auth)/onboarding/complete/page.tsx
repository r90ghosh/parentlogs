'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth/auth-context'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, Rocket, Calendar, Users, ListTodo } from 'lucide-react'
import { motion } from 'framer-motion'

const setupItems = [
  { icon: Users, label: 'Family profile created', delay: 0 },
  { icon: Calendar, label: 'Timeline configured', delay: 0.1 },
  { icon: ListTodo, label: '200+ tasks loaded', delay: 0.2 },
]

export default function OnboardingComplete() {
  const router = useRouter()
  const { user, refreshProfile } = useAuth()
  const supabase = createClient()
  const [isCompleting, setIsCompleting] = useState(true)

  useEffect(() => {
    const completeOnboarding = async () => {
      if (!user) return

      await supabase
        .from('profiles')
        .update({ onboarding_completed: true })
        .eq('id', user.id)

      await refreshProfile()
      setIsCompleting(false)
    }

    completeOnboarding()
  }, [user, supabase, refreshProfile])

  return (
    <Card className="w-full max-w-md bg-surface-900 border-surface-800">
      <CardHeader className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="mx-auto mb-4 h-16 w-16 rounded-full bg-accent-500/20 flex items-center justify-center"
        >
          <Rocket className="h-8 w-8 text-accent-500" />
        </motion.div>
        <CardTitle className="text-2xl text-white">You&apos;re all set!</CardTitle>
        <CardDescription>Your parenting command center is ready</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          {setupItems.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: item.delay + 0.3 }}
              className="flex items-center gap-3 p-3 bg-surface-800 rounded-lg"
            >
              <div className="h-8 w-8 rounded-full bg-accent-500/20 flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-accent-500" />
              </div>
              <span className="text-surface-200">{item.label}</span>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Button
            className="w-full"
            size="lg"
            onClick={() => router.push('/dashboard')}
            disabled={isCompleting}
          >
            Go to Dashboard
          </Button>
        </motion.div>
      </CardContent>
    </Card>
  )
}
