# UX / Performance / Accessibility / Mobile-Web Review — The Dad Center

Reviewed root: `/Users/ashirbadghosh/Projects/parentlogs/apps/web`. Stack: Next.js 16.2 + React 19.2 + Tailwind 3 + Framer Motion 12 + Radix.

---

## Critical (must fix)

### 1. Bottom-nav touch targets are 9px-text and only ~36px tall
`src/components/layouts/main-layout-client.tsx:227-260`. `--nav-h: 64px` minus `pt-2 pb-1` minus `paddingBottom: env(safe-area-inset-bottom)` leaves the actual tappable label `text-[9px]`. WCAG 2.5.5 wants 24×24px (AA) / 44×44px (AAA), and 9px label text is well under any legibility floor. The icon/label cluster pushes total visible touch ~36px on iPhone 13 with notch. **Fix:** raise label to `text-[10px]` minimum (you have it at 10px elsewhere), bump `--nav-h` to 72px, and add `aria-label` matching label text on each `<Link>` (the icon is the only programmatic name today).

### 2. Radix Sheet (More menu) missing `SheetTitle` — accessibility violation + dev warning
`src/components/layouts/main-layout-client.tsx:262`. `<SheetContent>` is wrapped around a Radix dialog, which **requires** an accessible name. Screen readers announce nothing on open and React logs a warning at runtime. `task-detail-sheet.tsx`, `tasks-calendar-view.tsx`, `feedback-widget.tsx` all include `SheetTitle` — this one was missed. **Fix:** add `<SheetTitle className="sr-only">More menu</SheetTitle>` immediately inside `<SheetContent>`.

### 3. Raw `<img>` for YouTube thumbnails (no `next/image` anywhere in the codebase)
`src/components/marketing/VideoCard.tsx:38`. `next.config.ts` already whitelists `img.youtube.com` but no component uses `next/image`. The video grid loads N raw `<img>` from a 3rd-party domain with no lazy loading attribute, no `width/height` (CLS), no `loading="lazy"`. Avatar images in `main-layout-client.tsx:179` and various marketing surfaces are similarly raw. **Fix:** convert `VideoCard.tsx` and `AvatarImage` usages to `next/image` with explicit `width`/`height`, add `sizes` for responsive sources.

### 4. `Providers` is a client component wrapping the entire tree — every route becomes a client subtree
`src/app/layout.tsx:122` mounts `<Providers>` (with `'use client'` at `src/components/providers.tsx:1`), which means even pure-content marketing pages drag in QueryClient, ThemeProvider, AuthProvider, PartnerActivityProvider, SW registration, and GTM init on the first paint. The `<Providers>` itself imports four hooks, and `Providers` does an `initAnalytics` indirection. **Fix:** split into a thin `ClientProviders` that only wraps interactive subtrees from `(main)`/`(auth)` layouts, keeping `(marketing)` purely server-rendered. AnalyticsInitializer/SWRegistration/PartnerActivityProvider don't need to live above marketing pages.

### 5. Hydration foot-gun: `DashboardHeader` reads `new Date()` and `getHours()` only after mount
`src/components/dashboard/DashboardHeader.tsx:26-31`. The greeting starts as "Hello, …" then becomes "Good morning, …" after mount. With React 19 + streaming this works because the `h1` only changes content (not DOM structure), but the `format(today, …)` line is rendered with `suppressHydrationWarning` which papers over a real mismatch. The `mounted` flag plus the typewriter blanks the greeting on first render — visible flash on slow devices. **Fix:** pass `serverNow` from a server component into the client header so the greeting can render correctly during SSR.

---

## High

### 6. Sidebar loses bottom padding on mobile when bottom nav covers content
`src/components/layouts/main-layout-client.tsx:221` uses `pb-24 md:pb-4`. With safe-area-inset-bottom on notched devices, `pb-24` (96px) is fine for the 64px nav + safe area, but `dashboard/page.tsx:10` *also* applies `pb-24 md:pb-8`, doubling the bottom space. Other pages (`tasks/page.tsx`) don't add their own. **Fix:** remove the per-page `pb-24` and let `<main>` own bottom-nav clearance, using `calc(var(--nav-h) + env(safe-area-inset-bottom) + 24px)`.

