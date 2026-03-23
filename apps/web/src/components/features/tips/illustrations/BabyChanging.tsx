import { C } from './colors'
import type { IllustrationProps } from '@tdc/shared/types/tips'

export function BabyChangingSection1({ className }: IllustrationProps) {
  return (
    <svg viewBox="0 0 400 220" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Changing surface */}
      <rect x="40" y="30" width="320" height="160" rx="12" fill={C.surface} />

      {/* Prep zone dashed outline */}
      <rect x="55" y="42" width="290" height="136" rx="8" stroke={C.action} strokeWidth="2" strokeDasharray="6 4" />

      {/* Diaper — center-left */}
      <rect x="75" y="70" width="50" height="28" rx="4" fill={C.object} stroke={C.objectStroke} strokeWidth="2" />
      {/* Diaper tabs */}
      <rect x="71" y="78" width="8" height="8" rx="1" fill={C.baby} />
      <rect x="121" y="78" width="8" height="8" rx="1" fill={C.baby} />

      {/* Wipes box — center */}
      <rect x="155" y="60" width="50" height="35" rx="4" fill={C.object} stroke={C.objectStroke} strokeWidth="2" />
      {/* Wipe flap poking out */}
      <rect x="170" y="53" width="20" height="10" rx="3" fill={C.object} stroke={C.objectStroke} strokeWidth="1.5" />

      {/* Cream tube — right of wipes */}
      <rect x="230" y="72" width="35" height="14" rx="7" fill={C.object} stroke={C.objectStroke} strokeWidth="2" />

      {/* Spare clothes — bottom left */}
      <rect x="80" y="120" width="45" height="25" rx="3" fill={C.object} stroke={C.objectStroke} strokeWidth="2" />
      {/* Fold line */}
      <line x1="85" y1="132" x2="120" y2="132" stroke={C.objectStroke} strokeWidth="1.5" strokeDasharray="4 3" />

      {/* Extra folded item — bottom right */}
      <rect x="240" y="118" width="40" height="28" rx="3" fill={C.object} stroke={C.objectStroke} strokeWidth="2" />
      <line x1="245" y1="132" x2="275" y2="132" stroke={C.objectStroke} strokeWidth="1.5" strokeDasharray="4 3" />
    </svg>
  )
}

export function BabyChangingSection2({ className }: IllustrationProps) {
  return (
    <svg viewBox="0 0 400 220" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Surface line */}
      <rect x="30" y="150" width="340" height="6" rx="3" fill={C.surface} />

      {/* Baby on surface — left side */}
      <ellipse cx="120" cy="140" rx="7" ry="9" fill={C.baby} />
      <circle cx="120" cy="125" r="10" fill={C.baby} />
      <circle cx="117" cy="124" r="1" fill="#92400e" />
      <circle cx="123" cy="124" r="1" fill="#92400e" />

      {/* Dad figure — right side */}
      <circle cx="260" cy="62" r="16" fill={C.dadHead} />
      <circle cx="256" cy="60" r="1.5" fill="#1e293b" />
      <circle cx="264" cy="60" r="1.5" fill="#1e293b" />
      <rect x="249" y="78" width="22" height="36" rx="6" fill={C.dad} />
      {/* Legs */}
      <rect x="251" y="114" width="8" height="30" rx="3" fill={C.dad} />
      <rect x="263" y="114" width="8" height="30" rx="3" fill={C.dad} />

      {/* Arms reaching down toward baby */}
      <line x1="249" y1="90" x2="190" y2="120" stroke={C.dad} strokeWidth="4" strokeLinecap="round" />
      <circle cx="190" cy="120" r="5" fill={C.dadHead} />
      <line x1="271" y1="90" x2="210" y2="130" stroke={C.dad} strokeWidth="4" strokeLinecap="round" />
      <circle cx="210" cy="130" r="5" fill={C.dadHead} />

      {/* Focus rings on hand positions */}
      <circle cx="190" cy="120" r="14" stroke={C.action} strokeWidth="2" strokeDasharray="4 3" />
      <circle cx="210" cy="130" r="14" stroke={C.action} strokeWidth="2" strokeDasharray="4 3" />

      {/* Curved lift arrow */}
      <path d="M160 135 Q150 105 165 85" stroke={C.action} strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M165 85 L160 93 L170 91 Z" fill={C.action} />

      {/* Changing pad destination — right */}
      <rect x="300" y="138" width="70" height="12" rx="4" fill={C.surface} />
    </svg>
  )
}

