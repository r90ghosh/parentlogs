'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '@/lib/auth/auth-context'
import { Loader2, ArrowLeft } from 'lucide-react'
import { Panel } from '@/components/digest'

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email'),
})

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>

const fieldLabel = 'mb-1.5 block text-[13px] font-bold text-ink2'
const fieldInput =
  'w-full rounded-xl border border-line bg-card px-3.5 py-2.5 text-[15px] text-ink outline-none placeholder:text-faint focus:border-clay'

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
      <Panel className="p-6 text-center">
        <h2 className="text-[24px] font-extrabold tracking-[-0.3px] text-ink">Check your email</h2>
        <p className="mt-2 text-[14px] text-mute">
          We&apos;ve sent a password reset link to your email address.
        </p>
        <p className="mt-5 rounded-xl border border-line bg-card2 px-3.5 py-3 text-left text-[13.5px] text-ink2">
          Click the link in the email to reset your password. The link will expire in 24 hours.
        </p>
        <Link
          href="/login"
          className="mt-6 inline-flex items-center gap-2 text-[14px] font-bold text-clay-ink hover:opacity-80"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to login
        </Link>
      </Panel>
    )
  }

  return (
    <Panel className="p-6">
      <div className="mb-6 text-center">
        <h1 className="text-[24px] font-extrabold tracking-[-0.3px] text-ink">Forgot password?</h1>
        <p className="mt-1 text-[14px] text-mute">Enter your email and we&apos;ll send you a reset link</p>
      </div>

      {error && (
        <p className="mb-5 rounded-xl border border-line bg-card px-3.5 py-2.5 text-[13px] font-semibold text-danger">
          {error}
        </p>
      )}

      {/* Email form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="email" className={fieldLabel}>Email</label>
          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            {...register('email')}
            className={fieldInput}
          />
          {errors.email && (
            <p className="mt-1.5 text-[13px] font-semibold text-danger">{errors.email.message}</p>
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
              Sending...
            </>
          ) : (
            'Send Reset Link'
          )}
        </button>
      </form>

      {/* Footer link */}
      <div className="mt-6 text-center">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-[14px] font-bold text-clay-ink hover:opacity-80"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to login
        </Link>
      </div>
    </Panel>
  )
}
