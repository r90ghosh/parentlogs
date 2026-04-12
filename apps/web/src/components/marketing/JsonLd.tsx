export function JsonLd() {
  const baseUrl = 'https://thedadcenter.com'

  const organization = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'The Dad Center',
    url: baseUrl,
    logo: `${baseUrl}/images/logo.png`,
    description:
      'The operating system for modern fatherhood. Week-by-week guidance, actionable tasks, budget planning, and partner sync for dads.',
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'info@thedadcenter.com',
      contactType: 'customer support',
    },
    sameAs: [
      'https://x.com/thedadcenter',
      'https://www.instagram.com/thedadcenter/',
      'https://www.linkedin.com/company/the-dad-center/',
      'https://www.reddit.com/r/thedadcenter/',
      'https://www.pinterest.com/thedadcenter/',
      'https://www.threads.com/@thedadcenter',
    ],
  }

  const website = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'The Dad Center',
    url: baseUrl,
    description:
      'The operating system for modern fatherhood. Week-by-week guidance, actionable tasks, and partner sync.',
  }

  const softwareApp = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'The Dad Center',
    operatingSystem: 'Web',
    applicationCategory: 'LifestyleApplication',
    description:
      'Pregnancy and parenting companion app for dads. Week-by-week briefings, task management, mood tracking, budget planning, and partner sync.',
    offers: [
      {
        '@type': 'Offer',
        name: 'Monthly',
        price: '4.99',
        priceCurrency: 'USD',
        priceValidUntil: '2027-12-31',
        availability: 'https://schema.org/InStock',
      },
      {
        '@type': 'Offer',
        name: 'Annual',
        price: '39.99',
        priceCurrency: 'USD',
        priceValidUntil: '2027-12-31',
        availability: 'https://schema.org/InStock',
      },
      {
        '@type': 'Offer',
        name: 'Lifetime',
        price: '99.99',
        priceCurrency: 'USD',
        priceValidUntil: '2027-12-31',
        availability: 'https://schema.org/InStock',
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApp) }}
      />
    </>
  )
}
