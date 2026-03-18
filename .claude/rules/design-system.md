---
description: Warm Luxury Editorial design system - colors, fonts, animations, CSS
globs: src/components/**, src/app/**/globals.css, src/components/ui/animations/**
---

# Design System — "Warm Luxury Editorial"

## Color Palette (CSS Custom Properties)

**Core Surfaces (dark theme):**
- `--bg`: #12100e (page background)
- `--surface`: #1a1714 (header, sidebar, nav)
- `--card`: #201c18 (cards)
- `--card-hover`: #282420

**Text:**
- `--white`: #faf6f0 (headings)
- `--cream`: #ede6dc (body text)
- `--muted`: #7a6f62 (secondary text)
- `--dim`: #4a4239 (tertiary/disabled)

**Accent Colors:**
- `--copper`: #c4703f (primary accent, CTAs, active states)
- `--gold`: #d4a853 (premium, highlights)
- `--sage`: #6b8f71 (success, completed)
- `--coral`: #d4836b (warnings, destructive)
- `--sky`: #5b9bd5 (info, links)
- `--rose`: #c47a8f (pregnancy-related)

Each accent has a `-dim` variant (15% opacity) and `-glow` variant (25% opacity).

**Borders & Shadows:**
- `--border`: rgba(237, 230, 220, 0.08)
- `--border-hover`: rgba(237, 230, 220, 0.15)
- `--shadow-card`, `--shadow-hover`, `--shadow-lift`, `--shadow-copper`, `--shadow-gold`

## Font Usage
- `font-display` — Playfair Display: headings, hero text, card titles
- `font-body` — Jost: body text, descriptions, paragraphs
- `font-ui` — Karla: buttons, labels, badges, nav items, stats

## Animation Components (`src/components/ui/animations/`)

All pages use these animation wrappers for visual consistency:

| Component | Purpose | Usage |
|-----------|---------|-------|
| `Card3DTilt` | 3D mouse-follow tilt with gloss overlay | Wrap any card (`maxTilt={3-4}`, `gloss`) |
| `RevealOnScroll` | IntersectionObserver fade-up on scroll | Wrap sections (`delay={ms}`) |
| `CardEntrance` | "Dealt from deck" perspective+rotateX entrance | Wrap cards with stagger (`delay={index * 120}`) |
| `TypewriterGreeting` | Character-by-character typing with copper cursor | Dashboard greeting |
| `CopperDivider` | Animated line draw with traveling glow tip | After TypewriterGreeting |
| `ScrollProgressBar` | Copper-to-gold gradient progress bar at top | Marketing pages |
| `MagneticButton` | Slight translate toward cursor on hover | CTAs on marketing pages |
| `WarmBackground` | Radial gradients + noise texture overlay | Page backgrounds |
| `FloatingParticles` | CSS-animated copper/gold particles | Page backgrounds |
| `MoodEmojiPop` | 3D emoji selection with ripple | Mood check-in |

## CSS Keyframes (in `globals.css`)
- `subtitleGradient` — Animated gradient for hero subtitles
- `featuredFloat` — Floating animation for featured pricing card
- `iconPulse` — Pulsing opacity for feature icons
- `ctaGlowBreath` — Breathing glow for CTA backgrounds
- `pulseRingExpand` — Ring expansion animation
- `quoteRotate` — Slow 360deg rotation for decorative quote marks

## Utility Classes
- `.section-pre` — Section pre-label with `::after` copper line (60px)
- `.card-*-top` — Colored top border accents (copper, gold, sage, coral, sky, rose)
- `.text-gradient-copper` — Copper-to-gold gradient text
