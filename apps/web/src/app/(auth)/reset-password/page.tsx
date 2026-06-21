'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '@/lib/auth/auth-context'
import { Loader2 } from 'lucide-react'
import { Panel } from '@/components/digest'

const resetPasswordSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirm_password: z.string(),
}).refine((data) => data.password === data.confirm_password, {
  message: 'Passwords do not match',
  path: ['confirm_password'],
})

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>

const fieldLabel = 'mb-1.5 block text-[13px] font-bold text-ink2'
const fieldInput =
  'w-full rounded-xl border border-line bg-card px-3.5 py-2.5 text-[15px] text-ink outline-none placeholder:text-faint focus:border-clay'

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
      <Panel className="p-6 text-center">
        <h2 className="text-[24px] font-extrabold tracking-[-0.3px] text-ink">Password updated!</h2>
        <p className="mt-2 text-[14px] text-mute">Your password has been successfully reset.</p>
        <p className="mt-5 rounded-xl border border-line bg-card2 px-3.5 py-3 text-left text-[13.5px] text-ink2">
          Redirecting you to login...
        </p>
      </Panel>
    )
  }

  return (
    <Panel className="p-6">
      <div className="mb-6 text-center">
        <h1 className="text-[24px] font-extrabold tracking-[-0.3px] text-ink">Reset your password</h1>
        <p className="mt-1 text-[14px] text-mute">Enter your new password below</p>
      </div>

      {error && (
        <p className="mb-5 rounded-xl border border-line bg-card px-3.5 py-2.5 text-[13px] font-semibold text-danger">
          {error}
        </p>
      )}

      {/* Password form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="password" className={fieldLabel}>New Password</label>
          <input
            id="password"
            type="password"
            {...register('password')}
            className={fieldInput}
          />
          {errors.password && (
            <p className="mt-1.5 text-[13px] font-semibold text-danger">{errors.password.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="confirm_password" className={fieldLabel}>Confirm New Password</label>
          <input
            id="confirm_password"
            type="password"
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
              Updating...
            </>
          ) : (
            'Reset Password'
          )}
        </button>
      </form>

      {/* Footer link */}
      <div className="mt-6 text-center">
        <Link href="/login" className="text-[14px] font-bold text-clay-ink hover:opacity-80">
          Back to login
        </Link>
      </div>
    </Panel>
  )
}
