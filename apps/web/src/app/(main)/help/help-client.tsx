'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useUser } from '@/components/user-provider'
import { useSubmitContactMessage } from '@/hooks/use-contact'
import { useToast } from '@/hooks/use-toast'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Panel } from '@/components/digest'
import { usePageHeader } from '@/components/layouts/topbar-context'
import {
  HelpCircle,
  MessageSquare,
  Send,
  Loader2,
  ExternalLink,
  Mail,
  Shield,
  FileText,
  CheckCircle2,
} from 'lucide-react'
import Link from 'next/link'

const faqItems = [
  {
    id: 'what-is-tdc',
    question: 'What is The Dad Center?',
    answer:
      'The Dad Center is the operating system for modern fatherhood — a pregnancy and parenting companion designed primarily for dads (but also moms). It provides week-by-week briefings, task management, mood tracking, budget planning, checklists, and a dad journey system with challenges across 7 pillars.',
  },
  {
    id: 'family-subscription',
    question: 'How does the family subscription work?',
    answer:
      'One subscription covers your whole family. Both you and your partner share access to all premium features. Simply invite your partner from the Family settings page — no need for a second subscription.',
  },
  {
    id: 'free-tier',
    question: 'What do I get for free?',
    answer:
      'Free accounts get a 30-day rolling window of tasks, 4 weeks of briefings from signup, and 30 days of push notifications. You can use the mood check-in, dad journey challenges, and basic dashboard features at no cost.',
  },
  {
    id: 'invite-partner',
    question: 'How do I invite my partner?',
    answer:
      'Go to Settings → Family and share your unique invite code with your partner. They can enter it during signup or from their own Family settings page to join your family.',
  },
  {
    id: 'cancel-subscription',
    question: 'How do I cancel my subscription?',
    answer:
      'Go to Settings → Subscription → Manage Subscription. You can cancel anytime and will retain access until the end of your current billing period. Lifetime plans never expire.',
  },
  {
    id: 'change-due-date',
    question: 'Can I change my due date?',
    answer:
      'Yes! Go to Settings → Family to update your due date. Your briefings, tasks, and timeline will automatically adjust to reflect the new date.',
  },
  {
    id: 'data-security',
    question: 'How is my data kept secure?',
    answer:
      'Your data is stored securely on Supabase (powered by PostgreSQL) with row-level security policies. All connections are encrypted with TLS. We never sell your data to third parties. Payments are processed securely through Stripe.',
  },
  {
    id: 'delete-account',
    question: 'How do I delete my account?',
    answer:
      'Go to Settings → Profile and scroll to the bottom to find the account deletion option. This will permanently remove all your data. If you have an active subscription, please cancel it first.',
  },
]

