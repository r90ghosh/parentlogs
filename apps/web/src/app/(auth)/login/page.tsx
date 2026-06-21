'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '@/lib/auth/auth-context'
import { Loader2 } from 'lucide-react'
import { Panel } from '@/components/digest'

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

type LoginForm = z.infer<typeof loginSchema>

function getSafeRedirect(redirect: string | null): string {
  if (!redirect) return '/dashboard'
  if (redirect.startsWith('/') && !redirect.startsWith('//')) {
    return redirect
  }
  return '/dashboard'
}

const fieldLabel = 'mb-1.5 block text-[13px] font-bold text-ink2'
const fieldInput =
  'w-full rounded-xl border border-line bg-card px-3.5 py-2.5 text-[15px] text-ink outline-none placeholder:text-faint focus:border-clay'

function LoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = getSafeRedirect(searchParams.get('redirect'))
  const urlError = searchParams.get('error')
  const { signIn, signInWithGoogle } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(urlError ? decodeURIComponent(urlError) : null)

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true)
    setError(null)

    const { error } = await signIn(data.email, data.password)

    if (error) {
      setError(error.message)
      setIsLoading(false)
    } else {
      router.push(redirect)
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

  return (
    <Panel className="p-6">
      <div className="mb-6 text-center">
        <h1 className="text-[24px] font-extrabold tracking-[-0.3px] text-ink">Welcome back</h1>
        <p className="mt-1 text-[14px] text-mute">Sign in to your account</p>
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
          <div className="mb-1.5 flex items-center justify-between">
            <label htmlFor="password" className="block text-[13px] font-bold text-ink2">Password</label>
            <Link href="/forgot-password" className="text-[13px] font-bold text-clay-ink hover:opacity-80">
              Forgot password?
            </Link>
          </div>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            {...register('password')}
            className={fieldInput}
          />
          {errors.password && (
            <p className="mt-1.5 text-[13px] font-semibold text-danger">{errors.password.message}</p>
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
              Signing in...
            </>
          ) : (
            'Sign in'
          )}
        </button>
      </form>

      {/* Footer link */}
      <p className="mt-6 text-center text-[14px] text-mute">
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="font-bold text-clay-ink hover:opacity-80">
          Sign up
        </Link>
      </p>
    </Panel>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <Panel className="p-6">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-clay-ink" />
        </div>
      </Panel>
    }>
      <LoginContent />
    </Suspense>
  )
}