### 7. Color contrast — `--muted` (#7a6f62) on `--card` (#201c18) in dark mode
Throughout dashboard cards (e.g. `BriefingTeaserCard.tsx:52`, `TasksDueCard.tsx:54`, every card "subtitle"). #7a6f62 on #201c18 = ~3.7:1 — **fails WCAG AA for body text (4.5:1)**. The same problem appears on the marketing site for `text-[--dim]` (#4a4239 → ~1.8:1) used in `Hero.tsx:173`, `VideoCard.tsx:83-89`, footer copyright, and several CTA helpers — those fail even AA Large Text. **Fix:** lighten `--muted` to ≥ #948775 (4.6:1) and reserve `--dim` for non-text decoration only.

### 8. `text-[9px]` and `text-[10px]` are below WCAG-effective minimums
`main-layout-client.tsx:249, 259, 273, 281, 289` and many other files. 9px on a 17px root is unreadable for low-vision users and below WCAG 1.4.4 expectations once you take browser zoom into account (cannot enlarge to 200% without overflow). **Fix:** floor at 11px (`text-[11px]` or move to `text-xs`) and rely on tracking/uppercase for visual hierarchy instead of pixel size.

### 9. Forms have no top-of-form error summary or `aria-live`
`src/app/(auth)/login/page.tsx`, `signup/page.tsx`, password-reset, etc. all show inline field errors via `<p className="text-sm text-coral">…</p>` but never announce them. The `Alert` for the API error is inserted into the DOM after submit but lacks `role="alert"`/`aria-live`. Screen readers won't hear validation failures. **Fix:** wrap the API error block in `<div role="alert" aria-live="polite">`, and on submit failure focus the first invalid field via `setFocus()` from RHF.

### 10. Sonner toaster has no `aria-live` configured
`src/components/ui/sonner.tsx`. Sonner exposes `richColors`, `closeButton`, but you also want to set `toastOptions={{ classNames: { … }, ariaProps: { role: 'status', 'aria-live': 'polite' } }}` or rely on the built-in but explicitly set. Currently a successful save via `toast.success(...)` from `MoodCheckinCard.tsx:68` is silent for AT.

### 11. `Providers` calls `initAnalytics()` inside `useEffect` based on localStorage
`src/components/providers.tsx:14-32`. The `AnalyticsInitializer` is fine, but `ServiceWorkerRegistration` runs on **every** route inside `(main)` because Providers is the root client wrapper — fine, but the periodic `setInterval(... 1h)` keeps a timer pointer per tab even on marketing pages where SW isn't useful. **Fix:** scope SW registration to authenticated layout only.

### 12. `Card3DTilt` mutates DOM on every pointermove without `willChange`
`src/hooks/use-3d-tilt.ts:26-29` writes `el.style.transform` on raw pointer events with no rAF throttling. With ~16 nested `Card3DTilt` cards on the dashboard (one per `Reveal`) and each one re-running a `getBoundingClientRect()` per move, hover sweeps cause layout reads. The Card3DTilt component bails on coarse pointers (good), but desktop perf can spike. **Fix:** wrap the style write in `requestAnimationFrame`, set `will-change: transform` on `tilt-active`, and add `pointer-events: none` to the gloss div (already done).

### 13. Dashboard ships 11+ Framer Motion components per render
`DashboardClient.tsx` renders `Reveal` + `Card3DTilt` for **every** card in both columns and the `DadChallengeTiles` adds `motion.div` per tile. Combined with `FloatingParticles`, `WarmBackground`, `TypewriterGreeting` interval, `CopperDivider` traveling glow, and `MoodCheckinCard` AnimatePresence — first paint of `/dashboard` sustains heavy main-thread work for ~1.5s on a mid-tier Android. **Fix:** drop `Card3DTilt` from already-Reveal'd content (it's noise on most cards), gate `FloatingParticles` to only marketing pages, and use `Reveal variant="fade"` instead of "card" inside `(main)` to avoid the 8deg rotateX.

---

## Medium

### 14. No skip-to-content link
Grep returned zero results. Keyboard users can't bypass the marketing nav or the main app header → sidebar block. **Fix:** add `<a href="#main" className="sr-only focus:not-sr-only …">Skip to main content</a>` as the first child of `<body>` and an `id="main"` on `<main>`.

### 15. CSS `prefers-reduced-motion` media query is too aggressive
`globals.css:516-525` sets ALL animations to `0.01ms` and iteration to `1`, but the `Reveal` component has its own JS guard that sets `setIsVisible(true)` immediately. The CSS rule means even functional CSS transitions (focus-visible ring transitions, button hover) have `0.01ms` duration, which leads to flashing focus rings. **Fix:** scope the global rule to `animation` (already correct) but exclude `transition-colors` patterns by listing animation-only classes; or move the override to a `.motion-safe:` Tailwind utility approach.

