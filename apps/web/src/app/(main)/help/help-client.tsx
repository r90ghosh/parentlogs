'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useUser } from '@/components/user-provider'
import { useSubmitContactMessage } from '@/hooks/use-contact'
import { useToast } from '@/hooks/use-toast'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
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
import { RevealOnScroll } from '@/components/ui/animations/RevealOnScroll'
import { CardEntrance } from '@/components/ui/animations/CardEntrance'
import { MagneticButton } from '@/components/ui/animations/MagneticButton'
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
    question: 'What is Rooftop Crest?',
    answer:
      'Rooftop Crest is the operating system for modern fatherhood — a pregnancy and parenting companion designed primarily for dads (but also moms). It provides week-by-week briefings, task management, mood tracking, budget planning, checklists, and a dad journey system with challenges across 7 pillars.',
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
    <div className="p-4 md:px-8 py-6 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <RevealOnScroll delay={0}>
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Help & Support</h1>
          <p className="font-body text-[--muted]">
            Find answers or get in touch with our team
          </p>
        </div>
      </RevealOnScroll>

      {/* FAQ Section */}
      <CardEntrance delay={80}>
        <Card className="bg-[--surface] border-[--border]">
          <CardHeader className="pb-3">
            <CardTitle className="font-display text-lg text-[--cream] flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-copper" />
              Frequently Asked Questions
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <Accordion type="single" collapsible className="space-y-1">
              {faqItems.map((item) => (
                <AccordionItem
                  key={item.id}
                  value={item.id}
                  className="border-[--border] last:border-b-0"
                >
                  <AccordionTrigger className="py-3 hover:no-underline hover:text-copper text-left">
                    <span className="font-body text-sm text-[--cream]">
                      {item.question}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="pb-3">
                    <p className="font-body text-sm text-[--muted] leading-relaxed">
                      {item.answer}
                    </p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </CardEntrance>

      {/* Contact Form */}
      <CardEntrance delay={160}>
        <Card className="bg-[--surface] border-[--border]">
          <CardHeader className="pb-3">
            <CardTitle className="font-display text-lg text-[--cream] flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-copper" />
              Contact Us
            </CardTitle>
            <p className="font-body text-sm text-[--muted]">
              Can&apos;t find what you&apos;re looking for? Send us a message.
            </p>
          </CardHeader>
          <CardContent className="pt-0">
            {submitted ? (
              <div className="text-center py-8 space-y-3">
                <div className="mx-auto h-12 w-12 rounded-full bg-sage/20 flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6 text-sage" />
                </div>
                <h3 className="font-display text-lg font-semibold text-[--cream]">
                  Message Sent!
                </h3>
                <p className="font-body text-sm text-[--muted]">
                  We&apos;ll get back to you within 24-48 hours.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2 border-[--border] text-[--cream] hover:bg-[--card]"
                  onClick={() => setSubmitted(false)}
                >
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="font-ui text-sm text-[--cream]">
                      Name
                    </Label>
                    <Input
                      id="name"
                      {...register('name')}
                      className="bg-[--card] border-[--border] text-[--cream] placeholder:text-[--dim]"
                      placeholder="Your name"
                    />
                    {errors.name && (
                      <p className="text-xs text-coral font-body">{errors.name.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="font-ui text-sm text-[--cream]">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      {...register('email')}
                      className="bg-[--card] border-[--border] text-[--cream] placeholder:text-[--dim]"
                      placeholder="your@email.com"
                    />
                    {errors.email && (
                      <p className="text-xs text-coral font-body">{errors.email.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject" className="font-ui text-sm text-[--cream]">
                    Subject
                  </Label>
                  <Select onValueChange={(value) => setValue('subject', value)}>
                    <SelectTrigger className="bg-[--card] border-[--border] text-[--cream]">
                      <SelectValue placeholder="Select a topic" />
                    </SelectTrigger>
                    <SelectContent className="bg-[--card] border-[--border]">
                      {subjectOptions.map((option) => (
                        <SelectItem
                          key={option}
                          value={option}
                          className="text-[--cream] focus:bg-[--card-hover] focus:text-[--cream]"
                        >
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.subject && (
                    <p className="text-xs text-coral font-body">{errors.subject.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="font-ui text-sm text-[--cream]">
                    Message
                  </Label>
                  <Textarea
                    id="message"
                    {...register('message')}
                    className="bg-[--card] border-[--border] text-[--cream] placeholder:text-[--dim] min-h-[120px]"
                    placeholder="How can we help?"
                  />
                  {errors.message && (
                    <p className="text-xs text-coral font-body">{errors.message.message}</p>
                  )}
                </div>

                <MagneticButton>
                  <Button
                    type="submit"
                    disabled={submitMessage.isPending}
                    className="w-full bg-copper hover:bg-copper-hover text-[--bg] font-ui font-semibold shadow-copper"
                  >
                    {submitMessage.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Send Message
                      </>
                    )}
                  </Button>
                </MagneticButton>
              </form>
            )}
          </CardContent>
        </Card>
      </CardEntrance>

      {/* Quick Links */}
      <CardEntrance delay={240}>
        <Card className="bg-[--surface] border-[--border]">
          <CardHeader className="pb-3">
            <CardTitle className="font-display text-lg text-[--cream]">
              Quick Links
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              <Link
                href="/privacy"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-[--card] transition-colors group"
              >
                <Shield className="h-5 w-5 text-[--muted] group-hover:text-copper transition-colors" />
                <span className="font-body text-sm text-[--cream] flex-1">Privacy Policy</span>
                <ExternalLink className="h-4 w-4 text-[--dim]" />
              </Link>
              <Link
                href="/terms"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-[--card] transition-colors group"
              >
                <FileText className="h-5 w-5 text-[--muted] group-hover:text-copper transition-colors" />
                <span className="font-body text-sm text-[--cream] flex-1">Terms of Service</span>
                <ExternalLink className="h-4 w-4 text-[--dim]" />
              </Link>
              <a
                href="mailto:support@rooftopcrest.com"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-[--card] transition-colors group"
              >
                <Mail className="h-5 w-5 text-[--muted] group-hover:text-copper transition-colors" />
                <span className="font-body text-sm text-[--cream] flex-1">
                  support@rooftopcrest.com
                </span>
                <ExternalLink className="h-4 w-4 text-[--dim]" />
              </a>
            </div>
          </CardContent>
        </Card>
      </CardEntrance>
    </div>
  )
}
