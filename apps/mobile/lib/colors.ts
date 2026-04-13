export interface ColorTokens {
  // Backgrounds
  bg: string
  surface: string
  card: string
  cardHover: string

  // Text
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
}

const dark: ColorTokens = {
  bg: '#12100e',
  surface: '#1a1714',
  card: '#201c18',
  cardHover: '#282420',

  textPrimary: '#faf6f0',
  textSecondary: '#ede6dc',
  textMuted: '#7a6f62',
  textDim: '#4a4239',

  copper: '#c4703f',
  copperDim: 'rgba(196,112,63,0.15)',
  copperGlow: 'rgba(196,112,63,0.25)',
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

  border: 'rgba(237,230,220,0.08)',
  borderHover: 'rgba(237,230,220,0.15)',

  glassBg: 'rgba(32,28,24,0.92)',
  glassBorder: 'rgba(237,230,220,0.08)',
  overlay: 'rgba(0,0,0,0.6)',
  pressed: 'rgba(237,230,220,0.04)',
  subtleBg: 'rgba(237,230,220,0.06)',
  pillBg: 'rgba(42,38,34,0.9)',

  bgGradient: ['#12100e', '#1a1714', '#12100e'],
  ctaGradient: ['#c4703f', '#d4a853'],

  blurTint: 'systemChromeMaterialDark',
  blurIntensity: 65,
  headerBlurIntensity: 80,

  glassInnerBorder: 'rgba(255,255,255,0.08)',
}

const light: ColorTokens = {
  bg: '#f5f7fa',
  surface: '#ffffff',
  card: '#ffffff',
  cardHover: '#f0f0f5',

  textPrimary: '#1a1a2e',
  textSecondary: '#3d3d56',
  textMuted: '#6b7280',
  textDim: '#9ca3af',

  copper: '#c4703f',
  copperDim: 'rgba(196,112,63,0.12)',
  copperGlow: 'rgba(196,112,63,0.20)',
  gold: '#d4a853',
  goldDim: 'rgba(212,168,83,0.12)',
  goldGlow: 'rgba(212,168,83,0.20)',
  sage: '#6b8f71',
  sageDim: 'rgba(107,143,113,0.12)',
  coral: '#d4836b',
  coralDim: 'rgba(212,131,107,0.12)',
  sky: '#5b9bd5',
  skyDim: 'rgba(91,155,213,0.12)',
  rose: '#c47a8f',
  roseDim: 'rgba(196,122,143,0.12)',
  purple: '#9b7fd4',
  purpleDim: 'rgba(155,127,212,0.12)',

  border: 'rgba(0,0,0,0.06)',
  borderHover: 'rgba(0,0,0,0.12)',

  glassBg: 'rgba(255,255,255,0.42)',
  glassBorder: 'rgba(255,255,255,0.55)',
  overlay: 'rgba(0,0,0,0.3)',
  pressed: 'rgba(0,0,0,0.04)',
  subtleBg: 'rgba(0,0,0,0.04)',
  pillBg: 'rgba(255,255,255,0.7)',

  bgGradient: ['#f5f7fa', '#eef2f7', '#f5f7fa'],
  ctaGradient: ['#c4703f', '#d4a853'],

  blurTint: 'systemChromeMaterialLight',
  blurIntensity: 80,
  headerBlurIntensity: 60,

  glassInnerBorder: 'rgba(255,255,255,0.30)',
}

export const themes = { dark, light } as const
