import { C } from './colors'
import type { IllustrationProps } from '@tdc/shared/types/tips'

export function CarSeatSection1({ className }: IllustrationProps) {
  return (
    <svg viewBox="0 0 400 220" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Car seat surface — horizontal */}
      <rect x="40" y="140" width="200" height="16" rx="4" fill={C.surface} />
      {/* Car seat backrest — angled */}
      <rect x="40" y="50" width="16" height="100" rx="4" fill={C.surface} transform="rotate(-10 40 50)" />

      {/* Car seat base on the seat */}
      <rect x="100" y="120" width="100" height="22" rx="4" fill={C.object} stroke={C.objectStroke} strokeWidth="2" />
      {/* Base detail ridges */}
      <line x1="125" y1="124" x2="125" y2="138" stroke={C.objectStroke} strokeWidth="1.5" />
      <line x1="150" y1="124" x2="150" y2="138" stroke={C.objectStroke} strokeWidth="1.5" />
      <line x1="175" y1="124" x2="175" y2="138" stroke={C.objectStroke} strokeWidth="1.5" />

      {/* Seatbelt / LATCH path threading through base */}
      <path d="M55 110 L100 125 L200 125 L240 105" stroke={C.action} strokeWidth="2.5" strokeLinecap="round" />
      {/* Latch connector shapes */}
      <circle cx="55" cy="110" r="5" fill={C.action} fillOpacity="0.3" stroke={C.action} strokeWidth="1.5" />
      <circle cx="240" cy="105" r="5" fill={C.action} fillOpacity="0.3" stroke={C.action} strokeWidth="1.5" />

      {/* Double-headed horizontal arrow below base — "less than 1 inch" */}
      <line x1="115" y1="165" x2="185" y2="165" stroke={C.action} strokeWidth="2" strokeLinecap="round" />
      <path d="M115 165 L123 160 L123 170 Z" fill={C.action} />
      <path d="M185 165 L177 160 L177 170 Z" fill={C.action} />

      {/* Hand pressing down on base */}
      <rect x="140" y="98" width="22" height="12" rx="6" fill={C.dadHead} />
      {/* Downward arrow from hand */}
      <path d="M151 112 L151 120" stroke={C.action} strokeWidth="2" strokeLinecap="round" />
      <path d="M151 120 L147 115 L155 115 Z" fill={C.action} />

      {/* Dashed focus ring on the movement check area */}
      <rect x="95" y="155" width="110" height="22" rx="6" stroke={C.action} strokeWidth="2" strokeDasharray="4 3" fill="none" />
    </svg>
  )
}

export function CarSeatSection2({ className }: IllustrationProps) {
  return (
    <svg viewBox="0 0 400 220" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Car seat — bucket shape front view */}
      <path d="M120 30 Q100 30 90 60 L80 180 Q80 195 100 195 L300 195 Q320 195 320 180 L310 60 Q300 30 280 30 Z" fill="none" stroke={C.object} strokeWidth="2" />
      {/* Seat interior */}
      <path d="M130 40 Q115 40 108 65 L100 175 Q100 185 115 185 L285 185 Q300 185 300 175 L292 65 Q285 40 270 40 Z" fill={C.surface} fillOpacity="0.3" />

      {/* Baby figure inside seat */}
      <circle cx="200" cy="75" r="10" fill={C.baby} />
      <circle cx="197" cy="74" r="1" fill="#92400e" />
      <circle cx="203" cy="74" r="1" fill="#92400e" />
      <ellipse cx="200" cy="105" rx="10" ry="18" fill={C.baby} />

      {/* Harness straps over shoulders */}
      <line x1="188" y1="85" x2="180" y2="120" stroke={C.object} strokeWidth="2.5" strokeLinecap="round" />
      <line x1="212" y1="85" x2="220" y2="120" stroke={C.object} strokeWidth="2.5" strokeLinecap="round" />
      {/* Straps converging to chest clip */}
      <line x1="180" y1="120" x2="200" y2="130" stroke={C.object} strokeWidth="2.5" strokeLinecap="round" />
      <line x1="220" y1="120" x2="200" y2="130" stroke={C.object} strokeWidth="2.5" strokeLinecap="round" />
      {/* Chest clip */}
      <rect x="194" y="126" width="12" height="8" rx="2" fill={C.object} stroke={C.objectStroke} strokeWidth="1.5" />

      {/* Teal dashed focus ring at chest clip — armpit level */}
      <circle cx="200" cy="130" r="20" stroke={C.action} strokeWidth="2" strokeDasharray="4 3" />

      {/* Pinch test near shoulder — two fingers trying to pinch strap */}
      <rect x="230" y="92" width="5" height="14" rx="2.5" fill={C.dadHead} />
      <rect x="239" y="92" width="5" height="14" rx="2.5" fill={C.dadHead} />
      {/* Small X = can't pinch = correct */}
      <path d="M255 92 L265 102" stroke={C.warn} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M265 92 L255 102" stroke={C.warn} strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  )
}
