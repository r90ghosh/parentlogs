'use client'

import { useEffect, useRef } from 'react'

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID

export function GoogleTagManager() {
  const injected = useRef(false)

  useEffect(() => {
    if (injected.current || !GTM_ID) return

    function injectGTM() {
      if (injected.current) return
      const consent = localStorage.getItem('cookie-consent')
      if (consent !== 'accepted') return

      injected.current = true

      // Initialize dataLayer
      window.dataLayer = window.dataLayer || []
      window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' })

      // Inject GTM script
      const script = document.createElement('script')
      script.async = true
      script.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`
      document.head.appendChild(script)

      if (process.env.NODE_ENV === 'development') {
        console.log('[GTM] Loaded:', GTM_ID)
      }
    }

    // Try immediately (consent may already be accepted)
    injectGTM()

    // Listen for consent granted in the same tab
    const consentHandler = () => injectGTM()
    window.addEventListener('cookie-consent-changed', consentHandler)

    // Listen for cross-tab consent changes
    const storageHandler = (e: StorageEvent) => {
      if (e.key === 'cookie-consent' && e.newValue === 'accepted') injectGTM()
    }
    window.addEventListener('storage', storageHandler)

    return () => {
      window.removeEventListener('cookie-consent-changed', consentHandler)
      window.removeEventListener('storage', storageHandler)
    }
  }, [])

  return null
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
