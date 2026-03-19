import { C } from './colors'
import type { IllustrationProps } from '@/types/tips'

export function SwaddlingSection1({ className }: IllustrationProps) {
  return (
    <svg viewBox="0 0 400 220" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Diamond blanket — rotated square */}
      <rect x="110" y="20" width="180" height="180" rx="4" fill={C.surface} fillOpacity="0.3" stroke={C.object} strokeWidth="2" transform="rotate(45 200 110)" />

      {/* Top corner folded down — triangle fold */}
      <path d="M200 25 L240 60 L160 60 Z" fill={C.surface} fillOpacity="0.5" stroke={C.object} strokeWidth="2" />

      {/* Fold line — dashed */}
      <line x1="160" y1="60" x2="240" y2="60" stroke={C.action} strokeWidth="2" strokeDasharray="4 3" />

      {/* Baby figure centered on blanket, shoulders below fold */}
      <circle cx="200" cy="75" r="10" fill={C.baby} />
      <circle cx="197" cy="74" r="1" fill="#92400e" />
      <circle cx="203" cy="74" r="1" fill="#92400e" />
      <ellipse cx="200" cy="100" rx="8" ry="14" fill={C.baby} />
      {/* Baby arms out */}
      <line x1="192" y1="92" x2="180" y2="96" stroke={C.baby} strokeWidth="3" strokeLinecap="round" />
      <line x1="208" y1="92" x2="220" y2="96" stroke={C.baby} strokeWidth="3" strokeLinecap="round" />

      {/* Arrow showing fold direction (top corner folding down) */}
      <path d="M200 35 Q205 42 200 52" stroke={C.action} strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M200 52 L195 45 L205 45 Z" fill={C.action} />
    </svg>
  )
}

export function SwaddlingSection2({ className }: IllustrationProps) {
  return (
    <svg viewBox="0 0 400 220" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Wrap step 1 — Left corner pulled across (leftmost) */}
      <path d="M60 50 L140 50 L140 160 L60 160 Z" fill={C.object} fillOpacity="0.3" stroke={C.object} strokeWidth="1.5" />
      {/* Arrow curving over */}
      <path d="M80 80 Q120 60 150 90" stroke={C.action} strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M150 90 L143 84 L146 94 Z" fill={C.action} />

      {/* Wrap step 2 — Bottom corner folded up (center) */}
      <path d="M140 100 L220 100 L220 180 L140 180 Z" fill={C.object} fillOpacity="0.5" stroke={C.object} strokeWidth="1.5" />
      {/* Arrow pointing up */}
      <path d="M180 170 L180 115" stroke={C.action} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M180 115 L175 123 L185 123 Z" fill={C.action} />

      {/* Wrap step 3 — Right corner wrapped around (rightmost) */}
      <path d="M220 50 L300 50 L300 160 L220 160 Z" fill={C.object} fillOpacity="0.7" stroke={C.object} strokeWidth="1.5" />
      {/* Arrow wrapping left */}
      <path d="M280 80 Q250 60 225 90" stroke={C.action} strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M225 90 L232 84 L229 94 Z" fill={C.action} />

      {/* Result: Swaddle "burrito" shape — right side */}
      <path d="M330 60 Q360 60 360 110 Q360 160 330 160 Q310 160 310 110 Q310 60 330 60 Z" fill={C.object} fillOpacity="0.5" stroke={C.object} strokeWidth="2" />
      {/* Baby head visible */}
      <circle cx="330" cy="68" r="10" fill={C.baby} />
      <circle cx="327" cy="67" r="1" fill="#92400e" />
      <circle cx="333" cy="67" r="1" fill="#92400e" />

      {/* Two-finger check near chest */}
      <rect x="324" y="88" width="4" height="10" rx="2" fill={C.dadHead} />
      <rect x="332" y="88" width="4" height="10" rx="2" fill={C.dadHead} />
    </svg>
  )
}
