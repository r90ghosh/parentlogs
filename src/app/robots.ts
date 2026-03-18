import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/content', '/content/articles/*', '/budget-guide', '/baby-checklists', '/baby-checklists/*', '/upgrade', '/privacy', '/terms'],
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
        ],
      },
    ],
    sitemap: 'https://thedadcenter.com/sitemap.xml',
  }
}