const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Valid email is required'),
  subject: z.string().min(1, 'Please select a subject'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

type ContactFormData = z.infer<typeof contactSchema>

const subjectOptions = [
  'General Question',
  'Bug Report',
  'Feature Request',
  'Billing Issue',
  'Account Problem',
  'Partnership Inquiry',
  'Other',
]

export default function HelpClient() {
  const { user, profile } = useUser()
  const { toast } = useToast()
  const submitMessage = useSubmitContactMessage()
  const [submitted, setSubmitted] = useState(false)

  usePageHeader({ title: 'Help & Support', subtitle: 'Find answers or get in touch with our team' }, [])

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: profile.full_name || '',
      email: profile.email || user.email || '',
      subject: '',
      message: '',
    },
  })

  const onSubmit = (data: ContactFormData) => {
    submitMessage.mutate(
      {
        user_id: user.id,
        name: data.name,
        email: data.email,
        subject: data.subject,
        message: data.message,
      },
      {
        onSuccess: () => {
          toast({
            title: 'Message sent',
            description: "We'll get back to you as soon as possible.",
          })
          setSubmitted(true)
          reset()
        },
        onError: () => {
          toast({
            title: 'Something went wrong',
            description: 'Please try again or email us directly.',
            variant: 'destructive',
          })
        },
      }
    )
  }

  return (
    <div className="mx-auto max-w-2xl">
      {/* FAQ Section */}
      <div className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[1.5px] text-faint">
        <HelpCircle className="h-3.5 w-3.5" />
        Frequently Asked Questions
      </div>
      <Panel className="px-[18px]">
        <Accordion type="single" collapsible>
          {faqItems.map((item) => (
            <AccordionItem
              key={item.id}
              value={item.id}
              className="border-line2 last:border-b-0"
            >
              <AccordionTrigger className="py-4 text-left hover:no-underline">
                <span className="text-[15px] font-semibold text-ink">
                  {item.question}
                </span>
              </AccordionTrigger>
              <AccordionContent className="pb-4">
                <p className="text-[14px] leading-relaxed text-mute">
                  {item.answer}
                </p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Panel>

      {/* Contact Form */}
      <div className="mb-3 mt-7 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[1.5px] text-faint">
        <MessageSquare className="h-3.5 w-3.5" />
        Contact Us
      </div>
      <Panel className="p-[18px]">
        {submitted ? (
          <div className="space-y-3 py-8 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[--sage]/15">
              <CheckCircle2 className="h-6 w-6 text-[--sage]" />
            </div>
            <h3 className="text-[18px] font-extrabold text-ink">
              Message Sent!
            </h3>
            <p className="text-[14px] text-mute">
              We&apos;ll get back to you within 24-48 hours.
            </p>
            <button
              type="button"
              onClick={() => setSubmitted(false)}
              className="mt-2 rounded-xl border border-line bg-card px-4 py-2.5 text-[14px] font-bold text-ink2 hover:bg-card-hover"
            >
              Send Another Message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-[13px] font-semibold text-ink">
                  Name
                </Label>
                <Input
                  id="name"
                  {...register('name')}
                  className="w-full rounded-xl border border-line bg-card px-3.5 py-2.5 text-[15px] text-ink outline-none placeholder:text-faint focus:border-clay"
                  placeholder="Your name"
                />
                {errors.name && (
                  <p className="text-[12px] text-danger">{errors.name.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[13px] font-semibold text-ink">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  {...register('email')}
                  className="w-full rounded-xl border border-line bg-card px-3.5 py-2.5 text-[15px] text-ink outline-none placeholder:text-faint focus:border-clay"
                  placeholder="your@email.com"
                />
                {errors.email && (
                  <p className="text-[12px] text-danger">{errors.email.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject" className="text-[13px] font-semibold text-ink">
                Subject
              </Label>
              <Select onValueChange={(value) => setValue('subject', value)}>
                <SelectTrigger className="w-full rounded-xl border border-line bg-card px-3.5 py-2.5 text-[15px] text-ink focus:border-clay">
                  <SelectValue placeholder="Select a topic" />
                </SelectTrigger>
                <SelectContent className="border-line bg-card">
                  {subjectOptions.map((option) => (
                    <SelectItem
                      key={option}
                      value={option}
                      className="text-ink focus:bg-card-hover focus:text-ink"
                    >
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.subject && (
                <p className="text-[12px] text-danger">{errors.subject.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="message" className="text-[13px] font-semibold text-ink">
                Message
              </Label>
              <Textarea
                id="message"
                {...register('message')}
                className="min-h-[120px] w-full rounded-xl border border-line bg-card px-3.5 py-2.5 text-[15px] text-ink outline-none placeholder:text-faint focus:border-clay"
                placeholder="How can we help?"
              />
              {errors.message && (
                <p className="text-[12px] text-danger">{errors.message.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={submitMessage.isPending}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-clay px-4 py-2.5 text-[14px] font-bold text-white hover:opacity-90 disabled:opacity-50"
            >
              {submitMessage.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Send Message
                </>
              )}
            </button>
          </form>
        )}
      </Panel>

      {/* Quick Links */}
      <div className="mb-3 mt-7 text-[11px] font-bold uppercase tracking-[1.5px] text-faint">
        Quick Links
      </div>
      <Panel>
        <Link
          href="/privacy"
          className="group flex items-center gap-3.5 border-b border-line2 px-[18px] py-[15px] transition-colors last:border-b-0 hover:bg-card-hover"
        >
          <Shield className="h-5 w-5 flex-none text-mute transition-colors group-hover:text-clay-ink" />
          <span className="flex-1 text-[15px] font-semibold text-ink">Privacy Policy</span>
          <ExternalLink className="h-4 w-4 flex-none text-faint" />
        </Link>
        <Link
          href="/terms"
          className="group flex items-center gap-3.5 border-b border-line2 px-[18px] py-[15px] transition-colors last:border-b-0 hover:bg-card-hover"
        >
          <FileText className="h-5 w-5 flex-none text-mute transition-colors group-hover:text-clay-ink" />
          <span className="flex-1 text-[15px] font-semibold text-ink">Terms of Service</span>
          <ExternalLink className="h-4 w-4 flex-none text-faint" />
        </Link>
        <a
          href="mailto:info@thedadcenter.com"
          className="group flex items-center gap-3.5 border-b border-line2 px-[18px] py-[15px] transition-colors last:border-b-0 hover:bg-card-hover"
        >
          <Mail className="h-5 w-5 flex-none text-mute transition-colors group-hover:text-clay-ink" />
          <span className="flex-1 text-[15px] font-semibold text-ink">info@thedadcenter.com</span>
          <ExternalLink className="h-4 w-4 flex-none text-faint" />
        </a>
      </Panel>
    </div>
  )
}
