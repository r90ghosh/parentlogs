'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { useAuth } from '@/lib/auth/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Mail, ArrowLeft, CheckCircle, KeyRound } from 'lucide-react'
import { Card3DTilt } from '@/components/ui/animations/Card3DTilt'
import { CardEntrance } from '@/components/ui/animations/CardEntrance'
import { MagneticButton } from '@/components/ui/animations/MagneticButton'

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email'),
})

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const onSubmit = async (data: ForgotPasswordForm) => {
    setIsLoading(true)
    setError(null)

    const { error } = await resetPassword(data.email)

    if (error) {
      setError(error.message)
    } else {
      setSuccess(true)
    }
    setIsLoading(false)
  }

  if (success) {
    return (
      <CardEntrance delay={100}>
        <Card3DTilt maxTilt={3} gloss>
          <div className="w-full bg-[--card] border border-[--border] rounded-2xl shadow-lift overflow-hidden">
            <div className="h-1 w-full bg-gradient-to-r from-copper via-gold to-copper opacity-90" />
            <div className="px-8 py-8 space-y-6 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', duration: 0.5 }}
                className="mx-auto h-14 w-14 rounded-full bg-copper/20 flex items-center justify-center"
              >
                <CheckCircle className="h-7 w-7 text-copper" />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="font-display text-2xl font-bold text-[--cream] mb-2">
                  Check your email
                </h2>
                <p className="font-body text-sm text-[--muted]">
                  We&apos;ve sent a password reset link to your email address.
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <Alert className="bg-copper/10 border-copper/30 text-left">
                  <AlertDescription className="text-[--cream] font-body text-sm">
                    Click the link in the email to reset your password. The link will expire in 24 hours.
                  </AlertDescription>
                </Alert>
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 text-sm text-copper hover:text-copper-hover font-ui transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to login
                </Link>
              </motion.div>
            </div>
          </div>
        </Card3DTilt>
      </CardEntrance>
    )
  }

  return (
    <CardEntrance delay={100}>
      <Card3DTilt maxTilt={3} gloss>
        <div className="w-full bg-[--card] border border-[--border] rounded-2xl shadow-lift overflow-hidden">
          {/* Top accent bar */}
          <div className="h-1 w-full bg-gradient-to-r from-copper via-gold to-copper opacity-90" />

          <div className="px-8 py-8 space-y-6">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-center"
            >
              <div className="mx-auto mb-4 h-14 w-14 rounded-full bg-copper/20 flex items-center justify-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', duration: 0.5, delay: 0.3 }}
                >
                  <KeyRound className="h-7 w-7 text-copper" />
                </motion.div>
              </div>
              <h1 className="font-display text-2xl font-bold text-[--cream] mb-1">
                Forgot password?
              </h1>
              <p className="font-body text-sm text-[--muted]">
                Enter your email and we&apos;ll send you a reset link
              </p>
            </motion.div>

            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              </motion.div>
            )}

            {/* Email form */}
            <motion.form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.35 }}
            >
              <div className="space-y-2">
                <Label htmlFor="email" className="font-ui text-[--cream]">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  {...register('email')}
                  className="bg-[--bg] border-[--border] text-[--cream] placeholder:text-[--dim] focus:border-copper focus:ring-copper/20 font-body"
                />
                {errors.email && (
                  <p className="text-sm text-coral font-body">{errors.email.message}</p>
                )}
              </div>

              <MagneticButton className="w-full">
                <Button
                  type="submit"
                  className="w-full bg-copper hover:bg-copper-hover text-[--bg] font-ui font-semibold shadow-copper"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Mail className="mr-2 h-4 w-4" />
                      Send Reset Link
                    </>
                  )}
                </Button>
              </MagneticButton>
            </motion.form>

            {/* Footer link */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-center"
            >
              <Link
                href="/login"
                className="inline-flex items-center gap-2 text-sm text-copper hover:text-copper-hover font-ui transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to login
              </Link>
            </motion.div>
          </div>
        </div>
      </Card3DTilt>
    </CardEntrance>
  )
}