export function BabyChangingSection3({ className }: IllustrationProps) {
  return (
    <svg viewBox="0 0 400 220" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Changing pad */}
      <rect x="40" y="100" width="320" height="50" rx="8" fill={C.surface} />

      {/* Baby lying on pad — center */}
      <circle cx="200" cy="105" r="10" fill={C.baby} />
      <circle cx="197" cy="104" r="1" fill="#92400e" />
      <circle cx="203" cy="104" r="1" fill="#92400e" />
      <ellipse cx="200" cy="128" rx="7" ry="12" fill={C.baby} />
      {/* Baby limbs */}
      <line x1="193" y1="120" x2="185" y2="126" stroke={C.baby} strokeWidth="3" strokeLinecap="round" />
      <line x1="207" y1="120" x2="215" y2="126" stroke={C.baby} strokeWidth="3" strokeLinecap="round" />

      {/* 1. Onesie shape — left, with upward arrow */}
      <path d="M70 70 L80 55 L90 65 L90 90 L70 90 L70 70 Z M90 65 L100 55 L110 70 L110 90 L90 90" stroke={C.object} strokeWidth="2" fill={C.object} fillOpacity="0.3" />
      {/* Upward arrow */}
      <path d="M90 48 L90 30" stroke={C.action} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M90 30 L85 38 L95 38 Z" fill={C.action} />

      {/* 2. Clean diaper — right side, sliding under */}
      <rect x="260" y="115" width="50" height="22" rx="3" fill={C.object} stroke={C.objectStroke} strokeWidth="2" />
      {/* Horizontal arrow showing slide */}
      <path d="M255 126 L230 126" stroke={C.action} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M230 126 L238 121 L238 131 Z" fill={C.action} />

      {/* 3. Dirty diaper tabs — unfastened */}
      <rect x="155" y="138" width="30" height="12" rx="2" fill={C.object} stroke={C.objectStroke} strokeWidth="1.5" />
      {/* Tabs folded outward */}
      <rect x="148" y="140" width="8" height="6" rx="1" fill={C.baby} transform="rotate(-20 152 143)" />
      <rect x="184" y="140" width="8" height="6" rx="1" fill={C.baby} transform="rotate(20 188 143)" />
    </svg>
  )
}

