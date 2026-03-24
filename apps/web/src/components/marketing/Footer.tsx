import Link from 'next/link'
import { Twitter, Linkedin, Instagram, Mail } from 'lucide-react'
import { Logo } from '@/components/ui/logo'

const footerLinks = {
  product: [
    { label: 'Features', href: '/#features' },
    { label: 'Pricing', href: '/#pricing' },
    { label: 'Content', href: '/content' },
    { label: 'Budget Guide', href: '/budget-guide' },
    { label: 'Checklists', href: '/baby-checklists' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
  ],
  company: [
    { label: 'About', href: '/about' },
    { label: 'FAQ', href: '/faq' },
  ],
  support: [
    { label: 'Contact', href: 'mailto:hello@thedadcenter.com' },
  ],
}

const socialLinks = [
  { icon: Twitter, href: 'https://x.com/thedadcenter', label: 'X' },
  { icon: Instagram, href: 'https://www.instagram.com/thedadcenter/', label: 'Instagram' },
  { icon: Linkedin, href: 'https://www.linkedin.com/company/the-dad-center/', label: 'LinkedIn' },
  { icon: Mail, href: 'mailto:hello@thedadcenter.com', label: 'Email' },
]

export function Footer() {
  return (
    <footer className="bg-[--surface]" style={{ borderTop: '1px solid rgba(196,112,63,0.5)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main footer content */}
        <div className="py-12 md:py-16 grid grid-cols-2 md:grid-cols-6 gap-8">
          {/* Brand column */}
          <div className="col-span-2">
            <div className="mb-4">
              <Logo size="md" variant="dark" />
            </div>
            <p className="font-body text-[--muted] text-sm mb-6 max-w-xs">
              The operating system for modern fatherhood. Built by dads, for dads who refuse to wing it.
            </p>
            {/* Social links */}
            <div className="flex items-center gap-4">
              {socialLinks.map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-[--card] text-[--muted] hover:text-copper hover:bg-[--card-hover] transition-colors border border-[--border]"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Product links */}
          <div>
            <h4 className="font-ui text-sm font-semibold text-[--cream] mb-4">Product</h4>
            <ul className="space-y-3">
              {footerLinks.product.map((link, i) => (
                <li key={i}>
                  <Link
                    href={link.href}
                    className="font-ui text-sm text-[--muted] hover:text-copper transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company links */}
          <div>
            <h4 className="font-ui text-sm font-semibold text-[--cream] mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link, i) => (
                <li key={i}>
                  <Link
                    href={link.href}
                    className="font-ui text-sm text-[--muted] hover:text-copper transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal links */}
          <div>
            <h4 className="font-ui text-sm font-semibold text-[--cream] mb-4">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link, i) => (
                <li key={i}>
                  <Link
                    href={link.href}
                    className="font-ui text-sm text-[--muted] hover:text-copper transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-ui text-sm font-semibold text-[--cream] mb-4">Support</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:hello@thedadcenter.com"
                  className="font-ui text-sm text-[--muted] hover:text-copper transition-colors"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Medical disclaimer */}
        <p className="font-ui text-xs text-[--dim] max-w-2xl mx-auto text-center mt-4">
          The Dad Center provides general pregnancy and parenting information for educational purposes only. It is not a substitute for professional medical advice, diagnosis, or treatment. Always consult your healthcare provider with questions about medical conditions.
        </p>

        {/* Bottom bar */}
        <div className="py-6 border-t border-[--border] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-ui text-sm text-[--muted]" suppressHydrationWarning>
            &copy; {new Date().getFullYear()} The Dad Center. All rights reserved.
          </p>
          <p className="font-ui text-sm text-[--dim]">
            Made with love for dads everywhere
          </p>
        </div>
      </div>
    </footer>
  )
}
