import { withSentryConfig } from '@sentry/nextjs'
import withBundleAnalyzer from '@next/bundle-analyzer'
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: process.env.NODE_ENV === 'production',
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'img.youtube.com' },
    ],
  },
  async headers() {
    return [
      {
        source: '/.well-known/apple-app-site-association',
        headers: [
          { key: 'Content-Type', value: 'application/json' },
        ],
      },
      {
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
              "script-src 'self' 'unsafe-inline' https://js.stripe.com https://*.sentry-cdn.com https://www.googletagmanager.com https://www.google-analytics.com https://ssl.google-analytics.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob: https://*.supabase.co https://lh3.googleusercontent.com https://www.googletagmanager.com https://www.google-analytics.com",
              "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.thedadcenter.com wss://api.thedadcenter.com https://api.stripe.com https://*.ingest.sentry.io https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com",
              "frame-src https://js.stripe.com https://hooks.stripe.com",
            ].join('; ')
          },
        ],
      },
    ]
  },
  async redirects() {
    return [
      // Content migration redirects — /content was replaced by /blog
      {
        source: '/content/articles/:slug',
        destination: '/blog/:slug',
        permanent: true,
      },
      {
        source: '/content',
        destination: '/blog',
        permanent: true,
      },
      // Old /resources/* tree also resolves to /blog/* (collapse the chain)
      {
        source: '/resources/articles/:slug',
        destination: '/blog/:slug',
        permanent: true,
      },
      {
        source: '/resources/:path*',
        destination: '/blog',
        permanent: true,
      },
      // Old article slug redirects (renamed 2026-03-18) — now pointing to /blog/
      { source: '/content/articles/article-1', destination: '/blog/week-30-the-final-stretch-begins', permanent: true },
      { source: '/content/articles/article-2', destination: '/blog/week-34-the-lung-milestone', permanent: true },
      { source: '/content/articles/article-3', destination: '/blog/week-36-early-term-territory', permanent: true },
      { source: '/content/articles/article-4', destination: '/blog/week-38-any-day-now', permanent: true },
      { source: '/content/articles/article-5', destination: '/blog/week-40-due-date-and-beyond', permanent: true },
      { source: '/content/articles/article-6', destination: '/blog/the-delivery-room-dads-role', permanent: true },
      { source: '/content/articles/article-7', destination: '/blog/the-first-24-hours', permanent: true },
      { source: '/content/articles/article-8', destination: '/blog/coming-home-days-2-4', permanent: true },
      { source: '/content/articles/article-9', destination: '/blog/the-first-week-survival-guide', permanent: true },
      { source: '/content/articles/article-28', destination: '/blog/month-4-the-sleep-regression', permanent: true },
      { source: '/content/articles/article-29', destination: '/blog/month-5-the-mobility-begins', permanent: true },
      { source: '/content/articles/article-30', destination: '/blog/month-6-first-foods', permanent: true },
      { source: '/content/articles/article-31', destination: '/blog/month-6-the-six-month-checkup', permanent: true },
      { source: '/content/articles/article-32', destination: '/blog/month-7-8-the-crawling-revolution', permanent: true },
      { source: '/content/articles/article-33', destination: '/blog/month-9-understanding-separation-anxiety', permanent: true },
      { source: '/content/articles/article-34', destination: '/blog/month-10-the-cruiser', permanent: true },
      { source: '/content/articles/article-35', destination: '/blog/month-11-first-words', permanent: true },
      { source: '/content/articles/article-36', destination: '/blog/month-12-the-first-birthday', permanent: true },
    ]
  },
};

const analyze = withBundleAnalyzer({ enabled: process.env.ANALYZE === 'true' })

export default process.env.NODE_ENV === 'production'
  ? withSentryConfig(analyze(nextConfig))
  : analyze(nextConfig);
