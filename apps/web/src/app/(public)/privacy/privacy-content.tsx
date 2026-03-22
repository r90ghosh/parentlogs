'use client'

import Link from 'next/link'
import { ArrowLeft, Shield } from 'lucide-react'
import { WarmBackground } from '@/components/ui/animations/WarmBackground'
import { RevealOnScroll } from '@/components/ui/animations/RevealOnScroll'

const lastUpdated = 'March 4, 2026'

export function PrivacyContent() {
  return (
    <div className="min-h-screen bg-[--bg]">
      <WarmBackground />

      {/* Sticky header */}
      <div className="border-b border-[--border] bg-[--surface]/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="text-[--muted] hover:text-[--cream] flex items-center gap-2 font-ui transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Home
          </Link>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-copper" />
            <span className="font-display font-bold text-[--cream]">Privacy Policy</span>
          </div>
          <div className="w-16" />
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-12">
        <RevealOnScroll delay={0}>
          <div className="mb-10">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-[--cream] mb-3">
              Privacy Policy
            </h1>
            <p className="font-body text-[--muted]">Last updated: {lastUpdated}</p>
          </div>
        </RevealOnScroll>

        <div className="prose-custom space-y-8">
          <RevealOnScroll delay={50}>
            <Section title="1. Introduction">
              <p>
                The Dad Center (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) operates the website thedadcenter.com and associated mobile applications (the &quot;Service&quot;). This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our Service.
              </p>
              <p>
                By using the Service, you agree to the collection and use of information in accordance with this policy. If you do not agree, please do not use our Service.
              </p>
            </Section>
          </RevealOnScroll>

          <RevealOnScroll delay={50}>
            <Section title="2. Information We Collect">
              <h4>Account Information</h4>
              <p>
                When you create an account, we collect your name, email address, and role (e.g., dad, mom, or other). You may also provide your partner&apos;s name and your baby&apos;s due date or birth date.
              </p>
              <h4>Usage Data</h4>
              <p>
                We automatically collect information about how you interact with the Service, including pages visited, features used, mood check-ins, task completions, and timestamps.
              </p>
              <h4>Device Information</h4>
              <p>
                We may collect device type, operating system, browser type, and unique device identifiers for analytics and push notification delivery.
              </p>
              <h4>Payment Information</h4>
              <p>
                Payment processing is handled by Stripe (web) and RevenueCat (mobile). We do not store your full credit card number. We receive only the last four digits, card brand, and transaction confirmations.
              </p>
            </Section>
          </RevealOnScroll>

          <RevealOnScroll delay={50}>
            <Section title="3. How We Use Your Information">
              <ul>
                <li>To provide and personalize week-by-week briefings, tasks, and content based on your pregnancy or parenting stage</li>
                <li>To enable family sharing features between partners</li>
                <li>To process subscriptions and manage billing</li>
                <li>To send push notifications and email reminders (with your consent)</li>
                <li>To improve our Service through aggregated, anonymized analytics</li>
                <li>To respond to support requests and contact form submissions</li>
                <li>To detect and prevent fraud or abuse</li>
              </ul>
            </Section>
          </RevealOnScroll>

          <RevealOnScroll delay={50}>
            <Section title="4. Information Sharing">
              <p>We do not sell your personal information. We share data only with:</p>
              <ul>
                <li>
                  <strong>Supabase</strong> — Our database and authentication provider. Your data is stored securely in Supabase&apos;s PostgreSQL infrastructure with row-level security.
                </li>
                <li>
                  <strong>Stripe</strong> — Processes web payments. Subject to{' '}
                  <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" className="text-copper hover:underline">
                    Stripe&apos;s Privacy Policy
                  </a>.
                </li>
                <li>
                  <strong>RevenueCat</strong> — Manages mobile subscriptions. Subject to{' '}
                  <a href="https://www.revenuecat.com/privacy" target="_blank" rel="noopener noreferrer" className="text-copper hover:underline">
                    RevenueCat&apos;s Privacy Policy
                  </a>.
                </li>
                <li>
                  <strong>Netlify</strong> — Hosts our web application. May process request logs.
                </li>
              </ul>
              <p>
                We may also disclose information if required by law, court order, or to protect the rights and safety of our users and the public.
              </p>
            </Section>
          </RevealOnScroll>

          <RevealOnScroll delay={50}>
            <Section title="5. Data Security">
              <p>
                We implement industry-standard security measures including TLS encryption for all data in transit, row-level security policies in our database, secure authentication via Supabase Auth, and regular security audits. However, no method of electronic storage or transmission is 100% secure, and we cannot guarantee absolute security.
              </p>
            </Section>
          </RevealOnScroll>

          <RevealOnScroll delay={50}>
            <Section title="6. Children's Privacy">
              <p>
                The Dad Center is intended for parents and expecting parents aged 18 and older. We do not knowingly collect personal information from children under 13 in compliance with COPPA. If we learn that we have collected information from a child under 13, we will promptly delete it. If you believe we have collected such information, please contact us.
              </p>
            </Section>
          </RevealOnScroll>

          <RevealOnScroll delay={50}>
            <Section title="7. Your Rights">
              <h4>For All Users</h4>
              <ul>
                <li>Access, update, or delete your personal data from Settings → Profile</li>
                <li>Export your data by contacting support</li>
                <li>Opt out of push notifications and marketing emails</li>
                <li>Delete your account and all associated data</li>
              </ul>
              <h4>For EU/EEA Residents (GDPR)</h4>
              <p>
                You have the right to access, rectification, erasure, restriction of processing, data portability, and to object to processing. Our legal basis for processing is contract performance (providing the Service) and legitimate interest (improving the Service). Contact us to exercise these rights.
              </p>
              <h4>For California Residents (CCPA)</h4>
              <p>
                You have the right to know what personal information we collect, request deletion, and opt out of the sale of personal information. We do not sell personal information. To exercise your rights, contact us at the address below.
              </p>
            </Section>
          </RevealOnScroll>

          <RevealOnScroll delay={50}>
            <Section title="8. Data Retention">
              <p>
                We retain your personal data for as long as your account is active or as needed to provide the Service. If you delete your account, we will delete your personal data within 30 days, except where we are required to retain it for legal or compliance purposes.
              </p>
            </Section>
          </RevealOnScroll>

          <RevealOnScroll delay={50}>
            <Section title="9. Cookies & Local Storage">
              <p>
                We use essential cookies and local storage for authentication sessions and user preferences. We do not use third-party advertising cookies. Analytics cookies (if any) are anonymized and used solely to improve the Service.
              </p>
            </Section>
          </RevealOnScroll>

          <RevealOnScroll delay={50}>
            <Section title="10. International Transfers">
              <p>
                Your data may be transferred to and processed in the United States where our service providers are located. By using the Service, you consent to this transfer. We ensure appropriate safeguards are in place for international data transfers.
              </p>
            </Section>
          </RevealOnScroll>

          <RevealOnScroll delay={50}>
            <Section title="11. Changes to This Policy">
              <p>
                We may update this Privacy Policy from time to time. We will notify you of material changes by posting the updated policy on this page and updating the &quot;Last updated&quot; date. Your continued use of the Service after changes constitutes acceptance of the updated policy.
              </p>
            </Section>
          </RevealOnScroll>

          <RevealOnScroll delay={50}>
            <Section title="12. Contact Us">
              <p>If you have questions about this Privacy Policy, contact us at:</p>
              <ul>
                <li>
                  Email:{' '}
                  <a href="mailto:privacy@thedadcenter.com" className="text-copper hover:underline">
                    privacy@thedadcenter.com
                  </a>
                </li>
                <li>
                  Support:{' '}
                  <Link href="/help" className="text-copper hover:underline">
                    Help & Support
                  </Link>
                </li>
              </ul>
            </Section>
          </RevealOnScroll>
        </div>
      </div>
    </div>
  )
}

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section>
      <h3 className="font-display text-xl font-bold text-[--cream] mb-3">{title}</h3>
      <div className="font-body text-sm text-[--muted] leading-relaxed space-y-3 [&_h4]:font-ui [&_h4]:text-[--cream] [&_h4]:font-semibold [&_h4]:text-sm [&_h4]:mt-4 [&_h4]:mb-1 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_li]:text-[--muted] [&_strong]:text-[--cream] [&_a]:text-copper [&_a]:hover:underline">
        {children}
      </div>
    </section>
  )
}
