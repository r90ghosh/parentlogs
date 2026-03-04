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
import { Loader2, UserPlus, Mail } from 'lucide-react'

const signupSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirm_password: z.string(),
}).refine((data) => data.password === data.confirm_password, {
  message: 'Passwords do not match',
  path: ['confirm_password'],
})

type SignupForm = z.infer<typeof signupSchema>

export default function SignupPage() {
  const { signUp, signInWithGoogle } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
  })

  const onSubmit = async (data: SignupForm) => {
    setIsLoading(true)
    setError(null)

    const { error } = await signUp(data.email, data.password, {
      full_name: data.full_name,
    })

    if (error) {
      setError(error.message)
      setIsLoading(false)
    } else {
      setSuccess(true)
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    setError(null)

    const { error } = await signInWithGoogle()
    if (error) {
      setError(error.message)
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="w-full bg-[--card] border border-[--border] rounded-2xl shadow-lift overflow-hidden">
        <div className="h-1 w-full bg-gradient-to-r from-copper via-gold to-copper opacity-90" />
        <div className="px-8 py-8 space-y-6 text-center">
          <div className="mx-auto h-14 w-14 rounded-full bg-copper/20 flex items-center justify-center">
            <Mail className="h-7 w-7 text-copper" />
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold text-[--cream] mb-2">
              Check your email
            </h2>
            <p className="font-body text-sm text-[--muted]">
              We&apos;ve sent you a confirmation link. Please check your email to verify your account.
            </p>
          </div>
          <Alert className="bg-copper/10 border-copper/30 text-left">
            <AlertDescription className="text-[--cream] font-body text-sm">
              After confirming your email, you&apos;ll be able to set up your family profile.
            </AlertDescription>
          </Alert>
          <Link
            href="/login"
            className="inline-block text-sm text-copper hover:text-copper-hover font-ui transition-colors"
          >
            Back to login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full bg-[--card] border border-[--border] rounded-2xl shadow-lift overflow-hidden">
      {/* Top accent bar */}
      <div className="h-1 w-full bg-gradient-to-r from-copper via-gold to-copper opacity-90" />

      <div className="px-8 py-8 space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="font-display text-2xl font-bold text-[--cream] mb-1">
            Create an account
          </h1>
          <p className="font-body text-sm text-[--muted]">Built for dads. Works for both.</p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Google sign-in */}
        <Button
          variant="outline"
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="w-full border-[--border-hover] bg-[--card-hover] text-[--cream] hover:bg-[--dim] hover:border-[--border-hover] font-ui"
        >
          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </Button>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[--border]" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-[--card] px-3 text-[--muted] font-ui tracking-wider">
              Or continue with
            </span>
          </div>
        </div>

        {/* Email form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="full_name" className="font-ui text-[--cream]">Full Name</Label>
            <Input
              id="full_name"
              type="text"
              placeholder="John Smith"
              autoComplete="name"
              {...register('full_name')}
              className="bg-[--bg] border-[--border] text-[--cream] placeholder:text-[--dim] focus:border-copper focus:ring-copper/20 font-body"
            />
            {errors.full_name && (
              <p className="text-sm text-coral font-body">{errors.full_name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="font-ui text-[--cream]">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              {...register('email')}
              className="bg-[--bg] border-[--border] text-[--cream] placeholder:text-[--dim] focus:border-copper focus:ring-copper/20 font-body"
            />
            {errors.email && (
              <p className="text-sm text-coral font-body">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="font-ui text-[--cream]">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              {...register('password')}
              className="bg-[--bg] border-[--border] text-[--cream] placeholder:text-[--dim] focus:border-copper focus:ring-copper/20 font-body"
            />
            {errors.password && (
              <p className="text-sm text-coral font-body">{errors.password.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm_password" className="font-ui text-[--cream]">Confirm Password</Label>
            <Input
              id="confirm_password"
              type="password"
              autoComplete="new-password"
              {...register('confirm_password')}
              className="bg-[--bg] border-[--border] text-[--cream] placeholder:text-[--dim] focus:border-copper focus:ring-copper/20 font-body"
            />
            {errors.confirm_password && (
              <p className="text-sm text-coral font-body">{errors.confirm_password.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-copper hover:bg-copper-hover text-[--bg] font-ui font-semibold shadow-copper"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : (
              <>
                <UserPlus className="mr-2 h-4 w-4" />
                Create Account
              </>
            )}
          </Button>
        </form>

        <p className="text-xs text-center text-[--muted] font-body">
          By signing up, you agree to our{' '}
          <Link href="/terms" className="text-copper hover:text-copper-hover font-ui transition-colors">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="text-copper hover:text-copper-hover font-ui transition-colors">
            Privacy Policy
          </Link>
        </p>

        {/* Footer link */}
        <p className="text-center text-sm text-[--muted] font-body">
          Already have an account?{' '}
          <Link href="/login" className="text-copper hover:text-copper-hover font-ui transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
