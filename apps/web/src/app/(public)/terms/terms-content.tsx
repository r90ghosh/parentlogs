import Link from 'next/link'
import { ArrowLeft, FileText } from 'lucide-react'
import { WarmBackground } from '@/components/ui/animations/WarmBackground'
import { Reveal } from '@/components/ui/animations/Reveal'

const lastUpdated = 'March 4, 2026'

export function TermsContent() {
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
            <FileText className="h-5 w-5 text-copper" />
            <span className="font-display font-bold text-[--cream]">Terms of Service</span>
          </div>
          <div className="w-16" />
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-12">
        <Reveal delay={0}>
          <div className="mb-10">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-[--cream] mb-3">
              Terms of Service
            </h1>
            <p className="font-body text-[--muted]">Last updated: {lastUpdated}</p>
          </div>
        </Reveal>

        <div className="prose-custom space-y-8">
          <Reveal delay={50}>
            <Section title="1. Acceptance of Terms">
              <p>
                By accessing or using The Dad Center (&quot;Service&quot;), operated by The Dad Center (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;), you agree to be bound by these Terms of Service (&quot;Terms&quot;). If you do not agree to these Terms, do not use the Service.
              </p>
              <p>
                We reserve the right to modify these Terms at any time. We will notify you of material changes by posting updated Terms on this page. Your continued use of the Service after changes constitutes acceptance.
              </p>
            </Section>
          </Reveal>

          <Reveal delay={50}>
            <Section title="2. Service Description">
              <p>
                The Dad Center is a pregnancy and parenting companion application that provides week-by-week briefings, task management, mood tracking, budget planning, checklists, and a dad journey challenge system. The Service is designed primarily for fathers but is available to all parents and expecting parents.
              </p>
            </Section>
          </Reveal>

          <Reveal delay={50}>
            <Section title="3. Accounts">
              <p>
                You must create an account to use the Service. You are responsible for maintaining the confidentiality of your credentials and for all activity under your account. You must provide accurate and complete information and keep it up to date. You must be at least 18 years old to create an account.
              </p>
              <p>
                We reserve the right to suspend or terminate accounts that violate these Terms or that are inactive for an extended period.
              </p>
            </Section>
          </Reveal>

          <Reveal delay={50}>
            <Section title="4. Billing & Subscriptions">
              <p>The Service offers free and premium tiers:</p>
              <ul>
                <li><strong>Monthly:</strong> $4.99/month, billed monthly</li>
                <li><strong>Yearly:</strong> $39.99/year ($3.33/month), billed annually</li>
                <li><strong>Lifetime:</strong> $99.99, one-time payment</li>
              </ul>
              <h4>Family Sharing</h4>
              <p>
                One subscription covers your entire family. Both you and your partner share access to all premium features under a single subscription. Only one subscription per family is required.
              </p>
              <h4>Billing</h4>
              <p>
                Subscriptions are billed in advance on a recurring basis (monthly or yearly). Payment is processed through Stripe (web) or RevenueCat/App Store/Google Play (mobile). You authorize us to charge your chosen payment method.
              </p>
              <h4>Cancellation & Refunds</h4>
              <p>
                You may cancel your subscription at any time from Settings. Upon cancellation, you retain access until the end of your current billing period. We offer a 30-day money-back guarantee on all plans. Lifetime purchases are non-refundable after 30 days.
              </p>
            </Section>
          </Reveal>

          <Reveal delay={50}>
            <Section title="5. Free Tier">
              <p>Free accounts include:</p>
              <ul>
                <li>A 30-day rolling window of tasks</li>
                <li>4 weeks of briefings from signup</li>
                <li>30 days of push notifications from signup</li>
                <li>Access to mood check-in and dad journey challenges</li>
                <li>Basic dashboard features</li>
              </ul>
              <p>
                Free tier limitations are subject to change. We will provide reasonable notice before reducing free tier features.
              </p>
            </Section>
          </Reveal>

          <Reveal delay={50}>
            <Section title="6. Acceptable Use">
              <p>You agree not to:</p>
              <ul>
                <li>Use the Service for any unlawful purpose</li>
                <li>Attempt to gain unauthorized access to any part of the Service</li>
                <li>Interfere with or disrupt the Service or its infrastructure</li>
                <li>Upload malicious code, spam, or harmful content</li>
                <li>Impersonate another person or entity</li>
                <li>Scrape, data-mine, or reverse-engineer any part of the Service</li>
                <li>Share your account credentials with anyone outside your family</li>
                <li>Use the Service in a way that could harm minors</li>
              </ul>
            </Section>
          </Reveal>

          <Reveal delay={50}>
            <Section title="7. Intellectual Property">
              <p>
                All content, design, code, logos, and trademarks of The Dad Center are owned by us or our licensors. The Service is protected by copyright, trademark, and other intellectual property laws. You may not reproduce, distribute, or create derivative works without our prior written consent.
              </p>
              <p>
                &quot;The Dad Center&quot; name, logo, and tagline &quot;The operating system for modern fatherhood&quot; are trademarks of The Dad Center.
              </p>
            </Section>
          </Reveal>

          <Reveal delay={50}>
            <Section title="8. User Content">
              <p>
                You retain ownership of content you submit (mood entries, notes, custom tasks). By submitting content, you grant us a limited license to store, display, and process it as necessary to provide the Service. We will not share your personal content with third parties except as described in our{' '}
                <Link href="/privacy" className="text-copper hover:underline">
                  Privacy Policy
                </Link>.
              </p>
            </Section>
          </Reveal>

          <Reveal delay={50}>
            <Section title="9. Medical Disclaimer">
              <div className="p-4 bg-coral/10 border border-coral/25 rounded-lg">
                <p className="text-coral font-semibold mb-2">Important Notice</p>
                <p>
                  The Dad Center is an informational and organizational tool, not a medical service. The content provided — including briefings, checklists, and parenting guidance — is for general informational purposes only and does not constitute medical advice, diagnosis, or treatment.
                </p>
                <p className="mt-2">
                  Always consult a qualified healthcare provider with questions about pregnancy, childbirth, infant care, or your health. Never disregard professional medical advice or delay seeking it because of information from the Service. In case of a medical emergency, call your local emergency services immediately.
                </p>
              </div>
            </Section>
          </Reveal>

          <Reveal delay={50}>
            <Section title="10. Limitation of Liability">
              <p>
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, THE DAD CENTER AND ITS OFFICERS, DIRECTORS, EMPLOYEES, AND AGENTS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS, DATA, OR GOODWILL, ARISING FROM OR RELATED TO YOUR USE OF THE SERVICE.
              </p>
              <p>
                OUR TOTAL LIABILITY FOR ANY CLAIMS ARISING FROM THESE TERMS OR THE SERVICE SHALL NOT EXCEED THE AMOUNT YOU PAID US IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM.
              </p>
              <p>
                THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
              </p>
            </Section>
          </Reveal>

          <Reveal delay={50}>
            <Section title="11. Governing Law">
              <p>
                These Terms shall be governed by and construed in accordance with the laws of the United States and the State of Delaware, without regard to conflict of law principles. Any disputes arising from these Terms shall be resolved in the courts of Delaware.
              </p>
            </Section>
          </Reveal>

          <Reveal delay={50}>
            <Section title="12. Termination">
              <p>
                We may suspend or terminate your access to the Service at any time for violation of these Terms, with or without notice. Upon termination, your right to use the Service ceases immediately. Provisions that by their nature should survive termination (including limitation of liability, intellectual property, and governing law) shall survive.
              </p>
              <p>
                You may terminate your account at any time through Settings → Profile → Delete Account.
              </p>
            </Section>
          </Reveal>

          <Reveal delay={50}>
            <Section title="13. Severability">
              <p>
                If any provision of these Terms is found to be unenforceable or invalid, that provision shall be limited or eliminated to the minimum extent necessary so that the remaining Terms remain in full force and effect.
              </p>
            </Section>
          </Reveal>

          <Reveal delay={50}>
            <Section title="14. Contact Us">
              <p>If you have questions about these Terms, contact us at:</p>
              <ul>
                <li>
                  Email:{' '}
                  <a href="mailto:legal@thedadcenter.com" className="text-copper hover:underline">
                    legal@thedadcenter.com
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
          </Reveal>
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
