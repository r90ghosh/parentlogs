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
      email: 'support@thedadcenter.com',
      contactType: 'customer support',
    },
    sameAs: [
      'https://twitter.com/thedadcenter',
      'https://instagram.com/thedadcenter',
      'https://linkedin.com/company/thedadcenter',
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
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      ratingCount: '10000',
      bestRating: '5',
      worstRating: '1',
    },
  }

  const faqPage = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is The Dad Center?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The Dad Center is a pregnancy and parenting companion app designed primarily for dads. It provides week-by-week briefings, task management, mood tracking, budget planning, checklists, and a dad journey system with challenge tiles across 7 pillars.',
        },
      },
      {
        '@type': 'Question',
        name: 'How much does The Dad Center cost?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The Dad Center offers three pricing options: $4.99/month, $39.99/year (just $3.33/month), or a one-time lifetime purchase of $99.99. There is also a generous free tier to get started.',
        },
      },
      {
        '@type': 'Question',
        name: 'Is there a free plan?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes! The Dad Center offers a free tier that includes a 30-day rolling task window, 4 weeks of briefings from signup, and 30 days of push notifications. Free should feel complete — you get real value before ever paying.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can both parents use the same subscription?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Absolutely. One subscription covers the whole family — both partners share full access. No need to pay twice.',
        },
      },
      {
        '@type': 'Question',
        name: 'What do the weekly briefings include?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: "Weekly briefings cover what's happening with the baby's development, what your partner may be experiencing, practical tasks for the week, health and wellness tips, and preparation milestones — all tailored to your specific week of pregnancy or parenting stage.",
        },
      },
      {
        '@type': 'Question',
        name: 'When should I start using The Dad Center?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'You can start at any point during pregnancy or early parenthood. The earlier the better — many dads join in the first trimester to stay ahead of the curve. But the app adapts to wherever you are in your journey.',
        },
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPage) }}
      />
    </>
  )
}