### 16. `WelcomeOverlay` runs canvas particle systems with no cleanup if rapidly remounted
`src/components/welcome/WelcomeOverlay.tsx:95-99` adds a resize listener inside the canvas effect; the file shows timer/raf refs but I'd verify the resize listener is removed on unmount. (Couldn't see the cleanup in the truncated read — if missing, a memory leak per dashboard visit.) **Action:** verify the resize listener is removed in cleanup.

### 17. `mainNavItems`, `moreToolItems` etc. are module-level constants but include `Lucide` icon components
`main-layout-client.tsx:45-68`. Tree-shaken at the icon level so the cost is small, but `BabySwitcher` is statically imported and rendered on every desktop sidebar render even for users with one baby. **Fix:** dynamic import `BabySwitcher` and only render when `babies.length > 1`.

### 18. `useDashboardData` is fetched 3 times on dashboard
`DashboardClient.tsx:67`, `BriefingTeaserCard.tsx:15`, `TasksDueCard.tsx:15`, `UpgradePromptCard.tsx:27` all call `useDashboardData(profile.family_id, currentWeek)`. React Query dedupes by key, so it's actually one network call — good — but each subscribing component re-renders on any cache update. Verify the query key includes `activeBaby?.id` consistently across all four call sites (DashboardClient passes it, the cards don't), otherwise you have **two cache entries** flickering on baby-switch. (Cross-references core-features review H3.)

### 19. `pb-24` paired with `min-h-screen` in `dashboard/page.tsx` causes phantom scroll on iOS
`min-h-screen` resolves to `100vh` which on iOS Safari includes the URL bar. Combined with `pb-24` and the bottom-fixed nav, footer content can be 60-100px below the visible area on first paint. `globals.css:564` has `min-h-[100dvh]` for body — apply the same dvh trick to page wrappers. **Fix:** use `min-h-[100dvh]` instead of `min-h-screen` everywhere.

### 20. `DadChallengeTile` collapsing animation animates `height: 'auto'` — known Framer Motion jank
`src/components/dashboard/dad-journey/DadChallengeTile.tsx:96-101`. Animating to `height: 'auto'` forces a layout pass each frame. With nested `ReactMarkdown` rendering, the first expand on mobile drops frames. **Fix:** use Framer Motion's `<motion.div layout>` with `AnimatePresence initial={false}` (already there) plus `style={{ overflow: 'hidden' }}` and let CSS grid `grid-template-rows: 0fr → 1fr` do the work.

### 21. Heading hierarchy: dashboard has two `h1`s
`MainLayoutClient` doesn't render an h1 (good) but `DashboardHeader.tsx:42` is an `<h1>` and so is the `marketing/Hero.tsx:72`. Inside the welcome overlay there's another `h1` (likely). On a single page rendering, only one `h1` is allowed. Audit pages where `WelcomeOverlay` mounts on top of `DashboardHeader`. **Fix:** make overlay heading an `h2` or remove the overlay h1.

### 22. Marketing dropdown has hover-only open with no escape close
`src/components/marketing/Header.tsx:123-155`. The Resources dropdown opens on `mouseenter` and closes on `mouseleave`. On click it toggles, but there's no `Escape` handler and no focus trap for keyboard users. `aria-expanded` is set but `aria-controls` is missing, and the dropdown `<Link>` items aren't grouped in a `role="menu"`. **Fix:** swap to Radix `<DropdownMenu>` (already in deps) so you get keyboard nav, focus trap, and ARIA for free.

---

## Low / Nits

