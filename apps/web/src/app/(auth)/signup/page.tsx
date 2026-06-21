'use client'

import { Suspense, useState, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '@/lib/auth/auth-context'
import { analytics, getStoredUtmParams } from '@/lib/analytics'
import { Loader2 } from 'lucide-react'
import { Panel } from '@/components/digest'

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

const fieldLabel = 'mb-1.5 block text-[13px] font-bold text-ink2'
const fieldInput =
  'w-full rounded-xl border border-line bg-card px-3.5 py-2.5 text-[15px] text-ink outline-none placeholder:text-faint focus:border-clay'

function SignupPageContent() {
  const { signUp, signInWithGoogle } = useAuth()
  const searchParams = useSearchParams()
  const inviteCode = searchParams.get('invite') || (typeof window !== 'undefined' ? localStorage.getItem('tdc_invite_code') : null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const inviteFromUrl = searchParams.get('invite')
    if (inviteFromUrl) {
      localStorage.setItem('tdc_invite_code', inviteFromUrl.toUpperCase())
    }
  }, [searchParams])

  const { register, handleSubmit, formState: { errors } } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
  })

  const onSubmit = async (data: SignupForm) => {
    setIsLoading(true)
    setError(null)

    const { data: authData, error } = await signUp(data.email, data.password, {
      full_name: data.full_name,
    }, inviteCode || undefined)

    if (error) {
      setError(error.message)
      setIsLoading(false)
    } else {
      analytics.signUp('email')

      // Persist UTM params in a cookie so the auth callback can save them
      // (RLS blocks client-side update before email confirmation)
      const utmParams = getStoredUtmParams()
      if (utmParams) {
        document.cookie = `utm_params=${encodeURIComponent(JSON.stringify(utmParams))};path=/;max-age=3600;SameSite=Lax;Secure`
      }

      setSuccess(true)
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    setError(null)

    // Fire analytics before OAuth redirect (flushed via sendBeacon on page hide)
    analytics.signUp('google')

    // Persist UTM params in a cookie so the server-side auth callback can save them
    const utmParams = getStoredUtmParams()
    if (utmParams) {
      document.cookie = `utm_params=${encodeURIComponent(JSON.stringify(utmParams))};path=/;max-age=3600;SameSite=Lax;Secure`
    }

    const { error } = await signInWithGoogle(inviteCode || undefined)
    if (error) {
      setError(error.message)
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <Panel className="p-6 text-center">
        <h2 className="text-[24px] font-extrabold tracking-[-0.3px] text-ink">Check your email</h2>
        <p className="mt-2 text-[14px] text-mute">
          We&apos;ve sent you a confirmation link. Please check your email to verify your account.
        </p>
        <p className="mt-5 rounded-xl border border-line bg-card2 px-3.5 py-3 text-left text-[13.5px] text-ink2">
          After confirming your email, you&apos;ll be able to set up your family profile.
        </p>
        <Link
          href="/login"
          className="mt-6 inline-block text-[14px] font-bold text-clay-ink hover:opacity-80"
        >
          Back to login
        </Link>
      </Panel>
    )
  }

  return (
    <Panel className="p-6">
      <div className="mb-6 text-center">
        <h1 className="text-[24px] font-extrabold tracking-[-0.3px] text-ink">Create an account</h1>
        <p className="mt-1 text-[14px] text-mute">Built for dads. Works for both.</p>
      </div>

      {error && (
        <p className="mb-5 rounded-xl border border-line bg-card px-3.5 py-2.5 text-[13px] font-semibold text-danger">
          {error}
        </p>
      )}

      {/* Google sign-in */}
      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={isLoading}
        className="flex w-full items-center justify-center rounded-xl border border-line bg-card px-5 py-3 text-[15px] font-bold text-ink hover:bg-card-hover disabled:opacity-50"
      >
        <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
          <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        Continue with Google
      </button>

      {/* Divider */}
      <div className="my-5 flex items-center gap-3">
        <div className="h-px flex-1 bg-line" />
        <span className="text-[12px] uppercase tracking-wider text-faint">Or continue with</span>
        <div className="h-px flex-1 bg-line" />
      </div>

      {/* Email form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="full_name" className={fieldLabel}>Full Name</label>
          <input
            id="full_name"
            type="text"
            placeholder="John Smith"
            autoComplete="name"
            {...register('full_name')}
            className={fieldInput}
          />
          {errors.full_name && (
            <p className="mt-1.5 text-[13px] font-semibold text-danger">{errors.full_name.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className={fieldLabel}>Email</label>
          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            {...register('email')}
            className={fieldInput}
          />
          {errors.email && (
            <p className="mt-1.5 text-[13px] font-semibold text-danger">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className={fieldLabel}>Password</label>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            {...register('password')}
            className={fieldInput}
          />
          {errors.password && (
            <p className="mt-1.5 text-[13px] font-semibold text-danger">{errors.password.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="confirm_password" className={fieldLabel}>Confirm Password</label>
          <input
            id="confirm_password"
            type="password"
            autoComplete="new-password"
            {...register('confirm_password')}
            className={fieldInput}
          />
          {errors.confirm_password && (
            <p className="mt-1.5 text-[13px] font-semibold text-danger">{errors.confirm_password.message}</p>
          )}
        </div>

        <button
          type="submit"
          className="flex w-full items-center justify-center rounded-xl bg-clay px-5 py-3 text-[15px] font-bold text-white hover:opacity-90 disabled:opacity-50"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating account...
            </>
          ) : (
            'Create Account'
          )}
        </button>
      </form>

      <p className="mt-5 text-center text-[12.5px] text-mute">
        By signing up, you agree to our{' '}
        <Link href="/terms" className="font-bold text-clay-ink hover:opacity-80">
          Terms of Service
        </Link>{' '}
        and{' '}
        <Link href="/privacy" className="font-bold text-clay-ink hover:opacity-80">
          Privacy Policy
        </Link>
      </p>

      {/* Footer link */}
      <p className="mt-4 text-center text-[14px] text-mute">
        Already have an account?{' '}
        <Link href="/login" className="font-bold text-clay-ink hover:opacity-80">
          Sign in
        </Link>
      </p>
    </Panel>
  )
}

export default function SignupPage() {
  return (
    <Suspense fallback={
      <Panel className="p-6">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-clay-ink" />
        </div>
      </Panel>
    }>
      <SignupPageContent />
    </Suspense>
  )
}
