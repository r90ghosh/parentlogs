import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/videos', '/blog', '/blog/*', '/budget-guide', '/baby-checklists', '/baby-checklists/*', '/tips', '/upgrade', '/privacy', '/terms'],
        disallow: [
          '/dashboard',
          '/tasks',
          '/briefing',
          '/tracker',
          '/settings',
          '/onboarding',
          '/api',
          '/login',
          '/signup',
          '/help',
        ],
      },
    ],
    sitemap: 'https://thedadcenter.com/sitemap.xml',
  }
}
