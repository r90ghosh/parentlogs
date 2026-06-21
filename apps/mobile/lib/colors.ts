export interface ColorTokens {
  // Backgrounds
  bg: string
  surface: string
  card: string
  cardHover: string

  // Text (legacy semantic names — retuned to the warm v2 palette)
  textPrimary: string
  textSecondary: string
  textMuted: string
  textDim: string

  // Accents
  copper: string
  copperDim: string
  copperGlow: string
  gold: string
  goldDim: string
  goldGlow: string
  sage: string
  sageDim: string
  coral: string
  coralDim: string
  sky: string
  skyDim: string
  rose: string
  roseDim: string
  purple: string
  purpleDim: string

  // Borders
  border: string
  borderHover: string

  // Surfaces / overlays
  glassBg: string
  glassBorder: string
  overlay: string
  pressed: string
  subtleBg: string
  pillBg: string

  // Gradients
  bgGradient: readonly [string, string, string]
  ctaGradient: readonly [string, string]

  // Blur
  blurTint: 'dark' | 'light' | 'systemChromeMaterialDark' | 'systemChromeMaterialLight'
  blurIntensity: number
  headerBlurIntensity: number

  // Glass
  glassInnerBorder: string

  // ── V2 Digest tokens (§1.2) ──────────────────────────────────────────
  // Near-monochrome warm canvas + one clay accent. New screens use these.
  ink: string        // primary text
  ink2: string       // secondary / detail body
  muted: string      // tertiary / sub labels
  faint: string      // hairline-level text, chevrons
  line: string       // borders
  line2: string      // row separators
  accent: string     // the one accent (progress, primary)
  accentInk: string  // accent text (links)
  accentSoft: string // accent tint bg (field note)
  // tiny desaturated scanning dots
  dotBaby: string
  dotHer: string
  dotDo: string
  dotTip: string
  dotNext: string
}

const dark: ColorTokens = {
  // Pure Flat OLED black (§A finalized 2026-06-20, "Black A" mockup): true #000
  // canvas, flat rows + hairline dividers, neutral greys, single clay accent.
  // Reference: docs/briefing-black-a-flat.html
  bg: '#000000',
  surface: '#0a0a0b',
  card: '#101012',
  cardHover: '#1a1a1c',

  textPrimary: '#f4f4f6',
  textSecondary: '#a0a0a6',
  textMuted: '#7c7c82',
  textDim: '#56565b',

  copper: '#d2814e',
  copperDim: 'rgba(210,129,78,0.15)',
  copperGlow: 'rgba(210,129,78,0.25)',
  gold: '#d4a853',
  goldDim: 'rgba(212,168,83,0.15)',
  goldGlow: 'rgba(212,168,83,0.25)',
  sage: '#6b8f71',
  sageDim: 'rgba(107,143,113,0.15)',
  coral: '#d4836b',
  coralDim: 'rgba(212,131,107,0.15)',
  sky: '#5b9bd5',
  skyDim: 'rgba(91,155,213,0.15)',
  rose: '#c47a8f',
  roseDim: 'rgba(196,122,143,0.15)',
  purple: '#9b7fd4',
  purpleDim: 'rgba(155,127,212,0.15)',

  border: 'rgba(255,255,255,0.08)',
  borderHover: 'rgba(255,255,255,0.16)',

  glassBg: 'rgba(16,16,18,0.92)',
  glassBorder: 'rgba(255,255,255,0.08)',
  overlay: 'rgba(0,0,0,0.65)',
  pressed: 'rgba(255,255,255,0.05)',
  subtleBg: 'rgba(255,255,255,0.06)',
  pillBg: 'rgba(26,26,28,0.9)',

  bgGradient: ['#000000', '#000000', '#000000'],
  ctaGradient: ['#d2814e', '#bf6f3c'],

  blurTint: 'systemChromeMaterialDark',
  blurIntensity: 50,
  headerBlurIntensity: 60,

  glassInnerBorder: 'rgba(255,255,255,0.08)',

  // V2 Digest — Pure Flat OLED black
  ink: '#f4f4f6',
  ink2: '#a0a0a6',
  muted: '#7c7c82',
  faint: '#56565b',
  line: 'rgba(255,255,255,0.07)',
  line2: 'rgba(255,255,255,0.045)',
  accent: '#d2814e',
  accentInk: '#e2965f',
  accentSoft: 'rgba(210,129,78,0.10)',
  dotBaby: '#7fa8cc',
  dotHer: '#c99bb0',
  dotDo: '#d2814e',
  dotTip: '#bba876',
  dotNext: '#8db199',
}

const light: ColorTokens = {
  bg: '#f6f5f2',
  surface: '#ffffff',
  card: '#ffffff',
  cardHover: '#f2f0eb',

  textPrimary: '#1e1c19',
  textSecondary: '#56524b',
  textMuted: '#928d84',
  textDim: '#b6b1a8',

  copper: '#c0673d',
  copperDim: 'rgba(192,103,61,0.12)',
  copperGlow: 'rgba(192,103,61,0.20)',
  gold: '#9c8a56',
  goldDim: 'rgba(156,138,86,0.12)',
  goldGlow: 'rgba(156,138,86,0.20)',
  sage: '#6f9079',
  sageDim: 'rgba(111,144,121,0.12)',
  coral: '#c0673d',
  coralDim: 'rgba(192,103,61,0.12)',
  sky: '#5e86a8',
  skyDim: 'rgba(94,134,168,0.12)',
  rose: '#b07c93',
  roseDim: 'rgba(176,124,147,0.12)',
  purple: '#9b7fd4',
  purpleDim: 'rgba(155,127,212,0.12)',

  border: 'rgba(30,28,25,0.08)',
  borderHover: 'rgba(30,28,25,0.14)',

  glassBg: 'rgba(255,255,255,0.7)',
  glassBorder: 'rgba(234,231,225,0.6)',
  overlay: 'rgba(0,0,0,0.3)',
  pressed: 'rgba(30,28,25,0.04)',
  subtleBg: 'rgba(30,28,25,0.04)',
  pillBg: 'rgba(255,255,255,0.8)',

  bgGradient: ['#f6f5f2', '#f1efea', '#f6f5f2'],
  ctaGradient: ['#c0673d', '#a8542e'],

  blurTint: 'systemChromeMaterialLight',
  blurIntensity: 60,
  headerBlurIntensity: 50,

  glassInnerBorder: 'rgba(255,255,255,0.30)',

  // V2 Digest (warm paper)
  ink: '#1e1c19',
  ink2: '#56524b',
  muted: '#928d84',
  faint: '#b6b1a8',
  line: '#eae7e1',
  line2: '#f2f0eb',
  accent: '#c0673d',
  accentInk: '#a8542e',
  accentSoft: '#f4e8e0',
  dotBaby: '#5e86a8',
  dotHer: '#b07c93',
  dotDo: '#c0673d',
  dotTip: '#9c8a56',
  dotNext: '#6f9079',
}

export const themes = { dark, light } as const
