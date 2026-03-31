'use client'

import { useState, useEffect } from 'react'
import Script from 'next/script'

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID

export function GoogleTagManager() {
  const [hasConsent, setHasConsent] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent')
    if (consent === 'accepted') setHasConsent(true)

    // Listen for consent granted in the same tab
    const handler = () => {
      if (localStorage.getItem('cookie-consent') === 'accepted') {
        setHasConsent(true)
      }
    }
    window.addEventListener('cookie-consent-changed', handler)
    // Also listen for cross-tab changes
    window.addEventListener('storage', (e) => {
      if (e.key === 'cookie-consent' && e.newValue === 'accepted') {
        setHasConsent(true)
      }
    })
    return () => {
      window.removeEventListener('cookie-consent-changed', handler)
    }
  }, [])

  if (!hasConsent || !GTM_ID) return null

  return (
    <Script id="gtm" strategy="afterInteractive">
      {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`}
    </Script>
  )
}

export function GoogleTagManagerNoscript() {
  if (!GTM_ID) return null

  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
        height="0"
        width="0"
        style={{ display: 'none', visibility: 'hidden' }}
      />
    </noscript>
  )
}
