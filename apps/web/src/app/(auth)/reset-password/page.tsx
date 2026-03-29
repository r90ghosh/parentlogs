'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '@/lib/auth/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, KeyRound, CheckCircle } from 'lucide-react'
import { Card3DTilt } from '@/components/ui/animations/Card3DTilt'
import { Reveal } from '@/components/ui/animations/Reveal'
import { MagneticButton } from '@/components/ui/animations/MagneticButton'

const resetPasswordSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirm_password: z.string(),
}).refine((data) => data.password === data.confirm_password, {
  message: 'Passwords do not match',
  path: ['confirm_password'],
})

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>

export default function ResetPasswordPage() {
  const router = useRouter()
  const { updatePassword } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
  })

  const onSubmit = async (data: ResetPasswordForm) => {
    setIsLoading(true)
    setError(null)

    const { error } = await updatePassword(data.password)

    if (error) {
      setError(error.message)
      setIsLoading(false)
    } else {
      setSuccess(true)
      setIsLoading(false)
      setTimeout(() => {
        router.push('/login')
      }, 2000)
    }
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
                  Password updated!
                </h2>
                <p className="font-body text-sm text-[--muted]">
                  Your password has been successfully reset.
                </p>
              </div>
              <div
                className="animate-fade-in-up"
                style={{ animationDelay: '400ms', animationFillMode: 'backwards' }}
              >
                <Alert className="bg-copper/10 border-copper/30 text-left">
                  <AlertDescription className="text-[--cream] font-body text-sm">
                    Redirecting you to login...
                  </AlertDescription>
                </Alert>
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
                Reset your password
              </h1>
              <p className="font-body text-sm text-[--muted]">
                Enter your new password below
              </p>
            </div>

            {error && (
              <div className="animate-fade-in-up">
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              </div>
            )}

            {/* Password form */}
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4 animate-fade-in-up"
              style={{ animationDelay: '350ms', animationFillMode: 'backwards' }}
            >
              <div className="space-y-2">
                <Label htmlFor="password" className="font-ui text-[--cream]">New Password</Label>
                <Input
                  id="password"
                  type="password"
                  {...register('password')}
                  className="bg-[--bg] border-[--border] text-[--cream] placeholder:text-[--dim] focus:border-copper focus:ring-copper/20 font-body"
                />
                {errors.password && (
                  <p className="text-sm text-coral font-body">{errors.password.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm_password" className="font-ui text-[--cream]">Confirm New Password</Label>
                <Input
                  id="confirm_password"
                  type="password"
                  {...register('confirm_password')}
                  className="bg-[--bg] border-[--border] text-[--cream] placeholder:text-[--dim] focus:border-copper focus:ring-copper/20 font-body"
                />
                {errors.confirm_password && (
                  <p className="text-sm text-coral font-body">{errors.confirm_password.message}</p>
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
                      Updating...
                    </>
                  ) : (
                    <>
                      <KeyRound className="mr-2 h-4 w-4" />
                      Reset Password
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
                className="text-sm text-copper hover:text-copper-hover font-ui transition-colors"
              >
                Back to login
              </Link>
            </div>
          </div>
        </div>
      </Card3DTilt>
    </Reveal>
  )
}
