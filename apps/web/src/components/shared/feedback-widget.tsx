'use client'

import { useState, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { Bug, Lightbulb, HelpCircle, MessageSquare, MessageSquarePlus, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useOptionalUser } from '@/components/user-provider'
import { useSubmitFeedback } from '@/hooks/use-feedback'
import type { FeedbackPayload } from '@tdc/services'

const FEEDBACK_TYPES = [
  { value: 'bug', label: 'Bug', icon: Bug },
  { value: 'feature', label: 'Feature', icon: Lightbulb },
  { value: 'question', label: 'Question', icon: HelpCircle },
  { value: 'other', label: 'Other', icon: MessageSquare },
] as const

type FeedbackType = (typeof FEEDBACK_TYPES)[number]['value']

const COOLDOWN_MS = 30_000

/** Routes under (main) layout that have the bottom nav */
const MAIN_PREFIXES = ['/dashboard', '/tasks', '/briefing', '/tracker', '/budget', '/checklists', '/journey', '/family', '/account', '/help', '/notifications', '/calendar', '/settings', '/onboarding']

export function FeedbackWidget() {
  const [open, setOpen] = useState(false)
  const [type, setType] = useState<FeedbackType | null>(null)
  const [message, setMessage] = useState('')
  const [isMobile, setIsMobile] = useState(false)
  const lastSubmitRef = useRef(0)
  const userData = useOptionalUser()
  const { mutate: submit, isPending } = useSubmitFeedback()
  const pathname = usePathname()

  const hasBottomNav = MAIN_PREFIXES.some((p) => pathname.startsWith(p))

  const resetForm = () => {
    setType(null)
    setMessage('')
  }

  const handleOpen = () => {
    setIsMobile(window.matchMedia('(max-width: 767px)').matches)
    setOpen(true)
  }

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen)
    if (!isOpen) resetForm()
  }

  const trimmed = message.trim()
  const isValid = type && trimmed.length >= 10

  const handleSubmit = () => {
    if (!type || trimmed.length < 10) return

    if (Date.now() - lastSubmitRef.current < COOLDOWN_MS) {
      toast.error('Please wait before submitting again.')
      return
    }

    const payload: FeedbackPayload = {
      user_id: userData?.user.id ?? null,
      type,
      message: trimmed,
      page_url: window.location.pathname,
      user_agent: navigator.userAgent,
      user_role: userData?.profile.role ?? null,
      family_stage: userData?.family?.stage ?? null,
    }

    submit(payload, {
      onSuccess: () => {
        lastSubmitRef.current = Date.now()
        toast.success('Feedback sent — thanks!')
        resetForm()
        setTimeout(() => setOpen(false), 300)
      },
      onError: () => {
        toast.error('Failed to send feedback. Please try again.')
      },
    })
  }

  return (
    <>
      {/* FAB */}
      <button
        onClick={handleOpen}
        aria-label="Send feedback"
        className={`fixed z-[45] right-4 md:bottom-6 md:right-6 h-11 w-11 rounded-full bg-[--card] border border-copper/30 flex items-center justify-center text-[--copper] shadow-lg hover:bg-[--card-hover] hover:shadow-copper transition-all duration-200 ${
          hasBottomNav ? 'bottom-[calc(var(--nav-h,64px)+16px)]' : 'bottom-6'
        }`}
      >
        <MessageSquarePlus className="h-5 w-5" />
      </button>

      {/* Sheet */}
      <Sheet open={open} onOpenChange={handleOpenChange}>
        <SheetContent side={isMobile ? 'bottom' : 'right'} className="max-h-[85vh] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Send Feedback</SheetTitle>
            <SheetDescription>Bug, idea, or question — we read everything.</SheetDescription>
          </SheetHeader>

          <div className="flex flex-col gap-4 px-4 pb-4">
            {/* Type pills */}
            <div className="flex gap-2" role="group" aria-label="Feedback type">
              {FEEDBACK_TYPES.map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  type="button"
                  aria-pressed={type === value}
                  onClick={() => setType(value)}
                  className={`flex-1 flex flex-col items-center gap-1 rounded-lg py-2.5 px-2 text-xs font-ui border transition-all duration-150 ${
                    type === value
                      ? 'bg-copper/15 border-copper/40 text-[--copper]'
                      : 'bg-[--card] border-[--border] text-[--muted] hover:border-[--border-hover] hover:text-[--cream]'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </button>
              ))}
            </div>

            {/* Message */}
            <Textarea
              placeholder="What's on your mind?"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              maxLength={2000}
              className="bg-[--card] border-[--border] text-[--cream] placeholder:text-[--dim] resize-none focus:border-copper/40"
            />
            <div className="flex justify-between text-xs text-[--muted]">
              <span>{trimmed.length < 10 && trimmed.length > 0 ? `${10 - trimmed.length} more chars needed` : '\u00A0'}</span>
              <span>{message.length}/2000</span>
            </div>

            {/* Submit */}
            <Button
              onClick={handleSubmit}
              disabled={!isValid || isPending}
              className="w-full bg-copper hover:bg-copper/90 text-[--bg] font-ui font-semibold shadow-copper disabled:opacity-40"
            >
              {isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Send Feedback
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
