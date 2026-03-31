# Plan: Set Up GA4 + GTM Analytics for The Dad Center

## Context
The app has zero third-party analytics. There's a custom analytics system (events → Supabase) but no way to see funnels, demographics, traffic sources, or optimize ads. GA4 (Google Analytics 4) tracks user behavior. GTM (Google Tag Manager) is a container that loads GA4 and any future tracking tools (Meta Pixel, Google Ads, etc.) without needing code deploys.

## What You'll Get
- **GA4 dashboard**: Real-time visitors, page views, user demographics, acquisition channels, conversion funnels
- **GTM flexibility**: Add Meta Pixel, Google Ads tag, Hotjar, etc. from a web dashboard — no code changes
- **Cookie consent gated**: Only fires after user accepts cookies (already have consent banner)
- **Custom events**: Signup, checkout, purchase forwarded to GA4 for conversion tracking

---

## Part 1: Create Accounts (you do this manually — 10 min)

### Step 1: Create Google Tag Manager account
1. Go to https://tagmanager.google.com
2. Click "Create Account"
3. Account name: `The Dad Center`
4. Country: United States
5. Container name: `thedadcenter.com`
6. Target platform: **Web**
7. Click "Create" → Accept terms
8. You'll get a **GTM Container ID** like `GTM-XXXXXXX` — save this

### Step 2: Create Google Analytics 4 property
1. Go to https://analytics.google.com
2. Click "Admin" (gear icon) → "Create Property"
3. Property name: `The Dad Center`
4. Reporting timezone: Your timezone
5. Currency: USD
6. Click "Next" → Business info → "Create"
7. Choose "Web" as platform
8. Website URL: `https://thedadcenter.com`
9. Stream name: `The Dad Center Web`
10. Click "Create stream"
11. You'll get a **Measurement ID** like `G-XXXXXXXXXX` — save this

### Step 3: Connect GA4 to GTM
1. In Google Tag Manager → your container → "Tags" → "New"
2. Tag type: **Google Analytics: GA4 Configuration**
3. Measurement ID: paste your `G-XXXXXXXXXX`
4. Trigger: **All Pages**
5. Name the tag: `GA4 - Configuration`
6. Click "Save"
7. Click "Submit" (top right) → "Publish"

That's it for account setup. Give me the two IDs and I'll wire them into the app.

---

## Part 2: Code Implementation (Claude does this)

### Step 1: Add environment variables
**File:** `apps/web/.env.local`
```
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
```
Only the GTM ID is needed in code — GA4 is configured inside GTM.

### Step 2: Create GTM script component
**New file:** `apps/web/src/components/shared/gtm.tsx`

A client component that:
- Checks cookie consent from localStorage
- Only injects the GTM script if consent is `'accepted'`
- Pushes a `gtm.js` event to the `dataLayer`
- Handles the `<noscript>` iframe fallback

```tsx
'use client'

import { useState, useEffect } from 'react'
import Script from 'next/script'

export function GoogleTagManager({ gtmId }: { gtmId: string }) {
  const [hasConsent, setHasConsent] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent')
    if (consent === 'accepted') setHasConsent(true)

    // Listen for consent changes (from cookie banner)
    const handler = (e: StorageEvent) => {
      if (e.key === 'cookie-consent' && e.newValue === 'accepted') {
        setHasConsent(true)
      }
    }
    window.addEventListener('storage', handler)
    return () => window.removeEventListener('storage', handler)
  }, [])

  if (!hasConsent || !gtmId) return null

  return (
    <Script id="gtm" strategy="afterInteractive">
      {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','${gtmId}');`}
    </Script>
  )
}

export function GoogleTagManagerNoscript({ gtmId }: { gtmId: string }) {
  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
        height="0"
        width="0"
        style={{ display: 'none', visibility: 'hidden' }}
      />
    </noscript>
  )
}
```

### Step 3: Add GTM to root layout
**File:** `apps/web/src/app/layout.tsx`
- Import `GoogleTagManager` and `GoogleTagManagerNoscript`
- Add `<GoogleTagManager>` inside `<Providers>` (so it's a client component)
- Add `<GoogleTagManagerNoscript>` right after `<body>` tag

### Step 4: Update cookie consent to trigger GTM
**File:** `apps/web/src/components/shared/cookie-consent.tsx`
- When user clicks "Accept", dispatch a `storage` event so the GTM component picks it up immediately (not just cross-tab)
- Or: call `window.dispatchEvent(new Event('cookie-consent-changed'))` and listen for it in GTM component

### Step 5: Update CSP headers
**File:** `apps/web/next.config.ts`
- Add to `script-src`: `https://www.googletagmanager.com https://www.google-analytics.com https://ssl.google-analytics.com`
- Add to `connect-src`: `https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com`
- Add to `img-src`: `https://www.googletagmanager.com https://www.google-analytics.com`

### Step 6: Forward key events to GTM dataLayer
**File:** `apps/web/src/lib/analytics.ts`
- Add a `pushToDataLayer` helper that pushes events to `window.dataLayer`
- In `trackEvent()`, after the existing Supabase tracking, also push to dataLayer:
  - `sign_up` → GTM event for conversion tracking
  - `begin_checkout` → GTM event
  - `purchase` → GTM event with value
  - `upgrade_viewed` → GTM event
- This way GA4 sees the same events your custom analytics tracks

```ts
function pushToDataLayer(event: string, params?: Record<string, unknown>) {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({ event, ...params })
  }
}
```

### Step 7: Add UTM parameter capture
**File:** `apps/web/src/lib/analytics.ts` (or new utility)
- On page load, capture UTM params from URL (`utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`)
- Store in sessionStorage so they persist through signup flow
- Push to dataLayer so GA4 has attribution context
- Optionally store on the profiles table when user signs up (for backend attribution)

---

## Part 3: What You Can Do in GTM Later (no code needed)

Once GTM is live, you can add these from the GTM dashboard:
- **Meta Pixel**: For Facebook/Instagram ad tracking
- **Google Ads conversion tag**: For Google Ads optimization
- **Hotjar**: For heatmaps and session recordings
- **Custom HTML tags**: Any third-party script
- **Enhanced ecommerce**: Track the full purchase funnel

---

## Files to modify/create

| Action | File |
|--------|------|
| Create | `apps/web/src/components/shared/gtm.tsx` |
| Edit | `apps/web/src/app/layout.tsx` — add GTM components |
| Edit | `apps/web/src/components/shared/cookie-consent.tsx` — trigger GTM on accept |
| Edit | `apps/web/next.config.ts` — update CSP headers |
| Edit | `apps/web/src/lib/analytics.ts` — add dataLayer push for key events |
| Edit | `apps/web/.env.local` — add NEXT_PUBLIC_GTM_ID |

## Verification
1. Set `NEXT_PUBLIC_GTM_ID` in `.env.local`
2. Run dev server, accept cookie consent
3. Open browser DevTools → Console → type `window.dataLayer` — should show GTM events
4. Open GA4 Realtime report → should see your visit
5. Decline cookies → `window.dataLayer` should be empty (no tracking)
6. Check Network tab → no requests to google-analytics.com before consent
