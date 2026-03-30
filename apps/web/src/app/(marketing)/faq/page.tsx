import { Metadata } from 'next'
import { FaqContent } from '@/components/marketing/FaqContent'

export const metadata: Metadata = {
  title: 'FAQ — The Dad Center',
  description:
    'Answers to common questions about The Dad Center — pricing, features, family subscriptions, privacy, and more.',
  alternates: { canonical: '/faq' },
  openGraph: {
    title: 'FAQ — The Dad Center',
    description:
      'Answers to common questions about The Dad Center — pricing, features, family subscriptions, privacy, and more.',
    url: '/faq',
  },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    // General
    {
      '@type': 'Question',
      name: 'What is The Dad Center?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The Dad Center is a pregnancy and parenting companion app designed to keep dads informed, prepared, and connected. Think of it as the operating system for modern fatherhood — week-by-week briefings, structured tasks, budget planning, and partner sync all in one place.',
      },
    },
    {
      '@type': 'Question',
      name: 'Who is this app for?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Primarily for expectant and new dads, but it works for the whole family. Moms get tailored content and the same tools. Whether you're 8 weeks in or 8 months postpartum, the app meets you where you are.",
      },
    },
    {
      '@type': 'Question',
      name: 'Can moms use The Dad Center?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Absolutely. While we lead with a dad-first voice, the app is fully role-aware. Moms see content tailored to their perspective and have access to all the same features — tasks, briefings, budget, tracker, and more.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is this a medical app?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. The Dad Center provides general pregnancy and parenting information for educational purposes only. Our briefings cite sources like ACOG and AAP guidelines, but this is not a substitute for professional medical advice. Always consult your healthcare provider.',
      },
    },
    // Subscription & Billing
    {
      '@type': 'Question',
      name: 'How does the family subscription work?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'One subscription covers your whole family. Both you and your partner share full Premium access with a single plan — no need for separate subscriptions.',
      },
    },
    {
      '@type': 'Question',
      name: 'How much does it cost?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Monthly: $4.99/mo. Yearly: $39.99/yr ($3.33/mo — save 33%). Lifetime: $99.99 one-time. All plans include full access for both partners.',
      },
    },
    {
      '@type': 'Question',
      name: 'What do I get for free?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Free accounts get a 30-day task window, 4 weeks of briefings from signup, core tracker features, and access to the dashboard. It's designed to feel complete, not crippled.",
      },
    },
    {
      '@type': 'Question',
      name: 'Can I cancel anytime?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Cancel your subscription at any time — no questions asked. You keep access through the end of your billing period, and your data stays safe on the free tier.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do I need to pay to try it?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. Free accounts get 30 days of tasks, 4 weeks of briefings, and full dashboard access — no credit card required. If you upgrade and want to cancel, you keep access through your billing period.',
      },
    },
    // Features
    {
      '@type': 'Question',
      name: 'What are weekly briefings?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Each week you get a concise briefing covering baby's development, what your partner may be experiencing, things to do this week, and practical dad-specific guidance. Think of it as your weekly shift briefing for fatherhood.",
      },
    },
    {
      '@type': 'Question',
      name: 'How does partner sync work?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Invite your partner with a family code. You both see shared tasks, can assign items to each other, and stay in sync on the journey. One person completing a task updates it for both.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the Budget Planner?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A phase-by-phase breakdown of what things actually cost — from prenatal vitamins to daycare. Each item includes best-value and premium options with real pricing so you can plan ahead.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the Dad Journey?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Seven challenge pillars — Knowledge, Planning, Finances, Anxiety, Baby Bonding, Relationship, and Extended Family — with guided content to help you grow in each area. It turns anxiety into action.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do I get push notifications?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Premium users get push notifications for task reminders, new briefings, and partner activity. Free users get notifications for 30 days from signup.',
      },
    },
    // Privacy & Data
    {
      '@type': 'Question',
      name: 'How is my data handled?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Your data is stored securely with industry-standard encryption. We never sell your data to third parties. See our Privacy Policy for full details.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I delete my account?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Go to Settings and scroll to "Delete Account." This permanently removes all your data and cannot be undone. Active subscriptions are cancelled automatically.',
      },
    },
    {
      '@type': 'Question',
      name: 'What happens to my data if I cancel Premium?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Your data stays safe. Cancelling Premium reverts you to the free tier — you keep access to your data within the free window. Re-subscribe anytime to unlock everything again.',
      },
    },
  ],
}

export default function FaqPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <FaqContent />
    </>
  )
}
