'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '@/lib/auth/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Mail, ArrowLeft, CheckCircle, KeyRound } from 'lucide-react'
import { Card3DTilt } from '@/components/ui/animations/Card3DTilt'
import { Reveal } from '@/components/ui/animations/Reveal'
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
      <Reveal variant="card" delay={100}>
        <Card3DTilt maxTilt={3} gloss>
          <div className="w-full bg-[--card] border border-[--border] rounded-2xl shadow-lift overflow-hidden">
            <div className="h-1 w-full bg-gradient-to-r from-copper via-gold to-copper opacity-90" />
            <div className="px-8 py-8 space-y-6 text-center">
              <div
                className="mx-auto h-14 w-14 rounded-full bg-copper/20 flex items-center justify-center animate-scale-in"
              >
                <CheckCircle className="h-7 w-7 text-copper" />
              </div>
              <div
                className="animate-fade-in-up"
                style={{ animationDelay: '200ms', animationFillMode: 'backwards' }}
              >
                <h2 className="font-display text-2xl font-bold text-[--cream] mb-2">
                  Check your email
                </h2>
                <p className="font-body text-sm text-[--muted]">
                  We&apos;ve sent a password reset link to your email address.
                </p>
              </div>
              <div
                className="animate-fade-in-up"
                style={{ animationDelay: '400ms', animationFillMode: 'backwards' }}
              >
                <Alert className="bg-copper/10 border-copper/30 text-left">
                  <AlertDescription className="text-[--cream] font-body text-sm">
                    Click the link in the email to reset your password. The link will expire in 24 hours.
                  </AlertDescription>
                </Alert>
              </div>
              <div
                className="animate-fade-in-up"
                style={{ animationDelay: '500ms', animationFillMode: 'backwards' }}
              >
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 text-sm text-copper hover:text-copper-hover font-ui transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to login
                </Link>
              </div>
            </div>
          </div>
        </Card3DTilt>
      </Reveal>
    )
  }

  return (
    <Reveal variant="card" delay={100}>
      <Card3DTilt maxTilt={3} gloss>
        <div className="w-full bg-[--card] border border-[--border] rounded-2xl shadow-lift overflow-hidden">
          {/* Top accent bar */}
          <div className="h-1 w-full bg-gradient-to-r from-copper via-gold to-copper opacity-90" />

          <div className="px-8 py-8 space-y-6">
            {/* Header */}
            <div
              className="text-center animate-fade-in-up"
              style={{ animationDelay: '200ms', animationFillMode: 'backwards' }}
            >
              <div className="mx-auto mb-4 h-14 w-14 rounded-full bg-copper/20 flex items-center justify-center">
                <div
                  className="animate-fade-in-up"
                  style={{ animationDelay: '300ms', animationFillMode: 'backwards' }}
                >
                  <KeyRound className="h-7 w-7 text-copper" />
                </div>
              </div>
              <h1 className="font-display text-2xl font-bold text-[--cream] mb-1">
                Forgot password?
              </h1>
              <p className="font-body text-sm text-[--muted]">
                Enter your email and we&apos;ll send you a reset link
              </p>
            </div>

            {error && (
              <div className="animate-fade-in-up">
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              </div>
            )}

            {/* Email form */}
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4 animate-fade-in-up"
              style={{ animationDelay: '350ms', animationFillMode: 'backwards' }}
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
            </form>

            {/* Footer link */}
            <div
              className="text-center animate-fade-in-up"
              style={{ animationDelay: '500ms', animationFillMode: 'backwards' }}
            >
              <Link
                href="/login"
                className="inline-flex items-center gap-2 text-sm text-copper hover:text-copper-hover font-ui transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to login
              </Link>
            </div>
          </div>
        </div>
      </Card3DTilt>
    </Reveal>
  )
}
