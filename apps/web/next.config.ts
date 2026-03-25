import { withSentryConfig } from '@sentry/nextjs'
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'img.youtube.com' },
    ],
  },
  async headers() {
    return [{
      source: '/(.*)',
      headers: [
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
        {
          key: 'Content-Security-Policy',
          value: [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' https://js.stripe.com https://*.sentry-cdn.com",
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
            "font-src 'self' https://fonts.gstatic.com",
            "img-src 'self' data: blob: https://*.supabase.co https://lh3.googleusercontent.com",
            "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.thedadcenter.com wss://api.thedadcenter.com https://api.stripe.com https://*.ingest.sentry.io",
            "frame-src https://js.stripe.com https://hooks.stripe.com",
          ].join('; ')
        },
      ],
    }]
  },
  async redirects() {
    return [
      {
        source: '/resources/:path*',
        destination: '/content/:path*',
        permanent: true,
      },
      // Old article slug redirects (renamed 2026-03-18)
      { source: '/content/articles/article-1', destination: '/content/articles/week-30-the-final-stretch-begins', permanent: true },
      { source: '/content/articles/article-2', destination: '/content/articles/week-34-the-lung-milestone', permanent: true },
      { source: '/content/articles/article-3', destination: '/content/articles/week-36-early-term-territory', permanent: true },
      { source: '/content/articles/article-4', destination: '/content/articles/week-38-any-day-now', permanent: true },
      { source: '/content/articles/article-5', destination: '/content/articles/week-40-due-date-and-beyond', permanent: true },
      { source: '/content/articles/article-6', destination: '/content/articles/the-delivery-room-dads-role', permanent: true },
      { source: '/content/articles/article-7', destination: '/content/articles/the-first-24-hours', permanent: true },
      { source: '/content/articles/article-8', destination: '/content/articles/coming-home-days-2-4', permanent: true },
      { source: '/content/articles/article-9', destination: '/content/articles/the-first-week-survival-guide', permanent: true },
      { source: '/content/articles/article-28', destination: '/content/articles/month-4-the-sleep-regression', permanent: true },
      { source: '/content/articles/article-29', destination: '/content/articles/month-5-the-mobility-begins', permanent: true },
      { source: '/content/articles/article-30', destination: '/content/articles/month-6-first-foods', permanent: true },
      { source: '/content/articles/article-31', destination: '/content/articles/month-6-the-six-month-checkup', permanent: true },
      { source: '/content/articles/article-32', destination: '/content/articles/month-7-8-the-crawling-revolution', permanent: true },
      { source: '/content/articles/article-33', destination: '/content/articles/month-9-understanding-separation-anxiety', permanent: true },
      { source: '/content/articles/article-34', destination: '/content/articles/month-10-the-cruiser', permanent: true },
      { source: '/content/articles/article-35', destination: '/content/articles/month-11-first-words', permanent: true },
      { source: '/content/articles/article-36', destination: '/content/articles/month-12-the-first-birthday', permanent: true },
    ]
  },
};

export default withSentryConfig(nextConfig);