export function BabyChangingSection4({ className }: IllustrationProps) {
  return (
    <svg viewBox="0 0 400 220" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Dividing line */}
      <line x1="200" y1="25" x2="200" y2="195" stroke={C.surfaceLight} strokeWidth="1.5" />

      {/* LEFT SIDE — Wiping front to back */}
      {/* Hand holding wipe */}
      <rect x="70" y="60" width="30" height="18" rx="8" fill={C.dadHead} />
      {/* Wipe in hand */}
      <rect x="78" y="80" width="16" height="20" rx="2" fill={C.object} stroke={C.objectStroke} strokeWidth="1.5" />
      {/* Bold downward arrow — front to back */}
      <path d="M86 110 L86 160" stroke={C.action} strokeWidth="3" strokeLinecap="round" />
      <path d="M86 160 L78 148 L94 148 Z" fill={C.action} />

      {/* CENTER — Air dry wavy lines */}
      <path d="M150 115 Q160 110 170 115 Q180 120 190 115" stroke={C.warn} strokeWidth="1.5" opacity="0.8" strokeLinecap="round" />
      <path d="M150 128 Q160 123 170 128 Q180 133 190 128" stroke={C.warn} strokeWidth="1.5" opacity="0.5" strokeLinecap="round" />
      <path d="M150 141 Q160 136 170 141 Q180 146 190 141" stroke={C.warn} strokeWidth="1.5" opacity="0.3" strokeLinecap="round" />

      {/* RIGHT SIDE — Cream application */}
      {/* Finger tip */}
      <rect x="280" y="55" width="12" height="30" rx="6" fill={C.dadHead} />
      {/* Cream dot on fingertip */}
      <circle cx="286" cy="88" r="4" fill={C.warn} />

      {/* Target area with radiating dashed lines */}
      <circle cx="286" cy="140" r="6" stroke={C.action} strokeWidth="2" strokeDasharray="4 3" />
      <line x1="286" y1="128" x2="286" y2="120" stroke={C.action} strokeWidth="1.5" strokeDasharray="3 3" />
      <line x1="298" y1="140" x2="306" y2="140" stroke={C.action} strokeWidth="1.5" strokeDasharray="3 3" />
      <line x1="274" y1="140" x2="266" y2="140" stroke={C.action} strokeWidth="1.5" strokeDasharray="3 3" />

      {/* Downward arrow from cream to target */}
      <path d="M286 95 L286 125" stroke={C.action} strokeWidth="2" strokeLinecap="round" strokeDasharray="4 3" />
    </svg>
  )
}

export function BabyChangingSection5({ className }: IllustrationProps) {
  return (
    <svg viewBox="0 0 400 220" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* LEFT SIDE — Diaper tabs being fastened */}
      {/* Baby shape simplified */}
      <ellipse cx="120" cy="120" rx="22" ry="30" fill={C.baby} fillOpacity="0.4" />
      {/* Diaper front */}
      <rect x="102" y="105" width="36" height="30" rx="4" fill={C.object} stroke={C.objectStroke} strokeWidth="2" />
      {/* Tab arrows pulling inward */}
      <path d="M90 115 L102 115" stroke={C.action} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M102 115 L96 111 L96 119 Z" fill={C.action} />
      <path d="M150 115 L138 115" stroke={C.action} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M138 115 L144 111 L144 119 Z" fill={C.action} />

      {/* Two-finger gap at waistband */}
      <rect x="112" y="100" width="4" height="12" rx="2" fill={C.dadHead} />
      <rect x="120" y="100" width="4" height="12" rx="2" fill={C.dadHead} />
      {/* Bracket showing gap */}
      <path d="M113 96 L118 93 L123 96" stroke={C.action} strokeWidth="1.5" fill="none" strokeLinecap="round" />

      {/* RIGHT SIDE — Dad holding dressed baby */}
      {/* Dad */}
      <circle cx="290" cy="55" r="16" fill={C.dadHead} />
      <circle cx="286" cy="53" r="1.5" fill="#1e293b" />
      <circle cx="294" cy="53" r="1.5" fill="#1e293b" />
      <rect x="279" y="71" width="22" height="36" rx="6" fill={C.dad} />
      <rect x="281" y="107" width="8" height="28" rx="3" fill={C.dad} />
      <rect x="293" y="107" width="8" height="28" rx="3" fill={C.dad} />

      {/* Baby held against chest */}
      <circle cx="270" cy="82" r="8" fill={C.baby} />
      <circle cx="268" cy="81" r="1" fill="#92400e" />
      <circle cx="272" cy="81" r="1" fill="#92400e" />
      <ellipse cx="270" cy="97" rx="6" ry="10" fill={C.baby} />

      {/* Dad arm supporting baby */}
      <line x1="279" y1="82" x2="265" y2="95" stroke={C.dad} strokeWidth="4" strokeLinecap="round" />
      <circle cx="265" cy="95" r="5" fill={C.dadHead} />

      {/* Success checkmark */}
      <circle cx="340" cy="85" r="18" fill={C.success} />
      <path d="M330 85 L337 93 L352 78" stroke="#18181b" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
