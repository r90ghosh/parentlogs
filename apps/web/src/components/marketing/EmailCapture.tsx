'use client'

import { useState } from 'react'
import { Send, CheckCircle, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface EmailCaptureProps {
  source?: string
  heading?: string
  description?: string
  className?: string
  compact?: boolean
}

export function EmailCapture({
  source = 'blog',
  heading = 'Get weekly dad tips',
  description = 'Practical advice for expecting and new dads — no spam, unsubscribe anytime.',
  className = '',
  compact = false,
}: EmailCaptureProps) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return

    setStatus('loading')
    setErrorMsg('')

    try {
      const supabase = createClient()
      const { error } = await supabase.from('email_subscribers').insert({
        email: email.trim().toLowerCase(),
        source,
      })

      if (error) {
        if (error.code === '23505') {
          // Unique constraint — already subscribed
          setStatus('success')
        } else {
          throw error
        }
      } else {
        setStatus('success')
      }
      setEmail('')
    } catch {
      setStatus('error')
      setErrorMsg('Something went wrong. Please try again.')
    }
  }

  if (status === 'success') {
    return (
      <div className={`flex items-center gap-3 ${compact ? 'p-3' : 'p-6'} rounded-xl bg-sage/10 border border-sage/20 ${className}`}>
        <CheckCircle className="h-5 w-5 text-sage flex-shrink-0" />
        <p className="font-body text-sm text-sage">You&apos;re in! Check your inbox.</p>
      </div>
    )
  }

  if (compact) {
    return (
      <form onSubmit={handleSubmit} className={`flex gap-2 ${className}`}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          className="flex-1 min-w-0 px-3 py-2 rounded-lg bg-[--surface] border border-[--border] text-[--white] font-body text-sm placeholder:text-[--dim] focus:outline-none focus:border-copper/50"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="px-4 py-2 rounded-lg bg-copper hover:bg-copper/80 text-white font-ui text-sm font-medium transition-colors disabled:opacity-50 flex items-center gap-1.5"
        >
          {status === 'loading' ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </button>
        {status === 'error' && (
          <p className="text-xs text-coral font-body mt-1">{errorMsg}</p>
        )}
      </form>
    )
  }

  return (
    <div className={`p-8 rounded-2xl bg-[--surface]/50 border border-[--border] text-center ${className}`}>
      <h3 className="font-display text-xl font-bold text-[--white] mb-2">{heading}</h3>
      <p className="font-body text-sm text-[--muted] mb-6 max-w-md mx-auto">{description}</p>
      <form onSubmit={handleSubmit} className="flex gap-2 max-w-sm mx-auto">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          className="flex-1 min-w-0 px-4 py-3 rounded-xl bg-[--bg] border border-[--border] text-[--white] font-body text-sm placeholder:text-[--dim] focus:outline-none focus:border-copper/50"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="px-5 py-3 rounded-xl bg-copper hover:bg-copper/80 text-white font-ui text-sm font-semibold transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {status === 'loading' ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              Subscribe
              <Send className="h-4 w-4" />
            </>
          )}
        </button>
      </form>
      {status === 'error' && (
        <p className="text-xs text-coral font-body mt-3">{errorMsg}</p>
      )}
    </div>
  )
}
