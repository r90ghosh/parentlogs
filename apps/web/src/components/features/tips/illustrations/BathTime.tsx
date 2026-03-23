import { C } from './colors'
import type { IllustrationProps } from '@tdc/shared/types/tips'

export function BathTimeSection1({ className }: IllustrationProps) {
  return (
    <svg viewBox="0 0 400 220" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Baby tub */}
      <path d="M80 80 L70 170 Q70 185 85 185 L255 185 Q270 185 270 170 L260 80 Z" fill={C.surface} stroke={C.object} strokeWidth="2" />

      {/* Water level — wavy line at 1/3 height */}
      <path d="M82 145 Q100 138 120 145 Q140 152 160 145 Q180 138 200 145 Q220 152 240 145 Q255 138 262 145" stroke={C.action} strokeWidth="1.5" fill="none" strokeLinecap="round" />

      {/* Thermometer next to tub */}
      <rect x="290" y="100" width="8" height="50" rx="4" fill={C.object} stroke={C.objectStroke} strokeWidth="1.5" />
      <circle cx="294" cy="155" r="7" fill={C.object} stroke={C.objectStroke} strokeWidth="1.5" />
      {/* Green fill = good temp */}
      <rect x="291" y="120" width="6" height="30" rx="3" fill={C.success} />
      <circle cx="294" cy="155" r="5" fill={C.success} />

      {/* Items beside tub — left side */}
      {/* Washcloth */}
      <rect x="20" y="140" width="22" height="20" rx="2" fill={C.object} stroke={C.objectStroke} strokeWidth="1.5" />
      {/* Soap */}
      <rect x="25" y="168" width="10" height="18" rx="3" fill={C.object} stroke={C.objectStroke} strokeWidth="1.5" />

      {/* Items — right side */}
      {/* Towel folded */}
      <rect x="320" y="138" width="40" height="24" rx="3" fill={C.object} stroke={C.objectStroke} strokeWidth="1.5" />
      <line x1="325" y1="150" x2="355" y2="150" stroke={C.objectStroke} strokeWidth="1.5" strokeDasharray="4 3" />

      {/* Baby being lowered feet-first */}
      <circle cx="170" cy="60" r="8" fill={C.baby} />
      <circle cx="168" cy="59" r="1" fill="#92400e" />
      <circle cx="172" cy="59" r="1" fill="#92400e" />
      <ellipse cx="170" cy="80" rx="6" ry="10" fill={C.baby} />
      {/* Baby feet pointing down */}
      <line x1="167" y1="90" x2="167" y2="100" stroke={C.baby} strokeWidth="3" strokeLinecap="round" />
      <line x1="173" y1="90" x2="173" y2="100" stroke={C.baby} strokeWidth="3" strokeLinecap="round" />

      {/* Teal arrow pointing down — feet first */}
      <path d="M170 105 L170 130" stroke={C.action} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M170 130 L165 122 L175 122 Z" fill={C.action} />
    </svg>
  )
}

export function BathTimeSection2({ className }: IllustrationProps) {
  return (
    <svg viewBox="0 0 400 220" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* LEFT SCENE — Washing sequence */}
      {/* Tub outline */}
      <path d="M30 70 L22 160 Q22 172 34 172 L166 172 Q178 172 178 160 L170 70 Z" fill={C.surface} stroke={C.object} strokeWidth="2" />

      {/* Water line */}
      <path d="M32 130 Q55 124 80 130 Q105 136 130 130 Q150 124 170 130" stroke={C.action} strokeWidth="1.5" fill="none" strokeLinecap="round" />

      {/* Baby in tub */}
      <circle cx="100" cy="100" r="8" fill={C.baby} />
      <circle cx="98" cy="99" r="1" fill="#92400e" />
      <circle cx="102" cy="99" r="1" fill="#92400e" />
      <ellipse cx="100" cy="118" rx="6" ry="10" fill={C.baby} />

      {/* Hand with washcloth near face */}
      <rect x="65" y="92" width="14" height="10" rx="3" fill={C.dadHead} />
      <rect x="55" y="95" width="12" height="8" rx="2" fill={C.object} />

      {/* Arrow sequence: face -> body -> bottom */}
      {/* Face area dot */}
      <circle cx="82" cy="98" r="3" fill={C.action} fillOpacity="0.6" />
      {/* Arrow down to body */}
      <path d="M82 104 L90 118" stroke={C.action} strokeWidth="2" strokeLinecap="round" />
      <path d="M90 118 L86 112 L94 114 Z" fill={C.action} />
      {/* Body area dot */}
      <circle cx="95" cy="122" r="3" fill={C.action} fillOpacity="0.4" />
      {/* Arrow down to bottom */}
      <path d="M100 126 L110 138" stroke={C.action} strokeWidth="2" strokeLinecap="round" />
      <path d="M110 138 L106 132 L114 134 Z" fill={C.action} />

      {/* Subtle vertical divider */}
      <line x1="200" y1="30" x2="200" y2="190" stroke={C.surfaceLight} strokeWidth="1.5" />

      {/* RIGHT SCENE — Baby wrapped in towel */}
      {/* Towel shape wrapping baby */}
      <path d="M260 60 L240 170 Q240 180 255 180 L325 180 Q340 180 340 170 L320 60 Z" fill={C.object} stroke={C.objectStroke} strokeWidth="2" />

      {/* Baby head peeking out */}
      <circle cx="290" cy="70" r="10" fill={C.baby} />
      <circle cx="287" cy="69" r="1" fill="#92400e" />
      <circle cx="293" cy="69" r="1" fill="#92400e" />

      {/* Towel fold lines */}
      <line x1="265" y1="100" x2="315" y2="100" stroke={C.objectStroke} strokeWidth="1.5" strokeDasharray="4 3" />

      {/* Success checkmark */}
      <circle cx="360" cy="80" r="16" fill={C.success} />
      <path d="M351 80 L357 87 L370 74" stroke="#18181b" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
