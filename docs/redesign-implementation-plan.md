# Warm Luxury Editorial — Redesign Implementation Plan

> **Design System:** Warm Luxury Editorial
> **Generated:** 2026-03-03
> **Source Mockups:** `docs/mockups/redesign_diff_4/` (primary), `docs/mockups/redesign_diff_3/` (fallback)
> **Target:** Full visual overhaul of The Dad Center codebase

---

## Table of Contents

1. [Design System Spec](#1-design-system-spec)
2. [Typography System](#2-typography-system)
3. [Animation System](#3-animation-system)
4. [Phase-by-Phase Implementation](#4-phase-by-phase-implementation)
5. [Mockup-to-Page Mapping](#5-mockup-to-page-mapping)
6. [File-Level Change List](#6-file-level-change-list)
7. [Class Migration Table](#7-class-migration-table)
8. [Verification Checklist](#8-verification-checklist)

---

## 1. Design System Spec

### 1.1 Color Tokens

All mockups share identical CSS custom properties. These replace the current HSL-based shadcn tokens.

#### Core Palette

| Token | Hex | RGB | Usage |
|-------|-----|-----|-------|
| `--bg` | `#12100e` | `18, 16, 14` | Page background |
| `--surface` | `#1a1714` | `26, 23, 20` | Header, nav, elevated surfaces |
| `--card` | `#201c18` | `32, 28, 24` | Card backgrounds |
| `--card-hover` | `#282420` | `40, 36, 32` | Card hover state |
| `--white` | `#faf6f0` | `250, 246, 240` | Pure white (warm-tinted) |
| `--cream` | `#ede6dc` | `237, 230, 220` | Primary text color |
| `--muted` | `#7a6f62` | `122, 111, 98` | Secondary/muted text |
| `--dim` | `#4a4239` | `74, 66, 57` | Dimmed elements, inactive |

#### Accent Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `--copper` | `#c4703f` | Primary accent (CTAs, active states, highlights) |
| `--copper-dim` | `rgba(196, 112, 63, 0.15)` | Copper tinted background |
| `--copper-glow` | `rgba(196, 112, 63, 0.25)` | Copper glow/shadow effect |
| `--gold` | `#d4a853` | Secondary accent (progress, decorative) |
| `--gold-dim` | `rgba(212, 168, 83, 0.15)` | Gold tinted background |
| `--gold-glow` | `rgba(212, 168, 83, 0.25)` | Gold glow/shadow effect |

#### Semantic Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `--sage` | `#6b8f71` | Mom/partner, success, health |
| `--sage-dim` | `rgba(107, 143, 113, 0.15)` | Sage tinted background |
| `--coral` | `#d4836b` | Warnings, alerts, catch-up |
| `--coral-dim` | `rgba(212, 131, 107, 0.15)` | Coral tinted background |
| `--sky` | `#5b9bd5` | Info, links, informational |
| `--sky-dim` | `rgba(91, 155, 213, 0.15)` | Sky tinted background |
| `--rose` | `#c47a8f` | Relationship pillar, special accent |
| `--rose-dim` | `rgba(196, 122, 143, 0.15)` | Rose tinted background |

#### Border Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--border` | `rgba(237, 230, 220, 0.08)` | Default border (subtle) |
| `--border-hover` | `rgba(237, 230, 220, 0.15)` | Hover/focus border |

#### Copper Hover States

| Context | Normal | Hover |
|---------|--------|-------|
| Button bg | `#c4703f` | `#d47d4a` (lighter) or `#d4824f` |
| Button shadow | none | `0 4px 20px rgba(196,112,63,0.35)` |
| Gold hover | `#d4a853` | `#dbb55e` |

### 1.2 Shadows

| Token | Value | Usage |
|-------|-------|-------|
| `--shadow-card` | `0 2px 16px rgba(0,0,0,0.35), 0 1px 4px rgba(0,0,0,0.2)` | Default card elevation |
| `--shadow-hover` | `0 6px 28px rgba(0,0,0,0.45), 0 2px 8px rgba(0,0,0,0.3)` | Card hover elevation |
| `--shadow-lift` | `0 6px 24px rgba(0,0,0,0.28), 0 16px 48px rgba(0,0,0,0.36)` | Large lift (budget/checklists) |
| `--shadow-copper` | `0 4px 20px rgba(196,112,63,0.18)` | Copper-tinted accent shadow |
| `--shadow-gold` | `0 4px 20px rgba(212,168,83,0.18)` | Gold-tinted accent shadow |

### 1.3 Border Radii

| Token | Value | Usage |
|-------|-------|-------|
| `--radius` | `12px` | Default (cards, modals) |
| `--radius-sm` | `8px` | Buttons, inputs, smaller elements |
| `--radius-xs` | `4px` | Minimal rounding (tags, pills inner) |
| `--radius-lg` | `16px` | Large elements (sheets, overlays) |

### 1.4 Layout Constants

| Token | Value | Usage |
|-------|-------|-------|
| `--header-h` | `60px` | Sticky header height |
| `--nav-h` | `64px` | Bottom navigation height |
| App shell max-width | `480px` | Mobile app shell (dashboard, briefing, journey) |
| Content max-width | `1100px` | Desktop content (landing page, tasks) |

### 1.5 Background Effects

Three layered effects create the warm ambient feel:

```
Layer 0: body background-color: var(--bg)  (#12100e)
Layer 1: Warm radial gradient (fixed position, pointer-events: none)
         radial-gradient(ellipse 70% 50% at 50% -10%, rgba(196,112,63,0.07) 0%, transparent 70%),
         radial-gradient(ellipse 40% 30% at 90% 60%, rgba(212,168,83,0.04) 0%, transparent 60%)
Layer 2: Noise texture overlay (SVG feTurbulence, opacity: 0.03)
Layer 3: Floating particles (canvas or CSS, z-index: 1)
Layer 4: App content (z-index: 2+)
```

The noise texture SVG (inline data URI):
```
data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E
```

---

## 2. Typography System

### 2.1 Font Families

| Token | Stack | Usage |
|-------|-------|-------|
| `--font-display` | `'Playfair Display', Georgia, serif` | Headlines, page titles, card titles, decorative numbers |
| `--font-body` | `'Jost', system-ui, sans-serif` | Body text, paragraphs, briefing content |
| `--font-ui` | `'Karla', system-ui, sans-serif` | Buttons, labels, nav, metadata, pills, form inputs |

### 2.2 Google Fonts Import

```
https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=Jost:wght@300;400;500;600&family=Karla:wght@400;500;600&display=swap
```

**Next.js implementation** (replace current `Inter` in `layout.tsx`):
```typescript
import { Playfair_Display, Jost, Karla } from 'next/font/google'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['400', '700', '900'],
  style: ['normal', 'italic'],
})

const jost = Jost({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['300', '400', '500', '600'],
})

const karla = Karla({
  subsets: ['latin'],
  variable: '--font-ui',
  weight: ['400', '500', '600'],
})

// In <body>:
className={`${playfair.variable} ${jost.variable} ${karla.variable}`}
```

### 2.3 Font Weight Usage Guide

| Weight | Name | Font Family | Typical Usage |
|--------|------|-------------|---------------|
| 300 | Light | Jost | Subtitles, metadata, muted descriptions |
| 400 | Regular | All three | Body text (Jost), nav labels (Karla), display italic (Playfair) |
| 500 | Medium | Jost, Karla | UI labels, nav items, form labels |
| 600 | Semibold | Jost, Karla | Buttons, section pre-labels, badges |
| 700 | Bold | Playfair | Page titles, card titles, header brand |
| 900 | Black | Playfair | Decorative numbers (week number watermark) |

### 2.4 Typography Scale (from mockups)

| Element | Font | Weight | Size | Color | Extra |
|---------|------|--------|------|-------|-------|
| Page title (desktop) | Playfair | 700 | 36px | `--cream` | `line-height: 1.2` |
| Page title (mobile) | Playfair | 700 | 28px | `--cream` | `letter-spacing: -0.02em` |
| Card title | Playfair | 700 | 19px | `--cream` | Copper underline on hover |
| Section pre-label | Karla | 600 | 11px | `--copper` | `letter-spacing: 0.2em; text-transform: uppercase` |
| Body text | Jost | 400 | 15-16px | `--cream` | `line-height: 1.6` |
| Meta/subtitle | Jost | 300 | 12-15px | `--muted` | `letter-spacing: 0.01em` |
| Button text | Karla | 600 | 13px | varies | `letter-spacing: 0.04-0.08em` |
| Nav label | Karla | 500 | 9px | `--muted` (active: `--copper`) | `letter-spacing: 0.08em; text-transform: uppercase` |
| Pill/badge | Karla | 500 | 12px | `--muted` | — |
| Header brand | Playfair | 700 | 15-18px | `--cream` | `letter-spacing: 0.08em` |
| Clock/time | Karla | 500 | 11px | `--muted` | `letter-spacing: 0.05em` |
| Decorative week num | Playfair | 900 | 80px | `rgba(237,230,220,0.06)` | Translucent watermark |

---

## 3. Animation System

### 3.1 Reusable Animation Components to Create

Create `src/components/ui/animations/` directory with these components:

#### A1: `WarmBackground.tsx` — Global ambient layers
- Warm radial gradient overlay (fixed)
- Noise texture overlay (fixed, opacity 0.03)
- Add to root layout or `(main)/layout.tsx`
- CSS-only, no JS needed

#### A2: `FloatingParticles.tsx` — Ambient particle system
- 8-12 small circles (2-5px) with copper/gold/cream colors
- CSS-only animation using `@keyframes float-up`
- Each particle: different duration (11-20s), delay, left offset, drift direction
- Fixed position, pointer-events none, z-index 1
- Wrap in `prefers-reduced-motion` check

#### A3: `CardEntrance.tsx` — "Dealt from deck" card animation
- Initial state: `opacity: 0; transform: perspective(800px) rotateX(8deg) translateY(24px)`
- Entered state: `opacity: 1; transform: perspective(800px) rotateX(0deg) translateY(0)`
- Transition: `0.55s cubic-bezier(0.22, 1, 0.36, 1)`
- Stagger delays: 0ms, 120ms, 240ms, 360ms, 480ms, 600ms
- Uses IntersectionObserver to trigger on scroll

#### A4: `Card3DTilt.tsx` — 3D tilt on pointer move (wrapper or hook)
- `transform-style: preserve-3d; perspective(800px)`
- On pointermove: calculate rotateX/rotateY based on cursor position
- Gloss overlay: `radial-gradient(circle at var(--mx) var(--my), rgba(255,255,255,0.04), transparent 60%)`
- Copper top-line pulse on hover: `@keyframes top-line-pulse`
- On pointerleave: animate back to flat

#### A5: `ScrollProgressBar.tsx` — Copper-to-gold progress line
- Fixed top, height 2px, z-index 9999
- `background: linear-gradient(90deg, var(--copper), var(--gold))`
- `box-shadow: 0 0 6px rgba(196,112,63,0.5)`
- Width tracks scroll percentage
- Used on briefing pages

#### A6: `TypewriterGreeting.tsx` — Welcome text typewriter
- Types out greeting character by character
- Blinking copper cursor: `width: 2px; background: var(--copper); animation: cursor-blink 0.8s step-end infinite`
- Meta text fades in after typing completes (delay ~1.6s)

#### A7: `CopperDivider.tsx` — Animated line draw
- Line draws from left to right: `@keyframes draw-line` (1s, cubic-bezier)
- Glowing copper tip travels along: `@keyframes tip-travel`
- Tip: 8px circle with `box-shadow: 0 0 10px 3px rgba(196,112,63,0.7)`
- Triggers after greeting animation

#### A8: `RevealOnScroll.tsx` — Intersection-based reveal
- Initial: `opacity: 0; transform: translateY(20px)`
- Visible: `opacity: 1; transform: translateY(0)`
- Transition: `0.65s cubic-bezier(0.16, 1, 0.3, 1)`
- Stagger delays: 0.08s increments (up to 6 items)
- Used heavily on landing page

#### A9: `MoodEmojiPop.tsx` — 3D emoji selection bounce
- `transform-style: preserve-3d`
- Hover: `translateZ(20px) scale(1.12)` with copper border + glow
- Select: `translateZ(14px) scale(1.1)` with copper-dim bg
- Ripple: `@keyframes ripple-out` (scale 0 → 4, opacity 1 → 0, 0.6s)
- Uses cubic-bezier(0.34, 1.56, 0.64, 1) for springy feel

#### A10: `MagneticButton.tsx` — Magnetic hover effect
- Wraps button in container
- On mousemove: slight translateX/Y toward cursor (max ±4px)
- On mouseleave: spring back to center
- Used on landing page CTAs

### 3.2 Keyframes Reference

All keyframes needed across the app:

```css
/* === Core Reveals === */
@keyframes fadeIn {
  0% { opacity: 0; }
  100% { opacity: 1; }
}

@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slideUp {
  0% { transform: translateY(10px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
}

@keyframes slideDown {
  0% { transform: translateY(-10px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
}

/* === Ambient === */
@keyframes float-up {
  0%   { transform: translateY(0) translateX(0) scale(1); opacity: 0; }
  10%  { opacity: 1; }
  80%  { opacity: 0.6; }
  100% { transform: translateY(-110vh) translateX(var(--drift)) scale(0.4); opacity: 0; }
}

/* === Card System === */
@keyframes top-line-pulse {
  0%, 100% { box-shadow: none; }
  50% { box-shadow: 0 0 12px 2px rgba(196,112,63,0.55), 0 0 4px 1px rgba(196,112,63,0.35); }
}

@keyframes top-line-pulse-gold {
  0%, 100% { box-shadow: none; }
  50% { box-shadow: 0 0 12px 2px rgba(212,168,83,0.55), 0 0 4px 1px rgba(212,168,83,0.35); }
}

/* === Interactive === */
@keyframes cursor-blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

@keyframes draw-line {
  from { width: 0; opacity: 1; }
  to { width: 100%; opacity: 1; }
}

@keyframes tip-travel {
  0% { left: 0%; opacity: 1; }
  99% { left: 99%; opacity: 1; }
  100% { left: 100%; opacity: 0; }
}

@keyframes ripple-out {
  0% { transform: scale(0); opacity: 1; }
  60% { transform: scale(2.5); opacity: 0.5; }
  100% { transform: scale(4); opacity: 0; }
}

@keyframes ring-pulse {
  0% { transform: scale(1); opacity: 0.7; }
  100% { transform: scale(1.6); opacity: 0; }
}

@keyframes pulse-dot {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.3); opacity: 0.7; }
}

@keyframes flag-cascade {
  from { opacity: 0; transform: translateX(-16px); }
  to { opacity: 1; transform: translateX(0); }
}

@keyframes bullet-slide {
  from { opacity: 0; transform: translateX(-10px); }
  to { opacity: 1; transform: translateX(0); }
}

@keyframes dot-pop {
  0% { transform: scale(0); }
  60% { transform: scale(1.4); }
  100% { transform: scale(1); }
}

@keyframes mood-bounce {
  0% { transform: translateZ(0) scale(1); }
  35% { transform: translateZ(24px) scale(1.25); }
  65% { transform: translateZ(10px) scale(0.97); }
  100% { transform: translateZ(14px) scale(1.1); }
}

@keyframes num-spin {
  0% { transform: perspective(200px) rotateY(0deg); }
  25% { transform: perspective(200px) rotateY(5deg); }
  75% { transform: perspective(200px) rotateY(-5deg); }
  100% { transform: perspective(200px) rotateY(0deg); }
}

/* === Shimmer (loading) === */
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

/* === Accordion (shadcn) === */
@keyframes accordion-down {
  from { height: 0; }
  to { height: var(--radix-accordion-content-height); }
}

@keyframes accordion-up {
  from { height: var(--radix-accordion-content-height); }
  to { height: 0; }
}

/* === Scroll Ring (tasks) === */
/* SVG-based circular progress indicator */

/* === Mesh Drift (onboarding) === */
@keyframes meshDrift1 {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(80px, 60px); }
}

@keyframes meshDrift2 {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(-60px, -40px); }
}
```

### 3.3 Easing Functions

| Name | Value | Usage |
|------|-------|-------|
| Standard out | `ease-out` | Default for simple transitions |
| Decelerate | `cubic-bezier(0.22, 1, 0.36, 1)` | Card entrances, line draws |
| Spring | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Nav indicator, emoji bounce, springy effects |
| Smooth | `cubic-bezier(0.16, 1, 0.3, 1)` | Scroll reveals (landing page) |
| Snappy | `cubic-bezier(0.4, 0, 0.2, 1)` | Phase pill sliding indicator |

---

## 4. Phase-by-Phase Implementation

### Phase 1: Design Foundation (Critical Path)

**Goal:** Replace all color tokens, fonts, and base styles. Everything downstream depends on this.

**Files to modify:**
1. `tailwind.config.ts` — Replace color palette, add font families, update animations
2. `src/app/globals.css` — Replace CSS variables, add new keyframes, add ambient styles
3. `src/app/layout.tsx` — Replace Inter font with Playfair Display + Jost + Karla
4. `next.config.ts` — Add Google Fonts optimization if needed

**Tailwind config changes:**
```typescript
// tailwind.config.ts — replace colors.surface, colors.primary, colors.accent
colors: {
  // Keep shadcn structure but map to new tokens
  border: "var(--border)",
  input: "var(--border)",
  ring: "var(--copper)",
  background: "var(--bg)",
  foreground: "var(--cream)",
  primary: {
    DEFAULT: "var(--copper)",
    foreground: "var(--bg)",
  },
  secondary: {
    DEFAULT: "var(--gold)",
    foreground: "var(--bg)",
  },
  muted: {
    DEFAULT: "var(--dim)",
    foreground: "var(--muted)",
  },
  accent: {
    DEFAULT: "var(--copper-dim)",
    foreground: "var(--copper)",
  },
  destructive: {
    DEFAULT: "var(--coral)",
    foreground: "var(--white)",
  },
  card: {
    DEFAULT: "var(--card)",
    foreground: "var(--cream)",
  },
  popover: {
    DEFAULT: "var(--card)",
    foreground: "var(--cream)",
  },
  // New semantic tokens
  copper: {
    DEFAULT: "#c4703f",
    dim: "rgba(196, 112, 63, 0.15)",
    glow: "rgba(196, 112, 63, 0.25)",
    hover: "#d47d4a",
  },
  gold: {
    DEFAULT: "#d4a853",
    dim: "rgba(212, 168, 83, 0.15)",
    glow: "rgba(212, 168, 83, 0.25)",
    hover: "#dbb55e",
  },
  sage: {
    DEFAULT: "#6b8f71",
    dim: "rgba(107, 143, 113, 0.15)",
  },
  coral: {
    DEFAULT: "#d4836b",
    dim: "rgba(212, 131, 107, 0.15)",
  },
  sky: {
    DEFAULT: "#5b9bd5",
    dim: "rgba(91, 155, 213, 0.15)",
  },
  rose: {
    DEFAULT: "#c47a8f",
    dim: "rgba(196, 122, 143, 0.15)",
  },
  cream: "#ede6dc",
  surface: {
    DEFAULT: "#1a1714",
    bg: "#12100e",
    card: "#201c18",
    hover: "#282420",
    dim: "#4a4239",
    muted: "#7a6f62",
  },
},
fontFamily: {
  display: ['var(--font-display)', 'Georgia', 'serif'],
  body: ['var(--font-body)', 'system-ui', 'sans-serif'],
  ui: ['var(--font-ui)', 'system-ui', 'sans-serif'],
},
```

**globals.css new root variables:**
```css
:root {
  --bg: #12100e;
  --surface: #1a1714;
  --card: #201c18;
  --card-hover: #282420;
  --border: rgba(237, 230, 220, 0.08);
  --border-hover: rgba(237, 230, 220, 0.15);
  --copper: #c4703f;
  --copper-dim: rgba(196, 112, 63, 0.15);
  --copper-glow: rgba(196, 112, 63, 0.25);
  --gold: #d4a853;
  --gold-dim: rgba(212, 168, 83, 0.15);
  --gold-glow: rgba(212, 168, 83, 0.25);
  --cream: #ede6dc;
  --muted: #7a6f62;
  --dim: #4a4239;
  --sage: #6b8f71;
  --sage-dim: rgba(107, 143, 113, 0.15);
  --sky: #5b9bd5;
  --sky-dim: rgba(91, 155, 213, 0.15);
  --coral: #d4836b;
  --coral-dim: rgba(212, 131, 107, 0.15);
  --rose: #c47a8f;
  --rose-dim: rgba(196, 122, 143, 0.15);
  --white: #faf6f0;

  --font-display: 'Playfair Display', Georgia, serif;
  --font-body: 'Jost', system-ui, sans-serif;
  --font-ui: 'Karla', system-ui, sans-serif;

  --radius: 12px;
  --radius-sm: 8px;
  --radius-xs: 4px;
  --radius-lg: 16px;

  --shadow-card: 0 2px 16px rgba(0,0,0,0.35), 0 1px 4px rgba(0,0,0,0.2);
  --shadow-hover: 0 6px 28px rgba(0,0,0,0.45), 0 2px 8px rgba(0,0,0,0.3);
  --shadow-lift: 0 6px 24px rgba(0,0,0,0.28), 0 16px 48px rgba(0,0,0,0.36);
  --shadow-copper: 0 4px 20px rgba(196,112,63,0.18);
  --shadow-gold: 0 4px 20px rgba(212,168,83,0.18);

  --header-h: 60px;
  --nav-h: 64px;
}
```

**Verification:** `npm run build` passes. App renders with warm dark background, new fonts load correctly.

---

### Phase 2: Animation Foundation

**Goal:** Create reusable animation components and hooks.

**New files to create:**
1. `src/components/ui/animations/WarmBackground.tsx`
2. `src/components/ui/animations/FloatingParticles.tsx`
3. `src/components/ui/animations/CardEntrance.tsx`
4. `src/components/ui/animations/Card3DTilt.tsx`
5. `src/components/ui/animations/RevealOnScroll.tsx`
6. `src/components/ui/animations/TypewriterGreeting.tsx`
7. `src/components/ui/animations/CopperDivider.tsx`
8. `src/components/ui/animations/ScrollProgressBar.tsx`
9. `src/components/ui/animations/MoodEmojiPop.tsx`
10. `src/components/ui/animations/MagneticButton.tsx`
11. `src/components/ui/animations/index.ts` (barrel export)
12. `src/hooks/use-3d-tilt.ts` (hook version of Card3DTilt)
13. `src/hooks/use-intersection-reveal.ts` (IntersectionObserver hook)

**Key implementation details:**

```typescript
// use-3d-tilt.ts
'use client'
import { useRef, useCallback } from 'react'

export function use3DTilt(maxTilt = 6) {
  const ref = useRef<HTMLDivElement>(null)

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    const rotateX = (0.5 - y) * maxTilt
    const rotateY = (x - 0.5) * maxTilt
    el.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
    el.style.setProperty('--mx', `${x * 100}%`)
    el.style.setProperty('--my', `${y * 100}%`)
    el.classList.add('tilt-active')
  }, [maxTilt])

  const onPointerLeave = useCallback(() => {
    const el = ref.current
    if (!el) return
    el.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg)'
    el.classList.remove('tilt-active')
  }, [])

  return { ref, onPointerMove, onPointerLeave }
}
```

**Verification:** Import and render `<FloatingParticles />` and `<WarmBackground />` in layout — ambient effects visible.

---

### Phase 3: UI Primitive Reskin

**Goal:** Update all shadcn/ui primitives to match the warm luxury theme.

**Files to modify (all in `src/components/ui/`):**

| File | Key Changes |
|------|-------------|
| `button.tsx` | Karla font, copper primary, gold secondary, ghost uses muted→cream, letter-spacing 0.04em |
| `card.tsx` | `--card` bg, `--border` border, `--shadow-card`, hover shadow + border-hover |
| `input.tsx` | Jost font, `--card` bg, `--border`, focus ring copper, 16px font-size (iOS) |
| `textarea.tsx` | Same as input |
| `select.tsx` | Same as input |
| `badge.tsx` | Karla 500 12px, copper/gold/sage/coral variants with dim backgrounds |
| `dialog.tsx` | `--card` bg, `--border`, rounded-[--radius-lg] |
| `sheet.tsx` | `--surface` bg, `--border` top, rounded-t-2xl for bottom sheet |
| `tabs.tsx` | Phase pill style: Karla 500 12px, copper active indicator, `--card` bg |
| `progress.tsx` | Copper fill, `--dim` track, optional gold variant |
| `skeleton.tsx` | Shimmer with `--card`/`--card-hover` gradient |
| `accordion.tsx` | Keep existing keyframes, update colors |
| `separator.tsx` | Use `--border` color |
| `switch.tsx` | Copper active, `--dim` track |
| `checkbox.tsx` | Copper checked, `--border` unchecked |
| `radio-group.tsx` | Same as checkbox |
| `dropdown-menu.tsx` | `--card` bg, hover `--card-hover`, Jost body font |
| `alert.tsx` | Copper border-left, `--copper-dim` bg |
| `form.tsx` | Error states use `--coral`, labels use Karla |
| `label.tsx` | Karla font |
| `logo.tsx` | Update colors if needed |
| `date-select.tsx` | Match input styling |
| `sonner.tsx` | Toast with `--card` bg, copper accent border |

**Button variant mapping:**
```
default     → bg-copper text-[--bg] hover:bg-copper-hover shadow-copper
secondary   → bg-transparent border border-copper text-copper hover:bg-copper hover:text-[--bg]
gold        → bg-gold text-[--bg] hover:bg-gold-hover shadow-gold
ghost       → text-muted hover:text-cream hover:bg-transparent
outline     → border border-[--border] text-cream hover:border-[--border-hover]
destructive → bg-coral text-white
link        → text-copper underline-offset-4 hover:text-gold
```

**Verification:** Render each primitive in isolation — all match mockup styling.

---

### Phase 4: Layout & Navigation

**Goal:** Update header, bottom nav, sidebar, and More drawer to match mockup design.

**Files to modify:**
1. `src/components/layouts/main-layout-client.tsx` — Complete restyle
2. `src/app/(main)/layout.tsx` — Add `WarmBackground` and `FloatingParticles`
3. `src/app/layout.tsx` — Font swap, theme color update

**Header changes (from mockup `02-dashboard.html`):**
- Background: `var(--surface)` with `backdrop-filter: blur(16px)`
- Height: `60px` (currently 56px/h-14)
- Brand: Playfair Display 700, 15px, letter-spacing 0.08em
- Clock/week text: Karla 500, 11px, `--muted`
- Notification icon: copper color, 22px, pulse-dot animation on badge
- Avatar: 34px circle, `linear-gradient(135deg, var(--copper), var(--gold))` bg, Karla 600 12px initials

**Bottom nav changes (from mockup `02-dashboard.html`):**
- Background: `var(--surface)` with `backdrop-filter: blur(16px)`
- Border-top: `1px solid var(--border)`
- Padding: `8px 0 calc(8px + env(safe-area-inset-bottom))`
- Sliding copper indicator: 2px height, `--copper` bg, follows active item
  - Transition: `left 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)`
  - Expands to 20px on hover
- Nav icons: 20px, `--muted` default, `--copper` active
- Nav labels: Karla 500, 9px, uppercase, 0.08em spacing
- Active item: icon bounces with scale(1.08)
- Items: Home, Tasks, Briefing, Tracker, More

**More drawer (bottom sheet):**
- Background: `var(--surface)`
- Section headers: Karla 600, 10px, `--muted`, uppercase, 0.12em spacing
- Items: Karla 500, 14px, `--cream`
- Hover: `--card` bg
- Active: copper left border, `--copper-dim` bg

**Desktop sidebar:**
- Same section structure as More drawer
- Fixed left, 264px width
- Background: `var(--surface)`
- Border-right: `1px solid var(--border)`

**Verification:** Navigate between all 5 tabs — indicator slides, active states correct. More drawer opens/closes smoothly.

---

### Phase 5: Dashboard

**Goal:** Restyle dashboard to match `docs/mockups/redesign_diff_4/02-dashboard.html`.

**Files to modify:**
1. `src/components/dashboard/DashboardClient.tsx` — Card ordering, welcome section
2. `src/components/dashboard/DashboardHeader.tsx` — Typewriter greeting, copper divider
3. `src/components/dashboard/dad-journey/MoodCheckinCard.tsx` — 3D emoji, ripple, flags cascade
4. `src/components/dashboard/dad-journey/MoodCheckinWidget.tsx` — Emoji pop animation
5. `src/components/dashboard/BriefingTeaserCard.tsx` — Decorative week number, bullet animation
6. `src/components/dashboard/TasksDueCard.tsx` — Card entrance, copper/gold accent lines
7. `src/components/dashboard/dad-journey/OnYourMindCard.tsx` — Challenge tile styling
8. `src/components/dashboard/dad-journey/DadChallengeTile.tsx` — Color-coded borders
9. `src/components/dashboard/dad-journey/DadChallengeTiles.tsx` — Stagger animation
10. `src/components/dashboard/QuickActionsBar.tsx` — Icon grid, copper hover
11. `src/components/dashboard/PersonalizeCard.tsx` — Card styling
12. `src/components/dashboard/InvitePartnerCard.tsx` — Sage accent
13. `src/components/dashboard/BudgetSnapshotCard.tsx` — Gold accent
14. `src/components/dashboard/ChecklistProgressCard.tsx` — Progress bar reskin
15. `src/components/dashboard/UpgradePromptCard.tsx` — Gold gradient CTA

**Welcome section (new):**
```
- Greeting: "Good evening, Ashirbad" — Playfair 700, 28px, typewriter effect
- Meta: "Week 24 · Trimester 2 — Baby is the size of a cantaloupe 🍈" — Jost 300, 15px, --muted
- Copper divider with drawing animation below
```

**Mood check-in card:**
```
- Card with copper top-line (pulsing glow on tilt)
- 5 emoji circles (48px) with 3D pop on hover
- Ripple effect on selection
- Flags cascade in from left after selection
- Check-in button with pulsing glow rings
```

**Briefing teaser card:**
```
- Decorative "24" — Playfair 900, 80px, translucent, 3D Y-rotation oscillation
- Subtitle: Jost italic 400, 15px
- Gold bullet dots pop on card entrance
- Progress bar with traveling highlight shimmer
```

**Card entrance system:**
All dashboard cards use `CardEntrance` wrapper with stagger delays (120ms between cards).

**Verification:** Dashboard loads with typewriter → divider → staggered card entrance. Mood emojis have 3D pop. Briefing week number rotates.

---

### Phase 6: Briefings

**Goal:** Restyle briefing pages to match `docs/mockups/redesign_diff_4/03-briefings.html`.

**Files to modify:**
1. `src/components/briefings/BriefingHero.tsx` — Full-width hero with scroll progress
2. `src/components/briefings/BriefingSection.tsx` — Section styling with reveal animation
3. `src/components/briefings/BriefingProgressBar.tsx` — Copper fill progress
4. `src/components/briefings/QuickStats.tsx` — Stat cards with gold numbers
5. `src/components/briefings/RelatedTasks.tsx` — Task items reskin
6. `src/components/briefings/BriefingLinkedTasks.tsx` — Linked tasks styling
7. `src/components/briefings/DadFocusList.tsx` — Copper bullet list
8. `src/components/briefings/BabySizeCard.tsx` — Decorative card
9. `src/app/(main)/briefing/page.tsx` — Add ScrollProgressBar
10. `src/app/(main)/briefing/[weekId]/page.tsx` — Add reading time badge

**Key features from mockup:**
- Scroll progress bar (copper→gold gradient, top of page)
- Reading time badge (fixed top-right, fades in after scroll)
- Floating particles canvas
- Section reveals on scroll with stagger
- Inline task checkboxes with copper check marks
- Week navigation (← → arrows, week pill selector)
- "Dad's Focus" section with copper bullet dots
- Baby size comparison card with illustration

**Verification:** Briefing page has scroll progress bar, sections reveal on scroll, reading time badge appears.

---

### Phase 7: Tasks

**Goal:** Restyle tasks page to match `docs/mockups/redesign_diff_4/04-tasks.html`.

**Files to modify:**
1. `src/components/tasks/tasks-page-client.tsx` — Overall layout, phase timeline
2. `src/components/tasks/tasks-header.tsx` — Playfair title, header copper line
3. `src/components/tasks/task-section.tsx` — Section headers
4. `src/components/tasks/focus-card.tsx` — Focus card with copper accent
5. `src/components/tasks/todays-focus-card.tsx` — Highlighted card
6. `src/components/tasks/week-task-card.tsx` — Task card reskin
7. `src/components/tasks/task-item.tsx` — Checkbox, labels, assignee pill
8. `src/components/tasks/task-detail-sheet.tsx` — Bottom sheet detail view
9. `src/components/tasks/progress-card.tsx` — Ring progress reskin
10. `src/components/tasks/progress-header.tsx` — Stats reskin
11. `src/components/tasks/progress-stats.tsx` — Number styling (Playfair 900)
12. `src/components/tasks/stats-bar.tsx` — Copper/gold bar chart
13. `src/components/tasks/filter-bar.tsx` — Phase pill timeline
14. `src/components/tasks/catch-up-banner.tsx` — Yellow (gold) catch-up banner
15. `src/components/tasks/catch-up-section.tsx` — Catch-up section
16. `src/components/tasks/catch-up-task-item.tsx` — Catch-up item styling
17. `src/components/tasks/streak-banner.tsx` — Streak celebration
18. `src/components/tasks/week-calendar-card.tsx` — Calendar view
19. `src/components/tasks/animations/task-animations.tsx` — Update to warm theme
20. `src/components/tasks/animations/confetti.tsx` — Copper/gold confetti

**Key features from mockup:**
- Phase timeline (horizontal scrollable pills with sliding underline indicator)
- Scroll progress ring (fixed bottom-right, SVG circle, copper stroke)
- Two-column desktop layout (main + sidebar)
- Task cards with copper checkbox, hover elevation
- Focus card with copper left border and priority badge
- Completion animation: copper confetti burst
- Calendar view toggle with warm-themed calendar
- Sidebar: stats cards with Playfair 900 numbers

**Phase timeline:**
```
- Background: var(--card), border: var(--border), border-radius: var(--radius-sm)
- Pills: Karla 500, 12px, color var(--dim)
- Active pill: color var(--cream), background var(--card-hover)
- Sliding indicator: 2px height, var(--cream), bottom, animated with cubic-bezier
```

**Task item reskin:**
```
- Checkbox: 18px, border: var(--border-hover), checked: bg copper, copper checkmark
- Title: Jost 400, 14px, var(--cream)
- Assignee pill: Karla 500, 10px, colored dim background
- Completed: line-through, opacity 0.5
```

**Verification:** Tasks page shows phase timeline, task items match mockup, scroll ring appears on scroll.

---

### Phase 8: Landing Page

**Goal:** Restyle marketing landing page to match `docs/mockups/redesign_diff_4/01-landing-page.html`.

**Files to modify:**
1. `src/components/marketing/Header.tsx` — Sticky header, blur bg, nav links
2. `src/components/marketing/Hero.tsx` — Full-height hero, parallax orbs, typewriter
3. `src/components/marketing/Features.tsx` — Feature cards with 3D tilt
4. `src/components/marketing/HowItWorks.tsx` — Step cards, copper numbers
5. `src/components/marketing/ProblemSolution.tsx` — Two-column layout
6. `src/components/marketing/Pricing.tsx` — Pricing cards, gold premium badge
7. `src/components/marketing/Testimonials.tsx` — Testimonial cards
8. `src/components/marketing/FinalCTA.tsx` — Full-width CTA section
9. `src/components/marketing/Footer.tsx` — Dark footer
10. `src/app/(marketing)/page.tsx` — Add particles, noise overlay
11. `src/app/(marketing)/layout.tsx` — Marketing layout with ambient layers

**Key features from mockup:**
- Scroll progress bar (copper→gold) at page top
- Noise texture overlay
- Floating particles
- Parallax orbs in hero (copper/gold radial gradients)
- Section reveals on scroll with stagger delays
- Magnetic CTA buttons
- 3D tilt on feature cards
- Pricing with gold "Popular" badge
- Section pre-labels: `KARLA 600 · 11px · UPPERCASE · COPPER · with 60px line after`

**Header:**
```
- Sticky, z-100
- Background: rgba(18, 16, 14, 0.88) with backdrop-filter blur(20px)
- Border-bottom: 1px solid var(--border)
- Brand: Playfair 700, 18px
- Nav links: Karla 500, 13px, --muted, hover --cream, underline animation
- CTA: Karla 600, 12px, uppercase, copper bg, rounded 8px
```

**Hero:**
```
- Min-height: 100vh, centered content
- H1: Playfair 700, ~48px (mobile) / 60px+ (desktop)
- Subtitle: Jost 300, 18px, --muted, max-width 520px
- CTA buttons: Primary copper + Secondary outline
- Parallax orbs: large radial gradients, move on scroll
```

**Button styles:**
```
btn-primary:   bg copper, text --bg, hover #d47d4a + shadow
btn-secondary: border copper, text copper, hover fill copper
btn-gold:      bg gold, text --bg, hover #dbb55e + shadow
btn-ghost:     text --muted, hover text --cream
```

**Verification:** Landing page has ambient effects, sections reveal on scroll, CTA buttons have hover effects.

---

### Phase 9: Onboarding & Upgrade

**Goal:** Restyle onboarding flow and upgrade/paywall pages to match `docs/mockups/redesign_diff_4/06-onboarding-and-upgrade.html`.

**Files to modify:**
1. `src/app/(auth)/onboarding/page.tsx` — Role selection screen
2. `src/app/(auth)/onboarding/role/page.tsx` — Role cards
3. `src/app/(auth)/onboarding/family/page.tsx` — Family setup
4. `src/app/(auth)/onboarding/ready/page.tsx` — Ready screen (countdown)
5. `src/app/(auth)/login/page.tsx` — Login form reskin
6. `src/app/(auth)/signup/page.tsx` — Signup form reskin
7. `src/app/(public)/upgrade/page.tsx` — Premium upgrade page
8. `src/components/shared/paywall-overlay.tsx` — Paywall modal
9. `src/components/shared/paywall-banner.tsx` — Inline paywall banner

**Key features from mockup:**
- Ambient mesh blobs (drifting gradient circles behind content)
- 12 floating particles (varied sizes, copper/gold/cream)
- Stepped progress indicator with copper fill
- Role selection cards with 3D tilt and gradient borders
- Form inputs: `--card` bg, `--border`, Jost font, copper focus ring
- CTA buttons: copper with ring-pulse animation
- Upgrade page: centered pricing cards, gold "Best Value" badge
- Paywall overlay: blurred backdrop, centered modal, copper accent

**Onboarding progress steps:**
```
- Circles connected by lines
- Completed: copper fill, checkmark
- Current: copper ring, pulsing
- Upcoming: dim border, muted
```

**Verification:** Complete onboarding flow visually matches mockup. Upgrade page pricing is correct ($4.99/$39.99/$99.99).

---

### Phase 10: Budget & Checklists

**Goal:** Restyle budget and checklists pages using `docs/mockups/redesign_diff_3/05-budget-and-checklists.html` as reference (diff_4 version not available).

> **Note:** This mockup is from redesign_diff_3. Apply the same color tokens, fonts, and animation patterns from diff_4 to maintain consistency. Add card entrance animations and 3D tilt that diff_3 may not have.

**Files to modify:**
1. `src/app/(main)/budget/page.tsx` — Budget page
2. `src/components/budget/ProductExamplesDrawer.tsx` — Product drawer
3. `src/components/budget/TierFilter.tsx` — Filter pills
4. `src/app/(main)/checklists/page.tsx` — Checklists page
5. `src/app/(main)/checklists/[id]/page.tsx` — Individual checklist

**Key features from mockup:**
- Page header: Playfair 700, 28px, gold color
- Subtitle: Jost 300, 14px, `--muted`
- Budget cards with gold accent line
- Tabular numbers: `font-variant-numeric: tabular-nums`
- Progress bars: copper fill
- Checklist items: copper checkbox, strike-through on complete
- Category tabs/pills: Karla 500, copper active
- Shadow lift on hover: `--shadow-lift`

**Enhancements to add (not in diff_3):**
- Card entrance animation (stagger)
- 3D tilt on budget category cards
- Floating particles
- Warm background layers

**Verification:** Budget page renders with warm theme. Checklist progress bars use copper.

---

### Phase 11: Journey & Tracker

**Goal:** Restyle journey and tracker pages using `docs/mockups/redesign_diff_3/07-journey-and-tracker.html` as reference (diff_4 version not available).

> **Note:** Same approach as Phase 10 — use diff_3 as base, apply diff_4 animation patterns.

**Files to modify:**
1. `src/app/(main)/journey/page.tsx` — Dad Journey page
2. `src/components/dashboard/dad-journey/DadChallengeTile.tsx` — Tile reskin (full page version)
3. `src/components/dashboard/dad-journey/DadChallengeTiles.tsx` — Container reskin
4. `src/app/(main)/tracker/page.tsx` — Baby tracker
5. `src/app/(main)/tracker/log/page.tsx` — Log entry
6. `src/app/(main)/tracker/history/page.tsx` — History view
7. `src/app/(main)/tracker/summary/page.tsx` — Summary view

**Key features from mockup:**
- 7 pillar cards with color-coded borders (one per pillar)
- Expandable tiles with accordion animation
- Progress rings per pillar (SVG)
- Challenge content in expandable sections
- Tracker: log form with warm-themed inputs
- History: timeline with copper dots and connecting line
- Summary: stats cards with Playfair 900 numbers

**Pillar color mapping:**
| Pillar | Border Color | Dim Background |
|--------|-------------|----------------|
| Knowledge | `--copper` | `--copper-dim` |
| Planning | `--gold` | `--gold-dim` |
| Finances | `--sky` | `--sky-dim` |
| Anxiety | `--coral` | `--coral-dim` |
| Baby Bonding | `--sage` | `--sage-dim` |
| Relationship | `--rose` | `--rose-dim` |
| Extended Family | `--muted` | `rgba(122,111,98,0.15)` |

**Enhancements to add:**
- Card entrance with stagger
- 3D tilt on pillar cards
- Floating particles
- Warm background layers

**Verification:** Journey page shows 7 pillars with correct colors. Tracker pages match warm theme.

---

### Phase 12: Settings & Remaining Pages

**Goal:** Restyle settings, resources, and utility pages.

**Files to modify:**
1. `src/app/(main)/settings/page.tsx`
2. `src/app/(main)/settings/profile/page.tsx`
3. `src/app/(main)/settings/family/page.tsx`
4. `src/app/(main)/settings/appearance/page.tsx`
5. `src/app/(main)/settings/notifications/page.tsx`
6. `src/app/(main)/settings/subscription/page.tsx`
7. `src/app/(marketing)/resources/page.tsx`
8. `src/app/(marketing)/resources/articles/[slug]/page.tsx`
9. `src/components/marketing/ResourceLibrary.tsx`
10. `src/components/marketing/ArticleCard.tsx`
11. `src/components/marketing/VideoCard.tsx`
12. `src/components/marketing/ArticleContent.tsx`
13. `src/components/marketing/ContentPreview.tsx`
14. `src/components/marketing/ContentFilters.tsx`
15. `src/app/offline/page.tsx`

**Settings pages:**
- List items: `--card` bg, `--border`, Jost 400 body, Karla 500 labels
- Section headers: Karla 600, 11px, uppercase, `--muted`
- Toggle switches: copper active
- Form inputs: warm-themed

**Resource/article pages:**
- Article cards: 3D tilt, hover shadow
- Content: Jost 400, 16px, 1.6 line-height
- Code blocks: JetBrains Mono (keep existing)

**Verification:** All pages render consistently in warm theme.

---

### Phase 13: Polish & Performance

**Goal:** Final pass — reduced motion, performance optimization, dark mode removal (app is always dark).

**Tasks:**
1. Remove `dark` class strategy from tailwind config (app is always warm-dark)
2. Remove light mode CSS variables from globals.css
3. Update `<html>` to remove `className="dark"`
4. Update `viewport` themeColor in layout.tsx to `#12100e`
5. Add `prefers-reduced-motion` checks to all animation components
6. Optimize floating particles (use `will-change`, `contain: layout`)
7. Test all animations on low-end devices
8. Ensure all hover effects have touch equivalents (`:active` states)
9. Verify safe area insets work correctly with new nav height
10. Run Lighthouse audit — target 90+ performance score
11. Check all 42 pages render correctly
12. Verify pricing displays ($4.99/$39.99/$99.99)
13. Verify branding ("The Dad Center" everywhere)

**Performance considerations:**
- Floating particles: max 12 CSS particles (no JS canvas)
- 3D tilt: only on cards > 768px viewport (disable on mobile)
- Noise texture: use CSS background-image (not canvas)
- Backdrop blur: reduce to `blur(4px)` on mobile (already in globals.css)
- Limit simultaneous animations to prevent jank

---

## 5. Mockup-to-Page Mapping

### Primary Mockups (redesign_diff_4)

| Mockup File | Codebase Pages | Key Components |
|-------------|---------------|----------------|
| `01-landing-page.html` | `(marketing)/page.tsx` | Header, Hero, Features, HowItWorks, ProblemSolution, Pricing, Testimonials, FinalCTA, Footer |
| `02-dashboard.html` | `(main)/dashboard/page.tsx` | DashboardHeader, MoodCheckinCard, BriefingTeaserCard, TasksDueCard, OnYourMindCard, QuickActionsBar, bottom nav |
| `03-briefings.html` | `(main)/briefing/page.tsx`, `(main)/briefing/[weekId]/page.tsx` | BriefingHero, BriefingSection, QuickStats, DadFocusList, BabySizeCard, ScrollProgressBar |
| `04-tasks.html` | `(main)/tasks/page.tsx`, `(main)/tasks/[id]/page.tsx` | tasks-page-client, task-item, focus-card, phase timeline, scroll ring, progress stats |
| `06-onboarding-and-upgrade.html` | `(auth)/onboarding/*`, `(auth)/login/page.tsx`, `(auth)/signup/page.tsx`, `(public)/upgrade/page.tsx` | Onboarding steps, role cards, upgrade pricing, paywall |

### Fallback Mockups (redesign_diff_3)

| Mockup File | Codebase Pages | Notes |
|-------------|---------------|-------|
| `05-budget-and-checklists.html` | `(main)/budget/page.tsx`, `(main)/checklists/page.tsx`, `(main)/checklists/[id]/page.tsx` | Use diff_3 styling + add diff_4 animations (card entrance, 3D tilt, particles) |
| `07-journey-and-tracker.html` | `(main)/journey/page.tsx`, `(main)/tracker/page.tsx`, `(main)/tracker/log/page.tsx`, `(main)/tracker/history/page.tsx`, `(main)/tracker/summary/page.tsx` | Use diff_3 styling + add diff_4 animations |

### No Mockup (derive from design system)

| Pages | Approach |
|-------|----------|
| `(main)/settings/*` (6 pages) | Apply design tokens + card styling. No custom animations needed. |
| `(main)/tasks/new/page.tsx` | Form follows input pattern from onboarding mockup |
| `(main)/tasks/triage/page.tsx` | Use task-item reskin + catch-up gold theme |
| `(marketing)/resources/*` | Apply landing page card patterns |
| `(auth)/forgot-password/page.tsx` | Match login page styling |
| `(auth)/reset-password/page.tsx` | Match login page styling |
| `(auth)/onboarding/join/page.tsx` | Match onboarding flow styling |
| `(main)/onboarding/personalize/page.tsx` | Match onboarding flow styling |
| `(main)/calendar/page.tsx` | Apply design tokens (calendar removed from nav, still accessible) |
| `src/app/offline/page.tsx` | Simple warm-themed message |

---

## 6. File-Level Change List

### Config Files (Phase 1)

| File | Action | Phase |
|------|--------|-------|
| `tailwind.config.ts` | Rewrite colors, fonts, animations, shadows | 1 |
| `src/app/globals.css` | Rewrite CSS variables, add keyframes, add ambient styles | 1 |
| `src/app/layout.tsx` | Replace Inter with Playfair/Jost/Karla, update themeColor | 1 |
| `next.config.ts` | Verify font optimization (may not need changes) | 1 |

### New Animation Files (Phase 2)

| File | Action | Phase |
|------|--------|-------|
| `src/components/ui/animations/WarmBackground.tsx` | Create | 2 |
| `src/components/ui/animations/FloatingParticles.tsx` | Create | 2 |
| `src/components/ui/animations/CardEntrance.tsx` | Create | 2 |
| `src/components/ui/animations/Card3DTilt.tsx` | Create | 2 |
| `src/components/ui/animations/RevealOnScroll.tsx` | Create | 2 |
| `src/components/ui/animations/TypewriterGreeting.tsx` | Create | 2 |
| `src/components/ui/animations/CopperDivider.tsx` | Create | 2 |
| `src/components/ui/animations/ScrollProgressBar.tsx` | Create | 2 |
| `src/components/ui/animations/MoodEmojiPop.tsx` | Create | 2 |
| `src/components/ui/animations/MagneticButton.tsx` | Create | 2 |
| `src/components/ui/animations/index.ts` | Create (barrel export) | 2 |
| `src/hooks/use-3d-tilt.ts` | Create | 2 |
| `src/hooks/use-intersection-reveal.ts` | Create | 2 |

### UI Primitives (Phase 3) — 25 files

| File | Action | Phase |
|------|--------|-------|
| `src/components/ui/button.tsx` | Modify | 3 |
| `src/components/ui/card.tsx` | Modify | 3 |
| `src/components/ui/input.tsx` | Modify | 3 |
| `src/components/ui/textarea.tsx` | Modify | 3 |
| `src/components/ui/select.tsx` | Modify | 3 |
| `src/components/ui/badge.tsx` | Modify | 3 |
| `src/components/ui/dialog.tsx` | Modify | 3 |
| `src/components/ui/sheet.tsx` | Modify | 3 |
| `src/components/ui/tabs.tsx` | Modify | 3 |
| `src/components/ui/progress.tsx` | Modify | 3 |
| `src/components/ui/skeleton.tsx` | Modify | 3 |
| `src/components/ui/accordion.tsx` | Modify | 3 |
| `src/components/ui/separator.tsx` | Modify | 3 |
| `src/components/ui/switch.tsx` | Modify | 3 |
| `src/components/ui/checkbox.tsx` | Modify | 3 |
| `src/components/ui/radio-group.tsx` | Modify | 3 |
| `src/components/ui/dropdown-menu.tsx` | Modify | 3 |
| `src/components/ui/alert.tsx` | Modify | 3 |
| `src/components/ui/alert-dialog.tsx` | Modify | 3 |
| `src/components/ui/form.tsx` | Modify | 3 |
| `src/components/ui/label.tsx` | Modify | 3 |
| `src/components/ui/logo.tsx` | Modify | 3 |
| `src/components/ui/date-select.tsx` | Modify | 3 |
| `src/components/ui/sonner.tsx` | Modify | 3 |
| `src/components/ui/avatar.tsx` | Modify | 3 |

### Layout (Phase 4)

| File | Action | Phase |
|------|--------|-------|
| `src/components/layouts/main-layout-client.tsx` | Rewrite | 4 |
| `src/app/(main)/layout.tsx` | Modify (add ambient layers) | 4 |
| `src/app/layout.tsx` | Modify (if not done in Phase 1) | 4 |

### Dashboard (Phase 5) — 15 files

| File | Action | Phase |
|------|--------|-------|
| `src/components/dashboard/DashboardClient.tsx` | Rewrite | 5 |
| `src/components/dashboard/DashboardHeader.tsx` | Rewrite | 5 |
| `src/components/dashboard/dad-journey/MoodCheckinCard.tsx` | Rewrite | 5 |
| `src/components/dashboard/dad-journey/MoodCheckinWidget.tsx` | Rewrite | 5 |
| `src/components/dashboard/BriefingTeaserCard.tsx` | Modify | 5 |
| `src/components/dashboard/TasksDueCard.tsx` | Modify | 5 |
| `src/components/dashboard/dad-journey/OnYourMindCard.tsx` | Modify | 5 |
| `src/components/dashboard/dad-journey/DadChallengeTile.tsx` | Modify | 5 |
| `src/components/dashboard/dad-journey/DadChallengeTiles.tsx` | Modify | 5 |
| `src/components/dashboard/QuickActionsBar.tsx` | Modify | 5 |
| `src/components/dashboard/PersonalizeCard.tsx` | Modify | 5 |
| `src/components/dashboard/InvitePartnerCard.tsx` | Modify | 5 |
| `src/components/dashboard/BudgetSnapshotCard.tsx` | Modify | 5 |
| `src/components/dashboard/ChecklistProgressCard.tsx` | Modify | 5 |
| `src/components/dashboard/UpgradePromptCard.tsx` | Modify | 5 |

### Briefings (Phase 6) — 10 files

| File | Action | Phase |
|------|--------|-------|
| `src/components/briefings/BriefingHero.tsx` | Rewrite | 6 |
| `src/components/briefings/BriefingSection.tsx` | Modify | 6 |
| `src/components/briefings/BriefingProgressBar.tsx` | Modify | 6 |
| `src/components/briefings/QuickStats.tsx` | Modify | 6 |
| `src/components/briefings/RelatedTasks.tsx` | Modify | 6 |
| `src/components/briefings/BriefingLinkedTasks.tsx` | Modify | 6 |
| `src/components/briefings/DadFocusList.tsx` | Modify | 6 |
| `src/components/briefings/BabySizeCard.tsx` | Modify | 6 |
| `src/app/(main)/briefing/page.tsx` | Modify | 6 |
| `src/app/(main)/briefing/[weekId]/page.tsx` | Modify | 6 |

### Tasks (Phase 7) — 20 files

| File | Action | Phase |
|------|--------|-------|
| `src/components/tasks/tasks-page-client.tsx` | Rewrite | 7 |
| `src/components/tasks/tasks-header.tsx` | Modify | 7 |
| `src/components/tasks/task-section.tsx` | Modify | 7 |
| `src/components/tasks/focus-card.tsx` | Modify | 7 |
| `src/components/tasks/todays-focus-card.tsx` | Modify | 7 |
| `src/components/tasks/week-task-card.tsx` | Modify | 7 |
| `src/components/tasks/task-item.tsx` | Modify | 7 |
| `src/components/tasks/task-detail-sheet.tsx` | Modify | 7 |
| `src/components/tasks/progress-card.tsx` | Modify | 7 |
| `src/components/tasks/progress-header.tsx` | Modify | 7 |
| `src/components/tasks/progress-stats.tsx` | Modify | 7 |
| `src/components/tasks/stats-bar.tsx` | Modify | 7 |
| `src/components/tasks/filter-bar.tsx` | Modify | 7 |
| `src/components/tasks/coming-up-preview.tsx` | Modify | 7 |
| `src/components/tasks/catch-up-banner.tsx` | Modify | 7 |
| `src/components/tasks/catch-up-section.tsx` | Modify | 7 |
| `src/components/tasks/catch-up-task-item.tsx` | Modify | 7 |
| `src/components/tasks/streak-banner.tsx` | Modify | 7 |
| `src/components/tasks/animations/task-animations.tsx` | Modify | 7 |
| `src/components/tasks/animations/confetti.tsx` | Modify | 7 |

### Landing Page (Phase 8) — 11 files

| File | Action | Phase |
|------|--------|-------|
| `src/components/marketing/Header.tsx` | Rewrite | 8 |
| `src/components/marketing/Hero.tsx` | Rewrite | 8 |
| `src/components/marketing/Features.tsx` | Modify | 8 |
| `src/components/marketing/HowItWorks.tsx` | Modify | 8 |
| `src/components/marketing/ProblemSolution.tsx` | Modify | 8 |
| `src/components/marketing/Pricing.tsx` | Modify | 8 |
| `src/components/marketing/Testimonials.tsx` | Modify | 8 |
| `src/components/marketing/FinalCTA.tsx` | Modify | 8 |
| `src/components/marketing/Footer.tsx` | Modify | 8 |
| `src/app/(marketing)/page.tsx` | Modify | 8 |
| `src/app/(marketing)/layout.tsx` | Modify | 8 |

### Onboarding & Upgrade (Phase 9) — 9 files

| File | Action | Phase |
|------|--------|-------|
| `src/app/(auth)/onboarding/page.tsx` | Modify | 9 |
| `src/app/(auth)/onboarding/role/page.tsx` | Modify | 9 |
| `src/app/(auth)/onboarding/family/page.tsx` | Modify | 9 |
| `src/app/(auth)/onboarding/ready/page.tsx` | Modify | 9 |
| `src/app/(auth)/login/page.tsx` | Modify | 9 |
| `src/app/(auth)/signup/page.tsx` | Modify | 9 |
| `src/app/(public)/upgrade/page.tsx` | Modify | 9 |
| `src/components/shared/paywall-overlay.tsx` | Modify | 9 |
| `src/components/shared/paywall-banner.tsx` | Modify | 9 |

### Budget & Checklists (Phase 10) — 5 files

| File | Action | Phase |
|------|--------|-------|
| `src/app/(main)/budget/page.tsx` | Modify | 10 |
| `src/components/budget/ProductExamplesDrawer.tsx` | Modify | 10 |
| `src/components/budget/TierFilter.tsx` | Modify | 10 |
| `src/app/(main)/checklists/page.tsx` | Modify | 10 |
| `src/app/(main)/checklists/[id]/page.tsx` | Modify | 10 |

### Journey & Tracker (Phase 11) — 7 files

| File | Action | Phase |
|------|--------|-------|
| `src/app/(main)/journey/page.tsx` | Modify | 11 |
| `src/components/dashboard/dad-journey/DadChallengeTile.tsx` | Modify (if not done in Phase 5) | 11 |
| `src/components/dashboard/dad-journey/DadChallengeTiles.tsx` | Modify (if not done in Phase 5) | 11 |
| `src/app/(main)/tracker/page.tsx` | Modify | 11 |
| `src/app/(main)/tracker/log/page.tsx` | Modify | 11 |
| `src/app/(main)/tracker/history/page.tsx` | Modify | 11 |
| `src/app/(main)/tracker/summary/page.tsx` | Modify | 11 |

### Settings & Resources (Phase 12) — 15 files

| File | Action | Phase |
|------|--------|-------|
| `src/app/(main)/settings/page.tsx` | Modify | 12 |
| `src/app/(main)/settings/profile/page.tsx` | Modify | 12 |
| `src/app/(main)/settings/family/page.tsx` | Modify | 12 |
| `src/app/(main)/settings/appearance/page.tsx` | Modify | 12 |
| `src/app/(main)/settings/notifications/page.tsx` | Modify | 12 |
| `src/app/(main)/settings/subscription/page.tsx` | Modify | 12 |
| `src/app/(marketing)/resources/page.tsx` | Modify | 12 |
| `src/app/(marketing)/resources/articles/[slug]/page.tsx` | Modify | 12 |
| `src/components/marketing/ResourceLibrary.tsx` | Modify | 12 |
| `src/components/marketing/ArticleCard.tsx` | Modify | 12 |
| `src/components/marketing/VideoCard.tsx` | Modify | 12 |
| `src/components/marketing/ArticleContent.tsx` | Modify | 12 |
| `src/components/marketing/ContentPreview.tsx` | Modify | 12 |
| `src/components/marketing/ContentFilters.tsx` | Modify | 12 |
| `src/app/offline/page.tsx` | Modify | 12 |

### Shared Components (touched during various phases)

| File | Action | Phase |
|------|--------|-------|
| `src/components/shared/partner-activity.tsx` | Modify | 5 |
| `src/components/shared/shift-change-view.tsx` | Modify | 5 |
| `src/components/shared/task-timeline-bar.tsx` | Modify | 7 |
| `src/components/shared/budget-timeline-bar.tsx` | Modify | 10 |
| `src/components/marketing/PaywallGate.tsx` | Modify | 9 |
| `src/components/error/error-boundary.tsx` | Modify | 12 |
| `src/components/error/loading-states.tsx` | Modify | 12 |
| `src/components/providers.tsx` | Possibly modify | 1 |
| `src/components/user-provider.tsx` | No change | — |

### Total File Count

| Category | Files | New | Modified |
|----------|-------|-----|----------|
| Config | 4 | 0 | 4 |
| Animations (new) | 13 | 13 | 0 |
| UI Primitives | 25 | 0 | 25 |
| Layout | 3 | 0 | 3 |
| Dashboard | 15 | 0 | 15 |
| Briefings | 10 | 0 | 10 |
| Tasks | 20 | 0 | 20 |
| Landing Page | 11 | 0 | 11 |
| Onboarding/Upgrade | 9 | 0 | 9 |
| Budget/Checklists | 5 | 0 | 5 |
| Journey/Tracker | 7 | 0 | 7 |
| Settings/Resources | 15 | 0 | 15 |
| Shared | 8 | 0 | 8 |
| **Total** | **~145** | **13** | **~132** |

---

## 7. Class Migration Table

### Color Classes

| Current (V1) | New (Warm Luxury) | Notes |
|---------------|-------------------|-------|
| `bg-surface-950` | `bg-[--bg]` | Page background |
| `bg-surface-900` | `bg-[--surface]` | Header, nav, elevated |
| `bg-surface-800` | `bg-[--card]` | Cards, inputs |
| `bg-surface-700` | `bg-[--card-hover]` | Hover states |
| `border-surface-800` | `border-[--border]` | Default border |
| `border-surface-700` | `border-[--border-hover]` | Hover border |
| `text-surface-300` | `text-[--cream]` | Primary text |
| `text-surface-400` | `text-[--muted]` | Secondary text |
| `text-surface-500` | `text-[--dim]` | Muted labels |
| `text-accent-500` | `text-copper` | Active nav, links |
| `text-accent-400` | `text-copper` | Active sidebar |
| `bg-accent-600/20` | `bg-copper-dim` | Active bg |
| `bg-accent-500` | `bg-copper` | Active solid bg |
| `bg-primary-500` | `bg-copper` | Primary button |
| `bg-primary-600` | `bg-copper-hover` | Primary button hover |

### Font Classes

| Current | New | Usage |
|---------|-----|-------|
| `font-sans` (Inter) | `font-body` (Jost) | Default body text |
| (none) | `font-display` (Playfair) | Headlines, titles |
| (none) | `font-ui` (Karla) | Buttons, labels, nav |
| `font-mono` | `font-mono` (keep) | Code blocks |

### Component Pattern Classes

| Pattern | Before | After |
|---------|--------|-------|
| Card | `bg-surface-800 border-surface-700 rounded-lg` | `bg-[--card] border-[--border] rounded-[--radius] shadow-[--shadow-card]` |
| Button primary | `bg-primary-500 text-white` | `bg-copper text-[--bg] font-ui font-semibold tracking-wide` |
| Button secondary | `bg-surface-800 text-surface-300` | `border border-copper text-copper hover:bg-copper hover:text-[--bg]` |
| Input | `bg-surface-800 border-surface-700 text-surface-200` | `bg-[--card] border-[--border] text-[--cream] font-body focus:border-copper` |
| Badge | `bg-accent-600/20 text-accent-400` | `bg-copper-dim text-copper font-ui text-xs` |
| Nav active | `text-accent-500` | `text-copper` |
| Nav inactive | `text-surface-400` | `text-[--muted]` |
| Section header | `text-xs uppercase tracking-wider text-surface-500` | `font-ui font-semibold text-[11px] uppercase tracking-[0.2em] text-copper` |
| Separator | `border-surface-800` | `border-[--border]` |

### Tailwind Custom Classes (add to config or globals.css)

```
/* Utility classes to add */
.card-copper-top { border-top: 2px solid var(--copper); }
.card-gold-top { border-top: 2px solid var(--gold); }
.card-sage-top { border-top: 2px solid var(--sage); }
.text-gradient-copper { background: linear-gradient(135deg, var(--copper), var(--gold)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.shadow-card { box-shadow: var(--shadow-card); }
.shadow-hover { box-shadow: var(--shadow-hover); }
.shadow-lift { box-shadow: var(--shadow-lift); }
.shadow-copper { box-shadow: var(--shadow-copper); }
.shadow-gold { box-shadow: var(--shadow-gold); }
```

---

## 8. Verification Checklist

### Per-Phase Checks

#### Phase 1: Foundation
- [ ] `npm run build` passes with zero errors
- [ ] All 3 fonts load (check Network tab for Playfair Display, Jost, Karla)
- [ ] Body background is `#12100e` (warm dark, not blue-dark)
- [ ] Text is cream (`#ede6dc`), not white
- [ ] `--radius` is 12px (check card corners)
- [ ] No flash of Inter font on page load

#### Phase 2: Animations
- [ ] `FloatingParticles` renders 8-12 particles moving upward
- [ ] `WarmBackground` shows subtle radial gradient + noise
- [ ] Particles disabled when `prefers-reduced-motion: reduce`
- [ ] No layout shift from animation components
- [ ] `use-3d-tilt` hook works on desktop (tilt on hover)

#### Phase 3: Primitives
- [ ] Button primary: copper background, dark text
- [ ] Card: warm card bg, subtle border, shadow on hover
- [ ] Input: warm card bg, copper focus ring, 16px font (no iOS zoom)
- [ ] Badge variants: copper, gold, sage, coral, sky
- [ ] Dialog/Sheet: correct warm colors
- [ ] Toast: copper accent

#### Phase 4: Navigation
- [ ] Header: 60px height, Playfair brand, copper notification icon
- [ ] Bottom nav: sliding copper indicator on active tab
- [ ] Nav indicator follows hover and springs to active on leave
- [ ] More drawer: sections with proper labels
- [ ] Desktop sidebar: renders on md+ breakpoint
- [ ] Items: Home, Tasks, Briefing, Tracker, More (5 tabs)
- [ ] Active state: copper icon + label

#### Phase 5: Dashboard
- [ ] Typewriter greeting animates on load
- [ ] Copper divider draws after greeting
- [ ] Cards stagger-entrance (dealt from deck)
- [ ] Mood emojis have 3D pop on hover
- [ ] Briefing week number rotates slowly
- [ ] Card titles have copper underline that expands on hover

#### Phase 6: Briefings
- [ ] Scroll progress bar (copper→gold) tracks scroll
- [ ] Reading time badge appears after scroll start
- [ ] Sections reveal on scroll with stagger
- [ ] Inline tasks have copper checkboxes
- [ ] Week navigation works (← →)

#### Phase 7: Tasks
- [ ] Phase timeline with sliding indicator
- [ ] Task items: copper checkbox, warm card bg
- [ ] Scroll ring (bottom-right) appears on scroll
- [ ] Two-column layout on desktop
- [ ] Focus card has copper left border
- [ ] Completion confetti uses copper/gold colors

#### Phase 8: Landing Page
- [ ] Full-height hero with Playfair Display headline
- [ ] Sections reveal on scroll
- [ ] Feature cards have 3D tilt (desktop)
- [ ] Pricing matches: $4.99/mo, $39.99/yr, $99.99 lifetime
- [ ] CTA buttons have magnetic effect
- [ ] Scroll progress bar at top
- [ ] Floating particles visible

#### Phase 9: Onboarding
- [ ] Role selection cards have 3D tilt
- [ ] Progress steps show copper fill
- [ ] Form inputs warm-themed
- [ ] Upgrade page shows correct pricing
- [ ] Paywall overlay has blurred backdrop
- [ ] Ambient mesh blobs drift behind content

#### Phase 10: Budget & Checklists
- [ ] Budget cards with gold accent
- [ ] Tabular numbers aligned
- [ ] Checklist items with copper checkboxes
- [ ] Card entrance animations present

#### Phase 11: Journey & Tracker
- [ ] 7 pillar cards with correct color borders
- [ ] Tiles expandable with accordion animation
- [ ] Tracker log form warm-themed
- [ ] History timeline with copper dots

#### Phase 12: Settings & Resources
- [ ] All settings pages warm-themed
- [ ] Article cards have 3D tilt
- [ ] Content readable (Jost body text)

#### Phase 13: Polish
- [ ] No light mode CSS remains
- [ ] `prefers-reduced-motion` disables all animations
- [ ] Lighthouse performance > 90
- [ ] All 42 pages render without error
- [ ] Safe area insets work on notched devices
- [ ] Touch targets ≥ 44px
- [ ] No horizontal overflow on any page
- [ ] Pricing: $4.99/$39.99/$99.99 correct everywhere
- [ ] Branding: "The Dad Center" (not "ParentLogs") everywhere

### Cross-Cutting Checks
- [ ] Typography hierarchy: Display → Body → UI consistent on all pages
- [ ] Color consistency: no remnants of old blue/teal/indigo palette
- [ ] Animation consistency: all cards use CardEntrance, all sections use RevealOnScroll
- [ ] Border consistency: all borders use `--border` / `--border-hover`
- [ ] Shadow consistency: all cards use `--shadow-card`, hover uses `--shadow-hover`

---

## Phase Dependency Graph

```
Phase 1 (Foundation) ──→ Phase 2 (Animations) ──→ Phase 3 (Primitives) ──→ Phase 4 (Layout)
                                                                              │
                                                    ┌─────────────────────────┤
                                                    ↓                         ↓
                                                Phase 5 (Dashboard)     Phase 8 (Landing)
                                                    │                         │
                                                    ↓                         ↓
                                     ┌──────────────┼──────────────┐    Phase 9 (Onboarding)
                                     ↓              ↓              ↓
                               Phase 6          Phase 7       Phase 10
                              (Briefings)       (Tasks)    (Budget/Checklists)
                                                    │
                                                    ↓
                                              Phase 11
                                           (Journey/Tracker)
                                                    │
                                                    ↓
                                              Phase 12
                                          (Settings/Resources)
                                                    │
                                                    ↓
                                              Phase 13
                                               (Polish)
```

**Parallelizable after Phase 4:**
- Phases 5, 6, 7, 8, 9, 10, 11 can all run in parallel (they share primitives but don't depend on each other)
- Phase 12 can run alongside 5-11
- Phase 13 must be last

---

## Quick Start for Future Claude Session

```
You are implementing the "Warm Luxury Editorial" visual redesign for The Dad Center.

Read: docs/redesign-implementation-plan.md (this file)
Reference mockups: docs/mockups/redesign_diff_4/ (5 files) and docs/mockups/redesign_diff_3/ (2 fallbacks)

Start with Phase 1 (Foundation), then Phase 2 (Animations), then Phase 3 (Primitives), then Phase 4 (Layout).
After Phase 4, phases 5-12 can be parallelized.
Phase 13 (Polish) is last.

Key principle: Every color, font, shadow, and radius should come from CSS custom properties defined in globals.css.
The Tailwind config maps semantic tokens to these CSS variables.
All animations should respect prefers-reduced-motion.
```
