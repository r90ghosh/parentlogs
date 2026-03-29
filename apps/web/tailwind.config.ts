import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // shadcn/ui compat — maps to warm luxury CSS variables
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
        destructive: {
          DEFAULT: "var(--coral)",
          foreground: "var(--white)",
        },
        muted: {
          DEFAULT: "var(--dim)",
          foreground: "var(--muted)",
        },
        accent: {
          DEFAULT: "var(--copper-dim)",
          foreground: "var(--copper)",
          // Numbered scale mapped to copper tones for backward compat
          50: 'rgba(196, 112, 63, 0.05)',
          100: 'rgba(196, 112, 63, 0.08)',
          200: 'rgba(196, 112, 63, 0.12)',
          300: '#d4956e',
          400: '#d47d4a',
          500: '#c4703f',
          600: '#a85f35',
          700: '#8c4e2c',
          800: '#703f24',
          900: '#54301c',
          950: '#3a2113',
        },
        popover: {
          DEFAULT: "var(--card)",
          foreground: "var(--cream)",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--cream)",
        },

        // Warm Luxury semantic tokens
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

        // Surface scale — warm dark tones (backward compat for bg-surface-NNN)
        surface: {
          DEFAULT: "#1a1714",
          50: '#faf6f0',
          100: '#ede6dc',
          200: '#ede6dc',
          300: '#ede6dc',
          400: '#7a6f62',
          500: '#7a6f62',
          600: '#4a4239',
          700: '#282420',
          800: '#201c18',
          900: '#1a1714',
          950: '#12100e',
          bg: '#12100e',
          card: '#201c18',
          hover: '#282420',
          dim: '#4a4239',
          muted: '#7a6f62',
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "var(--radius-sm)",
        xs: "var(--radius-xs)",
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
        ui: ['var(--font-ui)', 'system-ui', 'sans-serif'],
        sans: ['var(--font-body)', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'card': 'var(--shadow-card)',
        'card-hover': 'var(--shadow-hover)',
        'lift': 'var(--shadow-lift)',
        'copper': 'var(--shadow-copper)',
        'gold': 'var(--shadow-gold)',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'fade-in-up': 'fade-in-up 0.4s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'pulse-subtle': 'pulseSubtle 2s infinite',
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'float-up': 'float-up var(--duration, 15s) linear infinite',
        'top-line-pulse': 'top-line-pulse 3s ease-in-out infinite',
        'top-line-pulse-gold': 'top-line-pulse-gold 3s ease-in-out infinite',
        'cursor-blink': 'cursor-blink 0.8s step-end infinite',
        'draw-line': 'draw-line 1s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'tip-travel': 'tip-travel 1s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'ripple-out': 'ripple-out 0.6s ease-out forwards',
        'ring-pulse': 'ring-pulse 1.5s ease-out infinite',
        'pulse-dot': 'pulse-dot 2s ease-in-out infinite',
        'flag-cascade': 'flag-cascade 0.3s ease-out forwards',
        'bullet-slide': 'bullet-slide 0.3s ease-out forwards',
        'dot-pop': 'dot-pop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        'mood-bounce': 'mood-bounce 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        'num-spin': 'num-spin 6s ease-in-out infinite',
        'shimmer': 'shimmer 1.5s ease-in-out infinite',
        'mesh-drift-1': 'meshDrift1 20s ease-in-out infinite',
        'mesh-drift-2': 'meshDrift2 25s ease-in-out infinite',
        'scale-in': 'scale-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
      },
      keyframes: {
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-in-up': {
          from: { opacity: '0', transform: 'translateY(6px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'float-up': {
          '0%': { transform: 'translateY(0) translateX(0) scale(1)', opacity: '0' },
          '10%': { opacity: '1' },
          '80%': { opacity: '0.6' },
          '100%': { transform: 'translateY(-110vh) translateX(var(--drift, 20px)) scale(0.4)', opacity: '0' },
        },
        'top-line-pulse': {
          '0%, 100%': { boxShadow: 'none' },
          '50%': { boxShadow: '0 0 12px 2px rgba(196,112,63,0.55), 0 0 4px 1px rgba(196,112,63,0.35)' },
        },
        'top-line-pulse-gold': {
          '0%, 100%': { boxShadow: 'none' },
          '50%': { boxShadow: '0 0 12px 2px rgba(212,168,83,0.55), 0 0 4px 1px rgba(212,168,83,0.35)' },
        },
        'cursor-blink': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        'draw-line': {
          from: { width: '0', opacity: '1' },
          to: { width: '100%', opacity: '1' },
        },
        'tip-travel': {
          '0%': { left: '0%', opacity: '1' },
          '99%': { left: '99%', opacity: '1' },
          '100%': { left: '100%', opacity: '0' },
        },
        'ripple-out': {
          '0%': { transform: 'scale(0)', opacity: '1' },
          '60%': { transform: 'scale(2.5)', opacity: '0.5' },
          '100%': { transform: 'scale(4)', opacity: '0' },
        },
        'ring-pulse': {
          '0%': { transform: 'scale(1)', opacity: '0.7' },
          '100%': { transform: 'scale(1.6)', opacity: '0' },
        },
        'pulse-dot': {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.3)', opacity: '0.7' },
        },
        'flag-cascade': {
          from: { opacity: '0', transform: 'translateX(-16px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        'bullet-slide': {
          from: { opacity: '0', transform: 'translateX(-10px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        'dot-pop': {
          '0%': { transform: 'scale(0)' },
          '60%': { transform: 'scale(1.4)' },
          '100%': { transform: 'scale(1)' },
        },
        'mood-bounce': {
          '0%': { transform: 'translateZ(0) scale(1)' },
          '35%': { transform: 'translateZ(24px) scale(1.25)' },
          '65%': { transform: 'translateZ(10px) scale(0.97)' },
          '100%': { transform: 'translateZ(14px) scale(1.1)' },
        },
        'num-spin': {
          '0%': { transform: 'perspective(200px) rotateY(0deg)' },
          '25%': { transform: 'perspective(200px) rotateY(5deg)' },
          '75%': { transform: 'perspective(200px) rotateY(-5deg)' },
          '100%': { transform: 'perspective(200px) rotateY(0deg)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        meshDrift1: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '50%': { transform: 'translate(80px, 60px)' },
        },
        meshDrift2: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '50%': { transform: 'translate(-60px, -40px)' },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
