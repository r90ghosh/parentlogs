'use client'

import { Suspense, useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '@/lib/auth/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Mail } from 'lucide-react'

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

type LoginForm = z.infer<typeof loginSchema>

function LoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/dashboard'
  const urlError = searchParams.get('error')
  const { signIn, signInWithGoogle } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(urlError ? decodeURIComponent(urlError) : null)

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginForm) => {
    console.log('[LoginPage] onSubmit called for:', data.email)
    setIsLoading(true)
    setError(null)

    const { error } = await signIn(data.email, data.password)

    if (error) {
      console.error('[LoginPage] Sign in error:', error.message)
      setError(error.message)
      setIsLoading(false)
    } else {
      console.log('[LoginPage] Sign in successful, redirecting to:', redirect)
      router.push(redirect)
    }
  }

  const handleGoogleSignIn = async () => {
    console.log('[LoginPage] handleGoogleSignIn called')
    setIsLoading(true)
    setError(null)

    const { error } = await signInWithGoogle()
    if (error) {
      console.error('[LoginPage] Google sign in error:', error.message)
      setError(error.message)
      setIsLoading(false)
    } else {
      console.log('[LoginPage] Google sign in initiated - redirecting to Google...')
    }
  }

  return (
    <div className="w-full bg-[--card] border border-[--border] rounded-2xl shadow-lift overflow-hidden">
      {/* Top accent bar */}
      <div className="h-1 w-full bg-gradient-to-r from-copper via-gold to-copper opacity-90" />

      <div className="px-8 py-8 space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="font-display text-2xl font-bold text-[--cream] mb-1">
            Welcome back
          </h1>
          <p className="font-body text-sm text-[--muted]">Sign in to your account</p>
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
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="font-ui text-[--cream]">Password</Label>
              <Link href="/forgot-password" className="text-sm text-copper hover:text-copper-hover font-ui transition-colors">
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              {...register('password')}
              className="bg-[--bg] border-[--border] text-[--cream] placeholder:text-[--dim] focus:border-copper focus:ring-copper/20 font-body"
            />
            {errors.password && (
              <p className="text-sm text-coral font-body">{errors.password.message}</p>
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
                Signing in...
              </>
            ) : (
              <>
                <Mail className="mr-2 h-4 w-4" />
                Sign in with Email
              </>
            )}
          </Button>
        </form>

        {/* Footer link */}
        <p className="text-center text-sm text-[--muted] font-body">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-copper hover:text-copper-hover font-ui transition-colors">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  useEffect(() => {
    console.log('[LoginPage] Page loaded')
  }, [])

  return (
    <Suspense fallback={
      <div className="w-full bg-[--card] border border-[--border] rounded-2xl shadow-lift overflow-hidden">
        <div className="h-1 w-full bg-gradient-to-r from-copper via-gold to-copper opacity-90" />
        <div className="py-12 flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-copper" />
        </div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  )
}