- `globals.css:206`: `font-size: 17px` on `body` and again on `html:447`. The `html` rule already cascades; the body rule is redundant.
- `Input.tsx:11`: `md:text-sm` shrinks input text to 14px on desktop. Fine for non-iOS but inconsistent with the 17px design target. Consider 15px.
- `main-layout-client.tsx:165`: `aria-label` for the bell button is good but the unread badge is rendered as a sibling `<span>`, not announced as part of the link. The aria-label correctly includes the count, so this is actually fine — keep doing this.
- `Hero.tsx:251`: section uses `min-h-screen` (100vh) → use `min-h-[100svh]` to avoid iOS bar jump.
- `Sheet.tsx:75`: focus ring is `focus:outline-hidden` (not a real Tailwind class — should be `outline-none`).
- `DadChallengeTiles.tsx:97`: stagger via `Reveal delay={index * 80}` creates a 560ms delay before the 7th tile becomes visible — feels slow on a high-intent page. Cap at 4 staggered, then 0.
- `globals.css:451`: `body { overscroll-behavior-y: contain }` is fine but blocks pull-to-refresh on the marketing site, where users may want it.
- `WelcomeOverlay.tsx:75`: 10s auto-dismiss is long; users can't actually use the dashboard for 10s. Consider 4-5s or click-to-dismiss only.
- `tasks-client.tsx:36`: loading state is plain text "Loading..." — use a `Skeleton` consistent with the rest of the app.
- `globals.css:411-419`: enforces `min-height: 44px; min-width: 44px` on **every** `a` (and exception for inline links is good), but Radix `DropdownMenuItem` rendered as `<a>` inherits 44px even when designed as a 36px row. Verify dropdowns aren't visually broken.

---

## Verified solid

- `next.config.ts` security headers are textbook (CSP, HSTS, X-Frame-Options).
- `next/font` usage in `layout.tsx` is correct: subset, weights, and CSS variable defined; FOIT/FOUT mitigated.
- Reduced-motion handling is **consistently** implemented across `Reveal`, `MagneticButton`, `TypewriterGreeting`, `CopperDivider`, `Card3DTilt`, `FloatingParticles`, `WelcomeOverlay`, plus a global CSS rule. This is rare and excellent.
- `(main)` layout fetches auth server-side via `getServerAuth()` before any client code — no flash of unauthenticated state.
- Loading + error boundaries exist per route group (`(auth)`, `(main)`, `(marketing)`, `(public)`); error.tsx files report to Sentry.
- Dashboard cards use `dynamic()` with skeleton loaders for below-the-fold cards — good code-splitting hygiene.
- Tailwind `safe-area-*` utilities defined and used by the bottom nav (`paddingBottom: calc(8px + env(safe-area-inset-bottom))`).
- Inputs are `font-size: 16px` on mobile (`globals.css:460`) — iOS auto-zoom prevented.
- React Query `staleTime: 60s` + `refetchOnWindowFocus: false` is sane.
- Service worker registration is gated to `production` only.
- Mobile blur perf hack in `globals.css:567-580` proactively reduces backdrop-blur on `<768px` — smart.
- Stale-chunk recovery script in `layout.tsx:91-118` is a thoughtful production touch.
- `globals.css:557-565` uses `-webkit-fill-available` fallback for iOS viewport units.

---

## Scores

- **Mobile-web score: 6/10** — safe-area handled, 16px inputs, iOS viewport mitigated, but tiny touch labels (9-10px), `pb-24`/safe-area double-counting, and the missing dialog title hurt.
- **Accessibility score: 5/10** — solid keyboard support in shadcn primitives and good `aria-label`s on icon buttons, but missing skip link, missing dialog title, contrast failures on `--muted` and `--dim`, no form error summary, no `aria-live` on toasts, two h1s.
- **Performance score: 7/10** — `next/font`, code-splitting, dynamic imports, mobile blur reductions, and React Query are dialed in. Held back by the all-routes client `Providers` wrap, no `next/image`, dashboard animation density, and unthrottled pointermove handlers.

---

## Top 5 prioritized fixes

1. **Add `SheetTitle` to the More menu** (`main-layout-client.tsx:262`) — one-line accessibility fix that resolves a Radix runtime warning and unblocks screen-reader users.
2. **Lighten `--muted` and stop using `--dim` for body text** (`globals.css:15-16`) — single-token change that fixes WCAG AA failures across dozens of cards.
3. **Split `Providers` so marketing routes are server-only** (`app/layout.tsx:122`, `components/providers.tsx`) — biggest performance win; cuts marketing JS by ~80KB and removes QueryClient/Auth/SW init from public pages.
4. **Convert YouTube thumbnails + avatars to `next/image`** (`VideoCard.tsx:38`, `main-layout-client.tsx:179`) — eliminates CLS, enables lazy loading, leverages already-configured remote pattern.
5. **Bottom nav hardening**: bump `--nav-h` to 72px, raise label text to 11px minimum, add `aria-label` per nav `Link`, replace `min-h-screen` with `min-h-[100dvh]` site-wide (`main-layout-client.tsx:227`, `globals.css:48`, page wrappers).
