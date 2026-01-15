'use client'

import Link from 'next/link'
import { Twitter, Linkedin, Instagram, Mail } from 'lucide-react'
import { Logo } from '@/components/ui/logo'

const footerLinks = {
  product: [
    { label: 'Features', href: '/#features' },
    { label: 'Pricing', href: '/#pricing' },
    { label: 'Resources', href: '/resources' },
    { label: 'Dashboard', href: '/dashboard' },
  ],
  company: [
    { label: 'About', href: '/about' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact', href: '/contact' },
    { label: 'Careers', href: '/careers' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Cookie Policy', href: '/cookies' },
  ],
  support: [
    { label: 'Help Center', href: '/help' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Status', href: '/status' },
  ],
}

const socialLinks = [
  { icon: Twitter, href: 'https://twitter.com/parentlogs', label: 'Twitter' },
  { icon: Linkedin, href: 'https://linkedin.com/company/parentlogs', label: 'LinkedIn' },
  { icon: Instagram, href: 'https://instagram.com/parentlogs', label: 'Instagram' },
  { icon: Mail, href: 'mailto:hello@parentlogs.com', label: 'Email' },
]

export function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main footer content */}
        <div className="py-12 md:py-16 grid grid-cols-2 md:grid-cols-6 gap-8">
          {/* Brand column */}
          <div className="col-span-2">
            <div className="mb-4">
              <Logo size="md" variant="dark" />
            </div>
            <p className="text-slate-400 text-sm mb-6 max-w-xs">
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
                  className="p-2 rounded-lg bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Product links */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Product</h4>
            <ul className="space-y-3">
              {footerLinks.product.map((link, i) => (
                <li key={i}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company links */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link, i) => (
                <li key={i}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal links */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link, i) => (
                <li key={i}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support links */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Support</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link, i) => (
                <li key={i}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="py-6 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500" suppressHydrationWarning>
            © {new Date().getFullYear()} ParentLogs. All rights reserved.
          </p>
          <p className="text-sm text-slate-600">
            Made with ❤️ for dads everywhere
          </p>
        </div>
      </div>
    </footer>
  )
}
